import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import astroI18next from "astro-i18next";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

const env = loadEnv(import.meta.env.MODE, process.cwd(), '')

// https://astro.build/config
export default defineConfig({
  site: env.OLD_SITE_URL,
  integrations: [
    astroI18next(),
    sitemap({
      changefreq: "daily",
      lastmod: new Date(),
      priority: 0.7
    })
  ]
});
