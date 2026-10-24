// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  build: {
    // Nunca embute CSS em <style>: mantem style-src 'self' viavel (CSP).
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // 0 = nunca embute chunk de <script> no HTML; mantem script-src 'self' (CSP).
      assetsInlineLimit: 0,
    },
  },
});
