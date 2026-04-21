/**
 * ExpeditionExplorer.jsx — Section 02 Dream Site (src/components/web_v2/)
 * Worldwide expeditions · continent tabs · RTL Hebrew
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLOR, BTN, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { EXPS } from '../../data/mockData.js';

/* ── Continent tabs with expedition IDs sorted by elevation (low→high) ── */
const CONTINENTS = [
  { key: 'africa',       label: 'אפריקה',      expIds: [4, 10, 11] },
  { key: 'europe',       label: 'אירופה',       expIds: [2, 3, 5, 9] },
  { key: 'asia',         label: 'אסיה',         expIds: [6, 7, 8, 12, 13, 14, 16] },
  { key: 'southamerica', label: 'דרום אמריקה', expIds: [15] },
];

/* ── Elevation formatter ── */
const fmtElev = (num) => num + ' מטר';

/* ══════════════════════════════════════════════════════════════
   ExpCard — identical design to original
══════════════════════════════════════════════════════════════ */

function ExpCard({ exp }) {
  const [hovered,  setHovered]  = useState(false);
  const [imgReady, setImgReady] = useState(!exp.img); // no img → always "ready"
  const cardRef  = useRef(null);
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  /* Lazy-load: set background only when card enters viewport */
  useEffect(() => {
    if (!exp.img) return;
    const el = cardRef.current;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setImgReady(true);
        obs.disconnect();
      }
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
        flex:           '1 0 0',
        minWidth:       isMobile ? 0 : '200px',
        borderRadius:   RADIUS.xl,
        overflow:       'hidden',
        background:     bg,
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'space-between',
        minHeight:      isMobile ? '280px' : '380px',
        cursor:         'pointer',
        transform:      hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:      hovered
                          ? '0 20px 48px rgba(0,0,0,0.22)'
                          : '0 6px 20px rgba(0,0,0,0.12)',
        transition:     `transform 0.3s ${EASING.out}, box-shadow 0.3s ${EASING.out}`,
        position:       'relative',
      }}
    >
      {/* ── Dark overlay so text stays readable over photos ── */}
      {exp.img && (
        <div style={{
          position:   'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)',
          zIndex:     0,
        }} />
      )}
      {/* ── Top: country badge ── */}
      <div style={{ padding: '18px 18px 0', direction: 'rtl', position: 'relative', zIndex: 1 }}>
        <div style={{
          display:              'inline-flex',
          alignItems:           'center',
          gap:                  '6px',
          padding:              '5px 12px',
          borderRadius:         RADIUS.full,
          background:           'rgba(255,255,255,0.15)',
          backdropFilter:       'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontFamily:           'Ploni, sans-serif',
          fontSize:             FS.sm,
          fontWeight:           600,
          color:                'rgba(255,255,255,0.90)',
          letterSpacing:        '0.02em',
          direction:            'rtl',
        }}>
          {exp.countryHe} {exp.flag}
        </div>
      </div>

      {/* ── Bottom: name / elev / arrow ── */}
      <div style={{ padding: '0 20px 24px', direction: 'rtl', position: 'relative', zIndex: 1 }}>
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
              {exp.nameHe}
            </h3>
            <p style={{
              fontFamily:    "'Ploni', sans-serif",
              fontSize:      FS.sm,
              fontWeight:    400,
              color:         'rgba(255,255,255,0.85)',
              margin:        0,
              letterSpacing: '0.02em',
            }}>
              {fmtElev(exp.elevNum)}
            </p>
          </div>

          {/* חץ */}
          <div style={{
            fontSize:      '20px',
            color:         hovered ? '#FFFFFF' : 'rgba(255,255,255,0.25)',
            transition:    `color 0.25s ${EASING.out}`,
            lineHeight:    1,
            flexShrink:    0,
            paddingBottom: '2px',
          }}>
            ←
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main section
══════════════════════════════════════════════════════════════ */

