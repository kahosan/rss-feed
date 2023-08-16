<script lang="ts" setup>
import { NConfigProvider, darkTheme } from 'naive-ui'
import type { DataSource } from './types/source'
import type { RssData } from '~/types/rss'

const rssData = ref<RssData | null>(null)

const years = ref<number[]>([])
const tocYears = ref<number[]>([])

const changeYear = (year: number) => {
  years.value = tocYears.value.filter(y => y <= year)
}

const yearData = (year: number) => {
  const contents = []

  for (const content of rssData.value?.contents ?? []) {
    if (content.year === year)
      contents.push(content)
  }

  return contents
}

const source = ref<DataSource>('default')
const active = (s: DataSource) => source.value === s

const changeSource = (s: DataSource) => {
  source.value = s
}

const target = shallowRef<HTMLDivElement | null>(null)
const displayDataByYear = lazyData(target, years, 0, 1, { threshold: 0.1 })

const isHeaderVisible = ref(true)
const lastScrollPosition = ref(0)

const handleScroll = () => {
  const currentScrollPosition = document.documentElement.scrollTop

  if (currentScrollPosition > lastScrollPosition.value)
    isHeaderVisible.value = false
  else
    isHeaderVisible.value = true

  lastScrollPosition.value = currentScrollPosition
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  import('~/assets/rss_data.json').then((data) => {
    rssData.value = data
    years.value = [...new Set(data.contents.map(content => content.year))]
    tocYears.value = toValue(years)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : null">
    <VHeader :class="isHeaderVisible ? 'top-0' : 'top--14'" :change-source="changeSource" :active="active" :toc-years="tocYears" :change-year="changeYear" />
    <main mt-14 p-4>
      <div v-if="rssData?.contents" relative mx-auto max-w-6xl>
        <div v-if="source === 'default'">
          <div v-for="year in displayDataByYear" :key="year">
            <Years :year="year" :year-data="yearData(year)" />
          </div>
          <div ref="target" />
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
      <div v-else>
        数据加载中...
      </div>
    </main>
  </NConfigProvider>
</template>

<style>
</style>
