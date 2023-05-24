import { readFileSync, writeFileSync } from 'node:fs'

import type { FeedData, FeedEntry } from '@extractus/feed-extractor'
import { extract } from '@extractus/feed-extractor'

import ky from 'ky'
import plimit from 'p-limit'
import { getDate, getMonth, getYear } from 'date-fns'

import rss from 'rss.json'
import rss_manual from 'rss_manual.json'

import type { RssData } from '~/types/rss'

interface F extends Required<FeedData> {
  entries: Required<FeedEntry>[]
}

const limit = plimit(4)

async function detectRssLink(uri: string) {
  const headers = new Headers({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
    'Origin': 'https://www.google.com',
    'Referer': 'https://www.google.com/',
  })
  const html = await ky.get(uri, { headers, timeout: 20 * 1000 }).text()

  const reg = /(?<=href=["/]"?).+?(?=["> ])/gm

  // const sp = ['/atom.xml', '/feed.xml', '/rss.xml', '/rss', '/feed', '/atom', 'rss', 'atom', 'feed', 'rss.xml', 'atom.xml', 'feed.xml', '/atom/', '/feed/', '/rss/', 'index.xml', '/index.xml', '/blog/rss.xml', '/rss', 'rss', '/RSS', 'RSS']
  const sp = ['atom', 'feed', 'rss', 'RSS', 'index.xml']

  const rssLink = html.match(reg)?.find(link => sp.some(sp => link.includes(sp)))

  if (rssLink)
    return new URL(rssLink, uri).href
}

const cache = JSON.parse(readFileSync('./cache.json', 'utf-8')) as string[]

const r = rss.map(uri => limit(async () => {
  const cacheLink = cache.find(c => uri.includes(c))
  if (cacheLink)
    return cacheLink

  try {
    const link = await detectRssLink(uri)
    if (!link)
      return `[ERROR]-${uri}`

    return link
  }
  catch (e: any) {
    return `[ERROR]-${uri}`
  }
}))

const rss_link = [...rss_manual, ...await Promise.all(r)]

const cacheTemp: string[] = []
const result: RssData = { unknownURI: [], unknownDate: [], contents: {} }

const requests = rss_link.map(uri => limit(async () => {
  if (uri.startsWith('[ERROR]')) {
    result.unknownURI.push(uri.replace('[ERROR]-', ''))
    return
  }

  try {
    const rssData = await extract(uri) as F

    // add to cache
    if (!cache.find(c => uri.includes(c)))
      cacheTemp.push(uri)

    const siteTitle = rssData.title
    const siteLink = rssData.link

    rssData.entries.forEach((entry) => {
      const date = new Date(entry.published ?? '')
      const year = getYear(date)
      const month = getMonth(date) + 1
      const dateDay = getDate(date)
      const monthDay = `${month > 9 ? month : `0${month}`}-${dateDay > 9 ? dateDay : `0${dateDay}`}`

      const id = entry.id
      const postTitle = entry.title
      const postLink = entry.link
      const published = entry.published
      const description = entry.description

      if (!year || !monthDay) {
        result.unknownDate.push({
          id,
          siteTitle,
          siteLink,
          postTitle,
          postLink,
          description,
        })
        return
      }

      result.contents[year] ??= {}
      result.contents[year][monthDay] ??= { entries: [] }

      result.contents[year][monthDay].entries.push({
        id,
        siteTitle,
        siteLink,
        postTitle,
        postLink,
        published,
        description,
      })
    })
  }
  catch {
    result.unknownURI.push(uri)
  }
}))

await Promise.all(requests)
writeFileSync('./src/assets/rss_data.json', JSON.stringify(result, null, 2))
writeFileSync('./cache.json', JSON.stringify([...cache, ...cacheTemp], null, 2))
