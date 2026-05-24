/**
 * Shop.jsx - /shop
 * HighAir design system — same language as the rest of the site.
 *
 * Payment flow:
 *   Click card / "לרכישה" → ProductModal opens
 *   Click buy button → window.location.href to Grow.link (same tab)
 *   Grow redirects back to /shop?paid=1 on success → success banner shown
 *
 *   REQUIRED: In your Grow dashboard set "Success URL" to:
 *   https://www.highair-expeditions.com/shop?paid=1
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Analytics } from '../../utils/analytics.js';
import {
  COLOR, FONT, RADIUS, SHADOW, EASING, LABEL, BTN,
} from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { usePageMeta } from '../../website/usePageMeta.js';
import { PRODUCTS } from '../../data/shopData.js';
import Header     from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';

/* ─── Icons ─────────────────────────────────────────────── */
const IconTruck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IconLock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconMountain = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3l4 8 5-5 5 9H2L8 3z"/>
  </svg>
);
const IconHeart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

/* ─── Trust bar data ─────────────────────────────────────── */
const TRUST = [
  { icon: <IconTruck />,    he: 'משלוח לכל הארץ',      en: 'Nationwide Delivery'       },
  { icon: <IconLock />,     he: 'תשלום מאובטח',         en: 'Secure Payment'            },
  { icon: <IconMountain />, he: 'ציוד מוכח בשטח',       en: 'Field-Tested Gear'         },
  { icon: <IconHeart />,    he: 'תורמים למאבק בסרטן',   en: 'Supporting Cancer Patients' },
];

