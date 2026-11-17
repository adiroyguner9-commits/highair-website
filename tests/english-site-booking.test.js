/* Booking a call from the English site (owner, 17 Nov 2026): the call and the lead are Tomer
   Lan's ("ושהלידים באתר באנגלית יגיעו רק לתומר לן"), the calendar offers his free times, and the
   confirmation goes in English with the hour said to be Israel's ("שעון ישראל בלבד"). */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isYomTov } from '../api/_lib/iltime.js';

process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';
process.env.PUSH_HOOK_SECRET = '';
process.env.GREENAPI_INSTANCE = '7100000000';
process.env.GREENAPI_TOKEN = 'green';
process.env.RESEND_API_KEY = 're_test';

const calls = [];
let answer = () => ({});
globalThis.fetch = async (url, init = {}) => {
  const u = String(url), method = init.method || 'GET';
  let body = null; try { body = init.body ? JSON.parse(init.body) : null; } catch { body = init.body; }
  calls.push({ u, method, body });
  const out = await answer(u, method, body);
  if (out instanceof Response) return out;
  return new Response(typeof out === 'string' ? out : JSON.stringify(out ?? {}), { status: 200, headers: { 'content-type': 'application/json' } });
};
const table = u => decodeURIComponent((/\/v0\/appTEST\/([^/?]+)/.exec(u) || [])[1] || '');
const green = () => calls.filter(c => /greenapi|green-api/.test(c.u) && /sendMessage/.test(c.u));
const mails = () => calls.filter(c => c.u.includes('api.resend.com'));

const { default: bookSlot } = await import('../api/book-slot.js');
const { default: slots } = await import('../api/slots.js');
const { bookingAgent } = await import('../api/_lib/active-lead.js');

let ipN = 0;
async function run(handler, { method = 'POST', body, query, headers = {} } = {}) {
  let status = 200, data;
  const res = { status(s) { status = s; return this; }, json(d) { data = d; return this; }, end() { return this; }, setHeader() { return this; } };
  await handler({ method, headers: { 'x-vercel-forwarded-for': `10.7.${Math.floor(ipN / 250)}.${ipN++ % 250}`, ...headers }, socket: {}, body, query }, res);
  return { status, data };
}
const openDay = (() => {
  const d = new Date(Date.now() + 40 * 86400000);
  for (;;) { const ymd = d.toISOString().slice(0, 10); if (![5, 6].includes(new Date(`${ymd}T00:00:00`).getDay()) && !isYomTov(ymd)) return ymd; d.setUTCDate(d.getUTCDate() + 1); }
})();
const EN = { origin: 'https://en.highair-expeditions.com' };
const DE = { origin: 'https://de.highair-expeditions.com' };
beforeEach(() => { calls.length = 0; answer = () => ({ records: [] }); vi.spyOn(console, 'log').mockImplementation(() => {}); vi.spyOn(console, 'warn').mockImplementation(() => {}); });

const withCard = card => (u, method) => {
  if (table(u) === 'Appointments' && method === 'POST') return { id: 'recAPPT0000000009', fields: {} };
  if (table(u) === 'Website Leads' && method === 'GET') return { records: card ? [{ id: 'recLEAD0000000003', fields: { Stage: 'New Lead', ...card } }] : [] };
  if (/greenapi|green-api/.test(u)) return { idMessage: 'MSG1' };
  if (u.includes('api.resend.com')) return { id: 'mail1' };
  return { records: [] };
};
const booking = { date: openDay, time: '11:30', name: 'John Smith', phone: '+1 202-555-0123', email: 'john@example.com', expedition: 'קילימנג׳רו' };

