/* balkanDiary.js: "פסגות הבלקן: יומן מסע", /blog/peaks-of-the-balkans-diary (owner, 23 Nov 2026).

   The owner's article: Eli Yitzhak's diary of the June 2026 Peaks of the Balkans group, a page of
   its own design (src/components/web_v2/BalkanDiary.jsx, balkanDiary.css) with the route map that
   fills in while you read, the night ribbon, the photos and the flip cards. The page's React
   source was lost; it is rebuilt here from its compiled preview (claude.ai artifact
   7XKkAYbFMvrT6JKsVkDEgS). Every Hebrew word, number, caption and alt below is the owner's,
   copied from that page character for character (the day, card and "what awaits you" arrays were
   taken out of the preview's code by script). The English (en. site) is a faithful translation,
   with the trail's place names spelled as the trip page spells them (mockData.js).

   One place for the words: BalkanDiary.jsx draws them, and blogData.js builds the post's text
   blocks from them (diaryBlocks), which the static page gives readers without JavaScript
   (scripts/lib/text-layer.mjs). Plain data only: the build scripts import it in Node. */

export const DIARY_SLUG = 'peaks-of-the-balkans-diary';
export const diaryImg   = id => `/images/blog/balkan-diary/${id}.webp`;
export const TRIP_PATH  = '/expedition/peaks-of-balkan';
export const GUIDE_PATH = '/blog/peaks-of-the-balkans-trek-guide';
export const HERO_PHOTO = '107';
export const CTA_PHOTO  = '114';

/* The page's icon set: 24x24 stroke paths */
export const ICONS = {
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  route: 'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 17h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7',
  up: 'm3 17 6-6 4 4 8-8M15 7h6v6',
  down: 'm3 7 6 6 4-4 8 8M15 17h6v-6',
  peak: 'm3 20 6.5-12 4 7 2.5-4L21 20H3Zm6.5-12 1.8 3.3',
  cal: 'M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
  snow: 'M12 2v20M4.9 6l14.2 12M19.1 6 4.9 18M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5',
  boat: 'M3 17s2 2 4.5 2S12 17 12 17s2 2 4.5 2S21 17 21 17M5 14l1-5h12l1 5M12 4v5',
  bed: 'M3 18v-7m0 3h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  wifi: 'M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z',
  users: 'M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 9v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  compass: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-5-4-2 6-6 2 2-6 6-2Z',
  shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z',
  bunker: 'M3 19h18M5 19v-5a7 7 0 0 1 14 0v5M9 15h6',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  therm: 'M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0Z',
  star: 'm12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7L12 3Z',
  pillar: 'M9 21h6M10 21V8h4v13M8 8h8l-1-3H9L8 8Z',
  video: 'M15 10.5 21 7v10l-6-3.5M3 6.5h12v11H3z',
  chat: 'M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20.5l1.4-5A8.5 8.5 0 1 1 21 11.5Z',
  home: 'M3 11 12 4l9 7M5.5 9.5V20h13V9.5M10 20v-5h4v5',
  plane: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
};

/* Each photo's size in pixels: every <img> gets its width and height */
export const PHOTO_SIZE = {
  '005': [1153, 864],
  '007': [868, 982],
  '008': [1200, 1197],
  '011': [1153, 648],
  '016': [1153, 533],
  '018': [671, 363],
  '019': [1159, 869],
  '024': [1151, 1151],
  '026': [1155, 650],
  '028': [1093, 614],
  '030': [1008, 1008],
  '032': [1151, 863],
  '036': [1006, 1006],
  '037': [1096, 822],
  '041': [1153, 648],
  '043': [1109, 832],
  '059': [547, 973],
  '061': [1153, 648],
  '062': [835, 1113],
  '063': [1132, 636],
  '064': [1129, 634],
  '068': [1153, 648],
  '070': [1153, 648],
  '076': [1153, 648],
  '077': [1153, 648],
  '081': [751, 1004],
  '082': [1151, 863],
  '084': [792, 1056],
  '090': [900, 1200],
  '091': [1149, 863],
  '092': [1153, 864],
  '095': [675, 1200],
  '096': [1200, 675],
  '097': [1153, 864],
  '099': [1153, 864],
  '100': [978, 1200],
  '101': [1046, 784],
  '103': [900, 1200],
  '105': [693, 923],
  '107': [1200, 900],
  '108': [675, 1200],
  '109': [1048, 785],
  '110': [1044, 587],
  '111': [1153, 864],
  '112': [1200, 675],
  '114': [1153, 864],
  '115': [948, 711],
};

/* Where each photo is centred when it is cropped (CSS object-position; 50% 50% for one not
   listed), as the owner's page sets it */
export const PHOTO_POS = {
  '005': '50% 35%',
  '007': '50% 30%',
  '008': '50% 45%',
  '011': '50% 30%',
  '016': '60% 50%',
  '018': '45% 50%',
  '019': '50% 58%',
  '024': '50% 45%',
  '026': '42% 40%',
  '028': '65% 45%',
  '030': '50% 65%',
  '032': '50% 30%',
  '036': '50% 25%',
  '037': '50% 40%',
  '041': '50% 45%',
  '043': '45% 35%',
  '059': '50% 30%',
  '061': '50% 40%',
  '062': '50% 55%',
  '063': '40% 55%',
  '064': '50% 55%',
  '068': '50% 55%',
  '070': '50% 55%',
  '076': '55% 50%',
  '077': '50% 45%',
  '081': '45% 32%',
  '082': '55% 45%',
  '084': '50% 40%',
  '090': '50% 45%',
  '091': '50% 50%',
  '092': '50% 45%',
  '095': '50% 60%',
  '096': '45% 50%',
  '097': '40% 55%',
  '099': '50% 40%',
  '100': '50% 55%',
  '101': '50% 55%',
  '103': '50% 68%',
  '105': '50% 65%',
  '107': '50% 35%',
  '108': '50% 45%',
  '109': '50% 45%',
  '110': '50% 50%',
  '111': '50% 50%',
  '112': '50% 50%',
  '114': '50% 55%',
  '115': '50% 60%',
};
export const photoPos = id => PHOTO_POS[id] || '50% 50%';

/* The three countries: the colour of the day badges, the ribbon and the photo captions */
export const COUNTRY_COLOR = { AL: '#6D28D9', XK: '#0EA5E9', ME: '#D97706' };

/* The route map (viewBox 600x440): where each night's stop sits, day 1 to 9, and the route through them */
export const MAP_STOPS = [[95, 372], [300, 196], [252, 166], [352, 120], [452, 108], [300, 44], [188, 74], [190, 222], [128, 340]];
export const MAP_ROUTE = 'M95 372 L150 345 C200 325 240 312 270 292 S312 258 332 246 L300 196 L232 132 L252 166 L352 120 L452 108 L402 72 L346 48 L300 44 L188 74 L174 104 L190 222 C162 292 132 330 128 340 L95 372';

/* ── Hebrew: the owner's words ───────────────────────────────────────── */

