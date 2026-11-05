/* contact.js: the phone / WhatsApp number each site shows (5 Nov 2026).

   The Hebrew site keeps the Israeli sales line. Abroad, each country gets a
   local virtual number for customer service, answered by the AI agents on
   WhatsApp (owner, 5 Nov 2026). Until a country's number exists its entry is
   null and that site shows the Israeli number in international format.

   To switch a site to its local number, fill in its entry, e.g.
     de: { tel: '+4930xxxxxxx', display: '+49 30 xxxxxxx', wa: '4930xxxxxxx' },
   tel: for tel: links · display: as printed on the page · wa: digits only,
   for wa.me links. Nothing else in the code needs to change. */
/* No imports on purpose: waIntent.js and tests load this file outside the app.
   The page's language is on <html lang>, which i18n.js sets at startup. */
const pageLang = () => (typeof document !== 'undefined' && document.documentElement.lang) || 'he';

const ISRAEL = { tel: '+972555636975', display: '055-563-6975', wa: '972555636975' };

export const CONTACT_NUMBERS = {
  he: ISRAEL,
  en: null,
  de: null,
  es: null,
};

/* The number for the page's language (or a given one) */
export function contactFor(lang = pageLang()) {
  const own = CONTACT_NUMBERS[lang];
  if (own) return own;
  return { ...ISRAEL, display: '+972 55-563-6975' };
}

/* Every WhatsApp number of ours, for recognising our own wa.me links */
export const OUR_WA_NUMBERS = new Set(Object.values(CONTACT_NUMBERS).filter(Boolean).map(c => c.wa));

/* The greeting a WhatsApp chat opens with, in the site's language */
export const WA_GREETING = {
  he: 'היי! אני מעוניין/ת לשמוע עוד על המשלחות של HighAir 🏔️',
  en: "Hi! I'd love to hear more about HighAir expeditions 🏔️",
  de: 'Hallo! Ich würde gern mehr über die Expeditionen von HighAir erfahren 🏔️',
  es: '¡Hola! Me gustaría saber más sobre las expediciones de HighAir 🏔️',
};
export const WA_TRIP = {
  he: n => `היי! אני מעוניין/ת לשמוע עוד על ${n} 🏔️`,
  en: n => `Hi! I'd love to hear more about ${n} with HighAir 🏔️`,
  de: n => `Hallo! Ich würde gern mehr über ${n} mit HighAir erfahren 🏔️`,
  es: n => `¡Hola! Me gustaría saber más sobre ${n} con HighAir 🏔️`,
};
