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

import { setSecurityHeaders } from './_security.js';
import { israelCallStamps } from './_lib/iltime.js';

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
  setSecurityHeaders(req, res);
  if (req.method !== 'GET') return res.status(405).end();

  const { date, time, name = '', expedition = '' } = req.query;
  if (!date || !time) return res.status(400).send('Missing date or time');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return res.status(400).send('Invalid date');
  if (!/^\d{2}:\d{2}$/.test(String(time)))       return res.status(400).send('Invalid time');

  /* Israel's wall clock → UTC through the shared helper. The summer-time rule
     written here was an hour out two days a year (W29, see api/_lib/iltime.js). */
  const { dtStart, dtEnd } = israelCallStamps(String(date), String(time));

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
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
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
