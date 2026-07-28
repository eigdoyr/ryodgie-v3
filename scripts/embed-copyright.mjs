import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const ROOT = "src/assets/works";
const YEAR = new Date().getFullYear();

const IPTC = {
  creator: "Ryodgie Barnatia",
  copyright: `© ${YEAR} Ryodgie Barnatia. All rights reserved.`,
  credit: "ryodgie.com",
};

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (
      [".jpg", ".jpeg", ".png"].includes(extname(entry.name).toLowerCase())
    )
      yield p;
  }
}

let count = 0;
for await (const file of walk(ROOT)) {
  const buf = await sharp(file)
    .withMetadata({
      exif: {
        IFD0: {
          Copyright: IPTC.copyright,
          Artist: IPTC.creator,
          ImageDescription: IPTC.credit,
        },
      },
    })
    .toBuffer();
  await sharp(buf).toFile(file + ".tmp");
  const { rename } = await import("node:fs/promises");
  await rename(file + ".tmp", file);
  count++;
  console.log(`✓ ${file}`);
}
console.log(`\nEmbedded copyright in ${count} images.`);
