/* German / Spanish for the safari pages (6 Nov 2026). The safari content is
   written in Hebrew + English; src/i18n/safari-de.js and safari-es.js map each
   English string to its translation.

   In the browser the dictionaries arrive with the German / Spanish site only
   (src/i18n/foreign.js), so the data is not translated up front: localize(obj)
   marks the objects, and loc() in src/website/lang.js translates a marked
   object's xEn field when the German or Spanish page reads it. A string with
   no translation stays English. bake(obj, dicts) is the old eager form, for
   records written out at build time (tripI18n.js -> trips/de.json). */
export const TRANSLATE = Symbol('translate-from-English');
const SKIP = new Set(['img', 'src', 'image', 'icon', 'key', 'slug', 'href', 'url', 'id', 'rating', 'x', 'y', 'lat', 'lng']);

export function tr(dict, v) {
  if (!dict) return v;
  if (typeof v === 'string') return dict[v] ?? v;
  if (Array.isArray(v)) return v.map(x => tr(dict, x));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, SKIP.has(k) ? x : tr(dict, x)]));
  return v;
}

/** Marks obj (and every object inside it that is not itself a translation) so
 *  loc() translates its xEn fields on the German and Spanish sites. */
export function localize(obj) {
  if (Array.isArray(obj)) { obj.forEach(localize); return obj; }
  if (!obj || typeof obj !== 'object') return obj;
  /* Enumerable on purpose: a symbol key survives {...spread} copies (the route
     map spreads its nodes), yet stays out of Object.entries and JSON. */
  Object.defineProperty(obj, TRANSLATE, { value: true, enumerable: true, configurable: true, writable: true });
  for (const [k, v] of Object.entries(obj)) if (v && typeof v === 'object' && !/(En|De|Es)$/.test(k)) localize(v);
  return obj;
}

/** Adds xDe / xEs beside every xEn of obj, from the given dictionaries. */
export function bake(obj, dicts) {
  if (Array.isArray(obj)) { obj.forEach(o => bake(o, dicts)); return obj; }
  if (!obj || typeof obj !== 'object') return obj;
  for (const k of Object.keys(obj)) {
    if (!k.endsWith('En') || obj[k] == null) continue;
    const base = k.slice(0, -2);
    obj[base + 'De'] = tr(dicts.de, obj[k]);
    obj[base + 'Es'] = tr(dicts.es, obj[k]);
  }
  for (const [k, v] of Object.entries(obj)) if (v && typeof v === 'object' && !k.endsWith('En') && !/(De|Es)$/.test(k)) bake(v, dicts);
  return obj;
}
