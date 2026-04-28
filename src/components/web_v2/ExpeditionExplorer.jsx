/**
 * ExpeditionExplorer.jsx - Section 02 Dream Site (src/components/web_v2/)
 * type="climbs" | type="treks"
 * Cards sorted low→high elevation, horizontal native-scroll slider with snap.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { COLOR, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { EXPS } from '../../data/mockData.js';

/* ── Arrow button ── */
function NavArrow({ direction, disabled, onClick, isRtl }) {
  const [hovered, setHovered] = useState(false);
  const symbol = direction === 'prev'
    ? (isRtl ? '→' : '←')
    : (isRtl ? '←' : '→');
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          '44px',
        height:         '44px',
        borderRadius:   '50%',
        border:         `2px solid ${disabled ? '#E5E3F0' : hovered ? COLOR.primary : '#C4C0DC'}`,
        background:     disabled ? '#FAFAFA' : hovered ? COLOR.primary : '#FFFFFF',
        color:          disabled ? '#C4C0DC' : hovered ? '#FFFFFF' : '#3D3B5A',
        cursor:         disabled ? 'default' : 'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '18px',
        lineHeight:     1,
        flexShrink:     0,
        transition:     'all 0.18s ease',
        boxShadow:      hovered && !disabled ? '0 4px 12px rgba(109,40,217,0.20)' : 'none',
      }}
    >
      {symbol}
    </button>
  );
}

