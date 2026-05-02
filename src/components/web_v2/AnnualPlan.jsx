/**
 * AnnualPlan.jsx - /annual-plan
 * All upcoming trips (worldwide + Israel) from Airtable,
 * grouped by month, sorted earliest → latest.
 * Trips are removed automatically once their Return date passes.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { COLOR, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { EXPS } from '../../data/mockData.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';

/* ── Helpers ── */
function fmtDate(str, months) {
  if (!str) return '';
  const d = new Date(str);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function monthKey(str) {
  const d = new Date(str);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key, months) {
  const [year, month] = key.split('-');
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

/* Tag for safari / kosher variants */
function eventTag(e, isRtl) {
  const n = (typeof e === 'string' ? e : e?.slug || e?.eventName || '').toLowerCase();
  if (n.includes('kosher') && n.includes('safari')) return isRtl ? 'שומרי מסורת + ספארי' : 'Kosher + Safari';
  if (n.includes('kosher')) return isRtl ? 'שומרי מסורת' : 'Kosher';
  if (n.includes('safari')) return isRtl ? '+ ספארי' : '+ Safari';
  return null;
}

/* Find expedition from EXPS by matching eventName → airtableEvents */
function findExp(eventName) {
  if (!eventName) return null;
  const lower = eventName.toLowerCase();
  return EXPS.find(e =>
    (e.airtableEvents || []).some(ev => ev.toLowerCase() === lower)
  ) || null;
}

/* ══════════════════════════════════════════════════════════════
   TripCard
══════════════════════════════════════════════════════════════ */
function TripCard({ group, exp, months, isRtl }) {
  const [hovered, setHovered] = useState(false);
  const [imgReady, setImgReady] = useState(!exp?.img);
  const cardRef  = useRef(null);
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  const capacity  = group.capacity || exp?.groupCapacity || 15;
  const spotsLeft = capacity - (group.count || 0);
  const isFull    = spotsLeft <= 0;
  const isLow     = !isFull && spotsLeft <= 6;
  const spotsBadge = isFull
    ? { bg: 'rgba(220,38,38,0.85)',  color: '#fff', text: isRtl ? 'קבוצה מלאה' : 'Full' }
    : isLow
    ? { bg: 'rgba(217,119,6,0.85)',  color: '#fff', text: isRtl ? `נשארו ${spotsLeft} מקומות` : `${spotsLeft} spots left` }
    : { bg: 'rgba(5,150,105,0.85)',  color: '#fff', text: isRtl ? 'הרשמה פתוחה' : 'Open' };
  const tag = eventTag(group.eventName, isRtl);

  /* Lazy-load image */
  useEffect(() => {
    if (!exp?.img) return;
    const el  = cardRef.current;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setImgReady(true); obs.disconnect(); }
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [exp?.img]);

  const bg = exp?.img
    ? (imgReady ? `url(${exp.img}) center/cover no-repeat` : (exp?.grad || '#1a1a2e'))
    : (exp?.grad || 'linear-gradient(135deg,#4338ca,#7c3aed,#1e1b4b)');

  function handleClick() {
    if (exp?.slug) navigate(`/expedition/${exp.slug}`);
  }

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius:   RADIUS.xl,
        overflow:       'hidden',
        background:     bg,
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'space-between',
        minHeight:      isMobile ? '220px' : '280px',
        cursor:         exp?.slug ? 'pointer' : 'default',
        transform:      hovered && exp?.slug ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow:      hovered && exp?.slug
                          ? '0 20px 48px rgba(0,0,0,0.22)'
                          : '0 4px 16px rgba(0,0,0,0.10)',
        transition:     `transform 0.3s ${EASING.out}, box-shadow 0.3s ${EASING.out}`,
        position:       'relative',
      }}
    >
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.65) 100%)',
        zIndex: 0,
      }} />

      {/* ── Top row: country badge + spots badge ── */}
      <div style={{
        padding:        '16px 16px 0',
        direction:      isRtl ? 'rtl' : 'ltr',
        position:       'relative',
        zIndex:         1,
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
      }}>
        {/* Country badge */}
        <div style={{
          display:              'inline-flex',
          alignItems:           'center',
          gap:                  '5px',
          padding:              '4px 10px',
          borderRadius:         RADIUS.full,
          background:           'rgba(255,255,255,0.15)',
          backdropFilter:       'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontFamily:           'Ploni, sans-serif',
          fontSize:             FS.sm,
          fontWeight:           600,
          color:                'rgba(255,255,255,0.92)',
          direction:            'ltr',
        }}>
          {exp?.flag || ''} {isRtl ? (exp?.countryHe || '-') : (exp?.country || exp?.countryHe || '-')}
        </div>

        {/* Spots badge — top left (end in RTL) */}
        <div style={{
          display:              'inline-flex',
          alignItems:           'center',
          padding:              '4px 10px',
          borderRadius:         RADIUS.full,
          background:           spotsBadge.bg,
          backdropFilter:       'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontFamily:           'Ploni, sans-serif',
          fontSize:             FS.sm,
          fontWeight:           700,
          color:                spotsBadge.color,
          whiteSpace:           'nowrap',
        }}>
          {spotsBadge.text}
        </div>
      </div>

      {/* ── Bottom: name + dates + spots ── */}
      <div style={{ padding: '0 16px 18px', direction: isRtl ? 'rtl' : 'ltr', position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontFamily:    "'Ploni', sans-serif",
          fontSize:      'clamp(16px, 2.5vw, 20px)',
          fontWeight:    700,
          color:         '#FFFFFF',
          margin:        '0 0 6px',
          letterSpacing: '-0.02em',
          lineHeight:    1.2,
        }}>
          {isRtl ? (exp?.nameHe || group.eventName) : (exp?.nameEn || exp?.name || exp?.nameHe || group.eventName)}
        </h3>

        {/* Date range */}
        <p style={{
          fontFamily: "'Ploni', sans-serif",
          fontSize:   '13px',
          fontWeight: 400,
          color:      'rgba(255,255,255,0.80)',
          margin:     0,
          textAlign:  'start',
        }}>
          {fmtDate(group.departure, months)}
          {group.returnDate ? ` – ${fmtDate(group.returnDate, months)}` : ''}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main page
