/**
 * GET /api/site-health
 * Called by Vercel Cron once a day. Confirms the public site and the customer
 * payment links actually work, and emails a Hebrew report to the team.
 *
 * WHY IN-REPO AND NOT A CLOUD ROUTINE: the claude.ai cloud-routine sandbox
 * blocks outbound DNS to our own domain and to pay.grow.link, so a cloud agent
 * could never reach the site to test it. A Vercel function has open network, so
 * the check lives here beside the other crons (send-reminders, lead-messaging).
 *
 * WHAT IT CHECKS
 *   1. Pages      - every <loc> in the live sitemap.xml (plus the core pages),
 *                   each must return a healthy 200 with real HTML.
 *   2. Payment    - every pay.grow.link URL found in the data files must return
 *                   a live payment page (a dead link means a customer cannot pay).
 *   3. Speed      - optional: Google PageSpeed Insights on the homepage, only if
 *                   PAGESPEED_API_KEY is set (skipped cleanly otherwise).
 *
 * DELIVERY: one email via Resend to info@highair-expeditions.com, status word in
 * the subject (תקין / שים לב / תקלה). Report only - it never changes anything.
 *
 * SECURITY: requires CRON_SECRET (same pattern as send-reminders.js) and must be
 * registered under `crons` in vercel.json. `functions.includeFiles` ships the
 * src/data files so the payment-link scan can read them at runtime.
 */

export const config = { api: { bodyParser: false } };

import fs from 'fs';
import path from 'path';
import { setSecurityHeaders } from './_security.js';

const SITE = 'https://www.highair-expeditions.com';

/* Core pages always checked even if the sitemap fetch fails. */
const CORE_PATHS = ['/', '/treks', '/climbs', '/about', '/contact', '/annual-plan', '/shop', '/blog'];

/* Markers that mean a fetched page/link is actually broken despite a 200. */
const DEAD_MARKERS = /(not found|page not found|expired|no longer available|link disabled|אינו קיים|לא נמצא|פג תוקף|הקישור אינו)/i;

function isAuthorizedCron(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    console.error('[site-health] CRON_SECRET env var not set — refusing all invocations');
    return false;
  }
  const auth = req.headers.authorization || '';
  const m = /^Bearer\s+(.+)$/.exec(auth);
  if (!m) return false;
  const a = Buffer.from(m[1]);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function timedFetch(url, { method = 'GET', timeout = 9000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  const t0 = Date.now();
  try {
    const r = await fetch(url, {
      method, redirect: 'follow', signal: ctrl.signal,
      headers: { 'User-Agent': 'HighAirHealthBot/1.0 (+https://www.highair-expeditions.com)' },
    });
    const ms = Date.now() - t0;
    let body = '';
    if (method === 'GET') { try { body = (await r.text()).slice(0, 6000); } catch {} }
    return { ok: r.ok, status: r.status, ms, body };
  } catch (e) {
    return { ok: false, status: 0, ms: Date.now() - t0, err: `${e.name}: ${e.message}` };
  } finally { clearTimeout(t); }
}

/* Small concurrency pool so we never fire 50 requests at once. */
async function pool(items, size, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  }));
  return out;
}

function uniq(arr) { return [...new Set(arr)]; }