export default function ExpeditionExplorer() {
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [phase,      setPhase]      = useState('idle'); // 'idle' | 'out' | 'in'
  const [dir,        setDir]        = useState(1);
  const [ctaHovered, setCtaHovered] = useState(false);
  const { isMobile } = useBreakpoint();

  const switchTab = (idx) => {
    if (idx === activeIdx) return;
    const d = idx > activeIdx ? 1 : -1;
    setDir(d);
    setPhase('out');
    setTimeout(() => {
      setActiveIdx(idx);
      setPhase('in');
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setPhase('idle'))
      );
    }, 160);
  };

  const cont  = CONTINENTS[activeIdx];
  const cards = cont.expIds
    .map(id => EXPS.find(e => e.id === id))
    .filter(Boolean)
    .sort((a, b) => (b.elevNum || 0) - (a.elevNum || 0));

  return (
    <section id="expeditions" style={{
      background: '#FFFFFF',
      padding:    isMobile ? '36px 5%' : '60px 5%',
      boxSizing:  'border-box',
      direction:  'rtl',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
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
            המשלחות שלנו בעולם
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
            בחרו יעד, בחרו רמה, ותנו לנו לדאוג לכל השאר
          </p>
        </div>

        {/* ── Continent tabs ── */}
        <div style={{
          display:                 'flex',
          gap:                     '8px',
          flexWrap:                isMobile ? 'nowrap' : 'wrap',
          overflowX:               isMobile ? 'auto' : 'visible',
          marginBottom:            '20px',
          direction:               'rtl',
          justifyContent:          isMobile ? 'flex-start' : 'center',
          WebkitOverflowScrolling: 'touch',
          paddingBottom:           isMobile ? '2px' : 0,
          scrollbarWidth:          'none',
          msOverflowStyle:         'none',
        }}>
          {CONTINENTS.map((c, i) => {
            const isActive = i === activeIdx;
            const count    = c.expIds.map(id => EXPS.find(e => e.id === id)).filter(Boolean).length;
            return (
              <button
                key={c.key}
                onClick={() => switchTab(i)}
                style={{
                  display:       'inline-flex',
                  alignItems:    'center',
                  gap:           '8px',
                  padding:       isMobile ? '7px 22px' : '9px 18px',
                  borderRadius:  RADIUS.full,
                  border:        isActive
                                   ? `2px solid ${COLOR.primary}`
                                   : '2px solid #E5E3F0',
                  background:    isActive ? COLOR.primary : '#FFFFFF',
                  color:         isActive ? '#FFFFFF' : '#4B4869',
                  fontFamily:    "'Ploni', sans-serif",
                  fontSize:      FS.btn,
                  fontWeight:    isActive ? 700 : 400,
                  cursor:        'pointer',
                  boxShadow:     isMobile ? 'none' : (isActive
                                   ? '0 4px 14px rgba(109,40,217,0.30)'
                                   : '0 2px 8px rgba(0,0,0,0.06)'),
                  transition:    `all 0.25s ${EASING.out}`,
                  letterSpacing: '0.01em',
                  whiteSpace:    'nowrap',
                }}
              >
                {c.label}
                <span style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  minWidth:       '20px',
                  height:         '20px',
                  padding:        '0 5px',
                  borderRadius:   '10px',
                  background:     isActive ? 'rgba(255,255,255,0.25)' : 'rgba(109,40,217,0.10)',
                  color:          isActive ? '#FFFFFF' : COLOR.primary,
                  fontSize:       '11px',
                  fontWeight:     700,
                  lineHeight:     1,
                  transition:     `all 0.25s ${EASING.out}`,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Card grid ── */}
        <div style={{
          display:             isMobile ? 'flex' : 'grid',
          flexDirection:       isMobile ? 'column' : undefined,
          gridTemplateColumns: isMobile ? undefined : 'repeat(4, 1fr)',
          gap:                 '18px',
          marginTop:           '36px',
          opacity:    phase === 'out' ? 0 : 1,
          transform:  phase === 'out' ? `translateX(${dir * -28}px)`
                    : phase === 'in'  ? `translateX(${dir * 28}px)`
                    : 'translateX(0)',
          transition: phase === 'out' ? `opacity 0.14s ease, transform 0.14s ease`
                    : phase === 'in'  ? 'none'
                    : `opacity 0.26s ${EASING.out}, transform 0.32s cubic-bezier(0.22,1,0.36,1)`,
        }}>
          {cards.map(exp => (
            <ExpCard key={exp.id} exp={exp} />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
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
            צפה בכל המשלחות
          </button>
        </div>

      </div>
    </section>
  );
}
