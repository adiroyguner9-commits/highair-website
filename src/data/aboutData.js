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

/* ── German and Spanish (de. / es., 5 Nov 2026) ── */
const TEAM_KEYS = ['chen', 'adir', 'tomer', 'tomer-h', 'liad', 'koral', 'roei', 'guy'];
const teamFrom = rows => TEAM_EN.map((m, i) => ({ ...m, role: rows[i][0], bio: rows[i][1] }));

export const ABOUT_I18N = {
  de: {
    story: [
      'Schön, Sie kennenzulernen, ich bin Chen Shaked. Weite und Stille habe ich erst nach dem Militärdienst in Nepal wirklich entdeckt, wo ich mich in das Abschalten verliebt habe, das nur hohe Berge schenken. Seitdem habe ich den Kasbek, den Kilimandscharo und die Ama Dablam bestiegen, und im September 2025 stand ich auf dem Gipfel des Manaslu, des achthöchsten Bergs der Welt.',
      'Doch meine eigentliche Reise begann zu Hause. Vor fünf Jahren starb meine geliebte Mutter, Carol Shaked, nach langem Kampf gegen den Krebs. Von diesem Moment an habe ich beschlossen, mein Leben ihrem Andenken zu widmen. Auf jedem Gipfel hisse ich ihre Flagge: Je höher ich steige, desto näher fühle ich mich ihr. Sie ist meine Kraft in den schwersten Momenten.',
      'Zusammen mit Adir Oyguner, meinem Freund aus Kindertagen, haben wir HighAir gegründet. Wir helfen Menschen, Grenzen zu überwinden und ihre eigenen Gipfel zu erreichen, aber für uns ist es eine Mission. Inspiriert von der Großzügigkeit meiner Mutter unterstützen wir mit jeder Expedition Krebspatienten und die Gemeinschaft.',
      'Wer mit uns reist, geht nicht einfach in die Natur. Er wird Teil von etwas viel Größerem.',
    ],
    sign: 'Wir sehen uns in den Bergen,\nIhr HighAir-Team',
    team: teamFrom([
      ['Gründer & Inhaber', 'Gründer, Visionär und Seele von HighAir. Ein professioneller Bergsteiger, der seine Leidenschaft zur Mission gemacht hat: das Andenken an seine Mutter Carol Shaked zu ehren und zu zeigen, dass jeder Gipfel eine Gelegenheit ist, Gutes zu tun. Chen leitet Expeditionen vor Ort, baut die Gemeinschaft auf und inspiriert alle, die sich der Reise anschließen. Mit Dutzenden Gipfeln weltweit zeigt er, dass sportliche Leistung und menschlicher Sinn zusammengehören.'],
      ['Gründer & Inhaber', 'Der Unternehmer und Kopf hinter dem Geschäft von HighAir. Adir verantwortet alle Bereiche des Unternehmens: Vereinbarungen mit internationalen Lieferanten und Partnern, die Führung des Teams und den täglichen Ablauf jeder Expedition. Chens Freund aus Kindertagen und voller Partner in der Vision. Adir glaubt, dass jede Reise eine echte Chance ist, das eigene Leben zu verändern.'],
      ['Vertriebsleiter', 'Ihr erster Ansprechpartner auf dem Weg zu Ihrem Traum. Tomer begleitet Vertrieb und Kundenreise von der ersten Anfrage bis zur Abreise. Mit Professionalität und Geduld sorgt er dafür, dass jeder die Route und den Gipfel findet, die am besten zu ihm passen.'],
      ['Vertriebsmitarbeiter', 'Der Mensch, der Ihnen hilft, Ihren Kilimandscharo-Traum wahr zu machen. Tomer begleitet unsere Bergsteiger von der ersten Anfrage bis zur Abreise, mit tiefem Wissen über die Besteigung und echter Begeisterung für das Erlebnis.'],
      ['Flugplanung', 'Unser Experte dafür, die Punkte auf der Landkarte zu verbinden. Liad plant und koordiniert die Fluglogistik zu allen unseren Expeditionszielen, damit Ihre Anreise reibungslos, effizient und stressfrei verläuft.'],
      ['Versicherung & Finanzplanung', 'Ihre Sicherheit hat für sie oberste Priorität. Koral ist Spezialistin für Reise- und Bergsportversicherungen und zertifizierte Finanzplanerin. Sie sorgt dafür, dass jeder HighAir-Teilnehmer optimal abgesichert ist, damit Sie mit völliger Ruhe aufsteigen können.'],
      ['Trekking-Guide', 'Ein erfahrener Guide, der unsere Vorbereitungsgruppen und Trekkings durch anspruchsvolles Gelände und atemberaubende Landschaften führt. Roei setzt sich für Ihre Sicherheit und das bestmögliche Erlebnis jedes Teilnehmers ein.'],
      ['Trekking-Guide', 'Ein zertifizierter Trekking-Guide mit viel Erfahrung in der Führung von Gruppen. Guy bringt Professionalität, Fürsorge und echte Liebe zur Natur in jedes Trekking ein.'],
    ]),
  },
  es: {
    story: [
      'Encantado de conocerte, soy Chen Shaked. Descubrí de verdad los espacios abiertos y el silencio después del servicio militar, en Nepal, donde me enamoré de la desconexión que solo dan las grandes montañas. Desde entonces he subido el Kazbek, el Kilimanjaro y el Ama Dablam, y en septiembre de 2025 llegué a la cumbre del Manaslu, la octava montaña más alta del mundo.',
      'Pero mi verdadero viaje empezó en casa. Hace cinco años, mi querida madre, Carol Shaked, falleció tras una larga lucha contra el cáncer. Desde ese momento decidí dedicar mi vida a honrar su memoria. En cada cumbre levanto su bandera: cuanto más alto subo, más cerca me siento de ella. Es mi fuerza en los momentos más difíciles.',
      'Junto con Adir Oyguner, mi amigo de la infancia, fundamos HighAir. Ayudamos a las personas a superar sus límites y alcanzar sus propias cumbres, pero para nosotros es una misión. Inspirados por la generosidad de mi madre, en cada expedición contribuimos a pacientes con cáncer y a la comunidad.',
      'Cuando viajas con nosotros, no solo sales a la naturaleza. Te conviertes en parte de algo mucho más grande.',
    ],
    sign: 'Nos vemos en la montaña,\nEl equipo de HighAir',
    team: teamFrom([
      ['Fundador y propietario', 'El fundador, visionario y alma de HighAir. Un montañero profesional que convirtió su pasión en una misión: honrar a su madre, Carol Shaked, y demostrar que cada cumbre es una oportunidad para hacer el bien. Chen dirige expediciones sobre el terreno, construye la comunidad e inspira a todos los que se suman al viaje. Con decenas de cumbres en todo el mundo, demuestra que el logro deportivo y el propósito humano van de la mano.'],
      ['Fundador y propietario', 'El emprendedor y la mente de negocio detrás de HighAir. Adir supervisa todas las áreas de la empresa: acuerdos con proveedores y socios internacionales, la gestión del equipo profesional y el día a día de cada expedición. Amigo de la infancia de Chen y socio pleno en la visión, Adir cree que cada viaje es una oportunidad real de cambiar tu vida.'],
      ['Director de ventas', 'Tu primer contacto en el camino hacia tu sueño. Tomer dirige las ventas y el recorrido del cliente desde la primera consulta hasta la salida. Con profesionalidad y paciencia, se asegura de que cada persona encuentre la ruta y la cumbre que mejor le encajan.'],
      ['Asesor de ventas', 'La persona que te ayudará a hacer realidad tu sueño del Kilimanjaro. Tomer acompaña a nuestros montañeros desde la primera consulta hasta la salida, con un gran conocimiento del ascenso y verdadera pasión por la experiencia.'],
      ['Planificación de vuelos', 'Nuestro experto en unir los puntos del mapa. Liad planifica y coordina la logística de vuelos a todos nuestros destinos, para que tu viaje sea fluido, eficiente y sin estrés.'],
      ['Seguros y planificación financiera', 'Tu seguridad es su máxima prioridad. Koral es especialista en seguros de viaje y de montaña, y planificadora financiera certificada. Se asegura de que cada viajero de HighAir esté cubierto de forma completa, para que subas con total tranquilidad.'],
      ['Guía de trekking', 'Un guía con experiencia que acompaña a nuestros grupos de preparación y treks por terrenos exigentes y paisajes impresionantes. Roei está comprometido con tu seguridad y con la mejor experiencia posible para cada participante.'],
      ['Guía de trekking', 'Un guía de trekking certificado con amplia experiencia guiando grupos. Guy aporta profesionalidad, cuidado y un verdadero amor por la naturaleza a cada trek que dirige.'],
    ]),
  },
};
if (TEAM_EN.map(m => m.key).join() !== TEAM_KEYS.join()) {
  /* The rows above follow TEAM_EN's order; a new or moved member needs a row here. */
  console.warn('aboutData: ABOUT_I18N team rows are out of step with TEAM_EN');
}
