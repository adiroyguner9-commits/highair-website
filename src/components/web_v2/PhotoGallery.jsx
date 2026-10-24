/**
 * PhotoGallery.jsx - the site's photo gallery: masonry on desktop, the snap
 * carousel on phones, and a full-screen lightbox.
 * Used by: ExpeditionDetail (trip pages) and GallerySection (homepage), so the
 * two look and behave the same (owner, 24 Oct 2026). The markup is the trip
 * page's gallery, moved here unchanged.
 *
 * Props:
 *   images        – string[] (the originals; the lightbox opens these)
 *   orientations  – { [index]: 'landscape' | 'portrait' } known up front (from
 *                   galleryManifest.json); each photo is measured again on load
 *   thumbOf       – (src) => the lighter copy shown in the grid / carousel
 *   altPrefix     – the trip / section name, for the carousel's alt text
 *   altOf         – (index) => alt text (grid and lightbox)
 *   hint          – badge on the first phone card ("לחץ להגדלה")
 *   isRtl, isMobile
 */
import { useState, useEffect } from 'react';
import { RADIUS } from '../../website/theme.js';
import MobilePhotoCarousel from './MobilePhotoCarousel.jsx';

export default function PhotoGallery({ images, orientations = {}, thumbOf = src => src, altPrefix = '', altOf = i => `${altPrefix} ${i + 1}`.trim(), hint, isRtl, isMobile }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [measured, setMeasured] = useState({});
  const orient = i => measured[i] || orientations[i];   // the loaded photo has the last word, as before

  /* Keyboard in the lightbox (Escape, arrows), and the page behind it does not scroll */
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = e => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowLeft')  setLightboxIdx(i => (isRtl ? Math.min(i + 1, images.length - 1) : Math.max(i - 1, 0)));
      if (e.key === 'ArrowRight') setLightboxIdx(i => (isRtl ? Math.max(i - 1, 0) : Math.min(i + 1, images.length - 1)));
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [lightboxIdx, isRtl, images.length]);

  return (
    <>
      {/* ── Mobile: snap carousel / Desktop: masonry ── */}
      {isMobile ? (
        <div style={{ margin: '0 -5%' }}>
          <MobilePhotoCarousel
            images={images}
            altPrefix={altPrefix}
            onImageClick={i => setLightboxIdx(i)}
            thumbOf={thumbOf}
            hint={hint}
            isRtl={isRtl}
          />
        </div>
      ) : (
        /* ── Desktop: masonry columns ── */
        <div style={{ columnCount: 3, columnGap: '10px' }}>
          {images.map((src, i) => {
            const ratio = orient(i) === 'portrait' ? '3/4' : '4/3';
            return (
              <div
                key={src}
                onClick={() => setLightboxIdx(i)}
                style={{
                  breakInside: 'avoid',
                  marginBottom: '10px',
                  borderRadius: RADIUS.lg,
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  position: 'relative',
                  aspectRatio: ratio,
                }}
                onMouseEnter={e => e.currentTarget.querySelector('div')?.style && (e.currentTarget.querySelector('div').style.opacity = '1')}
                onMouseLeave={e => e.currentTarget.querySelector('div')?.style && (e.currentTarget.querySelector('div').style.opacity = '0')}
              >
                <img
                  src={thumbOf(src)}
                  alt={altOf(i)}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center',
                    display: 'block', transition: 'transform 0.3s ease',
                  }}
                  onLoad={e => {
                    const { naturalWidth: w, naturalHeight: h } = e.target;
                    setMeasured(prev => ({ ...prev, [i]: w >= h ? 'landscape' : 'portrait' }));
                  }}
                  onError={e => { e.currentTarget.parentElement.style.display = 'none'; }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.15)',
                  opacity: 0, transition: 'opacity 0.2s ease',
                  pointerEvents: 'none',
                }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (() => {
        const hasPrev = lightboxIdx > 0;
        const hasNext = lightboxIdx < images.length - 1;
        const btnStyle = {
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
          width: '48px', height: '48px', fontSize: '26px', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute',
        };
        // In RTL: left = next, right = prev (reading direction flipped)
        const leftAction  = isRtl ? () => setLightboxIdx(i => i + 1) : () => setLightboxIdx(i => i - 1);
        const rightAction = isRtl ? () => setLightboxIdx(i => i - 1) : () => setLightboxIdx(i => i + 1);
        const leftArrow   = isRtl ? '›' : '‹';
        const rightArrow  = isRtl ? '‹' : '›';
        const showLeft    = isRtl ? hasNext : hasPrev;
        const showRight   = isRtl ? hasPrev : hasNext;
        return (
          <div
            onClick={() => setLightboxIdx(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px',
            }}
          >
            {showLeft && (
              <button onClick={e => { e.stopPropagation(); leftAction(); }}
                aria-label={isRtl ? 'התמונה הבאה' : 'Previous photo'}
                style={{ ...btnStyle, left: isMobile ? '8px' : '24px' }}>
                {leftArrow}
              </button>
            )}
            <img
              src={images[lightboxIdx]}
              alt={altOf(lightboxIdx)}
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '100%', maxHeight: '90vh',
                borderRadius: RADIUS.xl,
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                objectFit: 'contain',
              }}
            />
            {showRight && (
              <button onClick={e => { e.stopPropagation(); rightAction(); }}
                aria-label={isRtl ? 'התמונה הקודמת' : 'Next photo'}
                style={{ ...btnStyle, right: isMobile ? '8px' : '24px' }}>
                {rightArrow}
              </button>
            )}
            {/* Close */}
            <button onClick={() => setLightboxIdx(null)} aria-label={isRtl ? 'סגירה' : 'Close'} style={{
              ...btnStyle, width: '40px', height: '40px', fontSize: '18px',
              top: '16px', right: '16px',
            }}>✕</button>
            {/* Counter — always LTR so numbers don't flip */}
            <div style={{
              position: 'absolute', bottom: '20px', direction: 'ltr',
              background: 'rgba(255,255,255,0.15)', borderRadius: '20px',
              padding: '6px 16px', color: '#fff', fontSize: '14px',
              fontFamily: "'Ploni', sans-serif",
            }}>
              {lightboxIdx + 1} / {images.length}
            </div>
          </div>
        );
      })()}
    </>
  );
}
