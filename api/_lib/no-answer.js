/**
 * The no-answer notice + the one true way to send it.
 *
 * Shared by the cron (api/lead-messaging.js #3c, the safety net) and the
 * instant trigger (api/notify-no-answer.js, called by the Lead Center the
 * moment a confirmed "No Answer" move lands) — one text, one claim flow,
 * so the two paths can never drift or double-send.
 */
import { destInfo } from './dest.js';
import { firstName } from './name.js';
import { sendWhatsAppVerified } from './followup.js';
import { normalizePhone } from './phone.js';

const AGENT_FIRST_HE = { Tomer: 'תומר', Eldar: 'אלדר', Adir: 'אדיר', Ohad: 'אוהד', Chen: 'חן' };
/* The agent's number as a CUSTOMER should read and dial it: the local Israeli
   form, 054-788-8245. The old version keyed off a 10-digit string, which was
   the shape phones used to be stored in; once every number became canonical
   "+972…" (12 digits) it fell through and printed a raw "972547888245" into
   the message (Aug 2 2026). Foreign numbers keep their + and country code. */
const fmtPhoneIL = (p) => {
  const d = normalizePhone(p).replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('972')) {
    const n = '0' + d.slice(3);                        // 0547888245
    return n.length === 10 ? `${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6)}` : n;
  }
  return `+${d}`;
};

export function msgNoAnswer(name, expedition, agentHe, agentPhone) {
  const info = destInfo(expedition);
  const about = info.slug !== 'call' ? `ה${info.he}` : 'המסע שלנו';
  return `היי ${firstName(name)} 🙂\n\n`
    + `${agentHe} מהצוות שלנו ניסה להשיג אותך טלפונית לגבי ${about}, אך ללא מענה.\n\n`
    + `אפשר לחזור אליו ישירות במספר ${fmtPhoneIL(agentPhone)}, ואפשר גם פשוט להשיב כאן ונחזור אליך.`;
}

/* Send the notice for one Website Leads record (raw Airtable rec).
   Guards INSIDE so every caller is equally safe:
   - Stage must be 'No Answer', flag unset, phone + assigned agent present.
   - Quiet hours 09:00-21:00 Israel, and the Fri 15:00 → Sun 09:00 weekend:
     returns { deferred: true } WITHOUT claiming the flag — the 5-min cron (48h
     window) sends it next working morning instead.
   - Claims {No Answer Notified} + Activity Log entry BEFORE sending; releases
     the flag if Green did not actually accept the message.
   Returns { sent, skipped?, deferred?, error? }. */
export async function sendNoAnswerNotice(rec) {
  const BASE = process.env.AIRTABLE_BASE, TOKEN = process.env.AIRTABLE_TOKEN;
  const H = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };
  const LEAD = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}/${rec.id}`;
  const f = rec.fields || {};

  if (f.Stage !== 'No Answer')          return { sent: false, skipped: 'not in No Answer' };
  if (f['No Answer Notified'] === true) return { sent: false, skipped: 'already sent' };
  if (!f.Phone)                         return { sent: false, skipped: 'no phone' };
  const agentFull = String(f['Assigned Agent'] || '').trim();
  if (!agentFull)                       return { sent: false, skipped: 'no assigned agent' };

  /* NO QUIET HOURS AND NO WEEKEND HOLD ON THIS ONE (owner, Aug 15 2026).
     Every other automated message is something WE decided to send: a nudge, a
     follow-up, an offer. This one is a reply. An agent has just tried to call
     and got no answer, and the message says so and leaves a number to call
     back — so the moment to send it is the moment it happened, whatever the
     clock says. Holding it until 09:00 meant Tomer rang a customer at 08:00,
     the customer saw a missed call and nothing else, and the agent had no way
     to know the message was sitting in a queue.
     The quiet hours and the weekend hold still apply to the nudges and the
     follow-ups in lead-messaging.js, which is where they belong. */

  // Agent directory: full name ("Tomer Lan") → Hebrew first name + phone.
  const ar = await fetch(`https://api.airtable.com/v0/${BASE}/Agents?pageSize=50`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  let agent = null;
  for (const a of ((await ar.json()).records || [])) {
    const af = a.fields || {};
    if (af.Type !== 'Sales' || !af.Name || !af.Phone) continue;
    if (`${af.Name} ${af['Last Name'] || ''}`.trim() === agentFull) { agent = { he: AGENT_FIRST_HE[af.Name] || af.Name, phone: af.Phone }; break; }
  }
  if (!agent) return { sent: false, skipped: `agent "${agentFull}" not found / no phone` };

  const stamp = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  const entry = `[${stamp}] No-answer notice sent (auto)`;
  const prevLog = f['Activity Log'] || '';
  const claim = await fetch(LEAD, { method: 'PATCH', headers: H, body: JSON.stringify({ fields: { 'No Answer Notified': true, 'Activity Log': prevLog ? `${entry}\n${prevLog}` : entry } }) });
  if (!claim.ok) return { sent: false, error: 'claim failed' };

  const out = await sendWhatsAppVerified(f.Phone, msgNoAnswer(f.Name, f.Expedition, agent.he, agent.phone));
  if (out.ok) return { sent: true, id: out.id };

  await fetch(LEAD, { method: 'PATCH', headers: H, body: JSON.stringify({ fields: { 'No Answer Notified': false } }) });   // release — the cron retries
  return { sent: false, error: out.error };
}
