/* German / Spanish for the safari pages (6 Nov 2026). The safari content is
   written in Hebrew + English; src/i18n/safari-de.json and safari-es.json map
   each English string to its translation. localize(obj) adds xDe / xEs next to
   every xEn field (strings, lists and nested objects alike), which is what
   loc(obj, 'x') reads on the German and Spanish sites. A string with no
   translation stays English. Pure: no i18n runtime here. */
import SDE from '../i18n/safari-de.js';
import SES from '../i18n/safari-es.js';

const DICT = { de: SDE, es: SES };
const SKIP = new Set(['img', 'src', 'image', 'icon', 'key', 'slug', 'href', 'url', 'id', 'rating', 'x', 'y', 'lat', 'lng']);

export function tr(lang, v) {
  if (typeof v === 'string') return DICT[lang][v] ?? v;
  if (Array.isArray(v)) return v.map(x => tr(lang, x));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, SKIP.has(k) ? x : tr(lang, x)]));
  return v;
}

/** Adds xDe / xEs beside every xEn of obj (and of each item, for an array). */
export function localize(obj) {
  if (Array.isArray(obj)) { obj.forEach(localize); return obj; }
  if (!obj || typeof obj !== 'object') return obj;
  for (const k of Object.keys(obj)) {
    if (!k.endsWith('En') || obj[k] == null) continue;
    const base = k.slice(0, -2);
    obj[base + 'De'] = tr('de', obj[k]);
    obj[base + 'Es'] = tr('es', obj[k]);
  }
  for (const [k, v] of Object.entries(obj)) if (v && typeof v === 'object' && !k.endsWith('En') && !/(De|Es)$/.test(k)) localize(v);
  return obj;
}
