import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// /guides — long-form how-to articles (Markdown in src/content/guides).
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tool: z.string(), // primary related tool href, e.g. /merge-pdf
    toolLabel: z.string(), // CTA label
    readMins: z.number(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { guides };
