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

import { destKey } from './dest.js';   // the one table of trip names, shared with submit-lead and the messages

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

/* ── The agent a booking customer already belongs to ───────────────────────
   Owner, 22 Sep 2026 (option 2 of two): a customer whose lead already has an
   agent is offered only that agent's free times, and the lead never moves to
   whoever happens to be free. Iris Montano's Kilimanjaro lead was Tomer Lan's;
   she picked 12:30, when both Tomers were on calls, and ONE AGENT, ONE CALL
   handed her call and her lead to Eldar.

   One lookup for both ends, so the list and the booking cannot disagree:
   /api/slots filters by this agent, and /api/book-slot refuses a time at which
   this agent is busy. It is the same card book-slot then stamps the call on: a
   lead-link token (Book Code or legacy record id) resolves to its phone, and
   the phone to its active card (fetchActiveLead). '' when there is no card or
   the card has no agent yet, and every free agent's time stays open. */
export async function bookingAgent({ base, token, lead = '', phone = '' }) {
  let ph = String(phone || '');
  const tok = String(lead || '').trim();
  if (!last9(ph) && tok) {
    try {
      let lf = null;
      const H = { headers: { Authorization: `Bearer ${token}` } };
      if (/^rec[A-Za-z0-9]{14}$/.test(tok)) {
        const r = await fetch(`https://api.airtable.com/v0/${base}/${encodeURIComponent('Website Leads')}/${tok}`, H);   // no fields[]: 422 on this endpoint
        if (r.ok) lf = (await r.json()).fields || null;
      } else if (/^[a-z0-9]{4,12}$/.test(tok)) {
        const f = encodeURIComponent(`{Book Code}="${tok}"`);
        const r = await fetch(`https://api.airtable.com/v0/${base}/${encodeURIComponent('Website Leads')}?filterByFormula=${f}&maxRecords=1&fields[]=Phone`, H);
        if (r.ok) lf = (await r.json()).records?.[0]?.fields || null;
      }
      ph = lf?.Phone || '';
    } catch { return ''; }
  }
  const rec = await fetchActiveLead({ base, token, phone: ph, fields: ['Assigned Agent'] });
  return String(rec?.fields?.['Assigned Agent'] || '').trim();
}

/* Is this the same trip? Compares the Expedition as written on a lead card,
   ignoring case, spacing, punctuation and the Hebrew/English spelling of the
   same destination. Deliberately treats "Kilimanjaro" and "Kilimanjaro
   (Religious)" as DIFFERENT: they are different departures with different
   agents, and merging an enquiry across them loses the one that came second.

   Returns '' for a blank or unrecognised value, and callers must treat '' as
   "not the same trip" — an enquiry we cannot classify is one to keep, not one
   to fold into whatever card came back.

   ONE key for the site and the Lead Center (11 Nov 2026). This used to carry
   its own Hebrew table, and its keys were not the ones the stored English name
   gives: the form saves "Everest Base Camp" (./dest.js) while the Hebrew page
   name gave "ebc"; "Kilimanjaro Kosher" gave "kilimanjarokosher" and its Hebrew
   name "kilimanjaroreligious"; six trips (Scardus, Ama Dablam, Himlung, Mount
   Kenya, Rwenzori, Safari) had no Hebrew row and gave ''. So a second enquiry
   for the same trip opened a second card, and "טיפוס למנסלו" matched the
   Manaslu CIRCUIT row and was folded into the circuit's card. The key is now
   the canonical name from ./dest.js, the same table that names the trip when
   the lead is saved and the same names the Lead Center stores. */
export function tripKey(expedition) {
  const raw = String(expedition || '').trim();
  if (!raw) return '';
  const plain = v => v.toLowerCase().replace(/[^a-z0-9]/g, '');
  let key = destKey(raw);
  /* A religious departure keeps its own identity, whichever language named it
     and however it is spelled: "Kilimanjaro Kosher" (the site), "Kilimanjaro
     (Religious)" (the Lead Center), "קילימנג׳רו לשומרי מסורת" (the page). */
  const religious = key === 'Kilimanjaro Kosher' || /religious|kosher|דתי|שומרי מסורת|חרדי/i.test(raw);
  if (key === 'Kilimanjaro Kosher') key = 'Kilimanjaro';
  /* The climb and the circuit share a mountain and nothing else. A loose
     spelling of the climb ("טיפוס מנסלו", "Manaslu expedition") lands on the
     circuit's keyword in ./dest.js, so it is told apart here. */
  if (key === 'Manaslu' && /טיפוס|climb|expedition|8[.,]?163/i.test(raw) && !/סובב|circuit|טרק|trek/i.test(raw)) key = 'Manaslu Climb';
  if (key) return plain(key) + (religious ? 'religious' : '');
  /* A name ./dest.js does not know: an English one is its own key, a Hebrew one is ''. */
  return plain(raw);
}