const HE_DAYS = [
  {
    d: 1,
    date: 'שני, 8 ביוני',
    place: 'שקודרה',
    country: 'AL',
    title: 'מנתב״ג לשקודרה, בלילה שלא היה ברור אם נטוס',
    facts: [
      ['boat', 'טיסה של כשעתיים וחצי'],
      ['route', 'טירנה ← שקודרה'],
      ['bed', 'לילה ראשון בשקודרה'],
    ],
    body: [
      'המסע התחיל עוד לפני ההמראה. בערב שלפני הטיסה נשמעו אזעקות, חברי הקבוצה מחיפה ישבו במקלטים ובקבוצת הווטסאפ שאלו אם המרחב האווירי יישאר פתוח. בשתיים בלילה כולם כבר היו בנתב״ג, עם תדרוך מחן שקד, חולצות המסע ודגל HighAir. ב-5:30 המראנו בדיוק בזמן.',
      'בטירנה חיכה לנו הצוות המקומי, מדריך ועוזר מדריך, ומשם יצאנו צפונה לשקודרה, דרך עמק ירוק של כרמים, תירס ובתים כפריים. מבצר רוזפה היה סגור באותו יום כי ראש ממשלת אלבניה הקדים אותנו, אז ירדנו לטיילת של אגם שקודרה, האגם הגדול בבלקן, שלדברי אלי "מזכיר קצת את הכינרת".',
      'אחר הצהריים סיירנו בעיר: הקתדרלה הקתולית, המדרחוב והמסגד הגדול עם צריחיו, כמה דקות הליכה זה מזה. בערב, בארוחה חגיגית של אוכל בלקני, עשינו סבב היכרות וסגרנו את היום בקפה טורקי ובקלאווה.',
    ],
    photos: [
      ['005', 'הקבוצה בנתב״ג עם דגל HighAir בשתיים בלילה'],
      ['011', 'אגם שקודרה והרים ברקע'],
      ['007', 'המסגד הגדול של שקודרה'],
      ['008', 'המדרחוב של שקודרה בערב'],
      ['016', 'ארוחת ההיכרות של הקבוצה'],
    ],
  },
  {
    d: 2,
    date: 'שלישי, 9 ביוני',
    place: 'ואלבונה',
    country: 'AL',
    title: 'שייט טורקיז באגם קומאני וההליכה הראשונה בעמק ואלבונה',
    facts: [
      ['boat', 'כשעתיים שייט'],
      ['clock', '3 שעות הליכה'],
      ['route', '6.5 ק"מ'],
    ],
    body: [
      'יציאה ב-6:00 בבוקר, כדי להספיק לעבור במנהרה חד סטרית בדרך למעגן. משם עלינו על המעבורת של אגם קומאני לשעתיים של מים בצבע טורקיז, מצוקים מיוערים שגולשים למים ובקתות בודדות למי שרוצה להתנתק מהעולם. מדי פעם הציצו באופק הפסגות שאליהן היינו בדרך.',
      'אחרי ארוחת צהריים במסעדה מקומית התחלנו לצעוד: מהכפר דרגוביה לאורך נהר ואלבונה, נחל שוצף עם מפלונים וגשרונים. חנה, מחברות הקבוצה, לקחה על עצמה את משימת התמונה הקבוצתית עם דגל HighAir, משימה שליוותה אותנו עד היום האחרון.',
      'הנסיעה לבית ההארחה הייתה חוויה בפני עצמה: דרך עפר תלולה, והמיניבוס נסוג לאחור וניסה שוב ושוב עד שעלה. בערב, בחדר אוכל חמים, התפתחה שיחה ספונטנית על נפש האדם, והתחלנו לפגוש מטיילים שילוו אותנו בבקתות לאורך כל השביל.',
    ],
    photos: [
      ['024', 'קניון טורקיז באגם קומאני'],
      ['018', 'המעבורת שטה באגם קומאני'],
      ['019', 'מטיילות על סיפון המעבורת'],
      ['026', 'גשרון עץ בעמק ואלבונה'],
      ['028', 'חציית נחל שוצף'],
      ['030', 'בריכת טורקיז בנהר ואלבונה'],
    ],
    know: 'אגם קומאני נראה כמו פיורד, אבל הוא בכלל מאגר שנוצר מסכר לייצור חשמל על נהר הדרין, שהציף עמקים צרים בין מדרונות תלולים.',
  },
  {
    d: 3,
    date: 'רביעי, 10 ביוני',
    place: 'צ׳רם',
    country: 'AL',
    title: 'שלג ביוני ומעבר פריסלופי על גבול מונטנגרו',
    facts: [
      ['clock', '10.5 שעות הליכה'],
      ['route', '16 ק"מ'],
      ['up', "1,000 מ' עלייה מצטברת"],
      ['peak', "שיא: 2,030 מ'"],
    ],
    body: [
      'היום הארוך הראשון. יצאנו קצת אחרי שבע לעלייה תלולה ומפותלת ביער מוצל, ואחרי כ-400 מטר התגלה הנוף: עמקים רחבים ופסגות עם כיפות שלג. זו הייתה הפעם הראשונה שראינו את פסגות הבלקן מגובה.',
      'ארוחת הבוקר השנייה הייתה באמצע שדה פורח, צהוב, אדום, סגול וורוד, ושם עבר לידנו זוג צעיר עם תינוק בן כמה חודשים במנשא. ככל שעלינו הופיעו נקיקים מלאי שלג, ושלוש פעמים פשוט החלקנו עליהם במסלולים שהמדריכים הכשירו.',
      'בשיא, מעבר פריסלופי בגובה 2,030 מטר, עומד שלט הגבול בין אלבניה למונטנגרו. עצרנו לצהריים, וריח הקפה שעוזר המדריך הכין משך אלינו קבוצה שלמה של מטיילים אירופאים. משם ירידה ארוכה בשלג, בוץ ובולדרים, עמק חקלאי במונטנגרו, יער צונן בחזרה באלבניה, ובסוף ארוחת ערב לבבית בכפר צ׳רם.',
    ],
    photos: [
      ['032', 'פסגות ואלבונה באור שקיעה ורוד'],
      ['036', 'תצפית על עמק ואלבונה'],
      ['037', 'כר דשא פורח מול הרים'],
      ['041', 'חציית שדה שלג בדרך למעבר'],
      ['043', 'שתי מטיילות על השלג'],
      ['059', 'מחליקים במורד מדרון שלג'],
    ],
    quote: [
      '"לקפה השחור שהכין לנו בלב ההרים היה טעם מיוחד, כזה שקשה לשחזר בבית, גם עם אותם פולי קפה."',
      'אלי, על הקפה של עוזר המדריך',
    ],
  },
  {
    d: 4,
    date: 'חמישי, 11 ביוני',
    place: 'דוברדול',
    country: 'AL',
    title: 'יערות עד, עצים שהברק שרף ומרעה הרועים של דוברדול',
    facts: [
      ['clock', '10 שעות הליכה'],
      ['up', "1,000 מ' עלייה מתונה"],
      ['flag', 'אבן גבול נוספת'],
    ],
    body: [
      'יום עם אותה עלייה כמו אתמול, רק מתונה ופרוסה על מרחק ארוך יותר. התחלנו ביער עם נחל גועש שחצינו בזהירות, עלינו בכר דשא מכוסה פרחים והגענו לבית קפה עם תצפית, שם פגשנו שוב מטיילים מהמעבורת של היום השני.',
      'אחרי אבן גבול נוספת בין אלבניה למונטנגרו נכנסנו ליער צפוף, עקפנו עצים שקרסו תחת משקל השלג, וראינו עצים שהבסיס שלהם שרוף כליל. המדריך הסביר: הברק פוגע בצמרת, הזרם יורד במורד הגזע וכל האנרגיה מתפרקת בתחתית.',
      'בדרך עצרנו לשיחה עם משפחה שמגדלת ירקות בהרים בחודשי הקיץ. לפני ההפסקה הבאה המדריך קרא בקול לעבר כמה בתים בודדים, ובעל המקום ענה לו מההד. היוגורט המפורסם של בעלת הבית כבר נגמר, אבל העוגה והקפה פיצו. בערב, בבקתות ליד נחל שוצף בדוברדול, מוזיקה, מטיילים מכל העולם, ובלילה גשם.',
    ],
    photos: [
      ['063', 'חציית אחו ירוק עם עץ בודד'],
      ['064', 'אבן גבול בין אלבניה למונטנגרו'],
      ['068', 'הקבוצה מתקרבת לבקתות רועים'],
      ['070', 'ירידה אל עמק דוברדול'],
      ['062', 'ארוחת ערב ביתית בבקתה'],
      ['061', 'הקבוצה בארוחת ערב בבקתת עץ'],
    ],
  },
  {
    d: 5,
    date: 'שישי, 12 ביוני',
    place: 'גאצפר, קוסובו',
    country: 'XK',
    title: 'ערפל על הרכס, ההחלטה הנכונה וקידוש בקוסובו',
    facts: [
      ['clock', '6 שעות הליכה'],
      ['peak', "יעד מקורי: ג׳רביצה 2,656 מ'"],
      ['bed', 'לינה בקוסובו'],
    ],
    body: [
      'אחרי לילה של גשם זלעפות התעוררנו לערפל סמיך, קור ואפור. במעילים, כובעי צמר וכפפות חצינו את הנחל על בול עץ גבוה ועלינו בלי שביל מסומן לעבר האוכף שמתחת לפסגת ג׳רביצה, מהגבוהות באזור.',
      'באוכף אי אפשר היה לראות כמה עשרות מטרים קדימה, והעלייה על קו הרכס הייתה מסוכנת. המדריכים החליטו לוותר ולהוביל אותנו לפסגה נמוכה יותר, כזו שאפשר להגיע לראשה בבטחה. ככה נראית הדרכה טובה: הפסגה לא בורחת, הקבוצה חוזרת שלמה.',
      'הצהריים הביאו שמיים פתוחים וירידה לעמק שנראה, כך כתב אלי, כמו שווייץ או אוסטריה. לאורך היום ליוו אותנו שני כלבים שהופיעו ונעלמו כבר שלושה ימים, עשרות קילומטרים מהמקום שבו פגשנו אותם. בערב, בהוסטל משפחתי בגאצפר שבקוסובו, עשינו קידוש, הבנות הדליקו נרות, וכל אחד בתורו השמיע שיר שהוא אוהב, כולל התיירים שהזמנו להצטרף.',
    ],
    photos: [
      ['082', 'הקבוצה בפסגה החלופית בערפל'],
      ['076', 'טיפוס במדרון ירוק בערפל'],
      ['077', 'שדה שלג באחו'],
      ['081', 'הפסקה על הסלעים'],
      ['084', 'טור מטיילים על רכס מושלג'],
    ],
  },
  {
    d: 6,
    date: 'שבת, 13 ביוני',
    place: 'באבינו פוליה',
    country: 'ME',
    title: 'ריקוד סביב משולש הגבולות ואגם חריד הטורקיזי',
    facts: [
      ['clock', '10 שעות הליכה'],
      ['route', '19 ק"מ'],
      ['flag', '3 מדינות בצעד אחד'],
    ],
    body: [
      'תמונה קבוצתית עם בעלת הבית שאירחה אותנו בחום, ויצאנו לטיפוס מתון בקוסובו, עם עצירות לשתות מים קרים וצלולים ישר מהנחל, במקומות שהמדריכים אישרו. ליד שלט הכיוונים על הרכס המדריך עצר להסביר על דגל קוסובו: ששת הכוכבים מסמלים את שש הקהילות האתניות של המדינה.',
      'ואז הגענו למשולש הגבולות. אלי ציפה לאנדרטה, ומצא עמוד נמוך של חצי מטר, שריד לגבול הישן בין אלבניה ליוגוסלביה. אז עשינו מה שקבוצה ישראלית עושה: מעגל ריקודים סביב העמוד, צעד בקוסובו, צעד באלבניה, צעד במונטנגרו.',
      'הירידה מהרכס עברה בשלג חלקלק על מדרונות תלולים, עם מסלולי החלקה שהמדריכים הכשירו, ומשם בשדה סלעים אל אגם חריד, אגם טורקיז בלב יער אלפיני. עוגת פירות יער בקמפינג, ובאבינו פוליה בעל הבית הגיש את ארוחת הערב כמו הצגת תיאטרון של ממש.',
    ],
    photos: [
      ['091', 'אגם חריד מוקף עצי מחט'],
      ['090', 'יערות אשוח ואגם מלמעלה'],
      ['092', 'השתקפות עננים באגם חריד'],
    ],
    know: 'לאורך השביל עדיין עומדות אבני גבול מתקופת יוגוסלביה. במסע הזה חוצים גבולות שוב ושוב, לפעמים כמה פעמים ביום.',
  },
  {
    d: 7,
    date: 'ראשון, 14 ביוני',
    place: 'עמק גרבאיה',
    country: 'ME',
    title: 'ארבע פסגות על רכס אחד מעל עמק גרבאיה',
    facts: [
      ['up', "700 מ' עלייה לרכס"],
      ['peak', "2,037 ו-2,057 מ'"],
      ['users', 'ארוחת על האש'],
    ],
    body: [
      'נסיעה דרך העיירה פלאב, כנסייה ומסגד זה לצד זה, אל שמורת הטבע של עמק גרבאיה. משם 700 מטר עלייה תלולה עד קו הרכס, והיעד: לעבור בארבע הפסגות שלאורכו.',
      'הפסגה הראשונה, 2,037 מטר, דרשה עלייה מאומצת בשביל צר עם מדרונות משני הצדדים. ירידה תלולה, ושוב עלייה לפסגה השנייה, 2,057 מטר. בדרך פגשנו קבוצה גדולה של צעירים מרוסיה ומאוקראינה שמטיילים יחד.',
      'את הצהריים אכלנו על שלוחה של הרכס, מול מדרון דשא תלול וצוקים בשחור ואפור כהה של רכס קראנפילי. אחר כך עוד שתי פסגות, ירידה ארוכה, ובערב ארוחה חגיגית על האש עם סטייקים.',
    ],
    photos: [
      ['096', 'הקבוצה יושבת לצהריים על קו הרכס'],
      ['095', 'טור מטיילים בשביל צר על רכס'],
      ['097', 'סלפי של הקבוצה בהפסקה'],
      ['099', 'עמק גרבאיה וצוקי קראנפילי'],
    ],
  },
  {
    d: 8,
    date: 'שני, 15 ביוני',
    place: 'ת׳ת',
    country: 'AL',
    title: 'מפל שנבלע בהר, והירידה הגדולה אל ת׳ת',
    facts: [
      ['down', "1,200 מ' ירידה ב-4 שעות"],
      ['route', 'ווסאניה ← ת׳ת'],
      ['flag', 'מונטנגרו ← אלבניה'],
    ],
    body: [
      'בדרך בג׳יפים לנקודת ההתחלה עצרנו בשני פלאי טבע: מפל שמימיו נשפכים לתוך פיר בהר ונעלמים, ו"העין הכחולה" של מונטנגרו, בריכת טורקיז בעומק 8 מטרים שמוזנת ממעיין מבטן האדמה.',
      'מהר מאוד הגענו לאבן גבול יוגוסלבית ישנה ונכנסנו שוב לאלבניה. 700 מטר עלייה עד הפס, צהריים על כר דשא מול העמק שאליו היינו בדרך, ואז הירידה הגדולה: 1,200 מטר בארבע שעות, עם עצירה בבית קפה בטבע.',
      'בשבע בערב נכנסנו לת׳ת, אחד הכפרים המפורסמים באלבניה, לארוחה עשירה במיוחד: מרק חם, לחמים טריים, יין מקומי, עוף, בקר ועוגה. זה היה יום ההליכה הגדול האחרון.',
    ],
    photos: [
      ['101', 'העין הכחולה של מונטנגרו'],
      ['100', 'נחל טורקיז ביער'],
      ['103', 'הקבוצה בשביל מול צוקים'],
      ['105', 'אבן גבול יוגוסלבית ישנה'],
    ],
    know: 'בסלע גירני המים חודרים לסדקים, זורמים מתחת לאדמה ופורצים במעיינות צלולים. לתופעה קוראים קרסט, והיא מסבירה גם את המפל הנעלם וגם את העין הכחולה.',
  },
  {
    d: 9,
    date: 'שלישי, 16 ביוני',
    place: 'חזרה לשקודרה',
    country: 'AL',
    title: 'העין הכחולה של ת׳ת וסגירת המעגל בשקודרה',
    facts: [
      ['therm', 'מים של כ-4 מעלות'],
      ['drop', 'מפל גרונאס'],
      ['users', 'ארוחת סיום'],
    ],
    body: [
      'בבוקר עצרנו ליד מגדל ההסתגרות של ת׳ת, מבנה ששימש מקלט זמני למי שהיה מעורב בסכסוך דמים, עד שזקני השבטים הכריעו בעניינו לפי הקאנון, מערכת המנהגים המסורתית של צפון אלבניה. המשכנו לאורך הנחל עד מפל גרונאס, שנראה כאילו הוא פורץ ישר מתוך ההר.',
      'את הנסיעה הבאה עשינו ב"רכב הסרדינים", עם שני המדריכים דחוקים יחד במושב הקדמי. היעד: העין הכחולה של ת׳ת, בריכות בגווני טורקיז ותכלת. המים קרים, סביב 4 מעלות, ורק חנה הייתה אמיצה מספיק לטבול.',
      'בדרך חזרה לשקודרה עצרנו בתצפית אחרונה על הפסגות שבהן צעדנו שמונה ימים. בערב, בחצר מלון טרדיטה, ארוחת סיום כיד המלך, זמר הבית, סיכום של המדריך ונאום תודה בשם הקבוצה.',
    ],
    photos: [
      ['112', 'בריכת טורקיז צלולה בין סלעים'],
      ['108', 'מפל גבוה ליד ת׳ת'],
      ['109', 'סלפי צפוף ברכב הסרדינים'],
      ['110', 'מטיילים בין סלעים ובריכות'],
      ['111', 'העין הכחולה של ת׳ת'],
      ['114', 'מבט אחרון על פסגות הבלקן'],
      ['115', 'חצר מלון טרדיטה בשקודרה'],
    ],
  },
];

