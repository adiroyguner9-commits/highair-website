/* PostHog on the website (owner, 16 Nov 2026): after cookie consent only, on the live hosts only,
   never for bots, never in the first page load, every form field masked. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { mayTrack, LIVE_HOST, POSTHOG_CONFIG } from '../src/utils/posthog.js';

const win = (hostname, ua = 'Mozilla/5.0 (iPhone) Safari', webdriver = false) => ({ location: { hostname }, navigator: { userAgent: ua, webdriver } });

describe('who is measured', () => {
  it('the live hosts only', () => {
    for (const h of ['highair-expeditions.com', 'www.highair-expeditions.com', 'en.highair-expeditions.com', 'de.highair-expeditions.com', 'es.highair-expeditions.com'])
      expect(mayTrack(win(h)), h).toBe(true);
    for (const h of ['app.highair-expeditions.com', 'localhost', 'highair-website-abc.vercel.app', 'highair-expeditions.com.evil.io'])
      expect(mayTrack(win(h)), h).toBe(false);
    expect(LIVE_HOST.test('admin.highair-expeditions.com')).toBe(false);
  });
  it('never a bot or an automated browser', () => {
    expect(mayTrack(win('www.highair-expeditions.com', 'Googlebot/2.1'))).toBe(false);
    expect(mayTrack(win('www.highair-expeditions.com', 'Chrome-Lighthouse'))).toBe(false);
    expect(mayTrack(win('www.highair-expeditions.com', 'HeadlessChrome/120'))).toBe(false);
    expect(mayTrack(win('www.highair-expeditions.com', 'Mozilla/5.0', true))).toBe(false);
  });
  it('form fields are masked in recordings, EU servers, anonymous visitors', () => {
    expect(POSTHOG_CONFIG.session_recording.maskAllInputs).toBe(true);
    expect(POSTHOG_CONFIG.api_host).toBe('https://eu.i.posthog.com');
    expect(POSTHOG_CONFIG.person_profiles).toBe('identified_only');
  });
});

describe('wired', () => {
  const src = f => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
  it('only after consent, and loaded as its own chunk when idle', () => {
    const ph = src('utils/posthog.js');
    expect(ph).toMatch(/if \(started \|\| !mayTrack\(\) \|\| !consented\(\)\) return;/);
    expect(ph).toMatch(/import\('posthog-js'\)/);
    expect(ph).toMatch(/requestIdleCallback/);
    expect(src('main.jsx')).not.toMatch(/from 'posthog-js'/);
  });
  it('accept starts it, decline stops it', () => {
    const banner = src('components/web_v2/CookieBanner.jsx');
    expect(banner.indexOf('startPostHog()')).toBeGreaterThan(banner.indexOf('function accept()'));
    expect(banner.indexOf('stopPostHog()')).toBeGreaterThan(banner.indexOf('function decline()'));
  });
  it('the CSP lets it through, and the privacy policy names it in both languages', () => {
    const v = readFileSync(new URL('../vercel.json', import.meta.url), 'utf8');
    expect(v).toMatch(/script-src[^;]*https:\/\/eu-assets\.i\.posthog\.com/);
    expect(v).toMatch(/connect-src[^;]*https:\/\/eu\.i\.posthog\.com/);
    const pp = src('components/web_v2/PrivacyPolicy.jsx');
    expect(pp).toMatch(/PostHog, שמאחסן את המידע באירופה/);
    expect(pp).toMatch(/we also use PostHog, which stores its data in Europe/);
  });
});
