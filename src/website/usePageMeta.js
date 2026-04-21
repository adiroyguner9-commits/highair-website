/**
 * usePageMeta.js - Dynamic SEO meta tags per page
 * Updates document.title, description, og:title, og:description, canonical
 */
import { useEffect } from 'react';

const BASE_URL = 'https://www.highair-expeditions.com';
const DEFAULT_IMG = `${BASE_URL}/Logo.png`;

export function usePageMeta({ title, description, canonicalPath = '/', image = DEFAULT_IMG }) {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper to set a meta tag by selector
    function setMeta(selector, attr, value) {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    }

    setMeta('meta[name="description"]',        'content', description);
    setMeta('meta[property="og:title"]',       'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]',         'content', BASE_URL + canonicalPath);
    setMeta('meta[property="og:image"]',       'content', image);
    setMeta('link[rel="canonical"]',           'href',    BASE_URL + canonicalPath);
  }, [title, description, canonicalPath, image]);
}
