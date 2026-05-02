/**
 * AboutUs.jsx — הסיפור שלנו / Our Story
 * Route: /about
 */

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { usePageMeta } from '../../website/usePageMeta.js';
import Header     from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';

/* ── Auto-load team photos from src/assets/team/ ── */
const _teamGlob = import.meta.glob('../../assets/team/*', { eager: true });
const TEAM_PHOTOS = Object.fromEntries(
  Object.entries(_teamGlob).map(([path, mod]) => {
    const filename = path.split('/').pop().replace(/\.[^.]+$/, ''); // "chen.jpg" → "chen"
    return [filename, mod.default];
  })
);

/* ── Story text ── */
const STORY_HE = [
  'נעים להכיר, אני חן שקד בן 29 מתל אביב. את עולם הטרקים וטיפוסי ההרים פגשתי לראשונה רק אחרי הצבא בנפאל, שם התאהבתי בנופים ובניתוק שרק ההרים יכולים לספק. מאז טיפסתי על הקזבק בגאורגיה, הקילימנג\'רו בטנזניה, גראן פרדיסו באיטליה, אמא דאבלם, לובוצ׳ה פיק ואיילנד פיק בהימלאיה, ובספטמבר 2025 כבשתי את פסגת המנסלו, ההר השמיני בגובהו בעולם!',
  'אבל המסע האמיתי שלי התחיל בבית. לפני חמש שנים אימי היקרה, קרול שקד ז״ל, נפטרה לאחר מאבק ממושך בסרטן ומאותו הרגע החלטתי להקדיש את חיי להנצחתה. בכל פסגה אני מניף את דגלה, ככל שאני עולה גבוה יותר, אני מרגיש קרוב אליה יותר. היא מלווה אותי והכוח שלי ברגעים הכי קשים!',
  'יחד עם אדיר אויגונר, חבר ילדותי, הקמנו את היי אייר. אנחנו עוזרים לאנשים לפרוץ גבולות ולכבוש פסגות אישיות, אבל עבורנו זו שליחות. בהשראת הנתינה של אמא, אנחנו תורמים לחולי סרטן ולקהילה בכל מסע מחדש.',
  'כשאתם מצטרפים אלינו, אתם לא רק יוצאים למסע, אתם הופכים לחלק ממשהו גדול יותר.',
];
const STORY_SIGN_HE = 'מצפים לראות אתכם בקרוב,\nחן ואדיר, צוות HighAir';

const STORY_EN = [
  'Nice to meet you, I\'m Chen Shaked. I truly discovered open spaces and silence only after the army in Nepal, where I fell in love with the disconnection that only high mountains can provide. Since then I\'ve climbed Kazbek, Kilimanjaro, Ama Dablam, and in September 2025 I conquered the summit of Manaslu, the eighth highest mountain in the world.',
  'But my real journey started at home. Five years ago my dear mother, Carol Shaked, passed away after a long battle with cancer. From that moment I decided to dedicate my life to honouring her memory. At every summit I raise her flag, the higher I climb, the closer I feel to her. She is my strength in the hardest moments.',
  'Together with Adir Oyguner, my childhood friend, we founded HighAir. We help people break boundaries and conquer personal summits, but for us it\'s a mission. Inspired by my mother\'s spirit of giving, we contribute to cancer patients and the community with every expedition.',
  'When you join us, you\'re not just going into nature. You\'re becoming part of something much bigger.',
];
const STORY_SIGN_EN = 'See you in the mountains,\nHighAir Team';

