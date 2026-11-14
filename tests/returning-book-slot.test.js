/* A returning customer who books a call goes back to the agent they had (owner, 14 Nov 2026: "אם הליד חזר
   הוא צריך לחזור לאותו סוכן"). "יעל אוזן" had a Not Relevant card with Tomer Harush; she came back as
   "יעל אוזן זרגרי" for Kilimanjaro, booked a call 13 seconds after the form, and book-slot gave the card the
   next turn of the Kilimanjaro queue (Tomer Lan) before the webapp's returning rule could run.
   The real /api/book-slot, against a stand-in Airtable held in memory. Nothing leaves this process. */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';

process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

const { default: bookSlot } = await import('../api/book-slot.js');
const { samePerson, returningAgentOf, bookingAgent } = await import('../api/_lib/active-lead.js');

const AGENTS = [
  { id: 'recAG1', fields: { Name: 'Tomer Lan', Type: 'Sales', Destinations: ['Kilimanjaro'] } },
  { id: 'recAG2', fields: { Name: 'Tomer Harush', Type: 'Sales', Destinations: ['Kilimanjaro', 'Peaks of Balkan'] } },
  { id: 'recAG3', fields: { Name: 'Raz Ohana', Type: 'Sales', Destinations: ['Kilimanjaro'] } },
  { id: 'recAG4', fields: { Name: 'Eldar Solomon', Type: 'Sales', Destinations: ['Elbrus', 'Kazbek'] } },
];
let cards, patches, created;
const json = d => new Response(JSON.stringify(d), { status: 200, headers: { 'Content-Type': 'application/json' } });
function stand() {
  return vi.fn(async (input, init = {}) => {
    const u = decodeURIComponent(String(input)); const m = (init.method || 'GET').toUpperCase();
    if (!u.includes('api.airtable.com')) return json({ ok: true });
    if (u.includes('/Agents')) return json({ records: AGENTS });
    if (u.includes('/Website Leads/') && m === 'PATCH') { const id = u.split('/Website Leads/')[1].split('?')[0]; patches.push({ id, fields: JSON.parse(init.body).fields }); return json({ id, fields: {} }); }
    if (u.includes('/Website Leads')) {
      if (u.includes('{Phone}')) return json({ records: cards });
      return json({ records: [] });                       // the queue's own tally
    }
    if (u.includes('/Appointments') && m === 'POST') { created.push(JSON.parse(init.body)); return json({ records: [{ id: 'recCALL1', fields: {} }], id: 'recCALL1' }); }
    if (u.includes('/Appointments')) return json({ records: [] });
    return json({ records: [] });
  });
}
const card = (id, name, trip, agent, stage, at) => ({ id, createdTime: at, fields: { Name: name, Phone: '+972500000001', Expedition: trip, 'Assigned Agent': agent, Stage: stage, 'Stage Changed At': at, 'Created Time': at, 'Activity Log': '' } });
let n = 0;
async function book(body) {
  let status = 200, data;
  const res = { status(s) { status = s; return this; }, json(d) { data = d; return this; }, end() { return this; }, setHeader() { return this; } };
  await bookSlot({ method: 'POST', headers: { 'x-vercel-forwarded-for': `10.9.0.${n++ % 250}` }, socket: {}, body }, res);
  return { status, data };
}
const BOOKING = { date: '2027-03-07', time: '10:00', name: 'יעל אוזן זרגרי', phone: '0500000001', expedition: 'טיפוס לקילימנג׳רו' };
beforeEach(() => { patches = []; created = []; vi.stubGlobal('fetch', stand()); });

