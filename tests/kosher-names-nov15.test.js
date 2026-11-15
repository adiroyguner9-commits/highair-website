/* The kosher Kilimanjaro by every name it goes by (owner, 15 Nov 2026: the site's
   Hebrew name becomes "טיפוס לקילימנג׳רו לשומרי מסורת", the English one
   "Kilimanjaro Kosher"; the Lead Center keeps storing "Kilimanjaro (Religious)").
   The new Hebrew name holds the regular trip's whole name, so destKey read it as
   regular Kilimanjaro: the lead form would have stored a kosher lead as a
   regular one. Every matcher here gives the kosher trip for the first four
   names and the regular one for the last. And the Meta Purchase is valued at the
   trip's price on the site today. */
import { describe, it, expect } from 'vitest';
import { destKey, destInfo, destHe } from '../api/_lib/dest.js';
import { tripKey } from '../api/_lib/active-lead.js';
import { coversFor } from '../api/_lib/callAgents.js';
import { tripHasDeparture, futureDepartureEvents } from '../api/_lib/followup.js';
import { purchaseValue } from '../api/_lib/deposit-welcome.js';
import { EXPS } from '../src/data/mockData.js';

const KOSHER = ['קילימנג׳רו לשומרי מסורת', 'טיפוס לקילימנג׳רו לשומרי מסורת', 'Kilimanjaro Kosher', 'Kilimanjaro (Religious)'];
const REGULAR = 'טיפוס לקילימנג׳רו';

describe('every matcher reads the kosher trip as the kosher trip', () => {
  for (const n of KOSHER) {
    it(n, () => {
      expect(destKey(n)).toBe('Kilimanjaro Kosher');                 // what submit-lead stores
      expect(destInfo(n).slug).toBe('kilimanjaro-kosher');           // the nudge's /book link
      expect(destHe(n)).toBe(destHe('Kilimanjaro Kosher'));         // the name in the messages
      expect(tripKey(n)).toBe('kilimanjaroreligious');               // same trip, or a card of its own
      expect(tripHasDeparture(n, ['Kilimanjaro_Kosher'])).toBe(true);
      expect(tripHasDeparture(n, ['Kilimanjaro', 'Kilimanjaro_with_Safari'])).toBe(false);
      /* the agents are the regular trip's, by the owner's rule (1 Sep 2026) */
      expect(coversFor([{ name: 'Tomer Lan', destinations: ['Kilimanjaro'] }], n)).toEqual(['Tomer Lan']);
    });
  }
  it(`${REGULAR} is the regular trip`, () => {
    expect(destKey(REGULAR)).toBe('Kilimanjaro');
    expect(destInfo(REGULAR).slug).toBe('kilimanjaro');
    expect(tripKey(REGULAR)).toBe('kilimanjaro');
    expect(tripHasDeparture(REGULAR, ['Kilimanjaro'])).toBe(true);
    expect(tripHasDeparture(REGULAR, ['Kilimanjaro_Kosher'])).toBe(false);
  });
  it('the trip page form submits the trip\'s Hebrew name, and it resolves to that trip', () => {
    const kosher = EXPS.find(e => e.slug === 'kilimanjaro-kosher');
    const regular = EXPS.find(e => e.slug === 'kilimanjaro');
    expect(destKey(kosher.nameHe)).toBe('Kilimanjaro Kosher');
    expect(destKey(regular.nameHe)).toBe('Kilimanjaro');
  });
});

describe('the 4-day follow-up reads Groups', () => {
  it('only future, public rows count', () => {
    const rows = [
      { fields: { Event: 'Elbrus', Departure: '2027-07-01' } },
      { fields: { Event: 'Sinai', Departure: '2027-03-01', Hidden: true } },
      { fields: { Event: 'Olympus', Departure: '2026-09-01' } },
    ];
    expect(futureDepartureEvents(rows, '2026-11-15')).toEqual(['Elbrus']);
  });
  it('a lead\'s trip finds its events by the stored name', () => {
    const ev = ['Annapurna_Circut', 'EBC + Gokyo', 'Peaks_of_Balkan', 'Ethiopia_with_Tribes', 'Ethiopia_Kosher'];
    expect(tripHasDeparture('Annapurna', ev)).toBe(true);
    expect(tripHasDeparture('Everest Base Camp', ev)).toBe(true);
    expect(tripHasDeparture('Peaks of Balkan', ev)).toBe(true);
    expect(tripHasDeparture('Ethiopia', ev)).toBe(true);
    expect(tripHasDeparture('Ethiopia (Religious)', ev)).toBe(true);
    expect(tripHasDeparture('Ethiopia (Religious)', ['Ethiopia'])).toBe(false);
    expect(tripHasDeparture('Manaslu', ev)).toBe(false);
    expect(tripHasDeparture('', ev)).toBe(false);
  });
});

describe('the Meta Purchase is valued at the site\'s price today', () => {
  const price = slug => EXPS.find(e => e.slug === slug);
  it('read off the trip data, in the trip\'s currency', async () => {
    for (const [exp, slug] of [['Kilimanjaro', 'kilimanjaro'], ['Kilimanjaro (Religious)', 'kilimanjaro-kosher'], ['Manaslu', 'manaslu-circuit'], ['Everest Base Camp', 'everest-base-camp']]) {
      const v = await purchaseValue(exp);
      expect(v, exp).toEqual({ slug, value: price(slug).price, currency: 'USD' });
    }
    for (const exp of ['Kazbek', 'Olympus', 'Peaks of Balkan']) expect((await purchaseValue(exp)).currency, exp).toBe('EUR');
  });
  it('a trip with no price on the site reports none', async () => {
    expect(await purchaseValue('Israel')).toBeNull();
    expect(await purchaseValue('Safari')).toBeNull();
    expect(await purchaseValue('')).toBeNull();
  });
});
