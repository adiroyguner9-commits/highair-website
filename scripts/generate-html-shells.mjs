/**
 * generate-html-shells.mjs
 * Post-build script: generates static HTML files for every expedition, blog post,
 * and Israel trip page so Googlebot sees correct <title> / <meta> on the first
 * crawl - without needing SSR or Puppeteer.
 *
 * Run: node scripts/generate-html-shells.mjs
 * Triggered automatically by the "postbuild" npm script.
 *
 * How it works:
 *   1. Reads dist/index.html (the Vite SPA shell)
 *   2. For each route, replaces the generic title/description/og tags
 *      with route-specific values
 *   3. Writes to dist/{route}/index.html
 *   Vercel serves static files BEFORE the catch-all rewrite,
 *   so these files are served directly to crawlers & link-preview scrapers.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const DIST      = path.join(ROOT, 'dist');
const BASE_URL  = 'https://www.highair-expeditions.com';
const TODAY_ISO = new Date().toISOString().slice(0, 10);

/* Add n days to a YYYY-MM-DD string, returning YYYY-MM-DD (for Event endDate).
   Done entirely in UTC so a non-UTC build machine can't shift the date by a day. */
function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// ── Read the built SPA shell ─────────────────────────────────────────────────

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

// ── Helpers ──────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function truncate(str, max = 155) {
  if (!str) return '';
  str = str.trim().replace(/\s+/g, ' ');
  return str.length <= max ? str : str.slice(0, max - 1) + '…';
}

