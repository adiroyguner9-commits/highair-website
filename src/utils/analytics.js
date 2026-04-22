/**
 * analytics.js - Event tracking utility
 * Wraps gtag() calls safely — no-ops if GA not loaded
 */

export function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

// Predefined events
export const Analytics = {
  // Navigation
  clickWhatsApp:    (source) => trackEvent('click_whatsapp',    { source }),
  clickExpedition:  (name)   => trackEvent('click_expedition',  { expedition_name: name }),
  clickBlogPost:    (title)  => trackEvent('click_blog_post',   { post_title: title }),

  // Sharing
  shareWhatsApp:    (title)  => trackEvent('share',  { method: 'whatsapp', content_type: 'article', item_id: title }),
  shareFacebook:    (title)  => trackEvent('share',  { method: 'facebook', content_type: 'article', item_id: title }),
  shareCopyLink:    (title)  => trackEvent('share',  { method: 'copy_link', content_type: 'article', item_id: title }),

  // Shop
  clickBuyProduct:  (name, price) => trackEvent('begin_checkout', { currency: 'ILS', value: price, items: [{ item_name: name }] }),

  // CTA
  clickHeroCTA:     ()       => trackEvent('click_hero_cta'),
  clickExpeditionsCTA: ()    => trackEvent('click_expeditions_cta'),
};
