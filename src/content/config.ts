import { defineCollection, z } from 'astro:content'

const daily = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    sources: z.array(z.object({
      name: z.string(),
      url: z.string().optional(),
    })).optional(),
    cpaComment: z.string().optional(),
  }),
})

const deepDive = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    category: z.enum(['analysis', 'tutorial', 'opinion']).default('analysis'),
  }),
})

const tips = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    tool: z.string().optional(),
  }),
})

const weekly = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    weekStart: z.string(),
    weekEnd: z.string(),
  }),
})

export const collections = { daily, 'deep-dive': deepDive, tips, weekly }
