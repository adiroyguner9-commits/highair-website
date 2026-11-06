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
import { wrapText, expeditionText, expeditionTextEn, blogText, listingText, blogListText, aboutText, homeText, appText } from './lib/text-layer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const DIST      = path.join(ROOT, 'dist');
const BASE_URL  = 'https://www.highair-expeditions.com';
/* The English site (en. host) is the same deployment. Its pages are written to
   dist/en/<path>/index.html and served on the en. host by middleware.js, each
   with its own English title, text and canonical. Both versions point at each
   other with hreflang, so Google lists each language for its own searchers
   instead of treating them as duplicates (5 Nov 2026: going international). */
const EN_BASE_URL = 'https://en.highair-expeditions.com';
const EN_DIST     = path.join(DIST, 'en');
/* German and Spanish (de. / es., 5 Nov 2026) work the same way, from
   dist/de and dist/es, for the core pages only (src/website/sites.js). */
const SITES = await import(path.join(ROOT, 'src/website/sites.js'));
const CORE = new Set(SITES.CORE_PATHS);
const LANG_BASE = SITES.BASE_URLS;
const LOCALE = { he: 'he_IL', en: 'en_US', de: 'de_DE', es: 'es_ES' };
const UI = {
  de: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/i18n/ui-de.json'), 'utf8')),
  es: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/i18n/ui-es.json'), 'utf8')),
};
const uiTx = (lng, english) => (UI[lng] && UI[lng][english]) || english;
function hreflangTags(p, only) {
  /* The magazine index exists on every site */
  const langs = only || ['he', 'en', ...(CORE.has(p) || p === '/blog' ? SITES.PARTIAL_LANGS : [])];
  return [
    ...langs.map(l => `<link rel="alternate" hreflang="${l}" href="${LANG_BASE[l]}${p}" />`),
    `<link rel="alternate" hreflang="x-default" href="${BASE_URL}${p}" />`,
  ].join('\n  ');
}
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
/* A phone gets the slice of its hero it can show, a third to a half of the bytes
   (scripts/gen-phone-heroes.mjs, 28 Oct 2026). The shell preloads and paints
   that copy under the same media query usePhoneHero() follows
   (src/website/phoneHero.js), so a phone downloads its hero once, and every
   other screen the original. */
const PHONE_HEROES = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/website/phoneHeroes.json'), 'utf8'));
const PHONE_MEDIA = '(max-width: 440px)';
const phoneCopyOf = (src, kind) => PHONE_HEROES[kind]?.[src] || '';
const preloadLink = (src, media) => `<link rel="preload" href="${esc(src)}" as="image" fetchpriority="high"${media ? ` media="${media}"` : ''}>`;
function heroPreload(src, kind) {
  if (!src) return '';
  const phone = phoneCopyOf(src, kind);
  return phone ? preloadLink(phone, PHONE_MEDIA) + preloadLink(src, `not all and ${PHONE_MEDIA}`) : preloadLink(src);
}
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
/* The hero's background sits in the pre-hero's own <style>, so a phone can get
   its copy by media query (main.jsx reads whichever one is on screen). */
