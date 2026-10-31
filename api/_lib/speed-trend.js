/* The rules behind the speed report (api/site-health.js). Pure, so they are tested.
 *
 * One PageSpeed run is noise: on 23 Oct 2026 the home page scored 54 and 64 on
 * mobile, 24 minutes apart, on the same code, and the old daily email said
 * "תקלה" on 7 days of 9 off the worst single number. So nothing here reacts to
 * one run. The weekly status is a 7-day median, and an alert needs three days
 * running under the page's own baseline.
 */

export const KEEP_DAYS     = 21;  // enough for this week, last week and the alert baseline
export const YELLOW_BELOW  = 80;  // thresholds on the Lighthouse score, mobile is the gate
export const RED_BELOW     = 60;
export const RECENT_DAYS   = 3;   // the days an alert looks at
export const BASE_DAYS     = 7;   // the days before them, the page's own baseline
export const MIN_BASE_DAYS = 4;   // fewer than this is not a baseline
export const DROP_POINTS   = 10;  // less than this is inside the normal swing of a median
export const MIN_WEEK_DAYS = 3;   // a weekly report on fewer days says nothing
export const ALERT_EVERY_DAYS = 7;

/* Key inside `alerted` for "the check itself could not measure". */
export const OUTAGE_KEY = '_measure';

export function median(values) {
  const v = values.filter(n => typeof n === 'number' && Number.isFinite(n)).sort((a, b) => a - b);
  if (!v.length) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : Math.round((v[mid - 1] + v[mid]) / 2);
}

const dayNumber = ymd => Date.parse(`${ymd}T00:00:00Z`) / 86400000;
const daysBetween = (from, to) => dayNumber(to) - dayNumber(from);

/* Calendar days, not entries: a day the cron did not run must not stretch a
   "three days running" over five. */
const between = (days, today, fromAge, toAge) => days.filter(x => {
  const age = daysBetween(x.d, today);
  return age >= fromAge && age < toAge;
});

const scores = (days, path, field = 'm') =>
  days.map(x => x.p?.[path]?.[field]).filter(n => typeof n === 'number');

export function parseHistory(raw) {
  try {
    const h = JSON.parse(raw);
    return {
      days: Array.isArray(h?.days) ? h.days : [],
      alerted: h?.alerted && typeof h.alerted === 'object' ? h.alerted : {},
      weekly: typeof h?.weekly === 'string' ? h.weekly : '',
    };
  } catch { return { days: [], alerted: {}, weekly: '' }; }
}

/* One day's measurements, the shape kept in AppContent. A page PSI failed on is
   stored as nulls, so the day still counts as a day the check ran. */
export function dayEntry(ymd, rows) {
  const p = {};
  for (const r of rows) {
    const lcp = r.mobile?.lcpMs;
    p[r.path] = {
      m:  r.mobile?.score ?? null,
      dt: r.desktop?.score ?? null,
      l:  typeof lcp === 'number' ? Math.round(lcp) : null,
    };
  }
  return { d: ymd, p };
}

/* Today replaces any earlier entry for the same date, so a re-run cannot count
   as two days. */
export function addDay(history, entry) {
  const days = [...history.days.filter(x => x.d !== entry.d), entry]
    .sort((a, b) => a.d.localeCompare(b.d))
    .slice(-KEEP_DAYS);
  return { ...history, days };
}

/* A real regression: all three recent days under the baseline, and their median
   at least DROP_POINTS below it. A single bad day can never pass the first test. */
export function findRegressions({ days, alerted }, pages, today) {
  const out = [];
  for (const { path, label } of pages) {
    const recent = scores(between(days, today, 0, RECENT_DAYS), path);
    const earlier = scores(between(days, today, RECENT_DAYS, RECENT_DAYS + BASE_DAYS), path);
    if (recent.length < RECENT_DAYS || earlier.length < MIN_BASE_DAYS) continue;
    const base = median(earlier);
    const now = median(recent);
    if (base - now < DROP_POINTS || recent.some(s => s >= base)) continue;
    if (alerted[path] && daysBetween(alerted[path], today) < ALERT_EVERY_DAYS) continue;
    out.push({ path, label, base, now });
  }
  return out;
}

/* Three days running with no mobile score on any page: the report would go quiet
   on its own, which reads exactly like "all is well". */
export function measurementDown({ days, alerted }, pages, today) {
  const recent = between(days, today, 0, RECENT_DAYS);
  if (recent.length < RECENT_DAYS) return false;
  if (pages.some(({ path }) => scores(recent, path).length)) return false;
  return !(alerted[OUTAGE_KEY] && daysBetween(alerted[OUTAGE_KEY], today) < ALERT_EVERY_DAYS);
}

export function daysThisWeek({ days }, today) {
  return between(days, today, 0, 7).length;
}

export function weeklyRows({ days }, pages, today) {
  const week = between(days, today, 0, 7);
  const prev = between(days, today, 7, 14);
  return pages.map(({ path, label }) => {
    const m = scores(week, path);
    return {
      path, label,
      mobile:  median(m),
      low:     m.length ? Math.min(...m) : null,
      high:    m.length ? Math.max(...m) : null,
      prev:    median(scores(prev, path)),
      desktop: median(scores(week, path, 'dt')),
      lcp:     median(scores(week, path, 'l')),
    };
  });
}

/* From the worst weekly median. No page measured at all is a fault, not a pass. */
export function weeklyStatus(rows) {
  const known = rows.map(r => r.mobile).filter(n => typeof n === 'number');
  if (!known.length) return 'תקלה';
  const worst = Math.min(...known);
  if (worst < RED_BELOW) return 'תקלה';
  return worst < YELLOW_BELOW ? 'שים לב' : 'תקין';
}
