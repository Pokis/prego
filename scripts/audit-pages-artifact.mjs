import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { resolveDeploymentConfig } from "./deployment-config.mjs";

const { site, base, outDir } = resolveDeploymentConfig();
const output = resolve(outDir);
const errors = [];

if (!existsSync(output)) {
  console.error(
    `GitHub Pages artifact audit failed: ${output} does not exist. Build it first.`,
  );
  process.exit(1);
}

const walk = (directory) =>
  readdirSync(directory).flatMap((name) => {
    const path = resolve(directory, name);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) {
      errors.push(
        `Pages artifacts must not contain symlinks: ${relative(output, path)}`,
      );
      return [];
    }
    return stat.isDirectory() ? walk(path) : [path];
  });

const files = walk(output);
const required = [
  ".nojekyll",
  "404.html",
  "index.html",
  "getting-pregnant/index.html",
  "timeline/index.html",
  "essentials/index.html",
  "urgent-help/index.html",
  "manifest.webmanifest",
  "sw.js",
  "sitemap-index.xml",
  "data/search-index.json",
];

for (const name of required) {
  if (!existsSync(resolve(output, name)))
    errors.push(`Missing Pages artifact: ${name}`);
}

const publicUrl = (path = "") =>
  new URL(`${base}${String(path).replace(/^\/+/, "")}`, site).href;
const homepagePath = resolve(output, "index.html");

if (existsSync(homepagePath)) {
  const homepage = readFileSync(homepagePath, "utf8");
  for (const expected of [
    `href="${publicUrl()}"`,
    `href="${base}getting-pregnant/"`,
    `href="${base}timeline/"`,
    `href="${base}manifest.webmanifest"`,
    `${base}sw.js`,
    `content="${publicUrl("og.webp")}"`,
  ]) {
    if (!homepage.includes(expected))
      errors.push(`Homepage is missing deployment-aware value: ${expected}`);
  }
}

const htmlFiles = files.filter((file) => file.endsWith(".html"));
const localReference = /(?:href|src)="(\/[^"#?]*)/g;
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  if (/localhost:|127\.0\.0\.1:|pregnancy-clearly\.example/.test(html))
    errors.push(
      `${relative(output, file)} contains a placeholder or local URL`,
    );

  if (base !== "/") {
    for (const match of html.matchAll(localReference)) {
      const reference = match[1];
      if (!reference.startsWith(base))
        errors.push(
          `${relative(output, file)} contains an unprefixed local reference: ${reference}`,
        );
    }
  }
}

for (const file of files.filter((path) => /sitemap.*\.xml$/.test(path))) {
  const xml = readFileSync(file, "utf8");
  if (!xml.includes(publicUrl()))
    errors.push(`${relative(output, file)} does not use ${publicUrl()}`);
  if (/localhost|127\.0\.0\.1|pregnancy-clearly\.example/.test(xml))
    errors.push(
      `${relative(output, file)} contains a placeholder or local URL`,
    );
}

if (errors.length) {
  console.error(
    `GitHub Pages artifact audit failed (${errors.length}):\n${errors.slice(0, 80).join("\n")}`,
  );
  process.exit(1);
}

console.log(
  `GitHub Pages artifact audit passed: ${files.length} files at ${publicUrl()}`,
);
