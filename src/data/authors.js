/* authors.js: the people who sign HighAir's guides.

   A post names its author by id (POSTS[].authorId). BlogPost.jsx shows the
   byline ("מאת חן שקד", plain text), and the static shells emit the author as
   a schema.org Person pointing at the About page: an expert behind a guide is a
   ranking signal for Google and a citation signal for AI engines (owner, 24 Oct
   2026: guides are signed by Chen Shaked; he does NOT want a separate author
   page, so there is none, and /author/* redirects to /about).

   The bio is Chen's team card on the About page (aboutData.js). */
import { TEAM_HE, TEAM_EN } from './aboutData.js';

const bio = (team, key) => team.find(m => m.key === key)?.bio || '';

export const AUTHORS = {
  'chen-shaked': {
    id:      'chen-shaked',
    nameHe:  'חן שקד',
    nameEn:  'Chen Shaked',
    roleHe:  'מייסד HighAir Expeditions ומטפס הרים',
    roleEn:  'Founder of HighAir Expeditions, mountaineer',
    photo:   '/images/team/chen-shaked.jpg',
    bioHe:   bio(TEAM_HE, 'chen'),
    bioEn:   bio(TEAM_EN, 'chen'),
  },
};

/* Owner, 6 Nov 2026: take Chen Shaked's name off the articles. Bylines and
   the schema.org Person are off on every site (the post is then the
   company's, as news already is). The data stays: true brings them back. */
export const SHOW_AUTHORS = false;

export const authorOf = post => (SHOW_AUTHORS && AUTHORS[post?.authorId]) || null;
