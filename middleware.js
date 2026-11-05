/* middleware.js: serves the English static shells on the en. host.

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
  matcher: ['/', '/expedition/:slug'],
};

const SLUG = /^\/expedition\/[a-z0-9-]+\/?$/;

export function englishShellPath(hostname, pathname) {
  if (!hostname || !hostname.startsWith('en.')) return null;
  if (pathname === '/' || pathname === '') return '/en/index.html';
  if (SLUG.test(pathname)) return `/en${pathname.replace(/\/$/, '')}/index.html`;
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
