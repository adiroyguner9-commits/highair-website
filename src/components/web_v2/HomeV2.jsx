/**
 * HomeV2.jsx - Dream Site root (src/components/web_v2/)
 * Active route: /test
 */

import { lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation }  from 'react-i18next';
import { useInView }      from '../../website/useInView.js';
import { usePageMeta }    from '../../website/usePageMeta.js';
import Header             from './Header.jsx';
import HeroSection        from './HeroSection.jsx';
import StatsSection       from './StatsSection.jsx';
import PartnersSection    from './PartnersSection.jsx';
import ExpeditionExplorer from './ExpeditionExplorer.jsx';

/* ── Lazy-loaded (below the fold) ── */
const IsraelTrips    = lazy(() => import('./IsraelTrips.jsx'));
const ImpactSection  = lazy(() => import('./ImpactSection.jsx'));
const ReviewsSection = lazy(() => import('./ReviewsSection.jsx'));
const GallerySection = lazy(() => import('./GallerySection.jsx'));
const PressSection   = lazy(() => import('./PressSection.jsx'));
const FAQSection     = lazy(() => import('./FAQSection.jsx'));
const BlogPreview    = lazy(() => import('./BlogPreview.jsx'));
const CTASection     = lazy(() => import('./CTASection.jsx'));
const SiteFooter     = lazy(() => import('./SiteFooter.jsx'));

/* ── Scroll progress bar ── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{
      position:   'fixed',
      top:        0,
      left:       0,
      zIndex:     9999,
      height:     '3px',
      width:      `${progress}%`,
      background: 'linear-gradient(90deg, #6D28D9, #A78BFA)',
      transition: 'width 0.08s linear',
      pointerEvents: 'none',
    }} />
  );
}

/* ── Divider between sections ── */
function Divider() {
  return (
    <div style={{
      height:     '1px',
      background: '#ECEAF8',
      margin:     '0 5%',
    }} />
  );
}

/* ── Fade-in wrapper (scroll-triggered) ── */
function FadeIn({ children, delay = 0 }) {
  const [ref, inView] = useInView(0.08);
  return (
    <div
      ref={ref}
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: inView ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

/* ── Organization JSON-LD schema ── */
const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type':    'Organization',
  name:       'HighAir Expeditions',
  url:        'https://www.highair-expeditions.com',
  logo:       'https://www.highair-expeditions.com/logo.png',
  contactPoint: {
    '@type':             'ContactPoint',
    telephone:           '+972-55-563-6975',
    contactType:         'customer service',
    availableLanguage:   'Hebrew',
  },
  sameAs: [
    'https://www.facebook.com/highair.expeditions',
    'https://www.instagram.com/highair_expeditions/',
    'https://www.youtube.com/@HighAirExpeditions',
    'https://www.tiktok.com/@highair_expeditions',
  ],
};

/* ── Page ── */
export default function HomeV2() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';

  /* Inject Organization JSON-LD into <head> */
  useEffect(() => {
    const existing = document.getElementById('org-jsonld');
    if (existing) return; // already injected (StrictMode double-invoke guard)

    const script = document.createElement('script');
    script.id        = 'org-jsonld';
    script.type      = 'application/ld+json';
    script.textContent = JSON.stringify(ORG_SCHEMA);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('org-jsonld');
      if (el) el.remove();
    };
  }, []);

  usePageMeta({
    title:         isRtl
      ? 'HighAir Expeditions | טרקים ומשלחות טיפוס הרים בארץ ובעולם'
      : 'Trekking and Climbing Expeditions | HighAir Expeditions',
    description:   isRtl
      ? 'HighAir Expeditions מארגנת טרקים ומשלחות טיפוס הרים בארץ ובעולם. קילימנג׳רו, אוורסט, אלברוס, אנאפורנה ועוד — עם תרומה לחולי סרטן בכל מסע.'
      : 'Guided trekking and climbing expeditions worldwide. Kilimanjaro, Everest, Elbrus, Aconcagua & more. Expert guides, 94% success rate. Every expedition supports cancer patients.',
    canonicalPath: '/',
  });

  return (
    <div style={{ position: 'relative', background: '#FFFFFF' }}>

      {/* ── Scroll progress bar ── */}
      <ScrollProgress />

      {/* ── Fixed navbar ── */}
      <Header />

      {/* ── Page sections ── */}
      <main id="main-content" style={{ paddingTop: '80px' }}>

        {/* Hero + Stats: above the fold, no FadeIn needed */}
        <HeroSection />
        <StatsSection />
        <PartnersSection />

        <Suspense fallback={null}>

          <Divider />
          <FadeIn><ExpeditionExplorer type="climbs" /></FadeIn>

          <Divider />
          <FadeIn><ExpeditionExplorer type="treks" /></FadeIn>

          <Divider />
          <FadeIn><IsraelTrips /></FadeIn>

          <Divider />
          <FadeIn><ImpactSection /></FadeIn>

          <Divider />
          <FadeIn><ReviewsSection /></FadeIn>

          <Divider />
          <GallerySection />

          <Divider />
          <FadeIn><PressSection /></FadeIn>

          <Divider />
          <FadeIn><FAQSection /></FadeIn>

          <FadeIn><BlogPreview /></FadeIn>

          <FadeIn><CTASection /></FadeIn>
          <SiteFooter />

        </Suspense>
      </main>

    </div>
  );
}
