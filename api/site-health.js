/**
 * GET /api/site-health
 * Called by Vercel Cron once a day. A SPEED monitor: runs Google PageSpeed
 * Insights (Lighthouse) on the key public pages and keeps the numbers. Loading
 * speed is the company's top priority, so this watches it daily. Report only -
 * it never changes anything on the site.
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
 * DELIVERY (owner, 31 Oct 2026): measure daily, email weekly. The daily email is
 * gone because one run is noise (see _lib/speed-trend.js). Via Resend to
 * info@highair-expeditions.com: a report on Sunday built from 7-day medians, and
 * an alert only when a drop holds for three days. The numbers live in the
 * AppContent row site_health_history.
 *
 * SECURITY: requires CRON_SECRET (same pattern as send-reminders.js) and must be
 * registered under `crons` in vercel.json.
 */

export const config = { api: { bodyParser: false } };

import { setSecurityHeaders } from './_security.js';
import { israelNow } from './_lib/iltime.js';
import {
  YELLOW_BELOW, RED_BELOW, MIN_WEEK_DAYS, OUTAGE_KEY,
  parseHistory, dayEntry, addDay, findRegressions, measurementDown,
  daysThisWeek, weeklyRows, weeklyStatus,
} from './_lib/speed-trend.js';

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

const HISTORY_KEY = 'site_health_history';
const appContentUrl = BASE => `https://api.airtable.com/v0/${BASE}/AppContent`;

/* null means the read failed, which is not the same as "no history yet". */
async function loadHistory(BASE, TOKEN) {
  try {
    const url = `${appContentUrl(BASE)}?filterByFormula=${encodeURIComponent(`{Key}="${HISTORY_KEY}"`)}&fields[]=Value&maxRecords=1`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!r.ok) return null;
    const rec = (await r.json()).records?.[0];
    return { id: rec?.id || null, history: parseHistory(rec?.fields?.Value) };
  } catch (e) {
    console.warn('[site-health] history read failed:', e.message);
    return null;
  }
}

async function saveHistory(BASE, TOKEN, id, history) {
  const Value = JSON.stringify(history);
  try {
    const r = await fetch(id ? `${appContentUrl(BASE)}/${id}` : appContentUrl(BASE), {
      method: id ? 'PATCH' : 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: id ? { Value } : { Key: HISTORY_KEY, Value } }),
    });
    if (!r.ok) console.error('[site-health] history write failed:', r.status);
    return r.ok;
  } catch (e) {
    console.warn('[site-health] history write failed:', e.message);
    return false;
  }
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
    if (!r.ok) console.error('[site-health] Resend error:', r.status);
    return r.ok;
  } catch (e) {
    console.warn('[site-health] Resend non-fatal:', e.message);
    return false;
  }
}

