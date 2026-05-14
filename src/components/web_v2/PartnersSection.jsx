/**
 * PartnersSection.jsx
 * Auto-scrolling logo ticker — shown on the homepage right after the Hero/Stats.
 * Logos are auto-loaded from src/assets/partners/ (drop a file there to add it).
 */

import { useTranslation } from 'react-i18next';
import { useBreakpoint }  from '../../website/useBreakpoint.js';

/* ── Auto-load every logo in src/assets/partners/ ── */
const _logoModules = import.meta.glob(
  '../../assets/partners/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}',
  { eager: true }
);
const PARTNER_LOGOS = Object.entries(_logoModules).map(([path, mod]) => ({
  name: path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
  src:  mod.default,
}));

const tickerStyle = `
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-25%); }
  }
`;

function PartnersTicker() {
  // 4 identical sets — animation moves exactly one set width (-25% of total).
  // Reset from -25% → 0 is visually seamless.
  // direction:ltr prevents RTL from flipping scroll direction.
  const items = [...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <div style={{ overflow: 'hidden', position: 'relative', direction: 'ltr' }}>
      <style>{tickerStyle}</style>

      {/* Fade edges */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'120px', background:'linear-gradient(to right, #FAFAF8, transparent)', zIndex:1, pointerEvents:'none' }} />
      <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'120px', background:'linear-gradient(to left, #FAFAF8, transparent)', zIndex:1, pointerEvents:'none' }} />

      <div style={{
        display:    'flex',
        alignItems: 'center',
        width:      'max-content',
        animation:  'ticker 22s linear infinite',
        willChange: 'transform',
      }}>
        {items.map((p, i) => (
          <div key={i} style={{
            flexShrink:     0,
            margin:         '0 44px',
            width:          '100px',
            height:         '100px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            <img
              src={p.src}
              alt={p.name}
              loading="lazy"
              decoding="async"
              style={{
                width:      '100px',
                height:     '100px',
                objectFit:  'contain',
                filter:     'grayscale(100%) opacity(0.45)',
                userSelect: 'none',
                display:    'block',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PartnersSection() {
  const { i18n }    = useTranslation();
  const { isMobile } = useBreakpoint();
  const isEn = i18n.language === 'en';

  if (!PARTNER_LOGOS.length) return null;

  return (
    <div style={{
      background: '#FAFAF8',
      padding:    isMobile ? '28px 0' : '40px 0',
      borderTop:  '1px solid #ECEAF8',
      borderBottom: '1px solid #ECEAF8',
    }}>
      <p style={{
        fontFamily:    "'Ploni', sans-serif",
        fontSize:      '13px',
        fontWeight:    600,
        color:         '#9896B0',
        textAlign:     'center',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        margin:        '0 0 20px',
      }}>
        {isEn ? 'Our partners on the road' : 'השותפים שלנו לדרך'}
      </p>
      <PartnersTicker />
    </div>
  );
}
