/**
 * GET /api/app-health
 * Called by Vercel Cron every 5 minutes. Asks the app (app.highair-expeditions.com) whether it
 * answers and emails the office only when that changes: down, still down every 3 hours, back up.
 * The rules and the emails are in _lib/app-health.js.
 *
 * WHY HERE: the app cannot report its own outage, and Sentry's free plan has one uptime monitor,
 * which watches the website. The website is a separate Vercel project, so it can watch the app.
 *
 * State: AppContent app_health_state (JSON, written only when it changes). Kill switch:
 * AppContent app_health_paused. One Airtable read per run, for both.
 *
 * SECURITY: requires CRON_SECRET, like the other crons.
 */
export const config = { api: { bodyParser: false } };

import { setSecurityHeaders } from './_security.js';
import { emailShell } from './_lib/email-shell.js';
import {
  CHECKS, TIMEOUT_MS, RETRY_MS, STATE_KEY, PAUSE_KEY, OFFICE,
  judgeAnswer, verdict, parseState, nextStep, emailFor,
} from './_lib/app-health.js';

function isAuthorizedCron(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) { console.error('[app-health] CRON_SECRET env var not set, refusing all invocations'); return false; }
  const m = /^Bearer\s+(.+)$/.exec(req.headers.authorization || '');
  if (!m) return false;
  const a = Buffer.from(m[1]), b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function ask(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'User-Agent': 'HealthCheck/1.0', 'Cache-Control': 'no-cache' } });
    const text = (await r.text()).slice(0, 200000);   // the app's page is ~10 KB; its root element sits past the first 4 KB
    return { status: r.status, text, mitigated: !!r.headers.get('x-vercel-mitigated') };
  } catch (e) {
    return { error: e.name === 'AbortError' ? 'timeout' : (e.cause?.code || e.message || 'error') };
  } finally { clearTimeout(t); }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* Ask every question; ask again, once, only those that failed. */
async function runChecks(wait) {
  let judged = await Promise.all(CHECKS.map(async c => ({ ...c, ...judgeAnswer(c.id, await ask(c.url)) })));
  if (judged.some(j => j.ok === false)) {
    if (wait) await sleep(wait);
    judged = await Promise.all(judged.map(async j => j.ok === false ? { ...j, ...judgeAnswer(j.id, await ask(j.url)) } : j));
  }
  return judged;
}

const AT = BASE => `https://api.airtable.com/v0/${BASE}/AppContent`;

/* Both keys in one read. null = the read failed (not the same as "nothing stored"). */
async function readKeys(BASE, TOKEN) {
  try {
    const f = encodeURIComponent(`OR({Key}="${STATE_KEY}",{Key}="${PAUSE_KEY}")`);
    const r = await fetch(`${AT(BASE)}?filterByFormula=${f}&fields%5B%5D=Key&fields%5B%5D=Value&maxRecords=2`, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!r.ok) return null;
    const recs = (await r.json()).records || [];
    const row = k => recs.find(x => x.fields?.Key === k);
    const st = row(STATE_KEY);
    return {
      paused: ['1', 'true', 'yes', 'on'].includes(String(row(PAUSE_KEY)?.fields?.Value || '').trim().toLowerCase()),
      stateId: st?.id || null,
      state: parseState(st?.fields?.Value),
    };
  } catch (e) { console.warn('[app-health] state read failed:', e.message); return null; }
}

async function writeState(BASE, TOKEN, id, state) {
  try {
    const Value = JSON.stringify(state);
    const r = await fetch(id ? `${AT(BASE)}/${id}` : AT(BASE), {
      method: id ? 'PATCH' : 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: id ? { Value } : { Key: STATE_KEY, Value } }),
    });
    if (!r.ok) console.error('[app-health] state write failed:', r.status);
    return r.ok;
  } catch (e) { console.warn('[app-health] state write failed:', e.message); return false; }
}

async function sendMail(KEY, mail) {
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'HighAir Website <noreply@highair-expeditions.com>',
        to: [OFFICE],
        subject: mail.subject,
        html: emailShell({ title: mail.title, dark: false, body: `<div style="font-size:15px;line-height:1.7;color:#3F3B5C;">${mail.body}</div>`, footer: 'נשלח אוטומטית מבדיקת הזמינות של האפליקציה' }),
      }),
    });
    if (!r.ok) console.error('[app-health] Resend error:', r.status);
    return r.ok;
  } catch (e) { console.warn('[app-health] Resend non-fatal:', e.message); return false; }
}

/* When Airtable cannot be read, a warm instance still remembers its last state, so an outage
   of both does not email every 5 minutes. */
let memo = null;

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  if (req.method !== 'GET') return res.status(405).end();
  if (!isAuthorizedCron(req)) return res.status(401).json({ error: 'Unauthorized' });

  const TOKEN = process.env.AIRTABLE_TOKEN, BASE = process.env.AIRTABLE_BASE, KEY = process.env.RESEND_API_KEY;
  const kept = TOKEN && BASE ? await readKeys(BASE, TOKEN) : null;
  if (kept?.paused) return res.status(200).json({ ok: true, paused: true });
  const state = kept ? kept.state : (memo || {});

  /* ?wait=0 skips the pause before the second try (tests; the route stays behind CRON_SECRET). */
  const judged = await runChecks(req.query?.wait === '0' ? 0 : RETRY_MS);
  const outcome = verdict(judged);
  if (outcome !== 'up') console.warn('[app-health] %s: %s', outcome, judged.map(j => `${j.id}=${j.ok}${j.why ? ` (${j.why})` : ''}`).join(', '));

  const now = Date.now();
  const step = nextStep(state, outcome, now);
  let emailed = false;
  if (step.email && KEY) emailed = await sendMail(KEY, emailFor(step, judged, now));
  /* The state moves only when its email went out, so a refused email is tried again next run. */
  if (step.state && (emailed || !KEY)) {
    memo = step.state;
    if (kept) await writeState(BASE, TOKEN, kept.stateId, step.state);
  }
  return res.status(200).json({ ok: true, outcome, email: step.email, emailed, checks: judged.map(j => ({ id: j.id, ok: j.ok })) });
}
