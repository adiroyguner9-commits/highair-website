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
    dateHe:   '3 בספטמבר 2025',
    dateEn:   'September 3, 2025',
    category: 'מדריכים',
    categoryEn: 'Guides',
    img:         '/images/blog/kristin-harila.webp',
    imgPosition: 'center 20%',
    excerpt:  'פרויקט הטיפוס לשבע הפסגות נחשב לאחד האתגרים הגדולים והנחשקים ביותר בעולם הטיפוס. כל מה שצריך לדעת לפני שמתחילים.',
    excerptEn: 'The Seven Summits challenge is considered one of the greatest and most coveted achievements in the mountaineering world. Everything you need to know before you start.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text',    value: 'במאמר זה תמצאו את כל המידע על שבע הפסגות, ההרים הגבוהים ביותר בכל אחת משבע היבשות. פרויקט הטיפוס לשבע הפסגות נחשב לאחד האתגרים הגדולים והנחשקים ביותר בעולם הטיפוס, ומושך אליו מטפסים מכל רחבי העולם.' },
      { type: 'text',    value: 'נסקור מהן שבע הפסגות, מה רמת הקושי של כל אחד מההרים, מי מהן נחשבת לפסגה הקלה ביותר לטיפוס, וגם נשתף עובדות היסטוריות, שמות ההרים, שיאי עולם ומידע חיוני למטפסים וחובבי הרים. אם אתם חולמים על טיפוס הרים או מחפשים להכיר מקרוב את ההרים הגבוהים בעולם, המדריך הזה הוא נקודת פתיחה מצוינת.' },

      { type: 'heading', value: 'מהו מועדון שבע הפסגות?' },
      { type: 'text',    value: 'מדובר בקהילה לא רשמית של מטפסים מכל העולם, המאוחדים סביב תשוקה אחת: כיבוש הפסגות הגבוהות ביותר בכל אחת מיבשות העולם.' },
      { type: 'text',    value: 'עבור חברי מועדון שבע הפסגות, הטיפוס על ההרים האייקוניים האלו הוא לא רק אתגר פיזי, אלא גם מסע אישי של צמיחה, התמודדות וגילוי עצמי, לצד חוויה תרבותית ייחודית. ההרפתקאות המשותפות יוצרות קשרים חזקים, תחושת אחווה וחברויות שנמשכות לאורך שנים.' },
      { type: 'text',    value: 'בין כל ההרים, קילימנג\'רו שבאפריקה נחשב לשער הכניסה המושלם לעולם המופלא הזה. בזכות המסלולים הנגישים שלו והנופים עוצרי הנשימה, הוא מהווה לרבים את נקודת ההתחלה במסע לעבר רשימת שבע הפסגות ומעניק הצצה ראשונה לאתגרים, לחוויות ולהגשמה האישית שמלווים את הדרך לפסגות הגבוהות בעולם.' },

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
      { type: 'text',    value: 'התשובה פשוטה: זהו אחד ההישגים הפופולריים והמוכרים ביותר בעולם טיפוס ההרים החובבני. זהו אתגר שמאפשר לאנשים לבחון את עצמם, לפעול בקצה גבול היכולת, וכמובן, לגלות מקומות חדשים ולראות נופים עוצרי נשימה.' },
      { type: 'image',   src: '/images/blog/seven-summits-why-climb.webp', alt: 'מטפסים בדרך לפסגה', caption: '' },

      { type: 'heading', value: 'כמה אנשים צלחו את האתגר?' },
      { type: 'text',    value: 'נכון לשנת 2016, כ-416 אנשים השלימו את רשימת שבע הפסגות, מתוכם 71 נשים. חשוב לציין שאין ארגון רשמי או רישום יחיד של כל המטפסים, ועל כן מדובר בהערכה. ההערכה הכללית היא שכ-500 אנשים סיימו את האתגר.' },

      { type: 'heading', value: 'מי הגה את הרעיון?' },
      { type: 'text',    value: 'וויליאם האקט האמריקאי, לאחר שטיפס על הרים בחמש יבשות שונות (דנאלי, אקונקגואה, קילימנג\'רו, קוסצ\'ושקו ומון בלאן), ניסה לטפס גם את הר וינסון וקיבל אישור לטיפוס על האוורסט. למרות שלא הצליח להשלים את האתגר בשל כוויות קור וחוסר מימון, הרעיון שלו תפס תאוצה.' },
      { type: 'text',    value: 'האדם הראשון שהשלים את האתגר במלואו היה האמריקאי ריצ\'רד באס. בשנת 1983 בלבד, הוא טיפס על שש פסגות, ובשנת 1985 השלים את הרשימה עם טיפוס להר האוורסט.' },
      { type: 'image',   src: '/images/blog/seven-summits-climbing.avif', alt: 'ריצ\'רד באס - האדם הראשון שהשלים את "שבע הפסגות"', caption: 'ריצ\'רד באס - האדם הראשון שהשלים את "שבע הפסגות"' },

      { type: 'heading', value: 'כמה זה באמת קשה?' },
      { type: 'text',    value: 'טיפוס על כל שבע הפסגות כולל בעיקר טרקים בגובה רב ולא בהכרח טיפוס הרים טכני. גם בעלייה לאוורסט, האתגר העיקרי מגיע מהגובה. הקושי המרכזי בטיפוס שבע הפסגות טמון בזמן ובעלויות כספיות: הוצאות על טיסות, אישורים, ויזות, ציוד, ביטוח, ועוד.' },
      { type: 'text',    value: 'טיפוס על האוורסט, לדוגמה, יכול לארוך עד חודשיים ולעלות בין 60 אלף דולר ל-75 אלף דולר. לא לכל אחד יש את האמצעים או הזמן הדרושים למשימה כזו.' },
      { type: 'text',    value: 'טיפוס על הרים גדולים כמו אוורסט, דנאלי ווינסון מאסיף טומן בחובו סיכונים עקב הגובה הקיצוני. לעומת זאת, פסגות נמוכות יותר מרשימת שבע הפסגות, כמו קילימנג\'רו, נחשבות בדרך כלל בטוחות למדי גם למתחילים.' },

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
      { type: 'text',    value: 'הקל ביותר מבין 7 הפסגות הוא הר הקילימנג\'רו. למרות הגובה היחסי שלו, הטיפוס אינו מאתגר מבחינה טכנית. בנוסף, התשתית המפותחת במקום מאפשרת לטפס עליו ללא הוצאות לוגיסטיות משמעותיות. מסע טיפוס אופייני נמשך כשבוע. על ההר, תיהנו מארוחות שמכינים שפים מיוחדים, בזמן שהמדריכים והסבלים המקומיים ידאגו לציוד ולאוהלים שלכם.' },
      { type: 'image',   src: '/images/blog/kilimanjaro-trekkers.webp', alt: 'מטיילים בדרך לקילימנג\'רו', caption: '' },

      { type: 'heading', value: 'איזו פסגה היא הקשה ביותר?' },
      { type: 'text',    value: 'הר האוורסט הוא ללא ספק הקשה ביותר מבין שבע הפסגות. עם גובה קיצוני, צורך בהכנה מקיפה, עלויות גבוהות ועונת טיפוס קצרה, הפיכתה של העלייה לפסגה הגבוהה בעולם להצלחה היא אתגר עצום.' },
      { type: 'image',   src: '/images/blog/everest-hardest.webp', alt: 'מטפסים על האוורסט', caption: '' },

      { type: 'heading', value: 'מה הסדר המומלץ לטיפוס?' },
      { type: 'text',    value: 'ההתחלה הקלה ביותר היא קילימנג\'רו: הוא לא דורש כישורי טיפוס מיוחדים והוא יפה להפליא. יתרה מכך, טנזניה היא מדינה מרתקת באפריקה, ואת הטיול ניתן לשלב עם ספארי ונופש בזנזיבר. לאחר מכן, מומלץ אלברוס, ואחריו אקונקגואה. זהו מבחן רציני לפני האתגר העיקרי – אוורסט. את רכס וינסון, דנאלי ופירמידת קרסטנסז ניתן לטפס בכל סדר שתרצו, תלוי באישורי ויזה וסידורי נסיעות, אם כי כולם יהיו יקרים, למרות שהרבה פחות מטיפוס על הר האוורסט. דנאלי הוא גם המאתגר ביותר מבחינה טכנית, אז עדיף לנסות אותו כשאתם מרגישים כמטפסים מנוסים.' },

      { type: 'heading', value: 'באיזו כושר צריך להיות?' },
      { type: 'text',    value: 'כושר גופני טוב הוא חיוני, אם כי אין סטנדרטים ספציפיים. אף רופא לא יאשר אותך כ"כשיר לטיפוס על אוורסט". עם זאת, אימון מקיף – טיפוסים בגבהים שונים ובתנאים שונים – הוא הכרחי.' },

      { type: 'heading', value: 'האם אפשר לטפס לבד?' },
      { type: 'text',    value: 'לא על כולן. למשל, טיפוס על הקילימנג\'רו ללא מדריך מקומי וצוות תמיכה אינו מותר. הגבלה זו הגיונית, מכיוון שהיא מהווה מקור הכנסה חשוב לממשלה ולאזרחים המקומיים. טיפוס על האוורסט באופן עצמאי הוא גם קשה ביותר; נדרש אישור מהממשלה הנפאלית והם נדירים (רק 500 הונפקו ב-2023) ויקרים מאוד - 15,000 דולר. טיפוס להר וינסון יכולה להיות מאורגנת רק על ידי החברה האמריקאית Antarctic Logistics & Expeditions LLC.' },

      { type: 'heading', value: 'איך להתכונן לאתגר?' },
      { type: 'text',    value: 'זה תלוי בניסיון הטיפוס ובכושר הגופני. אם אתה בכושר ממוצע או ירוד, התחל בהכנה גופנית כללית – ריצת שטח, שחייה, וכו\'. לאחר מכן, עבור לטיפוס. אם אתה בכושר מצוין, תוכל לצאת להרים כבר מחר. ניתן להתחיל להתאמן עם חברות טרקים בארץ, תטפס על פסגות קרובות ותצבור ניסיון. לחלופין, תוכל ללכת ישר לחברות מקצועיות ולטפס, למשל, על הקילימנג\'רו.' },

      { type: 'heading', value: 'כמה זה אמור לעלות?' },
      { type: 'text',    value: 'העלות תלויה באופן שבו אתה מארגן הכל. אתה יכול לקנות טיולים הכוללים הכל, או לארגן חלקים בעצמך. האפשרות החסכונית ביותר תעלה ככל הנראה לא פחות מ-120,000 דולר. אוורסט הוא, כמובן, היקר ביותר, עם עלויות הנעות בין 36,000 דולר ועד 200,000 דולר. אם אתה לא מוכן ללוגיסטיקה מורכבת, אתה יכול לפנות לחברות טיולי הרים. לדוגמה, תוכנית אפשרית אחת היא: יוני – קילימנג\'רו, אוגוסט – אלברוס. דצמבר–פברואר: אקונקגואה ווינסון. אביב – אוורסט. בסתיו הבא, טפל בפירמידת קרסטנסז או וינסון מאסיף (אם לא נעשה קודם) ודנאלי בקיץ.' },

      { type: 'heading', value: 'האם יש דרך לחסוך כסף?' },
      { type: 'text',    value: 'מטפסים רבים מסתמכים על תמיכה של נותני חסות או של ממשלתם. במדינות מסוימות יש תוכניות גיוס כספים עבור מוסדות, כמו מוסדות רפואיים. בגיוס כסף עבורם, מטפסים יכולים להקצות חלק מהכספים לטיפוסים שלהם – כן, זה חוקי. תוכניות כאלה פופולריות בארה"ב, קנדה, בריטניה ואוסטרליה, ומכאן שרוב מסיימי שבע הפסגות הם אזרחי מדינות אלו. במדינות אחרות, מימון המונים עשוי לעבוד, תוך איסוף כספים באינטרנט ממספר גדול של אנשים. מציאת נותן חסות היא גם אפשרות, למשל, חברה שמעוניינת לראות את הדגל שלה על האוורסט.' },

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
      { type: 'text',    value: 'השיא להשלמה המהירה ביותר של אתגר "14x8000" שייך למטפסת הנורווגית קריסטין הרילה ולשרפה טנג\'י לאמה מנפאל, שהצליחו לעשות זאת ב-92 ימים, ושברו את השיא הקודם של נירמל פורג\'ה (נימסדאי), מטפס ההרים הנפאלי הגדול בכל הזמנים. רק כ-50 אנשים בעולם הצליחו להעפיל לכל 14 הפסגות.' },
      { type: 'image',   src: '/images/blog/kristin-harila.webp', alt: 'קריסטין הרילה - אחת המטפסות המפורסמות ביותר כיום', caption: 'קריסטין הרילה - אחת המטפסות המפורסמות ביותר כיום', objectPosition: 'top' },
    ],

    /* ── English content ── */
    titleEn: 'The Complete Guide to the Seven Summits: The Highest Peaks on Every Continent',
    contentEn: [
      { type: 'text',    value: 'In this article you will find everything you need to know about the Seven Summits — the highest mountains on each of the seven continents. The Seven Summits project is considered one of the greatest and most coveted challenges in the mountaineering world, attracting climbers from every corner of the globe.' },
      { type: 'text',    value: 'We will cover what the Seven Summits are, the difficulty level of each mountain, which one is considered the easiest to climb, and we\'ll share historical facts, mountain names, world records, and essential information for mountaineers and mountain enthusiasts. If you dream of climbing mountains or want to learn more about the highest peaks on Earth, this guide is the perfect starting point.' },

      { type: 'heading', value: 'What is the Seven Summits Club?' },
      { type: 'text',    value: 'It is an informal community of climbers from around the world, united by a single passion: conquering the highest peak on each of the world\'s seven continents.' },
      { type: 'text',    value: 'For members of the Seven Summits Club, climbing these iconic mountains is not just a physical challenge — it is also a personal journey of growth, resilience, and self-discovery, alongside a unique cultural experience. Shared adventures forge strong bonds, a sense of camaraderie, and friendships that last for years.' },
      { type: 'text',    value: 'Among all the mountains, Kilimanjaro in Africa is considered the perfect gateway into this remarkable world. Thanks to its accessible routes and breathtaking scenery, it serves for many as the starting point on the journey toward the Seven Summits list, offering a first glimpse of the challenges, experiences, and personal fulfilment that accompany the path to the world\'s highest peaks.' },

      { type: 'image',   src: '/images/blog/seven-summits-everest.webp', caption: 'Everest and Nuptse — Photo: Alon Peleg' },

      { type: 'heading', value: 'So, what are the Seven Summits?' },
      { type: 'list',    items: [
        'Everest (Asia) — 8,848 m',
        'Aconcagua (South America) — 6,962 m',
        'Denali (North America) — 6,190 m',
        'Kilimanjaro (Africa) — 5,895 m',
        'Elbrus (Europe) — 5,642 m',
        'Vinson Massif (Antarctica) — 4,892 m',
        'Carstensz Pyramid (Oceania) — 4,884 m',
        'Kosciuszko (Australia) — 2,228 m',
      ]},

      { type: 'heading', value: 'Wait — why are there eight peaks?' },
      { type: 'text',    value: 'The fact is that there is not just one list of Seven Summits. The confusion arises because "continents" and "parts of the world" are different concepts. Even among scientists there is no agreement on whether to treat North and South America as one continent or two separate ones.' },
      { type: 'text',    value: 'At some point, the mountaineering community agreed that the list would include Europe and Asia separately (rather than Eurasia), and likewise South and North America. The central remaining problem was Australia and Oceania.' },
      { type: 'text',    value: 'If you consider only the continent of Australia, the highest point is Mount Kosciuszko. But if you combine Australia and Oceania into one part of the world, the highest point becomes Carstensz Pyramid in New Guinea.' },
      { type: 'text',    value: 'Because of this disagreement, two separate lists emerged. In the Bass list, the seventh summit is Mount Kosciuszko, while in the Messner list, the seventh summit is Carstensz Pyramid.' },

      { type: 'heading', value: 'So what really are the 7 Summits?' },
      { type: 'text',    value: 'The truth is that both lists — Bass\'s and Messner\'s — are considered valid. The reason is that there is no single official list, and the debate over the seventh summit will always remain. Therefore, to be completely certain, some climbers choose to climb all eight peaks.' },
      { type: 'text',    value: 'Incidentally, there is yet another version of the list that includes Mont Blanc. This happens because in certain geopolitical divisions, the Caucasus mountains — where Mount Elbrus is located — are considered part of Asia rather than Europe. In that case, Elbrus drops off the list and Mont Blanc takes its place.' },

      { type: 'heading', value: 'Why climb the Seven Summits?' },
      { type: 'text',    value: 'The answer is simple: it is one of the most popular and recognised achievements in amateur mountaineering. It is a challenge that allows people to test themselves, operate at the edge of their abilities, and of course discover new places and witness breathtaking scenery.' },
      { type: 'image',   src: '/images/blog/seven-summits-why-climb.webp', alt: 'Climbers on the way to the summit', caption: '' },

      { type: 'heading', value: 'How many people have completed the challenge?' },
      { type: 'text',    value: 'As of 2016, approximately 416 people had completed the Seven Summits list, including 71 women. It is important to note that there is no official organisation or single register of all climbers, so this is an estimate. The general estimate is that around 500 people have finished the challenge.' },

      { type: 'heading', value: 'Who came up with the idea?' },
      { type: 'text',    value: 'American William Hackett, after climbing mountains on five different continents (Denali, Aconcagua, Kilimanjaro, Kosciuszko and Mont Blanc), attempted to climb Vinson and received permission to climb Everest. Although he did not manage to complete the challenge due to frostbite and lack of funding, his idea gained momentum.' },
      { type: 'text',    value: 'The first person to complete the full challenge was American Richard Bass. In 1983 alone, he climbed six summits, and in 1985 he completed the list with a climb to Mount Everest.' },
      { type: 'image',   src: '/images/blog/seven-summits-climbing.avif', alt: 'Richard Bass — the first person to complete the Seven Summits', caption: 'Richard Bass — the first person to complete the Seven Summits' },

      { type: 'heading', value: 'How hard is it really?' },
      { type: 'text',    value: 'Climbing all seven summits mainly involves high-altitude trekking rather than technical climbing. Even on Everest, the main challenge comes from the altitude. The central difficulty of the Seven Summits challenge lies in time and financial cost: expenses for flights, permits, visas, equipment, insurance, and more.' },
      { type: 'text',    value: 'Climbing Everest, for example, can take up to two months and cost between $60,000 and $75,000. Not everyone has the means or the time required for such an undertaking.' },
      { type: 'text',    value: 'Climbing major mountains such as Everest, Denali, and Vinson Massif carries risks due to extreme altitude. By contrast, lower peaks on the Seven Summits list, such as Kilimanjaro, are generally considered quite safe even for beginners.' },

      { type: 'section', value: 'Seven Summits Records' },

      { type: 'heading', value: 'Who is the youngest and oldest?' },
      { type: 'text',    value: 'In December 2011, Jordan Romero (USA) climbed Vinson Massif — his final peak of the Seven Summits — at the age of 15 years, 5 months, and 12 days. He was also the youngest person to climb Everest, at the age of 13 years and 10 months.' },
      { type: 'text',    value: 'Werner Berger (South Africa/Canada) climbed Everest at age 69 years and 310 days on 22 May 2007, completing the Bass list. In 2013, at age 76 years and 128 days, he also climbed Carstensz Pyramid, completing both Seven Summits lists.' },

      { type: 'heading', value: 'Who was the first woman?' },
      { type: 'text',    value: 'Japanese mountaineer Junko Tabei reached the summit of Carstensz Pyramid in 1992, completing the Seven Summits challenge she had begun in 1980 with Kilimanjaro.' },

      { type: 'heading', value: 'Who did it fastest?' },
      { type: 'text',    value: 'Australian Steve Plain summited Everest on 14 May 2018, completing all seven summits in just 117 days, 6 hours, and 50 minutes — only 11 months after a serious injury.' },

      { type: 'section', value: 'Frequently Asked Questions' },

      { type: 'heading', value: 'Which summit is the easiest?' },
      { type: 'text',    value: 'The easiest of the 7 Summits is Kilimanjaro. Despite its relative height, the climb is not technically challenging. In addition, the well-developed infrastructure on the mountain allows you to climb it without significant logistical expenses. A typical climb lasts about a week. On the mountain, you will enjoy meals prepared by dedicated chefs, while local guides and porters take care of your equipment and tents.' },
      { type: 'image',   src: '/images/blog/kilimanjaro-trekkers.webp', alt: 'Trekkers on the way to Kilimanjaro', caption: '' },

      { type: 'heading', value: 'Which summit is the hardest?' },
      { type: 'text',    value: 'Mount Everest is without doubt the hardest of the Seven Summits. With extreme altitude, the need for extensive preparation, high costs, and a short climbing season, turning a summit bid on the world\'s highest peak into a success is an enormous challenge.' },
      { type: 'image',   src: '/images/blog/everest-hardest.webp', alt: 'Climbers on Everest', caption: '' },

      { type: 'heading', value: 'What is the recommended order to climb them?' },
      { type: 'text',    value: 'The easiest starting point is Kilimanjaro: it requires no special climbing skills and is stunningly beautiful. Moreover, Tanzania is a fascinating country in Africa, and the trip can be combined with a safari and a holiday in Zanzibar. Next, Elbrus is recommended, followed by Aconcagua — a serious test before the main challenge, Everest. Vinson, Denali, and Carstensz Pyramid can be climbed in any order you wish, depending on visa permits and travel arrangements, though all will be expensive — though far less so than Everest. Denali is also the most technically demanding, so it is best attempted when you feel like an experienced climber.' },

      { type: 'heading', value: 'What fitness level is required?' },
      { type: 'text',    value: 'Good physical fitness is essential, though there are no specific standards. No doctor will certify you as "fit to climb Everest." However, comprehensive training — climbing at various altitudes and in various conditions — is essential.' },

      { type: 'heading', value: 'Can you climb alone?' },
      { type: 'text',    value: 'Not all of them. For example, climbing Kilimanjaro without a local guide and support crew is not permitted. This restriction makes sense, as it provides an important source of income for the government and local citizens. Climbing Everest independently is also extremely difficult; a permit from the Nepali government is required, they are rare (only 500 were issued in 2023) and very expensive — $15,000. Climbing Vinson can only be organised through the American company Antarctic Logistics & Expeditions LLC.' },

      { type: 'heading', value: 'How do you prepare for the challenge?' },
      { type: 'text',    value: 'It depends on your climbing experience and physical fitness. If you are of average or below-average fitness, start with general physical conditioning — trail running, swimming, etc. Then move on to climbing. If you are in excellent shape, you can head to the mountains tomorrow. You can begin training with trekking companies locally, climb nearby peaks, and gain experience. Alternatively, you can go straight to professional companies and climb, for example, Kilimanjaro.' },

      { type: 'heading', value: 'How much should it cost?' },
      { type: 'text',    value: 'The cost depends on how you organise everything. You can buy all-inclusive trips or arrange parts yourself. The most economical option will likely cost no less than $120,000. Everest is of course the most expensive, with costs ranging from $36,000 to $200,000. If you are not ready for complex logistics, you can turn to mountain tour companies. For example, one possible plan would be: June — Kilimanjaro, August — Elbrus, December–February: Aconcagua and Vinson, Spring — Everest. The following autumn, tackle Carstensz Pyramid or Vinson Massif (if not done earlier) and Denali in summer.' },

      { type: 'heading', value: 'Is there a way to save money?' },
      { type: 'text',    value: 'Many climbers rely on support from sponsors or their governments. In some countries there are fundraising programmes for institutions, such as medical institutions. By raising money for them, climbers can allocate part of the funds to their climbs — yes, this is legal. Such programmes are popular in the USA, Canada, the UK, and Australia, which is why most Seven Summits finishers are citizens of those countries. In other countries, crowdfunding may work, collecting money online from a large number of people. Finding a sponsor is also an option — for example, a company that wants to see its flag on Everest.' },

      { type: 'section', value: 'Name Histories' },
      { type: 'text',    value: 'Everest is named after George Everest, a British surveyor involved in determining the precise heights of many peaks in India. The original name, Chomolungma, translates from Tibetan as "Goddess Mother of the World."' },
      { type: 'text',    value: 'Denali means "The Great One" in the language of the Athabascan people of Alaska.' },
      { type: 'text',    value: 'Kilimanjaro comes from the Swahili language and is thought to mean "shining mountain" or "mountain of light," though its exact origin is unknown.' },
      { type: 'text',    value: 'Elbrus is likely of Iranian origin, where "Alborz" means "high mountain."' },
      { type: 'text',    value: 'The Vinson Massif is named after Carl Vinson, an American congressman from Georgia who was an enthusiastic supporter of funding Antarctic exploration.' },
      { type: 'text',    value: 'Kosciuszko is named in honour of Polish and American military leader Tadeusz Kościuszko. The mountain was named by the first person to climb it, Polish explorer and geologist Paweł Edmund Strzelecki.' },
      { type: 'text',    value: 'Carstensz Pyramid was named after Dutch explorer Jan Carstensz, who first sighted the mountain in 1623. Its original name, Puncak Jaya, means "Peak of Victory" in Indonesian.' },
      { type: 'text',    value: 'Aconcagua has different meanings in the languages of indigenous peoples. In Araucanian, it means "coming from the other side" of the river. In Quechua, it can mean "stone sentinel" or "watching over the sands." In Aymara, it translates to "white channel" or "snowy mountain."' },

      { type: 'section', value: 'What\'s the Next Challenge?' },

      { type: 'heading', value: 'The 14 Eight-Thousanders' },
      { type: 'text',    value: 'Another famous challenge, involving climbing the 14 highest mountains in the world — all above 8,000 metres. This is a particularly hard and dangerous challenge due to the extreme altitude and additional difficulties. Only experienced elite climbers attempt to complete the list, and even among them, very few succeed.' },
      { type: 'list',    noMarker: true, items: [
        '1. Everest (Nepal) — 8,848 m',
        '2. K2 (Pakistan) — 8,611 m',
        '3. Kangchenjunga (Nepal) — 8,586 m',
        '4. Lhotse (Nepal) — 8,516 m',
        '5. Makalu (Nepal) — 8,485 m',
        '6. Cho Oyu (Nepal) — 8,188 m',
        '7. Dhaulagiri (Nepal) — 8,167 m',
        '8. Manaslu (Nepal) — 8,156 m',
        '9. Nanga Parbat (Pakistan) — 8,125 m',
        '10. Annapurna (Nepal) — 8,091 m',
        '11. Gasherbrum I (Pakistan) — 8,080 m',
        '12. Broad Peak (Pakistan) — 8,051 m',
        '13. Gasherbrum II (Pakistan) — 8,035 m',
        '14. Shishapangma (China) — 8,027 m',
      ]},
      { type: 'text',    value: 'The record for the fastest completion of the "14×8000" challenge belongs to Norwegian climber Kristin Harila and Sherpa Tenjen Lama from Nepal, who achieved it in 92 days, breaking the previous record held by Nirmal Purja (Nimsdai), the greatest Nepali mountaineer of all time. Only around 50 people in the world have managed to summit all 14 peaks.' },
      { type: 'image',   src: '/images/blog/kristin-harila.webp', alt: 'Kristin Harila — one of the most famous climbers today', caption: 'Kristin Harila — one of the most famous climbers today', objectPosition: 'top' },
    ],
  },
];

export const CATEGORIES    = [...new Set(POSTS.map(p => p.category))];
export const CATEGORIES_EN = [...new Set(POSTS.map(p => p.categoryEn || p.category))];
