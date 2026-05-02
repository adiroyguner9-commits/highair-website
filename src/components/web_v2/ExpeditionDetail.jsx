/**
 * ExpeditionDetail.jsx - Full expedition detail page (web_v2)
 * Route: /expedition/:id
 * RTL Hebrew · Ploni font · inline styles only · React 18
 */

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EXPS } from '../../data/mockData.js';
import { usePageMeta, tourSchema, breadcrumbList, faqPage } from '../../website/usePageMeta.js';
import { COLOR, RADIUS, EASING, FS, SHADOW, BTN, glass } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import PhoneField, { formatFullPhone, validatePhone as checkPhone } from './PhoneField.jsx';
import StatsSection from './StatsSection.jsx';
import BookingWidget from './BookingWidget.jsx';
import { MountainIcon, StarIcon, MedalIcon, TagIcon, CalendarIcon, ShareIcon } from '../Icons.jsx';

/* ─── Translation helpers ───────────────────────────────────────── */
const HE_TO_EN_MONTHS = {
  'ינואר':'January','פברואר':'February','מרץ':'March','אפריל':'April',
  'מאי':'May','יוני':'June','יולי':'July','אוגוסט':'August',
  'ספטמבר':'September','אוקטובר':'October','נובמבר':'November','דצמבר':'December'
};
function translateSeason(s, isRtl) {
  if (isRtl || !s) return s;
  let result = s;
  Object.entries(HE_TO_EN_MONTHS).forEach(([he, en]) => { result = result.replace(new RegExp(he, 'g'), en); });
  return result;
}
function translateDays(daysStr, isRtl) {
  if (isRtl || !daysStr) return daysStr;
  return daysStr
    .replace(/ימים/g, 'days')
    .replace(/יום/g, 'day')
    .replace(/ספארי/g, 'safari')
    .replace(/\+\s*/, '+ ');
}

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

const DEFAULT_NOT_INCLUDED_EN = [
  'International flights',
  'Travel insurance (mandatory)',
  'Personal climbing/trekking equipment',
  'Meals not specified in the itinerary',
  'Personal expenses and tips',
  'Visa fees (if applicable)',
];

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

const DEFAULT_IMPORTANT_EN = [
  'The expedition runs in groups of up to 15 participants only!',
  'Experienced local team with English-speaking guides, extensive mountain leadership experience - delivering professional support and an authentic experience!',
  'Every participant must follow the team\'s instructions and take personal responsibility for their safety throughout the journey!',
  'Medical clearance and a health declaration are required before departure to ensure participant fitness and wellbeing!',
  'Any participant who does not meet the health or physical requirements will not be permitted to join the expedition!',
  'If you have no prior experience but can walk ~20 km a day, love challenges, and have high motivation - this expedition can absolutely be for you!',
  'The route may change according to weather conditions or at the discretion of the certified guides in the field!',
  'Safety before summit - in the mountains there is no guarantee of reaching the summit, but there is always a commitment to safety above all!',
];

