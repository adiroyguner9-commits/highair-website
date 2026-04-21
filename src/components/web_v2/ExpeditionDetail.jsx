/**
 * ExpeditionDetail.jsx - Full expedition detail page (web_v2)
 * Route: /expedition/:id
 * RTL Hebrew · Ploni font · inline styles only · React 18
 */

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EXPS } from '../../data/mockData.js';
import { COLOR, RADIUS, EASING, FS, SHADOW, BTN, glass } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import StatsSection from './StatsSection.jsx';
import { MountainIcon, StarIcon, MedalIcon, TagIcon, CalendarIcon, ShareIcon } from '../Icons.jsx';

/* ─── Default data ─────────────────────────────────────────────── */
const DEFAULT_REVIEWS = [
  { name: 'יוני לוי', date: 'ינואר 2025', rating: 5, text: 'חוויה של פעם בחיים. הצוות של HighAir היה מקצועי ברמה הגבוהה ביותר, תמיד שם לתמיכה. לא האמנתי שאצליח לעלות לפסגה אבל הם האמינו בי.', initial: 'י' },
  { name: 'מיכל שרון', date: 'מרץ 2025', rating: 5, text: 'הכל היה מושלם מהארגון ועד הרגע שעמדנו על הפסגה. המדריך שלנו היה מדהים - סבלני, מקצועי וגם כיף לבלות איתו.', initial: 'מ' },
  { name: 'רועי אברהם', date: 'פברואר 2025', rating: 5, text: 'הגעתי בלי ניסיון, חזרתי עם פסגה ועם חברים לחיים. HighAir הם לא רק חברת טיולים - הם משפחה.', initial: 'ר' },
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
  'הטיפוס מתבצע בקבוצה עד 15 משתתפים בלבד!',
  'צוות מקומי ומנוסה עם מדריכים דוברי אנגלית, ניסיון רב בהובלת קבוצות בהרים, מעניקים ליווי מקצועי וחוויה אותנטית!',
  'על כל מטייל להישמע להוראות הצוות ולשמור על אחריותו וביטחונו האישי לאורך כל המסע!',
  'אישור רפואי והצהרת בריאות נדרשים כתנאי ליציאה למסע, על מנת לוודא התאמה ובריאות המטיילים!',
  'מטייל שלא יעמוד בדרישות הבריאותיות או הפיזיות, לא יורשה להצטרף למסע!',
  'אם אין לכם ניסיון קודם בטיפוסים, אם אתם מסוגלים ללכת כ-20 ק"מ ביום, אוהבים אתגרים ובעלי מוטיבציה גבוהה, הטיפוס בהחלט יכול להתאים לכם!',
  'המסלול עשוי להשתנות בהתאם למזג האוויר או לפי שיקול דעת המדריכים המוסמכים בשטח!',
  'בטיחות לפני פסגה - בהרים אין הבטחה להגעה לפסגה, אך תמיד יש התחייבות לבטיחות מעל לכל!',
];

