/* The owner's second set of decisions on 14 Nov 2026. A trip is read here in all four
   languages at once: Hebrew and English from mockData.js, German and Spanish as mockData.js
   builds them from src/data/trip-i18n. */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { EXPS } from '../src/data/mockData.js';
import { POSTS } from '../src/data/blogData.js';

const read = f => fs.readFileSync(path.join(process.cwd(), f), 'utf8');
const trip = slug => EXPS.find(e => e.slug === slug);
const LANGS = { he: '', en: 'En', de: 'De', es: 'Es' };
const day = (slug, n, l) => trip(slug)[`itinerary${LANGS[l]}`].find(d => d.day === n);
const strings = v => typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : [];

describe('Elbrus in Hebrew: no toast and no farewell dinner (owner, 14 Nov 2026: "להוריד מהעברית")', () => {
  it('day 8: the toast is gone, the rest of the sentence stays', () => {
    const d = day('elbrus', 8, 'he').desc;
    expect(d).not.toContain('כוסית');
    expect(d).toContain('זה הזמן לשתף רגעים ותמונות מהדרך, להודות לצוות המקומי וליהנות מהמטבח הקווקזי העשיר, עם המאפים והתבשילים המקומיים.');
  });
  it('day 9: the evening is the night transfer to the airport, as the English says', () => {
    const d = day('elbrus', 9, 'he').desc;
    expect(d).not.toContain('כוסית');
    expect(d).not.toContain('ארוחת פרידה');
    expect(d).toContain('בערב יוצאים בהסעה לילית לשדה התעופה במינרלנייה וודי, לקראת טיסת הבוקר המוקדמת הביתה.');
    expect(d).toContain('זה הזמן להיפרד מהקווקז ומהצוות, עם הרבה תמונות, חברויות חדשות וגאווה גדולה על הדרך שעשיתם.');
    expect(day('elbrus', 9, 'en').desc).toContain('In the evening we take the night transfer to Mineralnye Vody airport for the early morning flight home.');
  });
  it('no day of the Hebrew trip raises a glass or promises a farewell dinner, and the site loads the same text', () => {
    for (const exps of [EXPS, JSON.parse(read('src/data/trips/base.json'))]) {
      const he = strings(exps.find(e => e.slug === 'elbrus').itinerary).join(' ');
      expect(he).not.toMatch(/כוסית|ארוחת פרידה/);
    }
  });
  it('English, German and Spanish never said either, and still do not', () => {
    for (const l of ['en', 'de', 'es']) {
      const text = [8, 9].map(n => day('elbrus', n, l).desc).join(' ');
      expect(text, l).not.toMatch(/toast|farewell|raise a glass|Abschiedsessen|ansto(ß|ss)en|brind|cena de despedida/i);
    }
  });
  it('the Hebrew magazine guide: day 9 is the free day and the night transfer, without a farewell dinner', () => {
    const guide = strings(POSTS.find(p => p.slug === 'elbrus-climbing-guide').content);
    const day9 = guide.find(s => s.startsWith('יום 9:'));
    expect(day9).toBe('יום 9: יום חופשי בעמק בקסן והסעה לילית לשדה התעופה במינרלנייה וודי, לטיסת הבוקר הביתה.');
    expect(guide.join(' ')).not.toMatch(/כוסית|ארוחת פרידה/);
  });
});

describe('welcome, farewell and festive meals in the day texts are written as the programme writes them (owner, 14 Nov 2026: "לכתוב בכל מקום כמו בתכנית")', () => {
  /* The programme (the app's src/data/programs.js) on day 1 of every Nepal trip: "ובערב נפגשים
     לארוחת ערב חגיגית של קבלת פנים, ומכירים את חברי הקבוצה". It names no restaurant on that day. */
  const WELCOME = {
    he: 'בערב נפגשים לארוחת ערב חגיגית של קבלת פנים, ומכירים את חברי הקבוצה.',
    en: 'In the evening we meet for a festive welcome dinner and get to know the group.',
    de: 'Am Abend treffen wir uns zu einem festlichen Willkommensessen und lernen die Gruppe kennen.',
    es: 'Por la noche nos reunimos para una cena festiva de bienvenida y conocemos al grupo.',
  };
  for (const slug of ['everest-base-camp', 'manaslu-circuit']) {
    it(`${slug}, day 1: the welcome dinner closes the day, in all four languages`, () => {
      for (const l of Object.keys(LANGS)) {
        const d = day(slug, 1, l).desc;
        expect(d.endsWith(' ' + WELCOME[l]), `${slug} ${l}`).toBe(true);
        expect(d, `${slug} ${l}`).not.toMatch(/restaurant|Restaurant|restaurante|מסעד/);
      }
      /* the rest of the day is as it was */
      expect(day(slug, 1, 'he').desc).toContain('לאחר ההגעה למלון וקבלת החדרים, תוכלו לנוח ולהתכונן לקראת יום המחר. בערב');
      expect(day(slug, 1, 'en').desc).toContain('rest and prepare for the adventure ahead. In the evening');
    });
  }
  it('the site loads the same text: the generated trip files carry the sentence', () => {
    const files = { he: 'base', en: 'base', de: 'de', es: 'es' };
    for (const l of Object.keys(LANGS)) for (const slug of ['everest-base-camp', 'manaslu-circuit']) {
      const t = JSON.parse(read(`src/data/trips/${files[l]}.json`)).find(e => e.slug === slug);
      expect(t[`itinerary${LANGS[l]}`][0].desc, `${slug} ${l}`).toContain(WELCOME[l]);
    }
  });
  it('days that already agreed are as they were: the Shabbat dinner at Chabad House Arusha, no meal on the first evening in Shkodra', () => {
    const shabbat = { he: 'ארוחת שבת בבית חב״ד ארושה', en: 'Shabbat dinner at Chabad House Arusha', de: 'Schabbat-Abendessen im Chabad-Haus Arusha', es: 'cena de Shabat en la Casa Jabad de Arusha' };
    for (const l of Object.keys(LANGS)) {
      expect(day('kilimanjaro-kosher', 1, l).desc, l).toContain(shabbat[l]);
      expect(day('peaks-of-balkan', 1, l).desc, l).not.toMatch(/ארוחת|dinner|essen|cena/i);
    }
  });
});
