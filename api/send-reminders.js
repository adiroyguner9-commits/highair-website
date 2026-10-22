/**
 * GET /api/send-reminders
 * Called by Vercel Cron every 30 minutes.
 * Finds appointments starting in ~2 hours and sends a WhatsApp reminder.
 *
 * SECURITY: Requires CRON_SECRET. Vercel's cron infra automatically sends
 * `Authorization: Bearer <CRON_SECRET>` when the env var is set on the project.
 * The endpoint MUST also be registered under `crons` in vercel.json.
 */

export const config = { api: { bodyParser: false } };

import { israelNow } from './_lib/iltime.js';
import { setSecurityHeaders } from './_security.js';
import { destHe } from './_lib/dest.js';
import { firstName } from './_lib/name.js';   // WhatsApp greeting — first name only
import { greenFetch } from './_lib/green.js';
import { fetchActiveLead } from './_lib/active-lead.js';   // resolve the lead's Hebrew name by phone

/* Normalise any stored phone to Israeli intl form ("972XXXXXXXXX") for the
   Green API chatId — handles 0…, +972…, "+972 0…", and the missing-leading-0
   case (e.g. "509892562" → "972509892562"). Same helper as book-slot.js so
   reminders can never silently fail on a badly-formatted number. */
function toIntlIL(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('972') && d[3] === '0') d = '972' + d.slice(4);
  else if (d.startsWith('0')) d = '972' + d.slice(1);
  else if (d.length === 9 && d[0] === '5') d = '972' + d;
  return d;
}

function isAuthorizedCron(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    console.error('[reminders] CRON_SECRET env var not set — refusing all invocations');
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

  /* The global pause covers this too: a staff-booked call made during a
     pause got no confirmation but still got this reminder (22 Oct 2026). */
  try {
    const pr = await fetch(`https://api.airtable.com/v0/${BASE}/AppContent?filterByFormula=${encodeURIComponent('{Key}="lead_messaging_paused"')}&fields[]=Value&maxRecords=1`, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (pr.ok) {
      const v = String((await pr.json()).records?.[0]?.fields?.Value || '').trim().toLowerCase();
      if (v === '1' || v === 'true' || v === 'yes' || v === 'on') return res.status(200).json({ ok: true, paused: true });
    }
  } catch (e) { console.warn('[reminders] pause check non-fatal:', e.message); }

  /* Israel wall clock from the shared helper. The hand-rolled rule switched
     on the last SUNDAY of March; Israel switches on the Friday before, so on
     those two days reminders went out an hour late (22 Oct 2026). */
  const { ymd: ilYmd, minutes: nowMinutes } = israelNow();

  // Window: appointments starting between 110–130 min from now (centred on 2h)
  const windowStart = nowMinutes + 110;
  const windowEnd   = nowMinutes + 130;

  // Today's date in Israel time
  const dateStr = ilYmd;

  // Query Airtable for confirmed appointments today.
  // dateStr is built from the system clock (no user input), but defence-in-depth:
  // hard regex-validate before interpolating.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return res.status(500).json({ error: 'Internal date format error' });
  }
  /* ReminderSent is a TEXT column. The flag used to be written as a boolean,
     which Airtable rejects on a text field, so it was never set (empty on all
     707 calls, 22 Oct 2026) and a call at an off-quarter time (09:55) fell in
     two runs' windows and got two reminders. Written as 'true' now, and read
     as "empty". A reschedule in the Lead Center clears it, so the new time
     gets its own reminder. */
  const formula = encodeURIComponent(`AND({Date}="${dateStr}",{Status}="confirmed",NOT({ReminderSent}))`);
  let records = [];
  try {
    const atRes  = await fetch(
      `https://api.airtable.com/v0/${BASE}/Appointments?filterByFormula=${formula}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    const atData = await atRes.json();
    records = atData.records || [];
  } catch (e) {
    console.error('[reminders] Airtable fetch error:', e.message);
    return res.status(500).json({ error: e.message });
  }

  const results = [];

  for (const record of records) {
    const { Time, Name, Phone, Expedition } = record.fields;
    if (!Time || !Phone) continue;

    const [h, m]      = Time.split(':').map(Number);
    const slotMinutes = h * 60 + m;

    if (slotMinutes < windowStart || slotMinutes > windowEnd) continue;

    // Send WhatsApp reminder
    const clientNum = toIntlIL(Phone);
    if (!clientNum) continue;

    // Greet with the lead's Hebrew name (correctable in the Lead Center), not the
    // English name frozen on the appointment at booking time — so a name fixed any
    // time before the call shows correctly here. Falls back to the appointment name.
    let greetName = Name;
    try {
      const lead = await fetchActiveLead({ base: BASE, token: TOKEN, phone: Phone, fields: ['Name'] });
      const ln = String(lead?.fields?.Name || '').trim();
      if (ln) greetName = ln;
    } catch { /* keep the appointment name */ }

    const message   = `היי ${firstName(greetName)}, מה שלומך?\n\nתזכורת קטנה לשיחה שלנו היום בשעה ${Time}${Expedition ? ` לגבי ${destHe(Expedition)} 🏔️` : ''}\n\nנשמח לאישור שלך ב- 👍🏼`;

    try {
      const waRes  = await greenFetch(
        'sendMessage',
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ chatId: `${clientNum}@c.us`, message }),
        },
        '', { kind: 'call_reminder' }
      );
      const waData = await waRes.json().catch(() => ({}));
      console.log(`[reminders] Sent to ${clientNum}:`, waData?.idMessage);
      /* Green answers 200 with no idMessage when it did not take the message.
         Then the flag stays unset, so the next run (15 minutes on, still inside
         the window) tries again, and it is reported as failed, not "sent". */
      if (!waRes.ok || !waData?.idMessage) {
        results.push({ name: Name, time: Time, status: 'error', error: `Green did not accept the message (${waRes.status})` });
        continue;
      }

      // Mark ReminderSent = true in Airtable so we don't send twice
      await fetch(`https://api.airtable.com/v0/${BASE}/Appointments/${record.id}`, {
        method:  'PATCH',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ fields: { ReminderSent: 'true' } }),
      });

      results.push({ name: Name, time: Time, status: 'sent' });
    } catch (e) {
      console.warn('[reminders] WhatsApp error:', e.message);
      results.push({ name: Name, time: Time, status: 'error', error: e.message });
    }
  }

  console.log(`[reminders] Done. Processed ${results.length} reminder(s).`);
  return res.json({ ok: true, sent: results.length, results });
}
