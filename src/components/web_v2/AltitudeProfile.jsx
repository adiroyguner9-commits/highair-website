/* AltitudeProfile.jsx — the altitude of each day of a trip, drawn from the
   altitudes already written in the itinerary titles ("Machame Gate (1800m) -
   Machame Camp (2835m)"): the line is where you sleep, a dot above it is the
   day's high point ("climb high, sleep low"). Foreign sites only (owner, 6 Nov
   2026: the most asked-for trust element for German and US climbers). Feet
   are added on the English site. Nothing is drawn with fewer than 4 days of
   data, so a trip without altitudes simply shows no chart. */
import { tx, currentLang } from '../../website/lang.js';
import { feetText } from '../../website/units.js';
import { profileFromItinerary } from '../../website/altitudeProfile.js';
export { profileFromItinerary };

export default function AltitudeProfile({ itinerary, isMobile }) {
  const pts = profileFromItinerary(itinerary);
  if (pts.length < 4) return null;
  const lang = currentLang();
  const W = isMobile ? 400 : 800, H = isMobile ? 240 : 260, L = isMobile ? 44 : 56, R = 14, T = 28, B = 34;
  const top = Math.ceil(Math.max(...pts.map(p => p.high)) / 1000) * 1000;
  const bottom = Math.max(0, Math.floor(Math.min(...pts.map(p => p.sleep)) / 1000) * 1000);
  const firstDay = pts[0].day, lastDay = pts[pts.length - 1].day;
  const x = d => L + ((d - firstDay) / Math.max(1, lastDay - firstDay)) * (W - L - R);
  const y = a => T + (1 - (a - bottom) / (top - bottom)) * (H - T - B);
  const grid = []; for (let a = bottom; a <= top; a += 1000) grid.push(a);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.day).toFixed(1)},${y(p.sleep).toFixed(1)}`).join(' ');
  const area = `${line} L${x(lastDay).toFixed(1)},${y(bottom)} L${x(firstDay).toFixed(1)},${y(bottom)} Z`;
  const peak = pts.reduce((a, b) => (b.high > a.high ? b : a));
  const ft = feetText(peak.high, lang);
  const fmt = n => n.toLocaleString(lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-US');

  return (
    <section aria-label={tx('Altitude profile')} style={{ padding: isMobile ? '40px 0 8px' : '56px 0 8px' }}>
      <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, color: '#0A0818', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
        {tx('Altitude profile')}
      </h2>
      <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#6B6B8A', margin: '0 0 18px', lineHeight: 1.5 }}>
        {tx('The line is where you sleep each night; a dot above it is the highest point you reach that day. Climbing high and sleeping lower is how the body acclimatizes.')}
      </p>
      <div style={{ background: '#FFFFFF', border: '1px solid #ECEAF8', borderRadius: '20px', padding: isMobile ? '12px 6px' : '18px 18px 10px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={tx('Altitude profile')} style={{ display: 'block', fontFamily: "'Ploni', sans-serif" }}>
          <defs>
            <linearGradient id="ha-alt-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {grid.map(a => (
            <g key={a}>
              <line x1={L} x2={W - R} y1={y(a)} y2={y(a)} stroke="#EEEAF8" strokeWidth="1" />
              <text x={L - 8} y={y(a) + 4} textAnchor="end" fontSize={12} fill="#8A86A3">{fmt(a)}</text>
            </g>
          ))}
          <path d={area} fill="url(#ha-alt-fill)" />
          <path d={line} fill="none" stroke="#6D28D9" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          {pts.map(p => (
            <g key={p.day}>
              {p.high > p.sleep && (
                <>
                  <line x1={x(p.day)} x2={x(p.day)} y1={y(p.high)} y2={y(p.sleep)} stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx={x(p.day)} cy={y(p.high)} r="5" fill="#FFFFFF" stroke="#6D28D9" strokeWidth="2.5" />
                </>
              )}
              <circle cx={x(p.day)} cy={y(p.sleep)} r="4" fill="#6D28D9" />
              <text x={x(p.day)} y={H - 10} textAnchor="middle" fontSize={12} fill="#8A86A3">{p.day}</text>
            </g>
          ))}
          <text x={x(peak.day)} y={y(peak.high) - 12} textAnchor={peak.day === lastDay ? 'end' : 'middle'} fontSize={14} fontWeight="700" fill="#4C1D95">
            {`${fmt(peak.high)} m${ft ? ` · ${ft}` : ''}`}
          </text>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px 16px', padding: '4px 8px 0', fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#6B6B8A' }}>
          <span>{tx('Day')} · {tx('Altitude in meters')}</span>
          <span style={{ display: 'inline-flex', gap: '14px' }}>
            <span><span style={{ display: 'inline-block', width: 14, height: 3, background: '#6D28D9', verticalAlign: 'middle', marginInlineEnd: 6 }} />{tx('Sleeping altitude')}</span>
            <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', border: '2px solid #6D28D9', verticalAlign: 'middle', marginInlineEnd: 6 }} />{tx('Highest point of the day')}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
