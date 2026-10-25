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
import { wrapText, expeditionText, blogText, listingText, blogListText, aboutText, homeText } from './lib/text-layer.mjs';

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

/* The template is the homepage, and its <head> preloads the HOME hero poster at
   high priority. Every shell used to inherit it, so a phone opening Kilimanjaro
   or a blog post first fetched 131KB of an image that page never shows
   (measured 24 Oct 2026), ahead of its own. Each shell swaps it for the image
   its own hero paints first, or for nothing. */
const HOME_HERO_PRELOAD = /<link rel="preload" href="\/videos\/hero-home-poster\.jpg"[^>]*>/;
if (!HOME_HERO_PRELOAD.test(template)) {
  throw new Error('generate-html-shells: the home hero preload in index.html changed; update HOME_HERO_PRELOAD');
}
const localImg = src => (src && !/^https?:/.test(src) ? src : '');
const heroPreload = src => (src ? `<link rel="preload" href="${esc(src)}" as="image" fetchpriority="high">` : '');
/* What ExpeditionDetail paints first in its hero: YouTube has no image of ours,
   a hero video shows its poster, otherwise the hero image. */
const expHeroImage = exp => (exp.videoUrl ? ''
  : exp.heroVideo ? exp.heroVideo.replace('.mp4', '-poster.jpg')
  : localImg(exp.heroImg || exp.img));

/* ── Pre-hero: the first screen before any JavaScript ────────────────────────
   The site renders in the browser: until ~1.2MB of code has downloaded and run,
   the page is blank, and on PageSpeed's mobile profile that put the main image
   at 12-15s (24 Oct 2026). Each shell now carries a static copy of its own
   header bar and hero image, with the same dark overlay, sized like the live
   layout (measured at 360, 412, 800 and 1350px wide), so the browser paints it
   straight from the HTML. React replaces it on its first render; the first
   Suspense fallback repeats it (src/main.jsx, BootFallback) so it never blinks
   out while the page's own chunk loads. Text and buttons stay React's.
   Sizes mirror: HomeV2 + HeroSection (home), ExpeditionDetail (trip),
   WorldExpeditionsPage (list), BlogPost (blog); the header is 80px everywhere. */
const PRE_HERO_CSS = [
  '.ha-nopre #ha-pre{display:none}',
  '#ha-pre .b{position:fixed;top:0;left:0;right:0;height:80px;background:#fff;z-index:10}',
  '#ha-pre .h{width:100%}',
  /* Home's gap is a SPACER, not a margin: HomeV2 pads <main>, so #root starts at 0;
     a margin would collapse through #root, start it at 80px and make the whole
     page jump on React's first render (CLS 0.008 -> 0.105, measured 24 Oct 2026).
     The blog keeps its margin because BlogPost's own margin collapses the same way. */
  '#ha-pre .sp{height:124px}',
  '#ha-pre .home{height:90vh}',
  '#ha-pre .trip{height:100dvh;min-height:600px}',
  '#ha-pre .list{height:440px}',
  '#ha-pre .blog{margin-top:80px;height:440px}',
  '@media (max-width:767.98px){#ha-pre .sp{height:80px}#ha-pre .trip{height:65dvh;min-height:480px}#ha-pre .list{height:340px}#ha-pre .blog{height:300px}}',
].join('');
const PRE_HERO_BG = {
  home: img => `linear-gradient(rgba(10,8,24,.72),rgba(10,8,24,.72)),url(${img}) center/cover no-repeat`,
  trip: img => `linear-gradient(to bottom,rgba(0,0,0,.35),rgba(0,0,0,.65)),url(${img}) center/cover no-repeat,#0A0818`,
  list: img => `linear-gradient(to bottom,rgba(10,8,24,.55),rgba(10,8,24,.78)),url(${img}) center/cover no-repeat`,
  blog: (img, pos) => `linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)),url(${img}) ${pos || 'center'}/cover no-repeat`,
};
function preHeroHtml(kind, img, pos) {
  if (!img || !PRE_HERO_BG[kind]) return '';
  return `<div id="ha-pre" aria-hidden="true"><style>${PRE_HERO_CSS}</style>`
    + `<div class="b"></div>${kind === 'home' ? '<div class="sp"></div>' : ''}`
    + `<div class="h ${kind}" style="background:${esc(PRE_HERO_BG[kind](img, pos))}"></div></div>`;
}
const EMPTY_ROOT = '<div id="root"></div>';
if (!template.includes(EMPTY_ROOT)) throw new Error('generate-html-shells: <div id="root"></div> not found in index.html');

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

