import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/* ── Detect language from subdomain or localStorage ── */
function detectLang() {
  const hostname = window.location.hostname;
  if (hostname.startsWith('en.')) return 'en';
  const stored = localStorage.getItem('HA_lang');
  if (stored === 'en' || stored === 'he') return stored;
  return 'he';
}

const he = {
  nav: {
    home: 'דף בית',
    expeditions: 'טרקים וטיפוסים',
    treks: 'טרקים בעולם',
    climbs: 'טיפוסי הרים בעולם',
    israelTrips: 'טרקים בארץ',
    annualPlan: 'תכנית שנתית',
    about: 'הסיפור שלנו',
    blog: 'בלוג',
    contact: 'צור קשר',
    contactUs: 'צור קשר',
    skipToContent: 'דלג לתוכן',
  },
  hero: {
    subtitle: 'ארגון טרקים ומשלחות טיפוס הרים בארץ ובעולם',
    cancer: 'בשילוב תרומה לחולי סרטן בכל מסע!',
    allExpeditions: 'לכל המשלחות',
    ourStory: 'הסיפור שלנו',
  },
  stats: {
    successRate: 'אחוזי הצלחה',
    donated: 'נתרמו לחולי סרטן',
    climbers: 'מטיילים שכבשו פסגות',
    destinations: 'יעדים ברחבי העולם',
  },
  explorer: {
    heading: 'הטרקים והטיפוסים שלנו בעולם',
    subtitle: 'בחרו יעד, בחרו רמה, ותנו לנו לדאוג לכל השאר',
    viewAll: 'צפה בכל המשלחות',
    soldOut: 'מלא',
    meters: 'm',
    continents: {
      africa: 'אפריקה',
      europe: 'אירופה',
      asia: 'אסיה',
      southAmerica: 'דרום אמריקה',
    },
  },
  israelTrips: {
    heading: 'הטיולים שלנו בארץ',
    subtitle: 'מסעות יומיים ורב-יומיים ביעדי הטבע הכי יפים בישראל',
    viewAll: 'צפה בכל הטיולים בארץ',
  },
  impact: {
    heading: 'מטיילים עם משמעות!',
    p1: 'חלק מהרווחים שלנו מוקדשים להגשת חלומות לחולי סרטן בישראל. בזכות כל אחד ואחת מכם שמצטרפים אלינו למסע, אנחנו מצליחים לתרום ולחזק אנשים שנמצאים במאבק הכי גדול של חייהם',
    p2: 'אנחנו מגיעים מדי חודש למחלקות, פוגשים משפחות, מחלקים מתנות ותומכים בילדים ובמבוגרים שנלחמים יום-יום ויוצרים רגעים קטנים של אושר בתוך המציאות המורכבת שלהם',
    p3: 'אנחנו מאמינים שמסע עם משמעות הוא מסע שמשנה חיים, הן של המטיילים והן של החולים. בזכות הלקוחות המדהימים שלנו נתרמו עד כה למעלה מ-200 אלף שקלים ועזרנו להגשים חלומות לחולי סרטן ומשפחותיהם!',
    cta: 'כל יציאה למסע בעלת משמעות רבה!',
  },
  reviews: {
    heading: 'מה אומרים עלינו?',
    subtitle: 'מטיילים שחזרו מהמסע בדיוק כפי שסיפרו לגוגל',
    basedOn: 'מבוסס על 229 ביקורות',
    allReviews: 'לכל הביקורות בגוגל',
  },
  gallery: {
    sectionTitle: 'הצטרפו לחוויה של פעם בחיים',
    sectionSubtitle: 'תמונות אמיתיות מהמסעות של HighAir ברחבי העולם',
    captions: [
      'קבוצת HighAir במסע',
      'טרק HighAir Expeditions',
      'מחנה בסיס אוורסט עם HighAir',
      'טיול בישראל עם HighAir',
      'משלחת HighAir בהרים',
      'פסגת HighAir Expeditions',
      'קבוצת מטיילים HighAir',
      'נוף הרים במסע HighAir',
      'משלחת הרים HighAir',
      'טרק HighAir בעולם',
      'HighAir Expeditions בפסגה',
    ],
  },
  cta: {
    heading: 'הפסגה הבאה שלכם מתחילה כאן!',
    subtitle: 'השאירו פרטים ונחזור אליכם בהקדם',
    namePlaceholder: 'ישראל ישראלי',
    nameLabel: 'שם מלא *',
    phoneLabel: 'טלפון *',
    phonePlaceholder: '050-0000000',
    phoneError: 'נא להזין מספר בפורמט תקין, למשל: 050-1234567',
    messageLabel: 'מה תרצו לשלוח לנו? *',
    messagePlaceholder: 'ספרו לנו על החלום שלכם',
    sendError: 'שגיאה בשליחה, נסו שוב או צרו קשר ישירות',
    agree: 'אני מסכימ/ה למדיניות הפרטיות ולקבלת דיוור שיווקי',
    privacyLink: 'לצפייה במדיניות פרטיות',
    sending: 'שולח',
    send: 'שלח',
    thankYou: 'תודה {{name}}!',
    received: 'פנייתך התקבלה - נחזור אליך תוך 24 שעות 🙌',
    sendAnother: 'שלח פנייה נוספת',
  },
  footer: {
    worldTreks: 'טרקים בעולם',
    worldClimbs: 'טיפוסי הרים בעולם',
    israelTrips: 'טרקים בארץ',
    info: 'מידע',
    hermon: 'טרק לפסגת החרמון',
    blog: 'הבלוג שלנו',
    cancellation: 'מדיניות ביטולים',
    terms: 'תקנון ותנאי שימוש',
    privacy: 'מדיניות פרטיות',
    accessibility: 'הצהרת נגישות',
    tagline: 'משלחות טיפוס הרים וטרקים בעולם ובישראל\nבשילוב תרומה לחולי סרטן בכל מסע.',
    copyright: 'HighAir Expeditions © {{year}}',
    contact: 'צור קשר',
    phone: '+972-55-563-6975',
    email: 'info@highair-expeditions.com',
  },
  expedition: {
    days: 'ימים',
    difficulty: 'רמת קושי',
    elevation: 'גובה',
    price: 'מחיר',
    included: 'כלול במחיר',
    notIncluded: 'לא כלול',
    highlights: 'הייטליייטס',
    register: 'להרשמה',
    whatsapp: 'שאלות? WhatsApp',
    soldOut: 'מלא',
    availableSpots: 'מקומות אחרונים',
    diff: 'דרגת קושי',
    duration: 'משך',
    season: 'עונה',
    metersUnit: 'm',
    recommendedSeasons: 'עונות מומלצות',
    itinerary: 'תכנית',
    gallery: 'תמונות',
    registerBtn: 'הרשמה ←',
    spots: 'מקומות',
    lastSpots: 'מקומות אחרונים',
    full: 'מלא',
    comingSoon: 'תאריכים יפורסמו בקרוב',
    waitlist: 'רוצים להיות הראשונים לדעת?',
    waitlistBtn: 'השאירו פרטים',
    formTitle: 'הרשמה למשלחת',
    formDesc: 'מלאו את הפרטים ונחזור אליכם לאישור ורישום סופי',
  },
  common: {
    loading: 'טוען...',
    error: 'שגיאה',
    back: 'חזרה',
  },
  notFound: {
    title: 'הדף לא נמצא',
    desc: 'נראה שהדף שחיפשתם לא קיים או הועבר. בואו נחזיר אתכם לנתיב הנכון.',
    back: '← חזרה לדף הבית',
  },
  blog: {
    pageTitle: 'הבלוג של HighAir',
    subtitle: 'מאמרים, טיפים וסיפורים מעולם הטרקים וטיפוס ההרים',
    all: 'הכל',
    empty: 'אין מאמרים בקטגוריה זו עדיין.',
    readMore: 'קרא עוד ←',
  },
  blogPost: {
    notFound: 'המאמר לא נמצא',
    back: '← לכל המאמרים',
    readTime: 'דקות קריאה',
    share: 'אהבתם? שתפו:',
    copied: '✓ הועתק!',
    copyLink: '🔗 העתק לינק',
    moreArticles: 'מאמרים נוספים',
    readMore: 'קרא עוד ←',
    ctaTitle: 'מוכנים לצאת למסע?',
    ctaDesc: 'הצטרפו לאחד מהמסעות שלנו ותחוו הרפתקה אמיתית',
    ctaBtn: 'לכל המשלחות',
  },
  annualPlan: {
    title: 'התכנית השנתית',
    subtitle: 'כל הטיולים שלנו - מהתאריך הקרוב ועד סוף העונה',
    loading: 'טוען תכנית שנתית...',
    error: 'שגיאה בטעינת הנתונים. נסו לרענן את הדף.',
    empty: 'אין טיולים מתוכננים כרגע',
    emptyDetail: 'התכנית השנתית תתעדכן בקרוב עם תאריכים חדשים',
    months: ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
  },
  press: {
    title: 'HighAir בתקשורת',
    subtitle: 'כתבות ומדיה שסיפרו את הסיפור שלנו',
  },
};

