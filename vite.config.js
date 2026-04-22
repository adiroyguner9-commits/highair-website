import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const airtableBase  = env.AIRTABLE_BASE;
  const airtableToken = env.AIRTABLE_TOKEN;

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy Vercel serverless functions to production (dev has no local runtime)
        '/api/submit-lead': {
          target:       'https://highair-website.vercel.app',
          changeOrigin: true,
        },
        '/api/slots': {
          target:       'https://highair-website.vercel.app',
          changeOrigin: true,
        },
        '/api/book-slot': {
          target:       'https://highair-website.vercel.app',
          changeOrigin: true,
        },
        '/api/calendar-invite': {
          target:       'https://highair-website.vercel.app',
          changeOrigin: true,
        },
        '/api/ping-resend': {
          target:       'https://highair-website.vercel.app',
          changeOrigin: true,
        },
        // Proxy Airtable reads directly (faster in dev, bypasses serverless)
        ...(airtableBase && airtableToken ? {
          '/api/airtable': {
            target:       `https://api.airtable.com/v0/${airtableBase}`,
            changeOrigin: true,
            rewrite:      path => path.replace(/^\/api\/airtable/, ''),
            headers:      { Authorization: `Bearer ${airtableToken}` },
          },
        } : {}),
      },
    },
  };
});
