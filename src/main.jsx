import { StrictMode, lazy, Suspense } from 'react';
import { loadForeign } from './i18n/foreign.js';
import { loadTrips } from './data/trips.js';
import './global.css';
import i18nInstance from './i18n.js';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { scrubEvent, scrubBreadcrumb, scrubTransaction } from './utils/sentryScrub.js';
import { Analytics } from '@vercel/analytics/react';
import { captureAttribution } from './utils/attribution.js';
import { installWaIntentListener } from './utils/waIntent.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import RouteTracker  from './components/RouteTracker.jsx';
import CookieBanner        from './components/web_v2/CookieBanner.jsx';
import FloatingWA          from './components/web_v2/FloatingWA.jsx';
import SocialProofTicker   from './components/web_v2/SocialProofTicker.jsx';
import { ISRAEL_TREKS_LIVE, ISRAEL_DIRECT_LINK_SLUGS } from './data/israelFlag.js';
/* Scroll depth is now tracked per-page via useScrollDepth() hook in each component */

/* ── Where this visitor came from ──
   Was a sessionStorage snapshot of utm_* only, which lost the campaign the
   moment the tab closed and recorded nothing at all for a visitor who arrived
   without utm params. See src/utils/attribution.js for what that cost. */
captureAttribution();
/* Beside it on purpose: one records where a visitor came from, the other hands
   that record to the server the moment they leave for WhatsApp — the last point
   at which the visit and the message they are about to send are still the same
   story. */
installWaIntentListener();

/* ── Prevent right-click save and drag-out save on images & videos ──
   (CSS in global.css covers WebKit drag and the iPhone long-press menu;
   dragstart covers Firefox, which ignores -webkit-user-drag) */
const isMedia = el => el?.tagName === 'IMG' || el?.tagName === 'VIDEO';
document.addEventListener('contextmenu', e => {
  if (isMedia(e.target)) e.preventDefault();
});
document.addEventListener('dragstart', e => {
  if (isMedia(e.target)) e.preventDefault();
});

/* ── Sentry error monitoring ── */
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn:              import.meta.env.VITE_SENTRY_DSN,
    environment:      import.meta.env.MODE,
    release:          import.meta.env.VITE_APP_VERSION || '1.0.0',
    tracesSampleRate: 0.1,   // 10% of transactions for performance
    /* No customer data in reports: masked emails, phones and booking refs, no
       query strings, no console breadcrumbs (src/utils/sentryScrub.js). No
       session replay either: the setting that used to be here never ran, no
       replay integration is loaded. */
    sendDefaultPii: false,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    // Noise from in-app browsers (Facebook / Instagram / etc. WebViews) and browser
    // extensions. The host app injects a script that talks to a native bridge; when
    // the WebView is torn down or navigates away the bridge call throws. None of this
    // is our code (verified: we never touch these APIs), so drop it before it leaves
    // the client.
    ignoreErrors: [
      // Android WebView JS bridge
      'Error invoking postMessage',
      'Java object is gone',
      'Java exception was raised during method invocation',
      // iOS / WKWebView JS bridge (window.webkit.messageHandlers)
      'window.webkit.messageHandlers',
      // Instagram in-app browser search bridge
      'instantSearchSDKJSBridgeClearHighlight',
      // Injected-script regex that older WebView engines reject (not in our source)
      'invalid group specifier name',
      // Failed <link>/extension resource thrown as an error object
      '[object HTMLLinkElement]',
      // The same from injected <script> tags and a third party's XHR (9 Nov 2026)
      '[object HTMLScriptElement]',
      '[object XMLHttpRequest]',
      // Facebook / Instagram in-app browser bridge (HIGHAIR-WEBSITE-14)
      '_META.IABInnerFrame',
      // A script the Android in-app WebView evaluates against the page itself,
      // reported at line 1 of the HTML, where only <!DOCTYPE html> stands
      // (HIGHAIR-WEBSITE-W/18/19). Our own code ships as built /assets/ files.
      "Unexpected token 'else'",
    ],
    // Third-party scripts we load but do not write: the accessibility widget and
    // the ad and analytics tags. Their own network failures are not our errors
    // (HIGHAIR-WEBSITE-N/C/15).
    denyUrls: [/userway\.org/i, /doubleclick\.net/i, /googletagmanager\.com/i, /connect\.facebook\.net/i],
    // Don't send errors in development; scrub everything else
    beforeSend(event) {
      if (import.meta.env.DEV) return null;
      return scrubEvent(event);
    },
    beforeSendTransaction: scrubTransaction,
    beforeBreadcrumb: scrubBreadcrumb,
  });
}

const HomeV2             = lazy(() => import('./components/web_v2/HomeV2.jsx'));
/* Pages that read the trip records wait for this site's copy of them
   (src/data/trips.js), fetched alongside the page's own code. */
