<script lang="ts" setup>
import { lazyData } from '~/composables/lazy'
import type { RssEntry } from '~/types/rss'

const { monthDayData } = defineProps<{ monthDayData: RssEntry[] }>()

const target = shallowRef<HTMLDivElement | null>(null)
const displayData = lazyData(target, ref(monthDayData), 10, 10)
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
