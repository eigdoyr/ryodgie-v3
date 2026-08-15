import rss from "@astrojs/rss";
import { getWall, descriptorOf } from "../lib/works";

export async function GET(context) {
  const works = await getWall();

  // newest first for the feed
  const byDate = [...works].sort((a, b) =>
    b.data.createdAt.localeCompare(a.data.createdAt),
  );

  return rss({
    title: "Ryodgie Barnatia",
    description:
      "A wall of design work — live coded websites, editorial, type, and design experiments.",
    site: context.site,
    items: byDate.map((work) => ({
      title: work.data.title,
      pubDate: new Date(work.data.createdAt),
      description: `${work.data.title} — ${descriptorOf(work)}, ${work.data.year}`,
      link: `/work/${work.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
