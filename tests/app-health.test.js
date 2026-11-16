/* The app watched from the website (owner, 16 Nov 2026): one email when the app stops answering,
   a reminder every 3 hours while it stays down, one email when it is back. A single slow moment,
   or Vercel's bot check answering instead of the app, stays silent. */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  judgeAnswer, verdict, nextStep, lasted, emailFor, parseState, REMIND_MS, CHECKS,
} from '../api/_lib/app-health.js';

const PAGE_OK = { status: 200, text: '<!DOCTYPE html><html><body><div id="root"></div></body></html>' };
const API_OK  = { status: 200, text: '{"publicKey":"BExample"}' };
const T0 = Date.parse('2026-11-16T19:40:00Z');   // 21:40 in Israel

describe('one answer, judged', () => {
  it('the page and the server answering as they should', () => {
    expect(judgeAnswer('page', PAGE_OK).ok).toBe(true);
    expect(judgeAnswer('api', API_OK).ok).toBe(true);
    expect(judgeAnswer('api', { status: 200, text: '{"publicKey":""}' }).ok).toBe(true);  // a missing key is not an outage
  });
  it('an error, a timeout, a broken answer', () => {
    expect(judgeAnswer('api', { status: 500, text: '' })).toMatchObject({ ok: false, why: 'השיב בשגיאה (HTTP 500)' });
    expect(judgeAnswer('page', { error: 'timeout' })).toMatchObject({ ok: false, why: 'לא ענה תוך 10 שניות' });
    expect(judgeAnswer('page', { error: 'ENOTFOUND' }).ok).toBe(false);
    expect(judgeAnswer('api', { status: 200, text: '<!DOCTYPE html>' }).ok).toBe(false);   // the app's page in place of the server
    expect(judgeAnswer('page', { status: 200, text: '<html>404</html>' }).ok).toBe(false);
  });
  it("Vercel's bot check is neither up nor down", () => {
    expect(judgeAnswer('page', { status: 403, text: '', mitigated: true }).ok).toBe(null);
    expect(verdict([{ ok: true }, { ok: null }])).toBe('unknown');
    expect(verdict([{ ok: false }, { ok: null }])).toBe('down');
    expect(verdict([{ ok: true }, { ok: true }])).toBe('up');
  });
});

describe('what to email', () => {
  it('up and staying up: nothing, nothing written', () => {
    expect(nextStep({}, 'up', T0)).toEqual({ email: null, state: null });
    expect(nextStep({ down: false }, 'up', T0)).toEqual({ email: null, state: null });
  });
  it('down: one email, then quiet, then a reminder after three hours', () => {
    const first = nextStep({}, 'down', T0);
    expect(first.email).toBe('down');
    expect(first.state).toMatchObject({ down: true, since: new Date(T0).toISOString() });
    expect(nextStep(first.state, 'down', T0 + 5 * 60000)).toEqual({ email: null, state: null });
    expect(nextStep(first.state, 'down', T0 + REMIND_MS - 60000).email).toBe(null);
    const again = nextStep(first.state, 'down', T0 + REMIND_MS);
    expect(again.email).toBe('still');
    expect(again.state.since).toBe(first.state.since);
    expect(nextStep(again.state, 'down', T0 + REMIND_MS + 60 * 60000).email).toBe(null);
  });
  it('back up: one email with how long it lasted', () => {
    const down = nextStep({}, 'down', T0).state;
    const up = nextStep(down, 'up', T0 + 25 * 60000);
    expect(up.email).toBe('up');
    expect(up.state.down).toBe(false);
    const mail = emailFor(up, [], T0 + 25 * 60000);
    expect(mail.subject).toBe('HighAir - האפליקציה חזרה לעבוד');
    expect(mail.body).toContain('היא לא ענתה 25 דקות, מאז 16.11, 21:40');
  });
  it('unknown changes nothing', () => {
    const down = nextStep({}, 'down', T0).state;
    expect(nextStep(down, 'unknown', T0 + REMIND_MS * 2)).toEqual({ email: null, state: null });
    expect(nextStep({}, 'unknown', T0)).toEqual({ email: null, state: null });
  });
  it('durations read as Hebrew', () => {
    expect(lasted(T0, T0 + 7 * 60000)).toBe('7 דקות');
    expect(lasted(T0, T0 + 60 * 60000)).toBe('שעה');
    expect(lasted(T0, T0 + 130 * 60000)).toBe('שעתיים ו-10 דקות');
    expect(lasted(T0, T0 + 5 * 60 * 60000)).toBe('5 שעות');
  });
  it('the down email names what failed; no dashes, dots or arrows in any letter', () => {
    const judged = [{ ...CHECKS[0], ok: true }, { ...CHECKS[1], ok: false, why: 'השיב בשגיאה (HTTP 500)' }];
    const down = emailFor({ email: 'down' }, judged, T0);
    expect(down.subject).toBe('HighAir - האפליקציה לא עונה');
    expect(down.body).toContain('השרת של האפליקציה: השיב בשגיאה (HTTP 500)');
    expect(down.body).not.toContain('האפליקציה עצמה (הדף)');
    expect(down.body).toContain('בבדיקה האוטומטית של 16.11, 21:40');
    const still = emailFor({ email: 'still', since: new Date(T0).toISOString() }, judged, T0 + REMIND_MS);
    expect(still.body).toContain('כבר 3 שעות');
    for (const m of [down, still, emailFor({ email: 'up', since: new Date(T0).toISOString() }, [], T0 + 60000)]) {
      expect(m.body + m.title).not.toMatch(/[—–·→←]/);
    }
  });
  it('a stored state that cannot be read is an empty one', () => {
    expect(parseState('not json')).toEqual({});
    expect(parseState('')).toEqual({});
    expect(parseState('{"down":true}')).toEqual({ down: true });
  });
});

