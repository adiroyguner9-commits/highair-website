/**
 * GET /api/lead-messaging
 * Called by Vercel Cron every 5 minutes. Replaces the GoHighLevel client
 * workflows with in-house WhatsApp (Green API). Three lifecycle messages:
 *
 *   #3  Nudge      — a form lead that hasn't booked a call, 10 min after submit
 *   #4  Follow-up  — 4 days after a lead is moved to Stage "Call Done"
 *   #5  Deposit A  — a lead moved to Stage "Deposit A Paid" (closing)
 *
 * Each send flips a per-lead flag so nobody is messaged twice:
 *   Nudge Sent / Follow-Up Sent / Deposit A Notified   (checkboxes)
 *   Call Done At                                         (dateTime, starts the 4-day timer)
 *
 * ANTI-SPAM: the nudge only queries leads created in the last ~65 min (old
 * backlog can never match) AND the Nudge Sent flag makes it once-only; follow-up
 * + deposit rely on the backfilled flags so existing records are never messaged
 * retroactively. Every message claims its "sent" flag BEFORE sending, so a
 * failed write can't cause a re-send on the next tick.
 *
 * SECURITY: requires CRON_SECRET (same pattern as send-reminders.js) and must
 * be registered under `crons` in vercel.json.
 */

export const config = { api: { bodyParser: false } };

import { setSecurityHeaders } from './_security.js';
import { sendDepositWelcome } from './_lib/deposit-welcome.js';
import { destInfo } from './_lib/dest.js';   // single source of truth for destination → Hebrew name + slug
import { firstName } from './_lib/name.js';  // friendly WhatsApp greeting — first name only
import { msgFollowUp } from './_lib/followup.js';   // shared with the manual "send now" button
import { sendNoAnswerNotice } from './_lib/no-answer.js';   // shared with the instant trigger
import { israelWeekendHold } from './_lib/iltime.js';   // Fri 15:00 → Sun 09:00, nobody is here to answer

/* Normalise any stored phone to Israeli intl form ("972XXXXXXXXX") for Green API. */
function toIntlIL(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('972') && d[3] === '0') d = '972' + d.slice(4);
  else if (d.startsWith('0')) d = '972' + d.slice(1);
  else if (d.length === 9 && d[0] === '5') d = '972' + d;
  return d;
}

const SITE          = 'https://highair-expeditions.com';

/* How many of ONE automated message may leave in a single cron run.
 *
 * The cron ticks every 5 minutes, so a leftover is not dropped, it just goes on
 * the next tick — 3 per run is roughly 36 an hour per message type.
 *
 * Measured on the live base (Aug 14 2026, at the owner's "תשלח אותם בנגלות"):
 * the weekend hold releases 14-17 follow-ups AND 9-17 nudge-2s at 09:00 on
 * Sunday, so about 30 near-identical texts would have left one WhatsApp number
 * inside one tick. The weekend is not even the worst case: 85 calls were marked
 * done on 10 Jul 2026, which four days later was 85 follow-ups in a single run.
 * That shape is what gets a sending number flagged, so the cap is always on, not
 * only after a weekend. 30 held messages now drain in about 50 minutes.
 */
const MAX_SENDS_PER_RUN = 3;

/* Canonical lead Expedition (English) → Hebrew name + its own /book/<slug> link,
   so every destination gets its own booking widget + unique link. */
/* destInfo() now lives in ./_lib/dest.js — the single source of truth shared with
   book-slot.js so the destination wording can never drift between messages. */

/* Short, clean per-lead booking code (no ambiguous chars) so the nudge link
   reads like /book/kilimanjaro/k7m3qp instead of a raw record id. */
const CODE_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
function genCode(n = 6) {
  let s = '';
  for (let i = 0; i < n; i++) s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return s;
}

/* ── Message templates ── */
function msgNudge(name, expedition, code) {
  const { he, slug } = destInfo(expedition);
  // The code drops them straight onto the slot picker (we already have their
  // details) — no second form, and the link stays clean.
  const url = `${SITE}/book/${slug}/${code}`;
  return `היי ${firstName(name)}, ראינו שהתעניינת ב${he} עם HighAir 🏔️\n\n`
    + `כדי שנוכל לתת לך את כל הפרטים ולבדוק התאמה, נשמח לתאם שיחה קצרה (ללא התחייבות).\n\n`
    + `אפשר לבחור תאריך ושעה שנוחים לך בקישור כאן 👇\n${url}`;
}
/* ── Nudge 2 (owner, Jul 26 2026): still hasn't booked 24h after submitting ──
   A soft "when suits you?" that invites a reply instead of a link. Greeting
   adapts to the Israel clock so "צהריים טובים" can never land at 3am — and the
   send itself is held to 09:00-21:00 (the 24-48h window lets it wait). */
