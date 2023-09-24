import { writeFile } from 'node:fs/promises'

import type { FeedData, FeedEntry } from '@extractus/feed-extractor'
import { extract } from '@extractus/feed-extractor'

import got from 'got'
import plimit from 'p-limit'

import cache from 'cache.json'

import feed_list from 'feed_list.json'
import feed_manual from 'feed_manual.json'

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

async function detect_feed_link(uri: string) {
  const html = await got.get(uri, { headers, timeout: { request: 20 * 1000 } }).text()

  const reg = /(?<=href=["/]"?).+?(?=["> ])/gm

  const sp = ['atom', 'feed', 'rss']

  const feed_link = html.match(reg)?.find(link => sp.some(sp => link.includes(sp)))

  if (feed_link)
    return new URL(feed_link, uri).href
}

const feed = feed_list.map(feed_url => limit(async () => {
  const cache_link = cache.find(c => feed_url.includes(new URL(c).hostname))
  if (cache_link)
    return cache_link

  try {
    const feed_link = await detect_feed_link(feed_url)
    if (!feed_link)
      return `[ERROR-MESSAGE] | detect feed link not found | ${feed_url}`

    return feed_link
  }
  catch (e: any) {
    return `[ERROR-MESSAGE] | ${e.message} | ${feed_url}`
  }
}))

const feed_collect = [...new Set([...feed_manual, ...await Promise.all(feed)])]

const cache_temp: string[] = []
const rss_data: RssData = { unknownURL: [], unknownDate: [], contents: [], collects: [] }

const requests = feed_collect.map(feed_url => limit(async () => {
  if (feed_url.startsWith('[ERROR-MESSAGE]')) {
    rss_data.unknownURL.push(feed_url)
    return
  }

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

    // add to cache
    if (!cache.find(c => c === feed_url || feed_manual.includes(feed_url)))
      cache_temp.push(feed_url)

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
        postPublished: entry.published,
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
await writeFile(new URL('cache.json', import.meta.url), JSON.stringify([...cache, ...cache_temp], null, 2))
