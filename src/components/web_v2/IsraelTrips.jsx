/**
 * IsraelTrips.jsx — Section 03 Dream Site (src/components/web_v2/)
 *
 * · Clean white section, same card DNA as ExpeditionExplorer
 * · No tabs — static grid of Israel-based trips
 * · Coming-soon cards for destinations not yet live
 */

import { useState } from 'react';
import { COLOR, BTN, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';

/* ══════════════════════════════════════════════════════════════
   Israel destinations data
   (No EXPS entries yet — using curated placeholders)
══════════════════════════════════════════════════════════════ */

const ISRAEL_TRIPS = [
  {
    id:    'il-1',
    name:  'הר חרמון',
    area:  'צפון ישראל',
    elev:  '2814 מטר',
    price: '₪890',
    grad:  'linear-gradient(135deg, #1a4a2e, #2d7a4f, #0d2b1a)',
    live:  true,
  },
  {
    id:    'il-2',
    name:  'מכתש רמון',
    area:  'הנגב',
    elev:  '1035 מטר',
    price: '₪590',
    grad:  'linear-gradient(135deg, #7c3a1a, #c2631a, #4a1e08)',
    live:  true,
  },
  {
    id:    'il-3',
    name:  'גליל עליון',
    area:  'הגליל',
    elev:  '1208 מטר',
    price: '₪690',
    grad:  'linear-gradient(135deg, #1a3a5c, #2e6b9e, #0d1f33)',
    live:  true,
  },
  {
    id:    'il-4',
    name:  'הרי יהודה',
    area:  'מרכז ישראל',
    elev:  '1016 מטר',
    price: '₪790',
    grad:  'linear-gradient(135deg, #4a1a6b, #7c3aad, #2a0e3d)',
    live:  true,
  },
];

/* ══════════════════════════════════════════════════════════════
   Card
══════════════════════════════════════════════════════════════ */

function IsraelCard({ trip }) {
  const [hovered, setHovered] = useState(false);
  const { isMobile } = useBreakpoint();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex:          '1 0 0',
        minWidth:      0,
        borderRadius:  RADIUS.xl,
        overflow:      'hidden',
        background:    trip.grad,
        display:       'flex',
        flexDirection: 'column',
        justifyContent:'space-between',
        minHeight:     isMobile ? '280px' : '380px',
        cursor:        trip.live ? 'pointer' : 'default',
        transform:     hovered && trip.live ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:     hovered && trip.live
                         ? '0 20px 48px rgba(0,0,0,0.22)'
                         : '0 6px 20px rgba(0,0,0,0.12)',
        transition:    `transform 0.3s ${EASING.out}, box-shadow 0.3s ${EASING.out}`,
      }}
    >
      {/* ── Top: area badge ── */}
      <div style={{ padding: '18px 18px 0', direction: 'rtl' }}>
        <div style={{
          display:             'inline-flex',
          alignItems:          'center',
          gap:                 '6px',
          padding:             '5px 12px',
          borderRadius:        RADIUS.full,
          background:          'rgba(255,255,255,0.15)',
          backdropFilter:      'blur(8px)',
          WebkitBackdropFilter:'blur(8px)',
          fontSize:            FS.sm,
          fontFamily:          'Ploni, sans-serif',
          fontWeight:          600,
          color:               'rgba(255,255,255,0.90)',
          letterSpacing:       '0.02em',
          direction:           'rtl',
        }}>
          {trip.area} 🇮🇱
        </div>
      </div>

      {/* ── Bottom: name / elev / button ── */}
      <div style={{ padding: '0 20px 24px', direction: 'rtl' }}>

        {/* שם + חץ */}
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
              {trip.name}
            </h3>
            <p style={{
              fontFamily:    "'Ploni', sans-serif",
              fontSize:      FS.sm,
              fontWeight:    400,
              color:         'rgba(255,255,255,0.55)',
              margin:        0,
              letterSpacing: '0.02em',
            }}>
              {trip.elev}
            </p>
          </div>

          {/* חץ */}
          <div style={{
            fontSize:      '20px',
            color:         hovered && trip.live ? '#FFFFFF' : 'rgba(255,255,255,0.25)',
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

export default function IsraelTrips() {
  const [ctaHovered, setCtaHovered] = useState(false);
  const { isMobile } = useBreakpoint();

  return (
    <section id="israel" style={{
      background:  '#FFFFFF',
      padding:     isMobile ? '36px 5%' : '60px 5%',
      boxSizing:   'border-box',
      direction:   'rtl',
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
            הטיולים שלנו בארץ
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
            מסעות יומיים ורב-יומיים ביעדי הטבע הכי יפים בישראל
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div style={{
          display:       'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap:           '18px',
        }}>
          {ISRAEL_TRIPS.map(trip => (
            <IsraelCard key={trip.id} trip={trip} />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          direction: 'ltr',
        }}>
          <button
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              ...BTN.outline,
              fontFamily:   "'Ploni', sans-serif",
              fontSize:     FS.btn,
              fontWeight:   700,
              padding:      '14px 48px',
              letterSpacing:'0.01em',
              background:   ctaHovered ? COLOR.primary : 'transparent',
              color:        ctaHovered ? '#FFFFFF'      : COLOR.primary,
              boxShadow:    ctaHovered ? '0 6px 22px rgba(109,40,217,0.30)' : 'none',
              transform:    ctaHovered ? 'translateY(-1px)' : 'none',
              transition:   `all 0.22s ${EASING.out}`,
            }}
          >
            צפה בכל הטיולים בארץ
          </button>
        </div>

      </div>
    </section>
  );
}
