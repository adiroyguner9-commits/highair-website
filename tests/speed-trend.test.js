/* The speed report, 31 Oct 2026: measure daily, email weekly, alert only on a drop
   that holds. One PageSpeed run swings about 20 points on identical code, so the
   rule that matters most here is that a single bad day stays silent. */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  median, parseHistory, addDay, dayEntry, findRegressions, measurementDown,
  weeklyRows, weeklyStatus, KEEP_DAYS, fieldFrom, addField, fieldStatus,
} from '../api/_lib/speed-trend.js';

process.env.CRON_SECRET = 'cron-secret';
process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';
process.env.RESEND_API_KEY = 're';
process.env.PAGESPEED_API_KEY = 'psi';

const PAGES = [{ path: '/', label: 'דף הבית' }, { path: '/treks', label: 'טרקים' }];

/* Scores oldest first, the last one on `today`. */
const iso = (today, back) => new Date(Date.parse(`${today}T00:00:00Z`) - back * 86400000).toISOString().slice(0, 10);
const historyOf = (today, home, alerted = {}) => ({
  alerted, weekly: '',
  days: home.map((m, i) => ({ d: iso(today, home.length - 1 - i), p: { '/': { m, dt: 90, l: 5000 }, '/treks': { m: 70, dt: 90, l: 5000 } } })),
});

describe('median', () => {
  it('takes the middle, ignores gaps, and rounds an even count', () => {
    expect(median([54, 79, 64])).toBe(64);
    expect(median([60, null, 70, 61])).toBe(61);
    expect(median([70, 75])).toBe(73);
    expect(median([])).toBe(null);
  });
});

describe('a regression needs days, not one run', () => {
  const today = '2026-11-20';
  it('stays silent on the real October swing', () => {
    const october = [54, 58, 64, 74, 62, 58, 77, 79, 56];
    expect(findRegressions(historyOf(today, october), PAGES, today)).toEqual([]);
  });
  it('stays silent on a single bad day', () => {
    expect(findRegressions(historyOf(today, [74, 74, 74, 74, 74, 74, 74, 74, 74, 40]), PAGES, today)).toEqual([]);
  });
  it('stays silent when one of the three days recovers', () => {
    expect(findRegressions(historyOf(today, [74, 74, 74, 74, 74, 74, 74, 60, 75, 60]), PAGES, today)).toEqual([]);
  });
  it('fires when three days hold under the baseline', () => {
    const found = findRegressions(historyOf(today, [74, 74, 74, 74, 74, 74, 74, 60, 62, 58]), PAGES, today);
    expect(found).toEqual([{ path: '/', label: 'דף הבית', base: 74, now: 60 }]);
  });
  it('does not repeat itself for a week, then reminds', () => {
    const scores = [74, 74, 74, 74, 74, 74, 74, 60, 62, 58];
    expect(findRegressions(historyOf(today, scores, { '/': iso(today, 2) }), PAGES, today)).toEqual([]);
    expect(findRegressions(historyOf(today, scores, { '/': iso(today, 7) }), PAGES, today)).toHaveLength(1);
  });
  it('waits until there is a baseline', () => {
    expect(findRegressions(historyOf(today, [74, 74, 60, 62, 58]), PAGES, today)).toEqual([]);
  });
  it('a missing day breaks "three days running"', () => {
    const h = historyOf(today, [74, 74, 74, 74, 74, 74, 74, 60, 62, 58]);
    h.days = h.days.filter(x => x.d !== iso(today, 1));
    expect(findRegressions(h, PAGES, today)).toEqual([]);
  });
});

describe('the check itself failing', () => {
  const today = '2026-11-20';
  const nulls = d => ({ d, p: { '/': { m: null, dt: null, l: null }, '/treks': { m: null, dt: null, l: null } } });
  it('is reported after three days with no score anywhere', () => {
    const h = { alerted: {}, weekly: '', days: [0, 1, 2].map(b => nulls(iso(today, b))) };
    expect(measurementDown(h, PAGES, today)).toBe(true);
  });
  it('one page answering is enough', () => {
    const h = { alerted: {}, weekly: '', days: [0, 1, 2].map(b => nulls(iso(today, b))) };
    h.days[1].p['/treks'].m = 70;
    expect(measurementDown(h, PAGES, today)).toBe(false);
  });
});

