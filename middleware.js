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

/* A magazine address that is not a post on this site: the path of that site's
   404 page, else null. On en. / de. / es. every /blog/<anything> used to fall
   through to the app shell above and answer 200 with "index, follow": a made-up
   address, or a Hebrew-only post, was a page Google could index with nothing on
   it (11 Nov 2026). It now answers 404, in the site's own language. The Hebrew
   site needs nothing here: a post with no page already gets Vercel's 404. */
export function blogNotFound(hostname, pathname) {
  const sub = String(hostname || '').split('.')[0];
  if (!['en', 'de', 'es'].includes(sub)) return null;
  const post = /^\/blog\/([^/]+)\/?$/.exec(pathname || '');
  if (!post) return null;
  return (BLOG_LANGS[post[1]] || []).includes(sub) ? null : `/${sub}/404.html`;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const missing = blogNotFound(url.hostname, url.pathname);
  if (missing) {
    /* The body is the site's own not-found shell (the app still starts in it
       and takes the visitor to the magazine, as the owner set on 5 Nov 2026);
       the status is what a search engine reads. */
    let body = '';
    try { const r = await fetch(new URL(missing, url)); if (r.ok) body = await r.text(); } catch { /* an empty 404 is still a 404 */ }
    return new Response(body, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex', 'cache-control': 'no-store' } });
  }
  const target = englishShellPath(url.hostname, url.pathname);
  if (!target) return;
  return new Response(null, {
    headers: { 'x-middleware-rewrite': new URL(target + url.search, url).toString() },
  });
}
