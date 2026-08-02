import sharp from "sharp";

const input = process.argv[2] || "public/og.png";
const output = process.argv[3] || "public/og.webp";

await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .webp({ quality: 84, effort: 6 })
  .toFile(output);

console.log(`Optimized ${input} -> ${output}`);
