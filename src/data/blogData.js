/**
 * blogData.js - Blog posts
 * To add a new post: copy the object structure below and paste at the top of POSTS array.
 * Each post supports both Hebrew (default) and English (En suffix) fields.
 */

export const POSTS = [

  /* ═══════════════════════════════════════════════════════════════════
   *  id:5  kilimanjaro-difficulty  (DRAFT - removed, see git history)
   * ═══════════════════════════════════════════════════════════════════ */
  /* {
    id:       5,
    slug:     'kilimanjaro-difficulty',

    title:    'כמה קשה לטפס על קילימנג\'רו: הערכה כנה לפני שמחליטים',
    titleEn:  'How Hard is it to Climb Kilimanjaro? An Honest Assessment',
    author:   'HighAir Expeditions',
    dateIso:  '2026-05-22',
    dateModified: '2026-05-22',
    dateHe:   '22 במאי 2026',
    dateEn:   'May 22, 2026',
    category: 'מדריכים',
    categoryEn: 'Guides',
    img:             '/images/blog/kilimanjaro-trekkers.webp',
    imgPosition:     'center 50%',
    imgPositionCard: 'center 50%',
    imgCredit:       '',
    excerpt:  'קילימנג\'רו אינו דורש ציוד טיפוס טכני, אבל 45 אחוז מהמטפסים אינם מגיעים לפסגה. הסיבה אינה ברגליים. כל מה שצריך לדעת לפני שמחליטים.',
    excerptEn: 'Kilimanjaro requires no technical climbing, yet 45% of climbers never reach the summit. The reason is not your legs. What to know before deciding.',

    content: [
      { type: 'text', value: 'בשעה חמש לפנות בוקר, בטמפרטורה של מינוס 12 מעלות, עומדים מרבית מטפסי קילימנג\'רו בנקודה הנקראת "סטלה פוינט", גובה 5,739 מטרים. מאחוריהם שש שעות של עלייה בחושך. לפניהם עוד ארבעים דקות עד פסגת אוהורו, הנקודה הגבוהה ביותר באפריקה. ברגע הזה, כמעט כל אחד שואל את עצמו שאלה אחת: מה בדיוק הוא עשה לעצמו.' },
      { type: 'text', value: 'קילימנג\'רו, 5,895 מטרים, הוא ההר הגבוה ביותר באפריקה ואחד מ"שבע הפסגות", שבעת ההרים הגבוהים ביותר בכל אחת משבע היבשות. הוא אינו דורש כישורי טיפוס טכניים, אינו דורש חמצן משלים, ואפשר לטפס עליו ברגל, ללא ציוד מיוחד. ובכל זאת, נתוני הצלחה רשמיים מראים שכ-45 אחוז מהמטפסים אינם מגיעים לפסגה. הדיסוננס הזה בין "כל אחד יכול" לבין "לא כולם מצליחים" הוא מה שכדאי להבין לעומק לפני שמחליטים.' },

      { type: 'section', value: 'טיול, טרק או טיפוס?' },
      { type: 'text', value: 'כשאנשים שואלים כמה קשה קילימנג\'רו, הדבר הראשון שצריך לעשות הוא לשאול בחזרה: בהשוואה למה? בסולם הטכני של עולם הטיפוס, קילימנג\'רו מדורג כ"טרק", לא כ"טיפוס". אין קטעים שדורשים שימוש בידיים לצורך ההתקדמות. אין מסעפות. אין פניות אנכיות על קרח. מהבחינה הטכנית הצרה, זהו מסלול הליכה בעלייה מתמשכת.' },
      { type: 'text', value: 'אבל ההגדרה הטכנית מפספסת משהו מהותי. "הליכה בעלייה" בגובה 5,800 מטרים נראית אחרת לגמרי ממה שמכיר רוב האנשים. כמות החמצן הזמינה בפסגה היא כמחצית ממה שזמין בגובה פני הים. הגוף עובד קשה יותר על כל צעד. הנשימה כבדה, הרגליים כבדות, המחשבה מתקשה. ואנשים שמגיעים לקילימנג\'רו בכושר מצוין מגלים לפעמים, להפתעתם, שגופם מסרב לשתף פעולה כבר ב-4,500 מטרים. זו לא חולשה. זו ביולוגיה.' },

      { type: 'image', src: '/images/blog/kilimanjaro-trekkers.webp', alt: 'מטפסים בדרך לפסגת קילימנג\'רו', caption: 'בדרך לפסגה: כל צעד בגובה מעל 4,500 מטרים כבד יותר ממה שמצפים' },

      { type: 'section', value: 'הגורם שמכריע הכל: הגובה' },
      { type: 'text', value: 'מחלת גובה היא הסיבה העיקרית לכך שאנשים אינם מגיעים לפסגת קילימנג\'רו. היא אינה נחלת החלשים, ואינה ניתנת לניבוי על בסיס כושר גופני. אנשים צעירים ומאומנים עלולים לסבול ממחלת גובה קשה, ואנשים שלא עסקו בספורט שנים עולים לפעמים ללא תסמין אחד. יש בכך מרכיב גנטי שאין שליטה עליו.' },
      { type: 'text', value: 'מחלת גובה חריפה, AMS, מתפתחת כשהגוף מתקשה להסתגל לרמות חמצן נמוכות בקצב הנדרש. התסמינים הנפוצים הם כאבי ראש, בחילה, עייפות עמוקה ושיבושי שינה. הם אינם נעימים, אבל ניתנים לרוב לניהול בעזרת קצב עלייה נכון. הצורות החמורות, בצקת ריאות ובצקת מוחית, נדירות אבל מסכנות חיים, ודורשות ירידה מיידית מן ההר.' },
      { type: 'text', value: '"פולי פולי" בסווהילי, כלומר "לאט לאט", הוא הביטוי שמדריכים חוזרים עליו לאורך כל מסלול הקילימנג\'רו. לא כסגנון, אלא כהנחיה פיזיולוגית ממשית. גוף שעולה בקצב מתון מפיק יותר תאי דם אדומים, מסתגל לשינוי לחץ האוויר, ומגיע לפסגה. מי שממהר, גם אם הוא חזק, נוטל סיכון מיותר.' },

      { type: 'callout', title: '✦ מה הנתונים אומרים', value: 'מסלול 5 ימים: 27% הצלחה. מסלול 6 ימים: 44%. מסלול 7 ימים: 64%. מסלול 8 ימים: 85%. ההבדל בין 27% ל-85% הוא ימי אקלום, לא כושר גופני.' },

      { type: 'section', value: 'מסלולים: לא כל הדרכים שוות' },
      { type: 'text', value: 'לקילימנג\'רו שבעה מסלולים מאושרים. ההבדלים ביניהם אינם רק נופיים, הם גם פיזיולוגיים, ומשפיעים ישירות על הסיכויים להגיע לפסגה.' },
      { type: 'text', value: 'מסלול למושו הוא מהפופולריים ביניהם. הוא מתחיל ביער גשם ועולה דרך ארבעה אזורי אקלים שונים לפסגה. משכו 7 עד 8 ימים, ושיעורי ההצלחה שלו גבוהים יחסית. מסלול מצ\'מה, הידוע בנוף המרהיב שלו, כולל את "חומת ברנקו", קטע סלעי שדורש שימוש מסוים בידיים, ונחשב לאחד מהרגעים המאתגרים ביותר בהר. המסלול הצפוני הגדול הוא הארוך ביותר, 8 עד 9 ימים, ומספק את האקלום הטוב ביותר בזכות כיסוי שטח רחב של ההר.' },
      { type: 'text', value: 'מסלול מרנגו, לעומתם, הוא הקצר ביותר ומציע לינה בצריפים. הוא נחשב נוח מבחינה לוגיסטית, אבל שיעורי ההצלחה שלו נמוכים, מכיוון שחמישה ימים אינם מספיקים לרוב האנשים לאקלם כראוי. מסלול אומבווה, התלול ביותר, מיועד לאנשים עם ניסיון בטיפוס ואינו מתאים למתחילים.' },

      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', alt: 'מסלול מצ\'מה, קילימנג\'רו', caption: 'מסלול מצ\'מה, אחד המסלולים המועדפים בקילימנג\'רו. 7 ימים לפחות לתוצאות מיטביות' },

      { type: 'section', value: 'ליל הפסגה: השעות שמכריעות' },
      { type: 'text', value: 'חוויית הקילימנג\'רו חצויה לשניים: כל הדרך עד המחנה הגבוה, ואז לילה אחד שמכריע הכל. ההעפלה הסופית מתחילה בחצות, כשכולם עדיין עייפים מימי ההליכה שקדמו. חושך, ראש פנס, קור חד, שקט. הטיפוס לוקח בין חמש לשבע שעות עד פסגת אוהורו, ורוב הקבוצות מגיעות לפסגה עם הזריחה.' },
      { type: 'text', value: 'הסיבה לצאת בחצות ולא בבוקר היא פרקטית. השלג והקרח על החלקים הגבוהים יציבים יותר בשעות הקרות של הלילה. עם עליית השמש הם מתחילים להפשיר. בפסגה, בטמפרטורה של מינוס 10 עד מינוס 15 מעלות, רגע הזריחה הוא, לפי כמעט כל מי שהיה שם, מן הדברים היפים ביותר שראו בחייהם.' },
      { type: 'text', value: 'כעשרה אחוז מהמטפסים שמגיעים למחנה הגבוה אינם מסיימים את ההעפלה הסופית. חלקם מגיעים עד "סטלה פוינט", 5,739 מטרים, שגם הגעה אליה היא הישג של ממש. השאר מסתובבים קודם, לרוב בגלל מחלת גובה. אין בזה כישלון. ההחלטה לרדת כשהגוף מבקש זאת היא ההחלטה הנבונה.' },

      { type: 'section', value: 'מי יכול לטפס על קילימנג\'רו?' },
      { type: 'text', value: 'הגיל המינימלי על פי חוק הטנזני הוא 10 שנים. הגיל המקסימלי? אנג\'לה ורובייבה עלתה לפסגה בגיל 89. בין השניים, כמעט כל אדם שבריא ומוכן להשקיע בהכנה מתאימה יכול לנסות.' },
      { type: 'text', value: 'מחלות לב חמורות ובעיות ריאה קשות מצריכות ייעוץ רפואי לפני קבלת כל החלטה. אסתמה וסוכרת, לעומת זאת, אינן פוסלות את הטיפוס בהכרח, ואנשים עם שתי המחלות הגיעו לפסגה בהצלחה עם ליווי רפואי מתאים.' },
      { type: 'text', value: 'מבחינת כושר גופני, לא צריך להיות אצן. צריך להיות מסוגל ללכת שש עד שמונה שעות ביום, מספר ימים ברציפות, עם תרמיל גב בינוני. כל מי שמתאמן באופן סדיר, עושה אימוני אירובי שלוש עד ארבע פעמים בשבוע, ומשלב הליכות בשטח בחודשים שלפני הטיפוס, מגיע מוכן דיו.' },

      { type: 'image', src: '/images/blog/kilimanjaro-camp.avif', alt: 'מחנה בקילימנג\'רו', caption: 'לינה בגובה היא חלק בלתי נפרד מתהליך האקלום. כל לילה במחנה מכין את הגוף ליום שאחריו' },

      { type: 'section', value: 'קילימנג\'רו עם HighAir' },
      { type: 'text', value: 'ב-HighAir אנחנו מוציאים קבוצות לקילימנג\'רו בכל שנה. הבחירה שלנו היא תמיד במסלולים ארוכים, שבעה ימים לפחות, כי הנתונים ברורים: כל יום נוסף של אקלום מגדיל את הסיכויים להגיע לפסגה. הצוות שלנו מתמחה בהדרכה בעברית, בשמירה על קצב נכון, ובזיהוי מוקדם של תסמיני גובה לפני שהם הופכים לבעיה.' },
      { type: 'text', value: 'חלק מהרווחים מכל משלחת שלנו מוקדש לתמיכה בחולי סרטן בישראל, כי ההרים, בעינינו, הם גם דרך לתת. כשאתם עולים איתנו לקילימנג\'רו, אתם לא רק עושים משהו בשביל עצמכם.' },
      { type: 'text', value: 'כל מטפס שאתם רואים היום על פסגות העולם התחיל פעם אחת, על הר אחד. קילימנג\'רו הוא אחד ההרים הטובים ביותר להתחיל בו. אם אתם שוקלים, אנחנו כאן.' },
      { type: 'cta', text: 'למשלחות קילימנג\'רו של HighAir', textEn: 'Kilimanjaro Expeditions', href: '/expedition/kilimanjaro' },

      { type: 'section', value: 'שאלות נפוצות' },
      { type: 'heading', value: 'כמה קשה לטפס על קילימנג\'רו בהשוואה להרים אחרים?' },
      { type: 'text', value: 'קילימנג\'רו אינו דורש כישורי טיפוס טכניים ונחשב לנגיש יחסית בקרב הרי "שבע הפסגות". הוא קשה יותר מהר קושיושקו באוסטרליה, אבל קל בהרבה מאקונקגואה, מאלברוס ומהאוורסט. האתגר המרכזי הוא הגובה, לא הטכניקה.' },
      { type: 'heading', value: 'מהו שיעור ההצלחה בקילימנג\'רו?' },
      { type: 'text', value: 'שיעור ההצלחה הכולל עומד על כ-45 אחוז, אבל המספר הזה כולל מסלולים קצרים מדי שבהם שיעור ההצלחה יורד עד 27 אחוז. במסלולים של 7 עד 8 ימים שיעור ההצלחה עולה לכ-64 עד 85 אחוז. הבחירה במסלול ארוך מספיק היא הגורם הבודד המשפיע ביותר על הסיכויים.' },
      { type: 'heading', value: 'האם צריך ניסיון טיפוס קודם לקילימנג\'רו?' },
      { type: 'text', value: 'לא. קילימנג\'רו אינו דורש ניסיון טיפוס קודם. אין צורך לדעת להשתמש בחבלים, בקרוסים או בציוד טיפוס טכני. מה שנדרש הוא כושר אירובי טוב, נכונות ללכת שעות ביום לאורך מספר ימים, וציוד מתאים לקור ולגשם.' },
      { type: 'heading', value: 'האם מחלת גובה מהווה סכנה אמיתית בקילימנג\'רו?' },
      { type: 'text', value: 'כן. מחלת גובה היא הסיבה המרכזית לכישלון ולפינויים בקילימנג\'רו. היא אינה תלויה בכושר גופני ואי אפשר להתכונן אליה על ידי אימון גופני בלבד. קצב עלייה נכון, מסלול ארוך מספיק לאקלום, ומדריך מנוסה שיזהה תסמינים מוקדם הם ההגנה הטובה ביותר.' },
      { type: 'heading', value: 'כמה ימים לוקח לטפס על קילימנג\'רו?' },
      { type: 'text', value: 'המשלחות המומלצות הן של 7 עד 8 ימים. קיימים מסלולים קצרים של 5 עד 6 ימים, אבל שיעורי ההצלחה שלהם נמוכים משמעותית. לא מומלץ לקצר את המסלול על מנת לחסוך ימים. כל יום נוסף של אקלום מגדיל מאוד את הסיכויים להגיע לפסגה.' },
      { type: 'heading', value: 'מה לובשים לטיפוס קילימנג\'רו?' },
      { type: 'text', value: 'ההר עובר ארבעה אזורי אקלים: יער גשם, ערבות אלפינית, מדבר גבוה ואזור קרחוני. בתחתית יכול להיות חם ולח, ובפסגה בין מינוס 10 למינוס 15 מעלות. שכבות הלבשה חמות, מעיל חורף איכותי, כפות ידיים, כובע גרב ומגפי טרק מתאימים הם חובה. אנחנו מספקים לכל משתתף רשימת ציוד מפורטת לפני היציאה.' },
      { type: 'heading', value: 'האם אפשר לטפס על קילימנג\'רו ללא מדריך?' },
      { type: 'text', value: 'לא. חוקי הפארק הלאומי של טנזניה מחייבים כל מטפס לצאת עם מדריך מורשה. לא ניתן לרכוש היתר כניסה לפארק ללא מדריך. הכלל קיים מטעמי בטיחות, ומדריך מנוסה הוא גם מי שיזהה בזמן תסמינים ויפנה לפני שמצב מחמיר.' },
    ],

    contentEn: [
      { type: 'text', value: 'At five in the morning, in temperatures of minus 12 degrees Celsius, most Kilimanjaro climbers find themselves standing at a point called Stella Point, at 5,739 metres. Six hours of darkness and silence are behind them. Forty minutes remain to Uhuru Peak, the highest point in Africa. At that moment, almost everyone asks themselves the same question: what exactly have I done to myself.' },
      { type: 'text', value: 'Kilimanjaro, at 5,895 metres, is the highest mountain in Africa and one of the Seven Summits, the highest peak on each of the seven continents. It requires no technical climbing skills, no supplementary oxygen, and can be ascended on foot without specialist equipment. And yet official success rate data shows that around 45 per cent of climbers never reach the summit. The gap between "anyone can do it" and "not everyone makes it" is precisely what is worth understanding before deciding.' },

      { type: 'section', value: 'A hike, a trek, or a climb?' },
      { type: 'text', value: 'When people ask how hard Kilimanjaro is, the first thing to clarify is: compared to what? On the technical scale used in mountaineering, Kilimanjaro is rated as a trek, not a climb. There are no sections requiring the use of hands to make progress. No rock faces requiring ropes. No vertical ice. In the strict technical sense, it is a long uphill walking route.' },
      { type: 'text', value: 'But that definition misses something essential. Walking uphill at 5,800 metres looks entirely different from anything most people have experienced before. The available oxygen at the summit is roughly half of what is available at sea level. The body works harder on every step. Breathing becomes laboured. Legs feel heavy. Thought slows. Climbers who arrive at Kilimanjaro in excellent physical condition sometimes discover, to their considerable surprise, that their body refuses to cooperate as early as 4,500 metres. This is not weakness. It is biology.' },

      { type: 'image', src: '/images/blog/kilimanjaro-trekkers.webp', alt: 'Trekkers approaching the summit of Kilimanjaro', caption: 'On the approach to the summit: every step above 4,500 metres costs more than most climbers expect' },

      { type: 'section', value: 'The factor that decides everything: altitude' },
      { type: 'text', value: 'Altitude sickness is the primary reason people do not reach the summit of Kilimanjaro. It does not discriminate by fitness level, and it cannot be predicted on the basis of physical ability alone. Young, well-trained athletes can suffer severe altitude sickness, while people who have not exercised regularly for years sometimes ascend without a single symptom. There is a genetic component that lies entirely outside anyone\'s control.' },
      { type: 'text', value: 'Acute Mountain Sickness, or AMS, develops when the body struggles to adapt to low oxygen levels at the required rate. The most common symptoms are headache, nausea, deep fatigue and disturbed sleep. These are unpleasant, but can usually be managed through a correct ascent pace. The more serious forms, pulmonary oedema and cerebral oedema, are rare but life-threatening and require immediate descent.' },
      { type: 'text', value: '"Pole pole", in Swahili, meaning slowly slowly, is the phrase guides repeat throughout the entire Kilimanjaro route. Not as a mantra, but as a genuine physiological instruction. A body that ascends at a measured pace produces more red blood cells, adapts to changing air pressure, and reaches the summit. Those who rush, however fit, take an unnecessary risk.' },

      { type: 'callout', title: '✦ What the numbers say', value: '5-day route: 27% success. 6-day route: 44%. 7-day route: 64%. 8-day route: 85%. The difference between 27% and 85% is acclimatisation days, not physical fitness.' },

      { type: 'section', value: 'Routes: not all paths are equal' },
      { type: 'text', value: 'Kilimanjaro has seven approved routes. The differences between them are not only scenic. They are physiological, and they directly affect the chances of reaching the summit.' },
      { type: 'text', value: 'The Lemosho route is among the most popular. It begins in rainforest and climbs through four distinct climate zones to the summit. At 7 to 8 days, it provides good acclimatisation and relatively high success rates. The Machame route, known for its spectacular scenery, includes the Barranco Wall, a rocky section requiring some use of hands, considered one of the most challenging passages on the entire mountain. The Northern Circuit is the longest option at 8 to 9 days, and provides the best acclimatisation by covering the widest area of the mountain.' },
      { type: 'text', value: 'The Marangu route, by contrast, is the shortest option with hut accommodation. It is logistically convenient, but success rates are low because five days is simply not enough for most people to acclimatise properly. The Umbwe route, the steepest of all, is intended for experienced climbers and is not recommended for beginners.' },

      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', alt: 'The Machame route on Kilimanjaro', caption: 'The Machame route, one of the most rewarding routes on the mountain. At least 7 days is strongly recommended' },

      { type: 'section', value: 'Summit night: the hours that decide' },
      { type: 'text', value: 'The Kilimanjaro experience divides into two halves: the journey to high camp, and then one night that decides everything. The final ascent begins at midnight, when everyone is already tired from the preceding days of walking. Darkness, a head torch, sharp cold, silence. The climb takes between five and seven hours to reach Uhuru Peak, and most groups arrive at the summit at sunrise.' },
      { type: 'text', value: 'The reason for setting out at midnight rather than morning is practical. Snow and ice on the upper sections are more stable during the cold night hours. As the sun rises they begin to soften. At the summit, in temperatures between minus 10 and minus 15 degrees Celsius, the moment of sunrise is, according to almost everyone who has been there, among the most beautiful things they have ever witnessed.' },
      { type: 'text', value: 'Around ten per cent of climbers who reach high camp do not complete the final ascent. Some reach Stella Point at 5,739 metres, which is itself a meaningful achievement. Others turn back earlier, usually because of altitude sickness. There is nothing wrong with that decision. Choosing to descend when the body asks for it is the right decision.' },

      { type: 'section', value: 'Who can climb Kilimanjaro?' },
      { type: 'text', value: 'The minimum age under Tanzanian law is 10 years. The maximum? Angela Vorobeva reached the summit at 89. Between those two points, almost anyone who is in reasonable health and willing to invest in proper preparation can attempt the climb.' },
      { type: 'text', value: 'Serious heart conditions and severe lung disease require early medical consultation before any decision is made. Asthma and diabetes, on the other hand, do not necessarily rule out an attempt, and people with both conditions have reached the summit successfully with appropriate medical preparation and support.' },
      { type: 'text', value: 'In terms of physical fitness, you do not need to be an athlete. You need to be capable of walking six to eight hours per day, for several consecutive days, with a medium-weight backpack. Anyone who trains regularly, does aerobic exercise three to four times a week, and includes hilly walking in the months before the climb will arrive well prepared.' },

      { type: 'image', src: '/images/blog/kilimanjaro-camp.avif', alt: 'A high camp on Kilimanjaro', caption: 'Sleeping at altitude is an essential part of the acclimatisation process. Each night at camp prepares the body for the following day' },

      { type: 'section', value: 'Kilimanjaro with HighAir' },
      { type: 'text', value: 'At HighAir we take groups to Kilimanjaro every year. We always choose routes of at least seven days, because the data is clear: each additional acclimatisation day meaningfully increases the chances of reaching the summit. Our team specialises in Hebrew-speaking guidance, maintaining the correct pace throughout, and recognising the early signs of altitude sickness before they become a problem.' },
      { type: 'text', value: 'A portion of the proceeds from every expedition we run is dedicated to supporting cancer patients in Israel, because the mountains, in our view, are also a way of giving back. When you climb Kilimanjaro with us, you are not only doing something for yourself.' },
      { type: 'text', value: 'Every climber you see today on the summits of the world started once, on one mountain. Kilimanjaro is one of the best places to begin. If you are considering it, we are here.' },
      { type: 'cta', text: 'למשלחות קילימנג\'רו של HighAir', textEn: 'Kilimanjaro Expeditions', href: '/expedition/kilimanjaro' },

      { type: 'section', value: 'Frequently asked questions' },
      { type: 'heading', value: 'How hard is Kilimanjaro compared to other mountains?' },
      { type: 'text', value: 'Kilimanjaro requires no technical climbing skills and is considered relatively accessible among the Seven Summits. It is harder than Mount Kosciuszko in Australia, but significantly easier than Aconcagua, Elbrus and Everest. The primary challenge is altitude, not technique.' },
      { type: 'heading', value: 'What is the summit success rate on Kilimanjaro?' },
      { type: 'text', value: 'The overall success rate is around 45 per cent, but this figure includes short routes where success rates fall as low as 27 per cent. On 7 to 8-day routes, the success rate rises to between 64 and 85 per cent. Choosing a route that is long enough is the single most important factor affecting summit chances.' },
      { type: 'heading', value: 'Do I need previous climbing experience for Kilimanjaro?' },
      { type: 'text', value: 'No. Kilimanjaro does not require any previous climbing experience. There is no need to know how to use ropes, crampons, or technical climbing equipment. What is required is good aerobic fitness, the willingness to walk for many hours per day over several days, and appropriate gear for cold and wet conditions.' },
      { type: 'heading', value: 'Is altitude sickness a real danger on Kilimanjaro?' },
      { type: 'text', value: 'Yes. Altitude sickness is the main cause of failure and evacuation on Kilimanjaro. It is not dependent on physical fitness and cannot be prevented through physical training alone. A correct ascent pace, a route that is long enough for acclimatisation, and an experienced guide who identifies symptoms early are the best protection.' },
      { type: 'heading', value: 'How many days does it take to climb Kilimanjaro?' },
      { type: 'text', value: 'The recommended expeditions are 7 to 8 days. Shorter routes of 5 to 6 days exist, but their success rates are significantly lower. Cutting days to save time is not recommended. Each additional day of acclimatisation substantially increases the probability of reaching the summit.' },
      { type: 'heading', value: 'What do you wear on Kilimanjaro?' },
      { type: 'text', value: 'The mountain passes through four climate zones: rainforest, alpine moorland, high-altitude desert and glacier. At the base it can be warm and humid; at the summit, temperatures drop to between minus 10 and minus 15 degrees Celsius. Warm layering, a quality winter jacket, gloves, a beanie and proper trekking boots are essential. We provide every participant with a detailed gear list before departure.' },
      { type: 'heading', value: 'Can you climb Kilimanjaro without a guide?' },
      { type: 'text', value: 'No. Tanzanian national park regulations require every climber to be accompanied by a licensed guide. It is not possible to purchase a park permit and enter without one. The regulation exists for safety reasons, and an experienced guide is also the person who will identify symptoms early and initiate evacuation before a situation deteriorates.' },
    ],
  }, */

  /* ═══════════════════════════════════════════════════════════════════
   *  id:6  rustam-nabiev-everest-arms-only  (2026-05-22)
   *  TODO: replace placeholder images once user provides photos:
   *    /images/blog/nabiev-everest.webp   ← hero image
   *    /images/blog/nabiev-climbing.jpg  ← in-article image 1
   *    /images/blog/nabiev-summit.jpg    ← in-article image 2
   * ═══════════════════════════════════════════════════════════════════ */
  {
    id:       6,
    slug:     'rustam-nabiev-everest-arms-only',

    title:    'רוסתם נבייב: האיש שטיפס על האוורסט רק עם הידיים',
    titleEn:  'Rustam Nabiev: The Man Who Climbed Everest on His Arms Alone',
    author:   'HighAir Expeditions',
    dateIso:  '2026-05-22',
    dateModified: '2026-05-22',
    dateHe:   '22 במאי 2026',
    dateEn:   'May 22, 2026',
    category: 'חדשות',
    categoryEn: 'News',
    img:             '/images/blog/nabiev-everest.jpg',
    imgPosition:     'center 40%',
    imgPositionCard: 'center 40%',
    imgCredit:       '',
    excerpt:  'רוסתם נבייב איבד את שתי רגליו, ובמאי 2026 הפך לאדם הראשון בהיסטוריה שמטפס לפסגת האוורסט רק בכוח זרועותיו. הסיפור המלא על נחישות, נפילה ושיבה.',
    excerptEn: 'Rustam Nabiev lost both legs and in May 2026 became the first person in history to climb Everest on the strength of his arms alone. The full story of determination, loss and return.',

    content: [
      { type: 'text', value: 'ב-20 במאי 2026, בשעה 8:16 בבוקר שעון נפאל, עמד אדם על פסגת האוורסט והחזיק שלט קטן. על השלט היה כתוב: "למי שחשבו שהחיים נגמרו אחרי הנפילה."' },
      { type: 'text', value: 'האיש הוא רוסתם נבייב, בן 34, מטפס, בלוגר וספורטאי פראלימפי מהעיר אופה שברוסיה. אין לו רגליים. הוא טיפס את 8,848 המטרים של ההר הגבוה בעולם בכוח זרועותיו בלבד, והפך לאדם הראשון בהיסטוריה האנושית שעושה זאת.' },

      { type: 'video', src: '/videos/nabiev-everest-climb.mp4', poster: '/images/blog/nabiev-video-poster.jpg', caption: 'רוסתם עובר מעל סדקי הקרחון בקרחון חומבו' },

      { type: 'section', value: 'הנפילה' },
      { type: 'text', value: 'ב-12 ביולי 2015, בזמן ששירת כצנחן בצבא הרוסי, ישן נבייב במבנה מגורים בבסיס אימונים בעיר אומסק שבסיביר. המבנה קרס. הסיבה, על פי הדיווחים, הייתה בנייה לקויה. עשרים ושלושה מחבריו לצבא נהרגו באותו אסון. נבייב שרד, אבל שתי רגליו נקטעו.' },
      { type: 'text', value: 'השנים שאחרי היו ארוכות. נבייב עבר שורה של ניתוחים ותהליך שיקום ממושך. הוא למד מחדש כיצד הגוף שלו עובד, מה הוא מסוגל לעשות ומה לא. במקביל, הוא התחיל לתעד את הדרך, לכתוב, לצלם, לשתף. הבלוג שלו הפך לחלון שדרכו אנשים ברחבי העולם עקבו אחרי ההתאוששות שלו, ואחר כך אחרי הפסגות.' },
      { type: 'text', value: 'קל לכתוב משפט כזה ולהמשיך הלאה. קשה יותר לעצור ולהבין מה הוא אומר. אדם צעיר, בן עשרים-ומשהו, מתעורר בוקר אחד אל חיים שאינם דומים בשום צורה לחיים שהכיר. רוב האנשים, אחרי רגע כזה, מקדישים שנים רק לבנות מחדש את הקרקע שמתחת לרגליים, גם כשאין רגליים.' },
      { type: 'text', value: 'נבייב בחר משהו אחר. הוא בחר בהרים.' },

      { type: 'section', value: 'הדרך אל ההר' },
      { type: 'text', value: 'ההחלטה לפנות אל ההרים לא הייתה קפיצה אחת דרמטית. היא הייתה דרך. החל משנת 2020, נבייב התחיל לטפס, שיטתית, פסגה אחר פסגה, לא בשביל כותרות אלא כי ההר מחייב. הוא העפיל לשני ראשיו של הר אלברוס, הפסגה הגבוהה באירופה, הר שאפילו מטפסים עם שתי רגליים מוצאים בו אתגר של ממש. אחר כך קזבק שבקווקז, הר אררט, קילימנג\'רו, גג אפריקה, ואקונקגואה, הפסגה הגבוהה ביבשת אמריקה בגובה 6,961 מטרים, שם האוויר כבר מדלל ומה שנראה אפשרי בגובה פני הים מתחיל להרגיש אחרת.' },
      { type: 'text', value: 'כל פסגה לימדה אותו משהו שהפסגה הבאה דרשה. הגוף הסתגל. הטכניקה השתכללה. הוא פיתח שיטת תנועה עם גרזני קרח שאין לה ספר לימוד, כי ספר כזה לא קיים. נבייב כתב אותו תוך כדי תנועה.' },
      { type: 'text', value: 'נקודת המפנה הגדולה הגיעה באוקטובר 2021, כשנבייב העפיל להר מנסלו, פסגה בת 8,163 מטרים בהימלאיה, אחת מ-14 הפסגות הגבוהות בעולם מעל 8,000 מ\'. בגובה כזה, כמות החמצן נופלת לכמחצית ממה שיש בגובה פני הים. כאבי לחץ, עייפות קיצונית, קור עצום, כולם מכפילים את עצמם. מטפסים מנוסים קורסים בגובה הזה. נבייב לא רק הגיע לפסגה, הוא הגיע אליה ללא תותבות, בכוח זרועותיו בלבד, והפך למטפס הקטוע-רגליים הראשון בעולם שמגיע לפסגה מעל 8,000 מ\' ללא תותבות. מנסלו היה הניסוי הגדול. הוא הוכיח שזה אפשרי. נותר ההר האחרון.' },

      { type: 'section', value: 'מה זה אומר לטפס על האוורסט בלי רגליים' },
      { type: 'text', value: 'כדי להבין את גודל ההישג, צריך להבין מה הטיפוס דורש מהגוף. מטפס לאוורסט מבלה שבועות בתנועה: חציית מפל הקרח של חומבו עם סולמות מעל סדקים, טיפוס במדרונות שלג תלולים, התקדמות לאורך חבלים קבועים אל הפסגה. כל זה נעשה בדרך כלל בכוח הרגליים, כשהזרועות מסייעות. נבייב הפך את המשוואה.' },
      { type: 'text', value: 'עבורו, כל מטר של עלייה הוא משיכה של מלוא משקל הגוף כלפי מעלה, בכוח הידיים, באוויר שבו יש שליש מהחמצן שיש בגובה פני הים. נבייב טיפס עם גרזני קרח, נעזר בחמש שרפות ובשלושה מדריכים. הוא יצא ממחנה הבסיס ב-13 במאי, יום הולדתו ה-34, וחצה את ארבעת המחנות הגבוהים עד שעמד על הפסגה שבוע מאוחר יותר.' },
      { type: 'image', src: '/images/blog/nabiev-climbing.jpg', alt: 'רוסתם נבייב חוגג יומולדת 34 באוורסט בייס קמפ', caption: 'רוסתם נבייב. חגג את יום הולדתו עם היציאה לטיפוס' },
      { type: 'callout', title: '✦ המסע במספרים', items: [
        '13 במאי: יציאה ממחנה הבסיס, ביום הולדתו ה-34',
        '7 ימים: הזמן שלקח לחצות ארבעה מחנות עד הפסגה',
        '5 שרפות ו-3 מדריכים שליוו אותו',
        '8,848 מטרים בכוח הזרועות בלבד',
        '11 שנים מהתאונה לפסגה',
      ]},

      { type: 'section', value: 'מה שהופך אותו לייחודי' },
      { type: 'text', value: 'בכל סיפור גדול ראוי להיות מדויק, וגם כאן. נבייב אינו המטפס הראשון עם מוגבלות שמגיע לפסגת האוורסט, וחשוב לומר זאת, לא כדי להקטין, אלא משום שיש לפניו שורה של גיבורים שראויים גם הם להיזכר.' },
      { type: 'text', value: 'ב-2006 הפך הניו-זילנדי מארק אינגליס למטפס הראשון עם קטיעה דו-צדדית שמעפיל לפסגה, בעזרת תותבות. ב-2013 עלה הקנדי סודרשן גאוטם, שאין לו זרועות, אל הפסגה. וב-2023 השלים הארי בודהה מאגאר, יוצא יחידת הגורקה הבריטית שאיבד את רגליו באפגניסטן, את הטיפוס בעזרת תותבות.' },
      { type: 'text', value: 'ההישג הייחודי של נבייב הוא ספציפי: הוא האדם הראשון שמטפס לפסגת האוורסט רק בכוח זרועותיו, ללא רגליים וללא תותבות. הוא נמנה כעת עם רשימה קטנה של מטפסים שמשנים את ההבנה של מה גוף אנושי מסוגל לעשות בהר.' },
      { type: 'image', src: '/images/blog/nabiev-summit.jpg', alt: 'פסגת האוורסט בעונת 2026', caption: 'פסגת האוורסט, 8,848 מטרים. ב-20 במאי 2026 עמד עליה אדם ללא רגליים' },

      { type: 'section', value: 'כבר מסתכל אל היעד הבא' },
      { type: 'text', value: 'מה שמייחד אנשים כמו נבייב הוא שהם לא נחים על הפסגה. ימים ספורים אחרי ההעפלה, בריאיון לסוכנות הידיעות הרוסית TASS, כבר דיבר נבייב על המטרה הבאה: הוא מכוון להתחרות במשחקים הפראלימפיים ב-2030, בענף ספורט אישי.' },
      { type: 'text', value: 'זה לא מפתיע מי שמכיר את נבייב. הוא מעולם לא הגדיר את עצמו רק כמטפס. הוא בלוגר, אתלט, ואדם שמתמודד בפומבי עם מה שגורל שם בדרכו. המשחקים הפראלימפיים הם בדיוק הסוג של אתגר שמתאים לו: זירה חדשה לגמרי, ענף ספורט שבו ההר לא מגדיר את הכללים, ואליו הוא צריך להגיע מאפס. בשביל אנשים כמו נבייב, האפס הוא לא מקום רע להתחיל ממנו.' },
      { type: 'text', value: 'באותה נשימה הוא גם אמר משהו כן ולא מובן מאליו, שהוא אינו רואה את עצמו עוסק בטיפוס הרים לאורך כל חייו, משום שהעיסוק הזה גובה מחיר גופני כבד. זו אמירה שמזכירה דבר חשוב: גם מי שמבצע את הבלתי-יאמן יודע בדיוק כמה זה עולה. ההישג של נבייב אינו חף ממחיר, הוא פשוט החליט שהמחיר שווה את זה.' },

      { type: 'section', value: 'המסר מהפסגה' },
      { type: 'text', value: 'השלט שהחזיק בידיו על פסגת האוורסט לא היה מקרי. "למי שחשבו שהחיים נגמרו אחרי הנפילה." הוא לא כתב שם מישהו ספציפי. הוא כתב "מי שחשבו", ברבים, כי הוא יודע שיש יותר מאחד. בכל מקום בעולם יש מישהו שנפל, שאיבד, שמרגיש שהדרך נגמרה. אחרי שעמד על הפסגה, פרסם נבייב הודעה לעוקביו ברחבי העולם. הוא הקדיש את ההעפלה לכל מי שצופה בו, וביקש דבר אחד: כל עוד נותרים בך חיים, להמשיך להיאבק, עד הסוף.' },
      { type: 'text', value: 'זו אינה אמירה של אדם שהכל היה קל עבורו. זו אמירה של אדם שאיבד את חבריו ואת רגליו בבוקר אחד, ובחר, לאורך אחת-עשרה שנים, לבנות מתוך זה משהו. הפסגה לא הייתה הנקודה. היא הייתה ההוכחה.' },

      { type: 'section', value: 'למה הסיפור הזה מדבר אלינו ב-HighAir' },
      { type: 'text', value: 'אנחנו ב-HighAir Expeditions מאמינים שההר אינו רק יעד גיאוגרפי. הוא מקום שבו אנשים מגלים גבולות שלא ידעו שיש להם, ואז מגלים שאפשר לחצות אותם. הסיפור של רוסתם נבייב הוא הביטוי הקיצוני של הרעיון הזה, אבל הוא לא שונה במהותו מהדרך של כל מטפס.' },
      { type: 'text', value: 'זו גם הסיבה שאחוז מכל משלחת שאנחנו מובילים מוקדש לתמיכה בחולי סרטן בישראל, אנשים שמנהלים מאבק משלהם, רחוק מההרים, וזקוקים בדיוק לאותה נחישות. בעינינו, הקשר בין הדברים אינו מקרי. כוח, תקווה, וההחלטה להמשיך גם כשהמסלול נראה בלתי אפשרי, אלה אותם דברים בדיוק, על ההר ומחוצה לו.' },
      { type: 'text', value: 'לא כל אחד יטפס על האוורסט. אבל לכל אחד יש הר משלו. ואם הסיפור של נבייב מלמד דבר אחד, הוא זה: הנקודה שבה אתה חושב שהדרך נגמרה היא, לעיתים קרובות, רק המקום שבו היא באמת מתחילה.' },
      { type: 'cta', text: 'לטרקים ומשלחות HighAir', textEn: 'HighAir Treks and Expeditions', href: '/' },

      { type: 'section', value: 'שאלות נפוצות' },
      { type: 'heading', value: 'מי הוא רוסתם נבייב?' },
      { type: 'text', value: 'מטפס הרים, בלוגר וספורטאי פראלימפי רוסי בן 34 מהעיר אופה. איבד את שתי רגליו ב-2015 בקריסת מבנה צבאי, ומאז הפך למטפס הרים מוביל בקרב מטפסים עם מוגבלות.' },
      { type: 'heading', value: 'מה ההישג שלו ב-2026?' },
      { type: 'text', value: 'ב-20 במאי 2026 הוא הפך לאדם הראשון בהיסטוריה שמעפיל לפסגת האוורסט רק בכוח זרועותיו, ללא רגליים וללא תותבות.' },
      { type: 'heading', value: 'האם הוא המטפס הראשון עם קטיעה על האוורסט?' },
      { type: 'text', value: 'לא. קדמו לו מטפסים כמו מארק אינגליס (2006) והארי בודהה מאגאר (2023), שטיפסו בעזרת תותבות. הייחוד של נבייב הוא הטיפוס בכוח הזרועות בלבד.' },
      { type: 'heading', value: 'אילו הרים נוספים טיפס נבייב?' },
      { type: 'text', value: 'בין השאר אלברוס, קזבק, אררט, קילימנג\'רו, אקונקגואה, ובאוקטובר 2021 את מנסלו, פסגה בת 8,163 מטרים, ובכך הפך למטפס הקטוע-רגליים הראשון שמגיע לפסגת הר מעל 8,000 מ\' ללא תותבות.' },
      { type: 'heading', value: 'כמה זמן לקח לנבייב לטפס על האוורסט?' },
      { type: 'text', value: 'נבייב יצא ממחנה הבסיס ב-13 במאי 2026, יום הולדתו ה-34, וחצה ארבעה מחנות בגובה הולך וגדל. הוא הגיע לפסגה ב-20 במאי, שבעה ימים מאוחר יותר.' },
    ],

    contentEn: [
      { type: 'text', value: 'At 8:16 in the morning on 20 May 2026, Nepal time, a man stood on the summit of Everest holding a small sign. On it were written the words: "For everyone who thought life was over after the fall."' },
      { type: 'text', value: 'The man is Rustam Nabiev, 34 years old, a climber, blogger and para-athlete from the city of Ufa in Russia. He has no legs. He climbed all 8,848 metres of the highest mountain in the world on the strength of his arms alone, becoming the first person in human history to do so.' },

      { type: 'video', src: '/videos/nabiev-everest-climb.mp4', poster: '/images/blog/nabiev-video-poster.jpg', caption: 'Rustam crossing ladders over crevasses in the Khumbu Icefall' },

      { type: 'section', value: 'The fall' },
      { type: 'text', value: 'On 12 July 2015, while serving as a paratrooper in the Russian army, Nabiev was sleeping in a residential block at a training base in Omsk, Siberia. The building collapsed. The cause, according to reports, was faulty construction. Twenty-three of his fellow soldiers were killed that day. Nabiev survived, but both his legs were amputated.' },
      { type: 'text', value: 'The years that followed were long. Nabiev went through a series of surgeries and an extended rehabilitation process. He learned again how his body worked, what it was capable of and what it was not. At the same time, he began documenting the journey: writing, filming, sharing. His blog became a window through which people around the world followed his recovery, and then followed the summits.' },
      { type: 'text', value: 'It is easy to write a sentence like that and move on. It is harder to stop and absorb what it actually means. A young man in his twenties wakes up one morning into a life that bears no resemblance to the life he knew. Most people, after such a moment, spend years simply rebuilding the ground beneath their feet, even when there are no feet.' },
      { type: 'text', value: 'Nabiev chose something different. He chose mountains.' },

      { type: 'section', value: 'The road to the mountain' },
      { type: 'text', value: 'The decision to turn toward the mountains was not a single dramatic leap. It was a path. From 2020, Nabiev began climbing systematically, summit by summit, not for headlines but because the mountain demands. He reached both peaks of Mount Elbrus, the highest point in Europe, a mountain that challenges even climbers with two fully functioning legs. Then Kazbek in the Caucasus, Mount Ararat, Kilimanjaro, the roof of Africa, and Aconcagua, the highest summit in the Americas at 6,961 metres, where the air already thins and what seems possible at sea level begins to feel very different.' },
      { type: 'text', value: 'Each summit taught him something the next one would demand. The body adapted. The technique refined itself. He developed a method of movement with ice axes that had no textbook, because no such textbook exists. Nabiev wrote it as he moved.' },
      { type: 'text', value: 'The decisive turning point came in October 2021, when Nabiev summited Manaslu, an 8,163-metre peak in the Himalayas and one of the fourteen highest peaks in the world above 8,000 metres. At that altitude, oxygen levels drop to roughly half of what is available at sea level. The pressure headaches, the exhaustion, the cold all multiply. Experienced climbers break at that height. Nabiev not only reached the summit, he reached it without prosthetics, on the strength of his arms alone, becoming the first double-amputee climber in the world to summit an eight-thousander without prosthetics. Manaslu was the great experiment. It proved that this was possible. One mountain remained.' },

      { type: 'section', value: 'What it means to climb Everest without legs' },
      { type: 'text', value: 'To understand the scale of the achievement, you need to understand what the climb demands of the body. A climber on Everest spends weeks in motion: crossing the Khumbu Icefall on ladders above crevasses, ascending steep snow slopes, moving along fixed ropes toward the summit. All of this is normally done with the legs carrying the primary load while the arms assist. Nabiev reversed the equation.' },
      { type: 'text', value: 'For him, every metre of ascent is a pull of his full body weight upward, by the strength of his hands, in air containing one-third of the oxygen available at sea level. Nabiev climbed with ice axes, assisted by five Sherpa and three guides. He left base camp on 13 May, his 34th birthday, crossed all four high camps, and stood on the summit a week later.' },
      { type: 'image', src: '/images/blog/nabiev-climbing.jpg', alt: 'Rustam Nabiev celebrating his 34th birthday at Everest Base Camp', caption: 'Rustam Nabiev. He celebrated his birthday on the day he set out to climb.' },
      { type: 'callout', title: '✦ The journey in numbers', items: [
        '13 May: departure from base camp, on his 34th birthday',
        '7 days to cross four high camps and reach the summit',
        '5 Sherpa and 3 guides by his side',
        '8,848 metres on the strength of his arms alone',
        '11 years from the accident to the summit',
      ]},

      { type: 'section', value: 'What makes him unique' },
      { type: 'text', value: 'Every great story deserves precision, and this one is no different. Nabiev is not the first disabled climber to reach the summit of Everest, and it is important to say so, not to diminish the achievement, but because there is a line of remarkable people before him who deserve to be remembered.' },
      { type: 'text', value: 'In 2006, New Zealander Mark Inglis became the first double amputee to summit Everest, using prosthetics. In 2013, Canadian Sudharshan Gautam, who has no arms, reached the summit. And in 2023, Harry Bhudha Magar, a former British Gurkha soldier who lost his legs in Afghanistan, completed the climb on prosthetics.' },
      { type: 'text', value: 'Nabiev\'s unique achievement is specific: he is the first person to climb to the summit of Everest on the strength of his arms alone, without legs and without prosthetics. He now belongs to a small group of climbers who have changed the understanding of what a human body is capable of on a mountain.' },
      { type: 'image', src: '/images/blog/nabiev-summit.jpg', alt: 'The summit of Everest in the 2026 season', caption: 'The summit of Everest, 8,848 metres. On 20 May 2026, a man without legs stood here' },

      { type: 'section', value: 'Already looking to the next goal' },
      { type: 'text', value: 'What distinguishes people like Nabiev is that they do not rest on the summit. Just days after the ascent, in an interview with the Russian news agency TASS, Nabiev was already speaking about his next target: he is aiming to compete in the 2030 Paralympic Games in an individual sport.' },
      { type: 'text', value: 'This is no surprise to anyone who knows him. Nabiev has never defined himself only as a climber. He is a blogger, an athlete, and someone who navigates publicly what fate has placed in his path. The Paralympic Games are exactly the kind of challenge that suits him: an entirely new arena, a sport in which the mountain does not set the rules, and where he needs to start from scratch. For people like Nabiev, starting from scratch is not a bad place to begin.' },
      { type: 'text', value: 'In the same breath he said something honest and far from obvious: that he does not see himself in high-altitude mountaineering for the rest of his life, because the pursuit takes a severe physical toll. It is a statement that reminds you of something important: even those who achieve the seemingly impossible know exactly what it costs. Nabiev\'s achievement is not without a price. He simply decided the price was worth paying.' },

      { type: 'section', value: 'The message from the summit' },
      { type: 'text', value: 'The sign he held in his hands on the summit of Everest was not accidental. "For everyone who thought life was over after the fall." He did not write a specific name. He wrote "everyone who thought," in the plural, because he knows there is more than one. Somewhere in the world there is always someone who has fallen, who has lost, who feels as if the road has ended. After standing on the summit, Nabiev published a message to his followers around the world. He dedicated the ascent to everyone watching him, and asked for one thing: as long as life remains in you, keep fighting, to the very end.' },
      { type: 'text', value: 'That is not the statement of someone for whom everything came easily. It is the statement of a man who lost his friends and his legs in a single morning, and chose, over eleven years, to build something from it. The summit was not the point. It was the proof.' },

      { type: 'section', value: 'Why this story speaks to us at HighAir' },
      { type: 'text', value: 'At HighAir Expeditions we believe a mountain is not just a geographical destination. It is a place where people discover limits they did not know they had, and then discover that those limits can be crossed. The story of Rustam Nabiev is the most extreme expression of that idea, but it is not fundamentally different from the journey of any climber.' },
      { type: 'text', value: 'It is also why a portion of every expedition we run is dedicated to supporting cancer patients in Israel, people who are fighting their own battle, far from any mountain, and who need exactly the same kind of determination. In our view, the connection between these things is not accidental. Strength, hope, and the decision to keep going when the path seems impossible are the same things, whether you are on the mountain or off it.' },
      { type: 'text', value: 'Not everyone will climb Everest. But everyone has their own mountain. And if Nabiev\'s story teaches one thing, it is this: the point at which you think the road has ended is, more often than not, exactly where it truly begins.' },
      { type: 'cta', text: 'לטרקים ומשלחות HighAir', textEn: 'HighAir Treks and Expeditions', href: '/' },

      { type: 'section', value: 'Frequently asked questions' },
      { type: 'heading', value: 'Who is Rustam Nabiev?' },
      { type: 'text', value: 'A Russian mountaineer, blogger and para-athlete, aged 34, from the city of Ufa. He lost both his legs in 2015 when a military building collapsed, and has since become one of the leading high-altitude climbers among athletes with disabilities.' },
      { type: 'heading', value: 'What did he achieve in 2026?' },
      { type: 'text', value: 'On 20 May 2026 he became the first person in history to summit Everest using only the strength of his arms, without legs and without prosthetics.' },
      { type: 'heading', value: 'Is he the first disabled person to summit Everest?' },
      { type: 'text', value: 'No. Before him, climbers including Mark Inglis (2006) and Harry Bhudha Magar (2023) summited using prosthetics. What makes Nabiev unique is completing the climb by arm strength alone, with no prosthetics at all.' },
      { type: 'heading', value: 'What other mountains has Nabiev climbed?' },
      { type: 'text', value: 'Among others: Elbrus, Kazbek, Ararat, Kilimanjaro, Aconcagua, and in October 2021 Manaslu, an eight-thousander at 8,163 metres, making him the first legless climber to summit a peak above 8,000 metres without prosthetics.' },
      { type: 'heading', value: 'How long did it take Nabiev to climb Everest?' },
      { type: 'text', value: 'Nabiev left base camp on 13 May 2026, his 34th birthday, and crossed four progressively higher camps. He reached the summit on 20 May, seven days later.' },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
   *  id:4  kristin-harila-everest-triple-crown  (2026-05-21)
   * ═══════════════════════════════════════════════════════════════════ */
  {
    id:       4,
    slug:     'kristin-harila-everest-triple-crown',

    /* ── Hebrew ── */
    title:    'שלושת הכתרים של האוורסט: קריסטין הרילה בדרך לשיא שאף אישה לא הגיעה אליו',
    author:   'HighAir Expeditions',
    dateIso:  '2026-05-21',
    dateModified: '2026-05-21',
    dateHe:   '21 במאי 2026',
    dateEn:   'May 21, 2026',
    category: 'חדשות',
    categoryEn: 'News',
    img:             '/images/blog/kristin-harila.webp',
    imgPosition:     'center 20%',
    imgPositionCard: 'center 20%',
    imgCredit:       '',
    excerpt:  'בעונת 2026 יצאה המטפסת הנורווגית למשימה שרק ארבעה אנשים השלימו לפניה. אבל מתחת לשיא הספורטיבי מסתתר סיפור על אובדן, על הר אחד באוקטובר, ועל הסיבה האמיתית שבגללה היא חזרה.',
    excerptEn: 'In the 2026 season the Norwegian climber set out on a mission only four people have ever completed. But beneath the sporting achievement lies a story of loss, one mountain in October, and the real reason she came back.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'בשעה מוקדמת של ה-17 במאי 2026, על פסגת נופטסה שגובהה 7,861 מטרים, נשמע במכשיר הקשר קולה של קריסטין הרילה. היא נשמעה עייפה מאוד. זה היה הדבר הראשון שדיווחה אחרי שעות של טיפוס בקור חותך, באוויר דליל, בלי מסכת חמצן על הפנים.' },
      { type: 'text', value: 'נופטסה הוא רק ההר הראשון. לפניה עומדים עוד שניים: להוצה, הרביעי בגובהו בעולם, והאוורסט עצמו. שלושתם באותה עונה, שלושתם ללא חמצן משלים. רק ארבעה בני אדם בהיסטוריה השלימו את הרצף הזה, ואף אישה לא הייתה ביניהם. כדי להבין למה ההעפלה הזו חשובה כל כך, לא רק להרילה אלא לכל מי שאוהב הרים, צריך לחזור שלוש שנים אחורה, אל הר אחר, ואל יום אחד באוקטובר.' },

      { type: 'section', value: 'מי היא קריסטין הרילה' },
      { type: 'text', value: 'קריסטין הרילה הפכה לשם מוכר בעולם הטיפוס בקיץ 2023. באותה שנה היא ושותפה לטיפוס, מטפס השרפה הנפאלי טנזין לאמה שרפה, העפילו לכל 14 הפסגות הגבוהות בעולם מעל 8,000 מ\' בתוך 92 ימים בלבד.' },
      { type: 'text', value: 'זה היה שיא עולם. הוא חטף את התואר ממטפסים שקדמו לה ומיקם אותה בחזית עולם טיפוס הגובה. חשוב להבין מה השיא הזה כלל ומה לא: הצמד נע במסוקים בין מחנות הבסיס של ההרים השונים, והשתמש בחמצן משלים בהעפלות. זו הייתה משימה לוגיסטית ופיזית יוצאת דופן, מסוג חדש, מהירה, מתוכננת, נתמכת. השיא הביא להרילה תהילה עולמית, ולצידה גם ביקורת ומחלוקת על תרבות מרדף השיאים שהתפתחה סביב ההרים הגבוהים.' },
      { type: 'text', value: 'אבל את הסיפור האמיתי של הרילה אי אפשר לספר דרך המספרים. הוא מתחיל בבן אדם אחד.' },

      { type: 'section', value: 'האח שאבד בהר' },
      { type: 'text', value: 'טנזין לאמה שרפה לא היה רק שותף עסקי או מדריך שכיר. הרילה כתבה עליו, אחרי מותו, שהוא היה עבורה אח. שהוא היה עצם ההגדרה של טוב לב אנושי. שעל ההר הוא נע כאילו הוא חלק ממנו, ושהוא הזמין אותה, בנדיבות, להיכנס פנימה אל העולם הזה.' },
      { type: 'text', value: 'טנזין היה מטפס נפאלי יוצא דופן בכישרונו. הוא היה האדם ה-50 בהיסטוריה שהעפיל לכל 14 הפסגות הגבוהות בעולם מעל 8,000 מ\', והשיא של 92 הימים נשא גם את שמו, לא רק את שמה של הרילה. הוא היה בעל משפחה: אישה ושני בנים.' },
      { type: 'text', value: 'ב-7 באוקטובר 2023, פחות משלושה חודשים אחרי שהצמד השלים את שיא העולם, יצא טנזין לטפס על שישאפנגמה, אחת מ-14 הפסגות הגבוהות בעולם מעל 8,000 מ\', שנמצאת בטיבט. מפולת שלגים עצומה סחפה את מסלול הטיפוס המרכזי. ארבעה מטפסים נספו באותו יום. גופותיהם של שניים מהם, ובהם טנזין, מעולם לא נמצאו.' },
      { type: 'text', value: 'האסון בשישאפנגמה החריף ויכוח שכבר התנהל בעולם הטיפוס: האם המרדף אחר שיאים דוחף מטפסים אל סיכונים שאסור היה לקחת. דווח שחלק מהמטפסים בהר באותו יום המשיכו אל הפסגה גם אחרי מפולת ראשונה. השאלה הזו עדיין פתוחה, וכואבת.' },
      { type: 'text', value: 'עבור הרילה, האובדן לא היה תיאורטי. כשהגיעה הידיעה היא טסה מיד לקטמנדו. בחודשים שאחרי כן היא לא ניסתה להמשיך הלאה כאילו דבר לא קרה. היא ניסתה להחזיר את טנזין הביתה. היא גייסה כספים למימון משימת חילוץ של הגופות, ואף מכרה את השעון שליווה אותה במשלחת השיא. אשתו של טנזין ושני בניו ביקשו דבר אחד: שגופתו תושב, כדי שאפשר יהיה להיפרד.' },
      { type: 'text', value: 'המשימה הזו נחסמה לא בידי ההר אלא בידי הפוליטיקה. הגישה לשישאפנגמה, שנמצאת בצד הטיבטי, תלויה באישורים סיניים, והם לא ניתנו. הרילה נאלצה לדחות את החיפוש שוב ושוב.' },
      { type: 'image', src: '/images/blog/shishapangma.jpg', caption: 'שישאפנגמה, ההר הטיבטי שבו נספה טנזין לאמה שרפה באוקטובר 2023' },

      { type: 'section', value: 'כשהיא הניחה את ההרים בצד' },
      { type: 'text', value: 'אובדן כזה משאיר חותם. בתקופה שאחרי מות טנזין, הרילה התרחקה מהטיפוס. היא דיברה בגלוי על כך שהיא שוקלת לעזוב את הענף כולו. לאדם שהשיא שלו היה בנוי על שותפות אחת קרובה, שותפות שהמוות קטע באמצע, ההר כבר לא נראה אותו דבר.' },
      { type: 'text', value: 'מי שעוקב אחרי עולם הטיפוס יודע שזה לא נדיר. רבים ממיטב המטפסים מגיעים לרגע שבו הם שואלים את עצמם אם המחיר שווה את זה. חלקם עוזבים. חלקם חוזרים. הרילה, בסופו של דבר, חזרה, אבל אחרת.' },

      { type: 'section', value: 'החזרה: פרידה מן האוורסט' },
      { type: 'text', value: 'כשהרילה הכריזה על שובה להימלאיה ב-2026, היא לא הציגה את זה כעוד מרדף שיאים. היא תיארה את האתגר הזה כפרידה שלה מן האוורסט. הזדמנות אחרונה לעמוד מול ההר הגבוה בעולם בתנאים שלה, ואז להניח אותו.' },
      { type: 'text', value: 'החזרה קשורה לטנזין בשני מובנים. ראשית, הרילה אמרה שאחת ממטרותיה בשובה היא לחדש את הניסיון להגיע לשישאפנגמה ולחפש את גופתו. שנית, עצם ההחלטה לחזור אל ההרים, המקום שבו איבדה אותו, היא דרך לשאת את זכרו הלאה, אל תוך ההרים שאהב.' },
      { type: 'text', value: 'האתגר של 2026 אינו רק פרק ספורטיבי. הוא מסע של אדם שמנסה לסגור מעגל.' },

      { type: 'section', value: 'מה הם שלושת הכתרים של האוורסט' },
      { type: 'text', value: 'האתגר שהרילה בחרה נקרא "שלושת הכתרים של האוורסט" (The Everest Triple Crown). הרעיון פשוט להגדרה וקשה מנשוא לביצוע: לטפס בעונה אחת על שלוש הפסגות הגבוהות ביותר במסיב האוורסט.' },
      { type: 'subheading', value: 'נופטסה, 7,861 מטרים' },
      { type: 'text', value: 'השכנה התלולה והטכנית של האוורסט. פסגה שנחשבת קשה גם למטפסים מנוסים.' },
      { type: 'subheading', value: 'להוצה, 8,516 מטרים' },
      { type: 'text', value: 'ההר הרביעי בגובהו בעולם, צמוד לאוורסט וחולק איתו חלק מן המסלול.' },
      { type: 'subheading', value: 'האוורסט, 8,848 מטרים' },
      { type: 'text', value: 'הגבוה בעולם.' },
      { type: 'text', value: 'הקושי אינו רק בגובה. הוא בהצטברות. שלוש העפלות לגובה קיצוני בתוך חלון זמן אחד, בלי שהגוף מספיק להתאושש באמת בין אחת לשנייה, הן עומס שמעט מאוד בני אדם מסוגלים לשאת. רק ארבעה מטפסים בהיסטוריה השלימו את שלושת הכתרים. אף אישה, עד היום, לא עשתה זאת.' },
      { type: 'text', value: 'נכון לאמצע מאי 2026, הרילה השלימה את השלב הראשון, נופטסה. בהמשך מתוכננת להוצה, ואז מנוחה במחנה הבסיס, ולבסוף ההעפלה אל פסגת האוורסט בשלהי העונה.' },
      { type: 'image', src: '/images/blog/everest-hardest.webp', alt: 'שלושת הכתרים של האוורסט: נופטסה להוצה ואוורסט', caption: 'מסיב האוורסט מהצד הדרומי, שם ממוקמות שלוש הפסגות של האתגר' },

      { type: 'section', value: 'למה דווקא בלי חמצן' },
      { type: 'text', value: 'ההחלטה המשמעותית ביותר באתגר של הרילה היא לא בחירת ההרים. היא הוויתור על החמצן.' },
      { type: 'text', value: 'בגבהים שמעל 8,000 מטרים, באזור שמטפסים מכנים "אזור המוות", כמות החמצן בכל נשימה צונחת לכשליש מזו שבגובה פני הים. הגוף האנושי באזור הזה דועך, הוא צורך את עצמו מהר יותר משהוא מתאושש. רוב המטפסים שמעפילים ללהוצה ולאוורסט עושים זאת עם מסכת חמצן, וזה אינו פינוק אלא כלי בטיחות שמפחית דרמטית את הסיכון לנזק גופני קבוע.' },
      { type: 'callout', title: '✦ מה זה "אזור המוות"?', value: 'גובה מעל 8,000 מטרים שבו אין מספיק חמצן בסביבה כדי לקיים חיים אנושיים לאורך זמן. הגוף מתחיל לצרוך רקמות שרירים כדי לתפקד. כל שעה שעוברת בגובה הזה גובה מחיר.' },
      { type: 'text', value: 'לטפס את שלושת הכתרים בלי חמצן פירושו להכפיל את הקושי ואת הסיכון כאחד.' },
      { type: 'text', value: 'ההחלטה הזו גם עוררה ביקורת. מבקרים ציינו שלמרות שיא 14 הפסגות מעל 8,000 מ\', להרילה ניסיון מועט יחסית בטיפוס בגובה קיצוני בלי חמצן, שכן בשיא ההוא היא כן השתמשה בו. הרילה השיבה שסגנון הטיפוס המהיר שלה הותיר אותה פעמים רבות מטפסת בלי חמצן בפועל, ושכספורטאית היא סקרנית לדעת איך גופה יגיב. בין אם צודקים המבקרים ובין אם לאו, נופטסה כבר מאחוריה, והיא עשתה אותה ללא טיפת חמצן מן הבקבוק.' },

      { type: 'section', value: 'הכל התחיל בהר אחד' },
      { type: 'text', value: 'יש פרט אחד בסיפור של הרילה שקל לפספס, והוא אולי החשוב מכולם למי שקורא את השורות האלה וחושב על ההר הראשון שלו.' },
      { type: 'text', value: 'ההעפלה הראשונה של הרילה לגובה רב לא הייתה על פסגה מעל 8,000 מ\'. היא הייתה על לובוצ\'ה, פסגה באזור האוורסט שגובהה כ-6,100 מטרים. זה היה ב-2019. הרילה סיפרה שהיא זוכרת את הטיפוס ההוא כקשה. כמאמץ אמיתי. שש שנים מאוחר יותר, אותה אישה מטפסת על אותו הר בתוך פחות משלוש שעות.' },
      { type: 'text', value: 'זה לא סיפור על כישרון נדיר. זה סיפור על דרך. כל מטפס שאתם רואים היום על פסגות העולם, כולל קריסטין הרילה, התחיל פעם אחת, על הר אחד, כשהוא עוד לא ידע אם הוא מסוגל. לובוצ\'ה היא בדיוק הר כזה: פסגת טרקינג נגישה, שדורשת מעט ציוד טכני ולא שנים של ניסיון, ומהווה צעד ראשון אמיתי אל עולם הטיפוס בגובה.' },
      { type: 'image', src: '/images/blog/lobuche-peak.jpg', caption: 'לובוצ\'ה פיק, 6,119 מטרים, ההר שממנו התחיל המסע של קריסטין הרילה' },
      { type: 'cta', text: 'למידע על משלחת לובוצ\'ה פיק של HighAir', textEn: 'Learn about HighAir\'s Lobuche Peak expedition', href: '/expedition/lobuche-peak' },

      { type: 'section', value: 'לסיכום: ההר נותן, וההר לוקח' },
      { type: 'text', value: 'הסיפור של קריסטין הרילה מסרב להיכנס לקופסה של "כתבת שיאים". יש בו הישג ספורטיבי נדיר, אבל יש בו גם אובדן עמוק, נאמנות לחבר שאיננו, ושאלה כנה על המחיר של החלומות הגדולים. זה, אולי, הסיפור האמיתי של ההרים הגבוהים: הם נותנים לאדם תחושת חיים שקשה למצוא במקום אחר, והם גם יודעים לקחת.' },
      { type: 'text', value: 'ב-HighAir Expeditions אנחנו מאמינים שהמסע אל ההר אינו רק על הפסגה. הוא על האנשים שלצידך, על המשמעות שאתה מוצא בדרך, ועל מה שאתה לוקח איתך הביתה. חלק מהרווחים מכל משלחת שלנו מוקדש לתמיכה בחולי סרטן בישראל, כי הרים, בעינינו, הם גם דרך לתת.' },
      { type: 'cta', text: 'דברו איתנו על המסע הראשון שלכם', textEn: 'Talk to us about your first expedition', href: '/contact' },

      { type: 'section', value: 'שאלות נפוצות' },
      { type: 'heading', value: 'מה הם שלושת הכתרים של האוורסט?' },
      { type: 'text', value: 'טיפוס בעונה אחת על שלוש הפסגות הגבוהות במסיב האוורסט: נופטסה (7,861 מטרים), להוצה (8,516 מטרים) והאוורסט (8,848 מטרים). רק ארבעה אנשים בהיסטוריה השלימו את הרצף הזה.' },
      { type: 'heading', value: 'האם קריסטין הרילה כבר טיפסה על האוורסט בעונת 2026?' },
      { type: 'text', value: 'נכון לאמצע מאי 2026, הרילה השלימה את ההר הראשון מבין השלושה, נופטסה. ההעפלה לפסגת האוורסט מתוכננת לשלב מאוחר יותר בעונה.' },
      { type: 'heading', value: 'מי היה טנזין לאמה שרפה?' },
      { type: 'text', value: 'מטפס שרפה נפאלי, שותפה של הרילה לשיא העולם בטיפוס לכל 14 הפסגות ב-2023. הוא נספה במפולת שלגים על הר שישאפנגמה באוקטובר 2023, וגופתו לא נמצאה.' },
      { type: 'heading', value: 'מהו אתגר 14 הפסגות של הרילה?' },
      { type: 'text', value: 'ב-2023, הרילה וטנזין לאמה שרפה העפילו לכל 14 ההרים מעל 8,000 מטרים בתוך 92 ימים, שיא עולם. הטיפוס ההוא כלל שימוש בחמצן משלים.' },
      { type: 'heading', value: 'למה טיפוס ללא חמצן נחשב לקשה כל כך?' },
      { type: 'text', value: 'בגובה רב כמות החמצן בכל נשימה צונחת דרמטית. מעל 8,000 מטרים הגוף אינו מסוגל להתאושש. ויתור על חמצן משלים מגדיל מאוד את המאמץ ואת הסיכון, ושמור למטפסי עילית.' },
    ],

    /* ── English content ── */
    titleEn: 'The Everest Triple Crown: Kristin Harila on the way to a record no woman has ever reached',
    contentEn: [
      { type: 'text', value: 'In the early hours of 17 May 2026, on the summit of Nuptse at 7,861 metres, Kristin Harila\'s voice came through on the walkie-talkie. She sounded very tired. That was the first thing she reported after hours of climbing in cutting cold, in thin air, without an oxygen mask on her face.' },
      { type: 'text', value: 'Nuptse is only the first mountain. Two more stand before her: Lhotse, the fourth highest in the world, and Everest itself. All three in one season, all three without supplemental oxygen. Only four people in history have completed this sequence, and no woman has ever been among them. To understand why this ascent matters so much, not just for Harila but for everyone who loves mountains, you have to go back three years, to a different mountain, and to one day in October.' },

      { type: 'section', value: 'Who is Kristin Harila' },
      { type: 'text', value: 'Kristin Harila became a household name in the climbing world in the summer of 2023. That year she and her climbing partner, Nepali Sherpa climber Tenzing Lama Sherpa, summited all 14 mountains in the world above 8,000 metres, all 14 eight-thousanders, in just 92 days.' },
      { type: 'text', value: 'It was a world record. It snatched the title from climbers who had come before her and placed her at the forefront of high-altitude mountaineering. It is important to understand what the record involved and what it did not: the pair flew by helicopter between the base camps of different mountains and used supplemental oxygen on the summit pushes. It was an extraordinary logistical and physical undertaking of a new kind, fast, planned, supported. The record brought Harila worldwide fame, alongside criticism and controversy about the culture of record-chasing that has developed around the high mountains.' },
      { type: 'text', value: 'But the true story of Harila cannot be told through numbers. It begins with one person.' },

      { type: 'section', value: 'The brother lost on the mountain' },
      { type: 'text', value: 'Tenzing Lama Sherpa was not simply a business partner or a hired guide. Harila wrote about him after his death that he had been like a brother to her. That he embodied the very definition of human kindness. That on the mountain he moved as though he were part of it, and that he had generously invited her into that world.' },
      { type: 'text', value: 'Tenzing was an exceptionally gifted Nepali climber. He was the 50th person in history to summit all 14 eight-thousanders, and the 92-day record carried his name alongside Harila\'s. He had a family: a wife and two sons.' },
      { type: 'text', value: 'On 7 October 2023, less than three months after the pair completed their world record, Tenzing went to climb Shishapangma, one of the 14 eight-thousanders in Tibet. A massive avalanche swept the main climbing route. Four climbers died that day. The bodies of two of them, including Tenzing, were never found.' },
      { type: 'text', value: 'The disaster on Shishapangma sharpened a debate already running in the climbing world: whether the pursuit of records pushes climbers into risks they should never have taken. Reports suggested some climbers on the mountain that day continued toward the summit even after a first avalanche. That question remains open, and painful.' },
      { type: 'text', value: 'For Harila, the loss was not theoretical. When the news came she flew immediately to Kathmandu. In the months that followed she did not try to move on as if nothing had happened. She tried to bring Tenzing home. She raised funds to finance a body recovery mission and even sold the watch that had accompanied her on the record expedition. Tenzing\'s wife and two sons asked for one thing: that his body be returned, so they could say goodbye.' },
      { type: 'text', value: 'That mission was blocked not by the mountain but by politics. Access to Shishapangma, on the Tibetan side, depends on Chinese permits, and they were not granted. Harila was forced to postpone the search again and again.' },
      { type: 'image', src: '/images/blog/shishapangma.jpg', caption: 'Shishapangma, the Tibetan eight-thousander where Tenzing Lama Sherpa died in October 2023' },

      { type: 'section', value: 'When she set the mountains aside' },
      { type: 'text', value: 'A loss like that leaves its mark. In the period after Tenzing\'s death, Harila stepped back from climbing. She spoke openly about considering leaving the sport altogether. For someone whose record had been built on one close partnership, a partnership that death cut short, the mountain no longer looked the same.' },
      { type: 'text', value: 'Anyone who follows the climbing world knows this is not rare. Many of the best climbers reach a moment when they ask themselves whether the price is worth it. Some leave. Some return. Harila, in the end, came back, but differently.' },

      { type: 'section', value: 'The return: a farewell to Everest' },
      { type: 'text', value: 'When Harila announced her return to the Himalayas in 2026, she did not present it as another record chase. She described this challenge as her farewell to Everest. A last chance to stand before the highest mountain in the world on her own terms, and then let it go.' },
      { type: 'text', value: 'The return is connected to Tenzing in two ways. First, Harila said one of her goals on returning is to renew the attempt to reach Shishapangma and search for his body. Second, the very decision to return to the mountains, the place where she lost him, is a way of carrying his memory forward, into the mountains he loved.' },
      { type: 'text', value: 'The 2026 challenge is not only a sporting chapter. It is the journey of a person trying to close a circle.' },

      { type: 'section', value: 'What is the Everest Triple Crown' },
      { type: 'text', value: 'The challenge Harila has chosen is called the Everest Triple Crown. The concept is simple to define and nearly impossible to complete: to climb the three highest summits in the Everest massif in a single season.' },
      { type: 'subheading', value: 'Nuptse, 7,861 metres' },
      { type: 'text', value: 'The steep and technically demanding neighbour of Everest. A peak considered difficult even for experienced climbers.' },
      { type: 'subheading', value: 'Lhotse, 8,516 metres' },
      { type: 'text', value: 'The fourth highest mountain in the world, adjacent to Everest and sharing part of its route.' },
      { type: 'subheading', value: 'Everest, 8,848 metres' },
      { type: 'text', value: 'The highest point on Earth.' },
      { type: 'text', value: 'The difficulty is not only about altitude. It is cumulative. Three summit pushes to extreme altitude within one weather window, without the body ever truly recovering between them, is a load that very few people can bear. Only four climbers in history have completed the Triple Crown. No woman, until now, has done so.' },
      { type: 'text', value: 'As of mid-May 2026, Harila has completed the first stage, Nuptse. Lhotse is planned next, then a rest at base camp, and finally the push to the Everest summit in the late season.' },
      { type: 'image', src: '/images/blog/everest-hardest.webp', alt: 'The three peaks of the Everest Triple Crown: Nuptse, Lhotse and Everest', caption: 'The Everest massif from the south, home to all three peaks of the challenge' },

      { type: 'section', value: 'Why without oxygen' },
      { type: 'text', value: 'The most significant decision in Harila\'s challenge is not the choice of mountains. It is the decision to go without oxygen.' },
      { type: 'text', value: 'At altitudes above 8,000 metres, in the zone climbers call the death zone, the amount of oxygen in every breath drops to roughly a third of what it is at sea level. The human body in that zone is failing: it consumes itself faster than it can recover. Most climbers who summit Lhotse and Everest do so with an oxygen mask, and this is not a luxury but a safety tool that dramatically reduces the risk of permanent physical damage.' },
      { type: 'callout', title: '✦ What is the death zone?', value: 'Altitude above 8,000 metres where there is not enough ambient oxygen to sustain human life for any extended period. The body begins consuming muscle tissue to keep functioning. Every hour spent at this altitude carries a cost.' },
      { type: 'text', value: 'Climbing the Triple Crown without oxygen means doubling the difficulty and the risk at once.' },
      { type: 'text', value: 'The decision also drew criticism. Critics noted that despite the 14 eight-thousanders record, Harila has relatively limited experience climbing at extreme altitude without oxygen, since she used it on that record. Harila replied that her fast climbing style often left her climbing without oxygen in practice, and that as an athlete she was curious to know how her body would respond. Whether the critics are right or not, Nuptse is already behind her, completed without a drop of bottled oxygen.' },

      { type: 'section', value: 'It all started on one mountain' },
      { type: 'text', value: 'There is one detail in Harila\'s story that is easy to miss, and it may be the most important of all for anyone reading these lines while thinking about their own first mountain.' },
      { type: 'text', value: 'Harila\'s first ascent to real altitude was not an eight-thousander. It was on Lobuche, a peak in the Everest region at around 6,100 metres. That was in 2019. Harila described that climb as hard. A real effort. Six years later, the same woman climbs that same mountain in under three hours.' },
      { type: 'text', value: 'This is not a story about rare talent. It is a story about a journey. Every climber you see today on the world\'s summits, including Kristin Harila, started once, on one mountain, not yet knowing if they were capable. Lobuche is exactly that kind of mountain: an accessible trekking peak that requires little technical gear and no years of experience, a genuine first step into the world of high-altitude climbing.' },
      { type: 'image', src: '/images/blog/lobuche-peak.jpg', caption: 'Lobuche Peak, 6,119 metres, the mountain where Kristin Harila\'s journey began' },
      { type: 'cta', text: 'למידע על משלחת לובוצ\'ה פיק של HighAir', textEn: 'Learn about HighAir\'s Lobuche Peak expedition', href: '/expedition/lobuche-peak' },

      { type: 'section', value: 'The mountain gives, and the mountain takes' },
      { type: 'text', value: 'Kristin Harila\'s story refuses to fit in the box of a records piece. It contains a rare athletic achievement, but it also holds deep loss, loyalty to a friend who is gone, and an honest question about the price of big dreams. That, perhaps, is the real story of the high mountains: they give a person a sense of being alive that is hard to find anywhere else, and they also know how to take.' },
      { type: 'text', value: 'At HighAir Expeditions we believe the journey to the mountain is not only about the summit. It is about the people beside you, the meaning you find along the way, and what you bring home. Part of the profits from every expedition we run is dedicated to supporting cancer patients in Israel, because mountains, in our view, are also a way to give.' },
      { type: 'cta', text: 'דברו איתנו על המסע הראשון שלכם', textEn: 'Talk to us about your first expedition', href: '/contact' },

      { type: 'section', value: 'Frequently asked questions' },
      { type: 'heading', value: 'What is the Everest Triple Crown?' },
      { type: 'text', value: 'Climbing the three highest summits in the Everest massif in a single season: Nuptse (7,861 metres), Lhotse (8,516 metres), and Everest (8,848 metres). Only four people in history have completed this sequence.' },
      { type: 'heading', value: 'Has Kristin Harila already climbed Everest in the 2026 season?' },
      { type: 'text', value: 'As of mid-May 2026, Harila has completed the first of the three mountains, Nuptse. The summit push on Everest is planned for later in the season.' },
      { type: 'heading', value: 'Who was Tenzing Lama Sherpa?' },
      { type: 'text', value: 'A Nepali Sherpa climber and Harila\'s partner in the 2023 world record for climbing all 14 peaks. He died in an avalanche on Mount Shishapangma in October 2023, and his body has never been found.' },
      { type: 'heading', value: 'What is Harila\'s 14 peaks challenge?' },
      { type: 'text', value: 'In 2023, Harila and Tenzing Lama Sherpa summited all 14 mountains above 8,000 metres in 92 days, a world record. That ascent included the use of supplemental oxygen.' },
      { type: 'heading', value: 'Why is climbing without oxygen considered so difficult?' },
      { type: 'text', value: 'At high altitude the amount of oxygen in every breath drops dramatically. Above 8,000 metres the body cannot recover. Doing without supplemental oxygen significantly increases both the effort and the risk, and is the domain of elite climbers.' },
    ],
  },


  /* ═══════════════════════════════════════════════════════════════════
   *  id:3  kami-rita-32-everest-summit-2026  (2026-05-19)
   * ═══════════════════════════════════════════════════════════════════ */
  {
    id:       3,
    slug:     'kami-rita-32-everest-summit-2026',

    /* ── Hebrew ── */
    title:    'קאמי ריטה שרפה: האדם שעלה לפסגת האוורסט 32 פעמים',
    author:   'HighAir Expeditions',
    dateIso:  '2026-05-19',
    dateModified: '2026-05-19',
    dateHe:   '19 במאי 2026',
    dateEn:   'May 19, 2026',
    category: 'חדשות',
    categoryEn: 'News',
    img:             '/images/blog/kami-rita-sherpa.avif',
    imgPosition:     'center 15%',
    imgPositionCard: 'center 10%',
    imgCredit:       '',
    excerpt:  'ב-18 במאי 2026 עלה קאמי ריטה שרפה לפסגת האוורסט בפעם ה-32 בחייו, ושבר שוב את שיאו שלו. מי הוא האדם הזה, ולמה בני השרפה הם המטפסים הטובים בעולם?',
    excerptEn: 'On 18 May 2026, Kami Rita Sherpa summited Everest for the 32nd time in his life, breaking his own record once again. Who is this man, and why are Sherpas the best climbers in the world?',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'ב-18 במאי 2026, בשעה 10:12 בבוקר שעון נפאל, עמד אדם אחד על פסגת האוורסט בפעם ה-32 בחייו. קאמי ריטה שרפה, בן 56, מדריך מקצועי מכפר תאמה שבמחוז סולוקומבו, שבר שוב את שיא העולם שלו, יותר העפלות לפסגה הגבוהה ביותר על פני כדור הארץ מכל אדם אחר בהיסטוריה האנושית.' },

      { type: 'section', value: 'מי זה קאמי ריטה שרפה?' },
      { type: 'text', value: 'קאמי ריטה נולד ב-1970 בכפר תאמה, הממוקם בעמק הקוחומבו לרגלי האוורסט. אותו כפר עצמו הוליד גם את טנזינג נורגיי, האיש שיחד עם סר אדמונד הילרי הניו-זילנדי כבש את האוורסט לראשונה בהיסטוריה, ב-29 במאי 1953.' },
      { type: 'text', value: 'ההעפלה הראשונה של קאמי ריטה לפסגה התרחשה ב-1994, כשהיה בן 24. מאז, במשך שלושה עשורים, הוא חזר לפסגה כמעט מדי שנה. רק שלוש שנים בודדות נעדר מהרשימה: 2014 (אסון מפל הקרחון של קוחומבו שגבה את חיי 16 בני השרפה), 2015 (רעידת האדמה ההרסנית בנפאל שהביאה לסגירת ההר), ו-2020 (סגירה גלובלית בשל מגפת הקורונה). בכמה עונות הוא הספיק להעפיל לפסגה פעמיים!' },
      { type: 'text', value: 'מבחינה מעשית, קאמי ריטה הוא לא תייר. הוא לא מטפס לעצמו. כל אחת מ-32 ההעפלות שלו בוצעה בתפקיד מקצועי, כמדריך, כמוביל משלחת, כאחראי על קביעת חבלים או על הצבת מחנות גבוהים. ההעפלה האחרונה שלו, השבוע, בוצעה עבור חברתו.' },
      { type: 'text', value: 'במקביל אליו, בעונה הזו ממש, השלימה לאקפה שרפה בת ה-52 את העפלתה ה-11 לפסגה. לאקפה, גם היא ילידת עמק הקוחומבו, מחזיקה בשיא הנשי העולמי הבלתי-מעורער. 11 עליות לאוורסט, כשהיא גם אמא לשלושה ילדים שגידלה בין עונת טיפוס לעונת טיפוס. אם קאמי ריטה הוא הפנים הגבריות של הדומיננטיות השרפאית על האוורסט, לאקפה היא ההוכחה שהיכולת הזו לא מוגבלת למגדר.' },
      { type: 'text', value: '32 עליות לאוורסט פירושן 32 פעמים שהגוף נחשף לתנאים שהאבולוציה לא תכננה עבורם: חמצן ברמה של כשליש מהרמה בגובה פני הים, טמפרטורות של מינוס 30 עד 40 מעלות, ורוחות שמגיעות ל-150 קמ"ש. מטפסים מערביים שהגיעו לפסגה פעם אחת מתארים את זה כחוויה הפיזית הקשה ביותר בחייהם. קאמי ריטה עשה את זה 32 פעמים, רובן עם תיק עמוס ציוד על הגב ובאחריות מלאה על חיי לקוחות.' },
      { type: 'image', src: '/images/blog/kami-rita-summit.webp', caption: 'קאמי ריטה שרפה בגובה, בדרך לעוד פסגה' },

      { type: 'section', value: 'למה דווקא בני השרפה הם המטפסים הטובים בעולם' },
      { type: 'text', value: 'כשמסתכלים על ספר השיאים של האוורסט, התמונה ברורה: 11 מבין 12 המטפסים שעלו לפסגה הכי הרבה פעמים בהיסטוריה הם בני השרפה. השיאן הלא-שרפי הראשון, המדריך הבריטי קנטון קול, נמצא על 19 העפלות בלבד, פער של 13 פסגות מהשיא. אחריו ישנם האמריקנים דייב האן וגארט מדיסון, על 15 העפלות כל אחד.' },
      { type: 'callout', title: '✦ המספרים מדברים', value: '11 מתוך 12 המטפסים שעלו לאוורסט הכי הרבה פעמים בהיסטוריה הם שרפות. קאמי ריטה, עם 32 העפלות, נמצא בפסגת הרשימה הזו, ומרחיק את מקומו השני ב-13 פסגות.' },
      { type: 'text', value: 'הסיבה לפער הזה היא שילוב של גנטיקה, תרבות ומסורת מקצועית.' },
      { type: 'subheading', value: 'הצד הפיזיולוגי' },
      { type: 'text', value: 'בני השרפה, ילידי גובה רב, מחזיקים בהסתגלויות אבולוציוניות מובהקות לסביבה של דלילות חמצן. מחקרים זיהו אצלם וריאציות בגן EPAS1 שמאפשרות זרימת דם יעילה יותר ויעילות מטבולית גבוהה בתנאי היפוקסיה (חוסר חמצן). הם גם נוטים לייצר פחות המוגלובין יתר על המידה, תופעה שמסכנת מטפסי שטח שמייצרים יותר מדי כדוריות אדומות ומסכנים את עצמם בקרישי דם.' },
      { type: 'subheading', value: 'הצד התרבותי' },
      { type: 'text', value: 'בעמק הסולוקומבו, טיפוס הרים אינו תחביב. הוא מקצוע משפחתי שעובר מאב לבן כבר שלושה דורות, מאז 1953. ילדים גדלים תוך הכרת המסלולים, תרגול ההתנהלות על קרחונים, והבנה אינטואיטיבית של מה הר עושה ומתי הוא מסוכן.' },
      { type: 'subheading', value: 'הצד המעשי' },
      { type: 'text', value: 'כל מטפס שמגיע לאוורסט היום נשען על תשתית שהשרפות בנו. החבלים הקבועים לאורך המסלול? הניחו השרפות. הסולמות שמגשרים מעל הסדקים הענקיים במפל הקוחומבו? התקינו השרפות. בלוני החמצן, האוהלים, האוכל במחנות הגבוהים? נשאו השרפות. עוד לפני שמטפס אחד עצם עיניו בלילה שלפני ניסיון הפסגה, השרפות כבר היו שם.' },
      { type: 'image', src: '/images/blog/everest-hardest.webp', alt: 'האוורסט מהצד הדרומי', caption: 'האוורסט מהצד הדרומי, הנוף שקאמי ריטה מכיר טוב מכל אדם אחר על פני האדמה' },

      { type: 'section', value: 'עונת אוורסט 2026: אחת המסובכות בשנים האחרונות' },
      { type: 'text', value: 'השיא של קאמי ריטה לא נפל על עונה שקטה. 2026 הייתה מהעונות הסוערות ביותר שהאוורסט ידע בשנים האחרונות, ועדיין הוא עלה.' },
      { type: 'text', value: 'לפני כשלושה שבועות, בסוף אפריל, גוש קרח עצום קרס וחסם את מפל הקרחון של קוחומבו, הקטע המסוכן ביותר במסלול הצד הדרומי, וצוואר הבקבוק שדרכו חייבים לעבור כל המטפסים. מאות מטפסים תקעו את מהלכם במחנה הבסיס במשך ימים, עד שיחידת אייספול דוקטורס של השרפה הצליחה לקבע מחדש סולמות וחבלים ולפתוח את הנתיב.' },
      { type: 'text', value: 'מחלקת התיירות הנפאלית הנפיקה השנה 492 היתרי טיפוס לאוורסט, מספר גבוה שמעלה שוב את הוויכוח על "פקקי תנועה" בפסגה. במהלך החודש האחרון נהרגו על האוורסט שלושה מטפסים נפאלים. תזכורת חדה לכך שגם בעידן של בלוני חמצן, חבלים קבועים ותחזיות מטאורולוגיות מדויקות, האוורסט נשאר הר שתובע מחיר.' },

      { type: 'text', value: 'בגיל 56, קאמי ריטה לא נתן שום סימן שהוא עומד לעצור. עונת 2027 עדיין רחוקה, אבל מי שמכיר את האיש יודע: כשיחזרו המשלחות לאוורסט, הסיכוי הטוב ביותר הוא שהוא יהיה שם שוב. עם 33 על הגב, אולי.' },
      { type: 'image', src: '/images/blog/khumbu-icefall.jpg', caption: 'מפל הקרחון של קוחומבו, הקטע המסוכן ביותר במסלול האוורסט הדרומי' },

      { type: 'text', value: 'הנתיב אל האוורסט מתחיל לא בציוד, לא בתקציב, ולא בהיתר מממשלת נפאל. הוא מתחיל בהחלטה לצאת לדרך. למרבית ישראלים שמחפשים את החוויה הנפאלית האמיתית, הדרך הטובה ביותר להגיע הכי קרוב לאוורסט היא טרק אוורסט בייס קמפ, 12-14 ימי הליכה שמסתיימים ממש בנקודת ההזנקה שממנה יצאו טנזינג, הילרי וקאמי ריטה.' },
      { type: 'cta', text: 'למידע על משלחת אוורסט בייס קמפ וגוקיו של HighAir', textEn: 'Learn about HighAir\'s Everest Base Camp & Gokyo expedition', href: '/expedition/everest-base-camp' },

      { type: 'section', value: 'שאלות נפוצות' },
      { type: 'heading', value: 'כמה פעמים עלה קאמי ריטה לאוורסט?' },
      { type: 'text', value: 'נכון למאי 2026, קאמי ריטה עלה לפסגת האוורסט 32 פעמים, יותר מכל אדם אחר בהיסטוריה. הוא מטפס לפסגה כמעט מדי שנה מאז העפלתו הראשונה ב-1994.' },
      { type: 'heading', value: 'מאיפה מגיע קאמי ריטה שרפה?' },
      { type: 'text', value: 'מכפר תאמה בעמק הקוחומבו לרגלי האוורסט. אותו כפר שממנו יצא טנזינג נורגיי, שעלה לראשונה על האוורסט בהיסטוריה לצד סר אדמונד הילרי ב-1953.' },
      { type: 'heading', value: 'למה השרפות הם המטפסים הטובים בעולם?' },
      { type: 'text', value: 'שילוב של שלושה גורמים: פיזיולוגיה, עם הסתגלויות גנטיות שמאפשרות זרימת דם יעילה יותר בגובה רב. תרבות, כשטיפוס הרים עובר כמקצוע משפחתי מדור לדור מאז 1953. וניסיון מעשי שנצבר לאורך עשורים של עבודה מקצועית במסלולים הגבוהים בעולם.' },
      { type: 'heading', value: 'האם קאמי ריטה מטפס לתענוג אישי?' },
      { type: 'text', value: 'לא. כל אחת מ-32 העפלותיו בוצעה בתפקיד מקצועי: כמדריך, כמוביל משלחת, כאחראי על קביעת חבלים או על הצבת מחנות גבוהים. הוא מטפס כדי לעשות את עבודתו ולהוביל אחרים לפסגה בבטחה.' },
      { type: 'heading', value: 'איך אפשר לחוות את האוורסט בלי לטפס אליו?' },
      { type: 'text', value: 'דרך טרק אוורסט בייס קמפ, 12 עד 14 ימי הליכה בעמק הקוחומבו שמסתיימים ממש בנקודת ההזנקה של כל משלחות האוורסט הגדולות. לא דורש טיפוס טכני. HighAir מוציאה את הטרק הזה כל שנה.' },
    ],

    /* ── English content ── */
    titleEn: 'Kami Rita Sherpa: the man who has climbed Everest 32 times',
    contentEn: [
      { type: 'text', value: 'On 18 May 2026, at 10:12 in the morning Nepal time, one man stood on the summit of Everest for the 32nd time in his life. Kami Rita Sherpa, 56, a professional guide from the village of Thame in the Solukhumbu district, broke his own world record again. More ascents to the highest point on Earth than any other person in human history.' },

      { type: 'section', value: 'Who is Kami Rita Sherpa?' },
      { type: 'text', value: 'Kami Rita was born in 1970 in the village of Thame, in the Khumbu valley at the foot of Everest. That same village produced Tenzing Norgay, the man who, alongside New Zealander Sir Edmund Hillary, became the first to summit Everest in history, on 29 May 1953.' },
      { type: 'text', value: 'Kami Rita\'s first ascent came in 1994, when he was 24. Since then, over three decades, he has returned to the summit almost every year. Only three years are missing from the list: 2014 (the Khumbu Icefall disaster that killed 16 Sherpa), 2015 (the devastating Nepal earthquake that closed the mountain), and 2020 (global closure due to COVID-19). In some seasons, he managed two summits!' },
      { type: 'text', value: 'Practically speaking, Kami Rita is not a tourist. He is not climbing for himself. Every one of his 32 ascents was made in a professional capacity: as a guide, expedition leader, responsible for fixing ropes or setting up high camps. His most recent ascent, this week, was carried out for his company.' },
      { type: 'text', value: 'Alongside him, in this very season, Lakpa Sherpa, 52, completed her 11th ascent of the summit, the undisputed women\'s world record today.' },
      { type: 'image', src: '/images/blog/kami-rita-summit.webp', caption: 'Kami Rita Sherpa at altitude, on his way to another summit' },

      { type: 'section', value: 'Why Sherpas are the best climbers in the world' },
      { type: 'text', value: 'When you look at Everest\'s record books, the picture is clear: 11 of the 12 climbers who have summited Everest the most times in history are Sherpa. The first non-Sherpa record holder, British guide Kenton Cool, sits at 19 ascents, a gap of 13 summits from the record. Behind him are Americans Dave Hahn and Garrett Madison, at 15 ascents each.' },
      { type: 'callout', title: '✦ The numbers speak', value: '11 of the 12 climbers who have summited Everest the most times in history are Sherpa. Kami Rita, with 32 ascents, leads that list, sitting 13 summits ahead of whoever is in second place.' },
      { type: 'text', value: 'The reason for this gap is a combination of genetics, culture, and professional tradition.' },
      { type: 'subheading', value: 'The physiological side' },
      { type: 'text', value: 'Sherpas, born at altitude, carry distinct evolutionary adaptations to oxygen-thin environments. Research has identified EPAS1 gene variants in Sherpa populations that allow more efficient blood flow and higher metabolic efficiency under hypoxic conditions. They also tend to produce less excess haemoglobin, a condition that risks blood clots in high-altitude climbers who generate too many red blood cells.' },
      { type: 'subheading', value: 'The cultural side' },
      { type: 'text', value: 'In the Solukhumbu valley, mountaineering is not a hobby. It is a family profession passed from father to son for three generations, since 1953. Children grow up knowing the routes, practising glacier travel, and developing an intuitive feel for what a mountain does and when it becomes dangerous.' },
      { type: 'subheading', value: 'The practical side' },
      { type: 'text', value: 'Every climber who arrives at Everest today, whether a sports enthusiast from Europe, a professional climber from Asia, or a veteran guide from America, depends on infrastructure the Sherpas built. The fixed ropes on the standard route? Sherpas set them. The ladders bridging the Khumbu Icefall crevasses? Sherpas placed them. The oxygen at high camps? Sherpas carried it. Food, tents, heating. All Sherpas.' },
      { type: 'image', src: '/images/blog/everest-hardest.webp', alt: 'Everest south face', caption: 'Everest from the south, the view Kami Rita knows better than any other person on Earth' },

      { type: 'section', value: 'Everest season 2026: one of the most difficult in recent years' },
      { type: 'text', value: 'Kami Rita\'s record did not fall on a quiet season. 2026 has been one of the most complicated Everest seasons in recent years, and still, he summited.' },
      { type: 'text', value: 'About three weeks ago, at the end of April, a massive ice block collapsed and blocked the Khumbu Icefall, the most dangerous section of the south side route and the bottleneck through which all climbers must pass. Hundreds of climbers were stranded at base camp for days, until the professional Icefall Doctors Sherpa team managed to reset ladders and ropes and reopen the route.' },
      { type: 'text', value: 'Nepal\'s Department of Tourism issued 492 climbing permits for Everest this year, a high number that has reignited the debate about "traffic jams" near the summit. During the past month, three Nepali climbers have died on Everest. A sharp reminder that even in the age of bottled oxygen, fixed ropes, and precise weather forecasts, Everest remains a mountain that exacts a price.' },

      { type: 'text', value: 'At 56, Kami Rita showed no sign of stopping. The 2027 season is still far away, but those who know him understand: when the expeditions return to Everest, the best bet is that he will be there again. With 33 on his back, perhaps.' },
      { type: 'image', grad: 'linear-gradient(135deg, #0a1628, #1a3050, #0d2240)', caption: 'The Khumbu Icefall, the most dangerous section of the Everest south route' },

      { type: 'text', value: 'The path to Everest does not begin with gear, a budget, or a government permit. It begins with a decision to go. For most people looking for an authentic Himalayan experience, the best way to get close to Everest is the EBC trek, 12 to 14 days of walking that ends at the exact launch point where Tenzing, Hillary, and Kami Rita began their ascents.' },
      { type: 'cta', text: 'למידע על משלחת אוורסט בייס קמפ וגוקיו של HighAir', textEn: 'Learn about HighAir\'s Everest Base Camp & Gokyo expedition', href: '/expedition/everest-base-camp' },

      { type: 'section', value: 'Frequently asked questions' },
      { type: 'heading', value: 'How many times has Kami Rita Sherpa summited Everest?' },
      { type: 'text', value: 'As of May 2026, Kami Rita has summited Everest 32 times, more than any other person in history. He has been climbing it almost every year since his first ascent in 1994.' },
      { type: 'heading', value: 'Where is Kami Rita Sherpa from?' },
      { type: 'text', value: 'From the village of Thame in the Khumbu valley at the foot of Everest. The same village that produced Tenzing Norgay, who made the first Everest ascent in history alongside Sir Edmund Hillary in 1953.' },
      { type: 'heading', value: 'Why are Sherpas the best climbers in the world?' },
      { type: 'text', value: 'A combination of three factors: physiology, with genetic adaptations that allow more efficient blood circulation at altitude; culture, with mountaineering passed as a family profession from generation to generation since 1953; and practical experience accumulated over decades of professional work on the highest routes in the world.' },
      { type: 'heading', value: 'Does Kami Rita climb for personal pleasure?' },
      { type: 'text', value: 'No. Every one of his 32 ascents was made in a professional capacity: as a guide, expedition leader, rope fixer, or high camp manager. He climbs to do his job and to lead others safely to the summit.' },
      { type: 'heading', value: 'How can I experience Everest without climbing it?' },
      { type: 'text', value: 'Through the Everest Base Camp trek, 12 to 14 days of walking through the Khumbu valley that ends at the exact launch point of every major Everest expedition. No technical climbing required. HighAir runs this trek every year.' },
    ],
  },


  /* ═══════════════════════════════════════════════════════════════════
   *  id:1  seven-summits-guide  (2025-09-03)
   * ═══════════════════════════════════════════════════════════════════ */
  {
    id:       1,
    slug:     'seven-summits-guide',

    /* ── Hebrew ── */
    title:    'המדריך המלא לשבע הפסגות: ההרים הגבוהים ביותר בכל יבשת',
    author:   'HighAir Expeditions',
    dateIso:  '2025-09-03',
    dateModified: '2026-05-21',
    dateHe:   '3 בספטמבר 2025',
    dateEn:   'September 3, 2025',
    category: 'מדריכים',
    categoryEn: 'Guides',
    img:         '/images/blog/seven-summits-everest.webp',
    imgPosition: 'center 30%',
    imgPositionCard: 'center 30%',
    excerpt:  'שבע הפסגות: אוורסט, קילימנג\'רו, אלברוס, אקונקגואה ועוד. כמה זה קשה? כמה זה עולה? מה הסדר הנכון? המדריך שמסביר הכל, בלי לעגל פינות.',
    excerptEn: 'The Seven Summits: Everest, Kilimanjaro, Elbrus, Aconcagua and three more. How hard, how expensive, and what order to climb them in. A guide that tells it straight.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'ב-1985, ריצ\'רד באס, עסקמן טקסאי בן 55, עלה לפסגת האוורסט ועמד על הנקודה הגבוהה ביותר בעולם. זה לא היה פיק אחד מיני רבים. זה היה הסיום של מסע שהחל שנים קודם עם הר אחד, והמשיך יבשת אחר יבשת, עד שהאוורסט סגר את הרשימה. עם אותה העפלה, באס המציא את מה שמכנים היום "שבע הפסגות".' },
      { type: 'text', value: 'ארבעים שנה מאוחר יותר, כ-700 בני אדם השלימו את אותה הרשימה. פחות ממספר האנשים שנסעו לחלל. הם הגיעו מכל גיל, מכל מדינה, עם רקעים שונים לגמרי. מה שמחבר ביניהם הוא לא כישרון נדיר. הוא ההחלטה לצאת לדרך, וההתמדה לסיים. אם אי פעם הסתכלתם על הר ושאלתם את עצמכם אם גם אתם יכולים, הכתבה הזו בשבילכם.' },

      { type: 'section', value: 'שבע הפסגות: הרשימה המלאה' },
      { type: 'text', value: 'הכלל פשוט: הפסגה הגבוהה ביותר בכל יבשת. שבע יבשות, שבע פסגות. בפועל, הרשימה נראית ככה:' },
      { type: 'list', items: [
        'אוורסט (אסיה) - 8,848 מ\'',
        'אקונקגואה (דרום אמריקה) - 6,962 מ\'',
        'דנאלי (צפון אמריקה) - 6,190 מ\'',
        'קילימנג\'רו (אפריקה) - 5,895 מ\'',
        'אלברוס (אירופה) - 5,642 מ\'',
        'וינסון מאסיף (אנטארקטיקה) - 4,892 מ\'',
        'פירמידת קרסטנסז (אוקיאניה) - 4,884 מ\'',
      ]},
      { type: 'text', value: 'ויש גרסה שמונייה: חלק מהמטפסים מוסיפים את קוסצ\'ושקו (2,228 מ\') באוסטרליה, כי הגבול בין היבשת האוסטרלית לאוקיאניה שנוי במחלוקת. שתי הרשימות תקפות, ויש מטפסים שסוגרים את הוויכוח פשוט: הם עושים את כולן.' },

      { type: 'image', src: '/images/blog/seven-summits-everest.webp', caption: 'אוורסט ונופטסה - צילום: Alon Peleg' },

      { type: 'section', value: 'כמה זה קשה באמת?' },
      { type: 'callout', title: '✦ הסוד שלא תמיד מספרים', value: 'רוב שבע הפסגות הן בעיקר אתגר של גובה ושל הכנה, לא של טכניקה. אדם שמגיע עם כושר, מחויבות ומדריך טוב יכול להגיע לרוב הפסגות האלה.' },
      { type: 'subheading', value: 'קילימנג\'רו: ההתחלה הנכונה' },
      { type: 'text', value: 'לא דורש ציוד טיפוס. לא דורש ניסיון קודם. המסלול עולה בהדרגה, הצוותים המקומיים מקצועיים, ורוב המטיילים מגיעים לפסגה תוך שישה עד שמונה ימים. זו הסיבה שרוב אנשי שבע הפסגות מתחילים כאן.' },
      { type: 'image', src: '/images/blog/kilimanjaro-trekkers.webp', caption: 'מטיילים בדרך לקילימנג\'רו' },
      { type: 'subheading', value: 'אלברוס ואקונקגואה: הגובה מתחיל להרגיש' },
      { type: 'text', value: 'אלברוס ברוסיה (5,642 מ\') ואקונקגואה בארגנטינה (6,962 מ\') הם שלב הביניים. לא טיפוס טכני, אבל הגובה כבר לא מתנצל. אקונקגואה ידוע ברוחות שסוגרות את הפסגה לימים ובקור שמחכה גם באמצע הקיץ הדרום-אמריקאי. אלה ההרים שבהם מטפסים מגלים אם הם רצינים לגבי הרשימה.' },
      { type: 'image', src: '/images/blog/aconcagua.jpg', caption: 'אקונקגואה, 6,962 מ\', הפסגה הגבוהה ביותר מחוץ לאסיה' },
      { type: 'subheading', value: 'דנאלי, וינסון ופירמידת קרסטנסז: לא לכולם' },
      { type: 'text', value: 'דנאלי באלסקה הוא הקשה מבין השבעה מבחינה טכנית, עם טמפרטורות שיורדות מתחת למינוס 50 ומסלול שדורש ניסיון בטיפוס על שלג וקרח. וינסון מאסיף באנטארקטיקה לא קשה טכנית, אבל הלוגיסטיקה של להגיע לשם יוצאת דופן בעלותה ובמורכבותה. פירמידת קרסטנסז בגינאה החדשה היא ההיפך: גובה נמוך יחסית, אבל טיפוס טכני על סלע עם ציוד.' },

      { type: 'section', value: 'הסדר המומלץ' },
      { type: 'text', value: 'באס עצמו לא עשה את הרשימה בסדר מדויק. הוא עקב אחרי ההזדמנויות. אין סדר מחייב, אבל יש היגיון שרוב המטפסים מגיעים אליו בדרך הקשה. קילימנג\'רו ראשון, כמעט תמיד. הוא מייצר ביטחון, מלמד מה זה גובה, ומוכיח לכם ולעצמכם שאתם רציניים. אחריו אלברוס, ואחריו אקונקגואה. האוורסט אחרון, תמיד. דנאלי, וינסון ופירמידת קרסטנסז בסדר שמתאים לויזות ולוחות זמנים, כשדנאלי כדאי לשמור לשלב שיש כבר ניסיון טכני.' },

      { type: 'section', value: 'שיאים שכדאי לדעת' },
      { type: 'subheading', value: 'הצעיר ביותר' },
      { type: 'text', value: 'ג\'ורדן רומרו מארה"ב טיפס על האוורסט בגיל 13 שנים ו-10 חודשים. ילד שעוד לא גמר חטיבת ביניים עמד על הנקודה הגבוהה ביותר על פני האדמה. שנתיים אחר כך, בגיל 15, הוסיף את וינסון מאסיף וסגר את הרשימה.' },
      { type: 'subheading', value: 'המבוגר ביותר' },
      { type: 'text', value: 'ורנר ברגר מדרום אפריקה עלה על האוורסט בגיל 69, השלים את רשימת באס, וחשב שסיים. ב-2013, בגיל 76, חזר לרשימה כדי להוסיף את פירמידת קרסטנסז ולהשלים גם את גרסת מסנר. שבע הפסגות לא הספיקו לו.' },
      { type: 'subheading', value: 'האישה הראשונה' },
      { type: 'text', value: 'ג\'ונקו טאביי היפנית: פסגה ראשונה בקילימנג\'רו ב-1980, פסגה שביעית בפירמידת קרסטנסז ב-1992. שתים עשרה שנים, שבע יבשות. היא עשתה את זה בתקופה שבה נשים שטיפסו להרים נחשבו לחריגות.' },
      { type: 'subheading', value: 'המהיר ביותר' },
      { type: 'text', value: 'האוסטרלי סטיב פליין נפצע קשה ב-2017, ולא היה ברור שיחזור לטפס בכלל. ב-2018, אחד עשר חודשים מאוחר יותר, הוא השלים את כל שבע הפסגות ב-117 ימים ו-6 שעות. לא סתם שיא עולם, אלא שיא שמגיע עם ההקשר שלו.' },

      { type: 'image', src: '/images/blog/seven-summits-climbing.avif', alt: 'ריצ\'רד באס - האדם הראשון שהשלים את שבע הפסגות', caption: 'ריצ\'רד באס - האדם הראשון שהשלים את "שבע הפסגות", ב-1985' },

      { type: 'section', value: 'כמה זה עולה?' },
      { type: 'callout', title: '✦ תקציב מינימלי לכל הפרויקט', value: 'הגישה הזולה ביותר לכל שבע הפסגות תעלה לא פחות מ-120,000 עד 150,000 דולר, על פני כמה שנים. האוורסט לבד נע בין 35,000 ל-200,000 דולר, תלוי בחברה ובמסלול.' },
      { type: 'text', value: 'שאר ההרים פרוסים על טווח רחב. קילימנג\'רו ואלברוס עולים כל אחד בין 3,000 ל-5,000 דולר, ואלה שני ההרים שאפשר לעשות בלי לשבור את התקציב. אקונקגואה מתמחר כבר אחרת, בין 7,000 ל-12,000 דולר, ודנאלי מגיע ל-8,000 עד 15,000. וינסון מאסיף הוא הקפיצה הגדולה, בין 40,000 ל-50,000 דולר, רובם עבור הטיסה הפנימית לאנטארקטיקה שאין לה תחליף. פירמידת קרסטנסז עולה בין 15,000 ל-25,000 דולר, אבל הדרך אליה דרך הג\'ונגל של גינאה החדשה מוסיפה מורכבות שהמחיר לא מסביר לגמרי.' },
      { type: 'text', value: 'רוב מי שמשלים את הרשימה פורש את הפרויקט על פני 5-10 שנים. חסויות, גיוס כספים וחיסכון ממוקד עוזרים לאחרים. הדרך תמיד מוצאת עצמה כשההחלטה ברורה מספיק.' },

      { type: 'section', value: 'אז מאיפה מתחילים?' },
      { type: 'text', value: 'מהקילימנג\'רו. לא כי זה הכי קל, אלא כי זה ההר שעונה על השאלה שחשובה יותר מכל שאלת גובה: האם גוף ונפש מחוברים לאותה יציאה למסע. קילימנג\'רו נותן לכם שישה עד שמונה ימים לגלות את התשובה, מוקפים בנוף שלא ידעתם שאתם צריכים לראות, ועם 5,895 מטרים שממתינים בסוף.' },
      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', caption: 'מסלול מצ\'מה, אחד המסלולים היפים ביותר בקילימנג\'רו' },
      { type: 'text', value: 'ב-HighAir אנחנו מוציאים קבוצות לקילימנג\'רו כל שנה. אנחנו מאמינים שההר הזה משנה אנשים, ומסיבה טובה: הוא הראשון שמוכיח להם שהם יכולים. חלק מהרווחים מכל משלחת שלנו מוקדש לתמיכה בחולי סרטן בישראל, כי ההרים, בעינינו, הם גם דרך לתת.' },
      { type: 'cta', text: 'למידע על משלחת קילימנג\'רו של HighAir', textEn: 'Learn about HighAir\'s Kilimanjaro expedition', href: '/expedition/kilimanjaro' },

      { type: 'section', value: 'שאלות נפוצות' },
      { type: 'heading', value: 'איזו פסגה כדאי לטפס ראשונה?' },
      { type: 'text', value: 'הקילימנג\'רו. לא דורש ניסיון טיפוס, התשתית מצוינת, ומספר ימי ההסתגלות לגובה מאפשרים לרוב המטיילים להגיע לפסגה. זו הבחירה הראשונה של רוב מי שהשלים בסוף את כל שבע הפסגות.' },
      { type: 'heading', value: 'כמה זמן לוקח להשלים את כל שבע הפסגות?' },
      { type: 'text', value: 'בממוצע 5-10 שנים. תלוי בתקציב, בזמן הפנוי ובמהירות שמצברים ניסיון. שיא העולם לסיום כל שבעה הוא 117 ימים. רוב האנשים לוקחים כמה שנים.' },
      { type: 'heading', value: 'האם צריך להיות מטפס מקצועי?' },
      { type: 'text', value: 'לא לרוב הפסגות. קילימנג\'רו, אלברוס ואקונקגואה לא דורשים ניסיון טיפוס טכני. דנאלי ופירמידת קרסטנסז דורשים ניסיון טכני. האוורסט דורש גם ניסיון קודם בגבהים גבוהים ועבודה עם חברה מוסמכת.' },
      { type: 'heading', value: 'מהי הפסגה הקשה ביותר?' },
      { type: 'text', value: 'האוורסט מבחינת גובה, קושי לוגיסטי ועלות. דנאלי מבחינה טכנית. וינסון מאסיף מבחינת מורכבות ועלות ההגעה לאנטארקטיקה.' },
      { type: 'heading', value: 'מה ההכנה הגופנית שדרושה?' },
      { type: 'text', value: 'תלוי בהר. לקילימנג\'רו, אלברוס ואקונקגואה, כושר טוב ואימוני עמידות הם הבסיס. לדנאלי, האוורסט ופירמידת קרסטנסז נדרשים הכנה ממוקדת, ניסיון קודם בהרים ולרוב עבודה עם מאמן מוסמך.' },
    ],

    /* ── English content ── */
    titleEn: 'The Complete Guide to the Seven Summits: the highest peaks on every continent',
    contentEn: [
      { type: 'text', value: 'In 1985, Richard Bass, a 55-year-old Texas businessman, climbed Everest and stood on the highest point on Earth. It was not just another summit. It was the end of a journey that had started years earlier with one mountain and continued continent by continent until Everest closed the list. With that climb, Bass invented what we now call the Seven Summits.' },
      { type: 'text', value: 'Forty years later, roughly 700 people have done the same thing. Fewer than the number of people who have been to space. They came from every age group, every country, every background. What connects them is not rare talent. It is the decision to start, and the persistence to finish. If you have ever looked at a mountain and wondered whether you could, this article is for you.' },

      { type: 'section', value: 'The Seven Summits: the full list' },
      { type: 'text', value: 'The rule is simple: the highest peak on each continent. Seven continents, seven summits. The list looks like this:' },
      { type: 'list', items: [
        'Everest (Asia) - 8,848 m',
        'Aconcagua (South America) - 6,962 m',
        'Denali (North America) - 6,190 m',
        'Kilimanjaro (Africa) - 5,895 m',
        'Elbrus (Europe) - 5,642 m',
        'Vinson Massif (Antarctica) - 4,892 m',
        'Carstensz Pyramid (Oceania) - 4,884 m',
      ]},
      { type: 'text', value: 'There is also an eight-peak version: some climbers add Kosciuszko (2,228 m) in Australia, because the boundary between the Australian continent and the Oceania region is genuinely disputed. Both lists are valid, and some climbers settle the argument by simply doing all eight.' },

      { type: 'image', src: '/images/blog/seven-summits-everest.webp', caption: 'Everest and Nuptse - Photo: Alon Peleg' },

      { type: 'section', value: 'How hard is it, really?' },
      { type: 'callout', title: '✦ The truth they don\'t always tell you', value: 'Most of the Seven Summits are primarily a challenge of altitude and preparation, not technical climbing skill. Someone who arrives physically prepared, mentally committed, and with good guidance can reach most of these peaks.' },
      { type: 'subheading', value: 'Kilimanjaro: the right starting point' },
      { type: 'text', value: 'No climbing gear required. No prior experience needed. The route gains altitude gradually, the local crews are professional, and most trekkers reach the summit in six to eight days. That is why the majority of people who have completed all seven started here.' },
      { type: 'image', src: '/images/blog/kilimanjaro-trekkers.webp', caption: 'Trekkers on the way to Kilimanjaro' },
      { type: 'subheading', value: 'Elbrus and Aconcagua: where the altitude starts to matter' },
      { type: 'text', value: 'Elbrus in Russia (5,642 m) and Aconcagua in Argentina (6,962 m) are the mid-range step. No technical climbing, but the altitude is no longer forgiving. Aconcagua is particularly known for winds that close the summit for days and cold that waits even in the middle of the South American summer. These are the mountains where climbers find out whether they are serious about the list.' },
      { type: 'image', src: '/images/blog/aconcagua.jpg', caption: 'Aconcagua, 6,962 m, the highest peak outside Asia' },
      { type: 'subheading', value: 'Denali, Vinson, and Carstensz Pyramid: not for everyone' },
      { type: 'text', value: 'Denali in Alaska is the most technically demanding of the seven, with temperatures dropping below minus 50 and a route that requires real experience on snow and ice. Vinson Massif in Antarctica is not technically difficult, but the logistics of getting there are exceptional in both cost and complexity. Carstensz Pyramid in New Guinea is the opposite: relatively low altitude, but a technical rock climb with gear.' },

      { type: 'section', value: 'The recommended order' },
      { type: 'text', value: 'Bass himself did not do the list in any precise order. He followed the opportunities. There is no mandatory sequence, but there is logic that most climbers arrive at the hard way. Kilimanjaro first, almost always. It builds confidence, teaches you what altitude feels like, and proves to yourself that you are serious. Then Elbrus, then Aconcagua. Everest last, always. Denali, Vinson, and Carstensz Pyramid can fall wherever visas and schedules allow, though Denali should be saved for a stage when you already have real technical experience.' },

      { type: 'section', value: 'Records worth knowing' },
      { type: 'subheading', value: 'Youngest' },
      { type: 'text', value: 'Jordan Romero from the US summited Everest at 13 years and 10 months. A kid who had not yet finished middle school stood on the highest point on Earth. Two years later, at 15, he added Vinson Massif and closed the list.' },
      { type: 'subheading', value: 'Oldest' },
      { type: 'text', value: 'Werner Berger from South Africa summited Everest at 69, completed the Bass list, and thought he was done. In 2013, at 76, he went back to add Carstensz Pyramid and finish the Messner version too. Seven summits were apparently not enough for him.' },
      { type: 'subheading', value: 'First woman' },
      { type: 'text', value: 'Japanese mountaineer Junko Tabei: first summit at Kilimanjaro in 1980, seventh at Carstensz Pyramid in 1992. Twelve years, seven continents. She did it in an era when women who climbed mountains were considered remarkable exceptions.' },
      { type: 'subheading', value: 'Fastest' },
      { type: 'text', value: 'Australian Steve Plain suffered a serious injury in 2017, and for a while it was not clear he would climb again at all. In 2018, eleven months later, he completed all seven summits in 117 days and 6 hours. Not just a world record, but one that arrives with its own context.' },

      { type: 'image', src: '/images/blog/seven-summits-climbing.avif', alt: 'Richard Bass - the first person to complete the Seven Summits', caption: 'Richard Bass - the first person to complete the Seven Summits, in 1985' },

      { type: 'section', value: 'What does it cost?' },
      { type: 'callout', title: '✦ Budget figures', value: 'The most economical approach to all seven summits will cost somewhere between $120,000 and $150,000, spread over several years. Everest alone ranges from $35,000 to $200,000, depending on the operator and level of support.' },
      { type: 'text', value: 'The remaining mountains cover a wide range. Kilimanjaro and Elbrus each run between $3,000 and $5,000, and these are the two mountains you can do without breaking the budget. Aconcagua prices differently, between $7,000 and $12,000, and Denali reaches $8,000 to $15,000. Vinson Massif is the big jump, $40,000 to $50,000, most of it driven by the internal flight to Antarctica for which there is no substitute. Carstensz Pyramid runs $15,000 to $25,000, but the approach through the jungle of New Guinea adds a layer of complexity the price alone does not fully describe.' },
      { type: 'text', value: 'Most people who complete the list spread the project over 5-10 years. Sponsorships, fundraising, and focused savings help others. The path always finds itself when the decision is clear enough.' },

      { type: 'section', value: 'Where do you start?' },
      { type: 'text', value: 'Kilimanjaro. Not because it is the easiest, but because it is the mountain that answers the question that matters more than any altitude figure: are your body and mind connected to the same journey. Kilimanjaro gives you six to eight days to find out, surrounded by landscape you did not know you needed to see, with 5,895 metres waiting at the end.' },
      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', caption: 'The Machame Route, one of the most beautiful routes on Kilimanjaro' },
      { type: 'text', value: 'At HighAir we take groups to Kilimanjaro every year. We believe this mountain changes people, and for good reason: it is the first one that proves to them they can. Part of the profits from every expedition we run is dedicated to supporting cancer patients in Israel, because mountains, in our view, are also a way to give.' },
      { type: 'cta', text: 'למידע על משלחת קילימנג\'רו של HighAir', textEn: 'Learn about HighAir\'s Kilimanjaro expedition', href: '/expedition/kilimanjaro' },

      { type: 'section', value: 'Frequently asked questions' },
      { type: 'heading', value: 'Which summit should you climb first?' },
      { type: 'text', value: 'Kilimanjaro. No climbing experience required, excellent infrastructure, and the gradual ascent profile gives most trekkers a real shot at the summit. It is the first choice of the overwhelming majority of people who have completed all seven.' },
      { type: 'heading', value: 'How long does it take to complete all seven summits?' },
      { type: 'text', value: 'On average, five to ten years. The world record is 117 days. Most people take several years, shaped by budget, available time, and how quickly experience accumulates.' },
      { type: 'heading', value: 'Do you need to be a professional climber?' },
      { type: 'text', value: 'Not for most of them. Kilimanjaro, Elbrus, and Aconcagua require no technical climbing skills. Denali and Carstensz Pyramid require technical experience. Everest requires prior experience at extreme altitude and an accredited operator.' },
      { type: 'heading', value: 'Which is the hardest summit?' },
      { type: 'text', value: 'Everest for altitude, logistics, and cost. Denali for technical difficulty. Vinson Massif for the complexity and expense of reaching Antarctica.' },
      { type: 'heading', value: 'What fitness level do you need?' },
      { type: 'text', value: 'It depends on the mountain. For Kilimanjaro, Elbrus, and Aconcagua, solid general fitness and endurance training are the foundation. For Denali, Everest, and Carstensz Pyramid, you need specific preparation, prior high-mountain experience, and in most cases a structured training programme.' },
    ],
  },
];

export const CATEGORIES    = [...new Set(POSTS.map(p => p.category))];
export const CATEGORIES_EN = [...new Set(POSTS.map(p => p.categoryEn || p.category))];
