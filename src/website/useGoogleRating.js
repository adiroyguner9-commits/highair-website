/* The live Google rating for the page (api/google-rating.js), asked once per visit.
   Shows the last known figures at once and swaps in the live ones when they land,
   so nothing waits and nothing jumps from 0. */
import { useEffect, useState } from 'react';
import { GOOGLE_RATING_FALLBACK, plausibleRating } from '../data/googleRating.js';

let pending = null;
function loadRating() {
  if (!pending) {
    pending = fetch('/api/google-rating')
      .then(r => (r.ok ? r.json() : null))
      .then(d => (d && plausibleRating({ rating: Number(d.rating), count: Number(d.count) }) ? { rating: Number(d.rating), count: Number(d.count) } : GOOGLE_RATING_FALLBACK))
      .catch(() => GOOGLE_RATING_FALLBACK);
  }
  return pending;
}

export function useGoogleRating() {
  const [r, setR] = useState(GOOGLE_RATING_FALLBACK);
  useEffect(() => { let alive = true; loadRating().then(v => { if (alive) setR(v); }); return () => { alive = false; }; }, []);
  return r;
}
