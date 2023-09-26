<script setup lang="ts">
import pangu from 'pangu'
import { formatISO } from 'date-fns'

import type { Feed } from '~/types/feeds'

const props = defineProps<{ group: boolean; feed: Feed[] }>()

function date(published: Date) {
  return formatISO(published, { representation: 'date' })
}

function isHidden(item: Feed) {
  if (!props.group)
    return typeof item.hidden === 'boolean' ? !item.hidden : true

  return true
}
</script>

<template>
  <div v-for="item of feed" v-show="isHidden(item)" :key="item.id" mb-8>
    <div flex="~ justify-between items-center" min-h-14>
      <div max-w-xl overflow-hidden>
        <a target="_blank" :href="item.postLink" cursor-pointer text-5 font-bold transition hover:op-60>
          {{ pangu.spacing(item.postTitle) }}
        </a>
        <p max-w-140 truncate text-3.5 op-60>
          {{ pangu.spacing(item.postDescription) || '没有描述' }}
        </p>
      </div>
      <div ml-4 max-w-28 min-w-28 overflow-hidden text-4 text-secondary>
        <p>{{ date(new Date(item.postPublished)) }}</p>
        <a target="_blank" :href="item.feedLink" block cursor-pointer truncate transition hover:op-60>
          {{ item.feedTitle }}
        </a>
      </div>
    </div>
  </div>
</template>
