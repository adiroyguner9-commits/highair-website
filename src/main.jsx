import { StrictMode, lazy, Suspense } from 'react';
import './global.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import RouteTracker  from './components/RouteTracker.jsx';
import CookieBanner  from './components/web_v2/CookieBanner.jsx';

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
const Shop               = lazy(() => import('./components/web_v2/Shop.jsx'));
const NotFound404        = lazy(() => import('./components/web_v2/NotFound404.jsx'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <RouteTracker />
      <CookieBanner />
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
          <Route path="/blog"              element={<Blog />} />
          <Route path="/blog/:slug"        element={<BlogPost />} />
          <Route path="/shop"              element={<Shop />} />
          <Route path="/*"                 element={<NotFound404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
