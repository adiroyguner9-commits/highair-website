/**
 * blogData.js - Blog posts
 * To add a new post: copy the object structure below and paste at the top of POSTS array.
 * Each post supports both Hebrew (default) and English (En suffix) fields.
 */

export const POSTS = [
  /* ═══════════════════════════════════════════════════════════════════
   *  id:3  mountain-gear-list  (2026-03-10)
   * ═══════════════════════════════════════════════════════════════════ */
  {
    id:       3,
    slug:     'mountain-gear-list',

    /* ── Hebrew ── */
    title:    'רשימת הציוד המלאה לטיפוס הרים ומשלחות (2026): כל מה שצריך לארוז',
    author:   'HighAir Expeditions',
    dateIso:  '2026-03-10',
    dateModified: '2026-04-29',
    dateHe:   '10 במרץ 2026',
    dateEn:   'March 10, 2026',
    category: 'ציוד',
    categoryEn: 'Gear',
    img:         '/images/blog/kilimanjaro-layers.jpg',
    imgPosition: 'center 40%',
    excerpt:  'רשימת הציוד המלאה לטיפוס הרים: ביגוד בשכבות, נעלי טרק, שק שינה, תיק גב, ציוד בטיחות ועוד. כל מה שצריך לדעת לפני שיוצאים למשלחת.',
    excerptEn: 'The complete mountain gear list: layering system, hiking boots, sleeping bag, backpack, safety gear and more. Everything you need to know before heading on an expedition.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'הציוד הנכון יכול להיות ההבדל בין מסע מהנה ובטוח לבין חוויה קשה ומסוכנת. כשמטפסים להר גבוה — בין אם זה קילימנג\'רו, אלברוס או אחת מפסגות הנפאל — הגוף נחשף לטמפרטורות קיצוניות, גשם, שלג ורוחות חזקות. ציוד מתאים לא רק מגן עליכם פיזית, אלא גם חוסך אנרגיה, מגביר ביטחון ומאפשר ליהנות מכל רגע במסע.' },
      { type: 'text', value: 'ב-HighAir Expeditions ליווינו אלפי מטיילים לכל קצות העולם, ויודעים בדיוק מה עובד ומה מוטב להשאיר בבית. הרשימה הזו מבוססת על ניסיון אמיתי מהשטח.' },

      { type: 'image', src: '/images/blog/kilimanjaro-layers.jpg', caption: 'ביגוד בשכבות — המפתח לנוחות בכל תנאי מזג אוויר' },

      { type: 'heading', value: '1. ביגוד — שיטת השכבות' },
      { type: 'text', value: 'עקרון השכבות הוא הבסיס לכל ביגוד טיפוס הרים. במקום בגד אחד כבד, לובשים מספר שכבות דקות שניתן להוסיף ולהסיר בהתאם לשינויי הטמפרטורה. הסוד: כל שכבה ממלאת תפקיד שונה.' },
      { type: 'subheading', value: 'שכבת בסיס (Base Layer)' },
      { type: 'list', items: [
        'חומר: פוליאסטר, מריו וול (Merino Wool) או כל בד סינתטי מנדף לחות. בשום אופן לא כותנה — כותנה סופגת זיעה, מתייבשת לאט ומסוכנת בקור.',
        'גפן מכנסיים ארוכים תרמיים לחלק התחתון.',
        'חולצה ארוכה צמודה לחלק העליון.',
      ]},
      { type: 'subheading', value: 'שכבת ביניים (Mid Layer)' },
      { type: 'list', items: [
        'פליז בגרסת 100 (קל) ו-200 (חם יותר). מאפשר בידוד תרמי עם אוורור טוב.',
        'מעיל פוך קל (800-fill) לשימוש בטמפרטורות נמוכות מאוד.',
      ]},
      { type: 'subheading', value: 'שכבה חיצונית (Shell)' },
      { type: 'list', items: [
        'מעיל Gore-Tex עמיד למים ורוח — חיוני לגשם, שלג ורוח.',
        'מכנסי Gore-Tex או מכנסי ויטרגל לרגליים.',
        'לפסגות גבוהות מ-5000 מטר: מעיל פוך כבד (down jacket) בדירוג של מינוס 15 לפחות.',
      ]},

      { type: 'heading', value: '2. נעליים וגרביים' },
      { type: 'text', value: 'הנעליים הן ההשקעה החשובה ביותר בציוד שלכם. נעלי טרק גרועות גורמות ליבלות, פציעות קרסול ורטיבות — וברגע שנעלייכם לא נוחות, כל צעד הופך לסבל.' },
      { type: 'subheading', value: 'מה לחפש בנעלי טרק' },
      { type: 'list', items: [
        'חסינות למים (Waterproof) — ממברנת Gore-Tex או Vibram.',
        'תמיכת קרסול — חיונית בשטחים לא סדירים עם תיק כבד.',
        'סוליה בולמת זעזועים — מגינה על הברכיים בירידות.',
        'חשוב מכל: נעלו לפחות 3 פעמים לפני הטיול. נעליים לא מרוצות = יבלות בוודאות.',
      ]},
      { type: 'subheading', value: 'גרביים' },
      { type: 'list', items: [
        'גרבי מריו וול — חמות, מנדפות לחות ואנטי-בקטריאליות.',
        'הביאו לפחות 4-5 זוגות לטיול של שבוע.',
        'גרבי עלייה כפולות (Double-layer) מפחיתות שפשופים בצורה משמעותית.',
      ]},

      { type: 'heading', value: '3. תיק גב ודאפל-באג' },
      { type: 'text', value: 'לרוב המשלחות נדרשים שני תיקים: תיק יום שנושאים בעצמכם, ודאפל-באג גדול שהפורטרים נושאים.' },
      { type: 'subheading', value: 'תיק יום (Daypack)' },
      { type: 'list', items: [
        'נפח: 25-40 ליטר.',
        'מערכת גב מרופדת עם חגורת מותן לחלוקת משקל.',
        'כיס נגיש למים (תאימות עם מצנח שתיה / מקום לבקבוק).',
        'כיסוי גשם מובנה או נפרד.',
      ]},
      { type: 'subheading', value: 'דאפל-באג (Duffel Bag)' },
      { type: 'list', items: [
        'נפח: 70-100 ליטר.',
        'חומר עמיד לקרעים ורטיבות.',
        'מנעול קומבינציה להגנה על הציוד.',
        'כתפיות נשלפות לנוחות הפורטרים — ולכם אם צריך לשאת.',
      ]},

      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'תיק גב נוח — הבסיס לכל טיול ארוך' },

      { type: 'heading', value: '4. שק שינה' },
      { type: 'text', value: 'לילה קר על ההר ללא שק שינה מתאים פירושו שינה גרועה, גוף קר, ופגיעה בביצועים למחרת. הדירוג החשוב הוא "Comfort" — לא "Extreme" או "Limit".' },
      { type: 'list', items: [
        'קילימנג\'רו ואלברוס: דירוג Comfort של -5°C עד -10°C.',
        'פסגות מעל 5500 מ\' (אקונקגואה, ננגה פארבט): דירוג -15°C עד -20°C.',
        'מילוי: פוך (Down) קל יותר ומגיב טוב יותר לקור, סינתטי מוצלח יותר כשרטוב.',
        'תמיד שמרו על השק יבש בשקית ניילון בתוך הדאפל.',
      ]},

      { type: 'heading', value: '5. ציוד בטיחות ועזרה ראשונה' },
      { type: 'text', value: 'חובה לכל משלחת ברצינות.' },
      { type: 'subheading', value: 'ערכת עזרה ראשונה אישית' },
      { type: 'list', items: [
        'תרופות: משכי כאב (איבופרופן ופרצטמול), אנטי-היסטמין, תרופה לשלשול ובחילה.',
        'כדורי Diamox (Acetazolamide) — למניעת מחלת גבהים. רק לאחר התייעצות עם רופא.',
        'פלסטרים, גאזה, רצועות אגירה.',
        'חיטוי: אלכוהול ג\'ל, בטדין.',
        'מד-חום ומד-רוויה (Pulse Oximeter) — קריטי לניטור מחלת גבהים.',
      ]},
      { type: 'subheading', value: 'ציוד בטיחות' },
      { type: 'list', items: [
        'מנורת ראש + סוללות רזרבה (פנס ראש הוא חובה לליל הפסגה).',
        'שמשון / כוסיות שלג לעיניים (Glacier Glasses) — UV400.',
        'קרם הגנה גבוה (SPF 50+) ושפתון עם הגנה.',
        'מקלות הליכה — מפחיתים עומס על הברכיים ב-30% ומשפרים יציבות.',
      ]},

      { type: 'heading', value: '6. ניהול מים וחימום' },
      { type: 'list', items: [
        'בקבוק מבודד (Insulated Bottle) של 1 ליטר — מי שתייה לא יקפאו.',
        'מצנח שתייה (Hydration Bladder) 2-3 ליטר לתיק יום.',
        'טבליות סינון מים (Purification Tablets) — גיבוי למקרה חירום.',
        'Nalgene או בקבוק שתוכלו למלא במים חמים בלילה לחימום שק השינה.',
      ]},

      { type: 'heading', value: '7. אלקטרוניקה ותקשורת' },
      { type: 'list', items: [
        'מצלמה עמידה ו/או סמארטפון עם מארז מגן.',
        'Power Bank — מינימום 20000 mAh. בגובה רב סוללות מתרוקנות מהר יותר.',
        'שעון GPS / GPS עצמאי לפסגות ללא כיסוי סלולרי.',
        'GPS מסוג Garmin inReach — לתקשורת לוויינית בחירום.',
        'כבלי טעינה גיבוי ומתאמי שקע בינלאומיים.',
      ]},

      { type: 'heading', value: '8. ציוד אישי ונסיעה' },
      { type: 'list', items: [
        'מסמכים: דרכון + עותקים, ויזה (אם נדרשת), ביטוח נסיעות כולל חילוץ.',
        'תרמוס: לשתיית תה חם / קפה בשטח.',
        'גרבי לחץ (Compression Socks) לטיסות ארוכות.',
        'כיסויי אוזניים וכפיה (Balaclava) לטמפרטורות נמוכות.',
        'כפפות: שכבתיות — כפפות פנימיות + כפפות חיצוניות עמידות.',
        'גטרים — מניעים כניסת שלג ואבנים לנעל.',
      ]},

      { type: 'heading', value: '9. מה לא לארוז' },
      { type: 'text', value: 'הדבר הכי חשוב בארוז לטיול הוא לדעת מה להשאיר בבית. כל קילוגרם מיותר בתיק = אנרגיה שהייתם יכולים להשקיע בפסגה.' },
      { type: 'list', items: [
        'בגדי כותנה (חולצות, ג\'ינס) — לחלוטין לא מתאימים להרים.',
        'יותר מ-2 ספרים — תאמינו, לא יהיה לכם כוח לקרוא.',
        'מזוודה / תיק גלגלים — חסרי שימוש בשטח.',
        'ציוד אלקטרוני כבד שאין בו הכרח (לפטופ, טאבלט גדול).',
      ]},

      { type: 'section', value: 'שאלות נפוצות על ציוד הרים' },

      { type: 'heading', value: 'כמה עולה ציוד לקילימנג\'רו?' },
      { type: 'text', value: 'ציוד בסיסי ואיכותי לקילימנג\'רו עולה בין 2000 ל-5000 ש"ח אם קונים הכל חדש. ניתן לחסוך משמעותית על ידי השאלה, רכישה משומשת, או שימוש בציוד שכבר יש. ב-HighAir אנו מציעים ציוד להשכרה (שק שינה, מקלות, תיק יום) בעלות נמוכה.' },

      { type: 'heading', value: 'מה ההבדל בין Gore-Tex לחומרים אחרים?' },
      { type: 'text', value: 'Gore-Tex הוא ממברנה (קרום) המצופה על פני הבד ויוצרת שכבה שחדירה לאוויר אך לא לגשם. ריכוז הנקבוביות בממברנה גדולות מספיק לאדי זיעה לצאת (אוורור) אך קטנות מדי לטיפות גשם להיכנס. בפועל — אתם נשארים יבשים מבפנים וגם מבחוץ. חלופות בשוק: eVent, Pertex Shield, DryVent. Gore-Tex נחשב לסטנדרט הזהב.' },

      { type: 'heading', value: 'האם כדאי לקנות ציוד ב-Israel או בחו"ל?' },
      { type: 'text', value: 'ישראל יש חנויות ציוד איכותיות (כמו נשר, ספורט איגד ועוד). המחירים בדרך כלל גבוהים יותר מאשר ב-Amazon, REI (ארה"ב) או Decathlon (אירופה). עם זאת, קנייה בארץ מאפשרת ניסיון של הציוד לפני הטיול — מה שחשוב מאוד עבור נעליים ותיקים.' },

      { type: 'heading', value: 'האם אפשר לשכור ציוד בטנזניה / נפאל?' },
      { type: 'text', value: 'כן. בארוסה (הכפר שממנו עולים לקילימנג\'רו) ובקטמנדו יש השכרת ציוד זולה. עם זאת, איכות הציוד המושכר משתנה מאוד. אנו ממליצים לרכוש נעליים, ביגוד בסיסי ומכשיר מד-רוויה בעצמכם, ולשכור שק שינה ומקלות אם צריך.' },

      { type: 'heading', value: 'כמה קילוגרמים מותר לארוז לקילימנג\'רו?' },
      { type: 'text', value: 'הפורטרים בקילימנג\'רו מורשים לשאת עד 20 ק"ג (כולל הציוד שלהם). לכן, הדאפל-באג שלכם יכול להיות עד 15 ק"ג. בנוסף, אתם נושאים תיק יום של 5-7 ק"ג. סה"כ: הכינו מסביב ל-20 ק"ג ציוד אישי.' },

      { type: 'section', value: 'מוכנים לצאת לדרך?' },
      { type: 'text', value: 'ציוד נכון הוא ההשקעה הטובה ביותר שתעשו לפני כל משלחת. אם יש לכם שאלות ספציפיות לגבי ציוד לטיול שלכם, צרו קשר עם הצוות שלנו — אנחנו כאן לעזור.' },
      { type: 'cta', text: 'לחנות הציוד של HighAir', textEn: 'HighAir Gear Store', href: '/shop' },
    ],

    /* ── English content ── */
    titleEn: 'The Complete Mountain Gear List (2026): Everything You Need for an Expedition',
    contentEn: [
      { type: 'text', value: 'The right gear can be the difference between a safe, enjoyable journey and a hard, dangerous one. When climbing a high mountain — whether Kilimanjaro, Elbrus, or one of Nepal\'s peaks — your body is exposed to extreme temperatures, rain, snow, and strong winds. Appropriate gear not only protects you physically, it conserves energy, boosts confidence, and lets you enjoy every moment of the journey.' },
      { type: 'text', value: 'At HighAir Expeditions we have guided thousands of trekkers to every corner of the world, and we know exactly what works and what is best left at home. This list is based on real experience in the field.' },

      { type: 'image', src: '/images/blog/kilimanjaro-layers.jpg', caption: 'The layering system — the key to comfort in any weather' },

      { type: 'heading', value: '1. Clothing — The Layering System' },
      { type: 'text', value: 'The layering principle is the foundation of all mountain clothing. Instead of one heavy garment, you wear several thin layers that can be added or removed as temperatures change. The secret: each layer serves a different role.' },
      { type: 'subheading', value: 'Base Layer' },
      { type: 'list', items: [
        'Material: Polyester, Merino Wool, or any moisture-wicking synthetic. Never cotton — cotton absorbs sweat, dries slowly, and is dangerous in the cold.',
        'Long thermal leggings for the lower body.',
        'Long-sleeve fitted top for the upper body.',
      ]},
      { type: 'subheading', value: 'Mid Layer' },
      { type: 'list', items: [
        'Fleece in weight 100 (light) or 200 (warmer). Provides thermal insulation with good ventilation.',
        'Light down jacket (800-fill) for use in very low temperatures.',
      ]},
      { type: 'subheading', value: 'Outer Layer (Shell)' },
      { type: 'list', items: [
        'Gore-Tex jacket — waterproof and windproof — essential for rain, snow, and wind.',
        'Gore-Tex or softshell trousers for the legs.',
        'For summits above 5000 m (Aconcagua, Nanga Parbat): heavy down jacket rated to at least -15°C.',
      ]},

      { type: 'heading', value: '2. Footwear and Socks' },
      { type: 'text', value: 'Boots are the most important investment in your gear. Poor trekking boots cause blisters, ankle injuries, and wet feet — and once your boots are uncomfortable, every step becomes suffering.' },
      { type: 'subheading', value: 'What to look for in hiking boots' },
      { type: 'list', items: [
        'Waterproofing — Gore-Tex or Vibram membrane.',
        'Ankle support — essential on uneven terrain with a heavy pack.',
        'Shock-absorbing sole — protects your knees on descents.',
        'Most importantly: break them in at least 3 times before the trip. Unbroken boots = blisters guaranteed.',
      ]},
      { type: 'subheading', value: 'Socks' },
      { type: 'list', items: [
        'Merino wool socks — warm, moisture-wicking, and antibacterial.',
        'Bring at least 4-5 pairs for a week-long trek.',
        'Double-layer hiking socks significantly reduce friction and blisters.',
      ]},

      { type: 'heading', value: '3. Backpack and Duffel Bag' },
      { type: 'text', value: 'Most expeditions require two bags: a daypack you carry yourself, and a large duffel bag the porters carry.' },
      { type: 'subheading', value: 'Daypack' },
      { type: 'list', items: [
        'Volume: 25-40 litres.',
        'Padded back system with hip belt for weight distribution.',
        'Accessible pocket for water (hydration bladder compatible / bottle pocket).',
        'Built-in or separate rain cover.',
      ]},
      { type: 'subheading', value: 'Duffel Bag' },
      { type: 'list', items: [
        'Volume: 70-100 litres.',
        'Tear-resistant and water-resistant material.',
        'Combination lock for gear security.',
        'Removable shoulder straps for porter convenience — and yours if needed.',
      ]},

      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'A comfortable daypack — the foundation of every long trek' },

      { type: 'heading', value: '4. Sleeping Bag' },
      { type: 'text', value: 'A cold night on the mountain without an appropriate sleeping bag means poor sleep, a cold body, and impaired performance the next day. The important rating is "Comfort" — not "Extreme" or "Limit."' },
      { type: 'list', items: [
        'Kilimanjaro and Elbrus: Comfort rating of -5°C to -10°C.',
        'Peaks above 5500 m (Aconcagua, high Himalayan peaks): -15°C to -20°C rating.',
        'Fill: Down is lighter and performs better in dry cold; synthetic is better when wet.',
        'Always store the bag dry in a waterproof liner inside your duffel.',
      ]},

      { type: 'heading', value: '5. Safety and First Aid' },
      { type: 'text', value: 'Essential for any serious expedition.' },
      { type: 'subheading', value: 'Personal First Aid Kit' },
      { type: 'list', items: [
        'Medications: painkillers (ibuprofen and paracetamol), antihistamine, anti-diarrhoea and anti-nausea medication.',
        'Diamox (Acetazolamide) tablets — for altitude sickness prevention. Only after consulting a doctor.',
        'Plasters, gauze, elastic bandages.',
        'Antiseptic: alcohol gel, Betadine.',
        'Thermometer and pulse oximeter — critical for monitoring altitude sickness.',
      ]},
      { type: 'subheading', value: 'Safety Equipment' },
      { type: 'list', items: [
        'Headlamp + spare batteries (a headlamp is mandatory for summit night).',
        'Glacier glasses — UV400 protection.',
        'High SPF sunscreen (SPF 50+) and lip balm with sun protection.',
        'Trekking poles — reduce knee impact by 30% and improve stability.',
      ]},

      { type: 'heading', value: '6. Water and Hydration' },
      { type: 'list', items: [
        'Insulated bottle (1 litre) — drinking water won\'t freeze.',
        'Hydration bladder (2-3 litres) for your daypack.',
        'Water purification tablets — backup for emergencies.',
        'Nalgene or similar bottle you can fill with hot water at night to warm your sleeping bag.',
      ]},

      { type: 'heading', value: '7. Electronics and Communication' },
      { type: 'list', items: [
        'Weatherproof camera and/or smartphone with protective case.',
        'Power bank — minimum 20000 mAh. Batteries drain faster at altitude.',
        'GPS watch or standalone GPS for peaks without cellular coverage.',
        'Garmin inReach or similar — satellite communication for emergencies.',
        'Backup charging cables and international plug adapters.',
      ]},

      { type: 'heading', value: '8. Personal Items and Travel' },
      { type: 'list', items: [
        'Documents: passport + copies, visa (if required), travel insurance including evacuation.',
        'Thermos: for hot tea/coffee in the field.',
        'Compression socks for long flights.',
        'Ear warmers and balaclava for very low temperatures.',
        'Gloves: layered — inner gloves + outer waterproof gloves.',
        'Gaiters — prevent snow and stones from entering your boots.',
      ]},

      { type: 'heading', value: '9. What Not to Pack' },
      { type: 'text', value: 'The most important thing about packing for a trip is knowing what to leave behind. Every unnecessary kilogram in your bag is energy you could have spent on the summit.' },
      { type: 'list', items: [
        'Cotton clothing (T-shirts, jeans) — completely unsuitable for mountains.',
        'More than 2 books — trust us, you won\'t have the energy to read.',
        'Wheeled luggage/trolley suitcase — useless in the field.',
        'Heavy electronics with no real necessity (laptop, large tablet).',
      ]},

      { type: 'section', value: 'Mountain Gear FAQ' },

      { type: 'heading', value: 'How much does gear for Kilimanjaro cost?' },
      { type: 'text', value: 'Basic quality gear for Kilimanjaro costs between $500 and $1500 if buying everything new. You can save significantly by renting, buying secondhand, or using gear you already own. HighAir offers gear rental (sleeping bag, poles, daypack) at low cost.' },

      { type: 'heading', value: 'What is the difference between Gore-Tex and other materials?' },
      { type: 'text', value: 'Gore-Tex is a membrane laminated onto fabric that creates a layer permeable to air but not to rain. The membrane pores are large enough for sweat vapour to escape (ventilation) but too small for rain droplets to enter. In practice — you stay dry both inside and outside. Alternatives on the market: eVent, Pertex Shield, DryVent. Gore-Tex is considered the gold standard.' },

      { type: 'heading', value: 'Can you rent gear in Tanzania or Nepal?' },
      { type: 'text', value: 'Yes. In Moshi (the town at the base of Kilimanjaro) and Kathmandu there is affordable gear rental. However, the quality of rented gear varies widely. We recommend purchasing your own boots, base layers and a pulse oximeter, and renting a sleeping bag and poles if needed.' },

      { type: 'heading', value: 'How many kilograms can you pack for Kilimanjaro?' },
      { type: 'text', value: 'Kilimanjaro porters are permitted to carry up to 20 kg (including their own equipment). Therefore, your duffel bag should not exceed 15 kg. In addition, you carry a daypack of 5-7 kg. Total: prepare around 20 kg of personal gear.' },

      { type: 'heading', value: 'Is a down jacket worth the investment?' },
      { type: 'text', value: 'Absolutely yes for peaks above 4500 m. A quality down jacket provides extraordinary warmth for its weight and compresses to almost nothing in your pack. For Kilimanjaro and Elbrus, a jacket rated to -10°C is sufficient. For Aconcagua or Himalayan peaks, invest in a -20°C rated down jacket.' },

      { type: 'section', value: 'Ready to Hit the Trail?' },
      { type: 'text', value: 'The right gear is the best investment you\'ll make before any expedition. If you have specific questions about gear for your trip, contact our team — we\'re here to help.' },
      { type: 'cta', text: 'לחנות הציוד של HighAir', textEn: 'HighAir Gear Store', href: '/shop' },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
   *  id:4  everest-base-camp-guide  (2026-02-15)
   * ═══════════════════════════════════════════════════════════════════ */
  {
    id:       4,
    slug:     'everest-base-camp-guide',

    /* ── Hebrew ── */
    title:    'המדריך המלא לטרק לבייס קמפ אוורסט (2026): ציוד, מסלול ומה לצפות',
    author:   'HighAir Expeditions',
    dateIso:  '2026-02-15',
    dateModified: '2026-04-29',
    dateHe:   '15 בפברואר 2026',
    dateEn:   'February 15, 2026',
    category: 'מדריכים',
    categoryEn: 'Guides',
    img:         '/images/blog/seven-summits-everest.webp',
    imgPosition: 'center 30%',
    excerpt:  'טרק לבייס קמפ אוורסט (5364 מ׳) — 14 ימים, כ-130 ק"מ, ונופים מהיפים בעולם. מה צריך לדעת: עונות, ציוד, התאקלמות, עלות ואיך להגיע לנמצ\'ה בזאר.',
    excerptEn: 'Everest Base Camp trek (5364 m) — 14 days, ~130 km, some of the world\'s most stunning views. What you need to know: seasons, gear, acclimatisation, cost, and how to reach Namche Bazaar.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'בייס קמפ אוורסט (EBC) עומד על גובה 5364 מטר בלב ההימלאיה הנפאלית — ורק כ-14-16 ימי הליכה מפרידים בינכם לבינו. זהו הטרק המפורסם ביותר בעולם: שבילים עתיקים, כפרי שרפות מרהיבים, מבצרי תרבות תיבטית, ונוף עוצר נשימה של האוורסט, לוצ\'ה, מקאלו ונופטסה.' },
      { type: 'text', value: 'ב-HighAir Expeditions הובלנו עשרות קבוצות ישראליות לבייס קמפ. המדריך הזה מסכם את כל מה שצריך לדעת — ממסלול ההליכה, דרך ציוד חיוני ועד ניהול ההתאקלמות הנכונה.' },

      { type: 'image', src: '/images/blog/seven-summits-everest.webp', caption: 'אוורסט ונופטסה מהשביל — נוף שלא תשכחו' },

      { type: 'heading', value: '1. מה זה טרק ל-EBC?' },
      { type: 'text', value: 'הטרק לבייס קמפ אוורסט הוא מסלול הליכה בגובה רב בהימלאיה הנפאלית, המוביל מהעיירה לוקלה (2840 מ׳) דרך נמצ\'ה בזאר, טיאנגבוצ\'ה ומנחות הגלציאל, ועד לבייס קמפ עצמו ב-5364 מ׳. בדרך חוצים שרשראות הרים מרהיבות ומבקרים בכפרים ושדות אוורסט.' },
      { type: 'text', value: 'המסלול המלא (הלוך וחזור) כולל כ-130 ק"מ הליכה ובסביבות 10000 מטרי עלייה מצטברת. ציר הזמן הנפוץ: 12-16 ימים. אנחנו ממליצים 14-16 ימים כדי לאפשר התאקלמות מספקת.' },

      { type: 'heading', value: '2. מתי לצאת? עונות הטרק' },
      { type: 'text', value: 'הטרק לבייס קמפ אפשרי כל השנה, אך יש שתי עונות אידיאליות:' },
      { type: 'subheading', value: 'אביב (מרץ–מאי) — העונה הפופולרית ביותר' },
      { type: 'list', items: [
        'טמפרטורות נעימות ומשתנות (0°C עד 15°C בגובה 3500 מ\').',
        'פריחת ראודנדרון (Rhododendron) — יערות ורודים ואדומים.',
        'נוף מובהק לרוב.',
        'הכי עמוס: אפריל-מאי הם גם עונת הטיפוס לאוורסט.',
      ]},
      { type: 'subheading', value: 'סתיו (ספטמבר–נובמבר) — האלטרנטיבה המצוינת' },
      { type: 'list', items: [
        'שמיים בדרך כלל צלולים אחרי עונת המונסון.',
        'פחות עמוס מהאביב.',
        'טמפרטורות נמוכות יותר מדצמבר ואילך.',
        'נובמבר — קר יותר אך שמיים קריסטל.',
      ]},

      { type: 'heading', value: '3. המסלול: שלב אחר שלב' },
      { type: 'text', value: 'הנה המסלול הקלאסי לבייס קמפ, עם לוח הזמנים המומלץ:' },
      { type: 'list', items: [
        'יום 1: קטמנדו → לוקלה (טיסה) → פקדינג (2610 מ\'). הליכה קצרה 3 שע\'.',
        'יום 2: פקדינג → נמצ\'ה בזאר (3440 מ\'). עלייה 800 מ\', 5-6 שע\'.',
        'ימים 3-4: מנוחה/התאקלמות בנמצ\'ה בזאר. שדה תעופה בגובה, שוק, מרכז תרבות שרפה.',
        'יום 5: נמצ\'ה → טיאנגבוצ\'ה (3867 מ\'). 3-4 שע\'.',
        'יום 6: טיאנגבוצ\'ה → פנגבוצ\'ה (3985 מ\'). ביקור ב-Tengboche Monastery.',
        'יום 7: פנגבוצ\'ה → דינגבוצ\'ה (4410 מ\'). כניסה לאזור הגובה הגבוה.',
        'יום 8: יום התאקלמות בדינגבוצ\'ה (עלייה לצוק Nangkartshang ל-5100 מ\').',
        'יום 9: דינגבוצ\'ה → לובוצ\'ה (4940 מ\'). טרנינג. 5-6 שע\'.',
        'יום 10: לובוצ\'ה → גורק שפ (5140 מ\'). יום קשה, 6-7 שע\'.',
        'יום 11: גורק שפ → בייס קמפ אוורסט (5364 מ\'). ← פסגת הטרק!',
        'ימים 12-14: ירידה חזרה ללוקלה.',
      ]},

      { type: 'heading', value: '4. התאקלמות — הסוד להצלחה' },
      { type: 'text', value: 'מחלת גבהים (AMS — Acute Mountain Sickness) היא הסיבה המרכזית לנשירה בטרק לבייס קמפ. הגוף צריך זמן להסתגל לירידה בלחץ החמצן, ואין קיצורי דרך.' },
      { type: 'subheading', value: 'כלל הזהב' },
      { type: 'text', value: '"Climb High, Sleep Low" — תמיד ישנים נמוך ממה שטיפסתם. לכן, ימי המנוחה בנמצ\'ה ודינגבוצ\'ה קריטיים — לא אופציונליים.' },
      { type: 'subheading', value: 'סימני אזהרה' },
      { type: 'list', items: [
        'כאב ראש שאינו חולף אחרי מנוחה ושתיית מים.',
        'בחילה / הקאה.',
        'עייפות קיצונית שאינה פרופורציונלית לקצב ההליכה.',
        'בצקת (נפיחות) בפנים, ידיים או רגליים.',
        'קוצר נשימה במנוחה — אות מסוכן מאוד, דורש ירידה מיידית.',
      ]},

      { type: 'heading', value: '5. ציוד חיוני לטרק EBC' },
      { type: 'text', value: 'הטרק לבייס קמפ אינו דורש ציוד טיפוס טכני, אך הוא דורש ציוד איכותי לגובה ולקור.' },
      { type: 'subheading', value: 'ביגוד' },
      { type: 'list', items: [
        'שכבת בסיס תרמית, פליז, מעיל Gore-Tex, מכנסי טרק.',
        'מעיל פוך כבד לשימוש מהגובה 4000 מ\' ומעלה.',
        'כפיה (balaclava), כיסויי אוזניים, שלוש שכבות כפפות.',
      ]},
      { type: 'subheading', value: 'ציוד שינה' },
      { type: 'list', items: [
        'שק שינה בדירוג Comfort -10°C לפחות (ב-EBC עצמו עד -15°C).',
        'שכבת גרב עבות לשינה.',
      ]},
      { type: 'subheading', value: 'בריאות ובטיחות' },
      { type: 'list', items: [
        'מד-רוויה (Pulse Oximeter) — מוכרח לניטור יומי.',
        'Diamox (לאחר ייעוץ רפואי) — מסייע להתאקלמות.',
        'כדורים נגד בחילה ושלשול.',
        'מנורת ראש + סוללות רזרבה.',
      ]},

      { type: 'heading', value: '6. לינה אורחות ו-Teahouses' },
      { type: 'text', value: 'לאורך כל המסלול יש בתי אירוח מקומיים הנקראים "Teahouses" (בתי תה). אלו מציעות חדרי שינה פשוטים ומזון חם לאורך כל הדרך. עלות לינה ממוצעת: 5-15 דולר ללילה. הארוחות (Dhal Bhat, ספגטי, מרק) עולות 5-10 דולר לארוחה.' },
      { type: 'list', items: [
        'בנמצ\'ה ובטיאנגבוצ\'ה יש WiFi ואפשרות לטעינת מכשירים.',
        'מגובה 4000 מ\' ומעלה — האינטרנט לא תמיד עובד.',
        'מים: שתו רק מים מבושלים או מסוננים. לא לשתות מים ישירות מהנהרות.',
        'שירותים: חלק מהמלונות יש שירותים חמים — ציינו שזה חשוב לכם.',
      ]},

      { type: 'heading', value: '7. עלות הטרק' },
      { type: 'text', value: 'הנה תמחיר משוער לטרק עצמאי (לא כולל חבילת HighAir):' },
      { type: 'list', items: [
        'טיסה בינלאומית ל/מ-קטמנדו: 800-1500 דולר (מישראל).',
        'טיסה קטמנדו–לוקלה הלוך-חזור: 350-450 דולר.',
        'אישור כניסה לפארק (TIMS + Sagarmatha NP Permit): 50-70 דולר.',
        'לינה + אוכל לאורך הטרק: 30-50 דולר ליום.',
        'מדריך מקומי (חובה על פי תקנה חדשה): 30-50 דולר ליום.',
        'ציוד + ביטוח: 1000-3000 דולר (אם צריך לרכוש).',
        'סה"כ: 2500-5000 דולר לטרק עצמאי.',
      ]},

      { type: 'heading', value: '8. שאלות לוגיסטיות' },
      { type: 'subheading', value: 'האם צריך מדריך?' },
      { type: 'text', value: 'מסוף 2023, ממשלת נפאל דרשה מכל מטיילים זרים ברכסי הימלאיה להיות מלווים בגייד מורשה או פורטר. הסיבה: אחרי מקרים של מטיילים שנעלמו. ב-HighAir כל משלחת כוללת מדריך ישראלי ומדריך נפאלי מקומי.' },
      { type: 'subheading', value: 'כיצד מגיעים ללוקלה?' },
      { type: 'text', value: 'הדרך הנפוצה: טיסה פנים-נפאלית מקטמנדו (Tribhuvan Airport) ללוקלה (Tenzing-Hillary Airport). הטיסה אורכת כ-35 דקות. שדה התעופה של לוקלה נחשב לאחד האתגרים ביותר בעולם בשל מסלול הנחיתה הקצר על מדרון.' },
      { type: 'subheading', value: 'מה מד-הרוויה?' },
      { type: 'text', value: 'מד-רוויה הוא מכשיר קטן וזול (30-80 שקל) שמודד את רמת החמצן בדם (SpO2). ערך תקין בגובה פני ים: 95-100%. בגובה 5000 מ\' ערך של 80-85% נחשב תקין. אם יורד מתחת ל-75% — ירידה מיידית.' },

      { type: 'heading', value: '9. גייד מנטלי למסע' },
      { type: 'text', value: 'הטרק לבייס קמפ הוא מסע ארוך. ימים 8-10 הם הקשים ביותר — גוף עייף, גובה שמורגש, ולעיתים מזג אוויר לא צפוי. הנה כמה טיפים מהניסיון שלנו:' },
      { type: 'list', items: [
        'אל תתחרו באחרים. כל גוף מגיב אחרת לגובה.',
        'שתו יותר ממה שאתם חושבים שצריך — לפחות 3-4 ליטר ביום.',
        'ישנו מוקדם. הגוף מתקן ומתאקלם בשינה.',
        'אל תדלגו על ימי ההתאקלמות. "אני מרגיש טוב" זה לא סיבה לדלג.',
        'הבייס קמפ לא הולך לשום מקום. אם גופכם לא מוכן — יש עוד הזדמנויות.',
      ]},

      { type: 'section', value: 'שאלות נפוצות על הטרק לבייס קמפ אוורסט' },

      { type: 'heading', value: 'כמה ימים לוקח הטרק לבייס קמפ?' },
      { type: 'text', value: 'הטרק המלא הלוך-חזור (מלוקלה ובחזרה) לוקח 12-16 ימים. אנחנו ממליצים על 14-16 ימים לאפשרות התאקלמות אופטימלית. ניתן לעשות אותו ב-12 ימים "בדחיפה", אך זה מגדיל משמעותית את הסיכון לAMS.' },

      { type: 'heading', value: 'עד כמה קשה הטרק?' },
      { type: 'text', value: 'הטרק לבייס קמפ נחשב לטרק "קשה אך לא מסוכן" עבור מי שמוכן אליו. אין צורך בניסיון טיפוס קודם. האתגר העיקרי הוא הגובה ומשך הטרק. עם הכנה גופנית טובה ורצינות לגבי ימי ההתאקלמות, רוב האנשים יכולים להגיע לבייס קמפ.' },

      { type: 'heading', value: 'האם חובה לקחת ביטוח?' },
      { type: 'text', value: 'חובה. הביטוח חייב לכלול כיסוי לחילוץ בהליקופטר (Helicopter evacuation) עד גובה 6000 מ\'. מחיר חילוץ בהליקופטר בנפאל: 5000-15000 דולר. זה לא אופציונלי.' },

      { type: 'heading', value: 'מה ההבדל בין EBC לבין הטיפוס לפסגת האוורסט?' },
      { type: 'text', value: 'הטרק לבייס קמפ (5364 מ\') הוא טרקינג — הליכה בשבילים. אין טיפוס טכני, אין ציוד מיוחד, ואין סכנה. הטיפוס לפסגת האוורסט (8848 מ\') הוא אחד האתגרים הקשים והמסוכנים בעולם, עולה עשרות אלפי דולרים ודורש ניסיון טיפוס נרחב.' },

      { type: 'heading', value: 'האם ניתן לטפס ל-Kala Patthar בדרך?' },
      { type: 'text', value: 'כן — וממש מומלץ! קאלה פטהר (5545 מ\') הוא גבעה ממש ליד גורק שפ שמהווה את נקודת הצפייה הטובה ביותר לאוורסט. רוב המטיילים עולים לשם בזריחה ביום שלפני הגעה לבייס קמפ — נוף מדהים.' },

      { type: 'section', value: 'מוכנים לצאת למסע?' },
      { type: 'text', value: 'הטרק לבייס קמפ אוורסט הוא חוויה שתלווה אתכם כל החיים. נופים שאין דומה להם, פגישה עם תרבות השרפה המרהיבה, והתחושה של עמידה בצל ההר הגבוה בעולם. HighAir תוביל אתכם שם בבטחה ובאהבה.' },
      { type: 'cta', text: 'לפרטים על משלחת בייס קמפ אוורסט', textEn: 'Everest Base Camp — Dates & Details', href: '/expedition/everest-base-camp' },
    ],

    /* ── English content ── */
    titleEn: 'Everest Base Camp Trek: The Complete Guide (2026) — Route, Gear & Acclimatisation',
    contentEn: [
      { type: 'text', value: 'Everest Base Camp (EBC) sits at 5364 metres in the heart of the Nepali Himalayas — and only 14-16 days of walking separate you from it. This is the world\'s most famous trek: ancient trails, stunning Sherpa villages, Tibetan Buddhist monasteries, and breathtaking views of Everest, Lhotse, Makalu, and Nuptse.' },
      { type: 'text', value: 'At HighAir Expeditions we have led dozens of groups to Base Camp. This guide summarises everything you need to know — from the route and essential gear to proper acclimatisation management.' },

      { type: 'image', src: '/images/blog/seven-summits-everest.webp', caption: 'Everest and Nuptse from the trail — a view you will never forget' },

      { type: 'heading', value: '1. What is the EBC Trek?' },
      { type: 'text', value: 'The Everest Base Camp trek is a high-altitude walking route in the Nepali Himalayas, leading from the town of Lukla (2840 m) through Namche Bazaar, Tengboche, and glacial moraines to Base Camp itself at 5364 m. Along the way you cross stunning mountain ranges and visit Sherpa villages and monasteries.' },
      { type: 'text', value: 'The full round-trip route covers approximately 130 km of walking with around 10000 m of cumulative ascent. Typical timeframe: 12-16 days. We recommend 14-16 days to allow adequate acclimatisation.' },

      { type: 'heading', value: '2. When to Go? Trekking Seasons' },
      { type: 'text', value: 'The trek to Base Camp is possible year-round, but there are two ideal seasons:' },
      { type: 'subheading', value: 'Spring (March–May) — the most popular season' },
      { type: 'list', items: [
        'Pleasant, variable temperatures (0°C to 15°C at 3500 m altitude).',
        'Rhododendron blooms — forests of pink and red.',
        'Generally clear views.',
        'Busiest period: April-May coincides with the Everest climbing season.',
      ]},
      { type: 'subheading', value: 'Autumn (September–November) — an excellent alternative' },
      { type: 'list', items: [
        'Usually clear skies after the monsoon season.',
        'Less crowded than spring.',
        'Lower temperatures from December onwards.',
        'November — colder but crystal-clear skies.',
      ]},

      { type: 'heading', value: '3. The Route: Stage by Stage' },
      { type: 'text', value: 'Here is the classic route to Base Camp, with the recommended schedule:' },
      { type: 'list', items: [
        'Day 1: Kathmandu → Lukla (flight) → Phakding (2610 m). Short 3-hour walk.',
        'Day 2: Phakding → Namche Bazaar (3440 m). 800 m ascent, 5-6 hours.',
        'Days 3-4: Rest/acclimatisation in Namche Bazaar. High-altitude airstrip, market, Sherpa cultural centre.',
        'Day 5: Namche → Tengboche (3867 m). 3-4 hours.',
        'Day 6: Tengboche → Pangboche (3985 m). Visit Tengboche Monastery.',
        'Day 7: Pangboche → Dingboche (4410 m). Entering the high-altitude zone.',
        'Day 8: Acclimatisation day in Dingboche (ascent to Nangkartshang peak at 5100 m).',
        'Day 9: Dingboche → Lobuche (4940 m). Challenging terrain, 5-6 hours.',
        'Day 10: Lobuche → Gorak Shep (5140 m). Hard day, 6-7 hours.',
        'Day 11: Gorak Shep → Everest Base Camp (5364 m). ← The trek\'s pinnacle!',
        'Days 12-14: Descent back to Lukla.',
      ]},

      { type: 'heading', value: '4. Acclimatisation — The Key to Success' },
      { type: 'text', value: 'Acute Mountain Sickness (AMS) is the main reason for dropout on the EBC trek. The body needs time to adjust to the reduced oxygen pressure, and there are no shortcuts.' },
      { type: 'subheading', value: 'The Golden Rule' },
      { type: 'text', value: '"Climb High, Sleep Low" — always sleep lower than you climbed. Therefore, the rest days in Namche and Dingboche are critical — not optional.' },
      { type: 'subheading', value: 'Warning Signs' },
      { type: 'list', items: [
        'Headache that does not resolve after rest and drinking water.',
        'Nausea or vomiting.',
        'Extreme fatigue disproportionate to the pace of walking.',
        'Oedema (swelling) in the face, hands, or legs.',
        'Shortness of breath at rest — a very dangerous sign requiring immediate descent.',
      ]},

      { type: 'heading', value: '5. Essential Gear for EBC' },
      { type: 'text', value: 'The EBC trek does not require technical climbing gear, but it does require quality gear for altitude and cold.' },
      { type: 'subheading', value: 'Clothing' },
      { type: 'list', items: [
        'Thermal base layer, fleece, Gore-Tex jacket, trekking trousers.',
        'Heavy down jacket for use above 4000 m.',
        'Balaclava, ear warmers, three layers of gloves.',
      ]},
      { type: 'subheading', value: 'Sleeping Equipment' },
      { type: 'list', items: [
        'Sleeping bag with Comfort rating of at least -10°C (at EBC itself up to -15°C).',
        'Thick sleeping socks.',
      ]},
      { type: 'subheading', value: 'Health and Safety' },
      { type: 'list', items: [
        'Pulse oximeter — mandatory for daily monitoring.',
        'Diamox (after medical consultation) — aids acclimatisation.',
        'Anti-nausea and anti-diarrhoea tablets.',
        'Headlamp + spare batteries.',
      ]},

      { type: 'heading', value: '6. Teahouses Along the Route' },
      { type: 'text', value: 'Along the entire route there are local guesthouses called "teahouses." These offer simple sleeping rooms and hot food throughout. Average accommodation cost: $5-15 per night. Meals (Dhal Bhat, pasta, soup) cost $5-10 per meal.' },
      { type: 'list', items: [
        'In Namche and Tengboche there is WiFi and device charging.',
        'Above 4000 m — internet does not always work.',
        'Water: drink only boiled or filtered water. Do not drink directly from streams.',
        'Toilets: some lodges have warm showers — mention this is important to you.',
      ]},

      { type: 'heading', value: '7. Cost of the Trek' },
      { type: 'text', value: 'Here is an approximate cost for an independent trek (not including a HighAir package):' },
      { type: 'list', items: [
        'International flights to/from Kathmandu: $800-1500.',
        'Kathmandu–Lukla flights (return): $350-450.',
        'Park entry permits (TIMS + Sagarmatha NP Permit): $50-70.',
        'Accommodation + food along the trek: $30-50 per day.',
        'Local guide (now mandatory by regulation): $30-50 per day.',
        'Gear + insurance: $1000-3000 (if purchasing new).',
        'Total: approximately $2500-5000 for an independent trek.',
      ]},

      { type: 'heading', value: '8. Mental Guide to the Journey' },
      { type: 'text', value: 'The EBC trek is a long journey. Days 8-10 are the hardest — a tired body, altitude taking its toll, and sometimes unpredictable weather. Here are some tips from our experience:' },
      { type: 'list', items: [
        'Don\'t compete with others. Every body responds differently to altitude.',
        'Drink more than you think you need — at least 3-4 litres per day.',
        'Sleep early. The body repairs and acclimatises during sleep.',
        'Don\'t skip acclimatisation days. "I feel fine" is not a reason to skip.',
        'Base Camp isn\'t going anywhere. If your body isn\'t ready — there are more opportunities.',
      ]},

      { type: 'section', value: 'Everest Base Camp Trek FAQ' },

      { type: 'heading', value: 'How many days does the EBC trek take?' },
      { type: 'text', value: 'The full round-trip trek (from Lukla and back) takes 12-16 days. We recommend 14-16 days for optimal acclimatisation. It can be done in 12 days at a push, but this significantly increases the risk of AMS.' },

      { type: 'heading', value: 'How hard is the EBC trek?' },
      { type: 'text', value: 'The EBC trek is considered "challenging but not dangerous" for those who are prepared. No prior climbing experience is required. The main challenge is the altitude and trek duration. With good physical preparation and taking acclimatisation days seriously, most people can reach Base Camp.' },

      { type: 'heading', value: 'Is travel insurance mandatory?' },
      { type: 'text', value: 'Yes — mandatory. Insurance must include helicopter evacuation coverage up to 6000 m altitude. Cost of helicopter rescue in Nepal: $5000-15000. This is not optional.' },

      { type: 'heading', value: 'What is the difference between EBC and climbing Everest\'s summit?' },
      { type: 'text', value: 'The EBC trek (5364 m) is trekking — walking on trails. There is no technical climbing, no special equipment, and no danger of this kind. Climbing Everest\'s summit (8848 m) is one of the hardest and most dangerous challenges in the world, costs tens of thousands of dollars, and requires extensive mountaineering experience.' },

      { type: 'heading', value: 'Can you climb Kala Patthar on the way?' },
      { type: 'text', value: 'Yes — and highly recommended! Kala Patthar (5545 m) is a small hill right next to Gorak Shep that offers the best viewing point for Everest. Most trekkers ascend it at sunrise on the day before reaching Base Camp — the view is extraordinary.' },

      { type: 'section', value: 'Ready for the Journey?' },
      { type: 'text', value: 'The Everest Base Camp trek is an experience that will stay with you for life. Unparalleled scenery, an encounter with the magnificent Sherpa culture, and the feeling of standing in the shadow of the world\'s highest mountain. HighAir will guide you there safely and with care.' },
      { type: 'cta', text: 'לפרטים על משלחת בייס קמפ אוורסט', textEn: 'Everest Base Camp — Dates & Details', href: '/expedition/everest-base-camp' },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
   *  id:5  altitude-sickness-guide  (2026-01-20)
   * ═══════════════════════════════════════════════════════════════════ */
  {
    id:       5,
    slug:     'altitude-sickness-guide',

    /* ── Hebrew ── */
    title:    'מחלת גבהים: המדריך המלא למניעה, זיהוי וטיפול (2026)',
    author:   'HighAir Expeditions',
    dateIso:  '2026-01-20',
    dateModified: '2026-04-29',
    dateHe:   '20 בינואר 2026',
    dateEn:   'January 20, 2026',
    category: 'בריאות',
    categoryEn: 'Health',
    img:         '/images/blog/kilimanjaro-machame.webp',
    imgPosition: 'center 40%',
    excerpt:  'מחלת גבהים (AMS) פוגעת ב-50% מהמטיילים מעל 3000 מ׳. מה הסימפטומים? איך מונעים? האם Diamox עוזר? המדריך המקיף לבריאות בגובה.',
    excerptEn: 'Altitude sickness (AMS) affects 50% of trekkers above 3000 m. What are the symptoms? How do you prevent it? Does Diamox work? The comprehensive guide to health at high altitude.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'מחלת גבהים, או בשמה הרפואי Acute Mountain Sickness (AMS), היא התגובה של הגוף לירידה ברמת החמצן בגובה רב. היא פוגעת בכ-50% מהמטיילים שעולים לגובה של 3000 מטר ומעלה, ואינה קשורה בהכרח לגיל, מגדר, כושר גופני או ניסיון טיפוס קודם. גם אלופי עולם בריצה סבלו ממנה בעצמת.' },
      { type: 'text', value: 'הבנת מחלת הגבהים — מה גורם לה, כיצד מזהים אותה ואיך מתמודדים איתה — היא מיומנות חיונית לכל מי שמתכנן טיול בגובה רב: קילימנג\'רו, בייס קמפ אוורסט, אנפורנה, אקונקגואה ואפילו אלברוס.' },

      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', caption: 'גובה רב = אוויר דליל. הגוף צריך זמן להסתגל' },

      { type: 'heading', value: '1. מה קורה לגוף בגובה רב?' },
      { type: 'text', value: 'כשאתם מתרוממים לגובה, לחץ האוויר יורד. אוויר בגובה 5000 מטר מכיל כ-50% פחות מולקולות חמצן מאשר בגובה פני הים. הלב מתחיל לעבוד קשה יותר, קצב הנשימה עולה, ואם הגוף לא מצליח להתאקלם מהר מספיק — מתחילות הבעיות.' },
      { type: 'text', value: 'ההתאקלמות (Acclimatization) היא התהליך שבו הגוף מייצר יותר תאי דם אדומים, ומשתנה אופן קשירת החמצן להמוגלובין. תהליך זה לוקח ימים ואי אפשר לזרז אותו באופן משמעותי.' },

      { type: 'heading', value: '2. שלושת רמות המחלה' },
      { type: 'subheading', value: 'AMS — מחלת גבהים חריפה (קלה)' },
      { type: 'text', value: 'הצורה הנפוצה ביותר. מופיעה בדרך כלל 6-12 שעות לאחר הגעה לגובה חדש. סימפטומים:' },
      { type: 'list', items: [
        'כאב ראש (הסימן הראשון תמיד).',
        'עייפות וחולשה.',
        'בחילה קלה ואיבוד תיאבון.',
        'קשיי שינה, ובמיוחד דפוס נשימה לא סדיר בלילה (Cheyne-Stokes Breathing).',
        'סחרחורת.',
      ]},
      { type: 'subheading', value: 'HACE — בצקת מוחית (חמורה)' },
      { type: 'text', value: 'נדירה אך מסוכנת. AMS שלא טופלה עלולה להתדרדר ל-HACE (High Altitude Cerebral Edema). סימני אזהרה:' },
      { type: 'list', items: [
        'בלבול, ירידה ביכולת החשיבה.',
        'קשיי הליכה / חוסר שיווי משקל (Ataxia) — בדקו ע"י הליכה בקו ישר.',
        'ישנוניות קיצונית.',
        'דיבור מבולבל.',
        'ירידה מיידית — עיכוב עלול לעלות בחיים.',
      ]},
      { type: 'subheading', value: 'HAPE — בצקת ריאתית (חמורה)' },
      { type: 'text', value: 'HAPE (High Altitude Pulmonary Edema) היא הגורם המוות השכיח ביותר בגובה רב. ניתן לזהות על ידי:' },
      { type: 'list', items: [
        'קוצר נשימה קיצוני גם במנוחה.',
        'שיעול יבש שמתפתח לשיעול עם ליחה ורודה / דמית.',
        'חוסר יכולת לשכב שטוח.',
        'עור כחלחל (Cyanosis) — חמצן בדם נמוך מאוד.',
        'ירידה מיידית + Dexamethasone (אם זמין) + הזמנת חילוץ.',
      ]},

      { type: 'heading', value: '3. גורמי סיכון' },
      { type: 'text', value: 'מי בסיכון גבוה יותר ל-AMS?' },
      { type: 'list', items: [
        'עלייה מהירה מדי לגובה — הגורם הנפוץ ביותר.',
        'היסטוריה אישית של AMS בעבר — אינדיקטור חזק לעתיד.',
        'שינה בגובה גבוה יחסית לגובה שהורגלת בו.',
        'התייבשות — מעצים תסמינים.',
        'מאמץ מוגבר ביום הראשון בגובה.',
        'הגעה לגובה רב ממקום נמוך בתוך שעות בודדות (כמו טיסה ישירה לקטמנדו).',
      ]},

      { type: 'heading', value: '4. מניעה — "Climb High, Sleep Low"' },
      { type: 'text', value: 'הכלל הזהוב למניעת מחלת גבהים הוא "Climb High, Sleep Low". עלו לגובה גבוה במהלך היום, אך חזרו לישון במחנה נמוך יותר. כך הגוף נחשף לגובה בהדרגה.' },
      { type: 'subheading', value: 'כלל הגובה 300-500 מטר' },
      { type: 'text', value: 'מעל 3000 מטר, אל תגדילו את גובה הלינה ביותר מ-300-500 מטר ליום. אחרי כל 1000 מטר של עלייה — קחו יום מנוחה מלא.' },
      { type: 'subheading', value: 'שתייה' },
      { type: 'text', value: 'שתו לפחות 3-4 ליטר מים ביום. התייבשות מחמירה תסמיני AMS ומקשה על ההתאקלמות. שתו לפני שאתם צמאים.' },
      { type: 'subheading', value: 'הימנעו מאלכוהול בימים הראשונים' },
      { type: 'text', value: 'אלכוהול מדכא נשימה, גורם להתייבשות ומשבש את שינה — שלושה גורמים שמחמירים AMS. הימנעו מאלכוהול ב-48 השעות הראשונות לפחות בכל גובה חדש.' },

      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'כושר גופני טוב עוזר — אבל לא מגן מפני AMS' },

      { type: 'heading', value: '5. Diamox — האם כדאי?' },
      { type: 'text', value: 'Diamox (Acetazolamide) היא תרופת מרשם שמזרזת את נשימתכם — הגוף "חושב" שהוא צריך לנשום יותר בגלל חומצה עודפת, ולכן שואב יותר חמצן. ב-HighAir, ממליצים לדון עם רופא מטיילים לפני כל משלחת.' },
      { type: 'subheading', value: 'יתרונות' },
      { type: 'list', items: [
        'מפחיתה משמעותית סיכוי ל-AMS בהרים גבוהים.',
        'מוכחת מחקרית כיעילה.',
        'מותרת לשימוש בישראל ובנפאל ללא בעיות רגולציה.',
      ]},
      { type: 'subheading', value: 'חסרונות ותופעות לוואי' },
      { type: 'list', items: [
        'גורמת להשתנה תכופה יותר.',
        'עלולה לגרום לתחושת עקצוץ בגפיים.',
        'אסורה לאנשים עם אלרגיה לסולפה.',
        'לא תחליף להתאקלמות — היא רק עוזרת, לא פותרת.',
      ]},
      { type: 'text', value: 'מינון נפוץ: 125-250 מ"ג פעמיים ביום. מומלץ להתחיל יומיים לפני העלייה לגובה ולהמשיך יום-יומיים לאחר הגעה לגובה המקסימלי.' },

      { type: 'heading', value: '6. מד-רוויה — כלי ההצלה הקטן' },
      { type: 'text', value: 'מד-רוויה (Pulse Oximeter) הוא מכשיר קטן וזול שמודד את אחוז הרוויה של החמצן בדם (SpO2) ואת דופק הלב. הוא יכול לזהות ירידה מסוכנת ברמת החמצן לפני שהסימפטומים מתפתחים.' },
      { type: 'list', items: [
        'SpO2 תקין בגובה פני ים: 95-100%.',
        'SpO2 "נורמלי" ב-5000 מ\': בסביבות 80-88%.',
        'SpO2 מתחת ל-75% בגובה — שקלו ירידה מיידית.',
        'SpO2 מתחת ל-65% בגובה — ירידה מיידית, חירום.',
      ]},
      { type: 'text', value: 'ב-HighAir, כל מדריך נושא מד-רוויה ובודק את כל חברי הקבוצה בכל בוקר ועם כניסה לגובה חדש.' },

      { type: 'heading', value: '7. טיפול — מה עושים כשמרגישים AMS' },
      { type: 'list', items: [
        'עצרו לעלות. אל תוסיפו גובה עד שתסמינים חולפים לחלוטין.',
        'שתו הרבה מים.',
        'קחו איבופרופן (400-600 מ"ג) לכאב ראש.',
        'מנוחה מלאה.',
        'אם אין שיפור תוך 24 שעות — רדו לפחות 300-500 מטר.',
        'במקרה של HACE/HAPE: ירידה מיידית + Dexamethasone 8 מ"ג IM/IV (אם זמין) + מיני-חמצן + חילוץ.',
        'לעולם אל "תישנו" על תסמינים ותעלו יותר. זה עלול לעלות בחיים.',
      ]},

      { type: 'heading', value: '8. הכנה לפני הטיול' },
      { type: 'list', items: [
        'בקרו אצל רופא מטיילים לפחות 4-6 שבועות לפני היציאה. קבלו מרשם ל-Diamox אם הוחלט.',
        'ספרו לרופא על כל תרופה שאתם נוטלים — חלקן עלולות לקיים אינטראקציה עם Diamox.',
        'הצהירו על כל בעיה קרדיולוגית/ריאתית קיימת — הן עלולות להחמיר בגובה.',
        'אם אתם מעשנים — הפסיקו לפחות חודש לפני הטיול. עישון מחמיר AMS.',
        'אם אתם סובלים מאנמיה — טפלו בה לפני הטיול. פחות תאי דם אדומים = פחות יעילות בנשיאת חמצן.',
      ]},

      { type: 'section', value: 'שאלות נפוצות על מחלת גבהים' },

      { type: 'heading', value: 'מה הגובה שבו מתחילה מחלת גבהים?' },
      { type: 'text', value: 'מחלת גבהים יכולה להתחיל כבר מגובה 2500 מטר, אך בדרך כלל מופיעה בגובה 3000 מטר ומעלה. ככל שגבוהים יותר ועולים מהר יותר — הסיכון גבוה יותר. בגובה 5000+ מ\', כמעט כולם חווים מידה כלשהי של AMS.' },

      { type: 'heading', value: 'האם כושר גופני גבוה מגן מפני AMS?' },
      { type: 'text', value: 'לא — זהו אחד המיתוסים הנפוצים ביותר. מחלת גבהים אינה קשורה לכושר. ספורטאים מקצועיים סבלו מAMS קשה, בעוד שאנשים בכושר ממוצע עלו ללא בעיות. מה שמשנה הוא קצב העלייה, ימי ההתאקלמות ורמות ה-SpO2 שלכם.' },

      { type: 'heading', value: 'האם אפשר לחזור לטפס אחרי AMS?' },
      { type: 'text', value: 'כן — לאחר שתסמיני AMS חלפו לחלוטין ורמות ה-SpO2 חזרו לנורמה. בדרך כלל נדרש יום-יומיים של מנוחה בגובה נמוך יותר. אל תחזרו לעלות עד לאישור המדריך.' },

      { type: 'heading', value: 'מה ההבדל בין AMS ל-HACE ל-HAPE?' },
      { type: 'text', value: 'AMS היא המצב הקל. HACE ו-HAPE הן צורות חמורות ומסכנות חיים. HACE היא בצקת מוחית (נוזל מסביב למוח), ו-HAPE היא בצקת ריאתית (נוזל בריאות). שתיהן מצריכות ירידה מיידית וטיפול רפואי. אם יש חשד — אל תחכו לאישור רפואי. רדו מיד.' },

      { type: 'heading', value: 'כמה עולה חילוץ בהליקופטר בנפאל?' },
      { type: 'text', value: 'חילוץ בהליקופטר בנפאל עולה בין 5000 ל-15000 דולר, תלוי בגובה ובמיקום. ביטוח נסיעות הכולל כיסוי לחילוץ הליקופטר הוא חובה מוחלטת לכל טרק בהימלאיה.' },

      { type: 'section', value: 'בטיחות קודמת — תמיד' },
      { type: 'text', value: 'מחלת גבהים היא סיכון אמיתי, אך עם ידע נכון ועמידה בפרוטוקולים — ניתן למנוע ולנהל אותה ביעילות. ב-HighAir, בטיחות המטיילים היא ערך עליון. כל המדריכים שלנו מוסמכים בעזרה ראשונה בסביבת גובה ונושאים ציוד רפואי לכל משלחת.' },
      { type: 'cta', text: 'לפרטים ורישום למשלחות שלנו', textEn: 'View Our Expeditions', href: '/expedition/kilimanjaro' },
    ],

    /* ── English content ── */
    titleEn: 'Altitude Sickness: The Complete Guide to Prevention, Recognition and Treatment (2026)',
    contentEn: [
      { type: 'text', value: 'Altitude sickness, medically known as Acute Mountain Sickness (AMS), is the body\'s response to reduced oxygen levels at high altitude. It affects approximately 50% of trekkers who ascend to 3000 metres or above, and is not necessarily related to age, gender, fitness level, or prior climbing experience. Even world-class athletes have suffered from it severely.' },
      { type: 'text', value: 'Understanding altitude sickness — what causes it, how to recognise it, and how to manage it — is an essential skill for anyone planning a high-altitude trip: Kilimanjaro, Everest Base Camp, Annapurna, Aconcagua, or even Elbrus.' },

      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', caption: 'High altitude = thin air. The body needs time to adapt' },

      { type: 'heading', value: '1. What Happens to the Body at High Altitude?' },
      { type: 'text', value: 'As you ascend to altitude, air pressure decreases. Air at 5000 metres contains approximately 50% fewer oxygen molecules than at sea level. The heart begins working harder, breathing rate increases, and if the body cannot acclimatise quickly enough — problems begin.' },
      { type: 'text', value: 'Acclimatisation is the process by which the body produces more red blood cells and changes how oxygen binds to haemoglobin. This process takes days and cannot be significantly accelerated.' },

      { type: 'heading', value: '2. The Three Levels of Altitude Illness' },
      { type: 'subheading', value: 'AMS — Acute Mountain Sickness (Mild)' },
      { type: 'text', value: 'The most common form. Usually appears 6-12 hours after arriving at a new altitude. Symptoms:' },
      { type: 'list', items: [
        'Headache (always the first sign).',
        'Fatigue and weakness.',
        'Mild nausea and loss of appetite.',
        'Sleep disturbances, particularly irregular breathing at night (Cheyne-Stokes breathing).',
        'Dizziness.',
      ]},
      { type: 'subheading', value: 'HACE — High Altitude Cerebral Oedema (Severe)' },
      { type: 'text', value: 'Rare but dangerous. Untreated AMS can deteriorate into HACE. Warning signs:' },
      { type: 'list', items: [
        'Confusion, impaired thinking.',
        'Difficulty walking / loss of balance (ataxia) — test by walking in a straight line.',
        'Extreme drowsiness.',
        'Slurred speech.',
        'Immediate descent required — delay can be fatal.',
      ]},
      { type: 'subheading', value: 'HAPE — High Altitude Pulmonary Oedema (Severe)' },
      { type: 'text', value: 'HAPE is the most common cause of death at high altitude. It can be identified by:' },
      { type: 'list', items: [
        'Extreme breathlessness even at rest.',
        'Dry cough developing into a cough with pink/blood-tinged sputum.',
        'Inability to lie flat.',
        'Bluish skin (cyanosis) — very low blood oxygen.',
        'Immediate descent + Dexamethasone (if available) + oxygen + call for rescue.',
      ]},

      { type: 'heading', value: '3. Risk Factors' },
      { type: 'text', value: 'Who is at higher risk of AMS?' },
      { type: 'list', items: [
        'Ascending too rapidly — the most common cause.',
        'Personal history of AMS — a strong predictor for the future.',
        'Sleeping at a higher altitude than you are accustomed to.',
        'Dehydration — amplifies symptoms.',
        'Excessive exertion on the first day at altitude.',
        'Arriving at high altitude from a low elevation in just a few hours (e.g. a direct flight to Kathmandu).',
      ]},

      { type: 'heading', value: '4. Prevention — "Climb High, Sleep Low"' },
      { type: 'text', value: 'The golden rule for preventing altitude sickness is "Climb High, Sleep Low." Ascend to a higher altitude during the day, but return to sleep at a lower camp. This way the body is exposed to altitude gradually.' },
      { type: 'subheading', value: 'The 300-500 Metre Rule' },
      { type: 'text', value: 'Above 3000 metres, do not increase your sleeping altitude by more than 300-500 metres per day. After every 1000 metres of ascent — take a full rest day.' },
      { type: 'subheading', value: 'Hydration' },
      { type: 'text', value: 'Drink at least 3-4 litres of water per day. Dehydration worsens AMS symptoms and impairs acclimatisation. Drink before you feel thirsty.' },
      { type: 'subheading', value: 'Avoid Alcohol in the First Days' },
      { type: 'text', value: 'Alcohol suppresses breathing, causes dehydration, and disrupts sleep — three factors that worsen AMS. Avoid alcohol for at least the first 48 hours at any new altitude.' },

      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'Good fitness helps — but does not protect against AMS' },

      { type: 'heading', value: '5. Diamox — Is It Worth It?' },
      { type: 'text', value: 'Diamox (Acetazolamide) is a prescription medication that accelerates your breathing — the body "thinks" it needs to breathe more due to excess acidity, and therefore absorbs more oxygen. At HighAir, we recommend discussing it with a travel physician before any expedition.' },
      { type: 'subheading', value: 'Benefits' },
      { type: 'list', items: [
        'Significantly reduces the likelihood of AMS at high altitudes.',
        'Research-proven effectiveness.',
        'Permitted for use without regulatory issues.',
      ]},
      { type: 'subheading', value: 'Drawbacks and Side Effects' },
      { type: 'list', items: [
        'Causes more frequent urination.',
        'May cause tingling sensations in the extremities.',
        'Contraindicated for people with sulpha allergies.',
        'Not a substitute for acclimatisation — it helps, but does not replace it.',
      ]},
      { type: 'text', value: 'Common dosage: 125-250 mg twice daily. It is recommended to begin two days before ascending and continue for one or two days after reaching maximum altitude.' },

      { type: 'heading', value: '6. Pulse Oximeter — The Small Life-Saver' },
      { type: 'text', value: 'A pulse oximeter is a small, inexpensive device that measures the percentage of oxygen saturation in the blood (SpO2) and heart rate. It can detect a dangerous drop in oxygen levels before symptoms develop.' },
      { type: 'list', items: [
        'Normal SpO2 at sea level: 95-100%.',
        '"Normal" SpO2 at 5000 m: approximately 80-88%.',
        'SpO2 below 75% at altitude — consider immediate descent.',
        'SpO2 below 65% at altitude — immediate descent, emergency situation.',
      ]},
      { type: 'text', value: 'At HighAir, every guide carries a pulse oximeter and checks all group members every morning and upon arrival at any new altitude.' },

      { type: 'heading', value: '7. Treatment — What to Do When You Feel AMS' },
      { type: 'list', items: [
        'Stop ascending. Do not gain altitude until symptoms have completely resolved.',
        'Drink plenty of water.',
        'Take ibuprofen (400-600 mg) for headache.',
        'Rest completely.',
        'If no improvement within 24 hours — descend at least 300-500 metres.',
        'In case of HACE/HAPE: immediate descent + Dexamethasone 8 mg IM/IV (if available) + supplemental oxygen + call for rescue.',
        'Never "sleep it off" and continue ascending. This can be fatal.',
      ]},

      { type: 'heading', value: '8. Pre-Trip Preparation' },
      { type: 'list', items: [
        'Visit a travel medicine physician at least 4-6 weeks before departure. Get a Diamox prescription if appropriate.',
        'Inform your doctor about all medications you take — some may interact with Diamox.',
        'Disclose any existing cardiovascular or pulmonary conditions — they may worsen at altitude.',
        'If you smoke — stop at least one month before the trip. Smoking worsens AMS.',
        'If you have anaemia — treat it before the trip. Fewer red blood cells means less efficient oxygen transport.',
      ]},

      { type: 'section', value: 'Altitude Sickness FAQ' },

      { type: 'heading', value: 'At what altitude does altitude sickness begin?' },
      { type: 'text', value: 'Altitude sickness can begin as low as 2500 metres, but typically appears at 3000 metres and above. The higher you go and the faster you ascend, the greater the risk. Above 5000 m, almost everyone experiences some degree of AMS.' },

      { type: 'heading', value: 'Does high fitness protect against AMS?' },
      { type: 'text', value: 'No — this is one of the most common myths. Altitude sickness is not related to fitness. Professional athletes have suffered severe AMS, while people of average fitness have ascended without problems. What matters is your rate of ascent, acclimatisation days, and your SpO2 levels.' },

      { type: 'heading', value: 'Can you climb again after AMS?' },
      { type: 'text', value: 'Yes — after AMS symptoms have completely resolved and SpO2 levels have returned to normal. Typically one to two days of rest at a lower altitude are required. Do not resume ascending until cleared by your guide.' },

      { type: 'heading', value: 'What is the difference between AMS, HACE, and HAPE?' },
      { type: 'text', value: 'AMS is the mild condition. HACE and HAPE are severe, life-threatening forms. HACE is cerebral oedema (fluid around the brain), and HAPE is pulmonary oedema (fluid in the lungs). Both require immediate descent and medical treatment. If suspected — do not wait for medical confirmation. Descend immediately.' },

      { type: 'heading', value: 'How much does a helicopter rescue cost in Nepal?' },
      { type: 'text', value: 'Helicopter rescue in Nepal costs between $5000 and $15000, depending on altitude and location. Travel insurance that includes helicopter evacuation coverage is an absolute necessity for any trek in the Himalayas.' },

      { type: 'section', value: 'Safety Always Comes First' },
      { type: 'text', value: 'Altitude sickness is a real risk, but with the right knowledge and adherence to protocols — it can be effectively prevented and managed. At HighAir, trekker safety is our highest priority. All our guides are certified in wilderness first aid at altitude and carry medical equipment on every expedition.' },
      { type: 'cta', text: 'לפרטים ורישום למשלחות שלנו', textEn: 'View Our Expeditions', href: '/expedition/kilimanjaro' },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
   *  id:2  kilimanjaro-guide  (2025-12-13)
   * ═══════════════════════════════════════════════════════════════════ */
  {
    id:       2,
    slug:     'kilimanjaro-guide',

    /* ── Hebrew ── */
    title:    'המדריך המלא לטיפוס על הקילימנג\'רו (2025): כל מה שצריך לדעת לפני שיוצאים לפסגה',
    author:   'HighAir Expeditions',
    dateIso:  '2025-12-13',
    dateModified: '2026-04-29',
    dateHe:   '13 בדצמבר 2025',
    dateEn:   'December 13, 2025',
    category: 'מדריכים',
    categoryEn: 'Guides',
    img:         '/images/blog/kilimanjaro-trekkers.webp',
    imgPosition: 'center 40%',
    excerpt:  'הקילימנג\'רו — 5895 מ׳, גג אפריקה. כמה ימים לוקח? מתי לטפס? האם זה קשה? המדריך השלם: אימונים, ציוד, מסלולים, מחלת גבהים ועוד.',
    excerptEn: 'Kilimanjaro — 5895 m, Roof of Africa. How many days? When to go? Is it hard? The complete guide: training, gear, acclimatization, routes, costs and more.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'לעמוד על "גג אפריקה" בגובה 5895 מטר, כשמתחתיכם עננים והשמש זורחת מעל הקרחונים, זה רגע שמשנה חיים. הר הקילימנג\'רו בטנזניה הוא אחד היעדים הנחשקים ביותר בעולם למטפסים, ובצדק: הוא נגיש יחסית (אין צורך בציוד טכני מורכב), הנופים בו עוצרי נשימה, והוא מהווה את שער הכניסה האולטימטיבי לעולם טיפוס ההרים.' },
      { type: 'text', value: 'אבל אל תטעו: למרות שהוא נחשב "פסגת טרקינג", הטיפוס לקילימנג\'רו הוא מסע פיזי ומנטלי רציני הדורש הכנה מוקדמת קפדנית. ב-HighAir Expeditions ליווינו מאות מטיילים אל הפסגה, וריכזנו עבורכם את המדריך המקיף ביותר ברשת: החל מתוכנית האימונים, דרך רשימת הציוד המומלצת ועד לטיפים הקטנים שיעשו את ההבדל.' },
      { type: 'text', value: 'גזרו ושמרו – זהו המדריך שלכם לפסגה.' },

      { type: 'image', src: '/images/blog/kilimanjaro-trekkers.webp', caption: 'קבוצת מטיילים בדרך לפסגת הקילימנג\'רו' },

      { type: 'heading', value: '1. איך מתאמנים לטיפוס?' },
      { type: 'text', value: 'המיתוס הנפוץ הוא שצריך להיות מרתוניסט כדי לטפס את הקילימנג\'רו. האמת היא שטיפוס הרים דורש משהו אחר לגמרי: סיבולת לב-ריאה וכוח רגליים. המסע נמשך כ-6-7 ימים, בהם הולכים שעות רבות בשיפוע, באוויר שהולך ומידלדל.' },
      { type: 'subheading', value: 'שלושת עמודי התווך של האימון' },
      { type: 'list', items: [
        'אירובי (סיבולת): לפחות 3 חודשים לפני המסע, שלבו אימוני הליכה בשיפוע (על הליכון או בחוץ), ריצה קלה, שחייה או רכיבה על אופניים. המטרה היא להרגיל את הגוף למאמץ מתמשך בדופק בינוני.',
        'חיזוק שרירים: התמקדו בשרירי הרגליים (ארבע-ראשי ותאומים) בעזרת סקוואטים ולאנג\'ים. אל תזניחו את שרירי הליבה (בטן וגב) – הם אלו שמחזיקים אתכם זקופים עם התיק על הגב.',
        '"הדבר האמיתי": אין תחליף להליכה בשטח. צאו בסופי השבוע למסלולים בארץ עם תיק גב במשקל 5-7 ק"ג ונעלי הטרקים שלכם.',
      ]},
      { type: 'text', value: 'רוצים להתאמן איתנו? הצטרפו לקהילת המטיילים של HighAir בטיולי ההכנה החודשיים שלנו בארץ.' },
      { type: 'image', src: '/images/blog/kilimanjaro-layers.jpg', caption: 'קבוצת מטיילים בטיול הכנה לקילימנג\'רו של HighAir' },

      { type: 'heading', value: '2. הציוד שיעשה את ההבדל' },
      { type: 'text', value: 'בדרך לפסגה עוברים דרך אזורי אקלים קיצוניים ושונים: מהיער הטרופי הלח בתחתית, דרך הסוואנה המדברית, ועד למדבר האלפיני והקרחונים בפסגה. בליל הפסגה, הטמפרטורה יכולה לצנוח למינוס 10 ואף למינוס 15 מעלות. הסוד להתמודדות עם השינויים הוא שיטת השכבות.' },
      { type: 'subheading', value: 'רשימת השכבות המומלצת' },
      { type: 'list', items: [
        'שכבת בסיס (Base Layer): ביגוד תרמי מנדף זיעה שיושב צמוד על הגוף ושומר עליכם יבשים. כלל ברזל: הימנעו מכותנה לחלוטין — כותנה סופגת זיעה וקופאת בקור.',
        'שכבת ביניים (Mid Layer): פליז איכותי או מעיל קל/סינתטי שנועד ללכוד את חום הגוף (בידוד).',
        'שכבה חיצונית (Shell): מעיל פוך איכותי ועבה לליל הפסגה, ומעיל גשם/רוח (Gore-Tex) להגנה מפני הגשם.',
      ]},
      { type: 'subheading', value: 'ציוד קריטי נוסף' },
      { type: 'list', items: [
        'נעלי טרקים: חסינות למים, תומכות בקרסול, והכי חשוב – נעולות בטיולים קודמים. הגעה עם נעליים חדשות מהקופסה היא מתכון בטוח ליבלות.',
        'שק שינה: שק שינה איכותי בדירוג Comfort של מינוס 5 מעלות לפחות.',
        'תיק יום (Daypack): בנפח 30-40 ליטר, עם מערכת גב נוחה לנשיאת מים, שכבות וציוד אישי.',
      ]},
      { type: 'text', value: 'חסר לכם ציוד משלים? בחנות הציוד שלנו תמצאו דאפל-באג איכותי, כיסויי גשם ובקבוקים עמידים שישרתו אתכם במסע.' },
      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'מטיילות מצוידות בביגוד לפי שיטת השכבות בדרך לפסגת הקילימנג\'רו' },

      { type: 'heading', value: '3. התאקלמות ומחלת גבהים' },
      { type: 'text', value: 'האתגר הגדול בקילימנג\'רו הוא לא השיפוע, אלא הגובה. האוויר בפסגה מכיל כ-50% פחות חמצן מאשר בגובה פני הים. הגוף האנושי יודע להסתגל לכך מצוין, אבל הוא זקוק לזמן.' },
      { type: 'subheading', value: 'טיפים לשיפור ההתאקלמות' },
      { type: 'list', items: [
        '"פולה פולה" (Pole Pole): זהו המשפט שתשמעו הכי הרבה מהמדריכים בטנזניה — "לאט לאט". הקצב צריך להיות איטי במכוון, כדי לאפשר לגוף להסתגל ולחסוך באנרגיה יקרה.',
        'שתו מים: בגובה הגוף מאבד נוזלים במהירות. הקפידו לשתות 3-4 ליטר מים ביום.',
        'תרופות: התייעצו עם רופא מטיילים לגבי כדורי "דיאמוקס" (Diamox), המזרזים את תהליך ההתאקלמות.',
        'ניטור רפואי: במשלחות של HighAir אנו מצוידים במד-רוויה ובודקים את המדדים של כל מטייל מידי בוקר וערב.',
      ]},

      { type: 'heading', value: '4. החיים על ההר' },
      { type: 'text', value: 'הרבה מטיילים חוששים מתנאי המחיה בשטח, אבל המציאות מפתיעה לטובה. המשלחות שלנו הן בסטנדרט "פול סרוויס" מפנק.' },
      { type: 'list', items: [
        'איפה ישנים? הלינה מתבצעת באוהלי 4 עונות איכותיים וזוגיים, המוקמים עבורכם על ידי צוות הפורטרים. אתם מגיעים למחנה כשהאוהל כבר מוכן.',
        'מה אוכלים? טבח צמוד למשלחת מכין ארוחות חמות, מזינות וטריות בכל יום. יש התאמה מלאה לצמחונים, טבעונים ורגישויות – רק תעדכנו מראש.',
        'שירותים והיגיינה: ישנם בתי שימוש ציבוריים, אך אנו דואגים לאוהל שירותים פרטי לקבוצה. במקום מקלחות משתמשים במגבונים לחים וקערת מים חמים בוקר וערב ("Washy Washy").',
      ]},

      { type: 'image', src: '/images/blog/kilimanjaro-camp.avif', caption: 'לינה באוהלי איכות במחנות הקילימנג\'רו' },

      { type: 'heading', value: '5. הצוות המלווה וטיפים' },
      { type: 'text', value: 'אי אפשר להעפיל לפסגה בלי הצוות המקומי המדהים שלנו. על כל מטייל יש כ-3-4 אנשי צוות: מדריכים ראשיים, עוזרי מדריכים, טבחים ופורטרים שסוחבים את האוהלים, האוכל והציוד הכבד. נהוג ומקובל לתת טיפ לצוות בסוף המסע — זהו חלק משמעותי מהפרנסה שלהם. אנו ננחה אתכם לגבי הסכומים המדויקים לפני היציאה.' },

      { type: 'image', src: '/images/blog/kilimanjaro-porters.webp', caption: 'הצוות המקומי והפורטרים של המשלחת בטנזניה' },

      { type: 'heading', value: '6. חיסונים, ויזה וביטוח' },
      { type: 'list', items: [
        'חיסונים: גשו למרפאת מטיילים כחודש לפני הטיסה. בדרך כלל נדרש חיסון קדחת צהובה (Yellow Fever) וטיפול מונע למלריה.',
        'ויזה: ניתן להוציא ויזה לטנזניה אונליין (E-Visa) או בשדה התעופה בנחיתה (בעלות של 50$).',
        'ביטוח: חובה לעשות ביטוח הכולל הרחבה לספורט אתגרי וביטוח חילוץ והצלה. סוכני הביטוח שלנו ייצרו איתכם קשר.',
      ]},

      { type: 'heading', value: '7. בחירת המסלול הנכון' },
      { type: 'text', value: 'ב-HighAir אנו ממליצים ומובילים דרך מסלול מצ\'אמה (Machame Route). המסלול הזה נחשב ליפה ביותר מבחינת נופים, אך היתרון הגדול שלו הוא טופוגרפי: הוא מאפשר יישום של עקרון "Climb High, Sleep Low" — מטפסים לגובה רב במהלך היום, אך יורדים לישון במחנה נמוך יותר. שיטה זו משפרת דרמטית את יכולת ההתאקלמות ומעלה את אחוזי ההצלחה לכמעט 96%.' },

      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', caption: 'נוף עוצר נשימה מעל העננים במסלול מצ\'אמה' },

      { type: 'heading', value: '8. כסף והתנהלות בטנזניה' },
      { type: 'list', items: [
        'המטבע: דולר אמריקאי (USD).',
        'חשוב מאוד: הביאו רק שטרות חדשים (שהודפסו משנת 2009 ואילך). שטרות ישנים לא מתקבלים.',
        'כמה להביא? מומלץ להביא כ-200$ במזומן בשטרות קטנים (1$, 5$, 10$) לקניות מזכרות והוצאות אישיות.',
      ]},

      { type: 'heading', value: '9. הסיום המושלם בספארי' },
      { type: 'text', value: 'אחרי שכבשתם את הפסגה, מגיע לכם פינוק אמיתי. המשלחות שלנו ממשיכות ל-3 ימים מלאים של ספארי בשמורות הטבע המפורסמות (כמו טרנגירי ומכתש נגורונגורו). במהלך היום תראו אריות, פילים וג\'ירפות מקרוב, ובלילה תישנו בלודג\'ים מפנקים ויוקרתיים.' },
      { type: 'heading', value: '10. מתי הזמן הטוב ביותר לטפס על הקילימנג\'רו?' },
      { type: 'text', value: 'הקילימנג\'רו ניתן לטיפוס כל השנה, אך יש שתי "עונות שיא" בהן תנאי מזג האוויר הם הטובים ביותר:' },
      { type: 'list', items: [
        'ינואר–מרץ (עונת החורף היבשה): מזג אוויר יציב יחסית, שמיים צלולים ופחות מטיילים על ההר — מועד מצוין לאלו המעדיפים שקט.',
        'יוני–אוקטובר (עונת הקיץ היבשה): העונה הפופולרית ביותר עם תנאים טובים לטיפוס.',
        'להימנע: אפריל–מאי (עונת הגשמים הגדולה — "Long Rains") ונובמבר (עונת הגשמים הקצרה — "Short Rains").',
      ]},

      { type: 'section', value: 'שאלות נפוצות על הקילימנג\'רו' },

      { type: 'heading', value: 'כמה ימים לוקח לטפס קילימנג\'רו?' },
      { type: 'text', value: 'מסלול מצ\'אמה — המסלול שבו HighAir מובילה — נמשך 7 ימים (6 לילות על ההר). קיימים מסלולים קצרים יותר של 5–6 ימים, אך הם מקטינים משמעותית את אחוזי ההצלחה בשל פחות זמן להתאקלמות. אנחנו לא מתפשרים על כך.' },

      { type: 'heading', value: 'האם קילימנג\'רו קשה לטיפוס?' },
      { type: 'text', value: 'קילימנג\'רו אינו דורש כישורי טיפוס טכניים — אין צורך בחבלים, ציוד מיוחד או ניסיון טיפוס קודם. האתגר היחיד הוא הגובה: 5895 מטר. עם הכנה גופנית של 3 חודשים ומדריכים מנוסים, אחוזי ההצלחה במשלחות HighAir עומדים על כמעט 96%.' },

      { type: 'heading', value: 'מה הגובה של הקילימנג\'רו?' },
      { type: 'text', value: 'פסגת הקילימנג\'רו — "אוהורו פיק" (Uhuru Peak) — עומדת על 5895 מטר מעל פני הים. זהו ההר הגבוה ביותר באפריקה וההר העצמאי הגבוה ביותר בעולם.' },

      { type: 'heading', value: 'מה נכלל במשלחת הקילימנג\'רו של HighAir?' },
      { type: 'text', value: 'המשלחות של HighAir הן "פול סרוויס" מלא: הסעות בטנזניה, כניסה לפארק הלאומי, מדריכים ראשיים ועוזרים, פורטרים, טבח עם ארוחות חמות, אוהלי 4 עונות, ציוד מחנאות ואוהל שירותים פרטי. לאחר הטיפוס ממשיכים ל-3 ימי ספארי בשמורות הטבע.' },

      { type: 'heading', value: 'האם ישראלים יכולים לטפס על הקילימנג\'רו?' },
      { type: 'text', value: 'בהחלט. HighAir Expeditions היא חברת המשלחות הישראלית המובילה לקילימנג\'רו, עם מאות ישראלים שהעפילו לפסגה. המשלחות מתנהלות בעברית עם מדריכים ישראלים, ויש אפשרות לאוכל כשר.' },

      { type: 'section', value: 'מוכנים להגשים את החלום?' },
      { type: 'text', value: 'המסע לקילימנג\'רו הוא חוויה של פעם בחיים. עם ההכנה הנכונה והמעטפת המקצועית של HighAir, הפסגה נמצאת בהישג ידכם. ההר מחכה לכם — בואו לכבוש את הפסגה הבאה שלכם.' },
      { type: 'cta', text: 'לפרטים, תאריכים והרשמה לקילימנג\'רו', textEn: 'Kilimanjaro — Dates & Registration', href: '/expedition/kilimanjaro' },
    ],

    /* ── English content ── */
    titleEn: 'Climbing Kilimanjaro: The Complete Guide (2025) — Training, Gear, Routes & Summit Tips',
    contentEn: [
      { type: 'text', value: 'Standing on the "Roof of Africa" at 5895 metres, with clouds below you and the sun rising above the glaciers, is a life-changing moment. Mount Kilimanjaro in Tanzania is one of the most coveted destinations in the world for trekkers, and for good reason: it is relatively accessible (no complex technical gear required), the scenery is breathtaking, and it is the ultimate gateway into the world of mountaineering.' },
      { type: 'text', value: 'But don\'t be fooled: despite being considered a "trekking peak", the climb to Kilimanjaro is a serious physical and mental journey that requires thorough preparation. At HighAir Expeditions we have guided hundreds of trekkers to the summit, and we have compiled the most comprehensive guide you\'ll find online: from the training plan, through the recommended gear list, to the small tips that will make all the difference.' },
      { type: 'text', value: 'Save it — this is your guide to the summit.' },

      { type: 'image', src: '/images/blog/kilimanjaro-trekkers.webp', caption: 'Group of trekkers on the way to Kilimanjaro summit' },

      { type: 'heading', value: '1. How to Train for the Climb' },
      { type: 'text', value: 'The common myth is that you need to be a marathon runner to climb Kilimanjaro. The truth is that mountaineering demands something completely different: cardiovascular endurance and leg strength. The journey lasts approximately 6-7 days, during which you walk many hours on inclines in progressively thinning air.' },
      { type: 'subheading', value: 'The Three Training Pillars' },
      { type: 'list', items: [
        'Aerobic (Endurance): At least 3 months before the trip, incorporate uphill walking (on a treadmill or outdoors), light jogging, swimming or cycling. The goal is to accustom your body to sustained effort at a moderate heart rate.',
        'Strength training: Focus on leg muscles (quads and calves) with squats and lunges. Don\'t neglect your core (abs and back) — they\'re what keep you upright with a pack on your back.',
        '"The real thing": There\'s no substitute for hiking in the field. Head out on weekends on local trails with a 5-7 kg backpack and your hiking boots.',
      ]},
      { type: 'text', value: 'Want to train with us? Join the HighAir trekking community on our monthly preparation hikes.' },
      { type: 'image', src: '/images/blog/kilimanjaro-layers.jpg', caption: 'HighAir preparation hike — trekking with packs and gear' },

      { type: 'heading', value: '2. The Gear That Will Make the Difference' },
      { type: 'text', value: 'On the way to the summit you pass through extreme and varied climate zones: from the lush tropical forest at the base, through the alpine desert, to the glaciers at the summit. On summit night, the temperature can drop to minus 10 or even minus 15 degrees Celsius. The secret to handling these changes is the layering system.' },
      { type: 'subheading', value: 'The Recommended Layering System' },
      { type: 'list', items: [
        'Base Layer: Moisture-wicking thermal clothing (shirt and pants) that sits close to your body and keeps you dry. Iron rule: avoid cotton completely — cotton absorbs sweat and freezes in the cold.',
        'Mid Layer: Quality fleece or lightweight/synthetic jacket designed to trap body heat (insulation).',
        'Outer Layer (Shell): A quality heavy down jacket for summit night, and a rain/wind jacket (Gore-Tex) for rain protection.',
      ]},
      { type: 'subheading', value: 'Additional Critical Gear' },
      { type: 'list', items: [
        'Hiking boots: Waterproof, ankle-supportive, and most importantly — broken in on previous hikes. Arriving with brand-new boots is a sure recipe for blisters.',
        'Sleeping bag: A quality bag rated to at least -5°C Comfort.',
        'Daypack: 30-40 litre volume with a comfortable back system for water, layers and personal gear.',
      ]},
      { type: 'text', value: 'Missing some gear? In our gear store you\'ll find a quality duffel bag, rain covers and durable bottles that will serve you on the journey.' },
      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'Trekkers equipped with the layering system on the way to the summit' },

      { type: 'heading', value: '3. Acclimatization and Altitude Sickness' },
      { type: 'text', value: 'The biggest challenge on Kilimanjaro is not the gradient, but the altitude. The air at the summit contains about 50% less oxygen than at sea level. The human body knows how to adapt to this very well, but it needs time.' },
      { type: 'subheading', value: 'Tips for Better Acclimatization' },
      { type: 'list', items: [
        '"Pole Pole": This is the phrase you\'ll hear most from the guides in Tanzania. It means "slowly, slowly". The pace must be deliberately slow, to allow the body to adapt and conserve precious energy.',
        'Stay hydrated: At altitude, the body loses fluids quickly. Make sure to drink 3-4 litres of water per day.',
        'Medications: Consult a travel physician about Diamox tablets, which accelerate acclimatization and help prevent altitude sickness.',
        'Medical monitoring: On HighAir expeditions we use a pulse oximeter and check every trekker\'s readings each morning and evening.',
      ]},

      { type: 'heading', value: '4. Life on the Mountain' },
      { type: 'text', value: 'Many trekkers worry about living conditions in the field, but the reality is a pleasant surprise. Our expeditions operate to a "full service" standard.' },
      { type: 'list', items: [
        'Where do you sleep? In quality 4-season twin tents, set up for you by the porter team. You arrive at camp with the tent already ready.',
        'What do you eat? A dedicated cook prepares hot, nutritious and fresh meals every day. Full adaptation for vegetarians, vegans and dietary requirements — just let us know in advance.',
        'Toilets and hygiene: We provide a private toilet tent for the group. Since there are no showers on the mountain, we use wet wipes and a bowl of warm water each morning and evening ("Washy Washy").',
      ]},

      { type: 'image', src: '/images/blog/kilimanjaro-camp.avif', caption: 'Quality tent accommodation at Kilimanjaro camps' },

      { type: 'heading', value: '5. The Local Crew and Tipping' },
      { type: 'text', value: 'You cannot summit without our amazing local crew. For every trekker there are approximately 3-4 crew members: head guides, assistant guides, cooks and porters who carry the tents, food and heavy equipment. It is customary and expected to tip the crew at the end of the expedition — this is a significant part of their livelihood and a long-standing Tanzanian tradition. We will guide you on the exact amounts before departure.' },

      { type: 'image', src: '/images/blog/kilimanjaro-porters.webp', caption: 'The local crew and porters of the expedition in Tanzania' },

      { type: 'heading', value: '6. Vaccinations, Visa and Insurance' },
      { type: 'list', items: [
        'Vaccinations: Visit a travel medicine clinic about a month before your flight. Typically a Yellow Fever vaccination is required along with malaria prevention treatment.',
        'Visa: You can obtain a Tanzania visa online (E-Visa) or on arrival at the airport (cost: $50).',
        'Insurance: Mandatory travel insurance including adventure sports coverage and evacuation/rescue insurance. Our insurance agents will be in contact to assist.',
      ]},

      { type: 'heading', value: '7. Choosing the Right Route' },
      { type: 'text', value: 'At HighAir we recommend and guide via the Machame Route. This route is considered the most scenic, but its great advantage is topographical: it allows implementation of the "Climb High, Sleep Low" principle — during the day you climb to a great height, then descend to sleep at a lower camp. This method dramatically improves acclimatization and raises summit success rates to almost 96%.' },

      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', caption: 'Breathtaking view above the clouds on the Machame Route' },

      { type: 'heading', value: '8. Money in Tanzania' },
      { type: 'list', items: [
        'Currency: US Dollar (USD).',
        'Important: Bring only new bills (printed from 2009 onwards). Old notes are not accepted or are heavily discounted.',
        'How much to bring? Approximately $200 in small bills ($1, $5, $10) for souvenirs, drinks and personal expenses.',
      ]},

      { type: 'heading', value: '9. The Perfect Finish — Safari' },
      { type: 'text', value: 'After conquering the summit, you deserve a real treat. Our expeditions continue with 3 full days of safari in famous nature reserves (such as Tarangire and Ngorongoro Crater). During the day you\'ll see lions, elephants and giraffes up close, and at night you\'ll sleep in lavish luxury lodges.' },
      { type: 'heading', value: '10. When Is the Best Time to Climb Kilimanjaro?' },
      { type: 'text', value: 'Kilimanjaro can be climbed year-round, but two dry-season windows offer the best conditions:' },
      { type: 'list', items: [
        'January–March (winter dry season): Relatively stable weather, clear skies and fewer trekkers on the mountain — ideal for those who prefer quieter conditions.',
        'June–October (summer dry season): The most popular season with stable weather and excellent summit conditions.',
        'Avoid: April–May (Long Rains season) and November (Short Rains season).',
      ]},

      { type: 'section', value: 'Kilimanjaro FAQ' },

      { type: 'heading', value: 'How many days does it take to climb Kilimanjaro?' },
      { type: 'text', value: 'The Machame Route — which HighAir uses — takes 7 days (6 nights on the mountain). Shorter 5–6 day routes exist, but they significantly lower your summit success rate by reducing acclimatisation time. We don\'t compromise on this.' },

      { type: 'heading', value: 'Is Kilimanjaro hard to climb?' },
      { type: 'text', value: 'Kilimanjaro requires no technical climbing skills — no ropes, crampons or prior mountaineering experience needed. The one true challenge is the altitude: 5895 metres. With 3 months of basic fitness preparation and experienced guides, HighAir\'s summit success rate stands at nearly 96%.' },

      { type: 'heading', value: 'How high is Kilimanjaro?' },
      { type: 'text', value: 'Kilimanjaro\'s summit — Uhuru Peak — stands at 5895 metres (19341 ft) above sea level. It is the highest mountain in Africa and the highest free-standing mountain in the world.' },

      { type: 'heading', value: 'What is included in a HighAir Kilimanjaro expedition?' },
      { type: 'text', value: 'HighAir expeditions are full-service: transfers in Tanzania, national park entry fees, head and assistant guides, porters, a dedicated cook with full hot meals, 4-season tents, camp equipment and a private toilet tent. After the climb, 3 days of safari in famous nature reserves are included.' },

      { type: 'heading', value: 'Can beginners climb Kilimanjaro?' },
      { type: 'text', value: 'Yes. Kilimanjaro is the ideal first high-altitude mountain for beginners. No prior climbing experience is required — just a reasonable level of fitness and the right preparation. HighAir\'s guides support trekkers of all experience levels, from first-timers to seasoned mountaineers.' },

      { type: 'section', value: 'Ready to Make the Dream a Reality?' },
      { type: 'text', value: 'The journey to Kilimanjaro is a once-in-a-lifetime experience. With the right preparation and HighAir\'s professional support, the summit is within your reach. The mountain is waiting for you — come conquer your next summit.' },
      { type: 'cta', text: 'לפרטים, תאריכים והרשמה לקילימנג\'רו', textEn: 'Kilimanjaro — Dates & Registration', href: '/expedition/kilimanjaro' },
    ],
  },

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
    excerpt:  'שבע הפסגות: אוורסט, קילימנג\'רו, אלברוס, אקונקגואה ועוד. כמה זה עולה? מה הסדר המומלץ? שיאי עולם, רמות קושי ועובדות שלא ידעתם — המדריך המלא.',
    excerptEn: 'The Seven Summits: Everest, Kilimanjaro, Elbrus, Aconcagua and 3 more. Costs, difficulty, world records and the recommended climbing order — the complete guide.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text',    value: 'שבע הפסגות (Seven Summits) הן הפסגות הגבוהות ביותר בכל אחת משבע יבשות העולם: אוורסט באסיה (8848 מ׳), אקונקגואה בדרום אמריקה (6962 מ׳), דנאלי בצפון אמריקה (6190 מ׳), קילימנג\'רו באפריקה (5895 מ׳), אלברוס באירופה (5642 מ׳), וינסון מאסיף באנטארקטיקה (4892 מ׳) ופירמידת קרסטנסז באוקיאניה (4884 מ׳). פרויקט הטיפוס לשבע הפסגות נחשב לאחד האתגרים הגדולים והנחשקים ביותר בעולם הטיפוס, ומושך אליו מטפסים מכל רחבי העולם.' },
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
      { type: 'text',    value: 'לא על כולן. למשל, טיפוס על הקילימנג\'רו ללא מדריך מקומי וצוות תמיכה אינו מותר. הגבלה זו הגיונית, מכיוון שהיא מהווה מקור הכנסה חשוב לממשלה ולאזרחים המקומיים. טיפוס על האוורסט באופן עצמאי הוא גם קשה ביותר; נדרש אישור מהממשלה הנפאלית והם נדירים (רק 500 הונפקו ב-2023) ויקרים מאוד - 15000 דולר. טיפוס להר וינסון יכולה להיות מאורגנת רק על ידי החברה האמריקאית Antarctic Logistics & Expeditions LLC.' },

      { type: 'heading', value: 'איך להתכונן לאתגר?' },
      { type: 'text',    value: 'זה תלוי בניסיון הטיפוס ובכושר הגופני. אם אתה בכושר ממוצע או ירוד, התחל בהכנה גופנית כללית – ריצת שטח, שחייה, וכו\'. לאחר מכן, עבור לטיפוס. אם אתה בכושר מצוין, תוכל לצאת להרים כבר מחר. ניתן להתחיל להתאמן עם חברות טרקים בארץ, תטפס על פסגות קרובות ותצבור ניסיון. לחלופין, תוכל ללכת ישר לחברות מקצועיות ולטפס, למשל, על הקילימנג\'רו.' },

      { type: 'heading', value: 'כמה זה אמור לעלות?' },
      { type: 'text',    value: 'העלות תלויה באופן שבו אתה מארגן הכל. אתה יכול לקנות טיולים הכוללים הכל, או לארגן חלקים בעצמך. האפשרות החסכונית ביותר תעלה ככל הנראה לא פחות מ-120000 דולר. אוורסט הוא, כמובן, היקר ביותר, עם עלויות הנעות בין 36000 דולר ועד 200000 דולר. אם אתה לא מוכן ללוגיסטיקה מורכבת, אתה יכול לפנות לחברות טיולי הרים. לדוגמה, תוכנית אפשרית אחת היא: יוני – קילימנג\'רו, אוגוסט – אלברוס. דצמבר–פברואר: אקונקגואה ווינסון. אביב – אוורסט. בסתיו הבא, טפל בפירמידת קרסטנסז או וינסון מאסיף (אם לא נעשה קודם) ודנאלי בקיץ.' },

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
      { type: 'text',    value: 'The Seven Summits are the highest peaks on each of the world\'s seven continents: Everest in Asia (8848 m), Aconcagua in South America (6962 m), Denali in North America (6190 m), Kilimanjaro in Africa (5895 m), Elbrus in Europe (5642 m), Vinson Massif in Antarctica (4892 m), and Carstensz Pyramid in Oceania (4884 m). The Seven Summits project is considered one of the greatest and most coveted challenges in the mountaineering world, attracting climbers from every corner of the globe.' },
      { type: 'text',    value: 'We will cover what the Seven Summits are, the difficulty level of each mountain, which one is considered the easiest to climb, and we\'ll share historical facts, mountain names, world records, and essential information for mountaineers and mountain enthusiasts. If you dream of climbing mountains or want to learn more about the highest peaks on Earth, this guide is the perfect starting point.' },

      { type: 'heading', value: 'What is the Seven Summits Club?' },
      { type: 'text',    value: 'It is an informal community of climbers from around the world, united by a single passion: conquering the highest peak on each of the world\'s seven continents.' },
      { type: 'text',    value: 'For members of the Seven Summits Club, climbing these iconic mountains is not just a physical challenge — it is also a personal journey of growth, resilience, and self-discovery, alongside a unique cultural experience. Shared adventures forge strong bonds, a sense of camaraderie, and friendships that last for years.' },
      { type: 'text',    value: 'Among all the mountains, Kilimanjaro in Africa is considered the perfect gateway into this remarkable world. Thanks to its accessible routes and breathtaking scenery, it serves for many as the starting point on the journey toward the Seven Summits list, offering a first glimpse of the challenges, experiences, and personal fulfilment that accompany the path to the world\'s highest peaks.' },

      { type: 'image',   src: '/images/blog/seven-summits-everest.webp', caption: 'Everest and Nuptse — Photo: Alon Peleg' },

      { type: 'heading', value: 'So, what are the Seven Summits?' },
      { type: 'list',    items: [
        'Everest (Asia) — 8848 m',
        'Aconcagua (South America) — 6962 m',
        'Denali (North America) — 6190 m',
        'Kilimanjaro (Africa) — 5895 m',
        'Elbrus (Europe) — 5642 m',
        'Vinson Massif (Antarctica) — 4892 m',
        'Carstensz Pyramid (Oceania) — 4884 m',
        'Kosciuszko (Australia) — 2228 m',
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
      { type: 'text',    value: 'Climbing Everest, for example, can take up to two months and cost between $60000 and $75000. Not everyone has the means or the time required for such an undertaking.' },
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
      { type: 'text',    value: 'Not all of them. For example, climbing Kilimanjaro without a local guide and support crew is not permitted. This restriction makes sense, as it provides an important source of income for the government and local citizens. Climbing Everest independently is also extremely difficult; a permit from the Nepali government is required, they are rare (only 500 were issued in 2023) and very expensive — $15000. Climbing Vinson can only be organised through the American company Antarctic Logistics & Expeditions LLC.' },

      { type: 'heading', value: 'How do you prepare for the challenge?' },
      { type: 'text',    value: 'It depends on your climbing experience and physical fitness. If you are of average or below-average fitness, start with general physical conditioning — trail running, swimming, etc. Then move on to climbing. If you are in excellent shape, you can head to the mountains tomorrow. You can begin training with trekking companies locally, climb nearby peaks, and gain experience. Alternatively, you can go straight to professional companies and climb, for example, Kilimanjaro.' },

      { type: 'heading', value: 'How much should it cost?' },
      { type: 'text',    value: 'The cost depends on how you organise everything. You can buy all-inclusive trips or arrange parts yourself. The most economical option will likely cost no less than $120000. Everest is of course the most expensive, with costs ranging from $36000 to $200000. If you are not ready for complex logistics, you can turn to mountain tour companies. For example, one possible plan would be: June — Kilimanjaro, August — Elbrus, December–February: Aconcagua and Vinson, Spring — Everest. The following autumn, tackle Carstensz Pyramid or Vinson Massif (if not done earlier) and Denali in summer.' },

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
      { type: 'text',    value: 'Another famous challenge, involving climbing the 14 highest mountains in the world — all above 8000 metres. This is a particularly hard and dangerous challenge due to the extreme altitude and additional difficulties. Only experienced elite climbers attempt to complete the list, and even among them, very few succeed.' },
      { type: 'list',    noMarker: true, items: [
        '1. Everest (Nepal) — 8848 m',
        '2. K2 (Pakistan) — 8611 m',
        '3. Kangchenjunga (Nepal) — 8586 m',
        '4. Lhotse (Nepal) — 8516 m',
        '5. Makalu (Nepal) — 8485 m',
        '6. Cho Oyu (Nepal) — 8188 m',
        '7. Dhaulagiri (Nepal) — 8167 m',
        '8. Manaslu (Nepal) — 8156 m',
        '9. Nanga Parbat (Pakistan) — 8125 m',
        '10. Annapurna (Nepal) — 8091 m',
        '11. Gasherbrum I (Pakistan) — 8080 m',
        '12. Broad Peak (Pakistan) — 8051 m',
        '13. Gasherbrum II (Pakistan) — 8035 m',
        '14. Shishapangma (China) — 8027 m',
      ]},
      { type: 'text',    value: 'The record for the fastest completion of the "14×8000" challenge belongs to Norwegian climber Kristin Harila and Sherpa Tenjen Lama from Nepal, who achieved it in 92 days, breaking the previous record held by Nirmal Purja (Nimsdai), the greatest Nepali mountaineer of all time. Only around 50 people in the world have managed to summit all 14 peaks.' },
      { type: 'image',   src: '/images/blog/kristin-harila.webp', alt: 'Kristin Harila — one of the most famous climbers today', caption: 'Kristin Harila — one of the most famous climbers today', objectPosition: 'top' },
    ],
  },
];

export const CATEGORIES    = [...new Set(POSTS.map(p => p.category))];
export const CATEGORIES_EN = [...new Set(POSTS.map(p => p.categoryEn || p.category))];
