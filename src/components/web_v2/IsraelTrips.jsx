/**
 * IsraelTrips.jsx - Section 03 Dream Site (src/components/web_v2/)
 *
 * · Clean white section, same card DNA as ExpeditionExplorer
 * · No tabs - static grid of Israel-based trips
 * · Coming-soon cards for destinations not yet live
 */

import { useState, useRef, useEffect, useCallback } from 'react';
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
      role={trip.live ? 'button' : undefined}
      tabIndex={trip.live ? 0 : undefined}
      aria-label={isEn ? (trip.nameEn || trip.name) : trip.name}
      onClick={handleClick}
      onKeyDown={trip.live ? (e => (e.key === 'Enter' || e.key === ' ') && handleClick()) : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:         '100%',
        height:        '100%',
        borderRadius:  RADIUS.xl,
        overflow:      'hidden',
        background:    bg,
        display:       'flex',
        flexDirection: 'column',
        justifyContent:'flex-end',
        minHeight:     isMobile ? '300px' : '380px',
        cursor:        trip.live ? 'pointer' : 'default',
        transform:     hovered && trip.live ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:     hovered && trip.live
                         ? '0 20px 48px rgba(0,0,0,0.22)'
                         : '0 6px 20px rgba(0,0,0,0.12)',
        transition:    `transform 0.3s ${EASING.out}, box-shadow 0.3s ${EASING.out}`,
        position:      'relative',
        outline:       'none',
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
                direction:  'ltr',
                textAlign:  isEn ? 'left' : 'right',
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

/* ── Arrow button (same as ExpeditionExplorer) ── */
function NavArrow({ direction, disabled, onClick, isRtl }) {
  const [hovered, setHovered] = useState(false);
  const symbol = direction === 'prev' ? (isRtl ? '→' : '←') : (isRtl ? '←' : '→');
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '44px', height: '44px', borderRadius: '50%',
        border: `2px solid ${disabled ? '#E5E3F0' : hovered ? COLOR.primary : '#C4C0DC'}`,
        background: disabled ? '#FAFAFA' : hovered ? COLOR.primary : '#FFFFFF',
        color: disabled ? '#C4C0DC' : hovered ? '#FFFFFF' : '#3D3B5A',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', lineHeight: 1, flexShrink: 0,
        transition: 'all 0.18s ease',
        boxShadow: hovered && !disabled ? '0 4px 12px rgba(109,40,217,0.20)' : 'none',
      }}
    >
      {symbol}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main section
══════════════════════════════════════════════════════════════ */

export default function IsraelTrips() {
  const [ctaHovered, setCtaHovered] = useState(false);
  const trackRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(280);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const { isMobile } = useBreakpoint();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';

  const HIDDEN_SLUGS = new Set(ISRAEL_TRIPS.filter(t => t.hidden).map(t => t.slug));
  const [trips, setTrips] = useState(ISRAEL_TRIPS.filter(t =>
    !t.hidden && (!t.departure || new Date(t.departure) >= new Date(new Date().toDateString()))));

  useEffect(() => {
    fetch('/api/airtable/IsraelGroups')
      .then(r => r.json())
      .then(data => {
        const seen = new Set();
        const loaded = (data.records || [])
          .map(r => ({ id: r.id, ...r.fields }))
          .filter(f => f.Slug && !f.Hidden && !HIDDEN_SLUGS.has(f.Slug))
          /* Date-bound trips (e.g. community trips) drop out the day after departure */
          .filter(f => !f.Departure || new Date(f.Departure) >= new Date(new Date().toDateString()))
          .sort((a, b) => (a.Sort_Order || 99) - (b.Sort_Order || 99))
          .filter(f => {
            if (seen.has(f.Slug)) return false;
            seen.add(f.Slug);
            return true;
          })
          .map(f => ({
            id:            f.id,
            slug:          f.Slug,
            name:          f.Name,
            nameEn:        f.Name_En,
            area:          f.Event || '',
            elev:          f.Elev,
            elevStr:       f.Elev ? `${f.Elev}m` : '',
            priceHe:       f.Price_He,
            price:         f.Price_En,
            diffHe:        f.Diff_He,
            diffEn:        f.Diff_En,
            days:          f.Days_He,
            daysEn:        f.Days_En,
            typeHe:        f.Type_He,
            img:           f.Image_URL ? f.Image_URL.replace(/^https?:\/\/[^/]+/, '') : (ISRAEL_TRIPS.find(t => t.slug === f.Slug)?.img || null),
            grad:          f.Gradient || 'linear-gradient(135deg, #1e1b4b, #4338ca)',
            paymentUrl:    f.Payment_URL,
            airtableEvents: [f.Event].filter(Boolean),
            groupCapacity: f.Capacity || 12,
            live:          true,
          }));
        if (data.records) setTrips(loaded); // always apply if fetch succeeded (even empty = hidden)
      })
      .catch(() => {}); // silently keep hardcoded fallback on network error
  }, []);

  /* ── Carousel: card width ── */
  useEffect(() => {
    if (!isMobile) return;
    const el = trackRef.current;
    if (!el) return;
    const calc = () => setCardWidth(el.offsetWidth * 0.82);
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  /* ── Carousel: arrow states ── */
  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const sl  = Math.abs(Math.round(el.scrollLeft));
    const max = Math.round(el.scrollWidth - el.clientWidth);
    setCanPrev(sl > 4);
    setCanNext(sl < max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !isMobile) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    return () => el.removeEventListener('scroll', updateArrows);
  }, [updateArrows, cardWidth, isMobile]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const delta = (cardWidth + 18) * (dir === 'next' ? 1 : -1) * (isRtl ? -1 : 1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  if (trips.length === 0) return null;

  return (
    <section id="israel" style={{
      background:  '#FFFFFF',
      padding:     isMobile ? '36px 5% 0' : '60px 5%',
      boxSizing:   'border-box',
      direction:   dir,
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Section header ── */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      FS.h2,
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 12px',
            letterSpacing: '-0.02em',
            lineHeight:    1.1,
            textAlign:     'start',
          }}>
            {t('israelTrips.heading')}
          </h2>

        </div>

        {/* ── Cards: carousel on mobile, grid on desktop ── */}
        {isMobile ? (
          <div
            ref={trackRef}
            style={{
              display:                 'flex',
              gap:                     '18px',
              direction:               isRtl ? 'rtl' : 'ltr',
              overflowX:               'auto',
              scrollSnapType:          'x mandatory',
              scrollBehavior:          'smooth',
              scrollbarWidth:          'none',
              msOverflowStyle:         'none',
              WebkitOverflowScrolling: 'touch',
              paddingTop:              '12px',
              marginTop:               '-12px',
              paddingBottom:           '72px',
              paddingInlineEnd:        '5%',
            }}
          >
            {trips.map(trip => (
              <div
                key={trip.id || trip.slug}
                style={{ flex: `0 0 ${cardWidth}px`, width: `${cardWidth}px`, scrollSnapAlign: 'start' }}
              >
                <IsraelCard trip={trip} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
            {trips.map(trip => (
              <IsraelCard key={trip.id || trip.slug} trip={trip} />
            ))}
          </div>
        )}

        {/* ── Mobile arrows ── */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '-48px', paddingBottom: '36px' }}>
            <NavArrow direction="prev" disabled={!canPrev} onClick={() => scrollByCard('prev')} isRtl={isRtl} />
            <NavArrow direction="next" disabled={!canNext} onClick={() => scrollByCard('next')} isRtl={isRtl} />
          </div>
        )}

        {/* ── Bottom CTA - only when more than 1 trip ── */}
        {trips.length > 1 && !isMobile && (
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
