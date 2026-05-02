/**
 * Public Airtable read-only proxy for the marketing site.
 *
 * vercel.json rewrites:
 *   /api/airtable/:table     → /api/at?table=:table
 *   /api/airtable/:table/:id → /api/at?table=:table&id=:id
 *
 * SECURITY:
 *   • Reads only — no writes via this proxy. Lead submissions go through
 *     the dedicated /api/submit-lead endpoint which validates, rate-limits,
 *     honeypots, and field-whitelists.
 *   • Per-table FIELD WHITELIST: the response is filtered server-side to a
 *     narrow set of safe fields per table. The client cannot opt into more
 *     fields by adding `fields[]=...` to the URL — anything outside the
 *     whitelist is dropped from the response.
 *   • CORS, rate limit, security headers preserved.
 */

export const config = { api: { bodyParser: true } };

import { checkRateLimit, setSecurityHeaders } from './_security.js';

const ALLOWED_METHODS = new Set(['GET']);

/* Per-table response field whitelist. Fields outside this list are stripped
   from the response, even if Airtable returned them. */
const RESPONSE_FIELDS = {
  Groups: new Set([
    'Event', 'Departure', 'Return', 'Hidden', 'Group Name',
    'Display Name', 'Description', 'Capacity', 'Booked', 'Status',
    'Retail Price', 'Gallery_URLs',
  ]),
  AppContent: new Set(['Key', 'Value', 'Type', 'Locale']),
  Customers: new Set(['Group Name']), // ONLY Group Name — used for group count display
  Blog: new Set([
    'Title', 'Title_En', 'Slug', 'Author',
    'Date_ISO', 'Date_He', 'Date_En',
    'Category', 'Category_En',
    'Image_URL', 'Excerpt', 'Excerpt_En', 'Active',
  ]),
  Reviews: new Set([
    'Name', 'Name_En', 'Initials', 'Initials_En',
    'Rating', 'Date', 'Date_En', 'Text', 'Text_En', 'Active',
  ]),
  Press: new Set([
    'Outlet', 'Outlet_En', 'Color', 'Date',
    'Headline', 'Headline_En', 'Excerpt', 'Excerpt_En',
    'URL', 'Is_Video', 'Active',
  ]),
  IsraelTrips: new Set([
    'Name', 'Name_En', 'Slug', 'Area', 'Elev',
    'Price_He', 'Price_En', 'Diff_He', 'Diff_En',
    'Days_He', 'Days_En', 'Type_He',
    'Image_URL', 'Gradient', 'Payment_URL',
    'Airtable_Events', 'Group_Capacity', 'Sort_Order', 'Live',
  ]),
  IsraelGroups: new Set([
    'Group Name', 'Event', 'Departure', 'Return',
    'Capacity', 'Retail Price', 'Hidden',
    'Name', 'Name_En', 'Slug', 'Elev',
    'Price_He', 'Price_En', 'Diff_He', 'Diff_En',
    'Days_He', 'Days_En', 'Type_He',
    'Image_URL', 'Gradient', 'Payment_URL', 'Sort_Order',
    'Gallery_URLs',
  ]),
};

const FORWARDED_QUERY_KEYS = new Set([
  'maxRecords', 'pageSize', 'offset', 'filterByFormula', 'view',
]);

function buildForwardedQuery(query, allowedFields) {
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(query || {})) {
    if (k === 'table' || k === 'id') continue;

    if (k === 'fields[]' || k === 'fields') {
      const vals = Array.isArray(v) ? v : [v];
      for (const item of vals) {
        // Only forward field requests that are in the allowlist.
        if (allowedFields.has(String(item))) out.append('fields[]', String(item));
      }
      continue;
    }
    if (/^sort\[\d+]\[(field|direction)]$/.test(k)) {
      const vals = Array.isArray(v) ? v : [v];
      for (const item of vals) out.append(k, String(item));
      continue;
    }
    if (FORWARDED_QUERY_KEYS.has(k)) {
      const vals = Array.isArray(v) ? v : [v];
      for (const item of vals) out.append(k, String(item));
    }
  }
  return out;
}

function projectRecord(record, whitelist) {
  const f = record?.fields || {};
  const out = {};
  for (const [k, v] of Object.entries(f)) {
    if (whitelist.has(k)) out[k] = v;
  }
  return { id: record.id, createdTime: record.createdTime, fields: out };
}

const REC_ID_RE = /^rec[A-Za-z0-9]{14}$/;

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!ALLOWED_METHODS.has(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkRateLimit(req, 'default')) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE;
  if (!TOKEN || !BASE) return res.status(500).json({ error: 'Server configuration error' });

  const table    = String(req.query.table || '').trim();
  const recordId = String(req.query.id    || '').trim();

  const allowedFields = RESPONSE_FIELDS[table];
  if (!allowedFields) {
    return res.status(403).json({ error: 'Access denied' });
  }
  if (recordId && !REC_ID_RE.test(recordId)) {
    return res.status(400).json({ error: 'Invalid record id' });
  }

  const params = buildForwardedQuery(req.query, allowedFields);
  // If the client didn't request specific fields, force the full whitelist
  // so the upstream response is bounded server-side.
  if (![...params.keys()].some(k => k === 'fields[]')) {
    for (const f of allowedFields) params.append('fields[]', f);
  }

  const path = recordId
    ? `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(table)}/${recordId}`
    : `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(table)}`;
  const url = `${path}${params.toString() ? '?' + params.toString() : ''}`;

  try {
    const upstream = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      console.warn(`[at] upstream ${upstream.status} for GET ${table}`);
      return res.status(upstream.status).json({ error: 'Upstream error' });
    }
    // Project the response to the field whitelist (defence in depth)
    if (data?.records) {
      data.records = data.records.map(r => projectRecord(r, allowedFields));
    } else if (data?.id && data?.fields) {
      Object.assign(data, projectRecord(data, allowedFields));
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error('[at] error:', err.message);
    return res.status(500).json({ error: 'Internal error' });
  }
}
