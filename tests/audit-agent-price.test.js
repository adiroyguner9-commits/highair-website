/* The night of 12 Nov 2026: the agent's knowledge sheet
   (public/agent-knowledge.json, written by scripts/generate-agent-knowledge.mjs)
   gave every trip's price as `priceFromUsd`. Kazbek, Olympus and Peaks of the
   Balkans are sold in euros, so the agent that answers leads from the foreign
   sites held a euro amount under a dollar name.

   Each trip now carries priceFrom { amount, currency }, and priceFromUsd is
   null for a euro trip: a reader that only knows the old field has no number
   to quote in dollars. */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { tripPrice, priceCurrency } from '../scripts/lib/trip-price.mjs';
import { EXPS } from '../src/data/mockData.js';
import { CORE_TRIPS } from '../src/website/sites.js';

const trip = slug => EXPS.find(e => e.slug === slug);

describe('the currency rule', () => {
  it('a price written with € is in euros, one written with $ in dollars', () => {
    expect(priceCurrency({ priceStr: '€2300' })).toBe('EUR');
    expect(priceCurrency({ priceStr: ' €1,750' })).toBe('EUR');
    expect(priceCurrency({ priceStr: '$2900' })).toBe('USD');
    expect(priceCurrency({ priceStr: '$10,000' })).toBe('USD');
  });
  it('a dollar trip keeps both fields', () => {
    expect(tripPrice({ price: 2900, priceStr: '$2900' })).toEqual({ priceFrom: { amount: 2900, currency: 'USD' }, priceFromUsd: 2900 });
  });
  it('a euro trip has its amount in priceFrom only: nothing is left to quote in dollars', () => {
    expect(tripPrice({ price: 2300, priceStr: '€2300' })).toEqual({ priceFrom: { amount: 2300, currency: 'EUR' }, priceFromUsd: null });
  });
  it('a trip with no price has no price in either field', () => {
    for (const e of [{}, { price: 0, priceStr: '[למילוי]' }, { price: null, priceStr: '$0' }, { priceStr: '€900' }]) {
      expect(tripPrice(e)).toEqual({ priceFrom: null, priceFromUsd: null });
    }
  });
  it('a priced trip in any other currency stops the build instead of passing as dollars', () => {
    expect(() => tripPrice({ slug: 'somewhere', price: 950, priceStr: '₪950' })).toThrow(/somewhere.*neither \$ nor €/);
    expect(() => tripPrice({ slug: 'nowhere', price: 950 })).toThrow(/nowhere/);
  });
});

describe('the trips on the sheet', () => {
  it('Kazbek, Olympus and Peaks of the Balkans are in euros', () => {
    expect(tripPrice(trip('kazbek'))).toEqual({ priceFrom: { amount: 2300, currency: 'EUR' }, priceFromUsd: null });
    expect(tripPrice(trip('olympus'))).toEqual({ priceFrom: { amount: 1750, currency: 'EUR' }, priceFromUsd: null });
    expect(tripPrice(trip('peaks-of-balkan'))).toEqual({ priceFrom: { amount: 1750, currency: 'EUR' }, priceFromUsd: null });
  });
  it('every trip on the sheet has a price, in the currency its page shows', () => {
    const euro = [];
    for (const slug of CORE_TRIPS) {
      const e = trip(slug);
      const { priceFrom, priceFromUsd } = tripPrice(e);
      expect(priceFrom, slug).toEqual({ amount: e.price, currency: e.priceStr.startsWith('€') ? 'EUR' : 'USD' });
      expect(['USD', 'EUR'], slug).toContain(priceFrom.currency);
      expect(priceFromUsd, slug).toBe(priceFrom.currency === 'USD' ? e.price : null);
      if (priceFrom.currency === 'EUR') euro.push(slug);
    }
    expect(euro.sort()).toEqual(['kazbek', 'olympus', 'peaks-of-balkan']);
  });
  it('the same answer as the trip page and its schema give', () => {
    /* ExpeditionDetail.jsx and src/website/tripSchema.js: € first means EUR, else USD */
    for (const slug of CORE_TRIPS) {
      const e = trip(slug);
      expect(priceCurrency(e), slug).toBe(String(e.priceStr || '').startsWith('€') ? 'EUR' : 'USD');
    }
  });
});

describe('the generator writes it', () => {
  const src = fs.readFileSync('scripts/generate-agent-knowledge.mjs', 'utf8');
  it('through the helper, and no longer straight from the number', () => {
    expect(src).toContain("import { tripPrice } from './lib/trip-price.mjs';");
    expect(src).toContain('...tripPrice(e),');
    expect(src).not.toContain('priceFromUsd: e.price');
  });
});
