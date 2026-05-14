/**
 * MobilePhotoCarousel.jsx
 * Reusable full-width snap-scroll carousel for mobile galleries.
 * Used in: ExpeditionDetail, IsraelDetail
 *
 * Props:
 *   images        – string[]  – array of image src URLs
 *   altPrefix     – string    – prefix for alt text
 *   onImageClick  – (idx) =>  – called when a card is tapped (for lightbox)
 *   hint          – string    – optional badge on first/last card
 *   isRtl         – boolean   – true = RTL (Hebrew): first image on right, swipe R→L
 */

import { useState, useRef } from 'react';
import { RADIUS } from '../../website/theme.js';

export default function MobilePhotoCarousel({ images, altPrefix = '', onImageClick, hint, isRtl = false }) {
  const [activeIdx, setActiveIdx]             = useState(0);
  const [imgOrientations, setImgOrientations] = useState({});
  const carouselRef = useRef(null);

  const hintLabel = hint !== undefined ? hint : (isRtl ? 'לחץ להגדלה' : 'Tap to zoom');

  /* In RTL the flex container has direction:rtl so item 0 is on the right.
     scrollLeft starts at 0 (first item visible) and goes negative as you scroll left.
     Math.abs(scrollLeft) / cardW gives the correct active index in both directions. */
  const handleScroll = e => {
    const el = e.currentTarget;
    const cardW = el.offsetWidth * 0.88 + 12;
    const idx = Math.round(Math.abs(el.scrollLeft) / cardW);
    setActiveIdx(Math.max(0, Math.min(idx, images.length - 1)));
  };

  const scrollToIdx = i => {
    const el = carouselRef.current;
    if (!el) return;
    const cardW = el.offsetWidth * 0.88 + 12;
    /* RTL: negative scrollLeft moves content leftward (toward later items) */
    el.scrollTo({ left: isRtl ? -(i * cardW) : i * cardW, behavior: 'smooth' });
    setActiveIdx(i);
  };

  /* The "first" card carries the hint badge.
     In LTR the first image (i=0) is on the left — badge on card 0.
     In RTL the first image (i=0) is on the right — badge on card 0 (still). */
  const hintCardIdx = 0;

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
        {images.map((src, i) => (
          <div
            key={src + i}
            onClick={() => onImageClick?.(i)}
            style={{
              flex:            '0 0 88%',
              scrollSnapAlign: 'center',
              borderRadius:    RADIUS.xl,
              overflow:        'hidden',
              aspectRatio:     '4/3',
              cursor:          onImageClick ? 'zoom-in' : 'default',
              position:        'relative',
              boxShadow:       '0 4px 20px rgba(0,0,0,0.12)',
            }}
          >
            <img
              src={src}
              alt={`${altPrefix} ${i + 1}`}
              loading="lazy"
              decoding="async"
              onLoad={e => {
                const { naturalWidth: w, naturalHeight: h } = e.target;
                setImgOrientations(prev => ({ ...prev, [i]: w >= h ? 'landscape' : 'portrait' }));
              }}
              onError={e => { e.currentTarget.parentElement.style.display = 'none'; }}
              style={{
                width:          '100%',
                height:         '100%',
                objectFit:      'cover',
                objectPosition: imgOrientations[i] === 'portrait' ? 'center 20%' : 'center',
                display:        'block',
              }}
            />

            {/* Hint badge on first card */}
            {i === hintCardIdx && hintLabel && (
              <div style={{
                position:       'absolute',
                bottom:         '12px',
                /* badge sticks to the reading-start edge */
                [isRtl ? 'right' : 'left']: '12px',
                background:     'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(6px)',
                borderRadius:   '20px',
                padding:        '4px 10px',
                color:          '#fff',
                fontSize:       '11px',
                fontFamily:     "'Ploni', sans-serif",
                pointerEvents:  'none',
              }}>
                {hintLabel}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Dots — always LTR order so dot 0 = leftmost in both languages ── */}
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
