<script lang="ts" setup>
import type { RssMonth } from '~/types/rss'

const props = defineProps<{ year: string; yearData: RssMonth }>()

const monthDays = Object.keys(props.yearData).sort((a, b) => {
  const aDate = new Date(a)
  const bDate = new Date(b)
  return bDate.getTime() - aDate.getTime()
})

const getMonthData = (monthDay: string) => props.yearData[monthDay].entries

const displayMonthDays = ref<string[]>(monthDays.slice(0, 15))
const chunkSize = 10

const loadMore = () => {
  const currentLength = displayMonthDays.value.length
  const newData = monthDays.slice(currentLength, currentLength + chunkSize)
  displayMonthDays.value.push(...newData)
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
      <div v-for="monthDay in displayMonthDays" :key="monthDay" mb-8>
        <MonthsDay :month-day="monthDay" :month-day-data="getMonthData(monthDay)" />
      </div>
      <div ref="target" />
    </div>
  </div>
</template>
