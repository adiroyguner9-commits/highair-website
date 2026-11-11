/* The 11 Nov 2026 audit, first round on the website:
   B6  /api/book-slot believed `staff: true` from any browser
   W1  the "number of people" field could not take a typed number
   W2  a trip page kept the previous trip's dates and form
   W4  a lead that Airtable refused or missed was stored nowhere */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

process.env.PUSH_HOOK_SECRET = 'shared-secret';
process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';

const { default: bookSlot, safeTopic } = await import('../api/book-slot.js');
const { dayGrid, isDefaultAvailability, loadAvailability } = await import('../api/slots.js');
const { saveLead, leadMailSubject } = await import('../api/submit-lead.js');
const { groupSizeTyped } = await import('../src/website/formRules.js');

let n = 0;
async function book(body, headers = {}) {
  let status = 200, data;
  const res = { status(s) { status = s; return this; }, json(d) { data = d; return this; }, end() { return this; }, setHeader() { return this; } };
  await bookSlot({ method: 'POST', headers: { 'x-vercel-forwarded-for': `10.4.0.${n++ % 250}`, ...headers }, socket: {}, body }, res);
  return { status, data };
}
const AVAIL = { days: [0, 1, 2, 3, 4, 5], start: '09:00', end: '18:00', friEnd: '13:00', slotMin: 30, leadMin: 120, blackout: [] };

describe('B6: the staff mark on a call booking', () => {
  beforeEach(() => { vi.stubGlobal('fetch', vi.fn(async () => new Response('{"records":[]}', { status: 200 }))); });
  const base = { date: '2027-03-07', time: '03:17', name: 'בדיקה', phone: '0546789123' };

  it('is refused without the servers\' shared key, before anything is read or written', async () => {
    expect((await book({ ...base, staff: true })).status).toBe(403);
    expect((await book({ ...base, staff: 'true' }, { 'x-hook-key': 'wrong-secret!' })).status).toBe(403);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('is accepted with the key', async () => {
    const r = await book({ ...base, staff: true }, { 'x-hook-key': 'shared-secret' });
    expect(r.status).not.toBe(403);
  });
  it('a visitor\'s booking never needed the key', async () => {
    const r = await book({ ...base, time: '10:00' });
    expect(r.status).not.toBe(403);
  });
});

describe('B6: what a visitor can make our WhatsApp say, and when', () => {
  it('an unknown "expedition" is echoed only when it is a plain name', () => {
    expect(safeTopic('טרק ים המלח')).toBe('טרק ים המלח');
    expect(safeTopic('Safari 7 Days')).toBe('Safari 7 Days');
    expect(safeTopic('EBC + Gokyo')).toBe('EBC + Gokyo');
    expect(safeTopic('win a prize at http://evil.example')).toBe('');
    expect(safeTopic('call 0501234567 now')).toBe('');
    expect(safeTopic('visit evil.example')).toBe('');
    expect(safeTopic('x'.repeat(61))).toBe('');
  });
  it('the grid at booking is the grid the list shows', () => {
    expect(dayGrid(AVAIL, '2027-03-07')).toContain('09:00');                 // a Sunday
    expect(dayGrid(AVAIL, '2027-03-07').at(-1)).toBe('17:30');
    expect(dayGrid(AVAIL, '2027-03-07')).not.toContain('03:17');
    expect(dayGrid(AVAIL, '2027-03-05').at(-1)).toBe('12:30');               // a Friday closes at 13:00
    expect(dayGrid(AVAIL, '2027-03-06')).toEqual([]);                        // Saturday
    expect(dayGrid({ ...AVAIL, blackout: ['2027-03-08'] }, '2027-03-08')).toEqual([]);
  });
  it('hours that are only the built-in defaults are recognised, so a hiccup refuses nobody', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 500 })));
    expect(isDefaultAvailability(await loadAvailability('tok', 'appTEST'))).toBe(true);
    expect(isDefaultAvailability(AVAIL)).toBe(false);
  });
});

