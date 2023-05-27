<script lang="ts" setup>
import { lazyData } from '~/composables/lazy'
import type { RssEntry } from '~/types/rss'

const props = defineProps<{ month: number; monthDayData: RssEntry[] }>()

const monthDayData = props.monthDayData

const target = ref<HTMLDivElement | null>(null)
const displayData = lazyData(target, monthDayData, 10, 10, { threshold: 0.1, rootMargin: '0px 0px 100px 0px' })
</script>

<template>
  <div ml-2>
    <div text-5 color="[var(--c-h2-color)]">
      <div mb-4>
        <div v-for="entry in displayData" :key="entry.id" mb-8>
          <div flex="~ justify-between" min-h-14>
            <div overflow-hidden>
              <a target="_blank" :href="entry.postLink" cursor-pointer transition hover:op-60>{{ entry.postTitle }}</a>
              <p max-w-140 truncate text-3.5 op-60>
                {{ entry.description }}
              </p>
            </div>
            <div ml-4 max-w-28 min-w-28 overflow-hidden text-4>
              <p>{{ entry.monthDay }}</p>
              <a target="_blank" block cursor-pointer truncate transition hover:op-60 :href="entry.siteLink">{{ entry.siteTitle }}</a>
            </div>
          </div>
        </div>
        <div ref="target" />
      </div>
    </div>
  </div>
</template>
