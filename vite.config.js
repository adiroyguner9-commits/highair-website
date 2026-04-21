import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const airtableBase  = env.AIRTABLE_BASE;
  const airtableToken = env.AIRTABLE_TOKEN;

  return {
    plugins: [react()],
    server: {
      proxy: airtableBase && airtableToken ? {
        '/api/airtable': {
          target:       `https://api.airtable.com/v0/${airtableBase}`,
          changeOrigin: true,
          rewrite:      path => path.replace(/^\/api\/airtable/, ''),
          headers:      { Authorization: `Bearer ${airtableToken}` },
        },
      } : {},
    },
  };
});
