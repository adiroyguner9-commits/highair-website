/**
 * safariData.js — content for the /safari hub page.
 *
 * Kept OUT of mockData.js on purpose: this is hub content (when to go, which
 * reserves, where you sleep), not per-expedition data. The three safari trips
 * themselves live in mockData.js as ordinary expedition entries (ids 18/19/20).
 *
 * THE PRODUCT RULE (owner, Jul 30 2026): every HighAir safari is PRIVATE — your
 * own jeep, your own driver-guide, your own pace. The single exception is the
 * 3-day safari that runs as a GROUP departure straight after a Kilimanjaro
 * climb, for climbers coming off the mountain together. Anything written here
 * must respect that distinction.
 *
 * Structure takes its cue from altezzatravel.com (owner, Jul 30 2026), adapted
 * to our model: we sell three fixed lengths, so the package cards stay the hero
 * and these sections support the decision rather than replace it.
 *
 * Seasonal facts below are the standard northern-circuit pattern (calving in
 * the southern Serengeti Jan-Feb, long rains Mar-May, dry season and river
 * crossings Jun-Oct, short rains Nov). Prices are NOT set here — they live on
 * the trip entries in mockData.js and are the owner's to fill.
 */

/* ── When to go ──────────────────────────────────────────────────────────
   Rendered as an INTERACTIVE guide: 12 month chips plus a detail panel.
   rating drives the chip colour:
     'best' = prime · 'good' = very good · 'ok' = shoulder / green season     */
