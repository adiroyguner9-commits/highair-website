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

export const config = {
  matcher: ['/', '/expedition/:slug', '/about', '/blog', '/contact', '/app', '/annual-plan', '/treks', '/climbs'],
};

const SLUG = /^\/expedition\/[a-z0-9-]+\/?$/;
const STATIC = new Set(['about', 'blog', 'contact', 'app', 'annual-plan', 'treks', 'climbs']);

/* German and Spanish (de. / es.) carry the core pages (src/website/sites.js);
   their other pages fall back to the English shell, since the app shows them
   in English there. Kept in step with sites.js by tests/de-es-sites.test.js. */
const PARTIAL_PAGES = new Set(['/', '/expedition/kilimanjaro', '/expedition/kilimanjaro-kosher', '/expedition/everest-base-camp', '/expedition/annapurna', '/expedition/peaks-of-balkan', '/expedition/aconcagua', '/expedition/island-peak', '/treks', '/climbs', '/about', '/contact', '/annual-plan', '/app']);

export function englishShellPath(hostname, pathname) {
  const sub = String(hostname || '').split('.')[0];
  if (!['en', 'de', 'es'].includes(sub)) return null;
  const clean = pathname === '' ? '/' : (pathname.replace(/\/$/, '') || '/');
  const dir = sub !== 'en' && PARTIAL_PAGES.has(clean) ? sub : 'en';
  if (clean === '/') return `/${dir}/index.html`;
  if (SLUG.test(pathname)) return `/${dir}${clean}/index.html`;
  const page = clean.replace(/^\//, '');
  if (STATIC.has(page)) return `/${dir}/${page}/index.html`;
  return null;
}

export default function middleware(request) {
  const url = new URL(request.url);
  const target = englishShellPath(url.hostname, url.pathname);
  if (!target) return;
  return new Response(null, {
    headers: { 'x-middleware-rewrite': new URL(target + url.search, url).toString() },
  });
}
