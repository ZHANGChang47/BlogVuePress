import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 76 篇文章由 scripts/migrate.mjs 从原 VuePress 项目迁入。
// code 就是原 frontmatter permalink 里的 6 位短码，文件名也用它，
// 保证 /pages/<code>/ 这条 URL 与线上旧收录逐字一致。
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    code: z.string().regex(/^[0-9a-f]{6}$/),
    permalink: z.string(),
    section: z.string(),
    sortKey: z.string().default(''),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    words: z.number().default(0),
    excerpt: z.string().default(''),
  }),
});

export const collections = { posts };
