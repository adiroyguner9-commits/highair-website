/**
 * HeroSection.jsx - Dream Site Hero (src/components/web_v2/)
 *
 * · Full-bleed cinematic video background (100vh)
 * · Dark radial overlay so text pops against any footage
 * · Three perfectly-centered text elements, RTL
 * · Staggered 1.5s fade-up entrance · No navbar · No buttons · No scrollbar
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COLOR, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';

/* ── Epic slow-motion mountain summit clip (Coverr CDN, free) ── */
const VIDEO_SRC = '/hero.mp4';

/* ── Keyframes injected once into <head> ── */
const KEYFRAMES = `
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
`;

function injectKeyframes() {
  if (document.getElementById('hero-v2-kf')) return;
  const s = document.createElement('style');
  s.id = 'hero-v2-kf';
  s.textContent = KEYFRAMES;
  document.head.appendChild(s);
}

/* ── Fade-up style helper  ── */
const fadeUp = (delayS = 0) => ({
  opacity:   0,
  animation: `heroFadeUp 1.5s cubic-bezier(0.22, 1, 0.36, 1) ${delayS}s forwards`,
});

/* ════════════════════════════════════════ */
export default function HeroSection() {
  useEffect(() => { injectKeyframes(); }, []);
  const [btn1Hovered, setBtn1Hovered] = useState(false);
  const [btn2Hovered, setBtn2Hovered] = useState(false);
  const { isMobile } = useBreakpoint();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <section id="hero" style={{
      position:        'relative',
      height:          '90vh',
      width:           '100%',
      overflow:        'hidden',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
    }}>

      {/* ── 01. Background video ─────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        style={{
          position:        'absolute',
          inset:           0,
          width:           '100%',
          height:          '100%',
          objectFit:       'cover',
          zIndex:          0,
          transform:       'translateZ(0)',
          willChange:      'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* ── 02. Dark radial overlay ──────────────────────── */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'rgba(10,8,24,0.72)',
        zIndex: 1,
      }} />

      {/* ── 03. Centred text stack ───────────────────────── */}
      <div style={{
        position:   'relative',
        zIndex:     2,
        textAlign:  'center',
        direction:  isEn ? 'ltr' : 'rtl',
        padding:    '0 6vw',
        userSelect: 'none',
      }}>

        {/* Brand name - English, Mazzard, massive display size */}
        <h1 style={{
          ...fadeUp(0.15),
          fontFamily:    "'Mazzard', 'Ploni', sans-serif",
          fontSize:      FS.h1,
          fontWeight:    900,
          color:         '#FFFFFF',
          margin:        0,
          lineHeight:    1,
          letterSpacing: '-0.03em',
          direction:     'ltr',           /* brand name always LTR */
          whiteSpace:    'nowrap',
        }}>
          HighAir Expeditions
        </h1>

        {/* Hebrew subtitle block - sits below title with clear gap */}
        <div style={{ marginTop: '28px' }}>

          {/* Line 1 */}
          <p style={{
            ...fadeUp(0.45),
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      FS.body,
            fontWeight:    300,
            color:         '#FFFFFF',
            margin:        0,
            lineHeight:    1.5,
            letterSpacing: '0.01em',
          }}>
            {t('hero.subtitle')}
          </p>

          {/* Line 2 - mission, tight under line 1 */}
          <p style={{
            ...fadeUp(0.65),
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      FS.body,
            fontWeight:    400,
            color:         COLOR.lighter,   /* #A78BFA soft purple */
            margin:        '2px 0 0',
            lineHeight:    1.5,
            letterSpacing: '0.02em',
          }}>
            {t('hero.cancer')}
          </p>

        </div>

        {/* ── Buttons ── */}
        <div style={{
          ...fadeUp(0.9),
          display:        'flex',
          gap:            '16px',
          justifyContent: 'center',
          marginTop:      '44px',
          pointerEvents:  'auto',
          flexWrap:       'wrap',
        }}>

          {/* Primary - לכל המשלחות */}
          <a
            href="#expeditions"
            onMouseEnter={() => setBtn1Hovered(true)}
            onMouseLeave={() => setBtn1Hovered(false)}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '8px',
              padding:        '15px 36px',
              minWidth:       '180px',
              justifyContent: 'center',
              borderRadius:   '999px',
              background:     btn1Hovered ? '#7C3AED' : COLOR.primary,
              color:          '#FFFFFF',
              fontFamily:     "'Ploni', sans-serif",
              fontSize:       FS.btn,
              fontWeight:     700,
              textDecoration: 'none',
              letterSpacing:  '0.01em',
              boxShadow:      btn1Hovered
                                ? '0 10px 32px rgba(109,40,217,0.55)'
                                : '0 4px 18px rgba(109,40,217,0.35)',
              transform:      btn1Hovered ? 'translateY(-2px)' : 'none',
              transition:     'all 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
              whiteSpace:     'nowrap',
            }}
          >
            {t('hero.allExpeditions')}
          </a>

          {/* Secondary - הסיפור שלנו */}
          <a
            href="#impact"
            onMouseEnter={() => setBtn2Hovered(true)}
            onMouseLeave={() => setBtn2Hovered(false)}
            style={{
              display:             'inline-flex',
              alignItems:          'center',
              gap:                 '8px',
              padding:             '15px 36px',
              minWidth:            '180px',
              justifyContent:      'center',
              borderRadius:        '999px',
              background:          btn2Hovered
                                     ? 'rgba(255,255,255,0.15)'
                                     : 'rgba(255,255,255,0.08)',
              border:              '1.5px solid rgba(255,255,255,0.25)',
              backdropFilter:      'blur(12px)',
              WebkitBackdropFilter:'blur(12px)',
              color:               '#FFFFFF',
              fontFamily:          "'Ploni', sans-serif",
              fontSize:            FS.btn,
              fontWeight:          600,
              textDecoration:      'none',
              letterSpacing:       '0.01em',
              transform:           btn2Hovered ? 'translateY(-2px)' : 'none',
              boxShadow:           btn2Hovered
                                     ? '0 10px 28px rgba(0,0,0,0.28)'
                                     : '0 4px 14px rgba(0,0,0,0.18)',
              transition:          'all 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
              whiteSpace:          'nowrap',
            }}
          >
            {t('hero.ourStory')}
          </a>

        </div>

      </div>
    </section>
  );
}
