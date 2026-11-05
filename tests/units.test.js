import { describe, it, expect } from 'vitest';
import { toFeet } from '../src/website/units.js';
describe('feet on the English site', () => {
  it('converts summits correctly', () => {
    expect(toFeet(5895)).toBe(19341);
    expect(toFeet(4673)).toBe(15331);
    expect(toFeet(8848)).toBe(29029);
  });
});
import { feetText } from '../src/website/units.js';
describe('feetText', () => {
  it('only on English', () => {
    expect(feetText(5895, 'en')).toBe('19,341 ft');
    expect(feetText(5895, 'de')).toBe('');
    expect(feetText(5895, 'he')).toBe('');
    expect(feetText(0, 'en')).toBe('');
  });
});
