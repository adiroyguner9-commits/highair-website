/**
 * HighAir Design System — theme.js
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for all design tokens used across the
 * marketing website AND the app shell.  Import from here instead
 * of hard-coding hex values anywhere in website components.
 *
 * Structure:
 *   COLOR     — palette + named gradients
 *   FONT      — font-family stacks
 *   RADIUS    — border-radius scale
 *   SHADOW    — box-shadow presets (neutral + brand-tinted)
 *   SPACING   — 8-pt spacing scale
 *   EASING    — animation easing curves
 *   glass()   — glassmorphism helper
 *   LABEL     — section overline text style
 *   H2        — standard section heading style
 *   BTN       — button style presets (for spreading into style={})
 */

/* ─────────────── Colors ─────────────── */
export const COLOR = {
  // Brand
  primary:    '#6D28D9',
  light:      '#8B5CF6',
  lighter:    '#A78BFA',
  dark:       '#4C1D95',
  deeper:     '#1E1B4B',
  midnight:   '#0A0818',

  // Functional
  text:       '#1E1B4B',
  muted:      '#6B7280',
  mutedLight: '#9CA3AF',
  border:     '#EDE9FE',
  bg:         '#F8F7FF',
  card:       '#FFFFFF',
  softPurple: '#EDE9FE',

  // Status
  success:    '#059669',
  successBg:  'rgba(5,150,105,0.1)',
  gold:       '#D97706',
  goldBg:     'rgba(215,119,6,0.1)',
  danger:     '#DC2626',
  dangerBg:   'rgba(220,38,38,0.1)',
  warning:    '#F59E0B',
  urgent:     '#EF4444',

  // Named Gradients
  grad: {
    brand:      'linear-gradient(135deg, #6D28D9, #4C1D95)',
    brandLight: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
    hero:       'linear-gradient(160deg, #0A0818 0%, #1E1B4B 30%, #4C1D95 65%, #6D28D9 100%)',
    heroAlt:    'linear-gradient(145deg, #0A0818 0%, #1A1040 30%, #4C1D95 65%, #6D28D9 100%)',
    dark:       'linear-gradient(145deg, #1E1B4B, #4C1D95, #6D28D9)',
    text:       'linear-gradient(90deg, #C4B5FD, #A78BFA, #818CF8)',
    textWarm:   'linear-gradient(90deg, #C4B5FD, #A78BFA)',
    cta:        'linear-gradient(135deg, #7C3AED, #4C1D95)',
  },

  // Transparency layers (on dark backgrounds)
  white: {
    10:  'rgba(255,255,255,0.10)',
    15:  'rgba(255,255,255,0.15)',
    18:  'rgba(255,255,255,0.18)',
    25:  'rgba(255,255,255,0.25)',
    45:  'rgba(255,255,255,0.45)',
    60:  'rgba(255,255,255,0.60)',
    70:  'rgba(255,255,255,0.70)',
  },
};

/* ─────────────── Typography ─────────────── */
export const FONT = {
  primary: "'Ploni', 'Mazzard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  english: "'Mazzard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  hebrew:  "'Ploni', -apple-system, BlinkMacSystemFont, sans-serif",
};

/* ─────────────── Font Size Scale ─────────────── */
export const FS = {
  h1:    'clamp(30px, 7vw, 50px)',  // hero / display title
  h2:    'clamp(24px, 4vw, 36px)',  // section headings
  h3:    'clamp(17px, 3vw, 20px)',  // card titles
  body:  '15px',                    // paragraphs
  sm:    '15px',                    // labels, captions, small text
  btn:   '13px',                    // buttons & tabs
};

/* ─────────────── Border Radius Scale ─────────────── */
export const RADIUS = {
  xs:   '8px',
  sm:   '10px',
  md:   '12px',
  lg:   '14px',
  xl:   '20px',
  '2xl':'24px',
  '3xl':'28px',
  '4xl':'32px',
  pill: '50px',
  full: '9999px',
};

/* ─────────────── Shadow Scale ─────────────── */
export const SHADOW = {
  xs:     '0 1px 4px rgba(0,0,0,0.06)',
  sm:     '0 2px 8px rgba(0,0,0,0.08)',
  md:     '0 4px 16px rgba(0,0,0,0.12)',
  lg:     '0 8px 32px rgba(0,0,0,0.15)',
  xl:     '0 16px 60px rgba(0,0,0,0.20)',
  '2xl':  '0 32px 80px rgba(0,0,0,0.25)',

  // Brand-tinted shadows
  brand: {
    xs:  '0 2px 8px  rgba(109,40,217,0.18)',
    sm:  '0 4px 14px rgba(109,40,217,0.25)',
    md:  '0 6px 22px rgba(109,40,217,0.30)',
    lg:  '0 10px 36px rgba(109,40,217,0.35)',
    xl:  '0 18px 56px rgba(109,40,217,0.45)',
    '2xl':'0 28px 72px rgba(109,40,217,0.50)',
  },
};

/* ─────────────── 8-pt Spacing Scale ─────────────── */
export const SPACING = {
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  30: '120px',
};

