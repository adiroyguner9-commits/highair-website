/**
 * ExpeditionDetail.jsx — Full expedition detail page (web_v2)
 * Route: /expedition/:id
 * RTL Hebrew · Ploni font · inline styles only · React 18
 */

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EXPS } from '../../data/mockData.js';
import { COLOR, RADIUS, EASING, FS, SHADOW, BTN, glass } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import Header from './Header.jsx';
import StatsSection from './StatsSection.jsx';
import { MountainIcon, StarIcon, MedalIcon } from '../Icons.jsx';

/* ─── Default data ─────────────────────────────────────────────── */
const DEFAULT_REVIEWS = [
  { name: 'יוני לוי', date: 'ינואר 2025', rating: 5, text: 'חוויה של פעם בחיים. הצוות של HighAir היה מקצועי ברמה הגבוהה ביותר, תמיד שם לתמיכה. לא האמנתי שאצליח לעלות לפסגה אבל הם האמינו בי.', initial: 'י' },
  { name: 'מיכל שרון', date: 'מרץ 2025', rating: 5, text: 'הכל היה מושלם מהארגון ועד הרגע שעמדנו על הפסגה. המדריך שלנו היה מדהים — סבלני, מקצועי וגם כיף לבלות איתו.', initial: 'מ' },
  { name: 'רועי אברהם', date: 'פברואר 2025', rating: 5, text: 'הגעתי בלי ניסיון, חזרתי עם פסגה ועם חברים לחיים. HighAir הם לא רק חברת טיולים — הם משפחה.', initial: 'ר' },
];

const DEFAULT_FAQ = [
  { q: 'האם נדרש ניסיון טיפוס קודם?', a: 'לא נדרש ניסיון טיפוס קודם לרוב המסלולים שלנו. כל מה שצריך הוא כושר גופני טוב ורצון להצליח.' },
  { q: 'מה גודל הקבוצה?', a: 'הקבוצות שלנו מוגבלות ל-12 משתתפים לכל היותר, כדי להבטיח ליווי אישי ואיכות מקסימלית.' },
  { q: 'האם יש אופציה לחדר יחיד?', a: 'כן, ניתן לבקש חדר יחיד בתוספת תשלום. יש לציין זאת בטופס ההרשמה.' },
  { q: 'מה קורה אם אני נסוג בדרך?', a: 'בטיחות המשתתפים היא בראש סדר העדיפויות. אם נדרשת נסיגה, המדריך ילווה אותך בבטחה בחזרה.' },
  { q: 'מה כולל המחיר?', a: 'המחיר כולל את כל מה שמפורט בסעיף "מה כלול". טיסות וביטוח נסיעות אינם כלולים.' },
];

const DEFAULT_NOT_INCLUDED = ['טיסות בינלאומיות', 'ביטוח נסיעות', 'הוצאות אישיות', 'ציוד אישי'];

const DEFAULT_IMPORTANT = [
  'דרוש דרכון בתוקף לפחות 6 חודשים מיום החזרה',
  'ביטוח נסיעות כולל כיסוי פינוי הרים חובה',
  'נדרשת כושר גופני טוב — מומלץ להתחיל אימונים 3 חודשים מראש',
  'גיל מינימלי: 16 (עד 18 בהסכמת הורים)',
];

const WHY_CARDS = [
  { icon: '🛡️', title: 'בטיחות ללא פשרות', desc: 'ציוד לוויין Magnus, עדכונים יומיים למשפחות, מדריכי IFMGA' },
  { icon: '👥', title: 'קבוצות קטנות', desc: 'עד 12 משתתפים לקבוצה — ליווי אישי ואיכות ללא פשרות' },
  { icon: '🗣️', title: 'מדריכים ישראלים', desc: 'מדריכים ישראלים עם ניסיון של עשרות משלחות מוצלחות' },
  { icon: '🎒', title: 'ליווי מלא', desc: 'מרגע ההרשמה ועד החזרה הביתה — אנחנו כאן בכל שלב' },
];

/* ─── Scroll helper ─────────────────────────────────────────────── */
function scrollToForm() {
  const el = document.getElementById('contact-form');
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 32;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ─── Separator ─────────────────────────────────────────────────── */
function Separator() {
  return <div style={{ borderTop: '1px solid #ECEAF8', margin: 0 }} />;
}

/* ─── DateChip ──────────────────────────────────────────────────── */
function DateChip({ date }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 20px',
        borderRadius: RADIUS.full,
        border: '1.5px solid #ECEAF8',
        background: hovered ? COLOR.primary : '#FAFAFE',
        color: hovered ? 'white' : '#3D3B5A',
        fontFamily: "'Ploni', sans-serif",
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'default',
        transition: `background 200ms ${EASING.smooth}, color 200ms ${EASING.smooth}, border-color 200ms ${EASING.smooth}`,
        userSelect: 'none',
        borderColor: hovered ? COLOR.primary : '#ECEAF8',
      }}
    >
      {date}
    </div>
  );
}

/* ─── WhyCard ───────────────────────────────────────────────────── */
function WhyCard({ card }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: '1px solid #ECEAF8',
        borderRadius: RADIUS.xl,
        padding: '24px',
        transition: `box-shadow 200ms ${EASING.smooth}, transform 200ms ${EASING.smooth}`,
        boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
        direction: 'rtl',
        background: '#fff',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{card.icon}</div>
      <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: FS.h3, fontWeight: 700, color: '#0A0818', marginBottom: '8px' }}>{card.title}</div>
      <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: FS.body, color: '#6B6B8A', lineHeight: 1.6 }}>{card.desc}</div>
    </div>
  );
}

