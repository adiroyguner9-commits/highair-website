/**
 * GET /api/site-health
 * Called by Vercel Cron once a day. A SPEED monitor: runs Google PageSpeed
 * Insights (Lighthouse) on the key public pages and emails a Hebrew report.
 * Loading speed is the company's top priority, so this watches it daily and
 * flags regressions. Report only - it never changes anything.
 *
 * WHY IN-REPO AND NOT A CLOUD ROUTINE: the claude.ai cloud-routine sandbox
 * blocks outbound DNS to our own domain and to googleapis, so a cloud agent
 * cannot measure us. A Vercel function has open network, so this lives here
 * beside the other crons (send-reminders, lead-messaging).
 *
 * REQUIRES env PAGESPEED_API_KEY (free Google Cloud key) - without it the PSI
 * API rate-limits (HTTP 429) and nothing can be measured, so the run exits
 * quietly without emailing. Get a key at console.cloud.google.com (enable
 * "PageSpeed Insights API", create an API key) and add it in Vercel env vars.
 *
 * DELIVERY: one email via Resend to info@highair-expeditions.com, status word in
 * the subject (תקין / שים לב / תקלה).
 *
 * SECURITY: requires CRON_SECRET (same pattern as send-reminders.js) and must be
 * registered under `crons` in vercel.json.
 */

export const config = { api: { bodyParser: false } };

import { setSecurityHeaders } from './_security.js';

const SITE = 'https://www.highair-expeditions.com';

/* Pages whose speed we track (mobile AND desktop each). Homepage first. */
const PAGES = [
  { path: '/',                       label: 'דף הבית' },
  { path: '/treks',                  label: 'טרקים בעולם' },
  { path: '/climbs',                 label: 'טיפוסי הרים' },
  { path: '/expedition/kilimanjaro', label: 'קילימנג׳רו' },
  /* A blog post: where Google search visitors land, and its own layout. */
  { path: '/blog/tanzania-visa-guide', label: 'מאמר: ויזה לטנזניה' },
];

/* Thresholds on the Lighthouse performance score (0-100), mobile is the gate. */
const YELLOW_BELOW = 80;
const RED_BELOW    = 60;

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

async function pagespeed(url, strategy, key) {
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&key=${key}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 55000);
  try {
    const r = await fetch(api, { signal: ctrl.signal });
    if (!r.ok) return { error: `HTTP ${r.status}` };
    const j = await r.json();
    const lh = j.lighthouseResult;
    if (!lh) return { error: 'no lighthouse result' };
    const num = id => lh.audits?.[id]?.numericValue;
    return {
      score: Math.round((lh.categories?.performance?.score ?? 0) * 100),
      lcp:   lh.audits?.['largest-contentful-paint']?.displayValue || 'n/a',
      cls:   lh.audits?.['cumulative-layout-shift']?.displayValue || 'n/a',
      tbt:   lh.audits?.['total-blocking-time']?.displayValue || 'n/a',
      lcpMs: num('largest-contentful-paint'),
    };
  } catch (e) {
    return { error: `${e.name}: ${e.message}` };
  } finally { clearTimeout(t); }
}

