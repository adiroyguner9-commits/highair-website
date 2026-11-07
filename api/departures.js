/**
 * Public departures with their seat counts, in one cached call.
 *
 * Why it exists (7 Nov 2026, night health check): every trip page paged
 * through /api/airtable/Groups and then through all the Customers rows (about
 * 556, six pages) to count seats in the browser. That is eight calls a page,
 * and the proxy allows 30 a minute per IP, so after four trip pages in a minute
 * the visitor got 429s: the dates vanished ("יפורסמו בקרוב"), and worse, the
 * Customers loop stopped early and a full group could look open. Phones on one
 * carrier share an IP, so one visitor could do this to another.
 *
 * Now the counting happens here, once, and the Vercel CDN keeps the answer for
 * a minute (stale-while-revalidate for five more), so most page views never
 * reach this function at all and a Capacity edit in Airtable still shows within
 * about a minute.
 *
 * What leaves this endpoint: only the non-hidden Groups rows, only the fields
 * the pages use, and a number per row. No customer field, no customer id, no
 * hidden group name (the old Customers paging exposed every Group Name).
 *
 * Never a short count: if any upstream page fails, the whole call fails and
 * the page retries, rather than showing a full group as open.
 */

import { checkRateLimit, setSecurityHeaders } from './_security.js';

const GROUP_FIELDS = ['Event', 'Group Name', 'Departure', 'Return', 'Capacity'];

/* Every page of one table, or an error. A page that fails throws, so the
   caller never sees a partial list. */
export async function fetchAllPages(base, token, table, fields) {
  const rows = [];
  let offset = null;
  let pages = 0;
  do {
    const p = new URLSearchParams();
    for (const f of fields) p.append('fields[]', f);
    p.set('pageSize', '100');
    if (offset) p.set('offset', offset);
    const r = await fetch(`https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}?${p}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) throw new Error(`${table} page ${pages + 1}: upstream ${r.status}`);
    const data = await r.json();
    rows.push(...(data.records || []));
    offset = data.offset || null;
    if (++pages > 100) throw new Error(`${table}: too many pages`);
  } while (offset);
  return rows;
}

/* The public rows with their seat counts. Hidden rows (a private departure)
   are dropped before anything else, and their names are never counted out. */
export function buildDepartures(groupRows, customerRows) {
  const pub = groupRows.filter(r => !(r?.fields || {})['Hidden']);
  const names = new Set(pub.map(r => r.fields['Group Name']).filter(Boolean));
  const counts = {};
  for (const c of customerRows) {
    const gn = (c?.fields || {})['Group Name'];
    if (gn && names.has(gn)) counts[gn] = (counts[gn] || 0) + 1;
  }
  return pub.map(r => {
    const fields = {};
    for (const k of GROUP_FIELDS) if (r.fields[k] !== undefined) fields[k] = r.fields[k];
    return { id: r.id, fields, count: counts[r.fields['Group Name']] || 0 };
  });
}

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  /* The answer is the same for every origin; say so, so a cached copy never
     carries one subdomain's CORS header to another. */
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkRateLimit(req, 'departures')) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(429).json({ error: 'Too many requests' });
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE;
  if (!TOKEN || !BASE) return res.status(500).json({ error: 'Server configuration error' });

  try {
    const [groups, customers] = await Promise.all([
      fetchAllPages(BASE, TOKEN, 'Groups', [...GROUP_FIELDS, 'Hidden']),
      fetchAllPages(BASE, TOKEN, 'Customers', ['Group Name']),
    ]);
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ records: buildDepartures(groups, customers) });
  } catch (err) {
    console.error('[departures]', err.message);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ error: 'Upstream error' });
  }
}
