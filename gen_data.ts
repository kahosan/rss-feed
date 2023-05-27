import { writeFile } from 'fs/promises'

import type { FeedData, FeedEntry } from '@extractus/feed-extractor'
import { extract } from '@extractus/feed-extractor'

import ky from 'ky'
import plimit from 'p-limit'
import { getDate, getMonth, getYear } from 'date-fns'

import cache from 'cache.json'
import rss from 'rss.json'
import rss_manual from 'rss_manual.json'

import type { RssData } from '~/types/rss'

interface F extends Required<FeedData> {
  entries: (Required<FeedEntry> & { content: string })[]
}

const limit = plimit(4)

const headers = new Headers({
  'User-Agent': 'YJSNPI-RSS-Reader/1.0',
  'Origin': 'https://www.google.com',
  'Referer': 'https://www.google.com/',
})

async function detectRssLink(uri: string) {
  const html = await ky.get(uri, { headers, timeout: 20 * 1000 }).text()

  const reg = /(?<=href=["/]"?).+?(?=["> ])/gm

  const sp = ['atom', 'feed', 'rss']

  const rssLink = html.match(reg)?.find(link => sp.some(sp => link.includes(sp)))

  if (rssLink)
    return new URL(rssLink, uri).href
}

const r = rss.map(uri => limit(async () => {
  const cacheLink = cache.find(c => uri.includes(new URL(c).hostname))
  if (cacheLink)
    return cacheLink

  try {
    const link = await detectRssLink(uri)
    if (!link)
      return `[ERROR-MESSAGE] | detect rss link not found | ${uri}`

    return link
  }
  catch (e: any) {
    return `[ERROR-MESSAGE] | ${e.message} | ${uri}`
  }
}))

const rss_link = [...new Set([...rss_manual, ...await Promise.all(r)])]

const cacheTemp: string[] = []
const result: RssData = { unknownURI: [], unknownDate: [], contents: [] }

const requests = rss_link.map(uri => limit(async () => {
  if (uri.startsWith('[ERROR-MESSAGE]')) {
    result.unknownURI.push(uri)
    return
  }

  try {
    const rssData = await extract(uri, {
      getExtraEntryFields(entryData: any) {
        const { pubDate, published, updated } = entryData

        return {
          published: pubDate ?? published ?? updated,
          content: entryData['content:encoded'],
        }
      },
    }, { headers }) as F

    // add to cache
    if (!cache.find(c => c.includes(uri)) || rss_manual.includes(uri))
      cacheTemp.push(uri)

    const siteTitle = rssData.title
    const siteLink = rssData.link

    rssData.entries.forEach((entry) => {
      const date = new Date(entry.published ?? '')
      const year = getYear(date)
      const month = getMonth(date) + 1
      const dateDay = getDate(date)

      const id = entry.id
      const postTitle = entry.title
      const postLink = entry.link
      const published = entry.published
      const description = entry.description ?? entry.content

      if (!year || !month) {
        result.unknownDate.push({
          id,
          siteTitle,
          siteLink,
          postTitle,
          postLink,
          description: description?.slice(0, 100),
        })
        return
      }

      const content = result.contents.find(c => c.year === year && c.month === month)
      const monthDay = `${month > 9 ? month : `0${month}`}-${dateDay > 9 ? dateDay : `0${dateDay}`}`

      if (!content) {
        result.contents.push({
          year,
          month,
          entries: [{
            id,
            siteTitle,
            siteLink,
            postTitle,
            postLink,
            published,
            description,
            monthDay,
          }],
        })
      }
      else {
        content.entries.push({
          id,
          siteTitle,
          siteLink,
          postTitle,
          postLink,
          published,
          description,
          monthDay,
        })
      }
    })
  }
  catch (e: any) {
    result.unknownURI.push(`[ERROR-MESSAGE] | ${e.message} | ${uri}`)
  }
}))

await Promise.all(requests)

result.contents.sort((a, b) => b.year - a.year || b.month - a.month)
result.contents.forEach(c => c.entries.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()))

await writeFile(new URL('src/assets/rss_data.json', import.meta.url), JSON.stringify(result, null, 2))
await writeFile(new URL('cache.json', import.meta.url), JSON.stringify([...cache, ...cacheTemp], null, 2))
