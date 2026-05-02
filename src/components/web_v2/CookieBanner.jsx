/**
 * CookieBanner.jsx - GDPR cookie consent banner
 * Bilingual HE/EN · matches site design
 * Saves preference to localStorage and enables GA on accept
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { COLOR, RADIUS, EASING, FS } from '../../website/theme.js';

const STORAGE_KEY = 'highair_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const { i18n } = useTranslation();
  const isEn  = i18n.language === 'en';
  const dir   = isEn ? 'ltr' : 'rtl';

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={isEn ? 'Cookie consent' : 'הסכמה לעוגיות'}
      style={{
        position:     'fixed',
        bottom:       '24px',
        right:        '24px',
        left:         '24px',
        zIndex:       9999,
        maxWidth:     '480px',
        margin:       '0 auto',
        background:   '#FFFFFF',
        borderRadius: RADIUS.xl,
        boxShadow:    '0 8px 40px rgba(0,0,0,0.14)',
        border:       '1px solid #ECEAF8',
        padding:      '24px 28px',
        direction:    dir,
        animation:    'slideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Icon + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ fontSize: '22px' }}>🍪</span>
        <h3 style={{
          fontFamily:    "'Ploni', sans-serif",
          fontSize:      '16px',
          fontWeight:    700,
          color:         '#0A0818',
          margin:        0,
          letterSpacing: '-0.01em',
        }}>
          {isEn ? 'Cookie Usage' : 'שימוש בעוגיות'}
        </h3>
      </div>

      {/* Body */}
      <p style={{
        fontFamily: "'Ploni', sans-serif",
        fontSize:   '14px',
        fontWeight: 300,
        color:      '#4B4869',
        margin:     '0 0 20px',
        lineHeight: 1.7,
      }}>
        {isEn
          ? 'We use cookies to improve your browsing experience and analyse site usage. '
          : 'אנחנו משתמשים בעוגיות כדי לשפר את החוויה באתר ולנתח את השימוש בו. '}
        <a
          href="/privacy"
          style={{ color: COLOR.primary, fontWeight: 600, textDecoration: 'none' }}
        >
          {isEn ? 'Privacy Policy' : 'מדיניות הפרטיות'}
        </a>
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexDirection: isEn ? 'row' : 'row-reverse' }}>
        <button
          onClick={accept}
          style={{
            flex:         1,
            padding:      '10px 20px',
            borderRadius: RADIUS.full,
            border:       'none',
            background:   COLOR.primary,
            color:        '#FFFFFF',
            fontFamily:   "'Ploni', sans-serif",
            fontSize:     FS.btn,
            fontWeight:   700,
            cursor:       'pointer',
            transition:   `background 0.2s ${EASING.out}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; }}
          onMouseLeave={e => { e.currentTarget.style.background = COLOR.primary; }}
        >
          {isEn ? 'Accept ✓' : 'אני מסכים/ה ✓'}
        </button>
        <button
          onClick={decline}
          style={{
            padding:      '10px 20px',
            borderRadius: RADIUS.full,
            border:       '1.5px solid #E5E3F0',
            background:   'transparent',
            color:        '#6B6B8A',
            fontFamily:   "'Ploni', sans-serif",
            fontSize:     FS.btn,
            fontWeight:   600,
            cursor:       'pointer',
            transition:   `border-color 0.2s ${EASING.out}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = COLOR.primary; e.currentTarget.style.color = COLOR.primary; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E3F0'; e.currentTarget.style.color = '#6B6B8A'; }}
        >
          {isEn ? 'Decline' : 'דחה'}
        </button>
      </div>
    </div>
  );
}
