/* blogContent.js: one post's text, loaded on its own (scripts/lib/vite-blog-split.mjs).

   readPostContent(slug, lang) -> the post's blocks once loaded. Until then it
                                  suspends the page (throws the loading promise,
                                  as React.lazy does), so the route's Suspense
                                  fallback, the pre-hero, stays on screen and
                                  the article never paints half-empty.
   preloadPostContent(slug, lang) starts the load without waiting, for a post
                                  the reader is likely to open next.
   openPost(navigate, slug, lang) opens a post, keeping the current page on
                                  screen until its text is in. */
import { startTransition } from 'react';
import { CONTENT } from 'virtual:blog-index';

const cache = new Map();

function entry(slug, lang) {
  const key = `${slug}.${lang}`;
  if (!cache.has(key)) {
    const load = CONTENT[slug]?.[lang === 'en' ? 'en' : 'he'];
    const e = { status: load ? 'pending' : 'done', value: [] };
    if (load) {
      e.promise = load().then(
        m => { e.status = 'done'; e.value = m.default; },
        err => { e.status = 'error'; e.error = err; },   // a stale chunk: ErrorBoundary reloads once
      );
    }
    cache.set(key, e);
  }
  return cache.get(key);
}

export function readPostContent(slug, lang) {
  const e = entry(slug, lang);
  if (e.status === 'done') return e.value;
  if (e.status === 'error') throw e.error;
  throw e.promise;
}

export const preloadPostContent = (slug, lang) => { entry(slug, lang); };

/* Opens a post as a transition: the current page stays on screen while the
   post's text loads, instead of a blank moment between the two pages. */
export function openPost(navigate, slug, lang) {
  preloadPostContent(slug, lang);
  startTransition(() => navigate(`/blog/${slug}`));
}