const getWhyCards = (exp) => {
  const activity = exp?.typeHe || 'טיפוס';
  const country  = exp?.countryHe || '';
  return [
    { icon: '🏋️', title: `תכנית אימונים כהכנה ל${activity}`, desc: '' },
    { icon: '🎒', title: `רשימת ציוד ל${activity}`, desc: '' },
    { icon: '✈️', title: 'סגירת טיסה אטרקטיבית', desc: '' },
    { icon: '🛡️', title: 'סגירת ביטוח אטרקטיבי', desc: '' },
    { icon: '📡', title: '10% הנחה על מכשיר לווייני - מגנוס', desc: '' },
    { icon: '🏪', title: '20% הנחה על ציוד בחנות ״גרביטי״', desc: '' },
    { icon: '🏬', title: '25% הנחה על ציוד ברשת ״פקל חגור״', desc: '' },
    { icon: '🏔️', title: 'דף מידע לגבי מחלת גבהים והתמודדות איתה', desc: '' },
    ...(exp?.continent !== 'europe' ? [{ icon: '📋', title: `מדריך להוצאה ויזה ל${country}`, desc: '' }] : []),
    { icon: '🤝', title: 'השתתפות בטיולי הקהילה שלנו', desc: '' },
    { icon: '📞', title: `ליווי 24/7 משלב ההכנה ובמהלך ה${activity}`, desc: '' },
  ];
};

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
        borderRadius: RADIUS.lg,
        padding: '14px 18px',
        transition: `box-shadow 200ms ${EASING.smooth}, transform 200ms ${EASING.smooth}`,
        boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
        direction: 'rtl',
        background: '#fff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '22px', flexShrink: 0 }}>{card.icon}</span>
        <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 600, color: '#0A0818', lineHeight: 1.4 }}>{card.title}</span>
      </div>
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

  /* ── Dynamic SEO ── */
  useEffect(() => {
    if (!exp) return;
    document.title = `${exp.nameHe} | HighAir Expeditions`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', `${exp.nameHe} ב${exp.countryHe} - ${exp.elev}. הצטרפו למשלחת עם HighAir Expeditions.`);
    return () => {
      document.title = 'HighAir Expeditions | משלחות טיפוס הרים וטרקים בעולם';
      if (meta) meta.setAttribute('content', 'HighAir Expeditions - ארגון משלחות טיפוס הרים וטרקים בארץ ובעולם.');
    };
  }, [exp?.slug]);

  /* ── Itinerary accordion: array of open indices, first open by default ── */
  const [openItinerary, setOpenItinerary] = useState([]);
  const [itineraryTab, setItineraryTab] = useState('safari'); // 'trek' | 'safari'
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
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() + 14);

    /* Fetch all groups (no server-side filter - avoids field-name guessing).
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
        .filter(g => g.departure && new Date(g.departure) >= cutoff)
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
    if (n.includes('kosher') && n.includes('safari')) return `${exp.typeHe} כשר + ספארי`;
    if (n.includes('kosher')) return `${exp.typeHe} כשר`;
    if (n.includes('safari')) return `${exp.typeHe} + ספארי`;
    return exp.nameHe || exp.typeHe;
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
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ── Form state ── */
  const [form, setForm] = useState({ name: '', month: '', age: '', groupSize: '1', phone: '', email: '', experience: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [ageError,   setAgeError]   = useState('');

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

  /* ── Age validation ── */
  function validateAge(val) {
    const n = Number(val);
    if (val && n < 16) { setAgeError('גיל מינימלי להשתתפות הוא 16'); return false; }
    setAgeError('');
    return true;
  }

  /* ── Form submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!exp) return;
    if (!validateEmail(form.email)) return;
    if (!validatePhone(form.phone)) return;
    if (!validateAge(form.age)) return;
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
            onClick={() => navigate('/')}
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
  const galleryImages = [
    exp.img,
    `/images/gallery/${exp.slug}/1.jpg`,
    `/images/gallery/${exp.slug}/2.jpg`,
    `/images/gallery/${exp.slug}/3.jpg`,
    `/images/gallery/${exp.slug}/4.jpg`,
    `/images/gallery/${exp.slug}/5.jpg`,
  ].filter(Boolean);

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
        {/* Video background - YouTube if videoUrl, else hero.mp4 */}
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


        {/* Hero content - title top, subtitle+CTA bottom */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'center',
          padding: isMobile ? '140px 6% 120px' : '160px 8% 130px',
        }}>
          {/* Title: name + elevation - pinned to top */}
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

          {/* Tagline + CTA - pinned to bottom */}
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


        {/* IntersectionObserver sentinel - bottom of hero */}
        <div ref={heroRef} style={{ position: 'absolute', bottom: 0, width: '100%', height: '1px', zIndex: 0 }} />
      </div>

      {/* ══════════════════════════════════
          STATS STRIP - expedition specific
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
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap:                 '0',
        }}>
          {[
            { IconComp: MountainIcon, label: 'גובה',          value: `${exp.elevNum} מ׳` },
            { IconComp: StarIcon,     label: 'דרגת קושי',     value: exp.diffHe },
            { IconComp: MedalIcon,    label: 'אחוזי הצלחה',   value: exp.successRate ? `${exp.successRate}%` : '-' },
            { IconComp: TagIcon,      label: 'עלות',           value: exp.priceStr ? `החל מ-${exp.priceStr}` : '-' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign:    'center',
              padding:      isMobile ? '14px 8px' : '4px 24px',
              borderRight:  (!isMobile && i > 0) ? '1px solid #ECEAF8' : 'none',
              borderTop:    (isMobile && i >= 2) ? '1px solid #ECEAF8' : 'none',
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
            {exp.priceStr && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>עלות</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: COLOR.primary, fontFamily: "'Ploni', sans-serif" }}>
                  החל מ-{exp.priceStr}
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
                  עונות מומלצות ל{exp.typeHe}: {seasons.join(' | ')}
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

            {/* Right column - absolutely positioned inside relative wrapper so it always fills text height */}
            <div style={{ position: 'relative', minHeight: isNarrow ? '260px' : '400px' }}>
              {exp.img ? (
                <img
                  src={exp.img}
                  alt={exp.nameHe}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', borderRadius: RADIUS.xl, display: 'block' }}
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: exp.grad, borderRadius: RADIUS.xl }} />
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
            {/* כלול - green card */}
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

            {/* לא כלול - light red card */}
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
                  תכנית ה{exp.typeHe}
                </h2>
                {hasSafari && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'safari', label: `טיפוס + ספארי (${(exp.itinerary.length - 1) + (exp.safariItinerary?.length || 0)} ימים)` },
                      { key: 'trek',   label: `טיפוס בלבד (${exp.itinerary.length} ימים)` },
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

        {/* ── D+E. למה לטרק עם HighAir + חשוב לדעת - side by side ── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr',
            gap: '40px',
            alignItems: 'start',
          }}>

            {/* ── D. למה לטרק עם HighAir ── */}
            <div>
              <h2 style={{
                fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
                fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 24px', direction: 'rtl',
              }}>
                למה לטייל עם HighAir?
              </h2>
              <div style={{
                background: '#F5F3FF', border: '1px solid #DDD6FE',
                borderRadius: RADIUS.xl, padding: '24px 28px', direction: 'rtl',
              }}>
                {getWhyCards(exp).map((card, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < getWhyCards(exp).length - 1 ? '12px' : 0 }}>
                    <span style={{ color: COLOR.primary, fontWeight: 700, fontSize: '16px', marginTop: '2px', flexShrink: 0 }}>•</span>
                    <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#4C1D95', lineHeight: 1.6 }}>{card.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── E. חשוב לדעת ── */}
            <div>
              <h2 style={{
                fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
                fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 24px', direction: 'rtl',
              }}>
                חשוב לדעת
              </h2>
              <div style={{
                background: '#FFFBEB', border: '1px solid #FEF3C7',
                borderRadius: RADIUS.xl, padding: '24px 28px', direction: 'rtl',
              }}>
                {importantToNote.map((note, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < importantToNote.length - 1 ? '12px' : 0 }}>
                    <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '16px', marginTop: '2px', flexShrink: 0 }}>•</span>
                    <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#92400E', lineHeight: 1.6 }}>{note}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        <Separator />

        {/* ── F. תאריכי יציאה (Airtable live) ───── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 24px',
          }}>
            תאריכי יציאה ל{exp.typeHe}
          </h2>

          {exp.soldOut ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '12px', padding: '40px 24px', borderRadius: RADIUS.xl,
              border: '1.5px dashed #FECACA', background: '#FFF5F5',
              textAlign: 'center', direction: 'rtl',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
              </div>
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '17px', fontWeight: 700, color: '#991B1B', margin: 0 }}>
                ה{exp.typeHe} מלא - אין מקומות פנויים
              </p>
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14px', color: '#6B6B8A', margin: 0, lineHeight: 1.6 }}>
                רוצים להירשם לרשימת ההמתנה ולקבל עדיפות ליציאה הבאה?
              </p>
              <button onClick={scrollToForm} style={{
                marginTop: '4px', padding: '10px 28px', borderRadius: RADIUS.full,
                border: 'none', background: COLOR.primary, color: '#fff',
                fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 700,
                cursor: 'pointer',
              }}>
                השאירו פרטים
              </button>
            </div>
          ) : groupsLoading ? (
            <div style={{ color: '#6B6B8A', fontFamily: "'Ploni', sans-serif", fontSize: '15px', padding: '8px 0' }}>
              טוען תאריכים...
            </div>
          ) : liveGroups.length > 0 ? (
            <>
              {/* Month tabs - only when more than 2 departure dates */}
              {liveGroups.length > 2 && (
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
              )}

              {/* Group cards */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
                {(liveGroups.length > 2 ? visibleGroups : liveGroups).map(g => {
                  const spotsLeft       = capacity - g.count;
                  const depYM           = (() => { const d = new Date(g.departure); return `${d.getUTCFullYear()}-${d.getUTCMonth()}`; })();
                  const isManualSoldOut = (exp?.soldOutGroups || []).some(m => {
                    const sd = new Date(m);
                    return `${sd.getUTCFullYear()}-${sd.getUTCMonth()}` === depYM;
                  });
                  const isFull   = spotsLeft <= 0 || isManualSoldOut;
                  const isAlmost = !isFull && spotsLeft <= 4;
                  const isSafari = g.eventName.toLowerCase().includes('safari');
                  const label    = eventLabel(g.eventName);
                  const spotsColor = isFull ? '#DC2626' : isAlmost ? '#D97706' : '#059669';
                  return (
                    <div key={g.id} style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      alignItems: 'center',
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
                      {/* Right: calendar icon + date */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        width: isMobile ? '140px' : '155px',
                        flexShrink: 0,
                      }}>
                        <CalendarIcon size={isMobile ? 16 : 18} color={COLOR.primary} />
                        <span style={{
                          fontFamily: "'Ploni', sans-serif",
                          fontSize: isMobile ? '15px' : '17px',
                          fontWeight: 800, color: '#0A0818',
                          lineHeight: 1.1,
                          direction: 'ltr',
                          whiteSpace: 'nowrap',
                        }}>
                          {formatDateRange(g.departure, g.returnDate)}
                        </span>
                      </div>

                      {/* Center: badge */}
                      <span style={{
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
                          whiteSpace: 'nowrap',
                          justifySelf: 'end',
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
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '12px', padding: '40px 24px', borderRadius: RADIUS.xl,
              border: '1.5px dashed #DDD6FE', background: '#FAFAFF',
              textAlign: 'center', direction: 'rtl',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={COLOR.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p style={{
                fontFamily: "'Ploni', sans-serif", fontSize: '17px', fontWeight: 700,
                color: '#0A0818', margin: 0,
              }}>
                תאריכי ה{exp.typeHe} יפורסמו בקרוב
              </p>
              <p style={{
                fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 400,
                color: '#6B6B8A', margin: 0, lineHeight: 1.6,
              }}>
                רוצים להירשם לרשימת ההמתנה או לשמוע על תאריכים חדשים ראשונים?
              </p>
              <button
                onClick={scrollToForm}
                style={{
                  marginTop: '4px', padding: '10px 28px',
                  borderRadius: RADIUS.full, border: 'none',
                  background: COLOR.primary, color: '#fff',
                  fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '0.01em',
                }}
              >
                השאירו פרטים
              </button>
            </div>
          )}
        </section>

        <Separator />

        {/* ── H. תמונות מהטיפוס ──────────────────── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 32px', direction: 'rtl',
          }}>
            תמונות מה{exp.typeHe}
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

        {/* ── J. עדכוני פסגה ──────────────────────── */}
        {exp.summitUpdates?.length > 0 && (
          <>
            <Separator />
            <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
              <h2 style={{
                fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
                fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 8px', direction: 'rtl',
              }}>
                עדכוני פסגה
              </h2>
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#6B6B8A', margin: '0 0 28px', direction: 'rtl' }}>
                המטפסים שלנו שהגיעו לפסגה
              </p>

              {/* Horizontal scroll slider - mobile & desktop */}
              <div style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingBottom: '8px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}>
                {exp.summitUpdates.map((u, i) => (
                  <div key={i} style={{
                    position: 'relative',
                    borderRadius: RADIUS.xl,
                    overflow: 'hidden',
                    flexShrink: 0,
                    width: isMobile ? '200px' : '260px',
                    aspectRatio: '3/4',
                    background: '#1a1a2e',
                    cursor: 'default',
                  }}>
                    {/* Photo */}
                    <img
                      src={u.img}
                      alt={u.name}
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />

                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
                    }} />

                    {/* Summit badge */}
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: 'rgba(0,0,0,0.45)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      color: 'white',
                      fontFamily: "'Ploni', sans-serif",
                      fontSize: '12px', fontWeight: 600,
                      padding: '5px 10px 5px 8px', borderRadius: '999px',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      letterSpacing: '0.02em',
                    }}>
                      {/* Green circle checkmark */}
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: '#22C55E',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      Verified
                    </div>

                    {/* Name + date */}
                    <div style={{
                      position: 'absolute', bottom: '14px', right: '14px', left: '14px',
                      direction: 'rtl',
                    }}>
                      <div style={{
                        fontFamily: "'Ploni', sans-serif",
                        fontSize: '16px', fontWeight: 700,
                        color: 'white', lineHeight: 1.2,
                      }}>
                        {u.name}
                      </div>
                      <div style={{
                        fontFamily: "'Ploni', sans-serif",
                        fontSize: '12px', color: 'rgba(255,255,255,0.7)',
                        marginTop: '3px',
                      }}>
                        {u.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}


      </main>

      {/* ══════════════════════════════════
          CONTACT FORM
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
                    <label style={labelStyle}>באיזה חודש תרצו לטייל? *</label>
                    <select
                      required value={form.month}
                      onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = COLOR.primary; }}
                      onBlur={e => { e.target.style.borderColor = '#E5E3F0'; }}
                    >
                      <option value="">בחרו חודש</option>
                      {months.length > 0
                        ? months.map(([key, label]) => (
                            <option key={key} value={label}>{label}</option>
                          ))
                        : (exp.dates || []).map((d, i) => (
                            <option key={i} value={d}>{d}</option>
                          ))
                      }
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
                          const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                          setForm(f => ({ ...f, age: v }));
                          validateAge(v);
                        }}
                        style={{
                          ...inputStyle,
                          borderColor: ageError ? '#DC2626' : inputStyle.borderColor,
                        }}
                        onFocus={e => { e.target.style.borderColor = ageError ? '#DC2626' : COLOR.primary; }}
                        onBlur={e => { e.target.style.borderColor = ageError ? '#DC2626' : '#E5E3F0'; }}
                      />
                      {ageError && (
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#DC2626', fontFamily: "'Ploni', sans-serif" }}>
                          {ageError}
                        </p>
                      )}
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
                        borderColor: phoneError ? '#DC2626' : '#E5E3F0',
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
                        borderColor: emailError ? '#DC2626' : '#E5E3F0',
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

      {/* Floating WhatsApp button */}
      <style>{`
        @keyframes waPulse {
          0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
          70% { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
      `}</style>
      <a
        href="https://wa.me/972555636975"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '28px',
          zIndex: 999,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
          animation: 'waPulse 2s infinite',
          textDecoration: 'none',
        }}
        aria-label="WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <SiteFooter />
    </div>
  );
}
