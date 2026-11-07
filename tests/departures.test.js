/* /api/departures: the trip pages' dates and seat counts in one cached call
   (7 Nov 2026). The counts must be exact across every Customers page, a
   private departure never shows, no customer data leaves, and a failed page
   fails the call instead of serving a short count (a full group shown open). */
import { describe, it, expect, beforeEach, vi } from 'vitest';

process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';

const GROUPS = [
  { id: 'recPUB000000000001', fields: { Event: 'Kilimanjaro', 'Group Name': 'Kili_21_01_27', Departure: '2027-01-21', Return: '2027-01-30', Capacity: 15, 'Retail Price': 3900 } },
  { id: 'recPUB000000000002', fields: { Event: 'Elbrus', 'Group Name': 'Elbrus_15_06_27', Departure: '2027-06-15', Return: '2027-06-24' } },
  { id: 'recPRV000000000001', fields: { Event: 'Kilimanjaro', 'Group Name': 'Kili_03_01_27_P', Departure: '2027-01-03', Hidden: true } },
];
/* 250 customers over three pages: 120 on the public Kili, 7 on the private one */
const CUSTOMERS = [
  ...Array.from({ length: 120 }, (_, i) => ({ id: `recC${i}`, fields: { 'Group Name': 'Kili_21_01_27', Passport: `P${i}` } })),
  ...Array.from({ length: 7 }, (_, i) => ({ id: `recD${i}`, fields: { 'Group Name': 'Kili_03_01_27_P' } })),
  ...Array.from({ length: 123 }, (_, i) => ({ id: `recE${i}`, fields: {} })),
];

let failCustomersPage = null;
beforeEach(() => {
  failCustomersPage = null;
  vi.stubGlobal('fetch', async url => {
    const u = new URL(url);
    const table = decodeURIComponent(u.pathname.split('/').pop());
    const rows = table === 'Groups' ? GROUPS : CUSTOMERS;
    const size = Number(u.searchParams.get('pageSize') || 100);
    const start = Number(u.searchParams.get('offset') || 0);
    const page = start / size + 1;
    if (table === 'Customers' && page === failCustomersPage) return new Response('{}', { status: 429 });
    const want = u.searchParams.getAll('fields[]');
    const pick = r => ({ ...r, fields: Object.fromEntries(Object.entries(r.fields).filter(([k]) => want.includes(k))) });
    const slice = rows.slice(start, start + size).map(pick);
    const next = start + size < rows.length ? String(start + size) : undefined;
    return new Response(JSON.stringify({ records: slice, ...(next ? { offset: next } : {}) }), { status: 200 });
  });
});

const handler = (await import('../api/departures.js')).default;
const get = () => new Promise(res => {
  const out = { headers: {} };
  const r = {
    setHeader(k, v) { out.headers[k.toLowerCase()] = v; },
    status(c) { out.code = c; return r; },
    json(b) { out.body = b; res(out); },
    end() { res(out); },
  };
  handler({ method: 'GET', query: {}, headers: { 'x-forwarded-for': `10.1.${Math.floor(Math.random() * 250)}.1` }, socket: { remoteAddress: '10.1.0.1' } }, r);
});

describe('/api/departures', () => {
  it('counts every customer across all pages', async () => {
    const r = await get();
    expect(r.code).toBe(200);
    const by = Object.fromEntries(r.body.records.map(x => [x.fields['Group Name'], x.count]));
    expect(by).toEqual({ Kili_21_01_27: 120, Elbrus_15_06_27: 0 });
  });
  it('drops the private departure and never names it', async () => {
    const r = await get();
    expect(r.body.records.map(x => x.id)).not.toContain('recPRV000000000001');
    expect(JSON.stringify(r.body)).not.toContain('Kili_03_01_27_P');
  });
  it('sends only the fields the pages use, and no customer data', async () => {
    const r = await get();
    const s = JSON.stringify(r.body);
    expect(s).not.toContain('3900');      // Retail Price is not part of it
    expect(s).not.toContain('Passport');
    expect(s).not.toContain('recC');
    expect(r.body.records.every(x => !('Hidden' in x.fields))).toBe(true);
    expect(r.body.records[0].fields).toEqual({ Event: 'Kilimanjaro', 'Group Name': 'Kili_21_01_27', Departure: '2027-01-21', Return: '2027-01-30', Capacity: 15 });
  });
  it('is cached at the CDN for a minute', async () => {
    const r = await get();
    expect(r.headers['cache-control']).toBe('public, s-maxage=60, stale-while-revalidate=300');
  });
  it('a failed Customers page fails the call: never a short count', async () => {
    failCustomersPage = 2;
    const r = await get();
    expect(r.code).toBe(502);
    expect(r.body.records).toBeUndefined();
    expect(r.headers['cache-control']).toBe('no-store');
  });
});