describe('the weekly table', () => {
  const today = '2026-11-22';
  const h = historyOf(today, [60, 60, 60, 60, 60, 60, 60, 80, 82, 84, 56, 90, 85, 86]);
  const rows = weeklyRows(h, PAGES, today);
  it('compares two 7-day medians and shows the range', () => {
    expect(rows[0]).toMatchObject({ mobile: 84, prev: 60, low: 56, high: 90, desktop: 90, lcp: 5000 });
  });
  it('sets the status from the median, so one 56 is not a fault', () => {
    expect(weeklyStatus([{ mobile: 84 }, { mobile: 81 }])).toBe('תקין');
    expect(weeklyStatus([{ mobile: 84 }, { mobile: 70 }])).toBe('שים לב');
    expect(weeklyStatus([{ mobile: 84 }, { mobile: 59 }])).toBe('תקלה');
    expect(weeklyStatus([{ mobile: null }])).toBe('תקלה');
  });
});

describe('storage', () => {
  it('survives an empty or broken row', () => {
    expect(parseHistory(undefined).days).toEqual([]);
    expect(parseHistory('not json').days).toEqual([]);
  });
  it('a re-run replaces the day, and old days fall off', () => {
    const today = '2026-11-30';
    const h = historyOf(today, Array(KEEP_DAYS).fill(70));
    const again = addDay(h, dayEntry(today, [{ path: '/', mobile: { score: 50, lcpMs: 4321.4 }, desktop: { error: 'x' } }]));
    expect(again.days).toHaveLength(KEEP_DAYS);
    expect(again.days.at(-1)).toEqual({ d: today, p: { '/': { m: 50, dt: null, l: 4321 } } });
    expect(addDay(h, { d: '2026-12-01', p: {} }).days[0].d).toBe(iso(today, KEEP_DAYS - 2));
  });
});

/* What PageSpeed sent on 8 Nov 2026 for the whole site on phones (originLoadingExperience).
   The home page itself had too few visits: origin_fallback. */
const SITE_LE = { id: 'https://www.highair-expeditions.com', overall_category: 'FAST', metrics: {
  LARGEST_CONTENTFUL_PAINT_MS: { percentile: 1800, category: 'FAST', distributions: [{ min: 0, max: 2500, proportion: 0.85 }, { min: 2500, max: 4000, proportion: 0.08 }, { min: 4000, proportion: 0.07 }] },
  INTERACTION_TO_NEXT_PAINT:   { percentile: 130,  category: 'FAST' },
  CUMULATIVE_LAYOUT_SHIFT_SCORE: { percentile: 0,  category: 'FAST' },
  FIRST_CONTENTFUL_PAINT_MS:   { percentile: 1500, category: 'FAST' },
  EXPERIMENTAL_TIME_TO_FIRST_BYTE: { percentile: 700, category: 'FAST' },
} };
const PAGE_LE = { ...SITE_LE, id: 'https://www.highair-expeditions.com/', origin_fallback: true };
const SITE = { lcp: 1800, inp: 130, cls: 0, fcp: 1500, ttfb: 700, lcpGood: 85, pass: true, poor: false };

