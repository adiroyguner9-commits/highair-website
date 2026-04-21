/**
 * HomeV2.jsx - Dream Site root (src/components/web_v2/)
 * Active route: /test
 */

import { lazy, Suspense, useState } from 'react';
import { useInView }      from '../../website/useInView.js';
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

/* ── WhatsApp config ── */
const WA_PHONE = '972555636975';
const WA_MSG   = encodeURIComponent('היי! אני מעוניין/ת לשמוע עוד על המשלחות של HighAir 🏔️');

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

/* ── Floating WhatsApp button ── */
function FloatingWA() {
  const [hovered, setHovered] = useState(false);
  const href = `https://wa.me/${WA_PHONE}?text=${WA_MSG}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="פנו אלינו בוואטסאפ"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:        'fixed',
        bottom:          '28px',
        left:            '28px',
        zIndex:          998,
        width:           '58px',
        height:          '58px',
        borderRadius:    '50%',
        background:      hovered ? '#1aab52' : '#25D366',
        boxShadow:       hovered
                           ? '0 8px 32px rgba(37,211,102,0.60)'
                           : '0 4px 20px rgba(37,211,102,0.45)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        transform:       hovered ? 'scale(1.12)' : 'scale(1)',
        transition:      'all 0.22s cubic-bezier(0.22,1,0.36,1)',
        textDecoration:  'none',
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#FFFFFF">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

/* ── Page ── */
export default function HomeV2() {
  return (
    <div style={{ position: 'relative', background: '#FFFFFF' }}>

      {/* ── Fixed navbar ── */}
      <Header />

      {/* ── Floating WhatsApp ── */}
      <FloatingWA />

      {/* ── Page sections ── */}
      <div style={{ paddingTop: '80px' }}>

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