export const SAFARI_SEASONS = [
  { month: 'ינואר', monthEn: 'January', rating: 'best',
    temp: '28° / 15°',
    weather: 'חם ויבש, ממטרים קצרים בערב', weatherEn: 'Hot and dry, short evening showers',
    wildlife: 'עונת ההמלטות בנדוטו', wildlifeEn: 'Calving season in Ndutu',
    crowds: 'עמוס', crowdsEn: 'Busy',
    note: 'אחד החודשים המרשימים בשנה. בדרום הסרנגטי ממליטות מאות אלפי גנואים בתוך שבועות ספורים, ואחריהן מגיעים האריות והברדלסים. עמוס יחסית בגלל חופשות החורף.',
    noteEn: 'One of the most dramatic months of the year. Hundreds of thousands of wildebeest give birth in the southern Serengeti within a few weeks, and the lions and cheetahs follow. Relatively busy because of the winter holidays.' },

  { month: 'פברואר', monthEn: 'February', rating: 'best',
    temp: '28° / 15°',
    weather: 'חם ובהיר', weatherEn: 'Hot and clear',
    wildlife: 'שיא ההמלטות, ריכוזי טורפים', wildlifeEn: 'Peak calving, predator concentrations',
    crowds: 'בינוני', crowdsEn: 'Moderate',
    note: 'לדעתנו החודש הטוב בשנה לצפייה בטורפים. העדרים מרוכזים בשטח קטן יחסית, הצילום מצוין, והעומס נמוך יותר מינואר.',
    noteEn: 'In our view the best month of the year for predator viewing. The herds are concentrated in a relatively small area, the photography is excellent, and it is quieter than January.' },

  { month: 'מרץ', monthEn: 'March', rating: 'ok',
    temp: '28° / 16°',
    weather: 'תחילת עונת הגשמים הארוכה', weatherEn: 'Start of the long rains',
    wildlife: 'העדרים מתחילים לנוע צפונה', wildlifeEn: 'The herds begin moving north',
    crowds: 'שקט', crowdsEn: 'Quiet',
    note: 'חודש מעבר. הגשמים מתחילים לקראת סופו, הנוף מוריק והשמורות מתרוקנות ממבקרים. מתאים למי שמחפש שקט ומוכן להירטב מדי פעם.',
    noteEn: 'A transition month. The rains begin toward its end, the landscape turns green and the reserves empty out. Good for anyone looking for quiet and willing to get wet occasionally.' },

  { month: 'אפריל', monthEn: 'April', rating: 'ok',
    temp: '27° / 16°',
    weather: 'עונת הגשמים הארוכה', weatherEn: 'The long rains',
    wildlife: 'צמחייה גבוהה, צפייה מאתגרת', wildlifeEn: 'Tall vegetation, harder viewing',
    crowds: 'שקט מאוד', crowdsEn: 'Very quiet',
    note: 'החודש הגשום בשנה. הנוף במיטבו והשמורות כמעט ריקות, אבל הצמחייה הגבוהה מקשה על איתור חיות וחלק מדרכי העפר קשות למעבר.',
    noteEn: 'The wettest month of the year. The landscape is at its best and the reserves are nearly empty, but tall vegetation makes spotting harder and some dirt tracks become difficult.' },

  { month: 'מאי', monthEn: 'May', rating: 'ok',
    temp: '26° / 15°',
    weather: 'סוף הגשמים, מתבהר', weatherEn: 'Rains ending, clearing up',
    wildlife: 'העדרים במרכז הסרנגטי', wildlifeEn: 'Herds in the central Serengeti',
    crowds: 'שקט', crowdsEn: 'Quiet',
    note: 'סוף העונה הירוקה. לקראת אמצע החודש הגשמים נחלשים, האוויר צלול במיוחד והשמורות עדיין שקטות. יחס תמורה למחיר מצוין.',
    noteEn: 'The end of the green season. Around mid-month the rains ease, the air is exceptionally clear and the reserves are still quiet. Excellent value.' },

  { month: 'יוני', monthEn: 'June', rating: 'good',
    temp: '25° / 13°',
    weather: 'יבש וצלול, לילות קרירים', weatherEn: 'Dry and clear, cool nights',
    wildlife: 'החיות מתרכזות סביב מים', wildlifeEn: 'Animals gather around water',
    crowds: 'בינוני', crowdsEn: 'Moderate',
    note: 'תחילת העונה היבשה, ולדעתנו אחד החודשים הנוחים בשנה. הצמחייה מתקצרת, החיות מתרכזות סביב מקורות מים, והעומס עדיין לא בשיא.',
    noteEn: 'The dry season begins, and in our view one of the most comfortable months of the year. Vegetation thins out, animals gather around water sources, and the crowds have not peaked yet.' },

  { month: 'יולי', monthEn: 'July', rating: 'best',
    temp: '25° / 12°',
    weather: 'יבש ובהיר, לילות קרים', weatherEn: 'Dry and bright, cold nights',
    wildlife: 'תחילת חציות הנהרות', wildlifeEn: 'River crossings begin',
    crowds: 'עמוס', crowdsEn: 'Busy',
    note: 'עונת השיא. העדרים מגיעים לנהרות ומתחילות החציות הדרמטיות. צפייה מצוינת בכל השמורות, אבל זה גם החודש העמוס בשנה, ולכן כדאי להזמין מוקדם.',
    noteEn: 'Peak season. The herds reach the rivers and the dramatic crossings begin. Excellent viewing across all the reserves, but also the busiest month of the year, so book early.' },

  { month: 'אוגוסט', monthEn: 'August', rating: 'best',
    temp: '25° / 12°',
    weather: 'יבש ובהיר', weatherEn: 'Dry and bright',
    wildlife: 'חציות נהר המארה בצפון', wildlifeEn: 'Mara River crossings in the north',
    crowds: 'עמוס', crowdsEn: 'Busy',
    note: 'החודש המזוהה ביותר עם הנדידה הגדולה. חציות נהר המארה בצפון הסרנגטי, וצפייה מעולה גם בנגורונגורו ובטרנגירי. מומלץ לסגור חודשים מראש.',
    noteEn: 'The month most associated with the Great Migration. Mara River crossings in the northern Serengeti, with excellent viewing in Ngorongoro and Tarangire too. Book months in advance.' },

  { month: 'ספטמבר', monthEn: 'September', rating: 'best',
    temp: '26° / 13°',
    weather: 'יבש ונעים', weatherEn: 'Dry and pleasant',
    wildlife: 'המשך חציות, פילים בטרנגירי', wildlifeEn: 'Crossings continue, elephants in Tarangire',
    crowds: 'בינוני', crowdsEn: 'Moderate',
    note: 'כל היתרונות של אוגוסט עם פחות מבקרים. הנדידה עדיין בצפון, טרנגירי בשיא עונת הפילים, ומזג האוויר מהנוח בשנה.',
    noteEn: 'All the advantages of August with fewer visitors. The migration is still in the north, Tarangire is at the height of its elephant season, and the weather is the most pleasant of the year.' },

  { month: 'אוקטובר', monthEn: 'October', rating: 'good',
    temp: '27° / 14°',
    weather: 'יבש ומתחמם', weatherEn: 'Dry and warming up',
    wildlife: 'העדרים חוזרים דרומה', wildlifeEn: 'The herds head back south',
    crowds: 'בינוני', crowdsEn: 'Moderate',
    note: 'סוף העונה היבשה. הצפייה עדיין מצוינת והשמורות מתחילות להתרוקן. חודש טוב למי שרוצה איזון בין נוכחות חיות לשקט.',
    noteEn: 'The end of the dry season. Viewing is still excellent and the reserves begin to empty. A good month for anyone wanting a balance between wildlife activity and quiet.' },

  { month: 'נובמבר', monthEn: 'November', rating: 'ok',
    temp: '27° / 15°',
    weather: 'עונת הגשמים הקצרים', weatherEn: 'The short rains',
    wildlife: 'ציפורים נודדות, נוף מוריק', wildlifeEn: 'Migratory birds, green landscape',
    crowds: 'שקט', crowdsEn: 'Quiet',
    note: 'עונת הגשמים הקצרים, בדרך כלל ממטר אחד ביום ולא יותר. הנוף מוריק, מגיעות ציפורים נודדות, והשמורות שקטות. אופציה טובה למי שגמיש בתאריכים.',
    noteEn: 'The short rains, usually one shower a day and no more. The landscape turns green, migratory birds arrive and the reserves are quiet. A good option for anyone flexible on dates.' },

  { month: 'דצמבר', monthEn: 'December', rating: 'good',
    temp: '28° / 15°',
    weather: 'חם, ממטרים מתפזרים', weatherEn: 'Hot, scattered showers',
    wildlife: 'העדרים חוזרים לדרום הסרנגטי', wildlifeEn: 'The herds return to the southern Serengeti',
    crowds: 'עמוס לקראת סוף החודש', crowdsEn: 'Busy toward month end',
    note: 'העדרים חוזרים לדרום לקראת עונת ההמלטות. תחילת החודש שקטה יחסית, וסופו עמוס בגלל חופשות החג.',
    noteEn: 'The herds return south ahead of the calving season. The start of the month is relatively quiet, the end is busy because of the holidays.' },
];

