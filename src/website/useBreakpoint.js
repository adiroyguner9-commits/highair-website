import { useState, useEffect } from 'react';

/* Breakpoints follow the window instantly. The category (phone / tablet /
   desktop) comes from matchMedia listeners, which fire once, exactly when a
   breakpoint is crossed. The old version waited for 100ms of resize silence,
   so while a window was being dragged the page kept the wrong layout (the
   phone header at 900px, a squeezed desktop header at 600px) and snapped at
   the end (owner, 23 Oct 2026). Resizes inside one breakpoint no longer
   re-render anything. No component reads the raw width, so it isn't returned. */
const MOBILE_Q = '(max-width: 767.98px)';
const DESKTOP_Q = '(min-width: 1024px)';

function readBreakpoint() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'desktop';
  if (window.matchMedia(MOBILE_Q).matches) return 'mobile';
  return window.matchMedia(DESKTOP_Q).matches ? 'desktop' : 'tablet';
}

export function useBreakpoint() {
  const [bp, setBp] = useState(readBreakpoint);
  useEffect(() => {
    const update = () => setBp(readBreakpoint());
    const lists = [MOBILE_Q, DESKTOP_Q].map(q => window.matchMedia(q));
    // Safari before 14 only has the older addListener API
    lists.forEach(l => (l.addEventListener ? l.addEventListener('change', update) : l.addListener(update)));
    update(); // the window may have changed between first render and this effect
    return () => lists.forEach(l => (l.removeEventListener ? l.removeEventListener('change', update) : l.removeListener(update)));
  }, []);
  return {
    isMobile:  bp === 'mobile',
    isTablet:  bp === 'tablet',
    isDesktop: bp === 'desktop',
  };
}
