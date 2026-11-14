/* Three items the owner approved on the open list (12 Nov 2026) and told us to build (14 Nov 2026):
   the exact departure travels with a lead; the minimum age on Kilimanjaro is 10, with a parent or an adult. */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { chosenDeparture, departureText, departureLogLine, hebrewLeadEmail, foreignLeadEmail } from '../api/submit-lead.js';
import { EXPS } from '../src/data/mockData.js';
import { profileFromItinerary } from '../src/website/altitudeProfile.js';
import { POSTS } from '../src/data/blogData.js';
import { NAV_EXPS, CARD_EXPS } from '../src/data/navData.js';
import { savedTripName } from '../src/website/formRules.js';
import { DEST, destKey, destEn } from '../api/_lib/dest.js';
import { departureCount } from '../src/website/tripSchema.js';
import { rangeInWords } from '../src/data/tripI18n.js';

const read = f => fs.readFileSync(path.join(process.cwd(), f), 'utf8');
const strip = h => h.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

/* Content corrections the owner approved on 14 Nov 2026. A trip is read here in all four
   languages at once: Hebrew and English from mockData.js, German and Spanish as mockData.js
   builds them from src/data/trip-i18n. */
const trip = slug => EXPS.find(e => e.slug === slug);
const LANGS = { he: '', en: 'En', de: 'De', es: 'Es' };
const strings = v => typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : [];
const sentences = v => strings(v).flatMap(s => s.split(/(?<=[.!?])\s+|\n+/));

describe('"details" beside a departure date: the exact date and the route reach the lead', () => {
  it('only a plain date and a plain event name are taken', () => {
    expect(chosenDeparture({ date: '2027-01-03', returnDate: '2027-01-13', event: 'Kilimanjaro_with_Safari' })).toEqual({ date: '2027-01-03', returnDate: '2027-01-13', event: 'Kilimanjaro with Safari' });
    expect(chosenDeparture({ date: '2027-01-03T00:00:00.000Z' })).toEqual({ date: '2027-01-03', returnDate: '', event: '' });
    for (const bad of [null, undefined, {}, 'x', { date: '03/01/2027' }, { date: '2027-13-45' }, { date: '<b>2027-01-03</b>' }]) expect(chosenDeparture(bad), JSON.stringify(bad)).toBeNull();
    /* a return date or an event that is anything else is dropped, the date stays */
    expect(chosenDeparture({ date: '2027-01-03', returnDate: 'soon', event: '<script>alert(1)</script>' })).toEqual({ date: '2027-01-03', returnDate: '', event: '' });
    expect(chosenDeparture({ date: '2027-01-03', event: 'x'.repeat(61) }).event).toBe('');
  });
  it('one line, in the shape of the lead\'s log', () => {
    const d = chosenDeparture({ date: '2027-01-03', returnDate: '2027-01-13', event: 'Kilimanjaro_with_Safari' });
    expect(departureText(d)).toBe('03.01.2027 to 13.01.2027 · Kilimanjaro with Safari');
    expect(departureText({ date: '2027-02-17', returnDate: '', event: '' })).toBe('17.02.2027');
    expect(departureLogLine(d, new Date('2026-11-14T08:30:00Z'))).toBe('[14 Nov, 10:30] Asked about the departure of 03.01.2027 to 13.01.2027 · Kilimanjaro with Safari');
    expect(departureLogLine(d)).not.toMatch(/[—–]/);
  });
  it('the server writes it: the log of a new card, the note on an open card of the same trip, the office email', () => {
    const api = read('api/submit-lead.js');
    expect(api).toContain("const departure = chosenDeparture(req.body?.departure);");
    expect(api).toContain("saved = await saveLead(LEADS_URL, TOKEN, { ...airtableFields, Stage: 'New Lead', ...(departure ? { 'Activity Log': departureLogLine(departure) } : {}) });");
    expect(api).toContain("${departure ? ` | יציאה שנבחרה: ${departureText(departure)}` : ''}");
    /* never a field the form itself may set */
    const allowed = api.slice(api.indexOf('const AIRTABLE_FIELDS = new Set(['), api.indexOf(']);', api.indexOf('const AIRTABLE_FIELDS = new Set([')));
    expect(allowed).not.toContain('Activity Log');
    /* the month the Lead Center groups by is left exactly as it was */
    expect(read('src/components/web_v2/ExpeditionDetail.jsx')).toContain("'Preferred Month': form.month,");
  });
  it('the office email names the chosen departure, in Hebrew and in English, and says nothing when none was chosen', () => {
    const lead = { Name: 'Dana Levi', Email: 'd@example.com', Phone: '+972501234567', Expedition: 'Kilimanjaro', 'Preferred Month': 'ינואר 2027', 'Group Size': '2', Source: 'Expedition Page - קילימנג׳רו' };
    const chosen = '03.01.2027 to 13.01.2027 · Kilimanjaro with Safari';
    expect(strip(hebrewLeadEmail(lead, {}, chosen).html)).toContain('יציאה שנבחרה');
    expect(strip(hebrewLeadEmail(lead, {}, chosen).html)).toContain(chosen);
    expect(strip(hebrewLeadEmail(lead, {}).html)).not.toContain('יציאה שנבחרה');
    expect(strip(foreignLeadEmail(lead, 'German', {}, chosen).html)).toContain('Chosen departure');
    expect(strip(foreignLeadEmail(lead, 'German', {}, chosen).html)).toContain(chosen);
    expect(strip(foreignLeadEmail(lead, 'German', {}).html)).not.toContain('Chosen departure');
  });
  it('the trip page remembers the row whose button was pressed, and forgets it when a month is picked by hand', () => {
    const page = read('src/components/web_v2/ExpeditionDetail.jsx');
    expect(page).toContain("setPickedDeparture({ date: String(g.departure || '').slice(0, 10), returnDate: String(g.returnDate || '').slice(0, 10), event: g.eventName || '' });");
    expect(page).toContain("setPickedDeparture(null); setForm(f => ({ ...f, month: e.target.value }));");
    expect(page).toContain("...(pickedDeparture ? { departure: pickedDeparture } : {}),");
  });
});

