/**
 * IsraelDetail.jsx - Detail page for Israel trips
 * Route: /israel/:slug
 * Same visual language as ExpeditionDetail — without "חשוב לדעת" and "למה לטייל איתנו"
 */
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate }      from 'react-router-dom';
import { usePageMeta }                 from '../../website/usePageMeta.js';
import { COLOR, RADIUS, EASING, FS, BTN } from '../../website/theme.js';
import { useBreakpoint }               from '../../website/useBreakpoint.js';
import Header                          from './Header.jsx';
import SiteFooter                      from './SiteFooter.jsx';
import { CalendarIcon }                from '../Icons.jsx';
import { ISRAEL_TRIPS }                from '../../data/israelData.js';

/* ─── helpers ─── */
function scrollToForm() {
  const el = document.getElementById('israel-form');
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 32, behavior: 'smooth' });
}

function Separator() {
  return <div style={{ borderTop: '1px solid #ECEAF8', margin: 0 }} />;
}

/* ─── Stat chip ─── */
function StatBox({ label, value, isMobile, first, last }) {
  return (
    <div style={{
      textAlign:   'center',
      padding:     isMobile ? '14px 8px' : '4px 24px',
      borderRight: (!isMobile && !first) ? '1px solid #ECEAF8' : 'none',
      borderTop:   (isMobile && last)    ? '1px solid #ECEAF8' : 'none',
    }}>
      <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '18px' : '22px', fontWeight: 900, color: '#6D28D9', lineHeight: 1, letterSpacing: '-0.02em' }}>
        {value}
      </div>
      <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: FS.sm, fontWeight: 400, color: '#6B6B8A', marginTop: '6px', lineHeight: 1.4 }}>
        {label}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════ */
