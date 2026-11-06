/* The staff email about a new lead: English for a lead from abroad, with the
   destination in the subject; Hebrew for the Hebrew site (owner, 6 Nov 2026). */
import { describe, it, expect } from 'vitest';
import { foreignLeadEmail, hebrewLeadEmail } from '../api/submit-lead.js';

const HEB = /[֐-׿]/;
const strip = h => h.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&');
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

describe('what the foreign forms really send', () => {
  it('expedition page: Hebrew trip name in Source, Hebrew Expedition, flexible month', async () => {
    const { destKey } = await import('../api/_lib/dest.js');
    const f = { Name: 'Hans', Email: 'h@x.de', Expedition: destKey('טיפוס לקילימנג׳רו'), 'Preferred Month': 'גמיש / טרם החלטתי', 'Group Size': 2, Source: 'Expedition Page - טיפוס לקילימנג׳רו' };
    const m = foreignLeadEmail(f, 'German');
    const text = strip(m.html);
    expect(text).not.toMatch(HEB);
    expect(text).toContain('Expedition Page - Kilimanjaro');
    expect(text).toContain('Flexible / not decided yet');
  });
  it('women\'s group and kosher Kilimanjaro', () => {
    const m = foreignLeadEmail({ Name: 'Eva', Email: 'e@x.at', Expedition: 'Kilimanjaro Kosher', 'Preferred Month': 'Februar 2027 (נשים)', Source: 'Expedition Page - קילימנג׳רו לשומרי מסורת · קבוצת נשים (עדי טנא)' }, 'German');
    const text = strip(m.html);
    expect(text).not.toMatch(HEB);
    expect(text).toContain('Kilimanjaro (kosher) · women\'s group (Adi Tene)');
    expect(text).toContain('Februar 2027 (women)');
  });
  it('safari page message', () => {
    for (const msg of ['ספארי 5 ימים', 'ספארי, עוד לא הוחלט על מספר הימים']) {
      const m = foreignLeadEmail({ Name: 'Ana', Email: 'a@x.es', Expedition: 'Safari 5 Days', 'Preferred Month': 'פברואר 2027', Source: 'Safari Page', Message: msg }, 'Spanish');
      expect(strip(m.html)).not.toMatch(HEB);
      expect(m.subject).toContain('Safari (5 days)');
    }
  });
  it('contact form: no destination', () => {
    const m = foreignLeadEmail({ Name: 'Joe', Email: 'j@x.com', Source: 'Contact Form', Message: 'Do you do Kilimanjaro in March?' }, 'English');
    expect(m.subject).toBe('New lead: No destination given · Joe (English site)');
  });
});
