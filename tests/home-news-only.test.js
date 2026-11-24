/* The homepage magazine strip shows news only; the travel diaries stay in the magazine
   (owner, 24 Nov 2026: "שבדף הבית יהיה רק כתבות של חדשות, יומן מסע וזה שייכנסו לראות במגזין"). */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { POSTS } from '../src/data/blogData.js';

const src = readFileSync(new URL('../src/components/web_v2/BlogPreview.jsx', import.meta.url), 'utf8');
const homePicks = list => list.filter(p => p.category === 'חדשות' && !p.ownText).slice(0, 3);

describe('the homepage shows news, not diaries', () => {
  it('the filter leaves out a page with its own text (a diary)', () => {
    expect(src).toContain("p.category === 'חדשות' && !p.ownText && postInLang(p, blogLang(i18n.language))");
  });
  it('the diaries are not among the three, and the three are news', () => {
    const picks = homePicks(POSTS);
    expect(picks).toHaveLength(3);
    for (const p of picks) { expect(p.category).toBe('חדשות'); expect(p.ownText).toBeFalsy(); }
    expect(picks.map(p => p.slug)).not.toContain('everest-base-camp-gokyo-diary');
    expect(picks.map(p => p.slug)).not.toContain('peaks-of-the-balkans-diary');
  });
});
