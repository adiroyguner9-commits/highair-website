/* The website's error reports carry no customer data (src/utils/sentryScrub.js),
   by the same rule as the app's. */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { scrub, scrubEvent, scrubBreadcrumb, scrubTransaction } from '../src/utils/sentryScrub.js';

describe('what a report may carry', () => {
  it('emails, booking references and phone-like numbers are masked', () => {
    expect(scrub('lead dana.cohen@gmail.com 052-555-1234 KL1234 failed with 422'))
      .toBe('lead [email] [number] [booking] failed with 422');
    expect(scrub('+972501234567 / 123456')).toBe('[number] / [number]');
  });
  it('short numbers stay readable', () => {
    expect(scrub('status 503 after 14 days in 2027')).toBe('status 503 after 14 days in 2027');
  });
  it('an error event loses its query strings, cookies and user, and its values are masked', () => {
    const e = scrubEvent({
      request: { url: 'https://www.highair-expeditions.com/register?ref=KL1234&phone=0525551234#x', query_string: 'ref=KL1234', cookies: 'a=b' },
      message: 'send to noa@x.com', user: { email: 'noa@x.com' },
      exception: { values: [{ value: 'Invalid phone 0525551234' }] },
      transaction: '/expedition/kilimanjaro?utm_source=fb',
    });
    expect(e.request).toEqual({ url: 'https://www.highair-expeditions.com/register' });
    expect(e.message).toBe('send to [email]');
    expect(e.exception.values[0].value).toBe('Invalid phone [number]');
    expect(e.transaction).toBe('/expedition/kilimanjaro');
    expect(e.user).toBeUndefined();
  });
  it('breadcrumbs: console dropped, click text dropped, URLs without queries', () => {
    expect(scrubBreadcrumb({ category: 'console', message: 'lead {name: Dana}' })).toBe(null);
    expect(scrubBreadcrumb({ category: 'ui.click', message: 'button "Dana Cohen"' }).message).toBeUndefined();
    expect(scrubBreadcrumb({ category: 'fetch', data: { url: '/api/submit-lead?phone=0525551234', method: 'POST' } }).data)
      .toEqual({ url: '/api/submit-lead', method: 'POST' });
  });
  it('performance transactions: page and request URLs without queries', () => {
    const t = scrubTransaction({
      request: { url: 'https://www.highair-expeditions.com/?gclid=abc' },
      spans: [{ description: 'GET https://www.highair-expeditions.com/api/slots?phone=0525551234', data: { url: '/api/slots?phone=0525551234', 'http.query': '?phone=0525551234' } }],
    });
    expect(t.request.url).toBe('https://www.highair-expeditions.com/');
    expect(t.spans[0].description).toBe('GET https://www.highair-expeditions.com/api/slots');
    expect(t.spans[0].data.url).toBe('/api/slots');
    expect(t.spans[0].data['http.query']).toBeUndefined();
  });
});

describe('the same rule as the app', () => {
  const APP = '../HighAir-webapp/src/utils/monitoring.js';
  const rules = src => ['EMAIL', 'NUMBER', 'BOOKING'].map(n => src.match(new RegExp(`const ${n}\\s*=\\s*(/.*/g);`))?.[1]);
  it('EMAIL, NUMBER and BOOKING are identical in both repos (when the app repo is next to this one)', () => {
    if (!existsSync(APP)) return;
    const site = rules(readFileSync('src/utils/sentryScrub.js', 'utf8'));
    expect(site.every(Boolean)).toBe(true);
    expect(site).toEqual(rules(readFileSync(APP, 'utf8')));
  });
});
