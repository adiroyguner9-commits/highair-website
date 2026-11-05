/* International groups (5 Nov 2026): the English site sells separate
   international departures. A trip with airtableEventsEn lists only those on
   en., and the Hebrew site keeps its own groups and never shows them. */
import { describe, it, expect } from 'vitest';
import { EXPS } from '../src/data/mockData.js';

const withIntl = EXPS.filter(e => e.airtableEventsEn?.length);

describe('international groups', () => {
  it('Kilimanjaro and Kilimanjaro Kosher have international group events', () => {
    expect(withIntl.map(e => e.slug).sort()).toEqual(['kilimanjaro', 'kilimanjaro-kosher']);
  });

  it('international events never overlap the Hebrew site\'s events', () => {
    const hebrew = new Set(EXPS.flatMap(e => e.airtableEvents || []).map(x => x.toLowerCase()));
    for (const e of withIntl) for (const ev of e.airtableEventsEn) expect(hebrew.has(ev.toLowerCase()), ev).toBe(false);
  });

  it('the English copy of those trips no longer points to Israel-only services', () => {
    for (const e of withIntl) {
      const text = JSON.stringify([e.descEn, e.includedEn, e.notIncludedEn, e.importantToNoteEn, e.itineraryEn]);
      expect(text, e.slug).not.toMatch(/trek in Israel|via our travel agent|via our insurance agent|back (home )?to Israel|Hebrew-speaking|preparation trek in Israel/);
    }
  });
});
