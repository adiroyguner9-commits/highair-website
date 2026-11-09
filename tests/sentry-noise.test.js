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
});
