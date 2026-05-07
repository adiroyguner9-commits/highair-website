/**
 * blogData.js - Blog posts
 * To add a new post: copy the object structure below and paste at the top of POSTS array.
 * Each post supports both Hebrew (default) and English (En suffix) fields.
 */

export const POSTS = [
  {
    id:       1,
    slug:     'seven-summits-guide',

    /* ── Hebrew ── */
    title:    'המדריך המלא לשבע הפסגות: ההרים הגבוהים ביותר בכל יבשת',
    author:   'HighAir Expeditions',
    dateIso:  '2025-09-03',
    dateModified: '2026-04-29',
    dateHe:   '3 בספטמבר 2025',
    dateEn:   'September 3, 2025',
    category: 'מדריכים',
    categoryEn: 'Guides',
    img:         '/images/blog/kristin-harila.webp',
    imgPosition: 'center 20%',
    excerpt:  'שבע הפסגות: אוורסט, קילימנג\'רו, אלברוס, אקונקגואה ועוד. כמה זה עולה? מה הסדר המומלץ? שיאי עולם, רמות קושי ועובדות שלא ידעתם  -  המדריך המלא.',
    excerptEn: 'The Seven Summits: Everest, Kilimanjaro, Elbrus, Aconcagua and three more. Costs, difficulty levels, world records, and the order most climbers use  -  a straightforward guide.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text',    value: 'שבע הפסגות (Seven Summits) הן הפסגות הגבוהות ביותר בכל יבשת: אוורסט באסיה (8848 מ׳), אקונקגואה בדרום אמריקה (6962 מ׳), דנאלי בצפון אמריקה (6190 מ׳), קילימנג\'רו באפריקה (5895 מ׳), אלברוס באירופה (5642 מ׳), וינסון מאסיף באנטארקטיקה (4892 מ׳), ופירמידת קרסטנסז באוקיאניה (4884 מ׳). לטפס על כולן  -  זה אחד האתגרים הנחשקים ביותר בעולם הטיפוס החובבני.' },
      { type: 'text',    value: 'כאן: רמת הקושי של כל הר, הפסגה הקלה ביותר לטיפוס, שיאי עולם, ומידע לוגיסטי. נקודת פתיחה למי שמתחיל לחשוב ברצינות על הרשימה.' },

      { type: 'heading', value: 'מהו מועדון שבע הפסגות?' },
      { type: 'text',    value: 'קהילה לא רשמית של מטפסים מכל העולם, שמאוחדת סביב מטרה אחת: לעמוד על הנקודה הגבוהה ביותר בכל יבשת.' },
      { type: 'text',    value: 'עבור רוב חברי המועדון, ההרים הם לא רק אתגר פיזי  -  כל טיפוס מגיע עם לוגיסטיקה שונה, תרבות שונה ותנאים שונים. הקשרים שנוצרים בדרך לרוב מחזיקים שנים.' },
      { type: 'text',    value: 'רוב האנשים מתחילים עם הקילימנג\'רו. אין צורך בכישורי טיפוס, התשתית טובה, וזה נותן טעימה ראשונה ממה שמחכה בהמשך הרשימה.' },

      { type: 'image',   src: '/images/blog/seven-summits-everest.webp', caption: 'אוורסט ונופטסה - צילום: Alon Peleg' },

      { type: 'heading', value: 'אז, מהן שבע הפסגות?' },
      { type: 'list',    items: [
        'אוורסט (אסיה) - 8848 מ׳',
        'אקונקגואה (דרום אמריקה) - 6962 מ׳',
        'דנאלי (צפון אמריקה) - 6190 מ׳',
        'קילימנג\'רו (אפריקה) - 5895 מ׳',
        'אלברוס (אירופה) - 5642 מ׳',
        'וינסון מאסיף (אנטארקטיקה) - 4892 מ׳',
        'פירמידת קרסטנסז (אוקיאניה) - 4884 מ׳',
        'קוסצ\'ושקו (אוסטרליה) - 2228 מ׳',
      ]},

      { type: 'heading', value: 'רגע, למה יש שמונה פסגות?' },
      { type: 'text',    value: 'העובדה היא שאין רק רשימה אחת של שבע הפסגות. הבלבול נובע מכך ש"יבשות" ו"חלקי עולם" הם מושגים שונים. אפילו בקרב מדענים אין הסכמה האם להתייחס לצפון ודרום אמריקה כיבשה אחת או כשתיים נפרדות.' },
      { type: 'text',    value: 'בשלב מסוים, קהילת מטפסי ההרים הסכימה שהרשימה תכלול את אירופה ואסיה בנפרד (במקום אירואסיה), וכך גם את דרום וצפון אמריקה. הבעיה המרכזית נותרה עם אוסטרליה ואוקיאניה.' },
      { type: 'text',    value: 'אם מתייחסים רק ליבשת אוסטרליה, הנקודה הגבוהה ביותר היא הר קוסצ\'ושקו. אך אם מאחדים את אוסטרליה ואוקיאניה לחלק עולם אחד, הנקודה הגבוהה ביותר הופכת לפירמידת קרסטנסז שבאי גינאה החדשה.' },
      { type: 'text',    value: 'בגלל חוסר ההסכמה הזה, נוצרו שתי רשימות נפרדות. ברשימת באס, הפסגה השביעית היא הר קוסצ\'ושקו, בעוד שברשימת מסנר, הפסגה השביעית היא פירמידת קרסטנסז.' },

      { type: 'heading', value: 'אז מה הן באמת 7 הפסגות?' },
      { type: 'text',    value: 'האמת היא ששתי הרשימות שהוזכרו, של באס ושל מסנר, נחשבות שתיהן לתקפות. הסיבה לכך היא שאין רשימה רשמית אחת, והוויכוח על הפסגה השביעית תמיד יישאר. לכן, כדי להיות בטוחים לגמרי, חלק מהמטפסים בוחרים לטפס על כל שמונה הפסגות.' },
      { type: 'text',    value: 'אגב, ישנה גרסה נוספת לרשימה שכוללת את המונבלאן. זה קורה מכיוון שבחלוקות גיאופוליטיות מסוימות, הרי הקווקז, בהם נמצא הר אלברוס, נחשבים לחלק מאסיה ולא מאירופה. במקרה כזה, הר אלברוס יוצא מהרשימה, ובמקומו נכנס המונבלאן.' },

      { type: 'heading', value: 'למה לטפס את שבע הפסגות?' },
      { type: 'text',    value: 'זה אחד ההישגים המוכרים ביותר בטיפוס הרים חובבני  -  שבע יבשות, שבעה סביבות שונות לגמרי. אנשים עושים את זה כדי לבחון את עצמם, לראות מקומות שרוב העולם לא מגיע אליהם, ופשוט כי אחרי הראשון, הבא מציג את עצמו.' },
      { type: 'image',   src: '/images/blog/seven-summits-why-climb.webp', alt: 'מטפסים בדרך לפסגה', caption: '' },

      { type: 'heading', value: 'כמה אנשים צלחו את האתגר?' },
      { type: 'text',    value: 'נכון לשנת 2016, כ-416 אנשים השלימו את רשימת שבע הפסגות, מתוכם 71 נשים. חשוב לציין שאין ארגון רשמי או רישום יחיד של כל המטפסים, ועל כן מדובר בהערכה. ההערכה הכללית היא שכ-500 אנשים סיימו את האתגר.' },

      { type: 'heading', value: 'מי הגה את הרעיון?' },
      { type: 'text',    value: 'וויליאם האקט האמריקאי, לאחר שטיפס על הרים בחמש יבשות שונות (דנאלי, אקונקגואה, קילימנג\'רו, קוסצ\'ושקו ומון בלאן), ניסה לטפס גם את הר וינסון וקיבל אישור לטיפוס על האוורסט. למרות שלא הצליח להשלים את האתגר בשל כוויות קור וחוסר מימון, הרעיון שלו תפס תאוצה.' },
      { type: 'text',    value: 'האדם הראשון שהשלים את האתגר במלואו היה האמריקאי ריצ\'רד באס. בשנת 1983 בלבד, הוא טיפס על שש פסגות, ובשנת 1985 השלים את הרשימה עם טיפוס להר האוורסט.' },
      { type: 'image',   src: '/images/blog/seven-summits-climbing.avif', alt: 'ריצ\'רד באס - האדם הראשון שהשלים את "שבע הפסגות"', caption: 'ריצ\'רד באס - האדם הראשון שהשלים את "שבע הפסגות"' },

      { type: 'heading', value: 'כמה זה באמת קשה?' },
      { type: 'text',    value: 'רוב שבע הפסגות הן בעיקר טרקים בגובה רב ולא טיפוס טכני. גם האוורסט  -  האתגר העיקרי שם הוא הגובה, לא הטכניקה. הקושי האמיתי של הפרויקט כולו הוא זמן וכסף: טיסות, אישורים, ויזות, ציוד, ביטוח  -  ממשיכים.' },
      { type: 'text',    value: 'טיפוס על האוורסט, לדוגמה, יכול לארוך עד חודשיים ולעלות בין 60 אלף דולר ל-75 אלף דולר. לא לכל אחד יש את האמצעים או הזמן הדרושים למשימה כזו.' },
      { type: 'text',    value: 'אוורסט, דנאלי ווינסון מאסיף הם טיפוסים רציניים עם סיכונים אמיתיים. קילימנג\'רו, לעומת זאת, נחשב בטוח למדי גם למתחילים שמגיעים מוכנים.' },

      { type: 'section', value: 'שיאני שבע הפסגות' },

      { type: 'heading', value: 'מי הצעיר והמבוגר ביותר?' },
      { type: 'text',    value: 'בדצמבר 2011, ג\'ורדן רומרו (ארה"ב) טיפס על הר וינסון מאסיף, הפסגה האחרונה שלו מתוך שבע הפסגות, בגיל 15 שנים, 5 חודשים ו-12 ימים. הוא היה גם האדם הצעיר ביותר שטיפס על האוורסט בגיל 13 שנים ו-10 חודשים.' },
      { type: 'text',    value: 'ורנר ברגר (דרום אפריקה/קנדה) טיפס על האוורסט בגיל 69 שנים ו-310 ימים ב-22 במאי 2007, ובכך השלים את רשימת באס. בשנת 2013, בגיל 76 שנים ו-128 ימים, הוא טיפס גם על פירמידת קרסטנסז, והשלים את שתי רשימות שבע הפסגות.' },

      { type: 'heading', value: 'מי הייתה האישה הראשונה?' },
      { type: 'text',    value: 'מטפסת ההרים היפנית ג\'ונקו טאביי הגיעה בשנת 1992 לפסגת פירמידת קרסטנסז, והשלימה את אתגר שבע הפסגות שהחל בשנת 1980 עם הקילימנג\'רו.' },

      { type: 'heading', value: 'מי עשה זאת הכי מהר?' },
      { type: 'text',    value: 'האוסטרלי סטיב פליין טיפס על האוורסט ב-14 במאי 2018, כשהוא מסיים את כל שבע הפסגות ב-117 ימים בלבד, 6 שעות ו-50 דקות. הוא עשה זאת רק 11 חודשים לאחר פציעה קשה.' },

      { type: 'section', value: 'שאלות נפוצות' },

      { type: 'heading', value: 'איזו פסגה היא הקלה ביותר?' },
      { type: 'text',    value: 'הקל ביותר הוא הקילימנג\'רו. הגובה לא מבוטל (5895 מ׳), אבל הטיפוס לא דורש כישורים טכניים. התשתית מפותחת, הלוגיסטיקה פשוטה יחסית, ומסע טיפוס אופייני נמשך שבוע. על ההר  -  שף, פורטרים, מדריכים. הרגליים שלכם הן הדבר היחיד שצריך להביא.' },
      { type: 'image',   src: '/images/blog/kilimanjaro-trekkers.webp', alt: 'מטיילים בדרך לקילימנג\'רו', caption: '' },

      { type: 'heading', value: 'איזו פסגה היא הקשה ביותר?' },
      { type: 'text',    value: 'האוורסט. גובה קיצוני, עונת טיפוס קצרה, הכנה של שנים, ועלויות של עשרות אלפי דולרים. להגיע לפסגה הגבוהה בעולם  -  זה לא קורה בסוף השבוע הראשון.' },
      { type: 'image',   src: '/images/blog/everest-hardest.webp', alt: 'מטפסים על האוורסט', caption: '' },

      { type: 'heading', value: 'מה הסדר המומלץ לטיפוס?' },
      { type: 'text',    value: 'מתחילים עם קילימנג\'רו. אין צורך בכישורים טכניים, טנזניה מאפשרת לשלב ספארי וזנזיבר, ואפשר לצאת תוך חודשים. אחרי זה  -  אלברוס, ואחריו אקונקגואה. אקונקגואה הוא מבחן רציני לפני האוורסט. וינסון, דנאלי ופירמידת קרסטנסז אפשר לטפס בכל סדר, תלוי בלוחות זמנים ובויזה. דנאלי הוא המאתגר ביותר טכנית מבין השלושה  -  כדאי להשאיר אותו לשלב שכבר יש ניסיון.' },

      { type: 'heading', value: 'באיזו כושר צריך להיות?' },
      { type: 'text',    value: 'כושר טוב הוא חיוני, אבל אין סטנדרטים רשמיים. אף רופא לא יחתום לך "כשיר לטיפוס על האוורסט". מה שצריך הוא תהליך הדרגתי  -  טיפוסים בגבהים שונים ובתנאים שונים, צבירת ניסיון אמיתי.' },

      { type: 'heading', value: 'האם אפשר לטפס לבד?' },
      { type: 'text',    value: 'לא על כולן. קילימנג\'רו  -  ללא מדריך מקומי אי אפשר על פי חוק, ומסיבה טובה: זה מקור הכנסה מרכזי לאנשי המקום. האוורסט דורש אישור מהממשלה הנפאלית  -  ב-2023 הונפקו רק 500 אישורים, כל אחד עולה 15,000 דולר. וינסון  -  אפשר לארגן רק דרך Antarctic Logistics & Expeditions LLC.' },

      { type: 'heading', value: 'איך להתכונן לאתגר?' },
      { type: 'text',    value: 'תלוי בכושר ובניסיון. כושר ממוצע? מתחילים בהכנה גופנית  -  ריצת שטח, שחייה, הליכה עם תיק. כושר טוב? אפשר להתחיל לטפס כבר השנה. עובדים עם חברות טרקים בארץ, מטפסים פסגות קרובות, צוברים ניסיון  -  ואז יוצאים לקילימנג\'רו.' },

      { type: 'heading', value: 'כמה זה אמור לעלות?' },
      { type: 'text',    value: 'האפשרות הזולה ביותר עדיין תעלה לא פחות מ-120,000 דולר לכל הפרויקט. האוורסט הוא הגדול בתקציב  -  בין 36,000 ל-200,000 דולר, תלוי באיך מארגנים. תוכנית אפשרית: יוני  -  קילימנג\'רו, אוגוסט  -  אלברוס, דצמבר-פברואר  -  אקונקגואה ווינסון, אביב  -  אוורסט, וסתיו הבא  -  פירמידת קרסטנסז ודנאלי.' },

      { type: 'heading', value: 'האם יש דרך לחסוך כסף?' },
      { type: 'text',    value: 'מטפסים רבים מסתמכים על חסויות או מימון ממשלתי. בארה"ב, קנדה, בריטניה ואוסטרליה יש תוכניות גיוס כספים שמאפשרות להקצות חלק מהתרומות לטיפוסים  -  חוקי לגמרי. זה גם מסביר למה רוב מסיימי הרשימה הם מאותן מדינות. מימון המונים עובד בשווקים מסוימים. ספונסר  -  חברה שרוצה לראות את הלוגו שלה על האוורסט  -  גם אפשרות.' },

      { type: 'section', value: 'היסטוריית שמות' },
      { type: 'text',    value: 'אוורסט נקרא על שם ג\'ורג\' אוורסט, מודד בריטי שהיה מעורב בקביעת הגבהים המדויקים של פסגות רבות בהודו. השם המקורי, צ\'ומולונגמה, מתורגם מטיבטית כ"אלת אם העולם".' },
      { type: 'text',    value: 'דנאלי פירושו "האחד הגדול" בשפתם של בני האתבסקה באלסקה.' },
      { type: 'text',    value: 'קילימנג\'רו מגיע מהשפה הסוואהילית ומשערים שמשמעותו היא "הר שזורח" או "הר האור", אף שמקורו המדויק אינו ידוע.' },
      { type: 'text',    value: 'אלברוס הוא ככל הנראה איראני, כאשר "אלבורז" פירושו "הר גבוה".' },
      { type: 'text',    value: 'רכס וינסון נקרא על שם קרל וינסון, חבר קונגרס אמריקאי מג\'ורג\'יה שהיה תומך נלהב במימון חקר אנטארקטיקה.' },
      { type: 'text',    value: 'קוסצ\'ושקו נקרא לכבוד המנהיג הצבאי הפולני והאמריקאי תדיאוש קוסצ\'ושקו. ההר נקרא על ידי האדם הראשון שטיפס עליו, החוקר והגיאולוג הפולני פאבל אדמונד סטז\'לצקי.' },
      { type: 'text',    value: 'פירמידת קרסטנסז נקראה על שם החוקר ההולנדי יאן קרסטנסז, שצפה בהר לראשונה בשנת 1623. שמו המקורי, פונצ\'אק ג\'איה, פירושו "פסגת הניצחון" באינדונזית.' },
      { type: 'text',    value: 'אקונקגואה יש משמעויות שונות בשפות של עמים ילידים. בשפת האראוקאנית, הוא פירושו "בא מהצד השני" של הנהר. בשפת הקצ\'ואה, הוא יכול להיות "זקיף אבן" או "צופה על החולות". בשפת האיימארה, הוא מתורגם ל"ערוץ לבן" או "הר מושלג".' },

      { type: 'section', value: 'מה האתגר הבא?' },

      { type: 'heading', value: '14 פסגות 8000 מ׳' },
      { type: 'text',    value: 'אתגר מפורסם נוסף, הכולל טיפוס על 14 הפסגות הגבוהות בעולם, שגובהן עולה על 8000 מטרים. זהו אתגר קשה ומסוכן במיוחד בשל הגובה הקיצוני וקשיים נוספים. רק מטפסי עילית מנוסים מנסים להשלים את הרשימה, וגם מביניהם, מעטים מצליחים.' },
      { type: 'list',    noMarker: true, items: [
        '1. אוורסט (נפאל) - 8848 מ׳',
        '2. קיי 2 (פקיסטן) - 8611 מ׳',
        '3. קנצ\'נג\'ונגה (נפאל) - 8586 מ׳',
        '4. להוטסה (נפאל) - 8516 מ׳',
        '5. מקאלו (נפאל) - 8485 מ׳',
        '6. צ\'ו אוי (נפאל) - 8188 מ׳',
        '7. דהאולגירי (נפאל) - 8167 מ׳',
        '8. מנסלו (נפאל) - 8156 מ׳',
        '9. ננגה פארבט (פקיסטן) - 8125 מ׳',
        '10. אנאפורנה (נפאל) - 8091 מ׳',
        '11. גשרברום 1 (פקיסטן) - 8080 מ׳',
        '12. ברוד פיק (פקיסטן) - 8051 מ׳',
        '13. גשרברום 2 (פקיסטן) - 8035 מ׳',
        '14. שישפנגמה (סין) - 8027 מ׳',
      ]},
      { type: 'text',    value: 'שיא ההשלמה המהירה ביותר שייך למטפסת הנורווגית קריסטין הרילה ולשרפה טנג\'י לאמה מנפאל  -  92 ימים. שבירת השיא הקודם של נירמל פורג\'ה (נימסדאי). עד היום, רק כ-50 אנשים בעולם הגיעו לכל 14 הפסגות.' },
      { type: 'image',   src: '/images/blog/kristin-harila.webp', alt: 'קריסטין הרילה - אחת המטפסות המפורסמות ביותר כיום', caption: 'קריסטין הרילה - אחת המטפסות המפורסמות ביותר כיום', objectPosition: 'top' },
    ],

    /* ── English content ── */
    titleEn: 'The Seven Summits: the highest peaks on every continent',
    contentEn: [
      { type: 'text',    value: 'The Seven Summits are the highest peaks on each of the world\'s seven continents: Everest in Asia (8,848 m), Aconcagua in South America (6,962 m), Denali in North America (6,190 m), Kilimanjaro in Africa (5,895 m), Elbrus in Europe (5,642 m), Vinson Massif in Antarctica (4,892 m), and Carstensz Pyramid in Oceania (4,884 m). Completing all seven is one of the most recognised goals in mountaineering  -  and for most people who pursue it, it takes years.' },
      { type: 'text',    value: 'This guide covers the difficulty of each mountain, which one is the logical starting point, world records, the debate over the official list, and what the whole thing actually costs.' },

      { type: 'heading', value: 'What is the Seven Summits Club?' },
      { type: 'text',    value: 'An informal community of climbers united by one goal: the highest point on each continent. No official membership, no governing body. Just people who\'ve done it  -  or are working toward it.' },
      { type: 'text',    value: 'For most people in this community, the mountains are more than a physical challenge. They\'re a series of distinct cultural experiences, each with its own logistics, conditions, and demands. The shared difficulty creates lasting connections between people who\'ve climbed together.' },
      { type: 'text',    value: 'Most people start with Kilimanjaro. It requires no technical skills, the infrastructure is good, and it gives you a real first taste of high-altitude trekking  -  the kind that either hooks you or tells you something important about yourself.' },

      { type: 'image',   src: '/images/blog/seven-summits-everest.webp', caption: 'Everest and Nuptse  -  Photo: Alon Peleg' },

      { type: 'heading', value: 'The seven (or eight) summits' },
      { type: 'list',    items: [
        'Everest (Asia)  -  8,848 m',
        'Aconcagua (South America)  -  6,962 m',
        'Denali (North America)  -  6,190 m',
        'Kilimanjaro (Africa)  -  5,895 m',
        'Elbrus (Europe)  -  5,642 m',
        'Vinson Massif (Antarctica)  -  4,892 m',
        'Carstensz Pyramid (Oceania)  -  4,884 m',
        'Kosciuszko (Australia)  -  2,228 m',
      ]},

      { type: 'heading', value: 'Why are there eight peaks on a list of seven?' },
      { type: 'text',    value: 'There isn\'t one official list  -  there are two. The confusion comes down to how you define continents. Specifically: is Australia one continent, or is it grouped with Oceania?' },
      { type: 'text',    value: 'The mountaineering community settled on Europe and Asia as separate continents, and North and South America as separate too. The sticking point was always Australia versus Oceania.' },
      { type: 'text',    value: 'If Australia stands alone, the highest point is Kosciuszko. If you combine Australia and Oceania, the highest point is Carstensz Pyramid in New Guinea.' },
      { type: 'text',    value: 'This produced two lists. The Bass list has Kosciuszko as the seventh summit. The Messner list has Carstensz Pyramid. Both are considered valid, which is why some climbers just do all eight.' },

      { type: 'heading', value: 'What about Mont Blanc?' },
      { type: 'text',    value: 'There\'s a version of the list that swaps Elbrus for Mont Blanc. In some geopolitical frameworks, the Caucasus  -  where Elbrus sits  -  is classified as part of Asia. If that\'s your definition, Elbrus drops off the European list and Mont Blanc takes its place.' },

      { type: 'heading', value: 'Why do it?' },
      { type: 'text',    value: 'It\'s one of the most recognised achievements in amateur mountaineering. Seven different continents, seven completely different environments and cultures. People do it to test their limits, to see remote parts of the world, and because once you\'ve done one, the next one tends to present itself naturally.' },
      { type: 'image',   src: '/images/blog/seven-summits-why-climb.webp', alt: 'Climbers on the way to the summit', caption: '' },

      { type: 'heading', value: 'How many people have finished it?' },
      { type: 'text',    value: 'As of 2016, roughly 416 people had completed the Seven Summits list (including 71 women). There\'s no official register, so this is an estimate. The current figure is probably around 500.' },

      { type: 'heading', value: 'Who had the idea?' },
      { type: 'text',    value: 'American climber William Hackett climbed mountains on five continents and tried to add Vinson and Everest to the count. He never finished  -  frostbite and funding ran out  -  but the concept caught on.' },
      { type: 'text',    value: 'The first person to actually complete all seven was American Richard Bass. In 1983 alone he climbed six summits, and in 1985 he topped it off with Everest.' },
      { type: 'image',   src: '/images/blog/seven-summits-climbing.avif', alt: 'Richard Bass  -  the first person to complete the Seven Summits', caption: 'Richard Bass  -  the first person to complete the Seven Summits' },

      { type: 'heading', value: 'How hard is it?' },
      { type: 'text',    value: 'Mostly high-altitude trekking, not technical climbing. Even Everest is primarily an altitude challenge rather than a technical one. The real difficulty of the Seven Summits is time and money: flights, permits, visas, gear, insurance, and months away from normal life.' },
      { type: 'text',    value: 'Everest alone can take two months and cost $60,000–$75,000. Not everyone has the resources.' },
      { type: 'text',    value: 'The risk level varies dramatically. Everest, Denali, and Vinson Massif are serious mountaineering undertakings. Kilimanjaro, by contrast, is manageable for well-prepared beginners.' },

      { type: 'section', value: 'Seven Summits records' },

      { type: 'heading', value: 'Youngest and oldest' },
      { type: 'text',    value: 'In December 2011, Jordan Romero (USA) climbed Vinson Massif  -  his final summit  -  at age 15 years, 5 months, and 12 days. He\'d already become the youngest person to summit Everest at 13 years and 10 months.' },
      { type: 'text',    value: 'Werner Berger (South Africa/Canada) completed the Bass list on 22 May 2007 when he climbed Everest at age 69 years and 310 days. In 2013, at 76 years and 128 days, he added Carstensz Pyramid to complete both lists.' },

      { type: 'heading', value: 'First woman' },
      { type: 'text',    value: 'Japanese mountaineer Junko Tabei reached the summit of Carstensz Pyramid in 1992, completing the challenge she\'d started in 1980 with Kilimanjaro.' },

      { type: 'heading', value: 'Fastest completion' },
      { type: 'text',    value: 'Australian Steve Plain summited Everest on 14 May 2018, finishing all seven in 117 days, 6 hours, and 50 minutes  -  just 11 months after a serious injury.' },

      { type: 'section', value: 'Frequently asked questions' },

      { type: 'heading', value: 'Which summit is easiest?' },
      { type: 'text',    value: 'Kilimanjaro. Despite the altitude, the climb is not technically difficult. The infrastructure is well-developed, logistics are straightforward, and a typical trek takes about a week. A dedicated cook prepares meals on the mountain while local guides and porters handle the heavy lifting.' },
      { type: 'image',   src: '/images/blog/kilimanjaro-trekkers.webp', alt: 'Trekkers on the way to Kilimanjaro', caption: '' },

      { type: 'heading', value: 'Which summit is hardest?' },
      { type: 'text',    value: 'Everest, without question. Extreme altitude, a short and competitive climbing season, extensive preparation requirements, and costs that can exceed $75,000. Turning a summit attempt into an actual summit is an enormous undertaking for even experienced climbers.' },
      { type: 'image',   src: '/images/blog/everest-hardest.webp', alt: 'Climbers on Everest', caption: '' },

      { type: 'heading', value: 'What order should you climb them in?' },
      { type: 'text',    value: 'Start with Kilimanjaro. It needs no technical skills, Tanzania is a genuinely interesting destination, and you can combine it with a safari and time in Zanzibar. From there, Elbrus makes sense, then Aconcagua  -  a meaningful test before Everest. Vinson, Denali, and Carstensz Pyramid can fall in any order based on your logistics and visa situation. All three are expensive, though far less so than Everest. Denali is the most technically demanding of the three, so save it for when you have real mountaineering experience.' },

      { type: 'heading', value: 'What fitness level do you need?' },
      { type: 'text',    value: 'Solid fitness is important, but there are no standard benchmarks. No medical board certifies you as "fit for Everest." What matters is building a training base that includes climbing at various altitudes and in varied conditions  -  then progressing through the list systematically.' },

      { type: 'heading', value: 'Can you climb solo?' },
      { type: 'text',    value: 'Not all of them. Kilimanjaro requires a licensed local guide by law  -  a rule that makes good sense and provides income for local communities. Everest solo permits are rare (500 issued in 2023) and cost $15,000. Vinson Massif can only be organised through Antarctic Logistics & Expeditions LLC.' },

      { type: 'heading', value: 'How do you prepare?' },
      { type: 'text',    value: 'Start where you are. Average fitness? Begin with general conditioning  -  trail running, swimming, hiking. Good fitness already? You can probably start on Kilimanjaro this year. Work with a trekking company, climb locally, build altitude experience progressively. Don\'t skip steps.' },

      { type: 'heading', value: 'What does the full project cost?' },
      { type: 'text',    value: 'Budget at least $120,000 for the most economical approach to all seven. Everest dominates the budget at $36,000–$200,000 depending on how you organise it. A realistic multi-year plan: June  -  Kilimanjaro, August  -  Elbrus, December–February  -  Aconcagua and Vinson, Spring  -  Everest. Then Carstensz Pyramid and Denali in the following seasons.' },

      { type: 'heading', value: 'Is there any way to reduce costs?' },
      { type: 'text',    value: 'Some climbers find sponsors  -  companies willing to pay for branding exposure on high-profile summits. In the US, Canada, UK, and Australia, charity fundraising programmes allow climbers to offset costs by raising money for non-profits. Crowdfunding works in some markets. These approaches require effort, but they\'ve funded real expeditions.' },

      { type: 'section', value: 'Where the names come from' },
      { type: 'text',    value: 'Everest is named after George Everest, a British surveyor who mapped peaks across India. Its Tibetan name, Chomolungma, means "Goddess Mother of the World."' },
      { type: 'text',    value: 'Denali means "The Great One" in the Athabascan language of Alaska.' },
      { type: 'text',    value: 'Kilimanjaro comes from Swahili and is thought to mean "shining mountain" or "mountain of light," though the exact origin is debated.' },
      { type: 'text',    value: 'Elbrus is likely Iranian in origin  -  "Alborz" means "high mountain."' },
      { type: 'text',    value: 'Vinson Massif is named after Carl Vinson, a US congressman from Georgia who championed funding for Antarctic research.' },
      { type: 'text',    value: 'Kosciuszko honours Polish-American military leader Tadeusz Kościuszko. Polish explorer Paweł Edmund Strzelecki named it when he became the first person to climb it.' },
      { type: 'text',    value: 'Carstensz Pyramid was named after Dutch explorer Jan Carstensz, who sighted it in 1623. Its Indonesian name, Puncak Jaya, means "Peak of Victory."' },
      { type: 'text',    value: 'Aconcagua carries different meanings across indigenous languages: "coming from the other side" of a river in Araucanian; "stone sentinel" or "watching over the sands" in Quechua; "white channel" or "snowy mountain" in Aymara.' },

      { type: 'section', value: 'What comes after the Seven Summits?' },

      { type: 'heading', value: 'The 14 eight-thousanders' },
      { type: 'text',    value: 'The next level: all 14 mountains above 8,000 metres. Harder, more dangerous, and financially brutal. Only elite climbers attempt this, and fewer than 50 people have ever finished it.' },
      { type: 'list',    noMarker: true, items: [
        '1. Everest (Nepal)  -  8,848 m',
        '2. K2 (Pakistan)  -  8,611 m',
        '3. Kangchenjunga (Nepal)  -  8,586 m',
        '4. Lhotse (Nepal)  -  8,516 m',
        '5. Makalu (Nepal)  -  8,485 m',
        '6. Cho Oyu (Nepal)  -  8,188 m',
        '7. Dhaulagiri (Nepal)  -  8,167 m',
        '8. Manaslu (Nepal)  -  8,156 m',
        '9. Nanga Parbat (Pakistan)  -  8,125 m',
        '10. Annapurna (Nepal)  -  8,091 m',
        '11. Gasherbrum I (Pakistan)  -  8,080 m',
        '12. Broad Peak (Pakistan)  -  8,051 m',
        '13. Gasherbrum II (Pakistan)  -  8,035 m',
        '14. Shishapangma (China)  -  8,027 m',
      ]},
      { type: 'text',    value: 'The speed record belongs to Norwegian climber Kristin Harila and Sherpa Tenjen Lama from Nepal: 92 days to complete all 14, breaking the previous record of Nirmal Purja (Nimsdai). About 50 people have ever completed the full list.' },
      { type: 'image',   src: '/images/blog/kristin-harila.webp', alt: 'Kristin Harila  -  one of the most accomplished high-altitude climbers active today', caption: 'Kristin Harila  -  one of the most accomplished high-altitude climbers active today', objectPosition: 'top' },
    ],
  },
];

export const CATEGORIES    = [...new Set(POSTS.map(p => p.category))];
export const CATEGORIES_EN = [...new Set(POSTS.map(p => p.categoryEn || p.category))];
