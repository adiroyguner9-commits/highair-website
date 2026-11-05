/* Each site's phone / WhatsApp number (website/contact.js, 5 Nov 2026) */
import { describe, it, expect } from 'vitest';
import { CONTACT_NUMBERS, contactFor, OUR_WA_NUMBERS, WA_GREETING, WA_TRIP } from '../src/website/contact.js';

describe('contact numbers', () => {
  it('the Hebrew site keeps the Israeli line', () => {
    expect(contactFor('he')).toEqual({ tel: '+972555636975', display: '055-563-6975', wa: '972555636975' });
  });
  it('a country without its own number falls back to the Israeli one, in international format', () => {
    for (const l of ['en', 'de', 'es']) {
      const c = CONTACT_NUMBERS[l] || null;
      const got = contactFor(l);
      if (c) expect(got).toEqual(c);
      else { expect(got.wa).toBe('972555636975'); expect(got.display).toBe('+972 55-563-6975'); }
      expect(OUR_WA_NUMBERS.has(got.wa)).toBe(true);
    }
  });
  it('every language has a WhatsApp greeting and trip message', () => {
    for (const l of ['he', 'en', 'de', 'es']) {
      expect(WA_GREETING[l]).toBeTruthy();
      expect(WA_TRIP[l]('Kilimanjaro')).toContain('Kilimanjaro');
    }
    expect(WA_TRIP.de('Kilimandscharo')).toMatch(/^Hallo!/);
  });
});
