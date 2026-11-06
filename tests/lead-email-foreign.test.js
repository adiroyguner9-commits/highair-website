/* The staff email about a new lead: English for a lead from abroad, with the
   destination in the subject; Hebrew for the Hebrew site (owner, 6 Nov 2026). */
import { describe, it, expect } from 'vitest';
import { foreignLeadEmail, hebrewLeadEmail } from '../api/submit-lead.js';

const HEB = /[֐-׿]/;
const strip = h => h.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
const lead = { Name: 'Hans Müller', Email: 'hans@example.de', Phone: '+49 151 23456789', Expedition: 'Kilimanjaro', 'Preferred Month': 'February', 'Group Size': '2', Source: 'Expedition Page - Kilimanjaro', Message: 'Is February a good month? <b>x</b>' };

describe('foreign lead email', () => {
  for (const lang of ['English', 'German', 'Spanish']) {
    it(`${lang}: English, names the destination and the site`, () => {
      const m = foreignLeadEmail(lead, lang, { source: 'facebook', campaign: 'intl' });
      expect(m.subject).toBe(`New lead: Kilimanjaro 🇹🇿 · Hans Müller (${lang} site)`);
      const text = strip(m.html);
      expect(text).not.toMatch(HEB);
      for (const s of ['New lead from the ' + lang + ' site', 'Reply in', lang, 'Destination', 'Kilimanjaro', 'Full name', 'Hans Müller', 'Preferred month', 'February', 'Group size', 'UTM (ad source)', 'Message']) expect(text).toContain(s);
      expect(m.html).toContain('dir="ltr"');
      expect(m.html).not.toContain('<b>x</b>');   // escaped
    });
  }
  it('no destination: says so, never blank', () => {
    const m = foreignLeadEmail({ Name: 'Ana', Email: 'a@b.es', Source: 'Contact Page' }, 'Spanish');
    expect(m.subject).toBe('New lead: No destination given · Ana (Spanish site)');
    expect(strip(m.html)).toContain('No destination given');
  });
  it('a Hebrew-named destination comes out in English', () => {
    const m = foreignLeadEmail({ ...lead, Expedition: 'טרק סובב מנסלו' }, 'German');
    expect(m.subject).toContain('Manaslu Circuit trek');
    expect(m.subject).not.toMatch(HEB);
  });
});

describe('Hebrew site lead email stays Hebrew', () => {
  it('unchanged subject and labels', () => {
    const m = hebrewLeadEmail({ ...lead, Name: 'ישראל ישראלי' });
    expect(m.subject).toBe('ליד חדש: Kilimanjaro 🇹🇿');
    expect(strip(m.html)).toContain('שם מלא');
  });
});
