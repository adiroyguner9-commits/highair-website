/* The website's public read proxy. Limiting what comes back is not enough: a formula
   or a sort runs on every column, so the question itself must not reach Airtable. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';

const { default: handler } = await import('../api/at.js');

let upstream;
let n = 0;
const get = (table, query = {}, id) => new Promise(resolve => {
  const res = {
    statusCode: 200, setHeader() {}, getHeader() {},
    status(c) { this.statusCode = c; return this; },
    json(d) { resolve({ status: this.statusCode, data: d }); return this; },
    end() { resolve({ status: this.statusCode }); return this; },
  };
  n++;
  handler({ method: 'GET', headers: { 'x-vercel-forwarded-for': `10.8.${n >> 8}.${n & 255}` }, socket: {}, query: { table, ...(id ? { id } : {}), ...query } }, res);
});
const sentTo = () => decodeURIComponent(String(upstream[0]));

beforeEach(() => {
  upstream = [];
  vi.stubGlobal('fetch', vi.fn(async url => {
    upstream.push(url);
    return new Response(JSON.stringify({
      records: [{ id: 'recSECRETAAAAAAAA', createdTime: '2026-01-01T00:00:00.000Z', fields: { 'Group Name': 'Kili_10_01_27', Email: 'x@y.co' } }],
      offset: 'itrNEXT',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe('Customers on the public proxy', () => {
  it('a formula never reaches Airtable', async () => {
    await get('Customers', { filterByFormula: 'LEFT({Passport Number},1)="3"', 'fields[]': 'Group Name' });
    expect(sentTo()).not.toContain('filterByFormula');
    expect(sentTo()).not.toContain('Passport');
  });
  it('a sort, which also reads a column, never reaches Airtable', async () => {
    await get('Customers', { 'sort[0][field]': 'Passport Number', 'sort[0][direction]': 'asc' });
    expect(sentTo()).not.toContain('sort');
  });
  it('a view never reaches Airtable', async () => {
    await get('Customers', { view: 'Grid view' });
    expect(sentTo()).not.toContain('view=');
  });
  it('answers without record ids or dates', async () => {
    const r = await get('Customers', { 'fields[]': 'Group Name' });
    expect(r.data.records).toEqual([{ fields: { 'Group Name': 'Kili_10_01_27' } }]);
    expect(JSON.stringify(r.data)).not.toContain('recSECRET');
  });
  it('still pages, which is how the seat count works', async () => {
    const r = await get('Customers', { 'fields[]': 'Group Name', offset: 'itrPREV', pageSize: '100' });
    expect(sentTo()).toContain('offset=itrPREV');
    expect(sentTo()).toContain('pageSize=100');
    expect(r.data.offset).toBe('itrNEXT');
  });
  it('one record by id is refused', async () => {
    expect((await get('Customers', {}, 'recAAAAAAAAAAAAAA')).status).toBe(403);
    expect(upstream).toHaveLength(0);
  });
});

describe('the other tables', () => {
  it('no formula on any table', async () => {
    await get('Groups', { filterByFormula: '{Capacity}>1' });
    expect(sentTo()).not.toContain('filterByFormula');
  });
  it('sort works on a field the page may read, and only there', async () => {
    await get('Groups', { 'sort[0][field]': 'Departure', 'sort[0][direction]': 'asc' });
    expect(sentTo()).toContain('sort[0][field]=Departure');
    upstream.length = 0;
    await get('Groups', { 'sort[0][field]': 'Flight Agent Email', 'sort[0][direction]': 'up' });
    expect(sentTo()).not.toContain('sort');
  });
  it('AppContent is not served at all: it holds the server\'s own notes', async () => {
    expect((await get('AppContent', { 'fields[]': 'Value' })).status).toBe(403);
    expect(upstream).toHaveLength(0);
  });
  it('a public table keeps its ids', async () => {
    const r = await get('Reviews');
    expect(r.data.records[0].id).toBe('recSECRETAAAAAAAA');
  });
});
