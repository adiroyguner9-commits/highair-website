/**
 * expeditionGroups.js — the single source of truth for WHICH expeditions appear
 * WHERE. Everything is derived automatically from the expedition data, so adding
 * a destination to mockData.js makes it show up on the homepage, in the header
 * menu (desktop + mobile) and in the footer with no extra wiring.
 *
 * Classification: by `type` (Climbing / Trekking / Safari) and `continent`.
 * Only live expeditions flow through here (CARD_EXPS / NAV_EXPS already drop
 * live:false), and coming-soon teasers ride along like any other card — the
 * rendering layer decides they are not clickable.
 */
import { NAV_EXPS, CARD_EXPS } from './navData.js';

/* Data continent keys → i18n keys (t('explorer.continents.<key>')). */
export const CONTINENTS = [
  { data: 'africa',       i18n: 'africa',       flag: '🌍' },
  { data: 'europe',       i18n: 'europe',       flag: '🏔️' },
  { data: 'asia',         i18n: 'asia',         flag: '🌏' },
  { data: 'southamerica', i18n: 'southAmerica', flag: '🌎' },
];

export const isClimb = e => /climb/i.test(e.type || '');
export const isTrek  = e => /trek/i.test(e.type || '');

const byElev = (a, b) => (a.elevNum || 0) - (b.elevNum || 0);

/** Flat list of a type, low→high elevation (homepage sliders). */
function flat(list, pred) {
  return list.filter(pred).slice().sort(byElev);
}

/** Continent groups [{ i18n, flag, exps }] in CONTINENTS order, elev-sorted
    within each, empty continents dropped (header menu columns). */
function grouped(list, pred) {
  const items = list.filter(pred);
  return CONTINENTS
    .map(c => ({
      i18n: c.i18n,
      flag: c.flag,
      exps: items.filter(e => String(e.continent || '').toLowerCase() === c.data).sort(byElev),
    }))
    .filter(g => g.exps.length);
}

/* Homepage cards (CARD_EXPS carries the card fields). */
export const HOME_CLIMBS = flat(CARD_EXPS, isClimb);
export const HOME_TREKS  = flat(CARD_EXPS, isTrek);

/* Header menu, grouped by continent (NAV_EXPS carries the nav fields). */
export const MENU_CLIMBS = grouped(NAV_EXPS, isClimb);
export const MENU_TREKS  = grouped(NAV_EXPS, isTrek);

/* Footer, one flat list sorted low → high by altitude (same order as the
   homepage sliders). */
export const FOOTER_CLIMBS = HOME_CLIMBS;
export const FOOTER_TREKS  = HOME_TREKS;