/* ── The reserves ────────────────────────────────────────────────────────
   `img` points at where the photo WILL live. Drop the file at that exact path
   and the card fills in with no code change.                                */
export const SAFARI_RESERVES = [
  {
    slug: 'serengeti',
    name: 'סרנגטי', nameEn: 'Serengeti',
    desc: 'המישור האינסופי שנתן לספארי את שמו. כאן מתרחשת הנדידה הגדולה, וכאן הסיכוי הגבוה ביותר לראות אריות, ברדלסים ונמרים באותו יום.',
    descEn: 'The endless plain that gave the safari its name. This is where the Great Migration happens, and where you have the best chance of seeing lions, cheetahs and leopards in a single day.',
    img: '/images/safari/serengeti.webp',
  },
  {
    slug: 'ngorongoro',
    name: 'מכתש נגורונגורו', nameEn: 'Ngorongoro Crater',
    desc: 'מכתש וולקני בקוטר 19 ק״מ ובו מערכת אקולוגית שלמה וסגורה. ריכוז החיות בו מהגבוהים באפריקה, וזה המקום הטוב ביותר בטנזניה לראות קרנף שחור.',
    descEn: 'A 19 km wide volcanic caldera holding a complete, self-contained ecosystem. Its wildlife density is among the highest in Africa, and it is the best place in Tanzania to see a black rhino.',
    img: '/images/safari/ngorongoro.webp',
  },
  {
    slug: 'tarangire',
    name: 'טרנגירי', nameEn: 'Tarangire',
    desc: 'שמורת עצי הבאובב והפילים. בעונה היבשה מגיעים לנהר טרנגירי עדרי פילים גדולים במיוחד, מהמרשימים שאפשר לראות במזרח אפריקה.',
    descEn: 'The park of baobabs and elephants. In the dry season exceptionally large elephant herds gather at the Tarangire River, among the most impressive in East Africa.',
    img: '/images/safari/tarangire.webp',
  },
  {
    /* Cultural visit, like the Hadzabe. The Maasai boma sits on the Ngorongoro
       highlands, so it slots naturally into the crater day. */
    slug: 'maasai',
    kind: 'culture',
    name: 'שבט המסאי', nameEn: 'The Maasai',
    desc: 'רועי הבקר של מזרח אפריקה, שחיים על רמות נגורונגורו בשמיכות האדומות המזוהות איתם. ביקור בבומה, מפגש עם המשפחה וריקוד הקפיצות.',
    descEn: 'The cattle herders of East Africa, living on the Ngorongoro highlands in the red shukas they are known for. A visit to a boma, a traditional village, meeting the family, the jumping dance and an explanation of a way of life kept almost unchanged.',
    img: '/images/safari/maasai.webp',
  },
  {
    /* NOT a reserve — a cultural visit, and it appears on all three itineraries.
       Carries `kind: 'culture'` so the card can label itself honestly instead of
       passing as a national park. */
    slug: 'hadzabe',
    kind: 'culture',
    name: 'שבט ההדזבה', nameEn: 'The Hadzabe',
    desc: 'אחת מקהילות הלקטים-ציידים האחרונות באפריקה. יוצאים איתם לציד בוקר, לומדים להדליק אש ולאתר מזון, ומבקרים גם אצל הדאטוגה, נפחי הכפר.',
    descEn: 'One of the last hunter-gatherer communities in Africa. You join them on a morning hunt, learn how they make fire and find food, and also visit the Datoga, blacksmiths still working by traditional methods.',
    img: '/images/safari/hadzabe.webp',
  },
];

