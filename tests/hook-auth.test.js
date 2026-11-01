/* The endpoints that message a lead refuse a direct call. */
import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.PUSH_HOOK_SECRET = 'shared-secret';
process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';

const call = async (file, headers = {}) => {
  const { default: handler } = await import(`../api/${file}.js`);
  let status = 200;
  const res = { status(s) { status = s; return this; }, json() { return this; }, end() { return this; }, setHeader() { return this; } };
  await handler({ method: 'POST', headers: { 'x-vercel-forwarded-for': '10.2.0.1', ...headers }, socket: {}, body: { leadId: 'rec1', phone: '0500000000', date: '2026-11-10', time: '11:00' } }, res);
  return status;
};

describe('hook-only endpoints', () => {
  beforeEach(() => { vi.stubGlobal('fetch', vi.fn(async () => new Response('{"records":[]}', { status: 200 }))); });
  for (const file of ['send-followup', 'notify-deposit', 'notify-no-answer', 'notify-reschedule']) {
    it(`${file} refuses a call without the key and never reads a lead`, async () => {
      expect(await call(file)).toBe(401);
      expect(await call(file, { 'x-hook-key': 'wrong-secret!' })).toBe(401);
      expect(fetch).not.toHaveBeenCalled();
    });
    it(`${file} goes on with the key`, async () => {
      expect(await call(file, { 'x-hook-key': 'shared-secret' })).not.toBe(401);
    });
  }
});
