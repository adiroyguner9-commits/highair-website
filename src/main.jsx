import { StrictMode } from 'react';
import './global.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeV2             from './components/web_v2/HomeV2.jsx';
import ExpeditionDetail   from './components/web_v2/ExpeditionDetail.jsx';
import AnnualPlan         from './components/web_v2/AnnualPlan.jsx';
import CancellationPolicy from './components/web_v2/CancellationPolicy.jsx';
import TermsOfService     from './components/web_v2/TermsOfService.jsx';
import PrivacyPolicy      from './components/web_v2/PrivacyPolicy.jsx';
import Accessibility      from './components/web_v2/Accessibility.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<HomeV2 />} />
        <Route path="/expedition/:slug"  element={<ExpeditionDetail />} />
        <Route path="/annual-plan"       element={<AnnualPlan />} />
        <Route path="/cancellation"      element={<CancellationPolicy />} />
        <Route path="/terms"             element={<TermsOfService />} />
        <Route path="/privacy"           element={<PrivacyPolicy />} />
        <Route path="/accessibility"     element={<Accessibility />} />
        <Route path="/*"                 element={<HomeV2 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