/* ── Where you sleep ─────────────────────────────────────────────────────
   The REAL camps and lodges we work with (owner, Jul 30 2026). On a safari the
   accommodation is half the experience, which is why it gets its own row rather
   than one line inside "what's included".

   NO PHOTO YET, AND DELIBERATELY SO: a stock photo sitting under a named lodge
   is a specific false claim, which is worse than the same photo under a generic
   "lodges" heading. These cards show a savanna gradient until real photographs
   from our own departures arrive. Drop a file at `img` and the tile fills in.

   `area` is the factual anchor: it ties each stay to the reserve and to the day
   in the itinerary, which is what makes the list mean something to a reader.   */
export const SAFARI_LODGING = [
  {
    slug: 'baobab-mara',
    name: 'Baobab Mara Luxury Camp', nameEn: 'Baobab Mara Luxury Camp',
    area: 'צפון הסרנגטי', areaEn: 'North Serengeti',
    desc: 'קמפ אוהלים יוקרתי בצפון הסרנגטי, באזור שבו חוצות העדרים את נהר המארה. הלינה כאן מאפשרת להיות בשטח בשעות שבהן החציות מתרחשות.',
    descEn: 'A luxury tented camp in the northern Serengeti, in the area where the herds cross the Mara River. Staying here is what lets you be in the field at the hours the crossings actually happen, without long drives.',
    img: '/images/safari/baobab-mara.webp',
  },
  {
    slug: 'heritage-luxury',
    name: 'Heritage Luxury Tented Camp', nameEn: 'Heritage Luxury Tented Camp',
    area: 'מרכז הסרנגטי', areaEn: 'Central Serengeti',
    desc: 'קמפ אוהלים יוקרתי במרכז הסרנגטי, האזור עם ריכוז החיות הגבוה ביותר לאורך כל השנה. בסיס מצוין לימי צפייה מלאים בטורפים.',
    descEn: 'A luxury tented camp in the central Serengeti, the area with the highest year-round wildlife concentration. An excellent base for full days of big-cat viewing.',
    img: '/images/safari/heritage-luxury.webp',
  },
  {
    slug: 'kudu-karatu',
    name: 'Kudu Lodge Karatu', nameEn: 'Kudu Lodge Karatu',
    area: 'קראטו', areaEn: 'Karatu',
    desc: 'לודג׳ בקראטו, העיירה שעל שפת רמת נגורונגורו. מכאן היציאה אל המכתש היא קצרה, וזה גם אזור מטעי הקפה שבו נמצאות אטרקציות היום.',
    descEn: 'A lodge in Karatu, the town on the edge of the Ngorongoro highlands. From here the drive into the crater is short, and it is also the coffee-farm country where the day trips are.',
    img: '/images/safari/kudu-karatu.webp',
  },
  {
    slug: 'farm-of-dream',
    name: 'Farm of Dream Karatu', nameEn: 'Farm of Dream Karatu',
    area: 'קראטו', areaEn: 'Karatu',
    desc: 'לודג׳ נוסף בקראטו, על שפת רמת נגורונגורו. גם ממנו היציאה אל המכתש קצרה, והוא יושב באזור מטעי הקפה של האזור.',
    descEn: 'A second lodge in Karatu, on the edge of the Ngorongoro highlands. The drive into the crater is short from here too, and it sits in the area\'s coffee-farm country.',
    img: '/images/safari/farm-of-dream.webp',
  },
];