/* ── Team members ── */
const TEAM_HE = [
  {
    key:      'chen',
    initials: 'חש',
    name:     'חן שקד',
    role:     'מייסד ובעלים',
    bio:      'מטפס הרים, יזם ואיש חזון. חן הקים את HighAir כחלק משליחות אישית להנצחת אימו, קרול שקד ז״ל. הוא מוביל מסעות המשלבים עוצמה פיזית עם תרומה לקהילה ולחולי סרטן, מתוך אמונה שכל פסגה היא הזדמנות לעשות טוב.',
  },
  {
    key:      'adir',
    initials: 'אא',
    name:     'אדיר אויגונר',
    role:     'מייסד ובעלים',
    bio:      'חבר ילדות של חן ושותף מלא לחזון של HighAir. כמנהל המשלחות, אדיר מאמין שכל יציאה למסע היא הזדמנות לשינוי בחיים. מחויב לשליחות שמאחורי כל פסגה ודואג שכל מטפס יפרוץ את הגבולות של עצמו.',
  },
  {
    key:      'tomer',
    initials: 'תל',
    name:     'תומר לן',
    role:     'מנהל מכירות',
    bio:      'הכתובת הראשונה שלכם בדרך להגשמת החלום. תומר אמון על מערך המכירות וליווי המטיילים משלב ההתעניינות ועד ליציאה למסע. במקצועיות ובסבלנות, הוא מוודא שכל אחד ימצא את המסלול והפסגה המתאימים לו ביותר.',
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
    role:     'סוכנת ביטוח',
    bio:      'הביטחון שלכם בראש סדר העדיפויות שלה. קורל היא מומחית לביטוחי נסיעות ופעילות הרים אתגרית. היא דואגת שכל מטייל ב-HighAir יהיה מוגן ומבוטח בצורה המיטבית, כדי שתוכלו לטפס בראש שקט.',
  },
  {
    key:      'roei',
    initials: 'רכ',
    name:     'רועי כרמל',
    role:     'מדריך טיולים (ישראל)',
    bio:      'המדריך שיוביל אתכם בשבילי הארץ. רועי הוא מדריך מנוסה המלווה את קבוצות ההכנה והטיולים שלנו בישראל, בשטחים מאתגרים ובנופים הכי יפים שיש. הוא מחויב לבטיחותכם ולחוויה המקסימלית של כל מטייל בשטח.',
  },
];

const TEAM_EN = [
  {
    key:      'chen',
    initials: 'CS',
    name:     'Chen Shaked',
    role:     'Founder & Owner',
    bio:      'Mountain climber, entrepreneur and visionary. Chen founded HighAir as part of a personal mission to honour his mother, Carol Shaked. He leads expeditions that combine physical challenge with community contribution and support for cancer patients, driven by the belief that every summit is an opportunity to do good.',
  },
  {
    key:      'adir',
    initials: 'AO',
    name:     'Adir Oyguner',
    role:     'Founder & Owner',
    bio:      'Chen\'s childhood friend and full partner in the HighAir vision. As an expedition leader, Adir believes every journey is an opportunity for life-changing growth. Committed to the mission behind every summit, he ensures every climber pushes beyond their own limits.',
  },
  {
    key:      'tomer',
    initials: 'TL',
    name:     'Tomer Lan',
    role:     'Sales Manager',
    bio:      'Your first point of contact on the road to realising your dream. Tomer leads the sales and client journey from the first enquiry through to departure. With professionalism and patience, he ensures every person finds the route and summit best suited to them.',
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
    role:     'Insurance Agent',
    bio:      'Your safety is her top priority. Koral is a specialist in travel and adventure mountain activity insurance. She ensures every HighAir trekker is fully and optimally covered, so you can climb with complete peace of mind.',
  },
  {
    key:      'roei',
    initials: 'RK',
    name:     'Roei Carmel',
    role:     'Trekking Guide (Israel)',
    bio:      'The guide who will lead you through the trails of the land. Roei is an experienced guide accompanying our preparation groups and Israel treks through challenging terrain and stunning landscapes. He is committed to your safety and to delivering the best possible experience for every trekker in the field.',
  },
];

/* avatar gradient palette */
const AVATAR_GRADS = [
  'linear-gradient(135deg, #6D28D9, #4C1D95)',
  'linear-gradient(135deg, #7C3AED, #5B21B6)',
  'linear-gradient(135deg, #5B21B6, #3730A3)',
  'linear-gradient(135deg, #8B5CF6, #6D28D9)',
];

