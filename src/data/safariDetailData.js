/* ═══════════════════════════════════════════════════════════════════════════
   SAFARI EXPEDITION PAGE — content for the sections that exist only on a
   safari page (/expedition/safari-3-days | -5-days | -7-days).

   Built after the owner asked for Altezza's tour-page structure adapted to us
   (Jul 30 2026): summary card, section nav, "is this for me", packing list,
   season + price table, route map, per-day lodging and meals, inclusions,
   visa and documents.

   RULES THIS FILE FOLLOWS
   - No prices are invented. SAFARI_PRICES holds nulls until the owner sends
     real numbers; every null renders as "לפי בקשה", so the page is publishable
     as-is and filling it is a one-line data edit.
   - Icons are NAMES only. The name-to-component map lives in the renderer, so
     no emoji can ever leak in from here.
   - Anything the owner still has to confirm carries a NEEDS-OWNER comment.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Trip type / who it suits ──────────────────────────────────────────────
   The private-group fact is the commercial heart of the page: every safari we
   run is private, with the single exception of the 3-day groups that depart
   after a Kilimanjaro climb (owner, Jul 30 2026). */
export const SAFARI_TRIP_TYPE = {
  privateTitle:   'ספארי פרטי',
  privateTitleEn: 'Private safari',
  private:
    'הספארי הוא שלכם בלבד. ג׳יפ פרטי, נהג-מדריך פרטי, ותאריכי יציאה שנקבעים לפי היומן שלכם ולא לפי לוח זמנים של קבוצה. גם הקצב בשטח נקבע על ידיכם.',
  privateEn:
    'The safari is yours alone. A private jeep, a private driver-guide, and departure dates set by your calendar rather than by a group schedule. The pace in the field is yours too.',
  groupNote:
    'החריג היחיד הוא ספארי 3 הימים שיוצא בסמוך לקבוצות הקילימנג׳רו שלנו. שם אפשר להצטרף לקבוצה שמסיימת את הטיפוס, וכך לחלוק את עלות הג׳יפ.',
  groupNoteEn:
    'The one exception is the 3-day safari that departs alongside our Kilimanjaro groups. There you can join the group finishing the climb and share the cost of the jeep.',

  /* NEEDS-OWNER: minimum age. 5 is the common floor for a crater-and-parks
     safari with no long walks. Confirm before launch. */
  ageTitle:   'גילאים',
  ageTitleEn: 'Ages',
  age:
    'הספארי מתאים לכל הגילאים, גם לילדים. אין הליכות ארוכות ואין מאמץ גופני, כמעט כל היום מתנהל מתוך הג׳יפ. למשפחות עם ילדים קטנים נתאים את אורך ימי הנסיעה מראש.',
  ageEn:
    'The safari suits every age, children included. There are no long walks and no physical effort, and almost the entire day happens from the jeep. For families with small children we shorten the driving days in advance.',

  jeepTitle:   'הג׳יפ',
  jeepTitleEn: 'The jeep',
  jeep:
    'לנד קרוזר 4x4 עם גג נפתח לצילום בעמידה, שישה מקומות ישיבה, ולכל נוסע מקום ליד חלון. מים לשתייה בג׳יפ לאורך כל היום.',
  jeepEn:
    'A 4x4 Land Cruiser with a pop-up roof for standing photography, six seats, and a window seat for every passenger. Drinking water in the jeep throughout the day.',
};

/* ── Packing list ─────────────────────────────────────────────────────────
   A safari list, not the Kilimanjaro one: no layers for altitude, and the
   colour rule and the optics matter far more than the boots. */
