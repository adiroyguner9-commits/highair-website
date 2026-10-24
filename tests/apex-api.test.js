/* The bare domain 308s to www for SEO (23 Oct 2026), but never its API. The
   Lead Center calls this site's API cross-origin, and a browser does not follow
   a redirect on a CORS preflight: with /api redirected, the deposit welcome,
   call booking, follow-up, no-answer and reschedule calls all failed silently
   (found 24 Oct 2026, a closing's welcome 7.5 minutes late). Old app builds and
   cached pages still call the bare domain, so its /api must answer in place. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const cfg = JSON.parse(readFileSync(resolve(__dirname, '../vercel.json'), 'utf8'));
const apex = (cfg.redirects || []).filter(r => (r.has || []).some(h => h.type === 'host' && h.value === 'highair-expeditions.com'));
/* path-to-regexp, for the three shapes used here: "/", "/:path*" and
   "/:path(<regex>)", where the regex is everything after the slash. */
const toRe = src => {
  if (src.startsWith('/:path(') && src.endsWith(')')) return new RegExp('^/(' + src.slice(7, -1) + ')$');
  if (src === '/:path*') return /^\/(.*)$/;
  return new RegExp('^' + src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
};

describe('bare-domain redirect', () => {
  it('sends pages to www', () => {
    const hit = p => apex.some(r => toRe(r.source).test(p));
    expect(hit('/')).toBe(true);
    expect(hit('/expedition/kilimanjaro')).toBe(true);
    expect(hit('/blog/tanzania-visa-guide')).toBe(true);
  });
  it('never redirects the API', () => {
    for (const p of ['/api/notify-deposit', '/api/book-slot', '/api/send-followup', '/api/notify-no-answer', '/api/notify-reschedule']) {
      expect(apex.some(r => toRe(r.source).test(p)), p).toBe(false);
    }
  });
});

/* Old /post/ URLs (the previous site) must land on a page that exists. Two of
   them pointed at a blog slug that was never published, so their visitors and
   link value went to a 404 (found by the weekly SEO agent, 24 Oct 2026). */
import { POSTS } from '../src/data/blogData.js';
import { EXPS } from '../src/data/mockData.js';
describe('old URL redirects', () => {
  it('every /blog/ or /expedition/ destination exists', () => {
    const blog = new Set(POSTS.map(p => p.slug)), trips = new Set(EXPS.filter(e => e.slug && !e.teaser).map(e => e.slug));
    for (const r of cfg.redirects || []) {
      const b = r.destination.match(/^\/blog\/([^/?#]+)$/), t = r.destination.match(/^\/expedition\/([^/?#]+)$/);
      if (b) expect(blog.has(b[1]), r.destination).toBe(true);
      if (t) expect(trips.has(t[1]), r.destination).toBe(true);
    }
  });
});

/* Old Wix URLs Bing still crawls (24 Oct 2026). Each must redirect, and the
   /post/ catch-all must come after every specific /post/ rule (Vercel takes
   the first match). */
describe('old Wix URLs', () => {
  const rules = (cfg.redirects || []).filter(r => !r.has);
  const first = p => rules.find(r => new RegExp('^' + r.source.replace(/:path\*$/, '.*') + '$').test(p));
  it('redirect to a live page', () => {
    expect(first('/langtang').destination).toBe('/treks');
    expect(first('/pirin').destination).toBe('/treks');
    expect(first('/post/kazbek').destination).toBe('/expedition/kazbek');
    expect(first('/post/magnus').destination).toBe('/blog');
    expect(first('/post/some-other-old-post').destination).toBe('/blog');
  });
  it('the /post/ catch-all is the last /post/ rule', () => {
    const posts = rules.filter(r => r.source.startsWith('/post/'));
    expect(posts.at(-1).source).toBe('/post/:path*');
  });
});
