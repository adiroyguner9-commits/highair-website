/**
 * VideoTestimonials.jsx — Kilimanjaro climber video testimonials
 * Portrait cards (9:16) · horizontal scroll · YouTube modal
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COLOR, RADIUS, EASING } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { Analytics } from '../../utils/analytics.js';

export const KILI_TESTIMONIALS = [
  { id: 'k4F_rx8JBWk', name: 'צחי',   pos: 'center top' },
  { id: 'q3MCC6fmytI', name: 'אהוד',  pos: 'center 25%' },
  { id: '0yWZHR7XHkk', name: 'אביטל', pos: 'center 20%' },
  { id: 'xIisavnAoTY', name: 'אבי',   pos: 'center top' },
  { id: 't0nRH2LODw8', name: 'נתנאל', pos: 'center 30%' },
  { id: '9SsFVN-lTGQ', name: 'טניה',  pos: 'center 15%' },
  { id: 'rD-bUmCphjY', name: 'בוריס', pos: 'center 55%' },
  { id: 'j0zIBWzrBto', name: 'מאיה',  pos: 'center 15%' },
];

function PlayIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.48)" />
      <circle cx="24" cy="24" r="23" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <polygon points="19,15 37,24 19,33" fill="white" />
    </svg>
  );
}

function VideoCard({ video, onClick, cardWidth }) {
  const [hov, setHov] = useState(false);
  const thumb = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

  return (
    <div
      onClick={() => { onClick(video); Analytics.clickCTA('video_testimonial', 'kilimanjaro'); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flexShrink: 0,
        width: `${cardWidth}px`,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hov ? 'translateY(-4px) scale(1.02)' : 'none',
        boxShadow: hov
          ? '0 20px 48px rgba(0,0,0,0.22)'
          : '0 4px 16px rgba(0,0,0,0.10)',
        transition: `all 0.25s ${EASING.out}`,
        scrollSnapAlign: 'start',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '9/16', overflow: 'hidden', background: '#0A0818' }}>
        <img
          src={thumb}
          alt={video.name}
          loading="lazy"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: video.pos,
            display: 'block',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
        }} />
        {/* Play button */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hov ? 1 : 0.82,
          transition: `opacity 0.2s`,
        }}>
          <PlayIcon />
        </div>
        {/* Name + destination */}
        <div style={{
          position: 'absolute', bottom: '14px', right: '14px', left: '14px',
          direction: 'rtl',
        }}>
          <p style={{
            margin: 0,
            fontFamily: "'Ploni', sans-serif",
            fontSize: '15px',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.2px',
          }}>
            {video.name}
          </p>
          <p style={{
            margin: '3px 0 0',
            fontFamily: "'Ploni', sans-serif",
            fontSize: '12px',
            color: 'rgba(255,255,255,0.65)',
          }}>
            קילימנג׳רו
          </p>
        </div>
      </div>
    </div>
  );
}

function Modal({ video, onClose }) {
  if (!video) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.88)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '340px',
          maxWidth: '90vw',
          borderRadius: RADIUS['2xl'],
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
      >
        <div style={{ aspectRatio: '9/16', position: 'relative' }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.name}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '10px', left: '10px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)', border: 'none',
            color: 'white', fontSize: '16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
          }}
          aria-label="סגור"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * @param {number}  [limit]       – cap cards shown. undefined = all.
 * @param {string}  [seeAllHref]  – "see all" link when limit is set
 * @param {boolean} [darkBg]      – true for dark section background
 */
export default function VideoTestimonials({ limit, seeAllHref, darkBg = false }) {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const { isMobile } = useBreakpoint();
  const [active, setActive] = useState(null);

  const videos = limit ? KILI_TESTIMONIALS.slice(0, limit) : KILI_TESTIMONIALS;
  const textColor   = darkBg ? '#FFFFFF' : '#0A0818';
  const accentColor = darkBg ? COLOR.lighter : COLOR.primary;
  const cardWidth   = isMobile ? 160 : 200;

  return (
    <section
      id="testimonials"
      style={{
        padding: isMobile ? '48px 0' : '72px 0',
        background: darkBg ? 'linear-gradient(160deg,#0A0818,#1E1B4B)' : 'transparent',
        direction: 'rtl',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '28px', position: 'relative' }}>
        <span style={{
          fontSize: '11px', fontWeight: 700,
          color: accentColor,
          textTransform: 'uppercase', letterSpacing: '2px',
          display: 'block', marginBottom: '8px',
        }}>
          {isEn ? 'Testimonials' : 'ממליצים'}
        </span>
        <h2 style={{
          fontFamily: "'Ploni', sans-serif",
          fontSize: 'clamp(22px, 3.5vw, 32px)',
          fontWeight: 700,
          color: textColor,
          letterSpacing: '-0.02em',
          margin: 0,
          lineHeight: 1.1,
        }}>
          {isEn ? 'What our Kilimanjaro climbers say' : 'מה אומרים אלה שכבר עלו לקילי'}
        </h2>
        {limit && seeAllHref && (
          <a
            href={seeAllHref}
            style={{
              position: 'absolute', bottom: 0, left: 0,
              fontSize: '14px', fontWeight: 700,
              color: accentColor,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              borderBottom: '1px solid',
              paddingBottom: '1px',
            }}
          >
            {isEn ? 'See all →' : 'לכל הסרטונים ←'}
          </a>
        )}
      </div>

      {/* Horizontal scroll */}
      <div style={{
        display: 'flex',
        gap: '14px',
        overflowX: 'auto',
        padding: '4px 0 16px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} onClick={setActive} cardWidth={cardWidth} />
        ))}
      </div>

      <Modal video={active} onClose={() => setActive(null)} />
    </section>
  );
}
