/**
 * faqData.js - the single source for the "שאלות נפוצות" (FAQ) shown on every
 * expedition page (ExpeditionDetail reads it by slug; the FAQPage JSON-LD and the
 * visible accordion both come from here). Written to read like a real guide
 * answering a real traveller - warm, specific, keyword-rich for SEO/GEO - while
 * every fact (heights, days, success rates, seasons, prices) stays exact.
 *
 * He and En are kept as a translation pair. A destination without an entry here
 * falls back to makeDefaultFaq() below.
 */

export const FAQ_BY_SLUG = {
  /* ── Kilimanjaro ── */
  'kilimanjaro': {
    he: [
      { q: 'כמה קשה לטפס על קילימנג׳רו?', a: 'קילימנג׳רו (5,895 מ׳) הוא ההר הגבוה הנגיש בעולם - לא צריך ניסיון טיפוס טכני, חבלים או קרמפונים. מי שבכושר סביר ומסוגל ללכת כשמונה שעות ביום יכול לעמוד על הפסגה. האתגר האמיתי הוא הגובה והקור בלילה שלפני הפסגה, ובדיוק בשביל זה בנוי הלו״ז שלנו סביב התאקלמות נכונה.' },
      { q: 'מה שיעור ההצלחה שלכם בקילימנג׳רו?', a: 'שיעור ההצלחה שלנו הוא 94%, מהגבוהים בענף. הוא נובע מבחירה במסלול מאצ׳מה על פני 7 ימים, שנותן לגוף זמן להתאקלם בהדרגה, וממדריכים מקומיים מנוסים שמכירים כל קטע בהר ויודעים מתי להאיץ ומתי לתת מנוחה.' },
      { q: 'איך מתכוננים לטיפוס על קילימנג׳רו?', a: 'ההכנה הכי חשובה היא אירובית: הליכות ארוכות, ריצה קלה או אופניים לאורך כשלושה חודשים לפני היציאה. לקבוצה שלנו יש גם מפגש הכנה על הציוד וטרק הכנה חד-יומי בארץ, כדי שתגיעו להר מוכנים ומכירים אחד את השני.' },
      { q: 'מה גיל המינימום לטיפוס על קילימנג׳רו?', a: 'גיל המינימום הוא 10. אין גיל מקסימום - יצאו איתנו מטפסים בני 60 ומעלה שעמדו על הפסגה. מה שקובע הוא הכושר הגופני והבריאות, לא המספר בתעודת הזהות.' },
      { q: 'האם כדאי לצרף ספארי לטיפוס בקילימנג׳רו?', a: 'בהחלט. שלושה ימי ספארי בטרנגירי ובמכתש נגורונגורו, שתיים מהשמורות המרהיבות באפריקה, מתווספים למסע בתוספת מחיר סבירה. אחרי שבוע מאמץ על ההר, הספארי הוא הפרס המושלם.' },
      { q: 'מתי העונה הטובה לטפס על קילימנג׳רו?', a: 'שתי עונות מועדפות: ינואר-פברואר ויוני-אוקטובר. בחודשים האלה הגשם מועט ומזג האוויר יציב יותר. את נובמבר ואפריל, חודשי הגשמים הכבדים, עדיף להימנע - ואנחנו מוציאים את הקבוצות בדיוק בחלונות הטובים.' },
    ],
    en: [
      { q: 'How hard is it to climb Kilimanjaro?', a: 'Kilimanjaro (5,895 m) is the most accessible high mountain in the world - no technical climbing experience, ropes or crampons needed. Anyone in reasonable shape who can walk about eight hours a day can reach the summit. The real challenge is the altitude and the cold on summit night, which is exactly why our itinerary is built around proper acclimatization.' },
      { q: 'What is your Kilimanjaro success rate?', a: 'Our summit success rate is 94%, one of the highest in the industry. It comes from choosing the scenic Machame Route over 7 days, which gives the body time to acclimatize gradually, and from experienced local guides who know every stretch of the mountain and when to push and when to rest.' },
      { q: 'How do I prepare for climbing Kilimanjaro?', a: 'The most important preparation is aerobic: long hikes, light running or cycling over about three months before departure. Our group also gets a gear briefing and a one-day preparation trek in Israel, so you reach the mountain ready and already knowing each other.' },
      { q: 'What is the minimum age for Kilimanjaro?', a: 'The minimum age is 10. There is no maximum - climbers in their 60s and beyond have summited with us. What matters is fitness and health, not the number on your ID.' },
      { q: 'Is it worth adding a safari to a Kilimanjaro climb?', a: 'Absolutely. Three safari days in Tarangire and the Ngorongoro Crater, two of Africa\'s most spectacular reserves, can be added for a reasonable extra cost. After a hard week on the mountain, the safari is the perfect reward.' },
      { q: 'When is the best season to climb Kilimanjaro?', a: 'Two preferred seasons: January-February and June-October. In these months rain is light and the weather more stable. It is best to avoid November and April, the heavy rain months - and we run our groups precisely in the good windows.' },
    ],
  },

  /* ── Aconcagua ── */
  'aconcagua': {
    he: [
      { q: 'כמה אקונקגואה קשה לעומת קילימנג׳רו?', a: 'אקונקגואה קשה משמעותית. זו הפסגה הגבוהה מחוץ לאסיה (6,961 מ׳) והמסע נמשך 20 יום - הגובה גדול יותר, הקור חריף יותר, וצריך לשאת ציוד כבד עד מחנה 2. ניסיון קודם בגובה, כמו קילימנג׳רו או טרק אוורסט בייס קמפ, ממש מומלץ לפני שיוצאים.' },
      { q: 'מה עלות ההיתר לאקונקגואה?', a: 'היתר הכניסה לפארק הלאומי אקונקגואה עולה בין 800 ל-1,000 דולר, לפי עונת הטיפוס. הוא אינו כלול במחיר ומשולם ישירות לרשות הפארק, ואנחנו מלווים אתכם ברכישה ובכל הניירת הנדרשת.' },
      { q: 'האם נדרש ניסיון טיפוס טכני לאקונקגואה?', a: 'לא. מסלול הנורמל, שבו אנחנו עולים, הוא מסלול הליכה ולא טיפוס טכני - בלי חבלים וללא קרמפונים (אלא אם יורד שלג). עם זאת, הגובה הרב והקור הקיצוני דורשים ניסיון קודם בגובה וציוד חם ואיכותי.' },
      { q: 'מתי עונת הטיפוס על אקונקגואה?', a: 'העונה היא דצמבר עד פברואר, קיץ חצי הכדור הדרומי, ואז ניתן לטפס בתנאים הבטוחים ביותר. מחוץ לחלון הזה ההר נסגר רשמית. אנחנו יוצאים פעם בשנה, בינואר, בלב העונה.' },
      { q: 'מה שיעור ההצלחה באקונקגואה?', a: 'שיעור ההצלחה הכללי על אקונקגואה עומד על כ-40% בלבד; אצלנו הוא 75%, הרבה מעל הממוצע. הסוד הוא לו״ז התאקלמות מוקפד, מדריך שמכיר את ההר לעומק, ובחירה נכונה של מי יוצא ליום הפסגה.' },
    ],
    en: [
      { q: 'How hard is Aconcagua compared to Kilimanjaro?', a: 'Aconcagua is significantly harder. It is the highest peak outside Asia (6,961 m) and the expedition runs 20 days - the altitude is higher, the cold sharper, and you carry heavy gear up to Camp 2. Prior altitude experience, such as Kilimanjaro or the Everest Base Camp trek, is strongly recommended before you go.' },
      { q: 'How much is the Aconcagua permit?', a: 'The Aconcagua National Park entry permit costs between $800 and $1,000 depending on the climbing season. It is not included in the price and is paid directly to the park authority; we guide you through the purchase and all the required paperwork.' },
      { q: 'Do I need technical climbing experience for Aconcagua?', a: 'No. The Normal Route, which we climb, is a walking route rather than a technical climb - no ropes and no crampons (unless it snows). That said, the high altitude and extreme cold demand prior altitude experience and quality warm gear.' },
      { q: 'When is the Aconcagua climbing season?', a: 'The season is December to February, the southern-hemisphere summer, when the peak can be climbed in the safest conditions. Outside that window the mountain is officially closed. We run one expedition a year, in January, at the heart of the season.' },
      { q: 'What is the success rate on Aconcagua?', a: 'The overall success rate on Aconcagua is only about 40%; ours is 75%, well above average. The secret is a carefully paced acclimatization schedule, a guide who knows the mountain intimately, and choosing the right climbers for summit day.' },
    ],
  },

  /* ── Elbrus ── */
  'elbrus': {
    he: [
      { q: 'האם אלברוס קשה יותר מקילימנג׳רו?', a: 'אלברוס קשה יותר טכנית. בגובה דומה (5,642 מ׳) הוא דורש הליכה עם קרמפונים ומקל קרח, הקור חריף יותר ויש סיכון לסופות פתאומיות. שיעור ההצלחה שלנו הוא 85%, לעומת 94% בקילימנג׳רו. ההמלצה: אם זו הפסגה הגבוהה הראשונה שלכם, התחילו בקילימנג׳רו.' },
      { q: 'האם נדרש ניסיון לטיפוס על אלברוס?', a: 'נדרש ניסיון בסיסי בהליכה בשלג ובקרמפונים, אבל לא טיפוס טכני. ביום הראשון בבייס קמפ אנחנו עושים תרגול קרמפונים ואימון על שיפועי השלג, ומי שכבר היה בגובה - למשל קילימנג׳רו - מגיע עם יתרון גופני ומנטלי.' },
      { q: 'כמה קר בפסגת אלברוס?', a: 'בלילה שלפני הפסגה הטמפרטורה יורדת בדרך כלל ל-15° עד 25° מתחת לאפס, ועם רוח הקור זה יכול להרגיש כמו 35°- . לכן חובה כפפות חמות, שכבות תרמיות, מסכת פנים (באלקלבה) ומשקפי סקי טובים. רשימת ציוד מלאה נשלחת לכל נרשם.' },
      { q: 'מה מצב הכניסה לרוסיה לישראלים?', a: 'נכון להיום, ישראלים נדרשים לאשרת כניסה לרוסיה. אנחנו מסייעים בהגשת הוויזה ומספקים את כל המסמכים הנדרשים - כדאי לפנות אלינו לעדכון המדויק לגבי המצב בזמן היציאה שלכם.' },
      { q: 'איזה ציוד טכני מקבלים מכם?', a: 'אנחנו מספקים לכל המשתתפים קרמפונים, מקל קרח ורתמה בהשאלה, ללא עלות נוספת - אין צורך לרכוש ציוד טיפוס יקר. כל מה שצריך להביא הוא ציוד חם בסיסי, נעלי הרים עם סוליה נוקשה וציוד שינה מתאים לגובה.' },
    ],
    en: [
      { q: 'Is Elbrus harder than Kilimanjaro?', a: 'Elbrus is more technical. At a similar height (5,642 m) it requires walking on crampons with an ice axe, the cold is harsher, and sudden storms are a risk. Our summit success rate is 85%, versus 94% on Kilimanjaro. Our recommendation: if this is your first high peak, start with Kilimanjaro.' },
      { q: 'Do I need experience to climb Elbrus?', a: 'You need basic experience walking on snow and in crampons, but not technical climbing. On the first day at base camp we run crampon practice and training on the snow slopes, and anyone who has already been to altitude - Kilimanjaro, for example - arrives with a physical and mental advantage.' },
      { q: 'How cold is the Elbrus summit?', a: 'On summit night the temperature usually drops to between -15° and -25°C, and with wind chill it can feel like -35°C. That makes warm gloves, thermal layers, a face mask (balaclava) and good ski goggles essential. A full gear list is sent to every registrant.' },
      { q: 'What is the entry situation to Russia for Israelis?', a: 'As of now, Israelis need an entry visa to Russia. We help with the visa application and provide all the required documents - it is worth contacting us for the exact status around your departure date.' },
      { q: 'What technical gear do you provide?', a: 'We provide every participant with crampons, an ice axe and a harness on loan, at no extra cost - there is no need to buy expensive climbing gear. All you need to bring is basic warm clothing, mountain boots with a stiff sole, and a sleeping setup suited to altitude.' },
    ],
  },

  /* ── Everest Base Camp & Gokyo ── */
  'everest-base-camp': {
    he: [
      { q: 'לאיזה גובה מגיעים בטרק אוורסט בייס קמפ?', a: 'הנקודה הגבוהה בטרק היא קאלה פטאר (5,545 מ׳), שממנה נשקפת פנורמה מרהיבה של פסגת אוורסט; בייס קמפ עצמו יושב על 5,364 מ׳. אלה הגבהים שמאתגרים את הגוף בהתאקלמות, ולכן הלו״ז שלנו בנוי בקפידה עם ימי מנוחה.' },
      { q: 'האם מחלת גובה היא סיכון אמיתי בטרק?', a: 'מחלת גובה היא האתגר המרכזי בטרק לאוורסט בייס קמפ - כשליש מהמטיילים חשים תסמינים קלים כמו כאב ראש ועייפות. לכן אנחנו מקדישים 19 יום למסע, עם ימי התאקלמות בנאמצ׳ה בזאר ובדינגבוצ׳ה. שתייה מרובה, עלייה הדרגתית ותשומת לב לתסמינים הם המפתח.' },
      { q: 'מה רמת הכושר הנדרשת לטרק EBC?', a: 'צריך כושר גופני טוב, אבל לא של ספורטאי מקצועי. המפתח הוא היכולת ללכת 5-7 שעות ביום עם תרמיל גב, יום אחרי יום, לאורך שבועיים. ההכנה הטובה ביותר היא הליכות ארוכות עם תיק בחודשים שלפני - הקושי מצטבר, לא טכני.' },
      { q: 'האם רואים את פסגת אוורסט מהבייס קמפ?', a: 'דווקא לא - מהבייס קמפ עצמו הקרחון חוסם את הנוף לפסגה. הנקודה הטובה ביותר לצפות באוורסט היא קאלה פטאר (5,545 מ׳), ומשם הנוף לאוורסט, ללהוצה ולנופצה הוא מהמרהיבים בעולם.' },
      { q: 'מתי העונה הטובה לטרק בנפאל?', a: 'שתי עונות מצוינות: אפריל-מאי לפני המונסון, ואוקטובר-נובמבר אחריו. בשתיהן השמיים בהירים, הנופים עוצרי נשימה ומזג האוויר נוח יחסית - ואנחנו מכוונים בדיוק אליהן. את חודשי המונסון (יוני-ספטמבר) עדיף להימנע.' },
      { q: 'האם הטרק לאוורסט בייס קמפ מתאים למתחילים?', a: 'כן, אם מגיעים מוכנים. זה טרק ולא טיפוס טכני - אין חבלים, קרמפונים או גרזן קרח. מה שנדרש הוא סיבולת לב-ריאה, הכנה נפשית לגובה וציוד מתאים. מטיילים רבים בלי ניסיון קודם עשו אותו בהצלחה איתנו.' },
    ],
    en: [
      { q: 'How high do you go on the Everest Base Camp trek?', a: 'The highest point on the trek is Kala Patthar (5,545 m), which offers a stunning panorama of Everest; Base Camp itself sits at 5,364 m. These are the heights that challenge the body\'s acclimatization, which is why our itinerary is built carefully with rest days.' },
      { q: 'Is altitude sickness a real risk on the trek?', a: 'Altitude sickness is the main challenge on the Everest Base Camp trek - about a third of trekkers feel mild symptoms such as headache and fatigue. That is why we dedicate 19 days to the journey, with acclimatization days in Namche Bazaar and Dingboche. Drinking plenty, ascending gradually and watching for symptoms are the keys.' },
      { q: 'What fitness level does the EBC trek require?', a: 'You need good fitness, but not that of a professional athlete. The key is being able to walk 5-7 hours a day with a daypack, day after day, over two weeks. The best preparation is long hikes with a pack in the months before - the difficulty is cumulative, not technical.' },
      { q: 'Can you see the summit of Everest from Base Camp?', a: 'Actually no - from Base Camp itself the glacier blocks the view of the summit. The best place to see Everest is Kala Patthar (5,545 m), from where the view of Everest, Lhotse and Nuptse is among the most spectacular in the world.' },
      { q: 'When is the best season to trek in Nepal?', a: 'Two excellent seasons: April-May before the monsoon, and October-November after it. In both the skies are clear, the scenery breathtaking and the weather relatively comfortable - and we aim for exactly those. It is best to avoid the monsoon months (June-September).' },
      { q: 'Is the Everest Base Camp trek suitable for beginners?', a: 'Yes, if you come prepared. It is a trek, not a technical climb - no ropes, crampons or ice axe. What it takes is cardiovascular endurance, mental readiness for altitude and the right gear. Many trekkers with no prior experience have completed it successfully with us.' },
    ],
  },

  /* ── Annapurna Circuit ── */
  'annapurna': {
    he: [
      { q: 'מה ההבדל בין טרק סובב אנאפורנה לטרק אוורסט בייס קמפ?', a: 'סובב אנאפורנה מגוון יותר מבחינה נופית ותרבותית - הוא חוצה כפרים בסגנונות שונים, יערות ומעברים, בעוד שאוורסט בייס קמפ ממוקד יותר באתגר הגובה ובתחושת ״לב ההימלאיה״. אנאפורנה מושלם למי שרוצה את החוויה המלאה של נפאל; EBC למי שהגובה הוא המטרה.' },
      { q: 'מה הגובה המקסימלי בסובב אנאפורנה?', a: 'הנקודה הגבוהה היא מעבר תורונג לה (5,416 מ׳), אחד ממעברי ההרים הגבוהים בעולם שחוצים ברגל. העלייה אליו לפני עלות השחר, אל נוף הזריחה מעל ענני נפאל, היא שיא הטרק וחוויה שנשארת.' },
      { q: 'הטרק בכיוון השעון או נגדו?', a: 'אנחנו עושים את הסובב בכיוון השעון, מבסיסי עד ג׳ומסום. כך העלייה למעבר תורונג לה הדרגתית ומאפשרת התאקלמות טובה יותר, ובנוסף מסיימים בצד של פוקרה - מה שחוסך ימי הליכה מיותרים.' },
      { q: 'האם נדרש ניסיון לטרק סובב אנאפורנה?', a: 'לא נדרש ניסיון טיפוס. מי שמסוגל ללכת 6-8 שעות ביום ומגיע בכושר סביר יכול לסיים את הטרק. הקושי המרכזי הוא מעבר תורונג לה, שדורש יציאה בחשיכה ועלייה ממושכת - והמדריכים שלנו מכינים אתכם אליו לאורך כל הדרך.' },
      { q: 'מה כלול בטרק סובב אנאפורנה ומה לא?', a: 'כלול: העברות, לינה בלודג׳ים, שלוש ארוחות ביום, מדריך והיתרי הכניסה לאזור. לא כלול: טיסות בינלאומיות, ביטוח נסיעות, ויזה לנפאל (25-30 דולר) וציוד אישי. רשימת ציוד מפורטת נשלחת לאחר ההרשמה.' },
    ],
    en: [
      { q: 'What is the difference between the Annapurna Circuit and the Everest Base Camp trek?', a: 'The Annapurna Circuit is more varied in scenery and culture - it crosses villages of different styles, forests and passes, while Everest Base Camp is more focused on the altitude challenge and the "heart of the Himalayas" feeling. Annapurna is perfect for the full Nepal experience; EBC for when altitude is the goal.' },
      { q: 'What is the highest point on the Annapurna Circuit?', a: 'The highest point is the Thorong La Pass (5,416 m), one of the highest mountain passes in the world crossed on foot. The pre-dawn ascent to it, into a sunrise view above the clouds of Nepal, is the highlight of the trek and an experience that stays with you.' },
      { q: 'Is the trek clockwise or counter-clockwise?', a: 'We walk the circuit clockwise, from Besisahar to Jomsom. This makes the ascent to the Thorong La Pass gradual and allows better acclimatization, and we also finish on the Pokhara side - which saves unnecessary walking days.' },
      { q: 'Do I need experience for the Annapurna Circuit?', a: 'No climbing experience is needed. Anyone who can walk 6-8 hours a day and arrives in reasonable shape can complete the trek. The main challenge is the Thorong La Pass, which requires a start in the dark and a long ascent - and our guides prepare you for it along the way.' },
      { q: 'What is included in the Annapurna Circuit and what is not?', a: 'Included: transfers, lodge accommodation, three meals a day, a guide and the area entry permits. Not included: international flights, travel insurance, the Nepal visa ($25-30) and personal gear. A detailed gear list is sent after registration.' },
    ],
  },

  /* ── Peaks of the Balkans ── */
  'peaks-of-balkan': {
    he: [
      { q: 'כמה קשה טרק פסגות הבלקן?', a: 'הטרק ברמת קושי בינונית. ימי ההליכה נעים בין 13 ל-22 ק״מ עם עליות של עד 1,100 מ׳, ונדרש כושר גופני טוב ויכולת לשאת תיק יום 7-9 שעות. אין בו טיפוס טכני - זה מסלול הליכה במיטבו, בין אלבניה, קוסובו ומונטנגרו.' },
      { q: 'מה גודל הקבוצה בטרק פסגות הבלקן?', a: 'הקבוצות שלנו מוגבלות ל-15 משתתפים לכל היותר, כדי לשמור על ליווי אישי, גמישות בשטח ואיכות חוויה גבוהה.' },
      { q: 'האם יש אפשרות לחדר יחיד?', a: 'חדר יחיד זמין רק בלילות במלון בשקודרה, לפני הטרק ואחריו. במהלך הטרק עצמו הלינה היא בגסטהאוסים משפחתיים עם חדרים משותפים בלבד, ואין בהם אפשרות לחדר יחיד - וזה בדיוק חלק מהקסם של המסלול.' },
      { q: 'האם נדרש ניסיון טיפוס לטרק פסגות הבלקן?', a: 'לא נדרש ניסיון טכני - זהו מסלול טרק ללא טיפוס. עם זאת, הצטברות ימי ההליכה מחייבת כושר גופני סביר וניסיון קודם בהליכות ארוכות בשטח הררי.' },
      { q: 'מה קורה אם אני נסוג באמצע הטרק?', a: 'בטיחות המטיילים לפני הכול. אם מסיבה כלשהי צריך לרדת מוקדם, המדריך מלווה אתכם בחזרה בבטחה ומסדיר את ההמשך. חשוב לדעת שהוצאות נוספות שנובעות מירידה מוקדמת חלות על המטייל.' },
    ],
    en: [
      { q: 'How hard is the Peaks of the Balkans trek?', a: 'The trek is moderate. Walking days range from 13 to 22 km with ascents of up to 1,100 m, and it takes good fitness and the ability to carry a daypack for 7-9 hours. There is no technical climbing - it is trekking at its best, across Albania, Kosovo and Montenegro.' },
      { q: 'What is the group size on the Peaks of the Balkans trek?', a: 'Our groups are limited to a maximum of 15 participants, to keep personal guidance, flexibility on the trail and a high-quality experience.' },
      { q: 'Is a single room available?', a: 'A single room is available only for the hotel nights in Shkodra, before and after the trek. During the trek itself accommodation is in family guesthouses with shared rooms only, with no single-room option - and that is part of the route\'s charm.' },
      { q: 'Do I need climbing experience for the Peaks of the Balkans trek?', a: 'No technical experience is needed - this is a trek with no climbing. That said, the accumulation of walking days requires reasonable fitness and prior experience with long hikes in mountainous terrain.' },
      { q: 'What happens if I turn back mid-trek?', a: 'Trekker safety comes first. If for any reason you need to descend early, the guide accompanies you back safely and arranges what comes next. Note that any extra costs arising from an early descent are the traveller\'s responsibility.' },
    ],
  },

  /* ── Ethiopia: Simien Mountains & Danakil ── */
  'ethiopia': {
    he: [
      { q: 'האם אתיופיה בטוחה לתיירים?', a: 'אתיופיה בטוחה לתיירים כל עוד נשארים באזורי הטיול המוגדרים, והצוות שלנו מכיר את הארץ לעומק ומלווה את הקבוצה לכל אורך המסע. האזורים שאנחנו מבקרים בהם, כולל הרי הסימיאן ומדבר דנקיל, מקבלים אלפי תיירים בכל שנה.' },
      { q: 'כמה מסוכן להתקרב לאגם הלבה של ארטה אלה?', a: 'הגישה לאגם הלבה של ארטה אלה נעשית עם מדריכים מקומיים מנוסים ובליווי מאבטח, ועומדים על שפת הלוע ממרחק בטוח. זו אחת החוויות הנדירות בעולם - לצפות בלבה רותחת בלילה - ורמת הבטיחות הגבוהה היא שהופכת אותה לנגישה.' },
      { q: 'מה הגובה המקסימלי בטיול לאתיופיה?', a: 'הגובה המקסימלי הוא פסגת ראס בוואהיט בהרי הסימיאן (4,430 מ׳). לעומתה, הר הגעש הפעיל ארטה אלה יושב מתחת לפני הים (613 מ׳). הקטע הגבוה בסימיאן עלול לגרום לתסמיני גובה קלים, ולכן בנינו את הלו״ז עם התאקלמות הדרגתית.' },
      { q: 'אילו חיסונים נדרשים לנסיעה לאתיופיה?', a: 'נדרשים חיסונים. חובה: חיסון לקדחת צהובה (נבדק בכניסה לארץ) וטיפוס הבטן; מומלצים עוד כמה שנפרט במסמך הרפואי שנשלח לאחר ההרשמה. כדאי לפנות למרפאת מטיילים לפחות שישה שבועות לפני הטיסה.' },
      { q: 'מה עונת הטיולים המומלצת לאתיופיה?', a: 'העונה הטובה היא נובמבר עד פברואר, החורף היבש. אז הרי הסימיאן ירוקים ויפים, ומזג האוויר בדנקיל נסבל יחסית (35-40 מעלות במקום 50 בקיץ) - ואנחנו מוציאים את המסעות בדיוק בחלון הזה.' },
      { q: 'במה שונה הטיול לאתיופיה מטרקים אחרים שלכם?', a: 'אתיופיה היא לא טיול טיפוס רגיל אלא שילוב של טרק, הרפתקה גיאוגרפית ומפגש אנתרופולוגי. בלילה אחד עומדים על שפת אגם לבה פעיל, ויומיים אחר כך מטפסים בהרים בין קופי ג׳לדה - אין מסע אחר כזה בעולם.' },
    ],
    en: [
      { q: 'Is Ethiopia safe for tourists?', a: 'Ethiopia is safe for tourists as long as you stay within the defined travel areas, and our team knows the country deeply and accompanies the group throughout. The areas we visit, including the Simien Mountains and the Danakil Depression, receive thousands of tourists every year.' },
      { q: 'How dangerous is it to approach the Erta Ale lava lake?', a: 'Access to the Erta Ale lava lake is done with experienced local guides and a security escort, and you stand at the crater rim from a safe distance. It is one of the rarest experiences on earth - watching boiling lava at night - and the high level of safety is what makes it accessible.' },
      { q: 'What is the maximum altitude on the Ethiopia trip?', a: 'The maximum altitude is the summit of Ras Bwahit in the Simien Mountains (4,430 m). By contrast, the active Erta Ale volcano sits below sea level (613 m). The high section in the Simiens can cause mild altitude symptoms, so we built the itinerary with gradual acclimatization.' },
      { q: 'What vaccinations are required for Ethiopia?', a: 'Vaccinations are required. Mandatory: yellow fever (checked on entry) and typhoid; several others are recommended and detailed in the medical document sent after registration. It is worth visiting a travel clinic at least six weeks before the flight.' },
      { q: 'What is the recommended season for Ethiopia?', a: 'The best season is November to February, the dry winter. The Simien Mountains are green and beautiful, and the weather in Danakil is relatively bearable (35-40°C instead of 50 in summer) - and we run our journeys precisely in this window.' },
      { q: 'How is the Ethiopia trip different from your other treks?', a: 'Ethiopia is not a regular climbing trip but a blend of trekking, geographic adventure and anthropological encounter. One night you stand at the rim of an active lava lake, and two days later you climb mountains among gelada monkeys - there is no other journey like it in the world.' },
    ],
  },

  /* ── Sinai ── */
  'sinai': {
    he: [
      { q: 'איך מגיעים לטרק בסיני?', a: 'המסע מתחיל ומסתיים במעבר הגבול טאבה. חוצים את הגבול יחד עם המדריך, ומשם ההסעות לסנטה קתרינה ובחזרה כלולות במחיר. שימו לב שאגרות המעבר בצד הישראלי (120₪) ובצד המצרי (120$) אינן כלולות.' },
      { q: 'מה רמת הקושי של הטרק בסיני?', a: 'הטרק מתאים למטיילים בכושר גופני טוב: ימי הליכה מלאים בשטח הררי, בין 10 ל-15 ק״מ ביום, כולל עלייה לג׳בל קתרינה (2,642 מ׳) - ההר הגבוה במצרים. אין טיפוס טכני, אבל נדרשת מוטיבציה ויכולת הליכה של כמה שעות ביום.' },
      { q: 'איפה ישנים במהלך הטרק בסיני?', a: 'ארבעה לילות בלב הרי סיני - בבוסתנים בדואיים ובלינת שטח תחת שמיים זרועי כוכבים, עם ארוחות חמות בפנסיון מלא. את הלילה האחרון מעבירים במלון מפנק בדהב, בחדר פרטי, על שפת ים סוף.' },
      { q: 'מה הגובה המקסימלי בטרק?', a: 'הנקודה הגבוהה היא פסגת ג׳בל קתרינה (2,642 מ׳), ההר הגבוה בסיני ובמצרים כולה. בנוסף עולים לפסגת הר סיני (2,285 מ׳), שלפי המסורת עליו ניתנו לוחות הברית.' },
      { q: 'צריך ניסיון בצלילה בשביל הבלו הול?', a: 'לא. ביום האחרון מתקיים שנורקלינג בבלו הול - בלי צורך בניסיון קודם או בתעודת צלילה. השנורקלינג מתאים לכל מי שיודע לשחות, והשונית מציעה אלמוגים ודגים צבעוניים כבר מהמטרים הראשונים.' },
      { q: 'מה חשוב להביא לטרק בסיני?', a: 'ציוד אישי אינו כלול, וחשוב להצטייד בנעלי הליכה טובות, שק שינה, פנס ראש ובגדים חמים לערבים המדבריים הקרים. רשימת ציוד מפורטת נשלחת לכל נרשם לאחר ההרשמה.' },
    ],
    en: [
      { q: 'How do you get to the Sinai trek?', a: 'The journey starts and ends at the Taba border crossing. You cross the border together with the guide, and from there the transfers to Saint Catherine and back are included. Note that the crossing fees on the Israeli side (120 NIS) and the Egyptian side ($120) are not included.' },
      { q: 'What is the difficulty level of the Sinai trek?', a: 'The trek suits travellers in good physical condition: full walking days in mountainous terrain, 10 to 15 km a day, including the ascent of Jabal Katherina (2,642 m) - the highest mountain in Egypt. There is no technical climbing, but it takes motivation and the ability to walk several hours a day.' },
      { q: 'Where do you sleep during the Sinai trek?', a: 'Four nights in the heart of the Sinai mountains - in Bedouin orchards and open-air camps under star-filled skies, with hot meals on a full-board basis. The last night is spent at a comfortable hotel in Dahab, in a private room, on the shore of the Red Sea.' },
      { q: 'What is the maximum altitude on the trek?', a: 'The highest point is the summit of Jabal Katherina (2,642 m), the highest mountain in Sinai and in all of Egypt. We also ascend Mount Sinai (2,285 m), where, by tradition, the Tablets of the Covenant were given.' },
      { q: 'Do I need diving experience for the Blue Hole?', a: 'No. On the last day there is snorkeling at the Blue Hole - no prior experience or diving certificate needed. The snorkeling suits anyone who can swim, and the reef offers corals and colorful fish from the very first meters.' },
      { q: 'What should I bring to the Sinai trek?', a: 'Personal gear is not included, and it is important to bring good hiking shoes, a sleeping bag, a headlamp and warm clothes for the cold desert evenings. A detailed gear list is sent to every registrant after registration.' },
    ],
  },

  /* ── Safari (3 / 5 / 7 days share the same FAQ) ── */
  'safari-3-days': { he: safariHe(), en: safariEn() },
  'safari-5-days': { he: safariHe(), en: safariEn() },
  'safari-7-days': { he: safariHe(), en: safariEn() },
};

