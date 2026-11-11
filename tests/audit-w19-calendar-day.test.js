/* Audit W19 (12 Nov 2026): a departure is a day on the calendar.

   '2027-01-21' was read with new Date(), which is midnight UTC, and shown with
   the visitor's local getters: a day early everywhere west of Greenwich, and a
   trip leaving on the 1st filed under the month (or the year) before. The
   pages now read the day from the string itself, through calendarDay(). */
import { describe, it, expect, afterAll } from 'vitest';
import fs from 'node:fs';
import { calendarDay } from '../src/website/calendarDay.js';

const read = f => fs.readFileSync(f, 'utf8');
const TZ0 = process.env.TZ;
afterAll(() => { if (TZ0 === undefined) delete process.env.TZ; else process.env.TZ = TZ0; });

/* The clocks a visitor can be on: the Americas (the Spanish site), Israel,
   the far east of the date line, and a city whose clocks change at midnight. */
const ZONES = ['America/Mexico_City', 'America/Los_Angeles', 'America/Argentina/Buenos_Aires', 'Asia/Jerusalem', 'Pacific/Kiritimati', 'America/Santiago'];
const parts = d => [d.getFullYear(), d.getMonth() + 1, d.getDate()];

describe('W19: the day that was written is the day that is shown', () => {
  it('the old reading really was a day early in the Americas (the bug)', () => {
    process.env.TZ = 'America/Mexico_City';
    expect(parts(new Date('2027-01-21'))).toEqual([2027, 1, 20]);
  });

  for (const zone of ZONES) {
    it(`${zone}: day, month and year come from the string`, () => {
      process.env.TZ = zone;
      expect(parts(calendarDay('2027-01-21'))).toEqual([2027, 1, 21]);
      /* the 1st of a month stays in its month, the 1st of January in its year */
      expect(parts(calendarDay('2027-03-01'))).toEqual([2027, 3, 1]);
      expect(parts(calendarDay('2027-01-01'))).toEqual([2027, 1, 1]);
      expect(parts(calendarDay('2026-12-31'))).toEqual([2026, 12, 31]);
      /* a day whose midnight does not exist in Santiago (clocks go forward at 00:00) */
      expect(parts(calendarDay('2026-09-06'))).toEqual([2026, 9, 6]);
    });
    it(`${zone}: the month label is the departure's own month, in each site language`, () => {
      process.env.TZ = zone;
      const label = l => calendarDay('2027-02-01').toLocaleDateString(l, { month: 'long', year: 'numeric' });
      expect(label('en-US')).toBe('February 2027');
      expect(label('es-ES')).toBe('febrero de 2027');
      expect(label('de-DE')).toBe('Februar 2027');
      expect(label('he-IL')).toBe('פברואר 2027');
    });
  }

  it('a full Airtable timestamp is read by its date part, and rubbish is an invalid date, not a throw', () => {
    process.env.TZ = 'America/Los_Angeles';
    expect(parts(calendarDay('2027-01-21T00:00:00.000Z'))).toEqual([2027, 1, 21]);
    expect(Number.isNaN(calendarDay('').getTime())).toBe(true);
    expect(Number.isNaN(calendarDay(null).getTime())).toBe(true);
    expect(Number.isNaN(calendarDay('soon').getTime())).toBe(true);
  });

  it('two departures still sort in calendar order', () => {
    process.env.TZ = 'America/Mexico_City';
    expect(calendarDay('2027-01-21') - calendarDay('2027-01-30')).toBeLessThan(0);
  });
});

describe('W19: the pages that show a departure read it with calendarDay()', () => {
  /* The body of a named helper, up to the closing brace at its own indent. */
  const body = (src, name) => {
    const at = src.indexOf(`function ${name}(`);
    expect(at, name).toBeGreaterThan(-1);
    const indent = /[ \t]*$/.exec(src.slice(0, at))[0];
    const end = src.indexOf(`\n${indent}}`, at);
    const oneLine = src.slice(at, src.indexOf('\n', at));
    return oneLine.trimEnd().endsWith('}') ? oneLine : src.slice(at, end);
  };
  const PAGES = {
    'src/components/web_v2/ExpeditionDetail.jsx': ['formatDateRange', 'monthKey', 'monthLabel'],
    'src/components/web_v2/AnnualPlan.jsx':       ['fmtDate', 'monthKey'],
    'src/components/web_v2/IsraelDetail.jsx':     ['formatDateRange', 'monthKey', 'monthLabel'],
  };
  for (const [file, helpers] of Object.entries(PAGES)) {
    it(`${file.split('/').pop()}: ${helpers.join(', ')}`, () => {
      const src = read(file);
      expect(src).toContain("from '../../website/calendarDay.js'");
      for (const h of helpers) {
        const b = body(src, h);
        expect(b, h).toContain('calendarDay(');
        expect(b, h).not.toMatch(/new Date\(/);
      }
    });
  }
  it('no page asks a UTC-parsed departure for its local day, month or year', () => {
    for (const file of Object.keys(PAGES)) {
      expect(read(file), file).not.toMatch(/new Date\([^()]*(departure|returnDate|dep|ret|str)\)\s*\.\s*(getDate|getMonth|getFullYear|toLocaleDateString)\(/);
    }
  });
});
