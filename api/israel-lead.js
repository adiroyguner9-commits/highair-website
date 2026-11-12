/**
 * POST /api/israel-lead
 * Called by IsraelDetail.jsx when a user submits the registration form.
 * Creates a record in the IsraelCustomers Airtable table with status "ממתין לתשלום".
 * Also fires the Make webhook and sends an email notification via Resend.
 * (GoHighLevel retired Jul 30 2026 — this file never called it, the mention was stale.)
 *
 * Required env vars:
 *   AIRTABLE_TOKEN    — shared token (same as submit-lead.js)
 *   AIRTABLE_BASE     — shared base ID
 *   RESEND_API_KEY    — for email notifications (optional, skipped if missing)
 */

import {
  escapeHtml,
  isValidEmail,
  isValidName,
  checkRateLimit,
  setSecurityHeaders,
} from './_security.js';
import { normalizePhone, phoneIsValid, phoneError } from './_lib/phone.js';
import { emailShell, details } from './_lib/email-shell.js';
import { withFlag } from './_lib/dest-flag.js';

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
  const { name, phone, email, tripName, tripDate, packageId, participants, free } = body;
  const participantsCount = Math.min(Math.max(parseInt(participants || 1, 10), 1), 10);

  /* ── Honeypot ── */
  if (body._hp) {
    return res.status(400).json({ error: 'Invalid submission' });
  }

  /* ── Input validation ── */
  if (!isValidName(String(name || ''))) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  if (!phone || !phoneIsValid(String(phone))) {
    /* Say what is actually wrong, like every other form does. A generic
       "Invalid phone number" leaves the customer guessing which digit. */
    return res.status(400).json({ error: phoneError(phone) || 'Invalid phone number' });
  }
  if (email && !isValidEmail(String(email))) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const cleanName     = String(name).trim().slice(0, 100);
  /* Same company format as every other entry point, or this endpoint quietly
     re-dirties the base one Israel-trek signup at a time (Aug 2 2026). */
  const cleanPhone    = normalizePhone(phone) || String(phone).trim().slice(0, 25);
  const cleanEmail    = email ? String(email).trim().slice(0, 255) : '';
  const cleanTripName = String(tripName || '').trim().slice(0, 200);
  const pkg        = packageId ? PACKAGE_MAP[packageId] : null;
  const totalPrice = pkg ? pkg.price * participantsCount : null;

  /* ── Build Airtable fields ── */
  const fields = {
    [F.fullName]: cleanName,
    [F.phone]:    cleanPhone,
    [F.trip]:     cleanTripName,
    /* Free registrations have no payment — omit singleSelect to avoid invalid-option error */
    ...(free ? {} : { [F.paymentStatus]: 'ממתין לתשלום' }),
  };

  if (cleanEmail)   fields[F.email]        = cleanEmail;
  if (pkg)          fields[F.package]      = pkg.label;
  if (totalPrice)   fields[F.pricePaid]    = totalPrice;
  fields[F.participants] = participantsCount;

  /* tripDate should be YYYY-MM-DD for Airtable date field. A date in any other
     shape is left out: it used to go to a "notes" column that the table does
     not have, and one unknown column makes Airtable refuse the whole row, so
     the registration was lost (audit W30; columns read from the live table on
     12 Nov 2026). The trek's name already says which trek it is. */
  if (tripDate && /^\d{4}-\d{2}-\d{2}$/.test(tripDate)) {
    fields[F.tripDate] = tripDate;
  }

  console.log('[israel-lead] Lead:', cleanTripName, '|', pkg?.label || 'no package');

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

  /* The Make.com webhook that used to fire here was removed with GoHighLevel
     (owner, Jul 30 2026) — its only job was to push the lead into the GHL
     pipeline. Leads live in Airtable; the webapp's api/lead-notify cron owns
     assignment and alerts. */

    /* ── 4. Email notification via Resend (awaited to ensure delivery on Vercel) ── */
  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (RESEND_KEY) {
    const emailHtml = emailShell({
      title: 'ליד חדש, טרק בארץ',
      subtitle: withFlag([cleanTripName, tripDate].filter(Boolean).map(escapeHtml).join(', '), 'Israel'),
      body: details([
        ['שם מלא', cleanName], ['טלפון', cleanPhone], ['מייל', cleanEmail], ['משתתפים', String(participantsCount)],
        ['חבילה', pkg?.label], ['מחיר לאדם', pkg && participantsCount > 1 ? `₪${pkg.price}` : ''],
        ['סה"כ לתשלום', totalPrice ? `₪${totalPrice}` : ''],
      ].filter(([, v]) => v).map(([label, v]) => [escapeHtml(label), escapeHtml(String(v))])),
    });

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
          subject: withFlag(`ליד חדש: ${escapeHtml(cleanTripName || 'לא צוין')}`, 'Israel'),
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