function injectMeta(html, { title, description, canonicalPath, image, ogImage, ogType, articleMeta, noIndex }) {
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

  /* A hidden page (a trip with live:false) stays reachable by its link but out of
     search: the same rule the React page applies once it loads. */
  if (noIndex) {
    out = out.replace(/(<meta name="robots"\s+content=")[^"]*(")/, '$1noindex, follow$2');
  }

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
    tags.push(`<meta property="article:author" content="${esc(articleMeta.author || 'HighAir Expeditions')}" />`);
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
  let html = injectMeta(template, meta).replace(HOME_HERO_PRELOAD, heroPreload(meta.heroImage));
  /* #root starts with the pre-hero (what the eye sees first) and the page's text
     (what a reader without JavaScript gets, see scripts/lib/text-layer.mjs). */
  const rootInner = (meta.preHero || '') + (meta.text || '');
  if (rootInner) html = html.replace(EMPTY_ROOT, `<div id="root">${rootInner}</div>`);
  // Inject JSON-LD before </head>
  if (meta.jsonLd) {
    html = html.replace('</head>', `${buildJsonLd(meta)}\n</head>`);
  }
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

// ── Expedition pages ─────────────────────────────────────────────────────────

const { EXPS } = await import(path.join(ROOT, 'src/data/mockData.js'));
/* The FAQ the trip page shows: its own list, else the default (ExpeditionDetail.jsx). */
const { FAQ_BY_SLUG, makeDefaultFaq, notesWithExperience } = await import(path.join(ROOT, 'src/data/faqData.js'));
const faqFor = exp => (FAQ_BY_SLUG[exp.slug]?.he?.length ? FAQ_BY_SLUG[exp.slug].he : makeDefaultFaq(exp.groupCapacity || 15, exp.experienceHe));
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
    heroImage:     expHeroImage(exp),
    preHero:       preHeroHtml('trip', expHeroImage(exp)),
    text:          wrapText(expeditionText({ ...exp, importantToNote: notesWithExperience(exp.importantToNote, exp.experienceHe) }, faqFor(exp))),
    noIndex:       exp.live === false,
    jsonLd,
  });
  expCount++;
}

// ── Blog posts ───────────────────────────────────────────────────────────────

const { POSTS, isNewsPost } = await import(path.join(ROOT, 'src/data/blogData.js'));
const { authorOf } = await import(path.join(ROOT, 'src/data/authors.js'));
/* A guide signed by a person names them as a Person (their bio is on the About
   page); news and unsigned posts stay the company's. */
