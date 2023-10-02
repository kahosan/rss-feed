import { defineStore } from 'pinia'
import { useFeedGroup } from './feed-group'

import type { Feed, FeedCollect, RssData } from '~/types/feeds'

export const useRssData = defineStore('rss-data', () => {
  const data = ref<RssData | undefined>()
  const contents = ref<Feed[]>([])
  const collects = ref<FeedCollect[]>([])

  const feedGroup = useFeedGroup()

  import ('~/assets/rss_data.json')
    .then((value) => {
      data.value = value
      contents.value = value.contents
      collects.value = value.collects
    })

  watchEffect(() => {
    contents.value = contents.value.map((feed) => {
      const item = feedGroup.groups
        .find(group => group.items
          .find(item => item.title === feed.feedTitle))

      if (item) {
        feed.groupBy = item.name
        feed.hidden = item.items.at(0)?.hidden
      }
      else {
        feed.groupBy = undefined
        feed.hidden = undefined
      }

      return feed
    })
  })

  watchEffect(() => {
    collects.value = collects.value.map((collect) => {
      const feed = feedGroup.groups.find(group => group.items.find(item => item.title === collect.title))

      if (feed)
        collect.groupBy = feed.name
      else
        collect.groupBy = undefined

      return collect
    })
  })

  const fetchGroupedFeeds = (group: string) => {
    const groupedFeeds: Feed[] = []

    if (!data.value)
      return groupedFeeds

    for (const feed of data.value.contents) {
      if (group === feed.groupBy)
        groupedFeeds.push(feed)
    }

    return groupedFeeds
  }

  const fetchFeed = (title: string): Feed[] => {
    if (!data.value)
      return []

    return data.value.contents.filter(feed => feed.feedTitle === title)
  }

  return {
    data,
    contents,
    collects,
    fetchFeed,
    fetchGroupedFeeds,
  }
})
