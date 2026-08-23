/**
 * ExpeditionDetail.jsx - Full expedition detail page (web_v2)
 * Route: /expedition/:id
 * RTL Hebrew · Ploni font · inline styles only · React 18
 */

import { useState, useRef, useEffect } from 'react';
import { getAttribution } from '../../utils/attribution.js';
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
import { MountainIcon, StarIcon, MedalIcon, ClockIcon, TagIcon, CalendarIcon, ShareIcon, TreeIcon, LionIcon } from '../Icons.jsx';
import { Analytics, useScrollDepth } from '../../utils/analytics.js';
import MobilePhotoCarousel from './MobilePhotoCarousel.jsx';
import VideoTestimonials from './VideoTestimonials.jsx';
/* Safari-only blocks. Every one is rendered behind an isSafariExp gate, so a
   climb page renders exactly what it rendered before. */
import {
  SafariSummaryCard, SafariSectionNav, SafariForMe, SafariRouteMap,
  SafariPacking, SafariPricing, SafariInclusions, SafariVisa, SafariSection,
  NAV_SENTINEL_ID,
} from './SafariDetailSections.jsx';

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

const DEFAULT_REVIEWS_EN = [
  { name: 'Yoni Levi', date: 'January 2025', rating: 5, text: 'A once-in-a-lifetime experience. The HighAir team was professional at the highest level, always there for support. I didn\'t believe I could reach the summit, but they believed in me.', initial: 'Y' },
  { name: 'Michal Sharon', date: 'March 2025', rating: 5, text: 'Everything was perfect from the organisation to the moment we stood on the summit. Our guide was incredible — patient, professional, and great company.', initial: 'M' },
  { name: 'Roi Abraham', date: 'February 2025', rating: 5, text: 'I arrived with no experience and came back with a summit and lifelong friends. HighAir is more than a travel company — they\'re family.', initial: 'R' },
];

const makeDefaultFaq = (cap) => [
  { q: 'האם נדרש ניסיון טיפוס קודם?', a: 'לא נדרש ניסיון טיפוס קודם לרוב המסלולים שלנו. כל מה שצריך הוא כושר גופני טוב ורצון להצליח.' },
  { q: 'מה גודל הקבוצה?', a: `הקבוצות שלנו מוגבלות ל-${cap} משתתפים לכל היותר, כדי להבטיח ליווי אישי ואיכות מקסימלית.` },
  { q: 'האם יש אופציה לחדר יחיד?', a: 'כן, ניתן לבקש חדר יחיד בתוספת תשלום. יש לציין זאת בטופס ההרשמה.' },
  { q: 'מה קורה אם אני נסוג בדרך?', a: 'בטיחות המשתתפים היא בראש סדר העדיפויות. אם נדרשת נסיגה, המדריך ילווה אותך בבטחה בחזרה.' },
  { q: 'מה כולל המחיר?', a: 'המחיר כולל את כל מה שמפורט בסעיף "מה כלול". טיסות וביטוח נסיעות אינם כלולים.' },
];