const personNode = a => ({
  '@type': 'Person', '@id': `${BASE_URL}/about#${a.id}`, name: a.nameHe, alternateName: a.nameEn,
  url: `${BASE_URL}/about`, image: `${BASE_URL}${a.photo}`, jobTitle: a.roleHe,
  worksFor: { '@id': `${BASE_URL}/#organization` },
});
let blogCount = 0;
for (const post of POSTS) {
  if (!post.slug) continue;
  const postUrl = `${BASE_URL}/blog/${post.slug}`;
  const postImg = post.img ? (post.img.startsWith('http') ? post.img : `${BASE_URL}${post.img}`) : `${BASE_URL}/og-image.jpg`;
  const isNews  = isNewsPost(post);
  const author  = authorOf(post);

  const articleNode = {
    '@type':      isNews ? 'NewsArticle' : 'BlogPosting',
    headline:     post.title || post.titleEn || '',
    description:  post.excerpt || post.excerptEn || '',
    image:        postImg,
    datePublished: post.dateIso || '',
    dateModified:  post.dateModified || post.dateIso || '',
    author:       author ? personNode(author) : { '@type': 'Organization', name: 'HighAir Expeditions', url: BASE_URL },
    publisher:    { '@type': 'Organization', name: 'HighAir Expeditions', logo: { '@type': 'ImageObject', url: `${BASE_URL}/Logo.png` } },
    mainEntityOfPage: postUrl,
    inLanguage:   'he',
    articleSection: post.category || undefined,
  };

  const graph = [articleNode, {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'מגזין', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title || post.titleEn || '', item: postUrl },
    ],
  }];

  // FAQPage schema (extracted from the post's FAQ section) — big for featured snippets + AI answers
  const faq = faqFromContent(post.content || post.contentEn);
  if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq });

  const jsonLd = { '@context': 'https://schema.org', '@graph': graph };

  const postTitle = post.title || post.titleEn || '';
  writeShell(`blog/${post.slug}`, {
    title:         postTitle ? `HighAir Expeditions | ${postTitle}` : 'HighAir Expeditions | מגזין',
    description:   post.excerpt  || post.excerptEn  || '',
    canonicalPath: `/blog/${post.slug}`,
    image:         post.img      || '',
    ogImage:       post.ogImg    || '',
    heroImage:     localImg(post.img),   // BlogPost.jsx paints post.img as the hero
    preHero:       preHeroHtml('blog', localImg(post.img), post.imgPosition),
    text:          wrapText(blogText(post)),
    ogType:        'article',
    articleMeta: {
      publishedTime: post.dateIso ? `${post.dateIso}T12:00:00+03:00` : undefined,
      modifiedTime:  (post.dateModified || post.dateIso) ? `${post.dateModified || post.dateIso}T12:00:00+03:00` : undefined,
      section:       post.category || undefined,
      author:        author?.nameHe,
      tags:          post.tags || [],
    },
    jsonLd,
  });
  blogCount++;
}

// ── Israel trip pages ────────────────────────────────────────────────────────

const { ISRAEL_TRIPS } = await import(path.join(ROOT, 'src/data/israelData.js'));
const { ISRAEL_TREKS_LIVE } = await import(path.join(ROOT, 'src/data/israelFlag.js'));
let israelCount = 0;
/* Israel treks hidden by the owner (23 Oct 2026): emit no /israel/:slug shells when off */
for (const trip of (ISRAEL_TREKS_LIVE ? ISRAEL_TRIPS : [])) {
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
  // Real Google Business Profile rating (5.0, 296 reviews as of Oct 2026).
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '296', bestRating: '5', worstRating: '1' },
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
const CLIMBS_JSONLD = listingGraph({ name: 'משלחות טיפוס הרים', path: '/climbs', crumb: 'טיפוס הרים בעולם',
  items: climbExps.map(e => ({ name: e.nameHe, url: `${BASE_URL}/expedition/${e.slug}` })) });
const ABOUT_JSONLD = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'AboutPage', '@id': `${BASE_URL}/about`, name: 'הסיפור של HighAir Expeditions', url: `${BASE_URL}/about`, isPartOf: { '@id': `${BASE_URL}/#website` }, about: { '@id': `${BASE_URL}/#organization` } },
  ORG_NODE,
] };

// ── Static pages ─────────────────────────────────────────────────────────────

const ABOUT = await import(path.join(ROOT, 'src/data/aboutData.js'));

