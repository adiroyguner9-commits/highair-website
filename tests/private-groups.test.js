/* A private departure (Hidden in Groups) never leaves the public proxy: not as a
   row, not as a price, not by asking for it directly (12 Oct 2026). Israel treks
   are exempt on purpose: a hidden one is sent out as a direct link. */
import { describe, it, expect, beforeEach, vi } from 'vitest';

process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';

const GROUPS = [
  { id: 'recPUB000000000001', fields: { 'Group Name': 'Kili_21_01_27', 'Retail Price': 3900 } },
  { id: 'recPRV000000000001', fields: { 'Group Name': 'Kili_24_01_27', 'Retail Price': 3800, Hidden: true } },
];
let asked;
beforeEach(() => {
  asked = null;
  vi.stubGlobal('fetch', async url => {
    asked = new URL(url);
    /* Airtable returns only the fields asked for, exactly the behaviour the
       first version of this filter tripped over. */
    const want = asked.searchParams.getAll('fields[]');
    const pick = r => ({ ...r, fields: Object.fromEntries(Object.entries(r.fields).filter(([k]) => want.includes(k))) });
    return new Response(JSON.stringify({ records: GROUPS.map(pick) }), { status: 200 });
  });
});

const handler = (await import('../api/at.js')).default;
const get = query => new Promise(res => {
  const out = {};
  const r = { setHeader() {}, status(c) { out.code = c; return r; }, json(b) { out.body = b; res(out); }, end() { res(out); } };
  handler({ method: 'GET', query, headers: { 'x-forwarded-for': `10.0.${Math.floor(Math.random() * 250)}.1` }, socket: { remoteAddress: '10.0.0.1' } }, r);
});

describe('the public Groups endpoint', () => {
  it('drops the private row even when the page did not ask for Hidden', async () => {
    const r = await get({ table: 'Groups', 'fields[]': ['Group Name', 'Retail Price'] });
    expect(r.body.records.map(x => x.fields['Group Name'])).toEqual(['Kili_21_01_27']);
    expect(asked.searchParams.getAll('fields[]')).toContain('Hidden');   // it had to ask Airtable for it
  });
  it('the private price appears nowhere', async () => {
    const r = await get({ table: 'Groups', 'fields[]': ['Group Name', 'Retail Price'] });
    expect(JSON.stringify(r.body)).not.toContain('3800');
  });
  it('does not echo Hidden back to a page that did not ask', async () => {
    const r = await get({ table: 'Groups', 'fields[]': ['Group Name'] });
    expect(r.body.records.every(x => !('Hidden' in x.fields))).toBe(true);
  });
});

describe('IsraelGroups keeps its hidden rows', () => {
  it('a hidden Israel trek is still served (it is sent out as a direct link)', async () => {
    const r = await get({ table: 'IsraelGroups', 'fields[]': ['Group Name', 'Hidden'] });
    expect(r.body.records).toHaveLength(2);
  });
});
