/**
 * generate-html-shells.mjs
 * Post-build script: generates static HTML files for every expedition, blog post,
 * and Israel trip page so Googlebot sees correct <title> / <meta> on the first
 * crawl — without needing SSR or Puppeteer.
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

function injectMeta(html, { title, description, canonicalPath, image }) {
  const url   = `${BASE_URL}${canonicalPath}`;
  const img   = image
    ? (image.startsWith('http') ? image : `${BASE_URL}${image}`)
    : `${BASE_URL}/og-image.jpg`;
  const t = esc(title);
  const d = esc(truncate(description));

  return html
    // <title>
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    // meta description
    .replace(/(<meta name="description"\s+content=")[^"]*(")/,     `$1${d}$2`)
    // og tags
    .replace(/(<meta property="og:title"\s+content=")[^"]*(")/,       `$1${t}$2`)
    .replace(/(<meta property="og:description"\s+content=")[^"]*(")/,  `$1${d}$2`)
    .replace(/(<meta property="og:url"\s+content=")[^"]*(")/,          `$1${esc(url)}$2`)
    .replace(/(<meta property="og:image"\s+content=")[^"]*(")/,        `$1${esc(img)}$2`)
    // twitter tags
    .replace(/(<meta name="twitter:title"\s+content=")[^"]*(")/,       `$1${t}$2`)
    .replace(/(<meta name="twitter:description"\s+content=")[^"]*(")/,  `$1${d}$2`)
    .replace(/(<meta name="twitter:image"\s+content=")[^"]*(")/,        `$1${esc(img)}$2`)
    // canonical
    .replace(/(<link rel="canonical"\s+href=")[^"]*(")/,               `$1${esc(url)}$2`);
}

function buildJsonLd(meta) {
  if (!meta.jsonLd) return '';
  return `\n  <script type="application/ld+json">${JSON.stringify(meta.jsonLd, null, 0)}</script>`;
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
  if (!exp.slug) continue;

  const expUrl   = `${BASE_URL}/expedition/${exp.slug}`;
  const expImage = exp.img ? (exp.img.startsWith('http') ? exp.img : `${BASE_URL}${exp.img}`) : `${BASE_URL}/og-image.jpg`;

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
        ...(exp.successRate ? {
          aggregateRating: {
            '@type':      'AggregateRating',
            ratingValue:  '4.9',
            reviewCount:  '47',
            bestRating:   '5',
            worstRating:  '1',
          },
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
    image:         exp.img             || '',
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
  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'BlogPosting',
    headline:     post.title || post.titleEn || '',
    description:  post.excerpt || post.excerptEn || '',
    image:        postImg,
    datePublished: post.dateIso || '',
    dateModified:  post.dateModified || post.dateIso || '',
    author:       { '@type': 'Organization', name: 'HighAir Expeditions', url: BASE_URL },
    publisher:    { '@type': 'Organization', name: 'HighAir Expeditions', logo: { '@type': 'ImageObject', url: `${BASE_URL}/Logo.png` } },
    mainEntityOfPage: postUrl,
  };
  const postTitle = post.title || post.titleEn || '';
  writeShell(`blog/${post.slug}`, {
    title:         postTitle ? `HighAir Expeditions | ${postTitle}` : 'HighAir Expeditions | בלוג',
    description:   post.excerpt  || post.excerptEn  || '',
    canonicalPath: `/blog/${post.slug}`,
    image:         post.img      || '',
    jsonLd,
  });
  blogCount++;
}

// ── Israel trip pages ────────────────────────────────────────────────────────

const { ISRAEL_TRIPS } = await import(path.join(ROOT, 'src/data/israelData.js'));
let israelCount = 0;
for (const trip of ISRAEL_TRIPS) {
  if (!trip.slug || !trip.live) continue;
  writeShell(`israel/${trip.slug}`, {
    title:         trip.seoTitle       || trip.nameHe  || '',
    description:   trip.seoDescription || trip.excerpt || '',
    canonicalPath: `/israel/${trip.slug}`,
    image:         trip.img            || '',
  });
  israelCount++;
}

// ── Static pages ─────────────────────────────────────────────────────────────

const staticPages = [
  {
    path:  'about',
    title: 'HighAir Expeditions | הסיפור שלנו',
    desc:  'HighAir Expeditions הוקמה מתוך אובדן, עם החלטה אחת: לקום ולהגיע לכל פסגה. הכירו את האנשים שמאחורי כל טרק — ותורמים מדי חודש לילדים חולי סרטן.',
  },
  {
    path:  'blog',
    title: 'HighAir Expeditions | בלוג טיפוס הרים וטרקים',
    desc:  'מאמרים, טיפים וסיפורים מעולם הטרקים וטיפוס ההרים — מבית HighAir Expeditions. קילימנג׳רו, אוורסט, אנאפורנה ועוד.',
  },
  {
    path:  'contact',
    title: 'HighAir Expeditions | צרו קשר',
    desc:  'צרו קשר עם צוות HighAir Expeditions לפרטים על משלחות, תאריכים, מחירים ורישום. אנחנו כאן לענות על כל שאלה.',
  },
  {
    path:  'shop',
    title: 'HighAir Expeditions | חנות ציוד טרקים',
    desc:  'ציוד טיולים ומשלחות עם הלוגו של HighAir Expeditions — תיקים, ציוד הרים ועוד. כל רכישה תורמת לחולי סרטן.',
  },
  {
    path:  'annual-plan',
    title: 'HighAir Expeditions | תכנית שנתית',
    desc:  'כל תאריכי המשלחות של HighAir Expeditions — קילימנג׳רו, אוורסט, אנאפורנה, אלברוס, אקונקגואה ועוד.',
  },
];

for (const page of staticPages) {
  writeShell(page.path, {
    title:         page.title,
    description:   page.desc,
    canonicalPath: `/${page.path}`,
    image:         '',
  });
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('HTML shells generated!');
console.log(`  Expeditions : ${expCount}`);
console.log(`  Blog posts  : ${blogCount}`);
console.log(`  Israel      : ${israelCount}`);
console.log(`  Static      : ${staticPages.length}`);
console.log(`  Total       : ${expCount + blogCount + israelCount + staticPages.length}`);
