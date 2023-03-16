import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const env = loadEnv(import.meta.env.MODE, process.cwd(), 'APP_');

// https://astro.build/config
import astroI18next from "astro-i18next";
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";

export default defineConfig({
  base: '',
  site: env.APP_OLD_SITE_URL,
  integrations: [astroI18next(), sitemap({
    changefreq: "daily",
    lastmod: new Date(),
    priority: 0.7
  }), image()]
});