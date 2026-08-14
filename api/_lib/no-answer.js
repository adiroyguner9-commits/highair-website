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
import { israelWeekendHold } from './iltime.js';

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

  const hourIL = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: 'numeric', hour12: false }).format(new Date()));
  if (hourIL < 9 || hourIL >= 21)       return { sent: false, deferred: true };
  /* Weekend too (owner, Aug 14 2026). Safe to defer: the cron's window on this
     one is 48h from {Stage Changed At} and the hold is at most 42h, so a card
     moved to No Answer at any point inside the weekend is still eligible when
     Sunday 09:00 comes round. Nothing is lost, only delayed. */
  if (israelWeekendHold())              return { sent: false, deferred: true };

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
