<script setup lang="ts" generic="T extends RssEntry">
import { RssEntry } from '~/types/rss'

defineProps<{ displayData: T[] }>()
</script>

<template>
  <div v-for="entry in displayData" :key="entry.id" mb-8>
    <div flex="~ justify-between" min-h-14>
      <div overflow-hidden>
        <a target="_blank" :href="entry.postLink" color="[var(--c-h2-color)]" cursor-pointer text-5 transition hover:op-60>{{ entry.postTitle }}</a>
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
</template>
