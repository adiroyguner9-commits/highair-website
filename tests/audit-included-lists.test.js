/* The night of 12 Nov 2026: two trips' English "included" / "not included"
   lists were one line shorter than the Hebrew ones, so an English reader was
   not told three things the Hebrew reader was:

   Sinai, included:      the ride from the Eilat central bus station to Taba
   Sinai, not included:  the border fee on the Israeli side, 120 shekels
   Scardus, included:    the transfers to the start of the route and back

   The rule, for every trip: the English list has a line for every Hebrew line. */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { EXPS } from '../src/data/mockData.js';

const trip = slug => EXPS.find(e => e.slug === slug);

describe('the English lists say what the Hebrew lists say', () => {
  it('every trip: as many English lines as Hebrew ones, included and not included', () => {
    const short = [];
    let checked = 0;
    for (const e of EXPS) for (const k of ['included', 'notIncluded']) {
      const he = e[k] || [], en = e[k + 'En'] || [];
      if (!he.length || !en.length) continue;
      checked++;
      if (he.length !== en.length) short.push(`${e.slug} ${k}: ${he.length} Hebrew, ${en.length} English`);
    }
    expect(short).toEqual([]);
    expect(checked).toBeGreaterThan(30);
  });
  it('no line is empty, and no English line carries Hebrew or a long dash', () => {
    for (const e of EXPS) for (const k of ['includedEn', 'notIncludedEn']) for (const line of e[k] || []) {
      expect(String(line).trim(), `${e.slug} ${k}`).toBeTruthy();
      expect(line, `${e.slug} ${k}`).not.toMatch(/[֐-׿—–]/);
    }
  });
});

describe('Sinai', () => {
  const e = trip('sinai');
  it('included: the ride from Eilat to the Taba crossing, where the Hebrew has it', () => {
    expect(e.included).toHaveLength(19);
    expect(e.includedEn).toHaveLength(19);
    const i = e.included.indexOf('הסעה מהתחנה המרכזית באילת למעבר טאבה');
    expect(i).toBe(2);
    expect(e.includedEn[i]).toBe('Transfer from the Eilat central bus station to the Taba border crossing');
    /* its neighbours did not move against their Hebrew lines */
    expect(e.includedEn[i + 1]).toBe('Transfers from the Taba border crossing and back');
    expect(e.included[i + 1]).toBe('הסעות מהגבול בטאבה ובחזרה');
    expect(e.includedEn.at(-1)).toBe('Meaningful donation to the fight against cancer!');
  });
  it('not included: the fee on the Israeli side, with the same 120 and the same footnote mark', () => {
    expect(e.notIncluded).toHaveLength(8);
    expect(e.notIncludedEn).toHaveLength(8);
    const i = e.notIncluded.indexOf('אגרת המעבר בצד הישראלי - 120 ₪ לאדם*');
    expect(i).toBe(2);
    expect(e.notIncludedEn[i]).toBe('Border fee on the Israeli side - ₪120 per person*');
    expect(e.notIncludedEn[i + 1]).toBe('Border fee on the Egyptian side - $120 per person*');
    expect(e.notIncluded[i + 1]).toBe('אגרת המעבר בצד המצרי - 120$ לאדם*');
  });
  it('the footnote speaks of both fees, as the Hebrew one does', () => {
    expect(e.notIncluded.at(-1)).toBe('* אגרות המעבר נקבעות על ידי רשויות הגבול ועשויות להשתנות');
    expect(e.notIncludedEn.at(-1)).toBe('* The border fees are set by the border authorities and may change');
    expect(e.notIncludedEn.filter(l => l.endsWith('*'))).toHaveLength(2);
  });
});

describe('Scardus', () => {
  const e = trip('scardus');
  it('included: the transfers to the start of the route, where the Hebrew has them', () => {
    expect(e.included).toHaveLength(13);
    expect(e.includedEn).toHaveLength(13);
    const i = e.included.indexOf('העברות פנימיות לתחילת המסלול ובחזרה');
    expect(i).toBe(3);
    expect(e.includedEn[i]).toBe('Internal transfers to the start of the route and back');
    expect(e.includedEn[i - 1]).toBe('Transfers from and to Tirana airport');
    expect(e.includedEn[i + 1]).toBe('Mountain hut, hotels and guesthouses throughout the route');
  });
  it('it is the line the other trips already use for the same Hebrew', () => {
    const same = EXPS.filter(x => (x.included || []).includes('העברות פנימיות לתחילת המסלול ובחזרה') && (x.includedEn || []).includes('Internal transfers to the start of the route and back'));
    expect(same.length).toBeGreaterThan(10);
  });
});

describe('the site files carry the new lines', () => {
  it('trips/base.json, de.json and es.json were regenerated', () => {
    for (const f of ['base', 'de', 'es']) {
      const list = JSON.parse(fs.readFileSync(`src/data/trips/${f}.json`, 'utf8'));
      const sinai = list.find(x => x.slug === 'sinai'), scardus = list.find(x => x.slug === 'scardus');
      expect(sinai.includedEn, f).toEqual(trip('sinai').includedEn);
      expect(sinai.notIncludedEn, f).toEqual(trip('sinai').notIncludedEn);
      expect(scardus.includedEn, f).toEqual(trip('scardus').includedEn);
    }
  });
});
