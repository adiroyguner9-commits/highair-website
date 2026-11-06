/* lang.js: one place for "which language is this page in" (5 Nov 2026).

   The site started Hebrew + English, and the code asked `language === 'en'`
   whenever it meant "the foreign site". German and Spanish are foreign sites
   too, so:

   - isForeign()       true on en / de / es (everything that is not Hebrew)
   - loc(obj, 'name')  the field in the page's language: nameDe / nameEs on the
                       German / Spanish site, falling back to nameEn; nameEn on
                       the Hebrew and English sites (what the code read before)
   - tx('English')     UI text: the German / Spanish translation of an English
                       string (src/i18n/ui-de.json, ui-es.json), else the English.
                       Placeholders {0} {1} take values from the array argument.
   - BASE_URLS         the host each language lives on */
import { BLOG_LANGS } from './blogLangs.js';
import i18n from '../i18n.js';
import { FOREIGN } from '../i18n/foreign.js';
import { TRANSLATE, tr } from '../data/safariI18n.js';

export const LANGS = ['he', 'en', 'de', 'es'];
export const FOREIGN_LANGS = ['en', 'de', 'es'];

import { BASE_URLS, PARTIAL_LANGS, CORE_PATHS as CORE_LIST, CORE_TRIPS as CORE_TRIP_LIST } from './sites.js';
export { BASE_URLS, PARTIAL_LANGS };

/* The language a host serves: en. / de. / es. subdomains, else Hebrew. */
export function langOfHost(hostname = '') {
  const sub = String(hostname).split('.')[0];
  return FOREIGN_LANGS.includes(sub) ? sub : 'he';
}

export const currentLang = () => i18n.language || 'he';
export const isForeign = () => currentLang() !== 'he';

const SUFFIX = { de: 'De', es: 'Es' };

export function loc(obj, key) {
  if (!obj) return undefined;
  const suf = SUFFIX[currentLang()];
  if (suf) {
    const v = obj[key + suf];
    if (v !== undefined && v !== null && v !== '') return v;
    /* Safari content is translated when it is read (safariI18n.js) */
    const f = FOREIGN[currentLang()];
    if (obj[TRANSLATE] && f && obj[key + 'En'] != null) return tr(f.safari, obj[key + 'En']);
  }
  return obj[key + 'En'];
}

export function tx(english, args) {
  const dict = FOREIGN[currentLang()]?.dict;
  let out = (dict && dict[english]) || english;
  if (args) args.forEach((a, i) => { out = out.split(`{${i}}`).join(a == null ? '' : String(a)); });
  return out;
}

/* German and Spanish carry the core pages only (sites.js). Any other page on
   de./es. is kept out of search, out of the menus, and has no de/es hreflang
   pair; it still opens (in English text) if someone has the link. */
export const CORE_PATHS = new Set(CORE_LIST);
/* A blog post exists where it was published (src/website/blogLangs.js): German
   and Spanish carry the translated ones, posts about Israel stay Hebrew. */
export const hasPage = (lng, path) => {
  const p = String(path || '/').replace(/\/$/, '') || '/';
  const post = p.match(/^\/blog\/([^/]+)$/);
  if (post) return (BLOG_LANGS[post[1]] || ['he', 'en']).includes(lng);
  if (p === '/blog') return lng === 'he' || lng === 'en' || Object.values(BLOG_LANGS).some(l => l.includes(lng));
  return !PARTIAL_LANGS.includes(lng) || CORE_PATHS.has(p);
};
/* Trips offered on the German and Spanish sites */
export const CORE_TRIPS = new Set(CORE_TRIP_LIST);

/* English month names in a string ("October 2026") in the page's language,
   for dates stored only in English (summit updates). */
const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_LOCALE = { de: 'de-DE', es: 'es-ES' };
export function localMonths(str) {
  const loc = MONTH_LOCALE[currentLang()];
  if (!loc || !str) return str;
  return EN_MONTHS.reduce((out, m, i) => out.split(m).join(new Date(2026, i, 1).toLocaleDateString(loc, { month: 'long' })), String(str));
}
