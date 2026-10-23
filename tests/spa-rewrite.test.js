/* The SPA fallback (any path -> index.html) must never answer for /assets/.
   Those files carry a one-year immutable cache header, so an asset URL that
   misses (a deploy-time race, a stale tab) would cache the HTML page as the
   "chunk" for a year and the chunk-error reload would loop. 23 Oct 2026:
   that happened in production; a miss must be a real 404 instead. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const VERCEL = JSON.parse(readFileSync('vercel.json', 'utf8'));
const fallback = VERCEL.rewrites.find(r => r.destination === '/index.html');
const matches = path => new RegExp(`^${fallback.source}$`).test(path);

describe('SPA fallback rewrite', () => {
  it('serves index.html for site pages', () => {
    for (const p of ['/', '/blog', '/blog/tomer-bassan-mera-peak', '/expedition/mera-peak', '/about']) {
      expect(matches(p), p).toBe(true);
    }
  });
  it('never answers for /assets/ or /api/', () => {
    for (const p of ['/assets/Header-WMTsfAM8.js', '/assets/index-BdxDftoi.css', '/api/at', '/api/site-health']) {
      expect(matches(p), p).toBe(false);
    }
  });
  it('assets are the immutable-cached path the rule protects', () => {
    const rule = VERCEL.headers.find(h => h.source === '/assets/(.*)');
    expect(rule.headers.find(x => x.key === 'Cache-Control').value).toMatch(/immutable/);
  });
});