const HE = {
  seoTitle:    'פסגות הבלקן: יומן מסע של 10 ימים ב-3 מדינות',
  description: 'יומן המסע של אלי יצחק מטרק פסגות הבלקן עם HighAir ביוני 2026: אגם קומאני, שלג ביוני, משולש הגבולות והעין הכחולה של ת׳ת.',
  countries:   { AL: 'אלבניה', XK: 'קוסובו', ME: 'מונטנגרו' },
  /* the days a border was crossed: the ribbon's flag and its title */
  crossings:   {
    3: 'אלבניה ← מונטנגרו ← אלבניה',
    4: 'אבן גבול',
    5: 'אלבניה ← קוסובו',
    6: 'משולש הגבולות',
    8: 'מונטנגרו ← אלבניה',
  },
  days:        HE_DAYS,
  hero: {
    alt:      'עמק ירוק ופסגות סלעיות ברכס פרוקלטיה',
    badges:   ['יומן מסע', 'יוני 2026', '9 דקות קריאה'],
    h1:       'פסגות הבלקן: 10 ימים, 3 מדינות, שביל אחד',
    sub:      'אלבניה, מונטנגרו וקוסובו דרך העיניים של מי שצעד בהן. מסע HighAir לאורך השביל שחוצה את "האלפים האלבניים", כפי שתיעד אותו המטייל אלי יצחק.',
    initials: 'א״י',
    basedOn:  'מבוסס על יומן המסע של ',
    author:   'אלי יצחק',
    role:     ', משתתף במסע',
    photos:   'תמונות: אלי יצחק וחברי הקבוצה',
  },
  glance: {
    title:      'המסע במבט אחד',
    triAria:    'אלבניה, קוסובו ומונטנגרו נפגשות במשולש הגבולות',
    /* flag file, name, x of the flag's centre */
    triFlags:   [['al', 'אלבניה', 80], ['xk', 'קוסובו', 210], ['me', 'מונטנגרו', 340]],
    triCaption: 'משולש הגבולות · יום 6',
    tiles: [
      ['cal', '10', 'ימים', 'אלבניה, קוסובו ומונטנגרו'],
      ['peak', '2,057', "מ'", 'הפסגה הגבוהה שעלינו'],
      ['route', '19', 'ק"מ', 'ביום הארוך ביותר'],
      ['down', '1,200', "מ'", 'ירידה ביום אחד'],
    ],
  },
  back: '→ לכל המאמרים',
  intro: {
    h2:    'שביל אחד, שלוש מדינות וחבורה אחת',
    paras: [
      'ביוני האחרון יצאה קבוצת HighAir לטרק פסגות הבלקן, שביל שמחבר בין כפרי הרים שהיו פעם מבודדים משני צדי הגבול, ברכס פרוקלטיה שהמקומיים קוראים לו "ההרים המקוללים".',
      'אלי יצחק, אחד המטיילים, חזר הביתה עם יומן של 74 עמודים: עליות ארוכות, שלג ביוני, כרי דשא פורחים, קפה שחור בלב ההרים ובדיחות שרק מי שהיה שם יבין. ליקטנו ממנו את הרגעים הכי טובים, יום אחרי יום.',
    ],
    quote: 'לא רק הפסגות קובעות את גובה החוויה, אלא גם האנשים שאיתם מטפסים אליהן.',
    cite:  'אלי יצחק, מתוך היומן',
  },
  /* Chapter 0, before the first day: thanks, the region, the weeks of preparation */
  prologue: {
    kicker:  'פרק 0',
    h2:      'לפני שיצאנו לדרך',
    lead:    'היומן של אלי לא מתחיל בטיסה. הוא נפתח בתודות, ברקע על האזור ובשבועות של הכנה בארץ. גם אנחנו מתחילים משם.',
    letter: {
      photo:   '096',
      alt:     'הקבוצה יושבת על קו הרכס מעל עמק גרבאיה',
      kicker:  'פתיחה ותודות',
      quote:   '"יש טיולים שחוזרים מהם עם תמונות יפות, ויש מסעות שחוזרים מהם עם הרבה יותר: חוויות, סיפורים, חברויות חדשות, רגעים משעשעים וזיכרונות שנשארים איתנו הרבה אחרי שחוזרים הביתה."',
      sigNote: 'מתוך היומן, נובמבר 2026',
    },
    thanksTitle: 'תודה גדולה',
    /* icon, to whom, what for */
    thanks: [
      ['compass', 'לצוות המקומי', 'שהוביל אותנו בשבילי ההרים במקצועיות, באחריות ובידע רב. הם הסבירו לאורך כל הדרך על הגיאוגרפיה, ההיסטוריה והתרבות של האזור, דאגו שאף אחד לא יישאר מאחור, ועזרו במעברים הקשים. והקפה השחור בהפסקות? אולי האוויר, אולי הנוף, ואולי פשוט היד הטובה.'],
      ['shield', 'ל-HighAir, לחן ולאדיר', 'על התכנון, הארגון, התיאום והליווי, ועל הצוות המקומי שסידרו לנו. משלבי ההכנה בארץ ועד הסיום המוצלח של המסע, ההשקעה בפרטים הקטנים והגדולים הורגשה לאורך כל הדרך.'],
    ],
    group: {
      title: 'ולחברי הקבוצה',
      note:  '13 אנשים שהפכו לחבורה אחת',
      names: ['חנה', 'נתי', 'מורן', 'ענת', 'אבי', 'שלמה', 'אילן', 'נוף', 'ולדימיר', 'מיכאל', 'מריוס', 'ערן', 'עמית'],
      quote: '"כל אחד ואחת הביאו למסע משהו משלהם: סיפור חיים, ניסיון, חוש הומור, רגישות, סקרנות, נכונות לעזור ואהבה לטבע ולהליכה."',
    },
    moments: {
      title: 'ותודה גם על הרגעים הקטנים',
      items: [
        'למי שחיכה לאחרים',
        'למי שהושיט יד במעבר קשה',
        'למי שצילם',
        'למי שדאג לתמונה הקבוצתית',
        'למי שפתח בשיחה מעניינת',
        'למי שידע לשחרר בדיחה בדיוק כשהרגליים התחילו להתעייף',
      ],
      end: '"אלה הדברים שהופכים קבוצת מטיילים לחבורה."',
    },
    geo: {
      photo:  '036',
      alt:    'רכס פרוקלטיה מעל עמק ואלבונה',
      kicker: 'רקע גיאוגרפי',
      h3:     'פסגות הבלקן, Peaks of the Balkans',
      paras: [
        'השביל חוצה את אזור ההרים שבו נפגשות אלבניה, קוסובו ומונטנגרו. רכס פרוקלטיה, שמכונה גם האלפים האלבניים או ההרים המקוללים, הוא עולם של רכסים משוננים, עמקים עמוקים, יערות, מרעה אלפיני ונחלים רבים.',
        'השביל מחבר בין כפרים שהיו פעם מבודדים משני צדי הגבולות, והפך את הנוף ההררי ואת מסורת האירוח המקומית לחוויה של מסע חוצה גבולות.',
      ],
      facts: [['flag', '3 מדינות על שביל אחד'], ['peak', 'רכסים משוננים ועמקים עמוקים'], ['bed', 'לינה בבתי משפחות בכפרי ההרים']],
    },
    prep: {
      kicker: 'שלב ההכנה',
      h3:     'מנחל יגור לנתב״ג',
      p:      'ההכנות התחילו כמה שבועות לפני היציאה. HighAir ארגנה מפגשי הכנה כדי להכיר למטיילים את אופי המסלול, את תנאי השטח ואת הציוד שצריך לטרק הררי ארוך.',
      /* icon, when, what, the note */
      steps: [
        ['peak', '1 במאי', 'טרק הכנה בנחל יגור', 'בהרי הכרמל, בהדרכת רועי כרמל. הטעימה הראשונה מקצב הליכה של קבוצה.'],
        ['video', '6 במאי', 'מפגש הדרכה בזום', 'ציוד, תוואי המסלול והתנאים הצפויים בהרים.'],
        ['chat', 'במקביל', 'קבוצת הווטסאפ נפתחת', 'מזוודות, ביטוח, סים מקומי וכסף, ולאט לאט גם הומור ועזרה הדדית.'],
        ['home', 'שבועות לפני', 'ערב היכרות בכפר סבא', 'סביב שולחן האוכל בביתה של ענת. שם הקבוצה התחילה להפוך לחבורה.'],
        ['plane', '8 ביוני, 2:00', 'נתב״ג, ממריאים', 'תדרוך אחרון מחן שקד, חולצות המסע ודגל HighAir.'],
      ],
    },
  },
  ribbon: {
    aria:          'איפה ישנו בכל לילה',
    h2:            '9 לילות, 3 מדינות',
    lead:          'איפה ישנו בכל לילה, ובאילו ימים חצינו גבול. לחצו על יום כדי לקפוץ אליו.',
    crossing:      'חציית גבול',
    crossingTitle: 'חציית גבול: ',
  },
  chipsAria: 'ניווט בין ימי המסע',
  day:       'יום',
  sleep:     'לינה ב',
  zoom:      'הגדלת תמונה: ',
  know:      'הידעת?',
  map: {
    aria:     'מפת המסלול',
    title:    'המסלול שלנו',
    hint:     'לחצו על נקודה',
    svgAria:  'מפה סכמטית של המסלול באלבניה, מונטנגרו וקוסובו',
    tripoint: 'משולש הגבולות',
    pass:     'פריסלופי 2,030',
    lakes:    { komani: 'אגם קומאני', shkodra: 'אגם שקודרה', hrid: 'אגם חריד' },
    dayOf:    ['יום ', ' מתוך 10'],
    note:     'מפה סכמטית להמחשה. הקו מתמלא תוך כדי קריאה.',
  },
  cards: {
    h2:    '6 דברים שלמדנו בדרך',
    lead:  'לחצו על כרטיס כדי להפוך אותו.',
    hint:  'לחצו להסבר ↺',
    /* icon, the big figure, its label, the back of the card */
    items: [
      ['bunker', '70,000', 'בונקרים', 'מפוזרים ברחבי אלבניה בנקודות הגנה אסטרטגיות. ראינו כמה מהם כבר ביום ההליכה הראשון.'],
      ['wifi', '30×30', 'ס"מ של אינטרנט', 'בכמעט כל בקתה בהרים מותקנת אנטנת סטארלינק לבנה. גם בלב פרוקלטיה אפשר לשלוח הביתה תמונה מהפסגה.'],
      ['star', '6', 'כוכבים על הדגל', 'דגל קוסובו, שאומץ ב-2008, מציג את מפת המדינה ומעליה שישה כוכבים, אחד לכל קהילה אתנית מרכזית.'],
      ['therm', '4°', 'מעלות במים', 'בערך הטמפרטורה בעין הכחולה של ת׳ת. מכל הקבוצה רק חנה העזה לטבול.'],
      ['pillar', '50', 'ס"מ של היסטוריה', 'זה הגובה של עמוד משולש הגבולות בין אלבניה, קוסובו ומונטנגרו. צנוע, אבל מושלם למעגל ריקודים.'],
      ['bolt', '1', 'ברק, עץ שרוף', 'הברק פוגע בצמרת, הזרם יורד במורד הגזע וכל האנרגיה מתפרקת בבסיס ושורפת אותו מבפנים.'],
    ],
  },
  vibe: {
    h2:    'ההווי: מה שלא רואים בתמונות מהפסגה',
    lead:  'שעות הליכה ארוכות, עליות מאומצות ולינה משותפת בבקתות הופכות קבוצת זרים לחבורה עם שפה משלה. כמה מהביטויים שנולדו בדרך:',
    calls: [
      ['״יודית!״', 'קריאה ממערכון ישראלי מוכר שהפכה לבדיחה הפנימית של המסע. היא נשמעה פתאום באמצע עלייה, בהפסקות ובערבים, ותמיד הביאה צחוק.'],
      ['״שושנה!״', 'שם של דמות מסרט של טרנטינו שקיבל אצלנו חיים משלו, והצטרף לרשימת הקריאות שרק מי שהיה שם יבין.'],
      ['״קרדשיאן״', 'שיבוש משעשע של "כר דשא". והיו הרבה כרי דשא לאורך המסלול. ובין לבין: שירים, הרבה שירים, בהובלת אילן וענת.'],
    ],
  },
  expect: {
    h2:    'מה מחכה לכם בטרק פסגות הבלקן',
    items: [
      ['compass', 'ההכנה מתחילה בארץ', 'טרק הכנה בנחל יגור, מפגש זום על ציוד ותנאי השטח, קבוצת ווטסאפ ומפגש היכרות לפני הטיסה.'],
      ['clock', 'ימים של 6 עד 10.5 שעות', 'עליות של עד 1,000 מטר ביום, ירידות ארוכות וכמה פסגות מעל 2,000 מטר. למי שאוהב אתגר ומגיע בכושר טוב.'],
      ['snow', 'שלג גם ביוני', 'בנקיקים המוצלים נשאר שלג לתחילת הקיץ, והמדריכים מכשירים מעברים ומסלולי החלקה בטוחים.'],
      ['bed', 'אירוח משפחתי בהרים', 'בתי הארחה ובקתות לאורך השביל, חדרים משותפים, ארוחות בלקניות ביתיות ואינטרנט לווייני כמעט בכל בקתה.'],
      ['flag', 'שלוש מדינות', 'שקודרה, אגם קומאני, ואלבונה, קוסובו, עמק גרבאיה ות׳ת, כפרים שהשביל החזיר למפה.'],
      ['shield', 'הדרכה שמחליטה נכון', 'כשהערפל סגר על הרכס, המדריכים שינו מסלול. בכל ערב סיכום של היום ותדרוך למחר.'],
    ],
    quote: '"מאחורי חוויית טיול מוצלחת עומדים הרבה מאוד פרטים קטנים וגדולים, וההשקעה בהם בהחלט הורגשה לאורך הדרך."',
    cite:  'אלי יצחק, משתתף במסע פסגות הבלקן, יוני 2026',
  },
  cta: {
    badge: 'המסע הבא',
    h2:    'רוצים להיות בתמונה הקבוצתית של המסע הבא?',
    p:     'שלג ביוני, אגמי טורקיז, משולש גבולות וחבורה שתישאר איתכם הרבה אחרי שתחזרו הביתה.',
    trip:  'לפרטים על המסע הבא',
    guide: 'המדריך המלא לטרק',
  },
  credit:   'תודה גדולה לאלי יצחק, שתיעד את המסע ביומן מרגש ונתן לנו לחלוק אותו. כל הציטוטים והתמונות באדיבותו ובאדיבות חברי הקבוצה. הדרכה בשטח: הצוות המקומי של HighAir.',
  lightbox: { aria: 'תצוגת תמונה', close: 'סגירה', prev: 'הקודמת', next: 'הבאה' },
};

