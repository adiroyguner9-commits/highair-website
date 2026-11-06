/* Accessibility helpers for the foreign sites (6 Nov 2026, axe on en/de/es).

   scrollerProps(label): a horizontal carousel whose cards hold no link or
   button cannot be reached from the keyboard (axe: scrollable-region-focusable).
   On en. / de. / es. it becomes a focusable, named region, so arrow keys
   scroll it; nothing changes on the Hebrew site. */
import { currentLang } from './lang.js';
import { tx } from './lang.js';

export function scrollerProps(label) {
  if (currentLang() === 'he') return {};
  return { tabIndex: 0, role: 'region', 'aria-label': tx(label) };
}
