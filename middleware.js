/* middleware.js: serves the English, German and Spanish static shells on the
   en. / de. / es. hosts.

   www and en. are one deployment, so a plain request for /expedition/kilimanjaro
   on en. would get the Hebrew shell (dist/expedition/kilimanjaro/index.html):
   Hebrew <title>, Hebrew text, canonical to www. Google then read the English
   site as a copy of the Hebrew one, and it was kept out of search (5 Nov 2026).

   scripts/generate-html-shells.mjs now also writes English shells to
   dist/en/<path>/index.html. On the en. host this rewrites the page request to
   that file. Everything else (assets, /api, booking pages) passes through.
   Middleware runs before Vercel's static files, which a vercel.json rewrite
   would not. */

import { CORE_PATHS, LEGAL_PATHS } from './src/website/sites.js';
import { BLOG_LANGS } from './src/website/blogLangs.js';

export const config = {
  matcher: ['/', '/expedition/:slug', '/about', '/blog', '/contact', '/app', '/annual-plan', '/treks', '/climbs',
    '/blog/:slug', '/terms', '/privacy', '/cancellation', '/accessibility', '/shop', '/safari', '/book', '/book/:path*',
    '/sitemap.xml', '/robots.txt'],
};

const SLUG = /^\/expedition\/[a-z0-9-]+\/?$/;
const STATIC = new Set(['about', 'blog', 'contact', 'app', 'annual-plan', 'treks', 'climbs']);

/* German and Spanish (de. / es.) carry the core pages (src/website/sites.js);
   their other pages fall back to the English shell, since the app shows them
   in English there. The page list comes from src/website/sites.js; the legal pages have no shell. */
const PARTIAL_PAGES = new Set(CORE_PATHS.filter(p => !LEGAL_PATHS.includes(p)));

export function englishShellPath(hostname, pathname) {
  const sub = String(hostname || '').split('.')[0];
  if (!['en', 'de', 'es'].includes(sub)) return null;
  const clean = pathname === '' ? '/' : (pathname.replace(/\/$/, '') || '/');
  /* Each foreign host has its own sitemap and robots.txt (generate-sitemap.mjs) */
  if (clean === '/sitemap.xml') return `/sitemap-${sub}.xml`;
  if (clean === '/robots.txt') return `/robots-${sub}.txt`;
  const dir = sub !== 'en' && PARTIAL_PAGES.has(clean) ? sub : 'en';
  if (clean === '/') return `/${dir}/index.html`;
  if (SLUG.test(pathname)) return `/${dir}${clean}/index.html`;
  const page = clean.replace(/^\//, '');
  /* The magazine: each site's own index, and a static page for every post
     published in the site's language (scripts/generate-html-shells.mjs) */
  if (page === 'blog') return `/${sub}/blog/index.html`;
  const post = /^blog\/([a-z0-9-]+)$/.exec(page);
  if (post && (BLOG_LANGS[post[1]] || []).includes(sub)) return `/${sub}/blog/${post[1]}/index.html`;
  if (STATIC.has(page)) return `/${dir}/${page}/index.html`;
  /* Pages without a static page of their own (magazine posts, legal pages,
     booking, shop, safari): the app shell in the site's language, so the first
     byte is never the Hebrew page (found 5 Nov 2026). */
  if (APP_SHELL.test(clean)) return `/${sub}/spa.html`;
  return null;
}
const APP_SHELL = /^\/(blog\/[a-z0-9-]+|terms|privacy|cancellation|accessibility|shop|safari|book(\/.*)?)$/;

export default function middleware(request) {
  const url = new URL(request.url);
  const target = englishShellPath(url.hostname, url.pathname);
  if (!target) return;
  return new Response(null, {
    headers: { 'x-middleware-rewrite': new URL(target + url.search, url).toString() },
  });
}
