/**
 * StatsSection.jsx - Floating stats bar with count-up animation
 * מרחף בין ההירו לסקשן המשלחות — המספרים סופרים עלייה כשנכנסים לתצוגה
 */

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { useInView } from '../../website/useInView.js';

/* ── Count-up hook ─────────────────────────────────────────────
   Counts from 0 → `to` over `duration`ms using easeOutCubic.
   Fires only once when `inView` first becomes true.           */
function useCountUp(to, inView, duration = 1500) {
  const [val, setVal]   = useState(0);
  const rafRef  = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let startTs = null;

    function step(ts) {
      if (!startTs) startTs = ts;
      const p     = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(Math.round(eased * to));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return val;
}

/* ── Parse "₪210K+" → { prefix:'₪', target:210, suffix:'K+' } ── */
function parseStat(raw) {
  const m = String(raw).match(/^([^\d]*)(\d+)([^\d]*)$/);
  return m
    ? { prefix: m[1], target: parseInt(m[2], 10), suffix: m[3] }
    : { prefix: '', target: 0, suffix: raw };
}

/* ── Single animated stat cell ── */
function StatCell({ raw, label, isMobile, idx }) {
  const [ref, inView]           = useInView(0.15);
  const { prefix, target, suffix } = parseStat(raw);
  const count   = useCountUp(target, inView);
  const display = target > 0 ? `${prefix}${count}${suffix}` : raw;

  return (
    <div
      ref={ref}
      style={{
        textAlign:    'center',
        padding:      isMobile
                        ? (idx >= 2 ? '18px 8px 10px' : '10px 8px 18px')
                        : '4px 24px',
        borderRight:  !isMobile && idx > 0 ? '1px solid #ECEAF8' : 'none',
        borderBottom:  isMobile && idx < 2 ? '1px solid #ECEAF8' : 'none',
      }}
    >
      <div style={{
        fontFamily:    "'Mazzard', sans-serif",
        fontSize:      isMobile ? '26px' : '34px',
        fontWeight:    900,
        color:         '#6D28D9',
        lineHeight:    1,
        letterSpacing: '-0.02em',
        direction:     'ltr',
        transition:    'color 0.2s ease',
      }}>
        {display}
      </div>
      <div style={{
        fontFamily: 'Ploni, sans-serif',
        fontSize:   FS.sm,
        fontWeight: 400,
        color:      '#6B6B8A',
        marginTop:  '8px',
        lineHeight: 1.4,
      }}>
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const { isMobile } = useBreakpoint();
  const { t, i18n }  = useTranslation();
  const dir   = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';

  const STATS = [
    { value: '15',    label: t('stats.destinations') },
    { value: '543+',  label: t('stats.climbers')     },
    { value: isRtl ? '₪210K+' : '$70K+', label: t('stats.donated') },
    { value: '94%',   label: t('stats.successRate')  },
  ];

  return (
    <div style={{
      padding:   '0 5%',
      boxSizing: 'border-box',
      marginTop: '-52px',
      position:  'relative',
      zIndex:    10,
      direction: dir,
    }}>
      <div style={{
        maxWidth:            '1100px',
        margin:              '0 auto',
        background:          '#FFFFFF',
        borderRadius:        '20px',
        boxShadow:           '0 20px 60px rgba(0,0,0,0.15)',
        padding:             isMobile ? '16px 20px' : '22px 52px',
        display:             'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap:                 '0',
      }}>
        {STATS.map((s, i) => (
          <StatCell key={i} raw={s.value} label={s.label} isMobile={isMobile} idx={i} />
        ))}
      </div>
    </div>
  );
}