const withTrips = page => Promise.all([page, loadTrips()]).then(([m]) => m);
const ExpeditionDetail   = lazy(() => withTrips(import('./components/web_v2/ExpeditionDetail.jsx')));
const AnnualPlan         = lazy(() => withTrips(import('./components/web_v2/AnnualPlan.jsx')));
const CancellationPolicy = lazy(() => import('./components/web_v2/CancellationPolicy.jsx'));
const TermsOfService     = lazy(() => import('./components/web_v2/TermsOfService.jsx'));
const PrivacyPolicy      = lazy(() => import('./components/web_v2/PrivacyPolicy.jsx'));
const Accessibility      = lazy(() => import('./components/web_v2/Accessibility.jsx'));
const IsraelDetail       = lazy(() => import('./components/web_v2/IsraelDetail.jsx'));
const IsraelTreksPage    = lazy(() => import('./components/web_v2/IsraelTreksPage.jsx'));
const WorldExpeditionsPage = lazy(() => import('./components/web_v2/WorldExpeditionsPage.jsx'));
const Blog               = lazy(() => import('./components/web_v2/Blog.jsx'));
const BlogPost           = lazy(() => import('./components/web_v2/BlogPost.jsx'));
const AboutUs            = lazy(() => import('./components/web_v2/AboutUs.jsx'));
const Shop               = lazy(() => import('./components/web_v2/Shop.jsx'));
const ContactPage        = lazy(() => import('./components/web_v2/ContactPage.jsx'));
const SafariPage         = lazy(() => withTrips(import('./components/web_v2/SafariPage.jsx')));
const BookCall           = lazy(() => import('./components/web_v2/BookCall.jsx'));
/* Call booking is the Hebrew site's sales path. Abroad the sale runs by e-mail
   and WhatsApp (owner, 5 Nov 2026), so /book on en./de./es. opens the contact
   form instead. */
function BookRoute() {
  return i18nInstance.language !== 'he' ? <Navigate to="/contact" replace /> : <BookCall />;
}
const AppPage            = lazy(() => import('./components/web_v2/AppPage.jsx'));
/* The trek matching tool (owner, 10 Nov 2026): a hidden Hebrew page, reached only by its link.
   Not in the menu, the sitemap or the shells; noindex. Its lead names the expedition by the
   site's own name, so it waits for the trips like the expedition pages do. */
const TrekMatchPage      = lazy(() => withTrips(import('./components/web_v2/TrekMatchPage.jsx')));
function TrekMatchRoute() {
  return i18nInstance.language !== 'he' ? <Navigate to="/" replace /> : <TrekMatchPage />;
}

/* /israel/:slug: every trek while the Israel section is live; while it is hidden
   only the community treks shared by direct link, on the Hebrew site only (they
   are Hebrew community days); the rest fall through to 404. */
function IsraelTripRoute() {
  const { slug } = useParams();
  const direct = i18nInstance.language === 'he' && ISRAEL_DIRECT_LINK_SLUGS.includes(slug);
  return (ISRAEL_TREKS_LIVE || direct) ? <IsraelDetail /> : <Navigate to="/" replace />;
}

/* Prevent the browser from restoring a previous scroll position after
   a same-domain redirect (e.g. en.highair-expeditions.com → highair-expeditions.com).
   RouteTracker handles scroll-to-top manually on every navigation. */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

/* The page's static shell paints its header bar and hero image before any of
   this code runs (#ha-pre, scripts/generate-html-shells.mjs). React's first
   render replaces #root, and every page is a lazy chunk, so the first Suspense
   fallback repeats that same markup: the hero stays on screen until the real
   page takes its place. Any other wait (a later navigation) keeps the plain
   blank fallback, so one page's hero never shows on another. */
const bootPre = document.getElementById('ha-pre');
const BOOT_HTML = bootPre && getComputedStyle(bootPre).display !== 'none' ? bootPre.outerHTML : '';
const BOOT_PATH = location.pathname;
function BootFallback() {
  const { pathname } = useLocation();
  if (BOOT_HTML && pathname === BOOT_PATH) return <div dangerouslySetInnerHTML={{ __html: BOOT_HTML }} />;
  return <div style={{ minHeight: '100vh' }} />;
}