/* ── Day trips in Tanzania ───────────────────────────────────────────────
   Add-ons around Moshi / Arusha, sold alongside a safari or a Kilimanjaro
   climb. Adding another attraction is one object here — the card row picks it
   up with no code change. Same for the photo: drop the file at `img`.        */
export const SAFARI_DAY_TRIPS = [
  {
    /* ONE attraction, not two (owner, Jul 30 2026): the Materuni village day
       covers the waterfall and the coffee farm together. */
    slug: 'materuni',
    name: 'מפלי מטרוני וחוות הקפה', nameEn: 'Materuni Waterfalls & Coffee Farm',
    desc: 'יום בכפר מטרוני שלמרגלות הקילימנג׳רו: הליכה ביער אל מפל גבוה, ואחריה חוות קפה מקומית, קלייה וטחינה מסורתית וכוס קפה טרי מול ההר.',
    descEn: 'A day in Materuni village at the foot of Kilimanjaro: a forest walk to a tall waterfall, followed by a visit to a local coffee farm, traditional roasting and grinding, and a fresh cup facing the mountain.',
    duration: 'יום מלא', durationEn: 'Full day',
    img: '/images/safari/materuni.webp',
  },
  /* More attractions go here as the owner sends them — copy the object above. */
];

/* ── How a safari day works ──────────────────────────────────────────────
   The questions every first-timer asks. Cheap to answer, and it removes most
   of the hesitation before the enquiry.                                      */
/* `icon` is an SVG icon NAME resolved against components/Icons.jsx by the page.
   NO EMOJI anywhere on this site — standing owner rule. */
