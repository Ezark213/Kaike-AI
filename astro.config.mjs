import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://kaikei-ai.jp',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/tags/'),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
})
