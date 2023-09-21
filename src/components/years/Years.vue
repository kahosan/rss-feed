<script lang="ts" setup>
import type { RssData } from '~/types/rss'

const props = defineProps<{ year: number; yearData: RssData['contents'] }>()
const { yearData } = toRefs(props)

const months = yearData.value.map(content => content.month)

function getMonthData(month: number) {
  const entries = []

  for (const content of yearData.value) {
    if (content.month === month)
      entries.push(...content.entries)
  }

  return entries
}
</script>

<template>
  <div mb-16 md:flex="~">
    <h1 mb-2 text-7xl md:write-vertical-right>
      {{ year }}
    </h1>
    <div flex-1 overflow-hidden>
      <div v-for="month in months" :key="month" mb-8>
        <MonthsDay :month-day-data="getMonthData(month)" />
      </div>
    </div>
  </div>
</template>
