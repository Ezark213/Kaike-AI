import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { filterPublished } from '../lib/date-filter'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
  const articles = filterPublished(await getCollection('daily'))
  const sorted = articles.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  )

  return rss({
    title: 'Kaikei AI Daily',
    description: 'AI×会計の最新ニュースを毎日配信。CPA試験合格者が監修する実務に効くAI会計情報サイト。',
    site: context.site!.toString(),
    items: sorted.map((article) => ({
      title: article.data.title,
      pubDate: new Date(article.data.date),
      description: article.data.summary,
      link: `/daily/${article.slug}`,
    })),
    customData: '<language>ja</language>',
  })
}