/* Safari FAQ built once and reused by all three lengths. */
function safariHe() {
  return [
    { q: 'הספארי פרטי או בקבוצה?', a: 'כל הספארי שלנו פרטיים: ג׳יפ משלכם, נהג-מדריך משלכם ותאריך יציאה לפי היומן שלכם. החריג היחיד הוא ספארי 3 הימים, שיוצא בסמוך לקבוצות הקילימנג׳רו - שם אפשר להצטרף לקבוצה ולחלוק את עלות הג׳יפ.' },
    { q: 'כמה אנשים נכנסים לג׳יפ הספארי?', a: 'עד שישה נוסעים, ולכל אחד מקום ליד חלון. הגג נפתח לצילום בעמידה, כך שכולם רואים את החיות במיטבן.' },
    { q: 'מה עושים ביום ספארי בטנזניה?', a: 'יוצאים לשטח עם הג׳יפ ומחפשים חיות יחד עם המדריך. אין הליכות ארוכות ואין מאמץ גופני - כמעט כל היום מתנהל מתוך הרכב. הקצב שלכם: אם משהו מרתק קורה בשטח, נשארים איתו.' },
    { q: 'מתי הזמן הטוב ביותר לצאת לספארי?', a: 'אפשר לצאת כל השנה. יוני עד אוקטובר היא העונה היבשה, שבה החיות מתרכזות סביב מקורות מים והצפייה קלה יותר, וזו גם תקופת חציות הנהר בצפון הסרנגטי. ינואר-פברואר הם עונת ההמלטות במרכז הסרנגטי.' },
    { q: 'האם ספארי מתאים לילדים?', a: 'בהחלט. אין מאמץ גופני, והחוויה מרתקת בכל גיל. למשפחות עם ילדים קטנים נתאים מראש את אורך ימי הנסיעה כדי שיהיה נוח לכולם.' },
    { q: 'צריך ויזה לטנזניה?', a: 'כן, אזרחי ישראל נדרשים בוויזה לטנזניה, ומגישים אותה מראש באתר הרשמי של רשות ההגירה. אנחנו מלווים אתכם בתהליך.' },
  ];
}
function safariEn() {
  return [
    { q: 'Is the safari private or in a group?', a: 'All our safaris are private: your own jeep, your own driver-guide and a departure date to suit your calendar. The only exception is the 3-day safari, which runs alongside our Kilimanjaro groups - there you can join a group and share the cost of the jeep.' },
    { q: 'How many people fit in the safari jeep?', a: 'Up to six passengers, each with a window seat. The roof opens for standing photography, so everyone sees the animals at their best.' },
    { q: 'What do you do on a safari day in Tanzania?', a: 'You head into the bush in the jeep and look for animals together with the guide. There are no long walks and no physical effort - almost the whole day is spent from the vehicle. At your pace: if something fascinating is happening, we stay with it.' },
    { q: 'When is the best time to go on safari?', a: 'You can go year-round. June to October is the dry season, when animals gather around water sources and viewing is easier, and it is also the time of the river crossings in the northern Serengeti. January-February is the calving season in the central Serengeti.' },
    { q: 'Is a safari suitable for children?', a: 'Absolutely. There is no physical effort, and the experience is fascinating at any age. For families with young children we adjust the length of the driving days in advance so everyone is comfortable.' },
    { q: 'Do I need a visa for Tanzania?', a: 'Yes, Israeli citizens need a visa for Tanzania, submitted in advance on the official immigration authority website. We guide you through the process.' },
  ];
}

