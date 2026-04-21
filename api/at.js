/**
 * Flat Airtable proxy — replaces the broken subdirectory catch-all.
 *
 * Vercel does not reliably route subdirectory catch-all functions
 * (api/airtable/[...path].js) — requests fall through to the SPA rewrite.
 * This flat file at /api/at always works.
 *
 * vercel.json rewrites forward:
 *   /api/airtable/:table     → /api/at?table=:table
 *   /api/airtable/:table/:id → /api/at?table=:table&id=:id
 *
 * Query params set by the rewrite:
 *   table  — Airtable table name (e.g. "Customers")
 *   id     — optional record ID (e.g. "rec1234")
 *   (all other query params are forwarded verbatim to Airtable)
 */

export const config = { api: { bodyParser: true } };

const ALLOWED_METHODS = new Set(['GET', 'POST', 'PATCH']);

/* ── Table allowlist — only these tables may be accessed via this proxy ── */
const READ_TABLES = new Set([
  'Customers', 'Groups', 'Suppliers', 'FlightAgents',
  'InsuranceAgents', 'SalesAgents', 'Documents', 'AppContent',
  'Website Leads',
]);
const WRITE_TABLES = new Set([
  'Customers', 'Groups', 'Documents', 'AppContent',
  'Website Leads',
]);

export default async function handler(req, res) {
  try {
    if (!ALLOWED_METHODS.has(req.method)) {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // SECURITY: Never use VITE_-prefixed env vars here — those are compiled into
    // the browser bundle by Vite.  Only non-VITE_ vars are server-only.
    const TOKEN = process.env.AIRTABLE_TOKEN;
    const BASE  = process.env.AIRTABLE_BASE;

    if (!TOKEN || !BASE) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Table name and optional record ID injected by vercel.json rewrite
    const table    = (req.query.table    || '').trim();
    const recordId = (req.query.id       || '').trim();

    if (!table) {
      return res.status(400).json({ error: 'Missing "table" query parameter' });
    }

    // ── Table allowlist check ─────────────────────────────────────────
    if (!READ_TABLES.has(table)) {
      console.warn(`[at] BLOCKED request to unlisted table "${table}"`);
      return res.status(403).json({ error: 'Access denied' });
    }
    if ((req.method === 'POST' || req.method === 'PATCH') && !WRITE_TABLES.has(table)) {
      console.warn(`[at] BLOCKED write to read-only table "${table}"`);
      return res.status(403).json({ error: 'Access denied' });
    }

    console.log(`[at] ${req.method} table="${table}" id="${recordId || '-'}"`);


    // ── Rebuild forwarded query string (strip proxy-only params) ──────
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(req.query)) {
      if (key === 'table' || key === 'id') continue;
      const values = Array.isArray(val) ? val : [val];
      values.forEach(v => params.append(key, v));
    }
    const qs = params.toString();

    // ── Build Airtable target URL ─────────────────────────────────────
    const basePath = recordId
      ? `https://api.airtable.com/v0/${BASE}/${table}/${recordId}`
      : `https://api.airtable.com/v0/${BASE}/${table}`;
    const url = `${basePath}${qs ? '?' + qs : ''}`;

    console.log(`[at] → ${url.replace(BASE, BASE.slice(0,10) + '…')}`);

    const upstream = await fetch(url, {
      method:  req.method,
      headers: {
        Authorization:  `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: ['POST', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });

    const data = await upstream.json();
    console.log(`[at] Airtable responded HTTP ${upstream.status}`);
    return res.status(upstream.status).json(data);

  } catch (err) {
    console.error('[at] error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
