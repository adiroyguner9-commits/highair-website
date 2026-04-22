/**
 * Shop.jsx - /shop
 * Products store page — Hebrew RTL
 */
import { useState } from 'react';
import { COLOR, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { usePageMeta } from '../../website/usePageMeta.js';
import { PRODUCTS } from '../../data/shopData.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const { isMobile } = useBreakpoint();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   '#FFFFFF',
        borderRadius: RADIUS.xl,
        border:       '1px solid #ECEAF8',
        overflow:     'hidden',
        transform:    hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:    hovered ? '0 16px 48px rgba(109,40,217,0.13)' : '0 2px 12px rgba(0,0,0,0.05)',
        transition:   `all 0.25s ${EASING.out}`,
        display:      'flex',
        flexDirection:'column',
      }}
    >
      {/* Image */}
      <div style={{
        position:   'relative',
        background: '#F5F0FF',
        padding:    '32px',
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight:  '260px',
      }}>
        {product.badge && (
          <div style={{
            position:     'absolute',
            top:          '14px',
            right:        '14px',
            background:   COLOR.primary,
            color:        '#fff',
            fontFamily:   "'Ploni', sans-serif",
            fontSize:     '12px',
            fontWeight:   700,
            padding:      '4px 12px',
            borderRadius: RADIUS.full,
          }}>
            {product.badge}
          </div>
        )}
        <img
          src={product.img}
          alt={product.name}
          style={{
            maxWidth:   '100%',
            maxHeight:  '220px',
            objectFit:  'contain',
            transition: `transform 0.3s ${EASING.out}`,
            transform:  hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
      </div>

      {/* Body */}
      <div style={{
        padding:       '24px',
        direction:     'rtl',
        flex:          1,
        display:       'flex',
        flexDirection: 'column',
        gap:           '12px',
      }}>
        <h2 style={{
          fontFamily:    "'Ploni', sans-serif",
          fontSize:      isMobile ? '20px' : '22px',
          fontWeight:    700,
          color:         '#0A0818',
          margin:        0,
          letterSpacing: '-0.01em',
          lineHeight:    1.3,
        }}>
          {product.name}
        </h2>

        <p style={{
          fontFamily: "'Ploni', sans-serif",
          fontSize:   '15px',
          fontWeight: 300,
          color:      '#6B6B8A',
          margin:     0,
          lineHeight: 1.7,
          flex:       1,
        }}>
          {product.description}
        </p>

        {/* Price + CTA */}
        <div style={{
          display:     'flex',
          alignItems:  'center',
          justifyContent: 'space-between',
          marginTop:   '8px',
          gap:         '12px',
        }}>
          <span style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      '26px',
            fontWeight:    800,
            color:         '#0A0818',
            letterSpacing: '-0.02em',
          }}>
            {product.currency}{product.price}
          </span>

          <a
            href={product.buyLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          '6px',
              padding:      '12px 28px',
              borderRadius: RADIUS.full,
              background:   hovered ? '#7C3AED' : COLOR.primary,
              color:        '#FFFFFF',
              fontFamily:   "'Ploni', sans-serif",
              fontSize:     FS.btn,
              fontWeight:   700,
              textDecoration: 'none',
              transition:   `background 0.2s ${EASING.out}`,
              whiteSpace:   'nowrap',
            }}
          >
            לרכישה ←
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const { isMobile, isTablet } = useBreakpoint();

  usePageMeta({
    title:         'חנות | HighAir Expeditions',
    description:   'ציוד טיולים ומשלחות מבית HighAir Expeditions — תיקים, ציוד הרים ועוד.',
    canonicalPath: '/shop',
  });

  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <>
      <Header />
      <main style={{ background: '#FAFAF8', minHeight: '100vh', paddingTop: '80px', direction: 'rtl' }}>

        {/* ── Page header ── */}
        <div style={{
          background:   '#FFFFFF',
          borderBottom: '1px solid #ECEAF8',
          padding:      isMobile ? '36px 5% 28px' : '52px 5% 36px',
          textAlign:    'center',
        }}>
          <h1 style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      isMobile ? '28px' : '42px',
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 12px',
            letterSpacing: '-0.03em',
            lineHeight:    1.1,
          }}>
            החנות של HighAir
          </h1>
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize:   FS.body,
            fontWeight: 300,
            color:      '#6B6B8A',
            margin:     0,
            lineHeight: 1.7,
          }}>
            ציוד טיולים ומשלחות עם הלוגו של HighAir Expeditions
          </p>
        </div>

        {/* ── Products grid ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '32px 5% 80px' : '48px 5% 100px' }}>
          <div style={{
            display:             'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap:                 '28px',
          }}>
            {PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </main>
      <SiteFooter />
    </>
  );
}
