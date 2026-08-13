/**
 * The ACTIVE lead for a phone number.
 *
 * A phone is not a lead. Returning climbers are ordinary here — Zohar Nevo
 * summited Kazbek in July and signed up for Aconcagua in August — so one number
 * carries several cards: the closed ones from trips already taken, and the open
 * one being worked right now.
 *
 * Every caller used to ask Airtable for `maxRecords=1` and take whatever came
 * back. That is a coin flip that usually lands on the OLDEST card, and it broke
 * quietly in ways nobody could see (Aug 13 2026):
 *
 *   • Booking a call found the closed Kazbek card, decided the lead was already
 *     past that stage, and left the new Aconcagua card sitting at "New Lead"
 *     while the call sat in the calendar.
 *   • An incoming WhatsApp found the closed card, saw it was not an open lead,
 *     and sent the agent no notification at all.
 *   • The deal-closed push told the owner a place had been reserved on Kazbek,
 *     the trip the customer had already finished.
 *
 * So: prefer a card that is actually open, and among equals prefer the newest.
 * A closed card is only returned when there is nothing else, because some
 * callers legitimately want "whoever this number is" rather than a live deal.
 */

/* Stages where a deal is still being worked. Anything else — won, lost,
   archived — is history as far as routing a call or a message goes. */
export const OPEN_STAGES = [
  'New Lead', 'No Answer', 'Call Scheduled', 'Call Done',
  'Follow-Up Sent', 'Awaiting Deposit A',
];

export const last9 = p => String(p || '').replace(/\D/g, '').slice(-9);

/** Newest-first, open cards ahead of closed ones. */
export function pickActive(records) {
  const list = (records || []).filter(Boolean);
  if (list.length <= 1) return list[0] || null;
  const openish = r => (OPEN_STAGES.includes(r.fields?.Stage || '') ? 1 : 0);
  const when = r => String(r.fields?.['Created Time'] || r.createdTime || '');
  return [...list].sort((a, b) => {
    const o = openish(b) - openish(a);
    if (o) return o;
    return when(b).localeCompare(when(a));
  })[0];
}

/**
 * Fetch the active lead for a phone.
 *
 * `fields` is the projection the caller needs; Stage and Created Time are always
 * added because the choice depends on them. Returns the raw Airtable record (so
 * callers keep using rec.id / rec.fields) or null.
 */
export async function fetchActiveLead({ base, token, phone, fields = [] }) {
  const key = last9(phone);
  if (!base || !token || key.length !== 9) return null;
  const want = [...new Set([...fields, 'Stage', 'Created Time'])];
  const proj = want.map(f => `fields[]=${encodeURIComponent(f)}`).join('&');
  const f = encodeURIComponent(`RIGHT(REGEX_REPLACE({Phone}&"","[^0-9]",""),9)="${key}"`);
  try {
    /* 10, not 1. Someone with more than ten cards on one number is not a case
       worth paging for, and the cap keeps this cheap enough to sit in a webhook. */
    const r = await fetch(
      `https://api.airtable.com/v0/${base}/${encodeURIComponent('Website Leads')}?filterByFormula=${f}&${proj}&maxRecords=10`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!r.ok) return null;
    return pickActive((await r.json()).records || []);
  } catch { return null; }
}
