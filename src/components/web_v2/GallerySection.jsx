/**
 * GallerySection.jsx - Dream Site (web_v2)
 * Horizontal slider · lightbox · RTL Hebrew
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';

const PHOTO_SRCS = [
  { src: '/images/gallery/home/1.webp',  ratio: '4/3' },
  { src: '/images/gallery/home/2.webp',  ratio: '4/3' },
  { src: '/images/gallery/home/3.webp',  ratio: '4/3' },
  { src: '/images/gallery/home/4.webp',  ratio: '4/3' },
  { src: '/images/gallery/home/5.webp',  ratio: '4/3' },
  { src: '/images/gallery/home/6.webp',  ratio: '4/3' },
  { src: '/images/gallery/home/7.webp',  ratio: '4/3' },
  { src: '/images/gallery/home/8.webp',  ratio: '4/3' },
  { src: '/images/gallery/home/9.webp',  ratio: '4/3' },
  { src: '/images/gallery/home/10.webp', ratio: '4/3' },
  { src: '/images/gallery/home/11.webp', ratio: '4/3' },
];

/* ── Nav arrow button ── */
function ArrowBtn({ dir, disabled, onClick, isRtl }) {
  const [hovered, setHovered] = useState(false);
  /* In RTL the glyphs are visually mirrored by the browser, so swap them */
  const symbol = isRtl
    ? (dir === 'left' ? '›' : '‹')
    : (dir === 'left' ? '‹' : '›');
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={dir === 'left' ? 'Previous photos' : 'Next photos'}
      style={{
        position:       'absolute',
        top:            '50%',
        transform:      'translateY(-50%)',
        [dir === 'right' ? 'right' : 'left']: '12px',
        zIndex:         10,
        width:          '44px',
        height:         '44px',
        borderRadius:   '50%',
        background:     disabled ? 'rgba(255,255,255,0.5)' : hovered ? 'rgba(109,40,217,0.85)' : 'rgba(255,255,255,0.92)',
        border:         'none',
        boxShadow:      disabled ? 'none' : '0 4px 16px rgba(0,0,0,0.18)',
        cursor:         disabled ? 'default' : 'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '20px',
        color:          disabled ? 'rgba(75,72,105,0.3)' : hovered ? '#FFFFFF' : '#4B4869',
        transition:     `all 0.22s ${EASING.out}`,
        flexShrink:     0,
        opacity:        disabled ? 0.5 : 1,
      }}
    >
      {symbol}
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
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';
  const trackRef     = useRef(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [canPrev,     setCanPrev]     = useState(false);
  const [canNext,     setCanNext]     = useState(true);

  const captions = t('gallery.captions', { returnObjects: true });
  const PHOTOS = PHOTO_SRCS.map((p, i) => ({ ...p, caption: captions[i] || '' }));

  const CARD_HEIGHT = isMobile ? 220 : 360;
  const SCROLL_AMT  = isMobile ? 260 : 440;

  /* Update arrow disabled state on scroll */
  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const sl  = Math.abs(Math.round(el.scrollLeft));
    const max = Math.round(el.scrollWidth - el.clientWidth);
    if (isRtl) {
      setCanPrev(sl > 4);          // prev = toward photo 1 (right) = scrollLeft toward 0
      setCanNext(sl < max - 4);    // next = toward photo 11 (left) = scrollLeft more negative
    } else {
      setCanPrev(sl > 4);
      setCanNext(sl < max - 4);
    }
  }, [isRtl]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    return () => el.removeEventListener('scroll', updateArrows);
  }, [updateArrows]);

  function doScroll(amount) {
    trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  }

  /* Keyboard navigation for lightbox */
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape')     setLightboxIdx(null);
      // RTL: ArrowLeft=next(+1), ArrowRight=prev(-1) — matches gallery scroll direction
      if (e.key === 'ArrowLeft')  setLightboxIdx(i => isRtl ? (i + 1) % PHOTOS.length : (i - 1 + PHOTOS.length) % PHOTOS.length);
      if (e.key === 'ArrowRight') setLightboxIdx(i => isRtl ? (i - 1 + PHOTOS.length) % PHOTOS.length : (i + 1) % PHOTOS.length);
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
        padding:    isMobile ? '36px 5% 36px' : '60px 0',
        boxSizing:  'border-box',
        direction:  dir,
        overflow:   'hidden',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: isMobile ? '0 0 24px' : '0 5% 40px',
        }}>
          <h2 style={{
            fontFamily:    'Ploni, sans-serif',
            fontSize:      FS.h2,
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 12px',
            letterSpacing: '-0.02em',
            lineHeight:    1.1,
            textAlign:     'start',
          }}>
            {t('gallery.sectionTitle')}
          </h2>
          <p style={{
            fontFamily: 'Ploni, sans-serif',
            fontSize:   FS.body,
            fontWeight: 300,
            color:      '#6B6B8A',
            margin:     0,
            lineHeight: 1.7,
            textAlign:  'start',
          }}>
            {t('gallery.sectionSubtitle')}
          </p>
        </div>

        {/* ── Slider wrapper (landscape on all screen sizes) ── */}
        <div style={{ position: 'relative' }}>

          {/* Left arrow: RTL=forward(disabled at end), LTR=backward(disabled at start) */}
          {!isMobile && (
            <ArrowBtn dir="left" disabled={isRtl ? !canNext : !canPrev} onClick={() => doScroll(-SCROLL_AMT)} isRtl={isRtl} />
          )}

          {/* Scrollable track */}
          <div
            ref={trackRef}
            style={{
              display:                 'flex',
              direction:               dir,
              gap:                     isMobile ? '10px' : '14px',
              overflowX:               'auto',
              scrollSnapType:          isMobile ? 'x mandatory' : 'none',
              scrollBehavior:          'smooth',
              scrollbarWidth:          'none',
              msOverflowStyle:         'none',
              WebkitOverflowScrolling: 'touch',
              paddingTop:    '8px',
              paddingBottom: isMobile ? '16px' : '20px',
              paddingRight:  isMobile ? 0 : (isRtl ? '5%'  : '68px'),
              paddingLeft:   isMobile ? 0 : (isRtl ? '68px' : '5%'),
              boxSizing:               'border-box',
            }}
          >
            {PHOTOS.map((p, i) => {
              const [num, den] = p.ratio.split('/').map(Number);
              const cardWidth = isMobile
                ? Math.round(CARD_HEIGHT * (num / den))
                : Math.round(CARD_HEIGHT * (num / den));
              return (
                <SlideCard
                  key={i}
                  src={p.src}
                  caption={p.caption}
                  width={cardWidth}
                  height={CARD_HEIGHT}
                  onClick={() => setLightboxIdx(i)}
                  snapAlign={isMobile}
                />
              );
            })}
          </div>

          {/* Right arrow: RTL=backward(disabled at start), LTR=forward(disabled at end) */}
          {!isMobile && (
            <ArrowBtn dir="right" disabled={isRtl ? !canPrev : !canNext} onClick={() => doScroll(SCROLL_AMT)} isRtl={isRtl} />
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
            aria-label="Close lightbox"
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

          {/* Counter — always LTR so small number is on the left */}
          <div style={{
            position:   'absolute',
            top:        '24px',
            left:       '50%',
            transform:  'translateX(-50%)',
            fontFamily: 'Ploni, sans-serif',
            fontSize:   '14px',
            color:      'rgba(255,255,255,0.5)',
            direction:  'ltr',
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
              {/* Left btn: RTL=next(lbNext/›→‹), LTR=prev(lbPrev/‹) */}
              <button
                onClick={isRtl ? lbNext : lbPrev}
                aria-label={isRtl ? 'Next photo' : 'Previous photo'}
                style={{ ...LB_BTN, left: '20px' }}
              >
                {isRtl ? '›' : '‹'}
              </button>
              {/* Right btn: RTL=prev(lbPrev/‹→›), LTR=next(lbNext/›) */}
              <button
                onClick={isRtl ? lbPrev : lbNext}
                aria-label={isRtl ? 'Previous photo' : 'Next photo'}
                style={{ ...LB_BTN, right: '20px' }}
              >
                {isRtl ? '‹' : '›'}
              </button>
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
              <button
                onClick={isRtl ? lbNext : lbPrev}
                aria-label={isRtl ? 'Next photo' : 'Previous photo'}
                style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  color: '#fff', fontSize: '22px', padding: '8px 16px',
                  borderRadius: '20px', cursor: 'pointer',
                }}
              >
                {isRtl ? '›' : '‹'}
              </button>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontFamily: 'Ploni', direction: 'ltr' }}>
                {lightboxIdx + 1} / {PHOTOS.length}
              </span>
              <button
                onClick={isRtl ? lbPrev : lbNext}
                aria-label={isRtl ? 'Previous photo' : 'Next photo'}
                style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  color: '#fff', fontSize: '22px', padding: '8px 16px',
                  borderRadius: '20px', cursor: 'pointer',
                }}
              >
                {isRtl ? '‹' : '›'}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function SlideCard({ src, caption, width, height, onClick, snapAlign }) {
  return (
    <button
      onClick={onClick}
      aria-label={caption || 'View photo'}
      style={{
        flexShrink:      0,
        width:           `${width}px`,
        height:          `${height}px`,
        borderRadius:    RADIUS.xl,
        scrollSnapAlign: snapAlign ? 'start' : undefined,
        overflow:     'hidden',
        position:     'relative',
        cursor:       'pointer',
        boxShadow:    '0 2px 12px rgba(0,0,0,0.07)',
        padding:      0,
        border:       'none',
        background:   'none',
        display:      'block',
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
    </button>
  );
}