/* ── English: a faithful translation, for the en. site ───────────────── */

const EN_DAYS = [
  {
    d: 1,
    date: 'Monday, June 8',
    place: 'Shkodra',
    country: 'AL',
    title: 'From Ben Gurion to Shkodra, on a night when it was not clear we would fly',
    facts: [
      ['boat', 'A flight of about two and a half hours'],
      ['route', 'Tirana → Shkodra'],
      ['bed', 'First night in Shkodra'],
    ],
    body: [
      'The journey began before we even took off. On the evening before the flight the sirens sounded, the group members from Haifa sat in shelters, and in the WhatsApp group people asked whether the airspace would stay open. By two in the morning everyone was already at Ben Gurion Airport, with a briefing from Chen Shaked, the trip shirts and the HighAir flag. At 5:30 we took off right on time.',
      'In Tirana the local team, a guide and an assistant guide, were waiting for us, and from there we headed north to Shkodra, through a green valley of vineyards, corn and village houses. Rozafa Castle was closed that day because the Prime Minister of Albania got there before us, so we went down to the promenade of Lake Shkodra, the largest lake in the Balkans, which according to Eli "is a bit like the Sea of Galilee".',
      'In the afternoon we toured the city: the Catholic cathedral, the pedestrian street and the great mosque with its minarets, a few minutes\' walk from one another. In the evening, over a festive dinner of Balkan food, we went around the table introducing ourselves and closed the day with Turkish coffee and baklava.',
    ],
    photos: [
      ['005', 'The group at Ben Gurion Airport with the HighAir flag at two in the morning'],
      ['011', 'Lake Shkodra with mountains behind it'],
      ['007', 'The great mosque of Shkodra'],
      ['008', 'The pedestrian street of Shkodra in the evening'],
      ['016', 'The group\'s getting-to-know-you dinner'],
    ],
  },
  {
    d: 2,
    date: 'Tuesday, June 9',
    place: 'Valbona',
    country: 'AL',
    title: 'A turquoise boat ride on Lake Komani and the first walk in the Valbona Valley',
    facts: [
      ['boat', 'About two hours on the water'],
      ['clock', '3 hours of walking'],
      ['route', '6.5 km'],
    ],
    body: [
      'We set off at 6:00 in the morning, to make it through a one-way tunnel on the way to the pier. There we boarded the Lake Komani ferry for two hours of turquoise water, wooded cliffs sliding down into the lake and lone cabins for anyone who wants to cut off from the world. Every now and then the peaks we were heading for peeked out on the horizon.',
      'After lunch at a local restaurant we started walking: from the village of Dragobia along the Valbona River, a rushing stream with little waterfalls and small bridges. Hana, one of the group, took on the mission of the group photo with the HighAir flag, a mission that stayed with us until the last day.',
      'The drive to the guesthouse was an experience in itself: a steep dirt road, with the minibus rolling back and trying again and again until it made it up. In the evening, in a warm dining room, a spontaneous conversation about the human soul took off, and we began meeting the trekkers who would share the huts with us all along the trail.',
    ],
    photos: [
      ['024', 'A turquoise canyon on Lake Komani'],
      ['018', 'The ferry sailing on Lake Komani'],
      ['019', 'Trekkers on the deck of the ferry'],
      ['026', 'A small wooden bridge in the Valbona Valley'],
      ['028', 'Crossing a rushing stream'],
      ['030', 'A turquoise pool in the Valbona River'],
    ],
    know: 'Lake Komani looks like a fjord, but it is actually a reservoir created by a hydroelectric dam on the Drin River, which flooded narrow valleys between steep slopes.',
  },
  {
    d: 3,
    date: 'Wednesday, June 10',
    place: 'Çerem',
    country: 'AL',
    title: 'Snow in June and the Prosllopi Pass on the border with Montenegro',
    facts: [
      ['clock', '10.5 hours of walking'],
      ['route', '16 km'],
      ['up', '1,000 m of total ascent'],
      ['peak', 'High point: 2,030 m'],
    ],
    body: [
      'The first long day. We set off a little after seven on a steep, winding climb through shady forest, and after about 400 meters the view opened up: wide valleys and peaks capped with snow. It was the first time we saw the Peaks of the Balkans from up high.',
      'Second breakfast was in the middle of a field in bloom, yellow, red, purple and pink, and there a young couple passed us with a baby of a few months in a carrier. The higher we climbed, the more snow-filled gullies appeared, and three times we simply slid down them on runs the guides had prepared.',
      'At the high point, the Prosllopi Pass at 2,030 meters, stands the border sign between Albania and Montenegro. We stopped for lunch, and the smell of the coffee the assistant guide made drew a whole group of European trekkers over to us. From there, a long descent through snow, mud and boulders, a farming valley in Montenegro, a cool forest back in Albania, and at the end a warm dinner in the village of Çerem.',
    ],
    photos: [
      ['032', 'The Valbona peaks in pink sunset light'],
      ['036', 'A view over the Valbona Valley'],
      ['037', 'A flowering meadow facing the mountains'],
      ['041', 'Crossing a snowfield on the way to the pass'],
      ['043', 'Two trekkers on the snow'],
      ['059', 'Sliding down a snow slope'],
    ],
    quote: [
      '"The black coffee he made us in the heart of the mountains had a special taste, the kind that is hard to recreate at home, even with the same coffee beans."',
      'Eli, on the assistant guide\'s coffee',
    ],
  },
  {
    d: 4,
    date: 'Thursday, June 11',
    place: 'Dobërdol',
    country: 'AL',
    title: 'Primeval forests, trees burnt by lightning and the shepherds\' pastures of Dobërdol',
    facts: [
      ['clock', '10 hours of walking'],
      ['up', '1,000 m of gentle ascent'],
      ['flag', 'Another border stone'],
    ],
    body: [
      'A day with the same climb as yesterday, only gentler and spread over a longer distance. We started in a forest with a raging stream that we crossed carefully, climbed through a meadow covered in flowers and reached a café with a view, where we met trekkers from the second day\'s ferry again.',
      'After another border stone between Albania and Montenegro we entered a dense forest, went around trees that had collapsed under the weight of the snow, and saw trees whose base was burnt right through. The guide explained: the lightning strikes the treetop, the current runs down the trunk and all the energy discharges at the bottom.',
      'On the way we stopped to talk with a family that grows vegetables in the mountains in the summer months. Before the next break the guide called out loudly toward a few lone houses, and the owner answered him through the echo. The famous yogurt of the lady of the house had already run out, but the cake and the coffee made up for it. In the evening, in the huts beside a rushing stream in Dobërdol: music, trekkers from all over the world, and at night, rain.',
    ],
    photos: [
      ['063', 'Crossing a green meadow with a lone tree'],
      ['064', 'A border stone between Albania and Montenegro'],
      ['068', 'The group approaching the shepherds\' huts'],
      ['070', 'Descending into the Dobërdol valley'],
      ['062', 'A home-cooked dinner in the hut'],
      ['061', 'The group at dinner in a wooden hut'],
    ],
  },
  {
    d: 5,
    date: 'Friday, June 12',
    place: 'Gacafar, Kosovo',
    country: 'XK',
    title: 'Fog on the ridge, the right decision and Kiddush in Kosovo',
    facts: [
      ['clock', '6 hours of walking'],
      ['peak', 'Original goal: Gjeravica 2,656 m'],
      ['bed', 'A night in Kosovo'],
    ],
    body: [
      'After a night of pouring rain we woke to thick fog, cold and grey. In jackets, wool hats and gloves we crossed the stream on a high log and climbed with no marked trail toward the saddle below the summit of Gjeravica, one of the highest in the region.',
      'At the saddle you could not see a few dozen meters ahead, and climbing onto the ridgeline was dangerous. The guides decided to give it up and lead us to a lower summit, one we could reach safely. This is what good guiding looks like: the summit is not going anywhere, and the group comes back whole.',
      'Midday brought open skies and a descent into a valley that looked, as Eli wrote, like Switzerland or Austria. All day long we were joined by two dogs that had been appearing and disappearing for three days already, dozens of kilometers from where we first met them. In the evening, at a family hostel in Gacafar in Kosovo, we made Kiddush, the women lit candles, and each of us in turn played a song we love, including the tourists we invited to join us.',
    ],
    photos: [
      ['082', 'The group on the alternative summit in the fog'],
      ['076', 'Climbing a green slope in the fog'],
      ['077', 'A snowfield in the meadow'],
      ['081', 'A break on the rocks'],
      ['084', 'A line of trekkers on a snowy ridge'],
    ],
  },
  {
    d: 6,
    date: 'Saturday, June 13',
    place: 'Babino Polje',
    country: 'ME',
    title: 'A dance around the Triple-Border Point and the turquoise Lake Hrid',
    facts: [
      ['clock', '10 hours of walking'],
      ['route', '19 km'],
      ['flag', '3 countries in one step'],
    ],
    body: [
      'A group photo with the lady of the house, who had hosted us so warmly, and we set off on a gentle climb in Kosovo, stopping to drink cold, clear water straight from the stream, in the places the guides approved. By the signpost on the ridge the guide stopped to explain the flag of Kosovo: the six stars stand for the country\'s six ethnic communities.',
      'And then we reached the Triple-Border Point. Eli expected a monument, and found a low post half a meter high, a remnant of the old border between Albania and Yugoslavia. So we did what an Israeli group does: a circle dance around the post, a step in Kosovo, a step in Albania, a step in Montenegro.',
      'The descent from the ridge went over slippery snow on steep slopes, on sliding runs the guides had prepared, and from there across a field of boulders to Lake Hrid, a turquoise lake in the heart of an alpine forest. Berry cake at the campsite, and in Babino Polje the host served dinner like a real piece of theater.',
    ],
    photos: [
      ['091', 'Lake Hrid surrounded by conifers'],
      ['090', 'Fir forests and the lake from above'],
      ['092', 'Clouds reflected in Lake Hrid'],
    ],
    know: 'Border stones from the Yugoslav era still stand along the trail. On this trek you cross borders again and again, sometimes several times a day.',
  },
  {
    d: 7,
    date: 'Sunday, June 14',
    place: 'Grebaje Valley',
    country: 'ME',
    title: 'Four summits on one ridge above the Grebaje Valley',
    facts: [
      ['up', '700 m of ascent to the ridge'],
      ['peak', '2,037 and 2,057 m'],
      ['users', 'A barbecue dinner'],
    ],
    body: [
      'A drive through the town of Plav, a church and a mosque side by side, to the Grebaje Valley nature reserve. From there, 700 meters of steep climbing to the ridgeline, and the goal: to cross the four summits along it.',
      'The first summit, 2,037 meters, took a hard climb on a narrow path with slopes on both sides. A steep descent, and up again to the second summit, 2,057 meters. On the way we met a big group of young people from Russia and Ukraine trekking together.',
      'We ate lunch on a spur of the ridge, facing a steep grassy slope and the black and dark grey cliffs of the Karanfili range. After that, two more summits, a long descent, and in the evening a festive barbecue with steaks.',
    ],
    photos: [
      ['096', 'The group sitting down to lunch on the ridgeline'],
      ['095', 'A line of trekkers on a narrow path along a ridge'],
      ['097', 'A group selfie during a break'],
      ['099', 'The Grebaje Valley and the Karanfili cliffs'],
    ],
  },
  {
    d: 8,
    date: 'Monday, June 15',
    place: 'Theth',
    country: 'AL',
    title: 'A waterfall swallowed by the mountain, and the big descent to Theth',
    facts: [
      ['down', '1,200 m of descent in 4 hours'],
      ['route', 'Vusanje → Theth'],
      ['flag', 'Montenegro → Albania'],
    ],
    body: [
      'On the way by jeep to the starting point we stopped at two wonders of nature: a waterfall whose water pours into a shaft in the mountain and disappears, and the "Blue Eye" of Montenegro, a turquoise pool 8 meters deep, fed by a spring from deep underground.',
      'Very soon we reached an old Yugoslav border stone and entered Albania again. 700 meters of climbing to the pass, lunch on a meadow facing the valley we were heading for, and then the big descent: 1,200 meters in four hours, with a stop at a café out in nature.',
      'At seven in the evening we walked into Theth, one of the most famous villages in Albania, for an especially rich dinner: hot soup, fresh breads, local wine, chicken, beef and cake. It was the last big walking day.',
    ],
    photos: [
      ['101', 'The Blue Eye of Montenegro'],
      ['100', 'A turquoise stream in the forest'],
      ['103', 'The group on the trail facing cliffs'],
      ['105', 'An old Yugoslav border stone'],
    ],
    know: 'In limestone, water seeps into the cracks, flows underground and bursts out in clear springs. The phenomenon is called karst, and it explains both the vanishing waterfall and the Blue Eye.',
  },
  {
    d: 9,
    date: 'Tuesday, June 16',
    place: 'Back to Shkodra',
    country: 'AL',
    title: 'The Blue Eye of Theth, and closing the circle in Shkodra',
    facts: [
      ['therm', 'Water at about 4 degrees'],
      ['drop', 'Grunas Waterfall'],
      ['users', 'A farewell dinner'],
    ],
    body: [
      'In the morning we stopped by the lock-in tower of Theth, a building that served as a temporary refuge for anyone caught up in a blood feud, until the tribal elders decided his case according to the Kanun, the traditional code of northern Albania. We went on along the stream to the Grunas Waterfall, which looks as if it bursts straight out of the mountain.',
      'We made the next drive in the "sardine car", with both guides squeezed together in the front seat. The destination: the Blue Eye of Theth, pools in shades of turquoise and sky blue. The water is cold, around 4 degrees, and only Hana was brave enough to take a dip.',
      'On the way back to Shkodra we stopped at a last viewpoint over the peaks we had walked for eight days. In the evening, in the courtyard of Hotel Tradita, a farewell dinner fit for a king, the house singer, the guide\'s summing up and a thank-you speech on behalf of the group.',
    ],
    photos: [
      ['112', 'A clear turquoise pool among the rocks'],
      ['108', 'A tall waterfall near Theth'],
      ['109', 'A crowded selfie in the sardine car'],
      ['110', 'Trekkers among rocks and pools'],
      ['111', 'The Blue Eye of Theth'],
      ['114', 'A last look at the Peaks of the Balkans'],
      ['115', 'The courtyard of Hotel Tradita in Shkodra'],
    ],
  },
];

