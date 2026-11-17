/**
 * Our Google rating and review count, live (owner, 17 Nov 2026).
 *
 * Asks the Places API (New) for the listing's rating and userRatingCount and
 * lets the Vercel CDN keep the answer for a day, so Google is asked about once a
 * day per region: well inside the free quota. The listing is found once by a text
 * search near the office (no Place ID to configure; GOOGLE_PLACE_ID overrides it).
 *
 * Never a wrong number: anything that does not look like our listing (see
 * plausibleRating) or any failure returns the last known figures from
 * src/data/googleRating.js, cached for ten minutes so a hiccup heals itself.
 * Key: GOOGLE_PLACES_KEY (Vercel, Production), restricted to Places API (New).
 */
import { setSecurityHeaders, checkRateLimit } from './_security.js';
import { GOOGLE_RATING_FALLBACK, GOOGLE_PLACE_QUERY, GOOGLE_PLACE_NEAR, plausibleRating } from '../src/data/googleRating.js';

const PLACES = 'https://places.googleapis.com/v1';
let placeId = process.env.GOOGLE_PLACE_ID || null;   // remembered per warm instance

async function findPlaceId(key, fetchImpl) {
  const r = await fetchImpl(`${PLACES}/places:searchText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.id,places.displayName' },
    body: JSON.stringify({
      textQuery: GOOGLE_PLACE_QUERY,
      locationBias: { circle: { center: GOOGLE_PLACE_NEAR, radius: 5000 } },
    }),
  });
  if (!r.ok) throw new Error(`searchText ${r.status}`);
  const { places = [] } = await r.json();
  const ours = places.find(p => /highair/i.test(p.displayName?.text || ''));
  if (!ours) throw new Error('listing not found');
  return ours.id;
}

export async function fetchGoogleRating(key, fetchImpl = fetch) {
  if (!placeId) placeId = await findPlaceId(key, fetchImpl);
  const r = await fetchImpl(`${PLACES}/places/${encodeURIComponent(placeId)}`, {
    headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount' },
  });
  if (!r.ok) throw new Error(`details ${r.status}`);
  const d = await r.json();
  const out = { rating: Number(d.rating), count: Number(d.userRatingCount) };
  if (!plausibleRating(out)) throw new Error('implausible figures');
  return out;
}

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkRateLimit(req, 'google-rating')) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(429).json({ error: 'Too many requests' });
  }
  const key = process.env.GOOGLE_PLACES_KEY;
  if (!key) {
    res.setHeader('Cache-Control', 'public, s-maxage=3600');
    return res.status(200).json({ ...GOOGLE_RATING_FALLBACK, source: 'fallback' });
  }
  try {
    const live = await fetchGoogleRating(key);
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400');
    return res.status(200).json({ ...live, source: 'google' });
  } catch (e) {
    console.error('[google-rating]', e.message);
    res.setHeader('Cache-Control', 'public, s-maxage=600');
    return res.status(200).json({ ...GOOGLE_RATING_FALLBACK, source: 'fallback' });
  }
}
