/**
 * analytics.js — GA4 event tracking
 *
 * Wraps gtag() calls safely; no-ops if GA isn't loaded yet (e.g. before
 * cookie consent is granted). This keeps callers simple — they just
 * fire trackEvent() at every interesting moment, and the wrapper handles
 * the "consent not granted" case automatically.
 */

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

/* ── Predefined events ── */
export const Analytics = {
  // Navigation / clicks
  clickWhatsApp:    (source) => trackEvent('click_whatsapp',    { source }),
  clickExpedition:  (name)   => trackEvent('click_expedition',  { expedition_name: name }),
  clickBlogPost:    (title)  => trackEvent('click_blog_post',   { post_title: title }),
  clickCTA:         (label, location) => trackEvent('cta_click', { cta_label: label, cta_location: location }),

  // Sharing
  shareWhatsApp:    (title)  => trackEvent('share',  { method: 'whatsapp', content_type: 'article', item_id: title }),
  shareFacebook:    (title)  => trackEvent('share',  { method: 'facebook', content_type: 'article', item_id: title }),
  shareCopyLink:    (title)  => trackEvent('share',  { method: 'copy_link', content_type: 'article', item_id: title }),

  // Lead capture funnel — wired into CTASection.jsx
  leadFormStart:    (source) => trackEvent('lead_form_start',  { source }),
  leadSubmit:       (params = {}) => trackEvent('generate_lead', { currency: 'ILS', ...params }),
  leadSubmitError:  (reason) => trackEvent('lead_submit_error', { error: reason }),

  // Booking funnel — wired into BookingWidget.jsx
  bookingOpen:      (source) => trackEvent('booking_open',     { source }),
  bookingDateSelect:(date)   => trackEvent('booking_date_select', { date }),
  bookingSlotSelect:(time)   => trackEvent('booking_slot_select', { time }),
  bookingSubmit:    (params = {}) => trackEvent('booking_submit',  params),
  bookingSlotTaken: ()       => trackEvent('booking_slot_taken'),
  bookingError:     (reason) => trackEvent('booking_error',    { error: reason }),

  // Engagement
  videoPlay:        (label)  => trackEvent('video_play',       { video_label: label }),
  scrollDepth:      (pct)    => trackEvent('scroll',           { percent_scrolled: pct }),

  // Shop
  clickBuyProduct:  (name, price) => trackEvent('begin_checkout', { currency: 'ILS', value: price, items: [{ item_name: name }] }),

  // Hero CTAs (kept for backward compat)
  clickHeroCTA:        ()    => trackEvent('cta_click', { cta_location: 'hero' }),
  clickExpeditionsCTA: ()    => trackEvent('cta_click', { cta_location: 'expeditions' }),
};

/* ── Scroll-depth tracker — fires once per threshold crossed ── */
let _scrollDepthInstalled = false;
export function installScrollDepthTracker() {
  if (typeof window === 'undefined') return;
  if (_scrollDepthInstalled) return;
  _scrollDepthInstalled = true;

  const fired = new Set();
  const THRESHOLDS = [25, 50, 75, 100];

  function onScroll() {
    const doc = document.documentElement;
    const scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight * 100;
    for (const t of THRESHOLDS) {
      if (scrolled >= t && !fired.has(t)) {
        fired.add(t);
        Analytics.scrollDepth(t);
      }
    }
    if (fired.size === THRESHOLDS.length) {
      window.removeEventListener('scroll', onScroll);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}