const getWhyCards = (exp, isRtl) => {
  const activity = isRtl ? (exp?.typeHe || 'טיפוס') : (exp?.type || 'Climbing');
  const country  = isRtl ? (exp?.countryHe || '') : (exp?.country || '');
  if (!isRtl) {
    return [
      { icon: '🏋️', title: `Training Plan for ${activity}`, desc: '' },
      { icon: '🎒', title: `Gear List for ${activity}`, desc: '' },
      { icon: '✈️', title: 'Attractive flight booking', desc: '' },
      { icon: '🛡️', title: 'Attractive insurance booking', desc: '' },
      { icon: '📡', title: '10% discount on satellite device - Magnus', desc: '' },
      { icon: '🏪', title: '20% discount on gear at Gravity store', desc: '' },
      { icon: '🏬', title: '25% discount on gear at Pakal Hagur chain', desc: '' },
      { icon: '🏔️', title: 'Info guide on altitude sickness and coping', desc: '' },
      ...(exp?.continent !== 'europe' ? [{ icon: '📋', title: `Visa guide for ${country}`, desc: '' }] : []),
      { icon: '🤝', title: 'Participate in our community treks', desc: '' },
      { icon: '📞', title: `24/7 support from prep to summit during the ${activity}`, desc: '' },
    ];
  }
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
        direction: 'inherit',
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
  const { i18n } = useTranslation();
  const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const initial = review.initial || (review.name ? review.name[0] : '?');
  return (
    <div style={{ border: '1px solid #ECEAF8', borderRadius: RADIUS.xl, padding: '24px', direction: dir, background: '#fff' }}>
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
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';

  const exp = EXPS.find(e => e.slug === slug);

  /* Schema.org JSON-LD: Tour + Breadcrumbs + FAQ — built once per expedition.
     This is what unlocks rich-result eligibility on Google for tour queries
     ("טיפוס קילימנג'רו", "Mt Kilimanjaro tour from Israel", etc.). */
  const expJsonLd = exp ? [
    tourSchema({
      name:         `${exp.nameHe}${exp.countryHe ? ' · ' + exp.countryHe : ''}`,
      description:  `${exp.nameHe} ב${exp.countryHe || ''} - ${exp.elev || ''}. משלחת מלאה עם HighAir Expeditions.`,
      image:        exp.img,
      url:          `/expedition/${exp.slug}`,
      country:      exp.countryHe || exp.country,
      durationDays: typeof exp.days === 'number' ? exp.days : undefined,
      ratingValue:  4.9,
      reviewCount:  exp.reviews?.length || 229,
    }),
    breadcrumbList([
      { name: 'בית',       url: '/' },
      { name: 'משלחות',   url: '/#expeditions' },
      { name: exp.nameHe, url: `/expedition/${exp.slug}` },
    ]),
    faqPage((exp.faq?.length ? exp.faq : DEFAULT_FAQ).slice(0, 8)),
  ] : null;

  usePageMeta(exp ? {
    title:         `${exp.nameHe} | HighAir Expeditions`,
    description:   `הצטרפו למשלחת ${exp.nameHe} עם HighAir Expeditions. ${exp.elev ? exp.elev + ' - ' : ''}טיפוס הרים וטרקים בשילוב תרומה למלחמה בסרטן.`,
    canonicalPath: `/expedition/${exp.slug}`,
    image:         exp.img ? `https://www.highair-expeditions.com${exp.img}` : undefined,
    jsonLd:        expJsonLd,
  } : {
    title:       'HighAir Expeditions | משלחות הרים',
    description: 'משלחות טיפוס הרים וטרקים בעולם.',
    canonicalPath: '/expedition/' + slug,
  });

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

  /* ── FAQ accordion ── */
  const [openFaq, setOpenFaq] = useState(null);

  /* ── Live groups from Airtable ── */
  const hasAirtable = !!(exp?.airtableEvents?.length);
  const [liveGroups, setLiveGroups]         = useState([]);
  const [groupsLoading, setGroupsLoading]   = useState(hasAirtable);
  const [groupsError, setGroupsError]       = useState(null);
  const [activeMonth, setActiveMonth]       = useState(null);
  const [galleryUrls, setGalleryUrls]       = useState([]);

  useEffect(() => {
    if (!hasAirtable) return;
    setGroupsLoading(true);
    setGroupsError(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() + 14);

    /* Step 1: fetch Groups for this expedition */
    fetch(`/api/airtable/Groups?fields[]=Event&fields[]=Group%20Name&fields[]=Departure&fields[]=Return&fields[]=Capacity&fields[]=Gallery_URLs`)
      .then(r => r.json())
      .then(async groupsData => {
        if (groupsData.error) throw new Error(JSON.stringify(groupsData.error));

        /* Filter to groups matching this expedition's events */
        const events = new Set((exp.airtableEvents || []).map(e => e.toLowerCase()));
        const relevant = (groupsData.records || []).filter(rec => {
          const ev = (rec.fields['Event'] || '').toLowerCase();
          return events.has(ev);
        });

        /* Extract the exact Group Name values we need to count */
        const groupNames = relevant
          .map(rec => rec.fields['Group Name'])
          .filter(Boolean);

        /* Step 2: fetch ONLY customers belonging to these groups
           using filterByFormula — avoids pagination issues entirely */
        let counts = {};
        if (groupNames.length > 0) {
          const formula = groupNames.length === 1
            ? `{Group Name}='${groupNames[0]}'`
            : `OR(${groupNames.map(n => `{Group Name}='${n}'`).join(',')})`;
          const custUrl = `/api/airtable/Customers?fields[]=Group%20Name&filterByFormula=${encodeURIComponent(formula)}`;
          const custData = await fetch(custUrl).then(r => r.json());
          (custData.records || []).forEach(rec => {
            const gn = rec.fields['Group Name'] || rec.fields['group name'];
            if (gn) counts[gn] = (counts[gn] || 0) + 1;
          });
        }

        /* Build enriched group list */
        const enriched = relevant
          .map(rec => {
            const groupName = rec.fields['Group Name'] || rec.id;
            return {
              id:         rec.id,
              groupName,
              eventName:  rec.fields['Event'] || '',
              departure:  rec.fields['Departure'] || null,
              returnDate: rec.fields['Return']    || null,
              count:      counts[groupName] || 0,
              capacity:   rec.fields['Capacity']  || null,
            };
          })
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

        // Extract gallery URLs from first relevant group record
        const galleryRec = relevant.find(rec => rec.fields['Gallery_URLs']);
        if (galleryRec) {
          const urls = galleryRec.fields['Gallery_URLs']
            .split('\n').map(u => u.trim()).filter(Boolean);
          if (urls.length) setGalleryUrls(urls);
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
    return `${dd}/${mm}-${rr}/${mm2}`;
  }

  function eventLabel(name) {
    const n = (name || '').toLowerCase();
    if (isRtl) {
      if (n.includes('safari')) return `${exp.typeHe} + ספארי`;
      return `${exp.typeHe} בלבד`;
    } else {
      if (n.includes('safari')) return `${exp.type || exp.typeHe} + Safari`;
      return `${exp.type || exp.typeHe} Only`;
    }
  }

  function monthKey(dep) {
    const d = new Date(dep);
    return `${d.getFullYear()}-${d.getMonth()}`;
  }

  function monthLabel(dep) {
    const d = new Date(dep);
    return d.toLocaleDateString(isRtl ? 'he-IL' : 'en-US', { month: 'long', year: 'numeric' });
  }

  /* unique months from live groups */
  const months = [...new Map(liveGroups.map(g => [monthKey(g.departure), monthLabel(g.departure)])).entries()];
  const visibleGroups = liveGroups.filter(g => monthKey(g.departure) === activeMonth);
  const capacity = exp?.groupCapacity || 15;
  const [heroBtnHovered, setHeroBtnHovered] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ── Form state ── */
  const [form, setForm] = useState({ name: '', month: '', age: '', groupSize: '1', dial: '+972', phone: '', email: '', experience: '', privacy: false });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showBooking, setShowBooking] = useState(true);
  const [isWaitlist,  setIsWaitlist]  = useState(false);
  const [ageError,   setAgeError]   = useState('');

  /* ── Phone validation ── */
  function validatePhone(val) {
    const ok = checkPhone(form.dial, val);
    setPhoneError(ok || !val ? '' : isRtl ? 'מספר טלפון לא תקין' : 'Invalid phone number');
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
    if (val && n < 16) { setAgeError(isRtl ? 'גיל מינימלי להשתתפות הוא 16' : 'Minimum age to participate is 16'); return false; }
    setAgeError('');
    return true;
  }

  /* ── Form submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!exp) return;
    if (!form.privacy) return;
    if (!validateEmail(form.email)) return;
    if (!validatePhone(form.phone)) return;
    if (!validateAge(form.age)) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            Name: form.name,
            Phone: formatFullPhone(form.dial, form.phone),
            Email: form.email,
            'Expedition': exp.nameHe,
            'Preferred Month': form.month,
            'Age': form.age ? Number(form.age) : undefined,
            'Group Size': form.groupSize ? Number(form.groupSize) : undefined,
            'Experience': form.experience || undefined,
            'Source': (isWaitlist ? 'Waitlist - ' : 'Expedition Page - ') + exp.nameHe,
          },
        }),
      });
      if (!res.ok) {
        let msg = `שגיאה ${res.status}`;
        try { const d = await res.json(); msg = d?.error || msg; } catch {}
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
    direction: dir,
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
    direction: dir,
    textAlign: 'start',
  };

  /* ─────────────── 404 ─────────────────── */
  if (!exp) {
    return (
      <div style={{ direction: dir, fontFamily: "'Ploni', sans-serif" }}>
        <Header />
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '24px',
          fontFamily: "'Ploni', sans-serif", direction: dir,
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
  const notIncluded = isRtl
    ? (exp.notIncluded?.length ? exp.notIncluded : DEFAULT_NOT_INCLUDED)
    : (exp.notIncludedEn?.length ? exp.notIncludedEn : DEFAULT_NOT_INCLUDED_EN);
  const importantToNote = isRtl
    ? (exp.importantToNote?.length ? exp.importantToNote : DEFAULT_IMPORTANT)
    : (exp.importantToNoteEn?.length ? exp.importantToNoteEn : DEFAULT_IMPORTANT_EN);
  const includedItems = isRtl ? (exp.included || []) : (exp.includedEn || exp.included || []);
  const seasons = isRtl ? (exp.seasons || []) : ((exp.seasonsEn || exp.seasons || []).map(s => translateSeason(s, false)));
  const displayDays = isRtl ? exp.days : (exp.daysEn || translateDays(exp.days, false));
  const itinerary = isRtl ? (exp.itinerary || []) : (exp.itineraryEn || exp.itinerary || []);
  const safariItinerary = isRtl ? (exp.safariItinerary || []) : (exp.safariItineraryEn || exp.safariItinerary || []);

  /* ── Active itinerary based on tab ── */
  const hasSafari = (exp?.safariItinerary?.length > 0) || (exp?.safariItineraryEn?.length > 0);
  const activeItinerary = itineraryTab === 'safari' && hasSafari
    ? [...itinerary.slice(0, -1), ...safariItinerary]
    : itinerary;

  const galleryImages = galleryUrls.length > 0
    ? galleryUrls
    : [
        exp.img,
        `/images/gallery/${exp.slug}/1.webp`,
        `/images/gallery/${exp.slug}/2.webp`,
        `/images/gallery/${exp.slug}/3.webp`,
        `/images/gallery/${exp.slug}/4.webp`,
        `/images/gallery/${exp.slug}/5.webp`,
      ].filter(Boolean);

  /* ─────────────── RENDER ─────────────────────────────────────── */
  return (
    <div style={{ direction: dir, fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
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
        {/* Video background - YouTube if videoUrl, else expedition-specific or fallback */}
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
        ) : (exp.heroVideo || exp.img) ? (
          exp.heroVideo ? (
            <video
              key={exp.heroVideo}
              autoPlay muted loop playsInline preload="auto"
              poster={exp.heroVideo.replace('.mp4', '-poster.jpg')}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', pointerEvents: 'none',
              }}
            >
              <source src={exp.heroVideo} type="video/mp4" />
            </video>
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${exp.img})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
          )
        ) : (
          <video
            key="hero-fallback"
            autoPlay muted loop playsInline preload="auto"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', pointerEvents: 'none',
            }}
          >
            <source src="/videos/hero-home.mp4" type="video/mp4" />
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
              {isRtl ? exp.nameHe : (exp.nameEn || exp.name || exp.nameHe)} ({exp.elevNum}{'m'})
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
            {isRtl
              ? (exp.tagline || `הצטרפו ל${exp.nameHe} ב${exp.countryHe}\nוקחו חלק משמעותי בתרומה למלחמה בסרטן!`)
              : `Join the ${exp.nameEn || exp.name} in ${exp.country}\nand take part in the fight against cancer!`}
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
            {isRtl ? 'לתיאום שיחה עם מומחה ←' : 'Schedule an Expert Call →'}
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
        direction: dir,
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
            { IconComp: MountainIcon, label: t('expedition.elevation'), value: `${exp.elevNum}${'m'}` },
            { IconComp: StarIcon,     label: t('expedition.diff'),      value: isRtl ? exp.diffHe : (exp.diff || exp.diffHe) },
            { IconComp: MedalIcon,    label: isRtl ? 'אחוזי הצלחה' : 'Success Rate', value: exp.successRate ? `${exp.successRate}%` : '-' },
            { IconComp: TagIcon,      label: isRtl ? 'עלות' : 'Price',  value: exp.priceStr ? (isRtl ? `החל מ-${exp.priceStr}` : `From ${exp.priceStr}`) : '-' },
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
                direction:     dir,
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
        direction: dir,
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: '0 5%', height: '60px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '16px' : '48px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>{t('expedition.elevation')}</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MountainIcon size={14} color="#0A0818" /> {exp.elevNum}{'m'}
              </span>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>{isRtl ? 'רמה' : 'Level'}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <StarIcon size={14} color="#0A0818" /> {isRtl ? exp.diffHe : (exp.diff || exp.diffHe)}
                </span>
              </div>
            )}
            {!isMobile && seasons.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>{isRtl ? 'עונות' : 'Seasons'}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {seasons.join(', ')}
                </span>
              </div>
            )}
            {exp.priceStr && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>{isRtl ? 'עלות' : 'Price'}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: COLOR.primary, fontFamily: "'Ploni', sans-serif" }}>
                  {isRtl ? `החל מ-${exp.priceStr}` : `From ${exp.priceStr}`}
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
            {t('expedition.registerBtn')}
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
                {isRtl ? 'מבוא' : 'Overview'}
              </h2>
              {seasons.length > 0 && (
                <p style={{ fontSize: '14px', color: '#6B6B8A', margin: '0 0 16px', fontFamily: "'Ploni', sans-serif" }}>
                  {isRtl
                    ? `עונות מומלצות ל${exp.typeHe}: ${seasons.join(' | ')}`
                    : `Recommended Seasons for ${exp.type || exp.typeHe}: ${seasons.join(' | ')}`}
                </p>
              )}
              {(() => {
                const descText = isRtl ? (exp.desc || '') : (exp.descEn || exp.desc || '');
                const parts = descText.split('\n\n');
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
            {isRtl ? 'מה כלול ומה לא כלול?' : 'Included & Excluded'}
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
                {isRtl ? 'מה כלול בתכנית?' : "What's Included?"}
              </div>
              {includedItems.map((item, i) => {
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
                    marginBottom: i < includedItems.length - 1 ? '14px' : 0,
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
                {isRtl ? 'מה לא כלול בתכנית?' : "What's Not Included?"}
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
        {itinerary && itinerary.length > 0 && (
          <>
            <Separator />
            <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
                <h2 style={{
                  fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
                  fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: 0,
                }}>
                  {isRtl ? `תכנית ה${exp.typeHe}` : t('expedition.itinerary')}
                </h2>
                {hasSafari && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'safari', label: isRtl
                          ? `טיפוס + ספארי (${(itinerary.length - 1) + (safariItinerary?.length || 0)} ימים)`
                          : `Climbing + Safari (${(itinerary.length - 1) + (safariItinerary?.length || 0)} days)` },
                      { key: 'trek',   label: isRtl
                          ? `טיפוס בלבד (${itinerary.length} ימים)`
                          : `Climbing only (${itinerary.length} days)` },
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
                      <button
                        onClick={() => toggleItinerary(idx)}
                        aria-expanded={isOpen}
                        aria-controls={`itinerary-panel-${idx}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '16px',
                          padding: '16px 20px', cursor: 'pointer',
                          background: isOpen ? '#FAFAFE' : 'white',
                          transition: `background 150ms ${EASING.smooth}`, direction: dir,
                          width: '100%', border: 'none', textAlign: 'start',
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
                          {isRtl ? `יום ${item.day}` : `Day ${item.day}`}
                        </span>
                        <span style={{ flex: 1, fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 600, color: '#0A0818' }}>
                          {item.title}
                        </span>
                        <span style={{ fontSize: '14px', color: '#6B6B8A', flexShrink: 0 }}>
                          {isOpen ? '▴' : '▾'}
                        </span>
                      </button>
                      <div id={`itinerary-panel-${idx}`} style={{ maxHeight: isOpen ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                        <p style={{
                          padding: '0 20px 20px', margin: 0,
                          fontFamily: "'Ploni', sans-serif", fontSize: '15px',
                          color: '#6B6B8A', lineHeight: 1.8, direction: dir,
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
                fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 24px', direction: dir,
              }}>
                {isRtl ? 'למה לטייל עם HighAir?' : 'Why Trek with HighAir?'}
              </h2>
              <div style={{
                background: '#F5F3FF', border: '1px solid #DDD6FE',
                borderRadius: RADIUS.xl, padding: '24px 28px', direction: dir,
              }}>
                {getWhyCards(exp, isRtl).map((card, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < getWhyCards(exp, isRtl).length - 1 ? '12px' : 0 }}>
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
                fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 24px', direction: dir,
              }}>
                {isRtl ? 'חשוב לדעת' : 'Important to Know'}
              </h2>
              <div style={{
                background: '#FFFBEB', border: '1px solid #FEF3C7',
                borderRadius: RADIUS.xl, padding: '24px 28px', direction: dir,
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
            {isRtl ? `תאריכי יציאה ל${exp.typeHe}` : 'Departure Dates'}
          </h2>

          {exp.soldOut ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '12px', padding: '40px 24px', borderRadius: RADIUS.xl,
              border: '1.5px dashed #FECACA', background: '#FFF5F5',
              textAlign: 'center', direction: dir,
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
                {isRtl ? `ה${exp.typeHe} מלא - אין מקומות פנויים` : `${exp.type || exp.typeHe} is Full - no available spots`}
              </p>
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14px', color: '#6B6B8A', margin: 0, lineHeight: 1.6 }}>
                {isRtl ? 'רוצים להירשם לרשימת ההמתנה ולקבל עדיפות ליציאה הבאה?' : 'Want to join the waitlist and get priority for the next departure?'}
              </p>
              <button onClick={() => { setIsWaitlist(true); scrollToForm(); }} style={{
                marginTop: '4px', padding: '10px 28px', borderRadius: RADIUS.full,
                border: 'none', background: COLOR.primary, color: '#fff',
                fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 700,
                cursor: 'pointer',
              }}>
                {t('expedition.waitlistBtn')}
              </button>
            </div>
          ) : groupsLoading ? (
            <div style={{ color: '#6B6B8A', fontFamily: "'Ploni', sans-serif", fontSize: '15px', padding: '8px 0' }}>
              {isRtl ? 'טוען תאריכים...' : 'Loading dates...'}
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
                  const groupCap        = g.capacity || exp?.groupCapacity || 15;
                  const spotsLeft       = groupCap - g.count;
                  const depYM           = (() => { const d = new Date(g.departure); return `${d.getUTCFullYear()}-${d.getUTCMonth()}`; })();
                  const isManualSoldOut = (exp?.soldOutGroups || []).some(m => {
                    const sd = new Date(m);
                    return `${sd.getUTCFullYear()}-${sd.getUTCMonth()}` === depYM;
                  });
                  const isFull    = spotsLeft <= 0 || isManualSoldOut;
                  const isLow     = !isFull && spotsLeft <= 6;
                  const isOpen    = !isFull && !isLow;
                  const isSafari      = g.eventName.toLowerCase().includes('safari');
                  const typeLabel     = eventLabel(g.eventName);
                  const showTypeLabel = exp.slug?.includes('kilimanjaro');

                  /* Spots badge config */
                  const spotsBadge = isFull
                    ? { bg: '#FEE2E2', color: '#991B1B', text: isRtl ? 'קבוצה מלאה' : 'Group Full' }
                    : isLow
                    ? { bg: '#FEF3C7', color: '#92400E', text: isRtl ? `נשארו ${spotsLeft} מקומות` : `${spotsLeft} spots left` }
                    : { bg: '#D1FAE5', color: '#065F46', text: isRtl ? 'הרשמה פתוחה' : 'Open' };
                  return (
                    <div key={g.id} style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      border: '1px solid #ECEAF8',
                      borderRadius: RADIUS.lg,
                      padding: isMobile ? '14px 16px' : '12px 20px',
                      background: '#fff',
                      direction: dir,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      transition: `box-shadow 0.2s`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(109,40,217,0.10)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}
                    >
                      {/* Date */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <CalendarIcon size={isMobile ? 16 : 18} color={COLOR.primary} />
                        <span style={{
                          fontFamily: "'Ploni', sans-serif",
                          fontSize: isMobile ? '15px' : '17px',
                          fontWeight: 800, color: '#0A0818',
                          lineHeight: 1.1, direction: 'ltr', whiteSpace: 'nowrap',
                        }}>
                          {formatDateRange(g.departure, g.returnDate)}
                        </span>
                      </div>

                      {/* Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        {showTypeLabel && (
                          <span style={{
                            background: '#EDE9FE',
                            color:      '#5B21B6',
                            fontFamily: "'Ploni', sans-serif",
                            fontSize: '11px', fontWeight: 700,
                            padding: '3px 10px', borderRadius: '999px',
                            letterSpacing: '0.02em', whiteSpace: 'nowrap',
                          }}>
                            {typeLabel}
                          </span>
                        )}
                        <span style={{
                          background: spotsBadge.bg, color: spotsBadge.color,
                          fontFamily: "'Ploni', sans-serif",
                          fontSize: '11px', fontWeight: 700,
                          padding: '3px 10px', borderRadius: '999px',
                          letterSpacing: '0.01em', whiteSpace: 'nowrap',
                        }}>
                          {spotsBadge.text}
                        </span>
                      </div>

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
                          flexShrink: 0,
                          transition: 'background 0.2s',
                        }}
                      >
                        {isFull ? t('expedition.full') : t('expedition.registerBtn')}
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
              textAlign: 'center', direction: dir,
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
                {isRtl ? `תאריכי ה${exp.typeHe} יפורסמו בקרוב` : t('expedition.comingSoon')}
              </p>
              <p style={{
                fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 400,
                color: '#6B6B8A', margin: 0, lineHeight: 1.6,
              }}>
                {isRtl ? 'רוצים להירשם לרשימת ההמתנה או לשמוע על תאריכים חדשים ראשונים?' : t('expedition.waitlist')}
              </p>
              <button
                onClick={() => { setIsWaitlist(true); scrollToForm(); }}
                style={{
                  marginTop: '4px', padding: '10px 28px',
                  borderRadius: RADIUS.full, border: 'none',
                  background: COLOR.primary, color: '#fff',
                  fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '0.01em',
                }}
              >
                {t('expedition.waitlistBtn')}
              </button>
            </div>
          )}
        </section>

        <Separator />

        {/* ── H. תמונות מהטיפוס ──────────────────── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 32px', direction: dir,
          }}>
            {isRtl ? `תמונות מה${exp.typeHe}` : t('expedition.gallery')}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            {galleryImages.map((src, i) => (
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
                fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 8px', direction: dir,
              }}>
                {isRtl ? 'עדכוני פסגה' : 'Summit Updates'}
              </h2>
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#6B6B8A', margin: '0 0 28px', direction: dir }}>
                {isRtl ? 'המטפסים שלנו שהגיעו לפסגה' : 'Our climbers who reached the summit'}
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
                      direction: dir,
                    }}>
                      <div style={{
                        fontFamily: "'Ploni', sans-serif",
                        fontSize: '16px', fontWeight: 700,
                        color: 'white', lineHeight: 1.2,
                      }}>
                        {isRtl ? u.name : (u.nameEn || u.name)}
                      </div>
                      <div style={{
                        fontFamily: "'Ploni', sans-serif",
                        fontSize: '12px', color: 'rgba(255,255,255,0.7)',
                        marginTop: '3px',
                      }}>
                        {isRtl ? u.date : (u.dateEn || u.date)}
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
          direction: dir,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: 700, color: 'white',
            letterSpacing: '-0.02em', margin: '0 0 12px',
          }}>
            {isRtl ? 'עשו את הצעד הראשון' : 'Take the First Step'}
          </h2>
          <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '16px', color: 'rgba(255,255,255,0.7)', margin: '0 0 40px' }}>
            {isRtl ? 'השאירו פרטים לשיחת בדיקת התאמה ללא התחייבות' : 'Leave your details for a no-commitment consultation call'}
          </p>

          {/* Form card */}
          <div style={{
            background: 'white', borderRadius: RADIUS.xl,
            padding: isMobile ? '24px' : '40px',
            maxWidth: '600px', margin: '0 auto', textAlign: 'start',
          }}>
            {status === 'success' ? (
              <div style={{
                background: 'linear-gradient(160deg, #0A0818 0%, #1E1B4B 55%, #4C1D95 100%)',
                borderRadius: RADIUS.xl,
                padding: '28px 24px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <BookingWidget
                  name={form.name}
                  phone={form.phone}
                  email={form.email}
                  expedition={exp?.nameHe}
                  onSkip={() => setShowBooking(false)}
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ direction: dir }}>
                <div style={{ display: 'grid', gap: '16px' }}>

                  {/* שם מלא */}
                  <div>
                    <label style={labelStyle}>{isRtl ? 'שם מלא *' : 'Full Name *'}</label>
                    <input
                      type="text" required value={form.name}
                      placeholder={isRtl ? 'ישראל ישראלי' : 'John Smith'}
                      onChange={e => {
                        // רק אותיות (עברית/לטינית) ורווחים
                        const v = e.target.value.replace(/[^א-תa-zA-Z\s]/g, '');
                        setForm(f => ({ ...f, name: v }));
                      }}
                      style={inputStyle}
                      onMouseEnter={e => { e.target.style.borderColor = COLOR.primary; }}
                      onMouseLeave={e => { e.target.style.borderColor = '#E5E3F0'; }}
                    />
                  </div>

                  {/* חודש */}
                  <div>
                    <label style={labelStyle}>{isRtl ? 'באיזה חודש תרצו לטייל? *' : 'Which month would you like to travel? *'}</label>
                    <select
                      required value={form.month}
                      onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                      style={inputStyle}
                      onMouseEnter={e => { e.target.style.borderColor = COLOR.primary; }}
                      onMouseLeave={e => { e.target.style.borderColor = '#E5E3F0'; }}
                    >
                      <option value="">{isRtl ? 'בחרו חודש' : 'Select month'}</option>
                      {months.length > 0
                        ? months.map(([key, label]) => (
                            <option key={key} value={label}>{label}</option>
                          ))
                        : (exp.dates || []).map((d, i) => (
                            <option key={i} value={d}>{d}</option>
                          ))
                      }
                      <option value="גמיש / טרם החלטתי">{isRtl ? 'גמיש / טרם החלטתי' : 'Flexible / Not decided yet'}</option>
                    </select>
                  </div>

                  {/* גיל + כמות אנשים */}
                  <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>{isRtl ? 'גיל *' : 'Age *'}</label>
                      <input
                        type="number" required min="16" max="99"
                        placeholder="25"
                        value={form.age}
                        onChange={e => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                          setForm(f => ({ ...f, age: v }));
                          validateAge(v);
                        }}
                        style={{
                          ...inputStyle,
                          borderColor: ageError ? '#DC2626' : '#E5E3F0',
                        }}
                        onMouseEnter={e => { e.target.style.borderColor = ageError ? '#DC2626' : COLOR.primary; }}
                        onMouseLeave={e => { e.target.style.borderColor = ageError ? '#DC2626' : '#E5E3F0'; }}
                      />
                      {ageError && (
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#DC2626', fontFamily: "'Ploni', sans-serif" }}>
                          {ageError}
                        </p>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>{isRtl ? 'כמות אנשים *' : 'Number of People *'}</label>
                      <input
                        type="number" required min="1" max="10"
                        placeholder="1"
                        value={form.groupSize}
                        onChange={e => {
                          const v = Math.min(10, Math.max(1, parseInt(e.target.value) || 1));
                          setForm(f => ({ ...f, groupSize: String(v) }));
                        }}
                        style={inputStyle}
                        onMouseEnter={e => { e.target.style.borderColor = COLOR.primary; }}
                        onMouseLeave={e => { e.target.style.borderColor = '#E5E3F0'; }}
                      />
                    </div>
                  </div>

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

                  {/* מייל */}
                  <div>
                    <label style={labelStyle}>{isRtl ? 'מייל *' : 'Email *'}</label>
                    <input
                      type="text" required
                      placeholder="example@walla.com"
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
                        textAlign: 'left',
                        borderColor: emailError ? '#DC2626' : '#E5E3F0',
                      }}
                      onMouseEnter={e => { e.target.style.borderColor = emailError ? '#DC2626' : COLOR.primary; }}
                      onMouseLeave={e => { e.target.style.borderColor = emailError ? '#DC2626' : '#E5E3F0'; }}
                    />
                    {emailError && (
                      <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#DC2626', margin: '4px 0 0' }}>
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* ניסיון */}
                  <div>
                    <label style={labelStyle}>{isRtl ? 'מה הניסיון שלך בטרקים? *' : 'What is your trekking experience? *'}</label>
                    <textarea
                      rows={3} required value={form.experience}
                      onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder={isRtl ? 'ספרו לנו על ניסיון טרק קודם' : 'Tell us about your previous trekking experience'}
                      onMouseEnter={e => { e.target.style.borderColor = COLOR.primary; }}
                      onMouseLeave={e => { e.target.style.borderColor = '#E5E3F0'; }}
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

                  {/* צ'קבוקס הסכמה */}
                  <label style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    cursor: 'pointer', direction: dir,
                    padding: '12px 14px',
                    borderRadius: RADIUS.lg,
                    border: `1.5px solid ${form.privacy ? COLOR.primary : '#E5E3F0'}`,
                    background: form.privacy ? '#F5F0FF' : '#FAFAFA',
                    transition: 'border-color 180ms, background 180ms',
                  }}>
                    <input
                      type="checkbox"
                      required
                      checked={form.privacy}
                      onChange={e => setForm(f => ({ ...f, privacy: e.target.checked }))}
                      style={{ marginTop: '3px', width: '16px', height: '16px', flexShrink: 0, accentColor: COLOR.primary, cursor: 'pointer' }}
                    />
                    <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#3D3B5A', lineHeight: 1.7 }}>
                      {isRtl ? 'אני מסכימ/ה למדיניות הפרטיות ולקבלת דיוור שיווקי' : 'I agree to the privacy policy and marketing communications'}&nbsp;·&nbsp;
                      <a href="/privacy" target="_blank" rel="noopener noreferrer"
                        style={{ color: COLOR.primary, textDecoration: 'underline', fontWeight: 600 }}
                        onClick={e => e.stopPropagation()}>
                        {isRtl ? 'לצפייה במדיניות פרטיות' : 'View privacy policy'}
                      </a>
                    </span>
                  </label>

                  {/* כפתור שליחה */}
                  <button
                    type="submit"
                    disabled={status === 'loading' || !form.privacy}
                    style={{
                      width: '100%',
                      background: (!form.privacy || status === 'loading') ? '#9CA3AF' : COLOR.primary,
                      color: 'white', border: 'none',
                      borderRadius: RADIUS.full, padding: '15px',
                      fontSize: FS.body, fontWeight: 700,
                      cursor: (!form.privacy || status === 'loading') ? 'not-allowed' : 'pointer',
                      fontFamily: "'Ploni', sans-serif",
                      transition: `background 200ms ${EASING.smooth}`,
                    }}
                  >
                    {status === 'loading' ? (isRtl ? 'שולח...' : 'Sending...') : (isRtl ? 'שלחו פרטים ←' : 'Send Details →')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
