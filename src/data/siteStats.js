/* The homepage stats bar, one source for the page and for the crawlers' text layer
   (scripts/lib/text-layer.mjs homeText). The numbers are shown as they are, never
   counted up from 0: a bot captures the first frame, and a count-up starts at 0
   (owner, 17 Nov 2026). */
import { CARD_EXPS } from './navData.js';

/* Destinations = the expeditions and treks shown as cards (safaris excluded), so the
   number follows the cards as trips are added or removed. */
export const DEST_COUNT = CARD_EXPS.filter(e => !String(e.slug || '').startsWith('safari')).length;

export const SITE_STATS = {
  climbers:    '1000+',
  donatedHe:   '₪240K+',
  donatedEn:   '$70K+',
  successRate: '94%',
};

/* The Hebrew labels, the same words as i18n.js stats.* (a test keeps them equal). */
export const STATS_LABELS_HE = {
  destinations: 'יעדים ברחבי העולם',
  climbers:     'מטיילים שהעפילו לפסגות',
  donated:      'נתרמו לחולי סרטן',
  successRate:  'אחוזי הצלחה',
};

/* [number, label] in the bar's order, for the Hebrew text layer. */
export const homeStatsHe = () => [
  [String(DEST_COUNT),      STATS_LABELS_HE.destinations],
  [SITE_STATS.climbers,     STATS_LABELS_HE.climbers],
  [SITE_STATS.donatedHe,    STATS_LABELS_HE.donated],
  [SITE_STATS.successRate,  STATS_LABELS_HE.successRate],
];