export const SAFARI_PACKING = [
  {
    icon: 'shopping', title: 'ביגוד', titleEn: 'Clothing',
    items: [
      'גוונים ניטרליים: בז׳, חאקי, ירוק זית או אפור',
      'להימנע מכחול ומשחור, הצבעים האלה מושכים את זבוב הצה-צה',
      'חולצות ארוכות קלות ליום, נוחות יותר מול שמש ואבק מקצרות',
      'שכבה חמה אחת לבקרים ולנסיעות בגג פתוח, גם בקיץ',
      'מכנס ארוך נוח ומכנס קצר אחד ללודג׳',
      'כובע רחב שוליים, ולא כובע מצחייה',
      'נעלי הליכה סגורות וסנדל ללודג׳',
      'בגד ים, בכל הלודג׳ים יש בריכה',
    ],
    itemsEn: [
      'Neutral tones: beige, khaki, olive or grey',
      'Avoid blue and black, which attract tsetse flies',
      'Light long-sleeved shirts for the day, better than short sleeves against sun and dust',
      'One warm layer for early mornings and open-roof driving, even in summer',
      'Comfortable long trousers and one pair of shorts for the lodge',
      'A wide-brimmed hat rather than a cap',
      'Closed walking shoes and a sandal for the lodge',
      'Swimwear, every lodge has a pool',
    ],
  },
  {
    icon: 'glasses', title: 'משקפת וצילום', titleEn: 'Optics and photography',
    items: [
      'משקפת אישית, 8x42 היא הבחירה הנוחה לספארי',
      'עדשת זום ארוכה, 200 מ״מ ומעלה, לצילום חיות',
      'סוללות מילוי וכרטיסי זיכרון, אין איפה לקנות בשטח',
      'מטלית ואטב אוויר לניקוי אבק מהעדשה',
      'שקית בד לכיסוי המצלמה בנסיעה בגג פתוח',
    ],
    itemsEn: [
      'Personal binoculars, 8x42 is the comfortable choice on safari',
      'A long zoom lens, 200mm and up, for wildlife',
      'Spare batteries and memory cards, there is nowhere to buy them in the field',
      'A cloth and blower to clear dust off the lens',
      'A fabric cover for the camera while driving with the roof open',
    ],
  },
  {
    icon: 'sun', title: 'שמש ואבק', titleEn: 'Sun and dust',
    items: [
      'קרם הגנה במקדם גבוה, השמש קרובה לקו המשווה',
      'שפתון עם מקדם הגנה',
      'משקפי שמש',
      'מטפחת או בנדנה לאבק בדרכי העפר',
      'מגבונים לחים וג׳ל אלכוהול',
    ],
    itemsEn: [
      'High-factor sunscreen, this is close to the equator',
      'Lip balm with sun protection',
      'Sunglasses',
      'A buff or bandana for dust on the dirt roads',
      'Wet wipes and alcohol gel',
    ],
  },
  {
    icon: 'medical', title: 'בריאות', titleEn: 'Health',
    items: [
      'תרופות אישיות באריזה המקורית ובכמות לכל המסע',
      'דוחה יתושים על בסיס DEET',
      'משככי כאבים, תרופה לבחילות ותרופה למערכת העיכול',
      'פלסטרים ותחבושת קטנה',
      'טיפות עיניים, האבק מציק לעדשות מגע',
    ],
    itemsEn: [
      'Personal medication in its original packaging, enough for the whole trip',
      'DEET-based insect repellent',
      'Painkillers, something for nausea and something for the stomach',
      'Plasters and a small bandage',
      'Eye drops, the dust bothers contact lenses',
    ],
  },
  {
    icon: 'passport', title: 'מסמכים וכספים', titleEn: 'Documents and money',
    items: [
      'דרכון בתוקף של שישה חודשים לפחות מיום הכניסה',
      'אישור הוויזה המודפס',
      'פוליסת ביטוח נסיעות',
      'אישור חיסון קדחת צהובה, אם הוא נדרש במסלול הטיסה שלכם',
      'דולרים במזומן לטיפים ולקניות בשוק, שטרות משנת 2009 ואילך',
      'צילום דיגיטלי של כל המסמכים בטלפון ובמייל',
    ],
    itemsEn: [
      'A passport valid for at least six months from the date of entry',
      'A printed copy of the visa approval',
      'Your travel insurance policy',
      'A yellow fever certificate, if your flight route requires one',
      'Cash US dollars for tips and market purchases, notes from 2009 or later',
      'A digital copy of every document, on your phone and in your email',
    ],
  },
  {
    icon: 'gps', title: 'חשמל וקישוריות', titleEn: 'Power and connectivity',
    items: [
      'מתאם לשקע מסוג G, השקע הבריטי בעל שלושה פינים מרובעים',
      'מתח החשמל בטנזניה הוא 230 וולט',
      'סוללת גיבוי, בקמפים בשטח החשמל אינו זמין תמיד בכל שעה',
      'הורדה מראש של מפות ומוזיקה, הקליטה בשמורות חלקית',
    ],
    itemsEn: [
      'A type G plug adapter, the British three rectangular pin socket',
      'Mains voltage in Tanzania is 230V',
      'A power bank, at bush camps electricity is not always available around the clock',
      'Download maps and music in advance, reception inside the reserves is partial',
    ],
  },
];

