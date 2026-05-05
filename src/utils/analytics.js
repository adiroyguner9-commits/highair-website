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
  // Push to dataLayer so GTM triggers can also fire
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
  // Also send directly to GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
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

/* ── useScrollDepth hook — resets per page, includes page context ──────────
   Usage: useScrollDepth({ page: 'expedition', label: exp.slug })
   Fires dataLayer + gtag events at 25 / 50 / 75 / 90 % scroll depth.
   Safe to call in any React component; cleans up on unmount.
   ─────────────────────────────────────────────────────────────────────── */
import { useEffect } from 'react';

export function useScrollDepth({ page = '', label = '' } = {}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fired  = new Set();
    const THRESHOLDS = [25, 50, 75, 90];

    function onScroll() {
      const doc     = document.documentElement;
      const scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight * 100;
      for (const t of THRESHOLDS) {
        if (scrolled >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent('scroll_depth', {
            percent_scrolled: t,
            page_section:     page,
            page_label:       label,
          });
        }
      }
      if (fired.size === THRESHOLDS.length) {
        window.removeEventListener('scroll', onScroll);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  // Re-register whenever the page/label changes (SPA navigation)
  }, [page, label]);
}
