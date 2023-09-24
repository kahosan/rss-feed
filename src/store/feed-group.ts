import { defineStore } from 'pinia'
import type { FeedGroup, FeedGroupItem } from '~/types/feeds'

export const useFeedGroup = defineStore('feed-group', () => {
  const groups = ref<FeedGroup[]>([])
  const local = localStorage.getItem('FEED_GROUP')
  groups.value = local ? JSON.parse(local) : []

  // eslint-disable-next-line @typescript-eslint/ban-types
  const currentGroup = ref<'default' | (string & {})>('default')
  const setCurrentGroup = (group: string) => currentGroup.value = group

  const currentFeed = ref<string>()
  const setCurrentFeed = (feed: string | undefined) => currentFeed.value = feed

  const createGroup = (name: string, items: FeedGroupItem[]) => {
    groups.value = [...groups.value, { name, items }]
    localStorage.setItem('FEED_GROUP', JSON.stringify(groups.value))
  }

  const insertItem = (name: string, item: FeedGroupItem) => {
    if (!groups.value)
      throw new Error('group is undefined')

    groups.value = groups.value
      .map(group =>
        group.name === name
          ? {
              ...group,
              items: [...group.items, item],
            }
          : group,
      )
    localStorage.setItem('FEED_GROUP', JSON.stringify(groups.value))
  }

  const removeGroup = (name: string) => {
    groups.value = groups.value.filter(item => item.name !== name)
    localStorage.setItem('FEED_GROUP', JSON.stringify(groups.value))
  }

  const removeItem = (name: string, item: string) => {
    groups.value = groups.value
      .map(group =>
        group.name === name
          ? {
              ...group,
              items: group.items.filter(i => i.title !== item),
            }
          : group,
      )
    localStorage.setItem('FEED_GROUP', JSON.stringify(groups.value))
  }

  return {
    groups,
    currentGroup,
    setCurrentGroup,
    currentFeed,
    setCurrentFeed,
    createGroup,
    insertItem,
    removeGroup,
    removeItem,
  }
})
