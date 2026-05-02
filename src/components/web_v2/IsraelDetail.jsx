/**
 * IsraelDetail.jsx - Detail page for Israel trips
 * Route: /israel/:slug
 * Same visual language as ExpeditionDetail - without "חשוב לדעת" and "למה לטייל איתנו"
 */
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate }      from 'react-router-dom';
import { useTranslation }              from 'react-i18next';
import { usePageMeta }                 from '../../website/usePageMeta.js';
import { COLOR, RADIUS, EASING, FS, BTN } from '../../website/theme.js';
import { useBreakpoint }               from '../../website/useBreakpoint.js';
import Header                          from './Header.jsx';
import SiteFooter                      from './SiteFooter.jsx';
import PhoneField, { formatFullPhone, validatePhone as checkPhone } from './PhoneField.jsx';
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
  const { i18n }   = useTranslation();
  const dir        = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl      = dir === 'rtl';
  const isEn       = !isRtl;

  /* ── Language-aware content ── */
  const displayName    = isEn ? (trip?.nameEn    || trip?.name)    : trip?.name;
  const displayTagline = isEn ? (trip?.taglineEn || trip?.tagline) : trip?.tagline;
  const itinerary      = isEn ? (trip?.itineraryEn   || trip?.itinerary   || []) : (trip?.itinerary   || []);
  const included       = isEn ? (trip?.includedEn    || trip?.included    || []) : (trip?.included    || []);
  const notIncluded    = isEn ? (trip?.notIncludedEn || trip?.notIncluded || []) : (trip?.notIncluded || []);
  const desc           = isEn ? (trip?.descEn  || trip?.desc)  : trip?.desc;
  const seasons        = isEn ? (trip?.seasonsEn || trip?.seasons || []) : (trip?.seasons || []);
  const diffLabel      = isEn ? (trip?.diffEn  || trip?.diffHe) : trip?.diffHe;
  const daysLabel      = isEn ? (trip?.daysEn  || trip?.days)   : trip?.days;
  const priceLabel     = isEn ? (trip?.price   || '') : (trip?.priceHe || trip?.price || '');

  usePageMeta(trip ? {
    title:         `${displayName} | HighAir Expeditions`,
    description:   isEn
      ? `Join the ${displayName} trek with HighAir Expeditions. ${trip.elevStr ? trip.elevStr + ' — ' : ''}A ${daysLabel} trek with a donation to cancer patients.`
      : `הצטרפו לטרק ${trip.name} עם HighAir Expeditions. ${trip.elevStr ? trip.elevStr + ' - ' : ''}טרק ${trip.days} בשילוב תרומה למלחמה בסרטן.`,
    canonicalPath: `/israel/${trip.slug}`,
    image:         trip.img ? `https://www.highair-expeditions.com${trip.img}` : undefined,
  } : {
    title:       isEn ? 'HighAir Expeditions | Treks in Israel' : 'HighAir Expeditions | טרקים בישראל',
    description: isEn ? 'Treks in Israel with HighAir Expeditions.' : 'טרקים בישראל עם HighAir Expeditions.',
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
  const [form, setForm]         = useState({ name: '', month: '', dial: '+972', phone: '', declaration: false });
  const [phoneError, setPhoneError] = useState('');

  function validatePhone(val) {
    const ok = checkPhone(form.dial, val);
    setPhoneError(ok || !val ? '' : isRtl ? 'מספר טלפון לא תקין' : 'Invalid phone number');
    return ok;
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
  const [galleryUrls, setGalleryUrls]     = useState([]);

  useEffect(() => {
    if (!hasAirtable) return;
    setGroupsLoading(true);
    setGroupsError(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() + 3); /* shorter cutoff for local trips */

    Promise.all([
      fetch('/api/airtable/IsraelGroups?fields[]=Event&fields[]=Group%20Name&fields[]=Departure&fields[]=Return&fields[]=Capacity&fields[]=Slug&fields[]=Gallery_URLs').then(r => r.json()),
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
            capacity:   rec.fields['Capacity'] || null,
          };
        })
        .filter(g => g.departure && new Date(g.departure) >= cutoff)
        .sort((a, b) => new Date(a.departure) - new Date(b.departure));

      setLiveGroups(enriched);
      if (enriched.length > 0) {
        const d = new Date(enriched[0].departure);
        setActiveMonth(`${d.getFullYear()}-${d.getMonth()}`);
      }

      // Extract gallery URLs from the first record matching this slug
      const slugRec = (groupsData.records || []).find(rec => rec.fields['Slug'] === slug);
      if (slugRec?.fields['Gallery_URLs']) {
        const urls = slugRec.fields['Gallery_URLs']
          .split('\n')
          .map(u => u.trim())
          .filter(Boolean);
        if (urls.length) setGalleryUrls(urls);
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
  function monthLabel(dep) { return new Date(dep).toLocaleDateString(isRtl ? 'he-IL' : 'en-US', { month: 'long', year: 'numeric' }); }

  const months       = [...new Map(liveGroups.map(g => [monthKey(g.departure), monthLabel(g.departure)])).entries()];
  const visibleGroups = liveGroups.filter(g => monthKey(g.departure) === activeMonth);
  const capacity     = trip?.groupCapacity || 12;

  const inputStyle = {
    width: '100%', border: '1.5px solid #E5E3F0', borderRadius: RADIUS.lg,
    padding: '12px 16px', fontSize: FS.body, fontFamily: "'Ploni', sans-serif",
    direction: dir, outline: 'none', boxSizing: 'border-box', background: '#fff',
    color: '#3D3B5A', transition: `border-color 200ms ${EASING.smooth}`,
  };
  const labelStyle = {
    display: 'block', marginBottom: '6px', fontWeight: 600,
    fontSize: '14px', color: '#3D3B5A', fontFamily: "'Ploni', sans-serif", direction: dir,
  };

  /* ── 404 ── */
  if (!trip) {
    return (
      <div style={{ direction: dir, fontFamily: "'Ploni', sans-serif" }}>
        <Header />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <div style={{ fontSize: '64px' }}>🇮🇱</div>
          <h1 style={{ color: '#0A0818', fontWeight: 700, fontFamily: "'Ploni', sans-serif" }}>{isRtl ? 'הטרק לא נמצא' : 'Trek not found'}</h1>
          <button onClick={() => navigate('/')} style={{ ...BTN.primary, fontFamily: "'Ploni', sans-serif" }}>{isRtl ? 'חזרה לדף הבית ←' : '← Back to Home'}</button>
        </div>
      </div>
    );
  }

  /* ─────────── RENDER ─────────── */
  return (
    <div style={{ direction: dir, fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
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
          <img src={trip.img} alt={displayName} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
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
              {displayName} ({trip.elevStr})
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
              {displayTagline || (isEn
                ? `Join us for the ${displayName}\nand take part in the fight against cancer!`
                : `הצטרפו אלינו ל${trip.name}\nוקחו חלק משמעותי בתרומה למלחמה בסרטן!`)}
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
              {isRtl ? 'להרשמה לטרק ←' : 'Register for Trek →'}
            </button>
          </div>
        </div>
        <div ref={heroRef} style={{ position: 'absolute', bottom: 0, width: '100%', height: '1px', zIndex: 0 }} />
      </div>

      {/* ══ STATS CARD ══ */}
      <div style={{ padding: '0 5%', boxSizing: 'border-box', marginTop: '-52px', position: 'relative', zIndex: 10, direction: dir }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          background: '#FFFFFF', borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          padding: isMobile ? '16px 20px' : '22px 52px',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        }}>
          <StatBox label={isRtl ? 'גובה' : 'Elevation'} value={`${trip.elev}m`}  isMobile={isMobile} first />
          <StatBox label={isRtl ? 'דרגת קושי' : 'Level'}    value={diffLabel}    isMobile={isMobile} />
          <StatBox label={isRtl ? 'משך' : 'Duration'}        value={daysLabel}    isMobile={isMobile} />
          <StatBox label={isRtl ? 'עלות' : 'Price'}          value={priceLabel}   isMobile={isMobile} last />
        </div>
      </div>

      {/* ══ FLOATING BAR ══ */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transform: barVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: `transform 0.3s ${EASING.out}`, direction: dir,
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5%', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '16px' : '48px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
              <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>{isRtl ? 'גובה' : 'Elevation'}</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif" }}>{trip.elev}{isRtl ? ' מ׳' : 'm'}</span>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>{isRtl ? 'רמה' : 'Level'}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif" }}>{diffLabel}</span>
              </div>
            )}
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>{isRtl ? 'מחיר' : 'Price'}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: COLOR.primary, fontFamily: "'Ploni', sans-serif" }}>{priceLabel}</span>
              </div>
            )}
          </div>
          <button onClick={scrollToForm} style={{
            background: COLOR.primary, color: 'white', border: 'none',
            borderRadius: RADIUS.full, padding: '8px 20px',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Ploni', sans-serif", whiteSpace: 'nowrap',
          }}>
            {isRtl ? 'הרשמה →' : 'Register →'}
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
                {isRtl ? 'מבוא' : 'Overview'}
              </h2>
              {seasons.length > 0 && (
                <p style={{ fontSize: '14px', color: '#6B6B8A', margin: '0 0 16px', fontFamily: "'Ploni', sans-serif" }}>
                  {isRtl ? 'עונות מומלצות: ' : 'Recommended seasons: '}{seasons.join(' | ')}
                </p>
              )}
              {desc ? (
                desc.split('\n\n').map((p, i, arr) => (
                  <p key={i} style={{ fontSize: '16px', color: i === arr.length - 1 ? COLOR.primary : '#3D3B5A', fontWeight: i === arr.length - 1 ? 700 : 400, lineHeight: 1.75, margin: '0 0 16px', fontFamily: "'Ploni', sans-serif" }}>
                    {p}
                  </p>
                ))
              ) : (
                <p style={{ fontSize: '16px', color: '#9591B0', lineHeight: 1.75, fontFamily: "'Ploni', sans-serif" }}>{isRtl ? 'תיאור יתווסף בקרוב.' : 'Description coming soon.'}</p>
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

        {included.length > 0 && (
          <>
            <Separator />
            {/* ── ב. מה כלול ── */}
            <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
              <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 32px' }}>
                {isRtl ? 'מה כלול ומה לא כלול?' : 'Included & Excluded'}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                {/* כלול */}
                <div style={{ background: '#ECFDF5', borderRadius: RADIUS.xl, padding: '28px', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '18px', fontWeight: 700, color: '#059669', marginBottom: '20px' }}>{isRtl ? 'מה כלול בתכנית?' : "What's Included?"}</div>
                  {included.map((item, i) => {
                    const isHeader = item.endsWith(':');
                    return isHeader ? (
                      <div key={i} style={{ marginTop: i > 0 ? '24px' : 0, marginBottom: '14px' }}>
                        <span style={{ display: 'inline-block', background: '#D1FAE5', color: '#065F46', fontFamily: "'Ploni', sans-serif", fontSize: '13px', fontWeight: 700, padding: '4px 14px', borderRadius: '999px' }}>{item.slice(0,-1)}</span>
                      </div>
                    ) : (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < included.length - 1 ? '14px' : 0 }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#059669', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>
                          <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>✓</span>
                        </div>
                        <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#3D3B5A', lineHeight: 1.6 }}>{item}</span>
                      </div>
                    );
                  })}
                </div>
                {/* לא כלול */}
                {notIncluded.length > 0 && (
                  <div style={{ background: '#FEF2F2', borderRadius: RADIUS.xl, padding: '28px', border: '1px solid #FECACA' }}>
                    <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '18px', fontWeight: 700, color: '#DC2626', marginBottom: '20px' }}>{isRtl ? 'מה לא כלול בתכנית?' : "What's Not Included?"}</div>
                    {notIncluded.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < notIncluded.length - 1 ? '14px' : 0 }}>
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

        {itinerary.length > 0 && (
          <>
            <Separator />
            {/* ── ג. תכנית הטיול ── */}
            <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
              <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 28px' }}>
                {isRtl ? `תכנית ה${trip.typeHe}` : 'Itinerary'}
              </h2>
              <div style={{ border: '1px solid #ECEAF8', borderRadius: RADIUS.xl, overflow: 'hidden' }}>
                {itinerary.map((item, idx) => {
                  const isOpen = openItinerary.includes(idx);
                  const isLast = idx === itinerary.length - 1;
                  return (
                    <div key={idx} style={{ borderBottom: isLast ? 'none' : '1px solid #ECEAF8' }}>
                      <div
                        onClick={() => toggleItinerary(idx)}
                        style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', cursor: 'pointer', background: isOpen ? '#FAFAFE' : 'white', transition: `background 150ms ${EASING.smooth}`, direction: dir }}
                        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#FAFAFE'; }}
                        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'white'; }}
                      >
                        <span style={{ background: COLOR.primary, color: 'white', borderRadius: RADIUS.full, padding: '4px 12px', fontSize: '13px', fontWeight: 700, fontFamily: "'Ploni', sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {isRtl ? `יום ${item.day}` : item.day}
                        </span>
                        <span style={{ flex: 1, fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 600, color: '#0A0818' }}>{item.title}</span>
                        <span style={{ fontSize: '14px', color: '#6B6B8A', flexShrink: 0 }}>{isOpen ? '▴' : '▾'}</span>
                      </div>
                      <div style={{ maxHeight: isOpen ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                        <p style={{ padding: '0 20px 20px', margin: 0, fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#6B6B8A', lineHeight: 1.8, direction: dir, whiteSpace: 'pre-line' }}>
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
          const galleryImgs = galleryUrls.length > 0
            ? galleryUrls
            : [1,2,3,4,5].map(n => `/images/gallery/${trip.slug}/${n}.webp`);
          const [lbIdx, setLbIdx] = useState(null);
          const lbPrev = (e) => { e.stopPropagation(); setLbIdx(i => (i - 1 + galleryImgs.length) % galleryImgs.length); };
          const lbNext = (e) => { e.stopPropagation(); setLbIdx(i => (i + 1) % galleryImgs.length); };

          return (
            <>
              <Separator />
              <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
                <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 28px' }}>
                  {isRtl ? `תמונות מה${trip.typeHe}` : 'Gallery'}
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
                  /* Desktop: bento grid - large left + 2×2 right */
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

                {/* Extra images beyond 5 — horizontal scroll strip */}
                {galleryImgs.length > 5 && (
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', marginTop: '10px', paddingBottom: '4px' }}>
                    {galleryImgs.slice(5).map((src, i) => (
                      <img
                        key={i} src={src} alt={`${trip.name} ${i + 6}`} loading="lazy"
                        onClick={() => setLbIdx(i + 5)}
                        style={{ flexShrink: 0, width: isMobile ? '72vw' : '320px', height: '200px', objectFit: 'cover', borderRadius: RADIUS.xl, cursor: 'pointer', display: 'block' }}
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                      />
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
            {isRtl ? 'תאריכי יציאה' : 'Departure Dates'}
          </h2>

          {groupsLoading ? (
            <div style={{ color: '#6B6B8A', fontFamily: "'Ploni', sans-serif", fontSize: '15px', padding: '8px 0' }}>
              {isRtl ? 'טוען תאריכים...' : 'Loading dates...'}
            </div>

          ) : liveGroups.length > 0 ? (
            <>
              {/* Month tabs - only when more than 2 groups */}
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
                  const groupCap  = g.capacity || trip?.groupCapacity || 12;
                  const spotsLeft = groupCap - g.count;
                  const isFull    = spotsLeft <= 0;
                  const isLow     = !isFull && spotsLeft <= 6;
                  const spotsColor = isFull ? '#DC2626' : isLow ? '#D97706' : '#059669';
                  return (
                    <div key={g.id}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(109,40,217,0.10)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
                      style={{
                        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        border: '1px solid #ECEAF8', borderRadius: RADIUS.lg,
                        padding: isMobile ? '14px 16px' : '12px 20px',
                        background: '#fff', direction: dir,
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
                          background: isFull ? '#FEE2E2' : isLow ? '#FEF3C7' : '#D1FAE5',
                          color: spotsColor,
                          fontFamily: "'Ploni', sans-serif", fontSize: '11px', fontWeight: 700,
                          padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
                        }}>
                          {isFull
                            ? (isRtl ? 'קבוצה מלאה' : 'Group Full')
                            : isLow
                              ? (isRtl ? `נשארו ${spotsLeft} מקומות` : `${spotsLeft} spots left`)
                              : (isRtl ? 'הרשמה פתוחה' : 'Open')}
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
                        {isFull ? (isRtl ? 'מלא' : 'Full') : (isRtl ? 'להרשמה ←' : 'Register →')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>

          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px 24px', borderRadius: RADIUS.xl, border: '1.5px dashed #DDD6FE', background: '#FAFAFF', textAlign: 'center', direction: dir }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={COLOR.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '17px', fontWeight: 700, color: '#0A0818', margin: 0 }}>{isRtl ? `תאריכי ה${trip.typeHe} יפורסמו בקרוב` : 'Dates coming soon'}</p>
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14px', color: '#6B6B8A', margin: 0, lineHeight: 1.6 }}>{isRtl ? 'רוצים להירשם לרשימת ההמתנה ולקבל עדיפות?' : 'Want to join the waitlist?'}</p>
              <button onClick={scrollToForm} style={{ marginTop: '4px', padding: '10px 28px', borderRadius: RADIUS.full, border: 'none', background: COLOR.primary, color: '#fff', fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                {isRtl ? 'השאירו פרטים' : 'Leave your details'}
              </button>
            </div>
          )}
        </section>

      </main>

      {/* ══ CONTACT FORM ══ */}
      <div id="israel-form" style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)', padding: isMobile ? '48px 5%' : '72px 5%', direction: dir }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(24px,4vw,40px)', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            {isRtl ? 'הרשמה לטרק' : 'Register for Trek'}
          </h2>
          <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '16px', color: 'rgba(255,255,255,0.7)', margin: '0 0 40px' }}>
            {isRtl ? 'מלאו את הפרטים ונחזור אליכם לאישור ורישום סופי' : "Fill in your details and we'll confirm your registration"}
          </p>
          <div style={{ background: 'white', borderRadius: RADIUS.xl, padding: isMobile ? '24px' : '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'start' }}>
            <form onSubmit={handleSubmit} style={{ direction: dir }}>
              <div style={{ display: 'grid', gap: '16px' }}>

                {/* שם מלא */}
                <div>
                  <label style={labelStyle}>{isRtl ? 'שם מלא *' : 'Full Name *'}</label>
                  <input type="text" required value={form.name}
                    placeholder={isRtl ? 'ישראל ישראלי' : 'John Smith'}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value.replace(/[^א-תa-zA-Z\s]/g, '') }))}
                    style={inputStyle}
                    onMouseEnter={e => { e.target.style.borderColor = COLOR.primary; }}
                    onMouseLeave={e => { e.target.style.borderColor = '#E5E3F0'; }} />
                </div>

                {/* תאריך */}
                {(liveGroups.length > 0 || trip.dates?.length > 0) && (
                  <div>
                    <label style={labelStyle}>{isRtl ? 'באיזה תאריך תרצו לטייל? *' : 'Preferred Date *'}</label>
                    <select required value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} style={inputStyle}
                      onMouseEnter={e => { e.target.style.borderColor = COLOR.primary; }} onMouseLeave={e => { e.target.style.borderColor = '#E5E3F0'; }}>
                      <option value="">{isRtl ? 'בחרו תאריך' : 'Select a date'}</option>
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
                <PhoneField
                  label={isRtl ? 'מספר טלפון *' : 'Phone Number *'}
                  dial={form.dial}
                  onDialChange={v => setForm(f => ({ ...f, dial: v }))}
                  local={form.phone}
                  onLocalChange={v => { setForm(f => ({ ...f, phone: v })); if (phoneError) validatePhone(v); }}
                  error={!!phoneError}
                  errorMsg={phoneError}
                />

                {/* הצהרת בריאות */}
                <label style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  cursor: 'pointer', direction: dir,
                  padding: '14px 16px', borderRadius: RADIUS.lg,
                  border: `1.5px solid ${form.declaration ? COLOR.primary : '#E5E3F0'}`,
                  background: form.declaration ? '#F5F0FF' : '#FAFAFA',
                  transition: 'border-color 180ms, background 180ms',
                }}>
                  <input type="checkbox" required checked={form.declaration}
                    onChange={e => setForm(f => ({ ...f, declaration: e.target.checked }))}
                    style={{ marginTop: '3px', width: '18px', height: '18px', flexShrink: 0, accentColor: COLOR.primary, cursor: 'pointer' }} />
                  <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#3D3B5A', lineHeight: 1.7 }}>
                    {isRtl
                      ? 'אני מצהיר/ה כי מצבי הבריאותי מאפשר השתתפות בטיול הכולל הליכות של 8-5 שעות ביום וכי קראתי והבנתי שההשתתפות היא באחריותי האישית בלבד, ללא אחריות מצד המארגנים לנזק מכל סוג'
                      : 'I declare that my physical condition allows participation in a trip involving 5–8 hours of walking per day, and that I have read and understood that participation is at my own personal responsibility, with no liability on the part of the organizers for any damage of any kind.'}
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
                  {isRtl ? 'לתשלום ←' : 'Proceed to Payment →'}
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
