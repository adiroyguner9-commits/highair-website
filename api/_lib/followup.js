/**
 * The 4-day follow-up message + the one true way to send it.
 *
 * Shared by the cron (api/lead-messaging.js, #4) and the admin's manual
 * "send now" button (api/send-followup.js) so the customer receives the EXACT
 * same message either way — a copy in two places would drift on the first edit.
 */
import { destInfo, destKey } from './dest.js';
import { firstName } from './name.js';
import { greenFetch } from './green.js';

/* ── Only a trip that has a departure ahead (owner, 15 Nov 2026) ─────────────
   The message says the groups are filling and the departure is guaranteed, so
   it goes only to a lead whose trip has a future, public row in Groups. The
   lead's trip is matched to the Groups EVENTS the way the webapp does it
   (src/data/leads.js eventBelongsToDest, api/_lib/followup-run.js tripMatcher):
   starts-with after folding, EBC by its alias, the kosher departures for the
   kosher trip only. A hidden row is a private group: not this lead's. */
const fold = s => String(s || '').replace(/[_-]+/g, ' ').toLowerCase().replace(/\s+/g, ' ').trim();
const KOSHER = /kosher|religious|שומרי\s*מסורת/i;
const EVENT_ALIAS = { 'everest base camp': ['ebc'] };

/** The events that leave after `todayYMD`, from raw Groups rows. */
export function futureDepartureEvents(groupRows, todayYMD) {
  return [...new Set((groupRows || [])
    .map(r => r?.fields || {})
    .filter(f => !f.Hidden && String(f.Departure || '').slice(0, 10) > todayYMD && f.Event)
    .map(f => String(f.Event)))];
}

/** Does this lead's trip have one of those departures? */
export function tripHasDeparture(expedition, events) {
  const raw = String(expedition || '').trim();
  const d = fold((destKey(raw) || raw).replace(/\s*kosher$/i, ''));
  if (!d) return false;
  const kosher = KOSHER.test(raw);
  return (events || []).some(ev => {
    const e = fold(ev);
    return (e.startsWith(d) || (EVENT_ALIAS[d] || []).some(a => e.startsWith(a))) && KOSHER.test(ev) === kosher;
  });
}

export function msgFollowUp(name, expedition) {
  const { he, slug } = destInfo(expedition);
  /* "ל" + the unknown-destination fallback read "להמשלחות שלנו"; and a trip
     with no flight (Sinai) was told the flights are being ticketed
     (22 Oct 2026). */
  const groups = slug !== 'call' ? `הקבוצות שלנו ל${he}` : 'הקבוצות שלנו';
  const noFlight = slug === 'sinai';
  return `היי ${firstName(name)}, מה שלומך? ✨\n\n`
    + `רק רצינו לעדכן ש${groups} מתמלאות בקצב מהיר והיציאה כבר מובטחת! 🏔️\n\n`
    + (noFlight ? '' : `אנחנו מתחילים בימים הקרובים בכרטוס הטיסות ✈️\n\n`)
    + `נשמח לעדכון ממך כדי שנוכל להתקדם ולשריין את המקום שלך באחת מהקבוצות שלנו 💪🏻`;
}

/* Phone → Green chatId digits. Local Israeli forms (05…, 972 0…, 5XXXXXXXX) are
   normalised to 972…; anything else is already international and passes through
   UNTOUCHED — customers abroad (+1, +44 …) are real and must not be rejected.
   Identical to the long-standing helper in lead-messaging.js; only '' (no digits
   at all) counts as unusable. */
export function toIntlIL(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('972') && d[3] === '0') d = '972' + d.slice(4);
  else if (d.startsWith('0')) d = '972' + d.slice(1);
  else if (d.length === 9 && d[0] === '5') d = '972' + d;
  return d;
}

/* Send one WhatsApp and report HONESTLY whether it left the building.
   Green answers 200 + {idMessage} on a real send; a spam block, a rate limit or a
   number that isn't on WhatsApp all come back differently and must NOT be
   recorded as sent. Returns { ok, id? , error? }. */
/* `meta` is optional { kind, leadId } and only labels the Outbox row. */
export async function sendWhatsAppVerified(phone, message, meta = null) {
  const GA_INSTANCE = process.env.GREENAPI_INSTANCE;
  const GA_TOKEN    = process.env.GREENAPI_TOKEN;
  if (!GA_INSTANCE || !GA_TOKEN) return { ok: false, error: 'green not configured' };
  const chatId = toIntlIL(phone);
  if (!chatId) return { ok: false, error: `unusable phone "${phone}"` };
  try {
    const r = await greenFetch('sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: `${chatId}@c.us`, message }),
    }, '', meta);
    const d = await r.json().catch(() => ({}));
    if (r.ok && d?.idMessage) return { ok: true, id: d.idMessage };
    return { ok: false, error: `green ${r.status} ${JSON.stringify(d).slice(0, 140)}` };
  } catch (e) {
    return { ok: false, error: 'green request failed: ' + e.message };
  }
}
