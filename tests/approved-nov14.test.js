/* Three items the owner approved on the open list (12 Nov 2026) and told us to build (14 Nov 2026):
   the exact departure travels with a lead; the minimum age on Kilimanjaro is 10, with a parent or an adult. */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { chosenDeparture, departureText, departureLogLine, hebrewLeadEmail, foreignLeadEmail } from '../api/submit-lead.js';
import { EXPS } from '../src/data/mockData.js';
import { profileFromItinerary } from '../src/website/altitudeProfile.js';
import { POSTS } from '../src/data/blogData.js';

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
