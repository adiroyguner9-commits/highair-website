import { StrictMode } from 'react';
import './global.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RouteTracker  from './components/RouteTracker.jsx';
import CookieBanner  from './components/web_v2/CookieBanner.jsx';
import HomeV2             from './components/web_v2/HomeV2.jsx';
import ExpeditionDetail   from './components/web_v2/ExpeditionDetail.jsx';
import AnnualPlan         from './components/web_v2/AnnualPlan.jsx';
import CancellationPolicy from './components/web_v2/CancellationPolicy.jsx';
import TermsOfService     from './components/web_v2/TermsOfService.jsx';
import PrivacyPolicy      from './components/web_v2/PrivacyPolicy.jsx';
import Accessibility      from './components/web_v2/Accessibility.jsx';
import IsraelDetail       from './components/web_v2/IsraelDetail.jsx';
import Blog               from './components/web_v2/Blog.jsx';
import BlogPost           from './components/web_v2/BlogPost.jsx';
import NotFound404        from './components/web_v2/NotFound404.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RouteTracker />
      <CookieBanner />
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
        <Route path="/*"                 element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
