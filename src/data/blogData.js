/**
 * blogData.js - Blog posts
 * To add a new post: copy the object structure below and paste at the top of POSTS array.
 * Each post supports both Hebrew (default) and English (En suffix) fields.
 */

export const POSTS = [

  /* ═══════════════════════════════════════════════════════════════════
   *  id:2  tipus-kilimanjaro-madrich-male  (2026-05-07)
   * ═══════════════════════════════════════════════════════════════════ */
  {
    id:       2,
    slug:     'tipus-kilimanjaro-madrich-male',

    /* ── Hebrew ── */
    title:    'טיפוס לקילימנג׳רו: המדריך המלא לפני שאתם יוצאים לדרך',
    author:   'חן',
    dateIso:  '2026-05-07',
    dateModified: '2026-05-07',
    dateHe:   '7 במאי 2026',
    dateEn:   'May 7, 2026',
    category: 'מדריכים',
    categoryEn: 'Guides',
    img:         '/images/blog/kilimanjaro-machame.webp',
    imgPosition: 'center 40%',
    excerpt:  'כל מה שצריך לדעת לפני טיפוס לקילימנג׳רו: מסלולים, מחירים, ציוד, הכנה, מחלת גובה ועצות מ-10 שנות משלחות. המדריך המלא של HighAir.',
    excerptEn: 'Everything you need to know before climbing Kilimanjaro: routes, costs, gear, training, altitude sickness, and advice from 10 years of expeditions.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'יש רגע אחד שכל מטפס בקילימנג׳רו זוכר. אצל רובנו זה קורה איפשהו אחרי חצות, כשאתה כבר שש שעות הולך בחושך, הקור חודר דרך שלוש שכבות של בגדים, והמדריך שלך אומר בקול שקט "pole pole" בערך בפעם המאתיים. אתה לא בטוח אם אתה עוד יכול. ואז, אחרי עוד שעה, אחרי עוד שעתיים, אתה מגיע לאוהורו פיק. 5895 מטר. הגג של אפריקה.' },
      { type: 'text', value: 'אני חן, אחד המייסדים של HighAir Expeditions, ואחרי עשר שנים של הוצאת קבוצות לקילימנג׳רו אני יכול להגיד דבר אחד בוודאות: רוב מה שיכריע אם תגיע לפסגה או לא, יקרה הרבה לפני שתגיע לטנזניה. בבחירת המסלול. באיך שתבחר סוכנות. בכמה רציני התייחסת להכנה הפיזית. בעיקר - בכמה פעמים תמשמע למדריך כשהוא יגיד לך ללכת לאט יותר.' },
      { type: 'text', value: 'זה המדריך שהייתי רוצה לקרוא לפני המשלחת הראשונה שלי. בלי שטויות, בלי קישוטים, רק מה שעובד.' },

      { type: 'section', value: 'על קילימנג׳רו: מה שחייבים לדעת' },
      { type: 'text', value: 'קילימנג׳רו זה לא פשוט הר. זה הר געש כבוי שמתנשא לבדו מעל המישורים של צפון טנזניה, וזה הופך אותו להר הבודד הכי גבוה בעולם. הוא מורכב משלושה קונוסים: שירא במערב (3962 מ׳), מאוונזי במזרח (5149 מ׳), וקיבו במרכז - שעליו יושבת הפסגה האמיתית, אוהורו פיק.' },
      { type: 'text', value: 'מה שהופך את הטיפוס לקילימנג׳רו לחוויה ייחודית זה לא רק הגובה. זה העובדה שאתה עובר חמישה אזורי אקלים שונים בתוך שבוע: מיער גשם טרופי, דרך שדות אברך, ערבה אלפינית, מדבר ארקטי, ובסוף - פסגה מכוסה קרחונים. שום הר אחר בעולם לא נותן לך את זה. אתה למעשה מטייל מקו המשווה לקוטב הצפוני בתוך שישה ימים.' },
      { type: 'image', src: '/images/blog/kilimanjaro-layers.jpg', alt: 'אזורי האקלים של קילימנג׳רו', caption: 'חמישה אזורי אקלים בדרך לפסגה' },
      { type: 'text', value: 'עוד עובדה שכדאי לדעת: למרות שמדובר בהר של כמעט 6000 מטר, אין כאן טיפוס טכני. אם אתה יודע ללכת, אתה יכול בעיקרון להגיע לפסגה. ההר לא דורש חבלים, גרזני קרח או ניסיון בטיפוס. מה שהוא כן דורש זה כושר סביר, ראש חזק, וגוף שמסתגל עם גובה. השניים האחרונים זה החלק הקשה.' },

      { type: 'section', value: 'מסלולי הטיפוס בקילימנג׳רו: איך לבחור' },
      { type: 'text', value: 'זה השלב שבו רוב האנשים מתבלבלים. יש שבעה מסלולים רשמיים בקילימנג׳רו, ולכל סוכנות יש דעה למה דווקא המסלול שלה הכי טוב. הנה האמת על העיקריים שבהם.' },
      { type: 'subheading', value: 'מאצ׳אמה (Machame Route)' },
      { type: 'text', value: 'נקרא גם "מסלול הוויסקי", כנראה כי כל מי שעושה אותו מרגיש שהוא ראוי לאחד בסוף. זה המסלול הפופולרי ביותר בקילימנג׳רו, ובצדק. שישה או שבעה ימים, נופים מטורפים, פרופיל גובה טוב להסתגלות. החיסרון: הוא הומה אדם. בעונה תפגוש שיירות שלמות.' },
      { type: 'subheading', value: 'למושו (Lemosho Route)' },
      { type: 'text', value: 'זה המסלול שאני בדרך כלל ממליץ עליו לאנשים שמוכנים להוציא קצת יותר. שמונה ימים, נופים פנומנליים בצד המערבי, פחות עומס, וההסתגלות לגובה הכי טובה מבין כל המסלולים. אחוז ההצלחה כאן גבוה משמעותית. במשלחות שלנו ב-HighAir זה המסלול ברירת המחדל.' },
      { type: 'subheading', value: 'מארנגו (Marangu Route)' },
      { type: 'text', value: '"מסלול הקוקה קולה". המסלול היחיד עם בקתות שינה במקום אוהלים. נשמע מפנק, אבל יש פה בעיה רצינית: רק חמישה ימים, מה שאומר הסתגלות לגובה לא מספקת. אחוז ההצלחה כאן נמוך באופן מדאיג, איפשהו סביב 50%. אל תיקח אותו רק בגלל שהוא נשמע נוח.' },
      { type: 'subheading', value: 'רונגאי (Rongai Route)' },
      { type: 'text', value: 'הגישה היחידה לקילימנג׳רו מהצפון. שקט, יבש יותר, נוף שונה לגמרי. טוב במיוחד בעונת הגשמים כי הצד הזה של ההר מקבל פחות גשם. אם הלוח שלך מאלץ אותך לטפס בנובמבר או באפריל, זאת אופציה רצינית.' },
      { type: 'subheading', value: 'Northern Circuit' },
      { type: 'text', value: 'המסלול הארוך ביותר, תשעה ימים. הכי שקט, הכי פחות אנשים, ואחוזי ההצלחה הגבוהים ביותר בכל קילימנג׳רו. הבעיה היחידה: עולה הכי הרבה ולוקח הכי הרבה זמן.' },
      { type: 'text', value: 'עצה אחת חשובה: אל תתפתה לחסוך יום. כל יום נוסף על ההר זה סיכוי גדול יותר להצליח להגיע לפסגה. הכסף שתחסוך על מסלול קצר יותר יישכח. הזיכרון של חזרה ב-4500 מטר בלי להגיע לפסגה יישאר.' },
      { type: 'callout', title: 'ככה אנחנו ב-HighAir עושים את זה', value: 'במשלחות שלנו לקילימנג׳רו אנחנו עובדים אך ורק במסלולי שמונה-תשעה ימים, בקבוצות של עד 10 מטפסים, עם יחס של מדריך אחד לכל ארבעה מטפסים. אנחנו חברים מלאים ב-KPAP, מה שאומר שתנאי ההעסקה של הפורטרים שלנו עומדים בתקני האתיקה הגבוהים ביותר. אחוזי ההצלחה שלנו לפסגה: מעל 95%.' },
      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', alt: 'מסלול מאצ׳אמה - קילימנג׳רו', caption: 'נוף מהמסלול המערבי בדרך לפסגה' },

      { type: 'section', value: 'מתי לטפס לקילימנג׳רו' },
      { type: 'text', value: 'לקילימנג׳רו יש שתי עונות עיקריות לטיפוס: ינואר עד מרץ, ויוני עד אוקטובר.' },
      { type: 'text', value: 'ינואר-מרץ זה החודשים החמים יותר. הימים בהירים, הלילות פחות מרים, יש פחות אנשים על ההר. החיסרון: סיכוי גבוה יותר לשלג בפסגה, והגשם יכול להגיע לקראת סוף מרץ.' },
      { type: 'text', value: 'יוני-אוקטובר זה העונה היבשה הגדולה. אוגוסט-ספטמבר זה השיא, כי כולם בחופשת הקיץ. ההר עמוס. נופים נקיים, מזג אוויר יציב, סיכוי טוב לראות את הקרחונים בלי עננים.' },
      { type: 'text', value: 'אפריל-מאי ונובמבר זה עונת הגשמים. שבילים בוציים, נראות נמוכה, סיכון להחלקות. רוב הסוכנויות עובדות גם בעונה הזאת ויש בזה גם יתרונות (פחות אנשים, מחירים נמוכים), אבל זה לא לטיפוס ראשון.' },
      { type: 'text', value: 'לילה של ירח מלא זה בונוס שלא ייאמן. הטיפוס לפסגה מתבצע בלילה, ובלילה של ירח מלא אתה רואה את כל ההר נצבע בכסף. שווה לתכנן סביב זה אם אפשר. לוח המשלחות שלנו מסונכרן עם תאריכי ירח מלא.' },

      { type: 'section', value: 'הכנה פיזית לטיפוס לקילימנג׳רו' },
      { type: 'text', value: 'יש מיתוס שצריך להיות ספורטאי כדי לטפס לקילימנג׳רו. זה לא נכון. ראיתי אנשים בני 65 מגיעים לפסגה, וראיתי טריאתלטים בני 30 חוזרים מ-4800 מטר עם בחילה. כושר עוזר, אבל לא מבטיח כלום.' },
      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', alt: 'הכנה פיזית לקילימנג׳רו', caption: '' },
      { type: 'text', value: 'מה שכן עובד: הליכה. הרבה הליכה. הליכה עם תיק על הגב. הליכה עליות וירידות. ארבעה חודשים לפני היציאה כדאי להתחיל לטייל ארוך פעם בשבוע, לפחות שש שעות, רצוי בשטח עם הפרשי גובה. אם אתה גר ליד הר, מצוין. אם לא - מדרגות בבניין גבוה זה תחליף סביר.' },
      { type: 'text', value: 'הוסף שניים-שלושה אימוני סיבולת באמצע השבוע. ריצה, אופניים, חתירה, מה שעובד לך. המטרה היא לב חזק, לא שרירים גדולים. שרירים גדולים סוחבים יותר חמצן וזה דווקא מקשה עליך בגובה.' },
      { type: 'text', value: 'תרגיל ספציפי שאני מאוד ממליץ עליו: ללכת עם משקל. גם אם הפורטרים סוחבים את הציוד הכבד, אתה תסחב יומיומי 6-8 ק״ג של מים, ז׳קט, חטיפים. תרגל את זה.' },
      { type: 'text', value: 'חודש לפני היציאה תפסיק להעמיס. מספיק. הגוף צריך להגיע נח.' },

      { type: 'section', value: 'רשימת ציוד לקילימנג׳רו' },
      { type: 'text', value: 'זה הקטע שבו האנשים מבזבזים הכי הרבה כסף לחינם. הנה האמת על מה שצריך באמת.' },
      { type: 'subheading', value: 'נעליים וגרביים' },
      { type: 'text', value: 'זוג נעלי טיפוס שכבר הלכת בהן לפחות 50 ק״מ. נעלים חדשות בקילימנג׳רו זה מתכון לאסון. גרבי מרינו, לא כותנה, לעולם לא כותנה.' },
      { type: 'subheading', value: 'שיטת השכבות' },
      { type: 'text', value: 'שכבת בסיס מרינו ארוכה. שכבת אמצע פליז. שכבת חוץ דאון לפסגה. וגם הארדשל נגד גשם ורוח. בחלק התחתון: מכנס טיפוס רגיל, מכנס טרמי לפסגה, ושכבת חוץ נגד רוח.' },
      { type: 'subheading', value: 'כפפות' },
      { type: 'text', value: 'שני זוגות. אחד דק לכל הימים, אחד ראלי כבד לליל הפסגה. הידיים שלך יקפאו בליל הפסגה. אין דרך לעקוף את זה.' },
      { type: 'subheading', value: 'ראש ועיניים' },
      { type: 'text', value: 'כובע צמר, כובע שמש (השמש על קו המשווה היא לא הוגנת), באף מסביב לצוואר. משקפי שמש איכותיים, רצוי קטגוריה 4 לפסגה.' },
      { type: 'subheading', value: 'שק שינה' },
      { type: 'text', value: 'לפחות -10°C, רצוי -15°C. אל תחסוך פה. לישון רע על ההר זה לא להסתגל.' },
      { type: 'subheading', value: 'שאר הציוד' },
      { type: 'text', value: 'קרם הגנה SPF 50, שפתון עם הגנה, נורת ראש עם סוללות רזרביות שלא קופאות, מקלות הליכה, בקבוקי מים שמחזיקים שלושה ליטר ביחד.' },
      { type: 'text', value: 'רוב הסוכנויות בארושה משכירות ציוד כבד כמו שק שינה ודאון ז׳קט במחירים סבירים. אם אתה מטפס פעם אחת בחיים, זה הרבה יותר חכם מלקנות.' },
      { type: 'image', src: '/images/blog/kilimanjaro-porters.webp', alt: 'פורטרים בקילימנג׳רו', caption: 'הפורטרים הם הלב של כל משלחת בקילימנג׳רו' },

      { type: 'section', value: 'מחלת גובה בקילימנג׳רו: החלק שמכריע הכל' },
      { type: 'text', value: 'זה הסוד הכי גדול של קילימנג׳רו: רוב האנשים שלא מגיעים לפסגה לא נכשלים בגלל כושר. הם נכשלים בגלל גובה.' },
      { type: 'text', value: 'מחלת גובה (AMS) מתחילה בדרך כלל סביב 3000 מטר. כאב ראש, בחילה, חוסר תיאבון, קושי לישון. ברוב המקרים זה חולף עם זמן וירידה זמנית. אבל זה יכול להחמיר ל-HACE (בצקת מוחית) או HAPE (בצקת ריאות), ושני אלה הורגים אנשים גם בקילימנג׳רו, גם השנה.' },
      { type: 'text', value: 'איך מתמודדים? בעיקר על ידי טיפוס לאט. ה-"pole pole" שהמדריכים חוזרים עליו זה לא בדיחה. כל מי שמתפתה ללכת מהר ב-3500 מטר מוצא את עצמו בצרות ב-4500. תשתה הרבה מים, ארבעה ליטרים ביום זה מינימום. תאכל גם כשאין לך תיאבון. פחמימות בעיקר.' },
      { type: 'text', value: 'דיאמוקס (Acetazolamide) זה תרופה שעוזרת להסתגלות. רוב הסוכנויות יתנו לך אותה, חלק מהמטפסים מתחילים שלושה ימים לפני העלייה. דבר עם רופא לפני היציאה.' },
      { type: 'text', value: 'הכלל הכי חשוב: אם המדריך אומר שאתה יורד, אתה יורד. אין על מה להתווכח. ראיתי מטפסים מתעקשים להמשיך עם סימני HAPE ברורים, ואני מאחל לאף אחד לא לראות איך זה נגמר.' },

      { type: 'section', value: 'יום על ההר: מה לצפות' },
      { type: 'text', value: 'יום טיפוסי במאצ׳אמה או למושו נראה ככה: 6:30 בבוקר מעירים אותך עם תה ומים חמים לאוהל. 7:00 ארוחת בוקר באוהל המטבח - חביתה, פנקייקים, פרי, נס קפה. 8:00 יוצאים לדרך. הולכים 4-7 שעות, תלוי ביום, עם הפסקה לארוחת צהריים בערך באמצע. 14:00-16:00 מגיעים למחנה הבא. שותים תה עם פופקורן (ככה זה בקילימנג׳רו, אל תשאל), נחים, אולי הליכה קלה לטיול הסתגלות.' },
      { type: 'text', value: '19:00 ארוחת ערב, בדרך כלל מרק, פסטה או אורז עם בשר, פרי. 20:30 כולם בשק שינה. בלילה קר. בלילה מאוד קר.' },
      { type: 'image', src: '/images/blog/kilimanjaro-camp.avif', alt: 'מחנה בקילימנג׳רו', caption: 'ערב במחנה - אחרי יום הליכה' },
      { type: 'text', value: 'ליל הפסגה זה עניין אחר. יוצאים בחצות מקילימנג׳רו ביס מחנה ברפו או קוסובו, לפי המסלול. 1200 מטר עלייה ב-7-8 שעות, בקור של מינוס 15 עד מינוס 25, בחושך. אתה הולך לאט, נושם עמוק, מסתכל על הכוכבים, מנסה לא לחשוב כמה רחוקה הפסגה. זריחה ברוב המקרים תופסת אותך איפשהו ליד סטלה פוינט. כשהאור מתחיל לפלח את הקרחונים - זה הרגע. ואז עוד שעה ואתה שם.' },
      { type: 'text', value: 'הירידה לוקחת בערך חצי מהזמן ופי שניים מהקושי. הברכיים שלך תכריזנה מרד. זה נורמלי.' },

      { type: 'section', value: 'מחיר טיפוס לקילימנג׳רו: מה באמת זה עולה' },
      { type: 'text', value: 'הטווח של מחירי קילימנג׳רו רחב מאוד, ויש סיבות טובות לכך. סוכנות זולה ב-1500 דולר וסוכנות איכותית ב-3500 דולר זה לא אותו דבר.' },
      { type: 'subheading', value: 'מה כלול במחיר טוב' },
      { type: 'list', items: [
        'רישיונות פארק (כבר מהווים כ-1000 דולר)',
        'אוכל איכותי לכל אורך הטיפוס',
        'ציוד תקין ומוסדר',
        'יחס פורטרים הוגן - לא יותר מ-20 ק״ג לפורטר',
        'מדריכים מוסמכים עם ניסיון',
        'ביטוח חילוץ',
      ]},
      { type: 'subheading', value: 'מה לא כלול בדרך כלל' },
      { type: 'list', items: [
        'טיסה בינלאומית',
        'ויזה לטנזניה (50-100 דולר)',
        'טיפים לצוות (200-300 דולר זה הסטנדרט)',
        'ציוד אישי שאתה משכיר',
      ]},
      { type: 'text', value: 'אם אתה רואה הצעה ב-1200 דולר, תשאל איפה החיסכון. בדרך כלל זה במשכורות של הפורטרים. אלה אנשים שעובדים פיזית קשה בתנאים אכזריים בשביל הטיפוס שלך. תוודא שהסוכנות שלך חברה ב-KPAP, ארגון שמפקח על תנאי העסקה הוגנים בקילימנג׳רו.' },

      { type: 'section', value: 'שאלות נפוצות' },
      { type: 'heading', value: 'כמה ימים לוקח לטפס לקילימנג׳רו?' },
      { type: 'text', value: 'תלוי במסלול. מארנגו זה 5-6 ימים, מאצ׳אמה 6-7 ימים, למושו 7-8 ימים, ו-Northern Circuit 9 ימים. אנחנו ממליצים על מסלולים של 8 ימים ומעלה כדי לאפשר הסתגלות גובה ראויה.' },
      { type: 'heading', value: 'מה אחוזי ההצלחה לפסגה בקילימנג׳רו?' },
      { type: 'text', value: 'ממוצע כללי על ההר הוא בסביבות 65%. במסלולים קצרים כמו מארנגו האחוזים יורדים ל-50%. במסלולים ארוכים כמו למושו ו-Northern Circuit עם סוכנות איכותית, האחוזים מגיעים ל-90% ויותר. במשלחות של HighAir אחוזי ההצלחה הם מעל 95%.' },
      { type: 'heading', value: 'האם צריך אישור רפואי?' },
      { type: 'text', value: 'מומלץ. אנחנו דורשים אישור רפואי ממטפסים מעל גיל 55 או עם רקע של בעיות לב/ריאה. בדיקת רופא משפחה לפני המשלחת היא רעיון טוב לכולם.' },
      { type: 'heading', value: 'האם נשים בהריון יכולות לטפס?' },
      { type: 'text', value: 'לא ממליצים. המאמץ הפיזי, הגובה הקיצוני וריחוק מטיפול רפואי הופכים את זה לסיכון לא הוגן.' },
      { type: 'heading', value: 'מה גיל המינימום לטיפוס בקילימנג׳רו?' },
      { type: 'text', value: 'הפארק הלאומי דורש גיל 10 לפחות. אנחנו ממליצים על גיל 14 ומעלה לחוויה מציאותית, ועד גיל 16 נדרש מלווה הורה.' },
      { type: 'heading', value: 'צריך ויזה לטנזניה?' },
      { type: 'text', value: 'כן. אזרחי ישראל צריכים ויזה לטנזניה - תקפה ל-90 יום. אנחנו תמיד ממליצים להזמין מראש אונליין דרך האתר הרשמי של הממשלה הטנזנית, כדי לא להיתקע בתור בנמל התעופה עם ציוד טיפוס. עלות: כ-50 דולר. דרכון בתוקף לפחות 6 חודשים מיום הכניסה, והדבקות חיסונים מסוימות (במיוחד נגד צהבת ומלריה) הם חובה.' },
      { type: 'heading', value: 'איזה ביטוח צריך לטיפוס בקילימנג׳רו?' },
      { type: 'text', value: 'ביטוח שמכסה גובה עד 6000 מטר וחילוץ במסוק. ביטוחים סטנדרטיים בדרך כלל לא מכסים את זה. אנחנו עוזרים למטפסים שלנו לסדר ביטוח מתאים כחלק מהליווי לפני היציאה.' },

      { type: 'cta', text: 'לצפייה במשלחות הקילימנג׳רו שלנו', textEn: 'View our Kilimanjaro expeditions', href: '/expedition/kilimanjaro' },

      { type: 'text', value: 'קילימנג׳רו זה לא רק הר שמטפסים. זה משלחת שמתחילה ביום שאתם מחליטים, ונגמרת בעוד שנים בכל פעם שמישהו שואל על הבול בדרכון.' },
      { type: 'text', value: 'דבר אחרון. אל תיקח את עצמך יותר מדי ברצינות שם למעלה. תהנה מהאוכל המוזר, מהשירה של הפורטרים בבוקר, מהבדיחות הגרועות של המדריכים. תצלם קצת פחות, תסתכל קצת יותר. הקרחונים האלה כנראה לא יהיו פה בעוד 30 שנה.' },
    ],

    /* ── English content ── */
    titleEn: 'Kilimanjaro: the complete guide before you go',
    contentEn: [
      { type: 'text', value: 'There\'s one moment every Kilimanjaro climber remembers. For most of us it happens somewhere after midnight, six hours into the darkness, cold coming through three layers, and your guide quietly saying "pole pole" for maybe the two-hundredth time. You\'re not sure you can keep going. Then, after another hour, another two, you reach Uhuru Peak. 5895 metres. The roof of Africa.' },
      { type: 'text', value: 'I\'m Chen, one of the founders of HighAir Expeditions. After ten years of taking groups to Kilimanjaro, I can say one thing with certainty: most of what decides whether you reach the summit happens long before you land in Tanzania. The route you choose. How you pick an operator. How seriously you took the physical preparation. Mostly - how many times you listened when your guide told you to slow down.' },
      { type: 'text', value: 'This is the guide I wish I\'d read before my first expedition. No fluff, no decorations, just what works.' },

      { type: 'section', value: 'About Kilimanjaro: what you need to know' },
      { type: 'text', value: 'Kilimanjaro isn\'t just a mountain. It\'s an extinct stratovolcano that rises alone from the plains of northern Tanzania, making it the highest freestanding mountain in the world. It\'s made up of three cones: Shira in the west (3962 m), Mawenzi in the east (5149 m), and Kibo in the centre - where the actual summit, Uhuru Peak, sits.' },
      { type: 'text', value: 'What makes climbing Kilimanjaro a genuinely unusual experience isn\'t just the altitude. It\'s that you pass through five distinct climate zones in one week: tropical rainforest, heath, alpine meadow, arctic desert, and finally a glacier-covered summit. No other mountain in the world gives you that. You\'re essentially travelling from the equator to the North Pole in six days.' },
      { type: 'image', src: '/images/blog/kilimanjaro-layers.jpg', alt: 'Kilimanjaro climate zones', caption: 'Five climate zones on the way to the summit' },
      { type: 'text', value: 'One more thing worth knowing: despite being nearly 6000 metres high, there\'s no technical climbing here. If you can walk, you can in principle reach the summit. No ropes, no ice axes, no climbing experience required. What\'s required is reasonable fitness, a strong head, and a body that adapts to altitude. The last two are the hard part.' },

      { type: 'section', value: 'Kilimanjaro routes: how to choose' },
      { type: 'text', value: 'This is where most people get confused. There are seven official routes, and every operator has an opinion about why theirs is best. Here\'s the honest version.' },
      { type: 'subheading', value: 'Machame Route' },
      { type: 'text', value: 'Known as the "Whiskey Route," probably because everyone who finishes it feels they\'ve earned a drink. The most popular route on Kilimanjaro, and for good reason. Six or seven days, spectacular scenery, solid acclimatisation profile. The downside: it\'s crowded. In peak season you\'ll be hiking with long convoys.' },
      { type: 'subheading', value: 'Lemosho Route' },
      { type: 'text', value: 'The route I usually recommend for people willing to spend a bit more. Eight days, phenomenal views on the western approach, less foot traffic, and the best acclimatisation profile of any route. Success rates here are significantly higher. At HighAir, this is our default route.' },
      { type: 'subheading', value: 'Marangu Route' },
      { type: 'text', value: '"The Coca-Cola Route." The only route with hut accommodation instead of tents. Sounds comfortable, but there\'s a real problem: only five days, which means inadequate acclimatisation. Success rates here are worryingly low, around 50%. Don\'t take it just because it sounds easy.' },
      { type: 'subheading', value: 'Rongai Route' },
      { type: 'text', value: 'The only approach to Kilimanjaro from the north. Quiet, drier, a completely different landscape. Good choice during the rainy season because the northern side gets less rain. If your schedule forces you to climb in November or April, this is worth considering.' },
      { type: 'subheading', value: 'Northern Circuit' },
      { type: 'text', value: 'The longest route at nine days. The quietest, least crowded, and highest success rates on the whole mountain. The only downside: most expensive and most time-consuming.' },
      { type: 'text', value: 'One important piece of advice: don\'t be tempted to save a day. Every extra day on the mountain is a significantly better chance of reaching the summit. The money you save on a shorter route will be forgotten. The memory of turning back at 4500 m without reaching the summit will not.' },
      { type: 'callout', title: 'How we do it at HighAir', value: 'Our Kilimanjaro expeditions run only on eight to nine-day routes, in groups of up to 10 climbers, with a guide-to-climber ratio of 1:4. We\'re full members of KPAP, meaning our porter employment standards meet the highest ethical benchmarks. Our summit success rate: above 95%.' },
      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', alt: 'Kilimanjaro Machame route', caption: 'Views from the western approach to the summit' },

      { type: 'section', value: 'When to climb Kilimanjaro' },
      { type: 'text', value: 'Kilimanjaro has two main climbing seasons: January to March, and June to October.' },
      { type: 'text', value: 'January to March is the warmer period. Clear days, less bitter nights, fewer people on the mountain. The downside: higher chance of snow at the summit, and rain can arrive toward the end of March.' },
      { type: 'text', value: 'June to October is the main dry season. August and September are peak, with everyone on their summer break. The mountain gets busy. Clean views, stable weather, good chance of seeing the glaciers without cloud cover.' },
      { type: 'text', value: 'April-May and November are the rainy seasons. Muddy trails, low visibility, slip risk. Most operators run trips then and there are advantages (fewer people, lower prices), but it\'s not the right choice for a first climb.' },
      { type: 'text', value: 'A full-moon night is a bonus that\'s hard to describe. The summit push is done at night, and on a full moon the entire mountain is lit silver. Worth planning around if you can. Our expedition calendar is synced to full-moon dates.' },

      { type: 'section', value: 'Physical preparation for Kilimanjaro' },
      { type: 'text', value: 'There\'s a myth that you need to be an athlete to climb Kilimanjaro. It\'s not true. I\'ve seen 65-year-olds reach the summit and 30-year-old triathletes turn back at 4800 m with altitude sickness. Fitness helps but doesn\'t guarantee anything.' },
      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', alt: 'Training for Kilimanjaro', caption: '' },
      { type: 'text', value: 'What works: walking. Lots of walking. Walking with a pack on your back. Walking up and down hills. Four months before departure, start doing one long outing per week, at least six hours, ideally with elevation gain. If you live near a mountain, great. If not, stairs in a tall building is a reasonable substitute.' },
      { type: 'text', value: 'Add two or three cardio sessions mid-week. Running, cycling, rowing - whatever works for you. The goal is a strong heart, not big muscles. Big muscles consume more oxygen, which actually makes things harder at altitude.' },
      { type: 'text', value: 'One specific exercise I strongly recommend: carry weight. Even though porters carry the heavy gear, you\'ll be carrying 6-8 kg of water, jacket, and snacks every day. Train with that.' },
      { type: 'text', value: 'One month before departure, stop loading up. Enough. Your body needs to arrive rested.' },

      { type: 'section', value: 'Kilimanjaro gear list' },
      { type: 'text', value: 'This is where people waste the most money. Here\'s the honest version of what you actually need.' },
      { type: 'subheading', value: 'Footwear' },
      { type: 'text', value: 'A pair of hiking boots you\'ve already walked at least 50 km in. New boots on Kilimanjaro is a recipe for a bad time. Merino wool socks, not cotton, never cotton.' },
      { type: 'subheading', value: 'Layering' },
      { type: 'text', value: 'The layer system is everything. Long merino base layer. Fleece mid-layer. Down outer for the summit. Hard-shell for rain and wind. For the lower body: regular trekking trousers, thermal trousers for summit night, wind-resistant outer shell.' },
      { type: 'subheading', value: 'Gloves' },
      { type: 'text', value: 'Two pairs. One lightweight for the regular days, one serious heavyweight for summit night. Your hands will freeze on summit night. There\'s no way around this.' },
      { type: 'subheading', value: 'Head and eyes' },
      { type: 'text', value: 'Wool hat, sun hat (equatorial sun is unforgiving), neck gaiter. Quality sunglasses, category 4 recommended for the summit.' },
      { type: 'subheading', value: 'Sleeping bag' },
      { type: 'text', value: 'At minimum rated to -10°C, ideally -15°C. Don\'t skimp here. Poor sleep on the mountain means poor acclimatisation.' },
      { type: 'subheading', value: 'Other essentials' },
      { type: 'text', value: 'SPF 50 sunscreen, lip balm with protection, headlamp with spare batteries that won\'t freeze, trekking poles, water bottles with a combined capacity of at least three litres.' },
      { type: 'text', value: 'Most operators in Arusha rent heavy gear like sleeping bags and down jackets at reasonable prices. If you\'re climbing once in your life, renting is far smarter than buying.' },
      { type: 'image', src: '/images/blog/kilimanjaro-porters.webp', alt: 'Kilimanjaro porters', caption: 'Porters are the heart of every Kilimanjaro expedition' },

      { type: 'section', value: 'Altitude sickness on Kilimanjaro: the part that decides everything' },
      { type: 'text', value: 'Here\'s the biggest secret about Kilimanjaro: most people who don\'t reach the summit don\'t fail because of fitness. They fail because of altitude.' },
      { type: 'text', value: 'Acute mountain sickness (AMS) typically starts around 3000 m. Headache, nausea, loss of appetite, difficulty sleeping. In most cases it passes with time and a temporary descent. But it can worsen into HACE (cerebral oedema) or HAPE (pulmonary oedema), and both of those kill people on Kilimanjaro every year.' },
      { type: 'text', value: 'How do you deal with it? Mainly by climbing slowly. The "pole pole" your guides repeat is not a joke. Anyone tempted to push the pace at 3500 m will find themselves in trouble at 4500. Drink plenty of water - four litres a day minimum. Eat even when you have no appetite. Focus on carbohydrates.' },
      { type: 'text', value: 'Diamox (acetazolamide) is a medication that helps with acclimatisation. Most operators will give it to you; some climbers start three days before the ascent. Talk to a doctor before departure.' },
      { type: 'text', value: 'The most important rule: if your guide says you\'re descending, you\'re descending. There\'s nothing to argue about. I\'ve seen climbers insist on pushing forward with clear HAPE signs. I wouldn\'t wish on anyone what happens next.' },

      { type: 'section', value: 'A day on the mountain: what to expect' },
      { type: 'text', value: 'A typical day on Machame or Lemosho looks like this: 6:30 am, someone wakes you with tea and hot water to your tent. 7:00 am, breakfast in the mess tent - omelette, pancakes, fruit, instant coffee. 8:00 am, you start walking. 4-7 hours of hiking depending on the day, with a lunch break roughly in the middle. 2:00-4:00 pm, you reach the next camp. Tea with popcorn (that\'s just how it is on Kilimanjaro, don\'t ask), rest, maybe a short acclimatisation walk.' },
      { type: 'text', value: '7:00 pm, dinner - usually soup, pasta or rice with meat, fruit. 8:30 pm, everyone is in their sleeping bags. Cold night. Very cold night.' },
      { type: 'image', src: '/images/blog/kilimanjaro-camp.avif', alt: 'Camp on Kilimanjaro', caption: 'Evening at camp - after a day\'s walk' },
      { type: 'text', value: 'Summit night is a different matter entirely. You leave at midnight from Kilimanjaro Base Camp at Barafu or Kosovo, depending on the route. 1200 metres of ascent over 7-8 hours, in temperatures of minus 15 to minus 25, in total darkness. You walk slowly, breathe deeply, look at the stars, try not to think about how far the summit still is. Sunrise usually catches you somewhere near Stella Point. When the light starts cutting through the glaciers - that\'s the moment. Then one more hour and you\'re there.' },
      { type: 'text', value: 'The descent takes about half the time and twice the toll on your knees. They will protest loudly. This is normal.' },

      { type: 'section', value: 'What Kilimanjaro actually costs' },
      { type: 'text', value: 'The price range for Kilimanjaro is wide, and there are good reasons for that. A $1500 operator and a $3500 operator are not the same thing.' },
      { type: 'subheading', value: 'What\'s included in a good price' },
      { type: 'list', items: [
        'Park fees (already around $1000 by themselves)',
        'Good food throughout the climb',
        'Proper, maintained equipment',
        'Fair porter treatment - no more than 20 kg per porter',
        'Certified guides with genuine experience',
        'Rescue insurance',
      ]},
      { type: 'subheading', value: 'What\'s usually not included' },
      { type: 'list', items: [
        'International flights',
        'Tanzania visa ($50-100)',
        'Crew tips ($200-300 is the standard)',
        'Personal gear you rent',
      ]},
      { type: 'text', value: 'If you see a $1200 offer, ask where the savings are. It\'s usually porter wages. These are people doing physically brutal work in harsh conditions for your climb. Make sure your operator is a KPAP member - the organisation that monitors fair employment on Kilimanjaro.' },

      { type: 'section', value: 'Frequently asked questions' },
      { type: 'heading', value: 'How many days does it take to climb Kilimanjaro?' },
      { type: 'text', value: 'Depends on the route. Marangu is 5-6 days, Machame 6-7, Lemosho 7-8, and Northern Circuit 9 days. We recommend routes of 8 days or more to allow for proper acclimatisation.' },
      { type: 'heading', value: 'What are the summit success rates on Kilimanjaro?' },
      { type: 'text', value: 'The overall mountain average is around 65%. On short routes like Marangu, it drops to 50%. On longer routes like Lemosho and Northern Circuit with a quality operator, rates reach 90% and above. At HighAir, our success rate is above 95%.' },
      { type: 'heading', value: 'Do you need a medical clearance?' },
      { type: 'text', value: 'Recommended. We require medical clearance for climbers over 55 or with a history of heart or lung problems. A check-up with your GP before the expedition is a good idea for everyone.' },
      { type: 'heading', value: 'Can pregnant women climb?' },
      { type: 'text', value: 'We don\'t recommend it. The physical exertion, extreme altitude, and distance from medical care make it an unfair risk.' },
      { type: 'heading', value: 'What\'s the minimum age for Kilimanjaro?' },
      { type: 'text', value: 'The national park requires at least 10 years old. We recommend 14 and above for a realistic experience, and a parent or guardian must accompany climbers under 16.' },
      { type: 'heading', value: 'Do I need a visa for Tanzania?' },
      { type: 'text', value: 'Yes. Israeli citizens need a Tanzania visa - valid for 90 days. We always recommend applying online in advance through the official Tanzanian government portal, so you don\'t end up stuck in an airport queue with a full kit bag. Cost: around $50. A passport valid for at least 6 months beyond entry and certain vaccinations (particularly hepatitis and malaria prevention) are required.' },
      { type: 'heading', value: 'What insurance do I need for Kilimanjaro?' },
      { type: 'text', value: 'Insurance covering altitude up to 6000 m and helicopter rescue. Standard travel insurance usually doesn\'t cover this. We help our climbers arrange appropriate coverage as part of our pre-expedition support.' },

      { type: 'cta', text: 'לצפייה במשלחות הקילימנג׳רו שלנו', textEn: 'View our Kilimanjaro expeditions', href: '/expedition/kilimanjaro' },

      { type: 'text', value: 'Kilimanjaro isn\'t just a mountain you climb. It\'s an expedition that starts the day you decide, and ends years later every time someone asks about the stamp in your passport.' },
      { type: 'text', value: 'One last thing. Don\'t take yourself too seriously up there. Enjoy the strange food, the porters singing in the mornings, the guides\' terrible jokes. Take fewer photos, look more. Those glaciers probably won\'t be there in 30 years.' },
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
      { type: 'text',    value: 'לא על כולן. קילימנג\'רו  -  ללא מדריך מקומי אי אפשר על פי חוק, ומסיבה טובה: זה מקור הכנסה מרכזי לאנשי המקום. האוורסט דורש אישור מהממשלה הנפאלית  -  ב-2023 הונפקו רק 500 אישורים, כל אחד עולה 15000 דולר. וינסון  -  אפשר לארגן רק דרך Antarctic Logistics & Expeditions LLC.' },

      { type: 'heading', value: 'איך להתכונן לאתגר?' },
      { type: 'text',    value: 'תלוי בכושר ובניסיון. כושר ממוצע? מתחילים בהכנה גופנית  -  ריצת שטח, שחייה, הליכה עם תיק. כושר טוב? אפשר להתחיל לטפס כבר השנה. עובדים עם חברות טרקים בארץ, מטפסים פסגות קרובות, צוברים ניסיון  -  ואז יוצאים לקילימנג\'רו.' },

      { type: 'heading', value: 'כמה זה אמור לעלות?' },
      { type: 'text',    value: 'האפשרות הזולה ביותר עדיין תעלה לא פחות מ-120000 דולר לכל הפרויקט. האוורסט הוא הגדול בתקציב  -  בין 36000 ל-200000 דולר, תלוי באיך מארגנים. תוכנית אפשרית: יוני  -  קילימנג\'רו, אוגוסט  -  אלברוס, דצמבר-פברואר  -  אקונקגואה ווינסון, אביב  -  אוורסט, וסתיו הבא  -  פירמידת קרסטנסז ודנאלי.' },

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
      { type: 'text',    value: 'The Seven Summits are the highest peaks on each of the world\'s seven continents: Everest in Asia (8848 m), Aconcagua in South America (6962 m), Denali in North America (6190 m), Kilimanjaro in Africa (5895 m), Elbrus in Europe (5642 m), Vinson Massif in Antarctica (4892 m), and Carstensz Pyramid in Oceania (4884 m). Completing all seven is one of the most recognised goals in mountaineering  -  and for most people who pursue it, it takes years.' },
      { type: 'text',    value: 'This guide covers the difficulty of each mountain, which one is the logical starting point, world records, the debate over the official list, and what the whole thing actually costs.' },

      { type: 'heading', value: 'What is the Seven Summits Club?' },
      { type: 'text',    value: 'An informal community of climbers united by one goal: the highest point on each continent. No official membership, no governing body. Just people who\'ve done it  -  or are working toward it.' },
      { type: 'text',    value: 'For most people in this community, the mountains are more than a physical challenge. They\'re a series of distinct cultural experiences, each with its own logistics, conditions, and demands. The shared difficulty creates lasting connections between people who\'ve climbed together.' },
      { type: 'text',    value: 'Most people start with Kilimanjaro. It requires no technical skills, the infrastructure is good, and it gives you a real first taste of high-altitude trekking  -  the kind that either hooks you or tells you something important about yourself.' },

      { type: 'image',   src: '/images/blog/seven-summits-everest.webp', caption: 'Everest and Nuptse  -  Photo: Alon Peleg' },

      { type: 'heading', value: 'The seven (or eight) summits' },
      { type: 'list',    items: [
        'Everest (Asia)  -  8848 m',
        'Aconcagua (South America)  -  6962 m',
        'Denali (North America)  -  6190 m',
        'Kilimanjaro (Africa)  -  5895 m',
        'Elbrus (Europe)  -  5642 m',
        'Vinson Massif (Antarctica)  -  4892 m',
        'Carstensz Pyramid (Oceania)  -  4884 m',
        'Kosciuszko (Australia)  -  2228 m',
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
      { type: 'text',    value: 'Everest alone can take two months and cost $60000–$75000. Not everyone has the resources.' },
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
      { type: 'text',    value: 'Everest, without question. Extreme altitude, a short and competitive climbing season, extensive preparation requirements, and costs that can exceed $75000. Turning a summit attempt into an actual summit is an enormous undertaking for even experienced climbers.' },
      { type: 'image',   src: '/images/blog/everest-hardest.webp', alt: 'Climbers on Everest', caption: '' },

      { type: 'heading', value: 'What order should you climb them in?' },
      { type: 'text',    value: 'Start with Kilimanjaro. It needs no technical skills, Tanzania is a genuinely interesting destination, and you can combine it with a safari and time in Zanzibar. From there, Elbrus makes sense, then Aconcagua  -  a meaningful test before Everest. Vinson, Denali, and Carstensz Pyramid can fall in any order based on your logistics and visa situation. All three are expensive, though far less so than Everest. Denali is the most technically demanding of the three, so save it for when you have real mountaineering experience.' },

      { type: 'heading', value: 'What fitness level do you need?' },
      { type: 'text',    value: 'Solid fitness is important, but there are no standard benchmarks. No medical board certifies you as "fit for Everest." What matters is building a training base that includes climbing at various altitudes and in varied conditions  -  then progressing through the list systematically.' },

      { type: 'heading', value: 'Can you climb solo?' },
      { type: 'text',    value: 'Not all of them. Kilimanjaro requires a licensed local guide by law  -  a rule that makes good sense and provides income for local communities. Everest solo permits are rare (500 issued in 2023) and cost $15000. Vinson Massif can only be organised through Antarctic Logistics & Expeditions LLC.' },

      { type: 'heading', value: 'How do you prepare?' },
      { type: 'text',    value: 'Start where you are. Average fitness? Begin with general conditioning  -  trail running, swimming, hiking. Good fitness already? You can probably start on Kilimanjaro this year. Work with a trekking company, climb locally, build altitude experience progressively. Don\'t skip steps.' },

      { type: 'heading', value: 'What does the full project cost?' },
      { type: 'text',    value: 'Budget at least $120000 for the most economical approach to all seven. Everest dominates the budget at $36000–$200000 depending on how you organise it. A realistic multi-year plan: June  -  Kilimanjaro, August  -  Elbrus, December–February  -  Aconcagua and Vinson, Spring  -  Everest. Then Carstensz Pyramid and Denali in the following seasons.' },

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
      { type: 'text',    value: 'The next level: all 14 mountains above 8000 metres. Harder, more dangerous, and financially brutal. Only elite climbers attempt this, and fewer than 50 people have ever finished it.' },
      { type: 'list',    noMarker: true, items: [
        '1. Everest (Nepal)  -  8848 m',
        '2. K2 (Pakistan)  -  8611 m',
        '3. Kangchenjunga (Nepal)  -  8586 m',
        '4. Lhotse (Nepal)  -  8516 m',
        '5. Makalu (Nepal)  -  8485 m',
        '6. Cho Oyu (Nepal)  -  8188 m',
        '7. Dhaulagiri (Nepal)  -  8167 m',
        '8. Manaslu (Nepal)  -  8156 m',
        '9. Nanga Parbat (Pakistan)  -  8125 m',
        '10. Annapurna (Nepal)  -  8091 m',
        '11. Gasherbrum I (Pakistan)  -  8080 m',
        '12. Broad Peak (Pakistan)  -  8051 m',
        '13. Gasherbrum II (Pakistan)  -  8035 m',
        '14. Shishapangma (China)  -  8027 m',
      ]},
      { type: 'text',    value: 'The speed record belongs to Norwegian climber Kristin Harila and Sherpa Tenjen Lama from Nepal: 92 days to complete all 14, breaking the previous record of Nirmal Purja (Nimsdai). About 50 people have ever completed the full list.' },
      { type: 'image',   src: '/images/blog/kristin-harila.webp', alt: 'Kristin Harila  -  one of the most accomplished high-altitude climbers active today', caption: 'Kristin Harila  -  one of the most accomplished high-altitude climbers active today', objectPosition: 'top' },
    ],
  },
];

export const CATEGORIES    = [...new Set(POSTS.map(p => p.category))];
export const CATEGORIES_EN = [...new Set(POSTS.map(p => p.categoryEn || p.category))];
