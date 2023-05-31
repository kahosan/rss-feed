<script lang="ts" setup>
import { lazyData } from '~/composables/lazy'
import type { RssEntry } from '~/types/rss'

const { monthDayData } = defineProps<{ monthDayData: RssEntry[] }>()

const target = ref<HTMLDivElement | null>(null)
const displayData = lazyData(target, monthDayData, 10, 10, { threshold: 0.1, rootMargin: '0px 0px 100px 0px' })
</script>

<template>
  <div ml-2>
    <div>
      <div mb-4>
        <DataView date-type="monthDay" :display-data="displayData" />
        <div ref="target" />
      </div>
    </div>
  </div>
</template>
