/* Guides are signed by a person (owner, 24 Oct 2026), and only news shows a
   date. An authorId that names no author would show no byline and emit no
   Person; a guide with a visible date would look dated. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { POSTS, isNewsPost } from '../src/data/blogData.js';
import { AUTHORS, authorOf } from '../src/data/authors.js';
import { blogText, authorText } from '../scripts/lib/text-layer.mjs';

describe('authors', () => {
  it('every authorId names a real author with a bio and a photo that exists', () => {
    for (const p of POSTS.filter(x => x.authorId)) {
      const a = authorOf(p);
      expect(a, p.slug).toBeTruthy();
      expect(a.bioHe.length, a.id).toBeGreaterThan(80);
      expect(() => readFileSync(`public${a.photo}`), a.photo).not.toThrow();
    }
  });
  it('guides are signed by Chen; news stays the company\'s', () => {
    for (const p of POSTS) {
      if (isNewsPost(p)) expect(p.authorId, p.slug).toBeUndefined();
      else expect(p.authorId, p.slug).toBe('chen-shaked');
    }
  });
  it('the author page text lists the author\'s guides', () => {
    const a = AUTHORS['chen-shaked'];
    const html = authorText({ author: a, posts: POSTS.filter(p => p.authorId === a.id) });
    expect(html.match(/<h1>/g)).toHaveLength(1);
    expect(html).toContain('/blog/kosher-kilimanjaro-shabbat-guide');
  });
});

describe('dates on news only', () => {
  it('a guide\'s text carries its author and no date; news carries its date', () => {
    const guide = POSTS.find(p => !isNewsPost(p)), news = POSTS.find(isNewsPost);
    expect(blogText(guide)).toContain(guide.author);
    expect(blogText(guide)).not.toContain(guide.dateHe);
    expect(blogText(news)).toContain(news.dateHe);
  });
  it('every place that shows a post date checks isNewsPost', () => {
    for (const f of ['Blog.jsx', 'BlogPost.jsx', 'BlogPreview.jsx']) {
      expect(readFileSync(`src/components/web_v2/${f}`, 'utf8'), f).toContain('isNewsPost(post)');
    }
  });
});
