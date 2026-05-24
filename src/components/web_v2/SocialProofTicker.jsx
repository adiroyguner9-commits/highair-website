/**
 * SocialProofTicker.jsx
 * Floating social proof notification popup (bottom-right corner).
 * Shows one registration at a time — slides up, stays 5s, fades out, 8s pause, repeats.
 * Daily-seeded so names/destinations change each day; session-random start so
 * repeat visitors never see the same opening notification.
 */

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

/* ── Hebrew names with gender ── */
const NAMES_HE = [
  { name: 'דני',    f: false },
  { name: 'שרה',    f: true  },
  { name: 'אורי',   f: false },
  { name: 'מיכל',   f: true  },
  { name: 'יוסי',   f: false },
  { name: 'נועה',   f: true  },
  { name: 'תמר',    f: true  },
  { name: 'רון',    f: false },
  { name: 'ליאור',  f: false },
  { name: 'גיל',    f: false },
  { name: 'ענת',    f: true  },
  { name: 'אדם',    f: false },
  { name: 'רחל',    f: true  },
  { name: 'עמית',   f: false },
  { name: 'שירה',   f: true  },
  { name: 'ניר',    f: false },
  { name: 'הילה',   f: true  },
  { name: 'אסף',    f: false },
  { name: 'דינה',   f: true  },
  { name: 'יובל',   f: false },
  { name: 'מאיה',   f: true  },
  { name: 'איתי',   f: false },
  { name: 'נמרוד',  f: false },
  { name: 'טל',     f: true  },
  { name: 'עדן',    f: true  },
  { name: 'בר',     f: true  },
  { name: 'שחר',    f: false },
  { name: 'אלון',   f: false },
  { name: 'ירדן',   f: true  },
  { name: 'אביב',   f: true  },
];

const NAMES_EN = [
  'Daniel', 'Sarah', 'Uri', 'Michelle', 'Joey', 'Noa', 'Aviv', 'Tamar',
  'Ron', 'Lior', 'Gil', 'Anat', 'Adam', 'Rachel', 'Amit', 'Shira',
  'Nir', 'Hila', 'Asaf', 'Eden', 'Yuval', 'Maya', 'Itay', 'Nimrod',
  'Tal', 'Bar', 'Shahar', 'Alon', 'Yarden',
];

/* Destination names exactly as used on site, without ל prefix */
const EXPS_HE = [
  'קילימנג׳רו',
  'אוורסט בייס קמפ',
  'אלברוס',
  'סובב אנאפורנה',
  'פסגות הבלקן',
  'אקונקגואה',
  'סובב מנסלו',
  'אולימפוס',
  'לנין פיק',
  'איילנד פיק',
  'לובוצ׳ה פיק',
  'מרה פיק',
  'קזבק',
  'הרי סימיאן',
];

const EXPS_EN = [
  'Kilimanjaro',
  'Everest Base Camp',
  'Elbrus',
  'Annapurna Circuit',
  'Peaks of the Balkans',
  'Aconcagua',
  'Manaslu Circuit',
  'Olympus',
  'Lenin Peak',
  'Island Peak',
  'Lobuche Peak',
  'Mera Peak',
  'Kazbek',
  'Simien Mountains',
];

const TIMES_HE = [
  'לפני 6 דקות', 'לפני 14 דקות', 'לפני 28 דקות', 'לפני 43 דקות',
  'לפני שעה', 'לפני שעתיים', 'לפני 3 שעות', 'לפני 5 שעות',
];

const TIMES_EN = [
  '6 minutes ago', '14 minutes ago', '28 minutes ago', '43 minutes ago',
  '1 hour ago', '2 hours ago', '3 hours ago', '5 hours ago',
];

/* ── Seeded pseudo-random (changes daily) ── */
function dailySeed() {
  const d = new Date();
  const str = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let h = 0;
  for (const c of str) h = (Math.imul(h, 31) + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

function seededRand(seed, index) {
  let s = (seed ^ (index * 2654435761)) >>> 0;
  s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b)) >>> 0;
  s = (s ^ (s >>> 16)) >>> 0;
  return s / 0xffffffff;
}

function pick(arr, seed, index) {
  return arr[Math.floor(seededRand(seed, index) * arr.length)];
}

function buildItems(isEn, count = 30, fixedExp = null) {
  const seed  = dailySeed();
  const names = isEn ? NAMES_EN : NAMES_HE;
  const exps  = isEn ? EXPS_EN  : EXPS_HE;
  const times = isEn ? TIMES_EN : TIMES_HE;
  return Array.from({ length: count }, (_, i) => {
    const nameEntry = pick(names, seed + 1, i);
    const exp       = fixedExp ?? pick(exps, seed + 2, i);
    return {
      name:   isEn ? nameEntry : nameEntry.name,
      female: isEn ? false     : nameEntry.f,
      exp,
      time:   pick(times, seed + 3, i),
      img:    EXP_IMG[exp] || null,
    };
  });
}

