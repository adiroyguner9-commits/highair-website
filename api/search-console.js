/**
 * GET /api/search-console
 * Called by Vercel Cron on Sunday morning, before the SEO agent (07:10 Israel)
 * and the weekly analyst (11:00). Pulls last week's numbers from Google Search
 * Console and emails them to info@highair-expeditions.com. Report only: it never
 * changes anything on the site or in Search Console.
 *
 * WHY IN-REPO AND NOT A CLOUD ROUTINE: the cloud-routine sandbox cannot reach
 * googleapis (same reason as site-health.js). The agents read this email instead:
 * its subject contains "Search Console שבועי", and their instructions take search
 * rankings ONLY from it (owner, 2 Nov 2026).
 *
 * REQUIRES env GSC_SERVICE_ACCOUNT_JSON: the JSON key of a Google service account
 * that was added as a user (restricted is enough) on the Search Console property.
 * Without it the run exits quietly, no email. Optional GSC_SITE_URL overrides the
 * property (default: the domain property, then the www URL-prefix property).
 *
 * SECURITY: requires CRON_SECRET and is registered under `crons` in vercel.json.
 * Kill switch: AppContent search_console_paused = 1.
 */

export const config = { api: { bodyParser: false } };

import { setSecurityHeaders } from './_security.js';
import { israelNow } from './_lib/iltime.js';
import { emailShell } from './_lib/email-shell.js';
import {
  TOKEN_URL, reportRanges, buildAssertion, parseAccount, totals, withPrevious,
  pctChange, fmtPos, pagePath,
} from './_lib/gsc.js';

const PROPERTIES = ['sc-domain:highair-expeditions.com', 'https://www.highair-expeditions.com/'];

function isAuthorizedCron(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    console.error('[search-console] CRON_SECRET env var not set — refusing all invocations');
    return false;
  }
  const m = /^Bearer\s+(.+)$/.exec(req.headers.authorization || '');
  if (!m) return false;
  const a = Buffer.from(m[1]);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

async function accessToken(account) {
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: buildAssertion(account),
  });
  const r = await fetch(TOKEN_URL, { method: 'POST', body });
  if (!r.ok) throw new Error(`token HTTP ${r.status}`);
  return (await r.json()).access_token;
}

async function query(token, site, range, dimensions, rowLimit) {
  const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startDate: range.start, endDate: range.end, rowLimit, dataState: 'final',
      ...(dimensions.length ? { dimensions } : {}),
    }),
  });
  if (!r.ok) {
    const err = new Error(`query HTTP ${r.status}`);
    err.status = r.status;
    throw err;
  }
  return (await r.json()).rows || [];
}

/* The first property the service account can read. */
async function pickProperty(token, range) {
  const list = process.env.GSC_SITE_URL ? [process.env.GSC_SITE_URL] : PROPERTIES;
  for (const site of list) {
    try {
      const rows = await query(token, site, range, [], 1);
      return { site, rows };
    } catch (e) {
      if (e.status !== 403 && e.status !== 404) throw e;
    }
  }
  return null;
}

async function sendMail(RESEND_KEY, subject, html) {
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'HighAir Website <noreply@highair-expeditions.com>',
        to: ['info@highair-expeditions.com'],
        subject,
        html,
      }),
    });
    if (!r.ok) console.error('[search-console] Resend error:', r.status);
    return r.ok;
  } catch (e) {
    console.warn('[search-console] Resend non-fatal:', e.message);
    return false;
  }
}

const dmy = ymd => `${ymd.slice(8, 10)}/${ymd.slice(5, 7)}`;
const head = t => `<td style="padding:8px;font-size:12px;color:#6B6B8A;font-weight:700;">${esc(t)}</td>`;
const cell = (t, ltr = false) => `<td style="padding:6px 8px;font-size:13px;color:#1e1b4b;${ltr ? 'direction:ltr;text-align:right;' : ''}">${esc(t)}</td>`;
const table = (cols, rows) => `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ECEAF8;border-radius:12px;overflow:hidden;margin-bottom:20px;">
  <tr style="background:#F5F0FF;">${cols.map(head).join('')}</tr>
  ${rows.map(r => `<tr style="border-top:1px solid #ECEAF8;">${r.join('')}</tr>`).join('')}
</table>`;
const title = t => `<p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#1e1b4b;">${esc(t)}</p>`;

