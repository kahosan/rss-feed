import { defineStore } from 'pinia'
import type { FeedGroup, FeedGroupItem } from '~/types/feeds'

export const useFeedGroup = defineStore('feed-group', () => {
  const groups = useStorage<FeedGroup[]>('feed-group', [])

  const currentGroup = ref<'default' | (string & {})>('default')
  const setCurrentGroup = (group: string) => currentGroup.value = group

  const currentFeed = ref<string>()
  const setCurrentFeed = (feed: string | undefined) => currentFeed.value = feed

  const createGroup = (name: string, items: FeedGroupItem[]) => {
    groups.value = [...groups.value, { name, items }]
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
  }

  const removeGroup = (name: string) => {
    groups.value = groups.value.filter(item => item.name !== name)
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
