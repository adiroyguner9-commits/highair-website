/* sites.js: the language sites and which pages the partial ones carry
   (5 Nov 2026). Plain data with no imports, so both the app (lang.js) and the
   build script (scripts/generate-html-shells.mjs) read the same lists. */
export const BASE_URLS = {
  he: 'https://www.highair-expeditions.com',
  en: 'https://en.highair-expeditions.com',
  de: 'https://de.highair-expeditions.com',
  es: 'https://es.highair-expeditions.com',
};
/* German and Spanish start with the core pages (owner, 5 Nov 2026). */
export const PARTIAL_LANGS = ['de', 'es'];
/* Trips the German and Spanish sites offer: every live trip of the English
   site (owner, 5 Nov 2026). Their copy: src/data/tripI18n.js. */
export const CORE_TRIPS = [
  'kilimanjaro', 'kilimanjaro-kosher',
  'everest-base-camp', 'annapurna', 'peaks-of-balkan', 'manaslu-circuit', 'ethiopia',
  'aconcagua', 'island-peak', 'lobuche-peak', 'mera-peak', 'olympus', 'kazbek',
  'lenin-peak', 'manaslu', 'ama-dablam', 'himlung-himal',
];
/* Legal pages: in English on every foreign site (the binding version), served
   by the app shell, so they have no static page of their own. */
function LEGAL_PATHS_LIST() { return ['/terms', '/privacy', '/cancellation', '/accessibility']; }
export const LEGAL_PATHS = LEGAL_PATHS_LIST();
export const CORE_PATHS = [
  '/', ...CORE_TRIPS.map(s => `/expedition/${s}`), '/treks', '/climbs',
  '/about', '/contact', '/annual-plan', '/app', ...LEGAL_PATHS_LIST(),
];

const FOREIGN_HOSTS = ['en', 'de', 'es'];
/* The language for a host (and a choice stored in this browser). Pure, so
   tests/de-es-sites.test.js can check every case. */
export function langForHost(host, stored) {
  // 1. Subdomain (en. / de. / es.highair-expeditions.com) → that language
  const sub = String(host || '').split('.')[0];
  if (FOREIGN_HOSTS.includes(sub)) return sub;
  /* On the real domain the address alone decides: www (and the bare domain)
     is always Hebrew. A choice stored in this browser must not turn the Hebrew
     site into another language (bug found 5 Nov 2026: someone who once picked
     a language on www kept getting it there). The stored choice below only
     matters on preview and local hosts, which have no language subdomain. */
  if (host === 'highair-expeditions.com' || String(host).endsWith('.highair-expeditions.com')) return 'he';
  // 2. Preview / local: the language picked with the toggle
  if (stored === 'he' || FOREIGN_HOSTS.includes(stored)) return stored;
  // 3. Default → Hebrew (browser language is intentionally ignored)
  return 'he';
}
