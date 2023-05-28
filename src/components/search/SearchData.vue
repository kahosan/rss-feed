<script setup lang="ts">
import Fuse from 'fuse.js'
import rss_data from '~/assets/rss_data.json'
import type { RssContents, RssEntry } from '~/types/rss'

const contents = rss_data.contents as RssContents[]

const searchQuery = ref('')

const fuse = new Fuse(contents.map(item => item.entries).flat(), {
  // TODO optional option
  keys: ['siteTitle', 'postTitle', 'description'],
  includeScore: true,
})

const target = ref<HTMLDivElement | null>(null)
const result = ref<RssEntry[]>([])

const handleSearch = () => {
  result.value = fuse.search(searchQuery.value).map(item => item.item)
}

// 当 result 变化时，重新调用一次 lazyData，同时返回 lazyData 中响应式 切片数据
const displayData = computed(() => lazyData(target, result.value, 20, 10, { threshold: 0.1, rootMargin: '0px 0px 100px 0px' }).value)
</script>

<template>
  <div flex="~ justify-center items-center">
    <div max-w-4xl flex-1>
      <h2 text-center text-6>
        搜索文章标题、描述、站点名称
      </h2>
      <div relative mx-auto mb-12 max-w-xl flex>
        <input v-model="searchQuery" mt-2 w-full border rounded-2 px-4 py-2 outline-none dark:border-gray-500 dark:bg="#272626" type="text" @keyup.enter="handleSearch">
        <div class="i-carbon-search" absolute right-2 top-4 cursor-pointer p-2 text-5 transition hover:op-60 @click="handleSearch" />
      </div>
      <div>
        <DataView date-type="year" :display-data="displayData" />
        <div ref="target" />
      </div>
    </div>
  </div>
</template>
