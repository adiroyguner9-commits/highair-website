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
const EN_BASE_URL = 'https://en.highair-expeditions.com';
const DEFAULT_IMG = `${BASE_URL}/og-image.jpg`;

export function usePageMeta({ title, description, canonicalPath = '/', image = DEFAULT_IMG, jsonLd, ogType = 'website', noIndex = false }) {
  useEffect(() => {
    document.title = title;

    function setMeta(selector, attr, value) {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    }

    /* Two indexed languages (5 Nov 2026, going international): Hebrew on www,
       English on en. Each page's canonical is its own host, and both versions
       name each other with hreflang, so neither is a duplicate of the other.
       Until then en. was noindex with its canonical on www. */
    const isEnHost = typeof window !== 'undefined' && window.location.hostname.startsWith('en.');
    const ownBase  = isEnHost ? EN_BASE_URL : BASE_URL;

    setMeta('meta[name="description"]',        'content', description);
    setMeta('meta[property="og:title"]',       'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]',         'content', ownBase + canonicalPath);
    setMeta('meta[property="og:image"]',       'content', image);
    setMeta('meta[property="og:type"]',        'content', ogType);
    setMeta('meta[property="og:locale"]',      'content', isEnHost ? 'en_US' : 'he_IL');
    setMeta('link[rel="canonical"]',           'href',    ownBase + canonicalPath);
    document.documentElement.setAttribute('lang', isEnHost ? 'en' : 'he');

    /* Robots. 404 / teaser pages pass noIndex explicitly (noindex,nofollow). */
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');

    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    if (!noIndex) {
      [['he', BASE_URL], ['en', EN_BASE_URL], ['x-default', BASE_URL]].forEach(([lang, base]) => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = lang;
        link.href = base + canonicalPath;
        document.head.appendChild(link);
      });
    }

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

/* ItemList — for listing/landing pages (e.g. /israel, /treks, /climbs). Tells
   Google and AI engines exactly which trips the page collects, with URLs. */
export function itemList(items) {
  return {
    '@context': 'https://schema.org',
    '@type':    'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      name:      it.name,
      url:       it.url.startsWith('http') ? it.url : (BASE_URL + it.url),
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
  durationDays, ratingValue, reviewCount, reviews,
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    ['TouristTrip', 'Product'],
    // Same @id the static shell uses for this trip, so Google MERGES the shell
    // and runtime TouristTrip into one entity instead of seeing two.
    '@id':      url.startsWith('http') ? url : BASE_URL + url,
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
      telephone:  '+972555636975',
      image:      BASE_URL + '/Logo.png',
      priceRange: '$$$',
      address: {
        '@type':           'PostalAddress',
        addressLocality:   'Tel Aviv',
        addressCountry:    'IL',
      },
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
      shippingDetails: {
        '@type':       'OfferShippingDetails',
        shippingRate:  { '@type': 'MonetaryAmount', value: '0', currency: priceCurrency },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IL' },
        deliveryTime:  { '@type': 'ShippingDeliveryTime', handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' } },
      },
      hasMerchantReturnPolicy: {
        '@type':              'MerchantReturnPolicy',
        applicableCountry:    'IL',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        merchantReturnLink:   'https://www.highair-expeditions.com/cancellation',
      },
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
  // Individual Review nodes back the aggregate rating (real testimonials only)
  if (Array.isArray(reviews) && reviews.length) {
    schema.review = reviews.slice(0, 10).map(r => ({
      '@type':       'Review',
      author:        { '@type': 'Person', name: r.name },
      reviewRating:  { '@type': 'Rating', ratingValue: r.rating || 5, bestRating: 5, worstRating: 1 },
      reviewBody:    r.text,
    }));
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