export default function IsraelDetail() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();
  const isNarrow   = isMobile || isTablet;
  const trip       = ISRAEL_TRIPS.find(t => t.slug === slug);

  usePageMeta(trip ? {
    title:         `${trip.name} | HighAir Expeditions`,
    description:   `הצטרפו לטרק ${trip.name} עם HighAir Expeditions. ${trip.elevStr ? trip.elevStr + ' — ' : ''}טרק ${trip.days} בשילוב תרומה למלחמה בסרטן.`,
    canonicalPath: `/israel/${trip.slug}`,
    image:         trip.img ? `https://www.highair-expeditions.com${trip.img}` : undefined,
  } : {
    title:       'HighAir Expeditions | טרקים בישראל',
    description: 'טרקים בישראל עם HighAir Expeditions.',
    canonicalPath: '/israel/' + slug,
  });

  /* ── Floating stats bar ── */
  const heroRef    = useRef(null);
  const [barVisible, setBarVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setBarVisible(!e.isIntersecting), { threshold: 0 });
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Hero button ── */
  const [heroBtnHovered, setHeroBtnHovered] = useState(false);

  /* ── Itinerary accordion ── */
  const [openItinerary, setOpenItinerary] = useState([]);
  function toggleItinerary(idx) {
    setOpenItinerary(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  }

  /* ── Contact form ── */
  const [form, setForm]         = useState({ name: '', month: '', phone: '', declaration: false });
  const [phoneError, setPhoneError] = useState('');

  function formatPhone(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    return digits.length > 3 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : digits;
  }

  function validatePhone(val) {
    const digits = val.replace(/\D/g, '');
    if (digits && digits.length < 9) { setPhoneError('מספר טלפון לא תקין'); return false; }
    setPhoneError(''); return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validatePhone(form.phone)) return;
    if (!form.declaration) return;
    if (trip.paymentUrl) {
      window.open(trip.paymentUrl, '_blank', 'noopener,noreferrer');
    }
  }


  /* ── Live groups from Airtable ── */
  const hasAirtable = !!(trip?.airtableEvents?.length);
  const [liveGroups, setLiveGroups]       = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError]     = useState(null);
  const [activeMonth, setActiveMonth]     = useState(null);

  useEffect(() => {
    if (!hasAirtable) return;
    setGroupsLoading(true);
    setGroupsError(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() + 3); /* shorter cutoff for local trips */

    Promise.all([
      fetch('/api/airtable/Groups?fields[]=Event&fields[]=Group%20Name&fields[]=Departure&fields[]=Return').then(r => r.json()),
      fetch('/api/airtable/Customers?fields[]=Group%20Name').then(r => r.json()),
    ]).then(([groupsData, custData]) => {
      if (groupsData.error) throw new Error(JSON.stringify(groupsData.error));

      const counts = {};
      (custData.records || []).forEach(rec => {
        const gn = rec.fields['Group Name'] || rec.fields['group name'];
        if (gn) counts[gn] = (counts[gn] || 0) + 1;
      });

      const events = new Set((trip.airtableEvents || []).map(e => e.toLowerCase()));
      const enriched = (groupsData.records || [])
        .filter(rec => events.has((rec.fields['Event'] || '').toLowerCase()))
        .map(rec => {
          const groupName = rec.fields['Group Name'] || rec.id;
          return {
            id:         rec.id,
            groupName,
            eventName:  rec.fields['Event'] || '',
            departure:  rec.fields['Departure'] || null,
            returnDate: rec.fields['Return'] || null,
            count:      counts[groupName] || 0,
          };
        })
        .filter(g => g.departure && new Date(g.departure) >= cutoff)
        .sort((a, b) => new Date(a.departure) - new Date(b.departure));

      setLiveGroups(enriched);
      if (enriched.length > 0) {
        const d = new Date(enriched[0].departure);
        setActiveMonth(`${d.getFullYear()}-${d.getMonth()}`);
      }
    }).catch(err => {
      setGroupsError(err.message);
    }).finally(() => setGroupsLoading(false));
  }, [trip?.airtableEvents?.join(',')]);

  /* ── Date helpers ── */
  function formatDateRange(dep, ret) {
    const d = new Date(dep);
    const r = new Date(ret || dep);
    const dd = String(d.getDate()).padStart(2, '0');
    const rr = String(r.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    if (!ret || (d.getMonth() === r.getMonth() && d.getFullYear() === r.getFullYear())) {
      return `${dd}-${rr}/${mm}`;
    }
    const mm2 = String(r.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm} - ${rr}/${mm2}`;
  }
  function monthKey(dep)   { const d = new Date(dep); return `${d.getFullYear()}-${d.getMonth()}`; }
  function monthLabel(dep) { return new Date(dep).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' }); }

  const months       = [...new Map(liveGroups.map(g => [monthKey(g.departure), monthLabel(g.departure)])).entries()];
  const visibleGroups = liveGroups.filter(g => monthKey(g.departure) === activeMonth);
  const capacity     = trip?.groupCapacity || 12;

  const inputStyle = {
    width: '100%', border: '1.5px solid #E5E3F0', borderRadius: RADIUS.lg,
    padding: '12px 16px', fontSize: FS.body, fontFamily: "'Ploni', sans-serif",
    direction: 'rtl', outline: 'none', boxSizing: 'border-box', background: '#fff',
    color: '#3D3B5A', transition: `border-color 200ms ${EASING.smooth}`,
  };
  const labelStyle = {
    display: 'block', marginBottom: '6px', fontWeight: 600,
    fontSize: '14px', color: '#3D3B5A', fontFamily: "'Ploni', sans-serif", direction: 'rtl',
  };

  /* ── 404 ── */
  if (!trip) {
    return (
      <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif" }}>
        <Header />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <div style={{ fontSize: '64px' }}>🇮🇱</div>
          <h1 style={{ color: '#0A0818', fontWeight: 700, fontFamily: "'Ploni', sans-serif" }}>הטרק לא נמצא</h1>
          <button onClick={() => navigate('/')} style={{ ...BTN.primary, fontFamily: "'Ploni', sans-serif" }}>חזרה לדף הבית ←</button>
        </div>
      </div>
    );
  }

  /* ─────────── RENDER ─────────── */
  return (
    <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Header />

      {/* ══ HERO ══ */}
      <div style={{
        position: 'relative', width: '100%',
        height: isMobile ? '65vh' : '100vh',
        minHeight: isMobile ? '480px' : '600px',
        overflow: 'hidden',
        background: trip.grad,
      }}>
        {trip.img && (
          <img src={trip.img} alt={trip.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        )}
        {/* overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)', zIndex: 1 }} />

        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'space-between', textAlign: 'center',
          padding: isMobile ? '140px 6% 120px' : '160px 8% 130px',
        }}>
          {/* Title pinned to top */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{
              fontFamily: "'Ploni', sans-serif", fontSize: FS.h1, fontWeight: 800,
              color: 'white', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1,
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}>
              {trip.name} ({trip.elevStr})
            </h1>
          </div>

          {/* Tagline + CTA pinned to bottom */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '14px' : '18px' }}>
            <p style={{
              fontFamily: "'Ploni', sans-serif", fontSize: FS.body, fontWeight: 400,
              color: 'rgba(255,255,255,0.80)', margin: 0, maxWidth: '620px',
              lineHeight: 1.6, textShadow: '0 1px 6px rgba(0,0,0,0.4)',
              whiteSpace: 'pre-line',
            }}>
              {trip.tagline || `הצטרפו אלינו ל${trip.name}\nוקחו חלק משמעותי בתרומה למלחמה בסרטן!`}
            </p>
            <button
              onClick={scrollToForm}
              onMouseEnter={() => setHeroBtnHovered(true)}
              onMouseLeave={() => setHeroBtnHovered(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: isMobile ? '13px 28px' : '15px 36px',
                borderRadius: '999px', border: 'none', cursor: 'pointer',
                fontFamily: "'Ploni', sans-serif", fontSize: FS.btn, fontWeight: 700,
                letterSpacing: '0.01em', marginTop: '8px',
                background: heroBtnHovered ? '#7C3AED' : COLOR.primary, color: '#FFFFFF',
                boxShadow: heroBtnHovered ? '0 10px 32px rgba(109,40,217,0.55)' : '0 4px 18px rgba(109,40,217,0.35)',
                transform: heroBtnHovered ? 'translateY(-2px)' : 'none',
                transition: `all 0.22s ${EASING.out}`,
                whiteSpace: 'nowrap',
              }}
            >
              להרשמה לטרק ←
            </button>
          </div>
        </div>
        <div ref={heroRef} style={{ position: 'absolute', bottom: 0, width: '100%', height: '1px', zIndex: 0 }} />
      </div>

      {/* ══ STATS CARD ══ */}
      <div style={{ padding: '0 5%', boxSizing: 'border-box', marginTop: '-52px', position: 'relative', zIndex: 10, direction: 'rtl' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          background: '#FFFFFF', borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          padding: isMobile ? '16px 20px' : '22px 52px',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        }}>
          <StatBox label="גובה"      value={`${trip.elev} מ׳`} isMobile={isMobile} first />
          <StatBox label="דרגת קושי" value={trip.diffHe}  isMobile={isMobile} />
          <StatBox label="משך"       value={trip.days}    isMobile={isMobile} />
          <StatBox label="עלות"      value={trip.price}   isMobile={isMobile} last />
        </div>
      </div>

      {/* ══ FLOATING BAR ══ */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transform: barVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: `transform 0.3s ${EASING.out}`, direction: 'rtl',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5%', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '16px' : '48px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>גובה</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif" }}>{trip.elev} מ׳</span>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>רמה</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif" }}>{trip.diffHe}</span>
              </div>
            )}
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>מחיר</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: COLOR.primary, fontFamily: "'Ploni', sans-serif" }}>{trip.price}</span>
              </div>
            )}
          </div>
          <button onClick={scrollToForm} style={{
            background: COLOR.primary, color: 'white', border: 'none',
            borderRadius: RADIUS.full, padding: '8px 20px',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Ploni', sans-serif", whiteSpace: 'nowrap',
          }}>
            הרשמה →
          </button>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 5%' : '0' }}>

        {/* ── א. מבוא ── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr', gap: '48px', alignItems: 'stretch' }}>
            <div>
              <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
                מבוא
              </h2>
              {trip.seasons?.length > 0 && (
                <p style={{ fontSize: '14px', color: '#6B6B8A', margin: '0 0 16px', fontFamily: "'Ploni', sans-serif" }}>
                  עונות מומלצות: {trip.seasons.join(' | ')}
                </p>
              )}
              {trip.desc ? (
                trip.desc.split('\n\n').map((p, i, arr) => (
                  <p key={i} style={{ fontSize: '16px', color: i === arr.length - 1 ? COLOR.primary : '#3D3B5A', fontWeight: i === arr.length - 1 ? 700 : 400, lineHeight: 1.75, margin: '0 0 16px', fontFamily: "'Ploni', sans-serif" }}>
                    {p}
                  </p>
                ))
              ) : (
                <p style={{ fontSize: '16px', color: '#9591B0', lineHeight: 1.75, fontFamily: "'Ploni', sans-serif" }}>תיאור יתווסף בקרוב.</p>
              )}
            </div>
            <div style={{ position: 'relative', minHeight: isNarrow ? '260px' : '400px' }}>
              {trip.img
                ? <img src={trip.img} alt={trip.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: RADIUS.xl }} />
                : <div style={{ position: 'absolute', inset: 0, background: trip.grad, borderRadius: RADIUS.xl }} />
              }
            </div>
          </div>
        </section>

        {trip.included?.length > 0 && (
          <>
            <Separator />
            {/* ── ב. מה כלול ── */}
            <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
              <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 32px' }}>
                מה כלול ומה לא כלול?
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                {/* כלול */}
                <div style={{ background: '#ECFDF5', borderRadius: RADIUS.xl, padding: '28px', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '18px', fontWeight: 700, color: '#059669', marginBottom: '20px' }}>מה כלול בתכנית?</div>
                  {trip.included.map((item, i) => {
                    const isHeader = item.endsWith(':');
                    return isHeader ? (
                      <div key={i} style={{ marginTop: i > 0 ? '24px' : 0, marginBottom: '14px' }}>
                        <span style={{ display: 'inline-block', background: '#D1FAE5', color: '#065F46', fontFamily: "'Ploni', sans-serif", fontSize: '13px', fontWeight: 700, padding: '4px 14px', borderRadius: '999px' }}>{item.slice(0,-1)}</span>
                      </div>
                    ) : (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < trip.included.length - 1 ? '14px' : 0 }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#059669', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>
                          <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>✓</span>
                        </div>
                        <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#3D3B5A', lineHeight: 1.6 }}>{item}</span>
                      </div>
                    );
                  })}
                </div>
                {/* לא כלול */}
                {trip.notIncluded?.length > 0 && (
                  <div style={{ background: '#FEF2F2', borderRadius: RADIUS.xl, padding: '28px', border: '1px solid #FECACA' }}>
                    <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '18px', fontWeight: 700, color: '#DC2626', marginBottom: '20px' }}>מה לא כלול בתכנית?</div>
                    {trip.notIncluded.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < trip.notIncluded.length - 1 ? '14px' : 0 }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#DC2626', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>
                          <span style={{ color: 'white', fontSize: '11px', fontWeight: 700 }}>✕</span>
                        </div>
                        <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#3D3B5A', lineHeight: 1.6 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {trip.itinerary?.length > 0 && (
          <>
            <Separator />
            {/* ── ג. תכנית הטיול ── */}
            <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
              <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 28px' }}>
                תכנית ה{trip.typeHe}
              </h2>
              <div style={{ border: '1px solid #ECEAF8', borderRadius: RADIUS.xl, overflow: 'hidden' }}>
                {trip.itinerary.map((item, idx) => {
                  const isOpen = openItinerary.includes(idx);
                  const isLast = idx === trip.itinerary.length - 1;
                  return (
                    <div key={idx} style={{ borderBottom: isLast ? 'none' : '1px solid #ECEAF8' }}>
                      <div
                        onClick={() => toggleItinerary(idx)}
                        style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', cursor: 'pointer', background: isOpen ? '#FAFAFE' : 'white', transition: `background 150ms ${EASING.smooth}`, direction: 'rtl' }}
                        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#FAFAFE'; }}
                        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'white'; }}
                      >
                        <span style={{ background: COLOR.primary, color: 'white', borderRadius: RADIUS.full, padding: '4px 12px', fontSize: '13px', fontWeight: 700, fontFamily: "'Ploni', sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>
                          יום {item.day}
                        </span>
                        <span style={{ flex: 1, fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 600, color: '#0A0818' }}>{item.title}</span>
                        <span style={{ fontSize: '14px', color: '#6B6B8A', flexShrink: 0 }}>{isOpen ? '▴' : '▾'}</span>
                      </div>
                      <div style={{ maxHeight: isOpen ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                        <p style={{ padding: '0 20px 20px', margin: 0, fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#6B6B8A', lineHeight: 1.8, direction: 'rtl', whiteSpace: 'pre-line' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* ── ג2. גלריה ── */}
        {(() => {
          const galleryImgs = [1,2,3,4,5].map(n => `/images/gallery/${trip.slug}/${n}.jpg`);
          const [lbIdx, setLbIdx] = useState(null);
          const lbPrev = (e) => { e.stopPropagation(); setLbIdx(i => (i - 1 + galleryImgs.length) % galleryImgs.length); };
          const lbNext = (e) => { e.stopPropagation(); setLbIdx(i => (i + 1) % galleryImgs.length); };

          return (
            <>
              <Separator />
              <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
                <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 28px' }}>
                  תמונות מה{trip.typeHe}
                </h2>

                {isMobile ? (
                  /* Mobile: horizontal scroll strip */
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingBottom: '4px' }}>
                    {galleryImgs.map((src, i) => (
                      <img
                        key={i} src={src} alt={`${trip.name} ${i + 1}`} loading="lazy"
                        onClick={() => setLbIdx(i)}
                        style={{ flexShrink: 0, width: '72vw', height: '200px', objectFit: 'cover', borderRadius: RADIUS.xl, cursor: 'pointer', display: 'block' }}
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                      />
                    ))}
                  </div>
                ) : (
                  /* Desktop: bento grid — large left + 2×2 right */
                  <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gridTemplateRows: '240px 240px', gap: '10px' }}>
                    {/* Large featured image */}
                    <div
                      onClick={() => setLbIdx(0)}
                      style={{ gridRow: '1 / 3', borderRadius: RADIUS.xl, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                      onMouseEnter={e => e.currentTarget.querySelector('div').style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.querySelector('div').style.opacity = '0'}
                    >
                      <img src={galleryImgs[0]} alt={`${trip.name} 1`} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: `transform 0.4s ${EASING.out}` }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', opacity: 0, transition: 'opacity 0.3s ease', borderRadius: RADIUS.xl, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: '28px' }}>⊕</span>
                      </div>
                    </div>
                    {/* 4 smaller images */}
                    {galleryImgs.slice(1, 5).map((src, i) => (
                      <div
                        key={i} onClick={() => setLbIdx(i + 1)}
                        style={{ borderRadius: RADIUS.xl, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                        onMouseEnter={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1.04)'; }}
                        onMouseLeave={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; }}
                      >
                        <img src={src} alt={`${trip.name} ${i + 2}`} loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: `transform 0.4s ${EASING.out}` }}
                          onError={e => { e.currentTarget.parentElement.style.display = 'none'; }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Lightbox */}
              {lbIdx !== null && (
                <div onClick={() => setLbIdx(null)} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(5,3,18,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button onClick={() => setLbIdx(null)} style={{ position: 'absolute', top: '20px', right: '20px', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'Ploni, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{lbIdx + 1} / {galleryImgs.length}</div>
                  <img src={galleryImgs[lbIdx]} alt={`${trip.name} ${lbIdx + 1}`} onClick={e => e.stopPropagation()} style={{ maxWidth: isMobile ? '95vw' : '88vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: RADIUS.xl, boxShadow: '0 32px 80px rgba(0,0,0,0.6)', userSelect: 'none' }} />
                  {!isMobile && (
                    <>
                      <button onClick={lbPrev} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontSize: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                      <button onClick={lbNext} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontSize: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                    </>
                  )}
                  {isMobile && (
                    <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button onClick={lbPrev} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '22px', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>‹</button>
                      <button onClick={lbNext} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '22px', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>›</button>
                    </div>
                  )}
                </div>
              )}
            </>
          );
        })()}

        <Separator />

        {/* ── ד. תאריכי יציאה ── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 24px' }}>
            תאריכי יציאה
          </h2>

          {groupsLoading ? (
            <div style={{ color: '#6B6B8A', fontFamily: "'Ploni', sans-serif", fontSize: '15px', padding: '8px 0' }}>
              טוען תאריכים...
            </div>

          ) : liveGroups.length > 0 ? (
            <>
              {/* Month tabs — only when more than 2 groups */}
              {liveGroups.length > 2 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {months.map(([key, label]) => (
                    <button key={key} onClick={() => setActiveMonth(key)} style={{
                      padding: '8px 18px', borderRadius: RADIUS.full, border: 'none', cursor: 'pointer',
                      fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 600,
                      background: activeMonth === key ? COLOR.primary : '#F3F0FF',
                      color:      activeMonth === key ? '#fff' : '#5B21B6',
                      transition: 'background 0.18s, color 0.18s',
                    }}>
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* Group cards */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
                {(liveGroups.length > 2 ? visibleGroups : liveGroups).map(g => {
                  const spotsLeft = capacity - g.count;
                  const isFull    = spotsLeft <= 0;
                  const isAlmost  = !isFull && spotsLeft <= 3;
                  const spotsColor = isFull ? '#DC2626' : isAlmost ? '#D97706' : '#059669';
                  return (
                    <div key={g.id}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(109,40,217,0.10)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
                      style={{
                        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        border: '1px solid #ECEAF8', borderRadius: RADIUS.lg,
                        padding: isMobile ? '14px 16px' : '12px 20px',
                        background: '#fff', direction: 'rtl',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        transition: 'box-shadow 0.2s',
                      }}>
                      {/* Right: date */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <CalendarIcon size={isMobile ? 16 : 18} color={COLOR.primary} />
                        <span style={{
                          fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '15px' : '17px',
                          fontWeight: 800, color: '#0A0818', lineHeight: 1.1,
                          direction: 'ltr', whiteSpace: 'nowrap',
                        }}>
                          {formatDateRange(g.departure, g.returnDate)}
                        </span>
                      </div>

                      {/* Center: spots */}
                      <span style={{ display: 'flex', justifyContent: 'center' }}>
                        <span style={{
                          background: isFull ? '#FEE2E2' : isAlmost ? '#FEF3C7' : '#ECFDF5',
                          color: spotsColor,
                          fontFamily: "'Ploni', sans-serif", fontSize: '11px', fontWeight: 700,
                          padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
                        }}>
                          {isFull ? 'מלא' : isAlmost ? `${spotsLeft} מקומות אחרונים` : `${spotsLeft} מקומות`}
                        </span>
                      </span>

                      {/* Left: CTA */}
                      <button onClick={scrollToForm} disabled={isFull} style={{
                        background: isFull ? '#E5E7EB' : COLOR.primary,
                        color: isFull ? '#9CA3AF' : 'white',
                        border: 'none', borderRadius: RADIUS.full,
                        padding: isMobile ? '10px 16px' : '12px 28px',
                        fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 700,
                        cursor: isFull ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap', justifySelf: 'end', transition: 'background 0.2s',
                      }}>
                        {isFull ? 'מלא' : 'להרשמה ←'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>

          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px 24px', borderRadius: RADIUS.xl, border: '1.5px dashed #DDD6FE', background: '#FAFAFF', textAlign: 'center', direction: 'rtl' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={COLOR.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '17px', fontWeight: 700, color: '#0A0818', margin: 0 }}>תאריכי ה{trip.typeHe} יפורסמו בקרוב</p>
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14px', color: '#6B6B8A', margin: 0, lineHeight: 1.6 }}>רוצים להירשם לרשימת ההמתנה ולקבל עדיפות?</p>
              <button onClick={scrollToForm} style={{ marginTop: '4px', padding: '10px 28px', borderRadius: RADIUS.full, border: 'none', background: COLOR.primary, color: '#fff', fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                השאירו פרטים
              </button>
            </div>
          )}
        </section>

      </main>

      {/* ══ CONTACT FORM ══ */}
      <div id="israel-form" style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)', padding: isMobile ? '48px 5%' : '72px 5%', direction: 'rtl' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(24px,4vw,40px)', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            הרשמה לטרק
          </h2>
          <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '16px', color: 'rgba(255,255,255,0.7)', margin: '0 0 40px' }}>
            מלאו את הפרטים ונחזור אליכם לאישור ורישום סופי
          </p>
          <div style={{ background: 'white', borderRadius: RADIUS.xl, padding: isMobile ? '24px' : '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'right' }}>
            <form onSubmit={handleSubmit} style={{ direction: 'rtl' }}>
              <div style={{ display: 'grid', gap: '16px' }}>

                {/* שם מלא */}
                <div>
                  <label style={labelStyle}>שם מלא *</label>
                  <input type="text" required value={form.name}
                    placeholder="ישראל ישראלי"
                    onChange={e => setForm(f => ({ ...f, name: e.target.value.replace(/[^א-תa-zA-Z\s]/g, '') }))}
                    style={inputStyle}
                    onMouseEnter={e => { e.target.style.borderColor = COLOR.primary; }}
                    onMouseLeave={e => { e.target.style.borderColor = '#E5E3F0'; }} />
                </div>

                {/* תאריך */}
                {(liveGroups.length > 0 || trip.dates?.length > 0) && (
                  <div>
                    <label style={labelStyle}>באיזה תאריך תרצו לטייל? *</label>
                    <select required value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} style={inputStyle}
                      onMouseEnter={e => { e.target.style.borderColor = COLOR.primary; }} onMouseLeave={e => { e.target.style.borderColor = '#E5E3F0'; }}>
                      <option value="">בחרו תאריך</option>
                      {liveGroups.length > 0
                        ? liveGroups.map(g => {
                            const label = formatDateRange(g.departure, g.returnDate);
                            return <option key={g.id} value={label}>{label}</option>;
                          })
                        : trip.dates.map((d, i) => <option key={i} value={d}>{d}</option>)
                      }
                    </select>
                  </div>
                )}

                {/* טלפון */}
                <div>
                  <label style={labelStyle}>מספר טלפון *</label>
                  <input type="tel" required value={form.phone}
                    placeholder="050-0000000"
                    maxLength={11}
                    onChange={e => { const v = formatPhone(e.target.value); setForm(f => ({ ...f, phone: v })); if (phoneError) validatePhone(v); }}
                    onBlur={e => validatePhone(e.target.value)}
                    style={{ ...inputStyle, direction: 'ltr', textAlign: 'right', borderColor: phoneError ? '#DC2626' : '#E5E3F0' }}
                    onMouseEnter={e => { e.target.style.borderColor = phoneError ? '#DC2626' : COLOR.primary; }}
                    onMouseLeave={e => { e.target.style.borderColor = phoneError ? '#DC2626' : '#E5E3F0'; }} />
                  {phoneError && <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#DC2626', margin: '4px 0 0' }}>{phoneError}</p>}
                </div>

                {/* הצהרת בריאות */}
                <label style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  cursor: 'pointer', direction: 'rtl',
                  padding: '14px 16px', borderRadius: RADIUS.lg,
                  border: `1.5px solid ${form.declaration ? COLOR.primary : '#E5E3F0'}`,
                  background: form.declaration ? '#F5F0FF' : '#FAFAFA',
                  transition: 'border-color 180ms, background 180ms',
                }}>
                  <input type="checkbox" required checked={form.declaration}
                    onChange={e => setForm(f => ({ ...f, declaration: e.target.checked }))}
                    style={{ marginTop: '3px', width: '18px', height: '18px', flexShrink: 0, accentColor: COLOR.primary, cursor: 'pointer' }} />
                  <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#3D3B5A', lineHeight: 1.7 }}>
                    אני מצהיר/ה כי מצבי הבריאותי מאפשר השתתפות בטיול הכולל הליכות של 8-5 שעות ביום וכי קראתי והבנתי שההשתתפות היא באחריותי האישית בלבד, ללא אחריות מצד המארגנים לנזק מכל סוג
                  </span>
                </label>

                {/* כפתור תשלום */}
                <button type="submit" disabled={!form.declaration} style={{
                  width: '100%', border: 'none', borderRadius: RADIUS.full, padding: '15px',
                  fontSize: FS.body, fontWeight: 700, fontFamily: "'Ploni', sans-serif",
                  background: form.declaration ? COLOR.primary : '#9CA3AF',
                  color: 'white',
                  cursor: form.declaration ? 'pointer' : 'not-allowed',
                  transition: `background 200ms ${EASING.smooth}`,
                }}>
                  לתשלום ←
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
