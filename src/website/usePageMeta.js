/**
 * usePageMeta.js — dynamic SEO meta tags + Schema.org JSON-LD per page.
 *
 * Updates document.title, description, og:*, canonical, hreflang on mount;
 * optionally injects a JSON-LD <script> into <head> for structured data
 * (Tour, BreadcrumbList, FAQPage, etc.) so search engines can build rich
 * results for our pages.
 */
import { useEffect } from 'react';

const BASE_URL    = 'https://www.highair-expeditions.com';
const BASE_URL_EN = 'https://en.highair-expeditions.com';
const DEFAULT_IMG = `${BASE_URL}/og-image.jpg`;

export function usePageMeta({ title, description, canonicalPath = '/', image = DEFAULT_IMG, jsonLd }) {
  useEffect(() => {
    document.title = title;

    function setMeta(selector, attr, value) {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    }

    function setHreflang(lang, href) {
      let el = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'alternate');
        el.setAttribute('hreflang', lang);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    }

    setMeta('meta[name="description"]',        'content', description);
    setMeta('meta[property="og:title"]',       'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]',         'content', BASE_URL + canonicalPath);
    setMeta('meta[property="og:image"]',       'content', image);
    setMeta('link[rel="canonical"]',           'href',    BASE_URL + canonicalPath);

    // hreflang — tells Google about the HE ↔ EN language variants
    setHreflang('he',        BASE_URL    + canonicalPath);
    setHreflang('en',        BASE_URL_EN + canonicalPath);
    setHreflang('x-default', BASE_URL    + canonicalPath);

    /* ── JSON-LD: replace any existing page-level schema script ──
       Each page gets a single <script id="page-jsonld"> that we own. The
       Organization-level schema injected from HomeV2 has its own id. */
    const existing = document.getElementById('page-jsonld');
    if (existing) existing.remove();

    if (jsonLd) {
      const script = document.createElement('script');
      script.id   = 'page-jsonld';
      script.type = 'application/ld+json';
      // Support either a single object or an array of @graph entries
      const payload = Array.isArray(jsonLd)
        ? { '@context': 'https://schema.org', '@graph': jsonLd }
        : jsonLd;
      script.textContent = JSON.stringify(payload);
      document.head.appendChild(script);
    }

    return () => {
      const el = document.getElementById('page-jsonld');
      if (el) el.remove();
    };
  }, [title, description, canonicalPath, image, JSON.stringify(jsonLd)]);
}

/* ── Schema.org builders — keep callers tidy ── */

export function breadcrumbList(items) {
  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type':    'ListItem',
      position:   i + 1,
      name:       it.name,
      item:       it.url.startsWith('http') ? it.url : (BASE_URL + it.url),
    })),
  };
}

export function faqPage(qa) {
  return {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: qa.map(({ q, a }) => ({
      '@type':    'Question',
      name:       q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function tourSchema({
  name, description, image, url, country, priceFrom, priceCurrency = 'USD',
  durationDays, ratingValue, reviewCount,
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'TouristTrip',
    name,
    description,
    url:        url.startsWith('http') ? url : BASE_URL + url,
    image:      image
                  ? (image.startsWith('http') ? image : BASE_URL + image)
                  : DEFAULT_IMG,
    provider: {
      '@type':    'TravelAgency',
      name:       'HighAir Expeditions',
      url:        BASE_URL,
    },
  };
  if (country) {
    schema.touristType = country;
    schema.itinerary   = { '@type': 'Place', name: country };
  }
  if (durationDays) schema.duration = `P${durationDays}D`;
  if (typeof priceFrom === 'number' && priceFrom > 0) {
    schema.offers = {
      '@type':         'Offer',
      priceCurrency,
      price:           priceFrom,
      availability:    'https://schema.org/InStock',
    };
  }
  if (ratingValue && reviewCount) {
    schema.aggregateRating = {
      '@type':       'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating:    5,
      worstRating:   1,
    };
  }
  return schema;
}

export function blogPostSchema({ headline, image, datePublished, dateModified, authorName, url, description }) {
  return {
    '@context':     'https://schema.org',
    '@type':        'BlogPosting',
    headline,
    description,
    image:          image && (image.startsWith('http') ? image : BASE_URL + image),
    datePublished,
    dateModified:   dateModified || datePublished,
    author:         { '@type': 'Person',       name: authorName || 'HighAir Expeditions' },
    publisher:      { '@type': 'Organization', name: 'HighAir Expeditions',
                      logo: { '@type': 'ImageObject', url: BASE_URL + '/Logo.png' } },
    mainEntityOfPage: url.startsWith('http') ? url : BASE_URL + url,
  };
}
