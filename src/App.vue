<script lang="ts" setup>
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import { storeToRefs } from 'pinia'

import type { DataSource } from './types/source'

import { useRssGroup } from './store/rss-group'
import type { RssEntry } from './types/rss'
import { useRssData } from '~/store/rss-data'

const { rssData } = storeToRefs(useRssData())
const { rssDataByGroup } = useRssData()
const { currentGroup } = storeToRefs(useRssGroup())

const years = ref<number[]>([])
const tocYears = ref<number[]>([])

watchEffect(() => {
  years.value = [...new Set(rssData.value?.contents.map(content => content.year))]
  tocYears.value = toValue(years)
})

// const changeYear = (year: number) => {
//   years.value = tocYears.value.filter(y => y <= year)
// }

function yearData(year: number) {
  const contents = []

  for (const content of rssData.value?.contents ?? []) {
    if (content.year === year)
      contents.push(content)
  }

  return contents
}

const source = ref<DataSource>('default')
const active = (s: DataSource) => source.value === s

function changeSource(s: DataSource) {
  source.value = s
}

const defaultTarget = shallowRef<HTMLDivElement | null>(null)
const displayDataByYear = lazyData(defaultTarget, years, 0, 1, { threshold: 0.1 })

const isSideBarVisible = ref(false)
function toggleSideBarVisible() {
  isSideBarVisible.value = !isSideBarVisible.value
}

const rssGroupData = ref<RssEntry[]>([])
const groupTarget = shallowRef<HTMLDivElement | null>(null)

watchEffect(() => {
  if (rssData.value)
    rssGroupData.value = rssDataByGroup(currentGroup.value, rssData.value)
})

const displayDataByGroup = lazyData(groupTarget, rssGroupData, 20, 10, { threshold: 0.1, rootMargin: '0px 0px 100px 0px' })
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : null">
    <NMessageProvider>
      <VHeader :change-source="changeSource" :active="active" :is-side-bar-visible="isSideBarVisible" :toggle-side-bar-visible="toggleSideBarVisible" />
      <SideBar :is-side-bar-visible="isSideBarVisible" />
      <main p-4 pt-16 md:ml-80>
        <div v-if="rssData?.contents" relative mx-auto max-w-6xl min-w-0 flex-1>
          <div v-if="source === 'default'">
            <div v-show="currentGroup === 'default'">
              <div v-for="year in displayDataByYear" :key="year">
                <Years :year="year" :year-data="yearData(year)" />
              </div>
              <div ref="defaultTarget" />
            </div>
            <div v-show="currentGroup !== 'default'">
              <DataView date-type="year" :display-data="displayDataByGroup" />
              <div ref="groupTarget" />
            </div>
          </div>
          <div v-else-if="source === 'search'">
            <SearchData :contents="rssData.contents" />
          </div>
          <div v-else-if="source === 'unknownDate'">
            <UnknownDate :data="rssData.unknownDate" />
          </div>
          <div v-else-if="source === 'unknownURI'">
            <UnknownURI :data="rssData.unknownURI" />
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
