/* appData.js: the /app page (the HighAir store app), in Hebrew and English.
   AppPage.jsx renders it, the footer's app block uses the store links, and the
   page's static shell (scripts/generate-html-shells.mjs, appText in
   scripts/lib/text-layer.mjs) reads the same copy, so what a search or AI
   crawler reads is exactly what a visitor reads.

   The app opens only after a booking (login with the booking's details), so
   the copy speaks to travellers who have booked, not to prospects. Features
   listed here are the ones the app really has; add one only when it ships. */

/* The store listings (same URLs as the webapp's src/data/storeLinks.js). */
export const APP_STORE_URL  = 'https://apps.apple.com/app/id6827936860';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.highairexpeditions.app';
/* One link for both stores: iPhone goes to the App Store, Android to Google
   Play, a computer gets a page with both. The QR code encodes this URL. */
export const APP_DOWNLOAD_URL = 'https://app.highair-expeditions.com/download';
/* The personal area in the browser (same login details as the app). */
export const PERSONAL_AREA_URL = 'https://app.highair-expeditions.com';

/* Official store badges (unaltered artwork, public/images/badges/). `box` is
   the file's own size and `art` the badge inside it, so every badge can be
   shown at the same visible height: the Hebrew App Store SVG carries a 1-unit
   margin, the Google Play PNG Google's own padding. */
export const BADGES = {
  apple: {
    he: { src: '/images/badges/app-store-he.svg', box: [121.664, 42], art: [119.664, 40], alt: 'להורדה ב-App Store' },
    en: { src: '/images/badges/app-store-en.svg', box: [119.664, 40], art: [119.664, 40], alt: 'Download on the App Store' },
  },
  google: {
    he: { src: '/images/badges/google-play-he.png', box: [646, 250], art: [564, 168], alt: 'כעת ב-Google Play' },
    en: { src: '/images/badges/google-play-en.png', box: [646, 250], art: [564, 168], alt: 'Get it on Google Play' },
  },
};
export const APP_QR_SRC = '/images/badges/app-download-qr.svg';

/* Screens from the store listing (fictional traveller "Daniel Levi"). */
export const APP_HERO_SCREEN = '/images/app/app-home.webp';
export const APP_SCREENS = [
  { src: '/images/app/app-my-trip.webp',   he: 'המסמכים שלי',        en: 'My documents' },
  { src: '/images/app/app-itinerary.webp', he: 'התכנית יום אחר יום', en: 'Day-by-day itinerary' },
  { src: '/images/app/app-files.webp',     he: 'קבצים ומדריכים',     en: 'Files and guides' },
];

const HE = {
  metaTitle: 'HighAir Expeditions | האפליקציה למטיילים',
  metaDesc:  'האפליקציה החינמית של HighAir Expeditions לאייפון ולאנדרואיד, למטיילים שנרשמו למסע: תכנית יום אחר יום, מסמכים והסכם השתתפות, תשלומים, מפגשי הכנה ותזכורות.',
  h1:        'האפליקציה של HighAir',
  sub:       'לכל מי שנרשם למסע איתנו: המסע, המסמכים, התשלומים ומפגשי ההכנה, במקום אחד בטלפון.',
  note:      'חינם, לאייפון ולאנדרואיד',
  qrTitle:   'סרקו להורדה',
  qrSub:     'מצלמת הטלפון תפתח את החנות המתאימה',
  qrAlt:     'קוד QR להורדת האפליקציה של HighAir',
  screenAlt: 'מסך הבית באפליקציה של HighAir',

  featuresLabel: 'מה תמצאו באפליקציה',
  featuresTitle: 'כל פרטי המסע שלכם, במקום אחד',
  features: [
    { icon: 'mountain', title: 'המסע שלכם',             text: 'ספירה לאחור עד היציאה, ותכנית המסע המלאה יום אחר יום.' },
    { icon: 'document', title: 'מסמכים והסכם השתתפות',  text: 'העלאת המסמכים הנדרשים למסע וחתימה על הסכם ההשתתפות, ישירות מהטלפון.' },
    { icon: 'card',     title: 'תשלומים',               text: 'כל התשלומים במבט אחד: המקדמות ששולמו, התשלום הבא והיתרה שמשולמת בהגעה ליעד.' },
    { icon: 'users',    title: 'מפגשי הכנה',            text: 'מועדי מפגש הציוד וטרק ההכנה, ואישור הגעה בלחיצה אחת.' },
    { icon: 'backpack', title: 'ציוד ומדריכים',         text: 'רשימת הציוד למסע, ומדריכים וקבצים שיעזרו לכם להתכונן.' },
    { icon: 'bell',     title: 'תזכורות והתראות',       text: 'תזכורות על מסמכים, תשלומים ומפגשים, עדכון כשכרטיס הטיסה או הביטוח מוכנים, ותזכורת שבוע ויום לפני היציאה.' },
  ],

  screensLabel: 'הצצה לאפליקציה',
  screensTitle: 'כל מה שצריך לפני היציאה',
  screensNote:  'המסכים להמחשה בלבד, עם פרטי מטייל לדוגמה.',

  stepsLabel: 'איך מתחילים',
  stepsTitle: 'שלושה צעדים פשוטים',
  steps: [
    { title: 'נרשמים למסע',             text: 'האפליקציה מיועדת למטיילים שנרשמו למסע עם HighAir.' },
    { title: 'מורידים את האפליקציה',    text: 'מ-App Store או מ-Google Play, ללא עלות.' },
    { title: 'מתחברים',                 text: 'עם מספר הטלפון או מספר ההזמנה, יחד עם שם המשפחה. אלה אותם פרטי הכניסה של האזור האישי באתר.' },
  ],

  faq: [
    { q: 'האם האפליקציה בתשלום?',
      a: 'לא. האפליקציה חינמית, לאייפון ולאנדרואיד.' },
    { q: 'איך מתחברים לאפליקציה?',
      a: 'עם מספר הטלפון או מספר ההזמנה, יחד עם שם המשפחה שאיתו נרשמתם. אלה אותם פרטי הכניסה של האזור האישי באתר.' },
    { q: 'עוד לא נרשמתי למסע. אפשר להוריד את האפליקציה?',
      a: 'אפשר להוריד אותה, אבל הכניסה נפתחת רק אחרי ההרשמה למסע, כי כל המידע בה אישי. בינתיים נשמח לעזור לכם לבחור את המסע המתאים: צרו איתנו קשר.',
      link: { text: 'צרו איתנו קשר', href: '/contact' } },
    { q: 'אפשר להסתדר גם בלי האפליקציה?',
      a: 'כן. כל מה שיש באפליקציה זמין גם באזור האישי באתר, מכל דפדפן ועם אותם פרטי כניסה. היתרון של האפליקציה: התראות ותזכורות ישירות לטלפון.',
      link: { text: 'באזור האישי באתר', href: PERSONAL_AREA_URL } },
  ],
};

