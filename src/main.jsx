import { StrictMode, lazy, Suspense } from 'react';
import './global.css';
import './i18n.js';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import { ISRAEL_TREKS_LIVE } from './data/israelFlag.js';
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
    ],
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
const ExpeditionDetail   = lazy(() => import('./components/web_v2/ExpeditionDetail.jsx'));
const AnnualPlan         = lazy(() => import('./components/web_v2/AnnualPlan.jsx'));
const CancellationPolicy = lazy(() => import('./components/web_v2/CancellationPolicy.jsx'));
const TermsOfService     = lazy(() => import('./components/web_v2/TermsOfService.jsx'));
const PrivacyPolicy      = lazy(() => import('./components/web_v2/PrivacyPolicy.jsx'));
const Accessibility      = lazy(() => import('./components/web_v2/Accessibility.jsx'));
const IsraelDetail       = lazy(() => import('./components/web_v2/IsraelDetail.jsx'));
const IsraelTreksPage    = lazy(() => import('./components/web_v2/IsraelTreksPage.jsx'));
const WorldExpeditionsPage = lazy(() => import('./components/web_v2/WorldExpeditionsPage.jsx'));
const Blog               = lazy(() => import('./components/web_v2/Blog.jsx'));
const BlogPost           = lazy(() => import('./components/web_v2/BlogPost.jsx'));
const AuthorPage         = lazy(() => import('./components/web_v2/AuthorPage.jsx'));
const AboutUs            = lazy(() => import('./components/web_v2/AboutUs.jsx'));
const Shop               = lazy(() => import('./components/web_v2/Shop.jsx'));
const ContactPage        = lazy(() => import('./components/web_v2/ContactPage.jsx'));
const SafariPage         = lazy(() => import('./components/web_v2/SafariPage.jsx'));
const BookCall           = lazy(() => import('./components/web_v2/BookCall.jsx'));
const NotFound404        = lazy(() => import('./components/web_v2/NotFound404.jsx'));

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
   pre-hero it renders at once. */
function preHeroOnScreen() {
  const box = BOOT_HTML && bootPre.querySelector('.h');
  const url = box && (getComputedStyle(box).backgroundImage.match(/url\("?([^")]+)"?\)/) || [])[1];
  if (!url) return Promise.resolve();
  const img = new Image();
  img.src = url;
  const loaded = img.decode ? img.decode().catch(() => {}) : new Promise(r => { img.onload = img.onerror = r; });
  const painted = loaded.then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  return Promise.race([painted, new Promise(r => setTimeout(r, 800))]);
}

preHeroOnScreen().then(() => createRoot(document.getElementById('root')).render(
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
          {ISRAEL_TREKS_LIVE && <Route path="/israel/:slug" element={<IsraelDetail />} />}
          <Route path="/treks"             element={<WorldExpeditionsPage type="treks" />} />
          <Route path="/climbs"            element={<WorldExpeditionsPage type="climbs" />} />
          <Route path="/about"             element={<AboutUs />} />
          <Route path="/blog"              element={<Blog />} />
          <Route path="/blog/:slug"        element={<BlogPost />} />
          <Route path="/author/:id"        element={<AuthorPage />} />
          <Route path="/shop"              element={<Shop />} />
          <Route path="/contact"           element={<ContactPage />} />
          <Route path="/safari"            element={<SafariPage />} />
          <Route path="/book"              element={<BookCall />} />
          <Route path="/book/:slug"        element={<BookCall />} />
          <Route path="/book/:slug/:code"  element={<BookCall />} />
          <Route path="/*"                 element={<NotFound404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    </ErrorBoundary>
    <Analytics />
  </StrictMode>
));