function greetHe() {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: 'numeric', hour12: false }).format(new Date()));
  return h < 12 ? 'בוקר טוב' : h < 18 ? 'צהריים טובים' : 'ערב טוב';
}
function msgNudge2(name, expedition) {
  const info = destInfo(expedition);
  const about = info.slug !== 'call' ? `ה${info.he}` : 'המסע';
  return `היי ${firstName(name)}, ${greetHe()} 🙂\nמתי יהיה לך נוח שניצור קשר לגבי ${about}?`;
}

/* The no-answer notice (owner, Jul 29 2026) lives in _lib/no-answer.js —
   shared with api/notify-no-answer.js (the Lead Center's instant trigger) so
   both paths send the identical message with identical guards. */

/* msgFollowUp lives in _lib/followup.js — shared with api/send-followup.js (the
   admin's manual "send now" button) so both send the identical message. */
/* The deposit-welcome message + FB Purchase now live in _lib/deposit-welcome.js
   (shared with api/notify-deposit.js, the instant admin trigger). */

function isAuthorizedCron(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    console.error('[lead-messaging] CRON_SECRET env var not set — refusing all invocations');
    return false;
  }
  const auth = req.headers.authorization || '';
  const m = /^Bearer\s+(.+)$/.exec(auth);
  if (!m) return false;
  const a = Buffer.from(m[1]);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  if (req.method !== 'GET') return res.status(405).end();
  if (!isAuthorizedCron(req)) return res.status(401).json({ error: 'Unauthorized' });

  const TOKEN       = process.env.AIRTABLE_TOKEN;
  const BASE        = process.env.AIRTABLE_BASE;
  const GA_INSTANCE = process.env.GREENAPI_INSTANCE;
  const GA_TOKEN    = process.env.GREENAPI_TOKEN;
  if (!TOKEN || !BASE || !GA_INSTANCE || !GA_TOKEN) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  // Global PAUSE switch (AppContent key "lead_messaging_paused"). While set, this
  // cron sends NOTHING — used during a manual pipeline re-staging so no lead fires
  // an automation regardless of the stage it's moved to. Cleared when we go live.
  try {
    const pr = await fetch(`https://api.airtable.com/v0/${BASE}/AppContent?filterByFormula=${encodeURIComponent('{Key}="lead_messaging_paused"')}&fields[]=Value&maxRecords=1`,
      { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (pr.ok) {
      const v = String((await pr.json()).records?.[0]?.fields?.Value || '').trim().toLowerCase();
      if (v === '1' || v === 'true' || v === 'yes' || v === 'on') {
        return res.json({ ok: true, paused: true });
      }
    }
  } catch (e) { console.warn('[lead-messaging] pause check non-fatal:', e.message); }

  const LEADS = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}`;
  const authHeaders = { Authorization: `Bearer ${TOKEN}` };
  const nowMs = Date.now();

  /* Send a WhatsApp and report HONESTLY whether it actually went out.
     This used to return null for an unusable phone and to hand back Green's body
     even on a 4xx/5xx — so a rate limit, a spam block or a number that isn't on
     WhatsApp all looked like success, and the caller happily ticked "Sent". Green
     answers 200 + {idMessage} on a real send; treat anything else as a failure. */
  const sendWA = async (phone, message) => {
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
  };
  const patchLead = (id, fields) => fetch(`${LEADS}/${id}`, {
    method: 'PATCH', headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  const queryLeads = async (formula) => {
    const r = await fetch(`${LEADS}?filterByFormula=${encodeURIComponent(formula)}&pageSize=100`, { headers: authHeaders });
    const j = await r.json().catch(() => ({}));
    return j.records || [];
  };
  // Has this phone already booked a call? (last-9-digit match on Appointments)
  const hasAppointment = async (phone) => {
    const last9 = String(phone || '').replace(/\D/g, '').slice(-9);
    if (last9.length !== 9) return false;
    const f = encodeURIComponent(`RIGHT(REGEX_REPLACE({Phone},"[^0-9]",""),9)="${last9}"`);
    const r = await fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Appointments')}?filterByFormula=${f}&maxRecords=1&fields[]=Date`, { headers: authHeaders });
    const j = await r.json().catch(() => ({}));
    return (j.records || []).length > 0;
  };

  const result = { nudge: 0, nudgeFailed: 0, nudge2: 0, nudge2Failed: 0, noAnswer: 0, noAnswerFailed: 0, followUp: 0, followUpFailed: 0, followUpNoPhone: 0, callDoneStamped: 0, depositA: 0, fbPurchase: 0, errors: [] };

  /* ── #3 NUDGE ── form lead, no call booked, submitted 10–65 min ago ──────── */
  try {
    const lowerIso = new Date(nowMs - 65 * 60 * 1000).toISOString(); // created no earlier than 65 min ago (10–65 min window — forgiving catch-up if a cron run was missed)
    const formula = `AND(`
      + `{Nudge Sent}!=TRUE(),`
      + `{Stage}='New Lead',`                          // still New Lead = never booked/advanced
      + `NOT(FIND('WhatsApp',{Source}&'')),`           // WhatsApp leads are handled by the AI
      + `NOT(FIND('GHL import',{Source}&'')),`         // never the imported backlog
      + `{Phone}!='',`
      + `IS_AFTER({Created Time},DATETIME_PARSE('${lowerIso}'))`
      + `)`;
    const rows = await queryLeads(formula);
    for (const rec of rows) {
      const f = rec.fields || {};
      const ageMin = (nowMs - new Date(f['Created Time']).getTime()) / 60000;
      if (!(ageMin >= 10)) continue;                   // wait the full 10 min before nudging
      // NEVER nudge someone who already booked a call. book-slot advances the
      // stage on booking, but a call booked seconds after the lead was created
      // can miss that record (Airtable read-lag) and leave it "New Lead" — so
      // check for a real appointment independently, then heal the stage + suppress.
      if (await hasAppointment(f.Phone)) {
        await patchLead(rec.id, { 'Nudge Sent': true, 'Stage': 'Call Scheduled' });
        continue;
      }
      let code = String(f['Book Code'] || '').trim();
      if (!code) {                                     // mint a unique short code once
        for (let i = 0; i < 5 && !code; i++) {
          const c = genCode();
          const hit = await queryLeads(`{Book Code}="${c}"`);
          if (!hit.length) code = c;
        }
        if (!code) code = genCode(9);
        await patchLead(rec.id, { 'Book Code': code });
      }
      const claim = await patchLead(rec.id, { 'Nudge Sent': true });   // claim FIRST — and only send if the claim actually stuck
      if (!claim.ok) { result.errors.push('nudge claim failed ' + rec.id); continue; }   // failed claim + ok send would re-nudge next tick
      const sent = await sendWA(f.Phone, msgNudge(f.Name, f.Expedition, code));
      if (sent.ok) { result.nudge++; continue; }
      await patchLead(rec.id, { 'Nudge Sent': false });   // release it — next run retries
      result.nudgeFailed++;
      result.errors.push(`nudge send failed ${f.Name || rec.id}: ${sent.error}`);
    }
  } catch (e) { result.errors.push('nudge: ' + e.message); }

  /* ── #3b NUDGE 2 ── still New Lead + no call booked, 24h after submitting ──
     Owner (Jul 26 2026): a soft "מתי יהיה לך נוח שניצור קשר?" that invites a
     reply. Same anti-spam shape as #3: a 24-48h window (the backlog can never
     match), once-only via {Nudge 2 Sent} claimed BEFORE sending, WhatsApp/GHL
     sources excluded, and the independent appointment check that heals the
     stage instead of nagging someone who already booked. Held to 09:00-21:00
     Israel, and off for the weekend (Fri 15:00 → Sun 09:00) — the window is
     wide enough to just wait, once it was widened to 96h to survive the hold. */
  try {
    const hourIL = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: 'numeric', hour12: false }).format(new Date()));
    if (hourIL >= 9 && hourIL < 21 && !israelWeekendHold()) {
      /* The upper bound is 96h, not 48h, and the weekend hold is exactly why.
         The hold lasts up to 42 hours, so a lead whose 24h mark fell on Friday
         evening would be 60-odd hours old by Sunday morning and would have
         dropped out of a 48h window without ever being written to — held and
         then silently lost, which is worse than sending. 96h clears the widest
         possible weekend with room to spare, and the once-only {Nudge 2 Sent}
         claim plus the >=24h check below still decide who actually gets it. */
      const lower96 = new Date(nowMs - 96 * 60 * 60 * 1000).toISOString();
      const formula2 = `AND(`
        + `{Nudge Sent}=TRUE(),`                         // got nudge 1 → a real form lead
        + `{Nudge 2 Sent}!=TRUE(),`
        + `{Stage}='New Lead',`                          // still never booked/advanced
        + `NOT(FIND('WhatsApp',{Source}&'')),`
        + `NOT(FIND('GHL import',{Source}&'')),`
        + `{Phone}!='',`
        + `IS_AFTER({Created Time},DATETIME_PARSE('${lower96}'))`
        + `)`;
      const rows2 = await queryLeads(formula2);
      let n2ThisRun = 0;
      for (const rec of rows2) {
        const f = rec.fields || {};
        const ageH = (nowMs - new Date(f['Created Time']).getTime()) / 3600000;
        if (!(ageH >= 24)) continue;                     // wait the full day
        if (await hasAppointment(f.Phone)) {
          await patchLead(rec.id, { 'Nudge 2 Sent': true, 'Stage': 'Call Scheduled' });
          continue;                                      // healing a stage costs nobody a message
        }
        /* Same drip as the follow-up: the Sunday release is 9-17 of these on
           top of the follow-ups, out of one WhatsApp number. */
        if (n2ThisRun >= MAX_SENDS_PER_RUN) { result.nudge2Queued = (result.nudge2Queued || 0) + 1; continue; }
        n2ThisRun++;
        const claim = await patchLead(rec.id, { 'Nudge 2 Sent': true });   // claim FIRST
        if (!claim.ok) { result.errors.push('nudge2 claim failed ' + rec.id); continue; }
        const sent = await sendWA(f.Phone, msgNudge2(f.Name, f.Expedition));
        if (sent.ok) { result.nudge2++; continue; }
        await patchLead(rec.id, { 'Nudge 2 Sent': false });   // release — next run retries
        result.nudge2Failed++;
        result.errors.push(`nudge2 send failed ${f.Name || rec.id}: ${sent.error}`);
      }
    }
  } catch (e) { result.errors.push('nudge2: ' + e.message); }

  /* ── #3c NO-ANSWER NOTICE ── safety net for the instant trigger
     (api/notify-no-answer.js, fired by the Lead Center on a confirmed move).
     Catches instant calls that failed and manual Airtable stage edits. It no
     longer catches deferred sends, because this message has no quiet hours and
     no weekend hold any more (owner, Aug 15 2026) — it is a reply to a call the
     agent just made, so it goes out when the call happened. Bounded 48h window
     on {Stage Changed At} so the backlog can never match; the remaining guards
     (flag claim, agent lookup) live in sendNoAnswerNotice. */
  try {
    const lowerNA = new Date(nowMs - 48 * 60 * 60 * 1000).toISOString();
    const rowsNA = await queryLeads(`AND(`
      + `{Stage}='No Answer',`
      + `{No Answer Notified}!=TRUE(),`
      + `{Phone}!='',`
      + `{Assigned Agent}!='',`
      + `{Stage Changed At}!='',`
      + `IS_AFTER({Stage Changed At},DATETIME_PARSE('${lowerNA}'))`
      + `)`);
    for (const rec of rowsNA) {
      const out = await sendNoAnswerNotice(rec);
      if (out.sent) result.noAnswer++;
      else if (out.error) { result.noAnswerFailed++; result.errors.push(`noAnswer ${rec.fields?.Name || rec.id}: ${out.error}`); }
    }
  } catch (e) { result.errors.push('noAnswer: ' + e.message); }

  /* ── #4 FOLLOW-UP ── 4 days after the call was marked done ────────────────── */
  try {
    // (a) stamp Call Done At the first time we see a Call Done lead (starts the timer)
    //     This runs through the weekend on purpose: it starts a clock, it does not
    //     message anyone, and skipping it would push every Friday call's follow-up
    //     two days late for good.
    const toStamp = await queryLeads(`AND({Stage}='Call Done',{Call Done At}='')`);
    for (const rec of toStamp) {
      await patchLead(rec.id, { 'Call Done At': new Date(nowMs).toISOString() });
      result.callDoneStamped++;
    }
    // (b) send the follow-up 4 days after the call. Moving the card on its own does
    // NOT cancel it (a lead in "Follow-Up Sent" still gets the automated nudge) —
    // we skip only leads where a "how are you?" would be wrong or embarrassing:
    // already closed (Deposit A Paid), lost (Not Relevant), an existing customer,
    // or already asked to pay (Awaiting Deposit A — owner's call, Jul 2026).
    // 'Cancelled' joins them (Aug 10 2026): someone who closed and then cancelled
    // is the last person who should be asked "how did the call go, still keen?".
    // Keep in step with FOLLOW_UP_SKIP_STAGES in the webapp's src/data/leads.js —
    // that tracker promises what this query actually sends.
    /* The weekend hold (owner, Aug 14 2026: "זה סופש ואנחנו לא עובדים").
       This is the message he named, and the safest one to hold: the query has NO
       upper bound on age, so a follow-up that falls due on Friday evening simply
       goes out at 09:00 on Sunday. Nothing is skipped, only delayed.
       It sits AFTER the Call Done At stamping above on purpose — that starts a
       clock rather than messaging anyone, and pausing it would push every Friday
       call's follow-up two days late permanently. */
    const weekend = israelWeekendHold();
    if (weekend) result.followUpHeldForWeekend = true;
    const due = weekend ? [] : await queryLeads(`AND({Call Done At}!='',{Follow-Up Sent}!=TRUE(),{Stage}!='Deposit A Paid',{Stage}!='Cancelled',{Stage}!='Not Relevant',{Stage}!='לקוח קיים',{Stage}!='לקוח רשום',{Stage}!='Awaiting Deposit A')`);
    let fuThisRun = 0;
    for (const rec of due) {
      const f = rec.fields || {};
      const ageDays = (nowMs - new Date(f['Call Done At']).getTime()) / 86400000;
      if (!(ageDays >= 4)) continue;
      if (!f.Phone) { result.followUpNoPhone++; continue; }   // nothing to send to — never tick "Sent"
      /* Drip, do not dump. The flag is unclaimed, so whoever is left here is
         simply first in line on the next tick five minutes from now. */
      if (fuThisRun >= MAX_SENDS_PER_RUN) { result.followUpQueued = (result.followUpQueued || 0) + 1; continue; }
      fuThisRun++;
      // Claim FIRST so two overlapping cron runs can't double-send, then UNDO the
      // claim if the send didn't actually happen. Ticking "Sent" up front and
      // never checking the result is what marked leads as messaged when Green had
      // silently refused — the customer heard nothing and we thought we'd written.
      const claim = await patchLead(rec.id, { 'Follow-Up Sent': true });
      if (!claim.ok) { result.errors.push('followUp claim failed ' + rec.id); continue; }
      const sent = await sendWA(f.Phone, msgFollowUp(f.Name, f.Expedition));
      if (sent.ok) {
        // The message went out → the card belongs in "Follow-Up Sent".
        if (f.Stage !== 'Follow-Up Sent') await patchLead(rec.id, { 'Stage': 'Follow-Up Sent' });
        result.followUp++;
        continue;
      }
      await patchLead(rec.id, { 'Follow-Up Sent': false });   // release it — next run retries
      result.followUpFailed++;
      result.errors.push(`followUp send failed ${f.Name || rec.id}: ${sent.error}`);
    }
  } catch (e) { result.errors.push('followUp: ' + e.message); }

  /* #4b COMMUNITY INVITE (10 days) and #4c SOFT CLOSE (21 days) were removed on
     8 Aug 2026 at the owner's instruction. The nurture now ends at #4, the
     4-day follow-up. Their Airtable flags — Follow-Up 2 Sent / Follow-Up 3
     Sent — and msgCommunity / msgSoftClose are gone with them; if either touch
     ever comes back it should be rebuilt against the stage model of that day,
     not resurrected from here. */

  /* ── #5 DEPOSIT A ── moved to "Deposit A Paid" (closing) ─────────────────── */
  try {
    // Safety-net for any closing the instant admin trigger (api/notify-deposit.js)
    // missed. sendDepositWelcome claims {Deposit A Notified} first, so this can
    // never double-send what the instant call already handled.
    const rows = await queryLeads(`AND({Stage}='Deposit A Paid',{Deposit A Notified}!=TRUE())`);
    for (const rec of rows) {
      const out = await sendDepositWelcome(rec);
      if (out.fbFired) result.fbPurchase++;
      result.depositA++;
    }
  } catch (e) { result.errors.push('depositA: ' + e.message); }

  console.log('[lead-messaging]', JSON.stringify(result));
  return res.json({ ok: true, ...result });
}