describe('the run', () => {
  let app, stored, paused, readFails, mails, writes, resendOk;
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers({ toFake: ['Date'] });
    process.env.CRON_SECRET = 'cron-secret';
    process.env.AIRTABLE_TOKEN = 't'; process.env.AIRTABLE_BASE = 'appTEST0000000000';
    process.env.RESEND_API_KEY = 'r';
    app = { page: PAGE_OK, api: API_OK };
    stored = null; paused = false; readFails = false; mails = []; writes = []; resendOk = true;
    vi.stubGlobal('fetch', vi.fn(async (url, init = {}) => {
      const u = String(url);
      const reply = a => a.error ? Promise.reject(Object.assign(new Error(a.error), { name: a.error === 'timeout' ? 'AbortError' : 'Error' }))
        : new Response(a.text, { status: a.status, headers: a.mitigated ? { 'x-vercel-mitigated': 'challenge' } : {} });
      if (u === 'https://app.highair-expeditions.com/') return reply(app.page);
      if (u === 'https://app.highair-expeditions.com/api/push-config') return reply(app.api);
      if (u.includes('resend.com')) { mails.push(JSON.parse(init.body)); return new Response('{}', { status: resendOk ? 200 : 429 }); }
      if (u.includes('/AppContent')) {
        if (init.method === 'PATCH' || init.method === 'POST') { writes.push({ method: init.method, fields: JSON.parse(init.body).fields }); stored = JSON.parse(JSON.parse(init.body).fields.Value); return new Response('{}', { status: 200 }); }
        if (readFails) return new Response('{}', { status: 503 });
        const recs = [];
        if (stored) recs.push({ id: 'recSTATE000000001', fields: { Key: 'app_health_state', Value: JSON.stringify(stored) } });
        if (paused) recs.push({ id: 'recPAUSE000000001', fields: { Key: 'app_health_paused', Value: '1' } });
        return new Response(JSON.stringify({ records: recs }), { status: 200 });
      }
      throw new Error('unexpected fetch ' + u);
    }));
  });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  const run = async (at, { auth = 'Bearer cron-secret' } = {}) => {
    vi.setSystemTime(new Date(at));
    const { default: handler } = await import('../api/app-health.js');
    return new Promise(resolve => {
      const out = {};
      const res = { setHeader() {}, status(c) { out.code = c; return res; }, json(b) { out.body = b; resolve(out); return res; }, end() { resolve(out); return res; } };
      handler({ method: 'GET', headers: { authorization: auth }, query: { wait: '0' } }, res);
    });
  };

  it('refuses a caller without the cron key', async () => {
    expect((await run(T0, { auth: '' })).code).toBe(401);
    expect((await run(T0, { auth: 'Bearer wrong' })).code).toBe(401);
  });

  it('the app answering: no email, nothing written', async () => {
    const r = await run(T0);
    expect(r.body).toMatchObject({ ok: true, outcome: 'up', email: null });
    expect(mails).toEqual([]);
    expect(writes).toEqual([]);
  });

  it("the app's real page: its root sits past the first 4 KB (16 Nov, the first live run)", async () => {
    app.page = { status: 200, text: `<!DOCTYPE html><html><head>${'<meta name="x" content="y">'.repeat(400)}</head><body><div id="root"></div></body></html>` };
    expect(app.page.text.indexOf('<div id="root"')).toBeGreaterThan(4000);
    const r = await run(T0);
    expect(r.body.outcome).toBe('up');
  });

  it('one blip, answered on the second try, stays silent', async () => {
    let calls = 0;
    app.api = { get status() { return ++calls === 1 ? 500 : 200; }, text: API_OK.text };
    const r = await run(T0);
    expect(r.body.outcome).toBe('up');
    expect(mails).toEqual([]);
  });

  it('down, quiet, reminder, back up: three emails in all', async () => {
    app.api = { status: 502, text: '' };
    let r = await run(T0);
    expect(r.body).toMatchObject({ outcome: 'down', email: 'down', emailed: true });
    expect(mails).toHaveLength(1);
    expect(mails[0].subject).toBe('HighAir - האפליקציה לא עונה');
    expect(mails[0].to).toEqual(['info@highair-expeditions.com']);
    expect(mails[0].html).toContain('השרת של האפליקציה: השיב בשגיאה (HTTP 502)');
    expect(writes[0].method).toBe('POST');
    expect(writes[0].fields.Key).toBe('app_health_state');

    r = await run(T0 + 5 * 60000);
    expect(r.body.email).toBe(null);
    expect(mails).toHaveLength(1);
    expect(writes).toHaveLength(1);

    r = await run(T0 + REMIND_MS);
    expect(r.body.email).toBe('still');
    expect(mails[1].subject).toBe('HighAir - האפליקציה עדיין לא עונה');
    expect(writes[1].method).toBe('PATCH');

    app.api = API_OK;
    r = await run(T0 + REMIND_MS + 10 * 60000);
    expect(r.body).toMatchObject({ outcome: 'up', email: 'up' });
    expect(mails[2].subject).toBe('HighAir - האפליקציה חזרה לעבוד');
    expect(stored.down).toBe(false);

    await run(T0 + REMIND_MS + 15 * 60000);
    expect(mails).toHaveLength(3);
  });

  it("Vercel's bot check answering: no email either way", async () => {
    app.page = { status: 403, text: '', mitigated: true };
    const r = await run(T0);
    expect(r.body.outcome).toBe('unknown');
    expect(mails).toEqual([]);
    expect(writes).toEqual([]);
  });

  it('a timeout counts as down', async () => {
    app.page = { error: 'timeout' };
    const r = await run(T0);
    expect(r.body.outcome).toBe('down');
    expect(mails[0].html).toContain('לא ענה תוך 10 שניות');
  });

  it('a refused email keeps the state, so the next run tries again', async () => {
    app.api = { status: 500, text: '' };
    resendOk = false;
    await run(T0);
    expect(writes).toEqual([]);
    resendOk = true;
    const r = await run(T0 + 5 * 60000);
    expect(r.body).toMatchObject({ email: 'down', emailed: true });
    expect(mails).toHaveLength(2);
  });

  it('the kill switch stops everything', async () => {
    paused = true;
    app.api = { status: 500, text: '' };
    const r = await run(T0);
    expect(r.body).toEqual({ ok: true, paused: true });
    expect(mails).toEqual([]);
  });

  it('Airtable unreadable: the instance remembers, so no email every 5 minutes', async () => {
    readFails = true;
    app.api = { status: 500, text: '' };
    await run(T0);
    await run(T0 + 5 * 60000);
    await run(T0 + 10 * 60000);
    expect(mails).toHaveLength(1);
    expect(writes).toEqual([]);
  });

  it('is on the schedule every 5 minutes, with time for the second try', async () => {
    const v = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
    expect(v.crons).toContainEqual({ path: '/api/app-health', schedule: '*/5 * * * *' });
    expect(v.functions['api/app-health.js'].maxDuration).toBeGreaterThanOrEqual(45);
  });
});
