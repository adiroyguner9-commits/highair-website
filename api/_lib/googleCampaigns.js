/* Google Ads sends a campaign as its numeric id, never its name: ValueTrack has
   no name parameter, so the account's Final URL suffix (24 Oct 2026) writes
   utm_campaign={campaignid}. Airtable keeps the id exactly as it arrived; this
   only turns it into the name for the people reading the staff email.

   The same table lives in the webapp (src/data/marketing.js, GOOGLE_CAMPAIGNS),
   which names the campaign in every report; its tests/drift.test.js keeps the
   two equal. An id missing here stays an id, which is the cue to add it. */
export const GOOGLE_CAMPAIGNS = {
  '21168172051': 'S1 | Search | Treks | HighAir Expeditions | Target CPA | Kilimanjaro',
  '22135863750': 'S1 | Search | Treks | HighAir Expeditions | CPC',
};

export const googleCampaignName = c => {
  const v = String(c || '').trim();
  return GOOGLE_CAMPAIGNS[v] || v;
};
