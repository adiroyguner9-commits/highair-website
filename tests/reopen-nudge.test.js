/* A Not Relevant card brought back by a new enquiry (webapp lead-notify, owner
   24 Nov 2026: "ואם הליד עצמו בלא רלוונטי ויזר שוב אז להחזיר את אותו הכרטיס לליד
   חדש") still gets the booking-link WhatsApps a new card would: both nudges count
   from {Reopened At}, since its {Created Time} is the first enquiry, months ago. */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

process.env.CRON_SECRET = 'cron-secret';
process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';
process.env.GREENAPI_INSTANCE = '7107596827';
process.env.GREENAPI_TOKEN = 'gtok';

const NOW = new Date('2026-10-22T08:00:00Z');   // Thursday 11:00 Israel, no hold
const minsAgo = m => new Date(NOW.getTime() - m * 60e3).toISOString();
let formulas, sentTo, nudge1Rows, nudge2Rows;

beforeEach(() => {
  formulas = []; sentTo = []; nudge1Rows = []; nudge2Rows = [];
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
  vi.stubGlobal('fetch', async (url, init = {}) => {
    const u = String(url);
    if (/green-?api\.com/.test(u)) {
      sentTo.push(JSON.parse(init.body || '{}').chatId || '');
      return new Response('{"idMessage":"BAE5"}', { status: 200 });
    }
    if (u.includes('Website%20Leads') && (!init.method || init.method === 'GET')) {
      const f = decodeURIComponent((u.split('filterByFormula=')[1] || '').split('&')[0]);
      formulas.push(f);
      if (f.includes('{Nudge Sent}!=TRUE()')) return new Response(JSON.stringify({ records: nudge1Rows }), { status: 200 });
      if (f.includes('{Nudge 2 Sent}!=TRUE()')) return new Response(JSON.stringify({ records: nudge2Rows }), { status: 200 });
    }
    return new Response('{"records":[]}', { status: 200 });
  });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

const { default: handler, enquiryMs } = await import('../api/lead-messaging.js');
const run = () => new Promise(resolve => {
  const out = {};
  const res = { setHeader() {}, status(c) { out.code = c; return res; }, json(b) { out.body = b; resolve(out); return res; }, end() { resolve(out); return res; } };
  handler({ method: 'GET', headers: { authorization: 'Bearer cron-secret' } }, res);
});

const reopened = (fields = {}) => ({ id: 'recOLD', fields: {
  Name: 'יהודית גרומן', Phone: '+972506290186', Expedition: 'Kilimanjaro', Stage: 'New Lead', Source: 'GHL import',
  'Created Time': '2026-02-22T14:27:12.000Z', 'Book Code': 'ABC123', ...fields,
} });

describe('the nudges ask for a reopened card too', () => {
  it('both formulas take a card reopened inside their window, whatever its source and creation date', async () => {
    await run();
    const n1 = formulas.find(f => f.includes('{Nudge Sent}!=TRUE()'));
    const n2 = formulas.find(f => f.includes('{Nudge 2 Sent}!=TRUE()'));
    expect(n1).toContain(`IS_AFTER({Reopened At},DATETIME_PARSE('${minsAgo(65)}'))`);
    expect(n2).toContain(`IS_AFTER({Reopened At},DATETIME_PARSE('${minsAgo(96 * 60)}'))`);
    /* a new card still passes only the source tests, as before */
    for (const f of [n1, n2]) {
      expect(f).toContain("OR(AND(NOT(FIND('WhatsApp',{Source}&'')),NOT(FIND('GHL import',{Source}&''))");
      expect(f).toContain("{Source}!='Contact Form',IS_AFTER({Created Time}");
    }
    /* the parentheses close: one AND( per opening */
    for (const f of [n1, n2]) expect((f.match(/\(/g) || []).length).toBe((f.match(/\)/g) || []).length);
  });

  it('nudge 1 goes to a reopened card 10 minutes after the reopening, not before', async () => {
    nudge1Rows = [reopened({ 'Reopened At': minsAgo(12) })];
    const { body } = await run();
    expect(body.nudge).toBe(1);
    expect(sentTo).toEqual(['972506290186@c.us']);
  });

  it('a card reopened 3 minutes ago waits', async () => {
    nudge1Rows = [reopened({ 'Reopened At': minsAgo(3) })];
    const { body } = await run();
    expect(body.nudge).toBe(0);
    expect(sentTo).toEqual([]);
  });

  it('nudge 2 counts its day from the reopening', async () => {
    nudge2Rows = [reopened({ 'Reopened At': minsAgo(25 * 60), 'Nudge Sent': true })];
    const { body } = await run();
    expect(body.nudge2).toBe(1);
    nudge2Rows = [reopened({ 'Reopened At': minsAgo(5 * 60), 'Nudge Sent': true })];
    sentTo = [];
    const again = await run();
    expect(again.body.nudge2).toBe(0);
  });

  it('enquiryMs: the later of the creation and the reopening', () => {
    expect(enquiryMs({ 'Created Time': '2026-02-22T14:27:12.000Z', 'Reopened At': '2026-11-24T17:16:00.000Z' })).toBe(Date.parse('2026-11-24T17:16:00.000Z'));
    expect(enquiryMs({ 'Created Time': '2026-11-24T17:14:21.000Z' })).toBe(Date.parse('2026-11-24T17:14:21.000Z'));
    expect(enquiryMs({})).toBe(0);
  });
});
