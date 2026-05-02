/**
 * BookingWidget.jsx
 * Calendar + time-slot picker shown after expedition form submission.
 * Fetches available slots from /api/slots and books via /api/book-slot.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RADIUS, FS, COLOR, EASING } from '../../website/theme.js';
import { Analytics } from '../../utils/analytics.js';

/* ── Hebrew locale ── */
const HE_DAY_SHORT  = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];
const HE_DAYS_FULL  = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
const HE_MONTHS     = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני',
                       'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];

/* ── English locale ── */
const EN_DAY_SHORT  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const EN_DAYS_FULL  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const EN_MONTHS     = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatDateHe(dateStr, isRtl = true) {
  const d = new Date(dateStr + 'T12:00:00');
  if (isRtl) {
    return `יום ${HE_DAYS_FULL[d.getDay()]}, ${d.getDate()} ב${HE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }
  return `${EN_DAYS_FULL[d.getDay()]}, ${EN_MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/* ── SVG icons (stroke-based, matches site style) ── */
const IC = {
  calendar: (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2"/>
      <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2"/>
      <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2"/>
    </svg>
  ),
  checkCircle: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  clock: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  mail: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  chevronRight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  chevronLeft: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
};

/* ── Nav button style ── */
const NAV_BTN = {
  background:  'none',
  border:      'none',
  cursor:      'pointer',
  padding:     '4px 10px',
  display:     'flex',
  alignItems:  'center',
};

export default function BookingWidget({ name, phone, email, expedition, onSkip }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';
  const DAY_SHORT = isRtl ? HE_DAY_SHORT : EN_DAY_SHORT;
  const MONTHS    = isRtl ? HE_MONTHS    : EN_MONTHS;

  const today = new Date(); today.setHours(0,0,0,0);

  const [viewYear,   setViewYear]   = useState(today.getFullYear());
  const [viewMonth,  setViewMonth]  = useState(today.getMonth());
  const [selDate,    setSelDate]    = useState(null);
  const [slots,      setSlots]      = useState([]);
  const [slotsLoad,  setSlotsLoad]  = useState(false);
  const [selSlot,    setSelSlot]    = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [booked,     setBooked]     = useState(null);
  const [error,      setError]      = useState('');

  /* Load slots whenever a date is selected */
  useEffect(() => {
    if (!selDate) return;
    setSlotsLoad(true);
    setSlots([]);
    setSelSlot(null);
    setError('');
    fetch(`/api/slots?date=${selDate}`)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(d => { setSlots(d.slots || []); setSlotsLoad(false); })
      .catch(() => { setSlots([]); setSlotsLoad(false); });
  }, [selDate]);

  /* Calendar grid helpers */
  const firstDow    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSat      = d => new Date(viewYear, viewMonth, d).getDay() === 6;
  const isPast     = d => new Date(viewYear, viewMonth, d) < today;
  const isDisabled = d => !d || isSat(d) || isPast(d);
  const isSelected = d => d && selDate === toDateStr(new Date(viewYear, viewMonth, d));

  function selectDate(d) {
    if (isDisabled(d)) return;
    const dateStr = toDateStr(new Date(viewYear, viewMonth, d));
    Analytics.bookingDateSelect(dateStr);
    setSelDate(dateStr);
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); }
    else setViewMonth(m => m-1);
    setSelDate(null);
  }
  function nextMonth() {
    // Don't go more than 3 months ahead
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    const nextD   = new Date(viewYear, viewMonth + 1, 1);
    if (nextD >= maxDate) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); }
    else setViewMonth(m => m+1);
    setSelDate(null);
  }
  // Disable prev if already at current month
  const atMinMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  async function handleBook() {
    if (!selDate || !selSlot) return;
    setSubmitting(true);
    setError('');
    Analytics.bookingSubmit({ date: selDate, time: selSlot, expedition });
    try {
      const res = await fetch('/api/book-slot', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ date: selDate, time: selSlot, name, phone, email, expedition }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'slot_taken') {
          Analytics.bookingSlotTaken();
          setError(isRtl ? 'הסלוט הזה נתפס זה עתה - בחרו שעה אחרת' : 'This slot was just taken - please choose another time');
          setSlotsLoad(true);
          fetch(`/api/slots?date=${selDate}`)
            .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(d => { setSlots(d.slots || []); setSelSlot(null); setSlotsLoad(false); })
            .catch(() => { setSlotsLoad(false); });
        } else {
          Analytics.bookingError(data.error || `http_${res.status}`);
          setError(isRtl ? 'שגיאה בתיאום - נסו שוב' : 'Booking error - please try again');
        }
        setSubmitting(false);
        return;
      }
      setBooked({ date: selDate, time: selSlot });
    } catch {
      Analytics.bookingError('network');
      setError(isRtl ? 'שגיאה בתיאום - נסו שוב' : 'Booking error - please try again');
      setSubmitting(false);
    }
  }

  /* ── Success state ── */
  if (booked) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0', direction: isRtl ? 'rtl' : 'ltr' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          {IC.calendar}
        </div>
        <h3 style={{
          fontFamily: 'Ploni, sans-serif', fontSize: FS.h3, fontWeight: 700,
          color: '#fff', margin: '0 0 8px',
        }}>
          {isRtl ? 'השיחה נקבעה!' : 'Call Scheduled!'}
        </h3>
        <p style={{
          fontFamily: 'Ploni, sans-serif', fontSize: '16px', fontWeight: 600,
          color: 'rgba(167,139,250,1)', margin: '0 0 4px',
        }}>
          {formatDateHe(booked.date, isRtl)}
        </p>
        <p style={{
          fontFamily: 'Ploni, sans-serif', fontSize: '28px', fontWeight: 800,
          color: '#fff', margin: '0 0 16px', letterSpacing: '-0.5px',
        }}>
          {booked.time}
        </p>
        {email && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {IC.mail}
            <span style={{
              fontFamily: 'Ploni, sans-serif', fontSize: '13px',
              color: 'rgba(255,255,255,0.45)',
            }}>
              {isRtl ? 'אישור נשלח למייל שלך' : 'Confirmation sent to your email'}
            </span>
          </div>
        )}
      </div>
    );
  }

  /* ── Picker ── */
  return (
    <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <h3 style={{
        fontFamily: 'Ploni, sans-serif', fontSize: FS.h3, fontWeight: 700,
        color: '#fff', margin: '0 0 6px', textAlign: 'center',
      }}>
        {isRtl ? 'תאמו שיחה עם הצוות שלנו' : 'Schedule a Call with Our Team'}
      </h3>
      <p style={{
        fontFamily: 'Ploni, sans-serif', fontSize: '14px',
        color: 'rgba(255,255,255,0.45)', margin: '0 0 22px', textAlign: 'center',
      }}>
        {isRtl ? 'בחרו תאריך ושעה שמתאימים לכם' : 'Choose a date and time that works for you'}
      </p>

      {/* ── Calendar ── */}
      <div style={{
        background:   'rgba(255,255,255,0.05)',
        borderRadius: RADIUS.xl,
        border:       '1px solid rgba(255,255,255,0.1)',
        padding:      '18px',
        marginBottom: '14px',
      }}>
        {/* Month nav */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '14px',
        }}>
          <button onClick={nextMonth} aria-label={isRtl ? 'חודש הבא' : 'Next month'} style={NAV_BTN}>{IC.chevronRight}</button>
          <span style={{
            fontFamily: 'Ploni, sans-serif', fontWeight: 700,
            color: '#fff', fontSize: '15px',
          }}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={prevMonth} disabled={atMinMonth}
            aria-label={isRtl ? 'חודש קודם' : 'Previous month'}
            style={{ ...NAV_BTN, opacity: atMinMonth ? 0.2 : 1, cursor: atMinMonth ? 'default' : 'pointer' }}>
            {IC.chevronLeft}
          </button>
        </div>

        {/* Day-of-week headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px', marginBottom: '6px' }}>
          {DAY_SHORT.map(d => (
            <div key={d} style={{
              textAlign: 'center', fontFamily: 'Ploni, sans-serif',
              fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 600,
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>
          {cells.map((d, i) => {
            const disabled = isDisabled(d);
            const selected = isSelected(d);
            const dateLabel = d
              ? `${d} ${MONTHS[viewMonth]} ${viewYear}`
              : undefined;
            return (
              <button
                key={i}
                onClick={() => d && !disabled && selectDate(d)}
                disabled={!d || disabled}
                aria-label={dateLabel}
                aria-pressed={selected || undefined}
                style={{
                  aspectRatio:    '1',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  borderRadius:   RADIUS.xs,
                  fontFamily:     'Ploni, sans-serif',
                  fontSize:       '13px',
                  cursor:         d && !disabled ? 'pointer' : 'default',
                  background:     selected ? COLOR.primary : 'transparent',
                  color: !d
                    ? 'transparent'
                    : disabled
                    ? 'rgba(255,255,255,0.15)'
                    : selected
                    ? '#fff'
                    : 'rgba(255,255,255,0.8)',
                  fontWeight:   selected ? 700 : 400,
                  transition:   'background 0.15s ease',
                  userSelect:   'none',
                  border:       'none',
                  padding:      0,
                }}
              >
                {d || ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Time slots ── */}
      {selDate && (
        <div style={{ marginBottom: '14px' }}>
          {slotsLoad ? (
            <p style={{
              textAlign: 'center', fontFamily: 'Ploni, sans-serif',
              color: 'rgba(255,255,255,0.35)', fontSize: '14px', margin: '12px 0',
            }}>
              {isRtl ? 'טוען שעות...' : 'Loading times...'}
            </p>
          ) : slots.length === 0 ? (
            <p style={{
              textAlign: 'center', fontFamily: 'Ploni, sans-serif',
              color: 'rgba(255,255,255,0.35)', fontSize: '14px', margin: '12px 0',
            }}>
              {isRtl ? 'אין שעות פנויות ביום זה - בחרו יום אחר' : 'No available times on this day - please choose another'}
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', margin: '0 0 10px' }}>
                {IC.clock}
                <span style={{ fontFamily: 'Ploni, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                  {isRtl ? 'בחרו שעה' : 'Choose a time'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                {slots.map(s => {
                  const active = selSlot === s;
                  return (
                    <button
                      key={s}
                      onClick={() => { Analytics.bookingSlotSelect(s); setSelSlot(s); setError(''); }}
                      style={{
                        padding:      '10px 0',
                        borderRadius: RADIUS.md,
                        border:       active
                          ? `2px solid ${COLOR.primary}`
                          : '1px solid rgba(255,255,255,0.13)',
                        background:   active ? 'rgba(109,40,217,0.3)' : 'rgba(255,255,255,0.04)',
                        color:        active ? '#fff' : 'rgba(255,255,255,0.65)',
                        fontFamily:   'Ploni, sans-serif',
                        fontSize:     '14px',
                        fontWeight:   active ? 700 : 400,
                        cursor:       'pointer',
                        transition:   'all 0.15s ease',
                        direction:    'ltr',
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{
          fontFamily: 'Ploni, sans-serif', color: 'rgba(248,113,113,0.9)',
          fontSize: '13px', textAlign: 'center', margin: '0 0 12px',
        }}>
          {error}
        </p>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {selDate && selSlot && (
          <button
            onClick={handleBook}
            disabled={submitting}
            style={{
              padding:        '14px',
              borderRadius:   RADIUS.pill,
              background:     submitting ? 'rgba(109,40,217,0.35)' : COLOR.primary,
              color:          '#fff',
              fontFamily:     'Ploni, sans-serif',
              fontSize:       FS.body,
              fontWeight:     700,
              border:         'none',
              cursor:         submitting ? 'not-allowed' : 'pointer',
              boxShadow:      submitting ? 'none' : '0 4px 18px rgba(109,40,217,0.4)',
              transition:     `all 0.2s ${EASING.out}`,
              letterSpacing:  '0.01em',
            }}
          >
            {submitting
              ? (isRtl ? 'שולח...' : 'Sending...')
              : isRtl
                ? `אשר שיחה - ${formatDateHe(selDate, true)} ב-${selSlot}`
                : `Confirm Call - ${formatDateHe(selDate, false)} at ${selSlot}`
            }
          </button>
        )}
        <button
          onClick={onSkip}
          style={{
            padding:      '12px',
            borderRadius: RADIUS.pill,
            background:   'transparent',
            border:       '1px solid rgba(255,255,255,0.15)',
            color:        'rgba(255,255,255,0.4)',
            fontFamily:   'Ploni, sans-serif',
            fontSize:     '13px',
            cursor:       'pointer',
          }}
        >
          {isRtl ? 'אולי מאוחר יותר' : 'Maybe later'}
        </button>
      </div>
    </div>
  );
}
