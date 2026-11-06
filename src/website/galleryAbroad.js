/* galleryAbroad.js — gallery photos left out on the foreign sites.
   The owner's brief for en/de/es: no Israeli markers. These photos show an
   Israeli flag or a Hebrew banner (checked by eye, 6 Nov 2026). The Hebrew
   site keeps every photo. */
export const HIDDEN_ABROAD = new Set([
  '/images/gallery/ama-dablam/5.webp',
  '/images/gallery/ethiopia/1.webp',
  '/images/gallery/ethiopia/12.webp',
  '/images/gallery/ethiopia/21.webp',
  '/images/gallery/kilimanjaro/3.webp',
  '/images/gallery/kilimanjaro/11.webp',
  '/images/gallery/kilimanjaro-kosher/10.webp',
  '/images/gallery/lobuche-peak/1.webp',
  '/images/gallery/manaslu/1.webp',
  '/images/gallery/mera-peak/18.webp',
  '/images/gallery/home/1.webp',
  '/images/gallery/home/6.webp',
  '/images/gallery/home/11.webp',
]);

/* The gallery list for a site: everything on the Hebrew site, the list
   without the photos above on the foreign ones. */
export const galleryFor = (list = [], lang = 'he') =>
  lang === 'he' ? list : list.filter(x => !HIDDEN_ABROAD.has(x.src));
