/* The pre-hero (scripts/generate-html-shells.mjs) is a static copy of each
   page's header bar and hero, painted before any JavaScript runs. It only works
   if it matches the React hero to the pixel, so every size and overlay it uses
   is checked here against the component that draws the real one. If a hero's
   size or overlay changes, change PRE_HERO_CSS / PRE_HERO_BG with it.
   Measured identical at 360, 412, 800 and 1350px wide on 24 Oct 2026. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = p => readFileSync(resolve(__dirname, '..', p), 'utf8');
const shells = read('scripts/generate-html-shells.mjs');
const has = (file, ...needles) => { const src = read(file); for (const n of needles) expect(src, `${file} should contain ${n}`).toContain(n); };

describe('pre-hero matches the real hero', () => {
  it('header bar: 80px, white', () => {
    expect(shells).toContain('#ha-pre .b{position:fixed;top:0;left:0;right:0;height:80px;background:#fff;z-index:10}');
  });

  it('home: 90vh under a 124px spacer (80px on phones), poster under a 72% overlay', () => {
    has('src/components/web_v2/HomeV2.jsx', "paddingTop: isMobile ? '80px' : '124px'");
    has('src/components/web_v2/HeroSection.jsx', "height: '90vh'", "backgroundPosition: 'center'", "background: 'rgba(10,8,24,0.72)'");
    expect(shells).toContain("'#ha-pre .sp{height:124px}'");
    expect(shells).toContain('#ha-pre .home{height:90vh}');
    expect(shells).toContain('{#ha-pre .sp{height:80px}');
    /* a spacer, never a margin: HomeV2 pads <main>, so #root must start at 0 */
    expect(shells).not.toMatch(/\.home\{margin-top/);
    expect(shells).toContain('linear-gradient(rgba(10,8,24,.72),rgba(10,8,24,.72))');
  });

  it('trip page: full screen (65% on phones), same gradient and backdrop', () => {
    has('src/components/web_v2/ExpeditionDetail.jsx',
      "height: isMobile ? '65dvh' : '100dvh'",
      "minHeight: isMobile ? '480px' : '600px'",
      "background: '#0A0818'",
      "background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)'");
    expect(shells).toContain('#ha-pre .trip{height:100dvh;min-height:600px}');
    expect(shells).toContain('#ha-pre .trip{height:65dvh;min-height:480px}');
    expect(shells).toContain('linear-gradient(to bottom,rgba(0,0,0,.35),rgba(0,0,0,.65))');
  });

  it('Treks / Climbs: 440px (340 on phones), same gradient', () => {
    has('src/components/web_v2/WorldExpeditionsPage.jsx',
      "minHeight: isMobile ? '340px' : '440px'",
      "background: 'linear-gradient(to bottom, rgba(10,8,24,0.55), rgba(10,8,24,0.78))'");
    expect(shells).toContain('#ha-pre .list{height:440px}');
    expect(shells).toContain('#ha-pre .list{height:340px}');
  });

  it('blog post: 440px (300 on phones) under 80px, 45% overlay, the post\'s own focus', () => {
    has('src/components/web_v2/BlogPost.jsx',
      "height:     isMobile ? '300px' : '440px'",
      "marginTop:  '80px'",
      "background: 'rgba(0,0,0,0.45)'",
      "${post.imgPosition || 'center'}/cover no-repeat");
    expect(shells).toContain('#ha-pre .blog{margin-top:80px;height:440px}');
    expect(shells).toContain('#ha-pre .blog{height:300px}');
  });

  it('phones break at the same width as useBreakpoint', () => {
    has('src/website/useBreakpoint.js', '(max-width: 767.98px)');
    expect(shells).toContain('@media (max-width:767.98px)');
  });
});

describe('pre-hero lifecycle', () => {
  it('the first Suspense fallback repeats it, only on the page it was painted for', () => {
    has('src/main.jsx',
      "getComputedStyle(bootPre).display !== 'none' ? bootPre.outerHTML : ''",
      'pathname === BOOT_PATH',
      '<Suspense fallback={<BootFallback />}>');
  });

  it('the homepage copy hides itself before the body on every other route', () => {
    expect(shells).toContain('.ha-nopre #ha-pre{display:none}');
    expect(shells).toContain('if(location.pathname!=="/")document.documentElement.classList.add("ha-nopre")');
  });
});
