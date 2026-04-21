/**
 * TermsOfService.jsx — תנאי שימוש
 */
import { useEffect } from 'react';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import { FS } from '../../website/theme.js';

export default function TermsOfService() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 5% 80px' }}>
        <h1 style={{ fontSize: FS.h1, fontWeight: 700, color: '#0A0818', marginBottom: '8px' }}>תנאי שימוש</h1>
        <p style={{ fontSize: FS.sm, color: '#9591B0', marginBottom: '48px' }}>עודכן לאחרונה: אפריל 2025</p>

        {/* תוכן יתווסף כאן */}
        <div style={{ fontSize: FS.body, color: '#3D3B5A', lineHeight: 1.9 }}>
          <p>התוכן בדף זה יתווסף בקרוב.</p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
