import { getCollection, type CollectionEntry } from "astro:content";

export type Work = CollectionEntry<"works">;

export async function getWorks(): Promise<Work[]> {
  return getCollection("works", ({ data }) => data.visible);
}
export async function getWall(): Promise<Work[]> {
  return (await getWorks()).sort((a, b) => a.data.order - b.data.order);
}

export const descriptorOf = (w: Work) =>
  w.data.concept ? `${w.data.medium} concept` : w.data.medium;

export async function getNeighbors(id: string) {
  const wall = await getWall();
  const i = wall.findIndex((w) => w.id === id);
  return {
    prev: i > 0 ? wall[i - 1] : null,
    next: i >= 0 && i < wall.length - 1 ? wall[i + 1] : null,
  };
}