const EN = {
  seoTitle:    'Peaks of the Balkans: A 10-Day Diary Across 3 Countries',
  description: 'Eli Yitzhak\'s diary from the Peaks of the Balkans trek with HighAir in June 2026: Lake Komani, snow in June, the Triple-Border Point and Theth\'s Blue Eye.',
  countries:   { AL: 'Albania', XK: 'Kosovo', ME: 'Montenegro' },
  crossings: {
    3: 'Albania → Montenegro → Albania',
    4: 'Border stone',
    5: 'Albania → Kosovo',
    6: 'Triple-Border Point',
    8: 'Montenegro → Albania',
  },
  days: EN_DAYS,
  hero: {
    alt:      'A green valley and rocky peaks in the Prokletije range',
    badges:   ['Trek diary', 'June 2026', '9 minute read'],
    h1:       'Peaks of the Balkans: 10 Days, 3 Countries, One Trail',
    sub:      'Albania, Montenegro and Kosovo through the eyes of someone who walked them. A HighAir journey along the trail that crosses the "Albanian Alps", as trekker Eli Yitzhak recorded it.',
    initials: 'EY',
    basedOn:  'Based on the trek diary of ',
    author:   'Eli Yitzhak',
    role:     ', a member of the group',
    photos:   'Photos: Eli Yitzhak and the group',
  },
  glance: {
    title:      'The trek at a glance',
    triAria:    'Albania, Kosovo and Montenegro meet at the Triple-Border Point',
    triFlags:   [['al', 'Albania', 80], ['xk', 'Kosovo', 210], ['me', 'Montenegro', 340]],
    triCaption: 'Triple-Border Point · Day 6',
    tiles: [
      ['cal', '10', 'days', 'Albania, Kosovo and Montenegro'],
      ['peak', '2,057', 'm', 'The highest summit we climbed'],
      ['route', '19', 'km', 'On the longest day'],
      ['down', '1,200', 'm', 'Of descent in one day'],
    ],
  },
  back: '← All articles',
  intro: {
    h2:    'One trail, three countries and one band of friends',
    paras: [
      'Last June a HighAir group set out on the Peaks of the Balkans trek, a trail that links mountain villages once cut off on either side of the border, in the Prokletije range, which the locals call "the Accursed Mountains".',
      'Eli Yitzhak, one of the trekkers, came home with a 74-page diary: long climbs, snow in June, flowering meadows, black coffee in the heart of the mountains and jokes only those who were there will get. We gathered its best moments, day by day.',
    ],
    quote: 'It is not only the summits that set the height of the experience, but also the people you climb them with.',
    cite:  'Eli Yitzhak, from the diary',
  },
  prologue: {
    kicker:  'Chapter 0',
    h2:      'Before we set out',
    lead:    'Eli\'s diary does not begin with the flight. It opens with thanks, with background on the region and with weeks of preparation in Israel. We begin there too.',
    letter: {
      photo:   '096',
      alt:     'The group sitting on the ridgeline above the Grebaje Valley',
      kicker:  'Opening and thanks',
      quote:   '"Some trips you come back from with beautiful photos, and some journeys you come back from with much more: experiences, stories, new friendships, funny moments and memories that stay with us long after we get home."',
      sigNote: 'From the diary, November 2026',
    },
    thanksTitle: 'A big thank you',
    thanks: [
      ['compass', 'To the local team', 'Who led us along the mountain trails with professionalism, responsibility and deep knowledge. All the way they explained the geography, history and culture of the region, made sure nobody was left behind, and helped at the hard crossings. And the black coffee at the breaks? Maybe the air, maybe the view, and maybe simply a good hand.'],
      ['shield', 'To HighAir, Chen and Adir', 'For the planning, the organization, the coordination and the support, and for the local team they arranged for us. From the preparation stages in Israel to the successful end of the trek, the care for the details, small and large, was felt all along the way.'],
    ],
    group: {
      title: 'And to the members of the group',
      note:  '13 people who became one band of friends',
      names: ['Hana', 'Nati', 'Moran', 'Anat', 'Avi', 'Shlomo', 'Ilan', 'Nof', 'Vladimir', 'Michael', 'Marius', 'Eran', 'Amit'],
      quote: '"Each one of us brought something of their own to the trek: a life story, experience, a sense of humor, sensitivity, curiosity, a readiness to help and a love of nature and walking."',
    },
    moments: {
      title: 'And thanks for the small moments too',
      items: [
        'To whoever waited for the others',
        'To whoever held out a hand at a hard crossing',
        'To whoever took the photos',
        'To whoever made sure of the group photo',
        'To whoever started an interesting conversation',
        'To whoever knew how to crack a joke just as the legs began to tire',
      ],
      end: '"These are the things that turn a group of trekkers into a band of friends."',
    },
    geo: {
      photo:  '036',
      alt:    'The Prokletije range above the Valbona Valley',
      kicker: 'The region',
      h3:     'Peaks of the Balkans',
      paras: [
        'The trail crosses the mountain region where Albania, Kosovo and Montenegro meet. The Prokletije range, also called the Albanian Alps or the Accursed Mountains, is a world of jagged ridges, deep valleys, forests, alpine pastures and many streams.',
        'The trail links villages that were once cut off on either side of the borders, and has turned the mountain landscape and the local tradition of hospitality into a journey across borders.',
      ],
      facts: [['flag', '3 countries on one trail'], ['peak', 'Jagged ridges and deep valleys'], ['bed', 'Nights with families in the mountain villages']],
    },
    prep: {
      kicker: 'Getting ready',
      h3:     'From Nahal Yagur to Ben Gurion',
      p:      'The preparations began a few weeks before departure. HighAir organized preparation meetings to introduce the trekkers to the character of the route, the conditions on the ground and the gear a long mountain trek needs.',
      steps: [
        ['peak', 'May 1', 'A training trek in Nahal Yagur', 'In the Carmel mountains, guided by Roi Carmel. The first taste of a group\'s walking pace.'],
        ['video', 'May 6', 'A briefing on Zoom', 'Gear, the line of the route and the conditions to expect in the mountains.'],
        ['chat', 'Meanwhile', 'The WhatsApp group opens', 'Suitcases, insurance, a local SIM and money, and little by little humor and helping each other too.'],
        ['home', 'Weeks before', 'A get-together evening in Kfar Saba', 'Around the dinner table at Anat\'s home. That is where the group began to become a band of friends.'],
        ['plane', 'June 8, 2:00', 'Ben Gurion Airport, takeoff', 'A last briefing from Chen Shaked, the trip shirts and the HighAir flag.'],
      ],
    },
  },
  ribbon: {
    aria:          'Where we slept each night',
    h2:            '9 nights, 3 countries',
    lead:          'Where we slept each night, and on which days we crossed a border. Click a day to jump to it.',
    crossing:      'Border crossing',
    crossingTitle: 'Border crossing: ',
  },
  chipsAria: 'Navigate between the days of the trek',
  day:       'Day',
  sleep:     'Night in ',
  zoom:      'Enlarge photo: ',
  know:      'Did you know?',
  map: {
    aria:     'Route map',
    title:    'Our route',
    hint:     'Click a point',
    svgAria:  'A schematic map of the route through Albania, Montenegro and Kosovo',
    tripoint: 'Triple-Border Point',
    pass:     'Prosllopi 2,030',
    lakes:    { komani: 'Lake Komani', shkodra: 'Lake Shkodra', hrid: 'Lake Hrid' },
    dayOf:    ['Day ', ' of 10'],
    note:     'A schematic map for illustration. The line fills in as you read.',
  },
  cards: {
    h2:    '6 things we learned on the way',
    lead:  'Click a card to flip it.',
    hint:  'Click for the story ↺',
    items: [
      ['bunker', '70,000', 'bunkers', 'Scattered across Albania at strategic defensive points. We saw some of them on the very first walking day.'],
      ['wifi', '30×30', 'cm of internet', 'Almost every hut in the mountains has a white Starlink antenna. Even in the heart of Prokletije you can send a photo home from the summit.'],
      ['star', '6', 'stars on the flag', 'The flag of Kosovo, adopted in 2008, shows a map of the country with six stars above it, one for each major ethnic community.'],
      ['therm', '4°', 'degrees in the water', 'Roughly the temperature of the Blue Eye of Theth. Of the whole group, only Hana dared to take a dip.'],
      ['pillar', '50', 'cm of history', 'That is the height of the Triple-Border Point post between Albania, Kosovo and Montenegro. Modest, but perfect for a circle dance.'],
      ['bolt', '1', 'lightning bolt, a burnt tree', 'The lightning strikes the treetop, the current runs down the trunk and all the energy discharges at the base, burning it from the inside.'],
    ],
  },
  vibe: {
    h2:    'The vibe: what the summit photos don\'t show',
    lead:  'Long walking hours, hard climbs and shared nights in mountain huts turn a group of strangers into a band of friends with a language of its own. A few of the phrases born on the way:',
    calls: [
      ['“Yudit!”', 'A line from a well-known Israeli comedy sketch that became the inside joke of the trek. It rang out suddenly in the middle of a climb, during breaks and in the evenings, and always got a laugh.'],
      ['“Shoshana!”', 'The name of a character from a Tarantino film that took on a life of its own with us, and joined the list of calls only those who were there will get.'],
      ['“Kardashian”', 'A playful garbling of "kar deshe", Hebrew for a grassy meadow. And there were a lot of meadows along the route. And in between: songs, lots of songs, led by Ilan and Anat.'],
    ],
  },
  expect: {
    h2:    'What awaits you on the Peaks of the Balkans trek',
    items: [
      ['compass', 'Preparation starts in Israel', 'A training trek in Nahal Yagur, a Zoom meeting on gear and conditions on the trail, a WhatsApp group and a get-together before the flight.'],
      ['clock', 'Days of 6 to 10.5 hours', 'Climbs of up to 1,000 meters a day, long descents and several summits above 2,000 meters. For those who love a challenge and arrive in good shape.'],
      ['snow', 'Snow even in June', 'Snow stays in the shady gullies into early summer, and the guides prepare safe crossings and sliding runs.'],
      ['bed', 'Family hospitality in the mountains', 'Guesthouses and huts along the trail, shared rooms, homemade Balkan meals and satellite internet in almost every hut.'],
      ['flag', 'Three countries', 'Shkodra, Lake Komani, Valbona, Kosovo, the Grebaje Valley and Theth, villages the trail put back on the map.'],
      ['shield', 'Guiding that makes the right call', 'When the fog closed in on the ridge, the guides changed the route. Every evening, a summary of the day and a briefing for tomorrow.'],
    ],
    quote: '"Behind a successful trip there are a great many details, small and large, and the investment in them was truly felt all along the way."',
    cite:  'Eli Yitzhak, Peaks of the Balkans trekker, June 2026',
  },
  cta: {
    badge: 'The next trek',
    h2:    'Want to be in the group photo of the next trek?',
    p:     'Snow in June, turquoise lakes, a Triple-Border Point and a band of friends who will stay with you long after you get home.',
    trip:  'Details of the next trek',
    guide: 'The complete trek guide',
  },
  credit:   'A big thank you to Eli Yitzhak, who recorded the trek in a moving diary and let us share it. All quotes and photos are courtesy of him and the members of the group. Guiding in the field: HighAir\'s local team.',
  lightbox: { aria: 'Photo viewer', close: 'Close', prev: 'Previous', next: 'Next' },
};

