/**
 * useInView - Intersection Observer hook
 * מחזיר [ref, inView] - inView הופך true כשהאלמנט נכנס לתצוגה (פעם אחת בלבד)
 */
import { useEffect, useRef, useState } from 'react';

export function useInView(threshold = 0.1) {
  const ref    = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true); // SSR / browsers without IO support
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // fire once only
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* useNearView - true once the element is about to come into view, for photos
   set as CSS backgrounds, which the browser cannot lazy-load on its own. Every
   card used to download with the page, and on a phone they competed with the
   hero (/treks: 18 card photos, 680KB, before the first screen was done).
   scrollMargin reaches inside a horizontal slider, so the next card is ready
   before it slides in; a browser without it loads each card as it appears. */
export function useNearView() {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setNear(true); return undefined; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setNear(true); observer.disconnect(); } },
      { rootMargin: '300px', scrollMargin: '300px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, near];
}
