<script lang="ts" setup>
import { NConfigProvider, darkTheme } from 'naive-ui'
import type { DataSource } from './types/source'
import type { RssData } from '~/types/rss'

import rss_data from '~/assets/rss_data.json'

const rssData = rss_data as unknown as RssData ?? {}

const years = ref([...new Set(rss_data.contents.map(content => content.year))])

const tocYears = toValue(years)
const changeYear = (year: number) => {
  years.value = tocYears.filter(y => y <= year)
}

const yearData = (year: number) => {
  const contents = []

  for (const content of rssData.contents) {
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

const target = ref<HTMLDivElement | null>(null)
const displayDataByYear = computed(() => lazyData(target, years.value, 0, 1, { threshold: 0.1 }).value)
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : null">
    <VHeader :change-source="changeSource" :active="active" :toc-years="tocYears" :change-year="changeYear" />
    <main p-4>
      <div v-if="rssData.contents" relative mx-auto max-w-6xl>
        <div v-if="source === 'default'">
          <div v-for="year in displayDataByYear" :key="year">
            <Years :year="year" :year-data="yearData(year)" />
          </div>
          <div ref="target" />
        </div>
        <div v-else-if="source === 'search'">
          <SearchData />
        </div>
        <div v-else-if="source === 'unknownDate'">
          <UnknownDate :data="rssData.unknownDate" />
        </div>
        <div v-else-if="source === 'unknownURI'">
          <UnknownURI :data="rssData.unknownURI" />
        </div>
      </div>
      <div v-else>
        没有数据
      </div>
    </main>
  </NConfigProvider>
</template>
