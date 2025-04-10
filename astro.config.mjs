import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const env = loadEnv(import.meta.env.MODE, process.cwd(), 'APP_');

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  base: '',
  site: env.APP_OLD_SITE_URL,
  integrations: [sitemap({
    changefreq: "daily",
    lastmod: new Date(),
    priority: 0.7
  })]
});