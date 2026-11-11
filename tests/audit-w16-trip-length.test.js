/* Audit W16, the numbers (12 Nov 2026): a trip's English text said one length
   and its own `days` field another: Aconcagua 21 against 20, Lobuche 18
   against 19, Lenin 21 against 20. The `days` field is the right one, and the
   day-by-day itinerary agrees with it.

   The rule, for every trip and every language of the foreign sites: wherever
   the text states the length of the whole trip, it is the trip's own length. */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { EXPS } from '../src/data/mockData.js';

const trip = slug => EXPS.find(e => e.slug === slug);
const own = (e, S) => parseInt(e['days' + S] || '', 10);
const texts = (e, S) => [e['desc' + S], e['seoDescription' + S], e['experience' + S], ...(e['importantToNote' + S] || []), ...(e['highlights' + S] || [])].filter(Boolean).map(String);

/* How each language says "the whole trip is N days". A safari added after a
   climb ("3-day safari") and the days of walking inside a trip are not it. */
const WHOLE_TRIP = {
  En: [/\b(\d{1,2})-day (?:expedition|trek|climb|trip|journey|adventure|programme|program)\b/gi, /\b(\d{1,2}) days (?:in )?total\b/gi],
  De: [/\b(\d{1,2})-tägige\w* (?:\w+ )?(?:Expedition|Bergexpedition|Trek|Trekking|Besteigung|Reise|Tour)\b/gi, /\binsgesamt (\d{1,2}) Tage\b/gi],
  Es: [/\b(?:expedición|trek|ascenso|viaje|travesía)(?: técnica)? de (\d{1,2}) días\b/gi, /\b(\d{1,2}) días en total\b/gi],
};
const stated = (e, S) => texts(e, S).flatMap(t => WHOLE_TRIP[S].flatMap(r => [...t.matchAll(r)].map(m => ({ n: Number(m[1]), said: m[0] }))));

describe('W16: the three trips whose English text gave another length', () => {
  it('Aconcagua is a 20-day expedition', () => {
    const e = trip('aconcagua');
    expect(e.days).toBe('20 ימים');
    expect(e.daysEn).toBe('20 days');
    expect(e.descEn).toContain('This 20-day expedition uses the Normal Route');
    expect(e.descEn).not.toMatch(/21/);
    expect(e.itineraryEn).toHaveLength(20);
  });
  it('Lobuche Peak is a 19-day expedition', () => {
    const e = trip('lobuche-peak');
    expect(e.daysEn).toBe('19 days');
    expect(e.descEn).toContain('in a single 19-day expedition');
    expect(e.descEn).not.toMatch(/18-day/);
    expect(e.itineraryEn).toHaveLength(19);
  });
  it('Lenin Peak is 20 days in total', () => {
    const e = trip('lenin-peak');
    expect(e.daysEn).toBe('20 days');
    expect(e.importantToNoteEn.join('\n')).toContain('20 days in total.');
    expect(e.importantToNoteEn.join('\n')).not.toMatch(/\b21 days\b/);
    expect(e.itineraryEn).toHaveLength(20);
  });
});

describe('W16: no trip states a length other than its own', () => {
  for (const S of ['En', 'De', 'Es']) {
    it(`${S}: every "N-day expedition" and "N days in total" is the trip's days`, () => {
      const wrong = [];
      let seen = 0;
      for (const e of EXPS) {
        if (!own(e, S)) continue;
        for (const { n, said } of stated(e, S)) { seen++; if (n !== own(e, S)) wrong.push(`${e.slug}: days is ${own(e, S)}, the text says "${said}"`); }
      }
      expect(wrong).toEqual([]);
      expect(seen, 'the patterns still find sentences to check').toBeGreaterThan(3);
    });
  }
  it('the rule catches the old sentences', () => {
    const was = { slug: 'x', daysEn: '20 days', descEn: 'This 21-day expedition uses the Normal Route.', importantToNoteEn: ['3 rotations  -  21 days in total.'] };
    expect(stated(was, 'En').map(x => x.n)).toEqual([21, 21]);
  });
  it('every day-by-day itinerary ends on the day the trip says it has', () => {
    /* The long expeditions put several days in one row, so it is the last
       row's day number that is compared, in Hebrew and in English. */
    const lastDay = rows => Number(String(rows[rows.length - 1].day).match(/\d+/g).pop());
    let checked = 0;
    for (const e of EXPS) {
      if (!e.itineraryEn?.length || !own(e, 'En')) continue;
      expect(lastDay(e.itineraryEn), `${e.slug} (English)`).toBe(own(e, 'En'));
      if (e.itinerary?.length) expect(lastDay(e.itinerary), `${e.slug} (Hebrew)`).toBe(parseInt(e.days, 10));
      checked++;
    }
    expect(checked).toBeGreaterThan(15);
  });
});

describe('W16: the site files carry the corrected text', () => {
  it('trips/base.json, de.json and es.json were regenerated', () => {
    for (const f of ['base', 'de', 'es']) {
      const json = fs.readFileSync(`src/data/trips/${f}.json`, 'utf8');
      expect(json, f).toContain('This 20-day expedition uses the Normal Route');
      expect(json, f).toContain('in a single 19-day expedition');
      expect(json, f).toContain('20 days in total.');
      expect(json, f).not.toContain('This 21-day expedition');
      expect(json, f).not.toContain('single 18-day expedition');
      expect(json, f).not.toContain('21 days in the field');
    }
  });
});
