/* The app watched from the website (owner, 16 Nov 2026: "אפשר לעשות את סעיף 3", an email when
   the app stops answering). Sentry already checks the website every minute, but its free plan
   holds one uptime monitor and the website uses it. So the website, a separate Vercel project,
   asks the app two questions every 5 minutes:
     page   https://app.highair-expeditions.com/          the app itself loads (static files)
     api    https://app.highair-expeditions.com/api/push-config   the app's server answers
            (a public read with no database behind it: it proves the functions run and costs nothing)
   A question that fails is asked once more after RETRY_MS, so one slow moment stays silent.

   One email when the app goes down, one when it is back, and a reminder every REMIND_MS while it
   stays down. Nothing else: no daily report (owner, 23 Oct: reports on speed only).
   Vercel's own bot check answering instead of the app (a challenge) is neither up nor down: the
   app was not reached, so nothing is decided on it. */

export const APP = 'https://app.highair-expeditions.com';
export const CHECKS = [
  { id: 'page', url: `${APP}/`,                label: 'האפליקציה עצמה (הדף)' },
  { id: 'api',  url: `${APP}/api/push-config`, label: 'השרת של האפליקציה' },
];
export const TIMEOUT_MS = 10000;
export const RETRY_MS   = 20000;
export const REMIND_MS  = 3 * 60 * 60 * 1000;
export const OFFICE     = 'info@highair-expeditions.com';
export const STATE_KEY  = 'app_health_state';
export const PAUSE_KEY  = 'app_health_paused';

/** One answer, judged. r: { status, type, text, mitigated } or { error } */
export function judgeAnswer(id, r) {
  if (!r || r.error) return { ok: false, why: r?.error === 'timeout' ? `לא ענה תוך ${TIMEOUT_MS / 1000} שניות` : `לא ניתן להתחבר (${r?.error || 'שגיאה'})` };
  if (r.mitigated) return { ok: null, why: 'בדיקת הבוטים של Vercel ענתה במקום האפליקציה' };
  if (r.status !== 200) return { ok: false, why: `השיב בשגיאה (HTTP ${r.status})` };
  if (id === 'api') {
    try { if (!('publicKey' in JSON.parse(r.text))) throw new Error('shape'); }
    catch { return { ok: false, why: 'השיב תשובה לא תקינה' }; }
  }
  if (id === 'page' && !/<div id="root"/i.test(r.text || '')) return { ok: false, why: 'הדף חזר בלי האפליקציה' };
  return { ok: true };
}

/** The run's verdict from the judged checks: 'up', 'down' or 'unknown'. */
export function verdict(judged) {
  if (judged.some(j => j.ok === false)) return 'down';
  if (judged.some(j => j.ok === null)) return 'unknown';
  return 'up';
}

export function parseState(v) {
  try { const s = JSON.parse(v || '{}'); return s && typeof s === 'object' ? s : {}; } catch { return {}; }
}

/** What to email and what to keep. state: { down, since, remindedAt } (ISO strings). */
export function nextStep(state, outcome, nowMs) {
  const s = state || {};
  const now = new Date(nowMs).toISOString();
  if (outcome === 'up') {
    return s.down ? { email: 'up', since: s.since, state: { down: false, upAt: now } } : { email: null, state: null };
  }
  if (outcome === 'down') {
    if (!s.down) return { email: 'down', state: { down: true, since: now, remindedAt: now } };
    const last = Date.parse(s.remindedAt || s.since || '') || 0;
    if (nowMs - last >= REMIND_MS) return { email: 'still', since: s.since, state: { ...s, remindedAt: now } };
    return { email: null, state: null };
  }
  return { email: null, state: null };
}

/* "16.11, 21:40" in Israel time, DST-safe */
export const israelDateTime = ms => new Intl.DateTimeFormat('he-IL', {
  timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
}).format(new Date(ms));

/* "25 דקות" / "שעה ו-10 דקות" / "3 שעות" */
export function lasted(fromMs, toMs) {
  const m = Math.max(1, Math.round((toMs - fromMs) / 60000));
  if (m < 60) return `${m} דקות`;
  const h = Math.floor(m / 60), r = m % 60;
  const hh = h === 1 ? 'שעה' : h === 2 ? 'שעתיים' : `${h} שעות`;
  return r ? `${hh} ו-${r} דקות` : hh;
}

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const P = t => `<p style="margin:0 0 12px">${t}</p>`;

/** The email for a step: { subject, title, body } (body is HTML for emailShell). */
export function emailFor(step, judged, nowMs) {
  const when = israelDateTime(nowMs);
  if (step.email === 'down') {
    const rows = judged.filter(j => j.ok === false).map(j => `<li>${esc(j.label)}: ${esc(j.why)}</li>`).join('');
    return {
      subject: 'HighAir - האפליקציה לא עונה',
      title: 'האפליקציה לא עונה',
      body: P(`בבדיקה האוטומטית של ${when} האפליקציה לא ענתה, וגם לא בניסיון חוזר אחרי ${RETRY_MS / 1000} שניות.`)
        + `<ul style="margin:0 0 12px">${rows}</ul>`
        + P('כל עוד זה כך, לוח הלידים ואפליקציית הלקוחות כנראה לא נפתחים, והודעות ווצאפ לא נכנסות ללוח הלידים. כדאי לבדוק אם האפליקציה נפתחת אצלך, ואם לא, לבדוק ב-Vercel אם הפריסה האחרונה נכשלה.')
        + P('כשהאפליקציה תחזור לעבוד יגיע מייל נוסף.'),
    };
  }
  if (step.email === 'still') {
    const since = Date.parse(step.since || '') || nowMs;
    return {
      subject: 'HighAir - האפליקציה עדיין לא עונה',
      title: 'האפליקציה עדיין לא עונה',
      body: P(`האפליקציה לא עונה כבר ${lasted(since, nowMs)}, מאז ${israelDateTime(since)}. הבדיקה ממשיכה כל 5 דקות.`)
        + P('כשהאפליקציה תחזור לעבוד יגיע מייל נוסף.'),
    };
  }
  if (step.email === 'up') {
    const since = Date.parse(step.since || '') || nowMs;
    return {
      subject: 'HighAir - האפליקציה חזרה לעבוד',
      title: 'האפליקציה חזרה לעבוד',
      body: P(`האפליקציה עונה שוב, נכון ל-${when}. היא לא ענתה ${lasted(since, nowMs)}, מאז ${israelDateTime(since)}.`)
        + P('כדאי לעבור על לוח הלידים: הודעות ווצאפ שנשלחו בזמן הזה אולי לא נכנסו אליו.'),
    };
  }
  return null;
}
