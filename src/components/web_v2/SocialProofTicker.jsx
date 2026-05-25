/**
 * SocialProofTicker.jsx
 * Floating social proof notification popup (bottom-right corner).
 * Shows one registration at a time — slides up, stays 5s, fades out, 8s pause, repeats.
 * Each popup picks a completely fresh random name, destination, and time so the
 * sequence never repeats and always looks organic.
 *
 * Features:
 *  - X button: dismisses for the current page visit only (resets on navigation)
 *  - Hover pause: countdown stops while the user is hovering
 *  - Modal-aware: hides immediately when a ha:modal event fires (e.g. mobile menu)
 *  - Responsive width: never overflows on small phones
 *  - Image error fallback: broken images fall back to the mountain emoji
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

/* prevName / prevExp / prevTime are excluded from their pools so the same
   value never appears twice in a row, and cross-session starts fresh too. */
function freshItem(isEn, fixedExp = null, prevName = null, prevExp = null, prevTime = null) {
  const allNames = isEn ? NAMES_EN : NAMES_HE;
  const allExps  = isEn ? EXPS_EN  : EXPS_HE;
  const allTimes = isEn ? TIMES_EN : TIMES_HE;

  const names = prevName
    ? allNames.filter(n => (isEn ? n : n.name) !== prevName)
    : allNames;
  const exps = (!fixedExp && prevExp)
    ? allExps.filter(e => e !== prevExp)
    : allExps;
  const times = prevTime
    ? allTimes.filter(t => t !== prevTime)
    : allTimes;

  const nameEntry = rndPick(names);
  const exp       = fixedExp ?? rndPick(exps);
  return {
    name:   isEn ? nameEntry : nameEntry.name,
    female: isEn ? false     : nameEntry.f,
    exp,
    time:   rndPick(times),
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
  'פסגות הבלקן':     '/images/cards/peaks-of-balkan.webp',
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
  'Peaks of the Balkans': '/images/cards/peaks-of-balkan.webp',
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
const SHOW_DURATION = 8000;   // ms fully visible
const ANIM_OUT      = 500;    // ms fade-out
const PAUSE         = 8000;   // ms gap between popups

const BOTTOM_NORMAL = '28px';
const BOTTOM_ABOVE  = '200px';
const LAST_ITEM_KEY = 'highair_sp_last'; // persists across sessions

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

  /* Max shows per page type — keeps the popup credible, not spammy.
     3 on homepage (user browses longer), 2 on expedition pages (focused visitor). */
  const MAX_SHOWS = isExpeditionPage ? 2 : 3;

  /* Count resets every page visit (React state, not sessionStorage) */
  const [showCount, setShowCount] = useState(0);

  /* Dismissed this page visit → hide for the rest of this visit only */
  const [dismissed, setDismissed] = useState(false);

  /* One item at a time — first item of each session excludes whatever
     was last shown in the previous session (read from localStorage). */
  const [item, setItem] = useState(() => {
    const last = JSON.parse(localStorage.getItem(LAST_ITEM_KEY) || 'null');
    return freshItem(isEn, isEn ? fixedExpEn : fixedExpHe, last?.name, last?.exp, last?.time);
  });
  /* Broken image → fall back to emoji */
  const [imgError, setImgError] = useState(false);

  /* phase: 'idle' | 'in' | 'visible' | 'out' | 'pause' */
  const [phase,     setPhase]     = useState('idle');
  /* Hover pauses the visible countdown */
  const [hovered,   setHovered]   = useState(false);
  /* Modal open (e.g. mobile nav) → exit immediately, don't start new cycle */
  const [modalOpen, setModalOpen] = useState(false);

  const [bottom, setBottom] = useState(
    () => localStorage.getItem('highair_cookie_consent') ? BOTTOM_NORMAL : BOTTOM_ABOVE
  );

  /* Cookie banner offset */
  useEffect(() => {
    function onBanner(e) { setBottom(e.detail ? BOTTOM_ABOVE : BOTTOM_NORMAL); }
    window.addEventListener('ha:cookie-banner', onBanner);
    return () => window.removeEventListener('ha:cookie-banner', onBanner);
  }, []);

  /* Modal detection — Header fires ha:modal when mobile menu opens/closes */
  useEffect(() => {
    function onModal(e) { setModalOpen(!!e.detail); }
    window.addEventListener('ha:modal', onModal);
    return () => window.removeEventListener('ha:modal', onModal);
  }, []);

  /* Reset everything on navigation — component stays mounted across routes.
     Also refresh the item so expedition pages always show their fixed destination. */
  useEffect(() => {
    setShowCount(0);
    setPhase('idle');
    setDismissed(false);
    setItem(prev => freshItem(isEn, isEn ? fixedExpEn : fixedExpHe, prev.name, prev.exp, prev.time));
  }, [location.pathname, isEn, fixedExpEn, fixedExpHe]);

  /* Reset image error flag whenever a new item is shown */
  useEffect(() => { setImgError(false); }, [item]);

  /* Count each show and remember the last item for cross-session variety */
  useEffect(() => {
    if (phase !== 'visible') return;
    setShowCount(prev => prev + 1);
    // Persist last shown item so next session starts with something different
    localStorage.setItem(LAST_ITEM_KEY, JSON.stringify({ name: item.name, exp: item.exp, time: item.time }));
  }, [phase, item]);

  /* Phase state machine
     - Pauses the visible countdown while hovered (desktop only)
     - Exits immediately if a modal opens while visible
     - Stops after MAX_SHOWS per page type (3 on homepage, 2 on expedition) */
  useEffect(() => {
    if (modalOpen && phase === 'visible') {
      setPhase('out');
      return;
    }
    if (modalOpen && (phase === 'idle' || phase === 'pause')) return;

    let t;
    if      (phase === 'idle')                t = setTimeout(() => setPhase('in'),      INIT_DELAY);
    else if (phase === 'in')                  t = setTimeout(() => setPhase('visible'), ANIM_IN);
    else if (phase === 'visible' && !hovered) t = setTimeout(() => setPhase('out'),     SHOW_DURATION);
    /* phase === 'visible' && hovered → no timeout, countdown is paused */
    else if (phase === 'out')                 t = setTimeout(() => setPhase('pause'),   ANIM_OUT);
    else if (phase === 'pause') {
      /* Stop silently once the per-visit limit is reached */
      if (showCount >= MAX_SHOWS) return;
      t = setTimeout(() => {
        setItem(prev => freshItem(isEn, isEn ? fixedExpEn : fixedExpHe, prev.name, prev.exp, prev.time));
        setPhase('in');
      }, PAUSE);
    }
    return () => clearTimeout(t);
  }, [phase, hovered, modalOpen, isEn, fixedExpHe, fixedExpEn, MAX_SHOWS, showCount]);

  function handleDismiss() {
    setDismissed(true);
  }

  /* Hide on Israel trip pages or if dismissed this session */
  if (isIsraelPage || dismissed) return null;

  const isHidden = phase === 'idle' || phase === 'pause';

  /* 'in' arms the transition without changing values (stays at 0/20px).
     'visible' fires both opacity and transform simultaneously → fade+slide-up.
     'out' reverses both simultaneously → fade+slide-down.               */
  const opacity    = phase === 'visible' ? 1 : 0;
  const translateY = phase === 'visible' ? '0px' : '20px';
  const animDur    = phase === 'out' ? ANIM_OUT : ANIM_IN;
  const animEase   = phase === 'out' ? 'ease' : 'cubic-bezier(0.22,1,0.36,1)';
  const transition = isHidden
    ? 'none'
    : `opacity ${animDur}ms ${animEase}, transform ${animDur}ms ${animEase}`;

  const showImg = item.img && !imgError;

  return (
    <div
      aria-hidden="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:      'fixed',
        bottom,
        right:         '24px',
        zIndex:        997,
        /* Responsive: never overflows on narrow phones */
        width:         'min(300px, calc(100vw - 48px))',
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
        position:     'relative',
      }}>

        {/* X dismiss button */}
        <button
          onClick={handleDismiss}
          aria-label={isEn ? 'Close' : 'סגור'}
          style={{
            position:       'absolute',
            top:            '7px',
            right:          '8px',
            width:          '18px',
            height:         '18px',
            border:         'none',
            background:     'transparent',
            cursor:         'pointer',
            color:          '#CBD5E1',
            fontSize:       '16px',
            lineHeight:     1,
            padding:        0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            transition:     'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#6B7280'}
          onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
        >
          ×
        </button>

        {/* Destination image circle — falls back to emoji on error */}
        {showImg ? (
          <img
            src={item.img}
            alt={item.exp}
            onError={() => setImgError(true)}
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

        {/* Text — right-padded so it doesn't slide under the X button */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: '14px' }}>
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
            fontFamily: "'Ploni', Arial, sans-serif",
            fontSize:   '12px',
            fontWeight: 400,
            color:      '#6B7280',
            lineHeight: 1.3,
            direction:  isEn ? 'ltr' : 'rtl',
            textAlign:  'start',
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
