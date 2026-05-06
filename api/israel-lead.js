/**
 * POST /api/israel-lead
 * Called by IsraelDetail.jsx when a user submits the registration form.
 * Creates a record in the IsraelCustomers Airtable table with status "ממתין לתשלום".
 *
 * Required env var:
 *   AIRTABLE_API_KEY — same key used by at.js
 */

const BASE_ID  = 'appwmvGIqtBL4Zsvu';
const TABLE_ID = 'tblixQG7LHUR4SC7p'; // IsraelCustomers

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
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const AT_KEY = process.env.AIRTABLE_API_KEY;
  if (!AT_KEY) {
    console.error('[israel-lead] AIRTABLE_API_KEY env var missing');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const body = req.body || {};
  const { name, phone, email, tripName, tripDate, packageId } = body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'name and phone are required' });
  }

  const pkg = packageId ? PACKAGE_MAP[packageId] : null;

  /* ── Build Airtable fields ── */
  const fields = {
    [F.fullName]:      String(name).trim(),
    [F.phone]:         String(phone).trim(),
    [F.trip]:          String(tripName || '').trim(),
    [F.paymentStatus]: 'ממתין לתשלום',
  };

  if (email)    fields[F.email]     = String(email).trim();
  if (pkg)      fields[F.package]   = pkg.label;
  if (pkg)      fields[F.pricePaid] = pkg.price;

  /* tripDate should be YYYY-MM-DD for Airtable date field */
  if (tripDate && /^\d{4}-\d{2}-\d{2}$/.test(tripDate)) {
    fields[F.tripDate] = tripDate;
  } else if (tripDate) {
    /* Fallback: store as note if not ISO format */
    fields[F.notes] = `תאריך: ${tripDate}`;
  }

  try {
    const atRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${AT_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    const data = await atRes.json();

    if (!atRes.ok) {
      console.error('[israel-lead] Airtable error:', JSON.stringify(data));
      return res.status(500).json({ error: 'Airtable error', details: data });
    }

    console.log(`[israel-lead] Created record ${data.id} — ${tripName} | ${name}`);
    return res.status(200).json({ ok: true, id: data.id });

  } catch (err) {
    console.error('[israel-lead] Fetch error:', err.message);
    return res.status(500).json({ error: 'Network error' });
  }
}