describe('minimum age on Kilimanjaro: 10, with a parent or an adult (owner, 12 Nov 2026)', () => {
  it('the form lets a ten-year-old ask about Kilimanjaro, and keeps 16 on every other trip', () => {
    const page = read('src/components/web_v2/ExpeditionDetail.jsx');
    expect(page).toContain("const minAge = exp?.slug?.includes('kilimanjaro') ? 10 : 16;");
    expect(page).toContain('if (val && n < minAge) {');
    expect(page).toContain('min={minAge} max="99"');
    expect(page).not.toContain('min="16"');
    expect(page).toContain("'גיל מינימלי להשתתפות הוא 10, בליווי הורה או מבוגר'");
    expect(page).toContain("'גיל מינימלי להשתתפות הוא 16'");
  });
  it('the form\'s message exists in German and in Spanish', () => {
    const key = 'Minimum age to participate is 10, with a parent or an adult';
    expect(JSON.parse(read('src/i18n/ui-de.json'))[key]).toMatch(/10 Jahre.*Begleitung/);
    expect(JSON.parse(read('src/i18n/ui-es.json'))[key]).toMatch(/10 años.*compañía/);
    expect(read('src/components/web_v2/ExpeditionDetail.jsx')).toContain(`tx("${key}")`);
  });
  it('the FAQ says it in all four languages', () => {
    const he_en = read('src/data/faqData.js'), de_es = read('src/data/tripI18n.js');
    expect(he_en).toContain('גיל המינימום הוא 10, בליווי הורה או מבוגר.');
    expect(he_en).toContain('The minimum age is 10, accompanied by a parent or an adult.');
    expect(de_es).toContain('Das Mindestalter ist 10 Jahre, in Begleitung eines Elternteils oder einer erwachsenen Person.');
    expect(de_es).toContain('La edad mínima es de 10 años, en compañía de uno de los padres o de un adulto.');
  });
  it('and so do the two Kilimanjaro guides in the magazine, in every language they are published in', () => {
    const blog = read('src/data/blogData.js');
    expect(blog.match(/גיל המינימום בשמורה הוא 10, בליווי הורה או מבוגר/g)).toHaveLength(2);
    expect(blog.match(/The minimum age in the park is 10, accompanied by a parent or an adult/g)).toHaveLength(2);
    for (const slug of ['kilimanjaro-climbing-guide', 'kosher-kilimanjaro-shabbat-guide']) {
      expect(read(`src/data/blog-intl/en/${slug}.json`), slug).toContain('The minimum age in the park is 10, accompanied by a parent or an adult');
      expect(read(`src/data/blog-intl/de/${slug}.json`), slug).toContain('Das Mindestalter im Park liegt bei 10 Jahren, in Begleitung eines Elternteils oder einer erwachsenen Person');
      expect(read(`src/data/blog-intl/es/${slug}.json`), slug).toContain('La edad mínima en el parque es de 10 años, en compañía de uno de los padres o de un adulto');
    }
    /* nowhere does a bare "the minimum is 10." remain in these sources */
    expect(blog).not.toMatch(/גיל המינימום בשמורה הוא 10[.,] (?!בליווי)/);
  });
});

