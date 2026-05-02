/**
 * GET /api/calendar-invite?date=YYYY-MM-DD&time=HH:MM&name=...&expedition=...
 *
 * Serves an ICS file. SECURITY: all user-supplied values are RFC 5545
 * escaped (\ ; , and CR/LF) before being interpolated into ICS lines.
 * Without this, a CRLF in `name`/`expedition` would let an attacker
 * inject arbitrary ICS properties (ATTENDEE, DESCRIPTION, etc.) and use
 * the company domain as a phishing vector.
 *
 * date/time are strict regex-validated; long values are truncated.
 */

/* RFC 5545 §3.3.11 TEXT escaping. Order matters: escape backslash first. */
function icsEscape(s, max = 200) {
  return String(s ?? '')
    .slice(0, max)
    .replace(/\\/g,   '\\\\')
    .replace(/;/g,    '\\;')
    .replace(/,/g,    '\\,')
    .replace(/\r?\n/g, '\\n')
    .replace(/[\x00-\x1F\x7F]/g, ''); // strip any other control chars
}

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { date, time, name = '', expedition = '' } = req.query;
  if (!date || !time) return res.status(400).send('Missing date or time');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return res.status(400).send('Invalid date');
  if (!/^\d{2}:\d{2}$/.test(String(time)))       return res.status(400).send('Invalid time');

  const pad = n => String(n).padStart(2, '0');
  const [h, m]       = String(time).split(':').map(Number);
  const [yr, mo, dy] = String(date).split('-').map(Number);

  // Israel UTC offset: IDT (UTC+3) last-Sun-Mar → last-Sun-Oct, else IST (UTC+2)
  const d0         = new Date(yr, mo - 1, dy);
  const lastSunMar = new Date(yr, 2,  31 - new Date(yr, 2,  31).getDay());
  const lastSunOct = new Date(yr, 9,  31 - new Date(yr, 9,  31).getDay());
  const offset     = (d0 >= lastSunMar && d0 < lastSunOct) ? 3 : 2;

  const startUTC   = h * 60 + m - offset * 60;
  const endUTC     = startUTC + 30;
  const toHHMM = min => `${pad(Math.floor(min / 60))}${pad(min % 60)}`;
  const dateStr    = `${yr}${pad(mo)}${pad(dy)}`;

  const safeExpedition = icsEscape(expedition);
  const desc = safeExpedition ? `שיחה לגבי משלחת: ${safeExpedition}` : 'שיחה עם HighAir Expeditions';
  const uid  = `${date}T${String(time).replace(':', '')}@highair-expeditions.com`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HighAir Expeditions//IL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${dateStr}T${toHHMM(startUTC)}00Z`,
    `DTEND:${dateStr}T${toHHMM(endUTC)}00Z`,
    'SUMMARY:שיחה עם HighAir Expeditions',
    `DESCRIPTION:${desc}`,
    `ORGANIZER;CN=HighAir Expeditions:mailto:info@highair-expeditions.com`,
    `UID:${uid}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8; method=PUBLISH');
  res.setHeader('Content-Disposition', `attachment; filename="highair-meeting.ics"`);
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).send(ics);
}
