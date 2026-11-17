/* The WhatsApps we start go out between 09:00 and 20:00 Israel (owner, 16 Nov 2026: "להגביל את
   ההודעות האוטומטיות שיצאו עד שעה 20:00 בערב ואם זה צריך להיות אחרי אז שיידחה למחרת בבוקר";
   only what the system starts on its own, WhatsApp only, the morning at 09:00).
   Held: the second nudge and the follow-up after a call. Not held: the replies (the first
   nudge, "we tried to reach you"), which keep their own rules. */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { inSendWindow, SEND_FROM, SEND_UNTIL } from '../api/_lib/iltime.js';

process.env.CRON_SECRET = 'cron-secret';
process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';
process.env.GREENAPI_INSTANCE = '7107596827';
process.env.GREENAPI_TOKEN = 'gtok';

const at = hhmm => { const [h, m] = hhmm.split(':').map(Number); return { ymd: '2026-10-22', minutes: h * 60 + m }; };

describe('the window', () => {
  it('opens at 09:00 and closes at 20:00', () => {
    expect([SEND_FROM, SEND_UNTIL]).toEqual([540, 1200]);
    expect(inSendWindow(at('08:59'))).toBe(false);
    expect(inSendWindow(at('09:00'))).toBe(true);
    expect(inSendWindow(at('13:00'))).toBe(true);
    expect(inSendWindow(at('19:59'))).toBe(true);
    expect(inSendWindow(at('20:00'))).toBe(false);
    expect(inSendWindow(at('23:30'))).toBe(false);
    expect(inSendWindow(at('03:00'))).toBe(false);
  });
  it('the two messages use it, and nothing still says 21:00', () => {
    const src = readFileSync(new URL('../api/lead-messaging.js', import.meta.url), 'utf8');
    /* Israel's night holds the Hebrew leads; an English lead keeps its own hours (17 Nov 2026,
       tests/english-site-flow.test.js). */
    expect(src).toContain('const ilNight2 = !inSendWindow();');
    expect(src).toContain("if (english ? !inLeadWindow(f.Phone) : ilNight2)");
    expect(src).toContain('const night = !weekend && !inSendWindow();');
    expect(src).toContain("if (english ? !inLeadWindow(f.Phone) : night) continue;");
    expect(src).not.toMatch(/hourIL\s*<\s*21|09:00-21:00/);
  });
});

let formulas, sentTo, dueLeads;
beforeEach(() => {
  formulas = []; sentTo = [];
  dueLeads = [{ id: 'recA', fields: { Name: 'דנה', Phone: '+972501234567', Stage: 'Call Done', Expedition: 'Kilimanjaro',
    'Call Done At': '2026-10-10T09:00:00.000Z', 'Last Modified': '2026-10-20T08:00:00.000Z' } }];
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.stubGlobal('fetch', async (url, init = {}) => {
    const u = String(url);
    if (/green-?api\.com/.test(u)) { sentTo.push(JSON.parse(init.body || '{}').chatId || ''); return new Response('{"idMessage":"BAE5"}', { status: 200 }); }
    if (u.includes('Website%20Leads') && (!init.method || init.method === 'GET')) {
      const f = decodeURIComponent((u.split('filterByFormula=')[1] || '').split('&')[0]);
      formulas.push(f);
      if (f.includes('IS_BEFORE({Call Done At},DATETIME_PARSE(')) return new Response(JSON.stringify({ records: dueLeads }), { status: 200 });
      return new Response('{"records":[]}', { status: 200 });
    }
    if (u.includes('/Groups?')) return new Response(JSON.stringify({ records: [{ id: 'recG1', fields: { Event: 'Kilimanjaro', Departure: '2027-01-03', 'Group Name': 'Kili_03_01_27' } }] }), { status: 200 });
    return new Response('{"records":[]}', { status: 200 });
  });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

const { default: handler } = await import('../api/lead-messaging.js');
const runAt = iso => new Promise(resolve => {
  vi.setSystemTime(new Date(iso));
  const out = {};
  const res = { setHeader() {}, status(c) { out.code = c; return res; }, json(b) { out.body = b; resolve(out); return res; }, end() { resolve(out); return res; } };
  handler({ method: 'GET', headers: { authorization: 'Bearer cron-secret' } }, res);
});
/* Thursday 22 Oct 2026, Israel summer time (UTC+3): 16:30Z = 19:30, 17:30Z = 20:30 */
const asked = marker => formulas.some(f => f.includes(marker));

describe('the lead cron at night', () => {
  it('19:30: the follow-up goes out and the second nudge is looked for', async () => {
    const r = await runAt('2026-10-22T16:30:00Z');
    expect(r.body.followUp).toBe(1);
    expect(r.body.followUpHeldForNight).toBeUndefined();
    expect(sentTo).toEqual(['972501234567@c.us']);
    expect(asked('{Nudge 2 Sent}!=TRUE()')).toBe(true);
  });
  it('20:30: both wait; nothing goes out, nothing is marked', async () => {
    const r = await runAt('2026-10-22T17:30:00Z');
    expect(r.body.followUp).toBe(0);
    expect(r.body.followUpHeldForNight).toBe(true);
    expect(sentTo).toEqual([]);
    /* Only the English site's leads are read at Israel's night (their own hour decides). */
    const nightQueries = formulas.filter(f => f.includes('IS_BEFORE({Call Done At},DATETIME_PARSE(') || f.includes('{Nudge 2 Sent}!=TRUE()'));
    expect(nightQueries.length).toBe(2);
    for (const f of nightQueries) expect(f).toContain("{Language}='English'");
  });
  it('08:30 the next morning still waits, 09:00 sends', async () => {
    let r = await runAt('2026-10-23T05:30:00Z');
    expect(r.body.followUpHeldForNight).toBe(true);
    expect(sentTo).toEqual([]);
    r = await runAt('2026-10-23T06:00:00Z');
    expect(r.body.followUp).toBe(1);
  });
  it('the first nudge, a reply to a form just sent, is still looked for at night', async () => {
    await runAt('2026-10-22T20:30:00Z');   // 23:30 Israel
    expect(asked("{Stage}='New Lead'")).toBe(true);
  });
});
