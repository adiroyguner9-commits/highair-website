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

import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SHADOW, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { EXPS } from '../../data/mockData.js';

/* ── Continents + expedition IDs ── */
const MEGA_CONTINENTS = [
  { label: 'אפריקה',      flag: '🌍', expIds: [4, 10, 11] },
  { label: 'אירופה',      flag: '🏔️', expIds: [2, 3, 5, 9] },
  { label: 'אסיה',        flag: '🌏', expIds: [6, 7, 8, 12, 13, 14, 16] },
  { label: 'דרום אמריקה', flag: '🌎', expIds: [15] },
];

/* ── Nav links ── */
const LINKS = [
  { label: 'דף בית',        href: '#hero'         },
  { label: 'טרקים וטיפוסים בעולם', href: '#expeditions', hasMega: true },
  { label: 'טרקים בארץ',          href: '#israel'       },
  { label: 'תכנית שנתית',  href: '/annual-plan', isPage: true },
  { label: 'צור קשר',      href: '#contact'      },
];

/* ── WhatsApp phone number ── */
const WA_NUMBER = '972555636975';
const WA_HREF   = `https://api.whatsapp.com/send?phone=${WA_NUMBER}`;

/* ── Smooth scroll with header offset ── */
function scrollToSection(href) {
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ── Mega Menu ── */
function MegaMenu({ onClose, onEnter }) {
  const navigate = useNavigate();

  return (
    <div
      onMouseEnter={onEnter}
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
        direction:  'rtl',
      }}
    >
      <div style={{
        maxWidth:            '1280px',
        margin:              '0 auto',
        display:             'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap:                 '0',
      }}>
        {MEGA_CONTINENTS.map((cont, ci) => {
          const exps = cont.expIds.map(id => EXPS.find(e => e.id === id)).filter(Boolean);
          return (
            <div key={cont.label} style={{
              padding:     '0 24px',
              borderRight: ci < MEGA_CONTINENTS.length - 1 ? '1px solid #EDE9FE' : 'none',
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
        textAlign:    'right',
        direction:    'rtl',
        width:        '100%',
        fontFamily:   "'Ploni', sans-serif",
        fontSize:     '14px',
        fontWeight:   500,
        color:        hovered ? '#4C1D95' : '#3D3B5A',
        transition:   'background 0.15s ease, color 0.15s ease',
      }}
    >
      {exp.nameHe}
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
function MobileMenu({ navigate, closeMenu, handleNavigation }) {
  const [expeditionsOpen, setExpeditionsOpen] = useState(false);

  return (
    <div style={{
      position:   'fixed',
      top:        '80px',
      left:       0,
      right:      0,
      background: '#FFFFFF',
      boxShadow:  '0 8px 24px rgba(0,0,0,0.12)',
      zIndex:     999,
      padding:    '8px 5% 20px',
      direction:  'rtl',
      borderTop:  '1px solid #F0EEF8',
      maxHeight:  'calc(100vh - 80px)',
      overflowY:  'auto',
    }}>
      {LINKS.map(link => {
        if (link.hasMega) {
          return (
            <div key={link.label}>
              {/* Accordion row */}
              <button
                onClick={() => setExpeditionsOpen(prev => !prev)}
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
                  textAlign:      'right',
                  direction:      'rtl',
                }}
              >
                {link.label}
                <span style={{
                  fontSize:   '13px',
                  color:      '#6D28D9',
                  transition: 'transform 0.2s ease',
                  transform:  expeditionsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  display:    'inline-block',
                }}>▾</span>
              </button>

              {/* Accordion content */}
              {expeditionsOpen && (
                <div style={{ paddingBottom: '8px', paddingRight: '8px' }}>
                  {MEGA_CONTINENTS.map(cont => {
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
                            {exp.nameHe}
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
            key={link.label}
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

      {/* WA button */}
      <a
        href={WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        onClick={closeMenu}
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            '8px',
          marginTop:      '16px',
          padding:        '12px 24px',
          borderRadius:   '50px',
          background:     '#25D366',
          color:          '#FFFFFF',
          fontFamily:     "'Ploni', sans-serif",
          fontSize:       FS.btn,
          fontWeight:     600,
          textDecoration: 'none',
          direction:      'ltr',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        צור קשר
      </a>
    </div>
  );
}

/* ════════════════════════════════════════ */
export default function Header() {
  const [waBtnHovered, setWaBtnHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimeout = useRef(null);
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  function handleNavigation(href) {
    navigate('/');
    setTimeout(() => scrollToSection(href), 100);
  }

  function openMega() {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  }

  function closeMega() {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 120);
  }

  return (
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
      display:        'grid',
      gridTemplateColumns: isMobile ? '1fr auto 1fr' : '1fr auto 1fr',
      alignItems:     'center',
      direction:      'rtl',
    }}>

      {/* ── Col 1 (right in RTL): Logo or Hamburger on mobile ── */}
      <div style={{ justifySelf: 'start' }}>
        {isMobile ? (
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="תפריט ניווט"
            style={{
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              padding:    '8px',
              fontSize:   '28px',
              lineHeight: 1,
              color:      '#0A0818',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        ) : (
          <img
            src="/Logo.png"
            alt="HighAir Expeditions"
            style={{ height: '64px', width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        )}
      </div>

      {/* ── Col 2: Logo on mobile, Nav on desktop ── */}
      {isMobile ? (
        <div style={{ justifySelf: 'center' }}>
          <img
            src="/Logo.png"
            alt="HighAir Expeditions"
            style={{ height: '68px', width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </div>
      ) : (
        <nav
          onMouseLeave={closeMega}
          style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center' }}
        >
          {LINKS.map(link => (
            <NavLink
              key={link.label}
              label={link.label}
              href={link.href}
              isPage={link.isPage}
              hasMega={link.hasMega}
              onNavigate={handleNavigation}
              onMegaEnter={link.hasMega ? openMega : undefined}
            />
          ))}
        </nav>
      )}

      {/* ── Col 3: WhatsApp CTA ── */}
      <div style={{ justifySelf: 'end' }}>
        {isMobile ? (
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '50%',
              background: '#25D366', color: '#FFFFFF', textDecoration: 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        ) : (
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setWaBtnHovered(true)}
            onMouseLeave={() => setWaBtnHovered(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 22px', borderRadius: '50px',
              background: waBtnHovered ? '#1ebe5d' : '#25D366',
              color: '#FFFFFF', fontFamily: "'Ploni', sans-serif",
              fontSize: FS.btn, fontWeight: 600, textDecoration: 'none',
              letterSpacing: '0.01em',
              boxShadow: waBtnHovered ? '0 6px 20px rgba(37,211,102,0.45)' : '0 3px 12px rgba(37,211,102,0.30)',
              transform: waBtnHovered ? 'translateY(-1px)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
              whiteSpace: 'nowrap', direction: 'ltr',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            צור קשר
          </a>
        )}
      </div>

      {/* ── Mega Menu (desktop) ── */}
      {!isMobile && megaOpen && (
        <MegaMenu onClose={closeMega} onEnter={openMega} />
      )}

      {/* ── Mobile dropdown menu ── */}
      {isMobile && menuOpen && (
        <MobileMenu
          navigate={navigate}
          closeMenu={closeMenu}
          handleNavigation={handleNavigation}
        />
      )}

    </header>
  );
}
