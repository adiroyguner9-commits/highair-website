/**
 * Header.jsx - Dream Site navbar (src/components/web_v2/)
 *
 * Layout (LTR grid):
 *   Left   → "HighAir" logo
 *   Center → Hebrew nav links
 *   Right  → WhatsApp CTA button
 *
 * · Solid white, sticky top, soft shadow
 * · Mobile: hamburger menu with dropdown
 * · Desktop: mega menu on "משלחות בעולם" hover
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SHADOW, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { EXPS } from '../../data/mockData.js';
import { ISRAEL_TRIPS } from '../../data/israelData.js';

/* ── Nav link keys (built dynamically in Header to allow language-aware hasMega) ── */

/* ── WhatsApp phone number ── */
const WA_NUMBER = '972555636975';
const WA_HREF   = `https://api.whatsapp.com/send?phone=${WA_NUMBER}`;

/* ── Flag SVGs (inline, no CDN dependency) ── */
function FlagIL({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', flexShrink:0 }}>
      <defs><clipPath id="cl-il"><circle cx="50" cy="50" r="50"/></clipPath></defs>
      <g clipPath="url(#cl-il)">
        <rect width="100" height="100" fill="#FFF"/>
        <rect width="100" height="14" y="19" fill="#0038B8"/>
        <rect width="100" height="14" y="67" fill="#0038B8"/>
        {/* Star of David - two outlined equilateral triangles */}
        <polygon points="50,36 64,59 36,59" fill="none" stroke="#0038B8" strokeWidth="4.5"/>
        <polygon points="50,64 64,41 36,41" fill="none" stroke="#0038B8" strokeWidth="4.5"/>
      </g>
    </svg>
  );
}

function FlagUS({ size = 22 }) {
  const sh = 100 / 13; /* stripe height */
  const stars = [];
  for (let row = 0; row < 9; row++) {
    const even   = row % 2 === 0;
    const count  = even ? 6 : 5;
    const startX = even ? 3.5 : 7;
    const y      = 3.5 + row * 5.9;
    for (let col = 0; col < count; col++) {
      stars.push(<circle key={`${row}-${col}`} cx={startX + col * 7} cy={y} r="1.6" fill="#FFF"/>);
    }
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', flexShrink:0 }}>
      <defs><clipPath id="cl-us"><circle cx="50" cy="50" r="50"/></clipPath></defs>
      <g clipPath="url(#cl-us)">
        {Array.from({ length: 13 }, (_, i) => (
          <rect key={i} x="0" y={i * sh} width="100" height={sh + 0.5} fill={i % 2 === 0 ? '#B22234' : '#FFF'}/>
        ))}
        <rect x="0" y="0" width="42" height={7 * sh} fill="#3C3B6E"/>
        {stars}
      </g>
    </svg>
  );
}

/* ── Language Switcher ── */
const LANGS = [
  { code: 'he', Flag: FlagIL, label: 'Hebrew' },
  { code: 'en', Flag: FlagUS, label: 'English' },
];

