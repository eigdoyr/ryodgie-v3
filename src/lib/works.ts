import { getCollection, type CollectionEntry } from "astro:content";

export type Work = CollectionEntry<"works">;

export async function getWall(): Promise<Work[]> {
  const works = await getCollection("works", ({ data }) => data.visible);
  return works.sort((a, b) => a.data.order - b.data.order);
}