describe('real visitors (Chrome UX Report)', () => {
  it('reads the 75th percentiles, CLS sent times 100, the good share and Google\'s pass', () => {
    expect(fieldFrom(SITE_LE)).toEqual(SITE);
    const slow = { metrics: { ...SITE_LE.metrics, LARGEST_CONTENTFUL_PAINT_MS: { percentile: 3100 }, CUMULATIVE_LAYOUT_SHIFT_SCORE: { percentile: 12 } } };
    expect(fieldFrom(slow)).toMatchObject({ lcp: 3100, cls: 0.12, lcpGood: null, pass: false, poor: false });
    expect(fieldFrom({ metrics: { LARGEST_CONTENTFUL_PAINT_MS: { percentile: 4200 } } })).toMatchObject({ pass: false, poor: true });
  });
  it('a page Google has no visits for is not dressed up as the site', () => {
    expect(fieldFrom(PAGE_LE)).toBe(null);
    expect(fieldFrom(undefined)).toBe(null);
    expect(fieldFrom({ metrics: {} })).toBe(null);
  });
  it('passes on what Google has: no INP data does not fail the site', () => {
    const { INTERACTION_TO_NEXT_PAINT, ...rest } = SITE_LE.metrics;
    expect(fieldFrom({ metrics: rest })).toMatchObject({ inp: null, pass: true });
  });
  it('keeps the whole site per device, and the last numbers when a run brings none', () => {
    const h = { days: [], alerted: {}, weekly: '', field: null };
    const rows = [{ path: '/', mobile: { field: null, origin: SITE }, desktop: { field: null, origin: { ...SITE, lcp: 1600 } } }];
    const one = addField(h, '2026-11-08', rows);
    expect(one.field).toEqual({ d: '2026-11-08', site: { mobile: SITE, desktop: { ...SITE, lcp: 1600 } }, pages: {} });
    expect(addField(one, '2026-11-09', [{ path: '/', mobile: { error: 'HTTP 429' }, desktop: { error: 'HTTP 429' } }])).toBe(one);
    const half = addField(one, '2026-11-10', [{ path: '/', mobile: { origin: { ...SITE, lcp: 1700 } }, desktop: { error: 'x' } }]);
    expect(half.field.site.desktop.lcp).toBe(1600);
    expect(half.field.site.mobile.lcp).toBe(1700);
    expect(parseHistory(JSON.stringify(one)).field).toEqual(one.field);
  });
  it('Google\'s verdict on phones is the status', () => {
    expect(fieldStatus({ site: { mobile: SITE } })).toBe('תקין');
    expect(fieldStatus({ site: { mobile: { ...SITE, pass: false } } })).toBe('שים לב');
    expect(fieldStatus({ site: { mobile: { ...SITE, pass: false, poor: true } } })).toBe('תקלה');
    expect(fieldStatus({ site: { mobile: null, desktop: SITE } })).toBe(null);
    expect(fieldStatus(null)).toBe(null);
  });
});

