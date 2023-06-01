<script setup lang="ts" generic="T extends RssEntry">
import { getYear } from 'date-fns'
import { RssEntry } from '~/types/rss'

const { dateType } = defineProps<{ dateType: 'year' | 'monthDay'; displayData: T[] }>()

const date = (monthDay: string, published: string | Date) => {
  const year = getYear(new Date(published))
  return dateType === 'year' ? `${year}-${monthDay}` : monthDay
}
</script>

<template>
  <div v-for="entry in displayData" :key="entry.id" mb-8>
    <div flex="~ justify-between" min-h-14>
      <div max-w-xl overflow-hidden>
        <a target="_blank" :href="entry.postLink" cursor-pointer text-5 transition hover:op-60>{{ entry.postTitle }}</a>
        <p max-w-140 truncate text-3.5 op-60>
          {{ entry.description }}
        </p>
      </div>
      <div ml-4 max-w-28 min-w-28 overflow-hidden text-4 text-secondary>
        <p>{{ date(entry.monthDay, entry.published) }}</p>
        <a target="_blank" block cursor-pointer truncate transition hover:op-60 :href="entry.siteLink">{{ entry.siteTitle }}</a>
      </div>
    </div>
  </div>
</template>
