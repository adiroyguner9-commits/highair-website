/* Sentry triage, 9 Nov 2026: what the website reports and what it leaves out.
   A stale chunk the reload heals is the deploy working, and in-app browsers and
   third-party tags throw errors that are not ours. A chunk the reload cannot
   heal, and every error in our own code, still reports. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { isChunkError, shouldReport } from '../src/components/ErrorBoundary.jsx';

const stale = new TypeError('Failed to fetch dynamically imported module: https://www.highair-expeditions.com/assets/base-BZX3k7YU.js');

describe('stale chunks after a deploy', () => {
  it('are recognised in every browser wording', () => {
    expect(isChunkError(stale)).toBe(true);
    expect(isChunkError(new TypeError('Importing a module script failed.'))).toBe(true);
    /* Firefox's wording, which the site did not know: a stale chunk there got
       the error screen instead of the healing reload (HIGHAIR-WEBSITE-17). */
    expect(isChunkError(new TypeError('error loading dynamically imported module: https://en.highair-expeditions.com/assets/AboutUs-ouAtkb2b.js'))).toBe(true);
    expect(isChunkError(new Error('Unable to preload CSS for /assets/x.css'))).toBe(true);
    expect(isChunkError(new TypeError("Cannot read properties of undefined (reading 'map')"))).toBe(false);
  });
  it('are not reported while the reload heals them, and are when it cannot', () => {
    expect(shouldReport(stale, true)).toBe(false);
    expect(shouldReport(stale, false)).toBe(true);
  });
  it('a bug of ours always reports', () => {
    expect(shouldReport(new TypeError("Cannot read properties of undefined (reading 'map')"), true)).toBe(true);
  });
});

describe('the Sentry filters in main.jsx', () => {
  const src = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');
  it('leave out the in-app browser and injected-script noise by its exact words', () => {
    for (const s of ['_META.IABInnerFrame', '[object HTMLScriptElement]', '[object XMLHttpRequest]', "Unexpected token 'else'", 'Java object is gone']) {
      expect(src).toContain(s);
    }
  });
  it('drop errors thrown inside third-party tags, and never a generic network failure', () => {
    expect(src).toMatch(/denyUrls: \[.*userway\\\.org.*doubleclick\\\.net/);
    expect(src).not.toMatch(/ignoreErrors:[^\]]*'Failed to fetch'/s);
  });
  /* 16 Nov 2026: Microsoft's link scanner (HIGHAIR-WEBSITE-1A) and Vercel's
     analytics script reaching a browser still compressed (HIGHAIR-WEBSITE-1B). */
  it("leave out Microsoft's link scanner and Vercel's analytics script, and nothing of ours", () => {
    expect(src).toContain("'Object Not Found Matching Id'");
    const line = src.split('\n').find(l => l.includes('denyUrls: ['));
    const deny = eval(line.trim().replace(/^denyUrls:\s*/, '').replace(/,\s*$/, ''));
    const denied = u => deny.some(re => re.test(u));
    expect(denied('https://en.highair-expeditions.com/_vercel/insights/script.js')).toBe(true);
    expect(denied('https://www.highair-expeditions.com/_vercel/speed-insights/script.js')).toBe(true);
    expect(denied('https://www.highair-expeditions.com/assets/index-ZLuPSN8F.js')).toBe(false);
    expect(denied('https://www.highair-expeditions.com/expedition/olympus')).toBe(false);
  });
});
