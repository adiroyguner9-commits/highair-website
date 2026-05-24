/**
 * SocialProofTicker.jsx
 * Floating social proof notification popup (bottom-right corner).
 * Shows one registration at a time — slides up, stays 5s, fades out, 8s pause, repeats.
 * Each popup picks a completely fresh random name, destination, and time so the
 * sequence never repeats and always looks organic.
 */

import { useState, useEffect } from 'react';
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
  'לפני 2 דקות', 'לפני 5 דקות', 'לפני 9 דקות', 'לפני 14 דקות',
  'לפני 21 דקות', 'לפני 33 דקות', 'לפני 47 דקות', 'לפני שעה',
  'לפני שעה וחצי', 'לפני שעתיים', 'לפני 3 שעות', 'לפני 4 שעות',
  'לפני 6 שעות', 'לפני 8 שעות', 'לפני 11 שעות', 'לפני 13 שעות',
  'לפני יום', 'לפני יומיים',
];

const TIMES_EN = [
  '2 minutes ago', '5 minutes ago', '9 minutes ago', '14 minutes ago',
  '21 minutes ago', '33 minutes ago', '47 minutes ago', '1 hour ago',
  '90 minutes ago', '2 hours ago', '3 hours ago', '4 hours ago',
  '6 hours ago', '8 hours ago', '11 hours ago', '13 hours ago',
  '1 day ago', '2 days ago',
];

/* ── Fully random item — new pick on every popup show ── */
function rndPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* prevName / prevExp are excluded from the pool so the same value
   never appears twice in a row. */
function freshItem(isEn, fixedExp = null, prevName = null, prevExp = null) {
  const allNames = isEn ? NAMES_EN : NAMES_HE;
  const allExps  = isEn ? EXPS_EN  : EXPS_HE;

  const names = prevName
    ? allNames.filter(n => (isEn ? n : n.name) !== prevName)
    : allNames;
  const exps = (!fixedExp && prevExp)
    ? allExps.filter(e => e !== prevExp)
    : allExps;

  const nameEntry = rndPick(names);
  const exp       = fixedExp ?? rndPick(exps);
  return {
    name:   isEn ? nameEntry : nameEntry.name,
    female: isEn ? false     : nameEntry.f,
    exp,
    time:   rndPick(isEn ? TIMES_EN : TIMES_HE),
    img:    EXP_IMG[exp] || null,
  };
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

  /* One item at a time — regenerated fresh on every popup show */
  const [item, setItem] = useState(
    () => freshItem(isEn, isEn ? fixedExpEn : fixedExpHe)
  );
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
      setItem(prev => freshItem(isEn, isEn ? fixedExpEn : fixedExpHe, prev.name, prev.exp));
      setPhase('in');
    }, PAUSE);
    return () => clearTimeout(t);
  }, [phase, isEn, fixedExpHe, fixedExpEn]);

  /* Hide entirely on Israel trip pages */
  if (isIsraelPage) return null;

  const isHidden = phase === 'idle' || phase === 'pause';

  /* 'in' phase just arms the transition — values stay at 0 / 20px.
     'visible' then fires both opacity and transform at once → fade+slide-up.
     'out' reverses both at once → fade+slide-down. */
  const opacity    = phase === 'visible' ? 1 : 0;
  const translateY = phase === 'visible' ? '0px' : '20px';
  const animDur    = phase === 'out' ? ANIM_OUT : ANIM_IN;
  const animEase   = phase === 'out' ? 'ease' : 'cubic-bezier(0.22,1,0.36,1)';
  const transition = isHidden
    ? 'none'
    : `opacity ${animDur}ms ${animEase}, transform ${animDur}ms ${animEase}`;

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        bottom,
        right:         '24px',
        zIndex:        997,
        width:         '300px',
        opacity,
        transform:     `translateY(${translateY})`,
        transition:    `${transition}, bottom 0.35s cubic-bezier(0.22,1,0.36,1)`,
        pointerEvents: phase === 'visible' ? 'auto' : 'none',
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
