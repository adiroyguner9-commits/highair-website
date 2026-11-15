/* The 5-minute lead cron, 22 Oct 2026:
   - a follow-up that always fails no longer holds the others back
   - the safety net waits for a move to settle, so it cannot race the instant send
   15 Nov 2026: the follow-up goes only where the trip has a future departure. */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

process.env.CRON_SECRET = 'cron-secret';
process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';
process.env.GREENAPI_INSTANCE = '7107596827';
process.env.GREENAPI_TOKEN = 'gtok';

let formulas, sentTo, dueLeads, groups, groupsDown, logs;
const BAD = ['972500000001', '972500000002', '972500000003'];
const lead = (id, phone, lastModified) => ({ id, fields: {
  Name: 'דנה', Phone: '+' + phone, Stage: 'Call Done', Expedition: 'Kilimanjaro',
  'Call Done At': '2026-10-10T09:00:00.000Z', 'Last Modified': lastModified,
} });

beforeEach(() => {
  formulas = []; sentTo = []; logs = []; groupsDown = false;
  /* a future, public Kilimanjaro departure, so the follow-up has something to say */
  groups = [{ id: 'recG1', fields: { Event: 'Kilimanjaro', Departure: '2027-01-03', 'Group Name': 'Kili_03_01_27' } }];
  vi.spyOn(console, 'log').mockImplementation((...a) => { logs.push(a.join(' ')); });
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-22T08:00:00Z'));   // Thursday 11:00 Israel, no hold
  vi.stubGlobal('fetch', async (url, init = {}) => {
    const u = String(url);
    if (/green-?api\.com/.test(u)) {
      const chat = JSON.parse(init.body || '{}').chatId || '';
      if (BAD.some(b => chat.startsWith(b))) return new Response('{"error":"not on whatsapp"}', { status: 466 });
      sentTo.push(chat);
      return new Response('{"idMessage":"BAE5"}', { status: 200 });
    }
    if (u.includes('Website%20Leads') && (!init.method || init.method === 'GET')) {
      const f = decodeURIComponent((u.split('filterByFormula=')[1] || '').split('&')[0]);
      formulas.push(f);
      if (f.includes('{Follow-Up Sent}!=TRUE()')) return new Response(JSON.stringify({ records: dueLeads }), { status: 200 });
      return new Response('{"records":[]}', { status: 200 });
    }
    if (u.includes('/Groups?')) {
      if (groupsDown) return new Response('{"error":"boom"}', { status: 503 });
      return new Response(JSON.stringify({ records: groups }), { status: 200 });
    }
    return new Response('{"records":[]}', { status: 200 });
  });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

const { default: handler } = await import('../api/lead-messaging.js');
const run = () => new Promise(resolve => {
  const out = {};
  const res = { setHeader() {}, status(c) { out.code = c; return res; }, json(b) { out.body = b; resolve(out); return res; }, end() { resolve(out); return res; } };
  handler({ method: 'GET', headers: { authorization: 'Bearer cron-secret' } }, res);
});

describe('the 4-day follow-up', () => {
  it('three leads that always fail no longer block a fourth', async () => {
    dueLeads = [
      lead('recA', BAD[0], '2026-10-20T08:00:00.000Z'),
      lead('recB', BAD[1], '2026-10-20T08:01:00.000Z'),
      lead('recC', BAD[2], '2026-10-20T08:02:00.000Z'),
      lead('recD', '972501234567', '2026-10-21T08:00:00.000Z'),
    ];
    const { body } = await run();
    expect(body.followUpFailed).toBe(3);
    expect(body.followUp).toBe(1);
    expect(sentTo).toEqual(['972501234567@c.us']);
  });
  it('the card touched longest ago goes first, so a just-failed one waits its turn', async () => {
    dueLeads = [
      lead('recA', BAD[0], '2026-10-22T07:55:00.000Z'),   // released by the last tick
      lead('recD', '972501234567', '2026-10-15T08:00:00.000Z'),
    ];
    await run();
    expect(sentTo[0]).toBe('972501234567@c.us');
  });
  it('only due cards are asked for', async () => {
    dueLeads = [];
    await run();
    expect(formulas.find(f => f.includes('{Follow-Up Sent}!=TRUE()'))).toContain('IS_BEFORE({Call Done At}');
  });
});

describe('the follow-up only where the trip has a departure ahead (owner, 15 Nov 2026)', () => {
  const trip = (id, Expedition) => ({ ...lead(id, '972501234567', '2026-10-20T08:00:00.000Z'), fields: { ...lead(id, '972501234567', '2026-10-20T08:00:00.000Z').fields, Expedition } });
  it('a trip with no future Groups row is not sent the follow-up, and one line says how many', async () => {
    dueLeads = [trip('recM', 'Manaslu'), trip('recK', 'Kilimanjaro')];
    const { body } = await run();
    expect(sentTo).toEqual(['972501234567@c.us']);
    expect(body.followUp).toBe(1);
    expect(body.followUpNoDeparture).toBe(1);
    expect(logs.filter(l => l.includes('follow-up not sent'))).toEqual(['[lead-messaging] follow-up not sent: 1 with no future departure']);
  });
  it('a past or hidden departure is no departure', async () => {
    groups = [
      { id: 'recG2', fields: { Event: 'Kilimanjaro', Departure: '2026-10-01' } },
      { id: 'recG3', fields: { Event: 'Kilimanjaro', Departure: '2027-02-01', Hidden: true } },
    ];
    dueLeads = [trip('recK', 'Kilimanjaro')];
    const { body } = await run();
    expect(sentTo).toEqual([]);
    expect(body.followUpNoDeparture).toBe(1);
  });
  it('the kosher trip needs a kosher departure, and the regular one a regular one', async () => {
    groups = [{ id: 'recG4', fields: { Event: 'Kilimanjaro_Kosher_with_Safari', Departure: '2027-01-12' } }];
    dueLeads = [trip('recR', 'Kilimanjaro (Religious)'), trip('recK', 'Kilimanjaro')];
    const { body } = await run();
    expect(body.followUp).toBe(1);
    expect(body.followUpNoDeparture).toBe(1);
  });
  it('when Groups cannot be read, nothing is sent that run', async () => {
    groupsDown = true;
    dueLeads = [trip('recK', 'Kilimanjaro')];
    const { body } = await run();
    expect(sentTo).toEqual([]);
    expect(body.followUp).toBe(0);
    expect(body.followUpNoGroups).toBe(1);
    expect(body.errors.some(e => e.startsWith('followUp groups:'))).toBe(true);
  });
});

describe('the safety net does not race the instant send', () => {
  it('no-answer and closing-welcome only take a move a few minutes old', async () => {
    dueLeads = [];
    await run();
    const na = formulas.find(f => f.includes("{Stage}='No Answer'"));
    const dep = formulas.find(f => f.includes("{Stage}='Deposit A Paid',{Deposit A Notified}"));
    expect(na).toContain("IS_BEFORE({Stage Changed At},DATETIME_PARSE('2026-10-22T07:57:00.000Z'))");
    expect(dep).toContain("IS_BEFORE({Stage Changed At},DATETIME_PARSE('2026-10-22T07:57:00.000Z'))");
  });
});

describe('contact forms are not leads', () => {
  it('neither nudge asks for a contact-form submission', async () => {
    dueLeads = [];
    await run();
    const n1 = formulas.find(f => f.includes('{Nudge Sent}!=TRUE()'));
    const n2 = formulas.find(f => f.includes('{Nudge 2 Sent}!=TRUE()'));
    for (const f of [n1, n2]) {
      expect(f).toContain("{Source}!='Contact'");
      expect(f).toContain("{Source}!='Contact Form'");
    }
  });
});
