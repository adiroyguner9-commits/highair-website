/* While the Israel treks are hidden (ISRAEL_TREKS_LIVE false), /israel sends
   Google's visitors to the home page with a temporary redirect instead of a
   404 (owner, 8 Nov 2026). The day the treks come back, the redirect must go,
   or it would hide the page itself. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { ISRAEL_TREKS_LIVE } from '../src/data/israelFlag.js';

const redirects = JSON.parse(readFileSync('vercel.json', 'utf8')).redirects || [];
const israel = redirects.find(r => r.source === '/israel');

describe('/israel while the Israel treks are hidden', () => {
  it(ISRAEL_TREKS_LIVE ? 'has no redirect once the treks are live' : 'redirects to the home page, temporarily', () => {
    if (ISRAEL_TREKS_LIVE) expect(israel).toBeUndefined();
    else expect(israel).toEqual({ source: '/israel', destination: '/', permanent: false });
  });
});
