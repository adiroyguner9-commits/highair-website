/**
 * FaqAccordion.jsx - a visible "Frequently Asked Questions" accordion.
 *
 * Shared by the expedition and Israel-trek detail pages so the FAQPage JSON-LD
 * they emit is backed by visible on-page content (Google's FAQ policy) and so
 * AI engines can cite the Q&A directly. Matches the itinerary accordion styling.
 */
import { useState } from 'react';
import { COLOR, RADIUS, EASING } from '../../website/theme.js';

export default function FaqAccordion({ items, isRtl = true, isMobile = false }) {
  const [open, setOpen] = useState([]);
  if (!items || !items.length) return null;
  const dir = isRtl ? 'rtl' : 'ltr';
  const toggle = i => setOpen(o => o.includes(i) ? o.filter(x => x !== i) : [...o, i]);

  return (
    <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
      <h2 style={{
        fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
        fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 28px',
        textAlign: 'start', direction: dir,
      }}>
        {isRtl ? 'שאלות נפוצות' : 'Frequently Asked Questions'}
      </h2>
      <div style={{ border: '1px solid #ECEAF8', borderRadius: RADIUS.xl, overflow: 'hidden' }}>
        {items.map((item, idx) => {
          const isOpen = open.includes(idx);
          const isLast = idx === items.length - 1;
          return (
            <div key={idx} style={{ borderBottom: isLast ? 'none' : '1px solid #ECEAF8' }}>
              <button
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${idx}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '18px 20px', cursor: 'pointer',
                  background: isOpen ? '#FAFAFE' : 'white',
                  transition: `background 150ms ${EASING.smooth}`, direction: dir,
                  width: '100%', border: 'none', textAlign: 'start',
                }}
              >
                <span style={{
                  flex: 1, fontFamily: "'Ploni', sans-serif", fontSize: '16px',
                  fontWeight: 700, color: '#0A0818', lineHeight: 1.4,
                }}>
                  {item.q}
                </span>
                <span style={{ fontSize: '14px', color: COLOR.primary, flexShrink: 0 }}>
                  {isOpen ? '▴' : '▾'}
                </span>
              </button>
              <div id={`faq-panel-${idx}`} style={{ maxHeight: isOpen ? '600px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
                <p style={{
                  padding: '0 20px 18px', margin: 0,
                  fontFamily: "'Ploni', sans-serif", fontSize: '15px',
                  color: '#6B6B8A', lineHeight: 1.8, direction: dir,
                }}>
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