/* ── Expedition card ── */
function ExpCard({ exp }) {
  const [hovered,  setHovered]  = useState(false);
  const [imgReady, setImgReady] = useState(!exp.img);
  const cardRef  = useRef(null);
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  useEffect(() => {
    if (!exp.img) return;
    const el  = cardRef.current;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setImgReady(true); obs.disconnect(); }
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [exp.img]);

  const bg = exp.img
    ? (imgReady ? `url(${exp.img}) center/cover no-repeat` : exp.grad)
    : exp.grad;

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/expedition/${exp.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          '100%',
        height:         '100%',
        borderRadius:   RADIUS.xl,
        overflow:       'hidden',
        background:     bg,
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'space-between',
        minHeight:      isMobile ? '300px' : '380px',
        cursor:         'pointer',
        transform:      hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:      hovered ? '0 20px 48px rgba(0,0,0,0.22)' : '0 6px 20px rgba(0,0,0,0.12)',
        transition:     `transform 0.3s ${EASING.out}, box-shadow 0.3s ${EASING.out}`,
        position:       'relative',
      }}
    >
      {exp.img && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)',
          zIndex: 0,
        }} />
      )}

      {/* Country badge */}
      <div style={{ padding: '18px 18px 0', direction: isEn ? 'ltr' : 'rtl', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 12px', borderRadius: RADIUS.full,
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          fontFamily: 'Ploni, sans-serif', fontSize: FS.sm, fontWeight: 600,
          color: 'rgba(255,255,255,0.90)', letterSpacing: '0.02em', direction: 'ltr',
        }}>
          {exp.flag} {isEn ? exp.country : exp.countryHe}
        </div>
        {exp.soldOut && (
          <div style={{ padding: '4px 10px', borderRadius: RADIUS.full, background: '#DC2626', fontFamily: 'Ploni, sans-serif', fontSize: '11px', fontWeight: 700, color: '#FFFFFF' }}>
            {t('explorer.soldOut')}
          </div>
        )}
      </div>

      {/* Name / elevation / arrow */}
      <div style={{ padding: '0 20px 24px', direction: isEn ? 'ltr' : 'rtl', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <h3 style={{ fontFamily: "'Ploni', sans-serif", fontSize: FS.h3, fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {isEn ? (exp.nameEn || exp.name) : exp.nameHe}
            </h3>
            {exp.elevNum > 0 && (
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: FS.sm, fontWeight: 400, color: 'rgba(255,255,255,0.85)', margin: 0, letterSpacing: '0.02em' }}>
                {exp.elevNum}m
              </p>
            )}
          </div>
          <div style={{ fontSize: '20px', color: hovered ? '#FFFFFF' : 'rgba(255,255,255,0.25)', transition: `color 0.25s ${EASING.out}`, lineHeight: 1, flexShrink: 0, paddingBottom: '2px' }}>
            {isEn ? '→' : '←'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main section
══════════════════════════════════════════════════════════════ */

export default function ExpeditionExplorer({ type }) {
  const trackRef      = useRef(null);
  const [cardWidth,   setCardWidth]   = useState(220);
  const [canPrev,     setCanPrev]     = useState(false);
  const [canNext,     setCanNext]     = useState(true);
  const { isMobile }  = useBreakpoint();
  const { t, i18n }   = useTranslation();
  const textDir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl   = textDir === 'rtl';

  /* Cards sorted low → high */
  const TREK_IDS  = [4, 3, 2, 6, 7, 8];
  const CLIMB_IDS = [5, 9, 10, 11, 12, 13, 14, 15, 16];
  const cards = (type === 'treks' ? TREK_IDS : CLIMB_IDS)
    .map(id => EXPS.find(e => e.id === id))
    .filter(Boolean)
    .sort((a, b) => (a.elevNum || 0) - (b.elevNum || 0));

  /* Recalculate card width when container resizes */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const GAP = 18;
    const visible = isMobile ? 1 : 4;
    const calc = () => {
      const w = el.offsetWidth;
      setCardWidth(isMobile
        ? w * 0.82
        : (w - (visible - 1) * GAP) / visible);
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  /* Track scroll position → update arrow states */
  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const sl  = Math.abs(Math.round(el.scrollLeft)); // abs handles RTL negative values
    const max = Math.round(el.scrollWidth - el.clientWidth);
    setCanPrev(sl > 4);
    setCanNext(sl < max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    return () => el.removeEventListener('scroll', updateArrows);
  }, [updateArrows, cardWidth]);

  /* Reset scroll on type or language (RTL/LTR) change */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // Small timeout so iOS Safari applies the direction before we set scrollLeft
    const t = setTimeout(() => {
      el.scrollLeft = 0;
      updateArrows();
    }, 0);
    return () => clearTimeout(t);
  }, [type, isRtl, updateArrows]);

  /* Arrow click — scroll by one card */
  function scrollByCard(direction) {
    const el = trackRef.current;
    if (!el) return;
    const GAP  = 18;
    const step = cardWidth + GAP;
    // LTR: prev = left (−), next = right (+)
    // RTL: prev = right (scrollLeft toward 0), next = left (scrollLeft more negative)
    const delta = isRtl
      ? (direction === 'next' ? -step : +step)
      : (direction === 'next' ? +step  : -step);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }

  /* Labels */
  const sectionId = type === 'climbs' ? 'expeditions' : 'treks';
  const heading   = type === 'climbs'
    ? (isRtl ? 'טיפוסי הרים בעולם'  : 'Expeditions')
    : (isRtl ? 'טרקים בעולם'        : 'Trekking');
  const subtitle  = type === 'climbs'
    ? (isRtl ? 'מאולימפוס ועד לנין פיק — בחרו את האתגר הבא שלכם' : 'From Olympus to Lenin Peak — choose your next challenge')
    : (isRtl ? 'מהבלקן דרך אתיופיה ועד נפאל — טרקים לכל רמה'    : 'From the Balkans through Ethiopia to Nepal — treks for every level');

  return (
    <section id={sectionId} style={{
      background: '#FFFFFF',
      padding:    isMobile ? '36px 5% 0' : '60px 5% 0',
      boxSizing:  'border-box',
      direction:  textDir,
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Header: title + arrows ── */}
        <div style={{
          display:        'flex',
          alignItems:     'flex-end',
          justifyContent: 'space-between',
          marginBottom:   '32px',
          gap:            '16px',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Ploni', sans-serif", fontSize: FS.h2, fontWeight: 700,
              color: '#0A0818', margin: '0 0 8px', letterSpacing: '-0.02em',
              lineHeight: 1.1, textAlign: 'start',
            }}>
              {heading}
            </h2>
            <p style={{
              fontFamily: "'Ploni', sans-serif", fontSize: FS.body, fontWeight: 300,
              color: '#6B6B8A', margin: 0, lineHeight: 1.7, textAlign: 'start',
            }}>
              {subtitle}
            </p>
          </div>

          {!isMobile && (
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0, paddingBottom: '4px' }}>
              <NavArrow direction="prev" disabled={!canPrev} onClick={() => scrollByCard('prev')} isRtl={isRtl} />
              <NavArrow direction="next" disabled={!canNext} onClick={() => scrollByCard('next')} isRtl={isRtl} />
            </div>
          )}
        </div>

        {/* ── Scroll track ── */}
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
            paddingTop:              '12px', // room for card hover translateY(-6px)
            marginTop:               '-12px', // compensate layout shift
            paddingBottom:           '72px', // room for box-shadow (offset 20 + blur 48 + buffer)
            paddingLeft:             '16px', // room for left shadow
            paddingRight:            '16px', // room for right shadow
            marginLeft:              '-16px', // compensate layout shift
            marginRight:             '-16px', // compensate layout shift
          }}
        >
          {cards.map(exp => (
            <div
              key={exp.id}
              style={{
                flex:             `0 0 ${cardWidth}px`,
                width:            `${cardWidth}px`,
                scrollSnapAlign:  'start',
              }}
            >
              <ExpCard exp={exp} />
            </div>
          ))}
        </div>

        {/* ── Mobile arrows ── */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '-48px', paddingBottom: '36px' }}>
            <NavArrow direction="prev" disabled={!canPrev} onClick={() => scrollByCard('prev')} isRtl={isRtl} />
            <NavArrow direction="next" disabled={!canNext} onClick={() => scrollByCard('next')} isRtl={isRtl} />
          </div>
        )}


      </div>
    </section>
  );
}
