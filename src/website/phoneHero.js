import { useState, useEffect } from 'react';
import PHONE from './phoneHeroes.json';

/* phoneHero.js: the phone copy of a page's hero image (written by
   scripts/gen-phone-heroes.mjs, listed in phoneHeroes.json by kind: home,
   trip, list, blog, backdrop). A phone shows only a slice of each hero; the
   copy is that slice, a third to a half of the bytes, so the first screen
   arrives sooner (28 Oct 2026).

   usePhoneHero(src, kind) -> the copy on a phone (PHONE_MEDIA), else src.
                              Follows the window across the breakpoint.
   The page shells preload and paint the same copy under the same media query
   (scripts/generate-html-shells.mjs), so a phone downloads the hero once. */
export const PHONE_MEDIA = '(max-width: 440px)';

const onPhone = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(PHONE_MEDIA).matches;

export const phoneCopyOf = (src, kind) => PHONE[kind]?.[src] || null;

export function usePhoneHero(src, kind) {
  const copy = phoneCopyOf(src, kind);
  const [phone, setPhone] = useState(onPhone);
  useEffect(() => {
    if (!copy) return undefined;
    const list = window.matchMedia(PHONE_MEDIA);
    const update = () => setPhone(list.matches);
    // Safari before 14 only has the older addListener API
    if (list.addEventListener) list.addEventListener('change', update); else list.addListener(update);
    update();
    return () => (list.removeEventListener ? list.removeEventListener('change', update) : list.removeListener(update));
  }, [copy]);
  return copy && phone ? copy : src;
}
