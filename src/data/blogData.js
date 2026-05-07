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
    excerpt:  'רשימת הציוד לטיפוס הרים: ביגוד בשכבות, נעלי טרק, שק שינה, תיק גב, ציוד בטיחות ועוד. מה לקחת, מה לשכור, ומה להשאיר בבית.',
    excerptEn: 'A practical mountain gear list covering layering, hiking boots, sleeping bags, backpacks, safety gear and more. What to pack, what to skip, and what to buy versus rent before your expedition.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'הציוד הנכון יכול להיות ההבדל בין מסע מהנה ובטוח לבין חוויה קשה ומסוכנת. כשמטפסים להר גבוה  -  בין אם זה קילימנג\'רו, אלברוס או אחת מפסגות הנפאל  -  הגוף נחשף לטמפרטורות קיצוניות, גשם, שלג ורוחות חזקות. ציוד מתאים לא רק מגן עליכם פיזית, אלא גם חוסך אנרגיה, מגביר ביטחון ומאפשר ליהנות מכל רגע במסע.' },
      { type: 'text', value: 'ב-HighAir Expeditions ליווינו אלפי מטיילים לכל קצות העולם, ויודעים בדיוק מה עובד ומה מוטב להשאיר בבית. הרשימה הזו מבוססת על ניסיון אמיתי מהשטח.' },

      { type: 'image', src: '/images/blog/kilimanjaro-layers.jpg', caption: 'ביגוד בשכבות  -  המפתח לנוחות בכל תנאי מזג אוויר' },

      { type: 'heading', value: '1. ביגוד  -  שיטת השכבות' },
      { type: 'text', value: 'עקרון השכבות הוא הבסיס לכל ביגוד טיפוס הרים. במקום בגד אחד כבד, לובשים מספר שכבות דקות שניתן להוסיף ולהסיר בהתאם לשינויי הטמפרטורה. הסוד: כל שכבה ממלאת תפקיד שונה.' },
      { type: 'subheading', value: 'שכבת בסיס (Base Layer)' },
      { type: 'list', items: [
        'חומר: פוליאסטר, מריו וול (Merino Wool) או כל בד סינתטי מנדף לחות. בשום אופן לא כותנה  -  כותנה סופגת זיעה, מתייבשת לאט ומסוכנת בקור.',
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
        'מעיל Gore-Tex עמיד למים ורוח  -  חיוני לגשם, שלג ורוח.',
        'מכנסי Gore-Tex או מכנסי ויטרגל לרגליים.',
        'לפסגות גבוהות מ-5000 מטר: מעיל פוך כבד (down jacket) בדירוג של מינוס 15 לפחות.',
      ]},

      { type: 'heading', value: '2. נעליים וגרביים' },
      { type: 'text', value: 'הנעליים הן ההשקעה החשובה ביותר בציוד שלכם. נעלי טרק גרועות גורמות ליבלות, פציעות קרסול ורטיבות  -  וברגע שנעלייכם לא נוחות, כל צעד הופך לסבל.' },
      { type: 'subheading', value: 'מה לחפש בנעלי טרק' },
      { type: 'list', items: [
        'חסינות למים (Waterproof)  -  ממברנת Gore-Tex או Vibram.',
        'תמיכת קרסול  -  חיונית בשטחים לא סדירים עם תיק כבד.',
        'סוליה בולמת זעזועים  -  מגינה על הברכיים בירידות.',
        'חשוב מכל: נעלו לפחות 3 פעמים לפני הטיול. נעליים לא מרוצות = יבלות בוודאות.',
      ]},
      { type: 'subheading', value: 'גרביים' },
      { type: 'list', items: [
        'גרבי מריו וול  -  חמות, מנדפות לחות ואנטי-בקטריאליות.',
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
        'כתפיות נשלפות לנוחות הפורטרים  -  ולכם אם צריך לשאת.',
      ]},

      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'תיק גב נוח  -  הבסיס לכל טיול ארוך' },

      { type: 'heading', value: '4. שק שינה' },
      { type: 'text', value: 'לילה קר על ההר ללא שק שינה מתאים פירושו שינה גרועה, גוף קר, ופגיעה בביצועים למחרת. הדירוג החשוב הוא "Comfort"  -  לא "Extreme" או "Limit".' },
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
        'כדורי Diamox (Acetazolamide)  -  למניעת מחלת גבהים. רק לאחר התייעצות עם רופא.',
        'פלסטרים, גאזה, רצועות אגירה.',
        'חיטוי: אלכוהול ג\'ל, בטדין.',
        'מד-חום ומד-רוויה (Pulse Oximeter)  -  קריטי לניטור מחלת גבהים.',
      ]},
      { type: 'subheading', value: 'ציוד בטיחות' },
      { type: 'list', items: [
        'מנורת ראש + סוללות רזרבה (פנס ראש הוא חובה לליל הפסגה).',
        'שמשון / כוסיות שלג לעיניים (Glacier Glasses)  -  UV400.',
        'קרם הגנה גבוה (SPF 50+) ושפתון עם הגנה.',
        'מקלות הליכה  -  מפחיתים עומס על הברכיים ב-30% ומשפרים יציבות.',
      ]},

      { type: 'heading', value: '6. ניהול מים וחימום' },
      { type: 'list', items: [
        'בקבוק מבודד (Insulated Bottle) של 1 ליטר  -  מי שתייה לא יקפאו.',
        'מצנח שתייה (Hydration Bladder) 2-3 ליטר לתיק יום.',
        'טבליות סינון מים (Purification Tablets)  -  גיבוי למקרה חירום.',
        'Nalgene או בקבוק שתוכלו למלא במים חמים בלילה לחימום שק השינה.',
      ]},

      { type: 'heading', value: '7. אלקטרוניקה ותקשורת' },
      { type: 'list', items: [
        'מצלמה עמידה ו/או סמארטפון עם מארז מגן.',
        'Power Bank  -  מינימום 20000 mAh. בגובה רב סוללות מתרוקנות מהר יותר.',
        'שעון GPS / GPS עצמאי לפסגות ללא כיסוי סלולרי.',
        'GPS מסוג Garmin inReach  -  לתקשורת לוויינית בחירום.',
        'כבלי טעינה גיבוי ומתאמי שקע בינלאומיים.',
      ]},

      { type: 'heading', value: '8. ציוד אישי ונסיעה' },
      { type: 'list', items: [
        'מסמכים: דרכון + עותקים, ויזה (אם נדרשת), ביטוח נסיעות כולל חילוץ.',
        'תרמוס: לשתיית תה חם / קפה בשטח.',
        'גרבי לחץ (Compression Socks) לטיסות ארוכות.',
        'כיסויי אוזניים וכפיה (Balaclava) לטמפרטורות נמוכות.',
        'כפפות: שכבתיות  -  כפפות פנימיות + כפפות חיצוניות עמידות.',
        'גטרים  -  מניעים כניסת שלג ואבנים לנעל.',
      ]},

      { type: 'heading', value: '9. מה לא לארוז' },
      { type: 'text', value: 'הדבר הכי חשוב בארוז לטיול הוא לדעת מה להשאיר בבית. כל קילוגרם מיותר בתיק = אנרגיה שהייתם יכולים להשקיע בפסגה.' },
      { type: 'list', items: [
        'בגדי כותנה (חולצות, ג\'ינס)  -  לחלוטין לא מתאימים להרים.',
        'יותר מ-2 ספרים  -  תאמינו, לא יהיה לכם כוח לקרוא.',
        'מזוודה / תיק גלגלים  -  חסרי שימוש בשטח.',
        'ציוד אלקטרוני כבד שאין בו הכרח (לפטופ, טאבלט גדול).',
      ]},

      { type: 'section', value: 'שאלות נפוצות על ציוד הרים' },

      { type: 'heading', value: 'כמה עולה ציוד לקילימנג\'רו?' },
      { type: 'text', value: 'ציוד בסיסי ואיכותי לקילימנג\'רו עולה בין 2000 ל-5000 ש"ח אם קונים הכל חדש. ניתן לחסוך משמעותית על ידי השאלה, רכישה משומשת, או שימוש בציוד שכבר יש. ב-HighAir אנו מציעים ציוד להשכרה (שק שינה, מקלות, תיק יום) בעלות נמוכה.' },

      { type: 'heading', value: 'מה ההבדל בין Gore-Tex לחומרים אחרים?' },
      { type: 'text', value: 'Gore-Tex הוא ממברנה (קרום) המצופה על פני הבד ויוצרת שכבה שחדירה לאוויר אך לא לגשם. ריכוז הנקבוביות בממברנה גדולות מספיק לאדי זיעה לצאת (אוורור) אך קטנות מדי לטיפות גשם להיכנס. בפועל  -  אתם נשארים יבשים מבפנים וגם מבחוץ. חלופות בשוק: eVent, Pertex Shield, DryVent. Gore-Tex נחשב לסטנדרט הזהב.' },

      { type: 'heading', value: 'האם כדאי לקנות ציוד ב-Israel או בחו"ל?' },
      { type: 'text', value: 'ישראל יש חנויות ציוד איכותיות (כמו נשר, ספורט איגד ועוד). המחירים בדרך כלל גבוהים יותר מאשר ב-Amazon, REI (ארה"ב) או Decathlon (אירופה). עם זאת, קנייה בארץ מאפשרת ניסיון של הציוד לפני הטיול  -  מה שחשוב מאוד עבור נעליים ותיקים.' },

      { type: 'heading', value: 'האם אפשר לשכור ציוד בטנזניה / נפאל?' },
      { type: 'text', value: 'כן. בארוסה (הכפר שממנו עולים לקילימנג\'רו) ובקטמנדו יש השכרת ציוד זולה. עם זאת, איכות הציוד המושכר משתנה מאוד. אנו ממליצים לרכוש נעליים, ביגוד בסיסי ומכשיר מד-רוויה בעצמכם, ולשכור שק שינה ומקלות אם צריך.' },

      { type: 'heading', value: 'כמה קילוגרמים מותר לארוז לקילימנג\'רו?' },
      { type: 'text', value: 'הפורטרים בקילימנג\'רו מורשים לשאת עד 20 ק"ג (כולל הציוד שלהם). לכן, הדאפל-באג שלכם יכול להיות עד 15 ק"ג. בנוסף, אתם נושאים תיק יום של 5-7 ק"ג. סה"כ: הכינו מסביב ל-20 ק"ג ציוד אישי.' },

      { type: 'section', value: 'מוכנים לצאת לדרך?' },
      { type: 'text', value: 'ציוד נכון חוסך אנרגיה, מפחית סיכון ומאפשר לכם להתרכז בהר ולא בבעיות. אם יש שאלות ספציפיות לגבי ציוד לטיול שלכם, צרו קשר  -  אנחנו נעזור.' },
      { type: 'cta', text: 'לחנות הציוד של HighAir', textEn: 'HighAir Gear Store', href: '/shop' },
    ],

    /* ── English content ── */
    titleEn: 'The mountain gear list (2026): what to pack for an expedition',
    contentEn: [
      { type: 'text', value: 'The right gear can be the difference between a safe, enjoyable journey and a miserable one. When you\'re climbing a high mountain  -  whether Kilimanjaro, Elbrus, or one of Nepal\'s peaks  -  your body is exposed to extreme temperatures, rain, snow, and strong winds. Good gear protects you physically, conserves energy, and lets you actually enjoy being up there.' },
      { type: 'text', value: 'At HighAir Expeditions we\'ve guided thousands of trekkers to every corner of the world. We know what works and what to leave at home. This list is built on real experience in the field, not gear-store marketing.' },

      { type: 'image', src: '/images/blog/kilimanjaro-layers.jpg', caption: 'The layering system  -  comfort in any weather' },

      { type: 'heading', value: '1. Clothing  -  the layering system' },
      { type: 'text', value: 'The layering principle is the foundation of mountain clothing. Instead of one heavy garment, you wear several thin layers you can add or remove as temperatures change. Each layer does a specific job.' },
      { type: 'subheading', value: 'Base layer' },
      { type: 'list', items: [
        'Material: polyester, merino wool, or any moisture-wicking synthetic. Never cotton  -  it absorbs sweat, dries slowly, and is dangerous in the cold.',
        'Long thermal leggings for the lower body.',
        'Long-sleeve fitted top for the upper body.',
      ]},
      { type: 'subheading', value: 'Mid layer' },
      { type: 'list', items: [
        'Fleece weight 100 (light) or 200 (warmer). Good insulation with ventilation.',
        'Light down jacket (800-fill) for very low temperatures.',
      ]},
      { type: 'subheading', value: 'Outer layer (shell)' },
      { type: 'list', items: [
        'Gore-Tex jacket  -  waterproof and windproof  -  non-negotiable for rain, snow, and wind.',
        'Gore-Tex or softshell trousers.',
        'For summits above 5000 m (Aconcagua, Nanga Parbat): a heavy down jacket rated to at least -15°C.',
      ]},

      { type: 'heading', value: '2. Footwear and socks' },
      { type: 'text', value: 'Boots are the most important item you\'ll buy. Bad trekking boots cause blisters, ankle injuries, and wet feet  -  and once your feet are suffering, the whole trip suffers with them.' },
      { type: 'subheading', value: 'What to look for in hiking boots' },
      { type: 'list', items: [
        'Waterproofing  -  Gore-Tex or Vibram membrane.',
        'Ankle support  -  you need it on uneven terrain with a loaded pack.',
        'Shock-absorbing sole  -  your knees will thank you on the descents. By day 3, they\'ll know if you skimped here.',
        'Break them in at least 3 times before the trip. Brand-new boots on day 1 means blisters by day 2.',
      ]},
      { type: 'subheading', value: 'Socks' },
      { type: 'list', items: [
        'Merino wool socks  -  warm, moisture-wicking, and antibacterial.',
        'Bring at least 4-5 pairs for a week-long trek.',
        'Double-layer socks cut friction significantly.',
      ]},

      { type: 'heading', value: '3. Backpack and duffel bag' },
      { type: 'text', value: 'Most expeditions need two bags: a daypack you carry yourself, and a larger duffel the porters carry.' },
      { type: 'subheading', value: 'Daypack' },
      { type: 'list', items: [
        '25-40 litres.',
        'Padded back panel with hip belt to distribute the weight properly.',
        'Easy water access  -  hydration bladder compatible, or a side bottle pocket.',
        'Built-in or separate rain cover.',
      ]},
      { type: 'subheading', value: 'Duffel bag' },
      { type: 'list', items: [
        '70-100 litres.',
        'Tear-resistant, water-resistant material.',
        'Combination lock to keep your gear secure.',
        'Removable shoulder straps  -  for porter convenience, and for you if it comes to that.',
      ]},

      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'A comfortable daypack  -  the basis of any long day on the trail' },

      { type: 'heading', value: '4. Sleeping bag' },
      { type: 'text', value: 'A cold night on the mountain in an inadequate sleeping bag means bad sleep, a cold body, and a rough day to follow. The rating that matters is "Comfort"  -  not "Extreme" or "Limit."' },
      { type: 'list', items: [
        'Kilimanjaro and Elbrus: Comfort rating of -5°C to -10°C.',
        'Above 5500 m (Aconcagua, high Himalayan peaks): -15°C to -20°C.',
        'Down is lighter and performs better in dry cold. Synthetic holds up better when wet.',
        'Always store the bag dry in a waterproof liner inside your duffel.',
      ]},

      { type: 'heading', value: '5. Safety and first aid' },
      { type: 'text', value: 'Non-negotiable for any serious expedition.' },
      { type: 'subheading', value: 'Personal first aid kit' },
      { type: 'list', items: [
        'Painkillers (ibuprofen and paracetamol), antihistamine, anti-diarrhoea and anti-nausea medication.',
        'Diamox (Acetazolamide)  -  for altitude sickness prevention. Only after talking to a doctor.',
        'Plasters, gauze, elastic bandages.',
        'Antiseptic: alcohol gel, Betadine.',
        'Thermometer and pulse oximeter  -  these are how you catch altitude sickness early.',
      ]},
      { type: 'subheading', value: 'Safety equipment' },
      { type: 'list', items: [
        'Headlamp + spare batteries. A headlamp is not optional on summit night.',
        'Glacier glasses with UV400 protection.',
        'Sunscreen SPF 50+ and lip balm with sun protection.',
        'Trekking poles  -  they cut knee impact by around 30% and make a real difference on long descents.',
      ]},

      { type: 'heading', value: '6. Water and hydration' },
      { type: 'list', items: [
        'Insulated 1-litre bottle  -  so your water doesn\'t freeze.',
        'Hydration bladder (2-3 litres) for your daypack.',
        'Water purification tablets  -  backup for emergencies.',
        'A Nalgene or similar bottle you can fill with hot water at night and tuck into your sleeping bag.',
      ]},

      { type: 'heading', value: '7. Electronics and communication' },
      { type: 'list', items: [
        'Weatherproof camera and/or smartphone with a protective case.',
        'Power bank  -  minimum 20,000 mAh. Batteries drain noticeably faster at altitude.',
        'GPS watch or standalone GPS for peaks without cell coverage.',
        'Garmin inReach or similar device for satellite communication in an emergency.',
        'Backup charging cables and international plug adapters.',
      ]},

      { type: 'heading', value: '8. Personal items and travel documents' },
      { type: 'list', items: [
        'Passport + copies, visa if required, travel insurance with evacuation coverage.',
        'Thermos for hot tea or coffee on the trail.',
        'Compression socks for long flights.',
        'Balaclava and ear warmers for low temperatures.',
        'Layered gloves: thin inner gloves plus waterproof outer gloves.',
        'Gaiters  -  keep snow and stones out of your boots.',
      ]},

      { type: 'heading', value: '9. What not to pack' },
      { type: 'text', value: 'Every extra kilogram in your pack is energy you\'re not spending on the summit. Pack light.' },
      { type: 'list', items: [
        'Cotton clothing (t-shirts, jeans)  -  wrong material for mountains, full stop.',
        'More than two books  -  you won\'t have the energy to read them.',
        'Wheeled luggage  -  useless on any mountain trail.',
        'Heavy electronics you don\'t genuinely need (laptop, large tablet).',
      ]},

      { type: 'section', value: 'Mountain gear FAQ' },

      { type: 'heading', value: 'How much does gear for Kilimanjaro cost?' },
      { type: 'text', value: 'Buying everything new, expect to spend $500–$1,500 for solid quality gear. You can cut that significantly by renting, buying secondhand, or using what you already own. HighAir rents sleeping bags, poles, and daypacks at reasonable prices.' },

      { type: 'heading', value: 'What\'s the difference between Gore-Tex and other materials?' },
      { type: 'text', value: 'Gore-Tex is a membrane laminated onto fabric. Its pores are large enough for sweat vapour to escape but too small for rain droplets to get through. You stay dry inside and out. Alternatives include eVent, Pertex Shield, and DryVent  -  all work, but Gore-Tex remains the benchmark.' },

      { type: 'heading', value: 'Can you rent gear in Tanzania or Nepal?' },
      { type: 'text', value: 'Yes. In Moshi (at Kilimanjaro\'s base) and Kathmandu there\'s affordable gear rental, though quality varies a lot. We recommend buying your own boots, base layers, and pulse oximeter. Renting a sleeping bag and poles is fine.' },

      { type: 'heading', value: 'How many kilograms can you pack for Kilimanjaro?' },
      { type: 'text', value: 'Porters on Kilimanjaro carry up to 20 kg including their own gear, so your duffel should stay under 15 kg. Add a daypack of 5–7 kg and you\'re at around 20 kg total personal gear.' },

      { type: 'heading', value: 'Is a down jacket worth buying?' },
      { type: 'text', value: 'For any peak above 4,500 m, yes. A quality down jacket gives serious warmth for very little weight and packs down small. A jacket rated to -10°C handles Kilimanjaro and Elbrus. For Aconcagua or anything higher, go to -20°C.' },

      { type: 'section', value: 'Ready to hit the trail?' },
      { type: 'text', value: 'Good gear pays for itself on the mountain. If you have questions about what you specifically need for your trip, contact our team.' },
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
    excerpt:  'טרק לבייס קמפ אוורסט (5364 מ׳)  -  14 ימים, כ-130 ק"מ, ומשם רואים את האוורסט, לוצ\'ה ונופטסה בשורה אחת. מה צריך לדעת: עונות, ציוד, התאקלמות, עלות ואיך מגיעים ללוקלה.',
    excerptEn: 'Everest Base Camp trek (5364 m)  -  14 days, ~130 km, and views that will stay with you for life. What you need to know: seasons, gear, acclimatisation, cost, and how to get to Namche Bazaar.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'בייס קמפ אוורסט (EBC) עומד על גובה 5364 מטר בלב ההימלאיה הנפאלית  -  ורק כ-14-16 ימי הליכה מפרידים בינכם לבינו. בדרך עוברים דרך כפרי שרפה, מנזרים בודהיסטים, ומהגובה הנכון רואים את האוורסט, לוצ\'ה, מקאלו ונופטסה בשורה אחת.' },
      { type: 'text', value: 'הובלנו עשרות קבוצות ישראליות לבייס קמפ. המדריך הזה מסכם את כל מה שצריך לדעת  -  ממסלול ההליכה, דרך ציוד חיוני ועד ניהול ההתאקלמות הנכונה.' },

      { type: 'image', src: '/images/blog/seven-summits-everest.webp', caption: 'אוורסט ונופטסה מהשביל' },

      { type: 'heading', value: '1. מה זה טרק ל-EBC?' },
      { type: 'text', value: 'הטרק לבייס קמפ אוורסט הוא מסלול הליכה בגובה רב בהימלאיה הנפאלית, שמתחיל בעיירה לוקלה (2840 מ׳), עובר דרך נמצ\'ה בזאר, טיאנגבוצ\'ה ומישורי המורנות הגלציאליות, ומגיע לבייס קמפ ב-5364 מ׳. בדרך עוברים דרך כפרי שרפה ונופי הרים שעולים לקראתכם מכל כיוון.' },
      { type: 'text', value: 'הלוך וחזור: כ-130 ק"מ ובסביבות 10,000 מטר עלייה מצטברת. ציר הזמן הנפוץ: 12-16 ימים. אנחנו מובילים 14-16 ימים כדי לאפשר התאקלמות בלי לחץ.' },

      { type: 'heading', value: '2. מתי לצאת? עונות הטרק' },
      { type: 'text', value: 'הטרק אפשרי כל השנה, אך שתי עונות בולטות:' },
      { type: 'subheading', value: 'אביב (מרץ–מאי)  -  העונה הפופולרית ביותר' },
      { type: 'list', items: [
        'טמפרטורות נעימות ומשתנות (0°C עד 15°C בגובה 3500 מ\').',
        'פריחת ראודנדרון (Rhododendron)  -  יערות ורודים ואדומים.',
        'נוף מובהק לרוב.',
        'הכי עמוס: אפריל-מאי הם גם עונת הטיפוס לאוורסט.',
      ]},
      { type: 'subheading', value: 'סתיו (ספטמבר–נובמבר)  -  האלטרנטיבה המצוינת' },
      { type: 'list', items: [
        'שמיים בדרך כלל צלולים אחרי עונת המונסון.',
        'פחות עמוס מהאביב.',
        'טמפרטורות נמוכות יותר מדצמבר ואילך.',
        'נובמבר  -  קר יותר אך שמיים קריסטל.',
      ]},

      { type: 'heading', value: '3. המסלול: שלב אחר שלב' },
      { type: 'text', value: 'המסלול הקלאסי עם לוח הזמנים:' },
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

      { type: 'heading', value: '4. התאקלמות  -  הסוד להצלחה' },
      { type: 'text', value: 'מחלת גבהים (AMS) היא הסיבה המרכזית לנשירה בטרק. הגוף צריך זמן להסתגל לירידה בלחץ החמצן, ואין קיצורי דרך.' },
      { type: 'subheading', value: 'כלל הזהב' },
      { type: 'text', value: '"Climb High, Sleep Low"  -  תמיד ישנים נמוך ממה שטיפסתם. ימי המנוחה בנמצ\'ה ובדינגבוצ\'ה הם לא בונוס  -  הם הסיבה שמגיעים לבייס קמפ.' },
      { type: 'subheading', value: 'סימני אזהרה' },
      { type: 'list', items: [
        'כאב ראש שאינו חולף אחרי מנוחה ושתיית מים.',
        'בחילה / הקאה.',
        'עייפות קיצונית שאינה פרופורציונלית לקצב ההליכה.',
        'בצקת (נפיחות) בפנים, ידיים או רגליים.',
        'קוצר נשימה במנוחה  -  אות מסוכן מאוד, דורש ירידה מיידית.',
      ]},

      { type: 'heading', value: '5. ציוד חיוני לטרק EBC' },
      { type: 'text', value: 'אין צורך בציוד טיפוס טכני  -  אבל ציוד לגובה ולקור הוא חובה.' },
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
        'מד-רוויה (Pulse Oximeter)  -  מוכרח לניטור יומי.',
        'Diamox (לאחר ייעוץ רפואי)  -  מסייע להתאקלמות.',
        'כדורים נגד בחילה ושלשול.',
        'מנורת ראש + סוללות רזרבה.',
      ]},

      { type: 'heading', value: '6. לינה אורחות ו-Teahouses' },
      { type: 'text', value: 'לאורך כל המסלול יש בתי אירוח מקומיים  -  Teahouses. חדרים פשוטים, אוכל חם, מחיר לינה 5-15 דולר ללילה. ארוחות (Dhal Bhat, ספגטי, מרק) עולות 5-10 דולר.' },
      { type: 'list', items: [
        'בנמצ\'ה ובטיאנגבוצ\'ה יש WiFi ואפשרות לטעינת מכשירים.',
        'מגובה 4000 מ\' ומעלה  -  האינטרנט לא תמיד עובד.',
        'מים: שתו רק מים מבושלים או מסוננים. לא לשתות מים ישירות מהנהרות.',
        'שירותים: חלק מהמלונות יש שירותים חמים  -  ציינו שזה חשוב לכם.',
      ]},

      { type: 'heading', value: '7. עלות הטרק' },
      { type: 'text', value: 'תמחיר משוער לטרק עצמאי (לא כולל חבילת HighAir):' },
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
      { type: 'text', value: 'מד-רוויה הוא מכשיר קטן וזול (30-80 שקל) שמודד את רמת החמצן בדם (SpO2). ערך תקין בגובה פני ים: 95-100%. בגובה 5000 מ\' ערך של 80-85% נחשב תקין. אם יורד מתחת ל-75%  -  ירידה מיידית.' },

      { type: 'heading', value: '9. גייד מנטלי למסע' },
      { type: 'text', value: 'הטרק ארוך. ימים 8-10 הם הקשים  -  גוף עייף, גובה שמורגש, ולפעמים מזג אוויר לא צפוי. כמה דברים שעוזרים:' },
      { type: 'list', items: [
        'אל תתחרו באחרים. כל גוף מגיב אחרת לגובה.',
        'שתו יותר ממה שאתם חושבים שצריך  -  לפחות 3-4 ליטר ביום.',
        'ישנו מוקדם. הגוף מתקן ומתאקלם בשינה.',
        'אל תדלגו על ימי ההתאקלמות. "אני מרגיש טוב" זה לא סיבה לדלג.',
        'הבייס קמפ לא הולך לשום מקום. אם גופכם לא מוכן  -  יש עוד הזדמנויות.',
      ]},

      { type: 'section', value: 'שאלות נפוצות על הטרק לבייס קמפ אוורסט' },

      { type: 'heading', value: 'כמה ימים לוקח הטרק לבייס קמפ?' },
      { type: 'text', value: 'הלוך-חזור מלוקלה לוקח 12-16 ימים. אנחנו מובילים 14-16 ימים לאפשרות התאקלמות טובה. אפשר לדחוס ל-12 ימים, אבל זה מגדיל משמעותית את הסיכון ל-AMS.' },

      { type: 'heading', value: 'עד כמה קשה הטרק?' },
      { type: 'text', value: 'הטרק קשה, אבל לא מסוכן למי שמוכן. אין צורך בניסיון טיפוס. האתגר הוא הגובה ומשך הטרק. עם הכנה גופנית סבירה ורצינות לגבי ימי ההתאקלמות, רוב האנשים מגיעים לבייס קמפ.' },

      { type: 'heading', value: 'האם חובה לקחת ביטוח?' },
      { type: 'text', value: 'חובה. הביטוח חייב לכלול כיסוי לחילוץ בהליקופטר (Helicopter evacuation) עד גובה 6000 מ\'. מחיר חילוץ בהליקופטר בנפאל: 5000-15000 דולר. זה לא אופציונלי.' },

      { type: 'heading', value: 'מה ההבדל בין EBC לבין הטיפוס לפסגת האוורסט?' },
      { type: 'text', value: 'הטרק לבייס קמפ (5364 מ\') הוא טרקינג  -  הליכה בשבילים. אין טיפוס טכני, אין ציוד מיוחד, ואין סכנה. הטיפוס לפסגת האוורסט (8848 מ\') הוא אחד האתגרים הקשים והמסוכנים בעולם, עולה עשרות אלפי דולרים ודורש ניסיון טיפוס נרחב.' },

      { type: 'heading', value: 'האם ניתן לטפס ל-Kala Patthar בדרך?' },
      { type: 'text', value: 'כן  -  וממש מומלץ. קאלה פטהר (5545 מ\') הוא גבעה ליד גורק שפ שמציעה את נקודת הצפייה הקרובה ביותר לאוורסט. רוב המטיילים עולים לשם בזריחה ביום שלפני הגעה לבייס קמפ.' },

      { type: 'section', value: 'מוכנים לצאת?' },
      { type: 'text', value: 'שבועיים של הליכה בהימלאיה, ובסוף עומדים לרגל ההר הגבוה בעולם. המשלחת הבאה שלנו לבייס קמפ  -  פרטים בלינק.' },
      { type: 'cta', text: 'לפרטים על משלחת בייס קמפ אוורסט', textEn: 'Everest Base Camp  -  Dates & Details', href: '/expedition/everest-base-camp' },
    ],

    /* ── English content ── */
    titleEn: 'Everest Base Camp trek: the complete guide (2026)  -  route, gear and acclimatisation',
    contentEn: [
      { type: 'text', value: 'Everest Base Camp sits at 5,364 metres in the Nepali Himalayas  -  and only 14–16 days of walking separate you from it. Ancient trails, Sherpa villages, Tibetan Buddhist monasteries, and the sight of Everest, Lhotse, Makalu, and Nuptse filling the sky. It\'s hard to overstate what this place looks like in person.' },
      { type: 'text', value: 'At HighAir Expeditions we\'ve led dozens of groups to Base Camp. This guide covers everything you need  -  route, gear, acclimatisation, cost, and the mental side of a two-week trek.' },

      { type: 'image', src: '/images/blog/seven-summits-everest.webp', caption: 'Everest and Nuptse from the trail' },

      { type: 'heading', value: '1. What is the EBC trek?' },
      { type: 'text', value: 'The Everest Base Camp trek is a high-altitude walking route through the Nepali Himalayas. It runs from the town of Lukla (2,840 m) through Namche Bazaar, Tengboche, and the glacial moraines above, ending at Base Camp at 5,364 m. On the way you pass through Sherpa villages and some of the most dramatic mountain terrain on earth.' },
      { type: 'text', value: 'The full round trip is about 130 km with around 10,000 m of cumulative ascent. Plan for 12–16 days. We recommend 14–16 to allow proper acclimatisation.' },

      { type: 'heading', value: '2. When to go' },
      { type: 'text', value: 'The trek is possible year-round, but two seasons stand out:' },
      { type: 'subheading', value: 'Spring (March–May)  -  the most popular season' },
      { type: 'list', items: [
        'Temperatures 0°C to 15°C at 3,500 m  -  variable but generally comfortable.',
        'Rhododendrons in bloom  -  forests of pink and red from mid-March.',
        'Views are usually clear.',
        'April–May is also Everest climbing season, so the trails are busy.',
      ]},
      { type: 'subheading', value: 'Autumn (September–November)  -  a strong alternative' },
      { type: 'list', items: [
        'Clear skies after the monsoon.',
        'Less crowded than spring.',
        'Colder from November onwards, but the visibility is excellent.',
      ]},

      { type: 'heading', value: '3. The route, stage by stage' },
      { type: 'text', value: 'The classic schedule:' },
      { type: 'list', items: [
        'Day 1: Kathmandu → Lukla (flight) → Phakding (2,610 m). Short 3-hour walk.',
        'Day 2: Phakding → Namche Bazaar (3,440 m). 800 m ascent, 5–6 hours.',
        'Days 3–4: Rest and acclimatisation in Namche Bazaar.',
        'Day 5: Namche → Tengboche (3,867 m). 3–4 hours.',
        'Day 6: Tengboche → Pangboche (3,985 m). Visit Tengboche Monastery.',
        'Day 7: Pangboche → Dingboche (4,410 m). You\'re properly high now.',
        'Day 8: Acclimatisation day in Dingboche (hike to Nangkartshang at 5,100 m).',
        'Day 9: Dingboche → Lobuche (4,940 m). Hard terrain, 5–6 hours.',
        'Day 10: Lobuche → Gorak Shep (5,140 m). A tough day, 6–7 hours.',
        'Day 11: Gorak Shep → Everest Base Camp (5,364 m). The goal.',
        'Days 12–14: Descent back to Lukla.',
      ]},

      { type: 'heading', value: '4. Acclimatisation  -  the part people underestimate' },
      { type: 'text', value: 'Acute Mountain Sickness (AMS) is the main reason people don\'t finish this trek. Your body needs time to adjust to the drop in oxygen pressure. There are no shortcuts, and there is no fitness level that protects you from it.' },
      { type: 'subheading', value: 'The rule that matters' },
      { type: 'text', value: '"Climb High, Sleep Low"  -  always sleep lower than you climbed that day. The rest days in Namche and Dingboche are not optional. They\'re the reason you make it to Base Camp.' },
      { type: 'subheading', value: 'Warning signs' },
      { type: 'list', items: [
        'Headache that doesn\'t resolve after rest and water.',
        'Nausea or vomiting.',
        'Fatigue that seems out of proportion to how far you walked.',
        'Swelling in the face, hands, or legs.',
        'Shortness of breath at rest  -  descend immediately if this happens.',
      ]},

      { type: 'heading', value: '5. Gear for EBC' },
      { type: 'text', value: 'No technical climbing gear required, but you do need good kit for altitude and cold.' },
      { type: 'subheading', value: 'Clothing' },
      { type: 'list', items: [
        'Thermal base layer, fleece, Gore-Tex jacket, trekking trousers.',
        'Heavy down jacket for anything above 4,000 m.',
        'Balaclava, ear warmers, three glove layers.',
      ]},
      { type: 'subheading', value: 'Sleeping' },
      { type: 'list', items: [
        'Sleeping bag rated Comfort -10°C minimum (up to -15°C at EBC itself).',
        'Thick sleeping socks.',
      ]},
      { type: 'subheading', value: 'Health and safety' },
      { type: 'list', items: [
        'Pulse oximeter  -  check your levels every morning, especially above 4,000 m.',
        'Diamox after medical consultation  -  it helps, but it\'s not a substitute for acclimatisation days.',
        'Anti-nausea and anti-diarrhoea tablets.',
        'Headlamp with spare batteries.',
      ]},

      { type: 'heading', value: '6. Teahouses along the route' },
      { type: 'text', value: 'The whole route is lined with teahouses  -  local guesthouses offering a bed and hot food. A room runs $5–15 per night. Meals (Dhal Bhat, pasta, soup) are $5–10.' },
      { type: 'list', items: [
        'WiFi and charging available in Namche and Tengboche.',
        'Above 4,000 m, internet becomes unreliable.',
        'Drink only boiled or filtered water. Do not drink directly from streams.',
        'Some lodges have warm showers  -  worth asking about when you book.',
      ]},

      { type: 'heading', value: '7. What does it cost?' },
      { type: 'text', value: 'Approximate costs for an independent trek (not a HighAir package):' },
      { type: 'list', items: [
        'International flights to/from Kathmandu: $800–$1,500.',
        'Kathmandu–Lukla flights (return): $350–$450.',
        'Park permits (TIMS + Sagarmatha NP): $50–$70.',
        'Accommodation + food: $30–$50 per day.',
        'Local guide (now required by regulation): $30–$50 per day.',
        'Gear + insurance: $1,000–$3,000 if buying new.',
        'Total: roughly $2,500–$5,000 for an independent trek.',
      ]},

      { type: 'heading', value: '8. The mental side of a long trek' },
      { type: 'text', value: 'Days 8–10 are the hardest. Your body is tired, the altitude is real, and the weather can surprise you. A few things that help:' },
      { type: 'list', items: [
        'Don\'t compare your pace to anyone else. Altitude affects people differently.',
        'Drink more than you think you need  -  3–4 litres per day minimum.',
        'Sleep early. Acclimatisation happens during sleep.',
        'Don\'t skip rest days because you feel good. That\'s exactly when people make mistakes.',
        'Base Camp will be there. If your body isn\'t ready, come back. Several of our best clients did it on their second attempt.',
      ]},

      { type: 'section', value: 'Everest Base Camp trek FAQ' },

      { type: 'heading', value: 'How many days does the EBC trek take?' },
      { type: 'text', value: 'The full round trip from Lukla takes 12–16 days. We recommend 14–16 for proper acclimatisation. It\'s possible in 12 days but it pushes your acclimatisation hard and significantly raises the AMS risk.' },

      { type: 'heading', value: 'How hard is the EBC trek?' },
      { type: 'text', value: 'Challenging but manageable for people who prepare. No climbing experience needed. The altitude and the duration are the real tests. With solid fitness and proper acclimatisation days, most people reach Base Camp.' },

      { type: 'heading', value: 'Is travel insurance required?' },
      { type: 'text', value: 'Yes, and it must include helicopter evacuation up to 6,000 m. A rescue in Nepal costs $5,000–$15,000. Do not do this trek without it.' },

      { type: 'heading', value: 'What\'s the difference between EBC and climbing Everest\'s summit?' },
      { type: 'text', value: 'EBC (5,364 m) is a walking trek  -  no ropes, no technical gear, no special risk. Climbing Everest\'s summit (8,848 m) is among the hardest and most dangerous undertakings in mountaineering, costs tens of thousands of dollars, and demands years of serious experience.' },

      { type: 'heading', value: 'Can you climb Kala Patthar on the way?' },
      { type: 'text', value: 'Yes, and we strongly recommend it. Kala Patthar (5,545 m) is a small hill next to Gorak Shep with arguably the best close-up view of Everest you can get. Most trekkers go up at sunrise the day before reaching Base Camp. The view is worth the early alarm.' },

      { type: 'section', value: 'Ready for the journey?' },
      { type: 'text', value: 'Two weeks of walking through the Himalayas, culminating at the foot of the world\'s highest mountain. We\'ve taken hundreds of people there. If you want to be one of them, get in touch.' },
      { type: 'cta', text: 'לפרטים על משלחת בייס קמפ אוורסט', textEn: 'Everest Base Camp  -  Dates & Details', href: '/expedition/everest-base-camp' },
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
    excerptEn: 'Altitude sickness (AMS) hits about 50% of trekkers above 3,000 m. What are the symptoms, how do you prevent it, and does Diamox actually work? A practical guide to staying healthy at altitude.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'מחלת גבהים, או בשמה הרפואי Acute Mountain Sickness (AMS), היא התגובה של הגוף לירידה ברמת החמצן בגובה רב. היא פוגעת בכ-50% מהמטיילים שעולים לגובה של 3000 מטר ומעלה, ואינה קשורה בהכרח לגיל, מגדר, כושר גופני או ניסיון טיפוס קודם. גם אלופי עולם בריצה סבלו ממנה בעצמת.' },
      { type: 'text', value: 'לדעת לזהות AMS, להבין מה גורם לה ומה עושים כשהיא מופיעה  -  זה לא אופציונלי. זה רלוונטי לכל טרק בגובה: קילימנג\'רו, בייס קמפ אוורסט, אנפורנה, אקונקגואה, אלברוס.' },

      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', caption: 'גובה רב = אוויר דליל. הגוף צריך זמן להסתגל' },

      { type: 'heading', value: '1. מה קורה לגוף בגובה רב?' },
      { type: 'text', value: 'כשאתם מתרוממים לגובה, לחץ האוויר יורד. אוויר בגובה 5000 מטר מכיל כ-50% פחות מולקולות חמצן מאשר בגובה פני הים. הלב מתחיל לעבוד קשה יותר, קצב הנשימה עולה, ואם הגוף לא מצליח להתאקלם מהר מספיק  -  מתחילות הבעיות.' },
      { type: 'text', value: 'ההתאקלמות (Acclimatization) היא התהליך שבו הגוף מייצר יותר תאי דם אדומים, ומשתנה אופן קשירת החמצן להמוגלובין. תהליך זה לוקח ימים ואי אפשר לזרז אותו באופן משמעותי.' },

      { type: 'heading', value: '2. שלושת רמות המחלה' },
      { type: 'subheading', value: 'AMS  -  מחלת גבהים חריפה (קלה)' },
      { type: 'text', value: 'הצורה הנפוצה ביותר. מופיעה בדרך כלל 6-12 שעות לאחר הגעה לגובה חדש. סימפטומים:' },
      { type: 'list', items: [
        'כאב ראש (הסימן הראשון תמיד).',
        'עייפות וחולשה.',
        'בחילה קלה ואיבוד תיאבון.',
        'קשיי שינה, ובמיוחד דפוס נשימה לא סדיר בלילה (Cheyne-Stokes Breathing).',
        'סחרחורת.',
      ]},
      { type: 'subheading', value: 'HACE  -  בצקת מוחית (חמורה)' },
      { type: 'text', value: 'נדירה אך מסוכנת. AMS שלא טופלה עלולה להתדרדר ל-HACE (High Altitude Cerebral Edema). סימני אזהרה:' },
      { type: 'list', items: [
        'בלבול, ירידה ביכולת החשיבה.',
        'קשיי הליכה / חוסר שיווי משקל (Ataxia)  -  בדקו ע"י הליכה בקו ישר.',
        'ישנוניות קיצונית.',
        'דיבור מבולבל.',
        'ירידה מיידית  -  עיכוב עלול לעלות בחיים.',
      ]},
      { type: 'subheading', value: 'HAPE  -  בצקת ריאתית (חמורה)' },
      { type: 'text', value: 'HAPE היא הגורם השכיח ביותר למוות בגובה רב. מזהים אותה על ידי:' },
      { type: 'list', items: [
        'קוצר נשימה קיצוני גם במנוחה.',
        'שיעול יבש שמתפתח לשיעול עם ליחה ורודה / דמית.',
        'חוסר יכולת לשכב שטוח.',
        'עור כחלחל (Cyanosis)  -  חמצן בדם נמוך מאוד.',
        'ירידה מיידית + Dexamethasone (אם זמין) + הזמנת חילוץ.',
      ]},

      { type: 'heading', value: '3. גורמי סיכון' },
      { type: 'text', value: 'מי בסיכון גבוה יותר ל-AMS?' },
      { type: 'list', items: [
        'עלייה מהירה מדי לגובה  -  הגורם הנפוץ ביותר.',
        'היסטוריה אישית של AMS בעבר  -  אינדיקטור חזק לעתיד.',
        'שינה בגובה גבוה יחסית לגובה שהורגלת בו.',
        'התייבשות  -  מעצים תסמינים.',
        'מאמץ מוגבר ביום הראשון בגובה.',
        'הגעה לגובה רב ממקום נמוך בתוך שעות בודדות (כמו טיסה ישירה לקטמנדו).',
      ]},

      { type: 'heading', value: '4. מניעה  -  "Climb High, Sleep Low"' },
      { type: 'text', value: 'הכלל הזהוב למניעת מחלת גבהים הוא "Climb High, Sleep Low". עלו לגובה גבוה במהלך היום, אך חזרו לישון במחנה נמוך יותר. כך הגוף נחשף לגובה בהדרגה.' },
      { type: 'subheading', value: 'כלל הגובה 300-500 מטר' },
      { type: 'text', value: 'מעל 3000 מטר, אל תגדילו את גובה הלינה ביותר מ-300-500 מטר ליום. אחרי כל 1000 מטר של עלייה  -  קחו יום מנוחה מלא.' },
      { type: 'subheading', value: 'שתייה' },
      { type: 'text', value: 'שתו לפחות 3-4 ליטר מים ביום. התייבשות מחמירה תסמיני AMS ומקשה על ההתאקלמות. שתו לפני שאתם צמאים.' },
      { type: 'subheading', value: 'הימנעו מאלכוהול בימים הראשונים' },
      { type: 'text', value: 'אלכוהול מדכא נשימה, גורם להתייבשות ומשבש את שינה  -  שלושה גורמים שמחמירים AMS. הימנעו מאלכוהול ב-48 השעות הראשונות לפחות בכל גובה חדש.' },

      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'כושר גופני טוב עוזר  -  אבל לא מגן מפני AMS' },

      { type: 'heading', value: '5. Diamox  -  האם כדאי?' },
      { type: 'text', value: 'Diamox (Acetazolamide) היא תרופת מרשם שמזרזת את הנשימה  -  הגוף "חושב" שיש חומצה עודפת ומגיב בשאיבת יותר חמצן. אנחנו ממליצים לדון עם רופא מטיילים לפני כל משלחת.' },
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
        'לא תחליף להתאקלמות  -  היא רק עוזרת, לא פותרת.',
      ]},
      { type: 'text', value: 'מינון נפוץ: 125-250 מ"ג פעמיים ביום. מומלץ להתחיל יומיים לפני העלייה לגובה ולהמשיך יום-יומיים לאחר הגעה לגובה המקסימלי.' },

      { type: 'heading', value: '6. מד-רוויה  -  כלי ההצלה הקטן' },
      { type: 'text', value: 'מד-רוויה מודד את אחוז רוויית החמצן בדם (SpO2) ואת הדופק. הוא מזהה ירידה מסוכנת ברמת החמצן לפני שמרגישים אותה.' },
      { type: 'list', items: [
        'SpO2 תקין בגובה פני ים: 95-100%.',
        'SpO2 "נורמלי" ב-5000 מ\': בסביבות 80-88%.',
        'SpO2 מתחת ל-75% בגובה  -  שקלו ירידה מיידית.',
        'SpO2 מתחת ל-65% בגובה  -  ירידה מיידית, חירום.',
      ]},
      { type: 'text', value: 'כל מדריך שלנו נושא מד-רוויה ובודק את כולם כל בוקר ועם כל כניסה לגובה חדש.' },

      { type: 'heading', value: '7. טיפול  -  מה עושים כשמרגישים AMS' },
      { type: 'list', items: [
        'עצרו לעלות. אל תוסיפו גובה עד שתסמינים חולפים לחלוטין.',
        'שתו הרבה מים.',
        'קחו איבופרופן (400-600 מ"ג) לכאב ראש.',
        'מנוחה מלאה.',
        'אם אין שיפור תוך 24 שעות  -  רדו לפחות 300-500 מטר.',
        'במקרה של HACE/HAPE: ירידה מיידית + Dexamethasone 8 מ"ג IM/IV (אם זמין) + מיני-חמצן + חילוץ.',
        'לעולם אל "תישנו" על תסמינים ותעלו יותר. זה עלול לעלות בחיים.',
      ]},

      { type: 'heading', value: '8. הכנה לפני הטיול' },
      { type: 'list', items: [
        'בקרו אצל רופא מטיילים לפחות 4-6 שבועות לפני היציאה. קבלו מרשם ל-Diamox אם הוחלט.',
        'ספרו לרופא על כל תרופה שאתם נוטלים  -  חלקן עלולות לקיים אינטראקציה עם Diamox.',
        'הצהירו על כל בעיה קרדיולוגית/ריאתית קיימת  -  הן עלולות להחמיר בגובה.',
        'אם אתם מעשנים  -  הפסיקו לפחות חודש לפני הטיול. עישון מחמיר AMS.',
        'אם אתם סובלים מאנמיה  -  טפלו בה לפני הטיול. פחות תאי דם אדומים = פחות יעילות בנשיאת חמצן.',
      ]},

      { type: 'section', value: 'שאלות נפוצות על מחלת גבהים' },

      { type: 'heading', value: 'מה הגובה שבו מתחילה מחלת גבהים?' },
      { type: 'text', value: 'מחלת גבהים יכולה להתחיל כבר מגובה 2500 מטר, אך בדרך כלל מופיעה בגובה 3000 מטר ומעלה. ככל שגבוהים יותר ועולים מהר יותר  -  הסיכון גבוה יותר. בגובה 5000+ מ\', כמעט כולם חווים מידה כלשהי של AMS.' },

      { type: 'heading', value: 'האם כושר גופני גבוה מגן מפני AMS?' },
      { type: 'text', value: 'לא  -  זהו אחד המיתוסים הנפוצים ביותר. מחלת גבהים אינה קשורה לכושר. ספורטאים מקצועיים סבלו מAMS קשה, בעוד שאנשים בכושר ממוצע עלו ללא בעיות. מה שמשנה הוא קצב העלייה, ימי ההתאקלמות ורמות ה-SpO2 שלכם.' },

      { type: 'heading', value: 'האם אפשר לחזור לטפס אחרי AMS?' },
      { type: 'text', value: 'כן  -  לאחר שתסמיני AMS חלפו לחלוטין ורמות ה-SpO2 חזרו לנורמה. בדרך כלל נדרש יום-יומיים של מנוחה בגובה נמוך יותר. אל תחזרו לעלות עד לאישור המדריך.' },

      { type: 'heading', value: 'מה ההבדל בין AMS ל-HACE ל-HAPE?' },
      { type: 'text', value: 'AMS היא המצב הקל. HACE ו-HAPE הן צורות חמורות ומסכנות חיים. HACE היא בצקת מוחית (נוזל מסביב למוח), ו-HAPE היא בצקת ריאתית (נוזל בריאות). שתיהן מצריכות ירידה מיידית וטיפול רפואי. אם יש חשד  -  אל תחכו לאישור רפואי. רדו מיד.' },

      { type: 'heading', value: 'כמה עולה חילוץ בהליקופטר בנפאל?' },
      { type: 'text', value: 'חילוץ בהליקופטר בנפאל עולה בין 5000 ל-15000 דולר, תלוי בגובה ובמיקום. ביטוח נסיעות הכולל כיסוי לחילוץ הליקופטר הוא חובה מוחלטת לכל טרק בהימלאיה.' },

      { type: 'section', value: 'בטיחות קודמת' },
      { type: 'text', value: 'AMS היא סיכון אמיתי, אבל עם ידע נכון ועמידה בפרוטוקולים אפשר למנוע ולנהל אותה. כל המדריכים שלנו מוסמכים בעזרה ראשונה בסביבת גובה ונושאים ציוד רפואי בכל משלחת. אם יש שאלות לפני שיוצאים  -  אנחנו זמינים.' },
      { type: 'cta', text: 'לפרטים ורישום למשלחות שלנו', textEn: 'View Our Expeditions', href: '/expedition/kilimanjaro' },
    ],

    /* ── English content ── */
    titleEn: 'Altitude sickness: prevention, recognition and treatment (2026)',
    contentEn: [
      { type: 'text', value: 'Altitude sickness  -  medically, Acute Mountain Sickness (AMS)  -  is what happens when your body can\'t keep up with the drop in oxygen at high elevation. It hits about 50% of trekkers who go above 3,000 metres. Age, gender, fitness level, and previous climbing experience are all poor predictors. World-class athletes have been floored by it while people in average shape sailed through. The variable that matters most is how fast you go up.' },
      { type: 'text', value: 'If you\'re planning a high-altitude trip to Kilimanjaro, Everest Base Camp, Annapurna, Aconcagua, or Elbrus, understanding AMS is not optional. This guide covers what causes it, how to spot it early, and what to actually do about it.' },

      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', caption: 'High altitude means thin air. The body needs time.' },

      { type: 'heading', value: '1. What happens to your body at altitude' },
      { type: 'text', value: 'As you gain altitude, air pressure drops. At 5,000 metres, air contains roughly 50% fewer oxygen molecules than at sea level. Your heart works harder, breathing speeds up, and if your body can\'t adjust fast enough, the problems start.' },
      { type: 'text', value: 'Acclimatisation is the process of producing more red blood cells and changing how oxygen binds to haemoglobin. It takes days. You can\'t meaningfully speed it up.' },

      { type: 'heading', value: '2. The three levels of altitude illness' },
      { type: 'subheading', value: 'AMS  -  acute mountain sickness (mild)' },
      { type: 'text', value: 'The most common form. Usually shows up 6–12 hours after arriving at a new altitude. Symptoms:' },
      { type: 'list', items: [
        'Headache  -  always the first sign.',
        'Fatigue and general weakness.',
        'Mild nausea and loss of appetite.',
        'Disrupted sleep, sometimes with irregular breathing at night (Cheyne-Stokes breathing).',
        'Dizziness.',
      ]},
      { type: 'subheading', value: 'HACE  -  high altitude cerebral oedema (severe)' },
      { type: 'text', value: 'Rare but life-threatening. AMS that goes untreated can develop into HACE. Warning signs:' },
      { type: 'list', items: [
        'Confusion or noticeably impaired thinking.',
        'Difficulty walking, loss of balance (ataxia)  -  test by asking someone to walk a straight line.',
        'Extreme drowsiness.',
        'Slurred speech.',
        'Descend immediately. Any delay can be fatal.',
      ]},
      { type: 'subheading', value: 'HAPE  -  high altitude pulmonary oedema (severe)' },
      { type: 'text', value: 'HAPE is the most common cause of altitude-related death. Signs:' },
      { type: 'list', items: [
        'Severe breathlessness even at rest.',
        'A dry cough that develops into one producing pink or blood-tinged sputum.',
        'Unable to lie flat.',
        'Bluish skin (cyanosis)  -  blood oxygen is very low.',
        'Descend immediately + Dexamethasone if available + supplemental oxygen + call for rescue.',
      ]},

      { type: 'heading', value: '3. Risk factors' },
      { type: 'text', value: 'Who is more likely to get AMS?' },
      { type: 'list', items: [
        'Ascending too fast  -  by far the most common cause.',
        'A personal history of AMS  -  strong predictor for future trips.',
        'Sleeping at a higher elevation than your body is used to.',
        'Dehydration  -  amplifies every symptom.',
        'Overdoing it physically on your first day at a new altitude.',
        'Going from low to high elevation in just a few hours (like flying directly into Kathmandu).',
      ]},

      { type: 'heading', value: '4. Prevention  -  "Climb High, Sleep Low"' },
      { type: 'text', value: '"Climb High, Sleep Low" is the guiding principle. Go up during the day, sleep lower at night. Your body gets the exposure without the sustained stress.' },
      { type: 'subheading', value: 'The 300–500 metre rule' },
      { type: 'text', value: 'Above 3,000 m, don\'t increase your sleeping altitude by more than 300–500 metres per day. After every 1,000 metres of ascent, take a full rest day.' },
      { type: 'subheading', value: 'Hydration' },
      { type: 'text', value: 'Drink 3–4 litres of water per day. Dehydration makes AMS worse and slows acclimatisation. Drink before you feel thirsty  -  by then you\'re already behind.' },
      { type: 'subheading', value: 'Avoid alcohol in the first few days' },
      { type: 'text', value: 'Alcohol suppresses breathing, causes dehydration, and disrupts sleep. All three worsen AMS. Avoid it for at least the first 48 hours at any new altitude.' },

      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'Good fitness helps  -  but it doesn\'t protect against AMS' },

      { type: 'heading', value: '5. Diamox  -  does it work?' },
      { type: 'text', value: 'Diamox (Acetazolamide) is a prescription drug that makes you breathe faster by tricking your body into thinking it has excess acidity. This drives up oxygen absorption. We recommend discussing it with a travel medicine physician before any expedition.' },
      { type: 'subheading', value: 'Benefits' },
      { type: 'list', items: [
        'Significantly lowers the chances of AMS at high altitude.',
        'Research-proven  -  this one has solid evidence behind it.',
        'Widely available and straightforward to use.',
      ]},
      { type: 'subheading', value: 'Side effects and limitations' },
      { type: 'list', items: [
        'Causes more frequent urination.',
        'Can cause tingling in the hands and feet.',
        'Contraindicated if you have a sulpha allergy.',
        'Not a substitute for acclimatisation days  -  it helps, it doesn\'t replace the process.',
      ]},
      { type: 'text', value: 'Standard dosage is 125–250 mg twice daily. Start two days before ascending and continue for one or two days after reaching your highest point.' },

      { type: 'heading', value: '6. Pulse oximeter  -  small device, important data' },
      { type: 'text', value: 'A pulse oximeter clips onto your finger and measures blood oxygen saturation (SpO2) and heart rate. It can flag a dangerous drop in oxygen before you feel symptoms.' },
      { type: 'list', items: [
        'Normal SpO2 at sea level: 95–100%.',
        'Normal at 5,000 m: roughly 80–88%.',
        'Below 75% at altitude  -  think seriously about descending.',
        'Below 65% at altitude  -  this is an emergency. Descend immediately.',
      ]},
      { type: 'text', value: 'Every HighAir guide carries a pulse oximeter and checks all group members each morning and on arrival at any new elevation.' },

      { type: 'heading', value: '7. Treatment  -  what to do when AMS hits' },
      { type: 'list', items: [
        'Stop going up. Don\'t gain any altitude until symptoms have fully cleared.',
        'Drink water.',
        'Ibuprofen 400–600 mg for the headache.',
        'Rest.',
        'If there\'s no improvement after 24 hours, descend at least 300–500 metres.',
        'HACE or HAPE: immediate descent + Dexamethasone 8 mg IM/IV if available + supplemental oxygen + call for rescue.',
        'Never try to sleep it off and push higher the next day. People have died doing exactly that.',
      ]},

      { type: 'heading', value: '8. Before you leave' },
      { type: 'list', items: [
        'See a travel medicine doctor 4–6 weeks before departure. Get a Diamox prescription if it\'s right for you.',
        'Tell your doctor every medication you\'re on  -  some interact with Diamox.',
        'Disclose any cardiovascular or pulmonary conditions  -  both can worsen at altitude.',
        'If you smoke, stop at least a month before the trip.',
        'If you have anaemia, treat it first. Fewer red blood cells means less oxygen-carrying capacity.',
      ]},

      { type: 'section', value: 'Altitude sickness FAQ' },

      { type: 'heading', value: 'At what altitude does altitude sickness start?' },
      { type: 'text', value: 'AMS can appear from around 2,500 m, but it\'s most common above 3,000 m. The higher and faster you go, the greater the risk. Above 5,000 m, almost everyone feels something.' },

      { type: 'heading', value: 'Does being fit protect you from AMS?' },
      { type: 'text', value: 'No. This is one of the most persistent myths in trekking. Fitness level has no meaningful relationship with AMS susceptibility. What matters is your ascent rate, your acclimatisation days, and your SpO2 readings.' },

      { type: 'heading', value: 'Can you climb again after AMS?' },
      { type: 'text', value: 'Yes  -  once symptoms have fully resolved and SpO2 is back to normal. That typically takes one or two days of rest at a lower altitude. Get clearance from your guide before going back up.' },

      { type: 'heading', value: 'What\'s the difference between AMS, HACE, and HAPE?' },
      { type: 'text', value: 'AMS is the mild form. HACE and HAPE are the severe, life-threatening versions. HACE is fluid around the brain; HAPE is fluid in the lungs. Both need immediate descent and medical treatment. If you suspect either, don\'t wait to be certain. Descend now.' },

      { type: 'heading', value: 'How much does helicopter rescue cost in Nepal?' },
      { type: 'text', value: 'Between $5,000 and $15,000 depending on the altitude and location. Travel insurance with helicopter evacuation coverage is not optional for any Himalayan trek.' },

      { type: 'section', value: 'Safety first  -  always' },
      { type: 'text', value: 'AMS is a real risk, but it\'s manageable with the right knowledge and discipline. At HighAir, every guide is certified in wilderness first aid at altitude and carries medical equipment on every trip. We\'ve handled altitude issues across dozens of expeditions. Follow the protocols, tell your guide how you\'re feeling, and the mountains become much safer.' },
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
    excerpt:  'הקילימנג\'רו  -  5895 מ׳, גג אפריקה. כמה ימים לוקח? מתי לטפס? האם זה קשה? המדריך השלם: אימונים, ציוד, מסלולים, מחלת גבהים ועוד.',
    excerptEn: 'Kilimanjaro  -  5,895 m, Roof of Africa. How many days does it take? When should you go? Is it actually hard? Training, gear, acclimatisation, routes, and what to expect.',

    /* ── Hebrew content ── */
    content: [
      { type: 'text', value: 'לעמוד על "גג אפריקה" בגובה 5895 מטר  -  עננים מתחתיכם, השמש זורחת מעל הקרחונים האחרונים שנשארו על ההר. אין צורך בציוד טכני מורכב, אין חבלים ואין קרמפונים. אבל זה לא אומר שזה קל.' },
      { type: 'text', value: 'הקילימנג\'רו הוא מסע פיזי ומנטלי רציני, 7 ימים על ההר, עם גובה שמורגש. ליווינו מאות ישראלים לפסגה  -  הנה מה שצריך לדעת.' },

      { type: 'image', src: '/images/blog/kilimanjaro-trekkers.webp', caption: 'קבוצת מטיילים בדרך לפסגת הקילימנג\'רו' },

      { type: 'heading', value: '1. איך מתאמנים לטיפוס?' },
      { type: 'text', value: 'לא צריך להיות מרתוניסט. מה שהקילימנג\'רו דורש הוא סיבולת לב-ריאה וכוח רגליים  -  מסע של 7 ימים עם הרבה שעות הליכה בשיפוע, באוויר שמידלדל.' },
      { type: 'subheading', value: 'על מה מתמקדים באימון' },
      { type: 'list', items: [
        'אירובי: לפחות 3 חודשים לפני המסע. הליכה בשיפוע (על הליכון או בחוץ), ריצה קלה, שחייה, רכיבה  -  כל מה שמרגיל את הגוף למאמץ ממושך בדופק בינוני.',
        'חיזוק: סקוואטים ולאנג\'ים לארבע-ראשי ותאומים. שרירי ליבה (בטן וגב)  -  אלו שמחזיקים אתכם זקופים עם 6 קילו על הגב אחרי 5 שעות הליכה.',
        'שטח: אין תחליף. סופי שבוע עם תיק 5-7 ק"ג ונעלי הטרקים שלכם  -  גם כדי לרוץ את הנעליים.',
      ]},
      { type: 'text', value: 'יוצאים לטיולי הכנה חודשיים בארץ. אפשר להצטרף.' },
      { type: 'image', src: '/images/blog/kilimanjaro-layers.jpg', caption: 'קבוצת מטיילים בטיול הכנה לקילימנג\'רו של HighAir' },

      { type: 'heading', value: '2. הציוד שיעשה את ההבדל' },
      { type: 'text', value: 'מהבסיס לפסגה עוברים דרך חמש אזורי אקלים שונים  -  מיער טרופי לח בתחתית, דרך מדבר אלפיני, ועד לשלג ולקרחונים בפסגה. בלילה שעולים לפסגה הטמפרטורה יורדת למינוס 10 עד מינוס 15. שיטת השכבות היא מה שמאפשר להתמודד עם כל זה.' },
      { type: 'subheading', value: 'רשימת השכבות המומלצת' },
      { type: 'list', items: [
        'שכבת בסיס (Base Layer): ביגוד תרמי מנדף זיעה שיושב צמוד על הגוף ושומר עליכם יבשים. כלל ברזל: הימנעו מכותנה לחלוטין  -  כותנה סופגת זיעה וקופאת בקור.',
        'שכבת ביניים (Mid Layer): פליז איכותי או מעיל קל/סינתטי שנועד ללכוד את חום הגוף (בידוד).',
        'שכבה חיצונית (Shell): מעיל פוך איכותי ועבה לליל הפסגה, ומעיל גשם/רוח (Gore-Tex) להגנה מפני הגשם.',
      ]},
      { type: 'subheading', value: 'ציוד קריטי נוסף' },
      { type: 'list', items: [
        'נעלי טרקים: חסינות למים, תומכות בקרסול, והכי חשוב – נעולות בטיולים קודמים. הגעה עם נעליים חדשות מהקופסה היא מתכון בטוח ליבלות.',
        'שק שינה: שק שינה איכותי בדירוג Comfort של מינוס 5 מעלות לפחות.',
        'תיק יום (Daypack): בנפח 30-40 ליטר, עם מערכת גב נוחה לנשיאת מים, שכבות וציוד אישי.',
      ]},
      { type: 'text', value: 'חסר ציוד? בחנות שלנו תמצאו דאפל-באג, כיסויי גשם ובקבוקים.' },
      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'מטיילות מצוידות בביגוד לפי שיטת השכבות בדרך לפסגת הקילימנג\'רו' },

      { type: 'heading', value: '3. התאקלמות ומחלת גבהים' },
      { type: 'text', value: 'האתגר בקילימנג\'רו הוא לא השיפוע  -  הוא הגובה. האוויר בפסגה מכיל כ-50% פחות חמצן מפני הים. הגוף מסתגל, אבל צריך זמן.' },
      { type: 'subheading', value: 'מה עוזר להתאקלמות' },
      { type: 'list', items: [
        '"פולה פולה" (Pole Pole)  -  "לאט לאט" בסוואהילי. המדריכים בטנזניה אומרים את זה כל הזמן, ויש סיבה. קצב איטי מכוון מאפשר לגוף להסתגל ושומר אנרגיה שצריכים מאוחר יותר.',
        'מים: הגוף מאבד נוזלים מהר בגובה. 3-4 ליטר ביום  -  לא משנה אם צמאים.',
        'Diamox: התייעצו עם רופא מטיילים. עוזר, אבל לא מחליף ימי התאקלמות.',
        'ניטור: בכל משלחת שלנו יש מד-רוויה ובודקים כל מטייל בוקר וערב.',
      ]},

      { type: 'heading', value: '4. החיים על ההר' },
      { type: 'text', value: 'הרבה מטיילים חוששים מתנאי המחיה בשטח. המציאות יותר נוחה ממה שחושבים. המשלחות שלנו מנוהלות כ"פול סרוויס".' },
      { type: 'list', items: [
        'איפה ישנים? הלינה מתבצעת באוהלי 4 עונות איכותיים וזוגיים, המוקמים עבורכם על ידי צוות הפורטרים. אתם מגיעים למחנה כשהאוהל כבר מוכן.',
        'מה אוכלים? טבח צמוד למשלחת מכין ארוחות חמות, מזינות וטריות בכל יום. יש התאמה מלאה לצמחונים, טבעונים ורגישויות – רק תעדכנו מראש.',
        'שירותים והיגיינה: ישנם בתי שימוש ציבוריים, אך אנו דואגים לאוהל שירותים פרטי לקבוצה. במקום מקלחות משתמשים במגבונים לחים וקערת מים חמים בוקר וערב ("Washy Washy").',
      ]},

      { type: 'image', src: '/images/blog/kilimanjaro-camp.avif', caption: 'לינה באוהלי איכות במחנות הקילימנג\'רו' },

      { type: 'heading', value: '5. הצוות המלווה וטיפים' },
      { type: 'text', value: 'על כל מטייל יש כ-3-4 אנשי צוות: מדריכים ראשיים, עוזרי מדריכים, טבח ופורטרים שסוחבים את האוהלים, האוכל והציוד. בסוף המסע נותנים טיפ לצוות  -  זה חלק משמעותי מהפרנסה שלהם. ניתן פירוט מדויק לפני היציאה.' },

      { type: 'image', src: '/images/blog/kilimanjaro-porters.webp', caption: 'הצוות המקומי והפורטרים של המשלחת בטנזניה' },

      { type: 'heading', value: '6. חיסונים, ויזה וביטוח' },
      { type: 'list', items: [
        'חיסונים: גשו למרפאת מטיילים כחודש לפני הטיסה. בדרך כלל נדרש חיסון קדחת צהובה (Yellow Fever) וטיפול מונע למלריה.',
        'ויזה: ניתן להוציא ויזה לטנזניה אונליין (E-Visa) או בשדה התעופה בנחיתה (בעלות של 50$).',
        'ביטוח: חובה לעשות ביטוח הכולל הרחבה לספורט אתגרי וביטוח חילוץ והצלה. סוכני הביטוח שלנו ייצרו איתכם קשר.',
      ]},

      { type: 'heading', value: '7. בחירת המסלול הנכון' },
      { type: 'text', value: 'אנחנו מובילים דרך מסלול מצ\'אמה (Machame Route). הוא נחשב ליפה מבחינת נופים, אבל הסיבה האמיתית שבחרנו בו היא טופוגרפית: הפרופיל שלו מאפשר יישום טוב של "Climb High, Sleep Low"  -  מטפסים גבוה במהלך היום, יורדים לישון נמוך יותר. זה מה שמעלה את אחוזי ההצלחה לכמעט 96%.' },

      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', caption: 'מעל העננים  -  מסלול מצ\'אמה' },

      { type: 'heading', value: '8. כסף והתנהלות בטנזניה' },
      { type: 'list', items: [
        'המטבע: דולר אמריקאי (USD).',
        'חשוב מאוד: הביאו רק שטרות חדשים (שהודפסו משנת 2009 ואילך). שטרות ישנים לא מתקבלים.',
        'כמה להביא? מומלץ להביא כ-200$ במזומן בשטרות קטנים (1$, 5$, 10$) לקניות מזכרות והוצאות אישיות.',
      ]},

      { type: 'heading', value: '9. הסיום המושלם בספארי' },
      { type: 'text', value: 'אחרי הפסגה, המשלחות שלנו ממשיכות ל-3 ימים של ספארי בשמורות טרנגירי ומכתש נגורונגורו. ביום  -  אריות, פילים, ג\'ירפות מקרוב. בלילה  -  לודג\'ים.' },
      { type: 'heading', value: '10. מתי הזמן הטוב ביותר לטפס על הקילימנג\'רו?' },
      { type: 'text', value: 'הקילימנג\'רו ניתן לטיפוס כל השנה, אבל שתי עונות בולטות:' },
      { type: 'list', items: [
        'ינואר–מרץ (עונת החורף היבשה): מזג אוויר יציב יחסית, שמיים צלולים ופחות מטיילים על ההר  -  מועד מצוין לאלו המעדיפים שקט.',
        'יוני–אוקטובר (עונת הקיץ היבשה): העונה הפופולרית ביותר עם תנאים טובים לטיפוס.',
        'להימנע: אפריל–מאי (עונת הגשמים הגדולה  -  "Long Rains") ונובמבר (עונת הגשמים הקצרה  -  "Short Rains").',
      ]},

      { type: 'section', value: 'שאלות נפוצות על הקילימנג\'רו' },

      { type: 'heading', value: 'כמה ימים לוקח לטפס קילימנג\'רו?' },
      { type: 'text', value: 'מסלול מצ\'אמה  -  שבו אנחנו מובילים  -  נמשך 7 ימים (6 לילות על ההר). יש מסלולים קצרים יותר של 5-6 ימים, אבל הם מקצרים את זמן ההתאקלמות ומורידים משמעותית את אחוזי ההצלחה. אנחנו לא מובילים אותם.' },

      { type: 'heading', value: 'האם קילימנג\'רו קשה לטיפוס?' },
      { type: 'text', value: 'אין צורך בחבלים, ציוד מיוחד או ניסיון טיפוס. האתגר הוא הגובה: 5895 מטר. עם הכנה גופנית של 3 חודשים ומדריכים מנוסים, אחוזי ההצלחה שלנו עומדים על כמעט 96%.' },

      { type: 'heading', value: 'מה הגובה של הקילימנג\'רו?' },
      { type: 'text', value: '"אוהורו פיק" (Uhuru Peak)  -  5895 מטר מעל פני הים. הגבוה ביותר באפריקה וההר העצמאי הגבוה ביותר בעולם.' },

      { type: 'heading', value: 'מה נכלל במשלחת הקילימנג\'רו של HighAir?' },
      { type: 'text', value: 'פול סרוויס: הסעות בטנזניה, כניסה לפארק הלאומי, מדריכים ראשיים ועוזרים, פורטרים, טבח עם ארוחות חמות, אוהלי 4 עונות ואוהל שירותים פרטי. אחרי הטיפוס  -  3 ימי ספארי.' },

      { type: 'heading', value: 'האם ישראלים יכולים לטפס על הקילימנג\'רו?' },
      { type: 'text', value: 'כן. המשלחות מתנהלות בעברית עם מדריכים ישראלים, ויש אפשרות לאוכל כשר. מאות ישראלים הגיעו לפסגה איתנו.' },

      { type: 'section', value: 'מוכנים לצאת?' },
      { type: 'text', value: 'הקילימנג\'רו הוא הר שאפשר לסיים  -  עם הכנה נכונה ומדריכים מנוסים. הפסגה בגובה 5895 מ\' מחכה. אם רוצים פרטים על התאריכים הקרובים, שלחו הודעה.' },
      { type: 'cta', text: 'לפרטים, תאריכים והרשמה לקילימנג\'רו', textEn: 'Kilimanjaro  -  Dates & Registration', href: '/expedition/kilimanjaro' },
    ],

    /* ── English content ── */
    titleEn: 'Climbing Kilimanjaro: the complete guide (2025)  -  training, gear, routes and summit tips',
    contentEn: [
      { type: 'text', value: 'Standing on the Roof of Africa at 5,895 metres, clouds below you, sun coming up over the glaciers  -  it\'s one of those moments that doesn\'t really translate into words. Kilimanjaro is one of the most accessible high-altitude mountains in the world. No ropes, no crampons, no prior mountaineering experience required. But don\'t let that fool you: this is still a serious physical and mental undertaking.' },
      { type: 'text', value: 'At HighAir Expeditions we\'ve guided hundreds of trekkers to the summit. This guide covers training, gear, the route we use, altitude management, life on the mountain, and everything logistical you need to know.' },
      { type: 'text', value: 'Save it. You\'ll want it.' },

      { type: 'image', src: '/images/blog/kilimanjaro-trekkers.webp', caption: 'Group on the trail to Kilimanjaro\'s summit' },

      { type: 'heading', value: '1. How to train' },
      { type: 'text', value: 'You don\'t need to be a marathon runner. What Kilimanjaro demands is cardiovascular endurance and leg strength  -  the ability to walk for many hours on inclines in progressively thinner air. Start 3 months out and you\'ll be in good shape.' },
      { type: 'subheading', value: 'Three things to focus on' },
      { type: 'list', items: [
        'Cardio: Uphill walking on a treadmill or outdoors, light jogging, swimming, or cycling. The goal is sustained moderate-effort output, not speed.',
        'Leg and core strength: Squats and lunges for quads and calves. Don\'t ignore your core  -  it\'s what keeps you upright under a loaded pack for six hours.',
        'Trail time: Nothing substitutes for actual hiking. Get out on weekends with a 5–7 kg pack and your trekking boots. This is also how you break the boots in properly.',
      ]},
      { type: 'text', value: 'Want to train with us? Join the HighAir trekking community on our monthly preparation hikes.' },
      { type: 'image', src: '/images/blog/kilimanjaro-layers.jpg', caption: 'HighAir preparation hike  -  packs, boots, and real terrain' },

      { type: 'heading', value: '2. Gear' },
      { type: 'text', value: 'From the base to the summit you pass through dramatically different climate zones  -  lush rainforest, moorland, alpine desert, and glaciers. On summit night the temperature can drop to -10°C or lower. The layering system is how you handle all of it.' },
      { type: 'subheading', value: 'Layering' },
      { type: 'list', items: [
        'Base layer: moisture-wicking thermal clothing close to the skin. Avoid cotton entirely  -  it absorbs sweat and is dangerous in the cold.',
        'Mid layer: quality fleece or a lightweight synthetic jacket for insulation.',
        'Outer layer: a heavy down jacket for summit night plus a Gore-Tex rain/wind shell.',
      ]},
      { type: 'subheading', value: 'Other gear you actually need' },
      { type: 'list', items: [
        'Hiking boots: waterproof, ankle-supportive, and broken in before you arrive. New-out-of-the-box boots guarantee blisters.',
        'Sleeping bag: Comfort-rated -5°C minimum.',
        'Daypack: 30–40 litres with a proper back system.',
      ]},
      { type: 'text', value: 'Need to fill gaps in your kit? Our gear store carries quality duffel bags, rain covers, and durable bottles.' },
      { type: 'image', src: '/images/blog/kilimanjaro-training.webp', caption: 'Properly layered trekkers on the way to the summit' },

      { type: 'heading', value: '3. Acclimatisation and altitude sickness' },
      { type: 'text', value: 'The hardest part of Kilimanjaro is not the slope  -  it\'s the altitude. The summit air has about 50% less oxygen than at sea level. Your body can adapt, but it needs time and a smart pace.' },
      { type: 'subheading', value: 'What helps' },
      { type: 'list', items: [
        '"Pole Pole" (slowly, slowly): The phrase you\'ll hear constantly from guides in Tanzania. It\'s not just a saying  -  a deliberately slow pace lets your body adjust and conserves energy you\'ll need later.',
        'Water: your body loses fluids faster at altitude. Drink 3–4 litres per day even if you don\'t feel particularly thirsty.',
        'Diamox: discuss with a travel physician before departure. It can help, but it doesn\'t replace proper acclimatisation.',
        'Daily monitoring: every HighAir expedition uses a pulse oximeter to check each trekker\'s oxygen levels morning and evening.',
      ]},

      { type: 'heading', value: '4. Life on the mountain' },
      { type: 'text', value: 'Most people are pleasantly surprised by the conditions. Our expeditions run full service.' },
      { type: 'list', items: [
        'Sleeping: quality 4-season twin tents set up by the porter team before you arrive at camp.',
        'Food: a dedicated cook prepares hot, fresh meals every day. Vegetarians, vegans, and dietary requirements are fully catered for  -  just tell us in advance.',
        'Hygiene: we carry a private toilet tent for the group. Showers don\'t exist on the mountain, so we use wet wipes and a bowl of warm water morning and evening (the local "Washy Washy" routine).',
      ]},

      { type: 'image', src: '/images/blog/kilimanjaro-camp.avif', caption: 'Camp life on Kilimanjaro' },

      { type: 'heading', value: '5. The crew and tipping' },
      { type: 'text', value: 'Getting to the summit depends heavily on the local team. For each trekker there are roughly 3–4 crew members: head guides, assistant guides, a cook, and porters carrying tents, food, and heavy equipment. Tipping at the end of the expedition is expected and important  -  it\'s a meaningful part of the crew\'s income. We\'ll brief you on appropriate amounts before departure.' },

      { type: 'image', src: '/images/blog/kilimanjaro-porters.webp', caption: 'The local crew in Tanzania' },

      { type: 'heading', value: '6. Vaccinations, visa and insurance' },
      { type: 'list', items: [
        'Vaccinations: see a travel clinic about a month before flying. Yellow Fever vaccination and malaria prevention are typically required.',
        'Visa: available online (E-Visa) or on arrival at the airport ($50).',
        'Insurance: travel insurance with adventure sports coverage and evacuation is mandatory. Our team can connect you with the right providers.',
      ]},

      { type: 'heading', value: '7. The route' },
      { type: 'text', value: 'We guide via the Machame Route, which is both the most scenic and the best for acclimatisation. Its profile naturally applies "Climb High, Sleep Low"  -  you gain significant altitude during the day and descend to sleep lower. This pushes our summit success rate to nearly 96%.' },

      { type: 'image', src: '/images/blog/kilimanjaro-machame.webp', caption: 'Above the clouds on the Machame Route' },

      { type: 'heading', value: '8. Money in Tanzania' },
      { type: 'list', items: [
        'Currency: US dollars (USD).',
        'Bring only notes printed from 2009 onwards  -  older bills are often refused.',
        'Around $200 in small denominations ($1, $5, $10) covers souvenirs and personal expenses.',
      ]},

      { type: 'heading', value: '9. Safari after the climb' },
      { type: 'text', value: 'After the summit, our expeditions continue with 3 full days of safari in Tarangire and the Ngorongoro Crater. Lions, elephants, and giraffes during the day; comfortable lodges at night. It\'s a hard combination to beat.' },
      { type: 'heading', value: '10. When to climb' },
      { type: 'text', value: 'Kilimanjaro is climbable year-round, but two dry-season windows stand out:' },
      { type: 'list', items: [
        'January–March: stable weather, clear skies, fewer trekkers  -  good for those who want a quieter mountain.',
        'June–October: the most popular season with the most reliable conditions.',
        'Avoid April–May (Long Rains) and November (Short Rains).',
      ]},

      { type: 'section', value: 'Kilimanjaro FAQ' },

      { type: 'heading', value: 'How many days does it take?' },
      { type: 'text', value: 'The Machame Route takes 7 days (6 nights on the mountain). Shorter 5–6 day routes exist but significantly reduce acclimatisation time and drop success rates. We don\'t run them.' },

      { type: 'heading', value: 'Is Kilimanjaro hard to climb?' },
      { type: 'text', value: 'No technical skills required  -  no ropes, crampons, or mountaineering background. The altitude is the real challenge: 5,895 metres. With 3 months of preparation and good guides, HighAir\'s success rate is nearly 96%.' },

      { type: 'heading', value: 'How high is Kilimanjaro?' },
      { type: 'text', value: 'Uhuru Peak stands at 5,895 metres (19,341 ft). It\'s the highest mountain in Africa and the highest freestanding mountain in the world.' },

      { type: 'heading', value: 'What\'s included in a HighAir Kilimanjaro expedition?' },
      { type: 'text', value: 'Full service: Tanzania transfers, national park fees, head and assistant guides, porters, a dedicated cook with hot meals, 4-season tents, camp equipment, and a private toilet tent. After the climb: 3 days of safari.' },

      { type: 'heading', value: 'Can beginners climb Kilimanjaro?' },
      { type: 'text', value: 'Yes. It\'s the ideal first high-altitude mountain. No experience needed  -  just decent fitness and proper preparation. Our guides have taken complete first-timers and experienced mountaineers, and everyone gets the same level of support.' },

      { type: 'section', value: 'Ready to go?' },
      { type: 'text', value: 'Kilimanjaro is achievable. With the right preparation and a team that\'s done this hundreds of times, the summit is well within reach. The mountain isn\'t going anywhere.' },
      { type: 'cta', text: 'לפרטים, תאריכים והרשמה לקילימנג\'רו', textEn: 'Kilimanjaro  -  Dates & Registration', href: '/expedition/kilimanjaro' },
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
