/* aboutData.js: the About page's story and team, in Hebrew and English.
   AboutUs.jsx renders them, and the page's static shell (text layer, see
   scripts/lib/text-layer.mjs) reads the same lists, so what a search or AI
   crawler reads is exactly what a visitor reads. Team photos are matched by
   `key` to src/assets/team/<key>.* in AboutUs.jsx. */

/* ── Story text ── */
export const STORY_HE = [
  'נעים להכיר, אני חן שקד בן 29 מתל אביב. את עולם הטרקים וטיפוסי ההרים פגשתי לראשונה רק אחרי הצבא בנפאל, שם התאהבתי בנופים ובניתוק שרק ההרים יכולים לספק. מאז טיפסתי על הקזבק בגאורגיה, הקילימנג\'רו בטנזניה, גראן פרדיסו באיטליה, אמא דאבלם, לובוצ׳ה פיק ואיילנד פיק בהימלאיה, ובספטמבר 2025 העפלתי אל פסגת המנסלו, ההר השמיני בגובהו בעולם!',
  'אבל המסע האמיתי שלי התחיל בבית. לפני חמש שנים אימי היקרה, קרול שקד ז״ל, נפטרה לאחר מאבק ממושך בסרטן ומאותו הרגע החלטתי להקדיש את חיי להנצחתה. בכל פסגה אני מניף את דגלה, ככל שאני עולה גבוה יותר, אני מרגיש קרוב אליה יותר. היא מלווה אותי והכוח שלי ברגעים הכי קשים!',
  'יחד עם אדיר אויגונר, חבר ילדותי, הקמנו את היי אייר. אנחנו עוזרים לאנשים לפרוץ גבולות ולהעפיל אל פסגות אישיות, אבל עבורנו זו שליחות. בהשראת הנתינה של אמא, אנחנו תורמים לחולי סרטן ולקהילה בכל מסע מחדש.',
  'כשאתם מצטרפים אלינו, אתם לא רק יוצאים למסע, אתם הופכים לחלק ממשהו גדול יותר.',
];
export const STORY_SIGN_HE = 'מצפים לראות אתכם בקרוב,\nחן ואדיר, צוות HighAir';

export const STORY_EN = [
  'Nice to meet you, I\'m Chen Shaked. I truly discovered open spaces and silence only after the army in Nepal, where I fell in love with the disconnection that only high mountains can provide. Since then I\'ve climbed Kazbek, Kilimanjaro, Ama Dablam, and in September 2025 I reached the summit of Manaslu, the eighth highest mountain in the world.',
  'But my real journey started at home. Five years ago my dear mother, Carol Shaked, passed away after a long battle with cancer. From that moment I decided to dedicate my life to honouring her memory. At every summit I raise her flag, the higher I climb, the closer I feel to her. She is my strength in the hardest moments.',
  'Together with Adir Oyguner, my childhood friend, we founded HighAir. We help people break boundaries and ascend their own summits, but for us it\'s a mission. Inspired by my mother\'s spirit of giving, we contribute to cancer patients and the community with every expedition.',
  'When you join us, you\'re not just going into nature. You\'re becoming part of something much bigger.',
];
export const STORY_SIGN_EN = 'See you in the mountains,\nHighAir Team';