describe('Elbrus: the snowcat goes up to 5,100 m, in every language (owner, 14 Nov 2026)', () => {
  const SNOWCAT = /snow ?cats?\b|Pistenraupe\b|máquina pisanieves\b|מזחלת שלג/i;
  it('every sentence that says how high the snowcat goes says 5,100 m', () => {
    const withHeight = sentences(trip('elbrus')).filter(s => SNOWCAT.test(s) && /\d[.,]?\d{3}\s?(?:m\b|מ׳)/.test(s));
    /* the summit day in four languages, the extras line in four, the note in three */
    expect(withHeight.length).toBeGreaterThanOrEqual(11);
    for (const s of withHeight) expect(s, s).toMatch(/(?:snow ?cat|Pistenraupe|pisanieves|מזחלת שלג)[^.]*?5[.,]?100\s?(?:m\b|מ׳)/i);
  });
  it('the summit day itself, in each language', () => {
    for (const [l, suffix] of Object.entries(LANGS)) {
      const day7 = trip('elbrus')[`itinerary${suffix}`][6].desc;
      expect(day7, l).toMatch(/5[.,]?100/);
      expect(day7, l).not.toMatch(/4[.,]?800/);
    }
  });
  it('Pastukhov Rocks, the acclimatisation climb, stays at 4,800 m', () => {
    for (const suffix of Object.values(LANGS)) expect(trip('elbrus')[`itinerary${suffix}`][4].desc).toMatch(/4[.,]?800/);
  });
  it('the magazine says the same', () => {
    const blog = read('src/data/blogData.js');
    expect(blog).toContain('מזחלת שלג עד גובה 5,100 מ׳');
    expect(blog).toContain('ride a snowcat up to 5,100 m');
    expect(blog).not.toMatch(/(?:snow ?cat|מזחלת שלג)[^.]{0,40}4[.,]?800/i);
  });
});

/* The magazine post about a trip, as text: Hebrew and its English twin from blogData.js, and
   the versions written for the foreign sites in src/data/blog-intl (en. shows that English). */
const magazine = slug => {
  const post = POSTS.find(p => p.slug === slug);
  const intl = l => JSON.stringify(JSON.parse(read(`src/data/blog-intl/${l}/${slug}.json`)));
  return { he: JSON.stringify(post.content), enTwin: JSON.stringify(post.contentEn), en: intl('en'), de: intl('de'), es: intl('es') };
};

