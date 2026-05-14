/**
 * MobilePhotoCarousel.jsx
 * Reusable full-width snap-scroll carousel for mobile galleries.
 * Used in: ExpeditionDetail, IsraelDetail, GallerySection
 *
 * Props:
 *   images        – string[]  – array of image src URLs
 *   altPrefix     – string    – prefix for alt text  (e.g. "טרק סובב אנאפורנה")
 *   onImageClick  – (idx) =>  – called when a card is tapped (for lightbox)
 *   hint          – string    – optional badge on first card (default "לחץ להגדלה")
 */

import { useState, useRef } from 'react';
import { RADIUS } from '../../website/theme.js';

export default function MobilePhotoCarousel({ images, altPrefix = '', onImageClick, hint }) {
  const [activeIdx, setActiveIdx]           = useState(0);
  const [imgOrientations, setImgOrientations] = useState({});
  const carouselRef = useRef(null);

  const hintLabel = hint !== undefined ? hint : 'לחץ להגדלה';

  return (
    <div style={{ position: 'relative' }}>

      {/* ── Scrollable track ── */}
      <div
        ref={carouselRef}
        onScroll={e => {
          const el = e.currentTarget;
          const cardW = el.offsetWidth * 0.88 + 12;
          const idx = Math.round(Math.abs(el.scrollLeft) / cardW);
          setActiveIdx(Math.max(0, Math.min(idx, images.length - 1)));
        }}
        style={{
          display:                 'flex',
          gap:                     '12px',
          direction:               'ltr',          /* keep scrollLeft positive in RTL pages */
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
              aspectRatio:     '3/4',
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
            {i === 0 && hintLabel && (
              <div style={{
                position:       'absolute',
                bottom:         '12px',
                left:           '12px',
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
            onClick={() => {
              const el = carouselRef.current;
              if (!el) return;
              const cardW = el.offsetWidth * 0.88 + 12;
              el.scrollTo({ left: i * cardW, behavior: 'smooth' });
              setActiveIdx(i);
            }}
            style={{
              width:      activeIdx === i ? '20px' : '7px',
              height:     '7px',
              borderRadius: '4px',
              background: activeIdx === i ? '#6D28D9' : '#D1C9F0',
              border:     'none',
              padding:    0,
              cursor:     'pointer',
              transition: 'all 0.25s ease',
            }}
            aria-label={`תמונה ${i + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
