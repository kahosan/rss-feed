import { defineStore, storeToRefs } from 'pinia'
import { useRssGroup } from './rss-group'
import type { RssData, RssEntry } from '~/types/rss'

export const useRssData = defineStore('rssData', () => {
  const rssData = ref<RssData | undefined>()

  const { rssGroup } = storeToRefs(useRssGroup())

  import ('~/assets/rss_data.json')
    .then((data) => {
      rssData.value = data
    })

  watchEffect(() => {
    if (!rssGroup.value || !rssData.value)
      return

    for (const content of rssData.value.contents) {
      for (const entry of content.entries) {
        const targetGroup = rssGroup.value.find(group => group.items.find(item => item.title === entry.siteTitle))
        entry.groupBy = targetGroup?.name
      }
    }
  })

  const rssDataByGroup = (group: string, rssData: RssData | undefined) => {
    const groupData: RssEntry[] = []

    if (!rssData)
      return groupData

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