function readPaymentLinks() {
  const files = ['src/data/israelData.js', 'src/data/mockData.js', 'src/data/shopData.js'];
  const links = [];
  for (const f of files) {
    try {
      const txt = fs.readFileSync(path.join(process.cwd(), f), 'utf8');
      for (const m of txt.matchAll(/https:\/\/pay\.grow\.link\/[^"'`\s)]+/g)) links.push(m[0]);
    } catch (e) { console.warn(`[site-health] could not read ${f}:`, e.message); }
  }
  return uniq(links);
}

async function runPageSpeed(url) {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) return null;
  const out = {};
  for (const strategy of ['mobile', 'desktop']) {
    try {
      const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&key=${key}`;
      const r = await timedFetch(api, { timeout: 30000 });
      if (!r.ok) { out[strategy] = { error: `HTTP ${r.status}` }; continue; }
      const j = JSON.parse(r.body.length < 6000 ? r.body : (await (await fetch(api)).text()));
      const lh = j.lighthouseResult;
      out[strategy] = {
        score: Math.round((lh?.categories?.performance?.score ?? 0) * 100),
        lcp: lh?.audits?.['largest-contentful-paint']?.displayValue || 'n/a',
        cls: lh?.audits?.['cumulative-layout-shift']?.displayValue || 'n/a',
        tbt: lh?.audits?.['total-blocking-time']?.displayValue || 'n/a',
      };
    } catch (e) { out[strategy] = { error: e.message }; }
  }
  return out;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  if (req.method !== 'GET') return res.status(405).end();
  if (!isAuthorizedCron(req)) return res.status(401).json({ error: 'Unauthorized' });

  const TOKEN      = process.env.AIRTABLE_TOKEN;
  const BASE       = process.env.AIRTABLE_BASE;
  const RESEND_KEY = process.env.RESEND_API_KEY;

  /* Kill switch, same AppContent pattern as the other crons. */
  if (TOKEN && BASE) {
    try {
      const pr = await fetch(`https://api.airtable.com/v0/${BASE}/AppContent?filterByFormula=${encodeURIComponent('{Key}="site_health_paused"')}&fields[]=Value&maxRecords=1`, { headers: { Authorization: `Bearer ${TOKEN}` } });
      if (pr.ok) {
        const v = String((await pr.json()).records?.[0]?.fields?.Value || '').trim().toLowerCase();
        if (['1', 'true', 'yes', 'on'].includes(v)) return res.status(200).json({ ok: true, paused: true });
      }
    } catch (e) { console.warn('[site-health] pause check non-fatal:', e.message); }
  }

  /* ── 1. Pages (sitemap + core) ── */
  const sm = await timedFetch(`${SITE}/sitemap.xml`);
  const sitemapOk = sm.ok && /<urlset/i.test(sm.body);
  const locs = sitemapOk ? uniq([...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim())) : [];
  const corePages = CORE_PATHS.map(p => `${SITE}${p}`);
  const pageUrls = uniq([...corePages, ...locs]).slice(0, 40);

  const pageResults = await pool(pageUrls, 6, async (url) => {
    const r = await timedFetch(url);
    const healthy = r.status >= 200 && r.status < 400 && !(r.body && DEAD_MARKERS.test(r.body));
    const slow = r.ms > 3000;
    return { url, status: r.status, ms: r.ms, healthy, slow, err: r.err };
  });
  const pageFails = pageResults.filter(p => !p.healthy);
  const pageSlow  = pageResults.filter(p => p.healthy && p.slow);

  /* ── 2. Payment links ── */
  const payLinks = readPaymentLinks();
  const payResults = await pool(payLinks, 4, async (url) => {
    const r = await timedFetch(url);
    const dead = !(r.status >= 200 && r.status < 400) || (r.body && DEAD_MARKERS.test(r.body));
    return { url, status: r.status, ms: r.ms, dead, err: r.err };
  });
  const payFails = payResults.filter(p => p.dead);

  /* ── 3. Speed (optional) ── */
  const psi = await runPageSpeed(`${SITE}/`);

  /* ── Status ── */
  let status = 'תקין';
  if (!sitemapOk || pageSlow.length) status = 'שים לב';
  if (pageFails.length || payFails.length) status = 'תקלה';

  const dd = new Date().toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem', day: '2-digit', month: '2-digit' });

  /* ── Email ── */
  let emailed = false;
  if (RESEND_KEY) {
    const line = (label, val, bad) =>
      `<tr><td style="padding:6px 0;font-size:13px;color:#6B6B8A;">${esc(label)}</td><td style="padding:6px 0;font-size:14px;font-weight:700;color:${bad ? '#B91C1C' : '#166534'};text-align:left;">${esc(val)}</td></tr>`;
    const failBlock = (title, items) => items.length ? `
      <div style="margin-top:16px;background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:14px 18px;">
        <p style="margin:0 0 8px;font-size:13px;color:#991B1B;font-weight:700;">${esc(title)}</p>
        ${items.map(i => `<p style="margin:2px 0;font-size:12px;color:#7F1D1D;direction:ltr;text-align:left;">${esc(i)}</p>`).join('')}
      </div>` : '';
    const psiBlock = psi ? `
      <div style="margin-top:16px;background:#F9F8FF;border:1px solid #ECEAF8;border-radius:12px;padding:14px 18px;">
        <p style="margin:0 0 8px;font-size:13px;color:#4338ca;font-weight:700;">מהירות (PageSpeed, דף הבית)</p>
        ${['mobile', 'desktop'].map(s => psi[s] ? `<p style="margin:2px 0;font-size:12px;color:#1e1b4b;direction:ltr;text-align:left;">${s}: ${psi[s].error ? 'שגיאה ' + esc(psi[s].error) : `score ${psi[s].score} · LCP ${esc(psi[s].lcp)} · CLS ${esc(psi[s].cls)} · TBT ${esc(psi[s].tbt)}`}</p>` : '').join('')}
      </div>` : '';

    const statusColor = status === 'תקלה' ? '#B91C1C' : status === 'שים לב' ? '#B45309' : '#166534';
    const html = `<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0FF;padding:32px 0;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;box-shadow:0 4px 24px rgba(109,40,217,0.10);">
      <tr><td style="background:linear-gradient(135deg,#4338ca,#7c3aed);padding:26px 32px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">בדיקת תקינות אתר</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">HighAir Expeditions · ${esc(dd)}</p>
      </td></tr>
      <tr><td style="padding:28px 32px;">
        <div style="text-align:center;margin-bottom:20px;"><span style="display:inline-block;padding:8px 24px;border-radius:999px;background:${statusColor};color:#fff;font-size:16px;font-weight:700;">${esc(status)}</span></div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ECEAF8;border-radius:12px;padding:4px 16px;">
          ${line('דפים שנבדקו', `${pageResults.length} (${pageFails.length} תקלות, ${pageSlow.length} איטיים)`, pageFails.length > 0)}
          ${line('מפת אתר (sitemap)', sitemapOk ? `תקינה · ${locs.length} כתובות` : 'לא נטענה', !sitemapOk)}
          ${line('לינקי תשלום', `${payResults.length} נבדקו (${payFails.length} תקולים)`, payFails.length > 0)}
        </table>
        ${failBlock('דפים שנכשלו', pageFails.map(p => `${p.status || p.err || 'ERR'}  ${p.url}`))}
        ${failBlock('לינקי תשלום תקולים - דחוף', payFails.map(p => `${p.status || p.err || 'ERR'}  ${p.url}`))}
        ${pageSlow.length ? failBlock('דפים איטיים (מעל 3 שניות)', pageSlow.map(p => `${p.ms}ms  ${p.url}`)) : ''}
        ${psiBlock}
      </td></tr>
      <tr><td style="background:#FAFAF8;padding:18px 32px;text-align:center;border-top:1px solid #ECEAF8;">
        <p style="margin:0;font-size:12px;color:#9591B0;">נשלח אוטומטית מבדיקת התקינות היומית · קריאה בלבד</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

    try {
      const er = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'HighAir Website <noreply@highair-expeditions.com>',
          to: ['info@highair-expeditions.com'],
          subject: `HighAir - בדיקת תקינות אתר (${dd}): ${status}`,
          html,
        }),
      });
      emailed = er.ok;
      if (!er.ok) console.error('[site-health] Resend error:', er.status);
    } catch (e) { console.warn('[site-health] Resend non-fatal:', e.message); }
  }

  return res.status(200).json({
    ok: true, status, emailed,
    pages: { checked: pageResults.length, failed: pageFails.length, slow: pageSlow.length, sitemapOk },
    payments: { checked: payResults.length, failed: payFails.length },
    speed: psi ? 'measured' : 'skipped (no PAGESPEED_API_KEY)',
  });
}
