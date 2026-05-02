/**
 * GET /api/slots?date=YYYY-MM-DD
 * Returns available 30-min call slots for a given date.
 * Business hours: Sun–Thu 09:00–18:00 | Fri 09:00–13:00 | Sat closed
 */

import { checkRateLimit, setSecurityHeaders } from './_security.js';

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

  // Reject past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reqDate = new Date(date + 'T00:00:00');
  if (reqDate < today) return res.json({ slots: [] });

  const dow = reqDate.getDay(); // 0=Sun … 6=Sat
  if (dow === 6) return res.json({ slots: [] }); // Saturday closed

  // Generate all 30-min slots for the day
  const endMin = dow === 5 ? 13 * 60 : 18 * 60; // Fri→13:00  else→18:00
  const allSlots = [];
  for (let m = 9 * 60; m < endMin; m += 30) {
    const h   = Math.floor(m / 60);
    const min = m % 60;
    allSlots.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
  }

  // For today: remove slots within the next 60 min (must book at least 1hr ahead)
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  let futureSlots = allSlots;
  if (date === todayStr) {
    const cutoff = now.getHours() * 60 + now.getMinutes() + 60;
    futureSlots = allSlots.filter(s => {
      const [h, m] = s.split(':').map(Number);
      return h * 60 + m > cutoff;
    });
  }

  // Query Airtable for already-booked slots on this date
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE;
  if (!TOKEN || !BASE) return res.status(500).json({ error: 'Server config error' });

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