const cssSafe = s => String(s).replace(/[<>"{}]/g, '');
function preHeroHtml(kind, img, pos) {
  if (!img || !PRE_HERO_BG[kind]) return '';
  const phone = phoneCopyOf(img, kind);
  const bg = `#ha-pre .h{background:${cssSafe(PRE_HERO_BG[kind](img, pos))}}`
    + (phone ? `@media ${PHONE_MEDIA}{#ha-pre .h{background:${cssSafe(PRE_HERO_BG[kind](phone, pos))}}}` : '');
  return `<div id="ha-pre" aria-hidden="true"><style>${PRE_HERO_CSS}${bg}</style>`
    + `<div class="b"></div>${kind === 'home' ? '<div class="sp"></div>' : ''}`
    + `<div class="h ${kind}"></div></div>`;
}
const EMPTY_ROOT = '<div id="root"></div>';
if (!template.includes('<html lang="he" dir="rtl">')) throw new Error('generate-html-shells: <html lang="he" dir="rtl"> not found in index.html (the English shells swap it)');
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

function injectMeta(html, { title, description, canonicalPath, image, ogImage, ogType, articleMeta, noIndex, en, alternatesPath, alternateLangs }) {
  /* en: true for English, or a language code ('de', 'es') */
  const lng   = en === true ? 'en' : (en || 'he');
  const url   = `${LANG_BASE[lng] || BASE_URL}${canonicalPath}`;
  const img   = image
    ? (image.startsWith('http') ? image : `${BASE_URL}${image}`)
    : `${BASE_URL}/og-image.jpg`;
  // Dedicated landscape share image (1200x630) for social/AI cards when provided
  const social = ogImage
    ? (ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`)
    : img;
  const t = esc(title);
  const d = esc(truncate(description));

  /* Replacements are functions, never strings: a string replacement reads "$2"
     in "$2,900" as a capture group, which cut the Kilimanjaro description off at
     "From " (found 6 Nov 2026). */
  let out = html
    // <title>
    .replace(/<title>[^<]*<\/title>/, () => `<title>${t}</title>`)
    // meta description
    .replace(/(<meta name="description"\s+content=")[^"]*(")/,     (_, a, b) => `${a}${d}${b}`)
    // og tags
    .replace(/(<meta property="og:title"\s+content=")[^"]*(")/,       (_, a, b) => `${a}${t}${b}`)
    .replace(/(<meta property="og:description"\s+content=")[^"]*(")/,  (_, a, b) => `${a}${d}${b}`)
    .replace(/(<meta property="og:url"\s+content=")[^"]*(")/,          (_, a, b) => `${a}${esc(url)}${b}`)
    .replace(/(<meta property="og:image"\s+content=")[^"]*(")/,        (_, a, b) => `${a}${esc(social)}${b}`)
    // twitter tags
    .replace(/(<meta name="twitter:title"\s+content=")[^"]*(")/,       (_, a, b) => `${a}${t}${b}`)
    .replace(/(<meta name="twitter:description"\s+content=")[^"]*(")/,  (_, a, b) => `${a}${d}${b}`)
    .replace(/(<meta name="twitter:image"\s+content=")[^"]*(")/,        (_, a, b) => `${a}${esc(social)}${b}`)
    // canonical
    .replace(/(<link rel="canonical"\s+href=")[^"]*(")/,               (_, a, b) => `${a}${esc(url)}${b}`);

  /* A hidden page (a trip with live:false) stays reachable by its link but out of
     search: the same rule the React page applies once it loads. */
  if (noIndex) {
    out = out.replace(/(<meta name="robots"\s+content=")[^"]*(")/, '$1noindex, follow$2');
  }

  /* English shell: the document's language, direction and locale */
  if (en) {
    out = out
      .replace('<html lang="he" dir="rtl">', `<html lang="${lng}" dir="ltr">`)
      .replace(/(<meta property="og:locale"\s+content=")[^"]*(")/, (_, a, b) => `${a}${LOCALE[lng]}${b}`);
  }

  /* A page that exists in both languages names both (hreflang) */
  if (alternatesPath && !noIndex) {
    out = out.replace('</head>', `  ${hreflangTags(alternatesPath, alternateLangs)}\n</head>`);
  }

  // og:type override (blog posts = "article" for news/social/AI)
  if (ogType) {
    out = out.replace(/(<meta property="og:type"\s+content=")[^"]*(")/, (_, a, b) => `${a}${esc(ogType)}${b}`);
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

function writeShell(routePath, meta, outRoot = DIST) {
  const dir = path.join(outRoot, routePath);
  fs.mkdirSync(dir, { recursive: true });
  let html = injectMeta(template, meta).replace(HOME_HERO_PRELOAD, heroPreload(meta.heroImage, meta.heroKind));
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
const { FAQ_BY_SLUG, makeDefaultFaq, makeDefaultFaqEn, notesWithExperience } = await import(path.join(ROOT, 'src/data/faqData.js'));
const faqFor = exp => (FAQ_BY_SLUG[exp.slug]?.he?.length ? FAQ_BY_SLUG[exp.slug].he : makeDefaultFaq(exp.groupCapacity || 15, exp.experienceHe));
const faqForEn = exp => (FAQ_BY_SLUG[exp.slug]?.en?.length ? FAQ_BY_SLUG[exp.slug].en : makeDefaultFaqEn(exp.groupCapacity || 15, exp.experienceEn));
/* A trip has an English page when it is live and its English copy exists */
const EN_HIDDEN = new Set(['sinai', 'elbrus']);   /* = HIDDEN_ON_EN in src/data/expeditionGroups.js */
const hasEnglish = exp => exp.live !== false && !EN_HIDDEN.has(exp.slug) && Boolean(exp.seoTitleEn && exp.descEn);
let expCount = 0;
let enCount = 0;
let foreignCount = 0;
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
    heroKind:      'trip',
    preHero:       preHeroHtml('trip', expHeroImage(exp)),
    text:          wrapText(expeditionText({ ...exp, importantToNote: notesWithExperience(exp.importantToNote, exp.experienceHe) }, faqFor(exp))),
    noIndex:       exp.live === false,
    alternatesPath: hasEnglish(exp) ? `/expedition/${exp.slug}` : undefined,
    jsonLd,
  });
  expCount++;

  /* Every trip gets an en. shell, since middleware.js sends en. visitors to it.
     One without English copy (or hidden) is kept out of search. */
  {
    const enUrl = `${EN_BASE_URL}/expedition/${exp.slug}`;
    writeShell(`expedition/${exp.slug}`, {
      en:            true,
      noIndex:       !hasEnglish(exp),
      title:         exp.seoTitleEn || `${exp.nameEn || exp.name} | HighAir Expeditions`,
      description:   exp.seoDescriptionEn || exp.descEn || '',
      canonicalPath: `/expedition/${exp.slug}`,
      alternatesPath: `/expedition/${exp.slug}`,
      image:         exp.ogImage || exp.img || '',
      heroImage:     expHeroImage(exp),
      heroKind:      'trip',
      preHero:       preHeroHtml('trip', expHeroImage(exp)),
      text:          wrapText(expeditionTextEn(exp, faqForEn(exp))),
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [{
          '@type': 'TouristTrip',
          '@id': `${enUrl}#trip`,
          name: exp.nameEn || exp.name,
          description: exp.seoDescriptionEn || exp.descEn,
          url: enUrl,
          image: expImage,
          inLanguage: 'en',
          provider: { '@type': 'Organization', name: 'HighAir Expeditions', url: EN_BASE_URL },
        }],
      },
    }, EN_DIST);
    if (hasEnglish(exp)) enCount++;
  }

  /* German and Spanish shells for the trips those sites offer */
  if (SITES.CORE_TRIPS.includes(exp.slug) && exp.live !== false) {
    const { FAQ_I18N, defaultFaqI18n } = await import(path.join(ROOT, 'src/data/tripI18n.js'));
    for (const lng of SITES.PARTIAL_LANGS) {
      const S = lng === 'de' ? 'De' : 'Es';
      const url = `${LANG_BASE[lng]}/expedition/${exp.slug}`;
      writeShell(`expedition/${exp.slug}`, {
        en:            lng,
        title:         exp['seoTitle' + S] || exp.seoTitleEn,
        description:   exp['seoDescription' + S] || exp.seoDescriptionEn || '',
        canonicalPath: `/expedition/${exp.slug}`,
        alternatesPath: `/expedition/${exp.slug}`,
        image:         exp.ogImage || exp.img || '',
        heroImage:     expHeroImage(exp),
        heroKind:      'trip',
        preHero:       preHeroHtml('trip', expHeroImage(exp)),
        text:          wrapText(expeditionTextEn(exp, FAQ_I18N[exp.slug]?.[lng] || defaultFaqI18n(lng, exp.groupCapacity || 15), lng)),
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [{
            '@type': 'TouristTrip',
            '@id': `${url}#trip`,
            name: exp['name' + S] || exp.nameEn,
            description: exp['seoDescription' + S] || exp.seoDescriptionEn,
            url,
            image: expImage,
            inLanguage: lng,
            provider: { '@type': 'Organization', name: 'HighAir Expeditions', url: LANG_BASE[lng] },
          }],
        },
      }, path.join(DIST, lng));
      foreignCount++;
    }
  }
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
    heroKind:      'blog',
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

