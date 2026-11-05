/* Leads are tagged with the language of the site they came from (5 Nov 2026) */
import { describe, it, expect } from 'vitest';
import { leadLanguage } from '../api/submit-lead.js';

describe('lead language', () => {
  it('follows the site the form was sent from', () => {
    expect(leadLanguage({ origin: 'https://www.highair-expeditions.com' })).toBe('Hebrew');
    expect(leadLanguage({ origin: 'https://highair-expeditions.com' })).toBe('Hebrew');
    expect(leadLanguage({ origin: 'https://en.highair-expeditions.com' })).toBe('English');
    expect(leadLanguage({ origin: 'https://de.highair-expeditions.com' })).toBe('German');
    expect(leadLanguage({ referer: 'https://es.highair-expeditions.com/expedition/kilimanjaro' })).toBe('Spanish');
  });
  it('stays empty when the origin is unknown or someone else’s', () => {
    expect(leadLanguage({})).toBeNull();
    expect(leadLanguage({ origin: 'https://highair-website-abc.vercel.app' })).toBeNull();
    expect(leadLanguage({ origin: 'https://evil-highair-expeditions.com' })).toBeNull();
  });
});