function injectMeta(html, { title, description, canonicalPath, image, ogImage, ogType, articleMeta }) {
  const url   = `${BASE_URL}${canonicalPath}`;
  const img   = image
    ? (image.startsWith('http') ? image : `${BASE_URL}${image}`)
    : `${BASE_URL}/og-image.jpg`;
  // Dedicated landscape share image (1200x630) for social/AI cards when provided
  const social = ogImage
    ? (ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`)
    : img;
  const t = esc(title);
  const d = esc(truncate(description));

  let out = html
    // <title>
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    // meta description
    .replace(/(<meta name="description"\s+content=")[^"]*(")/,     `$1${d}$2`)
    // og tags
    .replace(/(<meta property="og:title"\s+content=")[^"]*(")/,       `$1${t}$2`)
    .replace(/(<meta property="og:description"\s+content=")[^"]*(")/,  `$1${d}$2`)
    .replace(/(<meta property="og:url"\s+content=")[^"]*(")/,          `$1${esc(url)}$2`)
    .replace(/(<meta property="og:image"\s+content=")[^"]*(")/,        `$1${esc(social)}$2`)
    // twitter tags
    .replace(/(<meta name="twitter:title"\s+content=")[^"]*(")/,       `$1${t}$2`)
    .replace(/(<meta name="twitter:description"\s+content=")[^"]*(")/,  `$1${d}$2`)
    .replace(/(<meta name="twitter:image"\s+content=")[^"]*(")/,        `$1${esc(social)}$2`)
    // canonical
    .replace(/(<link rel="canonical"\s+href=")[^"]*(")/,               `$1${esc(url)}$2`);

  // og:type override (blog posts = "article" for news/social/AI)
  if (ogType) {
    out = out.replace(/(<meta property="og:type"\s+content=")[^"]*(")/, `$1${esc(ogType)}$2`);
  }

  // Correct the OG image dimensions to landscape when a dedicated share image is used
  if (ogImage) {
    out = out
      .replace(/(<meta property="og:image:width"\s+content=")[^"]*(")/,  `$11200$2`)
      .replace(/(<meta property="og:image:height"\s+content=")[^"]*(")/, `$1630$2`);
  }

  // article: meta tags — injected before </head> so scrapers that skip JS still see them
  if (articleMeta) {
    const tags = [];
    if (articleMeta.publishedTime) tags.push(`<meta property="article:published_time" content="${esc(articleMeta.publishedTime)}" />`);
    if (articleMeta.modifiedTime)  tags.push(`<meta property="article:modified_time" content="${esc(articleMeta.modifiedTime)}" />`);
    tags.push(`<meta property="article:author" content="HighAir Expeditions" />`);
    if (articleMeta.section)       tags.push(`<meta property="article:section" content="${esc(articleMeta.section)}" />`);
    (articleMeta.tags || []).forEach(tag => tags.push(`<meta property="article:tag" content="${esc(tag)}" />`));
    out = out.replace('</head>', `  ${tags.join('\n  ')}\n</head>`);
  }

  return out;
}

function buildJsonLd(meta) {
  if (!meta.jsonLd) return '';
  return `\n  <script type="application/ld+json">${JSON.stringify(meta.jsonLd, null, 0)}</script>`;
}

/* Extract Q&A pairs that follow a "שאלות נפוצות" / FAQ section, for FAQPage schema.
   Mirrors the runtime logic in BlogPost.jsx so the static shell matches. */
function faqFromContent(content) {
  if (!Array.isArray(content)) return [];
  const kw = ['שאלות נפוצות', 'faq', 'frequently asked'];
  const idx = content.findIndex(b => b.type === 'section' && kw.some(k => (b.value || '').toLowerCase().includes(k)));
  if (idx === -1) return [];
  const pairs = [];
  let q = null;
  for (const b of content.slice(idx + 1)) {
    if (b.type === 'section') break;
    if (b.type === 'heading') q = b.value;
    else if (b.type === 'text' && q) {
      pairs.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: b.value } });
      q = null;
    }
  }
  return pairs;
}

function writeShell(routePath, meta) {
  const dir = path.join(DIST, routePath);
  fs.mkdirSync(dir, { recursive: true });
  let html = injectMeta(template, meta);
  // Inject JSON-LD before </head>
  if (meta.jsonLd) {
    html = html.replace('</head>', `${buildJsonLd(meta)}\n</head>`);
  }
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

// ── Expedition pages ─────────────────────────────────────────────────────────

const { EXPS } = await import(path.join(ROOT, 'src/data/mockData.js'));
let expCount = 0;
for (const exp of EXPS) {
  if (!exp.slug || exp.teaser) continue;   // teaser cards have no detail page

  const expUrl   = `${BASE_URL}/expedition/${exp.slug}`;
  const expImage = exp.img ? (exp.img.startsWith('http') ? exp.img : `${BASE_URL}${exp.img}`) : `${BASE_URL}/og-image.jpg`;

  // aggregateRating must reflect REAL reviews shown on the page (Google policy) -
  // compute honestly from exp.reviews, emit nothing when there are none.
  const expReviews = exp.reviews || [];
  const expAvgRating = expReviews.length
    ? Number((expReviews.reduce((s, r) => s + (r.rating || 0), 0) / expReviews.length).toFixed(1))
    : null;

  // Build rich JSON-LD for GEO / AI discoverability
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':       ['TouristTrip', 'Product'],
        '@id':         expUrl,
        name:          exp.nameEn  || exp.name || exp.nameHe,
        description:   exp.descEn  || exp.seoDescription || '',
        url:           expUrl,
        image:         expImage,
        duration:      exp.days    ? `${exp.days}` : undefined,
        touristType:   exp.country || undefined,
        itinerary:     exp.country ? { '@type': 'Place', name: exp.country } : undefined,
        provider: {
          '@type':     'TravelAgency',
          name:        'HighAir Expeditions',
          url:         BASE_URL,
          telephone:   '+972555636975',
          image:       `${BASE_URL}/Logo.png`,
          address: { '@type': 'PostalAddress', addressLocality: 'Tel Aviv', addressCountry: 'IL' },
        },
        ...(exp.price > 0 ? {
          offers: {
            '@type':        'Offer',
            price:          exp.price,
            priceCurrency:  'USD',
            availability:   'https://schema.org/InStock',
            url:            expUrl,
          },
        } : {}),
        ...(expAvgRating ? {
          aggregateRating: {
            '@type':      'AggregateRating',
            ratingValue:  String(expAvgRating),
            reviewCount:  String(expReviews.length),
            bestRating:   '5',
            worstRating:  '1',
          },
          review: expReviews.slice(0, 10).map(r => ({
            '@type':      'Review',
            author:       { '@type': 'Person', name: r.name },
            reviewRating: { '@type': 'Rating', ratingValue: r.rating || 5, bestRating: '5', worstRating: '1' },
            reviewBody:   r.text,
          })),
        } : {}),
        ...(exp.highlights || exp.highlightsEn ? {
          amenityFeature: (exp.highlightsEn || exp.highlights || []).map(h => ({
            '@type': 'LocationFeatureSpecification',
            name: h,
            value: true,
          })),
        } : {}),
      },
      {
        '@type':           'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',        item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Expeditions', item: `${BASE_URL}/expeditions` },
          { '@type': 'ListItem', position: 3, name: exp.nameEn || exp.name || exp.nameHe, item: expUrl },
        ],
      },
    ],
  };

  writeShell(`expedition/${exp.slug}`, {
    title:         exp.seoTitle        || `${exp.nameHe} | HighAir Expeditions`,
    description:   exp.seoDescription  || exp.descEn || '',
    canonicalPath: `/expedition/${exp.slug}`,
    image:         exp.ogImage         || exp.img || '',
    jsonLd,
  });
  expCount++;
}

// ── Blog posts ───────────────────────────────────────────────────────────────

const { POSTS } = await import(path.join(ROOT, 'src/data/blogData.js'));
let blogCount = 0;
for (const post of POSTS) {
  if (!post.slug) continue;
  const postUrl = `${BASE_URL}/blog/${post.slug}`;
  const postImg = post.img ? (post.img.startsWith('http') ? post.img : `${BASE_URL}${post.img}`) : `${BASE_URL}/og-image.jpg`;
  const isNews  = (post.category || '') === 'חדשות' || (post.categoryEn || '') === 'News';

  const articleNode = {
    '@type':      isNews ? 'NewsArticle' : 'BlogPosting',
    headline:     post.title || post.titleEn || '',
    description:  post.excerpt || post.excerptEn || '',
    image:        postImg,
    datePublished: post.dateIso || '',
    dateModified:  post.dateModified || post.dateIso || '',
    author:       { '@type': 'Organization', name: 'HighAir Expeditions', url: BASE_URL },
    publisher:    { '@type': 'Organization', name: 'HighAir Expeditions', logo: { '@type': 'ImageObject', url: `${BASE_URL}/Logo.png` } },
    mainEntityOfPage: postUrl,
    inLanguage:   'he',
    articleSection: post.category || undefined,
  };

  const graph = [articleNode, {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title || post.titleEn || '', item: postUrl },
    ],
  }];

  // FAQPage schema (extracted from the post's FAQ section) — big for featured snippets + AI answers
  const faq = faqFromContent(post.content || post.contentEn);
  if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq });

  const jsonLd = { '@context': 'https://schema.org', '@graph': graph };

  const postTitle = post.title || post.titleEn || '';
  writeShell(`blog/${post.slug}`, {
    title:         postTitle ? `HighAir Expeditions | ${postTitle}` : 'HighAir Expeditions | בלוג',
    description:   post.excerpt  || post.excerptEn  || '',
    canonicalPath: `/blog/${post.slug}`,
    image:         post.img      || '',
    ogImage:       post.ogImg    || '',
    ogType:        'article',
    articleMeta: {
      publishedTime: post.dateIso ? `${post.dateIso}T12:00:00+03:00` : undefined,
      modifiedTime:  (post.dateModified || post.dateIso) ? `${post.dateModified || post.dateIso}T12:00:00+03:00` : undefined,
      section:       post.category || undefined,
      tags:          post.tags || [],
    },
    jsonLd,
  });
  blogCount++;
}

// ── Israel trip pages ────────────────────────────────────────────────────────

const { ISRAEL_TRIPS } = await import(path.join(ROOT, 'src/data/israelData.js'));
let israelCount = 0;
for (const trip of ISRAEL_TRIPS) {
  if (!trip.slug || !trip.live) continue;

  const tripUrl   = `${BASE_URL}/israel/${trip.slug}`;
  const tripImg   = trip.img ? (trip.img.startsWith('http') ? trip.img : `${BASE_URL}${trip.img}`) : `${BASE_URL}/og-image.jpg`;
  const tripPrice = parseInt(String(trip.priceHe || trip.price || '').replace(/[^\d]/g, ''), 10) || 0;
  const tripDays  = /יומיים/.test(String(trip.days || '')) ? 2 : 1;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':      ['TouristTrip', 'Product'],
        '@id':        tripUrl,
        name:         `${trip.name} · ישראל`,
        description:  trip.seoDescription || trip.excerpt || '',
        url:          tripUrl,
        image:        tripImg,
        duration:     `P${tripDays}D`,
        touristType:  'ישראל',
        itinerary:    { '@type': 'Place', name: 'ישראל' },
        provider: {
          '@type':    'TravelAgency',
          name:       'HighAir Expeditions',
          url:        BASE_URL,
          telephone:  '+972555636975',
          image:      `${BASE_URL}/Logo.png`,
          address: { '@type': 'PostalAddress', addressLocality: 'Tel Aviv', addressCountry: 'IL' },
        },
        ...(tripPrice > 0 ? {
          offers: { '@type': 'Offer', price: tripPrice, priceCurrency: 'ILS', availability: 'https://schema.org/InStock', url: tripUrl },
        } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'בית',        item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'טרקים בארץ', item: `${BASE_URL}/israel` },
          { '@type': 'ListItem', position: 3, name: trip.name,  item: tripUrl },
        ],
      },
      // The scheduled departure as an Event (only when it is still upcoming).
      ...(trip.departure && trip.departure >= TODAY_ISO ? [{
        '@type':               'Event',
        name:                  trip.name,
        description:           trip.seoDescription || trip.excerpt || `יציאה מתוזמנת לטרק ${trip.name} עם HighAir Expeditions.`,
        startDate:             trip.departure,
        endDate:               addDays(trip.departure, tripDays - 1),
        eventStatus:           'https://schema.org/EventScheduled',
        eventAttendanceMode:   'https://schema.org/OfflineEventAttendanceMode',
        image:                 tripImg,
        url:                   tripUrl,
        location:              { '@type': 'Place', name: 'ישראל', address: { '@type': 'PostalAddress', addressCountry: 'IL' } },
        organizer:             { '@type': 'TravelAgency', name: 'HighAir Expeditions', url: BASE_URL },
        performer:             { '@type': 'Organization', name: 'HighAir Expeditions' },
        ...(tripPrice > 0 ? { offers: { '@type': 'Offer', price: tripPrice, priceCurrency: 'ILS', availability: 'https://schema.org/InStock', url: tripUrl, validFrom: TODAY_ISO } } : {}),
      }] : []),
    ],
  };

  writeShell(`israel/${trip.slug}`, {
    title:         trip.seoTitle       || trip.name  || '',
    description:   trip.seoDescription || trip.excerpt || '',
    canonicalPath: `/israel/${trip.slug}`,
    image:         trip.img            || '',
    jsonLd,
  });
  israelCount++;
}

// ── Shared entity nodes (Organization + WebSite) for the homepage / about ────

const ORG_NODE = {
  '@type':    ['Organization', 'TravelAgency'],
  '@id':      `${BASE_URL}/#organization`,
  name:       'HighAir Expeditions',
  url:        BASE_URL,
  logo:       { '@type': 'ImageObject', url: `${BASE_URL}/Logo.png`, width: 2000, height: 2000 },
  image:      `${BASE_URL}/og-image.jpg`,
  description: 'HighAir Expeditions מארגנת טרקים ומשלחות טיפוס הרים בארץ ובעולם, עם תרומה למאבק במחלת הסרטן בכל מסע.',
  telephone:  '+972-55-563-6975',
  priceRange: '$$$',
  address:    { '@type': 'PostalAddress', addressLocality: 'Tel Aviv', addressCountry: 'IL' },
  areaServed: 'IL',
  // Real Google Business Profile rating (5.0, 263 reviews as of Sep 2026).
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '263', bestRating: '5', worstRating: '1' },
  contactPoint: { '@type': 'ContactPoint', telephone: '+972-55-563-6975', contactType: 'customer service', availableLanguage: ['Hebrew', 'English'] },
  sameAs: [
    'https://www.facebook.com/highair.expeditions',
    'https://www.instagram.com/highair_expeditions/',
    'https://www.youtube.com/@HighAirExpeditions',
    'https://www.tiktok.com/@highair_expeditions',
  ],
};

