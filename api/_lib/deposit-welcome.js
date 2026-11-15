/**
 * Deposit-A "welcome" — the message a lead gets the moment it closes (moves to
 * Stage "Deposit A Paid"). Single source of truth, used by BOTH:
 *   - api/lead-messaging.js  (cron, every 5 min — catch-all safety net)
 *   - api/notify-deposit.js  (instant, called by the admin the second the owner
 *                             drops a lead into "Deposit A Paid")
 *
 * sendDepositWelcome() is IDEMPOTENT: it claims the {Deposit A Notified} flag
 * FIRST, so the instant call and the cron can never double-send, and the FB
 * Purchase carries event_id = record id so Meta dedupes any overlap.
 */
import crypto from 'crypto';
import { isForeignLead } from './lead-channel.js';
import { firstName } from './name.js';   // WhatsApp greeting — first name only
/* The honest send: it reads Green's answer and only reports success on a real
   idMessage. This file used to assume success, which is how a closing could be
   recorded as announced while the customer was told nothing (see below). */
import { sendWhatsAppVerified } from './followup.js';
import { DEST, destKey } from './dest.js';   // the lead's Expedition → its trip, as every message reads it

const FB_PIXEL_ID   = '293738523242679';
const PERSONAL_AREA = 'https://app.highair-expeditions.com/register';


export function msgDepositA(name) {
  return `היי ${firstName(name)}, איזה כיף, התשלום התקבל בהצלחה! 🥳\n\n`
    + `מעכשיו, כל מה שצריך לקראת המסע מחכה לך במקום אחד, באזור האישי שלך ב-HighAir: שם מופיעים התוכנית המלאה, שלבי התשלום, תוכנית האימונים, רשימת הציוד, אפשרויות לשדרוג הלינה והשכרת הציוד.\n\n`
    + `כדי להתקדם, כל מה שצריך זה להיכנס לאזור האישי בקישור כאן, לבחור את היעד והתאריכים שאליהם נרשמת ולהעלות צילום דרכון בתוקף 👇\n${PERSONAL_AREA}\n\n`
    + `בהמשך, סוכני הנסיעות והביטוח שלנו ייצרו איתך קשר בהקדם כדי להסדיר את רכישת הטיסה והביטוח למסע ✈️`;
}

/* ── Facebook Purchase tracking (Conversions API, valued by destination) ──
   The value is the trip's price on the website today (src/data/mockData.js
   `price`, in the currency its `priceStr` shows), so Meta is told what the trip
   costs now rather than a table typed in July that had drifted from the site
   (owner, 15 Nov 2026). The lead's Expedition finds its trip the way every
   message does (./dest.js), so the kosher Kilimanjaro is valued as itself and
   the Manaslu climb is not valued as the circuit. A trip with no price on the
   site (a safari page still "[למילוי]", Israel) reports no Purchase, as before.
   The trip list is loaded only when a closing fires, never on a plain cron tick. */
let tripsOnce = null;
const siteTrips = () => (tripsOnce ||= import('../../src/data/mockData.js').then(m => m.EXPS || []));
export async function purchaseValue(expedition) {
  const slug = DEST[destKey(expedition)]?.slug;
  if (!slug) return null;
  const trip = (await siteTrips()).find(t => t.slug === slug);
  const value = Number(trip?.price) || 0;
  if (!(value > 0)) return null;
  return { slug, value, currency: /€/.test(String(trip.priceStr || '')) ? 'EUR' : 'USD' };
}
const sha256 = s => crypto.createHash('sha256').update(String(s).toLowerCase().trim()).digest('hex');