describe('Ethiopia, day 11: the climb to the rock church Abuna Yemata Guh (owner, 14 Nov 2026)', () => {
  const CHURCH = { he: 'אבונה ימאתא גואה', en: 'Abuna Yemata Guh', de: 'Abuna Yemata Guh', es: 'Abuna Yemata Guh' };
  const GHERALTA = { he: 'גרלטה', en: 'Gheralta', de: 'Gheralta', es: 'Gheralta' };
  it('the trip page names it in the title and the description, as the programme does', () => {
    for (const [l, suffix] of Object.entries(LANGS)) {
      const day = trip('ethiopia')[`itinerary${suffix}`][10];
      expect(day.day ?? 11, l).toBe(11);
      expect(day.title, l).toContain(CHURCH[l]);
      expect(day.title, l).toMatch(/^(?:מקלה|Mekele) - .+ - (?:האוזן|Hawzen)$/);
      expect(day.desc, l).toContain(CHURCH[l]);
      expect(day.desc, l).toContain(GHERALTA[l]);
      expect(day.desc, l).toMatch(/2580\s?(?:m\b|מ׳)/);
      expect(day.desc, l).not.toMatch(/[—–]/);
    }
  });
  it('the other church is named nowhere: the trip, the magazine, any language', () => {
    const OTHER = /Abraha|Atsbeha|אבראהא|אצבהא/;
    expect(JSON.stringify(trip('ethiopia'))).not.toMatch(OTHER);
    for (const [where, text] of Object.entries(magazine('ethiopia-simien-trek-guide'))) expect(text, where).not.toMatch(OTHER);
  });
  it('the magazine names it in the day list and in the text, in every language', () => {
    const m = magazine('ethiopia-simien-trek-guide');
    expect(m.he.match(/אבונה ימאתא גואה/g)).toHaveLength(2);
    for (const l of ['enTwin', 'en', 'de', 'es']) expect(m[l].match(/Abuna Yemata Guh/g), l).toHaveLength(2);
    expect(m.he).toContain('יום 11: נסיעה צפונה אל גרלטה, טיפוס אל אבונה ימאתא גואה');
    for (const l of ['enTwin', 'en']) expect(m[l], l).toContain('Day 11: a drive north to Gheralta, a climb to Abuna Yemata Guh');
    expect(m.de).toContain('Tag 11: Fahrt nach Norden in die Region Gheralta, Aufstieg zur Abuna Yemata Guh');
    expect(m.es).toContain('Día 11: traslado hacia el norte, a Gheralta, subida a Abuna Yemata Guh');
  });
  it('the height of the church is in the text, not in the title: the altitude chart shows where the group sleeps', () => {
    for (const suffix of ['En', 'De', 'Es']) expect(profileFromItinerary(trip('ethiopia')[`itinerary${suffix}`]).some(d => d.day === 11), suffix).toBe(false);
  });
});

describe('Ethiopia, days 1, 7 and 12: no meal is promised in the day text (owner, 14 Nov 2026)', () => {
  const MEAL = { he: /ארוח|סעוד/, en: /dinner|lunch|meal|breakfast/i, de: /essen\b|Mahlzeit|Frühstück/i, es: /\bcena\b|comida|almuerz|desayun/i };
  const STOP = { he: ['שוק מרקאטו', 'טקס קפה אתיופי מסורתי (בונה)'], en: ['Merkato', 'coffee ceremony (buna)'], de: ['Merkato', 'Kaffeezeremonie (Buna)'], es: ['Merkato', 'café etíope (buna)'] };
  it('day 1 (arrival) and day 7 (to the desert) name no dinner, festive or not, and keep the briefing', () => {
    const BRIEFING = { he: 'תדרוך', en: 'briefing', de: 'Einweisung', es: 'sesión informativa' };
    for (const [l, suffix] of Object.entries(LANGS)) for (const n of [1, 7]) {
      const day = trip('ethiopia')[`itinerary${suffix}`][n - 1].desc;
      expect(day, `${l} day ${n}`).not.toMatch(MEAL[l]);
      expect(day, `${l} day ${n}`).toContain(BRIEFING[l]);
    }
  });
  it('day 12 keeps the stop in Addis Ababa, the Merkato market and the coffee ceremony, without a lunch', () => {
    for (const [l, suffix] of Object.entries(LANGS)) {
      for (const day of [trip('ethiopia')[`itinerary${suffix}`][11], trip('ethiopia')[`extensionItinerary${suffix}`][0]]) {
        expect(day.day ?? 12, l).toBe(12);
        expect(day.desc, l).not.toMatch(MEAL[l]);
        for (const part of STOP[l]) expect(day.desc, l).toContain(part);
      }
    }
  });
  it('the magazine: the day list opens without an opening dinner and ends with the market and the coffee, no lunch', () => {
    const m = magazine('ethiopia-simien-trek-guide');
    expect(m.he).toContain('"יום 1: טיסה מתל אביב לאדיס אבבה ותדרוך עם הצוות."');
    expect(m.enTwin).toContain('"Day 1: flight from Tel Aviv to Addis Ababa and a briefing with the team."');
    expect(m.en).toContain('"Day 1: arrival in Addis Ababa and a briefing with the team."');
    expect(m.de).toContain('"Tag 1: Ankunft in Addis Abeba und ein Briefing mit dem Team."');
    expect(m.es).toContain('"Día 1: llegada a Adís Abeba y reunión con el equipo."');
    for (const [where, text] of Object.entries(m)) {
      const days = text.match(/"(?:יום|Day|Tag|Día) (?:1|7|12):[^"]*"/g);
      expect(days, where).toHaveLength(3);
      for (const d of days) expect(d, where).not.toMatch(/ארוח|dinner|lunch|essen\b|\bcena\b|comida|almuerz/i);
      expect(days[2], where).toMatch(/מרקאטו|Merkato/);
    }
  });
});

