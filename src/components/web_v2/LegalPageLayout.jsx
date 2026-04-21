/**
 * LegalPageLayout.jsx - shared wrapper for all legal/info pages
 * Usage: <LegalPageLayout title="..." subtitle="...">…sections…</LegalPageLayout>
 */
import { useEffect } from 'react';
import Header     from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import FloatingWA from './FloatingWA.jsx';
import { FS }     from '../../website/theme.js';

/* ── Shared style tokens (import these in every page) ── */
export const SECTION = {
  marginBottom: '36px',
};

export const H2 = {
  fontFamily:    "'Ploni', sans-serif",
  fontSize:      '22px',
  fontWeight:    700,
  color:         '#0A0818',
  margin:        '0 0 14px',
  letterSpacing: '-0.01em',
};

export const P = {
  fontFamily: "'Ploni', sans-serif",
  fontSize:   FS.body,
  color:      '#3D3B5A',
  lineHeight: 1.85,
  margin:     '0 0 12px',
};

export const LI = {
  fontFamily:   "'Ploni', sans-serif",
  fontSize:     FS.body,
  color:        '#3D3B5A',
  lineHeight:   1.85,
  marginBottom: '6px',
};

export const UL = {
  paddingRight: '20px',
  margin:       '0 0 16px',
};

export const CONTACT_BOX = {
  background:   '#F8F6FF',
  borderRadius: '16px',
  padding:      '28px 32px',
  marginBottom: '36px',
};

export const LINK = {
  color:          '#6D28D9',
  textDecoration: 'none',
};

/* ── Layout wrapper ── */
export default function LegalPageLayout({ title, subtitle = 'עודכן לאחרונה: אפריל 2025', children }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh' }}>
      <Header />
      <FloatingWA />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 5% 80px' }}>

        <h1 style={{
          fontFamily:    "'Ploni', sans-serif",
          fontSize:      FS.h1,
          fontWeight:    700,
          color:         '#0A0818',
          margin:        '0 0 8px',
          letterSpacing: '-0.02em',
        }}>
          {title}
        </h1>

        <p style={{ ...P, color: '#9591B0', marginBottom: '48px' }}>
          {subtitle}
        </p>

        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
