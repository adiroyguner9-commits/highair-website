/* Google Business Profile rating, one source for every place the site shows it
   (owner, 17 Nov 2026: the number updates by itself). The live figures come from
   api/google-rating.js (Places API, refreshed about once a day); these are the
   last known ones, shown until the live answer arrives and kept if Google cannot
   be reached. Update them when convenient, nothing breaks if they are old. */
export const GOOGLE_RATING_FALLBACK = { rating: 5.0, count: 296 };

/* How the API finds our listing the first time (no Place ID to configure): a text
   search near the office, keeping only a result whose name says HighAir. */
export const GOOGLE_PLACE_QUERY = 'HighAir Expeditions';
export const GOOGLE_PLACE_NEAR  = { latitude: 31.9340141, longitude: 34.8257211 };

/* A figure is used only if it looks like ours: a real rating and a count that did
   not collapse (a wrong listing would show a handful of reviews). */
export function plausibleRating(r, fallback = GOOGLE_RATING_FALLBACK) {
  return !!r
    && Number.isFinite(r.rating) && r.rating >= 1 && r.rating <= 5
    && Number.isInteger(r.count) && r.count >= Math.floor(fallback.count * 0.8);
}

/* "5.0", never "5" */
export const ratingText = r => Number(r).toFixed(1);