async function fireFbPurchase(f, eventId) {
  const FB_TOKEN = process.env.FB_CAPI_TOKEN;
  if (!FB_TOKEN) return { skipped: 'no FB token' };
  const priced = await purchaseValue(f.Expedition);
  if (!priced) return { skipped: 'no price for ' + (f.Expedition || '?') };
  const { slug, value, currency } = priced;
  const parts = String(f.Name || '').trim().split(/\s+/);
  const ud = {};
  if (f.Email)   ud.em = [sha256(f.Email)];
  if (f.Phone)   ud.ph = [sha256(String(f.Phone).replace(/\D/g, ''))];
  if (parts[0])  ud.fn = [sha256(parts[0])];
  if (parts.length > 1) ud.ln = [sha256(parts.slice(1).join(' '))];
  const payload = { data: [{
    event_name: 'Purchase', event_time: Math.floor(Date.now() / 1000), action_source: 'other',
    ...(eventId ? { event_id: String(eventId) } : {}),   // idempotency: Meta dedupes re-fires + browser/CAPI overlap
    user_data: ud, custom_data: { value, currency, content_name: slug, content_type: 'product' },
  }] };
  const r = await fetch(`https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events?access_token=${FB_TOKEN}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  return r.json().catch(() => ({}));
}

/* Full one-record welcome: claim the flag, fire the Purchase event, send the WA.
   Claiming FIRST means a failed later step can't cause a re-send on the next
   cron tick / a second instant call. Returns what actually happened. */
export async function sendDepositWelcome(rec) {
  const BASE = process.env.AIRTABLE_BASE, TOKEN = process.env.AIRTABLE_TOKEN;
  const f = rec.fields || {};

  const claim = await fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}/${rec.id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { 'Deposit A Notified': true } }),
  });
  // Only fire FB + WA if the claim actually stuck. A failed claim followed by a
  // successful send would let the next cron tick re-fire and double-message the
  // customer (the FB Purchase is event_id-deduped by Meta, but the WA is not).
  if (!claim.ok) { console.error('[deposit-welcome] claim PATCH failed for', rec.id); return { claimed: false, fbFired: false, waSent: false }; }

  let fbFired = false;
  try { const fb = await fireFbPurchase(f, rec.id); if (fb && !fb.skipped) fbFired = true; }
  catch (e) { console.error('[deposit-welcome] fb:', e.message); }

  /* Israel + Sinai closings get NO deposit-A WhatsApp (owner rule, Jul 23 2026):
     the owner handles these personally, and the standard welcome (personal area,
     passport upload, flight/insurance agents) doesn't fit a domestic trip.
     The flag was already claimed above, so the closing stays permanently silent
     for both the instant trigger and the cron safety-net. */
  if (/sinai|israel|סיני|ישראל/i.test(String(f.Expedition || ''))) {
    return { fbFired, waSent: false, skippedWa: 'israel/sinai destination' };
  }
  /* A customer from the foreign sites: email only, no WhatsApp (owner, 10 Nov
     2026; ./lead-channel.js). The flag is claimed, so it stays silent for good. */
  if (isForeignLead(f)) {
    return { fbFired, waSent: false, skippedWa: 'lead from abroad: email only' };
  }

  /* waSent used to be set right after the request, without reading the reply.
     greenFetch only throws when the CONNECTION fails, so a 400 (bad number), a
     401 (token) or a quota refusal all came back as "sent": the card got its
     "Deposit-welcome WhatsApp sent" line, the agent got a success toast, and the
     customer who had just paid got nothing (owner, 15 Oct 2026, on Boaz
     Hornstein: "העברתי מישו לשולם ... והוא לא קיבל וואטסאפ"). Every other
     sender in this repo already checked for an idMessage; this one, the message
     that greets a paying customer, was the only one that did not.
     The error is returned as well as logged, so the Lead Center can say what
     Green actually answered instead of claiming a send that never happened. */
  const sent = await sendWhatsAppVerified(f.Phone, msgDepositA(f.Name), { kind: 'deposit_welcome', leadId: rec.id });
  if (!sent.ok) console.error('[deposit-welcome] wa:', sent.error);

  return { fbFired, waSent: sent.ok, ...(sent.ok ? {} : { waError: sent.error }) };
}