/* ── Team members ── */
export const TEAM_HE = [
  {
    key:      'chen',
    initials: 'חש',
    name:     'חן שקד',
    role:     'מייסד ובעלים',
    bio:      'המייסד, החזון והנשמה של HighAir. מטפס הרים מקצועי שהפך את התשוקה שלו לשליחות, להנציח את אימו קרול שקד ז״ל ולהוכיח שכל פסגה היא הזדמנות לעשות טוב. חן מוביל משלחות בשטח, בונה קהילה ומעניק השראה לכל מי שמצטרף למסע. עם עשרות טיפוסים לפסגות ברחבי העולם, הוא מוכיח שניתן לשלב הישגים ספורטיביים עם שליחות אנושית.',
  },
  {
    key:      'adir',
    initials: 'אא',
    name:     'אדיר אויגונר',
    role:     'מייסד ובעלים',
    bio:      'היזם והמוח העסקי מאחורי HighAir. אדיר אחראי על ניהול כל פעילות החברה: הסכמים עם ספקים בינלאומיים וחברות בעולם, ניהול הצוות המקצועי והאופרציה השוטפת של כל משלחת. חבר ילדות של חן ושותף מלא לחזון, אדיר מאמין שכל יציאה למסע היא הזדמנות לשינוי אמיתי בחיים.',
  },
  {
    key:      'tomer',
    initials: 'תל',
    name:     'תומר לן',
    role:     'מנהל מכירות',
    bio:      'הכתובת הראשונה שלכם בדרך להגשמת החלום. תומר אמון על מערך המכירות וליווי המטיילים משלב ההתעניינות ועד ליציאה למסע. במקצועיות ובסבלנות, הוא מוודא שכל אחד ימצא את המסלול והפסגה המתאימים לו ביותר.',
  },
  {
    key:      'tomer-h',
    initials: 'תה',
    name:     'תומר הרוש',
    role:     'נציג מכירות',
    bio:      'האיש שיעזור לכם להפוך את החלום לקילימנג׳רו למציאות. תומר מלווה את המטיילים שלנו מהרגע הראשון של ההתעניינות ועד ליציאה למסע, עם ידע מעמיק על הטיפוס ותשוקה אמיתית לחוויה.',
  },
  {
    key:      'liad',
    initials: 'לש',
    name:     'ליעד שופן',
    role:     'סוכן טיסות',
    bio:      'המומחה שלנו לחיבור בין נקודות על המפה. ליעד מתמחה בתכנון וארגון הלוגיסטיקה של הטיסות לכל יעדי המשלחות שלנו. הוא מוודא שכל היבט בנסיעה שלכם יתנהל בצורה חלקה, מסודרת ונטולת דאגות.',
  },
  {
    key:      'koral',
    initials: 'קי',
    name:     'קורל יוסף',
    role:     'סוכנת ביטוח ומתכננת פיננסית',
    bio:      'הביטחון שלכם בראש סדר העדיפויות שלה. קורל היא מומחית לביטוחי נסיעות ופעילות הרים אתגרית, ומתכננת פיננסית מוסמכת. היא דואגת שכל מטייל ב-HighAir יהיה מוגן ומבוטח בצורה המיטבית, כדי שתוכלו לטפס בראש שקט.',
  },
  {
    key:      'roei',
    initials: 'רכ',
    name:     'רועי כרמל',
    role:     'מדריך טיולים',
    bio:      'המדריך שיוביל אתכם בשבילי הארץ. רועי הוא מדריך מנוסה המלווה את קבוצות ההכנה והטיולים שלנו בישראל, בשטחים מאתגרים ובנופים הכי יפים שיש. הוא מחויב לבטיחותכם ולחוויה המקסימלית של כל מטייל בשטח.',
  },
  {
    key:      'guy',
    initials: 'גל',
    name:     'גיא לינב',
    role:     'מדריך טיולים',
    bio:      'מדריך טיולים מוסמך ובעל ניסיון עשיר בהובלת קבוצות בשטח. גיא מצטרף לצוות HighAir ומלווה את המטיילים שלנו עם מקצועיות, אכפתיות ואהבה אמיתית לשטח.',
  },
];

export const TEAM_EN = [
  {
    key:      'chen',
    initials: 'CS',
    name:     'Chen Shaked',
    role:     'Founder & Owner',
    bio:      'The founder, visionary and soul of HighAir. A professional mountain climber who turned his passion into a mission: to honour his mother Carol Shaked and prove that every summit is an opportunity to do good. Chen leads expeditions in the field, builds the community, and inspires everyone who joins the journey. With dozens of summits across the world, he proves that athletic achievement and human purpose can go hand in hand.',
  },
  {
    key:      'adir',
    initials: 'AO',
    name:     'Adir Oyguner',
    role:     'Founder & Owner',
    bio:      'The entrepreneur and business mind behind HighAir. Adir oversees every aspect of the company: agreements with international suppliers and partners worldwide, managing the professional team, and running the day-to-day operations of every expedition. Chen\'s childhood friend and full partner in the vision, Adir believes every journey is a genuine opportunity to change your life.',
  },
  {
    key:      'tomer',
    initials: 'TL',
    name:     'Tomer Lan',
    role:     'Sales Manager',
    bio:      'Your first point of contact on the road to realising your dream. Tomer leads the sales and client journey from the first enquiry through to departure. With professionalism and patience, he ensures every person finds the route and summit best suited to them.',
  },
  {
    key:      'tomer-h',
    initials: 'TH',
    name:     'Tomer Harosh',
    role:     'Sales Representative',
    bio:      'The person who will help you turn your Kilimanjaro dream into reality. Tomer accompanies our trekkers from the very first enquiry through to departure, with deep knowledge of the climb and a genuine passion for the experience.',
  },
  {
    key:      'liad',
    initials: 'LS',
    name:     'Liad Shopen',
    role:     'Flight Agent',
    bio:      'Our expert at connecting the dots on the map. Liad specialises in planning and coordinating the flight logistics for all our expedition destinations, ensuring every aspect of your travel runs smoothly, efficiently and stress-free.',
  },
  {
    key:      'koral',
    initials: 'KY',
    name:     'Koral Yosef',
    role:     'Insurance Agent & Financial Planner',
    bio:      'Your safety is her top priority. Koral is a specialist in travel and adventure mountain activity insurance, and a certified financial planner. She ensures every HighAir trekker is fully and optimally covered, so you can climb with complete peace of mind.',
  },
  {
    key:      'roei',
    initials: 'RK',
    name:     'Roei Carmel',
    role:     'Trekking Guide',
    bio:      'The guide who will lead you through the trails of the land. Roei is an experienced guide accompanying our preparation groups and Israel treks through challenging terrain and stunning landscapes. He is committed to your safety and to delivering the best possible experience for every trekker in the field.',
  },
  {
    key:      'guy',
    initials: 'GL',
    name:     'Guy Linev',
    role:     'Trekking Guide',
    bio:      'A certified trekking guide with extensive experience leading groups in the field. Guy joins the HighAir team bringing professionalism, care and a genuine love for the outdoors to every trek he leads.',
  },
];
