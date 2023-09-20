import { defineStore } from 'pinia'
import { useRssData } from './rss-data'
import type { RssGroup, RssGroupItem } from '~/types/rss'

export const useRssGroup = defineStore('rssGroup', () => {
  const rssGroup = ref<RssGroup[] | undefined>()
  const localGroup = localStorage.getItem('RSS_GROUP')
  rssGroup.value = localGroup ? JSON.parse(localGroup) : undefined

  const rss = useRssData()

  const currentGroup = ref('default')
  const setCurrentGroup = (group: string) => currentGroup.value = group

  const addGroupItem = (name: string, items: RssGroupItem[]) => {
    items.forEach((item) => {
      rss.rssData?.contents.forEach((content) => {
        const entry = content.entries.find(entry => entry.siteTitle === item.title)
        if (entry)
          entry.groupBy = name
      })
    })

    if (!rssGroup.value) {
      rssGroup.value = [
        {
          name,
          items,
        },
      ]
      localStorage.setItem('RSS_GROUP', JSON.stringify(rssGroup.value))
      return
    }

    const group = rssGroup.value.find(group => group.name === name)
    if (group) {
      group.items = [...new Set([...group.items, ...items])]
    }
    else {
      rssGroup.value.push({
        name,
        items,
      })
    }
    localStorage.setItem('RSS_GROUP', JSON.stringify(rssGroup.value))
  }

  const removeGroupItem = (itemTitle: string) => {
    rss.rssData?.contents.forEach((content) => {
      const entry = content.entries.find(entry => entry.siteTitle === itemTitle)
      if (entry)
        entry.groupBy = undefined
    })

    if (!rssGroup.value)
      return

    const group = rssGroup.value.find(group => group.items.find(item => item.title === itemTitle))
    if (!group) {
      console.error(`can't find group for item ${itemTitle}`)
      return
    }

    group.items = group.items.filter(item => item.title !== itemTitle)
    localStorage.setItem('RSS_GROUP', JSON.stringify(rssGroup.value))
  }

  const removeGroup = (group: string) => {
    rss.rssData?.contents.forEach((content) => {
      content.entries.forEach((entry) => {
        if (entry.groupBy === group)
          entry.groupBy = undefined
      })
    })

    if (!rssGroup.value)
      return

    rssGroup.value = rssGroup.value.filter(g => g.name !== group)
    localStorage.setItem('RSS_GROUP', JSON.stringify(rssGroup.value))
  }

  return {
    rssGroup,
    currentGroup,
    setCurrentGroup,
    addGroupItem,
    removeGroupItem,
    removeGroup,
  }
})
