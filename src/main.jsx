import { StrictMode } from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeV2 from './components/web_v2/HomeV2.jsx';
import ExpeditionDetail from './components/web_v2/ExpeditionDetail.jsx';
import NotFound404 from './components/web_v2/NotFound404.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<HomeV2 />} />
        <Route path="/expedition/:slug"    element={<ExpeditionDetail />} />
        <Route path="/*"                   element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
