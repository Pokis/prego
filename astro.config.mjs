import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { resolveDeploymentConfig } from "./scripts/deployment-config.mjs";

const { site, base, outDir } = resolveDeploymentConfig();

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