══════════════════════════════════════════════════════════════ */
export default function AnnualPlan() {
  const { isMobile } = useBreakpoint();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';
  const tabsRef = useRef(null);
  const monthNames = t('annualPlan.months', { returnObjects: true });

  const [groups,  setGroups]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [activeMonth, setActiveMonth] = useState(null);

  /* ── Fetch all groups from Airtable ── */
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* Paginate through ALL records of a table, respecting Airtable's 100-record limit */
    async function fetchAllRecords(url) {
      const records = [];
      let offset = null;
      do {
        const full = offset ? `${url}&offset=${encodeURIComponent(offset)}` : url;
        const data = await fetch(full).then(r => r.json());
        if (data.error) throw new Error(JSON.stringify(data.error));
        (data.records || []).forEach(r => records.push(r));
        offset = data.offset || null;
      } while (offset);
      return records;
    }

    fetch(`/api/airtable/Groups?fields[]=Event&fields[]=Group%20Name&fields[]=Departure&fields[]=Return&fields[]=Capacity`)
      .then(r => r.json())
      .then(async groupsData => {
      if (groupsData.error) throw new Error(JSON.stringify(groupsData.error));

      /* Fetch ALL customers with full pagination — guarantees accurate count */
      const custRecords = await fetchAllRecords(
        `/api/airtable/Customers?fields[]=Group%20Name&pageSize=100`
      );
      const counts = {};
      custRecords.forEach(rec => {
        const gn = rec.fields['Group Name'] || rec.fields['group name'];
        if (gn) counts[gn] = (counts[gn] || 0) + 1;
      });

      const enriched = (groupsData.records || [])
        .map(rec => {
          const groupName  = rec.fields['Group Name'] || rec.id;
          const returnDate = rec.fields['Return']     || null;
          const departure  = rec.fields['Departure']  || null;
          return {
            id:         rec.id,
            groupName,
            eventName:  rec.fields['Event'] || '',
            departure,
            returnDate,
            count:      counts[groupName] || 0,
            capacity:   rec.fields['Capacity'] || null,
          };
        })
        /* Hide trips departing within 7 days (or no departure date) */
        .filter(g => {
          if (!g.departure) return false;
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return new Date(g.departure) >= weekFromNow;
        })
        /* Hide April (3) and May (4) departures */
        .filter(g => {
          const m = new Date(g.departure).getMonth();
          return m !== 3 && m !== 4;
        })
        /* Hide specific excluded events */
        .filter(g => g.eventName !== 'Annapurna_Circut_Kosher')
        /* Sort by departure date ascending */
        .sort((a, b) => new Date(a.departure) - new Date(b.departure));

      /* Merge groups with same expedition + same departure date.
         Use the expedition slug as the key so variants like
         "Kilimanjaro" and "Kilimanjaro Safari" collapse together. */
      const mergedMap = new Map();
      enriched.forEach(g => {
        const expSlug = findExp(g.eventName)?.slug || g.eventName;
        const key = `${expSlug}|${(g.departure || '').slice(0, 10)}`;
        if (mergedMap.has(key)) {
          const ex = mergedMap.get(key);
          ex.count    += g.count;
          ex.capacity  = (ex.capacity || 0) + (g.capacity || 0);
          /* keep the latest return date */
          if (g.returnDate && (!ex.returnDate || new Date(g.returnDate) > new Date(ex.returnDate))) {
            ex.returnDate = g.returnDate;
          }
        } else {
          mergedMap.set(key, { ...g });
        }
      });
      const merged = Array.from(mergedMap.values());

      setGroups(merged);
      if (enriched.length > 0) {
        setActiveMonth(monthKey(enriched[0].departure));
      }
    }).catch(err => {
      console.error('[annual-plan]', err);
      setError(err.message);
    }).finally(() => setLoading(false));
  }, []);

  /* ── Group by month ── */
  const byMonth = {};
  groups.forEach(g => {
    const key = monthKey(g.departure);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(g);
  });
  const months = Object.keys(byMonth).sort();

  /* ── Scroll to month section ── */
  function scrollToMonth(key) {
    setActiveMonth(key);
    const el = document.getElementById(`month-${key}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 160;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <>
      <Header />
      <main style={{
        background: '#FAFAF8',
        minHeight:  '100vh',
        paddingTop: '80px',
        direction:  dir,
      }}>

        {/* ── Page header ── */}
        <div style={{
          background:  '#FFFFFF',
          borderBottom: '1px solid #ECEAF8',
          padding:     isMobile ? '36px 5% 28px' : '52px 5% 36px',
          textAlign:   'center',
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
            {t('annualPlan.title')}
          </h1>
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize:   FS.body,
            fontWeight: 300,
            color:      '#6B6B8A',
            margin:     0,
            lineHeight: 1.7,
          }}>
            {t('annualPlan.subtitle')}
          </p>
        </div>

        {/* ── Sticky month tabs ── */}
        {months.length > 0 && (
          <div style={{
            position:   'sticky',
            top:        '80px',
            zIndex:     100,
            background: '#FFFFFF',
            borderBottom: '1px solid #ECEAF8',
            boxShadow:  '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div
              ref={tabsRef}
              style={{
                display:    'flex',
                gap:        '4px',
                overflowX:  'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                padding:    isMobile ? '12px 5%' : '14px 5%',
                maxWidth:   '1280px',
                margin:     '0 auto',
              }}
            >
              {months.map(key => {
                const isActive = key === activeMonth;
                return (
                  <button
                    key={key}
                    onClick={() => scrollToMonth(key)}
                    style={{
                      flexShrink:  0,
                      padding:     isMobile ? '6px 16px' : '8px 20px',
                      borderRadius: RADIUS.full,
                      border:      `2px solid ${isActive ? COLOR.primary : '#E5E3F0'}`,
                      background:  isActive ? COLOR.primary : '#FFFFFF',
                      color:       isActive ? '#FFFFFF' : '#4B4869',
                      fontFamily:  "'Ploni', sans-serif",
                      fontSize:    FS.btn,
                      fontWeight:  isActive ? 700 : 400,
                      cursor:      'pointer',
                      whiteSpace:  'nowrap',
                      transition:  `all 0.22s ${EASING.out}`,
                      boxShadow:   isActive ? '0 4px 14px rgba(109,40,217,0.25)' : 'none',
                    }}
                  >
                    {monthLabel(key, monthNames)}
                    <span style={{
                      display:        'inline-flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      minWidth:       '18px',
                      height:         '18px',
                      padding:        '0 4px',
                      borderRadius:   '9px',
                      marginRight:    '6px',
                      background:     isActive ? 'rgba(255,255,255,0.25)' : 'rgba(109,40,217,0.10)',
                      color:          isActive ? '#FFFFFF' : COLOR.primary,
                      fontSize:       '11px',
                      fontWeight:     700,
                    }}>
                      {byMonth[key].length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Content ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '32px 5%' : '48px 5%' }}>

          {/* Loading */}
          {loading && (
            <div style={{
              textAlign:  'center',
              padding:    '80px 0',
              fontFamily: "'Ploni', sans-serif",
              color:      '#6B6B8A',
              fontSize:   FS.body,
            }}>
              {t('annualPlan.loading')}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{
              textAlign:  'center',
              padding:    '80px 0',
              fontFamily: "'Ploni', sans-serif",
              color:      '#DC2626',
              fontSize:   FS.body,
            }}>
              {t('annualPlan.error')}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && groups.length === 0 && (
            <div style={{
              textAlign:   'center',
              padding:     '80px 24px',
              fontFamily:  "'Ploni', sans-serif',",
            }}>
              <div style={{ marginBottom: '16px' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke={COLOR.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#0A0818', margin: '0 0 8px' }}>
                {t('annualPlan.empty')}
              </p>
              <p style={{ fontSize: FS.body, color: '#6B6B8A', margin: 0 }}>
                {t('annualPlan.emptyDetail')}
              </p>
            </div>
          )}

          {/* Month sections */}
          {!loading && !error && months.map(key => (
            <div key={key} id={`month-${key}`} style={{ marginBottom: isMobile ? '40px' : '56px' }}>

              {/* Month title */}
              <div style={{
                display:     'flex',
                alignItems:  'center',
                gap:         '12px',
                marginBottom: '20px',
              }}>
                <h2 style={{
                  fontFamily:    "'Ploni', sans-serif",
                  fontSize:      isMobile ? '20px' : '26px',
                  fontWeight:    700,
                  color:         '#0A0818',
                  margin:        0,
                  letterSpacing: '-0.02em',
                }}>
                  {monthLabel(key, monthNames)}
                </h2>
                <div style={{
                  height: '2px',
                  flex:   1,
                  background: 'linear-gradient(to left, transparent, #ECEAF8)',
                  borderRadius: '1px',
                }} />
                <span style={{
                  fontFamily: "'Ploni', sans-serif",
                  fontSize:   '13px',
                  fontWeight: 600,
                  color:      COLOR.primary,
                  background: '#F5F3FF',
                  padding:    '3px 10px',
                  borderRadius: RADIUS.full,
                }}>
                  {byMonth[key].length} {isRtl ? 'יציאות' : 'departures'}
                </span>
              </div>

              {/* Cards grid */}
              <div style={{
                display:             'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap:                 '16px',
              }}>
                {byMonth[key].map(group => {
                  const exp = findExp(group.eventName);
                  return (
                    <TripCard key={group.id} group={group} exp={exp} months={monthNames} isRtl={isRtl} />
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
