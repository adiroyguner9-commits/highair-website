/**
 * RouteTracker.jsx - scroll to top + GA page_view on every route change
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    /* Scroll to top on every navigation (back, forward, link click) */
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    /* Fire GA page_view */
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path:  location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location.pathname, location.search]);

  return null;
}
