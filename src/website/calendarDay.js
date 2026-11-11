/* calendarDay.js: a departure is a day on the calendar, not a moment (12 Nov 2026).

   Airtable hands a departure over as '2027-01-21'. `new Date('2027-01-21')`
   reads that as midnight UTC, and getDate() / getMonth() / getFullYear() then
   answer on the visitor's own clock. West of Greenwich that is still the
   evening of the 20th, so in Mexico City, New York or Buenos Aires every
   departure and return was shown a day early, and a trip leaving on the 1st
   sat under the month before (audit W19; it is the Spanish site that has those
   visitors).

   calendarDay() reads the year, month and day from the string itself and
   returns that same day on the visitor's calendar, at noon so a clock change
   at midnight cannot move it. The local getters and toLocaleDateString() then
   give the day that was written, in every time zone. Plain module with no
   imports: tests/audit-w19-calendar-day.test.js runs it under five clocks. */
export function calendarDay(str) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(str || ''));
  if (!m) return new Date(NaN);
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12);
}
