import { defineStore } from 'pinia'
import type { RssData, RssEntry } from '~/types/rss'

export const useRssData = defineStore('rssData', () => {
  const rssData = ref<RssData | undefined>()

  import ('~/assets/rss_data.json')
    .then((data) => {
      rssData.value = data

      const localGroup = localStorage.getItem('RSS_GROUP')
      if (!localGroup)
        return

      const rssGroup = JSON.parse(localGroup)

      for (const group of rssGroup) {
        for (const item of group.items) {
          rssData.value.contents.forEach((content) => {
            content.entries
              .filter(entry => entry.siteTitle === item.title)
              .forEach(entry => entry.groupBy = group.name)
          })
        }
      }
    })

  const rssDataByGroup = (group: string, rssData: RssData) => {
    const groupData: RssEntry[] = []
    for (const content of rssData.contents) {
      content.entries.reduce((acc, entry) => {
        if (entry.groupBy?.includes(group) || entry.siteTitle === group)
          acc.push(entry)

        return acc
      }, groupData)
    }

    return groupData
  }

  return {
    rssData,
    rssDataByGroup,
  }
})
