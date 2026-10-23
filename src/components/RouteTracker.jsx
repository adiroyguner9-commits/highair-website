/**
 * RouteTracker.jsx - scroll to top + GA page_view on every route change
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteTracker() {
  const location = useLocation();
  const firstView = useRef(true);

  useEffect(() => {
    /* Scroll to top on every navigation (back, forward, link click) */
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    /* Fire GA page_view.
       The first view goes out at once: the static shell already carries this
       page's title. On in-app navigation the new page sets its title a moment
       later (lazy page chunk, then usePageMeta), and sending at once filed the
       visit under the PREVIOUS page's title (measured 23 Oct 2026: /blog
       reported as "הסיפור שלנו"). So wait for <title> to change, at most 1.5s. */
    const path = location.pathname + location.search;
    const href = window.location.href;
    const send = () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          page_path:     path,
          page_location: href,
          page_title:    document.title,
        });
      }
    };
    if (firstView.current) {
      firstView.current = false;
      send();
      return undefined;
    }
    const prevTitle = document.title;
    let sent = false;
    let timer;
    const observer = new MutationObserver(() => { if (document.title !== prevTitle) fire(); });
    function fire() {
      if (sent) return;
      sent = true;
      observer.disconnect();
      clearTimeout(timer);
      send();
    }
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    timer = setTimeout(fire, 1500);
    /* Leaving before the title settled still counts the visit */
    return fire;
  }, [location.pathname, location.search]);

  return null;
}
