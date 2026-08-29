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
import { CARD_EXPS as EXPS } from '../../data/navData.js';
import { HOME_CLIMBS, HOME_TREKS } from '../../data/expeditionGroups.js';
import FlagImg from './FlagImg.jsx';

/* ── Arrow button ── */
function NavArrow({ direction, disabled, onClick, isRtl }) {
  const [hovered, setHovered] = useState(false);
  const symbol = direction === 'prev'
    ? (isRtl ? '→' : '←')
    : (isRtl ? '←' : '→');
  const ariaLabel = direction === 'prev'
    ? (isRtl ? 'הבא' : 'Previous')
    : (isRtl ? 'הקודם' : 'Next');
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
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

/* ── Altitude filter chip (climbs section) ── */
function TierChip({ label, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding:      '7px 16px',
        borderRadius: RADIUS.full,
        border:       `1.5px solid ${active ? COLOR.primary : '#E5E3F0'}`,
        background:   active ? COLOR.primary : (hov ? '#F5F3FF' : 'transparent'),
        color:        active ? '#FFFFFF' : '#3D3B5A',
        fontFamily:   "'Ploni', sans-serif",
        fontSize:     FS.sm,
        fontWeight:   600,
        cursor:       'pointer',
        transition:   'all 0.18s ease',
        whiteSpace:   'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/* ── Expedition card ── */
function ExpCard({ exp }) {
  const [hovered,  setHovered]  = useState(false);
  const cardRef  = useRef(null);
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const isTeaser = !!exp.teaser;   // a "בקרוב" card with no page — not clickable

  const handleNav = () => navigate(`/expedition/${exp.slug}`);

  return (
    <div
      ref={cardRef}
      role={isTeaser ? undefined : 'button'}
      tabIndex={isTeaser ? undefined : 0}
      aria-label={isEn ? exp.name : exp.nameHe}
      onClick={isTeaser ? undefined : handleNav}
      onKeyDown={isTeaser ? undefined : e => (e.key === 'Enter' || e.key === ' ') && handleNav()}
      onMouseEnter={() => !isTeaser && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          '100%',
        height:         '100%',
        borderRadius:   RADIUS.xl,
        overflow:       'hidden',
        background:     'transparent',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'space-between',
        minHeight:      isMobile ? '300px' : '380px',
        cursor:         isTeaser ? 'default' : 'pointer',
        transform:      hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:      hovered ? '0 20px 48px rgba(0,0,0,0.28)' : '0 6px 20px rgba(0,0,0,0.12)',
        transition:     `transform 0.35s ${EASING.out}, box-shadow 0.35s ${EASING.out}`,
        position:       'relative',
        outline:        'none',
      }}
    >
      {/* ── Background image (scales on hover) ── */}
      {exp.img ? (
        <div style={{
          position:           'absolute',
          inset:              '-6px',
          backgroundImage:    `url(${exp.img})`,
          backgroundSize:     'cover',
          backgroundPosition: exp.imgPosition || 'center',
          transform:          hovered ? 'scale(1.06)' : 'scale(1)',
          transition:         `transform 0.55s ${EASING.out}`,
          zIndex:             0,
        }} />
      ) : exp.grad ? (
        /* Teaser cards with no photo yet fall back to a gradient. */
        <div style={{ position: 'absolute', inset: '-6px', background: exp.grad, zIndex: 0 }} />
      ) : null}

      {/* ── Dark gradient overlay ── */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,0.70) 100%)',
        zIndex:     1,
        transition: `opacity 0.35s ${EASING.out}`,
      }} />

      {/* ── Brand purple tint on hover ── */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'linear-gradient(to bottom, transparent 40%, rgba(76,29,149,0.35) 100%)',
        opacity:    hovered ? 1 : 0,
        transition: `opacity 0.35s ${EASING.out}`,
        zIndex:     1,
      }} />

      {/* Country badge */}
      <div style={{ padding: '18px 18px 0', direction: isEn ? 'ltr' : 'rtl', position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 12px', borderRadius: RADIUS.full,
          background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          fontFamily: 'Ploni, sans-serif', fontSize: FS.sm, fontWeight: 600,
          color: 'rgba(255,255,255,0.95)', letterSpacing: '0.02em', direction: 'ltr',
        }}>
          <FlagImg emoji={exp.flag} size={18} />{isEn ? exp.country : exp.countryHe}
        </div>
        {exp.soldOut && (
          <div style={{ padding: '4px 10px', borderRadius: RADIUS.full, background: '#DC2626', fontFamily: 'Ploni, sans-serif', fontSize: '11px', fontWeight: 700, color: '#FFFFFF' }}>
            {t('explorer.soldOut')}
          </div>
        )}
        {/* A trek that is announced but whose material has not arrived yet. Same
            badge shape as sold-out so the card layout is unchanged; amber rather
            than red because it invites rather than closes the door. */}
        {!exp.soldOut && exp.comingSoon && (
          <div style={{ padding: '4px 10px', borderRadius: RADIUS.full, background: '#D97706', fontFamily: 'Ploni, sans-serif', fontSize: '11px', fontWeight: 700, color: '#FFFFFF' }}>
            {isEn ? 'Coming soon' : 'בקרוב'}
          </div>
        )}
      </div>

      {/* Name / elevation / arrow */}
      <div style={{ padding: '0 20px 24px', direction: isEn ? 'ltr' : 'rtl', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <h3 style={{ fontFamily: "'Ploni', sans-serif", fontSize: FS.h3, fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {isEn ? (exp.nameEn || exp.name) : exp.nameHe}
            </h3>
            {exp.elevNum > 0 && (
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: FS.sm, fontWeight: 400, color: 'rgba(255,255,255,0.85)', margin: 0, letterSpacing: '0.02em', direction: 'ltr', textAlign: isEn ? 'left' : 'right' }}>
                {exp.elevNum}m
              </p>
            )}
          </div>
          {!isTeaser && (
            <div style={{ fontSize: '20px', color: hovered ? '#FFFFFF' : 'rgba(255,255,255,0.25)', transition: `color 0.25s ${EASING.out}`, lineHeight: 1, flexShrink: 0, paddingBottom: '2px' }}>
              {isEn ? '→' : '←'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main section
══════════════════════════════════════════════════════════════ */

/* hideHeading: for a page that already carries its own <h1> (e.g. /safari),
   so the section does not print the same title twice. */
/* stackOnMobile: on a phone, lay the cards out one under the other instead of a
   horizontal slider. Used by /safari, where there are only three cards and a
   stack reads better than a swipe (owner, Jul 30 2026). The home page keeps its
   slider, which is why this is a prop and not a global change. */
export default function ExpeditionExplorer({ type, hideHeading = false, stackOnMobile = false }) {
  const trackRef      = useRef(null);
  const [cardWidth,   setCardWidth]   = useState(220);
  const [canPrev,     setCanPrev]     = useState(false);
  const [canNext,     setCanNext]     = useState(true);
  const [tier,        setTier]        = useState(null);   // climbs altitude filter (null = all)
  const { isMobile }  = useBreakpoint();
  const { t, i18n }   = useTranslation();
  const textDir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl   = textDir === 'rtl';
  const stacked = stackOnMobile && isMobile;

  /* Climbs and treks are derived automatically from the data and already sorted
     low → high by altitude (expeditionGroups.js). Safari is a special case: its
     groups are live:false (shown only on /safari), so it keeps an explicit id
     list and sorts by DURATION (3 → 5 → 7), which is what a game drive cares
     about, not altitude. */
  const SAFARI_IDS = [18, 19, 20];
  const baseCards = type === 'safari'
    ? SAFARI_IDS.map(id => EXPS.find(e => e.id === id)).filter(Boolean)
        .sort((a, b) => (parseInt(a.days, 10) || 0) - (parseInt(b.days, 10) || 0))
    : type === 'treks' ? HOME_TREKS : HOME_CLIMBS;

  /* Altitude tiers derived from whatever is on the shelf (climbs: 5,000-8,000m;
     treks: 2,000-5,000m), for the filter chips. A trip belongs to the tier of
     its thousands band. Safari has no altitude, so it gets no filter. */
  const tierOf     = e => Math.floor((e.elevNum || 0) / 1000) * 1000;
  const filterable = type === 'climbs' || type === 'treks';
  const TIERS      = filterable
    ? [...new Set(baseCards.map(tierOf))].filter(m => m > 0).sort((a, b) => a - b)
    : [];
  const cards      = (filterable && tier)
    ? baseCards.filter(e => tierOf(e) === tier)
    : baseCards;

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

  /* Reset scroll on type or language (RTL/LTR) change.
     Double-rAF ensures the browser has painted the new direction
     attribute before we touch scrollLeft — a single setTimeout(0)
     is not enough on Chrome/Safari when direction flips RTL↔LTR.
     We temporarily set scrollBehavior:'auto' so the jump is instant
     (no visible animated scroll from the restored position to 0).
     The 400ms fallback handles browser scroll-restoration which fires
     asynchronously after paint and can overwrite the rAF reset. */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const reset = () => {
      el.style.scrollBehavior = 'auto'; // instant jump, no animation
      el.scrollLeft = 0;
      updateArrows();
      requestAnimationFrame(() => {
        el.style.scrollBehavior = 'smooth'; // restore smooth for user interactions
      });
    };
    let raf2, timer;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        reset();
        timer = setTimeout(reset, 400);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2)  cancelAnimationFrame(raf2);
      if (timer) clearTimeout(timer);
    };
  }, [type, isRtl, tier, updateArrows]);

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
  const sectionId = type === 'climbs' ? 'expeditions' : type === 'safari' ? 'safari' : 'treks';
  const heading   = type === 'safari'
    ? (isRtl ? 'ספארי בטנזניה' : 'Tanzania Safari')
    : type === 'climbs'
      ? (isRtl ? 'טיפוסי הרים בעולם'  : 'Expeditions')
      : (isRtl ? 'טרקים בעולם'        : 'Trekking');
  const subtitle  = type === 'safari'
    ? (isRtl ? 'שלושה אורכים, אותן שמורות מהמרהיבות באפריקה - בחרו כמה ימים בטבע' : 'Three lengths, the same spectacular African reserves - choose how many days in the wild')
    : type === 'climbs'
      ? (isRtl ? 'מקילימנג\'רו דרך אלברוס ועד לאקונקגואה - הטיפוסים שמשנים חיים' : 'From Kilimanjaro through Elbrus to Aconcagua - climbs that change lives')
      : (isRtl ? 'מהבלקן דרך אתיופיה ועד להימלאיה בנפאל - הטרקים שאסור לפספס'    : 'From the Balkans through Ethiopia to the Himalayas in Nepal - treks you cannot miss');

  return (
    <section id={sectionId} style={{
      background: 'transparent',
      padding:    isMobile ? '36px 5% 0' : '60px 5% 0',
      boxSizing:  'border-box',
      direction:  textDir,
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <style>{`
          @keyframes tierFadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            [style*="tierFadeUp"] { animation: none !important; }
          }
        `}</style>

        {/* ── Header: title + arrows ── */}
        {hideHeading ? null : isMobile ? (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontFamily: "'Ploni', sans-serif", fontSize: FS.h2, fontWeight: 700,
              color: '#0A0818', margin: 0, letterSpacing: '-0.02em',
              lineHeight: 1.1, textAlign: 'start',
            }}>
              {heading}
            </h2>
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', marginBottom: '40px', gap: '16px',
          }}>
            <div>
              <h2 style={{
                fontFamily: "'Ploni', sans-serif", fontSize: FS.h2, fontWeight: 700,
                color: '#0A0818', margin: 0, letterSpacing: '-0.02em',
                lineHeight: 1.1, textAlign: 'start',
              }}>
                {heading}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <NavArrow direction="prev" disabled={!canPrev} onClick={() => scrollByCard('prev')} isRtl={isRtl} />
              <NavArrow direction="next" disabled={!canNext} onClick={() => scrollByCard('next')} isRtl={isRtl} />
            </div>
          </div>
        )}

        {/* ── Altitude filter (climbs + treks) ── */}
        {!hideHeading && filterable && TIERS.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '-16px', marginBottom: '30px', direction: textDir }}>
            <TierChip label={isRtl ? 'הכל' : 'All'} active={!tier} onClick={() => setTier(null)} />
            {TIERS.map(m => (
              <TierChip
                key={m}
                label={`${m}${isRtl ? ' מ׳' : ' m'}`}
                active={tier === m}
                onClick={() => setTier(m)}
              />
            ))}
          </div>
        )}

        {/* ── Scroll track ── */}
        <div
          ref={trackRef}
          style={stacked ? {
            display:        'flex',
            flexDirection:  'column',
            gap:            '18px',
            direction:      isRtl ? 'rtl' : 'ltr',
            paddingTop:     '12px',
            marginTop:      '-12px',
            paddingBottom:  '32px',
          } : {
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
            paddingInlineEnd:        isMobile ? '5%' : 0,
          }}
        >
          {cards.map((exp, i) => (
            <div
              /* key includes the active tier so switching filter remounts the
                 cards and replays the fade-up (staggered, capped delay). */
              key={`${tier}-${exp.id}`}
              style={stacked ? {
                width:          '100%',
                animation:      'tierFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both',
                animationDelay: `${Math.min(i, 8) * 40}ms`,
              } : {
                flex:             `0 0 ${cardWidth}px`,
                width:            `${cardWidth}px`,
                scrollSnapAlign:  'start',
                animation:        'tierFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both',
                animationDelay:   `${Math.min(i, 8) * 40}ms`,
              }}
            >
              <ExpCard exp={exp} />
            </div>
          ))}
        </div>

        {/* ── Mobile arrows — pointless once the cards are stacked ── */}
        {isMobile && !stacked && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '-48px', paddingBottom: '36px' }}>
            <NavArrow direction="prev" disabled={!canPrev} onClick={() => scrollByCard('prev')} isRtl={isRtl} />
            <NavArrow direction="next" disabled={!canNext} onClick={() => scrollByCard('next')} isRtl={isRtl} />
          </div>
        )}


      </div>
    </section>
  );
}
