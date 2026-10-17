/* Customer messages from the website side: the closing welcome, its retry, and
   the Outbox that records what Green actually answered. */
import { describe, it, expect, beforeEach, vi } from 'vitest';

process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';
process.env.GREENAPI_INSTANCE = '7107596827';
process.env.GREENAPI_TOKEN = 'gtok';

let green, airtable, greenCalls, rows, lead;
beforeEach(() => {
  greenCalls = 0; rows = [];
  lead = { id: 'recX', fields: { Stage: 'Deposit A Paid', 'Deposit A Notified': false, Phone: '+972509001752', Name: 'בעז', Expedition: 'Kilimanjaro' } };
  airtable = async (u, init) => {
    if (u.includes('/Outbox') && init?.method === 'POST') rows.push(JSON.parse(init.body).records[0].fields);
    if (u.includes('AppContent')) return new Response('{"records":[]}', { status: 200 });
    if (u.includes('Website%20Leads') && (!init || !init.method || init.method === 'GET')) return new Response(JSON.stringify(lead), { status: 200 });
    return new Response('{}', { status: 200 });
  };
  vi.stubGlobal('fetch', async (url, init) => {
    const u = String(url);
    if (/green-?api\.com/.test(u)) { greenCalls++; return green(u, init); }
    if (u.includes('facebook')) return new Response('{}', { status: 200 });
    return airtable(u, init);
  });
});

const { sendDepositWelcome } = await import('../api/_lib/deposit-welcome.js');
const notify = (await import('../api/notify-deposit.js')).default;
const call = body => new Promise(res => {
  const out = {};
  const r = { setHeader() {}, status(c) { out.code = c; return r; }, json(b) { out.body = b; res(out); }, end() { res(out); } };
  notify({ method: 'POST', headers: {}, body }, r);
});

describe('the closing welcome tells the truth (Boaz Hornstein, 15 Oct 2026)', () => {
  it('a real idMessage is a send', async () => {
    green = () => new Response('{"idMessage":"BAE5"}', { status: 200 });
    expect(await sendDepositWelcome(lead)).toMatchObject({ waSent: true });
  });
  for (const [label, reply] of [
    ['a 400', () => new Response('{"message":"bad"}', { status: 400 })],
    ['a 200 with no idMessage', () => new Response('{}', { status: 200 })],
    ['a quota refusal', () => new Response('{"error":"quota"}', { status: 466 })],
  ]) {
    it(`${label} is NOT a send, and the reason comes back`, async () => {
      green = reply;
      const r = await sendDepositWelcome(lead);
      expect(r.waSent).toBe(false);
      expect(r.waError).toMatch(/green \d{3}/);
    });
  }
  it('Israel and Sinai closings stay silent by the owner\'s rule (Jul 23 2026)', async () => {
    green = () => new Response('{"idMessage":"X"}', { status: 200 });
    const r = await sendDepositWelcome({ id: 'recS', fields: { ...lead.fields, Expedition: 'Sinai' } });
    expect(r.waSent).toBe(false);
    expect(greenCalls).toBe(0);
  });
});

describe('a failed message only goes out again when a person presses retry', () => {
  it('an announced closing answers "already sent"', async () => {
    lead.fields['Deposit A Notified'] = true;
    green = () => new Response('{"idMessage":"X"}', { status: 200 });
    expect((await call({ leadId: 'recX' })).body).toMatchObject({ skipped: 'already sent' });
    expect(greenCalls).toBe(0);
  });
  it('a deliberate retry gets through', async () => {
    lead.fields['Deposit A Notified'] = true;
    green = () => new Response('{"idMessage":"X"}', { status: 200 });
    expect((await call({ leadId: 'recX', retry: true })).body).toMatchObject({ sent: true, waSent: true });
  });
});

describe('the Outbox, from the website', () => {
  it('records the provider\'s answer with the label the sender gave', async () => {
    green = () => new Response('{"idMessage":"BAE7"}', { status: 200 });
    await sendDepositWelcome(lead);
    expect(rows.at(-1)).toMatchObject({ Status: 'Sent', Kind: 'deposit_welcome', Record: 'recX', Source: 'website', 'Provider Id': 'BAE7' });
  });
  it('a broken Outbox never resends the message (the log is awaited here, so this is where it matters)', async () => {
    green = () => new Response('{"idMessage":"BAE8"}', { status: 200 });
    airtable = async (u, init) => { if (u.includes('/Outbox')) throw new Error('airtable down'); return new Response('{}', { status: 200 }); };
    const r = await sendDepositWelcome(lead);
    expect(r.waSent).toBe(true);
    expect(greenCalls).toBe(1);
  });
});

const reschedule = (await import('../api/notify-reschedule.js')).default;
describe('the reschedule notice tells the truth too (found 17 Oct 2026)', () => {
  const callIt = () => new Promise(res => {
    const out = {};
    const r = { setHeader() {}, status(c) { out.code = c; return r; }, json(b) { out.body = b; res(out); }, end() { res(out); } };
    reschedule({ method: 'POST', headers: { 'x-forwarded-for': `10.9.${Math.floor(Math.random() * 250)}.1` }, socket: { remoteAddress: '10.9.0.1' },
      body: { phone: '0509001752', name: 'בעז', expedition: 'Kilimanjaro', date: '2026-10-20', time: '10:00' } }, r);
  });
  beforeEach(() => {
    /* an appointment exists for this phone, which the endpoint insists on */
    airtable = async () => new Response('{"records":[{"id":"recA","fields":{}}]}', { status: 200 });
  });
  it('a real idMessage is "sent"', async () => {
    green = () => new Response('{"idMessage":"BAE9"}', { status: 200 });
    expect((await callIt()).body).toMatchObject({ sent: true, id: 'BAE9' });
  });
  it('a refusal is NOT "sent", and says why', async () => {
    green = () => new Response('{"message":"bad"}', { status: 400 });
    const r = (await callIt()).body;
    expect(r.sent).toBe(false);
    expect(r.error).toMatch(/green 400/);
  });
});
