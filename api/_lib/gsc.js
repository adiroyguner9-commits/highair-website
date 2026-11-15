/* Google Search Console, read-only, for the weekly search report.
 *
 * WHY: the cloud agents measured "rankings" with web searches on a non-Israeli
 * index, and two of them reported opposite results for the same phrases (Nov 2026).
 * Search Console is the only real source of how Israelis find us in Google, so
 * this pulls it once a week and emails it; the agents read that email.
 *
 * AUTH: a Google service account with read access to the Search Console property.
 * The key lives in the env var GSC_SERVICE_ACCOUNT_JSON (the whole JSON file the
 * Google Cloud console downloads). We sign the OAuth assertion ourselves with node
 * crypto, so no Google library is needed.
 */
import crypto from 'node:crypto';

export const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
export const TOKEN_URL = 'https://oauth2.googleapis.com/token';

/* Search Console data settles about 2 to 3 days late, so the report week ends
   three days before today: the numbers then do not shift after we send them. */
export const LAG_DAYS = 3;

const DAY = 86400000;
const shift = (ymd, days) => new Date(Date.parse(`${ymd}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10);

/* This week and the week before, as Search Console date strings. */
export function reportRanges(todayYmd) {
  const end = shift(todayYmd, -LAG_DAYS);
  const start = shift(end, -6);
  return {
    current: { start, end },
    previous: { start: shift(start, -7), end: shift(start, -1) },
  };
}

const b64url = buf => Buffer.from(buf).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

/* The signed JWT that Google exchanges for an access token. */
export function buildAssertion(account, nowSec = Math.floor(Date.now() / 1000)) {
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: account.client_email, scope: SCOPE, aud: TOKEN_URL, iat: nowSec, exp: nowSec + 3600,
  }));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  return `${header}.${claim}.${b64url(signer.sign(account.private_key))}`;
}

/* The env var as pasted: the whole JSON file. Returns null when it is missing or
   not a service-account key, so the cron can exit quietly. */
export function parseAccount(raw) {
  if (!raw) return null;
  try {
    const a = JSON.parse(raw);
    if (!a.client_email || !a.private_key) return null;
    return { client_email: a.client_email, private_key: String(a.private_key).replace(/\\n/g, '\n') };
  } catch {
    return null;
  }
}

/* Totals for one period from a query with no dimensions. */
export function totals(rows) {
  const r = rows?.[0];
  if (!r) return { clicks: 0, impressions: 0, ctr: 0, position: null };
  return { clicks: r.clicks || 0, impressions: r.impressions || 0, ctr: r.ctr || 0, position: r.position ?? null };
}

/* Rows of this week joined with last week's clicks and position, by key. */
export function withPrevious(current, previous) {
  const prev = new Map((previous || []).map(r => [r.keys?.[0], r]));
  return (current || []).map(r => {
    const p = prev.get(r.keys?.[0]);
    return {
      key: r.keys?.[0] || '',
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      position: r.position ?? null,
      prevClicks: p ? p.clicks || 0 : null,
      prevPosition: p ? p.position ?? null : null,
    };
  });
}

/* "+12%" style change; null when there is nothing to compare with. */
export function pctChange(now, before) {
  if (before == null || before === 0) return null;
  const pct = Math.round(((now - before) / before) * 100);
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}

/* Position: lower is better, so a move from 9.4 to 7.1 is an improvement. */
export const fmtPos = p => (p == null ? '-' : p.toFixed(1));

/* A page URL shown as its path, readable in Hebrew. The domain property also
   holds the foreign sites (en., de., es., indexable since 5 Nov 2026), whose
   paths are the same as the Hebrew ones, so their rows carry the host label:
   "en:/blog/kilimanjaro-climbing-guide". The Hebrew site (www) shows the path only. */
export function siteOf(url) {
  try {
    const sub = new URL(url).hostname.split('.')[0];
    return ['en', 'de', 'es'].includes(sub) ? sub : 'he';
  } catch {
    return 'he';
  }
}
export function pathOf(url) {
  try {
    return decodeURIComponent(new URL(url).pathname) || '/';
  } catch {
    return url;
  }
}
export function pagePath(url) {
  const site = siteOf(url);
  const path = pathOf(url);
  return site === 'he' ? path : `${site}:${path}`;
}

/* Average position of the Hebrew site alone, weighted by impressions, from the
   page rows. The property-wide average mixes in the foreign sites. */
export function sitePosition(pageRows, site = 'he') {
  let impr = 0, sum = 0;
  for (const r of pageRows || []) {
    const key = r.key ?? r.keys?.[0];
    if (siteOf(key) !== site || r.position == null || !r.impressions) continue;
    impr += r.impressions;
    sum += r.position * r.impressions;
  }
  return impr ? sum / impr : null;
}

/* For each query, the page that got most of its impressions, from rows with the
   dimensions ['query', 'page']. */
export function topPageByQuery(rows) {
  const best = new Map();
  for (const r of rows || []) {
    const [q, page] = r.keys || [];
    if (!q || !page) continue;
    const cur = best.get(q);
    if (!cur || (r.impressions || 0) > cur.impressions) best.set(q, { page, impressions: r.impressions || 0 });
  }
  return new Map([...best].map(([q, v]) => [q, v.page]));
}

/* Brand searches: they show people who already know us, not new demand. */
const BRAND = /high\s*air|highair|air\s*high|היי\s*אייר|הייר/i;
export const isBrand = q => BRAND.test(q || '');

/* Near the top but not there yet: non-brand queries at average position 4 to 20,
   most impressions first. Moving these up is the fastest search gain. */
export function opportunities(rows, limit = 15) {
  return rows
    .filter(r => !isBrand(r.key) && r.position != null && r.position >= 4 && r.position <= 20 && r.impressions > 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, limit);
}

/* Clicks that did not come from a brand search. */
export const nonBrandClicks = rows => rows.filter(r => !isBrand(r.key)).reduce((n, r) => n + (r.clicks || 0), 0);