describe('Ethiopia, day 8: the night is at Erta Ale camp, in every language (owner, 14 Nov 2026)', () => {
  it('the sleeping place of day 8 names Erta Ale', () => {
    const CAMP = { he: 'אוהלים במחנה ארטה אלה', en: 'Tents at Erta Ale camp', de: 'Zelte im Camp am Erta Ale', es: 'Tiendas en el campamento del Erta Ale' };
    for (const [l, suffix] of Object.entries(LANGS)) expect(trip('ethiopia')[`itinerary${suffix}`][7].accommodation, l).toBe(CAMP[l]);
  });
  it('the old Hebrew name of the camp is gone from the site', () => {
    for (const f of ['src/data/mockData.js', 'src/data/blogData.js', 'src/data/trips/base.json', 'src/data/trips/de.json', 'src/data/trips/es.json']) expect(read(f), f).not.toContain('אסקומה');
  });
});

describe('Ethiopia: the town before the Danakil is spelled Semera in Latin letters (owner, 14 Nov 2026)', () => {
  it('days 7 and 8 of the trip, in English, German and Spanish', () => {
    for (const suffix of ['En', 'De', 'Es']) {
      const [day7, day8] = [trip('ethiopia')[`itinerary${suffix}`][6], trip('ethiopia')[`itinerary${suffix}`][7]];
      expect(day7.title, suffix).toMatch(/ - Semera$/);
      expect(day7.desc, suffix).toContain('Semera');
      expect(day7.accommodation, suffix).toMatch(/^Hotel (?:in|en) Semera$/);
      expect(day8.title, suffix).toMatch(/^Semera - /);
    }
  });
  it('the old spelling is nowhere on the site, and Hebrew is as it was', () => {
    expect(JSON.stringify(trip('ethiopia'))).not.toContain('Samara');
    for (const [where, text] of Object.entries(magazine('ethiopia-simien-trek-guide'))) expect(text, where).not.toContain('Samara');
    for (const l of ['enTwin', 'en', 'de', 'es']) expect(magazine('ethiopia-simien-trek-guide')[l].match(/Semera/g), l).toHaveLength(2);
    expect(trip('ethiopia').itinerary[6].title).toBe('גונדר - אדיס אבבה - סמארה');
    expect(read('src/data/blogData.js')).not.toContain('Samara');
  });
});

describe('Peaks of the Balkans, day 5: Gjeravica is the highest point in Kosovo (owner, 14 Nov 2026)', () => {
  const FACT = { he: 'פסגת ג׳רביצה המתנשאת לגובה של 2656 מ׳, הנקודה הגבוהה בקוסובו.', en: 'Gjeravica, rising to 2656m, the highest point in Kosovo.', de: 'Gjeravica (2656 m), den höchsten Punkt des Kosovo.', es: 'Gjeravica (2656 m), el punto más alto de Kosovo.' };
  it('says so in all four languages', () => {
    for (const [l, suffix] of Object.entries(LANGS)) expect(trip('peaks-of-balkan')[`itinerary${suffix}`][4].desc, l).toContain(FACT[l]);
  });
  it('and nowhere "one of the highest"', () => {
    expect(JSON.stringify(trip('peaks-of-balkan'))).not.toMatch(/אחת הפסגות הגבוהות בקוסובו|one of the highest (?:peaks|mountains|points) in Kosovo|einen der höchsten (?:Berge|Gipfel) des Kosovo|una de las (?:montañas|cumbres) más altas de Kosovo/);
  });
});

