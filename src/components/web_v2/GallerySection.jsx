/**
 * GallerySection.jsx — Dream Site (web_v2)
 * Horizontal slider · lightbox · RTL Hebrew
 */

import { useState, useEffect, useRef } from 'react';
import { RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';

const PHOTOS = [
  { src: '/images/gallery/home/1.jpg',  caption: 'קבוצת HighAir במסע',               ratio: '4/3' },
  { src: '/images/gallery/home/2.jpg',  caption: 'טרק HighAir Expeditions',           ratio: '4/3' },
  { src: '/images/gallery/home/3.jpg',  caption: 'מחנה בסיס אוורסט עם HighAir',      ratio: '4/3' },
  { src: '/images/gallery/home/4.jpg',  caption: 'טיול בישראל עם HighAir',            ratio: '4/3' },
  { src: '/images/gallery/home/5.jpg',  caption: 'משלחת HighAir בהרים',               ratio: '4/3' },
  { src: '/images/gallery/home/6.jpg',  caption: 'פסגת HighAir Expeditions',          ratio: '4/3' },
  { src: '/images/gallery/home/7.jpg',  caption: 'קבוצת מטיילים HighAir',             ratio: '4/3' },
  { src: '/images/gallery/home/8.jpg',  caption: 'נוף הרים במסע HighAir',             ratio: '4/3' },
  { src: '/images/gallery/home/9.jpg',  caption: 'משלחת הרים HighAir',                ratio: '4/3' },
  { src: '/images/gallery/home/10.jpg', caption: 'טרק HighAir בעולם',                 ratio: '4/3' },
  { src: '/images/gallery/home/11.jpg', caption: 'HighAir Expeditions בפסגה',         ratio: '4/3' },
];

/* ── Nav arrow button ── */
function ArrowBtn({ dir, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:       'absolute',
        top:            '50%',
        transform:      'translateY(-50%)',
        [dir === 'right' ? 'right' : 'left']: '12px',
        zIndex:         10,
        width:          '44px',
        height:         '44px',
        borderRadius:   '50%',
        background:     hovered ? 'rgba(109,40,217,0.85)' : 'rgba(255,255,255,0.92)',
        border:         'none',
        boxShadow:      '0 4px 16px rgba(0,0,0,0.18)',
        cursor:         'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '20px',
        color:          hovered ? '#FFFFFF' : '#4B4869',
        transition:     `all 0.22s ${EASING.out}`,
        flexShrink:     0,
      }}
    >
      {dir === 'right' ? '›' : '‹'}
    </button>
  );
}

/* ── Lightbox nav button ── */
const LB_BTN = {
  position:       'absolute',
  top:            '50%',
  transform:      'translateY(-50%)',
  width:          '52px',
  height:         '52px',
  borderRadius:   '50%',
  background:     'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(8px)',
  border:         '1px solid rgba(255,255,255,0.18)',
  color:          '#FFFFFF',
  fontSize:       '28px',
  cursor:         'pointer',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  zIndex:         1,
  transition:     'background 0.2s ease',
  lineHeight:     1,
  padding:        0,
};

