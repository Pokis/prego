import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { relative, resolve } from "node:path";

const output = resolve(process.env.OUT_DIR || "dist");
const serviceWorkerPath = resolve(output, "sw.js");

if (!existsSync(serviceWorkerPath)) {
  throw new Error(`Cannot finalize PWA: ${serviceWorkerPath} does not exist`);
}

const walk = (directory) =>
  existsSync(directory)
    ? readdirSync(directory).flatMap((name) => {
        const path = resolve(directory, name);
        return lstatSync(path).isDirectory() ? walk(path) : [path];
      })
    : [];

const buildAssets = walk(resolve(output, "assets"))
  .map((path) => relative(output, path).replaceAll("\\", "/"))
  .sort();
const buildFiles = walk(output)
  .filter((path) => path !== serviceWorkerPath)
  .sort();
const fingerprintHash = createHash("sha256");
for (const path of buildFiles) {
  fingerprintHash.update(relative(output, path).replaceAll("\\", "/"));
  fingerprintHash.update(readFileSync(path));
}
const fingerprint = fingerprintHash.digest("hex").slice(0, 12);

let serviceWorker = readFileSync(serviceWorkerPath, "utf8");
serviceWorker = serviceWorker
  .replace("__BUILD_ID__", fingerprint)
  .replace(
    "/* BUILD_ASSETS */",
    buildAssets.map((path) => JSON.stringify(path)).join(",\n  "),
  );

if (/__BUILD_ID__|\/\* BUILD_ASSETS \*\//.test(serviceWorker)) {
  throw new Error("Cannot finalize PWA: service-worker placeholders remain");
}

writeFileSync(serviceWorkerPath, serviceWorker);
console.log(
  `Finalized PWA service worker ${fingerprint} with ${buildAssets.length} build assets.`,
);
