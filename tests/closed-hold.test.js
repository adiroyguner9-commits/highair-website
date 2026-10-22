/* Lead messages are held on festivals the way they are held over the weekend
   (owner, 22 Oct 2026: "כולל בחגים"). Nudge 2 and the 4-day follow-up went out
   on Rosh Hashana and Yom Kippur 2026. */
import { describe, it, expect } from 'vitest';
import { israelClosedHold } from '../api/_lib/iltime.js';

const at = (ymd, hhmm) => { const [h, m] = hhmm.split(':').map(Number); return { ymd, minutes: h * 60 + m }; };

describe('festival hold', () => {
  it('all of a festival day', () => {
    expect(israelClosedHold(at('2026-09-21', '12:00'))).toBe(true);   // Yom Kippur, a Monday
    expect(israelClosedHold(at('2026-09-12', '10:00'))).toBe(true);   // Rosh Hashana
    expect(israelClosedHold(at('2026-10-03', '10:00'))).toBe(true);   // Shemini Atzeret
  });
  it('the eve from 15:00, not before', () => {
    expect(israelClosedHold(at('2026-09-20', '14:59'))).toBe(false);  // Erev Yom Kippur, a Sunday
    expect(israelClosedHold(at('2026-09-20', '15:00'))).toBe(true);
    expect(israelClosedHold(at('2026-10-02', '16:00'))).toBe(true);   // erev Shemini Atzeret
  });
  it('the morning after until 09:00', () => {
    expect(israelClosedHold(at('2026-09-22', '08:59'))).toBe(true);
    expect(israelClosedHold(at('2026-09-22', '09:00'))).toBe(false);
  });
  it('an ordinary weekday is open; the weekend hold is unchanged', () => {
    expect(israelClosedHold(at('2026-10-22', '11:00'))).toBe(false);  // Thursday
    expect(israelClosedHold(at('2026-10-23', '15:30'))).toBe(true);   // Friday afternoon
    expect(israelClosedHold(at('2026-10-24', '11:00'))).toBe(true);   // Saturday
    expect(israelClosedHold(at('2026-10-25', '08:00'))).toBe(true);   // Sunday morning
    expect(israelClosedHold(at('2026-10-25', '09:30'))).toBe(false);
  });
});
