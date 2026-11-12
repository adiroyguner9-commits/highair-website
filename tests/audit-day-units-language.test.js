/* The short fields of an itinerary day (walking time, travel time) are in the
   page's language on the German and Spanish sites. They keep their numbers
   from the English record and only the words change; "6 hrs", "Approx.",
   "Flight" and the Ethiopian crater-rim line used to stay in English
   (found in the night comparison of 12 Nov 2026). */
import { describe, it, expect } from 'vitest';
import de from '../src/data/trips/de.json';
import es from '../src/data/trips/es.json';

const ENGLISH = /\b(hrs|hours?|Approx|Flight|Up to|crater rim|gain|loss)\b/;
const left = (trips, key) => trips.flatMap(t => (t[key] || []).flatMap(d =>
  ['duration', 'travelTime', 'elevationGain', 'elevationLoss']
    .filter(f => typeof d[f] === 'string' && ENGLISH.test(d[f]))
    .map(f => `${t.slug} day ${d.day} ${f}: ${d[f]}`)));

describe('itinerary day fields speak the site\'s language', () => {
  it('German', () => { expect(left(de, 'itineraryDe')).toEqual([]); });
  it('Spanish', () => { expect(left(es, 'itineraryEs')).toEqual([]); });
  it('the numbers are kept', () => {
    const ebc = de.find(t => t.slug === 'everest-base-camp').itineraryDe.find(d => d.day === 4);
    expect(ebc.duration).toBe('6 Stunden');
    const eth = es.find(t => t.slug === 'ethiopia').itineraryEs.find(d => d.day === 8);
    expect(eth.duration).toBe('Hasta 1 hora hasta el borde del cráter');
  });
});