function reportHtml({ now, before, queries, pages, blog, ranges, site }) {
  const change = (a, b) => pctChange(a, b) ?? '-';
  const summary = table(['מדד', 'השבוע', 'שבוע קודם', 'שינוי'], [
    [cell('קליקים'), cell(now.clicks), cell(before.clicks), cell(change(now.clicks, before.clicks), true)],
    [cell('חשיפות'), cell(now.impressions), cell(before.impressions), cell(change(now.impressions, before.impressions), true)],
    [cell('אחוז הקלקה'), cell(`${(now.ctr * 100).toFixed(1)}%`, true), cell(`${(before.ctr * 100).toFixed(1)}%`, true), cell('-')],
    [cell('מיקום ממוצע'), cell(fmtPos(now.position), true), cell(fmtPos(before.position), true), cell('-')],
  ]);
  const qRows = queries.map(q => [cell(q.key), cell(q.clicks), cell(q.prevClicks ?? '-'), cell(q.impressions), cell(fmtPos(q.position), true)]);
  const pRows = pages.map(p => [cell(pagePath(p.key), true), cell(p.clicks), cell(p.prevClicks ?? '-'), cell(p.impressions), cell(fmtPos(p.position), true)]);
  const bRows = blog.map(p => [cell(pagePath(p.key), true), cell(p.clicks), cell(p.impressions), cell(fmtPos(p.position), true)]);
  const cols = ['', 'קליקים', 'שבוע קודם', 'חשיפות', 'מיקום'];
  return emailShell({
    title: 'Search Console שבועי',
    subtitle: esc(`${dmy(ranges.current.start)} עד ${dmy(ranges.current.end)}`),
    dark: false,
    footer: 'נשלח אוטומטית מ-Google Search Console, קריאה בלבד',
    body: `
      ${summary}
      ${title('החיפושים שהביאו הכי הרבה קליקים')}
      ${qRows.length ? table(['חיפוש', ...cols.slice(1)], qRows) : '<p style="font-size:13px;color:#6B6B8A;">אין חיפושים עם קליקים השבוע.</p>'}
      ${title('העמודים שקיבלו הכי הרבה קליקים')}
      ${pRows.length ? table(['עמוד', ...cols.slice(1)], pRows) : ''}
      ${title('מדריכי הבלוג בחיפוש')}
      ${bRows.length ? table(['מדריך', 'קליקים', 'חשיפות', 'מיקום'], bRows) : '<p style="font-size:13px;color:#6B6B8A;">אף מדריך לא הופיע בחיפוש השבוע.</p>'}
      <p style="margin:0;font-size:11px;color:#9591B0;line-height:1.6;">הנתונים מ-Google Search Console (${esc(site)}), שבוע מול השבוע שלפניו. השבוע נגמר שלושה ימים לפני השליחה כי גוגל משלים את הנתונים באיחור. מיקום נמוך יותר הוא טוב יותר.</p>`,
  });
}

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  if (req.method !== 'GET') return res.status(405).end();
  if (!isAuthorizedCron(req)) return res.status(401).json({ error: 'Unauthorized' });

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE;
  const RESEND_KEY = process.env.RESEND_API_KEY;

  if (TOKEN && BASE) {
    try {
      const pr = await fetch(`https://api.airtable.com/v0/${BASE}/AppContent?filterByFormula=${encodeURIComponent('{Key}="search_console_paused"')}&fields[]=Value&maxRecords=1`, { headers: { Authorization: `Bearer ${TOKEN}` } });
      if (pr.ok) {
        const v = String((await pr.json()).records?.[0]?.fields?.Value || '').trim().toLowerCase();
        if (['1', 'true', 'yes', 'on'].includes(v)) return res.status(200).json({ ok: true, paused: true });
      }
    } catch (e) { console.warn('[search-console] pause check non-fatal:', e.message); }
  }

  const account = parseAccount(process.env.GSC_SERVICE_ACCOUNT_JSON);
  if (!account) {
    console.warn('[search-console] GSC_SERVICE_ACCOUNT_JSON missing or invalid — report is a no-op');
    return res.status(200).json({ ok: true, skipped: 'no GSC_SERVICE_ACCOUNT_JSON' });
  }
  if (!RESEND_KEY) return res.status(200).json({ ok: true, skipped: 'no RESEND_API_KEY' });

  const { ymd } = israelNow();
  const ranges = reportRanges(ymd);
  try {
    const token = await accessToken(account);
    const picked = await pickProperty(token, ranges.current);
    if (!picked) {
      console.error('[search-console] service account has no access to any property');
      return res.status(200).json({ ok: false, error: 'no property access' });
    }
    const { site } = picked;
    const [prevTotal, qNow, qPrev, pNow, pPrev] = await Promise.all([
      query(token, site, ranges.previous, [], 1),
      query(token, site, ranges.current, ['query'], 15),
      query(token, site, ranges.previous, ['query'], 250),
      query(token, site, ranges.current, ['page'], 250),
      query(token, site, ranges.previous, ['page'], 250),
    ]);
    const now = totals(picked.rows);
    const before = totals(prevTotal);
    const queries = withPrevious(qNow, qPrev);
    const allPages = withPrevious(pNow, pPrev);
    const pages = allPages.slice(0, 10);
    const blog = allPages.filter(p => pagePath(p.key).startsWith('/blog/')).sort((a, b) => b.impressions - a.impressions).slice(0, 10);

    const delta = pctChange(now.clicks, before.clicks);
    const subject = `HighAir - Search Console שבועי (${dmy(ymd)}): ${now.clicks} קליקים${delta ? ` (${delta})` : ''}`;
    const sent = await sendMail(RESEND_KEY, subject, reportHtml({ now, before, queries, pages, blog, ranges, site }));
    return res.status(200).json({ ok: sent, site, clicks: now.clicks, impressions: now.impressions });
  } catch (e) {
    console.error('[search-console] failed:', e.message);
    return res.status(200).json({ ok: false, error: e.message });
  }
}
