import { defineConfig } from 'vitest/config';

/* The rule tests: server modules, run in Node. `npm test` before every deploy
   (see .githooks/pre-push). */
export default defineConfig({
  test: { include: ['tests/**/*.test.js'], environment: 'node' },
});