describe('the cron', () => {
  let stored, mails, patches, psiScore, readFails, siteLE;
  const psi = () => new Response(JSON.stringify({ loadingExperience: PAGE_LE, originLoadingExperience: siteLE, lighthouseResult: {
    categories: { performance: { score: psiScore / 100 } },
    audits: { 'largest-contentful-paint': { displayValue: '5 s', numericValue: 5000 }, 'cumulative-layout-shift': { displayValue: '0' }, 'total-blocking-time': { displayValue: '200 ms' } },
  } }), { status: 200 });

  beforeEach(() => {
    stored = null; mails = []; patches = []; psiScore = 74; readFails = false; siteLE = SITE_LE;
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.stubGlobal('fetch', async (url, init = {}) => {
      const u = String(url);
      if (u.includes('pagespeedonline')) return psi();
      if (u.includes('resend.com')) { mails.push(JSON.parse(init.body)); return new Response('{}', { status: 200 }); }
      if (u.includes('/AppContent')) {
        if (init.method === 'PATCH' || init.method === 'POST') { patches.push({ url: u, method: init.method, fields: JSON.parse(init.body).fields }); return new Response('{}', { status: 200 }); }
        if (u.includes('site_health_paused')) return new Response('{"records":[]}', { status: 200 });
        if (readFails) return new Response('{}', { status: 500 });
        return new Response(JSON.stringify({ records: stored ? [{ id: 'recHISTORY0000001', fields: { Value: JSON.stringify(stored) } }] : [] }), { status: 200 });
      }
      return new Response('{}', { status: 200 });
    });
  });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  const run = async (at, query = {}) => {
    vi.setSystemTime(new Date(at));
    const { default: handler } = await import('../api/site-health.js');
    return new Promise(resolve => {
      const out = {};
      const res = { setHeader() {}, status(c) { out.code = c; return res; }, json(b) { out.body = b; resolve(out); return res; }, end() { resolve(out); return res; } };
      handler({ method: 'GET', headers: { authorization: 'Bearer cron-secret' }, query }, res);
    });
  };

  it('a weekday stores the numbers and sends nothing', async () => {
    const r = await run('2026-11-04T05:00:00Z');
    expect(r.body).toMatchObject({ ok: true, stored: true, weekly: false, alerted: false });
    expect(mails).toEqual([]);
    expect(patches).toHaveLength(1);
    expect(patches[0].method).toBe('POST');
    expect(patches[0].fields.Key).toBe('site_health_history');
    expect(JSON.parse(patches[0].fields.Value).days[0].p['/'].m).toBe(74);
  });

  it('Sunday sends the weekly report, real visitors first and deciding the status', async () => {
    stored = historyOf('2026-11-07', [70, 72, 74, 76, 78]);
    const r = await run('2026-11-08T05:00:00Z');
    expect(r.body).toMatchObject({ weekly: true, status: 'תקין' });
    expect(mails).toHaveLength(1);
    expect(mails[0].subject).toBe('HighAir - דוח מהירות שבועי (08/11): תקין');
    expect(mails[0].to).toEqual(['info@highair-expeditions.com']);
    expect(patches[0].method).toBe('PATCH');
    const saved = JSON.parse(patches[0].fields.Value);
    expect(saved.weekly).toBe('2026-11-08');
    expect(saved.field.site.mobile).toEqual(SITE);
    expect(saved.field.pages).toEqual({});             // no page has data of its own
    expect(saved.fieldSent.mobile).toEqual(SITE);      // next Sunday compares to this
    const html = mails[0].html;
    expect(html).toContain('לפי Google, מגולשים אמיתיים בטלפון');
    expect(html.indexOf('אצל גולשים אמיתיים, כל האתר')).toBeLessThan(html.indexOf('סימולציה של Google לכל עמוד'));
    expect(html).toContain('1.8s');
    expect(html).toContain('85% מהטעינות בטלפון');
    expect(html).not.toContain('נמדד');
  });

  it('without real-visitor numbers the lab median decides, and says so', async () => {
    siteLE = undefined;
    stored = historyOf('2026-11-07', [70, 72, 74, 76, 78]);
    const r = await run('2026-11-08T05:00:00Z');
    expect(r.body).toMatchObject({ weekly: true, status: 'שים לב' });
    expect(mails[0].subject).toBe('HighAir - דוח מהירות שבועי (08/11): שים לב');
    expect(mails[0].html).toContain('לפי הסימולציה של Google');
    expect(mails[0].html).toContain('Google עדיין לא החזירה נתוני גולשים');
  });

  it('Sunday stays quiet with too few days, and never sends twice', async () => {
    await run('2026-11-08T05:00:00Z');
    expect(mails).toEqual([]);
    stored = { ...historyOf('2026-11-07', [70, 72, 74, 76, 78]), weekly: '2026-11-08' };
    await run('2026-11-08T05:30:00Z');
    expect(mails).toEqual([]);
  });

  it('a drop that holds sends one alert, a bad day does not', async () => {
    stored = historyOf('2026-11-18', [74, 74, 74, 74, 74, 74, 74, 60, 62]);
    psiScore = 58;
    await run('2026-11-19T05:00:00Z');
    expect(mails).toHaveLength(1);
    expect(mails[0].subject).toContain('התרעת מהירות');
    mails = [];
    stored = historyOf('2026-11-18', [74, 74, 74, 74, 74, 74, 74, 74, 74]);
    await run('2026-11-19T05:00:00Z');
    expect(mails).toEqual([]);
  });

  it('never saves over a history it could not read', async () => {
    readFails = true;
    const r = await run('2026-11-08T05:00:00Z');
    expect(r.body).toMatchObject({ ok: false, stored: false });
    expect(patches).toEqual([]);
    expect(mails).toEqual([]);
  });
});