const EN = {
  metaTitle: 'The HighAir App | HighAir Expeditions',
  metaDesc:  'The free HighAir Expeditions app for iPhone and Android, for travellers who have booked a trip: day-by-day itinerary, documents and agreement, payments, preparation meetings and reminders.',
  h1:        'The HighAir App',
  sub:       'For everyone who has booked a trip with us: your trip, documents, payments and preparation meetings, in one place on your phone.',
  note:      'Free for iPhone and Android',
  qrTitle:   'Scan to download',
  qrSub:     "Your phone's camera opens the right store",
  qrAlt:     'QR code to download the HighAir app',
  screenAlt: 'The home screen of the HighAir app',

  featuresLabel: "What's in the app",
  featuresTitle: 'Everything about your trip, in one place',
  features: [
    { icon: 'mountain', title: 'Your trip',                  text: 'A countdown to departure and your full itinerary, day by day.' },
    { icon: 'document', title: 'Documents and agreement',    text: 'Upload the documents your trip needs and sign the participation agreement, right from your phone.' },
    { icon: 'card',     title: 'Payments',                   text: 'Your payments at a glance: deposits paid, the next payment, and the balance due on arrival.' },
    { icon: 'users',    title: 'Preparation meetings',       text: 'Dates for the gear meeting and the preparation trek, with attendance confirmed in one tap.' },
    { icon: 'backpack', title: 'Gear and guides',            text: "Your trip's gear list, together with guides and files to help you prepare." },
    { icon: 'bell',     title: 'Reminders and alerts',       text: 'Reminders about documents, payments and meetings, a note when your flight ticket or insurance is ready, and reminders a week and a day before departure.' },
  ],

  screensLabel: 'A look inside',
  screensTitle: 'Everything you need before you go',
  screensNote:  'Screens shown for illustration, with sample traveller details.',

  stepsLabel: 'Getting started',
  stepsTitle: 'Three simple steps',
  steps: [
    { title: 'Book a trip',                      text: 'The app is for travellers who have booked a trip with HighAir.' },
    { title: 'Download the app',                 text: 'From the App Store or Google Play, free of charge.' },
    { title: 'Log in with your booking details', text: 'Your phone number or booking reference, together with your last name. The same details as the personal area on our website.' },
  ],

  faq: [
    { q: 'Is the app free?',
      a: 'Yes. The app is free, for iPhone and Android.' },
    { q: 'How do I log in?',
      a: 'With your phone number or booking reference, together with the last name on your booking. These are the same login details as the personal area on our website.' },
    { q: "I haven't booked a trip yet. Can I download the app?",
      a: "You can download it, but you can log in only after booking a trip, because everything in it is personal and based on your booking. Until then we'd be happy to help you choose the right trip: contact us.",
      link: { text: 'contact us', href: '/contact' } },
    { q: 'Can I manage without the app?',
      a: 'Yes. Everything in the app is also available in the personal area on our website, from any browser, with the same login details. The app also sends alerts and reminders straight to your phone.',
      link: { text: 'the personal area on our website', href: PERSONAL_AREA_URL } },
  ],
};

export const APP_PAGE = { he: HE, en: EN };