export const DIARY = { he: HE, en: EN };

/** The words of the page in a site's language (Hebrew on www, English everywhere else). */
export const diaryText = lang => (lang === 'he' ? HE : EN);

/** The place a day ends in, without its country (the ribbon, the photo captions). */
export const shortPlace = (day, T) => day.place.replace(`, ${T.countries.XK}`, '');

/** Every photo of the page in reading order (the lightbox steps through them). */
export const allPhotos = T => T.days.flatMap(d => d.photos);

/* Chapter 0 as blog blocks */
function prologueBlocks(P, author) {
  const text = value => ({ type: 'text', value });
  return [
    { type: 'section', value: `${P.kicker}: ${P.h2}` },
    text(P.lead),
    { type: 'subheading', value: P.letter.kicker },
    text(`${P.letter.quote} (${author}, ${P.letter.sigNote})`),
    { type: 'subheading', value: P.thanksTitle },
    ...P.thanks.map(([, who, why]) => text(`${who}: ${why}`)),
    text(`${P.group.title}, ${P.group.note}: ${P.group.names.join(', ')}.`),
    text(P.group.quote),
    { type: 'subheading', value: P.moments.title },
    { type: 'list', items: P.moments.items },
    text(P.moments.end),
    { type: 'subheading', value: `${P.geo.kicker}: ${P.geo.h3}` },
    ...P.geo.paras.map(text),
    { type: 'list', items: P.geo.facts.map(([, f]) => f) },
    { type: 'subheading', value: `${P.prep.kicker}: ${P.prep.h3}` },
    text(P.prep.p),
    { type: 'list', items: P.prep.steps.map(([, when, what, note]) => `${when}, ${what}: ${note}`) },
  ];
}

