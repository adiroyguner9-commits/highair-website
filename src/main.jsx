import { StrictMode, lazy, Suspense } from 'react';
import './global.css';
import './i18n.js';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

/* ── Prevent right-click save on images & videos ── */
document.addEventListener('contextmenu', e => {
  if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
    e.preventDefault();
  }
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <RouteTracker />
      <CookieBanner />
      <FloatingWA />
      {/* <SocialProofTicker /> */}
      <Suspense fallback={<div style={{minHeight:'100vh'}}/>}>
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
);