function LangSwitcher() {
  const { i18n } = useTranslation();
  const isEn      = i18n.language === 'en';
  const [open, setOpen] = useState(false);
  const wrapRef   = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function switchLang(lng) {
    i18n.changeLanguage(lng);
    localStorage.setItem('HA_lang', lng);
    setOpen(false);
    /* Subdomain redirect only on the production custom domain */
    const host = window.location.hostname;
    if (host.includes('highair-expeditions.com')) {
      if (lng === 'en' && !host.startsWith('en.')) {
        window.location.href = window.location.href.replace(host, 'en.' + host.replace('www.', ''));
      } else if (lng === 'he' && host.startsWith('en.')) {
        window.location.href = window.location.href.replace('en.', '');
      }
    }
  }

  const current = LANGS.find(l => l.code === (isEn ? 'en' : 'he'));

  return (
    <div ref={wrapRef} style={{ position: 'relative', userSelect: 'none' }}>

      {/* Trigger button - flag only */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display:     'flex',
          alignItems:  'center',
          justifyContent: 'center',
          background:  open ? '#F0EDFB' : '#F8F6FF',
          border:      '1px solid #E8E4F5',
          borderRadius:'10px',
          padding:     '6px',
          cursor:      'pointer',
          transition:  'background 0.15s ease',
        }}
      >
        <current.Flag size={24} />
      </button>

      {/* Dropdown - aligned to the button edge closest to the screen center */}
      {open && (
        <div style={{
          position:     'absolute',
          top:          'calc(100% + 8px)',
          ...(isEn ? { right: 0 } : { left: 0 }),
          background:   '#FFFFFF',
          borderRadius: '14px',
          boxShadow:    '0 8px 32px rgba(10,8,24,0.14), 0 2px 8px rgba(10,8,24,0.08)',
          border:       '1px solid #F0EEF8',
          overflow:     'hidden',
          minWidth:     '158px',
          zIndex:       2000,
          direction:    'ltr',
        }}>
          {LANGS.map((lang, idx) => {
            const isActive = lang.code === (isEn ? 'en' : 'he');
            return (
              <button
                key={lang.code}
                onClick={() => switchLang(lang.code)}
                style={{
                  display:     'flex',
                  alignItems:  'center',
                  gap:         '12px',
                  width:       '100%',
                  padding:     '11px 16px',
                  background:  isActive ? '#F5F2FF' : 'transparent',
                  border:      'none',
                  borderTop:   idx > 0 ? '1px solid #F5F3FF' : 'none',
                  cursor:      'pointer',
                  textAlign:   'left',
                  transition:  'background 0.12s ease',
                }}
              >
                <lang.Flag size={26} />
                <span style={{
                  fontSize:   '14px',
                  fontWeight: isActive ? 700 : 400,
                  color:      isActive ? '#5B21B6' : '#1E1B35',
                  fontFamily: "'Ploni', sans-serif",
                }}>
                  {lang.label}
                </span>
                {isActive && (
                  <span style={{ marginLeft: 'auto', color: '#7C3AED', fontSize: '12px' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Smooth scroll with header offset ── */
function scrollToSection(href) {
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ── Mega Menu ── */
function MegaMenu({ type, onClose, onKeepOpen }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const dir = isEn ? 'ltr' : 'rtl';

  const MEGA_TREKS = [
    { label: t('explorer.continents.africa'), flag: '🌍', expIds: [4]          },
    { label: t('explorer.continents.europe'), flag: '🏔️', expIds: [2, 3]       },
    { label: t('explorer.continents.asia'),   flag: '🌏', expIds: [6, 7, 8]    },
  ];
  const MEGA_CLIMBS = [
    { label: t('explorer.continents.africa'),       flag: '🌍', expIds: [10, 11]         },
    { label: t('explorer.continents.europe'),       flag: '🏔️', expIds: [5, 9]           },
    { label: t('explorer.continents.asia'),         flag: '🌏', expIds: [12, 13, 14, 16]  },
    { label: t('explorer.continents.southAmerica'), flag: '🌎', expIds: [15]              },
  ];

  /* Israel trips – rendered separately (flat list, israel route) */
  if (type === 'israel') {
    return (
      <div
        onMouseEnter={onKeepOpen}
        onMouseLeave={onClose}
        style={{
          position:   'fixed',
          top:        '80px',
          left:       0,
          right:      0,
          zIndex:     998,
          background: '#FFFFFF',
          boxShadow:  '0 12px 40px rgba(0,0,0,0.10)',
          borderTop:  '1px solid #F0F0F0',
          padding:    '28px 5%',
          direction:  dir,
        }}
      >
        <div style={{
          maxWidth:            '1280px',
          margin:              '0 auto',
          display:             'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
        }}>
          {/* Israel column — column 1 = leftmost in LTR, rightmost in RTL (grid axis flips with direction) */}
          <div style={{ padding: '0 24px', gridColumn: 1 }}>
            <div style={{
              marginBottom:  '10px',
              paddingBottom: '10px',
              borderBottom:  '1px solid #EEEEEE',
              fontFamily:    "'Ploni', sans-serif",
              fontSize:      '14px',
              fontWeight:    800,
              color:         '#6D28D9',
            }}>
              {isEn ? 'Israel' : 'ישראל'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {ISRAEL_TRIPS.map(trip => (
                <IsraelMegaItem key={trip.id} trip={trip} onClose={onClose} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const MEGA_CONTINENTS_I18N = type === 'treks' ? MEGA_TREKS : MEGA_CLIMBS;

  return (
    <div
      onMouseEnter={onKeepOpen}
      onMouseLeave={onClose}
      style={{
        position:   'fixed',
        top:        '80px',
        left:       0,
        right:      0,
        zIndex:     998,
        background: '#FFFFFF',
        boxShadow:  '0 12px 40px rgba(0,0,0,0.10)',
        borderTop:  '1px solid #F0F0F0',
        padding:    '32px 5% 28px',
        direction:  dir,
      }}
    >
      <div style={{
        maxWidth:            '1280px',
        margin:              '0 auto',
        display:             'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap:                 '0',
      }}>
        {MEGA_CONTINENTS_I18N.map((cont, ci) => {
          const exps = cont.expIds.map(id => EXPS.find(e => e.id === id)).filter(Boolean);
          return (
            <div key={cont.label} style={{
              padding:     '0 24px',
              borderRight: ci < MEGA_CONTINENTS_I18N.length - 1 ? '1px solid #EDE9FE' : 'none',
            }}>
              {/* Continent header */}
              <div style={{
                marginBottom:  '10px',
                paddingBottom: '10px',
                borderBottom:  '1px solid #EEEEEE',
              }}>
                <span style={{
                  fontFamily:    "'Ploni', sans-serif",
                  fontSize:      '14px',
                  fontWeight:    800,
                  color:         '#6D28D9',
                  letterSpacing: '0.01em',
                }}>
                  {cont.label}
                </span>
              </div>

              {/* Expedition links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {exps.map(exp => (
                  <MegaItem key={exp.id} exp={exp} onClose={onClose} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MegaItem({ exp, onClose }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { navigate(`/expedition/${exp.slug}`); onClose(); }}
      style={{
        display:      'block',
        padding:      '8px 10px',
        borderRadius: '8px',
        border:       'none',
        background:   hovered ? '#F5F3FF' : 'transparent',
        cursor:       'pointer',
        textAlign:    isEn ? 'left' : 'right',
        direction:    isEn ? 'ltr' : 'rtl',
        width:        '100%',
        fontFamily:   "'Ploni', sans-serif",
        fontSize:     '14px',
        fontWeight:   500,
        color:        hovered ? '#4C1D95' : '#3D3B5A',
        transition:   'background 0.15s ease, color 0.15s ease',
      }}
    >
      {isEn ? (exp.nameEn || exp.name) : exp.nameHe}
    </button>
  );
}

function IsraelMegaItem({ trip, onClose }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { navigate(`/israel/${trip.slug}`); onClose(); }}
      style={{
        display:      'block',
        padding:      '8px 10px',
        borderRadius: '8px',
        border:       'none',
        background:   hovered ? '#F5F3FF' : 'transparent',
        cursor:       'pointer',
        textAlign:    isEn ? 'left' : 'right',
        direction:    isEn ? 'ltr' : 'rtl',
        width:        '100%',
        fontFamily:   "'Ploni', sans-serif",
        fontSize:     '14px',
        fontWeight:   500,
        color:        hovered ? '#4C1D95' : '#3D3B5A',
        transition:   'background 0.15s ease, color 0.15s ease',
      }}
    >
      {isEn ? (trip.nameEn || trip.name) : trip.name}
    </button>
  );
}

/* ── Single nav link ── */
function NavLink({ label, href, isPage, hasMega, onClick, onNavigate, onMegaEnter }) {
  const [hovered, setHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function handleClick(e) {
    e.preventDefault();
    if (isPage) {
      navigate(href);
    } else if (location.pathname === '/') {
      scrollToSection(href);
    } else {
      onNavigate?.(href);
    }
    onClick?.();
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={() => { setHovered(true); if (hasMega) onMegaEnter?.(); }}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:       'relative',
        fontFamily:     "'Ploni', sans-serif",
        fontSize:       FS.body,
        fontWeight:     500,
        color:          hovered ? '#0A0818' : '#3D3D3D',
        textDecoration: 'none',
        letterSpacing:  '0.01em',
        paddingBottom:  '3px',
        transition:     'color 0.2s ease',
      }}
    >
      {label}
      {hasMega && (
        <span style={{
          fontSize:   '10px',
          marginRight: '3px',
          opacity:    0.5,
          display:    'inline-block',
          transform:  'translateY(-1px)',
        }}>▾</span>
      )}

      {/* Subtle dark underline on hover */}
      <span style={{
        position:        'absolute',
        bottom:          0,
        left:            0,
        right:           0,
        height:          '1.5px',
        background:      '#0A0818',
        borderRadius:    '2px',
        transform:       hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'center',
        transition:      'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
      }} />
    </a>
  );
}

/* ── Mobile Menu ── */
function MobileMenu({ navigate, closeMenu, handleNavigation, links }) {
  const [openMegaKey, setOpenMegaKey] = useState(null);
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const MEGA_BY_TYPE = {
    treks: [
      { label: t('explorer.continents.africa'), flag: '🌍', expIds: [4]          },
      { label: t('explorer.continents.europe'), flag: '🏔️', expIds: [2, 3]       },
      { label: t('explorer.continents.asia'),   flag: '🌏', expIds: [6, 7, 8]    },
    ],
    climbs: [
      { label: t('explorer.continents.africa'),       flag: '🌍', expIds: [10, 11]         },
      { label: t('explorer.continents.europe'),       flag: '🏔️', expIds: [5, 9]           },
      { label: t('explorer.continents.asia'),         flag: '🌏', expIds: [12, 13, 14, 16]  },
      { label: t('explorer.continents.southAmerica'), flag: '🌎', expIds: [15]              },
    ],
    israel: [
      { label: isEn ? 'Israel' : 'ישראל', isIsrael: true, trips: ISRAEL_TRIPS },
    ],
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Navigation menu' : 'תפריט ניווט'}
      style={{
        position:   'fixed',
        top:        '80px',
        left:       0,
        right:      0,
        background: '#FFFFFF',
        boxShadow:  '0 8px 24px rgba(0,0,0,0.12)',
        zIndex:     999,
        padding:    '8px 5% 20px',
        direction:  isEn ? 'ltr' : 'rtl',
        borderTop:  '1px solid #F0EEF8',
        maxHeight:  'calc(100vh - 80px)',
        overflowY:  'auto',
      }}>

      {/* Lang switcher — inline pills (no dropdown on mobile) */}
      <div style={{ padding: '10px 0', borderBottom: '1px solid #F0EEF8', display: 'flex', gap: '8px', justifyContent: isEn ? 'flex-start' : 'flex-end' }}>
        {LANGS.map(lang => {
          const active = lang.code === (isEn ? 'en' : 'he');
          return (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                localStorage.setItem('HA_lang', lang.code);
                const host = window.location.hostname;
                if (host.includes('highair-expeditions.com')) {
                  if (lang.code === 'en' && !host.startsWith('en.')) {
                    window.location.href = window.location.href.replace(host, 'en.' + host.replace('www.', ''));
                  } else if (lang.code === 'he' && host.startsWith('en.')) {
                    window.location.href = window.location.href.replace('en.', '');
                  }
                }
              }}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '7px',
                padding:        '6px 14px',
                borderRadius:   '50px',
                border:         `1.5px solid ${active ? '#6D28D9' : '#E8E4F5'}`,
                background:     active ? '#F5F0FF' : '#FAFAFA',
                cursor:         'pointer',
                fontFamily:     "'Ploni', sans-serif",
                fontSize:       '14px',
                fontWeight:     active ? 700 : 400,
                color:          active ? '#5B21B6' : '#6B6B8A',
                transition:     'all 0.15s ease',
              }}
            >
              <lang.Flag size={20} />
              {lang.label}
            </button>
          );
        })}
      </div>

      {links.map(link => {
        if (link.hasMega) {
          const isOpen = openMegaKey === link.key;
          const continents = MEGA_BY_TYPE[link.megaType] || [];
          return (
            <div key={link.key}>
              {/* Accordion row */}
              <button
                onClick={() => setOpenMegaKey(prev => prev === link.key ? null : link.key)}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'space-between',
                  width:          '100%',
                  background:     'none',
                  border:         'none',
                  borderBottom:   '1px solid #F0EEF8',
                  padding:        '14px 0',
                  fontFamily:     "'Ploni', sans-serif",
                  fontSize:       FS.btn,
                  fontWeight:     500,
                  color:          '#0A0818',
                  cursor:         'pointer',
                  textAlign:      isEn ? 'left' : 'right',
                  direction:      isEn ? 'ltr' : 'rtl',
                }}
              >
                {link.label}
                <span style={{
                  fontSize:   '13px',
                  color:      '#6D28D9',
                  transition: 'transform 0.2s ease',
                  transform:  isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  display:    'inline-block',
                }}>▾</span>
              </button>

              {/* Accordion content */}
              {isOpen && (
                <div style={{ paddingBottom: '8px', paddingRight: isEn ? 0 : '8px', paddingLeft: isEn ? '8px' : 0 }}>
                  {continents.map(cont => {
                    if (cont.isIsrael) {
                      return (
                        <div key={cont.label} style={{ marginTop: '12px' }}>
                          <div style={{
                            fontFamily:    "'Ploni', sans-serif",
                            fontSize:      '11px',
                            fontWeight:    800,
                            color:         '#6D28D9',
                            letterSpacing: '0.05em',
                            padding:       '4px 10px',
                            marginBottom:  '4px',
                          }}>
                            {cont.label}
                          </div>
                          {cont.trips.map(trip => (
                            <a
                              key={trip.id}
                              href={`/israel/${trip.slug}`}
                              onClick={e => { e.preventDefault(); navigate(`/israel/${trip.slug}`); closeMenu(); }}
                              style={{
                                display:        'block',
                                padding:        '8px 10px',
                                fontFamily:     "'Ploni', sans-serif",
                                fontSize:       '14px',
                                fontWeight:     400,
                                color:          '#3D3B5A',
                                textDecoration: 'none',
                                borderRadius:   '8px',
                              }}
                            >
                              {isEn ? (trip.nameEn || trip.name) : trip.name}
                            </a>
                          ))}
                        </div>
                      );
                    }
                    const exps = cont.expIds.map(id => EXPS.find(e => e.id === id)).filter(Boolean);
                    return (
                      <div key={cont.label} style={{ marginTop: '12px' }}>
                        <div style={{
                          fontFamily:    "'Ploni', sans-serif",
                          fontSize:      '11px',
                          fontWeight:    800,
                          color:         '#6D28D9',
                          letterSpacing: '0.05em',
                          padding:       '4px 10px',
                          marginBottom:  '4px',
                        }}>
                          {cont.label}
                        </div>
                        {exps.map(exp => (
                          <a
                            key={exp.id}
                            href={`/expedition/${exp.slug}`}
                            onClick={e => { e.preventDefault(); navigate(`/expedition/${exp.slug}`); closeMenu(); }}
                            style={{
                              display:        'block',
                              padding:        '8px 10px',
                              fontFamily:     "'Ploni', sans-serif",
                              fontSize:       '14px',
                              fontWeight:     400,
                              color:          '#3D3B5A',
                              textDecoration: 'none',
                              borderRadius:   '8px',
                            }}
                          >
                            {isEn ? (exp.nameEn || exp.name) : exp.nameHe}
                          </a>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        return (
          <a
            key={link.key}
            href={link.href}
            onClick={e => {
              e.preventDefault();
              if (link.isPage) { navigate(link.href); }
              else { handleNavigation(link.href); }
              closeMenu();
            }}
            style={{
              display:        'block',
              fontFamily:     "'Ploni', sans-serif",
              fontSize:       FS.btn,
              fontWeight:     500,
              color:          '#0A0818',
              textDecoration: 'none',
              padding:        '14px 0',
              borderBottom:   '1px solid #F0EEF8',
              letterSpacing:  '0.01em',
            }}
          >
            {link.label}
          </a>
        );
      })}

      {/* App login button */}
      <a
        href="https://app.highair-expeditions.com"
        target="_blank"
        rel="noopener noreferrer"
        onClick={closeMenu}
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '8px',
          marginTop:      '16px',
          padding:        '12px 24px',
          borderRadius:   '50px',
          background:     '#6D28D9',
          color:          '#FFFFFF',
          fontFamily:     "'Ploni', sans-serif",
          fontSize:       FS.btn,
          fontWeight:     600,
          textDecoration: 'none',
          width:          '100%',
          direction:      isEn ? 'ltr' : 'rtl',
        }}
      >
        {isEn ? 'Customer Login →' : 'כניסה ללקוחות רשומים ←'}
      </a>
    </div>
  );
}

/* ── Search Modal ── */
function SearchModal({ onClose }) {
  const [query, setQuery]   = useState('');
  const { i18n }            = useTranslation();
  const isRtl               = i18n.language !== 'en';
  const navigate            = useNavigate();
  const inputRef            = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 60); }, []);
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const results = query.trim().length < 1 ? [] : EXPS.filter(exp => {
    const q = query.toLowerCase();
    return (
      exp.name?.toLowerCase().includes(q)    ||
      exp.nameHe?.includes(query)            ||
      exp.nameEn?.toLowerCase().includes(q)  ||
      exp.country?.toLowerCase().includes(q) ||
      exp.countryHe?.includes(query)
    );
  }).slice(0, 7);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(10,8,24,0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', paddingTop: '100px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '620px', padding: '0 20px' }}
      >
        {/* Input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: '#FFFFFF', borderRadius: '16px',
          padding: '14px 18px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={isRtl ? 'חפשו הר, מדינה, יעד...' : 'Search mountain, country, destination...'}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: '17px', fontFamily: "'Ploni', sans-serif",
              color: '#0A0818', background: 'transparent',
              direction: 'auto',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9CA3AF', fontSize: '18px', padding: '0 2px',
            }}>✕</button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div style={{
            marginTop: '8px', background: '#FFFFFF',
            borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}>
            {results.map((exp, idx) => (
              <button
                key={exp.id}
                onClick={() => { navigate(`/expeditions/${exp.slug}`); onClose(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  width: '100%', padding: '13px 18px',
                  background: 'transparent', border: 'none',
                  borderTop: idx > 0 ? '1px solid #F5F3FF' : 'none',
                  cursor: 'pointer', textAlign: isRtl ? 'right' : 'left',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8F6FF'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{exp.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '15px', fontWeight: 600,
                    color: '#0A0818', fontFamily: "'Ploni', sans-serif",
                  }}>
                    {isRtl ? exp.nameHe : (exp.nameEn || exp.name)}
                  </div>
                  <div style={{
                    fontSize: '13px', color: '#6B6B8A',
                    fontFamily: "'Ploni', sans-serif", marginTop: '1px',
                  }}>
                    {isRtl ? exp.countryHe : exp.country} · {exp.elev}
                  </div>
                </div>
                <span style={{ fontSize: '13px', color: '#A78BFA', flexShrink: 0 }}>
                  {isRtl ? exp.typeHe : exp.type}
                </span>
              </button>
            ))}
          </div>
        )}

        {query.trim().length > 0 && results.length === 0 && (
          <p style={{
            textAlign: 'center', marginTop: '28px',
            color: 'rgba(255,255,255,0.55)', fontFamily: "'Ploni', sans-serif",
            fontSize: '16px',
          }}>
            {isRtl ? 'לא נמצאו תוצאות' : 'No results found'}
          </p>
        )}

        <p style={{
          textAlign: 'center', marginTop: '20px',
          color: 'rgba(255,255,255,0.3)', fontFamily: "'Ploni', sans-serif",
          fontSize: '13px',
        }}>
          {isRtl ? 'לחצו ESC לסגירה' : 'Press ESC to close'}
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════ */
export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [megaType, setMegaType]     = useState(null); // null | 'treks' | 'climbs'
  const megaTimeout = useRef(null);
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dir   = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';
  const isEn  = !isRtl;

  /* Build translated links array (israelTrips mega only in Hebrew) */
  const LINK_DEFS = [
    { key: 'home',        href: '#hero'                                              },
    { key: 'climbs',      href: '#expeditions', hasMega: true, megaType: 'climbs'   },
    { key: 'treks',       href: '#expeditions', hasMega: true, megaType: 'treks'    },
    { key: 'israelTrips', href: '#israel', hasMega: true, megaType: 'israel' },
    { key: 'annualPlan',  href: '/annual-plan', isPage: true                        },
    { key: 'blog',        href: '/blog',        isPage: true                        },
    { key: 'contact',     href: '#contact'                                          },
  ];
  const LINKS = LINK_DEFS.map(def => ({ ...def, label: t(`nav.${def.key}`) }));

  const closeMenu = () => setMenuOpen(false);

  function handleNavigation(href) {
    navigate('/');
    setTimeout(() => scrollToSection(href), 100);
  }

  function openMega(type) {
    clearTimeout(megaTimeout.current);
    setMegaType(type);
  }

  function keepMegaOpen() {
    clearTimeout(megaTimeout.current);
  }

  function closeMega() {
    megaTimeout.current = setTimeout(() => setMegaType(null), 120);
  }

  return (
    <>
    <header style={{
      position:  'fixed',
      top:       0,
      left:      0,
      right:     0,
      zIndex:    1000,
      width:     '100%',
      boxSizing: 'border-box',
      height:    '80px',
      padding:   '0 5%',
      background: '#FFFFFF',
      boxShadow:  '0 4px 20px rgba(0,0,0,0.08)',
      display:             'grid',
      gridTemplateColumns: isMobile ? 'auto 1fr' : '1fr auto 1fr',
      alignItems:          'center',
      direction:           dir,
    }}>

      {/* ── Skip to content link (keyboard accessibility) ── */}
      <a
        href="#main-content"
        style={{
          position:  'absolute',
          top:       '-100px',
          right:     0,
          background: '#6D28D9',
          color:     '#fff',
          padding:   '8px 16px',
          fontFamily: "'Ploni', sans-serif",
          fontSize:  '14px',
          fontWeight: 700,
          textDecoration: 'none',
          zIndex:    9999,
          transition: 'top 0.2s',
        }}
        onFocus={e => { e.currentTarget.style.top = '0'; }}
        onBlur={e => { e.currentTarget.style.top = '-100px'; }}
      >
        {t('nav.skipToContent')}
      </a>

      {isMobile ? (
        /* ══ MOBILE: Hamburger (right) | Logo (left) ══ */
        <>
          <div style={{ justifySelf: 'start' }}>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={isEn ? (menuOpen ? 'Close menu' : 'Open menu') : (menuOpen ? 'סגור תפריט' : 'פתח תפריט')}
              aria-expanded={menuOpen}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px', color: '#0A0818',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
          <div style={{ justifySelf: 'end' }}>
            <img
              src="/Logo.png"
              alt="HighAir Expeditions"
              onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
              style={{ height: '60px', width: 'auto', display: 'block', objectFit: 'contain', cursor: 'pointer' }}
            />
          </div>
        </>
      ) : (
        /* ══ DESKTOP: Logo (right) | Nav (center) | WA button (left) ══ */
        <>
          <div style={{ justifySelf: 'start' }}>
            <img
              src="/Logo.png"
              alt="HighAir Expeditions"
              onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
              style={{ height: '64px', width: 'auto', display: 'block', objectFit: 'contain', cursor: 'pointer' }}
            />
          </div>
          <nav
            onMouseLeave={closeMega}
            style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center' }}
          >
            {LINKS.map(link => (
              <NavLink
                key={link.key}
                label={link.label}
                href={link.href}
                isPage={link.isPage}
                hasMega={link.hasMega}
                onNavigate={handleNavigation}
                onMegaEnter={link.hasMega ? () => openMega(link.megaType) : undefined}
              />
            ))}
          </nav>
          <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Search icon button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label={isEn ? 'Search' : 'חיפוש'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '40px', height: '40px', borderRadius: '10px',
                background: '#F8F6FF', border: '1px solid #E8E4F5',
                cursor: 'pointer', color: '#5B21B6',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F0EDFB'}
              onMouseLeave={e => e.currentTarget.style.background = '#F8F6FF'}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <LangSwitcher />
          </div>
        </>
      )}

      {/* ── Mega Menu (desktop) ── */}
      {!isMobile && megaType && (
        <MegaMenu type={megaType} onClose={closeMega} onKeepOpen={keepMegaOpen} />
      )}

      {/* ── Mobile dropdown menu ── */}
      {isMobile && menuOpen && (
        <MobileMenu
          navigate={navigate}
          closeMenu={closeMenu}
          handleNavigation={handleNavigation}
          links={LINKS}
        />
      )}

    </header>

    {/* ── Search Modal (rendered outside header to escape stacking context) ── */}
    {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
  </>
  );
}
