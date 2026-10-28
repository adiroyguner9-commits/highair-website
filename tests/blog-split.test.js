/* The app reads the blog in two parts (scripts/lib/vite-blog-split.mjs, 28 Oct
   2026): an index without the articles' text, and each post's text in each
   language as its own chunk. Before, the homepage downloaded every article
   (307KB compressed) to show three cards. */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import blogSplit from '../scripts/lib/vite-blog-split.mjs';
import { POSTS } from '../src/data/blogData.js';

const root = resolve(__dirname, '..');
const plugin = blogSplit({ root });
const ctx = { addWatchFile() {}, error(m) { throw new Error(m); } };
const load = id => plugin.load.call(ctx, plugin.resolveId(id));
const evalModule = src => import(`data:text/javascript;base64,${Buffer.from(src.replace(/import\(/g, '(() => null)(')).toString('base64')}`);

const files = dir => readdirSync(dir).flatMap(f => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? files(p) : [p];
});

describe('blog split', () => {
  it('the index has every post, without its text', async () => {
    const src = await load('virtual:blog-index');
    const index = await evalModule(src);
    expect(index.POSTS.map(p => p.slug)).toEqual(POSTS.map(p => p.slug));
    expect(index.POSTS.some(p => 'content' in p || 'contentEn' in p)).toBe(false);
    expect(src.length).toBeLessThan(60 * 1024);
    expect(Object.keys(index.CONTENT)).toEqual(POSTS.map(p => p.slug));
    expect(index.isNewsPost({ category: 'חדשות' })).toBe(true);
    expect(index.isNewsPost({ category: 'מדריכים', categoryEn: 'Guides' })).toBe(false);
  });

  it('each post\'s text, in each language, is exactly the one in blogData.js', async () => {
    for (const p of POSTS) {
      const he = (await evalModule(await load(`virtual:blog-content/${p.slug}.he`))).default;
      const en = (await evalModule(await load(`virtual:blog-content/${p.slug}.en`))).default;
      expect(he, p.slug).toEqual(p.content);
      expect(en, p.slug).toEqual(p.contentEn || p.content);
    }
  });

  it('no page in the app imports blogData.js itself', () => {
    const offenders = files(join(root, 'src')).filter(f => /\.(jsx?|tsx?)$/.test(f))
      .filter(f => /from ['"][^'"]*blogData\.js['"]/.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('the post page waits for its text, and links open posts as transitions', () => {
    const post = readFileSync(join(root, 'src/components/web_v2/BlogPost.jsx'), 'utf8');
    expect(post).toContain("readPostContent(post.slug, isEn ? 'en' : 'he')");
    expect(post).toContain("openPost(navigate, p.slug, isEn ? 'en' : 'he')");
    for (const f of ['Blog.jsx', 'BlogPreview.jsx']) {
      expect(readFileSync(join(root, 'src/components/web_v2', f), 'utf8'), f).toContain("openPost(navigate, post.slug, isEn ? 'en' : 'he')");
    }
    expect(readFileSync(join(root, 'vite.config.js'), 'utf8')).toContain('plugins: [react(), blogSplit()]');
  });
});