describe('a call booked from the English site', () => {
  it('is Tomer Lan\'s: the lead card and the call', async () => {
    answer = withCard({ Language: 'English', Expedition: 'Kilimanjaro' });
    const r = await run(bookSlot, { body: booking, headers: EN });
    expect(r.data).toEqual({ ok: true });
    const lead = calls.find(c => c.method === 'PATCH' && table(c.u).startsWith('Website Leads'));
    expect(lead.body.fields['Assigned Agent']).toBe('Tomer Lan');
    expect(lead.body.fields['Activity Log']).toContain('English site: assigned to Tomer Lan.');
    const appt = calls.find(c => c.method === 'PATCH' && table(c.u).startsWith('Appointments'));
    expect(appt.body.fields.Agent).toBe('Tomer Lan');
  });
  it('the WhatsApp and the email say it in English, in Israel time', async () => {
    answer = withCard({ Language: 'English', Expedition: 'Kilimanjaro' });
    await run(bookSlot, { body: booking, headers: EN });
    expect(green()).toHaveLength(1);
    const text = green()[0].body.message;
    expect(text).toContain('Your call about Kilimanjaro is booked!');
    expect(text).toContain('11:30 (Israel time)');
    expect(text).not.toMatch(/[֐-׿]/);
    const toClient = mails().find(m => (m.body.to || []).includes?.('john@example.com') || m.body.to === 'john@example.com');
    expect(toClient.body.subject).toContain('Your call is booked for');
    expect(toClient.body.subject).toContain('(Israel time)');
    expect(toClient.body.html).toContain('dir="ltr"');
    expect(toClient.body.html).toContain('Israel time');
    expect(toClient.body.html).not.toMatch(/הוספה ל-Google/);
  });
  it('a card that already has an agent keeps them', async () => {
    answer = withCard({ Language: 'English', Expedition: 'Kilimanjaro', 'Assigned Agent': 'Adir Oyguner' });
    await run(bookSlot, { body: booking, headers: EN });
    const lead = calls.find(c => c.method === 'PATCH' && table(c.u).startsWith('Website Leads'));
    expect(lead.body.fields['Assigned Agent']).toBeUndefined();
  });
  it('a visitor with no card yet: the call is still Tomer\'s, and the text English', async () => {
    answer = withCard(null);
    await run(bookSlot, { body: booking, headers: EN });
    const appt = calls.find(c => c.method === 'PATCH' && table(c.u).startsWith('Appointments'));
    expect(appt.body.fields.Agent).toBe('Tomer Lan');
    expect(green()[0].body.message).toContain('(Israel time)');
  });
  it('the German site, card or not, gets no WhatsApp', async () => {
    answer = withCard(null);
    await run(bookSlot, { body: booking, headers: DE });
    expect(green()).toHaveLength(0);
  });
  it('the Hebrew site is as it was', async () => {
    answer = withCard({ Language: 'Hebrew', Expedition: 'Kilimanjaro', 'Assigned Agent': 'Tomer Harush' });
    await run(bookSlot, { body: { ...booking, phone: '050-1234567', name: 'דנה כהן' }, headers: { origin: 'https://www.highair-expeditions.com' } });
    expect(green()[0].body.message).toMatch(/שוריינה בהצלחה/);
    expect(green()[0].body.message).not.toContain('Israel time');
  });
});

describe('the calendar on the English site', () => {
  it('an English card with nobody on it yet is Tomer Lan\'s', async () => {
    answer = (u) => table(u) === 'Website Leads' ? { records: [{ id: 'recLEAD0000000004', fields: { Stage: 'New Lead', Language: 'English', Expedition: 'Kilimanjaro' } }] } : { records: [] };
    expect(await bookingAgent({ base: 'appTEST', token: 'tok', phone: '+12025550123' })).toBe('Tomer Lan');
  });
  it('offers Tomer\'s free times only, for a visitor with no card too', async () => {
    answer = (u) => {
      if (table(u) === 'Appointments') return { records: [
        { id: 'recA1', fields: { Time: '10:00', Agent: 'Tomer Lan', Expedition: 'Kilimanjaro' } },
        { id: 'recA2', fields: { Time: '11:00', Agent: 'Dana Levi', Expedition: 'Annapurna' } },
      ] };
      return { records: [] };
    };
    const r = await run(slots, { body: { date: openDay, expedition: 'Kilimanjaro', phone: '+12025550123' }, headers: EN });
    expect(r.data.slots).not.toContain('10:00');
    expect(r.data.slots).toContain('11:00');
  });
});
