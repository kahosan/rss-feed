<script setup lang="ts">
import pangu from 'pangu'
import { formatISO } from 'date-fns'

import { NCard, NTag } from 'naive-ui'
import type { Feed } from '~/types/feeds'

const props = defineProps<{ group: boolean; feeds: Feed[] }>()

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
  <NCard v-for="feed of feeds" v-show="isHidden(feed)" :key="feed.id" embedded :bordered="false" mb-6 content-style="padding: 0.65rem;">
    <div flex="~ justify-between items-center" min-h-14>
      <div max-w-2xl overflow-hidden>
        <a target="_blank" :href="feed.postLink" cursor-pointer text-5 font-bold transition lt-md:text-4.5 hover:op-60>
          {{ pangu.spacing(feed.postTitle) }}
        </a>
        <div mt-2 flex items-center gap-2 md:hidden>
          <NTag size="small" :bordered="false" type="primary">
            {{ date(new Date(feed.postPublished)) }}
          </NTag>
          <div flex items-center gap-1>
            <div i-carbon-link inline text-3 />
            <a target="_blank" :href="feed.feedLink" block max-w-24 cursor-pointer truncate transition>
              {{ feed.feedTitle }}
            </a>
          </div>
        </div>
        <p mt-1 max-w-140 truncate text-3.5 op-60>
          {{ pangu.spacing(feed.postDescription) || '没有描述' }}
        </p>
      </div>
      <div ml-4 max-w-28 min-w-28 overflow-hidden text-4 text-secondary lt-md:hidden>
        <p>{{ date(new Date(feed.postPublished)) }}</p>
        <a target="_blank" :href="feed.feedLink" block cursor-pointer truncate transition hover:op-60>
          {{ feed.feedTitle }}
        </a>
      </div>
    </div>
  </NCard>
</template>