const makeDefaultFaqEn = (cap) => [
  { q: 'Is prior climbing experience required?', a: 'No prior climbing experience is required for most of our routes. All you need is good physical fitness and the will to succeed.' },
  { q: 'What is the group size?', a: `Our groups are limited to ${cap} participants at most, to ensure personal attention and maximum quality.` },
  { q: 'Is a single room option available?', a: 'Yes, a single room can be requested for an additional fee. Please indicate this on the registration form.' },
  { q: 'What happens if I turn back on the way?', a: 'Participant safety is our top priority. If a descent is required, the guide will safely accompany you back.' },
  { q: 'What is included in the price?', a: 'The price includes everything listed in the "What\'s Included" section. Flights and travel insurance are not included.' },
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

/* A safari has nothing to do with summits, 20 km walking days or physical
   screening, so the climb list above reads as if it belongs to another product.
   This is the safari default (owner, Jul 30 2026: "draft it and I'll review").
   A trip can still override it with its own importantToNote array. */
const DEFAULT_IMPORTANT_SAFARI = [
  /* NOTE: index 0 is replaced at render time by the auto capacity sentence
     whenever groupCapacity is set, so keep a plain group-size line here. */
  'הספארי מתבצע בג׳יפ עד 6 מקומות בלבד!',
  'הנסיעה בשמורות מתבצעת בג׳יפי 4X4 פתוחי גג, המאפשרים צפייה וצילום ללא הפרעה!',
  'צוות מקומי ומנוסה עם נהגים-מדריכים דוברי אנגלית, שמכירים את השמורות ואת הרגלי בעלי החיים לעומק!',
  'צפייה בבעלי חיים היא חוויה בטבע פתוח - אין התחייבות לראות חיה מסוימת, אך המסלול נבנה כדי למקסם את הסיכוי!',
  'לאורך כל השהות בשמורה חובה להישמע להוראות הנהג-מדריך ולכללי הבטיחות, ובכלל זה איסור יציאה מהרכב!',
  'דרכון בתוקף לחצי שנה לפחות וויזה לטנזניה נדרשים לכניסה למדינה!',
  'מומלץ להתייעץ עם רופא לגבי חיסונים וטיפול מונע למלריה לפני היציאה!',
  'המסלול היומי עשוי להשתנות בהתאם למזג האוויר, לתנועת בעלי החיים ולשיקול דעת הצוות בשטח!',
  'הלינה בלודג׳ים ובקמפים בתוך השמורות או בסמוך אליהן, על בסיס פנסיון מלא!',
]; 

const DEFAULT_IMPORTANT_SAFARI_EN = [
  'The safari runs in a jeep with up to 6 seats only!',
  'Game drives are in open-roof 4X4 jeeps, allowing unobstructed viewing and photography!',
  'An experienced local team of English-speaking driver-guides who know the reserves and the animals\' habits deeply!',
  'Wildlife viewing happens in open nature - no specific animal can be guaranteed, but the route is built to maximise the chances!',
  'Throughout the reserve you must follow the driver-guide\'s instructions and the safety rules, including never leaving the vehicle!',
  'A passport valid for at least six months and a Tanzania visa are required for entry!',
  'Consult a doctor about vaccinations and malaria prophylaxis before departure!',
  'The daily route may change according to weather, animal movement and the team\'s judgement in the field!',
  'Accommodation is in lodges and camps inside or near the reserves, on full board!',
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

  /* A safari keeps the perks that genuinely apply and drops the ones that only
     make sense on a mountain (owner, Jul 30 2026): no training plan, no
     satellite device, no altitude-sickness guide. The gear list stays but points
     at SAFARI gear, and the store discounts stay because they apply to every
     HighAir traveller. */
  if (exp?.type === 'Safari') {
    return isRtl ? [
      { icon: '🎒', title: 'רשימת ציוד לספארי', desc: '' },
      { icon: '✈️', title: 'סגירת טיסה אטרקטיבית', desc: '' },
      { icon: '🛡️', title: 'סגירת ביטוח אטרקטיבי', desc: '' },
      { icon: '🏪', title: '20% הנחה על ציוד בחנות ״גרביטי״', desc: '' },
      { icon: '🏬', title: '25% הנחה על ציוד ברשת ״פקל חגור״', desc: '' },
      { icon: '📋', title: `מדריך להוצאת ויזה ל${country}`, desc: '' },
      { icon: '🤝', title: 'השתתפות בטיולי הקהילה שלנו', desc: '' },
      { icon: '📞', title: 'ליווי 24/7 משלב ההכנה ולאורך כל הספארי', desc: '' },
    ] : [
      { icon: '🎒', title: 'Safari gear list', desc: '' },
      { icon: '✈️', title: 'Attractive flight booking', desc: '' },
      { icon: '🛡️', title: 'Attractive insurance booking', desc: '' },
      { icon: '🏪', title: '20% discount on gear at Gravity store', desc: '' },
      { icon: '🏬', title: '25% discount on gear at Pakal Hagur chain', desc: '' },
      { icon: '📋', title: `Visa guide for ${country}`, desc: '' },
      { icon: '🤝', title: 'Participate in our community treks', desc: '' },
      { icon: '📞', title: '24/7 support from preparation through the whole safari', desc: '' },
    ];
  }
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
/* A draft record's unfilled fields hold "[למילוי]". Nothing that still holds
   that marker may render, so both price displays and the meta description read
   through here. */
const filled = v => (v && !/\[למילוי\]/.test(String(v)) ? v : null);

/* The safari page's in-page nav. Ids must match the SafariSection ids below. */
const SAFARI_NAV = [
  { id: 'sf-overview',   label: 'מבוא',        labelEn: 'Overview' },
  { id: 'sf-for-me',     label: 'בשבילי?',      labelEn: 'For me?' },
  { id: 'sf-itinerary',  label: 'המסלול',       labelEn: 'Itinerary' },
  { id: 'sf-price',      label: 'מחירים',       labelEn: 'Price' },
  { id: 'sf-inclusions', label: 'מה כלול',      labelEn: 'Inclusions' },
  { id: 'sf-packing',    label: 'מה לארוז',     labelEn: 'Packing' },
  { id: 'sf-visa',       label: 'ויזה ומסמכים', labelEn: 'Visa' },
];

function scrollToForm() {
  const el = document.getElementById('contact-form');
  if (!el) return;
  /* scrollIntoView re-calculates position in real-time during the scroll,
     so lazy-loaded images shifting the layout don't break the target.
     scroll-margin-top on the element handles the fixed header offset. */
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  /* Determine price currency from the priceStr field (€ = EUR, else USD) */
  const expPriceCurrency = exp?.priceStr?.startsWith('€') ? 'EUR' : 'USD';

  const expJsonLd = exp ? [
    tourSchema({
      name:          `${exp.nameHe}${exp.countryHe ? ' · ' + exp.countryHe : ''}`,
      /* Every value guarded: an unfilled draft would otherwise publish
         "[למילוי]" into the search result itself. */
      description:   `${exp.nameHe} ב${exp.countryHe || ''}${[filled(exp.elev), filled(exp.days)].filter(Boolean).length ? ' — ' + [filled(exp.elev), filled(exp.days)].filter(Boolean).join(', ') : ''}. משלחת מלאה הכוללת מדריכים, לינה וציוד, מבית HighAir Expeditions.${filled(exp.priceStr) ? ` החל מ-${exp.priceStr}.` : ''}`,
      image:         exp.img,
      url:           `/expedition/${exp.slug}`,
      country:       exp.countryHe || exp.country,
      durationDays:  typeof exp.days === 'number' ? exp.days : (parseInt(exp.days) || undefined),
      priceFrom:     exp.price || undefined,
      priceCurrency: expPriceCurrency,
      ratingValue:   4.9,
      reviewCount:   exp.reviews?.length || 229,
    }),
    breadcrumbList([
      { name: 'בית',       url: '/' },
      { name: 'משלחות',   url: '/#expeditions' },
      { name: exp.nameHe, url: `/expedition/${exp.slug}` },
    ]),
    faqPage((isRtl ? (exp.faq?.length ? exp.faq : makeDefaultFaq(exp?.groupCapacity || 15)) : (exp.faqEn?.length ? exp.faqEn : makeDefaultFaqEn(exp?.groupCapacity || 15))).slice(0, 8)),
  ] : null;

  usePageMeta(exp ? {
    title:         isRtl
      ? (exp.seoTitle    || `${exp.nameHe} ${exp.countryHe ? '(' + exp.countryHe + ')' : ''} | HighAir Expeditions`)
      : (exp.seoTitleEn  || `${exp.nameEn || exp.name} in ${exp.country} | HighAir Expeditions`),
    description:   isRtl
      ? (exp.seoDescription   || `${exp.nameHe} ב${exp.countryHe || exp.country} - ${exp.elev ? exp.elev + ', ' : ''}${exp.days || ''}. הצטרפו למשלחת מאורגנת עם מדריכים מקצועיים, תרומה למלחמה בסרטן.`)
      : (exp.seoDescriptionEn || `${exp.nameEn || exp.name} expedition in ${exp.country}. ${exp.elev ? exp.elev + ', ' : ''}${exp.days || ''}. Professional guides, 94% summit success rate. Every expedition supports cancer patients.`),
    canonicalPath: `/expedition/${exp.slug}`,
    image:         exp.ogImage ? `https://www.highair-expeditions.com${exp.ogImage}` : exp.img ? `https://www.highair-expeditions.com${exp.img}` : undefined,
    jsonLd:        expJsonLd,
    ogType:        'product',
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
  useEffect(() => { setShowBooking(false); }, [slug]);

  /* ── Scroll depth tracking — 25/50/75/90% per expedition page ── */
  useScrollDepth({ page: 'expedition', label: exp?.slug || slug });

  /* ── Google Ads remarketing — tag expedition page visitors ── */
  useEffect(() => {
    if (!exp) return;
    // Fires on every expedition page view — used to build remarketing audiences
    // in Google Ads: "visited /expedition/ AND NOT converted"
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event:           'view_expedition',
      expedition_slug: exp.slug,
      expedition_name: exp.nameHe,
    });
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'view_expedition', {
        send_to:         'AW-16520015098',
        expedition_slug: exp.slug,
        expedition_name: exp.nameHe,
      });
    }
  }, [exp?.slug]);

  /* ── Probe gallery images — only keep URLs that actually exist, landscape first ── */
  useEffect(() => {
    if (!exp) return;
    setResolvedGallery(null);
    setImgOrientations({});
    const potential = Array.from({ length: 50 }, (_, i) => `/images/gallery/${exp.slug}/${i + 1}.webp`);
    Promise.all(
      potential.map(url => new Promise(resolve => {
        const img = new Image();
        img.onload  = () => resolve({ url, w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => resolve(null);
        img.src = url;
      }))
    ).then(results => {
      const valid = results.filter(Boolean);
      valid.sort((a, b) => (a.w >= a.h ? 0 : 1) - (b.w >= b.h ? 0 : 1));
      setResolvedGallery(valid.map(r => r.url));
    });
  }, [exp?.slug]);

/* ── Itinerary accordion: array of open indices, first open by default ── */
  const [openItinerary, setOpenItinerary] = useState([]);
  const [itineraryTab, setItineraryTab] = useState('safari'); // 'trek' | 'safari'
  const [hoveredItinerary, setHoveredItinerary] = useState(null);
  function toggleItinerary(idx) {
    setOpenItinerary(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  }

  /* ── FAQ accordion ── */

  /* ── Gallery lightbox ── */
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [imgOrientations, setImgOrientations] = useState({});
  const [resolvedGallery, setResolvedGallery] = useState(null); // null = still probing

  /* ── Live groups from Airtable ── */
  const hasAirtable = !!(exp?.airtableEvents?.length);
  const [liveGroups, setLiveGroups]         = useState([]);
  const [groupsLoading, setGroupsLoading]   = useState(hasAirtable);
  const [groupsError, setGroupsError]       = useState(null);
  const [activeYear, setActiveYear]         = useState(null);
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

    /* Step 1: fetch ALL Groups pages for this expedition */
    const fetchAllGroups = async () => {
      const base = `/api/airtable/Groups?fields[]=Event&fields[]=Group%20Name&fields[]=Departure&fields[]=Return&fields[]=Capacity`;
      let allRecords = [];
      let offset = null;
      do {
        const url = offset ? `${base}&offset=${encodeURIComponent(offset)}` : base;
        const data = await fetch(url).then(r => r.json());
        if (data.error) throw new Error(JSON.stringify(data.error));
        allRecords = allRecords.concat(data.records || []);
        offset = data.offset || null;
      } while (offset);
      return allRecords;
    };

    fetchAllGroups()
      .then(async allRecords => {
        const groupsData = { records: allRecords };

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

        /* Step 2: fetch ALL customers with pagination, count by group name client-side */
        const groupNameSet = new Set(groupNames);
        let counts = {};
        let custOffset = null;
        do {
          const custUrl = custOffset
            ? `/api/airtable/Customers?fields[]=Group%20Name&offset=${encodeURIComponent(custOffset)}`
            : `/api/airtable/Customers?fields[]=Group%20Name`;
          const custData = await fetch(custUrl).then(r => r.json());
          (custData.records || []).forEach(rec => {
            const gn = rec.fields['Group Name'] || rec.fields['group name'];
            if (gn && groupNameSet.has(gn)) counts[gn] = (counts[gn] || 0) + 1;
          });
          custOffset = custData.offset || null;
        } while (custOffset);

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
              // Airtable {Capacity} wins per group — the owner opens/closes spots
              // from the base with no deploy (Jul 26 2026: Kili 23/09 showed
              // "full" from the hardcoded 15 while Airtable already allowed 16).
              // mockData's groupCapacity stays as the fallback for groups
              // without the field filled.
              capacity:   Number(rec.fields['Capacity']) || exp?.groupCapacity || 15,
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
          setActiveYear(d.getFullYear());
          setActiveMonth(`${d.getFullYear()}-${d.getMonth()}`);
        }

        // Extract gallery URLs from first relevant group record, sorted landscape-first
        const galleryRec = relevant.find(rec => rec.fields['Gallery_URLs']);
        if (galleryRec) {
          const urls = galleryRec.fields['Gallery_URLs']
            .split('\n').map(u => u.trim()).filter(Boolean);
          if (urls.length) {
            Promise.all(urls.map(url => new Promise(resolve => {
              const probeUrl = url.includes('res.cloudinary.com') && url.includes('/upload/')
                ? url.replace('/upload/', '/upload/w_20,c_limit/')
                : url;
              const img = new Image();
              img.onload  = () => resolve({ url, w: img.naturalWidth, h: img.naturalHeight });
              img.onerror = () => resolve({ url, w: 1, h: 1 });
              img.src = probeUrl;
            }))).then(results => {
              results.sort((a, b) => (a.w >= a.h ? 0 : 1) - (b.w >= b.h ? 0 : 1));
              setGalleryUrls(results.map(r => r.url));
            });
          }
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
  const years = [...new Set(liveGroups.map(g => new Date(g.departure).getFullYear()))].sort();
  const groupsForYear = activeYear ? liveGroups.filter(g => new Date(g.departure).getFullYear() === activeYear) : liveGroups;
  const months = [...new Map(groupsForYear.map(g => [monthKey(g.departure), monthLabel(g.departure)])).entries()];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const allMonths = [...new Map(liveGroups.filter(g => new Date(g.departure) >= today).map(g => [monthKey(g.departure), monthLabel(g.departure)])).entries()];
  const visibleGroups = groupsForYear.filter(g => monthKey(g.departure) === activeMonth);
  /* Any month that has a women's-group departure gets its own "(נשים)" option
     in the form's month picker, so a lead can pick it without clicking the card.
     A month with ONLY a women's departure offers that option ALONE: December
     2026 is Kili_25_12_Women and nothing else, so a plain "דצמבר 2026" was a
     month we do not run (owner, Aug 14 2026). Both lists are by label, and the
     picker below emits an option only for the ones that actually exist. */
  const womenSuffix = isRtl ? ' (נשים)' : ' (Women)';
  const futureGroups = liveGroups.filter(g => new Date(g.departure) >= today);
  const isWomensGroup = g => (g.groupName || '').toLowerCase().includes('women');
  const womenMonths   = [...new Set(futureGroups.filter(isWomensGroup).map(g => monthLabel(g.departure)))];
  const regularMonths = [...new Set(futureGroups.filter(g => !isWomensGroup(g)).map(g => monthLabel(g.departure)))];
  const capacity = exp?.groupCapacity || 15;
  /* noDates = no live Airtable groups → show only "Flexible" in the form */
  const noDates = allMonths.length === 0;
  const [heroBtnHovered, setHeroBtnHovered] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ── Form state ── */
  const [form, setForm] = useState({ name: '', month: '', age: '', groupSize: '1', dial: '+972', phone: '', email: '', experience: '', privacy: false });

  /* Origin travels with the lead — see utils/attribution.js. */
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showBooking, setShowBooking] = useState(true);
  const [isWaitlist,  setIsWaitlist]  = useState(false);
  /* Tags a lead as coming from the women's-group card so the team can tell it
     apart from a regular October lead. Cleared if the month is changed by hand. */
  const [womenGroup,  setWomenGroup]  = useState(false);
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
  /* A safari enquiry asks fewer questions than a climb: no age gate and no
     trekking-experience essay (owner, Jul 30 2026). Name / month / people /
     phone / email / consent is the whole form. */
  const isSafari = exp?.type === 'Safari';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!exp) return;
    if (!form.privacy) return;
    if (!validateEmail(form.email)) return;
    if (!validatePhone(form.phone)) return;
    if (!isSafari && !validateAge(form.age)) return;
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
            'Source': (isWaitlist ? 'Waitlist - ' : 'Expedition Page - ') + exp.nameHe + (womenGroup ? ' · קבוצת נשים (עדי טנא)' : ''),
          },
          calendarId: exp.ghlCalendarId || '',
          expeditionTag: exp.tagHe || exp.name || '',
          ...getAttribution(),
        }),
      });
      if (!res.ok) {
        let msg = `שגיאה ${res.status}`;
        try { const d = await res.json(); msg = d?.error || msg; } catch {}
        throw new Error(msg);
      }
      /* ── Conversion tracking ── */
      Analytics.leadSubmit({ source: (isWaitlist ? 'waitlist' : 'expedition_page'), expedition: exp.nameHe });
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'lead', expedition: exp.nameHe, source: isWaitlist ? 'waitlist' : 'expedition_page' });

      /* Expeditions with a Deposit A link continue straight to checkout instead
         of the consultation calendar. The lead is already saved above, so an
         abandoned checkout still leaves us the record. Status stays 'loading'
         so the button keeps its sending state until the browser navigates. */
      if (exp.paymentUrl && !isWaitlist) {
        window.location.href = exp.paymentUrl;
        return;
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'שגיאה. נסו שוב.');
      setStatus('error');
    }
  }

  /* ── Form abandonment tracking: fires form_start on first focus,
        then form_field_focus once per field, via GTM dataLayer ── */
  const trackedFields = useRef(new Set());
  function trackFieldFocus(field) {
    if (trackedFields.current.has(field)) return;
    trackedFields.current.add(field);
    window.dataLayer = window.dataLayer || [];
    if (trackedFields.current.size === 1) {
      window.dataLayer.push({ event: 'form_start', expedition: exp?.nameHe });
    }
    window.dataLayer.push({ event: 'form_field_focus', field, expedition: exp?.nameHe });
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
  const reviews = exp.reviews?.length ? exp.reviews : (isRtl ? DEFAULT_REVIEWS : DEFAULT_REVIEWS_EN);

  /* Deposit A checkout replaces the consultation call on expeditions
     that have a payment link (see exp.paymentUrl in mockData). */
  const isPayFlow = !!exp?.paymentUrl;

  const notIncludedRaw = isRtl
    ? (exp.notIncluded?.length ? exp.notIncluded : DEFAULT_NOT_INCLUDED)
    : (exp.notIncludedEn?.length ? exp.notIncludedEn : DEFAULT_NOT_INCLUDED_EN);
  const extrasMarker = isRtl ? 'תוספות (לא חובה):' : 'Optional extras:';
  const extrasIdx = notIncludedRaw.indexOf(extrasMarker);
  const notIncluded = extrasIdx === -1 ? notIncludedRaw : notIncludedRaw.slice(0, extrasIdx);
  const extrasItems = extrasIdx === -1 ? [] : notIncludedRaw.slice(extrasIdx + 1);
  const isSafariExp = exp.type === 'Safari';
  const importantToNote = isRtl
    ? (exp.importantToNote?.length ? exp.importantToNote : (isSafariExp ? DEFAULT_IMPORTANT_SAFARI : DEFAULT_IMPORTANT))
    : (exp.importantToNoteEn?.length ? exp.importantToNoteEn : (isSafariExp ? DEFAULT_IMPORTANT_SAFARI_EN : DEFAULT_IMPORTANT_EN));
  const includedItems = isRtl ? (exp.included || []) : (exp.includedEn || exp.included || []);
  const seasons = isRtl ? (exp.seasons || []) : ((exp.seasonsEn || exp.seasons || []).map(s => translateSeason(s, false)));
  const displayDays = isRtl ? exp.days : (exp.daysEn || translateDays(exp.days, false));
  /* A draft record ships a day skeleton whose titles are still "[למילוי] יום N".
     Those must never render, so they are dropped here: if nothing survives, the
     whole itinerary section falls away on its own existing length gate. */
  const itinerary = (isRtl ? (exp.itinerary || []) : (exp.itineraryEn || exp.itinerary || []))
    .filter(d => filled(d.title));
  /* The longer version of the same expedition. Kilimanjaro's is a safari,
     Ethiopia's is five days through the tribes of the south — same mechanism,
     different words, so the labels come from the expedition and fall back to
     the safari wording that was hardcoded here. */
  const safariItinerary = isRtl
    ? (exp.safariItinerary   || exp.extensionItinerary   || [])
    : (exp.safariItineraryEn || exp.extensionItineraryEn || exp.safariItinerary || exp.extensionItinerary || []);

  /* ── Active itinerary based on tab ── */
  const hasSafari = (exp?.safariItinerary?.length > 0) || (exp?.safariItineraryEn?.length > 0)
                 || (exp?.extensionItinerary?.length > 0) || (exp?.extensionItineraryEn?.length > 0);
  const activeItinerary = itineraryTab === 'safari' && hasSafari
    ? [...itinerary.slice(0, -1), ...safariItinerary]
    : itinerary;

  // Use probed results if ready, otherwise fall back to Airtable URLs or empty
  const validGalleryImages = galleryUrls.length > 0
    ? galleryUrls
    : (resolvedGallery ?? []);

  /* ─────────────── RENDER ─────────────────────────────────────── */
  return (
    <div id="main-content" style={{ direction: dir, fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Header />

      {/* ══════════════════════════════════
          SECTION 1: HERO
      ══════════════════════════════════ */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '65dvh' : '100dvh',
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
        ) : (exp.heroVideo || exp.heroImg || exp.img) ? (
          exp.heroVideo ? (
            <video
              key={exp.heroVideo}
              autoPlay muted loop playsInline preload="none"
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
              backgroundImage: `url(${exp.heroImg || exp.img})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
          )
        ) : (
          <video
            key="hero-fallback"
            autoPlay muted loop playsInline preload="none"
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
          /* Clearance under the header, measured rather than guessed: the two
             breakpoints do not carry the same chrome. Desktop also renders the
             Google-rating bar above the header, so the same 160px put the title
             only 36px below it while mobile, with no bar, had a comfortable 60.
             These values give 72px on both. Tuned as a pair — changing one
             without re-measuring the other brings the imbalance back. */
          padding: isMobile ? '152px 6% 120px' : '196px 8% 130px',
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
              {isRtl
                ? exp.nameHe
                : `${exp.nameEn || exp.name || exp.nameHe} in ${exp.country} (${exp.elevNum}m)`
              }
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

          {/* Announced, but the supplier's material has not landed yet. Says so
              plainly instead of letting a visitor wonder why the page is thin —
              every unfilled section is hidden by filled(), so without this the
              page would simply look unfinished. The form below stays live and is
              the whole point of publishing early. */}
          {exp.comingSoon && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              margin: '0 0 18px', padding: '9px 16px', borderRadius: '999px',
              background: 'rgba(217,119,6,0.92)', color: '#fff',
              fontFamily: "'Ploni', sans-serif", fontSize: FS.sm, fontWeight: 700,
              direction: dir, textShadow: 'none',
            }}>
              {isRtl
                ? 'המסלול בהכנה · התוכנית המלאה תפורסם בקרוב'
                : 'Itinerary in preparation · full programme coming soon'}
            </div>
          )}

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
            {isPayFlow
              ? (isRtl ? 'להרשמה ותשלום מקדמה ←' : 'Register & Pay Deposit →')
              : (isRtl ? 'לתיאום שיחה עם מומחה ←' : 'Schedule an Expert Call →')}
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
          {(exp.type === 'Safari'
            /* A safari is not a climb: altitude, difficulty grade and summit
               success rate say nothing about it (owner, Jul 30 2026). This row
               answers what a safari buyer actually asks — how long, which
               reserves, what wildlife, how much. */
            ? [
              { IconComp: ClockIcon, label: isRtl ? 'משך התכנית' : 'Duration',  value: isRtl ? filled(exp.days) : (filled(exp.daysEn) || filled(exp.days)) },
              { IconComp: TreeIcon,  label: isRtl ? 'שמורות טבע' : 'Reserves',  value: filled(exp.reserves) },
              { IconComp: LionIcon,  label: isRtl ? 'חיות בר' : 'Wildlife',     value: filled(isRtl ? exp.wildlife : exp.wildlifeEn) },
              { IconComp: TagIcon,   label: isRtl ? 'עלות' : 'Price',           value: filled(exp.priceStr) ? (isRtl ? `החל מ-${exp.priceStr}` : `From ${exp.priceStr}`) : null },
            ].filter(x => x.value)
            : [
            /* A draft with no altitude yet has elevNum 0, and `${0}m` renders
               "0m" — a wrong fact, not a blank. null hides the row instead. */
            { IconComp: MountainIcon, label: t('expedition.elevation'), value: exp.elevNum ? `${exp.elevNum}m` : null },
            { IconComp: StarIcon,     label: t('expedition.diff'),      value: isRtl ? exp.diffHe : (exp.diff || exp.diffHe) },
            exp.type === 'Trekking'
              ? { IconComp: ClockIcon, label: isRtl ? 'משך התכנית' : 'Duration', value: isRtl ? filled(exp.days) : (filled(exp.daysEn) || filled(exp.days)) }
              : { IconComp: MedalIcon, label: isRtl ? 'אחוזי הצלחה' : 'Success Rate', value: exp.successRate ? `${exp.successRate}%` : '-' },
            { IconComp: TagIcon,      label: isRtl ? 'עלות' : 'Price',  value: filled(exp.priceStr) ? (isRtl ? `החל מ-${exp.priceStr}` : `From ${exp.priceStr}`) : '–' },
          ]).map((s, i) => (
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
      <div id="floating-bar" style={{
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
            {/* Sticky bar mirrors the hero stats: a safari shows duration and
                reserves where a climb shows altitude and grade. */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>{isSafari ? (isRtl ? 'משך התכנית' : 'Duration') : t('expedition.elevation')}</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isSafari
                  ? <><ClockIcon size={14} color="#0A0818" /> {isRtl ? exp.days : (exp.daysEn || exp.days)}</>
                  : (exp.elevNum ? <><MountainIcon size={14} color="#0A0818" /> {exp.elevNum}m</> : null)}
              </span>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: '#6B6B8A', fontFamily: "'Ploni', sans-serif" }}>{isSafari ? (isRtl ? 'שמורות טבע' : 'Reserves') : (isRtl ? 'רמה' : 'Level')}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0818', fontFamily: "'Ploni', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isSafari
                    ? <><TreeIcon size={14} color="#0A0818" /> {exp.reserves || '–'}</>
                    : <><StarIcon size={14} color="#0A0818" /> {isRtl ? exp.diffHe : (exp.diff || exp.diffHe)}</>}
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
            {filled(exp.priceStr) && (
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

      {/* Section tabs sit under the floating bar. They only appear past the
          first section, by which point the bar is guaranteed to be up too. */}
      {isSafari && <SafariSectionNav sections={SAFARI_NAV} isRtl={isRtl} isMobile={isMobile} />}

      {/* ══════════════════════════════════
          CONTENT AREA
      ══════════════════════════════════ */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 5%' : '0' }}>

        {isSafariExp && (
          <SafariSummaryCard exp={exp} isRtl={isRtl} isMobile={isMobile} onEnquire={scrollToForm} />
        )}

        {/* The section tabs come up when this marker leaves the top of the view. */}
        {isSafariExp && <div id={NAV_SENTINEL_ID} style={{ height: '1px' }} />}

        {/* ── A. מבוא ──────────────────────────── */}
        <section id={isSafariExp ? 'sf-overview' : undefined} style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
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
                /* filled(): a draft's desc holds the [למילוי] marker, which must
                   never reach the page. Empty renders no intro at all. */
                const descText = isRtl ? (filled(exp.desc) || '') : (filled(exp.descEn) || filled(exp.desc) || '');
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
              {(exp.introImg || exp.img) ? (
                <img
                  src={exp.introImg || exp.img}
                  alt={exp.nameHe}
                  fetchpriority="high"
                  decoding="async"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', borderRadius: RADIUS.xl, display: 'block' }}
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: exp.grad, borderRadius: RADIUS.xl }} />
              )}
            </div>
          </div>
        </section>

        <Separator />

        {isSafariExp && (
          <SafariSection id="sf-for-me" isMobile={isMobile}
            title={isRtl ? 'האם המסע הזה בשבילי?' : 'Is this trip for me?'}
            sub={isRtl
              ? 'הספארי שלנו הוא פרטי, ולכן כמעט כל דבר בו נקבע לפי מי שנוסע.'
              : 'Our safaris are private, so almost everything about them is set by who is travelling.'}>
            <SafariForMe exp={exp} isRtl={isRtl} isMobile={isMobile} />
          </SafariSection>
        )}

        {/* ── B. מה כלול ומה לא כלול ─────────────
             Safari gets its own version further down, built on real content
             rather than this record's empty included/notIncluded arrays. */}
        {!isSafariExp && (
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

            {/* לא כלול + תוספות - right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                  const isFootnote = item.trimStart().startsWith('*');
                  if (isFootnote) {
                    return (
                      <div key={i} style={{ marginTop: '14px', paddingInlineStart: '34px' }}>
                        <span style={{
                          fontFamily: "'Ploni', sans-serif", fontSize: '13px',
                          color: '#9591B0', lineHeight: 1.6, fontStyle: 'italic',
                        }}>
                          {item}
                        </span>
                      </div>
                    );
                  }
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

              {/* תוספות אופציונליות - purple card */}
              {extrasItems.length > 0 && (
                <div style={{
                  background: '#F5F2FF',
                  borderRadius: RADIUS.xl,
                  padding: '28px',
                  border: '1px solid #DDD6FE',
                }}>
                  <div style={{
                    fontFamily: "'Ploni', sans-serif", fontSize: '18px',
                    fontWeight: 700, color: '#6D28D9', marginBottom: '20px',
                  }}>
                    {isRtl ? 'תוספות אופציונליות' : 'Optional Extras'}
                  </div>
                  {extrasItems.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '12px', alignItems: 'flex-start',
                      marginBottom: i < extrasItems.length - 1 ? '14px' : 0,
                    }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: '#7C3AED', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginTop: '1px',
                      }}>
                        <span style={{ color: 'white', fontSize: '11px', fontWeight: 700, lineHeight: 1, display: 'flex' }}>+</span>
                      </div>
                      <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#3D3B5A', lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* ── C. תכנית הטיפוס (Itinerary Accordion) ── */}
        {itinerary && itinerary.length > 0 && (
          <>
            <Separator />
            <section id={isSafariExp ? 'sf-itinerary' : undefined} style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
                <h2 style={{
                  fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
                  fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: 0,
                }}>
                  {isRtl ? `תכנית ה${exp.typeHe}` : t('expedition.itinerary')}
                </h2>
                {/* Route spec stated once, rather than repeated per day. */}
                {(isRtl ? exp.itineraryNote : (exp.itineraryNoteEn || exp.itineraryNote)) && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '7px 16px', borderRadius: RADIUS.full,
                    background: '#F5F2FF', border: '1px solid #DDD6FE',
                    direction: dir,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4" />
                    </svg>
                    <span style={{
                      fontFamily: "'Ploni', sans-serif", fontSize: '13.5px',
                      fontWeight: 600, color: '#4C1D95',
                    }}>
                      {isRtl ? exp.itineraryNote : (exp.itineraryNoteEn || exp.itineraryNote)}
                    </span>
                  </div>
                )}
                {hasSafari && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'safari', label: isRtl
                          ? `${exp.extensionLabelHe || 'טיפוס + ספארי'} (${(itinerary.length - 1) + (safariItinerary?.length || 0)} ימים)`
                          : `${exp.extensionLabelEn || 'Climbing + Safari'} (${(itinerary.length - 1) + (safariItinerary?.length || 0)} days)` },
                      { key: 'trek',   label: isRtl
                          ? `${exp.extensionBaseLabelHe || 'טיפוס בלבד'} (${itinerary.length} ימים)`
                          : `${exp.extensionBaseLabelEn || 'Climbing only'} (${itinerary.length} days)` },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        className="accordion-row"
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
              {/* The map first, then the days: readers want to see where they go
                  before they read what happens each day. */}
              {isSafariExp && (
                <div style={{ marginBottom: '24px' }}>
                  <SafariRouteMap exp={exp} isRtl={isRtl} isMobile={isMobile} />
                </div>
              )}
              <div style={{ border: '1px solid #ECEAF8', borderRadius: RADIUS.xl, overflow: 'hidden' }}>
                {activeItinerary.map((item, idx) => {
                  const isOpen = openItinerary.includes(idx);
                  const isLast = idx === activeItinerary.length - 1;
                  const isSafariDay = hasSafari && itineraryTab === 'safari' && idx >= (exp.itinerary.length - 1);
                  const hasContent = !!(item.desc || item.distance || item.duration || item.elevationGain || item.elevationLoss || item.accommodation || item.travelTime || item.meals);
                  return (
                    <div key={idx} style={{ borderBottom: isLast ? 'none' : '1px solid #ECEAF8' }}>
                      <button
                        className="accordion-row"
                        onClick={() => hasContent && toggleItinerary(idx)}
                        aria-expanded={isOpen}
                        aria-controls={`itinerary-panel-${idx}`}
                        onMouseEnter={() => hasContent && setHoveredItinerary(idx)}
                        onMouseLeave={() => setHoveredItinerary(null)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '16px',
                          padding: '16px 20px', cursor: hasContent ? 'pointer' : 'default',
                          background: (isOpen || hoveredItinerary === idx) ? '#FAFAFE' : 'white',
                          transition: `background 150ms ${EASING.smooth}`, direction: dir,
                          width: '100%', border: 'none', textAlign: 'start',
                        }}
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
                        {hasContent && (
                          <span style={{ fontSize: '14px', color: '#6B6B8A', flexShrink: 0 }}>
                            {isOpen ? '▴' : '▾'}
                          </span>
                        )}
                      </button>
                      <div id={`itinerary-panel-${idx}`} style={{ maxHeight: isOpen ? '900px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
                        <p style={{
                          padding: '0 20px 16px', margin: 0,
                          fontFamily: "'Ploni', sans-serif", fontSize: '15px',
                          color: '#6B6B8A', lineHeight: 1.8, direction: dir,
                        }}>
                          {item.desc}
                        </p>
                        {(item.travelTime || item.distance || item.duration || item.accommodation || item.meals || item.elevationGain || item.elevationLoss || item.elevationStart || item.elevationMax || item.elevationEnd) && (() => {
                          const bdg = (bg, color, iconPath, text, numericLtr) => (
                            <span key={text} style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '6px 14px', borderRadius: '24px', background: bg,
                              fontFamily: "'Ploni', sans-serif", fontSize: '13px',
                              fontWeight: 700, color,
                            }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{iconPath}</svg>
                              {numericLtr
                                ? <span style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>{text}</span>
                                : text}
                            </span>
                          );
                          const ICONS = {
                            bus:      <><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
                            ruler:    <><path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/></>,
                            clock:    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
                            arrowUp:  <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
                            arrowDn:  <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
                            mountain: <><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></>,
                            home:     <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
                            dining:   <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6h3M19 22v-7"/></>,
                          };
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 20px 20px' }}>
                              {/* Row 1: travel time / distance / duration */}
                              {(item.travelTime || item.distance || item.duration) && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', direction: dir }}>
                                  {item.travelTime && bdg('#EDE9FE','#4C1D95', ICONS.bus,   item.travelTime)}
                                  {item.distance   && bdg('#EDE9FE','#4C1D95', ICONS.ruler, item.distance)}
                                  {item.duration   && bdg('#EDE9FE','#4C1D95', ICONS.clock, item.duration)}
                                </div>
                              )}
                              {/* Row 2: elevation gain / loss */}
                              {(item.elevationGain || item.elevationLoss) && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', direction: dir }}>
                                  {item.elevationGain && bdg('#DCFCE7','#166534', ICONS.arrowUp, item.elevationGain)}
                                  {item.elevationLoss && bdg('#FEE2E2','#991B1B', ICONS.arrowDn, item.elevationLoss)}
                                </div>
                              )}
                              {/* Row 3: where you sleep, and what you eat that day */}
                              {(item.accommodation || item.meals) && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', direction: dir }}>
                                  {item.accommodation && bdg('#FFF7ED','#C2410C', ICONS.home,   item.accommodation)}
                                  {item.meals         && bdg('#F0F7E4','#4D6B1F', ICONS.dining, item.meals)}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {isSafariExp && (
          <>
            <SafariSection id="sf-price" isMobile={isMobile}
              title={isRtl ? 'עונות ומחירים' : 'Seasons and pricing'}
              sub={isRtl
                ? 'המחיר לאדם נקבע לפי מספר הנוסעים בג׳יפ ולפי העונה. כך זה נראה.'
                : 'The per-person price is set by how many share the jeep, and by the season.'}>
              <SafariPricing exp={exp} isRtl={isRtl} isMobile={isMobile} />
            </SafariSection>

            <SafariSection id="sf-inclusions" isMobile={isMobile}
              title={isRtl ? 'מה כלול במסע' : 'What the trip includes'}>
              <SafariInclusions isRtl={isRtl} isMobile={isMobile} />
            </SafariSection>

            <SafariSection id="sf-packing" isMobile={isMobile}
              title={isRtl ? 'מה לארוז לספארי' : 'What to pack for a safari'}
              sub={isRtl
                ? 'רשימה קצרה ומעשית. לספארי אורזים אחרת מטיפוס, ושני הדברים שמשנים הכי הרבה הם צבע הבגדים ומשקפת טובה.'
                : 'A short, practical list. Packing for a safari differs from packing for a climb, and the two things that matter most are the colour of your clothes and a good pair of binoculars.'}>
              <SafariPacking isRtl={isRtl} isMobile={isMobile} />
            </SafariSection>

            <SafariSection id="sf-visa" isMobile={isMobile}
              title={isRtl ? 'ויזה ומסמכים' : 'Visa and documents'}>
              <SafariVisa isRtl={isRtl} isMobile={isMobile} />
            </SafariSection>
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
                {importantToNote.map((note, i) => {
                  /* A safari is sold by JEEP, not by group size: the vehicle holds
                     6 (owner, Jul 30 2026), so the climb wording "a group of up
                     to N participants" is simply the wrong unit here. */
                  const text = i === 0 && capacity
                    ? (isSafariExp
                        ? (isRtl
                            ? `הספארי מתבצע בג׳יפ עד ${capacity} מקומות בלבד!`
                            : `The safari runs in a jeep with up to ${capacity} seats only!`)
                        : (isRtl
                            ? `ה${exp.typeHe || 'טיפוס'} מתבצע בקבוצה עד ${capacity} משתתפים בלבד!`
                            : `The ${exp.type?.toLowerCase() || 'expedition'} runs in groups of up to ${capacity} participants only!`))
                    : note;
                  return (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < importantToNote.length - 1 ? '12px' : 0 }}>
                      <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '16px', marginTop: '2px', flexShrink: 0 }}>•</span>
                      <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#92400E', lineHeight: 1.6 }}>{text}</span>
                    </div>
                  );
                })}
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
              {/* Year filter — segmented control */}
              {(years.length > 1 || years[0] !== new Date().getFullYear()) && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'inline-flex',
                    background: '#ECEAF8',
                    borderRadius: RADIUS.full,
                    padding: '4px',
                    gap: '2px',
                  }}>
                    {years.map(yr => (
                      <button
                        key={yr}
                        onClick={() => {
                          setActiveYear(yr);
                          const firstOfYear = liveGroups.find(g => new Date(g.departure).getFullYear() === yr);
                          if (firstOfYear) {
                            const d = new Date(firstOfYear.departure);
                            setActiveMonth(`${d.getFullYear()}-${d.getMonth()}`);
                          }
                        }}
                        style={{
                          padding: '8px 28px',
                          borderRadius: RADIUS.full,
                          border: 'none',
                          background: activeYear === yr ? '#1E1B3A' : 'transparent',
                          color: activeYear === yr ? 'white' : '#5B5880',
                          fontFamily: "'Ploni', sans-serif",
                          fontSize: '15px', fontWeight: 700,
                          cursor: 'pointer',
                          transition: `background 0.2s ${EASING.smooth}, color 0.2s ${EASING.smooth}`,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Month tabs — horizontal scroll, no wrapping */}
              {groupsForYear.length > 2 && (
                <div style={{
                  display: 'flex', gap: '8px',
                  overflowX: 'auto', flexWrap: 'nowrap',
                  marginBottom: '24px', paddingBottom: '4px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}>
                  {months.map(([key, label]) => {
                    const shortLabel = new Date(key.split('-')[0], key.split('-')[1]).toLocaleDateString(isRtl ? 'he-IL' : 'en-US', { month: 'long' });
                    const count = groupsForYear.filter(g => monthKey(g.departure) === key).length;
                    const isActive = activeMonth === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveMonth(key)}
                        style={{
                          flexShrink: 0,
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '8px 20px',
                          borderRadius: RADIUS.full,
                          border: `1.5px solid ${isActive ? COLOR.primary : '#ECEAF8'}`,
                          background: isActive ? COLOR.primary : '#fff',
                          color: isActive ? 'white' : '#3D3B5A',
                          fontFamily: "'Ploni', sans-serif",
                          fontSize: '14px', fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: `all 0.2s ${EASING.smooth}`,
                        }}
                      >
                        {shortLabel}
                        <span style={{
                          fontSize: '11px', fontWeight: 700,
                          background: isActive ? 'rgba(255,255,255,0.25)' : '#ECEAF8',
                          color: isActive ? 'white' : '#6B6B8A',
                          borderRadius: '999px',
                          padding: '1px 6px',
                          lineHeight: 1.6,
                        }}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Group cards */}
              {(() => {
                const displayGroups = groupsForYear.length > 2 ? visibleGroups : groupsForYear;
                const isKili = exp.slug?.includes('kilimanjaro');

                const renderCard = (g) => {
                  // Per-group Airtable {Capacity} first (owner opens spots with no
                  // deploy); mockData's per-expedition number is the fallback.
                  const groupCap        = g.capacity || exp?.groupCapacity || 15;
                  const spotsLeft       = groupCap - g.count;
                  const depYM           = (() => { const d = new Date(g.departure); return `${d.getUTCFullYear()}-${d.getUTCMonth()}`; })();
                  const isManualSoldOut = (exp?.soldOutGroups || []).some(m => {
                    const sd = new Date(m);
                    return `${sd.getUTCFullYear()}-${sd.getUTCMonth()}` === depYM;
                  });
                  const isFull = spotsLeft <= 0 || isManualSoldOut;
                  const isLow  = !isFull && spotsLeft <= 6;
                  /* Women's expedition — flagged by a "Women" marker in the Airtable
                     Group Name; gets a distinct pink border. */
                  const isWomen = (g.groupName || '').toLowerCase().includes('women');
                  const spotsBadge = (isWomen && !isFull)
                    ? { bg: '#FBCFE8', color: '#9D174D', text: isRtl ? 'קבוצת נשים · עדי טנא' : "Women's group · Adi Tana", women: true }
                    : isFull
                    ? { bg: '#FEE2E2', color: '#991B1B', text: isRtl ? 'קבוצה מלאה' : 'Group Full' }
                    : isLow
                    ? { bg: '#FEF3C7', color: '#92400E', text: isRtl ? (spotsLeft === 1 ? 'נשאר מקום אחרון!' : `נשארו ${spotsLeft} מקומות`) : (spotsLeft === 1 ? 'Last spot left!' : `${spotsLeft} spots left`) }
                    : { bg: '#D1FAE5', color: '#065F46', text: isRtl ? 'הרשמה פתוחה' : 'Open' };
                  return (
                    <div key={g.id} style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      alignItems: 'center',
                      border: isWomen
                        ? '1.5px solid #F472B6'
                        : `1px solid ${isFull ? '#FECACA' : isLow ? '#FDE68A' : '#ECEAF8'}`,
                      borderRadius: RADIUS.lg,
                      padding: isMobile ? '14px 16px' : '12px 20px',
                      background: isWomen ? '#FCE7F3' : (isFull ? '#FAFAFA' : '#fff'),
                      direction: dir,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: `box-shadow 0.2s, border-color 0.2s`,
                    }}
                    onMouseEnter={e => { if (!isFull) e.currentTarget.style.boxShadow = '0 4px 20px rgba(109,40,217,0.10)'; }}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
                    >
                      {/* Date */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarIcon size={isMobile ? 16 : 18} color={isFull ? '#9CA3AF' : COLOR.primary} />
                        <span style={{
                          fontFamily: "'Ploni', sans-serif",
                          fontSize: isMobile ? '15px' : '17px',
                          fontWeight: 800, color: isFull ? '#9CA3AF' : '#0A0818',
                          lineHeight: 1.1, direction: 'ltr', whiteSpace: 'nowrap',
                        }}>
                          {formatDateRange(g.departure, g.returnDate)}
                        </span>
                      </div>
                      {/* Badge — fixed center cell */}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <span style={{
                          background: spotsBadge.bg, color: spotsBadge.color,
                          fontFamily: "'Ploni', sans-serif",
                          fontSize: '11px', fontWeight: 700,
                          padding: spotsBadge.women ? '4px 12px' : '3px 10px',
                          borderRadius: spotsBadge.women ? '12px' : '999px',
                          letterSpacing: '0.01em',
                          whiteSpace: spotsBadge.women ? 'normal' : 'nowrap',
                          lineHeight: spotsBadge.women ? 1.25 : 'normal',
                          minWidth: '110px', textAlign: 'center',
                        }}>
                          {spotsBadge.text}
                        </span>
                      </div>
                      {/* Button — open groups register, full groups join the waitlist;
                          both pre-fill the month in the form */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => {
                            setIsWaitlist(isFull);
                            setWomenGroup(isWomen);
                            setForm(f => ({ ...f, month: monthLabel(g.departure) + (isWomen ? womenSuffix : '') }));
                            scrollToForm();
                          }}
                          style={{
                            background: isFull ? '#fff' : COLOR.primary,
                            color: isFull ? COLOR.primary : 'white',
                            border: isFull ? `1.5px solid ${COLOR.primary}` : 'none',
                            borderRadius: RADIUS.full,
                            padding: isMobile ? '10px 14px' : '12px 22px',
                            fontFamily: "'Ploni', sans-serif",
                            fontSize: isFull ? '13px' : '14px', fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap', transition: 'background 0.2s',
                          }}
                        >
                          {isFull ? (isRtl ? 'לרשימת המתנה' : 'Join Waitlist') : t('expedition.registerBtn')}
                        </button>
                      </div>
                    </div>
                  );
                };

                if (!isKili) {
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
                      {displayGroups.map(renderCard)}
                    </div>
                  );
                }

                const climbGroups  = displayGroups.filter(g => !g.eventName.toLowerCase().includes('safari'));
                const safariGroups = displayGroups.filter(g =>  g.eventName.toLowerCase().includes('safari'));

                const sectionHeader = (label, accent) => (
                  <div style={{ marginBottom: '10px', direction: dir }}>
                    <span style={{
                      display: 'inline-block',
                      fontFamily: "'Ploni', sans-serif",
                      fontSize: '13px', fontWeight: 700,
                      color: accent.text,
                      background: accent.bg,
                      border: `1.5px solid ${accent.border}`,
                      borderRadius: RADIUS.lg,
                      padding: '10px 16px',
                    }}>
                      {label}
                    </span>
                  </div>
                );

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {climbGroups.length > 0 && (
                      <div>
                        {sectionHeader(
                          isRtl ? 'טיפוס בלבד' : 'Climb Only',
                          { bg: '#EDE9FE', border: '#C4B5FD', text: '#5B21B6' }
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
                          {climbGroups.map(renderCard)}
                        </div>
                      </div>
                    )}
                    {safariGroups.length > 0 && (
                      <div>
                        {sectionHeader(
                          isRtl ? 'טיפוס + 3 ימי ספארי' : 'Climb + 3-Day Safari',
                          { bg: '#FEF3C7', border: '#FCD34D', text: '#78350F' }
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
                          {safariGroups.map(renderCard)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
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

        {(exp?.slug?.includes('kilimanjaro') || isSafariExp) && (
          <>
            <Separator />
            {isSafariExp && (
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14.5px', fontWeight: 300,
                color: '#6B6B8A', margin: '0 0 4px', textAlign: 'start', direction: dir, lineHeight: 1.6 }}>
                {isRtl
                  ? 'המשתתפים שמדברים כאן יצאו איתנו לקילימנג׳רו. הספארי בטנזניה מופעל על ידי אותו צוות ואותם שותפים בשטח.'
                  : 'The travellers speaking here climbed Kilimanjaro with us. The Tanzania safari is run by the same team and the same partners on the ground.'}
              </p>
            )}
            <VideoTestimonials darkBg={false} />
          </>
        )}

        {/* A trek with no photos yet rendered the heading over 223px of nothing,
            which reads as a broken page rather than as a page still filling up.
            Every other optional section on this page is already gated the same
            way. Surfaced by the Scardus launch, but it would have hit any new
            expedition added before its gallery exists. */}
        {validGalleryImages.length > 0 && (
        <>
        <Separator />

        {/* ── H. תמונות מהטיפוס ──────────────────── */}
        <section style={{ padding: isMobile ? '48px 0' : '72px 0' }}>
          <h2 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 32px', direction: dir,
          }}>
            {isRtl ? `תמונות מה${exp.typeHe}` : t('expedition.gallery')}
          </h2>

          {/* ── Mobile: snap carousel / Desktop: masonry ── */}
          {isMobile ? (
            <div style={{ margin: '0 -5%' }}>
              <MobilePhotoCarousel
                images={validGalleryImages}
                altPrefix={isRtl ? exp.nameHe : (exp.nameEn || exp.nameHe)}
                onImageClick={i => setLightboxIdx(i)}
                hint={isRtl ? 'לחץ להגדלה' : 'Tap to zoom'}
                isRtl={isRtl}
              />
            </div>
          ) : (
            /* ── Desktop: masonry columns ── */
            <div style={{ columnCount: 3, columnGap: '10px' }}>
              {validGalleryImages.map((src, i) => {
                const orient = imgOrientations[i];
                const ratio = orient === 'portrait' ? '3/4' : '4/3';
                return (
                  <div
                    key={src}
                    onClick={() => setLightboxIdx(i)}
                    style={{
                      breakInside: 'avoid',
                      marginBottom: '10px',
                      borderRadius: RADIUS.lg,
                      overflow: 'hidden',
                      cursor: 'zoom-in',
                      position: 'relative',
                      aspectRatio: ratio,
                    }}
                    onMouseEnter={e => e.currentTarget.querySelector('div')?.style && (e.currentTarget.querySelector('div').style.opacity = '1')}
                    onMouseLeave={e => e.currentTarget.querySelector('div')?.style && (e.currentTarget.querySelector('div').style.opacity = '0')}
                  >
                    <img
                      src={src}
                      alt={`${isRtl ? exp.nameHe : (exp.nameEn || exp.nameHe)} ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center',
                        display: 'block', transition: 'transform 0.3s ease',
                      }}
                      onLoad={e => {
                        const { naturalWidth: w, naturalHeight: h } = e.target;
                        setImgOrientations(prev => ({ ...prev, [i]: w >= h ? 'landscape' : 'portrait' }));
                      }}
                      onError={e => { e.currentTarget.parentElement.style.display = 'none'; }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0.15)',
                      opacity: 0, transition: 'opacity 0.2s ease',
                      pointerEvents: 'none',
                    }} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Lightbox */}
          {lightboxIdx !== null && (() => {
            const hasPrev = lightboxIdx > 0;
            const hasNext = lightboxIdx < validGalleryImages.length - 1;
            const btnStyle = {
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
              width: '48px', height: '48px', fontSize: '26px', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute',
            };
            // In RTL: left = next, right = prev (reading direction flipped)
            const leftAction  = isRtl ? () => setLightboxIdx(i => i + 1) : () => setLightboxIdx(i => i - 1);
            const rightAction = isRtl ? () => setLightboxIdx(i => i - 1) : () => setLightboxIdx(i => i + 1);
            const leftArrow   = isRtl ? '›' : '‹';
            const rightArrow  = isRtl ? '‹' : '›';
            const showLeft    = isRtl ? hasNext : hasPrev;
            const showRight   = isRtl ? hasPrev : hasNext;
            return (
              <div
                onClick={() => setLightboxIdx(null)}
                style={{
                  position: 'fixed', inset: 0, zIndex: 9999,
                  background: 'rgba(0,0,0,0.92)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '20px',
                }}
              >
                {showLeft && (
                  <button onClick={e => { e.stopPropagation(); leftAction(); }}
                    style={{ ...btnStyle, left: isMobile ? '8px' : '24px' }}>
                    {leftArrow}
                  </button>
                )}
                <img
                  src={validGalleryImages[lightboxIdx]}
                  alt={`${isRtl ? exp.nameHe : (exp.nameEn || exp.nameHe)} - ${isRtl ? 'תמונה' : 'photo'} ${lightboxIdx + 1}`}
                  onClick={e => e.stopPropagation()}
                  style={{
                    maxWidth: '100%', maxHeight: '90vh',
                    borderRadius: RADIUS.xl,
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                    objectFit: 'contain',
                  }}
                />
                {showRight && (
                  <button onClick={e => { e.stopPropagation(); rightAction(); }}
                    style={{ ...btnStyle, right: isMobile ? '8px' : '24px' }}>
                    {rightArrow}
                  </button>
                )}
                {/* Close */}
                <button onClick={() => setLightboxIdx(null)} style={{
                  ...btnStyle, width: '40px', height: '40px', fontSize: '18px',
                  top: '16px', right: '16px',
                }}>✕</button>
                {/* Counter — always LTR so numbers don't flip */}
                <div style={{
                  position: 'absolute', bottom: '20px', direction: 'ltr',
                  background: 'rgba(255,255,255,0.15)', borderRadius: '20px',
                  padding: '6px 16px', color: '#fff', fontSize: '14px',
                  fontFamily: "'Ploni', sans-serif",
                }}>
                  {lightboxIdx + 1} / {validGalleryImages.length}
                </div>
              </div>
            );
          })()}
        </section>
        </>
        )}

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
                scrollSnapType: isMobile ? 'x mandatory' : 'none',
                WebkitOverflowScrolling: 'touch',
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
                    scrollSnapAlign: isMobile ? 'start' : 'none',
                    transition: 'box-shadow 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(109,40,217,0.18)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'none';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                  }}>
                    {/* Photo */}
                    <img
                      src={u.img}
                      alt={u.name}
                      loading="lazy"
                      decoding="async"
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />

                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
                    }} />

                    {/* Summit verified badge */}
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px',
                      width: '20px', height: '20px',
                      filter: 'drop-shadow(0 2px 8px rgba(29,155,240,0.6))',
                    }}>
                      <svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#1D9BF0" d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.441c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.438 1.69-.882.445-.47.749-1.055.878-1.688.13-.633.08-1.29-.144-1.896.587-.274 1.087-.705 1.443-1.245.356-.54.555-1.17.574-1.817z"/>
                        <path fill="white" d="M9.662 14.338 6.29 10.966l.943-.944 2.43 2.43 4.58-4.58.943.944z"/>
                      </svg>
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
          background:      'linear-gradient(135deg, #1e1b4b, #2d1b69)',
          padding:         isMobile ? '48px 5%' : '72px 5%',
          direction:       dir,
          scrollMarginTop: '96px',
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
          <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '16px', color: 'rgba(255,255,255,0.7)', margin: isPayFlow ? '0 0 16px' : '0 0 40px' }}>
            {isPayFlow
              ? (isRtl ? 'השאירו פרטים והמשיכו לתשלום מקדמה שלב א׳' : 'Leave your details and continue to the Deposit A payment')
              : (isRtl ? 'השאירו פרטים לשיחת בדיקת התאמה ללא התחייבות' : 'Leave your details for a no-commitment consultation call')}
          </p>

          {/* Payment policy — shown at the decision point so the split between
              the deposit now and the balance on arrival is clear before checkout. */}
          {isPayFlow && (isRtl ? exp.paymentNote : (exp.paymentNoteEn || exp.paymentNote)) && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              margin: '0 0 32px', padding: '8px 18px',
              borderRadius: RADIUS.full,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              direction: dir,
            }}>
              <span style={{
                fontFamily: "'Ploni', sans-serif", fontSize: '14px',
                fontWeight: 600, color: 'rgba(255,255,255,0.92)',
              }}>
                {isRtl ? exp.paymentNote : (exp.paymentNoteEn || exp.paymentNote)}
              </span>
            </div>
          )}

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
                  expeditionSlug={exp?.slug}
                  expeditionValue={exp?.price}
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
                      onFocus={() => trackFieldFocus('name')}
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
                    {noDates ? (
                      <select
                        required value={form.month}
                        onFocus={() => trackFieldFocus('month')}
                        onChange={e => { setWomenGroup(false); setForm(f => ({ ...f, month: e.target.value })); }}
                        style={{ ...inputStyle, color: form.month ? '#3D3B5A' : '#9591B0' }}
                        onMouseEnter={e => { e.target.style.borderColor = COLOR.primary; }}
                        onMouseLeave={e => { e.target.style.borderColor = '#E5E3F0'; }}
                      >
                        <option value="">{isRtl ? 'בחרו חודש' : 'Select month'}</option>
                        <option value="גמיש / טרם החלטתי">{isRtl ? 'גמיש / טרם החלטתי' : 'Flexible / Not decided yet'}</option>
                      </select>
                    ) : (
                      <select
                        required value={form.month}
                        onFocus={() => trackFieldFocus('month')}
                        onChange={e => { setWomenGroup(e.target.value.includes(womenSuffix.trim())); setForm(f => ({ ...f, month: e.target.value })); }}
                        style={{ ...inputStyle, color: form.month ? '#3D3B5A' : '#9591B0' }}
                        onMouseEnter={e => { e.target.style.borderColor = COLOR.primary; }}
                        onMouseLeave={e => { e.target.style.borderColor = '#E5E3F0'; }}
                      >
                        <option value="">{isRtl ? 'בחרו חודש' : 'Select month'}</option>
                        {allMonths.length > 0
                          ? allMonths.flatMap(([key, label]) => [
                              /* The plain option only when a NON-women's group
                                 departs that month, so a women-only month is
                                 offered as "(נשים)" and nothing else. */
                              ...(regularMonths.includes(label)
                                ? [<option key={key} value={label}>{label}</option>]
                                : []),
                              ...(womenMonths.includes(label)
                                ? [<option key={`w-${key}`} value={`${label}${womenSuffix}`}>{`${label}${womenSuffix}`}</option>]
                                : []),
                            ])
                          : (exp.dates || []).map((d, i) => (
                              <option key={i} value={d}>{d}</option>
                            ))
                        }
                        <option value="גמיש / טרם החלטתי">{isRtl ? 'גמיש / טרם החלטתי' : 'Flexible / Not decided yet'}</option>
                      </select>
                    )}
                  </div>

                  {/* גיל + כמות אנשים — a safari asks only for the number of people */}
                  <div style={{ display: 'grid', gridTemplateColumns: (isNarrow || isSafari) ? '1fr' : '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: isSafari ? 'none' : undefined }}>
                      <label style={labelStyle}>{isRtl ? 'גיל *' : 'Age *'}</label>
                      <input
                        type="number" required={!isSafari} min="16" max="99"
                        placeholder="25"
                        value={form.age}
                        onFocus={() => trackFieldFocus('age')}
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
                        onFocus={() => trackFieldFocus('group_size')}
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
                  <div onFocusCapture={() => trackFieldFocus('phone')}>
                    <PhoneField
                      label={isRtl ? 'מספר טלפון *' : 'Phone Number *'}
                      dial={form.dial}
                      onDialChange={v => setForm(f => ({ ...f, dial: v }))}
                      local={form.phone}
                      onLocalChange={v => { setForm(f => ({ ...f, phone: v })); if (phoneError) validatePhone(v); }}
                      error={!!phoneError}
                      errorMsg={phoneError}
                    />
                  </div>

                  {/* מייל */}
                  <div>
                    <label style={labelStyle}>{isRtl ? 'מייל *' : 'Email *'}</label>
                    <input
                      type="text" required
                      placeholder="example@walla.com"
                      value={form.email}
                      onFocus={() => trackFieldFocus('email')}
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

                  {/* ניסיון — not asked on a safari */}
                  <div style={{ display: isSafari ? 'none' : undefined }}>
                    <label style={labelStyle}>{isRtl ? 'מה הניסיון שלכם בטרקים? *' : 'What is your trekking experience? *'}</label>
                    <textarea
                      rows={3} required={!isSafari} value={form.experience}
                      onFocus={() => trackFieldFocus('experience')}
                      onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder={isRtl ? 'ספרו לנו על הניסיון שלכם בטרקים' : 'Tell us about your trekking experience'}
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
                    {status === 'loading'
                      ? (isPayFlow ? (isRtl ? 'מעביר לתשלום...' : 'Continuing to payment...') : (isRtl ? 'שולח...' : 'Sending...'))
                      : isPayFlow
                        ? (isRtl ? 'להרשמה ותשלום מקדמה ←' : 'Register & Pay Deposit →')
                        : (isRtl ? 'לתיאום שיחה עם מומחה ←' : 'Schedule a Call with an Expert →')}
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