const WEBSITE_NODE = {
  '@type':     'WebSite',
  '@id':       `${BASE_URL}/#website`,
  name:        'HighAir Expeditions',
  url:         BASE_URL,
  inLanguage:  'he',
  publisher:   { '@id': `${BASE_URL}/#organization` },
};

// Listing-page ItemList graphs (derived from live data)
const liveExps  = EXPS.filter(e => e.live !== false && e.slug && !e.teaser);
const trekExps  = liveExps.filter(e => /trek/i.test(e.type  || ''));
const climbExps = liveExps.filter(e => /climb/i.test(e.type || ''));
const liveIsrael = ISRAEL_TRIPS.filter(t => t.live && t.slug);

function listingGraph({ name, path, crumb, items }) {
  const url = `${BASE_URL}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': url, name, url, isPartOf: { '@id': `${BASE_URL}/#website` }, about: { '@id': `${BASE_URL}/#organization` } },
      { '@type': 'ItemList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: it.url })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'בית', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: crumb, item: url },
      ] },
    ],
  };
}

const ISRAEL_LISTING_JSONLD = listingGraph({ name: 'הטרקים שלנו בארץ', path: '/israel', crumb: 'טרקים בארץ',
  items: liveIsrael.map(t => ({ name: t.name, url: `${BASE_URL}/israel/${t.slug}` })) });
