/* A lead from the English, German or Spanish site gets email only, never an
   automatic WhatsApp (owner, 10 Nov 2026: the first English-site lead got the
   Hebrew nudge, "זה באג חמור מאוד"). */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isForeignLead, NOT_FOREIGN_FORMULA } from '../api/_lib/lead-channel.js';

describe('who is from abroad', () => {
  it('the form\'s Language, any case', () => {
    expect(isForeignLead({ Language: 'English' })).toBe(true);
    expect(isForeignLead({ Language: 'german' })).toBe(true);
    expect(isForeignLead({ Language: 'Spanish' })).toBe(true);
    expect(isForeignLead({ Language: 'Hebrew' })).toBe(false);
    expect(isForeignLead({})).toBe(false);
  });
  it('a WhatsApp lead only by the foreign site\'s pre-filled greeting', () => {
    expect(isForeignLead({ Source: 'WhatsApp', Experience: "Hi! I'd love to hear more about Kilimanjaro" })).toBe(true);
    expect(isForeignLead({ Source: 'WhatsApp', Experience: 'Hi! I’d love to hear more about EBC' })).toBe(true);
    expect(isForeignLead({ Source: 'WhatsApp', Experience: 'היי, אשמח לפרטים על קילימנג׳רו' })).toBe(false);
  });
  it('the formula keeps form leads from abroad out of every query', () => {
    expect(NOT_FOREIGN_FORMULA).toBe("NOT(OR({Language}='English',{Language}='German',{Language}='Spanish')),");
  });
});

process.env.CRON_SECRET = 'cron-secret';
process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';
process.env.GREENAPI_INSTANCE = '7107596827';
process.env.GREENAPI_TOKEN = 'gtok';

let formulas, sentTo, rows;
beforeEach(() => {
  formulas = []; sentTo = []; rows = {};
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-11-10T08:00:00Z'));   // Tuesday 10:00 Israel
  vi.stubGlobal('fetch', async (url, init = {}) => {
    const u = String(url);
    if (/green-?api\.com/.test(u)) { sentTo.push(JSON.parse(init.body || '{}').chatId || ''); return new Response('{"idMessage":"BAE5"}', { status: 200 }); }
    if (u.includes('Website%20Leads') && (!init.method || init.method === 'GET')) {
      const f = decodeURIComponent((u.split('filterByFormula=')[1] || '').split('&')[0]);
      formulas.push(f);
      if (f.includes('{Nudge Sent}!=TRUE()')) return new Response(JSON.stringify({ records: rows.nudge || [] }), { status: 200 });
      if (f.includes('{Follow-Up Sent}!=TRUE()')) return new Response(JSON.stringify({ records: rows.follow || [] }), { status: 200 });
      return new Response('{"records":[]}', { status: 200 });
    }
    return new Response('{"records":[]}', { status: 200 });
  });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

const { default: handler } = await import('../api/lead-messaging.js');
const run = () => new Promise(resolve => {
  const out = {};
  const res = { setHeader() {}, status(c) { out.code = c; return res; }, json(b) { out.body = b; resolve(out); return res; }, end() { resolve(out); return res; } };
  handler({ method: 'GET', headers: { authorization: 'Bearer cron-secret' } }, res);
});

describe('the lead cron sends a lead from abroad no WhatsApp', () => {
  it('every WhatsApp query leaves the foreign sites out', async () => {
    await run();
    const wa = formulas.filter(f => /\{Nudge Sent\}!=TRUE\(\)|\{Nudge 2 Sent\}!=TRUE\(\)|\{No Answer Notified\}!=TRUE\(\)|\{Follow-Up Sent\}!=TRUE\(\)/.test(f));
    expect(wa.length).toBeGreaterThanOrEqual(3);
    for (const f of wa) expect(f).toContain("{Language}='English'");
  });
  it('even if one slips into a result, it is skipped and nothing goes out', async () => {
    rows.nudge = [{ id: 'recEN', fields: { Name: 'Dana', Phone: '+972501112233', Stage: 'New Lead', Expedition: 'Kilimanjaro Kosher', Language: 'English', 'Created Time': '2026-11-10T07:40:00.000Z' } }];
    rows.follow = [{ id: 'recDE', fields: { Name: 'Jonas', Phone: '+4915112345678', Stage: 'Call Done', Expedition: 'Kilimanjaro', Language: 'German', 'Call Done At': '2026-11-01T09:00:00.000Z' } }];
    const { body } = await run();
    expect(sentTo).toEqual([]);
    expect(body.nudge).toBe(0);
    expect(body.followUp).toBe(0);
  });
});