describe('one English name for the Kilimanjaro trip for observant Jews: "Kilimanjaro (Religious)", the app\'s label (owner, 14 Nov 2026)', () => {
  const k = trip('kilimanjaro-kosher');
  it('the name the English site shows: trip page, card, menu, footer, search, breadcrumb, structured data', () => {
    expect(k.nameEn).toBe('Kilimanjaro (Religious)');
    for (const list of [NAV_EXPS, CARD_EXPS]) expect(list.find(e => e.slug === 'kilimanjaro-kosher').nameEn).toBe('Kilimanjaro (Religious)');
    /* each of these reads the name through loc(exp, 'name'), which is nameEn on the English site */
    expect(read('src/components/web_v2/ExpeditionExplorer.jsx')).toContain('aria-label={isEn ? (loc(exp, "name") || exp.name) : exp.nameHe}');
    expect(read('src/components/web_v2/ExpeditionDetail.jsx')).toContain("(loc(exp, 'name') || exp.name)");
    expect(read('scripts/generate-html-shells.mjs')).toContain('name:          exp.nameEn  || exp.name || exp.nameHe,');
  });
  it('the page title carries the new name and still says kosher; the description is as it was', () => {
    expect(k.seoTitleEn).toBe('Kilimanjaro (Religious): Kosher Climb | HighAir Expeditions');
    expect(k.seoDescriptionEn).toBe('Climb Kilimanjaro (5895m) on a fully glatt kosher expedition. 10 days, Shabbat in Arusha, kosher food throughout. 94% success rate. Optional kosher safari.');
  });
  it('no English text of the trip calls it "Kilimanjaro Kosher" any more, and the food is still described as kosher', () => {
    const english = Object.entries(k).filter(([key]) => /En$/.test(key));
    expect(english.length).toBeGreaterThan(8);
    expect(JSON.stringify(Object.fromEntries(english))).not.toMatch(/Kilimanjaro Kosher/i);
    expect(k.descEn).toContain('A fully kosher Kilimanjaro expedition');
    expect(k.highlightsEn).toContain('Fully glatt kosher meals');
  });
  it('what does not move: the address, the stored name, Hebrew, German and Spanish', () => {
    expect(k.slug).toBe('kilimanjaro-kosher');
    expect(k.name).toBe('Kilimanjaro Kosher');
    expect(k.nameHe).toBe('קילימנג׳רו לשומרי מסורת');
    expect(k.nameDe).toBe('Kilimandscharo Koscher');
    expect(k.nameEs).toBe('Kilimanjaro Kosher');
    expect(DEST['Kilimanjaro Kosher'].slug).toBe('kilimanjaro-kosher');
  });
  it('a call booked from the English booking page is still saved as the religious trip', () => {
    expect(savedTripName('Kilimanjaro (Religious)')).toBe('Kilimanjaro Kosher');
    expect(destKey(savedTripName(k.nameEn))).toBe('Kilimanjaro Kosher');
    expect(read('src/components/web_v2/BookCall.jsx')).toContain('savedTripName(loc(exp, "name") || exp.name)');
    /* and every other trip is sent exactly as it was */
    for (const e of NAV_EXPS.filter(e => e.slug !== 'kilimanjaro-kosher')) expect(savedTripName(e.nameEn), e.slug).toBe(e.nameEn);
  });
  it('the office email about a lead from abroad uses the same name', () => {
    expect(destEn('Kilimanjaro Kosher')).toBe('Kilimanjaro (Religious)');
    expect(destEn('קילימנג׳רו לשומרי מסורת')).toBe('Kilimanjaro (Religious)');
  });
});

