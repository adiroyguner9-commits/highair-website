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
