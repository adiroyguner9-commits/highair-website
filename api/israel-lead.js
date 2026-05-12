/**
 * POST /api/israel-lead
 * Called by IsraelDetail.jsx when a user submits the registration form.
 * Creates a record in the IsraelCustomers Airtable table with status "ממתין לתשלום".
 * Also fires GHL + Make webhooks and sends an email notification via Resend.
 *
 * Required env vars:
 *   AIRTABLE_TOKEN    — shared token (same as submit-lead.js)
 *   AIRTABLE_BASE     — shared base ID
 *   RESEND_API_KEY    — for email notifications (optional, skipped if missing)
 */

import {
  escapeHtml,
  isValidPhone,
  isValidEmail,
  isValidName,
  checkRateLimit,
  setSecurityHeaders,
} from './_security.js';

const TABLE_NAME = 'IsraelCustomers';

/* Maps packageId (from form) → Airtable singleSelect label */
const PACKAGE_MAP = {
  'day':       { label: 'טרק יומי בארץ - ₪249',               price: 249 },
  'no-stay':   { label: 'טיפוס בלבד ללא לינה - ₪349',         price: 349 },
  'with-stay': { label: 'טיפוס כולל לינה ו-3 ארוחות - ₪549',  price: 549 },
};

/* Field IDs in IsraelCustomers */
const F = {
  fullName:      'fldT1DxgwMYHIM5Mx',
  phone:         'fldKUy6EYV8bp8cGj',
  email:         'fldbFOqas3Ecr7psw',
  trip:          'fldTbZTU62LvmfOBN',
  tripDate:      'fldNF5703EdITvcRw',
  package:       'fldQktU5Y8F420QRe',
  pricePaid:     'fldaASxJJ6xBuiyja',
  paymentStatus: 'fldiz7jcYO3GwH7Nh',
  notes:         'flderzKj1hhTrja9E',
  participants:  'fldCrgHvTemf1ze4m',
};

