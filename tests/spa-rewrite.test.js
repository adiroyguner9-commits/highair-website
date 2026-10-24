/* Which paths get the plain app shell (dist/spa.html), and which are a real 404.

   Every real page has its own static shell (dist/<path>/index.html, written by
   scripts/generate-html-shells.mjs), so the SPA fallback answers only for the
   booking pages and the hidden safari hub, both kept out of search. Any other
   path gets dist/404.html with a 404 status.
   24 Oct 2026: the fallback used to answer every path with 200, so old Wix URLs
   (/langtang, /post/magnus) looked like real pages with the homepage's title
   and no heading, and Bing listed them as errors.

   The fallback must also never answer for /assets/. Those files carry a
   one-year immutable cache header, so an asset URL that misses (a deploy-time
   race, a stale tab) would cache the HTML page as the "chunk" for a year and
   the chunk-error reload would loop (23 Oct 2026, in production). */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const VERCEL = JSON.parse(readFileSync('vercel.json', 'utf8'));
const fallback = VERCEL.rewrites.find(r => r.destination === '/spa.html');
const matches = (source, path) => new RegExp(`^${source}$`).test(path);
const spa = path => matches(fallback.source, path);
const shells = readFileSync('scripts/generate-html-shells.mjs', 'utf8');
const sitemap = readFileSync('scripts/generate-sitemap.mjs', 'utf8');

describe('SPA fallback rewrite', () => {
  it('serves the app shell for the booking pages and the hidden safari hub', () => {
    for (const p of ['/book', '/book/kilimanjaro', '/book/kilimanjaro/rec123', '/safari']) expect(spa(p), p).toBe(true);
  });

  it('does not answer for unknown paths, so they are a real 404', () => {
    for (const p of ['/langtang', '/pirin', '/post/magnus', '/expedition/no-such-trip', '/blog/no-such-post', '/booking', '/safari-x', '/israel']) {
      expect(spa(p), p).toBe(false);
    }
  });

  it('never answers for /assets/ or /api/', () => {
    for (const p of ['/assets/Header-WMTsfAM8.js', '/assets/index-BdxDftoi.css', '/api/at', '/api/site-health']) {
      expect(spa(p), p).toBe(false);
    }
  });

  it('assets are the immutable-cached path the rule protects', () => {
    const rule = VERCEL.headers.find(h => h.source === '/assets/(.*)');
    expect(rule.headers.find(x => x.key === 'Cache-Control').value).toMatch(/immutable/);
  });

  it('what the fallback serves is kept out of search, and never listed in the sitemap', () => {
    const rule = VERCEL.headers.find(h => h.source === fallback.source);
    expect(rule.headers.find(x => x.key === 'X-Robots-Tag').value).toBe('noindex, follow');
    expect(sitemap).not.toMatch(/path: '\/(book|safari)'/);
  });

  it('a 404 page is generated, out of search', () => {
    expect(shells).toContain("path.join(DIST, '404.html')");
    expect(shells).toMatch(/404\.html'\), injectMeta\([^)]*\), \{[^}]*noIndex: true/);
  });
});

/* A route React knows but with no shell and no rewrite would answer 404 to
   search engines and ad checks while showing the page to people. So every
   route in src/main.jsx needs one of the three. */
describe('every page route is served', () => {
  const routes = [...readFileSync('src/main.jsx', 'utf8').matchAll(/<Route path="([^"]+)"/g)].map(m => m[1]);
  const staticShells = new Set([...shells.matchAll(/path:\s+'([a-z-]+)'/g)].map(m => '/' + m[1]));
  for (const [, p] of shells.matchAll(/\['([a-z-]+)',\s+'[^']+'\]/g)) staticShells.add('/' + p);
  const dynamicShells = ['/expedition/:slug', '/blog/:slug', '/israel/:slug'];   // one shell per slug
  const hidden = ['/israel', '/israel/:slug'];   // ISRAEL_TREKS_LIVE off: React shows the 404 page too

  it('has a shell, the fallback, or is a hidden route', () => {
    expect(routes.length).toBeGreaterThan(10);
    for (const r of routes) {
      if (r === '/' || r === '/*' || hidden.includes(r) || dynamicShells.includes(r)) continue;
      const sample = r.replace(/:[a-z]+/g, 'x');
      expect(staticShells.has(r) || spa(sample), r).toBe(true);
    }
  });

  it('the legal pages have their own shell', () => {
    for (const p of ['/privacy', '/terms', '/cancellation', '/accessibility']) expect(staticShells.has(p), p).toBe(true);
  });
});
