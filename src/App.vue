<script lang="ts" setup>
import type { DataSource } from './types/source'
import type { RssData } from '~/types/rss'

import rss_data from '~/assets/rss_data.json'

const rssData = rss_data as unknown as RssData ?? {}

const years = Object.keys(rssData.contents ?? []).sort((a, b) => +b - +a)

const yearData = (year: string) => {
  return rssData.contents[year]
}

const source = ref<DataSource>('default')
const active = (s: 'default' | 'unknownDate' | 'unknownURI') => source.value === s

const changeSource = (s: typeof source.value) => {
  source.value = s
}
</script>

<template>
  <VHeader :change-source="changeSource" :active="active" />
  <main p-4>
    <div v-if="rssData.contents" relative mx-auto max-w-6xl>
      <div v-if="source === 'default'">
        <div v-for="year in years" :key="year">
          <Years :year="year" :year-data="yearData(year)" />
        </div>
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
</template>
