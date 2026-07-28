import { getCollection, type CollectionEntry } from "astro:content";

export type Work = CollectionEntry<"works">;

export async function getWorks(): Promise<Work[]> {
  return getCollection("works", ({ data }) => data.visible);
}
export async function getWall(): Promise<Work[]> {
  return (await getWorks()).sort((a, b) => a.data.order - b.data.order);
}