function shell(title, dd, body) {
  return `<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0FF;padding:32px 0;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;box-shadow:0 4px 24px rgba(109,40,217,0.10);">
      <tr><td style="background:linear-gradient(135deg,#4338ca,#7c3aed);padding:26px 32px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">${esc(title)}</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">HighAir Expeditions · ${esc(dd)}</p>
      </td></tr>
      <tr><td style="padding:28px 32px;">${body}</td></tr>
      <tr><td style="background:#FAFAF8;padding:18px 32px;text-align:center;border-top:1px solid #ECEAF8;">
        <p style="margin:0;font-size:12px;color:#9591B0;">נשלח אוטומטית מבדיקת המהירות · קריאה בלבד</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

const scoreColor = n => n >= YELLOW_BELOW ? '#166534' : n >= RED_BELOW ? '#B45309' : '#B91C1C';
const blank = '<td style="padding:6px 8px;font-size:12px;color:#9591B0;">-</td>';
const scoreCell = n => n == null ? blank
  : `<td style="padding:6px 8px;font-size:13px;color:${scoreColor(n)};font-weight:700;">${n}</td>`;
const textCell = t => t == null ? blank
  : `<td style="padding:6px 8px;font-size:12px;color:#6B6B8A;direction:ltr;text-align:right;">${esc(t)}</td>`;
const head = t => `<td style="padding:8px;font-size:12px;color:#6B6B8A;font-weight:700;">${esc(t)}</td>`;

function weeklyHtml(rows, status, dd) {
  const statusColor = status === 'תקלה' ? '#B91C1C' : status === 'שים לב' ? '#B45309' : '#166534';
  const row = r => `<tr style="border-top:1px solid #ECEAF8;">
    <td style="padding:6px 8px;font-size:13px;color:#1e1b4b;font-weight:600;">${esc(r.label)}</td>
    ${scoreCell(r.mobile)}${scoreCell(r.prev)}
    ${textCell(r.low == null ? null : `${r.low}-${r.high}`)}
    ${scoreCell(r.desktop)}
    ${textCell(r.lcp == null ? null : `${(r.lcp / 1000).toFixed(1)}s`)}
  </tr>`;
  return shell('דוח מהירות שבועי', dd, `
    <div style="text-align:center;margin-bottom:20px;"><span style="display:inline-block;padding:8px 24px;border-radius:999px;background:${statusColor};color:#fff;font-size:16px;font-weight:700;">${esc(status)}</span></div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ECEAF8;border-radius:12px;overflow:hidden;">
      <tr style="background:#F5F0FF;">${head('עמוד')}${head('מובייל')}${head('שבוע קודם')}${head('טווח')}${head('דסקטופ')}${head('LCP')}</tr>
      ${rows.map(row).join('')}
    </table>
    <p style="margin:16px 0 0;font-size:11px;color:#9591B0;line-height:1.6;">כל מספר הוא חציון של 7 ימים, כי ריצה בודדת קופצת בכ-20 נקודות על אותו קוד. ירוק 80+, כתום 60-79, אדום מתחת ל-60. הסטטוס נקבע לפי העמוד הנמוך במובייל.</p>`);
}

function alertHtml(regressions, dd) {
  const line = r => `<p style="margin:0 0 10px;font-size:14px;color:#1e1b4b;line-height:1.6;"><b>${esc(r.label)}</b>: חציון של ${r.base} בשבוע שלפני, ו-${r.now} בשלושת הימים האחרונים.</p>`;
  return shell('התרעת מהירות', dd, `
    ${regressions.map(line).join('')}
    <p style="margin:16px 0 0;font-size:12px;color:#6B6B8A;line-height:1.6;">התרעה נשלחת רק כששלושה ימים ברציפות נמוכים מהרגיל, אז זו ירידה אמיתית ולא רעש של ריצה אחת. כדאי לבדוק מה עלה לאתר ולתגי השיווק בימים האלה.</p>`);
}

function outageHtml(dd) {
  return shell('התרעת מהירות', dd, `
    <p style="margin:0;font-size:14px;color:#1e1b4b;line-height:1.6;">בדיקת המהירות לא הצליחה למדוד אף עמוד שלושה ימים ברציפות, ולכן אין כרגע מעקב. הסיבה הנפוצה היא מפתח PageSpeed או מכסת הבדיקות, לא האתר עצמו.</p>`);
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

  /* Keep today's numbers. If the history cannot be read, stop here: saving on
     top of it would wipe the weeks already stored. */
  const stored = TOKEN && BASE ? await loadHistory(BASE, TOKEN) : null;
  if (!stored) {
    console.error('[site-health] history not readable, nothing stored or sent');
    return res.status(200).json({ ok: false, stored: false });
  }
  const { ymd } = israelNow();
  let history = addDay(stored.history, dayEntry(ymd, rows));
  const dd = `${ymd.slice(8, 10)}/${ymd.slice(5, 7)}`;

  /* An alert goes the day a drop is confirmed. It is marked only after it left,
     so a failed send tries again tomorrow. */
  const regressions = findRegressions(history, PAGES, ymd);
  const down = measurementDown(history, PAGES, ymd);
  let alerted = false;
  if (RESEND_KEY && regressions.length) {
    const first = regressions[0];
    const subject = regressions.length > 1
      ? `HighAir - התרעת מהירות (${dd}): ${regressions.length} עמודים ירדו`
      : `HighAir - התרעת מהירות (${dd}): ${first.label} ירד מ-${first.base} ל-${first.now}`;
    alerted = await sendMail(RESEND_KEY, subject, alertHtml(regressions, dd));
    if (alerted) {
      const marks = Object.fromEntries(regressions.map(r => [r.path, ymd]));
      history = { ...history, alerted: { ...history.alerted, ...marks } };
    }
  }
  if (RESEND_KEY && down) {
    const sent = await sendMail(RESEND_KEY, `HighAir - התרעת מהירות (${dd}): הבדיקה לא מודדת`, outageHtml(dd));
    if (sent) history = { ...history, alerted: { ...history.alerted, [OUTAGE_KEY]: ymd } };
  }

  /* The weekly report: Sunday, once, and only with enough days to mean something.
     ?weekly=1 forces it (the route is still behind CRON_SECRET). */
  const sunday = new Date(`${ymd}T00:00:00Z`).getUTCDay() === 0;
  const forced = req.query?.weekly === '1';
  const enough = daysThisWeek(history, ymd) >= MIN_WEEK_DAYS;
  let weekly = false;
  let status = null;
  if (RESEND_KEY && enough && (forced || (sunday && history.weekly !== ymd))) {
    const table = weeklyRows(history, PAGES, ymd);
    status = weeklyStatus(table);
    weekly = await sendMail(RESEND_KEY, `HighAir - דוח מהירות שבועי (${dd}): ${status}`, weeklyHtml(table, status, dd));
    if (weekly) history = { ...history, weekly: ymd };
  }

  const saved = await saveHistory(BASE, TOKEN, stored.id, history);

  return res.status(200).json({
    ok: true, stored: saved, weekly, status, alerted, down,
    pages: rows.map(r => ({ path: r.path, mobile: r.mobile?.score ?? r.mobile?.error, desktop: r.desktop?.score ?? r.desktop?.error })),
  });
}