describe('Manaslu Circuit: the village Shyala comes after Lho, on day 8 (owner, 14 Nov 2026)', () => {
  const SHYALA = /Shyala|שיאלה/;
  it('the trip page: day 7 (Namrung to Lho) does not name it, day 8 (Lho to Samagaon) stops there', () => {
    for (const [l, suffix] of Object.entries(LANGS)) {
      const days = trip('manaslu-circuit')[`itinerary${suffix}`];
      expect(days[6].title, l).toMatch(/^(?:נאמרונג - לו|Namrung - Lho) /);
      expect(days[7].title, l).toMatch(/^(?:לו - סאמגון|Lho - Samagaon) /);
      expect(days[6].desc, l).not.toMatch(SHYALA);
      expect(days[7].desc, l).toMatch(SHYALA);
      expect(days.filter(d => SHYALA.test(JSON.stringify(d))), l).toHaveLength(1);
    }
  });
  it('the magazine\'s day list: the same order, in every language', () => {
    for (const [where, text] of Object.entries(magazine('manaslu-circuit-trek-guide'))) {
      const day = n => text.match(new RegExp(`"(?:יום|Day|Tag|Día) ${n}:[^"]*"`))[0];
      expect(day(7), where).not.toMatch(SHYALA);
      expect(day(8), where).toMatch(SHYALA);
      expect(text.match(/Shyala|שיאלה/g), where).toHaveLength(1);
    }
  });
});

describe('the month tabs on a trip page count departures, not rows (owner, 14 Nov 2026)', () => {
  /* the rows the page builds from Airtable Groups: both lengths of a departure share its Group Name */
  const row = (groupName, departure, eventName, id = `${groupName}|${eventName}`) => ({ id, groupName, departure, eventName });
  const january = [
    row('Kili_03_01_27', '2027-01-03', 'Kilimanjaro'), row('Kili_03_01_27', '2027-01-03', 'Kilimanjaro_with_Safari'),
    row('Kili_14_01_27', '2027-01-14', 'Kilimanjaro'), row('Kili_14_01_27', '2027-01-14', 'Kilimanjaro_with_Safari'),
    row('Kili_21_01_27', '2027-01-21', 'Kilimanjaro'), row('Kili_21_01_27', '2027-01-21', 'Kilimanjaro_with_Safari'),
  ];
  it('three January departures, each with and without the safari, are 3 and not 6', () => {
    expect(january).toHaveLength(6);
    expect(departureCount(january)).toBe(3);
  });
  it('the trek and the trek with the tribes on one date are one departure', () => {
    expect(departureCount([row('Eth_17_01_27', '2027-01-17', 'Ethiopia'), row('Eth_17_01_27', '2027-01-17', 'Ethiopia_with_Tribes')])).toBe(1);
  });
  it('two groups on one date stay two: a women\'s group, a second guided group', () => {
    expect(departureCount([row('Kili_25_12_26', '2026-12-25', 'Kilimanjaro'), row('Kili_25_12_Women', '2026-12-25', 'Kilimanjaro')])).toBe(2);
    expect(departureCount([row('Kili_23_09_A', '2027-09-23', 'Kilimanjaro'), row('Kili_23_09_B', '2027-09-23', 'Kilimanjaro')])).toBe(2);
  });
  it('a trip with one length counts as before, a date written with its time is the same day, and nothing is 0', () => {
    expect(departureCount([row('Elbrus_15_06_27', '2027-06-15', 'Elbrus'), row('Elbrus_13_07_27', '2027-07-13', 'Elbrus')])).toBe(2);
    expect(departureCount([row('Kili_03_01_27', '2027-01-03', 'Kilimanjaro'), row('Kili_03_01_27', '2027-01-03T00:00:00.000Z', 'Kilimanjaro_with_Safari')])).toBe(1);
    /* a row with no Group Name is named by its record id on the page, so it is never folded into another */
    expect(departureCount([{ id: 'recA', groupName: 'recA', departure: '2027-01-03' }, { id: 'recB', groupName: 'recB', departure: '2027-01-03' }])).toBe(2);
    expect(departureCount([])).toBe(0);
    expect(departureCount(undefined)).toBe(0);
  });
  it('the trip page uses it for the number beside each month', () => {
    const page = read('src/components/web_v2/ExpeditionDetail.jsx');
    expect(page).toContain('const count = departureCount(groupsForYear.filter(g => monthKey(g.departure) === key));');
    expect(page).not.toContain('const count = groupsForYear.filter(g => monthKey(g.departure) === key).length;');
  });
});