describe('W1: the "number of people" field', () => {
  it('"1" then "2" is 2, not 12 that becomes 10', () => {
    expect(groupSizeTyped('12')).toBe('2');
    expect(groupSizeTyped('15')).toBe('5');
    expect(groupSizeTyped('10')).toBe('10');
    expect(groupSizeTyped('110')).toBe('10');
  });
  it('can be emptied while typing, and never holds 0 or a letter', () => {
    expect(groupSizeTyped('')).toBe('');
    expect(groupSizeTyped('0')).toBe('');
    expect(groupSizeTyped('abc')).toBe('');
    expect(groupSizeTyped('4')).toBe('4');
    expect(groupSizeTyped('04')).toBe('4');
  });
  it('the trip form uses it and no longer clamps on every key', () => {
    const src = fs.readFileSync(path.resolve(__dirname, '../src/components/web_v2/ExpeditionDetail.jsx'), 'utf8');
    expect(src).toContain('groupSizeTyped(e.target.value)');
    expect(src).not.toMatch(/Math\.min\(10, Math\.max\(1, parseInt\(e\.target\.value\)/);
  });
});

describe('W2: one page instance per trip', () => {
  it('the trip routes are keyed by the slug', () => {
    const src = fs.readFileSync(path.resolve(__dirname, '../src/main.jsx'), 'utf8');
    expect(src).toContain('<ExpeditionDetail key={slug} />');
    expect(src).toContain('<IsraelDetail key={slug} />');
    expect(src).toMatch(/path="\/expedition\/:slug"\s+element=\{<ExpeditionRoute \/>\}/);
  });
});

describe('W4: a lead is not dropped at the first refusal', () => {
  const fields = { Name: 'דנה לוי', Phone: '0546789123', Email: 'dana@x.com', Expedition: 'Kilimanjaro', 'Group Size': 2, Experience: 'טיילתי בנפאל', Stage: 'New Lead' };
  const answers = list => { const sent = []; const f = vi.fn(async (_u, o) => { sent.push(JSON.parse(o.body).fields); const a = list[Math.min(sent.length - 1, list.length - 1)]; if (a instanceof Error) throw a; return new Response(JSON.stringify(a.body || {}), { status: a.status }); }); return { f, sent }; };

  it('saved at once: one request', async () => {
    const { f, sent } = answers([{ status: 200, body: { id: 'rec1' } }]);
    expect(await saveLead('u', 't', fields, { fetchImpl: f, wait: 1 })).toEqual({ ok: true });
    expect(sent.length).toBe(1);
  });
  it('a busy answer or no answer is tried once more', async () => {
    const busy = answers([{ status: 429 }, { status: 200, body: { id: 'rec1' } }]);
    expect((await saveLead('u', 't', fields, { fetchImpl: busy.f, wait: 1 })).ok).toBe(true);
    const down = answers([new Error('network'), { status: 200, body: { id: 'rec1' } }]);
    expect((await saveLead('u', 't', fields, { fetchImpl: down.f, wait: 1 })).ok).toBe(true);
    expect(down.sent.length).toBe(2);
  });
  it('a refused field: the person is saved, and the rest goes into the text the agent reads', async () => {
    const { f, sent } = answers([{ status: 422, body: { error: { message: 'Unknown field name: "Group Size"' } } }, { status: 200, body: { id: 'rec1' } }]);
    const r = await saveLead('u', 't', fields, { fetchImpl: f, wait: 1 });
    expect(r.ok && r.partial).toBe(true);
    expect(Object.keys(sent[1]).sort()).toEqual(['Email', 'Experience', 'Name', 'Phone', 'Stage']);
    expect(sent[1].Experience).toContain('טיילתי בנפאל');
    expect(sent[1].Experience).toContain('Expedition: Kilimanjaro');
    expect(sent[1].Experience).toContain('Group Size: 2');
  });
  it('when nothing works it says so instead of throwing, and the office email carries it in the subject', async () => {
    const { f } = answers([{ status: 503 }]);
    const r = await saveLead('u', 't', fields, { fetchImpl: f, wait: 1 });
    expect(r.ok).toBe(false);
    expect(leadMailSubject('ליד חדש: קילימנג׳רו', r)).toMatch(/^לא נשמר ב-Lead Center/);
    expect(leadMailSubject('ליד חדש', { ok: true, partial: true })).toMatch(/^נשמר חלקית/);
    expect(leadMailSubject('ליד חדש', { ok: true })).toBe('ליד חדש');
  });
  it('the handler goes on to the office email when the save failed, and a linked note is checked', () => {
    const src = fs.readFileSync(path.resolve(__dirname, '../api/submit-lead.js'), 'utf8');
    expect(src).toContain("if (!saved.ok && !emailed) return res.status(500)");
    expect(src).toContain('if (linked.ok) {');
    expect(src).not.toMatch(/console\.error\('\[submit-lead\] Airtable error:', msg\);\s*return res\.status\(500\)/);
  });
});