export const SAFARI_HOW_IT_WORKS = [
  {
    icon: 'users',
    title: 'ספארי פרטי, הג׳יפ שלכם בלבד', titleEn: 'A private safari, your jeep alone',
    desc: 'כל הספארי שלנו פרטיים: ג׳יפ 4X4 פתוח גג עד 6 מקומות, נהג-מדריך משלכם, ובלי אף אחד אחר. אתם קובעים מתי לעצור, כמה זמן להישאר וכמה לצלם.',
    descEn: 'All our safaris are private: an open-roof 4X4 jeep with up to 6 seats, your own driver-guide, and nobody else. You decide when to stop, how long to stay and how much to photograph.',
  },
  {
    /* Was "Out at first light", which contradicted itself (first light AND after
       breakfast) and contradicted the private-safari promise in the card above by
       imposing a fixed timetable. Rewritten around the thing that is actually
       true and actually sells: on a private safari the day is yours. */
    icon: 'clock',
    title: 'הקצב שלכם, לא של לוח זמנים', titleEn: 'Your pace, not a timetable',
    desc: 'בספארי פרטי אתם קובעים את היום. מי שרוצה לפגוש טורפים יוצא מוקדם, מי שמעדיף בוקר רגוע יוצא אחר כך. ואם משהו מעניין קורה בשטח, נשארים איתו כמה שרוצים ולא ממשיכים כי יש לוח זמנים.',
    descEn: 'On a private safari you set the day. If you want to meet predators you head out early; if you prefer a slow morning you go later. And when something interesting happens in the field you stay with it as long as you like, instead of moving on because a schedule says so.',
  },
  {
    icon: 'gps',
    title: 'נהג-מדריך מקומי', titleEn: 'A local driver-guide',
    desc: 'הנהגים שלנו הם מדריכי שטח מוסמכים דוברי אנגלית, שמכירים את השמורות ואת הרגלי בעלי החיים לעומק. הם אלה שיודעים איפה לחפש, וזה ההבדל בין יום טוב ליום יוצא דופן.',
    descEn: 'Our drivers are certified English-speaking field guides who know the reserves and the animals\' habits deeply. They are the ones who know where to look, and that is the difference between a good day and an exceptional one.',
  },
  {
    icon: 'check',
    title: 'הכול מסודר מראש', titleEn: 'Everything arranged in advance',
    desc: 'אישורי כניסה לשמורות, לינה, ארוחות והסעות מסודרים לפני שאתם ממריאים. אתם מגיעים, נכנסים לג׳יפ ומתחילים.',
    descEn: 'Reserve permits, accommodation, meals and transfers are arranged before you fly. You arrive, get in the jeep and begin.',
  },
];

/* ── Hub FAQ ─────────────────────────────────────────────────────────────
   Hub-level questions, the ones asked BEFORE choosing a length. Per-trip
   questions stay on each trip page.                                          */