/* ── Single team card ── */
function TeamCard({ member }) {
  const grad = AVATAR_GRADS[member.initials.charCodeAt(0) % AVATAR_GRADS.length];
  const photo = TEAM_PHOTOS[member.key] || null;

  return (
    <div
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(109,40,217,0.14)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      style={{
        background:    '#FFFFFF',
        borderRadius:  RADIUS.xl,
        border:        '1px solid #ECEAF8',
        boxShadow:     '0 2px 12px rgba(0,0,0,0.06)',
        transition:    `box-shadow 0.25s ${EASING.out}, transform 0.25s ${EASING.out}`,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        textAlign:     'center',
        padding:       '24px 20px 20px',
      }}
    >
      {/* Circular avatar */}
      <div style={{
        width:          '68px',
        height:         '68px',
        borderRadius:   '50%',
        background:     photo ? `url(${photo}) center/cover no-repeat` : grad,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        marginBottom:   '14px',
        flexShrink:     0,
        boxShadow:      '0 4px 16px rgba(109,40,217,0.20)',
      }}>
        {!photo && (
          <span style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      '22px',
            fontWeight:    800,
            color:         'rgba(255,255,255,0.95)',
            letterSpacing: '-0.5px',
            userSelect:    'none',
          }}>
            {member.initials}
          </span>
        )}
      </div>

      {/* Name */}
      <h3 style={{
        fontFamily:    "'Ploni', sans-serif",
        fontSize:      '16px',
        fontWeight:    700,
        color:         '#0A0818',
        margin:        '0 0 4px',
        lineHeight:    1.3,
        letterSpacing: '-0.01em',
      }}>
        {member.name}
      </h3>

      {/* Role */}
      <p style={{
        fontFamily:    "'Ploni', sans-serif",
        fontSize:      '11px',
        fontWeight:    600,
        color:         '#7C3AED',
        margin:        '0 0 12px',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}>
        {member.role}
      </p>

      {/* Divider */}
      <div style={{ width: '36px', height: '2px', background: '#EDE9FE', borderRadius: '2px', marginBottom: '16px' }} />

      {/* Bio */}
      <p style={{
        fontFamily: "'Ploni', sans-serif",
        fontSize:   '13px',
        fontWeight: 300,
        color:      '#6B6B8A',
        margin:     0,
        lineHeight: 1.65,
      }}>
        {member.bio}
      </p>
    </div>
  );
}

/* ── Birthday gifts data ── */
const GIFTS_HE = [
  { name: 'נועה',  age: 7,  gift: 'ערכת ציור וצבעים', emoji: '🎨', color: '#F3E8FF' },
  { name: 'יונתן', age: 9,  gift: 'אוזניות אלחוטיות', emoji: '🎧', color: '#EDE9FE' },
  { name: 'מיה',   age: 6,  gift: 'בובת בלרינה ובגד ריקוד', emoji: '🩰', color: '#FCE7F3' },
  { name: 'אריאל', age: 11, gift: 'ערכת לגו מורכבת', emoji: '🧩', color: '#DBEAFE' },
  { name: 'טל',    age: 8,  gift: 'אופניים חשמליים קטנים', emoji: '🚲', color: '#D1FAE5' },
  { name: 'שירה',  age: 10, gift: 'מחשב לוח לילדים', emoji: '💻', color: '#FEF3C7' },
];
const GIFTS_EN = [
  { name: 'Noa',     age: 7,  gift: 'Art kit and paints',       emoji: '🎨', color: '#F3E8FF' },
  { name: 'Yonatan', age: 9,  gift: 'Wireless headphones',      emoji: '🎧', color: '#EDE9FE' },
  { name: 'Mia',     age: 6,  gift: 'Ballerina doll & outfit',  emoji: '🩰', color: '#FCE7F3' },
  { name: 'Ariel',   age: 11, gift: 'Advanced Lego set',        emoji: '🧩', color: '#DBEAFE' },
  { name: 'Tal',     age: 8,  gift: 'Kids electric bike',       emoji: '🚲', color: '#D1FAE5' },
  { name: 'Shira',   age: 10, gift: 'Kids tablet',              emoji: '💻', color: '#FEF3C7' },
];

