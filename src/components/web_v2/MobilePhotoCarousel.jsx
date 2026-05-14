/**
 * MobilePhotoCarousel.jsx
 * Reusable full-width snap-scroll carousel for mobile galleries.
 * Used in: ExpeditionDetail, IsraelDetail
 *
 * Smart per-image rendering:
 *   Landscape → object-fit:cover  (fills card, tiny side-crop, zero bars)
 *   Portrait  → object-fit:contain + blurred backdrop (zero cropping, zero bars)
 *
 * Props:
 *   images        – string[]
 *   altPrefix     – string
 *   onImageClick  – (idx) => void
 *   hint          – string   (badge on first card; pass "" to hide)
 *   isRtl         – boolean
 */

import { useState, useRef } from 'react';
import { RADIUS } from '../../website/theme.js';

const CARD_HEIGHT = 280; // px — fixed for all cards

export default function MobilePhotoCarousel({ images, altPrefix = '', onImageClick, hint, isRtl = false }) {
  const [activeIdx, setActiveIdx]             = useState(0);
  const [imgOrientations, setImgOrientations] = useState({}); // 'landscape' | 'portrait'
  const carouselRef = useRef(null);

  const hintLabel = hint !== undefined ? hint : (isRtl ? 'לחץ להגדלה' : 'Tap to zoom');

  const handleScroll = e => {
    const el  = e.currentTarget;
    const cardW = el.offsetWidth * 0.88 + 12;
    const idx = Math.round(Math.abs(el.scrollLeft) / cardW);
    setActiveIdx(Math.max(0, Math.min(idx, images.length - 1)));
  };

  const scrollToIdx = i => {
    const el = carouselRef.current;
    if (!el) return;
    const cardW = el.offsetWidth * 0.88 + 12;
    el.scrollTo({ left: isRtl ? -(i * cardW) : i * cardW, behavior: 'smooth' });
    setActiveIdx(i);
  };

  return (
    <div style={{ position: 'relative' }}>

      {/* ── Scrollable track ── */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        style={{
          display:                 'flex',
          gap:                     '12px',
          direction:               isRtl ? 'rtl' : 'ltr',
          overflowX:               'auto',
          scrollSnapType:          'x mandatory',
          scrollBehavior:          'smooth',
          scrollbarWidth:          'none',
          msOverflowStyle:         'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft:             '5%',
          paddingRight:            '5%',
          paddingBottom:           '4px',
        }}
      >
        {images.map((src, i) => {
          const orient    = imgOrientations[i];          // 'landscape' | 'portrait' | undefined
          const isPortrait = orient === 'portrait';

          return (
            <div
              key={src + i}
              onClick={() => onImageClick?.(i)}
              style={{
                flex:            '0 0 88%',
                scrollSnapAlign: 'center',
                borderRadius:    RADIUS.xl,
                overflow:        'hidden',
                height:          `${CARD_HEIGHT}px`,
                cursor:          onImageClick ? 'zoom-in' : 'default',
                position:        'relative',
                boxShadow:       '0 4px 20px rgba(0,0,0,0.15)',
                background:      '#111',
              }}
            >
              {/* ── Blurred backdrop — only for portrait images ── */}
              {isPortrait && (
                <div style={{
                  position:   'absolute',
                  inset:      '-10px',
                  background: `url(${src}) center/cover no-repeat`,
                  filter:     'blur(18px) brightness(0.55)',
                  transform:  'scale(1.05)',
                  zIndex:     0,
                }} />
              )}

              {/* ── Main image ── */}
              <img
                src={src}
                alt={`${altPrefix} ${i + 1}`}
                loading="lazy"
                decoding="async"
                onLoad={e => {
                  const { naturalWidth: w, naturalHeight: h } = e.target;
                  setImgOrientations(prev => ({
                    ...prev,
                    [i]: w >= h ? 'landscape' : 'portrait',
                  }));
                }}
                onError={e => { e.currentTarget.parentElement.style.display = 'none'; }}
                style={{
                  position:      'absolute',
                  inset:         0,
                  width:         '100%',
                  height:        '100%',
                  objectFit:     isPortrait ? 'contain' : 'cover',
                  objectPosition:'center',
                  display:       'block',
                  zIndex:        1,
                }}
              />

              {/* ── Hint badge on first card ── */}
              {i === 0 && hintLabel && (
                <div style={{
                  position:       'absolute',
                  bottom:         '12px',
                  [isRtl ? 'right' : 'left']: '12px',
                  background:     'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(6px)',
                  borderRadius:   '20px',
                  padding:        '4px 10px',
                  color:          '#fff',
                  fontSize:       '11px',
                  fontFamily:     "'Ploni', sans-serif",
                  pointerEvents:  'none',
                  zIndex:         2,
                }}>
                  {hintLabel}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Dots ── */}
      <div style={{
        display:        'flex',
        justifyContent: 'center',
        gap:            '6px',
        marginTop:      '14px',
        direction:      'ltr',
      }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIdx(i)}
            style={{
              width:        activeIdx === i ? '20px' : '7px',
              height:       '7px',
              borderRadius: '4px',
              background:   activeIdx === i ? '#6D28D9' : '#D1C9F0',
              border:       'none',
              padding:      0,
              cursor:       'pointer',
              transition:   'all 0.25s ease',
            }}
            aria-label={`תמונה ${i + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
