/**
 * VideoTestimonials.jsx — Kilimanjaro climber video testimonials
 * Portrait cards (9:16) · horizontal scroll · YouTube modal
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COLOR, RADIUS, EASING, SHADOW } from '../../website/theme.js';
import { Analytics } from '../../utils/analytics.js';

export const KILI_TESTIMONIALS = [
  { id: 'k4F_rx8JBWk', name: 'צחי' },
  { id: 'q3MCC6fmytI', name: 'אהוד' },
  { id: '0yWZHR7XHkk', name: 'אביטל' },
  { id: 'xIisavnAoTY', name: 'אבי' },
  { id: 't0nRH2LODw8', name: 'נתנאל' },
  { id: '9SsFVN-lTGQ', name: 'טניה' },
  { id: 'rD-bUmCphjY', name: 'בוריס' },
  { id: 'j0zIBWzrBto', name: 'מאיה' },
];

function PlayIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="26" fill="rgba(0,0,0,0.52)" />
      <circle cx="26" cy="26" r="25" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <polygon points="21,17 39,26 21,35" fill="white" />
    </svg>
  );
}

function VideoCard({ video, onClick }) {
  const [hov, setHov] = useState(false);
  const thumb = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

  return (
    <div
      onClick={() => { onClick(video); Analytics.clickCTA('video_testimonial', 'kilimanjaro'); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flexShrink: 0,
        width: '175px',
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hov ? 'translateY(-4px) scale(1.02)' : 'none',
        boxShadow: hov ? SHADOW.lg : SHADOW.sm,
        transition: `all 0.25s ${EASING.out}`,
        scrollSnapAlign: 'start',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '9/16', overflow: 'hidden', background: '#1E1B4B' }}>
        <img
          src={thumb}
          alt={video.name}
          loading="lazy"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
        }} />
        {/* Play button */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hov ? 1 : 0.85,
          transition: `opacity 0.2s`,
        }}>
          <PlayIcon />
        </div>
        {/* Name at bottom */}
        <div style={{
          position: 'absolute', bottom: '12px', right: '12px', left: '12px',
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
            margin: '2px 0 0',
            fontFamily: "'Ploni', sans-serif",
            fontSize: '12px',
            color: 'rgba(255,255,255,0.7)',
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
 * @param {number}  [limit]         – cap cards shown (home page: 3). undefined = all.
 * @param {string}  [seeAllHref]    – "see all" button link when limit is set
 * @param {boolean} [darkBg]        – true for dark section background
 */
export default function VideoTestimonials({ limit, seeAllHref, darkBg = false }) {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [active, setActive] = useState(null);

  const videos = limit ? KILI_TESTIMONIALS.slice(0, limit) : KILI_TESTIMONIALS;

  return (
    <section
      id="testimonials"
      style={{
        padding: '80px 0 64px',
        background: darkBg ? 'linear-gradient(160deg,#0A0818,#1E1B4B)' : '#F8F7FF',
        direction: 'rtl',
      }}
    >
      {/* Header */}
      <div style={{ padding: '0 5vw', marginBottom: '32px', position: 'relative' }}>
        <span style={{
          fontSize: '11px', fontWeight: 700,
          color: darkBg ? COLOR.lighter : COLOR.primary,
          textTransform: 'uppercase', letterSpacing: '2px',
          display: 'block', marginBottom: '10px',
        }}>
          {isEn ? 'Testimonials' : 'ממליצים'}
        </span>
        <h2 style={{
          fontSize: 'clamp(24px, 3.5vw, 38px)',
          fontWeight: 900,
          color: darkBg ? '#FFFFFF' : COLOR.text,
          margin: 0,
          letterSpacing: '-1px',
          lineHeight: 1.1,
        }}>
          {isEn ? 'What our Kilimanjaro climbers say' : 'מה אומרים אלה שכבר עלו לקילי'}
        </h2>
        {limit && seeAllHref && (
          <a
            href={seeAllHref}
            style={{
              position: 'absolute',
              bottom: 0,
              left: '5vw',
              fontSize: '14px', fontWeight: 700,
              color: darkBg ? COLOR.lighter : COLOR.primary,
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
        padding: '4px 5vw 16px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} onClick={setActive} />
        ))}
      </div>

      <Modal video={active} onClose={() => setActive(null)} />
    </section>
  );
}