/* ─────────────── Easing Curves ─────────────── */
export const EASING = {
  out:     'cubic-bezier(0.22, 1, 0.36, 1)',     // fast out — snappy entries
  inOut:   'cubic-bezier(0.45, 0, 0.55, 1)',      // balanced
  spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',  // bouncy / springy
  smooth:  'cubic-bezier(0.4, 0, 0.2, 1)',        // Material-style
};

/* ─────────────── Animation Durations ─────────────── */
export const DUR = {
  fast:   '120ms',
  base:   '200ms',
  slow:   '350ms',
  slower: '500ms',
};

/* ─────────────── Glassmorphism Helper ─────────────── */
/**
 * Returns an inline style object for glassmorphism cards.
 * Usage: <div style={{ ...glass(0.1), borderRadius: RADIUS['2xl'] }}>
 */
export function glass(opacity = 0.1, blur = 16) {
  return {
    background:              `rgba(255,255,255,${opacity})`,
    backdropFilter:          `blur(${blur}px)`,
    WebkitBackdropFilter:    `blur(${blur}px)`,
    border:                  '1px solid rgba(255,255,255,0.18)',
  };
}

/* ─────────────── Section Label (overline) ─────────────── */
export const LABEL = {
  fontSize:      '12px',
  fontWeight:    700,
  color:         COLOR.primary,
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginBottom:  '14px',
  display:       'block',
};

/* ─────────────── H2 Heading ─────────────── */
export const H2 = {
  fontSize:      'clamp(28px, 4vw, 52px)',
  fontWeight:    900,
  color:         COLOR.text,
  margin:        '0 0 24px',
  letterSpacing: '-1.5px',
  lineHeight:    1.1,
};

/* ─────────────── H2 on dark (white text) ─────────────── */
export const H2_DARK = {
  ...H2,
  color: 'white',
};

/* ─────────────── Body text ─────────────── */
export const BODY = {
  fontSize:   '16px',
  color:      COLOR.muted,
  lineHeight: 1.8,
  margin:     '0 0 16px',
};

/* ─────────────── Button style presets ─────────────── */
export const BTN = {
  primary: {
    padding:       '14px 36px',
    borderRadius:  RADIUS.pill,
    border:        'none',
    cursor:        'pointer',
    background:    COLOR.grad.brand,
    color:         'white',
    fontSize:      '15px',
    fontWeight:    800,
    boxShadow:     SHADOW.brand.md,
    transition:    `transform ${DUR.base} ${EASING.out}, box-shadow ${DUR.base} ${EASING.out}`,
    letterSpacing: '-0.2px',
    display:       'inline-flex',
    alignItems:    'center',
    gap:           '8px',
  },

  ghost: {
    padding:        '14px 36px',
    borderRadius:   RADIUS.pill,
    cursor:         'pointer',
    background:     'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border:         '1.5px solid rgba(255,255,255,0.25)',
    color:          'white',
    fontSize:       '15px',
    fontWeight:     700,
    transition:     `background ${DUR.base} ${EASING.smooth}`,
    display:        'inline-flex',
    alignItems:     'center',
    gap:            '8px',
  },

  outline: {
    padding:       '14px 36px',
    borderRadius:  RADIUS.pill,
    border:        `2px solid ${COLOR.primary}`,
    background:    'transparent',
    color:         COLOR.primary,
    fontSize:      '15px',
    fontWeight:    800,
    cursor:        'pointer',
    transition:    `all ${DUR.base} ${EASING.smooth}`,
    display:       'inline-flex',
    alignItems:    'center',
    gap:           '8px',
  },

  white: {
    padding:       '14px 36px',
    borderRadius:  RADIUS.pill,
    border:        'none',
    cursor:        'pointer',
    background:    'white',
    color:         COLOR.primary,
    fontSize:      '15px',
    fontWeight:    800,
    boxShadow:     SHADOW.lg,
    transition:    `transform ${DUR.base} ${EASING.out}, box-shadow ${DUR.base} ${EASING.out}`,
    letterSpacing: '-0.2px',
    display:       'inline-flex',
    alignItems:    'center',
    gap:           '8px',
  },
};

/* ─────────────── Hover helpers (call in onMouse* handlers) ─────────────── */
export const hover = {
  lift: {
    on:  e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = SHADOW.brand.xl; },
    off: e => { e.currentTarget.style.transform = 'none';             e.currentTarget.style.boxShadow = SHADOW.brand.md; },
  },
  liftWhite: {
    on:  e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = SHADOW['2xl']; },
    off: e => { e.currentTarget.style.transform = 'none';             e.currentTarget.style.boxShadow = SHADOW.lg; },
  },
  glow: {
    on:  e => { e.currentTarget.style.borderColor = COLOR.primary; e.currentTarget.style.boxShadow = SHADOW.brand.sm; },
    off: e => { e.currentTarget.style.borderColor = COLOR.border;  e.currentTarget.style.boxShadow = 'none'; },
  },
  brighten: {
    on:  e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)',
    off: e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)',
  },
};

/* ─────────────── Nav height (used to offset sections) ─────────────── */
export const NAV_HEIGHT = 68;

/* ─────────────── Max content width ─────────────── */
export const MAX_WIDTH = '1200px';
export const MAX_WIDTH_WIDE = '1400px';

/* ─────────────── Section padding shorthand ─────────────── */
export const SECTION_PAD = '120px 5vw';
export const SECTION_PAD_SM = '80px 5vw';