/* ─── ReviewCard ────────────────────────────────────────────────── */
function ReviewCard({ review }) {
  const initial = review.initial || (review.name ? review.name[0] : '?');
  return (
    <div style={{ border: '1px solid #ECEAF8', borderRadius: RADIUS.xl, padding: '24px', direction: 'rtl', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '40px', height: '40px',
          background: COLOR.primary, borderRadius: RADIUS.full,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: '16px',
          fontFamily: "'Ploni', sans-serif", flexShrink: 0,
        }}>
          {initial}
        </div>
        <div>
          <div style={{ fontFamily: "'Ploni', sans-serif", fontWeight: 700, fontSize: '15px', color: '#0A0818' }}>{review.name}</div>
          <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#6B6B8A' }}>{review.date}</div>
        </div>
      </div>
      <div style={{ color: '#F59E0B', fontSize: '16px', marginBottom: '10px', letterSpacing: '1px' }}>
        {'★'.repeat(review.rating)}
      </div>
      <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#3D3B5A', lineHeight: 1.75, margin: 0 }}>
        {review.text}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function ExpeditionDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();
  const isNarrow = isMobile || isTablet;

  const exp = EXPS.find(e => e.slug === slug);

  /* ── Floating bar state ── */
  const heroRef = useRef(null);
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setBarVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  /* ── Itinerary accordion: array of open indices, first open by default ── */
  const [openItinerary, setOpenItinerary] = useState([]);
  const [itineraryTab, setItineraryTab] = useState('trek'); // 'trek' | 'safari'
  function toggleItinerary(idx) {
    setOpenItinerary(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  }

  /* ── Active itinerary based on tab ── */
  const hasSafari = exp?.safariItinerary?.length > 0;
  const activeItinerary = itineraryTab === 'safari' && hasSafari
    ? [...(exp.itinerary || []).slice(0, -1), ...(exp.safariItinerary || [])]
    : (exp?.itinerary || []);

  /* ── FAQ accordion ── */
  const [openFaq, setOpenFaq] = useState(null);

  /* ── Live groups from Airtable ── */
  const hasAirtable = !!(exp?.airtableEvents?.length);
  const [liveGroups, setLiveGroups]         = useState([]);
  const [groupsLoading, setGroupsLoading]   = useState(hasAirtable);
  const [groupsError, setGroupsError]       = useState(null);
  const [activeMonth, setActiveMonth]       = useState(null);

  useEffect(() => {
    if (!hasAirtable) return;
    setGroupsLoading(true);
    setGroupsError(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* Fetch all groups (no server-side filter — avoids field-name guessing).
       Airtable field names confirmed from screenshot:
         Event, Group Name, Departure, Return */
    Promise.all([
      fetch(`/api/airtable/Groups?fields[]=Event&fields[]=Group%20Name&fields[]=Departure&fields[]=Return`)
        .then(r => r.json()),
      fetch(`/api/airtable/Customers?fields[]=Group%20Name`)
        .then(r => r.json()),
    ]).then(([groupsData, custData]) => {
      if (groupsData.error) throw new Error(JSON.stringify(groupsData.error));

      /* Count customers per Group Name (e.g. "Kili_05_01") */
      const counts = {};
      (custData.records || []).forEach(rec => {
        /* Customers table field might be "Group Name" or "group name" */
        const gn = rec.fields['Group Name'] || rec.fields['group name'];
        if (gn) counts[gn] = (counts[gn] || 0) + 1;
      });

      /* Case-insensitive set of event names to match */
      const events = new Set((exp.airtableEvents || []).map(e => e.toLowerCase()));

      const enriched = (groupsData.records || [])
        .filter(rec => {
          const ev = (rec.fields['Event'] || '').toLowerCase();
          return events.has(ev);
        })
        .map(rec => {
          const groupName = rec.fields['Group Name'] || rec.id;
          return {
            id:         rec.id,
            groupName,
            eventName:  rec.fields['Event'] || '',
            departure:  rec.fields['Departure'] || null,
            returnDate: rec.fields['Return']    || null,
            count:      counts[groupName] || 0,
          };
        })
        /* Only upcoming departures, sorted by date then trek-only before safari */
        .filter(g => g.departure && new Date(g.departure) >= today)
        .sort((a, b) => {
          const diff = new Date(a.departure) - new Date(b.departure);
          if (diff !== 0) return diff;
          const aSafari = a.eventName.toLowerCase().includes('safari') ? 1 : 0;
          const bSafari = b.eventName.toLowerCase().includes('safari') ? 1 : 0;
          return aSafari - bSafari;
        });

      setLiveGroups(enriched);
      if (enriched.length > 0) {
        const d = new Date(enriched[0].departure);
        setActiveMonth(`${d.getFullYear()}-${d.getMonth()}`);
      }
    }).catch(err => {
      console.error('[dates]', err);
      setGroupsError(err.message);
    }).finally(() => setGroupsLoading(false));
  }, [exp?.airtableEvents?.join(',')]);

  /* helpers */
  function formatDateRange(dep, ret) {
    const d = new Date(dep);
    const r = new Date(ret || dep);
    const dd  = String(d.getDate()).padStart(2, '0');
    const rr  = String(r.getDate()).padStart(2, '0');
    const mm  = String(d.getMonth() + 1).padStart(2, '0');
    if (!ret || (d.getMonth() === r.getMonth() && d.getFullYear() === r.getFullYear())) {
      return `${dd}-${rr}/${mm}`;
    }
    const mm2 = String(r.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm} - ${rr}/${mm2}`;
  }

  function eventLabel(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('kosher') && n.includes('safari')) return 'טיפוס כשר + ספארי';
    if (n.includes('kosher')) return 'טיפוס כשר';
    if (n.includes('safari')) return 'טיפוס + ספארי';
    return 'טיפוס בלבד';
  }

  function monthKey(dep) {
    const d = new Date(dep);
    return `${d.getFullYear()}-${d.getMonth()}`;
  }

  function monthLabel(dep) {
    const d = new Date(dep);
    return d.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
  }

  /* unique months from live groups */
  const months = [...new Map(liveGroups.map(g => [monthKey(g.departure), monthLabel(g.departure)])).entries()];
  const visibleGroups = liveGroups.filter(g => monthKey(g.departure) === activeMonth);
  const capacity = exp?.groupCapacity || 15;
  const [heroBtnHovered, setHeroBtnHovered] = useState(false);

  /* ── Form state ── */
  const [form, setForm] = useState({ name: '', month: '', age: '', groupSize: '1', phone: '', email: '', experience: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  /* ── Phone validation (Israeli: 05X-XXXXXXX) ── */
  function validatePhone(val) {
    const ok = /^05\d{8}$/.test(val.trim());
    setPhoneError(ok || !val ? '' : 'מספר טלפון לא תקין (לדוגמה: 0501234567)');
    return ok;
  }

  /* ── Email validation ── */
  function validateEmail(val) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
    setEmailError(ok || !val ? '' : 'כתובת המייל אינה תקינה');
    return ok;
  }

  /* ── Form submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!exp) return;
    if (!validateEmail(form.email)) return;
    if (!validatePhone(form.phone)) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/airtable/Website%20Leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            Name: form.name,
            Phone: form.phone,
            Email: form.email,
            'Expedition': exp.nameHe,
            'Preferred Month': form.month,
            'Age': form.age ? Number(form.age) : undefined,
            'Group Size': form.groupSize ? Number(form.groupSize) : undefined,
            'Experience': form.experience || undefined,
            'Source': 'Expedition Page - ' + exp.nameHe,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.error?.message || data?.error || JSON.stringify(data);
        throw new Error(msg);
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'שגיאה. נסו שוב.');
      setStatus('error');
    }
  }

  /* ── Input styles ── */
  const inputStyle = {
    width: '100%',
    border: '1.5px solid #E5E3F0',
    borderRadius: RADIUS.lg,
    padding: '12px 16px',
    fontSize: FS.body,
    fontFamily: "'Ploni', sans-serif",
    direction: 'rtl',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fff',
    color: '#3D3B5A',
    transition: `border-color 200ms ${EASING.smooth}`,
  };
  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    fontSize: '14px',
    color: '#3D3B5A',
    fontFamily: "'Ploni', sans-serif",
    direction: 'rtl',
  };

  /* ─────────────── 404 ─────────────────── */
  if (!exp) {
    return (
      <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif" }}>
        <Header />
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '24px',
          fontFamily: "'Ploni', sans-serif", direction: 'rtl',
        }}>
          <div style={{ fontSize: '64px' }}>⛰️</div>
          <h1 style={{ color: '#0A0818', fontWeight: 700, fontFamily: "'Ploni', sans-serif" }}>המשלחת לא נמצאה</h1>
          <button
            onClick={() => navigate('/test')}
            style={{ ...BTN.primary, fontFamily: "'Ploni', sans-serif" }}
          >
            חזרה לדף הבית ←
          </button>
        </div>
      </div>
    );
  }

  /* ── Derived data ── */
  const reviews = exp.reviews?.length ? exp.reviews : DEFAULT_REVIEWS;
  const faqItems = exp.faq?.length ? exp.faq : DEFAULT_FAQ;
  const notIncluded = exp.notIncluded?.length ? exp.notIncluded : DEFAULT_NOT_INCLUDED;
  const importantToNote = exp.importantToNote?.length ? exp.importantToNote : DEFAULT_IMPORTANT;
  const seasons = exp.seasons || [];
  const galleryImages = [exp.img, '/images/gallery-1.jpg', '/images/gallery-2.jpg', '/images/gallery-3.jpg', '/images/gallery-4.jpg'].filter(Boolean);

  /* ─────────────── RENDER ─────────────────────────────────────── */
  return (
    <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Header />

      {/* ══════════════════════════════════
          SECTION 1: HERO
      ══════════════════════════════════ */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '65vh' : '100vh',
        minHeight: isMobile ? '480px' : '600px',
        overflow: 'hidden',
        background: '#0A0818',
      }}>
        {/* Video background — YouTube if videoUrl, else hero.mp4 */}
        {exp.videoUrl ? (
          <iframe
            src={`https://www.youtube.com/embed/${exp.videoUrl}?autoplay=1&mute=1&loop=1&playlist=${exp.videoUrl}&controls=0&rel=0&playsinline=1&modestbranding=1`}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: '177.78vh', minWidth: '100%',
              height: '56.25vw', minHeight: '100%',
              border: 'none', pointerEvents: 'none',
            }}
            allow="autoplay; encrypted-media"
            title={exp.nameHe}
          />
        ) : (
          <video
            autoPlay muted loop playsInline
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              minWidth: '100%', minHeight: '100%',
              width: 'auto', height: 'auto',
              objectFit: 'cover', pointerEvents: 'none',
            }}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        )}

        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)',
          zIndex: 1,
        }} />


        {/* Hero content — title top, subtitle+CTA bottom */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'center',
          padding: isMobile ? '140px 6% 120px' : '160px 8% 130px',
        }}>
          {/* Title: name + elevation — pinned to top */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{
              fontFamily: "'Ploni', sans-serif",
              fontSize: FS.h1,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.1,
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}>
              {exp.nameHe} ({exp.elevNum} מ׳)
            </h1>
          </div>

          {/* Tagline + CTA — pinned to bottom */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '14px' : '18px' }}>
          {/* Tagline */}
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize: FS.body,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.80)',
            margin: 0,
            maxWidth: '620px',
            lineHeight: 1.6,
            textShadow: '0 1px 6px rgba(0,0,0,0.4)',
            whiteSpace: 'pre-line',
          }}>
            {exp.tagline || `הצטרפו ל${exp.nameHe} ב${exp.countryHe}\nוקחו חלק משמעותי בתרומה למלחמה בסרטן!`}
          </p>

          {/* CTA */}
          <button
            onClick={scrollToForm}
            onMouseEnter={() => setHeroBtnHovered(true)}
            onMouseLeave={() => setHeroBtnHovered(false)}
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '8px',
              padding:       isMobile ? '13px 28px' : '15px 36px',
              borderRadius:  '999px',
              border:        'none',
              cursor:        'pointer',
              fontFamily:    "'Ploni', sans-serif",
              fontSize:      FS.btn,
              fontWeight:    700,
              letterSpacing: '0.01em',
              marginTop:     '8px',
              background:    heroBtnHovered ? '#7C3AED' : COLOR.primary,
              color:         '#FFFFFF',
              boxShadow:     heroBtnHovered
                               ? '0 10px 32px rgba(109,40,217,0.55)'
                               : '0 4px 18px rgba(109,40,217,0.35)',
              transform:     heroBtnHovered ? 'translateY(-2px)' : 'none',
              transition:    `all 0.22s ${EASING.out}`,
              whiteSpace:    'nowrap',
            }}
          >
            לתיאום שיחה עם מומחה ←
          </button>
          </div>
        </div>

        {/* IntersectionObserver sentinel — bottom of hero */}
        <div ref={heroRef} style={{ position: 'absolute', bottom: 0, width: '100%', height: '1px', zIndex: 0 }} />
      </div>

      {/* ══════════════════════════════════
          STATS STRIP — expedition specific
      ══════════════════════════════════ */}
      <div style={{
        padding:   '0 5%',
        boxSizing: 'border-box',
        marginTop: '-52px',
        position:  'relative',
        zIndex:    10,
        direction: 'rtl',
      }}>
        <div style={{
          maxWidth:            '1100px',
          margin:              '0 auto',
          background:          '#FFFFFF',
          borderRadius:        '20px',
          boxShadow:           '0 20px 60px rgba(0,0,0,0.15)',
          padding:             isMobile ? '16px 20px' : '22px 52px',
          display:             'grid',
          gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
          gap:                 '0',
        }}>
          {[
            { IconComp: MountainIcon, label: 'גובה',          value: `${exp.elevNum} מ׳` },
            { IconComp: StarIcon,     label: 'דרגת קושי',     value: exp.diffHe },
            { IconComp: MedalIcon,    label: 'אחוזי הצלחה',   value: exp.successRate ? `${exp.successRate}%` : '—' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign:    'center',
              padding:      isMobile ? '14px 8px' : '4px 24px',
              borderRight:  (!isMobile && i > 0) ? '1px solid #ECEAF8' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', color: COLOR.primary }}>
                <s.IconComp size={isMobile ? 22 : 26} color={COLOR.primary} />
              </div>
              <div style={{
                fontFamily:    "'Ploni', sans-serif",
                fontSize:      isMobile ? '18px' : '22px',
                fontWeight:    900,
                color:         '#6D28D9',
                lineHeight:    1,
                letterSpacing: '-0.02em',
                direction:     'rtl',
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: "'Ploni', sans-serif",
                fontSize:   FS.sm,
                fontWeight: 400,
                color:      '#6B6B8A',
                marginTop:  '6px',
                lineHeight: 1.4,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          SECTION 2: FLOATING STATS BAR
      ══════════════════════════════════ */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'white',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transform: barVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: `transform 0.3s ${EASING.out}`,
        direction: 'rtl',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: '0 5%', height: '60px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '16px' : '48px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>גובה</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MountainIcon size={14} color="#0A0818" /> {exp.elevNum.toLocaleString()} מ׳
              </span>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>רמה</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <StarIcon size={14} color="#0A0818" /> {exp.diffHe}
                </span>
              </div>
            )}
            {!isMobile && seasons.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>עונות</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {seasons.join(', ')}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={scrollToForm}
            style={{
              background: COLOR.primary, color: 'white', border: 'none',
              borderRadius: RADIUS.full, padding: '8px 20px',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Ploni', sans-serif", whiteSpace: 'nowrap',
            }}
          >
            הרשמה →
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════
          CONTENT AREA
      ══════════════════════════════════ */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 5%' : '0' }}>

        {/* ── A. מבוא ──────────────────────────── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr',
            gap: '48px',
            alignItems: 'stretch',
          }}>
            {/* Left column */}
            <div>
              <h2 style={{
                fontFamily: "'Ploni', sans-serif",
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 700, color: '#0A0818',
                letterSpacing: '-0.02em', margin: '0 0 10px',
              }}>
                מבוא
              </h2>
              {seasons.length > 0 && (
                <p style={{ fontSize: '14px', color: '#6B6B8A', margin: '0 0 16px', fontFamily: "'Ploni', sans-serif" }}>
                  עונות מומלצות לטיפוס: {seasons.join(' | ')}
                </p>
              )}
              {(() => {
                const parts = (exp.desc || '').split('\n\n');
                const body = parts.slice(0, -1);
                const cta  = parts[parts.length - 1];
                return (
                  <>
                    {body.map((p, i) => (
                      <p key={i} style={{ fontSize: '16px', color: '#3D3B5A', lineHeight: 1.75, margin: '0 0 16px', fontFamily: "'Ploni', sans-serif" }}>
                        {p}
                      </p>
                    ))}
                    {cta && (
                      <p style={{ fontSize: '16px', color: COLOR.primary, fontWeight: 700, lineHeight: 1.75, margin: '0 0 0', fontFamily: "'Ploni', sans-serif" }}>
                        {cta}
                      </p>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Right column — image */}
            <div style={{ minHeight: isNarrow ? '260px' : undefined }}>
              {exp.img ? (
                <img
                  src={exp.img}
                  alt={exp.nameHe}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: RADIUS.xl, display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', minHeight: '260px', background: exp.grad, borderRadius: RADIUS.xl }} />
              )}
            </div>
          </div>
        </section>

        <Separator />

        {/* ── B. מה כלול ומה לא כלול ───────────── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 36px)',
            fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 32px',
          }}>
            מה כלול ומה לא כלול?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr',
            gap: '20px',
            alignItems: 'start',
          }}>
            {/* כלול — green card */}
            <div style={{
              background: '#ECFDF5',
              borderRadius: RADIUS.xl,
              padding: '28px',
              border: '1px solid #BBF7D0',
            }}>
              <div style={{
                fontFamily: "'Ploni', sans-serif", fontSize: '18px',
                fontWeight: 700, color: '#059669', marginBottom: '20px',
              }}>
                מה כלול בתכנית?
              </div>
              {(exp.included || []).map((item, i) => {
                const isHeader = item.endsWith(':');
                return isHeader ? (
                  <div key={i} style={{ marginTop: i > 0 ? '24px' : 0, marginBottom: '14px' }}>
                    <span style={{
                      display: 'inline-block',
                      background: '#D1FAE5', color: '#065F46',
                      fontFamily: "'Ploni', sans-serif", fontSize: '13px', fontWeight: 700,
                      padding: '4px 14px', borderRadius: '999px',
                    }}>
                      {item.slice(0, -1)}
                    </span>
                  </div>
                ) : (
                  <div key={i} style={{
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                    marginBottom: i < (exp.included || []).length - 1 ? '14px' : 0,
                  }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: '#059669', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: '1px',
                    }}>
                      <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>✓</span>
                    </div>
                    <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#3D3B5A', lineHeight: 1.6 }}>{item}</span>
                  </div>
                );
              })}
            </div>

            {/* לא כלול — light red card */}
            <div style={{
              background: '#FEF2F2',
              borderRadius: RADIUS.xl,
              padding: '28px',
              border: '1px solid #FECACA',
            }}>
              <div style={{
                fontFamily: "'Ploni', sans-serif", fontSize: '18px',
                fontWeight: 700, color: '#DC2626', marginBottom: '20px',
              }}>
                מה לא כלול בתכנית?
              </div>
              {notIncluded.map((item, i) => {
                const isHeader = item.endsWith(':');
                return isHeader ? (
                  <div key={i} style={{ marginTop: i > 0 ? '24px' : 0, marginBottom: '14px' }}>
                    <span style={{
                      display: 'inline-block',
                      background: '#FEE2E2', color: '#991B1B',
                      fontFamily: "'Ploni', sans-serif", fontSize: '13px', fontWeight: 700,
                      padding: '4px 14px', borderRadius: '999px',
                    }}>
                      {item.slice(0, -1)}
                    </span>
                  </div>
                ) : (
                  <div key={i} style={{
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                    marginBottom: i < notIncluded.length - 1 ? '14px' : 0,
                  }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: '#DC2626', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: '1px',
                    }}>
                      <span style={{ color: 'white', fontSize: '11px', fontWeight: 700 }}>✕</span>
                    </div>
                    <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#3D3B5A', lineHeight: 1.6 }}>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── C. תכנית הטיפוס (Itinerary Accordion) ── */}
        {exp.itinerary && exp.itinerary.length > 0 && (
          <>
            <Separator />
            <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
                <h2 style={{
                  fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
                  fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: 0,
                }}>
                  תכנית הטיפוס
                </h2>
                {hasSafari && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'safari', label: 'טיפוס + ספארי (11 ימים)' },
                      { key: 'trek',   label: 'טיפוס בלבד (9 ימים)' },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => { setItineraryTab(tab.key); setOpenItinerary([]); }}
                        style={{
                          padding: '8px 20px',
                          borderRadius: RADIUS.full,
                          border: `1.5px solid ${itineraryTab === tab.key ? COLOR.primary : '#ECEAF8'}`,
                          background: itineraryTab === tab.key ? COLOR.primary : '#fff',
                          color: itineraryTab === tab.key ? 'white' : '#3D3B5A',
                          fontFamily: "'Ploni', sans-serif",
                          fontSize: '14px', fontWeight: 600,
                          cursor: 'pointer',
                          transition: `all 0.2s ${EASING.smooth}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ border: '1px solid #ECEAF8', borderRadius: RADIUS.xl, overflow: 'hidden' }}>
                {activeItinerary.map((item, idx) => {
                  const isOpen = openItinerary.includes(idx);
                  const isLast = idx === activeItinerary.length - 1;
                  const isSafariDay = hasSafari && itineraryTab === 'safari' && idx >= (exp.itinerary.length - 1);
                  return (
                    <div key={idx} style={{ borderBottom: isLast ? 'none' : '1px solid #ECEAF8' }}>
                      <div
                        onClick={() => toggleItinerary(idx)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '16px',
                          padding: '16px 20px', cursor: 'pointer',
                          background: isOpen ? '#FAFAFE' : 'white',
                          transition: `background 150ms ${EASING.smooth}`, direction: 'rtl',
                        }}
                        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#FAFAFE'; }}
                        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'white'; }}
                      >
                        <span style={{
                          background: isSafariDay ? '#F59E0B' : COLOR.primary,
                          color: 'white',
                          borderRadius: RADIUS.full, padding: '4px 12px',
                          fontSize: '13px', fontWeight: 700,
                          fontFamily: "'Ploni', sans-serif",
                          whiteSpace: 'nowrap', flexShrink: 0,
                        }}>
                          יום {item.day}
                        </span>
                        <span style={{ flex: 1, fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 600, color: '#0A0818' }}>
                          {item.title}
                        </span>
                        <span style={{ fontSize: '14px', color: '#6B6B8A', flexShrink: 0 }}>
                          {isOpen ? '▴' : '▾'}
                        </span>
                      </div>
                      <div style={{ maxHeight: isOpen ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                        <p style={{
                          padding: '0 20px 20px', margin: 0,
                          fontFamily: "'Ploni', sans-serif", fontSize: '15px',
                          color: '#6B6B8A', lineHeight: 1.8, direction: 'rtl',
                        }}>
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

        <Separator />

        {/* ── D. למה לטרק עם HighAir ─────────────── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 32px', direction: 'rtl',
          }}>
            למה לטרק עם HighAir?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '20px',
          }}>
            {WHY_CARDS.map((card, i) => <WhyCard key={i} card={card} />)}
          </div>
        </section>

        <Separator />

        {/* ── E. חשוב לדעת ───────────────────────── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 32px', direction: 'rtl',
          }}>
            חשוב לדעת
          </h2>
          <div style={{
            background: '#FFFBEB', border: '1px solid #FEF3C7',
            borderRadius: RADIUS.xl, padding: '24px 28px', direction: 'rtl',
          }}>
            <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '17px', fontWeight: 700, color: '#92400E', marginBottom: '16px' }}>
              ⚠️ חשוב לדעת
            </div>
            {importantToNote.map((note, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < importantToNote.length - 1 ? '12px' : 0 }}>
                <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '16px', marginTop: '2px', flexShrink: 0 }}>•</span>
                <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#92400E', lineHeight: 1.6 }}>{note}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── F. תאריכי יציאה (Airtable live) ───── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 24px',
          }}>
            תאריכי יציאה לטיפוס
          </h2>

          {groupsLoading ? (
            <div style={{ color: '#6B6B8A', fontFamily: "'Ploni', sans-serif", fontSize: '15px', padding: '8px 0' }}>
              טוען תאריכים...
            </div>
          ) : liveGroups.length > 0 ? (
            <>
              {/* Month tabs */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {months.map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveMonth(key)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: RADIUS.full,
                      border: `1.5px solid ${activeMonth === key ? COLOR.primary : '#ECEAF8'}`,
                      background: activeMonth === key ? COLOR.primary : '#fff',
                      color: activeMonth === key ? 'white' : '#3D3B5A',
                      fontFamily: "'Ploni', sans-serif",
                      fontSize: '14px', fontWeight: 600,
                      cursor: 'pointer',
                      transition: `all 0.2s ${EASING.smooth}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Group cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: isMobile ? '100%' : '620px' }}>
                {visibleGroups.map(g => {
                  const spotsLeft = capacity - g.count;
                  const isFull   = spotsLeft <= 0;
                  const isAlmost = !isFull && spotsLeft <= 4;
                  const isSafari = g.eventName.toLowerCase().includes('safari');
                  const label    = eventLabel(g.eventName);
                  const spotsColor = isFull ? '#DC2626' : isAlmost ? '#D97706' : '#059669';
                  return (
                    <div key={g.id} style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: isMobile ? '12px' : '16px',
                      border: '1px solid #ECEAF8',
                      borderRadius: RADIUS.lg,
                      padding: isMobile ? '14px 16px' : '12px 20px',
                      background: '#fff',
                      direction: 'rtl',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      transition: `box-shadow 0.2s`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(109,40,217,0.10)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}
                    >
                      {/* Right: date */}
                      <span style={{
                        fontFamily: "'Ploni', sans-serif",
                        fontSize: isMobile ? '16px' : '17px',
                        fontWeight: 800, color: '#0A0818',
                        lineHeight: 1.1,
                        direction: 'ltr',
                        flexShrink: 0,
                      }}>
                        {formatDateRange(g.departure, g.returnDate)}
                      </span>

                      {/* Center: badge */}
                      <span style={{
                        flex: 1,
                        display: 'flex', justifyContent: 'center',
                      }}>
                        <span style={{
                          background: isSafari ? '#FEF3C7' : '#EDE9FE',
                          color: isSafari ? '#92400E' : '#5B21B6',
                          fontFamily: "'Ploni', sans-serif",
                          fontSize: '11px', fontWeight: 700,
                          padding: '3px 10px', borderRadius: '999px',
                          letterSpacing: '0.02em',
                          whiteSpace: 'nowrap',
                        }}>
                          {label}
                        </span>
                      </span>

                      {/* Left: CTA */}
                      <button
                        onClick={scrollToForm}
                        disabled={isFull}
                        style={{
                          background: isFull ? '#E5E7EB' : COLOR.primary,
                          color: isFull ? '#9CA3AF' : 'white',
                          border: 'none', borderRadius: RADIUS.full,
                          padding: isMobile ? '10px 16px' : '12px 28px',
                          fontFamily: "'Ploni', sans-serif",
                          fontSize: '14px', fontWeight: 700,
                          cursor: isFull ? 'not-allowed' : 'pointer',
                          whiteSpace: 'nowrap', flexShrink: 0,
                          transition: 'background 0.2s',
                        }}
                      >
                        {isFull ? 'מלא' : 'להרשמה ←'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Fallback: static date chips from exp.dates */
            (exp?.dates?.length > 0) ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {exp.dates.map((d, i) => (
                  <DateChip key={i} date={d} />
                ))}
              </div>
            ) : (
              <div style={{ color: '#6B6B8A', fontFamily: "'Ploni', sans-serif", fontSize: '15px', padding: '8px 0' }}>
                אין תאריכים זמינים כרגע — צרו קשר לפרטים
              </div>
            )
          )}
        </section>

        <Separator />

        {/* ── G. עלות הטיפוס ─────────────────────── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <div style={{
            background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
            borderRadius: RADIUS.xl,
            padding: isMobile ? '32px 24px' : '48px',
            textAlign: 'center', direction: 'rtl',
          }}>
            <span style={{
              fontFamily: "'Ploni', sans-serif", fontSize: '13px', fontWeight: 700,
              color: COLOR.primary, textTransform: 'uppercase', letterSpacing: '2px',
              display: 'block', marginBottom: '8px',
            }}>
              מחיר למשתתף
            </span>
            <div style={{
              fontFamily: "'Ploni', sans-serif",
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 800, color: '#0A0818',
              letterSpacing: '-0.02em', lineHeight: 1, margin: '8px 0',
            }}>
              {exp.priceStr}
            </div>
            <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '16px', color: '#3D3B5A', margin: '8px 0' }}>
              בחדר זוגי · קבוצה עד 12 אנשים
            </p>
            <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#6B6B8A', margin: '4px 0 24px' }}>
              המחיר אינו כולל טיסות בינלאומיות וביטוח נסיעות
            </p>
            <button
              onClick={scrollToForm}
              style={{
                background: COLOR.primary, color: 'white', border: 'none',
                borderRadius: RADIUS.full, padding: '14px 36px',
                fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Ploni', sans-serif", boxShadow: SHADOW.brand.md,
              }}
            >
              להרשמה ←
            </button>
          </div>
        </section>

        <Separator />

        {/* ── H. תמונות מהטיפוס ──────────────────── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 32px', direction: 'rtl',
          }}>
            תמונות מהטיפוס
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            {galleryImages.slice(0, isMobile ? 4 : 5).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${exp.nameHe} ${i + 1}`}
                style={{
                  borderRadius: RADIUS.lg,
                  width: '100%',
                  height: i === 0 ? (isMobile ? '220px' : 'auto') : (isMobile ? '160px' : '220px'),
                  objectFit: 'cover',
                  display: 'block',
                  gridColumn: i === 0 && isMobile ? 'span 2' : 'auto',
                  gridRow: i === 0 && !isMobile ? 'span 2' : 'auto',
                }}
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            ))}
          </div>
        </section>

        <Separator />

        {/* ── I. ביקורות לקוחות ──────────────────── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 32px', direction: 'rtl',
          }}>
            מה אומרים המטפסים שלנו?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            {reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
          </div>
        </section>

        <Separator />

        {/* ── J. שאלות ותשובות (FAQ) ──────────────── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 32px', direction: 'rtl',
          }}>
            שאלות נפוצות
          </h2>
          <div style={{ border: '1px solid #ECEAF8', borderRadius: RADIUS.xl, overflow: 'hidden' }}>
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              const isLast = idx === faqItems.length - 1;
              return (
                <div key={idx} style={{ borderBottom: isLast ? 'none' : '1px solid #ECEAF8' }}>
                  <div
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      padding: '18px 20px', cursor: 'pointer',
                      background: isOpen ? '#FAFAFE' : 'white',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: '12px',
                      direction: 'rtl', transition: `background 150ms ${EASING.smooth}`,
                    }}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#FAFAFE'; }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'white'; }}
                  >
                    <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0A0818' }}>
                      {item.q}
                    </span>
                    <span style={{ fontSize: '14px', color: '#6B6B8A', flexShrink: 0 }}>
                      {isOpen ? '▴' : '▾'}
                    </span>
                  </div>
                  <div style={{ maxHeight: isOpen ? '300px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                    <p style={{
                      padding: '0 20px 18px', margin: 0,
                      fontFamily: "'Ploni', sans-serif", fontSize: '15px',
                      color: '#6B6B8A', lineHeight: 1.75, direction: 'rtl',
                    }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom spacer for mobile sticky bar */}
        {isMobile && <div style={{ height: '80px' }} />}
      </main>

      {/* ══════════════════════════════════
          SECTION K: CONTACT FORM
      ══════════════════════════════════ */}
      <div
        id="contact-form"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)',
          padding: isMobile ? '48px 5%' : '72px 5%',
          direction: 'rtl',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: 700, color: 'white',
            letterSpacing: '-0.02em', margin: '0 0 12px',
          }}>
            עשו את הצעד הראשון
          </h2>
          <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '16px', color: 'rgba(255,255,255,0.7)', margin: '0 0 40px' }}>
            השאירו פרטים לשיחת בדיקת התאמה ללא התחייבות
          </p>

          {/* Form card */}
          <div style={{
            background: 'white', borderRadius: RADIUS.xl,
            padding: isMobile ? '24px' : '40px',
            maxWidth: '600px', margin: '0 auto', textAlign: 'right',
          }}>
            {status === 'success' ? (
              <div style={{
                background: '#F0FDF4', border: '1px solid #BBF7D0',
                borderRadius: RADIUS.lg, padding: '32px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '20px', fontWeight: 700, color: '#065F46', marginBottom: '8px' }}>קיבלנו!</div>
                <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#047857' }}>ניצור איתך קשר בהקדם</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ direction: 'rtl' }}>
                <div style={{ display: 'grid', gap: '16px' }}>

                  {/* שם מלא */}
                  <div>
                    <label style={labelStyle}>שם מלא *</label>
                    <input
                      type="text" required value={form.name}
                      onChange={e => {
                        // רק אותיות (עברית/לטינית) ורווחים
                        const v = e.target.value.replace(/[^א-תa-zA-Z\s]/g, '');
                        setForm(f => ({ ...f, name: v }));
                      }}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = COLOR.primary; }}
                      onBlur={e => { e.target.style.borderColor = '#E5E3F0'; }}
                    />
                  </div>

                  {/* חודש */}
                  <div>
                    <label style={labelStyle}>באיזה חודש תרצו לטפס? *</label>
                    <select
                      required value={form.month}
                      onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = COLOR.primary; }}
                      onBlur={e => { e.target.style.borderColor = '#E5E3F0'; }}
                    >
                      <option value="">בחרו חודש</option>
                      {(exp.dates || []).map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                      <option value="גמיש / טרם החלטתי">גמיש / טרם החלטתי</option>
                    </select>
                  </div>

                  {/* גיל + כמות אנשים */}
                  <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>גיל *</label>
                      <input
                        type="number" required min="16" max="99"
                        value={form.age}
                        onChange={e => {
                          // מקסימום 2 ספרות
                          const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                          setForm(f => ({ ...f, age: v }));
                        }}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = COLOR.primary; }}
                        onBlur={e => { e.target.style.borderColor = '#E5E3F0'; }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>כמות אנשים *</label>
                      <input
                        type="number" required min="1" max="10"
                        value={form.groupSize}
                        onChange={e => {
                          const v = Math.min(10, Math.max(1, parseInt(e.target.value) || 1));
                          setForm(f => ({ ...f, groupSize: String(v) }));
                        }}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = COLOR.primary; }}
                        onBlur={e => { e.target.style.borderColor = '#E5E3F0'; }}
                      />
                    </div>
                  </div>

                  {/* טלפון */}
                  <div>
                    <label style={labelStyle}>מספר טלפון *</label>
                    <input
                      type="tel" required value={form.phone}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setForm(f => ({ ...f, phone: v }));
                        if (phoneError) validatePhone(v);
                      }}
                      onBlur={e => validatePhone(e.target.value)}
                      style={{
                        ...inputStyle,
                        direction: 'ltr',
                        textAlign: 'right',
                        borderColor: phoneError ? '#DC2626' : undefined,
                      }}
                      onFocus={e => { e.target.style.borderColor = phoneError ? '#DC2626' : COLOR.primary; }}
                    />
                    {phoneError && (
                      <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#DC2626', margin: '4px 0 0' }}>
                        {phoneError}
                      </p>
                    )}
                  </div>

                  {/* מייל */}
                  <div>
                    <label style={labelStyle}>מייל *</label>
                    <input
                      type="text" required
                      value={form.email}
                      onChange={e => {
                        // רק תווים תקניים למייל
                        const v = e.target.value.replace(/[^a-zA-Z0-9._%+\-@]/g, '');
                        setForm(f => ({ ...f, email: v }));
                        if (emailError) validateEmail(v);
                      }}
                      onBlur={e => validateEmail(e.target.value)}
                      style={{
                        ...inputStyle,
                        direction: 'ltr',
                        textAlign: 'right',
                        borderColor: emailError ? '#DC2626' : undefined,
                      }}
                      onFocus={e => { e.target.style.borderColor = emailError ? '#DC2626' : COLOR.primary; }}
                    />
                    {emailError && (
                      <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#DC2626', margin: '4px 0 0' }}>
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* ניסיון */}
                  <div>
                    <label style={labelStyle}>מה הניסיון שלך בטרקים? *</label>
                    <textarea
                      rows={3} required value={form.experience}
                      onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder="ספרו לנו על ניסיון טיפוס / טרק קודם"
                      onFocus={e => { e.target.style.borderColor = COLOR.primary; }}
                      onBlur={e => { e.target.style.borderColor = '#E5E3F0'; }}
                    />
                  </div>

                  {/* שגיאה */}
                  {status === 'error' && (
                    <div style={{
                      color: '#DC2626', fontSize: '14px',
                      fontFamily: "'Ploni', sans-serif", textAlign: 'center',
                      background: 'rgba(220,38,38,0.08)', borderRadius: RADIUS.md, padding: '10px 14px',
                    }}>
                      {errorMsg}
                    </div>
                  )}

                  {/* כפתור שליחה */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      width: '100%',
                      background: status === 'loading' ? '#9CA3AF' : COLOR.primary,
                      color: 'white', border: 'none',
                      borderRadius: RADIUS.full, padding: '15px',
                      fontSize: FS.body, fontWeight: 700,
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      fontFamily: "'Ploni', sans-serif",
                      transition: `background 200ms ${EASING.smooth}`,
                    }}
                  >
                    {status === 'loading' ? 'שולח...' : 'שלחו פרטים ←'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          MOBILE STICKY BOTTOM CTA BAR
      ══════════════════════════════════ */}
      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150,
          background: 'white', boxShadow: '0 -2px 12px rgba(0,0,0,0.1)',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px',
          direction: 'rtl',
        }}>
          <div style={{ direction: 'rtl' }}>
            <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '18px', fontWeight: 800, color: '#0A0818' }}>
              {exp.priceStr}
            </div>
            <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '12px', color: '#6B6B8A' }}>
              למשתתף
            </div>
          </div>
          <button
            onClick={scrollToForm}
            style={{
              background: COLOR.primary, color: 'white', border: 'none',
              borderRadius: RADIUS.full, padding: '12px 24px',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Ploni', sans-serif",
            }}
          >
            לתיאום שיחה ←
          </button>
        </div>
      )}
    </div>
  );
}