/* ── Season + price table ─────────────────────────────────────────────────
   Shape copied from how a private safari is actually quoted: price per person
   falls as the jeep fills, and the season moves the whole column.

   EVERY VALUE IS null ON PURPOSE. The owner has not sent prices (Jul 30 2026)
   and prices must never be invented. A null renders as "לפי בקשה".
   TO FILL: replace a null with a number in USD, e.g. 3 : 2450. */
export const SAFARI_SEASONS_PRICING = [
  { key: 'peak', label: 'עונת שיא', labelEn: 'Peak season',
    when: 'יולי עד אוקטובר, ו-20 בדצמבר עד 10 בינואר',
    whenEn: 'July to October, and 20 December to 10 January' },
  { key: 'high', label: 'עונה גבוהה', labelEn: 'High season',
    when: 'ינואר עד מרץ, ויוני',
    whenEn: 'January to March, and June' },
  { key: 'low', label: 'עונה שקטה', labelEn: 'Quiet season',
    when: 'אפריל, מאי ונובמבר',
    whenEn: 'April, May and November' },
];

export const SAFARI_GROUP_SIZES = [1, 2, 3, 4, 5, '6+'];

export const SAFARI_PRICES = {
  'safari-3-days': { peak: {}, high: {}, low: {} },
  'safari-5-days': { peak: {}, high: {}, low: {} },
  'safari-7-days': { peak: {}, high: {}, low: {} },
};

export const SAFARI_PRICE_NOTES = [
  'המחיר הוא לאדם ואינו כולל טיסות בינלאומיות.',
  'המחיר לאדם יורד ככל שהג׳יפ מתמלא, מפני שעלות הג׳יפ והמדריך מתחלקת בין הנוסעים.',
  'לילדים יש מחיר נפרד, ונשמח לתת אותו לפי הגילאים המדויקים.',
  'בתאריכי חג ובחגי המקום ייתכנו תוספות של הלודג׳ים, ונציין אותן בהצעה עצמה.',
];
export const SAFARI_PRICE_NOTES_EN = [
  'Prices are per person and exclude international flights.',
  'The per-person price falls as the jeep fills, because the cost of the jeep and the guide is shared.',
  'Children are priced separately, and we are glad to quote once we know the exact ages.',
  'Over holiday dates the lodges may add supplements, which we state in the quote itself.',
];

/* ── Inclusions ───────────────────────────────────────────────────────────
   NEEDS-OWNER: this list is what a Tanzania safari of ours contains as far as
   I know it (jeep with six seats, licensed English-speaking driver-guide, the
   named lodges, park fees, meals). Read it once and correct anything that is
   not exactly how you sell it. */