// ── Blog posts on en. / de. / es. (dist/<lng>/blog/<slug>/index.html) ──────────
/* Each translated post gets its own static page on its site: its own title,
   description, canonical, hreflang to every language it exists in, article
   meta and BlogPosting data, and the post's text for readers without
   JavaScript. Before 6 Nov 2026 all 78 were served the one generic app shell.
   middleware.js routes /blog/<slug> here when BLOG_LANGS lists the language. */
let intlBlogCount = 0;
{
  const { readIntl } = await import(path.join(ROOT, 'scripts/lib/vite-blog-split.mjs'));
  const { BLOG_LANGS } = await import(path.join(ROOT, 'src/website/blogLangs.js'));
  const INTL = readIntl(ROOT);
  const CRUMB = { en: 'Magazine', de: 'Magazin', es: 'Revista' };
  for (const post of POSTS) {
    const langs = BLOG_LANGS[post.slug] || ['he'];
    for (const lng of ['en', 'de', 'es']) {
      const tr = INTL[lng]?.[post.slug];
      if (!tr || !langs.includes(lng)) continue;
      const base = LANG_BASE[lng];
      const url = `${base}/blog/${post.slug}`;
      const img = post.img ? (post.img.startsWith('http') ? post.img : `${BASE_URL}${post.img}`) : `${BASE_URL}/og-image.jpg`;
      const author = authorOf(post);
      const headline = tr.title || '';
      const graph = [{
        '@type': isNewsPost(post) ? 'NewsArticle' : 'BlogPosting',
        headline,
        description: tr.excerpt || '',
        image: img,
        datePublished: post.dateIso || '',
        dateModified: post.dateModified || post.dateIso || '',
        author: author
          ? { '@type': 'Person', name: author.nameEn || author.nameHe, url: `${base}/about` }
          : { '@type': 'Organization', name: 'HighAir Expeditions', url: base },
        publisher: { '@type': 'Organization', name: 'HighAir Expeditions', logo: { '@type': 'ImageObject', url: `${BASE_URL}/Logo.png` } },
        mainEntityOfPage: url,
        inLanguage: lng,
        articleSection: tr.category || undefined,
      }, {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: base },
          { '@type': 'ListItem', position: 2, name: CRUMB[lng], item: `${base}/blog` },
          { '@type': 'ListItem', position: 3, name: headline, item: url },
        ],
      }];
      const faq = faqFromContent(tr.content);
      if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq });
      writeShell(`blog/${post.slug}`, {
        en:             lng,
        title:          tr.seoTitle || (headline ? `${headline} | HighAir Expeditions` : 'HighAir Expeditions'),
        description:    tr.excerpt || '',
        canonicalPath:  `/blog/${post.slug}`,
        alternatesPath: `/blog/${post.slug}`,
        alternateLangs: langs,
        image:          post.img || '',
        ogImage:        post.ogImg || '',
        heroImage:      localImg(post.img),
        heroKind:       'blog',
        preHero:        preHeroHtml('blog', localImg(post.img), post.imgPosition),
        text:           wrapText(blogText({ ...post, ...tr, content: tr.content })),
        ogType:         'article',
        articleMeta: {
          publishedTime: post.dateIso ? `${post.dateIso}T12:00:00+03:00` : undefined,
          modifiedTime:  (post.dateModified || post.dateIso) ? `${post.dateModified || post.dateIso}T12:00:00+03:00` : undefined,
          section:       tr.category || undefined,
          author:        author?.nameEn,
          tags:          [],
        },
        jsonLd: { '@context': 'https://schema.org', '@graph': graph },
      }, path.join(DIST, lng));
      intlBlogCount++;
    }
  }
  /* The magazine index on de. and es., in their language (en. has its own below) */
  for (const lng of SITES.PARTIAL_LANGS) {
    writeShell('blog', {
      en: lng,
      title: uiTx(lng, 'Trekking & Climbing Magazine | HighAir Expeditions'),
      description: {
        de: 'Ratgeber, Tipps und Geschichten aus der Welt des Trekkings und Bergsteigens, vom Team von HighAir Expeditions.',
        es: 'Guías, consejos e historias del mundo del trekking y el montañismo, del equipo de HighAir Expeditions.',
      }[lng],
      canonicalPath: '/blog', alternatesPath: '/blog', alternateLangs: ['he', 'en', ...SITES.PARTIAL_LANGS],
    }, path.join(DIST, lng));
  }
}

