import { defineStore } from 'pinia'
import type { RssGroup, RssGroupItem } from '~/types/rss'

export const useRssGroup = defineStore('rssGroup', () => {
  const rssGroup = ref<RssGroup[] | undefined>()
  const localGroup = localStorage.getItem('RSS_GROUP')
  rssGroup.value = localGroup ? JSON.parse(localGroup) : undefined

  // eslint-disable-next-line @typescript-eslint/ban-types
  const currentGroup = ref<'default' | (string & {})>('default')
  const setCurrentGroup = (group: string) => currentGroup.value = group

  const addGroupItem = (name: string, items: RssGroupItem[]) => {
    if (!rssGroup.value) {
      rssGroup.value = [{
        name,
        items,
      }]
      localStorage.setItem('RSS_GROUP', JSON.stringify(rssGroup.value))
      return
    }

    const targetGroup = rssGroup.value.find(group => group.name === name)
    if (targetGroup) {
      rssGroup.value = rssGroup.value.map((group) => {
        return {
          ...group,
          items: group.name === name ? [...group.items, ...items] : group.items,
        }
      })
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
    if (!rssGroup.value)
      return

    rssGroup.value = rssGroup.value.map(group => ({
      ...group,
      items: group.items.filter(item => item.title !== itemTitle),
    }))
    localStorage.setItem('RSS_GROUP', JSON.stringify(rssGroup.value))
  }

  const removeGroup = (group: string) => {
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
