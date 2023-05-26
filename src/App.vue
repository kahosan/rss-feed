<script lang="ts" setup>
import type { source } from './types/source'
import type { RssData } from '~/types/rss'

import rss_data from '~/assets/rss_data.json'

const rssData = rss_data as unknown as RssData ?? {}

const years = Object.keys(rssData.contents ?? []).sort((a, b) => +b - +a)

const yearData = (year: string) => {
  // key must be a string literal
  return rssData.contents?.[year]
}

const dataSource = ref<source>('default')
const active = (s: 'default' | 'unknownDate' | 'unknownURI') => dataSource.value === s

const changeSource = (s: typeof dataSource.value) => {
  dataSource.value = s
}
</script>

<template>
  <VHeader :change-source="changeSource" :active="active" />
  <main p-4>
    <div v-if="rssData.contents" relative mx-auto max-w-6xl>
      <div v-if="dataSource === 'default'">
        <div v-for="year in years" :key="year">
          <Years :year="year" :year-data="yearData(year)" />
        </div>
      </div>
      <div v-else-if="dataSource === 'unknownDate'">
        <UnknownDate :data="rssData.unknownDate" />
      </div>
      <div v-else-if="dataSource === 'unknownURI'">
        <UnknownURI :data="rssData.unknownURI" />
      </div>
    </div>
    <div v-else>
      没有数据
    </div>
  </main>
</template>