/* ─── ProductCard ────────────────────────────────────────── */
function ProductCard({ product, isRtl, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const isComingSoon = product.price == null;
  const name = isRtl ? product.name : product.nameEn;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(product)}
      style={{
        background:    'transparent',
        cursor:        'pointer',
        display:       'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image area */}
      <div style={{
        position:     'relative',
        background:   '#F0EFF8',
        aspectRatio:  '1 / 1',
        borderRadius: RADIUS.xl,
        overflow:     'visible',
        transform:    hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition:   `transform 0.28s ${EASING.out}`,
        marginBottom: '8px',
      }}>
        {/* Actual image clip */}
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: RADIUS.xl, overflow: 'hidden' }}>

          {/* Badge */}
          {(isComingSoon || product.badge) && (
            <span style={{
              position:      'absolute',
              top:           '12px',
              ...(isRtl ? { right: '12px' } : { left: '12px' }),
              zIndex:        2,
              background:    isComingSoon ? COLOR.muted : COLOR.grad.brand,
              color:         '#fff',
              fontFamily:    FONT.primary,
              fontSize:      '11px',
              fontWeight:    700,
              padding:       '4px 12px',
              borderRadius:  RADIUS.full,
              letterSpacing: '0.04em',
            }}>
              {isComingSoon ? (isRtl ? 'בקרוב' : 'Coming Soon') : product.badge}
            </span>
          )}

          {/* Image */}
          {product.img ? (
            <img
              src={product.img}
              alt={name}
              onError={e => { e.currentTarget.style.display = 'none'; }}
              style={{
                width:        '100%',
                height:       '100%',
                objectFit:    'contain',
                objectPosition: 'center 85%',
                display:      'block',
                padding:      '20px 20px 28px',
                mixBlendMode: 'multiply',
                transform:    hovered ? 'scale(1.05)' : 'scale(1)',
                transition:   `transform 0.45s ${EASING.out}`,
                boxSizing:    'border-box',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: COLOR.border, opacity: 0.5,
            }}><IconMountain /></div>
          )}

          {/* "לרכישה" hover bar */}
          {!isComingSoon && (
            <div style={{
              position:   'absolute',
              bottom:     0, left: 0, right: 0,
              background: COLOR.grad.brand,
              color:      '#FFFFFF',
              fontFamily: FONT.primary,
              fontSize:   '13px',
              fontWeight: 700,
              textAlign:  'center',
              padding:    '12px 0',
              letterSpacing: '0.04em',
              transform:  hovered ? 'translateY(0)' : 'translateY(100%)',
              transition: `transform 0.26s ${EASING.out}`,
            }}>
              {isRtl ? 'לרכישה ←' : 'Buy Now →'}
            </div>
          )}
        </div>

        {/* Floating cast shadow below the product */}
        <div style={{
          position:     'absolute',
          bottom:       '-10px',
          left:         '15%',
          right:        '15%',
          height:       '20px',
          background:   'rgba(80,40,160,0.22)',
          filter:       'blur(14px)',
          borderRadius: '50%',
          transition:   `opacity 0.28s ${EASING.out}`,
          opacity:      hovered ? 0.9 : 0.6,
          zIndex:       -1,
        }} />
      </div>

      {/* Text */}
      <div style={{
        padding:   '16px 18px 20px',
        direction: isRtl ? 'rtl' : 'ltr',
        flex:      1,
        display:   'flex',
        flexDirection: 'column',
        gap:       '6px',
      }}>
        <div style={{
          fontFamily:    FONT.primary,
          fontSize:      '15px',
          fontWeight:    700,
          color:         COLOR.text,
          lineHeight:    1.3,
          letterSpacing: '-0.01em',
        }}>
          {name}
        </div>
        {product.price != null ? (
          <div style={{
            fontFamily: FONT.primary,
            fontSize:   '17px',
            fontWeight: 800,
            color:      COLOR.primary,
            letterSpacing: '-0.02em',
          }}>
            {product.currency}{product.price}
          </div>
        ) : (
          <div style={{
            fontFamily: FONT.primary,
            fontSize:   '12px',
            color:      COLOR.mutedLight,
          }}>
            {isRtl ? 'מחיר בקרוב' : 'Price soon'}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ProductModal ───────────────────────────────────────── */
function ProductModal({ product, isRtl, isMobile, onClose }) {
  const dir        = isRtl ? 'rtl' : 'ltr';
  const isComingSoon = product.price == null;
  const name       = isRtl ? product.name       : product.nameEn;
  const desc       = isRtl ? product.description : product.descriptionEn;

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleBuy() {
    Analytics.clickBuyProduct(name, product.price);
    window.location.href = product.buyLink;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position:  'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(10,8,24,0.72)',
        backdropFilter:       'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display:    'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding:    isMobile ? 0 : '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:          '#FFFFFF',
          borderRadius:        isMobile ? `${RADIUS['2xl']} ${RADIUS['2xl']} 0 0` : RADIUS['2xl'],
          width:               '100%',
          maxWidth:            isMobile ? '100%' : '820px',
          overflow:            'hidden',
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          maxHeight:           isMobile ? '92vh' : '88vh',
          overflowY:           'auto',
          boxShadow:           SHADOW['2xl'],
        }}
      >
        {/* Image panel */}
        <div style={{
          background:     '#F0EFF8',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          minHeight:      isMobile ? '260px' : '440px',
          position:       'relative',
          overflow:       'hidden',
          order:          isRtl && !isMobile ? 1 : 0,
        }}>
          {product.img ? (
            <img
              src={product.img}
              alt={name}
              style={{
                width:        '75%',
                height:       '75%',
                objectFit:    'contain',
                objectPosition: 'center 85%',
                mixBlendMode: 'multiply',
              }}
            />
          ) : (
            <div style={{ color: COLOR.border }}><IconMountain /></div>
          )}
          {/* Floating shadow */}
          <div style={{
            position:     'absolute',
            bottom:       '12px',
            left:         '20%',
            right:        '20%',
            height:       '24px',
            background:   'rgba(80,40,160,0.2)',
            filter:       'blur(16px)',
            borderRadius: '50%',
          }} />
        </div>

        {/* Content panel */}
        <div style={{
          padding:        isMobile ? '28px 24px 36px' : '44px 40px',
          direction:      dir,
          display:        'flex',
          flexDirection:  'column',
          gap:            '18px',
          order:          isRtl && !isMobile ? 0 : 1,
          position:       'relative',
        }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position:   'absolute',
              top:        '16px',
              ...(isRtl ? { left: '16px' } : { right: '16px' }),
              width:      '34px', height: '34px',
              borderRadius: '50%',
              border:     `1px solid ${COLOR.border}`,
              background: '#FFFFFF',
              cursor:     'pointer',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color:      COLOR.muted,
            }}
          >
            <IconClose />
          </button>

          {/* Overline label */}
          <span style={{ ...LABEL, marginBottom: 0 }}>
            {isRtl ? 'HighAir Expeditions' : 'HighAir Expeditions'}
          </span>

          {/* Name */}
          <h2 style={{
            fontFamily:    FONT.primary,
            fontSize:      isMobile ? '22px' : '28px',
            fontWeight:    800,
            color:         COLOR.text,
            margin:        0,
            letterSpacing: '-0.02em',
            lineHeight:    1.2,
          }}>
            {name}
          </h2>

          {/* Price */}
          {product.price != null && (
            <div style={{
              fontFamily:    FONT.primary,
              fontSize:      '26px',
              fontWeight:    800,
              color:         COLOR.primary,
              letterSpacing: '-0.03em',
            }}>
              {product.currency}{product.price}
            </div>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: COLOR.border }} />

          {/* Description */}
          <p style={{
            fontFamily: FONT.primary,
            fontSize:   '15px',
            fontWeight: 300,
            color:      COLOR.muted,
            margin:     0,
            lineHeight: 1.85,
            flex:       1,
          }}>
            {desc}
          </p>

          {/* CTA */}
          {!isComingSoon ? (
            <button
              onClick={handleBuy}
              style={{ ...BTN.primary, width: '100%', justifyContent: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {isRtl ? 'לרכישה' : 'Buy Now'}
            </button>
          ) : (
            <p style={{
              fontFamily: FONT.primary,
              fontSize:   '14px',
              color:      COLOR.mutedLight,
              margin:     0,
            }}>
              {isRtl
                ? 'המוצר יהיה זמין לרכישה בקרוב.'
                : 'This product will be available for purchase soon.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function Shop() {
  const { i18n } = useTranslation();
  const isRtl    = i18n.language !== 'en';
  const { isMobile, isTablet } = useBreakpoint();
  const dir = isRtl ? 'rtl' : 'ltr';
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* Return from Grow payment with ?paid=1 */
  const [paidSuccess, setPaidSuccess] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('paid') === '1';
  });
  useEffect(() => {
    if (paidSuccess) {
      window.history.replaceState({}, '', '/shop');
      const t = setTimeout(() => setPaidSuccess(false), 6000);
      return () => clearTimeout(t);
    }
  }, []);

  usePageMeta({
    title:       isRtl
      ? 'חנות HighAir | ציוד טרקים ומשלחות'
      : 'HighAir Shop | Trekking & Expedition Gear',
    description: isRtl
      ? 'ציוד טרקים ומשלחות מוכח בשטח מבית HighAir Expeditions. תיקים, סופטשל, משקפי הרים ועוד. כל רכישה תורמת למאבק בסרטן.'
      : 'Field-tested trekking and expedition gear from HighAir Expeditions. Bags, softshells, mountain sunglasses and more. Every purchase supports cancer patients.',
    canonicalPath: '/shop',
  });

  const cols = isMobile ? 2 : isTablet ? 3 : 4;

  return (
    <>
      <Header />

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isRtl={isRtl}
          isMobile={isMobile}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Success banner */}
      {paidSuccess && (
        <div style={{
          position:   'fixed', top: 0, left: 0, right: 0, zIndex: 8000,
          background: COLOR.grad.brand,
          color:      '#FFFFFF',
          fontFamily: FONT.primary,
          fontSize:   '15px',
          fontWeight: 600,
          padding:    '14px 24px',
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap:        '10px',
          boxShadow:  SHADOW.brand.lg,
        }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <IconCheck />
          </div>
          {isRtl
            ? 'תודה על הרכישה! אישור יישלח אליך בקרוב.'
            : 'Thank you for your purchase! A confirmation will be sent shortly.'}
        </div>
      )}

      <main id="main-content" style={{ background: COLOR.bg, minHeight: '100vh', direction: dir }}>

        {/* ══ HERO ════════════════════════════════════════════ */}
        <div style={{
          background:    COLOR.grad.heroAlt,
          paddingTop:    isMobile ? '110px' : '140px',
          paddingBottom: isMobile ? '64px'  : '88px',
          paddingLeft:   '5%', paddingRight: '5%',
          textAlign:     'center',
          position:      'relative',
          overflow:      'hidden',
        }}>
          {/* Radial glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(109,40,217,0.4) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
            <span style={{ ...LABEL, color: COLOR.lighter, marginBottom: '16px', display: 'block' }}>
              HighAir Expeditions
            </span>
            <h1 style={{
              fontFamily:    FONT.primary,
              fontSize:      isMobile ? '36px' : '56px',
              fontWeight:    900,
              color:         '#FFFFFF',
              margin:        '0 0 16px',
              letterSpacing: '-0.03em',
              lineHeight:    1.1,
            }}>
              {isRtl ? 'החנות שלנו' : 'Our Store'}
            </h1>
            <p style={{
              fontFamily: FONT.primary,
              fontSize:   isMobile ? '16px' : '18px',
              fontWeight: 300,
              color:      'rgba(255,255,255,0.72)',
              margin:     0,
              lineHeight: 1.65,
            }}>
              {isRtl
                ? 'ציוד מוכח בשטח. לכל טרק ולכל מסע.'
                : 'Field-tested gear. For every trek and expedition.'}
            </p>
          </div>
        </div>

        {/* ══ TRUST BAR ═══════════════════════════════════════ */}
        <div style={{ background: '#FFFFFF', borderBottom: `1px solid ${COLOR.border}` }}>
          <div style={{
            maxWidth: '1200px', margin: '0 auto', padding: '0 5%',
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          }}>
            {TRUST.map((item, i) => (
              <div key={i} style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           '7px',
                padding:       isMobile ? '20px 8px' : '24px 16px',
                textAlign:     'center',
                borderRight:   (!isMobile && i < 3) ? `1px solid ${COLOR.border}` : 'none',
                borderBottom:  (isMobile && i < 2)  ? `1px solid ${COLOR.border}` : 'none',
              }}>
                <div style={{ color: COLOR.primary }}>{item.icon}</div>
                <div style={{
                  fontFamily:    FONT.primary,
                  fontSize:      '12px',
                  fontWeight:    700,
                  color:         COLOR.text,
                  letterSpacing: '0.02em',
                }}>
                  {isRtl ? item.he : item.en}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ PRODUCTS GRID ═══════════════════════════════════ */}
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding:  isMobile ? '48px 5% 80px' : '72px 5% 120px',
        }}>
          {/* Section header */}
          <div style={{
            display:        'flex',
            alignItems:     'baseline',
            justifyContent: 'space-between',
            marginBottom:   '36px',
            direction:      dir,
          }}>
            <div>
              <span style={{ ...LABEL }}>{isRtl ? 'ציוד מוכן לשטח' : 'Ready for the field'}</span>
              <h2 style={{
                fontFamily:    FONT.primary,
                fontSize:      isMobile ? '26px' : '34px',
                fontWeight:    900,
                color:         COLOR.text,
                margin:        0,
                letterSpacing: '-0.02em',
                lineHeight:    1.2,
              }}>
                {isRtl ? 'כל הציוד' : 'All Gear'}
              </h2>
            </div>
            <span style={{
              fontFamily: FONT.primary,
              fontSize:   '13px',
              color:      COLOR.mutedLight,
            }}>
              {PRODUCTS.length} {isRtl ? 'מוצרים' : 'items'}
            </span>
          </div>

          {/* Grid */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap:                 isMobile ? '20px 14px' : '28px 20px',
          }}>
            {PRODUCTS.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isRtl={isRtl}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        </div>

      </main>

      <SiteFooter />
    </>
  );
}
