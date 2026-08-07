/**
 * The 4-day follow-up message + the one true way to send it.
 *
 * Shared by the cron (api/lead-messaging.js, #4) and the admin's manual
 * "send now" button (api/send-followup.js) so the customer receives the EXACT
 * same message either way — a copy in two places would drift on the first edit.
 */
import { destInfo } from './dest.js';
import { firstName } from './name.js';

export function msgFollowUp(name, expedition) {
  const { he } = destInfo(expedition);
  return `היי ${firstName(name)}, מה שלומך? ✨\n\n`
    + `רק רצינו לעדכן שהקבוצות שלנו ל${he} מתמלאות בקצב מהיר והיציאה כבר מובטחת! 🏔️\n\n`
    + `אנחנו מתחילים בימים הקרובים בכרטוס הטיסות ✈️\n\n`
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
export async function sendWhatsAppVerified(phone, message) {
  const GA_INSTANCE = process.env.GREENAPI_INSTANCE;
  const GA_TOKEN    = process.env.GREENAPI_TOKEN;
  if (!GA_INSTANCE || !GA_TOKEN) return { ok: false, error: 'green not configured' };
  const chatId = toIntlIL(phone);
  if (!chatId) return { ok: false, error: `unusable phone "${phone}"` };
  try {
    const r = await fetch(`https://api.green-api.com/waInstance${GA_INSTANCE}/sendMessage/${GA_TOKEN}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: `${chatId}@c.us`, message }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d?.idMessage) return { ok: true, id: d.idMessage };
    return { ok: false, error: `green ${r.status} ${JSON.stringify(d).slice(0, 140)}` };
  } catch (e) {
    return { ok: false, error: 'green request failed: ' + e.message };
  }
}