/* Small concurrency pool - PSI is heavy, so don't fire all at once. */
async function pool(items, size, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  }));
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
  const PSI_KEY    = process.env.PAGESPEED_API_KEY;

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

  /* No PSI key -> PageSpeed cannot run reliably (429). Exit quietly, no email. */
  if (!PSI_KEY) {
    console.warn('[site-health] PAGESPEED_API_KEY not set — speed monitoring is a no-op until a key is added');
    return res.status(200).json({ ok: true, skipped: 'no PAGESPEED_API_KEY' });
  }

  /* Measure every page on mobile + desktop. */
  const jobs = [];
  for (const p of PAGES) for (const strategy of ['mobile', 'desktop']) jobs.push({ ...p, strategy });
  /* 10 runs in two rounds of 5, so the whole check stays well inside the
     function's 120s even when PSI is slow (each run is capped at 55s). */
  const measured = await pool(jobs, 5, async (j) => ({ ...j, result: await pagespeed(`${SITE}${j.path}`, j.strategy, PSI_KEY) }));

  /* Fold into per-page rows. */
  const byPath = {};
  for (const m of measured) {
    byPath[m.path] ||= { label: m.label, path: m.path };
    byPath[m.path][m.strategy] = m.result;
  }
  const rows = PAGES.map(p => byPath[p.path]);

  /* Status from the mobile score (plus any hard error). */
  let worstMobile = 100; let anyError = false;
  for (const r of rows) {
    const mob = r.mobile || {};
    if (mob.error) anyError = true;
    else if (typeof mob.score === 'number') worstMobile = Math.min(worstMobile, mob.score);
  }
  let status = 'תקין';
  if (worstMobile < YELLOW_BELOW) status = 'שים לב';
  if (worstMobile < RED_BELOW || anyError) status = 'תקלה';

  const dd = new Date().toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem', day: '2-digit', month: '2-digit' });

  /* Email. */
  let emailed = false;
  if (RESEND_KEY) {
    const cell = (r) => {
      if (!r) return '<td style="padding:6px 8px;font-size:12px;color:#9591B0;">—</td>';
      if (r.error) return `<td style="padding:6px 8px;font-size:12px;color:#B91C1C;">שגיאה</td>`;
      const col = r.score >= YELLOW_BELOW ? '#166534' : r.score >= RED_BELOW ? '#B45309' : '#B91C1C';
      return `<td style="padding:6px 8px;font-size:13px;color:${col};font-weight:700;">${r.score}</td>`;
    };
    const metricRow = (r) => {
      const m = r.mobile || {}; const d = r.desktop || {};
      const detail = m.error ? `<span style="color:#B91C1C;direction:ltr;">${esc(m.error)}</span>`
        : `<span style="direction:ltr;">LCP ${esc(m.lcp)} · CLS ${esc(m.cls)} · TBT ${esc(m.tbt)}</span>`;
      return `<tr style="border-top:1px solid #ECEAF8;">
        <td style="padding:6px 8px;font-size:13px;color:#1e1b4b;font-weight:600;">${esc(r.label)}</td>
        ${cell(r.mobile)}${cell(r.desktop)}
        <td style="padding:6px 8px;font-size:11px;color:#6B6B8A;">${detail}</td>
      </tr>`;
    };
    const statusColor = status === 'תקלה' ? '#B91C1C' : status === 'שים לב' ? '#B45309' : '#166534';
    const html = `<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0FF;padding:32px 0;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;box-shadow:0 4px 24px rgba(109,40,217,0.10);">
      <tr><td style="background:linear-gradient(135deg,#4338ca,#7c3aed);padding:26px 32px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">דוח מהירות יומי</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">HighAir Expeditions · ${esc(dd)}</p>
      </td></tr>
      <tr><td style="padding:28px 32px;">
        <div style="text-align:center;margin-bottom:20px;"><span style="display:inline-block;padding:8px 24px;border-radius:999px;background:${statusColor};color:#fff;font-size:16px;font-weight:700;">${esc(status)}</span></div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ECEAF8;border-radius:12px;overflow:hidden;">
          <tr style="background:#F5F0FF;">
            <td style="padding:8px;font-size:12px;color:#6B6B8A;font-weight:700;">עמוד</td>
            <td style="padding:8px;font-size:12px;color:#6B6B8A;font-weight:700;">מובייל</td>
            <td style="padding:8px;font-size:12px;color:#6B6B8A;font-weight:700;">דסקטופ</td>
            <td style="padding:8px;font-size:12px;color:#6B6B8A;font-weight:700;">Core Web Vitals (מובייל)</td>
          </tr>
          ${rows.map(metricRow).join('')}
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#9591B0;line-height:1.6;">הציון הוא Lighthouse Performance (0-100). ירוק 80+, כתום 60-79, אדום מתחת ל-60. הסף נקבע לפי המובייל.</p>
      </td></tr>
      <tr><td style="background:#FAFAF8;padding:18px 32px;text-align:center;border-top:1px solid #ECEAF8;">
        <p style="margin:0;font-size:12px;color:#9591B0;">נשלח אוטומטית מבדיקת המהירות היומית · קריאה בלבד</p>
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
          subject: `HighAir - דוח מהירות (${dd}): ${status}`,
          html,
        }),
      });
      emailed = er.ok;
      if (!er.ok) console.error('[site-health] Resend error:', er.status);
    } catch (e) { console.warn('[site-health] Resend non-fatal:', e.message); }
  }

  return res.status(200).json({
    ok: true, status, emailed,
    pages: rows.map(r => ({ path: r.path, mobile: r.mobile?.score ?? r.mobile?.error, desktop: r.desktop?.score ?? r.desktop?.error })),
  });
}
