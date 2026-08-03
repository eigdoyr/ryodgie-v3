import { readdir, rename } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const ROOT = "src/assets/works";
const YEAR = new Date().getFullYear();

const META = {
  Copyright: `© ${YEAR} Ryodgie Barnatia. All rights reserved.`,
  Artist: "Ryodgie Barnatia",
  ImageDescription: "ryodgie.com",
};

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (
      [".jpg", ".jpeg", ".png"].includes(extname(entry.name).toLowerCase())
    ) {
      yield p;
    }
  }
}

let count = 0;
let skipped = 0;
for await (const file of walk(ROOT)) {
  // skip if already stamped
  const meta = await sharp(file).metadata();
  const existing = meta.exif ? meta.exif.toString("latin1") : "";
  if (existing.includes("Ryodgie Barnatia")) {
    skipped++;
    continue;
  }

  const tmp = file + ".tmp";
  await sharp(file)
    .withMetadata({ exif: { IFD0: { ...META } } })
    .toFile(tmp);
  await rename(tmp, file);
  count++;
  console.log(`✓ ${file}`);
}

console.log(
  `\nStamped ${count} new images, skipped ${skipped} already stamped.`,
);
