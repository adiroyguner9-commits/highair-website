/* Lead events name the foreign site they came from; the Hebrew site's are unchanged. */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { trackLead, Analytics } from '../src/utils/analytics.js';

const at = host => vi.stubGlobal('window', { location: { hostname: host }, dataLayer: [] });

describe('site_language on lead events', () => {
  beforeEach(() => vi.unstubAllGlobals());
  for (const [host, lang] of [['de.highair-expeditions.com', 'de'], ['es.highair-expeditions.com', 'es'], ['en.highair-expeditions.com', 'en']]) {
    it(host, () => {
      at(host);
      trackLead({ source: 'expedition_page', slug: 'kilimanjaro', value: 2900 });
      Analytics.leadSubmit({ source: 'expedition_page' });
      const [lead, gen] = window.dataLayer;
      expect(lead).toMatchObject({ event: 'lead', site_language: lang, expedition_slug: 'kilimanjaro', value: 2900 });
      expect(gen).toMatchObject({ event: 'generate_lead', site_language: lang });
    });
  }
  it('Hebrew site: no new field', () => {
    at('www.highair-expeditions.com');
    trackLead({ source: 'contact_form' });
    Analytics.leadSubmit({ source: 'contact_form' });
    expect('site_language' in window.dataLayer[0]).toBe(false);
    expect('site_language' in window.dataLayer[1]).toBe(false);
  });
});
