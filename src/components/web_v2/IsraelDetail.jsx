/**
 * IsraelDetail.jsx - Detail page for Israel trips
 * Route: /israel/:slug
 */
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header     from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import FloatingWA from './FloatingWA.jsx';
import { FS }     from '../../website/theme.js';
import { ISRAEL_TRIPS } from '../../data/israelData.js';

const WA_PHONE = '972555636975';

export default function IsraelDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const trip = ISRAEL_TRIPS.find(t => t.slug === slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  /* ── 404 fallback ── */
  if (!trip) {
    return (
      <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: FS.h2, color: '#0A0818' }}>הטיול לא נמצא</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '16px', cursor: 'pointer', padding: '10px 24px', border: 'none', borderRadius: '50px', background: '#6D28D9', color: '#fff', fontSize: FS.body }}>
          חזרה לדף הבית
        </button>
      </div>
    );
  }

  const waMsg = encodeURIComponent(`היי! אני מעוניין/ת לשמוע עוד על הטיול - ${trip.name} 🇮🇱`);
  const waHref = `https://wa.me/${WA_PHONE}?text=${waMsg}`;

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh' }}>
      <Header />
      <FloatingWA />

      {/* ── Hero ── */}
      <div style={{
        background:    trip.grad,
        minHeight:     '340px',
        display:       'flex',
        flexDirection: 'column',
        justifyContent:'flex-end',
        padding:       '0 5% 48px',
        boxSizing:     'border-box',
        paddingTop:    '120px',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px', borderRadius: '50px',
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
            fontSize: FS.sm, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
            marginBottom: '16px',
          }}>
            {trip.area} 🇮🇱
          </div>
          <h1 style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize: FS.h1, fontWeight: 700,
            color: '#FFFFFF', margin: '0 0 12px',
            letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            {trip.name}
          </h1>
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize: FS.body, color: 'rgba(255,255,255,0.80)',
            margin: 0,
          }}>
            גובה: {trip.elev} &nbsp;·&nbsp; מחיר: {trip.price} לאדם
          </p>
        </div>
      </div>

      {/* ── Content placeholder ── */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 5% 80px' }}>

        {/* Registration CTA */}
        <div style={{
          background: '#F8F6FF', borderRadius: '20px',
          padding: '32px', marginBottom: '40px', textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize: '22px', fontWeight: 700,
            color: '#0A0818', margin: '0 0 12px',
          }}>
            מעוניינים להצטרף?
          </h2>
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize: FS.body, color: '#3D3B5A',
            lineHeight: 1.7, margin: '0 0 24px',
          }}>
            שלחו לנו הודעה בוואטסאפ ונחזור אליכם עם כל הפרטים על {trip.name}
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 32px', borderRadius: '50px',
              background: '#25D366', color: '#FFFFFF',
              fontFamily: "'Ploni', sans-serif",
              fontSize: FS.btn, fontWeight: 700,
              textDecoration: 'none', direction: 'ltr',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            צרו קשר בוואטסאפ
          </a>
        </div>

        {/* Content coming soon */}
        <p style={{
          fontFamily: "'Ploni', sans-serif",
          fontSize: FS.body, color: '#9591B0',
          textAlign: 'center', lineHeight: 1.7,
        }}>
          תוכן מפורט לטיול זה יתווסף בקרוב.
        </p>

      </div>

      <SiteFooter />
    </div>
  );
}
