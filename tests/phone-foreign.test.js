import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/i18n.js', () => ({ default: { language: 'en' } }));
vi.mock('../src/website/lang.js', () => ({ tx: s => s, currentLang: () => 'en' }));
const { validatePhone } = await import('../src/components/web_v2/PhoneField.jsx');

describe('phone numbers foreign climbers type', () => {
  it.each([
    ['+1', '202-555-0123'], ['+44', '07911 123456'], ['+49', '0151 23456789'],
    ['+49', '0170 1234567'], ['+34', '612 345 678'], ['+52', '55 1234 5678'],
    ['+54', '011 1234-5678'], ['+61', '0412 345 678'], ['+41', '079 123 45 67'],
    ['+43', '0664 1234567'], ['+56', '9 1234 5678'],
  ])('%s %s is accepted', (dial, n) => expect(validatePhone(dial, n)).toBe(true));
  it('a number missing digits is still refused', () => expect(validatePhone('+49', '0151 23')).toBe(false));
});
