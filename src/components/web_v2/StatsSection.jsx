/**
 * StatsSection.jsx — Floating stats bar
 * מרחף בין ההירו לסקשן המשלחות
 */

import { EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';

const STATS = [
  { value: '15',        label: 'יעדים ברחבי העולם'    },
  { value: '543+',       label: 'מטיילים שכבשו פסגות'  },
  { value: '₪210K+',  label: 'נתרמו לחולי סרטן'    },
  { value: '94%',       label: 'אחוזי הצלחה'           },
];

export default function StatsSection() {
  const { isMobile } = useBreakpoint();

  return (
    <div style={{
      padding:   '0 5%',
      boxSizing: 'border-box',
      marginTop: '-52px',
      position:  'relative',
      zIndex:    10,
      direction: 'rtl',
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
          <div
            key={i}
            style={{
              textAlign:   'center',
              padding:     isMobile
                             ? (i >= 2 ? '18px 8px 10px' : '10px 8px 18px')
                             : '4px 24px',
              borderRight: (!isMobile && i > 0) ? '1px solid #ECEAF8' : 'none',
              borderBottom: (isMobile && i < 2) ? '1px solid #ECEAF8' : 'none',
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
            }}>
              {s.value}
            </div>
            <div style={{
              fontFamily: 'Ploni, sans-serif',
              fontSize:   FS.sm,
              fontWeight: 400,
              color:      '#6B6B8A',
              marginTop:  '8px',
              lineHeight: 1.4,
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
