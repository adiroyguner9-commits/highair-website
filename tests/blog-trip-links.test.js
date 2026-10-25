/* A post may only link a trip page that is public (owner, 25 Oct 2026: the
   Scardus guide linked /expedition/scardus while the trip was still a "בקרוב"
   teaser, so the link 404'd). Public = in EXPS, not a teaser, not live:false. */
import { describe, it, expect } from 'vitest';
import { POSTS } from '../src/data/blogData.js';
import { EXPS } from '../src/data/mockData.js';

const publicSlugs = new Set(EXPS.filter(e => !e.teaser && e.live !== false).map(e => e.slug));
const tripLinks = p => [...JSON.stringify([p.content, p.contentEn]).matchAll(/\/expedition\/([a-z0-9-]+)/g)].map(m => m[1]);

describe('blog posts link only public trip pages', () => {
  it('every /expedition/<slug> in a post is a public trip', () => {
    const bad = POSTS.flatMap(p => tripLinks(p).filter(s => !publicSlugs.has(s)).map(s => `${p.slug} -> /expedition/${s}`));
    expect(bad).toEqual([]);
  });
});
