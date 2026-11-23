/**
 * TrekTrainingGuide.jsx - /blog/trek-training-guide
 *
 * The owner's guide "אימונים לטרק ולטיפוס הרים: המדריך המלא להכנה גופנית" (20 Nov 2026) is a page
 * he designed himself: the stairs calculator, the animated exercise demos, the charts and the scroll
 * reveals of his preview, inside the site's own header and footer. The markup and its script are
 * src/website/trekTrainingGuide.js, the styles trekTrainingGuide.css (scoped to .tg).
 *
 * It is also an ordinary post in blogData.js (the magazine card, the sitemap, the static page with
 * the text and the FAQ and article data for search engines). The page is Hebrew: on the English
 * site the same address shows the post's English text through BlogPost, like any other post.
 */
import { lazy, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { POSTS } from 'virtual:blog-index';   // titles and covers only (scripts/lib/vite-blog-split.mjs)
import { blogLang } from '../../data/blogLang.js';
import { usePageMeta } from '../../website/usePageMeta.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { GUIDE_SLUG, MARKUP, initGuide } from '../../website/trekTrainingGuide.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import './trekTrainingGuide.css';

const BlogPost = lazy(() => import('./BlogPost.jsx'));
const BASE = 'https://www.highair-expeditions.com';
/* One object for the life of the app, so a re-render (a breakpoint change) never resets the
   markup the guide's script has filled in. */
const HTML = { __html: MARKUP };

/* A left click with no modifier key, on a link the page can open itself */
const plainClick = e => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;

function Guide() {
  const post = POSTS.find(p => p.slug === GUIDE_SLUG);
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const rootRef = useRef(null);

  /* Article, FAQPage and BreadcrumbList data are in the static page (scripts/generate-html-shells.mjs),
     as for every post (BlogPost.jsx): none at runtime, or Google would see them twice. */
  usePageMeta({
    title:         `${post.seoTitle || post.title} | HighAir Expeditions`,
    description:   post.excerpt,
    canonicalPath: `/blog/${GUIDE_SLUG}`,
    image:         `${BASE}${post.img}`,
    ogType:        'article',
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const stop = initGuide(root);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const toSection = (id, smooth) => {
      const el = id && document.getElementById(id);
      if (!el || !root.contains(el)) return false;
      el.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' });
      return true;
    };

    /* The page's links are plain HTML. The contents row scrolls to its section (smoothly, as the
       preview does) and keeps the address in step without a new history entry; the trip links and
       the button open their page inside the app, like every link on the site. */
    const onClick = e => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || !root.contains(a) || a.target || !plainClick(e)) return;
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        if (toSection(href.slice(1), true)) {
          e.preventDefault();
          window.history.replaceState(window.history.state, '', href);
        }
      } else if (href.startsWith('/')) {
        e.preventDefault();
        navigateRef.current(href);
      }
    };
    root.addEventListener('click', onClick);

    /* Opened with a section in the address (a shared link to the FAQ): go there once the page is drawn */
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const raf = hash ? requestAnimationFrame(() => toSection(hash, false)) : 0;

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener('click', onClick);
      stop();
    };
  }, []);

  return (
    <div style={{ direction: 'rtl', background: '#FFFFFF', minHeight: '100vh' }}>
      <Header />
      <main id="main-content" style={{ paddingTop: isMobile ? '80px' : '124px' }}>
        <div ref={rootRef} dir="rtl" lang="he" dangerouslySetInnerHTML={HTML} />
      </main>
      <SiteFooter />
    </div>
  );
}

export default function TrekTrainingGuide() {
  const { i18n } = useTranslation();
  return blogLang(i18n.language) === 'he' ? <Guide /> : <BlogPost slug={GUIDE_SLUG} />;
}