export default function GallerySection() {
  const { isMobile } = useBreakpoint();
  const trackRef     = useRef(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const CARD_HEIGHT = isMobile ? 220 : 360;
  const SCROLL_AMT  = isMobile ? 260 : 440;

  function scrollBy(amount) {
    trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  }

  /* Keyboard navigation for lightbox */
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape')     setLightboxIdx(null);
      if (e.key === 'ArrowLeft')  setLightboxIdx(i => (i + 1) % PHOTOS.length);
      if (e.key === 'ArrowRight') setLightboxIdx(i => (i - 1 + PHOTOS.length) % PHOTOS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx]);

  /* Lock body scroll when lightbox open */
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIdx]);

  const lbPrev = (e) => { e?.stopPropagation(); setLightboxIdx(i => (i - 1 + PHOTOS.length) % PHOTOS.length); };
  const lbNext = (e) => { e?.stopPropagation(); setLightboxIdx(i => (i + 1) % PHOTOS.length); };

  return (
    <>
      <section style={{
        background: '#FFFFFF',
        padding:    isMobile ? '36px 0' : '60px 0',
        boxSizing:  'border-box',
        direction:  'rtl',
        overflow:   'hidden',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding:      isMobile ? '0 5% 24px' : '0 5% 40px',
          textAlign:    'center',
        }}>
          <h2 style={{
            fontFamily:    'Ploni, sans-serif',
            fontSize:      FS.h2,
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 12px',
            letterSpacing: '-0.02em',
            lineHeight:    1.1,
          }}>
            הצטרפו לחוויה של פעם בחיים
          </h2>
          <p style={{
            fontFamily: 'Ploni, sans-serif',
            fontSize:   FS.body,
            fontWeight: 300,
            color:      '#6B6B8A',
            margin:     0,
            lineHeight: 1.7,
          }}>
            תמונות אמיתיות מהמסעות של HighAir ברחבי העולם
          </p>
        </div>

        {/* ── Slider wrapper ── */}
        <div style={{ position: 'relative' }}>

          {/* Left arrow */}
          {!isMobile && (
            <ArrowBtn dir="left" onClick={() => scrollBy(-SCROLL_AMT)} />
          )}

          {/* Scrollable track */}
          <div
            ref={trackRef}
            style={{
              display:                 'flex',
              gap:                     isMobile ? '10px' : '14px',
              overflowX:               'auto',
              scrollBehavior:          'smooth',
              scrollbarWidth:          'none',
              msOverflowStyle:         'none',
              WebkitOverflowScrolling: 'touch',
              padding:                 isMobile
                ? '8px 5% 16px'
                : '8px 68px 20px',
              boxSizing:               'border-box',
            }}
          >
            {PHOTOS.map((p, i) => {
              const [num, den] = p.ratio.split('/').map(Number);
              const cardWidth = Math.round(CARD_HEIGHT * (num / den));
              return (
                <SlideCard
                  key={i}
                  src={p.src}
                  caption={p.caption}
                  width={cardWidth}
                  height={CARD_HEIGHT}
                  onClick={() => setLightboxIdx(i)}
                />
              );
            })}
          </div>

          {/* Right arrow */}
          {!isMobile && (
            <ArrowBtn dir="right" onClick={() => scrollBy(SCROLL_AMT)} />
          )}
        </div>

      </section>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div
          onClick={() => setLightboxIdx(null)}
          style={{
            position:       'fixed',
            inset:          0,
            zIndex:         2000,
            background:     'rgba(5,3,18,0.97)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            style={{
              position:       'absolute',
              top:            '20px',
              right:          '20px',
              width:          '44px',
              height:         '44px',
              borderRadius:   '50%',
              background:     'rgba(255,255,255,0.10)',
              border:         '1px solid rgba(255,255,255,0.18)',
              color:          '#FFFFFF',
              fontSize:       '20px',
              cursor:         'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>

          <div style={{
            position:   'absolute',
            top:        '24px',
            left:       '50%',
            transform:  'translateX(-50%)',
            fontFamily: 'Ploni, sans-serif',
            fontSize:   '14px',
            color:      'rgba(255,255,255,0.5)',
          }}>
            {lightboxIdx + 1} / {PHOTOS.length}
          </div>

          <img
            src={PHOTOS[lightboxIdx].src}
            alt={PHOTOS[lightboxIdx].caption}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth:     isMobile ? '95vw' : '88vw',
              maxHeight:    '85vh',
              objectFit:    'contain',
              borderRadius: RADIUS.xl,
              boxShadow:    '0 32px 80px rgba(0,0,0,0.6)',
              userSelect:   'none',
            }}
          />

          {!isMobile && (
            <>
              <button onClick={lbPrev} style={{ ...LB_BTN, left: '20px' }}>‹</button>
              <button onClick={lbNext} style={{ ...LB_BTN, right: '20px' }}>›</button>
            </>
          )}

          {isMobile && (
            <div style={{
              position:       'absolute',
              bottom:         '28px',
              left:           '50%',
              transform:      'translateX(-50%)',
              display:        'flex',
              gap:            '8px',
              alignItems:     'center',
            }}>
              <button onClick={lbPrev} style={{
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: '#fff', fontSize: '22px', padding: '8px 16px',
                borderRadius: '20px', cursor: 'pointer',
              }}>‹</button>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontFamily: 'Ploni' }}>
                {lightboxIdx + 1} / {PHOTOS.length}
              </span>
              <button onClick={lbNext} style={{
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: '#fff', fontSize: '22px', padding: '8px 16px',
                borderRadius: '20px', cursor: 'pointer',
              }}>›</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function SlideCard({ src, caption, width, height, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        flexShrink:   0,
        width:        `${width}px`,
        height:       `${height}px`,
        borderRadius: RADIUS.xl,
        overflow:     'hidden',
        position:     'relative',
        cursor:       'pointer',
        boxShadow:    '0 2px 12px rgba(0,0,0,0.07)',
      }}
    >
      <img
        src={src}
        alt={caption}
        loading="lazy"
        decoding="async"
        style={{
          width:      '100%',
          height:     '100%',
          objectFit:  'cover',
          display:    'block',
        }}
      />
    </div>
  );
}
