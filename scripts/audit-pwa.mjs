import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const output = resolve(process.env.OUT_DIR || "dist");
const read = (path) => readFileSync(resolve(output, path), "utf8");
const manifestPath = resolve(output, "manifest.webmanifest");
const serviceWorkerPath = resolve(output, "sw.js");
const homepagePath = resolve(output, "index.html");

for (const path of [manifestPath, serviceWorkerPath, homepagePath]) {
  assert.ok(existsSync(path), `Missing PWA artifact: ${path}`);
}

const manifest = JSON.parse(read("manifest.webmanifest"));
assert.equal(manifest.id, "./");
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");
assert.ok(
  ["standalone", "fullscreen", "minimal-ui"].includes(manifest.display),
);
assert.equal(manifest.theme_color, "#5f2847");
assert.equal(manifest.background_color, "#fbf6ed");

const requiredIcons = new Map([
  ["icons/icon-192.png", 192],
  ["icons/icon-512.png", 512],
  ["icons/icon-maskable-512.png", 512],
]);
for (const [path, size] of requiredIcons) {
  const icon = manifest.icons.find((entry) => entry.src === path);
  assert.ok(icon, `Manifest is missing ${path}`);
  assert.equal(icon.type, "image/png");
  assert.ok(icon.purpose, `${path} has no purpose`);
  const metadata = await sharp(resolve(output, path)).metadata();
  assert.equal(metadata.width, size, `${path} has the wrong width`);
  assert.equal(metadata.height, size, `${path} has the wrong height`);
}
assert.ok(
  manifest.icons.some((icon) => icon.purpose.split(/\s+/).includes("maskable")),
  "Manifest has no maskable icon",
);

const serviceWorker = read("sw.js");
assert.doesNotMatch(serviceWorker, /__BUILD_ID__|\/\* BUILD_ASSETS \*\//);
assert.match(serviceWorker, /pregnancy-clearly-[a-f0-9]{12}/);
assert.match(serviceWorker, /assets\//);
assert.match(serviceWorker, /request\.mode === "navigate"/);
assert.match(serviceWorker, /status: 503/);
new Function(serviceWorker);

const homepage = read("index.html");
assert.match(homepage, /rel="manifest"/);
assert.match(homepage, /rel="apple-touch-icon"/);
assert.match(homepage, /navigator\.serviceWorker/);

console.log(
  `PWA artifact audit passed: install metadata, ${requiredIcons.size} required icons, versioned build assets and offline fallbacks.`,
);
