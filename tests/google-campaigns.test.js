/* The staff email names a Google campaign that arrives as its id
   (api/_lib/googleCampaigns.js). The webapp keeps the same table and its drift
   test checks the two agree. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { googleCampaignName } from '../api/_lib/googleCampaigns.js';

describe('Google campaign names', () => {
  it('turns a known id into the name Google Ads shows', () => {
    expect(googleCampaignName('21168172051')).toBe('S1 | Search | Treks | HighAir Expeditions | Target CPA | Kilimanjaro');
    expect(googleCampaignName(' 22135863750 ')).toBe('S1 | Search | Treks | HighAir Expeditions | CPC');
  });
  it('leaves a Meta name and an unknown id as they are', () => {
    expect(googleCampaignName('Lead | ILS | Exped | Kili | Nastia 12.10.26')).toBe('Lead | ILS | Exped | Kili | Nastia 12.10.26');
    expect(googleCampaignName('23000000001')).toBe('23000000001');
    expect(googleCampaignName(undefined)).toBe('');
  });
  it('is what the staff email prints', () => {
    const src = readFileSync(resolve(__dirname, '../api/submit-lead.js'), 'utf8');
    expect(src).toContain('escapeHtml(googleCampaignName(utm.campaign))');
  });
});
