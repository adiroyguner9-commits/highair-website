/* The Google rating updates by itself (owner, 17 Nov 2026): api/google-rating.js asks
   the Places API, the page shows the live figures, and anything doubtful falls back
   to the last known ones, never to a wrong number. */
import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import { GOOGLE_RATING_FALLBACK, plausibleRating, ratingText } from '../src/data/googleRating.js';
import handler, { fetchGoogleRating } from '../api/google-rating.js';

const res = () => { const r = { headers: {}, statusCode: 0, body: null };
  r.setHeader = (k, v) => { r.headers[k] = v; }; r.status = c => { r.statusCode = c; return r; };
  r.json = b => { r.body = b; return r; }; r.end = () => r; return r; };
const req = { method: 'GET', headers: { 'x-vercel-forwarded-for': '10.0.0.1' } };

describe('google rating', () => {
  it('accepts only figures that look like ours', () => {
    expect(plausibleRating({ rating: 5, count: 301 })).toBe(true);
    expect(plausibleRating({ rating: 4.9, count: GOOGLE_RATING_FALLBACK.count })).toBe(true);
    expect(plausibleRating({ rating: 4.2, count: 12 })).toBe(false);      // another listing
    expect(plausibleRating({ rating: 0, count: 300 })).toBe(false);
    expect(plausibleRating({ rating: NaN, count: 300 })).toBe(false);
    expect(ratingText(5)).toBe('5.0');
  });

  it('finds our listing once, then reads its rating and count', async () => {
    const calls = [];
    const fake = vi.fn(async (url, opts) => {
      calls.push(url);
      if (url.endsWith(':searchText')) return { ok: true, json: async () => ({ places: [{ id: 'other', displayName: { text: 'Some Agency' } }, { id: 'ours', displayName: { text: 'טרקים ומשלחות - HighAir Expeditions' } }] }) };
      return { ok: true, json: async () => ({ rating: 5, userRatingCount: 302 }) };
    });
    expect(await fetchGoogleRating('k', fake)).toEqual({ rating: 5, count: 302 });
    expect(calls[1]).toContain('/places/ours');
    await fetchGoogleRating('k', fake);
    expect(calls.filter(u => u.endsWith(':searchText')).length).toBe(1);   // the id is remembered
  });

  it('rejects an implausible answer', async () => {
    const fake = async () => ({ ok: true, json: async () => ({ rating: 3.1, userRatingCount: 9 }) });
    await expect(fetchGoogleRating('k', fake)).rejects.toThrow();
  });

  it('without a key the endpoint answers the last known figures', async () => {
    delete process.env.GOOGLE_PLACES_KEY;
    const r = res(); await handler(req, r);
    expect(r.statusCode).toBe(200);
    expect(r.body).toMatchObject({ ...GOOGLE_RATING_FALLBACK, source: 'fallback' });
  });

  it('no hard-coded review count is left on the page', () => {
    for (const f of ['src/i18n.js', 'src/i18n/res-de.js', 'src/i18n/res-es.js', 'src/components/web_v2/Header.jsx', 'src/components/web_v2/ReviewsSection.jsx', 'scripts/generate-html-shells.mjs']) {
      const src = fs.readFileSync(f, 'utf8').replace(/https:\/\/www\.google\.com\/maps[^"]*/g, '');
      expect(src, f).not.toMatch(/\b296\b/);
    }
    expect(fs.readFileSync('src/i18n.js', 'utf8')).toContain("basedOn: 'מבוסס על {{n}} ביקורות'");
  });
});
