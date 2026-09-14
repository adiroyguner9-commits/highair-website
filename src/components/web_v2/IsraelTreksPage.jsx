/**
 * IsraelTreksPage.jsx - dedicated landing page for the Israel day treks (/israel)
 *
 * Own <Header/> + <SiteFooter/> (no shared route shell, same as SafariPage).
 * A hero, then the full chronological grid of live Israel treks - reuses the
 * homepage IsraelTrips section in `fullPage` mode (same cards, same Airtable
 * fetch, same month filter), so nothing is duplicated.
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import IsraelTrips from './IsraelTrips.jsx';

export default function IsraelTreksPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';
  const { isMobile } = useBreakpoint();

  /* SEO - same approach as the other standalone pages (SafariPage sets these too) */
  useEffect(() => {
    document.title = isRtl
      ? 'הטרקים שלנו בארץ | HighAir Expeditions'
      : 'Our Treks in Israel | HighAir Expeditions';
    const desc = isRtl
      ? 'כל הטרקים של HighAir בארץ - מסלולים במדבר יהודה, ים המלח והנגב. יום אחד, מדריך מוסמך, וארוחת צהריים כלולה, עם תרומה למאבק במחלת הסרטן. בחרו את הטרק הקרוב שלכם.'
      : "All of HighAir's day treks in Israel - routes across the Judean Desert, Dead Sea and Negev. A certified guide and lunch included, supporting the fight against cancer. Pick your next trek.";
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('name', 'description'); document.head.appendChild(tag); }
    tag.setAttribute('content', desc);
  }, [isRtl]);

  return (
    <div style={{ direction: isRtl ? 'rtl' : 'ltr', background: '#FFFFFF' }}>
      <Header />

      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center',
        minHeight: isMobile ? '340px' : '440px',
        padding: isMobile ? '140px 6% 48px' : '184px 8% 72px',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(/images/gallery/masada/1.webp) center/cover no-repeat' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,8,24,0.55), rgba(10,8,24,0.78))' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px' }}>
          <h1 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(30px,6vw,56px)', fontWeight: 800,
            color: '#FFFFFF', margin: '0 0 18px', letterSpacing: '-0.02em', lineHeight: 1.08,
            textShadow: '0 2px 24px rgba(0,0,0,0.5)',
          }}>
            {isRtl ? 'הטרקים שלנו בארץ' : 'Our Treks in Israel'}
          </h1>
          <p style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 400,
            color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.6,
            textShadow: '0 1px 10px rgba(0,0,0,0.5)',
          }}>
            {isRtl
              ? 'מסלולים במדבר יהודה, ים המלח והנגב - יום אחד, מדריך מוסמך וארוחת צהריים כלולה. בחרו את הטרק הקרוב שלכם.'
              : 'Day treks across the Judean Desert, Dead Sea and Negev - a certified guide and lunch included. Pick your next trek.'}
          </p>
        </div>
      </section>

      {/* ── The full chronological grid (reused homepage section, fullPage mode) ── */}
      <IsraelTrips fullPage />

      <SiteFooter />
    </div>
  );
}