const TREKS_JSONLD = listingGraph({ name: 'טרקים בעולם', path: '/treks', crumb: 'טרקים בעולם',
  items: trekExps.map(e => ({ name: e.nameHe, url: `${BASE_URL}/expedition/${e.slug}` })) });
const CLIMBS_JSONLD = listingGraph({ name: 'משלחות טיפוס הרים', path: '/climbs', crumb: 'טיפוסי הרים בעולם',
  items: climbExps.map(e => ({ name: e.nameHe, url: `${BASE_URL}/expedition/${e.slug}` })) });
const ABOUT_JSONLD = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'AboutPage', '@id': `${BASE_URL}/about`, name: 'הסיפור של HighAir Expeditions', url: `${BASE_URL}/about`, isPartOf: { '@id': `${BASE_URL}/#website` }, about: { '@id': `${BASE_URL}/#organization` } },
  ORG_NODE,
] };

// ── Static pages ─────────────────────────────────────────────────────────────

const staticPages = [
  {
    path:  'about',
    title: 'HighAir Expeditions | הסיפור שלנו',
    desc:  'HighAir Expeditions הוקמה מתוך אובדן, עם החלטה אחת: לקום ולהגיע לכל פסגה. הכירו את האנשים שמאחורי כל טרק - ותורמים מדי חודש לילדים חולי סרטן.',
    jsonLd: ABOUT_JSONLD,
  },
  {
    path:  'blog',
    title: 'HighAir Expeditions | בלוג טיפוס הרים וטרקים',
    desc:  'מאמרים, טיפים וסיפורים מעולם הטרקים וטיפוס ההרים - מבית HighAir Expeditions. קילימנג׳רו, אוורסט, אנאפורנה ועוד.',
  },
  {
    path:  'contact',
    title: 'HighAir Expeditions | צרו קשר',
    desc:  'צרו קשר עם צוות HighAir Expeditions לפרטים על משלחות, תאריכים, מחירים ורישום. אנחנו כאן לענות על כל שאלה.',
  },
  {
    path:  'shop',
    title: 'HighAir Expeditions | חנות ציוד טרקים',
    desc:  'ציוד טיולים ומשלחות עם הלוגו של HighAir Expeditions - תיקים, ציוד הרים ועוד. כל רכישה תורמת לחולי סרטן.',
  },
  {
    path:  'annual-plan',
    title: 'HighAir Expeditions | תכנית שנתית',
    desc:  'כל תאריכי המשלחות של HighAir Expeditions - קילימנג׳רו, אוורסט, אנאפורנה, אלברוס, אקונקגואה ועוד.',
  },
  {
    path:  'israel',
    title: 'HighAir Expeditions | הטרקים שלנו בארץ',
    desc:  'כל הטרקים של HighAir בארץ - מסלולים במדבר יהודה, ים המלח והנגב. יום אחד, מדריך מוסמך וארוחת צהריים כלולה, עם תרומה למאבק במחלת הסרטן. בחרו את הטרק הקרוב שלכם.',
    jsonLd: ISRAEL_LISTING_JSONLD,
  },
  {
    path:  'treks',
    title: 'HighAir Expeditions | טרקים בעולם',
    desc:  'כל הטרקים של HighAir בעולם - מהבלקן ואתיופיה ועד ההימלאיה בנפאל. מדריכים מקצועיים, קבוצות קטנות ותרומה למאבק במחלת הסרטן. בחרו את הטרק הבא שלכם.',
    jsonLd: TREKS_JSONLD,
  },
  {
    path:  'climbs',
    title: 'HighAir Expeditions | משלחות טיפוס הרים',
    desc:  'כל משלחות טיפוס ההרים של HighAir - קילימנג׳רו, אלברוס, אקונקגואה, אמה דבלאם ועוד. מדריכים מוסמכים, ליווי מלא ותרומה למאבק במחלת הסרטן.',
    jsonLd: CLIMBS_JSONLD,
  },
];

