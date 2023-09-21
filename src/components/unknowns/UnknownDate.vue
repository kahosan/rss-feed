<script lang="ts" setup>
import type { UnknownDate } from '~/types/rss'

defineProps<{ data: UnknownDate }>()
</script>

<template>
  <div text-5>
    <div mb-4>
      <div v-for="entry in data" :key="entry.id" mb-8>
        <div flex="~ justify-between" min-h-14>
          <div mr-4 overflow-hidden>
            <a target="_blank" :href="entry.postLink" transition hover:op-60>{{ entry.postTitle }}</a>
            <p max-w-140 truncate text-3.5 op-60>
              {{ entry.description }}
            </p>
          </div>
          <div max-w-28 min-w-24 overflow-hidden text-4>
            <a target="_blank" block truncate transition hover:op-60 :href="entry.siteLink">{{ entry.siteTitle }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