/* ── Expedition page slug → popup destination name ── */
const SLUG_EXP_HE = {
  'kilimanjaro':        'קילימנג׳רו',
  'kilimanjaro-kosher': 'קילימנג׳רו',
  'everest-base-camp':  'אוורסט בייס קמפ',
  'elbrus':             'אלברוס',
  'annapurna':          'סובב אנאפורנה',
  'peaks-of-balkan':    'פסגות הבלקן',
  'aconcagua':          'אקונקגואה',
  'manaslu':            'סובב מנסלו',
  'olympus':            'אולימפוס',
  'lenin-peak':         'לנין פיק',
  'island-peak':        'איילנד פיק',
  'lobuche-peak':       'לובוצ׳ה פיק',
  'mera-peak':          'מרה פיק',
  'kazbek':             'קזבק',
  'ethiopia':           'הרי סימיאן',
};

const SLUG_EXP_EN = {
  'kilimanjaro':        'Kilimanjaro',
  'kilimanjaro-kosher': 'Kilimanjaro',
  'everest-base-camp':  'Everest Base Camp',
  'elbrus':             'Elbrus',
  'annapurna':          'Annapurna Circuit',
  'peaks-of-balkan':    'Peaks of the Balkans',
  'aconcagua':          'Aconcagua',
  'manaslu':            'Manaslu Circuit',
  'olympus':            'Olympus',
  'lenin-peak':         'Lenin Peak',
  'island-peak':        'Island Peak',
  'lobuche-peak':       'Lobuche Peak',
  'mera-peak':          'Mera Peak',
  'kazbek':             'Kazbek',
  'ethiopia':           'Simien Mountains',
};

/* ── Destination → card image map ── */
const EXP_IMG = {
  // Hebrew
  'קילימנג׳רו':      '/images/cards/kilimanjaro.webp',
  'אוורסט בייס קמפ': '/images/cards/EBC.jpg',
  'אלברוס':          '/images/cards/elbrus.webp',
  'סובב אנאפורנה':   '/images/cards/annapurna.webp',
  'פסגות הבלקן':     '/images/cards/peaks-of-balkan.jpg',
  'אקונקגואה':       '/images/cards/aconcagua.webp',
  'סובב מנסלו':      '/images/cards/manaslu.avif',
  'אולימפוס':        '/images/cards/olympus.jpg',
  'לנין פיק':        '/images/cards/leninPeak.avif',
  'איילנד פיק':      '/images/cards/IslandPeak.webp',
  'לובוצ׳ה פיק':    '/images/cards/lobuchePeak.webp',
  'מרה פיק':         '/images/cards/MeraPeak.webp',
  'קזבק':            '/images/cards/kazbek.webp',
  'הרי סימיאן':     '/images/cards/ethiopia.webp',
  // English
  'Kilimanjaro':          '/images/cards/kilimanjaro.webp',
  'Everest Base Camp':    '/images/cards/EBC.jpg',
  'Elbrus':               '/images/cards/elbrus.webp',
  'Annapurna Circuit':    '/images/cards/annapurna.webp',
  'Peaks of the Balkans': '/images/cards/peaks-of-balkan.jpg',
  'Aconcagua':            '/images/cards/aconcagua.webp',
  'Manaslu Circuit':      '/images/cards/manaslu.avif',
  'Olympus':              '/images/cards/olympus.jpg',
  'Lenin Peak':           '/images/cards/leninPeak.avif',
  'Island Peak':          '/images/cards/IslandPeak.webp',
  'Lobuche Peak':         '/images/cards/lobuchePeak.webp',
  'Mera Peak':            '/images/cards/MeraPeak.webp',
  'Kazbek':               '/images/cards/kazbek.webp',
  'Simien Mountains':     '/images/cards/ethiopia.webp',
};

