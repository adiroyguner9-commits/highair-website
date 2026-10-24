/* What a reader without JavaScript gets on each page (scripts/lib/text-layer.mjs):
   GPTBot, ClaudeBot and PerplexityBot read 6 words of the Kilimanjaro page before
   this (24 Oct 2026). The text comes from the same data the React page renders. */
import { describe, it, expect } from 'vitest';
import { EXPS } from '../src/data/mockData.js';
import { POSTS } from '../src/data/blogData.js';
import { FAQ_BY_SLUG } from '../src/data/faqData.js';
import { wrapText, expeditionText, blogText, listingText, homeText, esc } from '../scripts/lib/text-layer.mjs';

const words = html => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const kili = EXPS.find(e => e.slug === 'kilimanjaro');

describe('text layer', () => {
  it('a trip page carries its title, facts, every itinerary day and its FAQ', () => {
    const html = expeditionText(kili, FAQ_BY_SLUG.kilimanjaro.he);
    expect(html).toContain(`<h1>${esc(kili.nameHe)}</h1>`);
    expect(html).toContain(esc(kili.elev));
    for (const d of kili.itinerary) expect(html).toContain(esc(d.title));
    for (const f of FAQ_BY_SLUG.kilimanjaro.he) expect(html).toContain(esc(f.q));
    expect(words(html)).toBeGreaterThan(800);
  });
  it('every live trip page has real text', () => {
    for (const e of EXPS.filter(x => x.slug && !x.teaser)) expect(words(expeditionText(e, [])), e.slug).toBeGreaterThan(150);
  });
  it('a blog post carries its whole body', () => {
    const post = POSTS[0];
    const html = blogText(post);
    expect(html).toContain(`<h1>${esc(post.title)}</h1>`);
    const firstText = post.content.find(b => b.type === 'text');
    expect(html).toContain(esc(firstText.value));
  });
  it('listing and home pages link every trip they list', () => {
    const list = EXPS.filter(e => e.slug && /trek/i.test(e.type || ''));
    const html = listingText({ h1: 'טרקים', sub: 'x', exps: list });
    for (const e of list) expect(html).toContain(`href="/expedition/${e.slug}"`);
    expect(homeText({ description: 'd', exps: EXPS.filter(e => e.slug), posts: POSTS })).toContain(`href="/blog/${POSTS[0].slug}"`);
  });
  it('is escaped, hidden without display:none, and takes no space', () => {
    expect(expeditionText({ nameHe: '<script>x</script>', slug: 's' })).not.toContain('<script>');
    const w = wrapText('<p>x</p>');
    expect(w).toContain('position:absolute');
    expect(w).toContain('clip:rect(0,0,0,0)');
    expect(w).not.toMatch(/display:\s*none|aria-hidden|\shidden[\s>]/);
  });
});