describe('a returning customer books a call before anyone has her card', () => {
  it('goes back to the agent she had, with no turn of the queue', async () => {
    cards = [card('recOLD', 'יעל אוזן', 'Peaks of Balkan', 'Tomer Harush', 'Not Relevant', '2026-08-09T07:35:00.000Z'),
             card('recNEW', 'יעל אוזן זרגרי', 'Kilimanjaro', '', 'New Lead', '2026-11-14T16:57:49.000Z')];
    const r = await book(BOOKING);
    expect(r.status, JSON.stringify(r.data)).toBe(200);
    const p = patches.find(x => x.id === 'recNEW');
    expect(p.fields['Assigned Agent']).toBe('Tomer Harush');
    expect(p.fields['Kili Rota']).toBeUndefined();
    expect(p.fields['Activity Log']).toMatch(/Returning customer: back to Tomer Harush, who handled them before\./);
    expect(p.fields.Stage).toBe('Call Scheduled');
  });
  it('a new customer on the queue as before', async () => {
    cards = [card('recNEW', 'דנה לוי', 'Kilimanjaro', '', 'New Lead', '2026-11-14T16:57:49.000Z')];
    const r = await book({ ...BOOKING, name: 'דנה לוי' });
    expect(r.status).toBe(200);
    const p = patches.find(x => x.id === 'recNEW');
    expect(p.fields['Assigned Agent']).toBeTruthy();
    expect(p.fields['Kili Rota']).toMatch(/Kili/);
    expect(p.fields['Activity Log']).not.toMatch(/Returning customer/);
  });
  it('someone else on the same number takes the queue, not the other person\'s agent', async () => {
    cards = [card('recOLD', 'יוסי אוזן', 'Peaks of Balkan', 'Tomer Harush', 'Not Relevant', '2026-08-09T07:35:00.000Z'),
             card('recNEW', 'יעל אוזן', 'Kilimanjaro', '', 'New Lead', '2026-11-14T16:57:49.000Z')];
    await book({ ...BOOKING, name: 'יעל אוזן' });
    expect(patches.find(x => x.id === 'recNEW').fields['Kili Rota']).toMatch(/Kili/);
  });
  it('a previous agent who does not sell Kilimanjaro: the queue', async () => {
    cards = [card('recOLD', 'יעל אוזן', 'Elbrus', 'Eldar Solomon', 'Not Relevant', '2026-08-09T07:35:00.000Z'),
             card('recNEW', 'יעל אוזן', 'Kilimanjaro', '', 'New Lead', '2026-11-14T16:57:49.000Z')];
    await book({ ...BOOKING, name: 'יעל אוזן' });
    const p = patches.find(x => x.id === 'recNEW');
    expect(p.fields['Assigned Agent']).not.toBe('Eldar Solomon');
    expect(p.fields['Kili Rota']).toMatch(/Kili/);
  });
  it('the list of free times offers her that agent only (the same lookup as the booking)', async () => {
    cards = [card('recOLD', 'יעל אוזן', 'Peaks of Balkan', 'Tomer Harush', 'Not Relevant', '2026-08-09T07:35:00.000Z'),
             card('recNEW', 'יעל אוזן זרגרי', 'Kilimanjaro', '', 'New Lead', '2026-11-14T16:57:49.000Z')];
    expect(await bookingAgent({ base: 'appTEST', token: 'tok', phone: '0500000001' })).toBe('Tomer Harush');
  });
  it('a card that already has an agent keeps them', async () => {
    cards = [card('recOLD', 'יעל אוזן', 'Peaks of Balkan', 'Tomer Harush', 'Not Relevant', '2026-08-09T07:35:00.000Z'),
             card('recNEW', 'יעל אוזן', 'Kilimanjaro', 'Raz Ohana', 'New Lead', '2026-11-14T16:57:49.000Z')];
    expect(await bookingAgent({ base: 'appTEST', token: 'tok', phone: '0500000001' })).toBe('Raz Ohana');
  });
});

describe('the rule itself', () => {
  it('samePerson: the same name, or one with a word added; a household stays apart', () => {
    expect(samePerson('יעל אוזן', 'יעל אוזן זרגרי')).toBe(true);
    expect(samePerson('יוסי אוזן', 'יעל אוזן')).toBe(false);
    expect(samePerson('יעל', 'יעל אוזן')).toBe(false);
  });
  it('returningAgentOf: the most recently touched earlier card wins', () => {
    const active = card('recNEW', 'יעל אוזן', 'Kilimanjaro', '', 'New Lead', '2026-11-14T00:00:00.000Z');
    const older = card('recA', 'יעל אוזן', 'Ethiopia', 'Ohad Ozer', 'Not Relevant', '2026-03-01T00:00:00.000Z');
    const newer = card('recB', 'יעל אוזן', 'Peaks of Balkan', 'Tomer Harush', 'Not Relevant', '2026-08-09T00:00:00.000Z');
    expect(returningAgentOf([older, newer, active], active, () => true)).toBe('Tomer Harush');
    expect(returningAgentOf([older, newer, active], active, n => n !== 'Tomer Harush')).toBe('');
  });
  it('is byte for byte the webapp\'s samePerson', () => {
    const site = fs.readFileSync(new URL('../api/_lib/active-lead.js', import.meta.url), 'utf8');
    expect(site).toMatch(/return short\.length >= 2 && short\.every\(w => long\.includes\(w\)\);/);
  });
});
