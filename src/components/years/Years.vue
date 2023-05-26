<script lang="ts" setup>
import type { RssMonth } from '~/types/rss'

const props = defineProps<{ year: string; yearData: RssMonth }>()

const timestamps = Object.keys(props.yearData).sort((a, b) => +b - +a)

const getMonthData = (timestamp: string) => props.yearData[timestamp].entries

const displayData = ref<string[]>(timestamps.slice(0, 15))
const chunkSize = 10

const loadMore = () => {
  const currentLength = displayData.value.length
  const newData = timestamps.slice(currentLength, currentLength + chunkSize)
  displayData.value.push(...newData)
}

// 分段加载数据
const observer = ref<IntersectionObserver | null>(null)
const target = ref<HTMLDivElement | null>(null)

const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting)
      loadMore()
  })
}

onMounted(() => {
  observer.value = new IntersectionObserver(intersectionCallback, { threshold: 0.1 })
  if (target.value)
    observer.value.observe(target.value)
})

onUnmounted(() => {
  if (observer.value && target.value) {
    observer.value.unobserve(target.value)
    observer.value.disconnect()
  }
})
</script>

<template>
  <div mb-16 md:flex="~">
    <h1 mb-2 text-7xl md:write-vertical-right>
      {{ props.year }}
    </h1>
    <div flex-1 overflow-hidden>
      <div v-for="timestamp in displayData" :key="timestamp" mb-8>
        <MonthsDay :timestamp="timestamp" :month-day-data="getMonthData(timestamp)" />
      </div>
      <div ref="target" />
    </div>
  </div>
</template>