export const SAFARI_INCLUDED = [
  { icon: 'plane', title: 'העברות משדה התעופה',
    titleEn: 'Airport transfers',
    desc: 'איסוף מנמל התעופה קילימנג׳רו ביום הראשון והחזרה אליו ביום האחרון.',
    descEn: 'Pick-up from Kilimanjaro International Airport on the first day and a return transfer on the last.' },
  { icon: 'jeep', title: 'ג׳יפ 4x4 עם גג נפתח',
    titleEn: '4x4 with a pop-up roof',
    desc: 'לנד קרוזר פרטי לכל אורך המסע, שישה מקומות ולכל נוסע חלון. הגג נפתח לצילום בעמידה.',
    descEn: 'A private Land Cruiser for the whole journey, six seats and a window for every passenger. The roof opens for standing photography.' },
  { icon: 'users', title: 'נהג-מדריך מוסמך',
    titleEn: 'A licensed driver-guide',
    desc: 'מדריך שטח מוסמך דובר אנגלית, שמכיר את השמורות ואת הרגלי בעלי החיים לעומק.',
    descEn: 'A licensed English-speaking field guide who knows the reserves and the animals in depth.' },
  { icon: 'tag', title: 'כל דמי הכניסה לשמורות',
    titleEn: 'All park fees',
    desc: 'דמי הכניסה, אגרות השימור ומיסי הרכב של כל השמורות שבמסלול.',
    descEn: 'Entry fees, conservation levies and vehicle fees for every reserve on the route.' },
  { icon: 'tent', title: 'לינה בלודג׳ים ובקמפים',
    titleEn: 'Lodges and camps',
    desc: 'הלינה במקומות המצוינים במסלול, בחדר זוגי או משפחתי.',
    descEn: 'Accommodation at the properties named in the itinerary, in a double or family room.' },
  { icon: 'dining', title: 'ארוחות לפי המסלול',
    titleEn: 'Meals as per the itinerary',
    desc: 'ארוחות בוקר וערב בלודג׳, וארוחות צהריים ארוזות לימי הספארי בשטח.',
    descEn: 'Breakfast and dinner at the lodge, and packed lunches on the days out in the field.' },
  { icon: 'check', title: 'מים לשתייה',
    titleEn: 'Drinking water',
    desc: 'מים בג׳יפ לאורך כל היום, בכל ימי הספארי.',
    descEn: 'Water in the jeep throughout the day, on every safari day.' },
];

export const SAFARI_NOT_INCLUDED = [
  'טיסות בינלאומיות',
  'ויזה לטנזניה',
  'ביטוח נסיעות',
  'טיפים לנהג-מדריך ולצוותי הלודג׳ים',
  'שתייה חריפה ומשקאות מחוץ לארוחות',
  'הוצאות אישיות וקניות',
  'פעילויות בתוספת תשלום, כמו טיסת כדור פורח מעל הסרנגטי',
];
export const SAFARI_NOT_INCLUDED_EN = [
  'International flights',
  'Tanzania visa',
  'Travel insurance',
  'Tips for the driver-guide and lodge staff',
  'Alcohol and drinks outside of meals',
  'Personal expenses and shopping',
  'Paid extras, such as a hot-air balloon flight over the Serengeti',
];

/* ── Visa and documents ───────────────────────────────────────────────────
   NEEDS-OWNER, AND DELIBERATELY CONSERVATIVE. Entry rules change, so every
   item here points at the official portal rather than stating a fee or a
   processing time. Confirm the wording before this page goes live. */
