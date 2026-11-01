/* The weekly Search Console report (2 Nov 2026): the only source the agents may
   quote search rankings from. These pin the week it covers, the signed login and
   the joins that put last week next to this week. */
import crypto from 'node:crypto';
import { describe, it, expect } from 'vitest';
import {
  reportRanges, buildAssertion, parseAccount, totals, withPrevious, pctChange, fmtPos, pagePath, SCOPE, TOKEN_URL,
} from '../api/_lib/gsc.js';

describe('reportRanges', () => {
  it('ends three days before today and compares with the 7 days before', () => {
    expect(reportRanges('2026-11-08')).toEqual({
      current: { start: '2026-10-30', end: '2026-11-05' },
      previous: { start: '2026-10-23', end: '2026-10-29' },
    });
  });
});

describe('buildAssertion', () => {
  it('signs a JWT Google can verify with the account key', () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    const pem = privateKey.export({ type: 'pkcs8', format: 'pem' });
    const jwt = buildAssertion({ client_email: 'bot@x.iam.gserviceaccount.com', private_key: pem }, 1000);
    const [h, c, s] = jwt.split('.');
    const claim = JSON.parse(Buffer.from(c, 'base64url').toString());
    expect(claim).toEqual({ iss: 'bot@x.iam.gserviceaccount.com', scope: SCOPE, aud: TOKEN_URL, iat: 1000, exp: 4600 });
    const ok = crypto.createVerify('RSA-SHA256').update(`${h}.${c}`).verify(publicKey, Buffer.from(s, 'base64url'));
    expect(ok).toBe(true);
  });
});

describe('parseAccount', () => {
  it('reads the pasted key file and restores escaped newlines', () => {
    const a = parseAccount(JSON.stringify({ client_email: 'a@b', private_key: 'line1\\nline2' }));
    expect(a.private_key).toBe('line1\nline2');
  });
  it('returns null for nothing, junk, or a file that is not a service account', () => {
    expect(parseAccount('')).toBe(null);
    expect(parseAccount('not json')).toBe(null);
    expect(parseAccount('{"type":"other"}')).toBe(null);
  });
});

describe('joins and formatting', () => {
  it('totals an empty week as zero clicks', () => {
    expect(totals([])).toEqual({ clicks: 0, impressions: 0, ctr: 0, position: null });
  });
  it('puts last week next to this week by key', () => {
    const rows = withPrevious(
      [{ keys: ['קילימנג׳רו'], clicks: 12, impressions: 300, position: 7.2 }, { keys: ['אלברוס'], clicks: 1, impressions: 20, position: 15 }],
      [{ keys: ['קילימנג׳רו'], clicks: 8, impressions: 250, position: 9.1 }],
    );
    expect(rows[0]).toMatchObject({ key: 'קילימנג׳רו', clicks: 12, prevClicks: 8, prevPosition: 9.1 });
    expect(rows[1].prevClicks).toBe(null);
  });
  it('shows change only when there is a base', () => {
    expect(pctChange(12, 8)).toBe('+50%');
    expect(pctChange(6, 8)).toBe('-25%');
    expect(pctChange(5, 0)).toBe(null);
    expect(fmtPos(null)).toBe('-');
    expect(fmtPos(7.25)).toBe('7.3');
  });
  it('shows a Hebrew page path readably', () => {
    expect(pagePath('https://www.highair-expeditions.com/blog/kilimanjaro-climb-cost-guide')).toBe('/blog/kilimanjaro-climb-cost-guide');
    expect(pagePath('https://www.highair-expeditions.com/')).toBe('/');
  });
});
