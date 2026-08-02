import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

const site = process.env.SITE_URL || "https://pregnancy-clearly.example";
const base = process.env.BASE_PATH || "/";
const outDir = process.env.OUT_DIR || "./dist";

export default defineConfig({
  site,
  base,
  outDir,
  output: "static",
  integrations: [react(), sitemap()],
  build: {
    assets: "assets",
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      sourcemap: false,
    },
  },
});
