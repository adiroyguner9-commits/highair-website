/**
 * israelData.js - Israel trips shared data
 * Used by IsraelTrips.jsx (home section) and IsraelDetail.jsx (detail page)
 */

export const ISRAEL_TRIPS = [
  {
    id:      'il-1',
    slug:    'hermon',
    name:       'טרק לפסגת החרמון',
    nameEn:     'Mount Hermon Trek',
    area:       '08-09/05',
    elev:       '2040',
    elevStr:    '2040m',
    price:      'From ₪349',
    priceHe:    'החל מ ₪349',
    diffHe:     'מיטיבי לכת',
    diffEn:     'Moderate',
    days:       '2 ימים',
    daysEn:     '2 days',
    typeHe:     'טרק',
    seasons:    ['אפריל–ספטמבר'],
    seasonsEn:  ['April–September'],
    tagline:    'הצטרפו אלינו לטרק אל הפסגה הגבוהה ביותר בישראל\nוקחו חלק משמעותי בתרומה למלחמה בסרטן!',
    taglineEn:  'Join us for a trek to the highest peak in Israel\nand take part in the fight against cancer!',
    grad:    'linear-gradient(135deg, #1a4a2e, #2d7a4f, #0d2b1a)',
    img:     '/images/cards/Hermon.avif',
    live:            true,
    airtableEvents:  ['Hermon'],
    groupCapacity:   12,
    paymentUrl:      'https://pay.grow.link/db6fa9095ee92d6941a0e55656d0355e-MzE5MDMyNw',
    desc:    'הצטרפו אלינו לטרק אל הפסגה הגבוהה ביותר בישראל המיועדת למטיילים ומיטיבי לכת בלבד. עם טיפוס מצטבר של 1040 מטרים, מדובר במסלול המדמה תנאי שטח אלפיניים ומהווה את ההכנה הטובה ביותר עבור אלו המתכננים טרקים ומשלחות בחו"ל.\n\nנצא למסלול מאתגר דרך מעלה גולני והר חבושית. הדרך רצופה בנופים פראיים של רמת הגולן והחרמון, המעניקים תחושת מרחב ועוצמה שאין בשום מקום אחר בארץ. זהו טרק מאתגר ומתגמל הדורש נחישות וכושר הליכה טוב, ומסתיים בסיפוק האמיתי של עמידה על פסגת המדינה.\n\nהמסע שלנו מתחיל כבר בערב שלפני. נישן יחד במתחם קמפינג כפרי, עם ארוחת ערב ״על האש״, מוזיקה וזמן איכות להיכרות וגיבוש הקבוצה לפני היציאה להר עם אור ראשון.\n\nהמסע הזה הוא הזדמנות לשלב בין אתגר פיזי לתרומה חברתית. הטרק מהווה חלק משמעותי במאבק ובגיוס תרומות למלחמה בסרטן, כך שכל צעד בדרך לפסגה נושא איתו ערך מוסף.',
    descEn:  'Join us on a challenging trek to the highest peak in Israel — designed for experienced hikers and trekkers only. With a cumulative ascent of 1,040 meters, this trail simulates alpine conditions and is the ideal preparation for those planning treks and expeditions abroad.\n\nWe take a demanding route through Ma\'ale Golani and Mount Havushit. The way is lined with wild landscapes of the Golan Heights and the Hermon, offering a sense of space and power found nowhere else in the country. This is a challenging yet rewarding trek that demands determination and solid walking fitness, ending with the true satisfaction of standing on the country\'s highest summit.\n\nOur journey begins the evening before. We sleep together at a rural camping site, with a barbecue dinner, music and quality time to get to know each other and bond as a group before heading to the mountain at first light.\n\nThis journey is an opportunity to combine physical challenge with social contribution. The trek forms a significant part of our fundraising fight against cancer — so every step toward the summit carries real added value.',
    included: [
      'טרק לפסגת החרמון בגובה 2040m',
      'מדריך מוסמך ומלווה מטעם HighAir',
      'ארוחת שישי ״על האש״ + ערב גיבוש',
      'לינה ביורט משותף עד 7 אנשים בחאן אלרום',
      'ארוחת בוקר בקמפינג חאן אלרום',
      'ארוחת צהריים דרוזית מפנקת לאחר הטרק',
      'אישורים מהצבא - הכניסה בתיאום ואישור מלא',
      'תרומה משמעותית במאבק למלחמה בסרטן!',
    ],
    includedEn: [
      'Trek to Hermon summit at 2,040m',
      'Certified guide and escort from HighAir',
      'Friday BBQ dinner + group bonding evening',
      'Shared yurt accommodation (up to 7 people) at Khan Al-Rom',
      'Breakfast at Khan Al-Rom camping site',
      'Druze lunch after the trek',
      'Military permits — entry fully coordinated and approved',
      'A meaningful contribution to the fight against cancer!',
    ],
    notIncluded: [
      'הגעה עצמאית לנקודת מפגש',
      'ציוד אישי - לבוש והנעלה',
      'ירידה ברכבל - 35₪ לאדם',
    ],
    notIncludedEn: [
      'Independent transport to meeting point',
      'Personal gear — clothing and footwear',
      'Cable car descent — ₪35 per person',
    ],
    itinerary: [
      {
        day:   'שישי',
        title: 'קמפינג וערב גיבוש',
        desc:  '17:00 - הגעה עצמאית לקמפינג + כיבוד קל\n19:30 - ארוחת שישי ״על האש״ + ערב גיבוש\n22:00 - לילה טוב!',
      },
      {
        day:   'שבת',
        title: 'טרק לפסגת החרמון',
        desc:  '05:30 - השכמה + ארוחת בוקר\n06:00 - יציאה לנקודת מפגש\n06:30 - הקפצת רכבים לנווה אטי״ב\n07:00 - תחילת מסלול מנווה אטי״ב\n14:00 - סיום וארוחת צהריים דרוזית מפנקת\n14:30 - הקפצת רכבים חזרה לנווה אטי״ב\n15:00 - סיום משוער\n\nאורך המסלול: 12 ק״מ | משך: 7-8 שעות הליכה | עלייה מצטברת: 1040 מטר',
      },
    ],
    itineraryEn: [
      {
        day:   'Friday',
        title: 'Camping & Bonding Evening',
        desc:  '17:00 — Arrive independently to camping site + light refreshments\n19:30 — Friday BBQ dinner + group bonding evening\n22:00 — Good night!',
      },
      {
        day:   'Saturday',
        title: 'Hermon Summit Trek',
        desc:  '05:30 — Wake up + breakfast\n06:00 — Depart to meeting point\n06:30 — Shuttle to Neve Ativ\n07:00 — Trail begins from Neve Ativ\n14:00 — Finish & Druze lunch\n14:30 — Shuttle back to Neve Ativ\n15:00 — Estimated end\n\nTrail length: 12 km | Duration: 7–8 hours walking | Cumulative ascent: 1,040 meters',
      },
    ],
    dates:       ['08-09/05'],
  },
];