export const SAFARI_FAQ = [
  {
    q: 'הספארי פרטי או בקבוצה?',
    a: 'כל הספארי שלנו פרטיים: הג׳יפ, הנהג-מדריך והמסלול שלכם בלבד. היוצא מן הכלל היחיד הוא ספארי 3 הימים שיוצא כקבוצה מיד אחרי טיפוס הקילימנג׳רו, למטפסים שיורדים מההר יחד וממשיכים לספארי באותה חבורה.',
    qEn: 'Is the safari private or in a group?',
    aEn: 'All our safaris are private: the jeep, the driver-guide and the route are yours alone. The one exception is the 3-day safari that departs as a group right after a Kilimanjaro climb, for climbers coming off the mountain together who continue as one party.',
  },
  {
    q: 'כמה ימי ספארי כדאי לעשות?',
    a: 'שלושה ימים מספיקים לנגורונגורו ולטרנגירי ומתאימים במיוחד כתוספת אחרי קילימנג׳רו. חמישה ימים מוסיפים את הסרנגטי, וזה האיזון המבוקש ביותר. שבעה ימים מאפשרים להגיע עמוק לתוך הסרנגטי בעקבות הנדידה, בלי למהר.',
    qEn: 'How many safari days should I do?',
    aEn: 'Three days covers Ngorongoro and Tarangire and works especially well as an add-on after Kilimanjaro. Five days adds the Serengeti, and it is the most requested balance. Seven days lets you go deep into the Serengeti following the migration, without rushing.',
  },
  {
    q: 'מתי הכי כדאי לצאת?',
    a: 'העונה היבשה, מיוני עד אוקטובר, נחשבת לטובה ביותר לצפייה, ויולי-אוגוסט הם שיא הנדידה והחציות. ינואר-פברואר הם עונת ההמלטות בדרום הסרנגטי, ולדעתנו מהזמנים המרשימים בשנה. במדריך העונות בעמוד הזה יש פירוט חודש בחודש.',
    qEn: 'When is the best time to go?',
    aEn: 'The dry season, June to October, is considered best for viewing, and July and August are the peak of the migration and the river crossings. January and February are the calving season in the southern Serengeti, in our view among the most spectacular times of year. The season guide on this page breaks it down month by month.',
  },
  {
    q: 'האם צריך חיסונים או טיפול נגד מלריה?',
    a: 'טנזניה נמצאת באזור מלריה, ומומלץ להתייעץ עם רופא או עם מרפאת מטיילים לגבי טיפול מונע וחיסונים לפני הנסיעה. ההחלטה היא של הרופא בהתאם למסלול המלא שלכם, במיוחד אם משלבים גם קילימנג׳רו או זנזיבר.',
    qEn: 'Do I need vaccinations or malaria prophylaxis?',
    aEn: 'Tanzania is in a malaria zone, and we recommend consulting a doctor or a travel clinic about prophylaxis and vaccinations before you go. The decision belongs to your doctor, based on your full itinerary, especially if you are also combining Kilimanjaro or Zanzibar.',
  },
  {
    q: 'האם ספארי מתאים לילדים?',
    a: 'בהחלט. הספארי הפרטי מאפשר להתאים את קצב הימים לילדים, לקצר נסיעות ולעצור מתי שצריך, וזה בדיוק היתרון של מסע שאינו קבוצתי. נשמח להתאים איתכם מסלול לפי גיל הילדים.',
    qEn: 'Is a safari suitable for children?',
    aEn: 'Absolutely. A private safari lets you tailor the pace to children, shorten drives and stop whenever needed, which is exactly the advantage of a journey that is not in a group. We are happy to shape an itinerary around your children\'s ages.',
  },
  {
    q: 'אפשר לשלב ספארי עם טיפוס לקילימנג׳רו?',
    a: 'כן, וזה השילוב הנפוץ ביותר אצלנו. אחרי הירידה מההר יוצאים לספארי בשמורות הצפון, לרוב שלושה ימים. אפשר גם להאריך לחמישה או שבעה ימים ולעשות אותו כמסע פרטי.',
    qEn: 'Can I combine a safari with a Kilimanjaro climb?',
    aEn: 'Yes, and it is the most common combination we run. After coming down from the mountain you head out on safari in the northern reserves, usually for three days. You can also extend to five or seven days and run it as a private journey.',
  },
  {
    q: 'מה לובשים ומה מביאים?',
    a: 'בגדים בגוונים ניטרליים, שכבה חמה לבוקר ולערב, כובע, משקפי שמש וקרם הגנה. מצלמה עם זום ומשקפת משפרות מאוד את החוויה. רשימת ציוד מלאה נשלחת לכל נרשם.',
    qEn: 'What do I wear and what do I bring?',
    aEn: 'Neutral-coloured clothing, a warm layer for mornings and evenings, a hat, sunglasses and sunscreen. A camera with a zoom and a pair of binoculars improve the experience a great deal. A full gear list is sent to every participant.',
  },
];

/* Savanna palette — the one place safari colours are defined, so the hub page
   and anything added later stay in step. The rest of the site keeps its purple.
   Lightened Jul 30 2026 (owner: "too dark"): the band moved off near-black
   earth onto warm ochre → gold. White heading text still clears 4.5:1 on the
   darkest stop of the band, so the hero stays readable. */
export const SAFARI_COLOR = {
  deep:   '#4A3218',   // heading brown
  earth:  '#C2610C',   // band start — warm ochre
  ochre:  '#E08A1E',   // band middle
  gold:   '#F5B942',   // band end / acacia gold
  green:  '#7BA23F',   // acacia leaf
  sand:   '#FFFDF9',   // page background
  sandLine: '#F0E7DA', // hairline on sand
  ink:    '#6B5540',   // body text, warm mid-brown
};
