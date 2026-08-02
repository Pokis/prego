// Astro 7 automatically backgrounds dev servers when it detects an AI-agent
// environment. Playwright needs a foreground child process it can own and stop.
process.env.ASTRO_DEV_BACKGROUND = "0";
process.argv.splice(2, 0, "dev");
await import("../node_modules/astro/bin/astro.mjs");
