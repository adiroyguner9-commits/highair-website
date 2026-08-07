/**
 * POST /api/notify-reschedule   { phone, name, expedition, date, time }
 *
 * Sends the customer a WhatsApp the moment an admin moves their booked call to a
 * new date/time in the Lead Center. Cross-origin from app.highair-expeditions.com
 * (CORS via setSecurityHeaders, same as book-slot / notify-deposit). Best-effort:
 * a bad phone / missing Green API config just returns a skip, never an error.
 */
import { setSecurityHeaders, checkRateLimit, escFml } from './_security.js';
import { destHe } from './_lib/dest.js';
import { firstName } from './_lib/name.js';   // WhatsApp greeting — first name only

const HE_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const HE_DAYS   = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
function formatDateHe(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  if (isNaN(d)) return dateStr;
  return `יום ${HE_DAYS[d.getDay()]}, ${d.getDate()} ב${HE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function toIntlIL(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('972') && d[3] === '0') d = '972' + d.slice(4);
  else if (d.startsWith('0')) d = '972' + d.slice(1);
  else if (d.length === 9 && d[0] === '5') d = '972' + d;
  return d;
}

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  // Rate limit: this endpoint sends WhatsApp from the company number, so cap abuse.
  if (!checkRateLimit(req, 'notify-reschedule')) return res.status(429).json({ error: 'Too many requests' });

  const GA_INSTANCE = process.env.GREENAPI_INSTANCE, GA_TOKEN = process.env.GREENAPI_TOKEN;
  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  const { phone, name, expedition, date, time } = body;
  if (!phone || !date || !time) return res.status(400).json({ error: 'phone, date, time required' });

  const chatId = toIntlIL(phone);
  if (!chatId || !GA_INSTANCE || !GA_TOKEN) return res.status(200).json({ skipped: 'no send config' });

  // SECURITY: only notify a phone that actually has an appointment on file. Without
  // this, the endpoint (public/CORS-only) would send a HighAir-branded WhatsApp to
  // ANY number a caller supplies — a spam/phishing primitive. We message only known
  // booked customers.
  const TOKEN = process.env.AIRTABLE_TOKEN, BASE = process.env.AIRTABLE_BASE;
  if (TOKEN && BASE) {
    try {
      const last9 = chatId.slice(-9);
      const f = encodeURIComponent(`RIGHT(REGEX_REPLACE({Phone},"[^0-9]",""),9)="${escFml(last9)}"`);
      const chk = await fetch(`https://api.airtable.com/v0/${BASE}/Appointments?filterByFormula=${f}&fields[]=Phone&maxRecords=1`, { headers: { Authorization: `Bearer ${TOKEN}` } });
      const cd = await chk.json().catch(() => ({}));
      if (!chk.ok || !(cd.records || []).length) return res.status(200).json({ skipped: 'no appointment for this phone' });
    } catch {
      return res.status(200).json({ skipped: 'verify failed' });   // fail closed: don't send if we can't verify
    }
  } else {
    return res.status(200).json({ skipped: 'no airtable config' }); // fail closed
  }

  const msg = `היי ${firstName(name)} 👋🏼\n\n`
    + `רצינו לעדכן שמועד השיחה שלנו${expedition ? ` בנוגע ל${destHe(expedition)}` : ''} עודכן 🗓️\n\n`
    + `🗓️ מתי? ${formatDateHe(date)}\n⏰ שעה: ${time}\n\n`
    + `נתקשר אליך במועד החדש. נתראה! 😁`;

  try {
    const r = await fetch(`https://api.green-api.com/waInstance${GA_INSTANCE}/sendMessage/${GA_TOKEN}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: `${chatId}@c.us`, message: msg }),
    });
    const d = await r.json().catch(() => ({}));
    return res.status(200).json({ sent: true, id: d?.idMessage || null });
  } catch (e) {
    console.error('[notify-reschedule]', e.message);
    return res.status(200).json({ error: e.message });
  }
}