const en = {
  nav: {
    home: 'Home',
    expeditions: 'Expeditions',
    treks: 'Trekking',
    climbs: 'Expeditions',
    israelTrips: 'Israel Treks',
    annualPlan: 'Annual Plan',
    about: 'Our Story',
    blog: 'Blog',
    contact: 'Contact',
    contactUs: 'Contact Us',
    skipToContent: 'Skip to content',
  },
  hero: {
    subtitle: 'Organizing treks and mountain climbing expeditions in Israel and around the world',
    cancer: 'Every expedition includes a donation to cancer patients!',
    allExpeditions: 'All Expeditions',
    ourStory: 'Our Story',
  },
  stats: {
    successRate: 'Summit success rate',
    donated: 'Donated to children',
    climbers: 'Climbers summited',
    destinations: 'Destinations worldwide',
  },
  explorer: {
    heading: 'Our Treks & Expeditions Worldwide',
    subtitle: 'Choose a destination, choose your level, and let us take care of the rest',
    viewAll: 'View all expeditions',
    soldOut: 'Full',
    meters: 'm',
    continents: {
      africa: 'Africa',
      europe: 'Europe',
      asia: 'Asia',
      southAmerica: 'South America',
    },
  },
  israelTrips: {
    heading: 'Our Treks in Israel',
    subtitle: "Day and multi-day journeys through Israel's most beautiful natural destinations",
    viewAll: 'View all Israel treks',
  },
  impact: {
    heading: 'Travel with Purpose!',
    p1: 'A portion of our profits is dedicated to fulfilling the dreams of cancer patients in Israel. Thanks to each and every one of you who joins us on a journey, we are able to donate and strengthen people who are in the biggest fight of their lives.',
    p2: 'Every month we visit hospital wards, meet families, distribute gifts and support children and adults who fight day by day - creating small moments of joy within their complex reality.',
    p3: 'We believe that a meaningful journey is one that changes lives - both of the travelers and the patients. Thanks to our amazing clients, we have donated over ₪200000 to date and helped fulfill the dreams of cancer patients and their families!',
    cta: 'Every expedition makes a difference!',
  },
  reviews: {
    heading: 'What our travelers say',
    subtitle: 'Hikers who came back from the journey - exactly as they told Google',
    basedOn: 'Based on 229 reviews',
    allReviews: 'All Google Reviews',
  },
  gallery: {
    sectionTitle: 'Join a Once-in-a-Lifetime Experience',
    sectionSubtitle: 'Real photos from HighAir expeditions around the world',
    captions: [
      'HighAir group on expedition',
      'HighAir Expeditions trek',
      'Everest Base Camp with HighAir',
      'Israel trek with HighAir',
      'HighAir mountain expedition',
      'HighAir Expeditions summit',
      'HighAir trekking group',
      'Mountain views on HighAir trek',
      'HighAir mountain expedition',
      'HighAir trek worldwide',
      'HighAir Expeditions at the summit',
    ],
  },
  cta: {
    heading: 'Your next summit starts here!',
    subtitle: "Leave your details and we'll get back to you soon",
    namePlaceholder: 'John Smith',
    nameLabel: 'Full Name *',
    phoneLabel: 'Phone *',
    phonePlaceholder: '+1-000-000-0000',
    phoneError: 'Please enter a valid phone number',
    messageLabel: 'What would you like to tell us? *',
    messagePlaceholder: 'Tell us about your dream expedition',
    sendError: 'Error sending, please try again or contact us directly',
    agree: 'I agree to the privacy policy and marketing communications',
    privacyLink: 'View privacy policy',
    sending: 'Sending',
    send: 'Send',
    thankYou: 'Thank you, {{name}}!',
    received: "Your message has been received — we'll get back to you within 24 hours 🙌",
    sendAnother: 'Send another message',
  },
  footer: {
    worldTreks: 'Trekking',
    worldClimbs: 'Expeditions',
    israelTrips: 'Israel Treks',
    info: 'Information',
    hermon: 'Mount Hermon Trek',
    blog: 'Our Blog',
    cancellation: 'Cancellation Policy',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    accessibility: 'Accessibility',
    tagline: 'Trekking and Climbing Expeditions\nEvery Expedition Supports Cancer Patients',
    copyright: 'HighAir Expeditions © {{year}}',
    contact: 'Contact',
    phone: '+972-55-563-6975',
    email: 'info@highair-expeditions.com',
  },
  expedition: {
    days: 'days',
    difficulty: 'Difficulty',
    elevation: 'Elevation',
    price: 'Price',
    included: 'Included',
    notIncluded: 'Not included',
    highlights: 'Highlights',
    register: 'Register',
    whatsapp: 'Questions? WhatsApp',
    soldOut: 'Full',
    availableSpots: 'Last spots',
    diff: 'Difficulty',
    duration: 'Duration',
    season: 'Season',
    metersUnit: 'm',
    recommendedSeasons: 'Recommended Seasons',
    itinerary: 'Itinerary',
    gallery: 'Gallery',
    registerBtn: 'Register →',
    spots: 'spots',
    lastSpots: 'last spots',
    full: 'Full',
    comingSoon: 'Dates coming soon',
    waitlist: 'Want to be the first to know?',
    waitlistBtn: 'Leave your details',
    formTitle: 'Register for Expedition',
    formDesc: "Fill in your details and we'll get back to you to confirm your registration",
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    back: 'Back',
  },
  notFound: {
    title: 'Page Not Found',
    desc: "The page you were looking for doesn't exist or has been moved.",
    back: '← Back to Home',
  },
  blog: {
    pageTitle: 'HighAir Blog',
    subtitle: 'Articles, tips and stories from the world of trekking and mountaineering',
    all: 'All',
    empty: 'No articles in this category yet.',
    readMore: 'Read more →',
  },
  blogPost: {
    notFound: 'Article not found',
    back: '← All articles',
    readTime: 'min read',
    share: 'Like it? Share:',
    copied: '✓ Copied!',
    copyLink: '🔗 Copy link',
    moreArticles: 'More articles',
    readMore: 'Read more →',
    ctaTitle: 'Ready for an adventure?',
    ctaDesc: 'Join one of our expeditions and experience a real adventure',
    ctaBtn: 'All Expeditions',
  },
  annualPlan: {
    title: 'Annual Plan',
    subtitle: 'All our trips - from the nearest date to end of season',
    loading: 'Loading annual plan...',
    error: 'Error loading data. Please refresh the page.',
    empty: 'No trips planned at the moment',
    emptyDetail: 'The annual plan will be updated soon with new dates',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  },
  press: {
    title: 'HighAir in the Media',
    subtitle: 'Articles and media that told our story',
  },
};

const lng = detectLang();

i18n
  .use(initReactI18next)
  .init({
    resources: { he: { translation: he }, en: { translation: en } },
    lng,
    fallbackLng: 'he',
    interpolation: { escapeValue: false },
  });

/* Sync dir + lang attribute + font */
function applyDir(language) {
  document.documentElement.dir  = language === 'en' ? 'ltr' : 'rtl';
  document.documentElement.lang = language;

  /* Swap base font: Mazzard for English, Ploni for Hebrew */
  const STYLE_ID = 'ha-font-override';
  let el = document.getElementById(STYLE_ID);
  if (language === 'en') {
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = `* { font-family: 'Mazzard', sans-serif !important; }`;
  } else {
    el?.remove();
  }
}
applyDir(lng);
i18n.on('languageChanged', applyDir);

export default i18n;
