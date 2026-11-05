import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const BASE_URL = 'https://www.highair-expeditions.com';
const today = new Date().toISOString().slice(0, 10);

/* Israel treks hidden by the owner (23 Oct 2026): drop /israel and all
   /israel/:slug URLs from the sitemap until ISRAEL_TREKS_LIVE is on again. */
const { ISRAEL_TREKS_LIVE } = await import(path.join(ROOT, 'src/data/israelFlag.js'));

// ── Static routes ────────────────────────────────────────────────────────────

const staticRoutes = [
  { path: '/',              priority: '1.0', changefreq: 'weekly'  },
  { path: '/israel',        priority: '0.9', changefreq: 'weekly'  },
  { path: '/treks',         priority: '0.9', changefreq: 'weekly'  },
  { path: '/climbs',        priority: '0.9', changefreq: 'weekly'  },
  { path: '/blog',          priority: '0.8', changefreq: 'weekly'  },
  { path: '/about',         priority: '0.7', changefreq: 'monthly' },
  { path: '/contact',       priority: '0.7', changefreq: 'monthly' },
  { path: '/app',           priority: '0.5', changefreq: 'monthly' },
  { path: '/shop',          priority: '0.7', changefreq: 'monthly' },
  { path: '/annual-plan',   priority: '0.7', changefreq: 'monthly' },
  { path: '/cancellation',  priority: '0.4', changefreq: 'yearly'  },
  { path: '/terms',         priority: '0.4', changefreq: 'yearly'  },
  { path: '/privacy',       priority: '0.4', changefreq: 'yearly'  },
  { path: '/accessibility', priority: '0.4', changefreq: 'yearly'  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Read a data file and extract all slug values using regex.
 * Returns an empty array if the file does not exist.
 */
function extractSlugs(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  [skip] File not found: ${filePath}`);
    return [];
  }
  const text = fs.readFileSync(filePath, 'utf8');
  const slugs = [];
  const re = /slug:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    slugs.push(match[1]);
  }
  return slugs;
}

function urlEntry({ loc, priority, changefreq, lastmod }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod || today}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

// ── Collect all URLs ─────────────────────────────────────────────────────────

const urls = [];

// Static
for (const route of staticRoutes) {
  if (!ISRAEL_TREKS_LIVE && route.path === '/israel') continue;
  urls.push(urlEntry({
    loc: `${BASE_URL}${route.path}`,
    priority: route.priority,
    changefreq: route.changefreq,
  }));
}

// /expedition/:slug  — from mockData.js
/* Import the real module instead of regex-scraping the file: extractSlugs
   matched EVERY `slug:` it found, so an expedition hidden with live:false still
   got listed and indexed. That already applied to kilimanjaro-kosher while it
   was off the air, and would have exposed the safari templates. Same
   `live !== false` rule the nav, footer and HTML shells use. */
const { EXPS } = await import(path.join(ROOT, 'src/data/mockData.js'));
const expeditionSlugs = EXPS.filter(e => e.live !== false && e.slug && !e.teaser).map(e => e.slug);
for (const slug of expeditionSlugs) {
  urls.push(urlEntry({
    loc: `${BASE_URL}/expedition/${slug}`,
    priority: '0.9',
    changefreq: 'monthly',
  }));
}

// /blog/:slug  — from blogData.js (with real lastmod from dateModified/dateIso)
const { POSTS: BLOG_POSTS } = await import(path.join(ROOT, 'src/data/blogData.js'));
for (const post of BLOG_POSTS) {
  if (!post.slug) continue;
  urls.push(urlEntry({
    loc: `${BASE_URL}/blog/${post.slug}`,
    lastmod: post.dateModified || post.dateIso || today,
    priority: '0.8',
    changefreq: 'monthly',
  }));
}

// /israel/:slug  — from israelData.js (live: true only)
const { ISRAEL_TRIPS } = await import(path.join(ROOT, 'src/data/israelData.js'));
const israelSlugs = ISRAEL_TREKS_LIVE ? ISRAEL_TRIPS.filter(t => t.live && t.slug).map(t => t.slug) : [];
for (const slug of israelSlugs) {
  urls.push(urlEntry({
    loc: `${BASE_URL}/israel/${slug}`,
    priority: '0.7',
    changefreq: 'monthly',
  }));
}

// ── Write sitemap.xml ────────────────────────────────────────────────────────

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  '</urlset>',
].join('\n');

const outPath = path.join(ROOT, 'public/sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('Sitemap generated successfully!');
console.log(`  Output : ${outPath}`);
console.log(`  Date   : ${today}`);
console.log(`  Total URLs    : ${urls.length}`);
console.log(`    Static      : ${staticRoutes.length}`);
console.log(`    Expeditions : ${expeditionSlugs.length}`);
console.log(`    Blog posts  : ${BLOG_POSTS.filter(p => p.slug).length}`);
console.log(`    Israel      : ${israelSlugs.length}`);

// ── Sitemaps for the foreign sites (5 Nov 2026) ──────────────────────────────
/* en. / de. / es. are the same deployment, so each host needs its own list of
   its own URLs. middleware.js serves /sitemap.xml and /robots.txt on those hosts
   from public/sitemap-<lng>.xml and public/robots-<lng>.txt. English carries
   every live trip with English copy (not Sinai), the listing pages and the
   magazine; German and Spanish carry their core pages (src/website/sites.js). */
const SITES = await import(path.join(ROOT, 'src/website/sites.js'));
const { BLOG_LANGS } = await import(path.join(ROOT, 'src/website/blogLangs.js'));
const EN_HIDDEN = new Set(['sinai']);
const enTrips = EXPS.filter(e => e.live !== false && e.slug && !e.teaser && !EN_HIDDEN.has(e.slug) && e.seoTitleEn && e.descEn).map(e => `/expedition/${e.slug}`);
const enPages = ['/', '/treks', '/climbs', '/blog', '/about', '/contact', '/app', '/annual-plan', ...enTrips,
  ...BLOG_POSTS.filter(p => p.slug && p.titleEn && BLOG_LANGS[p.slug]?.includes('en')).map(p => `/blog/${p.slug}`), ...SITES.LEGAL_PATHS];
/* German and Spanish: their core pages, and the magazine posts written for them. */
const blogFor = l => { const s = Object.keys(BLOG_LANGS).filter(k => BLOG_LANGS[k].includes(l)); return s.length ? ['/blog', ...s.map(k => `/blog/${k}`)] : []; };
const foreignPages = {
  en: enPages,
  de: [...SITES.CORE_PATHS, ...blogFor('de')],
  es: [...SITES.CORE_PATHS, ...blogFor('es')],
};
const prio = p => (p === '/' ? '1.0' : p.startsWith('/expedition/') || p === '/treks' || p === '/climbs' ? '0.9' : SITES.LEGAL_PATHS.includes(p) ? '0.4' : '0.7');
for (const [lng, pages] of Object.entries(foreignPages)) {
  const base = SITES.BASE_URLS[lng];
  const body = [...new Set(pages)].map(p => urlEntry({ loc: `${base}${p}`, priority: prio(p), changefreq: SITES.LEGAL_PATHS.includes(p) ? 'yearly' : 'monthly' }));
  fs.writeFileSync(path.join(ROOT, `public/sitemap-${lng}.xml`), ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...body, '</urlset>'].join('\n'), 'utf8');
  fs.writeFileSync(path.join(ROOT, `public/robots-${lng}.txt`), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${base}/sitemap.xml\n`, 'utf8');
  console.log(`  sitemap-${lng}.xml: ${body.length} URLs`);
}
