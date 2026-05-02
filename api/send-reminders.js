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
  if (req.method !== 'GET') return res.status(405).end();
  if (!isAuthorizedCron(req)) return res.status(401).json({ error: 'Unauthorized' });

  const TOKEN       = process.env.AIRTABLE_TOKEN;
  const BASE        = process.env.AIRTABLE_BASE;
  const GA_INSTANCE = process.env.GREENAPI_INSTANCE;
  const GA_TOKEN    = process.env.GREENAPI_TOKEN;

  if (!TOKEN || !BASE || !GA_INSTANCE || !GA_TOKEN) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  // Israel time offset (IDT UTC+3 / IST UTC+2)
  const nowUTC   = new Date();
  const yr       = nowUTC.getUTCFullYear();
  const mo       = nowUTC.getUTCMonth();
  const dy       = nowUTC.getUTCDate();
  const d0       = new Date(yr, mo, dy);
  const lastSunMar = new Date(yr, 2, 31 - new Date(yr, 2, 31).getDay());
  const lastSunOct = new Date(yr, 9, 31 - new Date(yr, 9, 31).getDay());
  const ilOffset = (d0 >= lastSunMar && d0 < lastSunOct) ? 3 : 2;

  const nowIL      = new Date(nowUTC.getTime() + ilOffset * 60 * 60 * 1000);
  const nowMinutes = nowIL.getUTCHours() * 60 + nowIL.getUTCMinutes();

  // Window: appointments starting between 110–130 min from now (centred on 2h)
  const windowStart = nowMinutes + 110;
  const windowEnd   = nowMinutes + 130;

  // Today's date in Israel time
  const pad     = n => String(n).padStart(2, '0');
  const dateStr = `${nowIL.getUTCFullYear()}-${pad(nowIL.getUTCMonth() + 1)}-${pad(nowIL.getUTCDate())}`;

  // Query Airtable for confirmed appointments today.
  // dateStr is built from the system clock (no user input), but defence-in-depth:
  // hard regex-validate before interpolating.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return res.status(500).json({ error: 'Internal date format error' });
  }
  const formula = encodeURIComponent(`AND({Date}="${dateStr}",{Status}="confirmed",{ReminderSent}!=TRUE())`);
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
    const clientNum = Phone.replace(/^0/, '972').replace(/[-\s]/g, '');
    const message   = `היי ${Name || ''}, מה שלומך?\n\nתזכורת קטנה לשיחה שלנו היום בשעה ${Time}${Expedition ? ` לגבי ${Expedition} 🏔️` : ''}\n\nנשמח לאישור שלך ב- 👍🏼`;

    try {
      const waRes  = await fetch(
        `https://api.green-api.com/waInstance${GA_INSTANCE}/sendMessage/${GA_TOKEN}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ chatId: `${clientNum}@c.us`, message }),
        }
      );
      const waData = await waRes.json();
      console.log(`[reminders] Sent to ${clientNum}:`, waData?.idMessage);

      // Mark ReminderSent = true in Airtable so we don't send twice
      await fetch(`https://api.airtable.com/v0/${BASE}/Appointments/${record.id}`, {
        method:  'PATCH',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ fields: { ReminderSent: true } }),
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
