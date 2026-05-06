/**
 * GHLCalendarWidget.jsx
 * Embeds a GoHighLevel calendar booking widget inside a branded wrapper.
 * Drop-in replacement for BookingWidget.jsx.
 */

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RADIUS, FS, COLOR } from '../../website/theme.js';

export default function GHLCalendarWidget({ calendarId, name, phone, email, expedition, expeditionSlug, expeditionValue, onSkip }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';
  const scriptRef = useRef(false);
  const bookedRef = useRef(false);

  /* Inject GHL embed script once */
  useEffect(() => {
    if (scriptRef.current) return;
    scriptRef.current = true;
    const s = document.createElement('script');
    s.src  = 'https://link.msgsndr.com/js/form_embed.js';
    s.type = 'text/javascript';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  /* Listen for GHL booking confirmation postMessage */
  useEffect(() => {
    function onMessage(event) {
      // GHL sends various message types; booking confirmed looks like:
      // { type: 'appointment-booked' } or { event: 'appointmentBooked' }
      const data = event.data;
      if (!data || bookedRef.current) return;
      const isBooked =
        data?.type === 'appointment-booked' ||
        data?.event === 'appointmentBooked' ||
        data?.message === 'appointment-booked' ||
        (typeof data === 'string' && data.includes('appointment-booked'));
      if (!isBooked) return;
      bookedRef.current = true;

      // Push to dataLayer — GTM handles GA4 + Google Ads + Facebook from here
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event:            'booking_submit',
        expedition:       expedition       || '',
        expedition_slug:  expeditionSlug   || '',
        value:            expeditionValue  || 0,
        booking_id:       `BK-${Date.now()}`,
        currency:         'ILS',
        method:           'ghl_calendar',
      });
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  if (!calendarId) return null;

  /* Build prefill URL — GHL reads first_name/last_name/email/phone from query params */
  const params = new URLSearchParams();
  if (name) {
    const parts = name.trim().split(/\s+/);
    params.set('first_name', parts[0] || '');
    params.set('last_name',  parts.slice(1).join(' ') || '');
  }
  if (email) params.set('email', email);
  if (phone) params.set('phone', phone);
  const calendarSrc = `https://api.leadconnectorhq.com/widget/booking/${calendarId}?${params.toString()}`;

  const iframeId = `${calendarId}_ghl`;

  return (
    <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>

      {/* Header */}
      <h3 style={{
        fontFamily:  'Ploni, sans-serif',
        fontSize:    FS.h3,
        fontWeight:  700,
        color:       '#fff',
        margin:      '0 0 6px',
        textAlign:   'center',
      }}>
        {isRtl ? 'תאמו שיחה עם הצוות שלנו' : 'Schedule a Call with Our Team'}
      </h3>
      <p style={{
        fontFamily: 'Ploni, sans-serif',
        fontSize:   '14px',
        color:      'rgba(255,255,255,0.45)',
        margin:     '0 0 18px',
        textAlign:  'center',
      }}>
        {isRtl ? 'בחרו תאריך ושעה שמתאימים לכם' : 'Choose a date and time that works for you'}
      </p>

      {/* Calendar iframe wrapper */}
      <div style={{
        background:   'rgba(255,255,255,0.03)',
        borderRadius: RADIUS.xl,
        border:       '1px solid rgba(255,255,255,0.1)',
        overflow:     'hidden',
        marginBottom: '14px',
      }}>
        <iframe
          src={calendarSrc}
          id={iframeId}
          style={{
            width:   '100%',
            border:  'none',
            display: 'block',
            minHeight: '600px',
          }}
          scrolling="no"
          title={isRtl ? 'תיאום שיחה' : 'Schedule a call'}
        />
      </div>

      {/* Skip button */}
      <button
        onClick={onSkip}
        style={{
          width:        '100%',
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
  );
}
