/**
 * NotFound404.jsx - עמוד 404
 * RTL Hebrew · on-brand design
 */

import { useTranslation } from 'react-i18next';
import { COLOR, RADIUS, EASING, FS } from '../../website/theme.js';

export default function NotFound404() {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  return (
    <div style={{
      minHeight:      '100vh',
      background:     'linear-gradient(160deg, #0A0818 0%, #1E1B4B 50%, #4C1D95 100%)',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '40px 5%',
      boxSizing:      'border-box',
      direction:      dir,
      textAlign:      'center',
    }}>

      {/* Logo */}
      <div style={{
        width:        '80px',
        height:       '80px',
        borderRadius: '50%',
        background:   'rgba(255,255,255,0.08)',
        border:       '1px solid rgba(255,255,255,0.15)',
        overflow:     'hidden',
        marginBottom: '40px',
      }}>
        <img
          src="/Logo.png"
          alt="HighAir Expeditions"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* 404 number */}
      <div style={{
        fontFamily:    "'Mazzard', sans-serif",
        fontSize:      'clamp(80px, 18vw, 140px)',
        fontWeight:    900,
        color:         'transparent',
        background:    'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(167,139,250,0.8))',
        WebkitBackgroundClip: 'text',
        backgroundClip:       'text',
        lineHeight:    1,
        marginBottom:  '24px',
        letterSpacing: '-4px',
      }}>
        404
      </div>

      {/* Heading */}
      <h1 style={{
        fontFamily:    'Ploni, sans-serif',
        fontSize:      FS.h2,
        fontWeight:    700,
        color:         '#FFFFFF',
        margin:        '0 0 16px',
        letterSpacing: '-0.02em',
        lineHeight:    1.2,
      }}>
        {t('notFound.title')}
      </h1>

      {/* Subtitle */}
      <p style={{
        fontFamily:  'Ploni, sans-serif',
        fontSize:    FS.body,
        fontWeight:  300,
        color:       'rgba(255,255,255,0.55)',
        margin:      '0 0 48px',
        lineHeight:  1.7,
        maxWidth:    '400px',
      }}>
        {t('notFound.desc')}
      </p>

      {/* Back to home button */}
      <a
        href="/"
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            '10px',
          padding:        '14px 36px',
          borderRadius:   RADIUS.full,
          background:     'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(12px)',
          border:         '1px solid rgba(255,255,255,0.22)',
          color:          '#FFFFFF',
          fontFamily:     'Ploni, sans-serif',
          fontSize:       FS.btn,
          fontWeight:     700,
          textDecoration: 'none',
          letterSpacing:  '0.01em',
          transition:     `all 0.22s ${EASING.out}`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {t('notFound.back')}
      </a>

      {/* Mountain decoration */}
      <div style={{
        position:   'absolute',
        bottom:     0,
        left:       0,
        right:      0,
        fontSize:   '80px',
        lineHeight: 1,
        textAlign:  'center',
        opacity:    0.06,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        🏔️
      </div>

    </div>
  );
}
