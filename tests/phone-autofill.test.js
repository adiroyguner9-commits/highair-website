/* Autofill on the lead forms (owner, 8 Nov 2026: "שהטופס יתמלא אוטומטית").
   The phone hands over the number from the contact card, usually with its
   country code; the field reads the country off it and keeps the rest. */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/i18n.js', () => ({ default: { language: 'he' } }));
vi.mock('../src/website/lang.js', () => ({ tx: s => s, currentLang: () => 'he' }));
const { splitInternational, validatePhone } = await import('../src/components/web_v2/PhoneField.jsx');

describe('a number the phone fills in', () => {
  it.each([
    ['+972 50-123-4567', '+972', '501234567'],
    ['+972501234567',    '+972', '501234567'],
    ['00972501234567',   '+972', '501234567'],
    ['972501234567',     '+972', '501234567'],
  ])('%s becomes Israel + the rest', (raw, dial, local) => {
    expect(splitInternational(raw, '+972')).toEqual({ dial, local });
    expect(validatePhone(dial, local)).toBe(true);
  });
  it('a foreign card switches the country', () => {
    expect(splitInternational('+49 151 23456789', '+972')).toEqual({ dial: '+49', local: '15123456789' });
    expect(splitInternational('+44 7911 123456', '+972')).toEqual({ dial: '+44', local: '7911123456' });
  });
  it('the longest code wins (+972 is not +97, +351 is not +35)', () => {
    expect(splitInternational('+351 912 345 678', '+972').dial).toBe('+351');
  });
  it('+1 keeps the open country (the US and Canada share it)', () => {
    expect(splitInternational('+1 416 555 0123', '+1')).toEqual({ dial: '+1', local: '4165550123' });
  });
});

describe('typing is left alone', () => {
  it.each(['050-1234567', '0501234567', '03-1234567', '050', '', '+'])('%s is a local number', raw => {
    expect(splitInternational(raw, '+972')).toBe(null);
  });
});
