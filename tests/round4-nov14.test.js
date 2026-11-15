/* The owner's answers on the page, evening of 14 Nov 2026.
   - "להוסיף את המשפט": on the climbs the site lists as day titles only, the day the programme names a festive,
     welcome or farewell meal now carries that one sentence, in all four languages.
   - "בסיני צריך לכתוב לינה בבוסתן, ובפוקארה צריך לכתוב לינה במלון 4 כוכבים בפוקארה": the night line. */
import { describe, it, expect } from 'vitest';
import { EXPS } from '../src/data/mockData.js';

const LANGS = { he: '', en: 'En', de: 'De', es: 'Es' };
const trip = slug => EXPS.find(e => e.slug === slug);
const dayOf = (slug, lang, day) => { const e = trip(slug); const i = e.itinerary.findIndex(d => String(d.day) === String(day)); return e[`itinerary${LANGS[lang]}`][i]; };
const MEAL = {
  welcome: { he: /ארוחת ערב חגיגית של קבלת פנים/, en: /festive welcome dinner/, de: /festlichen Willkommensessen/, es: /cena festiva de bienvenida/ },
  farewell: { he: /ארוחת פרידה חגיגית במסעדה בקטמנדו/, en: /festive farewell dinner at a restaurant in Kathmandu/, de: /festlichen Abschiedsessen in einem Restaurant in Kathmandu/, es: /cena de despedida en un restaurante de Katmandú/ },
  summit: { he: /ארוחה חגיגית לציון הפסגה/, en: /festive meal to mark the summit/, de: /festlichen Essen zur Feier des Gipfels/, es: /comida festiva para celebrar la cumbre/ },
  aconcagua: { he: /ארוחת ערב חגיגית לציון סיום הטיפוס/, en: /festive dinner to mark the end of the climb/, de: /festlichen Abendessen zum Abschluss der Besteigung/, es: /cena festiva para celebrar el final del ascenso/ },
  lenin: { he: /ארוחה חגיגית ושינה עמוקה באוהל/, en: /a festive meal and a deep sleep in the tent/, de: /ein festliches Essen und tiefer Schlaf im Zelt/, es: /una comida festiva y un sueño profundo/ },
};
const PLAN = [
  ['aconcagua', 18, 'aconcagua'], ['lenin-peak', 17, 'lenin'],
  ['island-peak', 1, 'welcome'], ['island-peak', 18, 'farewell'], ['mera-peak', 1, 'welcome'], ['mera-peak', 17, 'farewell'],
  ['lobuche-peak', 1, 'welcome'], ['lobuche-peak', 17, 'farewell'],
  ['ama-dablam', 1, 'welcome'], ['ama-dablam', 22, 'summit'], ['ama-dablam', 28, 'farewell'],
  ['himlung-himal', 1, 'welcome'], ['himlung-himal', 23, 'summit'], ['manaslu', 1, 'welcome'], ['manaslu', 25, 'summit'],
  /* owner, 15 Nov 2026: the farewell dinner in Kathmandu on day 28, as on every other Nepal programme */
  ['himlung-himal', 28, 'farewell'], ['manaslu', 28, 'farewell'],
];

describe('the climbs with title-only days: the meal the programme names', () => {
  for (const [slug, day, meal] of PLAN) it(`${slug}, day ${day}`, () => {
    for (const lang of Object.keys(LANGS)) expect(dayOf(slug, lang, day).desc, `${slug} ${day} ${lang}`).toMatch(MEAL[meal][lang]);
  });
  it('only those days got a sentence: every other day of those climbs is still a title only', () => {
    const extra = [];
    for (const slug of new Set(PLAN.map(p => p[0]))) {
      const listed = PLAN.filter(p => p[0] === slug).map(p => String(p[1]));
      for (const lang of Object.keys(LANGS)) trip(slug)[`itinerary${LANGS[lang]}`].forEach((d, i) => {
        const day = String(trip(slug).itinerary[i].day);
        if (d.desc && !listed.includes(day)) extra.push(`${slug} ${day} ${lang}`);
      });
    }
    expect(extra).toEqual([]);
  });
  it('no dash in the new sentences', () => {
    for (const [slug, day] of PLAN) for (const lang of Object.keys(LANGS)) expect(dayOf(slug, lang, day).desc).not.toMatch(/[–—]/);
  });
});

describe('the night line in Sinai and in Pokhara', () => {
  it('Sinai, nights 1 to 4: a bustan', () => {
    for (const d of [1, 2, 3, 4]) { expect(dayOf('sinai', 'he', d).accommodation).toBe('בוסתן'); expect(dayOf('sinai', 'en', d).accommodation).toBe('Bustan'); }
  });
  it('Annapurna, the night in Pokhara: a 4-star hotel in Pokhara, in four languages', () => {
    const want = { he: 'מלון 4 כוכבים בפוקארה', en: '4-star hotel in Pokhara', de: '4-Sterne-Hotel in Pokhara', es: 'Hotel de 4 estrellas en Pokhara' };
    for (const [lang, v] of Object.entries(want)) expect(dayOf('annapurna', lang, 14).accommodation).toBe(v);
  });
});
