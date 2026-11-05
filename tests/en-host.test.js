/* The English site on the en. host (5 Nov 2026, going international).
   middleware.js sends en. page requests to the English shells that
   generate-html-shells.mjs writes to dist/en/, and the en. host is no longer
   kept out of search. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { englishShellPath, config } from '../middleware.js';

describe('en. host routing', () => {
  it('sends the en. homepage and trip pages to their English shells', () => {
    expect(englishShellPath('en.highair-expeditions.com', '/')).toBe('/en/index.html');
    expect(englishShellPath('en.highair-expeditions.com', '/expedition/kilimanjaro-kosher')).toBe('/en/expedition/kilimanjaro-kosher/index.html');
    expect(englishShellPath('en.highair-expeditions.com', '/expedition/kilimanjaro/')).toBe('/en/expedition/kilimanjaro/index.html');
  });

  it('leaves www, assets, api and other paths alone', () => {
    expect(englishShellPath('www.highair-expeditions.com', '/')).toBeNull();
    expect(englishShellPath('www.highair-expeditions.com', '/expedition/kilimanjaro')).toBeNull();
    for (const p of ['/assets/index-abc.js', '/api/submit-lead', '/book/kilimanjaro', '/expedition/../api', '/expedition/a/b']) {
      expect(englishShellPath('en.highair-expeditions.com', p), p).toBeNull();
    }
  });

  it('only runs on page paths', () => {
    expect(config.matcher).toEqual(['/', '/expedition/:slug']);
  });

  it('the en. host is no longer marked noindex', () => {
    const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
    const enRule = vercel.headers.find(h => (h.has || []).some(c => c.type === 'host' && /^en\./.test(c.value)));
    expect(enRule).toBeUndefined();
    expect(readFileSync('src/website/usePageMeta.js', 'utf8')).not.toMatch(/isEnHost \? 'noindex/);
  });
});
