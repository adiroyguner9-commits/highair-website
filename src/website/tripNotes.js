/* The "important to know" list on a trip page: which line opens it. Pure, so
   the rule tests can run it against every trip record. */

/* "The trek runs in groups...", not "The trekking runs in groups...". */
export const GROUP_NOUN = { Trekking: 'trek', Climbing: 'climb' };

/* Is the first "important to know" note the group-size line itself? Always in
   the Hebrew records and in the built-in defaults; in a trip's own English list
   only when it says so (Olympus, Sinai). Read from the English source, which is
   what the German and Spanish sites translate, so one answer serves all three. */
export function firstNoteIsGroupSize(exp, isRtl) {
  if (isRtl) return true;
  const own = exp?.importantToNoteEn;
  if (!own?.length) return true;
  return /up to \d+|groups? of|1:1/i.test(String(own[0]));
}