for (const page of staticPages) {
  writeShell(page.path, {
    title:         page.title,
    description:   page.desc,
    canonicalPath: `/${page.path}`,
    image:         '',
    jsonLd:        page.jsonLd,
  });
}

// ── Homepage: inject Organization + WebSite JSON-LD into the root index.html ──
// The homepage (/) serves dist/index.html directly, so non-JS crawlers and AI
// engines get the entity graph without executing React.
{
  const homeGraph = { '@context': 'https://schema.org', '@graph': [ORG_NODE, WEBSITE_NODE] };
  const homePath  = path.join(DIST, 'index.html');
  let homeHtml    = fs.readFileSync(homePath, 'utf8');
  if (!homeHtml.includes('id="home-jsonld"')) {
    const tag = `\n  <script id="home-jsonld" type="application/ld+json">${JSON.stringify(homeGraph)}</script>`;
    homeHtml = homeHtml.replace('</head>', `${tag}\n</head>`);
    fs.writeFileSync(homePath, homeHtml, 'utf8');
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('HTML shells generated!');
console.log(`  Expeditions : ${expCount}`);
console.log(`  Blog posts  : ${blogCount}`);
console.log(`  Israel      : ${israelCount}`);
console.log(`  Static      : ${staticPages.length}`);
console.log(`  Total       : ${expCount + blogCount + israelCount + staticPages.length}`);
