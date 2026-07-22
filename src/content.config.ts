import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const works = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/works" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      medium: z.enum(["web", "editorial", "poster", "motion", "brand", "type"]),
      series: z.string().optional(),
      fonts: z.array(z.string()),
      year: z.number(),
      createdAt: z.string(),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            weight: z.number().default(1),
          }),
        )
        .min(1)
        .max(4),
      liveUrl: z.url().optional(),
      concept: z.boolean().default(false),
      visible: z.boolean().default(true),
      order: z.number(),
      tags: z.array(z.string()).default([]),
      colors: z.array(z.string()).default([]),
    }),
});

export const collections = { works };
