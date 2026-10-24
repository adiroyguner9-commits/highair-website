/* Fonts load as woff2 (24 Oct 2026, 701KB -> 231KB). index.html preloads the
   first-screen faces; a preload whose URL differs from the @font-face src
   downloads the font twice, and a preloaded file that does not exist is a 404
   on every page. */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

const css = readFileSync('src/global.css', 'utf8');
const html = readFileSync('index.html', 'utf8');
const preloaded = [...html.matchAll(/'([\w-]+\.woff2)'/g)].map(m => m[1]);

describe('fonts', () => {
  it('every @font-face serves woff2 first, and the file exists', () => {
    const faces = css.split('@font-face').slice(1);
    expect(faces.length).toBe(5);
    for (const f of faces) {
      const m = f.match(/src:\s*url\('\/([\w-]+\.woff2)'\) format\('woff2'\)/);
      expect(m, f.slice(0, 80)).toBeTruthy();
      expect(existsSync(`public/${m[1]}`), m[1]).toBe(true);
    }
  });
  it('every preloaded font is a woff2 that a @font-face uses', () => {
    expect(preloaded.length).toBeGreaterThanOrEqual(4);
    expect(html).toContain("l.type = 'font/woff2'");
    for (const f of preloaded) expect(css, f).toContain(`url('/${f}')`);
  });
});