// ── Israel trip pages ────────────────────────────────────────────────────────

const { ISRAEL_TRIPS } = await import(path.join(ROOT, 'src/data/israelData.js'));
const { ISRAEL_TREKS_LIVE, ISRAEL_DIRECT_LINK_SLUGS } = await import(path.join(ROOT, 'src/data/israelFlag.js'));
let israelCount = 0;
/* Israel treks hidden by the owner (23 Oct 2026): when off, only the community
   treks shared by direct link get a shell (their WhatsApp link preview reads it) */
for (const trip of (ISRAEL_TREKS_LIVE ? ISRAEL_TRIPS : ISRAEL_TRIPS.filter(t => ISRAEL_DIRECT_LINK_SLUGS.includes(t.slug)))) {
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
/* The app page's copy, store links and FAQ: the same file AppPage.jsx renders. */
const APP = await import(path.join(ROOT, 'src/data/appData.js'));
const APP_HE = APP.APP_PAGE.he;
const APP_JSONLD = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebPage', '@id': `${BASE_URL}/app`, name: APP_HE.h1, url: `${BASE_URL}/app`, description: APP_HE.metaDesc, inLanguage: 'he', isPartOf: { '@id': `${BASE_URL}/#website` }, about: { '@id': `${BASE_URL}/#organization` } },
  { '@type': 'FAQPage', mainEntity: APP_HE.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  { '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'בית', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: APP_HE.h1, item: `${BASE_URL}/app` },
  ] },
] };

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
    path:  'app',
    textHtml: () => appText(APP_HE, { appStore: APP.APP_STORE_URL, googlePlay: APP.PLAY_STORE_URL }),
    title: APP_HE.metaTitle,
    desc:  APP_HE.metaDesc,
    jsonLd: APP_JSONLD,
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
    heroKind:      'list',
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
      .replace(HOME_HERO_PRELOAD, heroPreload('/videos/hero-home-poster.jpg', 'home'))
      .replace('</head>', '  <script>if(location.pathname!=="/")document.documentElement.classList.add("ha-nopre")</script>\n</head>')
      .replace('</head>', `  ${hreflangTags('/')}\n</head>`)
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

