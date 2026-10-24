/* authors.js: the people who sign HighAir's guides.

   A post names its author by id (POSTS[].authorId). BlogPost.jsx shows the
   byline, AuthorPage.jsx is the author's page (/author/<id>), and the static
   shells emit the author as a schema.org Person: an expert with real summits
   behind a guide is a ranking signal for Google and a citation signal for AI
   engines (owner, 24 Oct 2026: guides are signed by Chen Shaked).

   Everything here is already on the site: the bio is Chen's team card on the
   About page (aboutData.js), the summits are the ones his story there names. */
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
    summitsHe: ['מנסלו (8,163 מ׳), ספטמבר 2025', 'אמא דאבלם', 'איילנד פיק', 'לובוצ׳ה פיק', 'קילימנג׳רו', 'קזבק', 'גראן פרדיסו'],
    summitsEn: ['Manaslu (8,163 m), September 2025', 'Ama Dablam', 'Island Peak', 'Lobuche Peak', 'Kilimanjaro', 'Kazbek', 'Gran Paradiso'],
  },
};

export const authorOf = post => AUTHORS[post?.authorId] || null;
