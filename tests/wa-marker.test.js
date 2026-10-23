/* The invisible marker in the prefilled WhatsApp text (src/utils/waIntent.js).
   The customer must see exactly the text they saw before; the webapp must be
   able to read the token back (its decoder: api/_lib/wa-token.js there). */
import { describe, it, expect } from 'vitest';
import { withWaMarker, waMarker, newWaToken } from '../src/utils/waIntent.js';

const ZW = /[​‌‍]/g;
/* The webapp's decoder, mirrored here so a change on either side breaks a test. */
const read = text => {
  const m = String(text || '').match(/‍([​‌]{32})‍/);
  return m ? parseInt([...m[1]].map(c => (c === '‌' ? '1' : '0')).join(''), 2).toString(16).padStart(8, '0') : '';
};

describe('invisible WhatsApp marker', () => {
  const he = 'היי! אני מעוניין/ת לשמוע עוד על טיפוס לקילימנג׳רו 🏔️';
  it('looks exactly like the original text', () => {
    const out = withWaMarker(he, '0a1b2c3d');
    expect(out).not.toBe(he);
    expect(out.replace(ZW, '')).toBe(he);
  });
  it('sits after the first word, not at either end', () => {
    const out = withWaMarker(he, '0a1b2c3d');
    expect(out.startsWith('היי!‍')).toBe(true);
    expect(out.endsWith('🏔️')).toBe(true);
  });
  it('round-trips the token', () => {
    for (const t of ['00000000', 'ffffffff', '0a1b2c3d', newWaToken()]) expect(read(withWaMarker(he, t))).toBe(t);
  });
  it('turns an empty text into the marker alone', () => {
    const out = withWaMarker('', '12345678');
    expect(out.replace(ZW, '')).toBe('');
    expect(read(out)).toBe('12345678');
  });
  it('replaces an earlier marker instead of stacking two', () => {
    const twice = withWaMarker(withWaMarker(he, '11111111'), '22222222');
    expect(read(twice)).toBe('22222222');
    expect((twice.match(/‍[​‌]{32}‍/g) || []).length).toBe(1);
  });
  it('leaves the text alone without a valid token', () => {
    expect(withWaMarker(he, '')).toBe(he);
    expect(withWaMarker(he, 'nothex!!')).toBe(he);
  });
  it('is 34 characters', () => {
    expect(waMarker('0a1b2c3d').length).toBe(34);
  });
});