// ── English static pages (dist/en/<path>/index.html, served on en. by middleware.js) ──
/* Same titles and descriptions the React pages set on en. (AboutUs, Blog,
   ContactPage, AppPage, AnnualPlan, WorldExpeditionsPage), so the tab and any
   crawler see English from the first byte, never the Hebrew shell. */
const EN_STATIC = [
  { path: 'about',       title: 'Our Story | HighAir Expeditions',
    description: 'Meet the team behind HighAir Expeditions - founded from personal loss, built on mountains. Every expedition includes a donation to cancer patients.' },
  { path: 'blog',        title: 'Trekking & Climbing Magazine | HighAir Expeditions',
    description: 'Guides, tips and stories from the world of trekking and mountaineering, from the HighAir Expeditions team.' },
  { path: 'contact',     title: 'Contact Us | HighAir Expeditions',
    description: 'Reach the HighAir Expeditions team by WhatsApp, email or phone. We respond within 24 hours.' },
  { path: 'app',         title: APP.APP_PAGE.en.metaTitle, description: APP.APP_PAGE.en.metaDesc },
  { path: 'annual-plan', title: 'International Expedition Schedule | HighAir Expeditions',
    description: 'Upcoming international HighAir Expeditions departures, run in English with climbers from around the world. Pick a date and join us.' },
  { path: 'treks',       title: 'World Treks | HighAir Expeditions',
    description: "All of HighAir's world treks - from the Balkans and Ethiopia to the Himalayas in Nepal. Professional guides, small groups, supporting the fight against cancer. Choose your next trek." },
  { path: 'climbs',      title: 'Mountain Climbing Expeditions | HighAir Expeditions',
    description: "All of HighAir's mountain climbing expeditions - Kilimanjaro, Elbrus, Aconcagua, Ama Dablam and more. Certified guides, full support, supporting the fight against cancer." },
];
for (const pg of EN_STATIC) {
  writeShell(pg.path, { en: true, title: pg.title, description: pg.description, canonicalPath: `/${pg.path}`, alternatesPath: `/${pg.path}` }, EN_DIST);
}

