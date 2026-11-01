import { describe, it, expect } from 'vitest';
import { destFlag, withFlag } from '../api/_lib/dest-flag.js';

describe('the destination flag in emails', () => {
  it('reads the Hebrew page name, an English key and an event key', () => {
    expect(destFlag('טיפוס לקילימנג׳רו')).toBe('🇹🇿');
    expect(destFlag('Elbrus')).toBe('🇷🇺');
    expect(destFlag('Kilimanjaro_with_Safari')).toBe('🇹🇿');
    expect(destFlag('EBC + Gokyo')).toBe('🇳🇵');
    expect(destFlag('Peaks_of_Balkan')).toBe('🇦🇱');
  });
  it('a religious Kilimanjaro or Ethiopia carries the star, as on the lead cards', () => {
    expect(destFlag('קילימנג׳רו לשומרי מסורת')).toBe('🇹🇿✡️');
    expect(destFlag('Kilimanjaro_Kosher_with_Safari')).toBe('🇹🇿✡️');
    expect(destFlag('Ethiopia_Kosher')).toBe('🇪🇹✡️');
    expect(destFlag('Annapurna_Circut_Kosher')).toBe('🇳🇵');
  });
  it('Kilimanjaro with a safari is Tanzania, Sinai is Egypt', () => {
    expect(destFlag('קילימנג׳רו וספארי')).toBe('🇹🇿');
    expect(destFlag('טרק להר הגבוה בסיני')).toBe('🇪🇬');
  });
  it('no flag for an unknown or empty destination', () => {
    expect(destFlag('שיחה כללית')).toBe('');
    expect(destFlag('')).toBe('');
    expect(destFlag(null)).toBe('');
  });
  it('puts it at the end of the line', () => {
    expect(withFlag('ליד חדש: טיפוס לאלברוס')).toBe('ליד חדש: טיפוס לאלברוס 🇷🇺');
    expect(withFlag('ההרשמה הושלמה', 'Aconcagua')).toBe('ההרשמה הושלמה 🇦🇷');
    expect(withFlag('ליד חדש: לא צוין')).toBe('ליד חדש: לא צוין');
  });
});