/* ── Gifts Slider ── */
function GiftsSlider({ gifts, isEn }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);
  const total = gifts.length;

  const go = (i) => {
    setActive((i + total) % total);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setActive(a => (a + 1) % total), 3800);
    return () => clearInterval(timerRef.current);
  }, [total]);

  const resetTimer = (i) => {
    clearInterval(timerRef.current);
    go(i);
    timerRef.current = setInterval(() => setActive(a => (a + 1) % total), 3800);
  };

  return (
    <div style={{ position: 'relative' }}>

      {/* Cards row */}
      <div style={{
        display:        'flex',
        gap:            '16px',
        justifyContent: 'center',
        flexWrap:       'wrap',
        marginBottom:   '32px',
      }}>
        {gifts.map((g, i) => (
          <div
            key={i}
            onClick={() => resetTimer(i)}
            style={{
              background:   i === active ? g.color : '#FFFFFF',
              border:       `2px solid ${i === active ? '#7C3AED' : '#ECEAF8'}`,
              borderRadius: '20px',
              padding:      '28px 24px',
              width:        '160px',
              textAlign:    'center',
              cursor:       'pointer',
              transition:   'all 0.3s ease',
              transform:    i === active ? 'translateY(-6px) scale(1.04)' : 'translateY(0) scale(1)',
              boxShadow:    i === active ? '0 12px 32px rgba(109,40,217,0.18)' : '0 2px 8px rgba(0,0,0,0.05)',
              flexShrink:   0,
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{g.emoji}</div>
            <div style={{
              fontFamily:  "'Ploni', sans-serif",
              fontSize:    '16px',
              fontWeight:  700,
              color:       '#0A0818',
              marginBottom: '4px',
            }}>{g.name}</div>
            <div style={{
              fontFamily: "'Ploni', sans-serif",
              fontSize:   '12px',
              color:      '#7C3AED',
              fontWeight: 600,
              marginBottom: '10px',
            }}>
              {isEn ? `Age ${g.age}` : `בת/בן ${g.age}`}
            </div>
            <div style={{
              fontFamily:  "'Ploni', sans-serif",
              fontSize:    '13px',
              color:       '#6B6B8A',
              lineHeight:  1.4,
            }}>{g.gift}</div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {gifts.map((_, i) => (
          <button
            key={i}
            onClick={() => resetTimer(i)}
            style={{
              width:        i === active ? '24px' : '8px',
              height:       '8px',
              borderRadius: '4px',
              background:   i === active ? '#7C3AED' : '#DDD6FE',
              border:       'none',
              cursor:       'pointer',
              padding:      0,
              transition:   'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Peaks data ── */
const PEAKS = [
  { id:1,  he:'גראן פרדיסו',     en:'Gran Paradiso',    cHe:'איטליה',    cEn:'Italy',     alt:4800, done:true  },
  { id:2,  he:'קזבק',            en:'Kazbek',           cHe:'גאורגיה',   cEn:'Georgia',   alt:5054, done:true  },
  { id:3,  he:"קילימנג'רו",      en:'Kilimanjaro',      cHe:'טנזניה',    cEn:'Tanzania',  alt:5895, done:true  },
  { id:4,  he:"לובוצ'ה פיק",    en:'Lobuche Peak',     cHe:'נפאל',      cEn:'Nepal',     alt:6119, done:true  },
  { id:5,  he:'איילנד פיק',      en:'Island Peak',      cHe:'נפאל',      cEn:'Nepal',     alt:6189, done:true  },
  { id:6,  he:'מרה פיק',         en:'Mera Peak',        cHe:'נפאל',      cEn:'Nepal',     alt:6476, done:true  },
  { id:7,  he:'אמא דאבלם',       en:'Ama Dablam',       cHe:'נפאל',      cEn:'Nepal',     alt:6812, done:true  },
  { id:8,  he:'מנסלו',           en:'Manaslu',          cHe:'נפאל',      cEn:'Nepal',     alt:8163, done:true  },
  { id:9,  he:'אלברוס',          en:'Elbrus',           cHe:'רוסיה',     cEn:'Russia',    alt:5642, done:false, dHe:'יוני 2026',   dEn:'Jun 2026'  },
  { id:10, he:'אקונקגואה',       en:'Aconcagua',        cHe:'ארגנטינה',  cEn:'Argentina', alt:6961, done:false, dHe:'ינואר 2027',  dEn:'Jan 2027'  },
  { id:11, he:'אוורסט + להוצה',  en:'Everest + Lhotse', cHe:'נפאל',      cEn:'Nepal',     alt:8849, done:false, dHe:'אפריל 2027',  dEn:'Apr 2027'  },
];

/* ── Journey SVG Chart ── */
function JourneyChart({ isEn }) {
  const W = 1100, H = 480;
  const PX = 65, PT = 58, PLOT_H = 280;
  const BASE = PT + PLOT_H; // 338
  const ALT_MIN = 3800, ALT_MAX = 9350;
  const SPACING = (W - 2 * PX) / (PEAKS.length - 1); // 97

  const gx = i => PX + i * SPACING;
  const gy = alt => PT + PLOT_H - (alt - ALT_MIN) * PLOT_H / (ALT_MAX - ALT_MIN);

  const pts = PEAKS.map((p, i) => ({ ...p, x: gx(i), y: gy(p.alt) }));
  const done  = pts.filter(p => p.done);
  const next  = pts.filter(p => !p.done);
  const last  = done[done.length - 1];
  const first = next[0];

  const pastPoly   = done.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const futurePoly = next.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const pastArea   = `M${done[0].x},${BASE} ` + done.map(p=>`L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ` L${last.x},${BASE} Z`;
  const futureArea = `M${first.x},${BASE} `  + next.map(p=>`L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')  + ` L${next[next.length-1].x},${BASE} Z`;

  const GRIDS = [5000, 6000, 7000, 8000, 9000];
  const DZ_Y  = gy(8000); // death zone y
  const MID_X = (last.x + first.x) / 2;

  const STARS = [[130,22,1.1],[240,14,0.8],[390,30,1.2],[530,18,0.7],[680,25,1],[
                  820,10,0.9],[960,28,1.3],[110,42,0.7],[460,8,1],[760,36,0.8],[1055,20,1.1]];

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '16px' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ display:'block', minWidth:'680px', width:'100%' }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="jBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0B0928"/><stop offset="100%" stopColor="#1B0A3C"/>
          </linearGradient>
          <linearGradient id="jPF" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.32"/><stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02"/>
          </linearGradient>
          <linearGradient id="jFF" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D97706" stopOpacity="0.28"/><stop offset="100%" stopColor="#D97706" stopOpacity="0.02"/>
          </linearGradient>
          <linearGradient id="jTL" x1={last.x} y1={last.y} x2={first.x} y2={first.y} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6"/><stop offset="100%" stopColor="#F59E0B"/>
          </linearGradient>
          <filter id="jGl" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width={W} height={H} fill="url(#jBg)" rx="16"/>

        {/* Stars */}
        {STARS.map(([sx,sy,sr],i) => <circle key={i} cx={sx} cy={sy} r={sr} fill="white" opacity={0.2+i*0.025}/>)}

        {/* Death zone shading */}
        <rect x={PX} y={PT} width={W-2*PX} height={DZ_Y-PT} fill="rgba(239,68,68,0.04)"/>
        <text x={W-PX-6} y={DZ_Y-6} textAnchor="end" fontSize="9" fontFamily="sans-serif"
          fontWeight="700" fill="rgba(239,68,68,0.45)" letterSpacing="1.2">
          {isEn ? '▲ DEATH ZONE' : '▲ אזור המוות'}
        </text>

        {/* Grid lines */}
        {GRIDS.map(alt => {
          const gy2 = gy(alt); const is8 = alt===8000;
          return (
            <g key={alt}>
              <line x1={PX} y1={gy2} x2={W-PX} y2={gy2}
                stroke={is8 ? 'rgba(239,68,68,0.22)' : 'rgba(255,255,255,0.055)'}
                strokeWidth={is8 ? 1.5 : 1} strokeDasharray={is8 ? '4,4' : undefined}/>
              <text x={PX-7} y={gy2+4} textAnchor="end" fontSize="9.5" fontFamily="sans-serif"
                fill={is8 ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.25)'}>
                {alt}m
              </text>
            </g>
          );
        })}

        {/* NOW divider */}
        <line x1={MID_X} y1={PT-8} x2={MID_X} y2={BASE}
          stroke="rgba(255,255,255,0.13)" strokeWidth="1" strokeDasharray="3,5"/>
        <text x={MID_X} y={PT-16} textAnchor="middle" fontSize="8.5" fontFamily="sans-serif"
          fontWeight="700" fill="rgba(255,255,255,0.28)" letterSpacing="2">NOW</text>

        {/* Zone labels */}
        <text x={(PX+MID_X)/2} y={PT-28} textAnchor="middle" fontSize="10" fontFamily="sans-serif"
          fontWeight="700" fill="rgba(167,139,250,0.75)" letterSpacing="1.5">
          {isEn ? '✓  COMPLETED' : '✓  הושלמו'}
        </text>
        <text x={(MID_X+W-PX)/2} y={PT-28} textAnchor="middle" fontSize="10" fontFamily="sans-serif"
          fontWeight="700" fill="rgba(251,191,36,0.82)" letterSpacing="1.5">
          {isEn ? 'UPCOMING  →' : 'הבא בתור  →'}
        </text>

        {/* Area fills */}
        <path d={pastArea}   fill="url(#jPF)"/>
        <path d={futureArea} fill="url(#jFF)"/>

        {/* Lines */}
        <polyline points={pastPoly}   fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        <line x1={last.x} y1={last.y} x2={first.x} y2={first.y}
          stroke="url(#jTL)" strokeWidth="2" strokeDasharray="5,4"/>
        <polyline points={futurePoly} fill="none" stroke="#F59E0B" strokeWidth="2.5"
          strokeDasharray="7,4" strokeLinejoin="round" strokeLinecap="round"/>

        {/* Dots + labels */}
        {pts.map((p, i) => {
          const isLast = i === pts.length - 1;
          const r      = isLast ? 11 : p.done ? 8 : 9;
          const altY   = !p.done ? p.y + (r+15) : (p.y < PT+70 ? p.y+18 : p.y-14);
          return (
            <g key={p.id}>
              {!p.done && <circle cx={p.x} cy={p.y} r={r+7} fill={isLast?'#F59E0B':'#D97706'} opacity="0.18" filter="url(#jGl)"/>}
              <circle cx={p.x} cy={p.y} r={r}
                fill={p.done ? '#4C1D95' : (isLast?'#92400E':'#78350F')}
                stroke={p.done ? '#A78BFA' : '#FCD34D'} strokeWidth="1.8"/>
              <text x={p.x} y={p.y+4} textAnchor="middle" fontSize="8.5"
                fontWeight="700" fontFamily="sans-serif"
                fill={p.done ? '#E9D5FF' : '#FEF3C7'}>{p.id}</text>
              <text x={p.x} y={altY} textAnchor="middle" fontSize="9" fontFamily="sans-serif"
                fontWeight="600" fill={p.done?'rgba(196,181,253,0.82)':'rgba(253,230,138,0.92)'}>
                {p.alt}m
              </text>
              {!p.done && (
                <text x={p.x} y={p.y-(r+14)} textAnchor="middle" fontSize="9"
                  fontFamily="sans-serif" fill="rgba(253,230,138,0.72)" fontWeight="500">
                  {isEn ? p.dEn : p.dHe}
                </text>
              )}
            </g>
          );
        })}

        {/* Name labels — rotated below chart */}
        {pts.map(p => (
          <text key={`l${p.id}`} x={p.x} y={BASE+18} textAnchor="end"
            fontSize="10.5" fontFamily="sans-serif"
            fill={p.done?'rgba(196,181,253,0.78)':'rgba(253,230,138,0.88)'}
            transform={`rotate(-50,${p.x},${BASE+18})`}>
            {isEn ? p.en : p.he}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ── Partners ticker ── (auto-loads every file dropped in src/assets/partners/) */
const _logoModules = import.meta.glob(
  '../../assets/partners/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}',
  { eager: true }
);
const PARTNER_LOGOS = Object.entries(_logoModules).map(([path, mod]) => ({
  name: path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
  src:  mod.default,
}));
const tickerStyle = `
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-25%); }
  }
`;

function PartnersTicker() {
  // 4 identical sets. Animation moves exactly one set width (-25% of total).
  // Reset from -25% → 0 is visually identical → perfectly seamless.
  // direction:ltr on the outer div prevents RTL from flipping scroll direction.
  const items = [...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <div style={{ overflow: 'hidden', position: 'relative', direction: 'ltr' }}>
      <style>{tickerStyle}</style>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'120px', background:'linear-gradient(to right, #FAFAF8, transparent)', zIndex:1, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'120px', background:'linear-gradient(to left, #FAFAF8, transparent)', zIndex:1, pointerEvents:'none' }}/>

      <div style={{
        display:    'flex',
        alignItems: 'center',
        width:      'max-content',
        animation:  'ticker 22s linear infinite',
        willChange: 'transform',
      }}>
        {items.map((p, i) => (
          <div key={i} style={{
            flexShrink:     0,
            margin:         '0 44px',
            width:          '100px',
            height:         '100px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            <img
              src={p.src}
              alt={p.name}
              style={{
                width:      '100px',
                height:     '100px',
                objectFit:  'contain',
                filter:     'grayscale(100%) opacity(0.45)',
                userSelect: 'none',
                display:    'block',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════ */
export default function AboutUs() {
  const { i18n }    = useTranslation();
  const { isMobile, isTablet } = useBreakpoint();
  const isEn = i18n.language === 'en';
  const dir  = isEn ? 'ltr' : 'rtl';

  usePageMeta({
    title:         isEn ? 'Our Story | HighAir Expeditions' : 'הסיפור שלנו | HighAir Expeditions',
    description:   isEn
      ? 'Meet the HighAir Expeditions team — the people behind every summit.'
      : 'הכירו את צוות HighAir Expeditions — האנשים מאחורי כל פסגה.',
    canonicalPath: '/about',
  });

  const team        = isEn ? TEAM_EN : TEAM_HE;
  const storyParagraphs = isEn ? STORY_EN : STORY_HE;
  const storySign   = isEn ? STORY_SIGN_EN : STORY_SIGN_HE;
  const teamCols    = isMobile ? 2 : isTablet ? 3 : 4;

  return (
    <>
      <Header />
      <main id="main-content" style={{ background: '#FAFAF8', minHeight: '100vh', paddingTop: '80px', direction: dir }}>

        {/* ── Page header ── */}
        <div style={{
          background:   '#FFFFFF',
          borderBottom: '1px solid #ECEAF8',
          padding:      isMobile ? '36px 5% 28px' : '52px 5% 36px',
          textAlign:    'center',
        }}>
          <h1 style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      isMobile ? '28px' : '42px',
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 12px',
            letterSpacing: '-0.03em',
            lineHeight:    1.1,
          }}>
            {isEn ? 'Our Story' : 'הסיפור שלנו'}
          </h1>
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize:   FS.body,
            fontWeight: 300,
            color:      '#6B6B8A',
            margin:     0,
            lineHeight: 1.7,
          }}>
            {isEn ? 'Who We Are and Why We Do It?' : 'מי אנחנו ולמה אנחנו עושים את זה?'}
          </p>
        </div>

        {/* ── Story section: image + text ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '40px 5%' : '64px 5%' }}>
          <div style={{
            display:       'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap:           isMobile ? '32px' : '56px',
            alignItems:    'center',
          }}>

            {/* Image container + caption */}
            <div style={{
              flex:          isMobile ? '0 0 auto' : '1 1 0',
              width:         isMobile ? '100%' : 'auto',
              display:       'flex',
              flexDirection: 'column',
              gap:           '10px',
            }}>
              <div style={{
                width:          '100%',
                height:         isMobile ? '280px' : '520px',
                borderRadius:   RADIUS.xl,
                overflow:       'hidden',
                boxShadow:      '0 8px 40px rgba(109,40,217,0.15)',
                background:     '#1a0a3a',
                position:       'relative',
                flexShrink:     0,
              }}>
                <img
                  src="/images/about-story.avif"
                  alt={isEn ? 'Chen Shaked at the summit of Manaslu 8163m' : 'חן שקד בפסגת הר מנסלו 8163 מ׳ - ההר השמיני בגובהו בעולם'}
                  style={{
                    position:       'absolute',
                    inset:          0,
                    width:          '100%',
                    height:         '100%',
                    objectFit:      'cover',
                    objectPosition: 'center',
                  }}
                />
              </div>
              {/* Caption */}
              <p style={{
                fontFamily:  "'Ploni', sans-serif",
                fontSize:    '13px',
                fontWeight:  400,
                color:       '#9896B0',
                margin:      0,
                textAlign:   'center',
                letterSpacing: '0.01em',
              }}>
                {isEn ? 'Chen Shaked at the summit of Manaslu, 8163m' : 'חן שקד בפסגת הר מנסלו 8163 מ׳ - ההר השמיני בגובהו בעולם'}
              </p>
            </div>

            {/* Text container */}
            <div style={{
              flex:    isMobile ? '0 0 auto' : '1 1 0',
              display: 'flex',
              flexDirection: 'column',
              gap:     '20px',
            }}>
              {storyParagraphs.map((para, i) => (
                <p key={i} style={{
                  fontFamily: "'Ploni', sans-serif",
                  fontSize:   isMobile ? '16px' : '17px',
                  fontWeight: i === storyParagraphs.length - 1 ? 600 : 300,
                  color:      i === storyParagraphs.length - 1 ? '#3B1F8C' : '#3D3B52',
                  margin:     0,
                  lineHeight: 1.85,
                }}>
                  {para}
                </p>
              ))}

              {/* Signature */}
              <p style={{
                fontFamily:  "'Ploni', sans-serif",
                fontSize:    '16px',
                fontWeight:  500,
                color:       '#7C3AED',
                margin:      '8px 0 0',
                lineHeight:  1.6,
                whiteSpace:  'pre-line',
              }}>
                {storySign}
              </p>
            </div>

          </div>
        </div>


        {/* ── Partners ticker ── */}
        <div style={{
          borderTop:  '1px solid #ECEAF8',
          background: '#FAFAF8',
          padding:    isMobile ? '32px 5%' : '48px 5%',
        }}>
          <p style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      '13px',
            fontWeight:    600,
            color:         '#9896B0',
            textAlign:     'center',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            margin:        '0 0 24px',
          }}>
            {isEn ? 'Our partners on the road' : 'השותפים שלנו לדרך'}
          </p>
          <PartnersTicker />
        </div>

        {/* ── Team section ── */}
        <div style={{
          borderTop:  '1px solid #ECEAF8',
          background: '#FFFFFF',
          padding:    isMobile ? '40px 5%' : '64px 5%',
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

            {/* Section heading */}
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
              <p style={{
                fontFamily:    "'Ploni', sans-serif",
                fontSize:      '13px',
                fontWeight:    600,
                color:         '#7C3AED',
                margin:        '0 0 10px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                {isEn ? 'The people behind every summit' : 'האנשים מאחורי כל פסגה'}
              </p>
              <h2 style={{
                fontFamily:    "'Ploni', sans-serif",
                fontSize:      isMobile ? '26px' : '36px',
                fontWeight:    700,
                color:         '#0A0818',
                margin:        0,
                letterSpacing: '-0.03em',
                lineHeight:    1.1,
              }}>
                {isEn ? 'Meet Our Team' : 'הכירו את הצוות שלנו'}
              </h2>
            </div>

            {/* Grid */}
            <div style={{
              display:             'grid',
              gridTemplateColumns: `repeat(${teamCols}, 1fr)`,
              gap:                 '24px',
              alignContent:        'start',
            }}>
              {team.map((member, i) => (
                <TeamCard key={i} member={member} />
              ))}
            </div>

          </div>
        </div>

        {/* ── Giving section ── */}
        <div style={{
          borderTop:  '1px solid #ECEAF8',
          background: '#FAF5FF',
          padding:    isMobile ? '48px 5%' : '72px 5%',
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

            {/* Heading */}
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '52px' }}>
              <p style={{
                fontFamily:    "'Ploni', sans-serif",
                fontSize:      '13px',
                fontWeight:    600,
                color:         '#7C3AED',
                margin:        '0 0 10px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                {isEn ? 'Giving back' : 'נותנים בחזרה'}
              </p>
              <h2 style={{
                fontFamily:    "'Ploni', sans-serif",
                fontSize:      isMobile ? '26px' : '36px',
                fontWeight:    700,
                color:         '#0A0818',
                margin:        '0 0 16px',
                letterSpacing: '-0.03em',
                lineHeight:    1.2,
              }}>
                {isEn ? 'A Birthday Wish for Every Child' : 'מתנת יום הולדת לכל ילד'}
              </h2>
              <p style={{
                fontFamily: "'Ploni', sans-serif",
                fontSize:   FS.body,
                fontWeight: 300,
                color:      '#6B6B8A',
                margin:     '0 auto',
                lineHeight: 1.75,
                maxWidth:   '600px',
              }}>
                {isEn
                  ? 'Every month we receive a list of birthday wishes from children fighting cancer. We make sure every child gets exactly what they dreamed of.'
                  : 'כל חודש אנחנו מקבלים רשימה של משאלות יום הולדת מילדים הנלחמים בסרטן. אנחנו דואגים שכל ילד יקבל בדיוק את מה שחלם עליו.'}
              </p>
            </div>

            {/* Slider */}
            <GiftsSlider gifts={isEn ? GIFTS_EN : GIFTS_HE} isEn={isEn} />

            {/* Bottom note */}
            <p style={{
              fontFamily: "'Ploni', sans-serif",
              fontSize:   '14px',
              fontWeight: 400,
              color:      '#9896B0',
              textAlign:  'center',
              margin:     '32px 0 0',
              lineHeight: 1.6,
            }}>
              {isEn
                ? '💜  Every expedition you book contributes directly to this project'
                : '💜  כל מסע שאתם מזמינים תורם ישירות לפרויקט הזה'}
            </p>

          </div>
        </div>

      </main>
      <SiteFooter />
    </>
  );
}
