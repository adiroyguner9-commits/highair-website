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
 *
 * The foreign sites (6 Nov 2026): src/data/blog-intl/<en|de|es>/<slug>.json
 * holds a post written for an international reader ({ title, excerpt,
 * category, content }). blogData.js's English was written for Israelis
 * (flights from Tel Aviv, visas for Israeli citizens), so a file here wins over
 * contentEn on en., and German/Spanish exist only where a file does. The index
 * gets titleDe/excerptDe/… and `langs`, the languages a post is published in.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const INDEX = 'virtual:blog-index';
const CONTENT = 'virtual:blog-content/';

const INTL_LANGS = ['en', 'de', 'es'];
const SUFFIX = { en: 'En', de: 'De', es: 'Es' };

/** The international versions on disk: { en: { slug: post }, de: …, es: … }. */
export function readIntl(root = process.cwd()) {
  const out = {};
  for (const l of INTL_LANGS) {
    out[l] = {};
    const dir = path.resolve(root, 'src/data/blog-intl', l);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) {
      out[l][f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    }
  }
  return out;
}

/* Posts about Israel stay on the Hebrew site only (owner, 6 Nov 2026). */
export const HEBREW_ONLY_POSTS = new Set(['sinai-high-mountain-trek-guide', 'tomer-bassan-mera-peak', 'elbrus-climbing-guide']);

/** Which languages a post is published in. */
export function postLangs(slug, intl) {
  if (HEBREW_ONLY_POSTS.has(slug)) return ['he'];
  return ['he', 'en', ...['de', 'es'].filter(l => intl[l]?.[slug])];
}

export default function blogSplit({ root = process.cwd() } = {}) {
  const file = path.resolve(root, 'src/data/blogData.js');
  const intlDir = path.resolve(root, 'src/data/blog-intl');
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
      if (fs.existsSync(intlDir)) this.addWatchFile(intlDir);
      const { POSTS, isNewsPost } = await data();
      const intl = readIntl(root);
      if (id === '\0' + INDEX) {
        const index = POSTS.map(({ content, contentEn, ...meta }) => {
          const out = { ...meta, langs: postLangs(meta.slug, intl) };
          for (const l of INTL_LANGS) {
            const t = intl[l][meta.slug];
            if (!t) continue;
            for (const k of ['title', 'excerpt', 'category', 'seoTitle', 'seoDescription']) if (t[k]) out[k + SUFFIX[l]] = t[k];
          }
          return out;
        });
        const loaders = POSTS.map(p => {
          const at = lang => JSON.stringify(`${CONTENT}${p.slug}.${lang}`);
          const langs = ['he', 'en', ...['de', 'es'].filter(l => intl[l][p.slug])];
          return `  ${JSON.stringify(p.slug)}: { ${langs.map(l => `${l}: () => import(${at(l)})`).join(', ')} },`;
        });
        return [
          `export const POSTS = ${JSON.stringify(index)};`,
          'export const CATEGORIES    = [...new Set(POSTS.map(p => p.category))];',
          'export const CATEGORIES_EN = [...new Set(POSTS.map(p => p.categoryEn || p.category))];',
          `export const isNewsPost = ${isNewsPost.toString()};`,
          `export const CONTENT = {\n${loaders.join('\n')}\n};`,
        ].join('\n');
      }
      const [, slug, lang] = id.slice(1 + CONTENT.length).match(/^(.+)\.(he|en|de|es)$/) || [];
      const post = POSTS.find(p => p.slug === slug);
      if (!post) this.error(`blog-split: no post "${slug}" in src/data/blogData.js`);
      const own = lang !== 'he' && intl[lang]?.[slug]?.content;
      return `export default ${JSON.stringify(own || (lang !== 'he' && post.contentEn) || post.content || [])};`;
    },
  };
}