/* ── Inject pulse keyframe once ── */
const STYLE_ID = 'sp-pulse-style';
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes sp-pulse {
      0%   { box-shadow: 0 0 0 0   rgba(34,197,94,0.55); }
      70%  { box-shadow: 0 0 0 6px rgba(34,197,94,0);    }
      100% { box-shadow: 0 0 0 0   rgba(34,197,94,0);    }
    }
  `;
  document.head.appendChild(s);
}

/* ── Timing ── */
const INIT_DELAY    = 5000;   // ms before first popup
const ANIM_IN       = 420;    // ms slide-in
const SHOW_DURATION = 5000;   // ms fully visible
const ANIM_OUT      = 350;    // ms fade-out
const PAUSE         = 8000;   // ms gap between popups

const BOTTOM_NORMAL = '28px';
const BOTTOM_ABOVE  = '200px';

/* ── Component ── */
export default function SocialProofTicker() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const location = useLocation();
  ensureStyles();

  /* Detect current page type */
  const segments = location.pathname.split('/').filter(Boolean);
  const isIsraelPage     = segments[0] === 'israel';
  const isExpeditionPage = segments[0] === 'expedition';
  const expSlug          = isExpeditionPage ? segments[1] : null;
  const fixedExpHe       = expSlug ? (SLUG_EXP_HE[expSlug] ?? null) : null;
  const fixedExpEn       = expSlug ? (SLUG_EXP_EN[expSlug] ?? null) : null;

  /* Base item pools (random daily mix) */
  const [itemsHe] = useState(() => buildItems(false));
  const [itemsEn] = useState(() => buildItems(true));

  /* On expedition pages: all items show that specific destination */
  const items = useMemo(() => {
    if (isEn && fixedExpEn) return buildItems(true,  30, fixedExpEn);
    if (!isEn && fixedExpHe) return buildItems(false, 30, fixedExpHe);
    return isEn ? itemsEn : itemsHe;
  }, [isEn, fixedExpHe, fixedExpEn, itemsHe, itemsEn]);

  /* Random start each session — repeat visitors see different opening */
  const [index, setIndex] = useState(() => Math.floor(Math.random() * 30));
  /* phase: 'idle' | 'in' | 'visible' | 'out' | 'pause' */
  const [phase, setPhase] = useState('idle');
  const [bottom, setBottom] = useState(
    () => localStorage.getItem('highair_cookie_consent') ? BOTTOM_NORMAL : BOTTOM_ABOVE
  );

  useEffect(() => {
    function onBanner(e) { setBottom(e.detail ? BOTTOM_ABOVE : BOTTOM_NORMAL); }
    window.addEventListener('ha:cookie-banner', onBanner);
    return () => window.removeEventListener('ha:cookie-banner', onBanner);
  }, []);

  useEffect(() => {
    let t;
    if      (phase === 'idle')    t = setTimeout(() => setPhase('in'),      INIT_DELAY);
    else if (phase === 'in')      t = setTimeout(() => setPhase('visible'), ANIM_IN);
    else if (phase === 'visible') t = setTimeout(() => setPhase('out'),     SHOW_DURATION);
    else if (phase === 'out')     t = setTimeout(() => setPhase('pause'),   ANIM_OUT);
    else if (phase === 'pause')   t = setTimeout(() => {
      setIndex(i => (i + 1) % items.length);
      setPhase('in');
    }, PAUSE);
    return () => clearTimeout(t);
  }, [phase, items.length]);

  /* Hide entirely on Israel trip pages */
  if (isIsraelPage) return null;

  const item     = items[index % items.length];
  const isHidden = phase === 'idle' || phase === 'pause';

  const opacity    = isHidden ? 0 : 1;
  const translateY = (isHidden || phase === 'in') ? '20px' : '0px';
  const transition = isHidden
    ? 'none'
    : phase === 'out'
      ? `opacity ${ANIM_OUT}ms ease, transform ${ANIM_OUT}ms ease`
      : `opacity ${ANIM_IN}ms cubic-bezier(0.22,1,0.36,1), transform ${ANIM_IN}ms cubic-bezier(0.22,1,0.36,1)`;

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        bottom,
        right:         '24px',
        zIndex:        997,
        width:         '272px',
        opacity,
        transform:     `translateY(${translateY})`,
        transition:    `${transition}, bottom 0.35s cubic-bezier(0.22,1,0.36,1)`,
        pointerEvents: isHidden ? 'none' : 'auto',
        direction:     'ltr',
      }}
    >
      <div style={{
        background:   '#FFFFFF',
        borderRadius: '14px',
        boxShadow:    '0 4px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)',
        border:       '1px solid rgba(0,0,0,0.07)',
        padding:      '12px 14px',
        display:      'flex',
        alignItems:   'center',
        gap:          '12px',
      }}>

        {/* Destination image circle */}
        {item.img ? (
          <img
            src={item.img}
            alt={item.exp}
            style={{
              width:        '42px',
              height:       '42px',
              borderRadius: '50%',
              objectFit:    'cover',
              flexShrink:   0,
              display:      'block',
            }}
          />
        ) : (
          <div style={{
            width:          '42px',
            height:         '42px',
            borderRadius:   '50%',
            background:     'linear-gradient(135deg, #4c1d95, #7c3aed)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexShrink:     0,
            fontSize:       '20px',
            lineHeight:     1,
          }}>🏔️</div>
        )}

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily:   "'Ploni', Arial, sans-serif",
            fontSize:     '13px',
            fontWeight:   700,
            color:        '#111827',
            lineHeight:   1.3,
            marginBottom: '3px',
            direction:    isEn ? 'ltr' : 'rtl',
            textAlign:    'start',
          }}>
            {isEn ? 'New registration!' : 'הרשמה חדשה!'}
          </div>
          <div style={{
            fontFamily:   "'Ploni', Arial, sans-serif",
            fontSize:     '12px',
            fontWeight:   400,
            color:        '#6B7280',
            lineHeight:   1.3,
            direction:    isEn ? 'ltr' : 'rtl',
            textAlign:    'start',
            overflow:     'hidden',
            whiteSpace:   'nowrap',
            textOverflow: 'ellipsis',
          }}>
            {isEn
              ? `${item.name} registered for ${item.exp} · ${item.time}`
              : `${item.name} ${item.female ? 'נרשמה' : 'נרשם'} ל${item.exp} · ${item.time}`
            }
          </div>
        </div>

      </div>
    </div>
  );
}
