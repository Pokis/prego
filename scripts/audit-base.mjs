import { existsSync, readFileSync, rmSync } from "node:fs";
import { basename, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const output = resolve(".audit-dist-base");
if (basename(output) !== ".audit-dist-base")
  throw new Error("Refusing an unsafe audit output path");
rmSync(output, { recursive: true, force: true });

const build = spawnSync(
  process.execPath,
  [resolve("node_modules/astro/bin/astro.mjs"), "build"],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      SITE_URL: "https://example.test",
      BASE_PATH: "/pregnancy-guide/",
      OUT_DIR: output,
    },
    encoding: "utf8",
  },
);

if (build.status !== 0) {
  process.stdout.write(build.stdout || "");
  process.stderr.write(build.stderr || "");
  if (build.error) console.error(build.error);
  process.exit(build.status ?? 1);
}

try {
  const homepage = resolve(output, "index.html");
  if (!existsSync(homepage))
    throw new Error("The nested-base build did not produce index.html");
  const html = readFileSync(homepage, "utf8");
  for (const expected of [
    'href="/pregnancy-guide/timeline/"',
    'href="/pregnancy-guide/manifest.webmanifest"',
    'content="https://example.test/pregnancy-guide/og.webp"',
    "/pregnancy-guide/sw.js",
  ]) {
    if (!html.includes(expected))
      throw new Error(`Nested-base output is missing ${expected}`);
  }
  if (/href="\/(?!pregnancy-guide\/|\/)/.test(html))
    throw new Error("Nested-base homepage contains an unprefixed local link");
  console.log("Nested-base audit passed for /pregnancy-guide/.");
} finally {
  rmSync(output, { recursive: true, force: true });
}
