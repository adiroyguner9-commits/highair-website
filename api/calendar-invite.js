/**
 * GET /api/calendar-invite?date=YYYY-MM-DD&time=HH:MM&name=...&expedition=...
 * Serves an ICS file with proper HTTP headers so iOS opens it directly in Calendar.
 */

const HE_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני',
                   'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HE_DAYS   = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { date, time, name = '', expedition = '' } = req.query;
  if (!date || !time) return res.status(400).send('Missing date or time');

  const pad = n => String(n).padStart(2, '0');
  const [h, m]     = time.split(':').map(Number);
  const [yr, mo, dy] = date.split('-').map(Number);

  // Israel UTC offset: IDT (UTC+3) last-Sun-Mar → last-Sun-Oct, else IST (UTC+2)
  const d0         = new Date(yr, mo - 1, dy);
  const lastSunMar = new Date(yr, 2,  31 - new Date(yr, 2,  31).getDay());
  const lastSunOct = new Date(yr, 9,  31 - new Date(yr, 9,  31).getDay());
  const offset     = (d0 >= lastSunMar && d0 < lastSunOct) ? 3 : 2;

  const startUTC   = h * 60 + m - offset * 60;
  const endUTC     = startUTC + 30;
  const toHHMM = min => `${pad(Math.floor(min / 60))}${pad(min % 60)}`;
  const dateStr    = `${yr}${pad(mo)}${pad(dy)}`;

  const uid  = `${date}T${time.replace(':', '')}@highair-expeditions.com`;
  const desc = expedition ? `שיחה לגבי משלחת: ${expedition}` : 'שיחה עם HighAir Expeditions';

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
