import { writeFile } from 'node:fs/promises'

import type { FeedData, FeedEntry } from '@extractus/feed-extractor'
import { extract } from '@extractus/feed-extractor'

import plimit from 'p-limit'

import feeds from 'feeds.json'

import type { RssData } from '~/types/feeds'

interface F extends Required<FeedData> {
  entries: (Required<FeedEntry> & { content: string })[]
}

const limit = plimit(4)

const headers = {
  'User-Agent': 'YJSNPI-RSS-Reader/1.0',
  'Origin': 'https://www.google.com',
  'Referer': 'https://www.google.com/',
}

const rss_data: RssData = { unknownURL: [], unknownDate: [], contents: [], collects: [] }

const requests = feeds.map(feed_url => limit(async () => {
  const u = new URL(feed_url)
  const base_url = `${u.protocol}//${u.hostname}`

  try {
    const feed_data = await extract(feed_url, {
      baseUrl: base_url,
      getExtraEntryFields(entryData: any) {
        const { pubDate, published, updated } = entryData

        return {
          published: pubDate ?? published ?? updated,
          content: entryData['content:encoded'],
        }
      },
    }, { headers, signal: AbortSignal.timeout(20 * 1000) }) as F

    rss_data.collects.push({
      title: feed_data.title,
      link: feed_data.link,
    })

    for (const entry of feed_data.entries) {
      const description = entry.description ?? entry.content

      const feed_item = {
        id: entry.id,
        feedTitle: feed_data.title,
        feedLink: feed_data.link,
        postTitle: entry.title,
        postLink: entry.link,
        postDescription: description,
      }

      if (!entry.published) {
        rss_data.unknownDate.push(feed_item)
        continue
      }

      rss_data.contents.push({
        ...feed_item,
        postPublished: (entry.published as unknown as string).replace('&#43;', '+'),
      })
    }
  }
  catch (e: any) {
    rss_data.unknownURL.push(`[ERROR-MESSAGE] | ${e.message} | ${feed_url}`)
  }
}))

await Promise.all(requests)

rss_data.contents.sort((a, b) => new Date(b.postPublished).getTime() - new Date(a.postPublished).getTime())

await writeFile(new URL('src/assets/rss_data.json', import.meta.url), JSON.stringify(rss_data, null, 2))
