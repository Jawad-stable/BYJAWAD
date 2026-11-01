// Builds the web-sized images the site uses from the originals in ../assets.
// Run with `npm run media` after replacing a source photo.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(here, "../../assets/images");
const out = path.resolve(here, "../public/media");
await mkdir(out, { recursive: true });

const jobs = [
  // Low-key studio portrait for the About card.
  { src: "Main Photo.png", dest: "portrait-moody.webp", width: 1100, quality: 80 },
  // Social share card.
  { src: "Main Photo2.png", dest: "og.jpg", width: 1200, height: 630, fit: "cover", position: "top", format: "jpeg" },
];

for (const job of jobs) {
  let img = sharp(path.join(assets, job.src)).resize({ width: job.width, height: job.height, fit: job.fit || "inside", position: job.position });
  img = job.format === "jpeg" ? img.jpeg({ quality: 82, mozjpeg: true }) : img.webp({ quality: job.quality || 80 });
  const info = await img.toFile(path.join(out, job.dest));
  console.log(`${job.dest}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
