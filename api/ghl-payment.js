/**
 * POST /api/ghl-payment
 * Called by a GHL Workflow when a contact moves to the "Paid" pipeline stage.
 * Fires a Facebook Conversions API (CAPI) Purchase event with the value
 * determined by the expedition tag on the contact.
 *
 * Required env vars:
 *   FB_CAPI_TOKEN  — Facebook System User / CAPI access token
 *
 * GHL Workflow setup:
 *   Trigger: Pipeline Stage Changed → stage = "שולם" (or your paid stage name)
 *   Action:  Webhook → POST https://www.highair-expeditions.com/api/ghl-payment
 *   Body (JSON):
 *     {
 *       "email":     "{{contact.email}}",
 *       "phone":     "{{contact.phone}}",
 *       "firstName": "{{contact.first_name}}",
 *       "lastName":  "{{contact.last_name}}",
 *       "tags":      "{{contact.tags}}"
 *     }
 */

import crypto from 'crypto';

const PIXEL_ID = '293738523242679';

/* ── Expedition tag → price (USD) ─────────────────────────────────────────
   Keys must match the GHL tag names exactly (case-insensitive).
   Update prices here as needed.
   ───────────────────────────────────────────────────────────────────────── */
const EXPEDITION_PRICES = {
  'kilimanjaro':        3700,
  'kilimanjaro-kosher': 3700,
  'elbrus':             3500,
  'kazbek':             0,      // TODO: set price
  'aconcagua':          0,      // TODO: set price
  'annapurna':          0,      // TODO: set price
  'manaslu':            0,      // TODO: set price
  'everest-base-camp':  0,      // TODO: set price
  'olympus':            0,      // TODO: set price
  'ethiopia':           0,      // TODO: set price
  'peaks-of-balkan':    0,      // TODO: set price
  'lobuche-peak':       0,      // TODO: set price
  'island-peak':        0,      // TODO: set price
  'mera-peak':          0,      // TODO: set price
  'lenin-peak':         0,      // TODO: set price
};

const CURRENCY = 'USD';

/* ── Helpers ── */
function sha256(str) {
  return crypto.createHash('sha256').update(String(str).toLowerCase().trim()).digest('hex');
}

function normalizePhone(phone) {
  // Strip everything except digits; ensure E.164-ish (no leading +)
  return phone ? phone.replace(/\D/g, '') : '';
}

function parseTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(t => String(t).toLowerCase().trim());
  // GHL sometimes sends tags as comma-separated string
  return String(raw).split(',').map(t => t.toLowerCase().trim()).filter(Boolean);
}

/* ── Handler ── */
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const FB_TOKEN = process.env.FB_CAPI_TOKEN;
  if (!FB_TOKEN) {
    console.error('[ghl-payment] FB_CAPI_TOKEN env var missing');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const body = req.body || {};

  // Extract contact fields from GHL webhook payload
  const email     = (body.email     || '').trim();
  const phone     = (body.phone     || '').trim();
  const firstName = (body.firstName || body.first_name || '').trim();
  const lastName  = (body.lastName  || body.last_name  || '').trim();
  const tags      = parseTags(body.tags);

  // Determine expedition and value from tags
  const matchedTag = tags.find(t => t in EXPEDITION_PRICES && EXPEDITION_PRICES[t] > 0);
  const value      = matchedTag ? EXPEDITION_PRICES[matchedTag] : null;

  if (!value) {
    const msg = matchedTag
      ? `Tag "${matchedTag}" found but price is 0 — update EXPEDITION_PRICES`
      : `No matching expedition tag found in: [${tags.join(', ')}]`;
    console.warn('[ghl-payment]', msg);
    // Still return 200 so GHL doesn't retry indefinitely
    return res.status(200).json({ ok: false, reason: msg });
  }

  console.log(`[ghl-payment] Purchase: ${matchedTag} | ${value} ${CURRENCY} | ${email || phone}`);

  /* ── Build hashed user data ── */
  const userData = {};
  if (email)     userData.em = [sha256(email)];
  if (phone)     userData.ph = [sha256(normalizePhone(phone))];
  if (firstName) userData.fn = [sha256(firstName)];
  if (lastName)  userData.ln = [sha256(lastName)];

  if (Object.keys(userData).length === 0) {
    console.warn('[ghl-payment] No PII to hash — event will have low match rate');
  }

  /* ── Fire Facebook CAPI Purchase ── */
  const eventPayload = {
    data: [{
      event_name:    'Purchase',
      event_time:    Math.floor(Date.now() / 1000),
      action_source: 'crm',
      user_data:     userData,
      custom_data: {
        value,
        currency:     CURRENCY,
        content_name: matchedTag,
        content_type: 'product',
      },
    }],
  };

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${FB_TOKEN}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(eventPayload),
      }
    );
    const fbData = await fbRes.json();

    if (!fbRes.ok) {
      console.error('[ghl-payment] FB CAPI error:', JSON.stringify(fbData));
      return res.status(500).json({ error: 'FB CAPI failed', details: fbData });
    }

    console.log('[ghl-payment] FB CAPI ok — events_received:', fbData.events_received);
    return res.status(200).json({
      ok:         true,
      expedition: matchedTag,
      value,
      currency:   CURRENCY,
      fb:         { events_received: fbData.events_received },
    });

  } catch (err) {
    console.error('[ghl-payment] Fetch error:', err.message);
    return res.status(500).json({ error: 'Network error' });
  }
}
