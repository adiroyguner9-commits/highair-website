/**
 * HomeV2.jsx - Dream Site root (src/components/web_v2/)
 * Active route: /test
 */

import { lazy, Suspense, useEffect } from 'react';
import { useInView }      from '../../website/useInView.js';
import { usePageMeta }    from '../../website/usePageMeta.js';
import Header             from './Header.jsx';
import HeroSection        from './HeroSection.jsx';
import StatsSection       from './StatsSection.jsx';
import ExpeditionExplorer from './ExpeditionExplorer.jsx';

/* ── Lazy-loaded (below the fold) ── */
const IsraelTrips    = lazy(() => import('./IsraelTrips.jsx'));
const ImpactSection  = lazy(() => import('./ImpactSection.jsx'));
const ReviewsSection = lazy(() => import('./ReviewsSection.jsx'));
const GallerySection = lazy(() => import('./GallerySection.jsx'));
const PressSection   = lazy(() => import('./PressSection.jsx'));
const CTASection     = lazy(() => import('./CTASection.jsx'));
const SiteFooter     = lazy(() => import('./SiteFooter.jsx'));

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
  sameAs: [],
};

/* ── Page ── */
export default function HomeV2() {
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
    title:         'HighAir Expeditions | משלחות טיפוס הרים וטרקים בעולם',
    description:   'HighAir Expeditions — משלחות טיפוס הרים וטרקים בארץ ובעולם. קילימנג׳רו, אוורסט, אנאפורנה, אקונקגואה ועוד — בשילוב תרומה למלחמה בסרטן.',
    canonicalPath: '/',
  });

  return (
    <div style={{ position: 'relative', background: '#FFFFFF' }}>

      {/* ── Fixed navbar ── */}
      <Header />

      {/* ── Floating WhatsApp ── */}

      {/* ── Page sections ── */}
      <div id="main-content" style={{ paddingTop: '80px' }}>

        {/* Hero + Stats: above the fold, no FadeIn needed */}
        <HeroSection />
        <StatsSection />

        <Suspense fallback={null}>

          <Divider />
          <FadeIn><ExpeditionExplorer /></FadeIn>

          <Divider />
          <FadeIn><IsraelTrips /></FadeIn>

          <Divider />
          <FadeIn><ImpactSection /></FadeIn>

          <Divider />
          <FadeIn><ReviewsSection /></FadeIn>

          <Divider />
          <FadeIn><GallerySection /></FadeIn>

          <Divider />
          <FadeIn><PressSection /></FadeIn>

          <FadeIn><CTASection /></FadeIn>
          <SiteFooter />

        </Suspense>
      </div>

    </div>
  );
}
