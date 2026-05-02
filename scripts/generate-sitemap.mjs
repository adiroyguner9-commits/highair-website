import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const BASE_URL = 'https://www.highair-expeditions.com';
const today = new Date().toISOString().slice(0, 10);

// ── Static routes ────────────────────────────────────────────────────────────

const staticRoutes = [
  { path: '/',              priority: '1.0', changefreq: 'weekly'  },
  { path: '/blog',          priority: '0.8', changefreq: 'weekly'  },
  { path: '/about',         priority: '0.7', changefreq: 'monthly' },
  { path: '/contact',       priority: '0.7', changefreq: 'monthly' },
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

function urlEntry({ loc, priority, changefreq }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

// ── Collect all URLs ─────────────────────────────────────────────────────────

const urls = [];

// Static
for (const route of staticRoutes) {
  urls.push(urlEntry({
    loc: `${BASE_URL}${route.path}`,
    priority: route.priority,
    changefreq: route.changefreq,
  }));
}

// /expedition/:slug  — from mockData.js
const expeditionSlugs = extractSlugs(path.join(ROOT, 'src/data/mockData.js'));
for (const slug of expeditionSlugs) {
  urls.push(urlEntry({
    loc: `${BASE_URL}/expedition/${slug}`,
    priority: '0.9',
    changefreq: 'monthly',
  }));
}

// /blog/:slug  — from blogData.js
const blogSlugs = extractSlugs(path.join(ROOT, 'src/data/blogData.js'));
for (const slug of blogSlugs) {
  urls.push(urlEntry({
    loc: `${BASE_URL}/blog/${slug}`,
    priority: '0.8',
    changefreq: 'monthly',
  }));
}

// /israel/:slug  — from israelData.js
const israelSlugs = extractSlugs(path.join(ROOT, 'src/data/israelData.js'));
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
console.log(`    Blog posts  : ${blogSlugs.length}`);
console.log(`    Israel      : ${israelSlugs.length}`);