// ── German and Spanish static pages and homepages (dist/de, dist/es) ──
{
  const pages = [
    { path: 'about',       title: 'Our Story | HighAir Expeditions', description: EN_STATIC[0].description },
    { path: 'contact',     title: 'Contact Us | HighAir Expeditions', description: EN_STATIC[2].description },
    { path: 'annual-plan', title: 'International Expedition Schedule | HighAir Expeditions', description: EN_STATIC[4].description },
    { path: 'treks',       title: EN_STATIC[5].title, description: EN_STATIC[5].description },
    { path: 'climbs',      title: EN_STATIC[6].title, description: EN_STATIC[6].description },
  ];
  for (const lng of SITES.PARTIAL_LANGS) {
    for (const pg of pages) {
      writeShell(pg.path, { en: lng, title: uiTx(lng, pg.title), description: uiTx(lng, pg.description), canonicalPath: `/${pg.path}`, alternatesPath: `/${pg.path}` }, path.join(DIST, lng));
    }
    writeShell('app', { en: lng, title: APP.APP_PAGE[lng].metaTitle, description: APP.APP_PAGE[lng].metaDesc, canonicalPath: '/app', alternatesPath: '/app' }, path.join(DIST, lng));
    const S = lng === 'de' ? 'De' : 'Es';
    const trips = liveExps.filter(e => SITES.CORE_TRIPS.includes(e.slug));
    const homeText = `<article><h1>HighAir Expeditions</h1><p>${uiTx(lng, 'Guided trekking and climbing expeditions worldwide. Kilimanjaro, Everest, Elbrus, Aconcagua & more. Expert guides, 94% success rate. Every expedition supports cancer patients.').replace(/[<>&"]/g, '')}</p><ul>`
      + trips.map(e => `<li><a href="/expedition/${e.slug}">${String(e['name' + S] || e.nameEn).replace(/[<>&"]/g, '')}</a></li>`).join('')
      + '</ul></article>';
    const home = injectMeta(template, {
      en: lng,
      title: uiTx(lng, 'Trekking and Climbing Expeditions | HighAir Expeditions'),
      description: uiTx(lng, 'Guided trekking and climbing expeditions worldwide. Kilimanjaro, Everest, Elbrus, Aconcagua & more. Expert guides, 94% success rate. Every expedition supports cancer patients.'),
      canonicalPath: '/',
      alternatesPath: '/',
    })
      .replace(HOME_HERO_PRELOAD, heroPreload('/videos/hero-home-poster.jpg', 'home'))
      .replace(EMPTY_ROOT, `<div id="root">${preHeroHtml('home', '/videos/hero-home-poster.jpg')}${wrapText(homeText)}</div>`);
    fs.mkdirSync(path.join(DIST, lng), { recursive: true });
    fs.writeFileSync(path.join(DIST, lng, 'index.html'), home, 'utf8');
  }
}

