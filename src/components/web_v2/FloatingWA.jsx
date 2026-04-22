/**
 * FloatingWA.jsx - Floating WhatsApp button (shared across all pages)
 */
import { useState } from 'react';

const WA_PHONE = '972555636975';
const WA_MSG   = encodeURIComponent('היי! אני מעוניין/ת לשמוע עוד על המשלחות של HighAir 🏔️');

export default function FloatingWA() {
  const [hovered, setHovered] = useState(false);
  const href = `https://wa.me/${WA_PHONE}?text=${WA_MSG}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="פנו אלינו בוואטסאפ"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:   'fixed',
        bottom:     '28px',
        left:       '28px',
        zIndex:     998,
        width:      '58px',
        height:     '58px',
        borderRadius: '50%',
        background: hovered ? '#1aab52' : '#25D366',
        boxShadow:  hovered
                      ? '0 8px 32px rgba(37,211,102,0.60)'
                      : '0 4px 20px rgba(37,211,102,0.45)',
        transform:  hovered ? 'scale(1.12)' : 'scale(1)',
        transition: 'all 0.22s cubic-bezier(0.22,1,0.36,1)',
        textDecoration: 'none',
      }}
    >
      {/* SVG absolutely centered — guarantees pixel-perfect alignment */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="#FFFFFF"
        style={{
          position:  'absolute',
          top:       '50%',
          left:      '50%',
          transform: 'translate(-50%, -50%)',
          display:   'block',
        }}
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.52 14.15c-.23.63-1.35 1.21-1.85 1.27-.5.07-.97.22-3.27-.68-2.74-1.08-4.5-3.85-4.63-4.03-.13-.18-1.08-1.44-1.08-2.74 0-1.3.68-1.94.92-2.2.24-.27.52-.33.7-.33l.5.01c.16 0 .38-.06.59.45.23.54.77 1.88.84 2.02.07.13.11.29.02.46-.09.18-.13.29-.26.44-.13.16-.27.35-.39.47-.13.13-.26.27-.11.53.15.26.66 1.09 1.42 1.76.97.87 1.79 1.14 2.05 1.27.26.13.41.11.56-.07.15-.18.63-.73.8-.98.17-.25.34-.21.57-.13.23.08 1.46.69 1.71.81.25.13.42.19.48.29.07.11.07.62-.16 1.25z"/>
      </svg>
    </a>
  );
}