/** The page as blog blocks (BlogPost's format), for the static page's text layer
    (scripts/lib/text-layer.mjs) and anything else that reads a post's text. */
export function diaryBlocks(lang) {
  const T = diaryText(lang);
  const text = value => ({ type: 'text', value });
  return [
    text(T.hero.basedOn + T.hero.author + T.hero.role + '. ' + T.hero.photos),
    { type: 'section', value: T.intro.h2 },
    ...T.intro.paras.map(text),
    text(`${T.intro.quote} (${T.intro.cite})`),
    ...prologueBlocks(T.prologue, T.hero.author),
    { type: 'section', value: T.glance.title },
    { type: 'list', items: T.glance.tiles.map(([, n, unit, what]) => `${n} ${unit}: ${what}`) },
    { type: 'section', value: T.ribbon.h2 },
    { type: 'list', items: T.days.map(d => `${T.day} ${d.d}: ${shortPlace(d, T)}, ${T.countries[d.country]}${T.crossings[d.d] ? ` (${T.ribbon.crossingTitle}${T.crossings[d.d]})` : ''}`) },
    ...T.days.flatMap(d => [
      { type: 'section', value: `${T.day} ${d.d}: ${d.title}` },
      text(`${d.date}, ${T.sleep}${T.countries[d.country]}`),
      { type: 'list', items: d.facts.map(([, f]) => f) },
      ...d.body.map(text),
      ...d.photos.map(([id, caption]) => ({ type: 'image', src: diaryImg(id), alt: caption, caption })),
      ...(d.know ? [{ type: 'callout', title: T.know, value: d.know }] : []),
      ...(d.quote ? [text(`${d.quote[0]} (${d.quote[1]})`)] : []),
    ]),
    { type: 'section', value: T.cards.h2 },
    ...T.cards.items.flatMap(([, n, label, back]) => [{ type: 'subheading', value: `${n} ${label}` }, text(back)]),
    { type: 'section', value: T.vibe.h2 },
    text(T.vibe.lead),
    ...T.vibe.calls.flatMap(([call, story]) => [{ type: 'subheading', value: call }, text(story)]),
    { type: 'section', value: T.expect.h2 },
    ...T.expect.items.flatMap(([, title, story]) => [{ type: 'subheading', value: title }, text(story)]),
    text(`${T.expect.quote} (${T.expect.cite})`),
    { type: 'section', value: T.cta.h2 },
    text(T.cta.p),
    { type: 'cta', text: T.cta.trip, href: TRIP_PATH },
    { type: 'cta', text: T.cta.guide, href: GUIDE_PATH },
    text(T.credit),
  ];
}
