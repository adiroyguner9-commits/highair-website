/* The magazine cards look the same (owner, 25 Oct 2026): every title is one
   line (at most 32 characters, Hebrew and English) and every description is
   3 lines (135 to 145 Hebrew characters). Only two categories. */
import { describe, it, expect } from 'vitest';
import { POSTS } from '../src/data/blogData.js';

describe('magazine cards are uniform', () => {
  it('titles fit one line', () => {
    expect(POSTS.filter(p => p.title.length > 32).map(p => p.title)).toEqual([]);
    expect(POSTS.filter(p => p.titleEn.length > 32).map(p => p.titleEn)).toEqual([]);
  });
  it('descriptions fill three lines', () => {
    expect(POSTS.filter(p => p.excerpt.length < 135 || p.excerpt.length > 145).map(p => `${p.slug} ${p.excerpt.length}`)).toEqual([]);
  });
  it('two categories only', () => {
    expect([...new Set(POSTS.map(p => p.category))].sort()).toEqual(['חדשות', 'מדריכים']);
    expect([...new Set(POSTS.map(p => p.categoryEn))].sort()).toEqual(['Guides', 'News']);
  });
});
