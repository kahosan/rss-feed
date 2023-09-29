<script lang="ts" setup>
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import { storeToRefs } from 'pinia'

import type { DataSource } from './types/source'

import { useFeedGroup } from './store/feed-group'
import type { Feed } from './types/feeds'
import { useRssData } from '~/store/rss-data'

const { data, contents } = storeToRefs(useRssData())
const { fetchGroupedFeeds, fetchFeed } = useRssData()
const { currentGroup, currentFeed } = storeToRefs(useFeedGroup())

const source = ref<DataSource>('default')
const active = (s: DataSource) => source.value === s

function changeSource(s: DataSource) {
  source.value = s
}

const target = shallowRef<HTMLDivElement | null>(null)
const lazyFeeds = ref<Feed[]>([])
watchEffect(() => {
  lazyFeeds.value = lazyData(target, contents, 20, 20).value
})

const isSideBarVisible = ref(false)
function toggleSideBarVisible() {
  isSideBarVisible.value = !isSideBarVisible.value
}

const feedGroupData = computed(() => {
  if (currentFeed.value)
    return fetchFeed(currentFeed.value)

  return fetchGroupedFeeds(currentGroup.value)
})

watch(
  currentGroup,
  () => scrollTo(0, 0),
)

const groupShow = computed(() => {
  return currentGroup.value !== 'default' || !!currentFeed.value
})
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : null">
    <NMessageProvider>
      <VHeader :change-source="changeSource" :active="active" :is-side-bar-visible="isSideBarVisible" :toggle-side-bar-visible="toggleSideBarVisible" />
      <SideBar :is-side-bar-visible="isSideBarVisible" />
      <main p-4 pt-20 md:ml-80>
        <div v-if="data" relative mx-auto max-w-6xl min-w-0 flex-1>
          <div v-if="source === 'default'">
            <div v-show="currentGroup === 'default'">
              <DataView :group="false" :feeds="lazyFeeds" />
              <div ref="target" />
            </div>
            <div v-show="groupShow">
              <DataView :group="true" :feeds="feedGroupData" />
            </div>
          </div>
          <div v-else-if="source === 'search'">
            <SearchData :contents="data.contents" />
          </div>
          <div v-else-if="source === 'unknownDate'">
            <UnknownDate :data="data.unknownDate" />
          </div>
          <div v-else-if="source === 'unknownURL'">
            <UnknownURL :data="data.unknownURL" />
          </div>
        </div>
        <div v-else mx-auto max-w-6xl>
          数据加载中...
        </div>
      </main>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style>
</style>
