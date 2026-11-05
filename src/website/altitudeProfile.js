/* Day-by-day altitudes from itinerary titles, for AltitudeProfile.jsx. Pure. */
/** [{day, sleep, high, label}] from itinerary titles; days without numbers are skipped. */
export function profileFromItinerary(itinerary = []) {
  const out = [];
  itinerary.forEach((d, i) => {
    const title = String(d?.title || '');
    const nums = [...title.matchAll(/(\d{3,4})\s?(?:m|מ)/g)].map(m => Number(m[1])).filter(n => n >= 300 && n <= 8900);
    if (!nums.length) return;
    /* "A (3100m) - B (1640m)" starts where last night ended: the start is not a high point. */
    const prev = out[out.length - 1];
    const climbed = (nums.length > 1 && prev && nums[0] === prev.sleep) ? nums.slice(1) : nums;
    out.push({ day: i + 1, sleep: nums[nums.length - 1], high: Math.max(...climbed) });
  });
  return out;
}
