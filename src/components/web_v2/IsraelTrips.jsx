/**
 * IsraelTrips.jsx - Section 03 Dream Site (src/components/web_v2/)
 *
 * · Clean white section, same card DNA as ExpeditionExplorer
 * · No tabs - static grid of Israel-based trips
 * · Coming-soon cards for destinations not yet live
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { COLOR, BTN, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { ISRAEL_TRIPS } from '../../data/israelData.js';

/* ══════════════════════════════════════════════════════════════
   Card
══════════════════════════════════════════════════════════════ */

function IsraelCard({ trip }) {
  const [hovered,  setHovered]  = useState(false);
  const [imgReady, setImgReady] = useState(!trip.img);
  const cardRef  = useRef(null);
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  useEffect(() => {
    if (!trip.img) return;
    const el  = cardRef.current;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setImgReady(true); obs.disconnect(); }
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [trip.img]);

  const bg = trip.img
    ? (imgReady ? `url(${trip.img}) center/cover no-repeat` : trip.grad)
    : trip.grad;

  function handleClick() {
    if (trip.live && trip.slug) {
      navigate(`/israel/${trip.slug}`);
      window.scrollTo(0, 0);
    }
  }

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius:  RADIUS.xl,
        overflow:      'hidden',
        background:    bg,
        display:       'flex',
        flexDirection: 'column',
        justifyContent:'space-between',
        minHeight:     isMobile ? '280px' : '380px',
        cursor:        trip.live ? 'pointer' : 'default',
        transform:     hovered && trip.live ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:     hovered && trip.live
                         ? '0 20px 48px rgba(0,0,0,0.22)'
                         : '0 6px 20px rgba(0,0,0,0.12)',
        transition:    `transform 0.3s ${EASING.out}, box-shadow 0.3s ${EASING.out}`,
        position:      'relative',
      }}
    >
      {/* Dark overlay for photo cards */}
      {trip.img && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)',
          zIndex: 0,
        }} />
      )}

      {/* ── Top: area badge ── */}
      <div style={{ padding: '18px 18px 0', direction: isEn ? 'ltr' : 'rtl', position: 'relative', zIndex: 1 }}>
        <div style={{
          display:             'inline-flex',
          alignItems:          'center',
          gap:                 '6px',
          padding:             '5px 12px',
          borderRadius:        RADIUS.full,
          background:          'rgba(255,255,255,0.15)',
          backdropFilter:      'blur(8px)',
          WebkitBackdropFilter:'blur(8px)',
          fontSize:            FS.sm,
          fontFamily:          'Ploni, sans-serif',
          fontWeight:          600,
          color:               'rgba(255,255,255,0.90)',
          letterSpacing:       '0.02em',
          direction:           'ltr',
        }}>
          🇮🇱 {trip.area}
        </div>
      </div>

      {/* ── Bottom: name / elev / arrow ── */}
      <div style={{ padding: '0 20px 24px', direction: isEn ? 'ltr' : 'rtl', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <h3 style={{
              fontFamily:    "'Ploni', sans-serif",
              fontSize:      FS.h3,
              fontWeight:    700,
              color:         '#FFFFFF',
              margin:        '0 0 6px',
              letterSpacing: '-0.02em',
              lineHeight:    1.1,
            }}>
              {isEn ? (trip.nameEn || trip.name) : trip.name}
            </h3>
            {trip.elevStr && (
              <p style={{
                fontFamily: "'Ploni', sans-serif",
                fontSize:   FS.sm,
                fontWeight: 400,
                color:      'rgba(255,255,255,0.85)',
                margin:     0,
                letterSpacing: '0.02em',
              }}>
                {trip.elevStr}
              </p>
            )}
          </div>
          <div style={{
            fontSize:      '20px',
            color:         hovered && trip.live ? '#FFFFFF' : 'rgba(255,255,255,0.25)',
            transition:    `color 0.25s ${EASING.out}`,
            lineHeight:    1,
            flexShrink:    0,
            paddingBottom: '2px',
          }}>{isEn ? '→' : '←'}</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main section
══════════════════════════════════════════════════════════════ */

export default function IsraelTrips() {
  const [ctaHovered, setCtaHovered] = useState(false);
  const { isMobile } = useBreakpoint();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';

  return (
    <section id="israel" style={{
      background:  '#FFFFFF',
      padding:     isMobile ? '36px 5%' : '60px 5%',
      boxSizing:   'border-box',
      direction:   dir,
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      FS.h2,
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 12px',
            letterSpacing: '-0.02em',
            lineHeight:    1.1,
            textAlign:     'center',
          }}>
            {t('israelTrips.heading')}
          </h2>

          <p style={{
            fontFamily:  "'Ploni', sans-serif",
            fontSize:    FS.body,
            fontWeight:  300,
            color:       '#6B6B8A',
            margin:      0,
            lineHeight:  1.7,
            textAlign:   'center',
          }}>
            {t('israelTrips.subtitle')}
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div style={{
          display:             isMobile ? 'flex' : 'grid',
          flexDirection:       isMobile ? 'column' : undefined,
          gridTemplateColumns: isMobile ? undefined : 'repeat(4, 1fr)',
          gap:                 '18px',
        }}>
          {ISRAEL_TRIPS.map(trip => (
            <IsraelCard key={trip.id} trip={trip} />
          ))}
        </div>

        {/* ── Bottom CTA - only when more than 1 trip ── */}
        {ISRAEL_TRIPS.length > 1 && (
          <div style={{ textAlign: 'center', marginTop: '48px', direction: 'ltr' }}>
            <button
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              style={{
                ...BTN.outline,
                fontFamily:    "'Ploni', sans-serif",
                fontSize:      FS.btn,
                fontWeight:    700,
                padding:       '14px 48px',
                letterSpacing: '0.01em',
                background:    ctaHovered ? COLOR.primary : 'transparent',
                color:         ctaHovered ? '#FFFFFF'      : COLOR.primary,
                boxShadow:     ctaHovered ? '0 6px 22px rgba(109,40,217,0.30)' : 'none',
                transform:     ctaHovered ? 'translateY(-1px)' : 'none',
                transition:    `all 0.22s ${EASING.out}`,
              }}
            >
              {t('israelTrips.viewAll')}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
