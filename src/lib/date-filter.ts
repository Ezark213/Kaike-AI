/**
 * Filter out future-dated articles from collections.
 * Articles with a date after today (JST) should not be published.
 */
export function filterPublished<T extends { data: { date: string } }>(articles: T[]): T[] {
  const now = new Date()
  // Use JST (UTC+9) for date comparison since the site targets Japanese readers
  const todayJST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
  todayJST.setHours(23, 59, 59, 999)

  return articles.filter(a => new Date(a.data.date) <= todayJST)
}
