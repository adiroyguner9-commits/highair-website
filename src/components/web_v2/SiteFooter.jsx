/**
 * SiteFooter.jsx - Dream Site footer (web_v2)
 * 4 columns: טרקים בעולם · טיפוסים בעולם · טרקים בארץ · מידע
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLOR, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { EXPS } from '../../data/mockData.js';

/* ── Expeditions by type, manually ordered ── */
const TREK_IDS  = [7, 8, 6, 3, 4];
const CLIMB_IDS = [10, 11, 5, 9, 13, 14, 12, 16, 15, 2];
const TREKS  = TREK_IDS.map(id => EXPS.find(e => e.id === id)).filter(Boolean);
const CLIMBS = CLIMB_IDS.map(id => EXPS.find(e => e.id === id)).filter(Boolean);

const ISRAEL_TRIPS = [
  { label: 'הר חרמון', href: '/israel/hermon' },
];

const INFO_LINKS = [
  { label: 'מדיניות ביטולים',      href: '/cancellation'  },
  { label: 'תקנון ותנאי שימוש',   href: '/terms'         },
  { label: 'מדיניות פרטיות',      href: '/privacy'       },
  { label: 'הצהרת נגישות',        href: '/accessibility' },
];

const WA_HREF = 'https://api.whatsapp.com/send?phone=972555636975';

/* ── Single link ── */
function FooterLink({ label, href, isExternal }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  function handleClick(e) {
    if (isExternal) return;
    e.preventDefault();
    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo(0, 0);
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily:     "'Ploni', sans-serif",
        fontSize:       FS.sm,
        fontWeight:     400,
        color:          hovered ? '#0A0818' : '#6B6B8A',
        textDecoration: 'none',
        display:        'block',
        marginBottom:   '10px',
        transition:     'color 0.18s ease',
        letterSpacing:  '0.01em',
      }}
    >
      {label}
    </a>
  );
}

/* ── Column heading ── */
function ColHeading({ children }) {
  return (
    <div style={{
      fontFamily:    "'Ploni', sans-serif",
      fontSize:      FS.sm,
      fontWeight:    700,
      color:         '#0A0818',
      letterSpacing: '0.02em',
      marginBottom:  '18px',
      paddingBottom: '10px',
      borderBottom:  '2px solid #E2E0F0',
    }}>
      {children}
    </div>
  );
}

export default function SiteFooter() {
  const { isMobile, isTablet } = useBreakpoint();

  const gridCols = isMobile
    ? '1fr 1fr'
    : isTablet
      ? '1fr 1fr 1fr 1fr'
      : '1.4fr 1fr 1fr 1fr 1fr';

  return (
    <footer style={{
      background:  '#FFFFFF',
      padding:     '48px 5% 28px',
      boxSizing:   'border-box',
      direction:   'rtl',
      borderTop:   '1px solid #E2E0F0',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Top row ── */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: gridCols,
          gap:                 isMobile ? '32px 24px' : '48px',
          alignItems:          'start',
          marginBottom:        '52px',
          direction:           'rtl',
          textAlign:           'right',
        }}>

          {/* Logo + desc + social */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* Social icons — first on mobile */}
            <div style={{ order: isMobile ? 1 : 3, display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: isMobile ? '20px' : 0 }}>
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/highair_expeditions/', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                { label: 'Facebook', href: 'https://www.facebook.com/highair.expeditions', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                { label: 'WhatsApp', href: WA_HREF, icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
                { label: 'YouTube', href: 'https://www.youtube.com/@HighAirExpeditions', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                { label: 'TikTok', href: 'https://www.tiktok.com/@highair_expeditions', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg> },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{
                    width: isMobile ? '44px' : '36px', height: isMobile ? '44px' : '36px',
                    borderRadius: RADIUS.sm, background: '#FFFFFF', border: '1px solid #DDD9F0',
                    color: '#6B6B8A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', transition: `all 0.2s ${EASING.out}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = COLOR.primary; e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = COLOR.primary; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.color = '#6B6B8A'; e.currentTarget.style.borderColor = '#DDD9F0'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Logo */}
            <div style={{
              order: isMobile ? 2 : 1,
              width: '72px', height: '72px', borderRadius: '50%',
              overflow: 'hidden', marginBottom: '16px',
              marginTop: isMobile ? '4px' : 0,
              border: '2px solid #E2E0F0', background: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src="/Logo.png" alt="HighAir Expeditions"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Description */}
            <p style={{
              order: isMobile ? 3 : 2,
              fontFamily: "'Ploni', sans-serif", fontSize: FS.sm, fontWeight: 300,
              color: '#6B6B8A', margin: isMobile ? '0' : '0 0 24px', lineHeight: 1.7, maxWidth: '240px',
            }}>
              משלחות טיפוס הרים וטרקים בעולם ובישראל - בשילוב תרומה לחולי סרטן בכל מסע.
            </p>

          </div>

          {/* ── Col: טיפוסים בעולם ── */}
          <div>
            <ColHeading>טיפוסים בעולם</ColHeading>
            {CLIMBS.map(e => (
              <FooterLink key={e.id} label={e.nameHe} href={`/expedition/${e.slug}`} />
            ))}
          </div>

          {/* ── Col: טרקים בעולם ── */}
          <div>
            <ColHeading>טרקים בעולם</ColHeading>
            {TREKS.map(e => (
              <FooterLink key={e.id} label={e.nameHe} href={`/expedition/${e.slug}`} />
            ))}
          </div>

          {/* ── Col: טרקים בארץ ── */}
          <div>
            <ColHeading>טרקים בארץ</ColHeading>
            {ISRAEL_TRIPS.map(t => (
              <FooterLink key={t.label} label={t.label} href={t.href} />
            ))}
          </div>

          {/* ── Col: מידע ── */}
          <div>
            <ColHeading>מידע</ColHeading>
            {INFO_LINKS.map(l => (
              <FooterLink key={l.label} label={l.label} href={l.href} />
            ))}
          </div>

        </div>

        {/* ── Divider ── */}
        <div style={{ height: '1px', background: '#DDD9F0', marginBottom: '24px' }} />

        {/* ── Bottom row ── */}
        <div style={{ direction: 'ltr', textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Ploni', sans-serif", fontSize: FS.sm, fontWeight: 300,
            color: '#9591B0', margin: 0,
          }}>
            HighAir Expeditions © {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </footer>
  );
}