describe('no dash in the German and Spanish copy (owner, 14 Nov 2026; 165 en dashes in German and 146 in Spanish before)', () => {
  const DASH = /[\u2013\u2014]/;
  const dashed = list => list.filter(s => DASH.test(s));
  const SUFFIX = { de: 'De', es: 'Es' };
  for (const l of ['de', 'es']) {
    it(`${l}: the trips, as mockData.js builds them and as the site loads them`, () => {
      const fields = exps => exps.flatMap(e => Object.entries(e).filter(([key]) => key.endsWith(SUFFIX[l])).flatMap(([, v]) => strings(v)));
      expect(fields(EXPS).length).toBeGreaterThan(2000);
      expect(dashed(fields(EXPS))).toEqual([]);
      expect(dashed(fields(JSON.parse(read(`src/data/trips/${l}.json`))))).toEqual([]);
    });
    it(`${l}: the interface texts, the safari pages and the magazine`, async () => {
      expect(dashed(strings(JSON.parse(read(`src/i18n/ui-${l}.json`))))).toEqual([]);
      for (const f of [`res-${l}.js`, `safari-${l}.js`]) expect(dashed(strings(Object.values(await import(`../src/i18n/${f}`)))), f).toEqual([]);
      const dir = `src/data/blog-intl/${l}`;
      const posts = fs.readdirSync(path.join(process.cwd(), dir));
      expect(posts.length).toBeGreaterThan(20);
      for (const f of posts) expect(dashed(strings(JSON.parse(read(`${dir}/${f}`)))), f).toEqual([]);
    });
  }
  it('a range is written with the word: bis in German, a in Spanish', () => {
    expect(rangeInWords('de', '3\u20134 hours')).toBe('3 bis 4 hours');
    expect(rangeInWords('es', '~5\u20137 hours')).toBe('~5 a 7 hours');
    expect(rangeInWords('de', '10 \u2013 12 km')).toBe('10 bis 12 km');
    expect(rangeInWords('es', '15 km')).toBe('15 km');
    const day = (slug, n, l) => trip(slug)[`itinerary${SUFFIX[l]}`][n - 1];
    expect(day('ethiopia', 4, 'de').distance).toBe('10 bis 12 km');
    expect(day('ethiopia', 4, 'de').duration).toBe('~5 bis 7 Stunden');
    expect(day('ethiopia', 4, 'es').duration).toBe('~5 a 7 horas');
    expect(day('everest-base-camp', 3, 'es').duration).toBe('3 a 4 horas');
    expect(trip('kilimanjaro').seasonsDe).toEqual(['Januar bis Februar', 'Juni bis Oktober']);
    expect(trip('kilimanjaro').seasonsEs).toEqual(['enero a febrero', 'junio a octubre']);
  });
  it('the English record the numbers come from is as it was', () => {
    expect(trip('ethiopia').itineraryEn[3].distance).toBe('10\u201312 km');
    expect(trip('ethiopia').itineraryEn[3].duration).toBe('~5\u20137 hours');
  });
  it('and never a hyphen between spaces in its place', () => {
    const de = JSON.parse(read('src/i18n/ui-de.json'));
    expect(de['Booking error - please try again']).toBe('Fehler bei der Buchung, bitte erneut versuchen');
    expect(de['Confirm Call - {0} at {1}']).toBe('Gespräch bestätigen: {0} um {1}');
    expect(de['{0} is Full - no available spots']).toBe('{0} ist ausgebucht, keine Plätze frei');
    expect(read('src/data/blog-intl/de/island-peak-climbing-guide.json')).toContain('mit dem Hubschrauber von Kathmandu nach Lukla und zurück fliegen');
    expect(read('src/data/blog-intl/es/island-peak-climbing-guide.json')).toContain('puedes volar de Katmandú a Lukla y de vuelta en helicóptero');
  });
});