/* Lab tests (PageSpeed) replay a fast load. There React could finish before the
   pre-hero's image had painted, the swap hid it, and the real hero, which
   waits for all the code, became the measured largest paint: 12s instead of
   3s in 2 of 3 live runs (24 Oct 2026). On a real phone the 20-130KB image
   beats the ~1.2MB of code by seconds anyway. So the first render waits until
   the pre-hero's image is on screen, at most 800ms; without a visible
   pre-hero it renders at once.
   Chrome can also hold its first frames for one or two seconds after the
   image is ready (Lighthouse traces, 8 Nov 2026: no frame from 0.26s to 1.47s
   with the image decoded at 0.59s). The 800ms cap then ran out before any
   frame, React swapped the pre-hero, and /treks measured ~10s on 5 of 8 days.
   So once the image is ready, the swap waits for the browser to record the
   first paint, at most 3s more. A hidden tab paints nothing: it renders at once. */
function preHeroOnScreen() {
  const box = BOOT_HTML && bootPre.querySelector('.h');
  const url = box && (getComputedStyle(box).backgroundImage.match(/url\("?([^")]+)"?\)/) || [])[1];
  if (!url || document.visibilityState === 'hidden') return Promise.resolve();
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const img = new Image();
  img.src = url;
  const loaded = img.decode ? img.decode().catch(() => {}) : new Promise(r => { img.onload = img.onerror = r; });
  const lcp = typeof PerformanceObserver !== 'undefined' && (PerformanceObserver.supportedEntryTypes || []).includes('largest-contentful-paint');
  if (!lcp) return Promise.race([loaded.then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))), wait(800)]);
  /* before React, the pre-hero is the only content, so the first recorded paint is it */
  const painted = new Promise(r => {
    const po = new PerformanceObserver(list => { if (list.getEntries().length) { po.disconnect(); r(); } });
    po.observe({ type: 'largest-contentful-paint', buffered: true });
  });
  return Promise.race([loaded.then(() => true), wait(800).then(() => false)])
    .then(ready => ready && Promise.race([painted, wait(3000)]));
}

/* The German / Spanish texts (src/i18n/foreign.js): only de. and es. wait for
   theirs; www and en. render without them. Preview and local hosts take both,
   since their language toggle switches without a reload. A failed load still
   renders, in English. */
function foreignTexts() {
  const host = window.location.hostname;
  const prod = host === 'highair-expeditions.com' || host.endsWith('.highair-expeditions.com');
  const langs = prod ? ['de', 'es'].filter(l => l === i18nInstance.language) : ['de', 'es'];
  return Promise.all(langs.map(l => loadForeign(l)
    .then(f => i18nInstance.addResourceBundle(l, 'translation', f.res, true, true))
    .catch(e => console.warn('[i18n] foreign texts', l, e?.message))));
}

Promise.all([preHeroOnScreen(), foreignTexts()]).then(() => createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <RouteTracker />
      <CookieBanner />
      <FloatingWA />
      {/* <SocialProofTicker /> */}
      <Suspense fallback={<BootFallback />}>
        <Routes>
          <Route path="/"                  element={<HomeV2 />} />
          <Route path="/expedition/:slug"  element={<ExpeditionDetail />} />
          <Route path="/annual-plan"       element={<AnnualPlan />} />
          <Route path="/cancellation"      element={<CancellationPolicy />} />
          <Route path="/terms"             element={<TermsOfService />} />
          <Route path="/privacy"           element={<PrivacyPolicy />} />
          <Route path="/accessibility"     element={<Accessibility />} />
          {/* Israel treks hidden by the owner (23 Oct 2026): routes fall through
              to 404 until ISRAEL_TREKS_LIVE is flipped back on in src/data/israelFlag.js */}
          {ISRAEL_TREKS_LIVE && <Route path="/israel"       element={<IsraelTreksPage />} />}
          {/* While hidden, a community trek in ISRAEL_DIRECT_LINK_SLUGS still opens by its direct link */}
          <Route path="/israel/:slug" element={<IsraelTripRoute />} />
          <Route path="/treks"             element={<WorldExpeditionsPage type="treks" />} />
          <Route path="/climbs"            element={<WorldExpeditionsPage type="climbs" />} />
          <Route path="/about"             element={<AboutUs />} />
          <Route path="/blog"              element={<Blog />} />
          <Route path="/blog/:slug"        element={<BlogPost />} />
          <Route path="/shop"              element={<Shop />} />
          <Route path="/contact"           element={<ContactPage />} />
          <Route path="/app"               element={<AppPage />} />
          <Route path="/safari"            element={<SafariPage />} />
          <Route path="/trek-match"        element={<TrekMatchRoute />} />
          <Route path="/book"              element={<BookRoute />} />
          <Route path="/book/:slug"        element={<BookRoute />} />
          <Route path="/book/:slug/:code"  element={<BookRoute />} />
          <Route path="/*"                 element={<Navigate to="/" replace />} />  {/* never a dead end: home, same language (owner, 5 Nov 2026) */}
        </Routes>
      </Suspense>
    </BrowserRouter>
    </ErrorBoundary>
    <Analytics />
  </StrictMode>
));
