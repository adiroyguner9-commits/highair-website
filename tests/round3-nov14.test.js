/* The owner's second set of decisions on 14 Nov 2026. A trip is read here in all four
   languages at once: Hebrew and English from mockData.js, German and Spanish as mockData.js
   builds them from src/data/trip-i18n. */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { EXPS } from '../src/data/mockData.js';
import { POSTS } from '../src/data/blogData.js';
import { NAV_EXPS } from '../src/data/navData.js';
import { savedTripName } from '../src/website/formRules.js';
import { DEST, destKey, destInfo, destHe } from '../api/_lib/dest.js';
import { tripKey } from '../api/_lib/active-lead.js';
import { coversFor } from '../api/_lib/callAgents.js';
import { departureCount } from '../src/website/tripSchema.js';
import { rangeInWords } from '../src/data/tripI18n.js';

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

describe('the booking page sends the name the server knows, for every trip on every site (owner, 14 Nov 2026)', () => {
  const page = read('src/components/web_v2/BookCall.jsx');
  /* the server's own row for a trip: the key in api/_lib/dest.js whose address is the trip's */
  const serverKey = slug => Object.keys(DEST).find(k => DEST[k].slug === slug) || '';
  /* one agent per row of the server's table, to ask "who would take this call" */
  const agents = Object.keys(DEST).map(k => ({ name: `agent of ${k}`, destinations: [k] }));
  const listed = NAV_EXPS.filter(e => serverKey(e.slug));
  const unlisted = NAV_EXPS.filter(e => !serverKey(e.slug));

  it('the name sent does not depend on the site language: it is the trip\'s Hebrew name, the one a trip page sends', () => {
    expect(page).toContain('const bookingExpedition = exp ? savedTripName(exp)');
    expect(page).not.toMatch(/bookingExpedition = exp \? \(isEn/);
    expect(read('src/components/web_v2/ExpeditionDetail.jsx')).toContain('expedition={exp?.nameHe}');
    expect(NAV_EXPS.length).toBeGreaterThan(20);
    for (const e of NAV_EXPS) {
      expect(savedTripName(e), e.slug).toBe(trip(e.slug).nameHe);
      expect(savedTripName(e), e.slug).toMatch(/[\u0590-\u05FF]/);
    }
  });
  it('every trip the server lists is read as itself: its row, its address, its Hebrew name in the messages', () => {
    expect(listed.length).toBeGreaterThanOrEqual(21);
    for (const e of listed) {
      const sent = savedTripName(e);
      expect(destKey(sent), e.slug).toBe(serverKey(e.slug));
      expect(destInfo(sent).slug, e.slug).toBe(e.slug);
      expect(destHe(sent), e.slug).toBe(DEST[serverKey(e.slug)].he);
    }
  });
  it('the call is matched to the trip\'s own card and to the agents who cover the trip', () => {
    for (const e of listed) {
      const sent = savedTripName(e);
      expect(tripKey(sent), e.slug).toBe(tripKey(serverKey(e.slug)));
      expect(coversFor(agents, sent), e.slug).toEqual(coversFor(agents, serverKey(e.slug)));
      expect(coversFor(agents, sent).length, e.slug).toBeGreaterThan(0);
    }
    /* no two trips share a card */
    const keys = listed.map(e => tripKey(savedTripName(e)));
    expect(new Set(keys).size).toBe(keys.length);
    /* the climb of Manaslu is the climb, not the circuit */
    const sentFor = slug => savedTripName(NAV_EXPS.find(e => e.slug === slug));
    expect(destKey(sentFor('manaslu'))).toBe('Manaslu Climb');
    expect(destKey(sentFor('manaslu-circuit'))).toBe('Manaslu');
    expect(coversFor(agents, sentFor('manaslu'))).toEqual(['Chen Shaked']);
  });
  it('the names the foreign sites show would not do: these are the ones that used to be sent', () => {
    const shown = slug => { const e = NAV_EXPS.find(x => x.slug === slug); return { en: e.nameEn, de: e.nameDe, es: e.nameEs }; };
    for (const name of [shown('ethiopia').en, shown('himlung-himal').en, shown('scardus').en, shown('kilimanjaro').de, shown('kilimanjaro-kosher').de, shown('kazbek').de, shown('olympus').de, shown('olympus').es, shown('ethiopia').de, shown('ethiopia').es]) {
      expect(name).toBeTruthy();
      expect(destKey(name), name).toBe('');
    }
    for (const l of ['en', 'de', 'es']) expect(destInfo(shown('manaslu')[l]).slug, l).toBe('manaslu-circuit');
  });
  it('what the visitor reads on the booking page is as it was: the name in the site\'s language', () => {
    expect(page).toContain('const destHe = exp ? (isEn ? loc(exp, "name") || exp.name : exp.nameHe) : \'\';');
    expect(NAV_EXPS.find(e => e.slug === 'kilimanjaro').nameDe).toBe('Kilimandscharo');
    expect(NAV_EXPS.find(e => e.slug === 'ethiopia').nameEn).toBe('Simien & Danakil Desert');
  });
  it('a trip the server has no row for is never read as another trip (three trips that are not on sale yet)', () => {
    expect(unlisted.map(e => e.slug).sort()).toEqual(['mestia-ushguli', 'mont-blanc', 'toubkal']);
    for (const e of unlisted) {
      expect(e.teaser || e.comingSoon, e.slug).toBeTruthy();
      expect(destKey(savedTripName(e)), e.slug).toBe('');
    }
  });
});

describe('the annual plan counts a departure once (owner, 14 Nov 2026)', () => {
  /* a card as the annual plan holds it: the group's name, its date, its event */
  const card = (groupName, departure, eventName) => ({ id: `${groupName}|${eventName}`, groupName, departure, eventName });
  const january = [
    card('Eth_17_01_27', '2027-01-17', 'Ethiopia'),
    card('Eth_17_01_27', '2027-01-17', 'Ethiopia_with_Tribes'),
    card('Kili_21_01_27', '2027-01-21', 'Kilimanjaro'),
  ];
  it('Ethiopia\'s trek and its trek with the tribes are two cards and one departure', () => {
    expect(january).toHaveLength(3);
    expect(departureCount(january)).toBe(2);
    expect(departureCount(january.slice(0, 2))).toBe(1);
  });
  it('two trips that leave on the same day are two departures, and a month of single cards counts as before', () => {
    expect(departureCount([card('Kili_03_02_27', '2027-02-03', 'Kilimanjaro'), card('Elbrus_03_02_27', '2027-02-03', 'Elbrus')])).toBe(2);
    expect(departureCount([card('Kili_03_02_27', '2027-02-03', 'Kilimanjaro'), card('Kili_14_02_27', '2027-02-14', 'Kilimanjaro'), card('EBC_20_02_27', '2027-02-20', 'Everest_Base_Camp')])).toBe(3);
  });
  it('the page uses the trip page\'s rule for both numbers of a month, and still draws every card', () => {
    const page = read('src/components/web_v2/AnnualPlan.jsx');
    expect(page).toContain("import { departureCount } from '../../website/tripSchema.js';");
    expect(page.split('{departureCount(byMonth[key])}')).toHaveLength(3);
    expect(page).toContain("{departureCount(byMonth[key])} {isRtl ? 'יציאות' : tx(\"departures\")}");
    expect(page).not.toContain('byMonth[key].length');
    expect(page).toContain('{byMonth[key].map(group => {');
    /* a card keeps the Group Name it was built from, which is what the count reads */
    expect(page).toContain("const groupName  = rec.fields['Group Name'] || rec.id;");
    expect(page).toContain('mergedMap.set(key, { ...g });');
  });
});

describe('no en dash and no em dash in the Hebrew and English copy (owner, 14 Nov 2026: "להחליף, כמו בגרמנית ובספרדית")', () => {
  const DASH = /[\u2013\u2014]/;
  /* every Hebrew and English string of a trip record, with the place it sits in */
  const texts = (v, at) => typeof v === 'string' ? [[at, v]]
    : Array.isArray(v) ? v.flatMap((x, i) => texts(x, `${at}[${i}]`))
    : v && typeof v === 'object' ? Object.entries(v).flatMap(([k, x]) => texts(x, `${at}.${k}`)) : [];
  const hebrewAndEnglish = exps => exps.flatMap(e => Object.entries(e).filter(([k]) => !/(De|Es)$/.test(k)).flatMap(([k, v]) => texts(v, `${e.slug}.${k}`)));
  /* the one mark that is not copy: a safari has no summit, and its height field holds a lone dash that no page prints */
  const noHeight = ([at, v]) => /^safari-\d-days\.elev$/.test(at) && v === '\u2014';
  const dashed = list => list.filter(([, v]) => DASH.test(v)).filter(x => !noHeight(x)).map(([at, v]) => `${at}: ${v.slice(0, 80)}`);

  it('the trip data, as mockData.js holds it and as the site loads it (147 en dashes and 5 em dashes before)', () => {
    expect(hebrewAndEnglish(EXPS).length).toBeGreaterThan(4000);
    expect(dashed(hebrewAndEnglish(EXPS))).toEqual([]);
    expect(dashed(hebrewAndEnglish(JSON.parse(read('src/data/trips/base.json'))))).toEqual([]);
    /* the check bites: one dash back in a day's hours is caught */
    const withDash = [{ slug: 'x', itinerary: [{ duration: '4\u20135 שעות' }], descEn: 'A pass \u2014 and a view' }];
    expect(dashed(hebrewAndEnglish(withDash))).toHaveLength(2);
  });
  it('a range of numbers is written with the word: עד in Hebrew, to in English', () => {
    expect(day('kilimanjaro', 2, 'he').duration).toBe('5 עד 7 שעות');
    expect(day('kilimanjaro', 2, 'en').duration).toBe('5 to 7 hours');
    expect(day('peaks-of-balkan', 3, 'he').distance).toBe('13 עד 14 ק"מ');
    expect(day('peaks-of-balkan', 3, 'en').distance).toBe('13 to 14 km');
    expect(day('everest-base-camp', 3, 'en').duration).toBe('3 to 4 hrs');
    expect(day('everest-base-camp', 3, 'en').desc).toContain('a 3 to 4 hour walk');
    expect(day('ethiopia', 8, 'en').travelTime).toBe('~5 to 7 hours driving (310 km)');
    expect(trip('elbrus').seoDescription).toContain('יום פסגה של 10 עד 14 שעות');
  });
  it('elsewhere the sentence is rebuilt with a comma, a colon or its own words', () => {
    expect(day('peaks-of-balkan', 5, 'he').desc).toContain('נגיע למעבר הרים גבוה על הגבול בין אלבניה לקוסובו.');
    expect(day('peaks-of-balkan', 5, 'en').desc).toContain('we reach a high mountain pass on the border between Albania and Kosovo.');
    expect(trip('manaslu-circuit').descEn).toContain('crossing Larkya La Pass at 5106 meters, a rewarding high-altitude crossing');
    expect(trip('everest-base-camp').descEn).toContain('sits at 5364m above sea level, the very starting point');
    expect(trip('everest-base-camp').descEn).toContain('culminates at Kala Patthar (5545m), one of the world\'s most spectacular viewpoints');
    expect(trip('lenin-peak').descEn).toContain('you\'ll experience real alpine climbing: establishing high camps');
    expect(trip('lenin-peak').descEn).toContain('The reward is a summit with no equal: an immense sense of achievement');
  });
  it('German and Spanish are built from the same English numbers and read as before: bis, a', () => {
    expect(rangeInWords('de', '7 to 8 hours')).toBe('7 bis 8 hours');
    expect(rangeInWords('es', '~5 to 7 hours')).toBe('~5 a 7 hours');
    expect(rangeInWords('de', '13 to 14 km')).toBe('13 bis 14 km');
    /* a dash is still read as a range, and words that are not a range are left alone */
    expect(rangeInWords('de', '7\u20138 hours')).toBe('7 bis 8 hours');
    expect(rangeInWords('es', 'Up to 1 hour to crater rim')).toBe('Up to 1 hour to crater rim');
    expect(rangeInWords('de', '+650m gain')).toBe('+650m gain');
    expect(day('peaks-of-balkan', 3, 'de').duration).toBe('7 bis 8 Stunden');
    expect(day('peaks-of-balkan', 3, 'es').duration).toBe('7 a 8 horas');
    expect(day('peaks-of-balkan', 3, 'de').distance).toBe('13 bis 14 km');
    expect(day('kilimanjaro', 2, 'de').duration).toBe('5 bis 7 Stunden');
    expect(day('kilimanjaro', 2, 'es').duration).toBe('5 a 7 horas');
    for (const [l, S] of [['de', 'De'], ['es', 'Es']]) {
      const all = EXPS.flatMap(e => Object.entries(e).filter(([k]) => k.endsWith(S)).flatMap(([, v]) => strings(v)));
      expect(all.filter(v => DASH.test(v)), l).toEqual([]);
      expect(all.filter(v => /\d to \d/.test(v)), l).toEqual([]);
    }
  });
  it('the magazine: Hebrew and English posts, and the posts written for the English site', () => {
    expect(strings(POSTS).filter(v => DASH.test(v))).toEqual([]);
    const dir = 'src/data/blog-intl/en';
    const posts = fs.readdirSync(path.join(process.cwd(), dir));
    expect(posts.length).toBeGreaterThan(20);
    for (const f of posts) expect(strings(JSON.parse(read(`${dir}/${f}`))).filter(v => DASH.test(v)), f).toEqual([]);
    for (const peak of ['island-peak', 'lobuche-peak', 'mera-peak']) {
      expect(read(`${dir}/${peak}-climbing-guide.json`)).toContain('you can fly from Kathmandu to Lukla and back by helicopter');
    }
  });
  it('the interface texts: the English sentences keep their German and Spanish translations under the new wording', () => {
    const contact = read('src/components/web_v2/ContactPage.jsx');
    const sentences = [
      'Whether you\'re planning your first summit or your tenth, we\'re here for every question, big or small.',
      'The fastest way to reach us is WhatsApp: we usually respond within minutes during business hours. You can also email us and we\'ll get back to you within 24 hours.',
    ];
    for (const l of ['de', 'es']) {
      const ui = JSON.parse(read(`src/i18n/ui-${l}.json`));
      for (const s of sentences) {
        expect(contact).toContain(`"${s}"`);
        expect(ui[s], `${l}: ${s.slice(0, 40)}`).toBeTruthy();
      }
      /* an English sentence is the key of its translation: no key carries a dash */
      expect(Object.keys(ui).filter(k => DASH.test(k)), l).toEqual([]);
    }
    expect(contact).toContain('צרו קשר עם צוות HighAir Expeditions: וואטסאפ, מייל או טלפון. מענה תוך 24 שעות.');
    expect(contact).toContain('שגיאה בשליחה, נסו שוב.');
    expect(read('src/i18n.js')).toContain('גלו את המשלחות שלנו: כל מסע עם HighAir גם תורם לחולי סרטן בישראל');
    expect(read('src/i18n.js')).toContain('Explore our expeditions: every journey with HighAir also supports cancer patients');
  });
  it('no text in the site\'s code carries one: what is left is the lone mark for a missing value, a component nothing uses and the hidden Israel treks', () => {
    const files = [];
    const walk = d => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (/\.(js|jsx)$/.test(f.name)) files.push(p); } };
    walk(path.join(process.cwd(), 'src'));
    expect(files.length).toBeGreaterThan(80);
    /* comments out: block comments, then line comments (a "//" that is not the one in "https://") */
    const code = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1');
    /* the mark shown where a value is missing (a price, a level, a date) is a glyph, not a sentence */
    const lone = /'[\u2013\u2014]'/g;
    const unused = 'FAQSection.jsx';
    /* the data of the Israel treks, a section hidden from the site since 23 Oct 2026, was not part of
       this decision: its hours and seasons still carry dashes, and no page shows them */
    const hidden = 'israelData.js';
    const left = [];
    for (const f of files) {
      if ([unused, hidden].includes(path.basename(f))) continue;
      code(fs.readFileSync(f, 'utf8')).split('\n').forEach(line => { if (DASH.test(line.replace(lone, "''"))) left.push(`${path.relative(process.cwd(), f)}: ${line.trim().slice(0, 100)}`); });
    }
    expect(left).toEqual([]);
    /* the component left out is one no page draws; the day one does, its four dashes have to go first */
    const importers = files.filter(f => path.basename(f) !== unused && /FAQSection/.test(fs.readFileSync(f, 'utf8')));
    expect(importers).toEqual([]);
    expect(read('src/data/israelFlag.js')).toContain('export const ISRAEL_TREKS_LIVE = false;');
  });
});
