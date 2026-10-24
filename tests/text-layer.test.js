/* What a reader without JavaScript gets on each page (scripts/lib/text-layer.mjs):
   GPTBot, ClaudeBot and PerplexityBot read 6 words of the Kilimanjaro page before
   this (24 Oct 2026). The text comes from the same data the React page renders. */
import { describe, it, expect } from 'vitest';
import { EXPS } from '../src/data/mockData.js';
import { POSTS } from '../src/data/blogData.js';
import { FAQ_BY_SLUG } from '../src/data/faqData.js';
import { wrapText, expeditionText, blogText, listingText, blogListText, homeText, esc } from '../scripts/lib/text-layer.mjs';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

/* The static pages' headings are copied into the shell generator (the React
   pages read them from JSX or i18n.js, which cannot run in the build script).
   If a page's heading changes, the shell must change with it. */
describe('static page headings match the pages', () => {
  const shells = readFileSync(resolve(__dirname, '../scripts/generate-html-shells.mjs'), 'utf8');
  const src = f => readFileSync(resolve(__dirname, '..', f), 'utf8');
  const pairs = [
    ['src/components/web_v2/AboutUs.jsx',     ['הסיפור שלנו', 'מי אנחנו ולמה אנחנו עושים את זה?']],
    ['src/i18n.js',                            ['הבלוג של HighAir', 'מאמרים, טיפים וסיפורים מעולם הטרקים וטיפוס ההרים', 'התכנית השנתית', 'כל הטיולים שלנו - מהתאריך הקרוב ועד סוף העונה']],
    ['src/components/web_v2/ContactPage.jsx', ['דברו איתנו', 'בין אם אתם מתכננים את הפסגה הראשונה שלכם ובין אם העשירית, אנחנו כאן לכל שאלה, גדולה כקטנה.']],
    ['src/components/web_v2/Shop.jsx',        ['החנות שלנו', 'ציוד מוכח בשטח. לכל טרק ולכל מסע.']],
  ];
  it('every copied heading exists in its page and in the shell generator', () => {
    for (const [file, strings] of pairs) for (const s of strings) {
      expect(src(file), `${file}: ${s}`).toContain(s);
      expect(shells, `generator: ${s}`).toContain(`'${s}'`);
    }
  });
  it('the blog index lists every post', () => {
    const html = blogListText({ h1: 'h', sub: 's', posts: [{ slug: 'a', title: 'A', excerpt: 'x' }, { slug: 'b', title: 'B' }] });
    expect(html).toContain('<h1>h</h1>');
    expect(html).toContain('<a href="/blog/a">A</a>: x');
    expect(html).toContain('<a href="/blog/b">B</a></li>');
  });
});