export default async function handler(req, res) {
  setSecurityHeaders(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  /* ── Rate limiting ── */
  if (!checkRateLimit(req, 'submit-lead')) {
    return res.status(429).json({ error: 'Too many requests — please wait a moment' });
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE;
  if (!TOKEN || !BASE) {
    console.error('[israel-lead] Missing AIRTABLE_TOKEN or AIRTABLE_BASE env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const body = req.body || {};
  const { name, phone, email, tripName, tripDate, packageId, participants } = body;
  const participantsCount = Math.min(Math.max(parseInt(participants || 1, 10), 1), 10);

  /* ── Honeypot ── */
  if (body._hp) {
    return res.status(400).json({ error: 'Invalid submission' });
  }

  /* ── Input validation ── */
  if (!isValidName(String(name || ''))) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  if (!phone || !isValidPhone(String(phone))) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }
  if (email && !isValidEmail(String(email))) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const cleanName     = String(name).trim().slice(0, 100);
  const cleanPhone    = String(phone).trim().slice(0, 25);
  const cleanEmail    = email ? String(email).trim().slice(0, 255) : '';
  const cleanTripName = String(tripName || '').trim().slice(0, 200);
  const pkg        = packageId ? PACKAGE_MAP[packageId] : null;
  const totalPrice = pkg ? pkg.price * participantsCount : null;

  /* ── Build Airtable fields ── */
  const fields = {
    [F.fullName]:      cleanName,
    [F.phone]:         cleanPhone,
    [F.trip]:          cleanTripName,
    [F.paymentStatus]: 'ממתין לתשלום',
  };

  if (cleanEmail)   fields[F.email]        = cleanEmail;
  if (pkg)          fields[F.package]      = pkg.label;
  if (totalPrice)   fields[F.pricePaid]    = totalPrice;
  fields[F.participants] = participantsCount;

  /* tripDate should be YYYY-MM-DD for Airtable date field */
  if (tripDate && /^\d{4}-\d{2}-\d{2}$/.test(tripDate)) {
    fields[F.tripDate] = tripDate;
  } else if (tripDate) {
    fields[F.notes] = `תאריך: ${String(tripDate).slice(0, 50)}`;
  }

  console.log('[israel-lead] Lead:', cleanName, '|', cleanTripName, '|', pkg?.label || 'no package');

  /* ── 1. Write to Airtable ── */
  let recordId = null;
  try {
    const atRes = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE_NAME}`, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });
    const data = await atRes.json();
    if (!atRes.ok) {
      console.error('[israel-lead] Airtable error:', JSON.stringify(data));
      return res.status(500).json({ error: 'Submission failed' });
    }
    recordId = data.id;
    console.log(`[israel-lead] Created record ${recordId}`);
  } catch (err) {
    console.error('[israel-lead] Airtable fetch error:', err.message);
    return res.status(500).json({ error: 'Network error' });
  }

  /* ── 2. GHL webhook (non-blocking) ── */
  const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/7oNUbFCcBxWykamhpW9D/webhook-trigger/38652f32-bf41-45a5-8494-11e7bc34769d';
  fetch(GHL_WEBHOOK, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName:   cleanName,
      phone:      cleanPhone,
      email:      cleanEmail,
      expedition: cleanTripName,
      travelMonth: tripDate ? tripDate.slice(0, 7) : '',
      source:     'Israel Trek',
      package:    pkg?.label || '',
    }),
  }).catch(err => console.warn('[israel-lead] GHL non-fatal:', err.message));

  /* ── 3. Make webhook (non-blocking) ── */
  const MAKE_WEBHOOK = 'https://hook.eu2.make.com/qq7w1dck9ovbdk1aqft3hh0j8xk5xlnd';
  fetch(MAKE_WEBHOOK, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name:       cleanName,
      phone:      cleanPhone,
      email:      cleanEmail,
      expedition: cleanTripName,
      tripDate:   tripDate || '',
      package:    pkg?.label || '',
      source:     'Israel Trek',
    }),
  }).catch(err => console.warn('[israel-lead] Make non-fatal:', err.message));

  /* ── 4. Email notification via Resend (awaited to ensure delivery on Vercel) ── */
  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (RESEND_KEY) {
    const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F0FFF4;font-family:Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FFF4;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(29,183,89,0.10);max-width:600px;width:100%;">

        <tr><td style="background:linear-gradient(135deg,#1a7a4a,#2d9d5f);padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">🥾 הרשמה לטרק בארץ</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">HighAir Expeditions</p>
        </td></tr>

        <tr><td style="padding:32px;">
          ${cleanTripName ? `
          <div style="background:#F0FFF4;border-right:4px solid #2d9d5f;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
            <p style="margin:0;font-size:12px;color:#6B8A7A;font-weight:600;">טרק</p>
            <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#0d2b1a;">${escapeHtml(cleanTripName)}</p>
            ${tripDate ? `<p style="margin:4px 0 0;font-size:14px;color:#6B8A7A;">${escapeHtml(tripDate)}</p>` : ''}
          </div>` : ''}

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #D0EDE0;border-radius:12px;overflow:hidden;">
            ${iRow('שם מלא',        cleanName)}
            ${iRow('טלפון',         cleanPhone)}
            ${cleanEmail ? iRow('מייל', cleanEmail) : ''}
            ${iRow('משתתפים',       String(participantsCount))}
            ${pkg ? iRow('חבילה',   pkg.label) : ''}
            ${pkg && participantsCount > 1 ? iRow('מחיר לאדם', `₪${pkg.price}`) : ''}
            ${totalPrice ? iRow('סה"כ לתשלום', `₪${totalPrice.toLocaleString()}`) : ''}
          </table>
        </td></tr>

        <tr><td style="background:#F9FFF9;padding:20px 32px;text-align:center;border-top:1px solid #D0EDE0;">
          <p style="margin:0;font-size:12px;color:#9591B0;">הודעה זו נשלחה אוטומטית מאתר HighAir Expeditions</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization:  `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from:    'HighAir Website <noreply@highair-expeditions.com>',
          to:      ['info@highair-expeditions.com'],
          subject: `🥾 הרשמה לטרק - ${escapeHtml(cleanTripName || 'לא צוין')} | ${escapeHtml(cleanName)}`,
          html:    emailHtml,
        }),
      });
      if (!emailRes.ok) {
        console.error('[israel-lead] Resend error:', emailRes.status);
      }
    } catch (emailErr) {
      console.warn('[israel-lead] Resend non-fatal:', emailErr.message);
    }
  }

  return res.status(200).json({ ok: true, id: recordId });
}

function iRow(label, value) {
  if (!value && value !== 0) return '';
  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #D0EDE0;background:#F9FFF9;font-size:12px;color:#6B8A7A;font-weight:600;width:35%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #D0EDE0;font-size:14px;color:#0d2b1a;font-weight:500;">${escapeHtml(String(value))}</td>
    </tr>`;
}