// ── App shell per foreign language (dist/<lng>/spa.html) ──
/* Served by middleware.js for pages with no static page of their own on the
   en. / de. / es. hosts (magazine posts, legal pages, booking): the plain app
   shell, in the site's language and direction, so the first byte is not the
   Hebrew page. React then fills in the page and its title. */
for (const lng of ['en', ...SITES.PARTIAL_LANGS]) {
  const shell = injectMeta(template.replace(HOME_HERO_PRELOAD, ''), {
    en: lng,
    title: 'HighAir Expeditions',
    description: uiTx(lng, 'Guided trekking and climbing expeditions worldwide. Kilimanjaro, Everest, Elbrus, Aconcagua & more. Expert guides, 94% success rate. Every expedition supports cancer patients.'),
    canonicalPath: '/',
  });
  fs.mkdirSync(path.join(DIST, lng), { recursive: true });
  fs.writeFileSync(path.join(DIST, lng, 'spa.html'), shell, 'utf8');
}

// ── English homepage (dist/en/index.html, served on the en. host by middleware.js) ──
{
  const enHomeText = '<article><h1>HighAir Expeditions</h1>'
    + '<p>Trekking and climbing expeditions around the world. Every expedition supports cancer patients.</p>'
    + '<h2>Expeditions and treks</h2><ul>'
    + liveExps.filter(hasEnglish).map(e => `<li><a href="/expedition/${e.slug}">${String(e.nameEn || e.name).replace(/[<>&"]/g, '')}</a></li>`).join('')
    + '</ul></article>';
  const enHome = injectMeta(template, {
    en: true,
    title: 'Trekking and Climbing Expeditions | HighAir Expeditions',
    description: 'HighAir Expeditions runs guided trekking and mountaineering expeditions worldwide: Kilimanjaro (including fully kosher climbs), Everest Base Camp, Aconcagua, Elbrus and more. Every expedition supports cancer patients.',
    canonicalPath: '/',
    alternatesPath: '/',
  })
    .replace(HOME_HERO_PRELOAD, heroPreload('/videos/hero-home-poster.jpg', 'home'))
    .replace(EMPTY_ROOT, `<div id="root">${preHeroHtml('home', '/videos/hero-home-poster.jpg')}${wrapText(enHomeText)}</div>`);
  fs.mkdirSync(EN_DIST, { recursive: true });
  fs.writeFileSync(path.join(EN_DIST, 'index.html'), enHome, 'utf8');
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('HTML shells generated!');
console.log(`  Expeditions : ${expCount}`);
console.log(`  Blog posts  : ${blogCount}`);
console.log(`  Blog abroad : ${intlBlogCount}`);
console.log(`  Israel      : ${israelCount}`);
console.log(`  Static      : ${staticPages.length}`);
console.log(`  English     : ${enCount} expeditions + home`);
console.log(`  German/Span.: ${foreignCount} expedition shells + home, treks, climbs, about, contact, annual plan, app`);
console.log(`  Total       : ${expCount + blogCount + israelCount + staticPages.length}`);
