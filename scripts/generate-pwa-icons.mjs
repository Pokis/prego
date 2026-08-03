import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const iconDirectory = resolve("public/icons");
const source = resolve(iconDirectory, "app-icon.svg");

await mkdir(iconDirectory, { recursive: true });

for (const [name, size] of [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["icon-maskable-512.png", 512],
  ["apple-touch-icon.png", 180],
]) {
  await sharp(source)
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9, palette: true })
    .toFile(resolve(iconDirectory, name));
  console.log(`Generated public/icons/${name}`);
}
