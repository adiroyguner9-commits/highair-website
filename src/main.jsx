import { StrictMode, lazy, Suspense } from 'react';
import './global.css';
import './i18n.js';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import RouteTracker  from './components/RouteTracker.jsx';
import CookieBanner  from './components/web_v2/CookieBanner.jsx';
import FloatingWA    from './components/web_v2/FloatingWA.jsx';
import { installScrollDepthTracker } from './utils/analytics.js';

/* Fire scroll-depth events at 25/50/75/100% — once per session.
   Useful for measuring engagement / where users actually drop off. */
installScrollDepthTracker();

/* ── Sentry error monitoring ── */
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn:              import.meta.env.VITE_SENTRY_DSN,
    environment:      import.meta.env.MODE,
    release:          import.meta.env.VITE_APP_VERSION || '1.0.0',
    tracesSampleRate: 0.1,   // 10% of transactions for performance
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    // Don't send errors in development
    beforeSend(event) {
      if (import.meta.env.DEV) return null;
      return event;
    },
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
const Blog               = lazy(() => import('./components/web_v2/Blog.jsx'));
const BlogPost           = lazy(() => import('./components/web_v2/BlogPost.jsx'));
const AboutUs            = lazy(() => import('./components/web_v2/AboutUs.jsx'));
const Shop               = lazy(() => import('./components/web_v2/Shop.jsx'));
const ContactPage        = lazy(() => import('./components/web_v2/ContactPage.jsx'));
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
      <Suspense fallback={<div style={{minHeight:'100vh'}}/>}>
        <Routes>
          <Route path="/"                  element={<HomeV2 />} />
          <Route path="/expedition/:slug"  element={<ExpeditionDetail />} />
          <Route path="/annual-plan"       element={<AnnualPlan />} />
          <Route path="/cancellation"      element={<CancellationPolicy />} />
          <Route path="/terms"             element={<TermsOfService />} />
          <Route path="/privacy"           element={<PrivacyPolicy />} />
          <Route path="/accessibility"     element={<Accessibility />} />
          <Route path="/israel/:slug"      element={<IsraelDetail />} />
          <Route path="/about"             element={<AboutUs />} />
          <Route path="/blog"              element={<Blog />} />
          <Route path="/blog/:slug"        element={<BlogPost />} />
          <Route path="/shop"              element={<Shop />} />
          <Route path="/contact"           element={<ContactPage />} />
          <Route path="/*"                 element={<NotFound404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