const staticPages = [
  {
    path:  'about',
    /* The story and team come from src/data/aboutData.js, the same lists the
       page renders; the headings below are AboutUs.jsx's (a test checks them). */
    textHtml: () => aboutText({
      h1:          'הסיפור שלנו',
      sub:         'מי אנחנו ולמה אנחנו עושים את זה?',
      caption:     'חן שקד בפסגת הר מנסלו 8163 מ׳ - ההר השמיני בגובהו בעולם',
      story:       ABOUT.STORY_HE,
      sign:        ABOUT.STORY_SIGN_HE,
      teamTitle:   'הכירו את הצוות שלנו',
      team:        ABOUT.TEAM_HE,
      givingTitle: 'כי כל ילד ראוי לחגוג',
      givingText:  'ילד שנלחם בסרטן לא צריך לוותר על יום ההולדת שלו. כל חודש אנחנו מקבלים משאלות ישירות מהילדים ומוודאים שכל אחד מקבל בדיוק את מה שחלם עליו.',
    }),
    title: 'HighAir Expeditions | הסיפור שלנו',
    desc:  'HighAir Expeditions הוקמה מתוך אובדן, עם החלטה אחת: לקום ולהגיע לכל פסגה. הכירו את האנשים שמאחורי כל טרק - ותורמים מדי חודש לילדים חולי סרטן.',
    jsonLd: ABOUT_JSONLD,
  },
  {
    path:  'blog',
    textH1:  'המגזין של HighAir',                    // i18n.js blog.pageTitle
    textSub: 'מדריכים מלאים לכל היעדים שלנו, וחדשות מעולם טיפוס ההרים והטרקים',   // blog.subtitle
    textPosts: () => POSTS,
    title: 'HighAir Expeditions | מגזין טיפוס הרים וטרקים',
    desc:  'מדריכים מלאים לכל היעדים שלנו, וחדשות מעולם טיפוס ההרים והטרקים, מבית HighAir Expeditions. קילימנג׳רו, אוורסט, אנאפורנה ועוד.',
  },
  {
    path:  'contact',
    textH1:  'דברו איתנו',                           // ContactPage.jsx T.heroTitle
    textSub: 'בין אם אתם מתכננים את הפסגה הראשונה שלכם ובין אם העשירית, אנחנו כאן לכל שאלה, גדולה כקטנה.',
    title: 'HighAir Expeditions | צרו קשר',
    desc:  'צרו קשר עם צוות HighAir Expeditions לפרטים על משלחות, תאריכים, מחירים ורישום. אנחנו כאן לענות על כל שאלה.',
  },
  {
    path:  'shop',
    textH1:  'החנות שלנו',                           // Shop.jsx hero
    textSub: 'ציוד מוכח בשטח. לכל טרק ולכל מסע.',
    title: 'HighAir Expeditions | חנות ציוד טרקים',
    desc:  'ציוד טיולים ומשלחות עם הלוגו של HighAir Expeditions - תיקים, ציוד הרים ועוד. כל רכישה תורמת לחולי סרטן.',
  },
  {
    path:  'annual-plan',
    textH1:  'התכנית השנתית',                        // i18n.js annualPlan.title
    textSub: 'כל הטיולים שלנו - מהתאריך הקרוב ועד סוף העונה',   // annualPlan.subtitle (the dates load live)
    title: 'HighAir Expeditions | תכנית שנתית',
    desc:  'כל תאריכי המשלחות של HighAir Expeditions - קילימנג׳רו, אוורסט, אנאפורנה, אלברוס, אקונקגואה ועוד.',
  },
  /* Israel treks hidden by the owner (23 Oct 2026) via ISRAEL_TREKS_LIVE */
  ...(ISRAEL_TREKS_LIVE ? [{
    path:  'israel',
    title: 'HighAir Expeditions | הטרקים שלנו בארץ',
    desc:  'כל הטרקים של HighAir בארץ - מסלולים במדבר יהודה, ים המלח והנגב. יום אחד, מדריך מוסמך וארוחת צהריים כלולה, עם תרומה למאבק במחלת הסרטן. בחרו את הטרק הקרוב שלכם.',
    jsonLd: ISRAEL_LISTING_JSONLD,
  }] : []),
  {
    path:  'treks',
    heroImage: '/images/cards/annapurna.webp',   // WorldExpeditionsPage.jsx CONFIG.treks.heroImg
    textH1:  'הטרקים שלנו בעולם',                // CONFIG.treks.h1He
    textSub: 'מהבלקן דרך אתיופיה ועד להימלאיה בנפאל - הטרקים שאסור לפספס.',   // CONFIG.treks.subHe
    textExps: () => trekExps,
    title: 'HighAir Expeditions | טרקים בעולם',
    desc:  'כל הטרקים של HighAir בעולם - מהבלקן ואתיופיה ועד ההימלאיה בנפאל. מדריכים מקצועיים, קבוצות קטנות ותרומה למאבק במחלת הסרטן. בחרו את הטרק הבא שלכם.',
    jsonLd: TREKS_JSONLD,
  },
  {
    path:  'climbs',
    heroImage: '/images/cards/kilimanjaro.webp', // WorldExpeditionsPage.jsx CONFIG.climbs.heroImg
    textH1:  'משלחות טיפוס הרים בעולם',          // CONFIG.climbs.h1He
    textSub: 'מקילימנג׳רו דרך אלברוס ועד לאקונקגואה - הטיפוסים שמשנים חיים.',   // CONFIG.climbs.subHe
    textExps: () => climbExps,
    title: 'HighAir Expeditions | משלחות טיפוס הרים',
    desc:  'כל משלחות טיפוס ההרים של HighAir - קילימנג׳רו, אלברוס, אקונקגואה, אמה דבלאם ועוד. מדריכים מוסמכים, ליווי מלא ותרומה למאבק במחלת הסרטן.',
    jsonLd: CLIMBS_JSONLD,
  },
  /* The legal pages. They had no shell, so the raw HTML carried the homepage's
     title and description and no heading: Bing listed them as duplicate titles
     and missing h1 (24 Oct 2026). Title and description are the ones
     LegalPageLayout.jsx sets once React loads, so both stay the same. */
  ...[
    ['cancellation',  'מדיניות ביטולים'],
    ['terms',         'תקנון ותנאי שימוש'],
    ['privacy',       'מדיניות פרטיות'],
    ['accessibility', 'הצהרת נגישות'],
  ].map(([p, h1]) => ({
    path:    p,
    textH1:  h1,
    textSub: `${h1} של HighAir Expeditions.`,
    title:   `${h1} | HighAir Expeditions`,
    desc:    `${h1} - HighAir Expeditions. משלחות טיפוס הרים וטרקים בעולם.`,
  })),
];