/* ── Default FAQ ── used by any destination without its own entry above.
   `cap` is the group capacity, interpolated so the group-size answer stays true. */
export function makeDefaultFaq(cap = 15) {
  return [
    { q: 'האם נדרש ניסיון קודם?', a: 'לרוב המסלולים שלנו לא נדרש ניסיון טיפוס קודם. מה שצריך הוא כושר גופני טוב, ראש פתוח ורצון להגיע לפסגה - וההכנה שאנחנו עושים יחד לפני היציאה עושה את השאר.' },
    { q: 'מה גודל הקבוצה?', a: `הקבוצות שלנו מוגבלות ל-${cap} משתתפים לכל היותר, כדי לשמור על ליווי אישי, יחס חם ואיכות חוויה גבוהה לאורך כל המסע.` },
    { q: 'האם יש אפשרות לחדר יחיד?', a: 'כן, ניתן לבקש חדר יחיד בתוספת תשלום. חשוב לציין זאת כבר בטופס ההרשמה כדי שנוכל להבטיח את החדר.' },
    { q: 'מה קורה אם אני צריך לרדת באמצע?', a: 'בטיחות המשתתפים לפני הכול. אם צריך לרדת מוקדם מכל סיבה, המדריך מלווה אתכם בחזרה בבטחה. חשוב לדעת שהוצאות נוספות שנובעות מירידה מוקדמת חלות על המטייל.' },
    { q: 'מה כולל המחיר?', a: 'המחיר כולל את כל מה שמפורט בסעיף "מה כלול" בעמוד. טיסות בינלאומיות וביטוח נסיעות אינם כלולים, ורשימת ציוד מלאה נשלחת לכל נרשם לאחר ההרשמה.' },
  ];
}

export function makeDefaultFaqEn(cap = 15) {
  return [
    { q: 'Is prior experience required?', a: 'For most of our routes no prior climbing experience is needed. What it takes is good fitness, an open mind and the will to reach the summit - and the preparation we do together before departure does the rest.' },
    { q: 'What is the group size?', a: `Our groups are limited to a maximum of ${cap} participants, to keep personal guidance, a warm touch and a high-quality experience throughout the journey.` },
    { q: 'Is a single room available?', a: 'Yes, a single room can be requested for an additional fee. Please note it on the registration form so we can secure the room for you.' },
    { q: 'What happens if I need to descend early?', a: 'Participant safety comes first. If you need to descend early for any reason, the guide accompanies you back safely. Note that any extra costs arising from an early descent are the traveller\'s responsibility.' },
    { q: 'What is included in the price?', a: 'The price includes everything listed in the "What\'s Included" section on the page. International flights and travel insurance are not included, and a full gear list is sent to every registrant after registration.' },
  ];
}
