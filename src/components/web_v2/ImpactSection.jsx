/**
 * ImpactSection.jsx - מטיילים עם משמעות
 * תמונה משמאל · טקסט מימין · רקע לבן
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { COLOR, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';

const SLIDES = [
  '/images/donation/img-1.avif',
  '/images/donation/img-2.avif',
  '/images/donation/img-3.avif',
  '/images/donation/img-4.avif',
];

export default function ImpactSection() {
  const [active, setActive] = useState(0);
  const { isMobile } = useBreakpoint();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';

  const PARAGRAPHS = [
    t('impact.p1'),
    t('impact.p2'),
    t('impact.p3'),
  ];

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % SLIDES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="impact"
      style={{
        background: '#FFFFFF',
        padding:    isMobile ? '36px 5%' : '60px 5%',
        boxSizing:  'border-box',
        direction:  dir,
      }}
    >
      <div style={{
        maxWidth:      '1280px',
        margin:        '0 auto',
        display:       'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap:           isMobile ? '32px' : '64px',
        alignItems:    'center',
      }}>

        {/* ── LEFT: סליידר תמונות ── */}
        <div style={{
          flex:  '0 0 auto',
          width: isMobile ? '100%' : '46%',
          order: isMobile ? 2 : 1,
        }}>
          {/* מסגרת הסליידר */}
          <div style={{
            position:     'relative',
            borderRadius: RADIUS.xl,
            overflow:     'hidden',
            aspectRatio:  '4/3',
          }}>
            {SLIDES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="HighAir Expeditions - מטיילים עם משמעות, ביקור בבית חולים"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{
                  position:   'absolute',
                  inset:      0,
                  width:      '100%',
                  height:     '100%',
                  objectFit:  'cover',
                  opacity:    i === active ? 1 : 0,
                  transform:  i === active ? 'scale(1)' : 'scale(1.04)',
                  transition: `opacity 0.9s ${EASING.out}, transform 0.9s ${EASING.out}`,
                }}
              />
            ))}
          </div>

          {/* נקודות ניווט */}
          <div style={{
            display:        'flex',
            justifyContent: 'center',
            gap:            '7px',
            marginTop:      '14px',
          }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width:        i === active ? '22px' : '7px',
                  height:       '7px',
                  borderRadius: '4px',
                  background:   i === active ? COLOR.primary : '#D4D0EC',
                  border:       'none',
                  cursor:       'pointer',
                  padding:      0,
                  transition:   `all 0.3s ${EASING.out}`,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT: תוכן ── */}
        <div style={{
          flex:  '1 1 0',
          order: isMobile ? 1 : 2,
        }}>

          {/* כותרת */}
          <h2 style={{
            fontFamily:    'Ploni, sans-serif',
            fontSize:      FS.h2,
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 16px',
            letterSpacing: '-0.02em',
            lineHeight:    1.15,
            textAlign:     'center',
          }}>
            {t('impact.heading')}
          </h2>

          {/* פסקאות */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {PARAGRAPHS.map((p, i) => (
              <p key={i} style={{
                fontFamily: 'Ploni, sans-serif',
                fontSize:   FS.body,
                fontWeight: 300,
                color:      '#4B4869',
                margin:     0,
                lineHeight: 1.8,
                textAlign:  'start',
              }}>
                {p}
              </p>
            ))}
          </div>

          {/* CTA elegant */}
          <div style={{
            margin:    '32px auto 0',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily:    'Ploni, sans-serif',
              fontSize:      FS.h3,
              fontWeight:    700,
              color:         COLOR.primary,
              margin:        0,
              cursor:        'default',
              letterSpacing: '-0.01em',
              display:       'inline',
              background:    'linear-gradient(180deg, transparent 55%, rgba(109,40,217,0.18) 55%)',
              paddingBottom: '2px',
            }}>
              {t('impact.cta')}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
