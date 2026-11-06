/* trips.js: the trip records, loaded for this site's language only.

   mockData.js carries every trip in every language (~690 KB). The pages that
   list or show trips (expedition page, safari, annual plan) read EXPS from
   here instead; main.jsx waits for loadTrips() together with the page's own
   code, so the array is full before the page renders.

     www / en.  -> trips/base.json  (Hebrew + English)
     de.        -> trips/de.json    (+ German)
     es.        -> trips/es.json    (+ Spanish)
     any other host (Vercel previews, localhost) -> mockData.js itself, since
     the language toggle there switches language without a reload.

   The files are written by scripts/split-trips.mjs (prebuild). */
export const EXPS = [];

let loading = null;
export function loadTrips(host = typeof window !== 'undefined' ? window.location.hostname : '') {
  if (!loading) {
    const sub = String(host).split('.')[0];
    const prod = host === 'highair-expeditions.com' || String(host).endsWith('.highair-expeditions.com');
    const pick = !prod ? import('./mockData.js').then(m => m.EXPS)
      : sub === 'de' ? import('./trips/de.json').then(m => m.default)
      : sub === 'es' ? import('./trips/es.json').then(m => m.default)
      : import('./trips/base.json').then(m => m.default);
    loading = pick.then(list => { EXPS.splice(0, EXPS.length, ...list); return EXPS; })
      .catch(e => { loading = null; throw e; });   // a failed chunk can be retried
  }
  return loading;
}
