/**
 * GET /api/slots?date=YYYY-MM-DD
 * Returns available call slots for a given date.
 *
 * Availability (open days, hours, slot length, lead time, blackout dates) is
 * read from the Airtable AppContent `booking_availability` key — admin-editable
 * in the webapp Settings → Booking. Falls back to the historical hardcoded
 * defaults (Sun–Thu 09:00–18:00 | Fri 09:00–13:00 | Sat closed | 30-min slots)
 * so behaviour is unchanged until an admin edits the config.
 */

import { checkRateLimit, setSecurityHeaders } from './_security.js';
import { israelNow } from './_lib/iltime.js';

const DEFAULT_AVAILABILITY = {
  days:     [0, 1, 2, 3, 4, 5], // Sun–Fri open, Sat closed
  start:    '09:00',
  end:      '18:00',
  friEnd:   '13:00',            // Friday closes earlier
  slotMin:  30,
  leadMin:  120,                // same-day: must book at least this many minutes ahead (2 hours)
  blackout: [],                 // fully-closed YYYY-MM-DD dates
};

function hhmmToMin(s, fallback) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || ''));
  if (!m) return fallback;
  return Number(m[1]) * 60 + Number(m[2]);
}

export async function loadAvailability(TOKEN, BASE) {
  try {
    const formula = encodeURIComponent(`{Key}="booking_availability"`);
    const r = await fetch(
      `https://api.airtable.com/v0/${BASE}/AppContent?filterByFormula=${formula}&fields[]=Value`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    if (!r.ok) return DEFAULT_AVAILABILITY;
    const d = await r.json();
    const raw = d.records?.[0]?.fields?.Value;
    if (!raw) return DEFAULT_AVAILABILITY;
    const cfg = JSON.parse(raw);
    return {
      ...DEFAULT_AVAILABILITY, ...cfg,
      days:     Array.isArray(cfg.days)     ? cfg.days.map(Number) : DEFAULT_AVAILABILITY.days,
      blackout: Array.isArray(cfg.blackout) ? cfg.blackout         : [],
    };
  } catch {
    return DEFAULT_AVAILABILITY;
  }
}

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkRateLimit(req, 'default')) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date. Use YYYY-MM-DD' });
  }

  // Reject past dates — by ISRAEL's calendar, not the server's. The server
  // runs in UTC, so around midnight the two disagree by 2-3 hours.
  const il = israelNow();
  if (date < il.ymd) return res.json({ slots: [] });
  const reqDate = new Date(date + 'T00:00:00');   // calendar day-of-week only

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE;
  if (!TOKEN || !BASE) return res.status(500).json({ error: 'Server config error' });

  const avail = await loadAvailability(TOKEN, BASE);
  const dow = reqDate.getDay(); // 0=Sun … 6=Sat

  // Closed weekday or blackout date → no slots
  if (!avail.days.includes(dow) || avail.blackout.includes(date)) {
    return res.json({ slots: [] });
  }

  // Generate slots for the day
  const startMin = hhmmToMin(avail.start, 540);
  const endMin   = (dow === 5) ? hhmmToMin(avail.friEnd, 780) : hhmmToMin(avail.end, 1080);
  const step     = Number(avail.slotMin) > 0 ? Number(avail.slotMin) : 30;
  const leadMin  = Number.isFinite(Number(avail.leadMin)) ? Number(avail.leadMin) : 120;

  const allSlots = [];
  for (let m = startMin; m < endMin; m += step) {
    allSlots.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }

  // For today (Israel's today): remove slots within the lead-time buffer.
  // MUST use Israel wall-clock minutes — with UTC `new Date()` this cutoff sat
  // 3 summer hours early, so "2h ahead" actually offered slots 1h in the PAST
  // (a customer booked today's 10:30 at 10:35). See api/_lib/iltime.js.
  let futureSlots = allSlots;
  if (date === il.ymd) {
    const cutoff = il.minutes + leadMin;
    futureSlots = allSlots.filter(s => {
      const [h, m] = s.split(':').map(Number);
      return h * 60 + m > cutoff;
    });
  }

  // Query Airtable for already-booked slots on this date and subtract them
  try {
    const formula = encodeURIComponent(`AND({Date}="${date}",{Status}="confirmed")`);
    const atRes = await fetch(
      `https://api.airtable.com/v0/${BASE}/Appointments?filterByFormula=${formula}&fields[]=Time`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    if (!atRes.ok) {
      // Table may not exist yet — return all future slots
      return res.json({ slots: futureSlots });
    }
    const atData = await atRes.json();
    const booked = new Set((atData.records || []).map(r => r.fields.Time));
    return res.json({ slots: futureSlots.filter(s => !booked.has(s)) });
  } catch (err) {
    console.error('[slots] error:', err.message);
    return res.json({ slots: futureSlots }); // fallback
  }
}
