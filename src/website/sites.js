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
/* Trips the German and Spanish sites offer: Kilimanjaro first, then a few
   treks and climbs (owner, 5 Nov 2026). Their copy: src/data/tripI18n.js. */
export const CORE_TRIPS = [
  'kilimanjaro', 'kilimanjaro-kosher',
  'everest-base-camp', 'annapurna', 'peaks-of-balkan',
  'aconcagua', 'island-peak',
];
export const CORE_PATHS = [
  '/', ...CORE_TRIPS.map(s => `/expedition/${s}`), '/treks', '/climbs',
  '/about', '/contact', '/annual-plan', '/app', '/terms', '/privacy', '/cancellation',
];
