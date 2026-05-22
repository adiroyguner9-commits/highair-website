/**
 * Shop.jsx - /shop
 * Nims Dai-inspired design, adapted to HighAir visual language.
 *
 * Payment flow:
 *   Click card / Quick Buy → ProductModal opens
 *   Click "לרכישה" → window.location.href to Grow.link (same tab, no popup)
 *   Grow redirects back to /shop?paid=1 on success
 *   Success banner shown on return, URL cleaned up
 *
 *   REQUIRED: In your Grow dashboard, set the payment page's
 *   "Success URL" to: https://www.highair-expeditions.com/shop?paid=1
 */
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Analytics } from '../../utils/analytics.js';
import { COLOR, RADIUS, EASING, FONT } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { usePageMeta } from '../../website/usePageMeta.js';
import { PRODUCTS } from '../../data/shopData.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';

/* ─── SVG Icons ──────────────────────────────────────────── */
const IconTruck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

/* ─── Trust bar data ─────────────────────────────────────── */
const TRUST = [
  { icon: <IconTruck />,    he: 'משלוח לכל הארץ',        en: 'Nationwide Delivery'      },
  { icon: <IconLock />,     he: 'תשלום מאובטח',           en: 'Secure Payment'           },
  { icon: <IconMountain />, he: 'ציוד מוכח בשטח',         en: 'Field-Tested Gear'        },
  { icon: <IconHeart />,    he: 'תורמים למאבק בסרטן',     en: 'Supporting Cancer Patients'},
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
      style={{ cursor: 'pointer' }}
    >
      {/* Image box */}
      <div style={{
        position: 'relative',
        background: '#F3F4F6',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        borderRadius: '4px',
      }}>
        {/* Badge */}
        {(isComingSoon || product.badge) && (
          <span style={{
            position: 'absolute',
            top: '10px',
            ...(isRtl ? { right: '10px' } : { left: '10px' }),
            zIndex: 2,
            background: isComingSoon ? '#111827' : COLOR.primary,
            color: '#fff',
            fontFamily: FONT.primary,
            fontSize: '10px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '2px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {isComingSoon ? (isRtl ? 'בקרוב' : 'Coming Soon') : product.badge}
          </span>
        )}

        {/* Image */}
        {product.img ? (
          <img
            src={product.img}
            alt={name}
            onError={e => { e.currentTarget.parentElement.style.background = '#EBEBEB'; e.currentTarget.style.display = 'none'; }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              transition: `transform 0.5s ${EASING.out}`,
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#D1D5DB',
          }}>
            <IconMountain />
          </div>
        )}

        {/* Quick Buy bar — slides up on hover */}
        {!isComingSoon && (
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            background: '#111827',
            color: '#FFFFFF',
            fontFamily: FONT.primary,
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textAlign: 'center',
            padding: '13px 0',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: `transform 0.28s ${EASING.out}`,
          }}>
            {isRtl ? 'רכישה מהירה' : 'Quick Buy'}
          </div>
        )}
      </div>

      {/* Card text */}
      <div style={{
        padding: '12px 2px 0',
        direction: isRtl ? 'rtl' : 'ltr',
      }}>
        <div style={{
          fontFamily: FONT.primary,
          fontSize: '14px',
          fontWeight: 600,
          color: '#111827',
          lineHeight: 1.35,
          marginBottom: '4px',
        }}>
          {name}
        </div>
        {product.price != null ? (
          <div style={{
            fontFamily: FONT.primary,
            fontSize: '14px',
            fontWeight: 400,
            color: '#111827',
          }}>
            {product.currency}{product.price}
          </div>
        ) : (
          <div style={{
            fontFamily: FONT.primary,
            fontSize: '12px',
            color: '#9CA3AF',
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
  const dir = isRtl ? 'rtl' : 'ltr';
  const isComingSoon = product.price == null;
  const name = isRtl ? product.name : product.nameEn;
  const desc = isRtl ? product.description : product.descriptionEn;

  // Escape key
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleBuyClick() {
    Analytics.clickBuyProduct(name, product.price);
    window.location.href = product.buyLink;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: isMobile ? '0' : '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          width: '100%',
          maxWidth: isMobile ? '100%' : '820px',
          borderRadius: isMobile ? '16px 16px 0 0' : '8px',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          maxHeight: isMobile ? '92vh' : '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Image panel */}
        <div style={{
          background: '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: isMobile ? '260px' : '480px',
          padding: '40px',
          order: isRtl && !isMobile ? 1 : 0,
          position: 'relative',
        }}>
          {product.img ? (
            <img
              src={product.img}
              alt={name}
              style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ color: '#D1D5DB' }}><IconMountain /></div>
          )}
        </div>

        {/* Content panel */}
        <div style={{
          padding: isMobile ? '28px 24px 32px' : '48px 44px',
          direction: dir,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          order: isRtl && !isMobile ? 0 : 1,
          position: 'relative',
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              ...(isRtl ? { left: '16px' } : { right: '16px' }),
              width: '32px', height: '32px',
              borderRadius: '50%',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#374151',
            }}
          >
            <IconClose />
          </button>

          {/* Coming soon badge */}
          {isComingSoon && (
            <span style={{
              display: 'inline-block', width: 'fit-content',
              background: '#F3F4F6', color: '#374151',
              fontFamily: FONT.primary,
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '5px 12px', borderRadius: '2px',
            }}>
              {isRtl ? 'מגיע בקרוב' : 'Coming Soon'}
            </span>
          )}

          {/* Name */}
          <h2 style={{
            fontFamily: FONT.primary,
            fontSize: isMobile ? '22px' : '26px',
            fontWeight: 700,
            color: '#111827',
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}>
            {name}
          </h2>

          {/* Price */}
          {product.price != null && (
            <div style={{
              fontFamily: FONT.primary,
              fontSize: '22px',
              fontWeight: 500,
              color: '#111827',
            }}>
              {product.currency}{product.price}
            </div>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: '#F3F4F6' }} />

          {/* Description */}
          <p style={{
            fontFamily: FONT.primary,
            fontSize: '14px',
            fontWeight: 400,
            color: '#4B5563',
            margin: 0,
            lineHeight: 1.85,
            flex: 1,
          }}>
            {desc}
          </p>

          {/* Buy CTA */}
          {!isComingSoon && (
            <button
              onClick={handleBuyClick}
              style={{
                width: '100%',
                padding: '15px 24px',
                background: '#111827',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                fontFamily: FONT.primary,
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1F2937'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#111827'; }}
            >
              {isRtl ? 'לרכישה' : 'Buy Now'}
            </button>
          )}

          {isComingSoon && (
            <p style={{
              fontFamily: FONT.primary,
              fontSize: '13px',
              color: '#9CA3AF',
              margin: 0,
            }}>
              {isRtl ? 'המוצר יהיה זמין לרכישה בקרוב.' : 'This product will be available for purchase soon.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Shop page ─────────────────────────────────────── */
export default function Shop() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';
  const { isMobile, isTablet } = useBreakpoint();
  const dir = isRtl ? 'rtl' : 'ltr';
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Detect return from Grow payment with ?paid=1
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
    title:       isRtl ? 'חנות HighAir | ציוד טרקים ומשלחות' : 'HighAir Shop | Trekking & Expedition Gear',
    description: isRtl
      ? 'ציוד טרקים ומשלחות מוכח בשטח מבית HighAir Expeditions. תיקים, סופטשל, משקפי הרים ועוד. כל רכישה תורמת למאבק בסרטן.'
      : 'Field-tested trekking and expedition gear from HighAir Expeditions. Duffel bags, softshells, mountain sunglasses and more. Every purchase supports cancer patients.',
    canonicalPath: '/shop',
  });

  const cols = isMobile ? 2 : isTablet ? 3 : 4;
  const featuredProduct = PRODUCTS.find(p => p.buyLink);

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

      {/* Payment success banner */}
      {paidSuccess && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 8000,
          background: '#111827', color: '#FFFFFF',
          fontFamily: FONT.primary, fontSize: '14px', fontWeight: 600,
          padding: '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          letterSpacing: '0.02em',
        }}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%',
            background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconCheck />
          </div>
          {isRtl ? 'תודה על הרכישה! אישור יישלח אליך בקרוב.' : 'Thank you for your purchase! A confirmation will be sent shortly.'}
        </div>
      )}

      <main id="main-content" style={{ background: '#FFFFFF', minHeight: '100vh', direction: dir }}>

        {/* ══ HERO ══════════════════════════════════════════ */}
        <div style={{
          paddingTop:    isMobile ? '110px' : '140px',
          paddingBottom: isMobile ? '48px' : '64px',
          paddingLeft:   '5%',
          paddingRight:  '5%',
          textAlign:     'center',
          borderBottom:  '1px solid #F3F4F6',
        }}>
          <p style={{
            fontFamily: FONT.primary,
            fontSize: '11px',
            fontWeight: 700,
            color: '#9CA3AF',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: '0 0 16px',
          }}>
            HighAir Expeditions
          </p>
          <h1 style={{
            fontFamily: FONT.primary,
            fontSize: isMobile ? '34px' : '52px',
            fontWeight: 800,
            color: '#111827',
            margin: '0 0 14px',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}>
            {isRtl ? 'החנות שלנו' : 'Our Store'}
          </h1>
          <p style={{
            fontFamily: FONT.primary,
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: 400,
            color: '#6B7280',
            margin: 0,
            lineHeight: 1.65,
          }}>
            {isRtl ? 'ציוד מוכח בשטח. לכל טרק ולכל מסע.' : 'Field-tested gear. For every trek and expedition.'}
          </p>
        </div>

        {/* ══ TRUST BAR ══════════════════════════════════════ */}
        <div style={{ borderBottom: '1px solid #F3F4F6', background: '#FAFAFA' }}>
          <div style={{
            maxWidth: '1200px', margin: '0 auto', padding: '0 5%',
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          }}>
            {TRUST.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: isMobile ? '18px 8px' : '22px 16px',
                textAlign: 'center',
                borderRight: (!isMobile && i < 3) ? '1px solid #F3F4F6' : 'none',
                borderBottom: (isMobile && i < 2) ? '1px solid #F3F4F6' : 'none',
              }}>
                <div style={{ color: '#374151' }}>{item.icon}</div>
                <div style={{
                  fontFamily: FONT.primary,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#374151',
                  letterSpacing: '0.02em',
                }}>
                  {isRtl ? item.he : item.en}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ FEATURED PRODUCT ═══════════════════════════════ */}
        {featuredProduct && (
          <div style={{ background: '#111827', borderBottom: '1px solid #111827' }}>
            <div style={{
              maxWidth: '1200px', margin: '0 auto',
              padding: isMobile ? '48px 5%' : '80px 5%',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '32px' : '80px',
              alignItems: 'center',
              direction: dir,
            }}>
              {/* Image */}
              <div
                onClick={() => setSelectedProduct(featuredProduct)}
                style={{
                  background: '#1F2937',
                  borderRadius: '4px',
                  padding: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '1/1',
                  cursor: 'pointer',
                  order: isRtl && !isMobile ? 1 : 0,
                }}
              >
                {featuredProduct.img && (
                  <img
                    src={featuredProduct.img}
                    alt={isRtl ? featuredProduct.name : featuredProduct.nameEn}
                    style={{ maxWidth: '100%', maxHeight: '260px', objectFit: 'contain' }}
                  />
                )}
              </div>

              {/* Text */}
              <div style={{ order: isRtl && !isMobile ? 0 : 1 }}>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#F9FAFB',
                  fontFamily: FONT.primary,
                  fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  padding: '5px 12px', borderRadius: '2px',
                  marginBottom: '20px',
                }}>
                  {isRtl ? 'הנמכר ביותר' : 'Bestseller'}
                </span>
                <h2 style={{
                  fontFamily: FONT.primary,
                  fontSize: isMobile ? '24px' : '34px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 12px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}>
                  {isRtl ? featuredProduct.name : featuredProduct.nameEn}
                </h2>
                <p style={{
                  fontFamily: FONT.primary,
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.6)',
                  margin: '0 0 32px',
                  lineHeight: 1.8,
                }}>
                  {isRtl ? featuredProduct.description : featuredProduct.descriptionEn}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: FONT.primary,
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                  }}>
                    {featuredProduct.currency}{featuredProduct.price}
                  </span>
                  <button
                    onClick={() => setSelectedProduct(featuredProduct)}
                    style={{
                      padding: '13px 30px',
                      background: '#FFFFFF',
                      color: '#111827',
                      border: 'none',
                      borderRadius: '4px',
                      fontFamily: FONT.primary,
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; }}
                  >
                    {isRtl ? 'לרכישה' : 'Buy Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ PRODUCTS GRID ══════════════════════════════════ */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '40px 5% 80px' : '64px 5% 120px' }}>

          {/* Section header */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '32px',
            paddingBottom: '16px',
            borderBottom: '1px solid #F3F4F6',
            direction: dir,
          }}>
            <h2 style={{
              fontFamily: FONT.primary,
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: 700,
              color: '#111827',
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              {isRtl ? 'כל הציוד' : 'All Gear'}
            </h2>
            <span style={{
              fontFamily: FONT.primary,
              fontSize: '13px',
              color: '#9CA3AF',
              letterSpacing: '0.02em',
            }}>
              {PRODUCTS.length} {isRtl ? 'מוצרים' : 'items'}
            </span>
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: isMobile ? '24px 16px' : '36px 24px',
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
