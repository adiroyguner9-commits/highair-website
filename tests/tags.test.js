/* Marketing tags load ONCE (index.html). Measured 24 Oct 2026: the page loaded
   gtag.js itself next to GTM, both read the same dataLayer, so GA's library
   downloaded twice, the Google Ads remarketing hit fired 4 times per page view,
   a retired Ads account (AW-6948606470) loaded 149KB, and the Meta pixel sent
   every PageView twice (GTM's Meta tag + a copy here). GTM is now the only
   loader; the page only queues consent and the GA config. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const html = readFileSync(resolve(__dirname, '../index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[0]);

describe('marketing tags', () => {
  it('GTM is on the page once', () => {
    expect(html.match(/googletagmanager\.com\/gtm\.js\?id=/g)).toHaveLength(1);
  });
  it('the page does not load gtag.js itself', () => {
    expect(scripts.some(s => /googletagmanager\.com\/gtag\/js/.test(s))).toBe(false);
  });
  it('GA4 is configured, without an automatic page_view (RouteTracker sends it)', () => {
    expect(html).toContain("gtag('config', 'G-5XBRSD9V1M', { send_page_view: false })");
  });
  it('Google Ads is GTM\'s, and the retired account is gone', () => {
    expect(scripts.some(s => s.includes('AW-6948606470'))).toBe(false);
    expect(scripts.some(s => /gtag\('config', 'AW-/.test(s))).toBe(false);
  });
  it('the Meta pixel is not initialised here (GTM fires PageView and Lead)', () => {
    expect(scripts.some(s => /fbq\(|fbevents\.js/.test(s))).toBe(false);
  });
  it('GTM loads after the first screen: on the first touch, scroll or key, on load, or at 3.5s', () => {
    const gtm = scripts.find(s => s.includes('gtm.js?id='));
    expect(gtm).toContain("w[l].push({'gtm.start':");               // the page-start time, at once
    expect(gtm).toContain("EV=['pointerdown','keydown','touchstart','scroll','mousemove']");
    expect(gtm).toContain("w.addEventListener('load',");
    expect(gtm).toContain('setTimeout(go,3500)');
    expect(gtm).toContain('if(done)return;done=1;');                 // once, whichever comes first
  });
  it('the site sends events only through the queue GTM reads when it arrives', () => {
    const analytics = readFileSync(resolve(__dirname, '../src/utils/analytics.js'), 'utf8');
    expect(analytics).toContain('window.dataLayer.push({ event: eventName, ...params })');
    expect(analytics).not.toMatch(/\bfbq\(/);
  });
  it('consent defaults to denied and follows the visitor\'s banner choice', () => {
    expect(html).toContain("gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' })");
    expect(html).toContain("localStorage.getItem('highair_cookie_consent') === 'accepted'");
  });
});