for (const page of staticPages) {
  writeShell(page.path, {
    title:         page.title,
    description:   page.desc,
    canonicalPath: `/${page.path}`,
    image:         '',
    heroImage:     page.heroImage || '',
    preHero:       preHeroHtml('list', page.heroImage),
    text:          page.textHtml ? wrapText(page.textHtml()) : !page.textH1 ? '' : wrapText(page.textPosts
                     ? blogListText({ h1: page.textH1, sub: page.textSub, posts: page.textPosts() })
                     : listingText({ h1: page.textH1, sub: page.textSub, exps: page.textExps?.() || [] })),
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
  /* dist/index.html is also what every route WITHOUT a shell gets (/privacy,
     /terms, a 404), so the home hero must never paint there. A script at the
     end of <head> marks those visits before the body is parsed; the pre-hero's
     own CSS then hides it, so it cannot flash even for one frame (a guard after
     the markup could: measured on /privacy, 24 Oct 2026). */
  if (!homeHtml.includes('id="ha-pre"')) {
    const homeTextLayer = wrapText(homeText({ description: ORG_NODE.description, exps: liveExps, posts: POSTS }));
    homeHtml = homeHtml
      .replace('</head>', '  <script>if(location.pathname!=="/")document.documentElement.classList.add("ha-nopre")</script>\n</head>')
      .replace(EMPTY_ROOT, `<div id="root">${preHeroHtml('home', '/videos/hero-home-poster.jpg')}${homeTextLayer}</div>`);
    fs.writeFileSync(homePath, homeHtml, 'utf8');
  }
  /* Every route WITHOUT a shell (/privacy, /terms, /book/..., a 404) is served
     dist/spa.html (vercel.json rewrite), the plain app shell: no home hero, no
     home text. Before this, those routes got index.html, and a reader without
     JavaScript would have read the homepage's text on the privacy page. */
  fs.writeFileSync(path.join(DIST, 'spa.html'), template.replace(HOME_HERO_PRELOAD, ''), 'utf8');
  /* Any other path is a 404 with a real 404 status. Until 24 Oct 2026 every
     unknown path (old Wix URLs such as /langtang or /post/magnus) answered 200
     with the homepage's title and no content, and Bing flagged them as pages
     with no h1 and duplicate titles. Vercel serves dist/404.html when no file
     and no rewrite matches. It is the same app shell, so React still draws the
     right screen (the 404 page, or a hidden page opened by its link). */
  fs.writeFileSync(path.join(DIST, '404.html'), injectMeta(template.replace(HOME_HERO_PRELOAD, ''), {
    title: '404 - הדף לא נמצא | HighAir Expeditions', description: 'הדף שחיפשת לא קיים.', canonicalPath: '/', noIndex: true,
  }), 'utf8');
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
