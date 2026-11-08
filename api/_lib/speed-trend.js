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
      field: h?.field && typeof h.field === 'object' ? h.field : null,
      fieldSent: h?.fieldSent && typeof h.fieldSent === 'object' ? h.fieldSent : null,
    };
  } catch { return { days: [], alerted: {}, weekly: '', field: null, fieldSent: null }; }
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

/* ── Real visitors (owner, 8 Nov 2026: "the most correct numbers, in the report") ──
   The scores above are Lighthouse in a lab: one simulated slow phone on a slow
   4G line, from Google's servers, and noisy. The same PageSpeed answer also
   carries Google's own numbers from real Chrome visitors (the Chrome UX Report):
   the value 3 of every 4 page loads met or beat, over the last 28 days. That is
   what Google ranks on, so the report leads with it.
   Measured 8 Nov 2026: Google has too few visits to judge any single page, so
   the numbers are the whole site (origin). Phones 83% of loads: LCP 1.8 s (85%
   of loads good), INP 130 ms, CLS 0, FCP 1.5 s, TTFB 0.7 s, "Passed"; desktop
   LCP 1.6 s. Over 2026 the phone LCP sat at 2.2-2.36 s from May to September and
   came down to 1.8 s after the October speed work, while the lab gave pages 54
   to 79 and an LCP of 4 to 13 s. It moves slowly (28 days), so the latest answer
   is kept, not a median. */
export const FIELD_GOOD = { lcp: 2500, inp: 200, cls: 0.1, fcp: 1800, ttfb: 800 };   // Google's "good" lines
export const FIELD_POOR = { lcp: 4000, inp: 500, cls: 0.25, fcp: 3000, ttfb: 1800 }; // and its "poor" lines

/** Real-visitor numbers from a PageSpeed loadingExperience (one page, or the
    whole site from originLoadingExperience), or null when Google has too few
    visits for it (a page with no data of its own comes back as the site's,
    origin_fallback, and is not dressed up as the page). */
export function fieldFrom(le) {
  if (!le || typeof le !== 'object' || le.origin_fallback || !le.metrics) return null;
  const m = le.metrics;
  const p = k => (typeof m[k]?.percentile === 'number' ? m[k].percentile : null);
  const lcp = p('LARGEST_CONTENTFUL_PAINT_MS');
  if (lcp == null) return null;
  const inp = p('INTERACTION_TO_NEXT_PAINT');
  const clsX100 = p('CUMULATIVE_LAYOUT_SHIFT_SCORE');   // PageSpeed sends CLS times 100
  const cls = clsX100 == null ? null : clsX100 / 100;
  const fcp = p('FIRST_CONTENTFUL_PAINT_MS');
  const ttfb = p('EXPERIMENTAL_TIME_TO_FIRST_BYTE');
  /* Share of page loads under the good line, from the first bucket. */
  const good = m.LARGEST_CONTENTFUL_PAINT_MS?.distributions?.[0]?.proportion;
  /* Google's test: every Core Web Vital it has data for is under its good line. */
  const pass = lcp <= FIELD_GOOD.lcp && (inp == null || inp <= FIELD_GOOD.inp) && (cls == null || cls <= FIELD_GOOD.cls);
  const poor = lcp > FIELD_POOR.lcp || (inp != null && inp > FIELD_POOR.inp) || (cls != null && cls > FIELD_POOR.cls);
  return { lcp, inp, cls, fcp, ttfb, lcpGood: typeof good === 'number' ? Math.round(good * 100) : null, pass, poor };
}

/** Today's real-visitor numbers into the history: the whole site on phones and
    on desktop, and any page Google can judge on its own. A run where PageSpeed
    gave none (it failed, or had no data) keeps the last ones instead of wiping them. */
export function addField(history, ymd, rows) {
  const site = { mobile: null, desktop: null };
  for (const r of rows) for (const k of ['mobile', 'desktop']) site[k] ||= r[k]?.origin || null;
  const pages = {};
  for (const r of rows) if (r.mobile?.field) pages[r.path] = r.mobile.field;
  if (!site.mobile && !site.desktop && !Object.keys(pages).length) return history;
  const last = history.field || {};
  return { ...history, field: {
    d: ymd,
    site: { mobile: site.mobile || last.site?.mobile || null, desktop: site.desktop || last.site?.desktop || null },
    pages,
  } };
}

/** The weekly status from real visitors on phones (83% of loads), Google's own
    verdict: good when it passes, a fault when a metric is in the poor range.
    null when Google has no numbers, and then the lab status stands. */
export function fieldStatus(field) {
  const m = field?.site?.mobile;
  if (!m) return null;
  return m.pass ? 'תקין' : m.poor ? 'תקלה' : 'שים לב';
}
