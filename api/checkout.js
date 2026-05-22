/**
 * POST /api/checkout
 * Creates a dynamic Grow.link (Meshulam Light API) payment session.
 * Returns a one-time payment URL to open in a popup window.
 *
 * Request body:
 *   { sum, description, fullName?, phone?, email? }
 *
 * Response (success):
 *   { ok: true,  paymentUrl: "https://..." }
 * Response (failure):
 *   { ok: false, error: "..." }
 *
 * Credentials baked in via env vars (with hardcoded fallbacks):
 *   GROW_USER_ID    — Meshulam account ID  (default: 8378660)
 *   GROW_PAGE_CODE  — Payment page code    (default: duffel-bag page code)
 *
 * Production API URL: https://secure.meshulam.co.il
 * Sandbox API URL:    https://sandbox.meshulam.co.il
 */

import { setSecurityHeaders, checkRateLimit } from './_security.js';

const GROW_API = 'https://secure.meshulam.co.il/api/light/server/1.0/createPaymentProcess';

const GROW_USER_ID   = process.env.GROW_USER_ID   || '8378660';
const GROW_PAGE_CODE = process.env.GROW_PAGE_CODE  || '31ff850cdd92840ef433220f971195fc-MTY4MDIyNA';
const SITE_URL       = 'https://www.highair-expeditions.com';

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ ok: false, error: 'Method not allowed' });

  if (!checkRateLimit(req, 'checkout')) {
    return res.status(429).json({ ok: false, error: 'Too many requests' });
  }

  const {
    sum,
    description = 'HighAir Shop',
    fullName    = '',
    phone       = '',
    email       = '',
  } = req.body || {};

  /* ── Validate sum ── */
  const amount = Number(sum);
  if (!sum || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ ok: false, error: 'Invalid amount' });
  }

  /* ── Build Meshulam payload ── */
  const payload = {
    userId:        GROW_USER_ID,
    pageCode:      GROW_PAGE_CODE,
    chargeType:    1,              // 1 = regular charge
    sum:           amount,
    description:   String(description).slice(0, 100),
    successUrl:    `${SITE_URL}/shop?paid=1`,
    cancelUrl:     `${SITE_URL}/shop`,
    saveCardToken: 0,
  };

  // Pre-fill customer fields if provided (optional — customer fills them on payment page)
  if (fullName) payload['pageField[fullName]'] = String(fullName).slice(0, 100);
  if (phone)    payload['pageField[phone]']    = String(phone).slice(0, 25);
  if (email)    payload['pageField[email]']    = String(email).slice(0, 255);

  /* ── Call Grow Light API ── */
  try {
    const resp = await fetch(GROW_API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const data = await resp.json();

    // Meshulam response shape: { status: "1"|"0", data: { ... } | "", err: { ... } }
    if (String(data.status) !== '1') {
      const errMsg = data.err?.message || data.err?.msg || `Error ${data.err?.id || 'unknown'}`;
      console.error('[checkout] Grow error:', JSON.stringify(data));
      return res.status(502).json({ ok: false, error: errMsg });
    }

    // Payment URL can appear under several field names depending on API version
    const paymentUrl =
      data.data?.url         ||
      data.data?.iframeUrl   ||
      data.data?.iframe      ||
      data.data?.paymentUrl  ||
      data.data?.payment_url ||
      (typeof data.data === 'string' && data.data.startsWith('http') ? data.data : null);

    if (!paymentUrl) {
      console.error('[checkout] No payment URL in response:', JSON.stringify(data));
      return res.status(502).json({ ok: false, error: 'No payment URL returned', raw: data });
    }

    console.log(`[checkout] Session created — ${description} | ₪${amount}`);
    return res.status(200).json({ ok: true, paymentUrl });

  } catch (err) {
    console.error('[checkout] Network error:', err.message);
    return res.status(500).json({ ok: false, error: 'Network error' });
  }
}