export const SAFARI_VISA = {
  intro:
    'אזרחי ישראל נדרשים בוויזה לטנזניה. את הבקשה מגישים מראש באתר הרשות הרשמית להגירה, ולא בשדה התעופה.',
  introEn:
    'Israeli citizens require a visa for Tanzania. The application is submitted in advance on the official immigration portal, not at the airport.',
  portal: 'https://visa.immigration.go.tz',
  items: [
    { icon: 'passport', title: 'דרכון',
      titleEn: 'Passport',
      desc: 'בתוקף של שישה חודשים לפחות מיום הכניסה, ועם שני עמודים ריקים.',
      descEn: 'Valid for at least six months from the date of entry, with two blank pages.' },
    { icon: 'globe', title: 'ויזה מקוונת',
      titleEn: 'Online visa',
      desc: 'מגישים באתר הרשמי לפני הנסיעה. מומלץ להגיש כמה שבועות מראש ולהדפיס את האישור. העלות ומשך הטיפול מתעדכנים באתר עצמו.',
      descEn: 'Submitted on the official portal before travel. Apply a few weeks ahead and print the approval. The fee and processing time are stated on the portal itself.' },
    { icon: 'syringe', title: 'קדחת צהובה',
      titleEn: 'Yellow fever',
      desc: 'אישור חיסון נדרש למי שמגיע ממדינה שבה יש סיכון להדבקה, או שעבר בה בדרך. בטיסה ישירה מישראל בדרך כלל אין דרישה, אך כדאי לבדוק את מסלול הטיסה המדויק שלכם.',
      descEn: 'A certificate is required for anyone arriving from, or transiting, a country with risk of transmission. On a direct flight from Israel it is usually not required, but check your exact routing.' },
    { icon: 'shield', title: 'ביטוח נסיעות',
      titleEn: 'Travel insurance',
      desc: 'חובה מצידנו. יש לוודא שהפוליסה מכסה טיולי ספארי ופינוי רפואי.',
      descEn: 'Required by us. Make sure the policy covers safari travel and medical evacuation.' },
  ],
  disclaimer:
    'המידע נכון למועד כתיבתו ואינו מחליף את ההנחיות הרשמיות. תמיד כדאי לוודא את הדרישות באתר הרשות להגירה ובמשרד החוץ לפני הנסיעה, ואנחנו כמובן נלווה אתכם בתהליך.',
  disclaimerEn:
    'This information is correct as written and does not replace the official guidance. Always confirm the requirements on the immigration portal and with your foreign ministry before travelling, and we will of course walk you through it.',
};

/* ── Route map ────────────────────────────────────────────────────────────
   Positions are a real equirectangular projection of the actual coordinates
   (1 degree of latitude and of longitude are both about 111 km at 3 degrees
   south, so a single scale keeps the geography honest):
     x = 60 + (lon - 34.60) * 200      y = 60 + (|lat| - 1.30) * 200
   Rounded to whole pixels. Do not nudge a pin without recomputing it. */
export const SAFARI_MAP_NODES = {
  jro:        { x: 555, y: 486, label: 'נמל התעופה קילימנג׳רו', labelEn: 'Kilimanjaro Airport', kind: 'airport' },
  arusha:     { x: 477, y: 477, label: 'ארושה',                labelEn: 'Arusha',              kind: 'town' },
  tarangire:  { x: 340, y: 580, label: 'טרנגירי',               labelEn: 'Tarangire',           kind: 'park' },
  karatu:     { x: 276, y: 468, label: 'קראטו',                 labelEn: 'Karatu',              kind: 'town' },
  ngorongoro: { x: 256, y: 434, label: 'מכתש נגורונגורו',       labelEn: 'Ngorongoro Crater',   kind: 'crater' },
  eyasi:      { x: 200, y: 520, label: 'אגם אייסי',             labelEn: 'Lake Eyasi',          kind: 'lake' },
  seronera:   { x: 106, y: 286, label: 'מרכז הסרנגטי',          labelEn: 'Central Serengeti',   kind: 'park' },
  kogatende:  { x: 106, y: 120, label: 'צפון הסרנגטי',          labelEn: 'Northern Serengeti',  kind: 'park' },
};

/* Which nodes each package touches, and the day number shown on the pin.
   The 7-day route is intentionally absent: the owner has not sent that
   itinerary yet, so the map falls back to a message instead of guessing. */
export const SAFARI_ROUTES = {
  'safari-3-days': [
    { node: 'jro', day: null }, { node: 'tarangire', day: 1 },
    { node: 'karatu', day: null }, { node: 'ngorongoro', day: 2 },
    { node: 'eyasi', day: 3 },
  ],
  'safari-5-days': [
    { node: 'jro', day: null }, { node: 'tarangire', day: 1 },
    { node: 'seronera', day: 2 }, { node: 'kogatende', day: 3 },
    { node: 'ngorongoro', day: 4 }, { node: 'eyasi', day: 5 },
  ],
};
