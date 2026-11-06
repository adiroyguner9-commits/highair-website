import { describe, it, expect } from 'vitest';
import { profileFromItinerary } from '../src/website/altitudeProfile.js';
const kili = ['Welcome to Tanzania!','Machame Gate (1800m) - Machame Camp (2835m)','Machame Camp (2835m) - Shira Camp (3750m)','Shira Camp - Lava Tower (4600m) - Barranco Camp (3900m)','Barranco Camp - Barranco Wall (4200m) - Karanga Camp (3995m)','Karanga Camp (3995m) - Barafu Camp (4673m)','Barafu Camp - Uhuru Peak (5895m) - Mweka Camp (3100m)','Mweka Camp (3100m) - Mweka Gate (1640m)','Flight Back Home'].map(title => ({ title }));
describe('altitude profile', () => {
  const p = profileFromItinerary(kili);
  it('skips days without altitudes', () => expect(p.map(d => d.day)).toEqual([2,3,4,5,6,7,8]));
  it('sleep is the last altitude, high the top of the day', () => {
    expect(p.find(d => d.day === 4)).toEqual({ day: 4, sleep: 3900, high: 4600 });
    expect(p.find(d => d.day === 7)).toEqual({ day: 7, sleep: 3100, high: 5895 });
  });
  it('a descent day has no high point above its sleep', () => expect(p.find(d => d.day === 8)).toEqual({ day: 8, sleep: 1640, high: 1640 }));
  it('reads German spacing too', () => expect(profileFromItinerary([{ title: 'A (1800 m) - B (2835 m)' }])[0].sleep).toBe(2835));
});
