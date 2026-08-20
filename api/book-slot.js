/**
 * POST /api/book-slot
 * Books a 30-min call slot, saves to Airtable "Appointments",
 * sends confirmation email (+ .ics attachment) to client,
 * sends admin notification with WhatsApp link + Google Calendar button.
 */

export const config = { api: { bodyParser: true } };

const HE_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני',
                   'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HE_DAYS   = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

function formatDateHe(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return `יום ${HE_DAYS[d.getDay()]}, ${d.getDate()} ב${HE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* Normalise any phone the client typed to a valid international IL number
   ("972XXXXXXXXX") for the Green API chatId — handles 0…, +972…, "+972 0…",
   and the missing-leading-0 case (e.g. "509892562" → "972509892562"). */
function toIntlIL(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('972') && d[3] === '0') d = '972' + d.slice(4);   // 9720… → 972…
  else if (d.startsWith('0')) d = '972' + d.slice(1);                // 0… → 972…
  else if (d.length === 9 && d[0] === '5') d = '972' + d;            // 5XXXXXXXX (dropped leading 0)
  return d;
}

/* Stored format comes from the shared normaliser: "+972501234567". This file
   used to keep its own copy that saved the LOCAL "0XXXXXXXXX" form, so every
   call booked through the site re-dirtied the base — 11 appointments drifted
   back in a single day before this was found (Aug 2 2026). */
const canonPhone = normalizePhone;

/* RFC 5545 §3.3.11 TEXT escaping for all user-supplied ICS values.
   Escapes backslash, semicolon, comma, and CR/LF — without this, attacker
   input in name/expedition can break out of an ICS line and inject new
   properties (ATTENDEE, DESCRIPTION, etc.) — a phishing primitive served
   from the company's own domain. */
function icsEscape(s, max = 200) {
  return String(s ?? '')
    .slice(0, max)
    .replace(/\\/g,   '\\\\')
    .replace(/;/g,    '\\;')
    .replace(/,/g,    '\\,')
    .replace(/\r?\n/g, '\\n')
    .replace(/[\x00-\x1F\x7F]/g, '');
}

/* ── ICS helpers ── */
function icsDateTimes(date, time) {
  const pad = n => String(n).padStart(2, '0');
  const [h, m]       = time.split(':').map(Number);
  const [yr, mo, dy] = date.split('-').map(Number);
  const d0           = new Date(yr, mo - 1, dy);
  const lastSunMar   = new Date(yr, 2, 31 - new Date(yr, 2, 31).getDay());
  const lastSunOct   = new Date(yr, 9, 31 - new Date(yr, 9, 31).getDay());
  const offset       = (d0 >= lastSunMar && d0 < lastSunOct) ? 3 : 2;
  const startUTC     = h * 60 + m - offset * 60;
  const endUTC       = startUTC + 30;
  const toHHMM = min => `${pad(Math.floor(min / 60))}${pad(min % 60)}`;
  const ds = `${yr}${pad(mo)}${pad(dy)}`;
  return {
    dtStart: `${ds}T${toHHMM(startUTC)}00Z`,
    dtEnd:   `${ds}T${toHHMM(endUTC)}00Z`,
    uid:     `${date}T${time.replace(':', '')}@highair-expeditions.com`,
  };
}

/* Client ICS — METHOD:PUBLISH */
function generateICS({ date, time, name, expedition }) {
  const { dtStart, dtEnd, uid } = icsDateTimes(date, time);
  const safeExpedition = icsEscape(expedition);
  const desc = safeExpedition ? `שיחה לגבי משלחת: ${safeExpedition}` : 'שיחה עם HighAir Expeditions';
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HighAir Expeditions//IL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'SUMMARY:שיחה עם HighAir Expeditions',
    `DESCRIPTION:${desc}`,
    `UID:${uid}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/* Admin ICS — METHOD:REQUEST → iOS Mail shows Accept/Decline banner automatically */
function generateAdminICS({ date, time, name, expedition, attendeeEmail, attendeeName }) {
  const { dtStart, dtEnd, uid } = icsDateTimes(date, time);
  const safeName       = icsEscape(name);
  const safeExpedition = icsEscape(expedition);
  const desc = [`לקוח: ${safeName}`, safeExpedition ? `משלחת: ${safeExpedition}` : ''].filter(Boolean).join('\\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HighAir Expeditions//IL',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:שיחה עם ${safeName}`,
    `DESCRIPTION:${desc}`,
    'ORGANIZER;CN=HighAir Expeditions:mailto:info@highair-expeditions.com',
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${icsEscape(attendeeName || 'HighAir Admin', 60)}:mailto:${icsEscape(attendeeEmail || 'info@highair-expeditions.com', 120)}`,
    `UID:${uid}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/* ── Google Calendar URL ── */
function googleCalUrl({ date, time, name, expedition }) {
  const pad = n => String(n).padStart(2, '0');
  const [h, m] = time.split(':').map(Number);
  const [yr, mo, dy] = date.split('-').map(Number);

  const dtStart = `${yr}${pad(mo)}${pad(dy)}T${pad(h)}${pad(m)}00`;
  const endTotalMin = h * 60 + m + 30;
  const dtEnd = `${yr}${pad(mo)}${pad(dy)}T${pad(Math.floor(endTotalMin / 60))}${pad(endTotalMin % 60)}00`;

  const params = new URLSearchParams({
    action:  'TEMPLATE',
    text:    `שיחה עם ${name} — HighAir Expeditions`,
    dates:   `${dtStart}/${dtEnd}`,
    ctz:     'Asia/Jerusalem',
    details: expedition ? `משלחת: ${expedition}` : 'HighAir Expeditions',
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/* The lead's own agent gets the call in their calendar (owner, July 21 2026 —
   Eldar asked for it). Opt-in per agent: an agent with no Email on their Agents
   row simply gets nothing, so adding an address is all it takes to switch on.
   Returns '' on any problem — a calendar invite must never break a booking. */
async function lookupAgentEmail(fullName, BASE, TOKEN) {
  const want = String(fullName || '').trim();
  if (!want || !BASE || !TOKEN) return '';
  try {
    const url = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Agents')}?maxRecords=100`
      + `&fields[]=${encodeURIComponent('Name')}&fields[]=${encodeURIComponent('Last Name')}&fields[]=${encodeURIComponent('Email')}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!r.ok) return '';
    const hit = ((await r.json()).records || []).find(x =>
      [(x.fields?.Name || '').trim(), (x.fields?.['Last Name'] || '').trim()].filter(Boolean).join(' ') === want);
    return String(hit?.fields?.Email || '').trim();
  } catch (e) { console.warn('[book-slot] agent email lookup non-fatal:', e.message); return ''; }
}

/* ── Send email via Resend ── */
async function sendEmail(key, { to, subject, html, attachments }) {
  try {
    const body = {
      from:    'HighAir Expeditions <noreply@highair-expeditions.com>',
      to:      [to],
      subject,
      html,
    };
    if (attachments?.length) body.attachments = attachments;

    const r = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (!r.ok) console.error('[book-slot] email error:', await r.text());
  } catch (e) { console.warn('[book-slot] email non-fatal:', e.message); }
}

import {
  escapeHtml,
  sanitiseFields,
  isValidDate,
  isValidTime,
  isValidEmail,
  isValidName,
  checkRateLimit,
  setSecurityHeaders,
} from './_security.js';
import { fetchActiveLead } from './_lib/active-lead.js';
import { fetchCallAgents, busyByTime, someoneFreeAt, freeCoversAt } from './_lib/callAgents.js';
import { normalizePhone, phoneIsValid, phoneError } from './_lib/phone.js';
import { destHe } from './_lib/dest.js';
import { firstName } from './_lib/name.js';   // WhatsApp greeting — first name only
import { israelNow } from './_lib/iltime.js';
import { loadAvailability } from './slots.js';   // same leadMin the slot list uses

/* ════════════════════════════════════════════ */
export default async function handler(req, res) {
  setSecurityHeaders(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  /* ── Rate limiting ── */
  if (!checkRateLimit(req, 'book-slot')) {
    return res.status(429).json({ error: 'Too many requests — please wait a moment' });
  }

  const raw = sanitiseFields(req.body || {});
  let { date, time, name, email, expedition } = raw;
  let phone = canonPhone(raw.phone);   // store every number in the canonical 0XXXXXXXXX format

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE;
  if (!TOKEN || !BASE) return res.status(500).json({ error: 'Server config error' });

  /* ── Tokenized booking ──────────────────────────────────────────────────
     A lead-specific link (/book/<slug>/<code>) carries only a short opaque
     Book Code — never the client's name/phone in the URL. We already have
     their details from the form they filled, so look them up server-side and
     let the client go straight to the slot picker without re-entering. */
  const tok = String(raw.lead || '').trim();
  if (tok) {
    try {
      const F = 'fields[]=Name&fields[]=Phone&fields[]=Email&fields[]=Expedition';
      let lf = null;
      if (/^rec[A-Za-z0-9]{14}$/.test(tok)) {          // legacy record-id token
        const lr = await fetch(
          `https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}/${tok}?${F}`,
          { headers: { Authorization: `Bearer ${TOKEN}` } });
        if (lr.ok) lf = (await lr.json()).fields || null;
      } else if (/^[a-z0-9]{4,12}$/.test(tok)) {        // short Book Code
        const f = encodeURIComponent(`{Book Code}="${tok}"`);
        const lr = await fetch(
          `https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}?filterByFormula=${f}&maxRecords=1&${F}`,
          { headers: { Authorization: `Bearer ${TOKEN}` } });
        if (lr.ok) lf = (await lr.json()).records?.[0]?.fields || null;
      }
      if (lf) {
        name       = name       || (lf.Name || '').trim();
        email      = email      || (lf.Email || '').trim();
        phone      = phone      || canonPhone(lf.Phone);
        // The lead's own Expedition (the destination they enquired about) wins
        // over whatever the link carried — a generic "call"/"שיחת ייעוץ" slug
        // must never end up in the confirmation. So a Kilimanjaro lead's call
        // reads "…לגבי טיפוס לקילימנג׳רו", an Annapurna lead's "…טרק סובב אנאפורנה".
        expedition = (lf.Expedition || '').trim() || expedition;
      }
    } catch (e) { console.warn('[book-slot] lead token lookup non-fatal:', e.message); }
  }

  /* ── Input validation ── */
  if (!date || !time || !name || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!isValidDate(date)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }
  if (!isValidTime(time)) {
    return res.status(400).json({ error: 'Invalid time format' });
  }
  if (!isValidName(name)) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  if (!phoneIsValid(phone)) {
    return res.status(400).json({ error: phoneError(phone) || 'Invalid phone number' });
  }
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const isStaffBooking = raw.staff === true || raw.staff === 'true';

  /* ── Lead-time guard (customer self-bookings only) ─────────────────────
     The slot list alone is not enough: a tab left open serves stale slots,
     and until July 16, 2026 the list itself was computed in UTC — a customer
     booked today's 10:30 at 10:35 Israel because the server thought it was
     07:35. So the SERVER re-checks at the moment of booking, in Israel time:
     nothing in the past, nothing closer than leadMin (owner's 2h rule).
     Staff stay unrestricted — the Lead Center's custom-time booking is
     deliberately allowed to schedule a call minutes ahead. */
  if (!isStaffBooking) {
    const il = israelNow();
    const [sh, sm] = time.split(':').map(Number);
    const slotMinutes = sh * 60 + sm;
    let leadMin = 120;
    try { leadMin = Number((await loadAvailability(TOKEN, BASE)).leadMin) || 120; } catch { /* keep default */ }
    if (date < il.ymd || (date === il.ymd && slotMinutes < il.minutes + leadMin)) {
      console.warn(`[book-slot] rejected too-soon slot ${date} ${time} (IL now ${il.ymd} ${Math.floor(il.minutes/60)}:${String(il.minutes%60).padStart(2,'0')}, leadMin ${leadMin})`);
      return res.status(409).json({ error: 'slot_past' });
    }
  }

  // 1. Race-condition guard — double-check slot availability right before writing.
  //    STAFF bookings (Lead Center custom time) skip it — the owner explicitly
  //    allows double-booking a slot / parallel calls for the team. Customer
  //    self-bookings still can't take an occupied slot.
  /* The same rule /api/slots shows the customer, re-checked here against the
     table: the slot is taken only if every agent who covers this destination is
     already on a call at it. A 09:00 Aconcagua booking is Chen's; it does not
     stop a 09:00 Kilimanjaro call, which is one of the Tomers'. */
  let callAgents = [];
  let busyNow = new Map();
  if (!isStaffBooking) {
    try {
      const formula = encodeURIComponent(`AND({Date}="${date}",{Time}="${time}",{Status}="confirmed")`);
      const chk = await fetch(
        `https://api.airtable.com/v0/${BASE}/Appointments?filterByFormula=${formula}`
          + `&fields[]=Time&fields[]=Agent&fields[]=${encodeURIComponent('Expedition')}`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      if (!chk.ok) throw new Error(`Airtable check failed: ${chk.status}`);
      const chkData = await chk.json();
      const taken = chkData.records || [];
      if (taken.length > 0) {
        /* Something is booked at this time. Whether it matters depends on who
           it belongs to — and if we cannot find that out, we refuse rather than
           risk putting two customers on one person. */
        try {
          callAgents = await fetchCallAgents(BASE, TOKEN);
        } catch (e) {
          console.warn('[book-slot] agent lookup failed:', e.message);
          return res.status(409).json({ error: 'slot_taken' });
        }
        busyNow = busyByTime(taken, callAgents);
        if (!someoneFreeAt({ time, expedition, agents: callAgents, busy: busyNow })) {
          return res.status(409).json({ error: 'slot_taken' });
        }
      }
    } catch (e) {
      console.warn('[book-slot] availability check failed:', e.message);
      // Do not proceed if we can't verify — prevents overbooking on check failure
      return res.status(503).json({ error: 'Unable to verify slot availability — please try again' });
    }
  }

  // 2. Write to Airtable
  const atRes = await fetch(`https://api.airtable.com/v0/${BASE}/Appointments`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        Date:       date,
        Time:       time,
        Name:       name,
        Phone:      phone,
        Email:      email      || '',
        Expedition: expedition || '',
        Status:     'confirmed',
      },
    }),
  });
  if (!atRes.ok) {
    const err = await atRes.json();
    console.error('[book-slot] Airtable error:', err);
    return res.status(500).json({ error: 'Booking failed' });
  }
  /* Kept so the agent can be stamped on the row once the lead lookup below
     resolves who it is. Availability is read off that field from then on. */
  const apptId = (await atRes.clone().json().catch(() => ({})))?.id || '';

  // 2b. Advance the matching Website Lead to "Call Scheduled" (by phone, last 9
  //     digits) — but only if it hasn't progressed past the call step yet. Also
  //     grab its Assigned Agent so the alert goes only to that agent.
  let assignedAgent = '';
  try {
    {
      /* The ACTIVE card. Matching on phone alone took whichever row came back
         first, so a returning customer's closed trip won and the booking landed
         on the wrong lead — or on none (Aug 13 2026). */
      const rec = await fetchActiveLead({
        base: BASE, token: TOKEN, phone,
        fields: ['Assigned Agent', 'Activity Log', 'Expedition'],
      });
      {
        const stage = rec?.fields?.Stage || '';
        assignedAgent = (rec?.fields?.['Assigned Agent'] || '').trim();
        /* Booking a call ALWAYS puts the lead in "Call Scheduled" (owner, July 21
           2026: "לא משנה באיזה סטייג הוא נמצא"). Awaiting-Deposit-A and
           Not-Relevant used to be skipped; they are not anymore. Re-running it on
           a lead already at Call Scheduled is intentional too — the stage write is
           a no-op but the Activity Log entry and the Kilimanjaro re-assignment
           below still need to happen for a re-booking.
           ONE exception: "Deposit A Paid". Payroll counts a closing by its STAGE,
           so demoting a won deal would silently delete the agent's commission
           (4 closed leads currently have calls; $370 of July pay sits on them).
           A post-sale call must not cost an agent their money. */
        if (rec && stage !== 'Deposit A Paid') {
          // Record the booking in the lead's Activity Log (newest first) so the
          // team can see who booked when, with full oversight.
          const stamp = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jerusalem', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
          const entry = `[${stamp}] Call scheduled · ${date} at ${time}`;
          const prevLog = rec.fields?.['Activity Log'] || '';
          const patch = { Stage: 'Call Scheduled', 'Nudge Sent': true, 'Activity Log': prevLog ? `${entry}\n${prevLog}` : entry };

          /* ── Kilimanjaro: ONE global 4:1 split toward Tomer Lan (owner,
             July 23 2026 — replaces the old booked/non-booked inverse buckets).
             Wherever a Kilimanjaro lead enters — fresh form lead or straight to
             a booked call — Lan takes 4 of every 5, Harush the 5th. Booking is
             no longer a reassignment signal, so this path only fills in a lead
             that has NO agent yet (created right here, or the lead-notify cron
             hasn't reached it) and never takes a lead away from anyone.
             lead-notify.js runs the identical tally — keep the two in step.

             The ratio is held by COUNTING what has been assigned since the rule
             went live, not by a counter (a serverless instance loses those), so
             it self-corrects and never tries to repair the older backlog. */
          const KILI_LAN = 'Tomer Lan', KILI_HARUSH = 'Tomer Harush';
          const KILI_RATIO_FROM = '2026-08-06T11:58:04.878Z';   // reset on the owner's call (6 Aug 2026) —
  // the old buckets held INVERSE ratios, so counting their mix against the new
  // single ratio would misread history. The tally starts genuinely empty here.
          const isKili = /קילימנ|kilimanjaro/i.test(String(rec.fields?.Expedition || ''));
          if (isKili && !assignedAgent) {
            let takeIt = true;   // default to Lan if the tally can't be read
            try {
              const f = `AND(OR(FIND("קילימנ",{Expedition}&"")>0,FIND("Kilimanjaro",{Expedition}&"")>0),`
                /* CREATED_TIME(), not {Assigned At}: Airtable writes it itself so it
                   can never be blank. A blank {Assigned At} used to hide an
                   assignment from this tally entirely. Must match pickKiliAgent()
                   in the webapp exactly. */
                + `IS_AFTER(CREATED_TIME(),"${KILI_RATIO_FROM}"),`
                + `OR({Assigned Agent}="${KILI_LAN}",{Assigned Agent}="${KILI_HARUSH}"))`;
              const u = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}`
                + `?filterByFormula=${encodeURIComponent(f)}&pageSize=100`
                + `&sort%5B0%5D%5Bfield%5D=${encodeURIComponent('Created Time')}&sort%5B0%5D%5Bdirection%5D=desc`
                + `&fields[]=${encodeURIComponent('Assigned Agent')}`;
              const tr = await fetch(u, { headers: { Authorization: `Bearer ${TOKEN}` } });
              if (tr.ok) {
                let lan = 0, har = 0;
                for (const x of ((await tr.json()).records || [])) {
                  if (x.fields?.['Assigned Agent'] === KILI_LAN) lan++; else har++;
                }
                /* Strict cycle of five: L L L L H, repeating. Must stay
                   byte-for-byte in step with pickKiliAgent() in the webapp's
                   api/lead-notify.js — the two share one tally, and if they
                   disagree on the rule they will fight over the phase. */
                takeIt = ((lan + har) % 5) !== 4;
              }
            } catch (e) { console.warn('[book-slot] kili ratio non-fatal:', e.message); }
            let winner = takeIt ? KILI_LAN : KILI_HARUSH;
            /* Kilimanjaro is the one destination two people share, so the ratio
               can land on somebody who is already on a call at this exact time —
               which is the double-booking the whole change exists to prevent.
               The free one takes it and the ratio catches up on the next lead;
               a rota is a tie-breaker, not a reason to book two customers onto
               one phone. */
            if (!isStaffBooking) {
              const free = freeCoversAt({ time, expedition: rec.fields?.Expedition, agents: callAgents, busy: busyNow });
              if (free.length && !free.includes(winner)) {
                console.log(`[book-slot] kili ratio picked ${winner}, busy at ${time} — ${free[0]} takes it`);
                winner = free[0];
              }
            }
            patch['Assigned Agent'] = winner;
            patch['Assigned At']    = new Date().toISOString();
            assignedAgent = winner;   // so the staff alert + invite go to the right agent
          }

          await fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}/${rec.id}`, {
            method:  'PATCH',
            headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
            // Also suppress the "book a call" nudge — they just booked one. (The
            // nudge cron independently re-checks for an appointment as a backstop
            // in case this lookup raced a just-created lead and found nothing.)
            body:    JSON.stringify({ fields: patch }),
          });
        }
      }
    }
  } catch (e) { console.warn('[book-slot] lead stage update non-fatal:', e.message); }

  /* 2c. Stamp the agent onto the appointment.
     This is what lets the next customer share the time: /api/slots reads this
     field to know WHOSE 09:00 is taken, rather than treating every booking as
     everybody's. It runs after the lead lookup because that is where the name
     comes from — including the Kilimanjaro winner picked just above.
     Non-fatal: a row without it still falls back to its destination's coverers,
     which is the old, safely over-blocking behaviour. */
  if (apptId && assignedAgent) {
    try {
      await fetch(`https://api.airtable.com/v0/${BASE}/Appointments/${apptId}`, {
        method:  'PATCH',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ fields: { Agent: assignedAgent } }),
      });
    } catch (e) { console.warn('[book-slot] agent stamp non-fatal:', e.message); }
  }

  /* The Make.com appointment webhook was removed with GoHighLevel (owner,
     Jul 30 2026): it existed only to push a GHL stage update. The lead's own
     stage is already advanced directly above this. */

    // A STAFF booking (from the admin Lead Center) during the global messaging pause
  // is SILENT: the appointment is created + the lead advanced above (so the call
  // lands in the calendar), but no client/staff messages go out. A real website
  // booking (no `staff` flag) always confirms, even while paused.
  let silent = false;
  if (raw.staff === true || raw.staff === 'true') {
    try {
      const pr = await fetch(`https://api.airtable.com/v0/${BASE}/AppContent?filterByFormula=${encodeURIComponent('{Key}="lead_messaging_paused"')}&fields[]=Value&maxRecords=1`, { headers: { Authorization: `Bearer ${TOKEN}` } });
      const pv = String((await pr.json()).records?.[0]?.fields?.Value || '').trim().toLowerCase();
      if (pv === '1' || pv === 'true' || pv === 'yes' || pv === 'on') silent = true;   // match the cron's truthiness
    } catch (e) { console.warn('[book-slot] pause check non-fatal:', e.message); }
  }

  // Destination in HEBREW for every customer-facing message (never "Kilimanjaro").
  const expeditionHe = destHe(expedition);

  // 4. WhatsApp confirmation to client via Green API
  const GA_INSTANCE = process.env.GREENAPI_INSTANCE;
  const GA_TOKEN    = process.env.GREENAPI_TOKEN;
  if (!silent && GA_INSTANCE && GA_TOKEN && phone) {
    try {
      const clientNum = toIntlIL(phone);
      const waMessage = `היי ${firstName(name)} 👋🏼\n\nהשיחה שלך לגבי ${expeditionHe} שוריינה בהצלחה! 🏔️\n\n🗓️ מתי? ${formatDateHe(date)}\n⏰ שעה: ${time}\n\nאנחנו נתקשר אליך בזמן שנקבע. מצפים לשוחח איתך! 😁`;
      const gaRes = await fetch(
        `https://api.green-api.com/waInstance${GA_INSTANCE}/sendMessage/${GA_TOKEN}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId: `${clientNum}@c.us`, message: waMessage }),
        }
      );
      const gaData = await gaRes.json();
      console.log('[book-slot] WhatsApp status:', gaRes.status, gaData?.idMessage || gaData);
    } catch (e) {
      console.warn('[book-slot] WhatsApp non-fatal:', e.message);
    }
  }

  // 4b. Staff alert — tell the team a call was booked.
  //     PUSH-FIRST via the webapp's push-hook (owners+admins always, the assigned
  //     agent / destination coverer when it's theirs; WhatsApp only as a fallback
  //     for a recipient with no push device yet — handled inside the hook).
  //     If PUSH_HOOK_SECRET isn't configured, fall back to the legacy Green alert.
  if (!silent) {
    const staffMsg =
      `‏ליד קבע שיחה! 📅\nשם: ${name || '—'}\nטלפון: ${phone || '—'}` +
      (expedition ? `\nיעד: ${expeditionHe}` : '') +
      `\nמתי: ${formatDateHe(date)} בשעה ${time}` +
      (assignedAgent ? `\nמשויך ל: ${assignedAgent}` : '');
    const HOOK_SECRET = process.env.PUSH_HOOK_SECRET || '';
    if (HOOK_SECRET) {
      await fetch(`https://app.highair-expeditions.com/api/push-hook?key=${encodeURIComponent(HOOK_SECRET)}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          kind: 'call_booked',   // text/icon owner-editable via AppContent "push_templates"
          name: name || phone || '—', phone: phone || '',
          destination: expedition || '', date: formatDateHe(date), time: time || '',
          assignedAgent, waText: staffMsg, tag: `call-${phone}`,
        }),
      }).then(r => r.json())
        .then(d => console.log('[book-slot] push-hook alert', d))
        .catch(e => console.warn('[book-slot] push-hook non-fatal:', e.message));
    }
    // Staff alerts are PUSH-ONLY now (WhatsApp retired at the owner's request);
    // the legacy Green-API staff-WhatsApp fallback has been removed.
  }

  // 5. Build shared assets
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const dateHe     = formatDateHe(date);
  const clientNum  = toIntlIL(phone);
  const waText     = encodeURIComponent(
    `שלום ${firstName(name)}!\nהשיחה שלך עם HighAir Expeditions אושרה 🏔️\n📅 ${dateHe}\n🕐 ${time}\nנשמח לדבר איתך בקרוב!`
  );
  const waLink  = `https://wa.me/${clientNum}?text=${waText}`;
  const gcalUrl = googleCalUrl({ date, time, name, expedition: expeditionHe });

  // ICS for client — PUBLISH format (regular event)
  const icsContent = generateICS({ date, time, name, expedition: expeditionHe });
  const icsBase64  = Buffer.from(icsContent, 'utf-8').toString('base64');
  const icsAttachment = [{
    filename:     'highair-meeting.ics',
    content:      icsBase64,
    content_type: 'text/calendar; charset=utf-8; method=PUBLISH',
  }];

  // ICS for admin — REQUEST format (iOS shows Accept/Decline banner automatically)
  const adminIcsContent = generateAdminICS({ date, time, name, expedition: expeditionHe });
  const adminIcsBase64  = Buffer.from(adminIcsContent, 'utf-8').toString('base64');
  const adminIcsAttachment = [{
    filename:     'highair-meeting.ics',
    content:      adminIcsBase64,
    content_type: 'text/calendar; charset=utf-8; method=REQUEST',
  }];

  // Direct ICS link — for iOS/macOS (opens Calendar app directly)
  const icsParams  = new URLSearchParams({ date, time, name: name || '', expedition: expeditionHe || '' });
  const icsLink    = `https://highair-website.vercel.app/api/calendar-invite?${icsParams}`;

  if (!silent && RESEND_KEY) {

    // ── Client email ─────────────────────────────────────────────────────
    if (email) {
      await sendEmail(RESEND_KEY, {
        to:          email,
        subject:     `השיחה שלך נקבעה ל-${dateHe} ✅`,
        attachments: icsAttachment,
        html: `
<!DOCTYPE html><html dir="rtl" lang="he">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Arial,sans-serif;direction:rtl;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0FF;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0"
      style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(109,40,217,0.10);max-width:600px;width:100%;">

      <tr><td style="background:linear-gradient(135deg,#4338ca,#7c3aed);padding:28px 32px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">השיחה נקבעה!</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">HighAir Expeditions</p>
      </td></tr>

      <tr><td style="padding:36px;text-align:center;">
        <p style="margin:0 0 4px;font-size:14px;color:#9591B0;">שלום ${escapeHtml(name)},</p>
        <p style="margin:0 0 28px;font-size:15px;color:#1e1b4b;line-height:1.6;">קבענו לך שיחה עם הצוות שלנו.</p>

        <div style="background:#F5F0FF;border-radius:12px;padding:20px 32px;margin-bottom:28px;">
          <p style="margin:0 0 6px;font-size:14px;color:#7c3aed;font-weight:700;">${dateHe}</p>
          <p style="margin:0;font-size:36px;color:#1e1b4b;font-weight:800;letter-spacing:-1px;">${time}</p>
          ${expedition ? `<p style="margin:8px 0 0;font-size:13px;color:#9591B0;">משלחת: ${escapeHtml(expeditionHe)}</p>` : ''}
        </div>

        <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
          <tr>
            <td style="padding:4px;" align="center">
              <a href="${gcalUrl}"
                style="display:inline-block;background:#4285F4;color:#fff;text-decoration:none;
                       padding:12px 22px;border-radius:50px;font-size:14px;font-weight:700;">
                הוסף ל-Google Calendar
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 4px 0;" align="center">
              <a href="${icsLink}"
                style="display:inline-block;background:#1C1C1E;color:#fff;text-decoration:none;
                       padding:12px 22px;border-radius:50px;font-size:14px;font-weight:700;">
                הוסף ל-Apple Calendar
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 4px 0;" align="center">
              <p style="margin:0;font-size:12px;color:#9591B0;">או פתח את הקובץ המצורף לכל יומן אחר</p>
            </td>
          </tr>
        </table>

        <p style="margin:0;font-size:13px;color:#9591B0;line-height:1.7;">
          נשמח לדבר איתך!<br>
          לכל שאלה: <a href="mailto:info@highair-expeditions.com" style="color:#7c3aed;">info@highair-expeditions.com</a>
        </p>
      </td></tr>

      <tr><td style="background:#FAFAF8;padding:20px 32px;text-align:center;border-top:1px solid #ECEAF8;">
        <p style="margin:0;font-size:12px;color:#9591B0;">הודעה זו נשלחה אוטומטית מאתר HighAir Expeditions</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
      });
    }

    // ── Admin email — to info@ only. Employees are alerted via WhatsApp
    //    (Green API → STAFF_NOTIFY_PHONES) instead. ──────────────────────────
    await sendEmail(RESEND_KEY, {
      to:          'info@highair-expeditions.com',
      subject:     `נקבעה שיחה חדשה - ${name} 📅`,
      attachments: adminIcsAttachment,
      html: `
<!DOCTYPE html><html dir="rtl" lang="he">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Arial,sans-serif;direction:rtl;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0FF;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0"
      style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(109,40,217,0.10);max-width:600px;width:100%;">

      <tr><td style="background:linear-gradient(135deg,#4338ca,#7c3aed);padding:28px 32px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">שיחה חדשה נקבעה</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">HighAir Expeditions</p>
      </td></tr>

      <tr><td style="padding:32px;">
        <table width="100%" style="border:1px solid #ECEAF8;border-radius:12px;overflow:hidden;margin-bottom:24px;">
          ${row('שם',    name)}
          ${row('טלפון', phone)}
          ${email      ? row('מייל',   email)      : ''}
          ${expedition ? row('משלחת', expedition) : ''}
          ${row2('תאריך', dateHe)}
          ${row2('שעה',   time)}
        </table>

        <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:12px;">
          <tr>
            <td style="padding:4px;" align="center">
              <a href="${gcalUrl}"
                style="display:inline-block;background:#4285F4;color:#fff;text-decoration:none;
                       padding:13px 28px;border-radius:50px;font-size:14px;font-weight:700;">
                הוסף ל-Google Calendar
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 4px 4px;" align="center">
              <a href="${icsLink}"
                style="display:inline-block;background:#1C1C1E;color:#fff;text-decoration:none;
                       padding:13px 28px;border-radius:50px;font-size:14px;font-weight:700;">
                הוסף ל-Apple Calendar
              </a>
            </td>
          </tr>
        </table>
        <p style="text-align:center;margin:0;font-size:12px;color:#9591B0;">
          ב-iPhone: המייל אמור להציג כפתור "קבל" ישירות בראש ההודעה
        </p>
      </td></tr>

      <tr><td style="background:#FAFAF8;padding:20px 32px;text-align:center;border-top:1px solid #ECEAF8;">
        <p style="margin:0;font-size:12px;color:#9591B0;">הודעה זו נשלחה אוטומטית מאתר HighAir Expeditions</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
    });

    /* ── The lead's own agent gets the same invite, in their calendar ──
       Opt-in: only agents with an Email on their Agents row. The ICS names THEM
       as the attendee (not info@), so Accept/Decline is theirs. Best-effort —
       wrapped so a failed invite can never fail the booking itself. */
    try {
      const agentTo = await lookupAgentEmail(assignedAgent, BASE, TOKEN);
      if (agentTo) {
        const agentIcs = generateAdminICS({
          date, time, name, expedition: expeditionHe,
          attendeeEmail: agentTo, attendeeName: assignedAgent,
        });
        await sendEmail(RESEND_KEY, {
          to:      agentTo,
          subject: `שיחה חדשה עם ${name} 📅`,
          attachments: [{
            filename:     'highair-meeting.ics',
            content:      Buffer.from(agentIcs, 'utf-8').toString('base64'),
            content_type: 'text/calendar; charset=utf-8; method=REQUEST',
          }],
          html: `
<!DOCTYPE html><html dir="rtl" lang="he">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Arial,sans-serif;direction:rtl;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0FF;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(109,40,217,0.10);max-width:600px;width:100%;">
      <tr><td style="background:linear-gradient(135deg,#4338ca,#7c3aed);padding:28px 32px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">נקבעה לך שיחה</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">HighAir Expeditions</p>
      </td></tr>
      <tr><td style="padding:32px;">
        <table width="100%" style="border:1px solid #ECEAF8;border-radius:12px;overflow:hidden;margin-bottom:24px;">
          ${row('שם',    name)}
          ${row('טלפון', phone)}
          ${email      ? row('מייל',   email)      : ''}
          ${expedition ? row('משלחת', expedition) : ''}
          ${row2('תאריך', dateHe)}
          ${row2('שעה',   time)}
        </table>
        <p style="text-align:center;margin:0;font-size:12px;color:#9591B0;">
          הזימון מצורף למייל — אישור יוסיף אותו ליומן שלך
        </p>
      </td></tr>
      <tr><td style="background:#FAFAF8;padding:20px 32px;text-align:center;border-top:1px solid #ECEAF8;">
        <p style="margin:0;font-size:12px;color:#9591B0;">הודעה זו נשלחה אוטומטית מאתר HighAir Expeditions</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
        });
      }
    } catch (e) { console.warn('[book-slot] agent invite non-fatal:', e.message); }
  }

  return res.json({ ok: true });
}

function row(label, value) {
  if (!value) return '';
  return `<tr>
    <td style="padding:12px 16px;background:#FAFAF8;font-size:12px;color:#6B6B8A;font-weight:600;width:35%;border-bottom:1px solid #ECEAF8;">${escapeHtml(label)}</td>
    <td style="padding:12px 16px;font-size:14px;color:#1e1b4b;font-weight:500;border-bottom:1px solid #ECEAF8;">${escapeHtml(String(value))}</td>
  </tr>`;
}
function row2(label, value) {
  if (!value) return '';
  return `<tr>
    <td style="padding:12px 16px;background:#F5F0FF;font-size:12px;color:#6B6B8A;font-weight:600;width:35%;border-bottom:1px solid #ECEAF8;">${escapeHtml(label)}</td>
    <td style="padding:12px 16px;font-size:16px;color:#7c3aed;font-weight:700;border-bottom:1px solid #ECEAF8;">${escapeHtml(String(value))}</td>
  </tr>`;
}
