/**
 * StatsSection.jsx - Floating stats bar between the hero and the trips.
 * The numbers are shown as they are, with no count-up from 0, so a crawler that
 * captures the first frame reads the real figure (owner, 17 Nov 2026). The figures
 * live in src/data/siteStats.js, shared with the crawlers' text layer.
 */

import { useTranslation } from 'react-i18next';
import { FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { CARD_EXPS } from '../../data/navData.js';
import { isOpenNow, HIDDEN_ON_EN } from '../../data/expeditionGroups.js';
import { DEST_COUNT, SITE_STATS } from '../../data/siteStats.js';
/* Foreign sites count only the destinations open now, the same ones their
   cards and menus show (owner, 6 Nov 2026: no "coming soon" abroad). */
const OPEN_DEST_COUNT = CARD_EXPS.filter(e => !String(e.slug || '').startsWith('safari') && isOpenNow(e) && !HIDDEN_ON_EN.has(e.slug)).length;

/* ── Single stat cell ── */
function StatCell({ raw, label, isMobile, idx }) {
  return (
    <div
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
        {raw}
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
  const dir   = i18n.language !== 'he' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';

  const STATS = [
    { value: String(i18n.language === 'he' ? DEST_COUNT : OPEN_DEST_COUNT), label: t('stats.destinations') },
    { value: SITE_STATS.climbers,  label: t('stats.climbers')     },
    { value: isRtl ? SITE_STATS.donatedHe : SITE_STATS.donatedEn, label: t('stats.donated') },
    { value: SITE_STATS.successRate,   label: t('stats.successRate')  },
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
