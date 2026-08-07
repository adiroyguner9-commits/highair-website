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
import { firstName } from './name.js';   // WhatsApp greeting — first name only

const FB_PIXEL_ID   = '293738523242679';
const PERSONAL_AREA = 'https://app.highair-expeditions.com/register';

/* Normalise any stored phone to Israeli intl form ("972XXXXXXXXX") for Green API. */
function toIntlIL(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('972') && d[3] === '0') d = '972' + d.slice(4);
  else if (d.startsWith('0')) d = '972' + d.slice(1);
  else if (d.length === 9 && d[0] === '5') d = '972' + d;
  return d;
}

export function msgDepositA(name) {
  return `היי ${firstName(name)}, איזה כיף, התשלום התקבל בהצלחה! 🥳\n\n`
    + `מעכשיו, כל מה שצריך לקראת המסע מחכה לך במקום אחד, באזור האישי שלך ב-HighAir: שם מופיעים התוכנית המלאה, שלבי התשלום, תוכנית האימונים, רשימת הציוד, אפשרויות לשדרוג הלינה והשכרת הציוד.\n\n`
    + `כדי להתקדם, כל מה שצריך זה להיכנס לאזור האישי בקישור כאן, לבחור את היעד והתאריכים שאליהם נרשמת ולהעלות צילום דרכון בתוקף 👇\n${PERSONAL_AREA}\n\n`
    + `בהמשך, סוכני הנסיעות והביטוח שלנו ייצרו איתך קשר בהקדם כדי להסדיר את רכישת הטיסה והביטוח למסע ✈️`;
}

/* ── Facebook Purchase tracking (Conversions API, valued by destination) ── */
const EXPEDITION_PRICES = {   // canonical /book slug → [value, currency]
  'kilimanjaro': [2700, 'USD'], 'ethiopia': [3000, 'USD'], 'elbrus': [3500, 'USD'],
  'kazbek': [2300, 'EUR'], 'everest-base-camp': [3300, 'USD'], 'annapurna': [2150, 'USD'],
  'manaslu': [2250, 'USD'], 'island-peak': [3550, 'USD'], 'mera-peak': [3550, 'USD'],
  'lobuche-peak': [3550, 'USD'], 'aconcagua': [10000, 'USD'], 'lenin-peak': [6200, 'USD'],
  'olympus': [1700, 'EUR'], 'peaks-of-balkan': [1750, 'EUR'],
};
const DEST_SLUG = {   // English Expedition name → /book slug (for the exact/keyword match)
  'Kilimanjaro': 'kilimanjaro', 'Elbrus': 'elbrus', 'Aconcagua': 'aconcagua', 'Kazbek': 'kazbek',
  'Olympus': 'olympus', 'Peaks of Balkan': 'peaks-of-balkan', 'Annapurna': 'annapurna',
  'Manaslu': 'manaslu', 'Everest Base Camp': 'everest-base-camp', 'Lobuche Peak': 'lobuche-peak',
  'Island Peak': 'island-peak', 'Mera Peak': 'mera-peak', 'Lenin Peak': 'lenin-peak', 'Ethiopia': 'ethiopia',
};
const sha256 = s => crypto.createHash('sha256').update(String(s).toLowerCase().trim()).digest('hex');

/* Resolve a lead's Expedition (canonical, variant, Hebrew or odd casing) to a
   priced /book slug — exact match first, then keyword, then Hebrew fallback. */
function fbSlug(expedition) {
  const e = String(expedition || '').trim();
  if (!e) return null;
  if (DEST_SLUG[e]) return DEST_SLUG[e];
  const lc = e.toLowerCase();
  for (const [name, slug] of Object.entries(DEST_SLUG)) if (lc.includes(name.toLowerCase())) return slug;
  const HEB = [['קילימנג', 'kilimanjaro'], ['קזבק', 'kazbek'], ['אלברוס', 'elbrus'], ['אקונקגוא', 'aconcagua'], ['אולימפוס', 'olympus'], ['בלקן', 'peaks-of-balkan'], ['אנאפורנה', 'annapurna'], ['מנסלו', 'manaslu'], ['אוורסט', 'everest-base-camp'], ['לובוצ', 'lobuche-peak'], ['איילנד', 'island-peak'], ['מרה פיק', 'mera-peak'], ['לנין', 'lenin-peak'], ['סימיאן', 'ethiopia'], ['אתיופיה', 'ethiopia']];
  for (const [k, s] of HEB) if (e.includes(k)) return s;
  return null;
}

async function fireFbPurchase(f, eventId) {
  const FB_TOKEN = process.env.FB_CAPI_TOKEN;
  if (!FB_TOKEN) return { skipped: 'no FB token' };
  const slug = fbSlug(f.Expedition);
  const priced = slug && EXPEDITION_PRICES[slug];
  if (!priced) return { skipped: 'no price for ' + (f.Expedition || '?') };
  const [value, currency] = priced;
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
  const GA_INSTANCE = process.env.GREENAPI_INSTANCE, GA_TOKEN = process.env.GREENAPI_TOKEN;
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

  let waSent = false;
  const chatId = toIntlIL(f.Phone);
  if (chatId && GA_INSTANCE && GA_TOKEN) {
    try {
      await fetch(`https://api.green-api.com/waInstance${GA_INSTANCE}/sendMessage/${GA_TOKEN}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: `${chatId}@c.us`, message: msgDepositA(f.Name) }),
      });
      waSent = true;
    } catch (e) { console.error('[deposit-welcome] wa:', e.message); }
  }

  return { fbFired, waSent };
}
