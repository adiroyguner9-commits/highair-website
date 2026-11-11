/* The blog in each site's language (6 Nov 2026).
   A post's fields per language come from virtual:blog-index: titleEn/titleDe/
   titleEs… (scripts/lib/vite-blog-split.mjs), falling back to English, then
   Hebrew. `langs` lists where the post is published: German and Spanish only
   carry the posts translated for them, and posts about Israel stay Hebrew. */
import { BASE_URLS } from '../website/sites.js';

const SUFFIX = { en: 'En', de: 'De', es: 'Es' };

/** he | en | de | es for an i18n language code. */
export const blogLang = l => (l === 'he' ? 'he' : SUFFIX[l] ? l : 'en');

/** A post's title/excerpt/category/seoTitle… in `lang`. */
export function postField(post, key, lang) {
  if (!post) return '';
  if (lang === 'he') return post[key] || '';
  return post[key + SUFFIX[lang]] || post[key + 'En'] || post[key] || '';
}

/** What the share buttons send: the post's title in the site's language and
    its address on that site. They sent the Hebrew title and the www address
    from every site (audit W21, 12 Nov 2026). */
export function postShare(post, lang) {
  return { title: postField(post, 'title', lang), url: `${BASE_URLS[lang] || BASE_URLS.he}/blog/${post?.slug || ''}` };
}

/** Is this post published on the `lang` site? */
export const postInLang = (post, lang) => (post?.langs || ['he', 'en']).includes(lang);

/** A news post's date as the site shows it: Hebrew as written, else from dateIso. */
export function postDate(post, lang) {
  if (!post) return '';
  if (lang === 'he') return post.dateHe || '';
  if (lang === 'en' || !post.dateIso) return post.dateEn || post.dateHe || '';
  return new Date(`${post.dateIso.slice(0, 10)}T12:00:00Z`).toLocaleDateString(lang === 'de' ? 'de-DE' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
