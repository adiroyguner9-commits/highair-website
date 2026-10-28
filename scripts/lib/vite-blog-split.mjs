/**
 * Vite plugin: the blog's posts, split for the browser.
 *
 * src/data/blogData.js holds every post with its full text in Hebrew and
 * English, 1.24MB of source (307KB compressed). The homepage's blog preview,
 * the /blog list and every post page imported all of it, so a phone opening
 * the homepage downloaded and parsed every article to show three titles
 * (measured 28 Oct 2026). The file stays the one place posts are written;
 * this plugin serves it to the app in two parts:
 *
 *   virtual:blog-index           POSTS without their text (content, contentEn),
 *                                CATEGORIES, CATEGORIES_EN, isNewsPost, and
 *                                CONTENT: slug -> { he, en } loaders.
 *   virtual:blog-content/<slug>.<he|en>
 *                                one post's text in one language (en falls
 *                                back to the Hebrew text, as BlogPost did),
 *                                each its own small chunk.
 *
 * Node scripts (page shells, sitemap, image tools) and the tests keep
 * importing blogData.js itself. src/data/blogContent.js reads one post's text.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const INDEX = 'virtual:blog-index';
const CONTENT = 'virtual:blog-content/';

export default function blogSplit({ root = process.cwd() } = {}) {
  const file = path.resolve(root, 'src/data/blogData.js');
  /* Imported fresh whenever the file changes, so the dev server follows edits. */
  const data = () => import(`${pathToFileURL(file).href}?t=${fs.statSync(file).mtimeMs}`);
  return {
    name: 'blog-split',
    resolveId(id) {
      if (id === INDEX || id.startsWith(CONTENT)) return '\0' + id;
      return null;
    },
    async load(id) {
      if (!id.startsWith('\0virtual:blog-')) return null;
      this.addWatchFile(file);
      const { POSTS, isNewsPost } = await data();
      if (id === '\0' + INDEX) {
        const index = POSTS.map(({ content, contentEn, ...meta }) => meta);
        const loaders = POSTS.map(p => {
          const at = lang => JSON.stringify(`${CONTENT}${p.slug}.${lang}`);
          return `  ${JSON.stringify(p.slug)}: { he: () => import(${at('he')}), en: () => import(${at('en')}) },`;
        });
        return [
          `export const POSTS = ${JSON.stringify(index)};`,
          'export const CATEGORIES    = [...new Set(POSTS.map(p => p.category))];',
          'export const CATEGORIES_EN = [...new Set(POSTS.map(p => p.categoryEn || p.category))];',
          `export const isNewsPost = ${isNewsPost.toString()};`,
          `export const CONTENT = {\n${loaders.join('\n')}\n};`,
        ].join('\n');
      }
      const [, slug, lang] = id.slice(1 + CONTENT.length).match(/^(.+)\.(he|en)$/) || [];
      const post = POSTS.find(p => p.slug === slug);
      if (!post) this.error(`blog-split: no post "${slug}" in src/data/blogData.js`);
      return `export default ${JSON.stringify((lang === 'en' && post.contentEn) || post.content || [])};`;
    },
  };
}
