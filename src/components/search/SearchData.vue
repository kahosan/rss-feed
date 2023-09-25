<script setup lang="ts">
import { NInput } from 'naive-ui'
import Fuse from 'fuse.js'
import type { Feed } from '~/types/feeds'
import type { FuseOptions } from '~/types/fuse'

const props = defineProps<{ contents: Feed[] }>()

const searchQuery = ref('')

const fuseOptions = ref<FuseOptions>({
  keys: ['feedTitle', 'postTitle', 'postDescription'],
  includeScore: true,
})

const target = shallowRef<HTMLDivElement | null>(null)
const result = ref<Feed[]>([])

// 当 result 变化时，重新调用一次 lazyData，同时返回 lazyData 中响应式 切片数据
const lazyResult = lazyData(target, result, 20, 20, { threshold: 0.1 })

let timeId: number
function handleSearch() {
  if (lazyResult.value)
    result.value = []

  timeId = window.setTimeout(() => {
    const fuse = new Fuse(props.contents, fuseOptions.value)
    result.value = fuse.search(searchQuery.value).map(item => item.item)
  }, 100)
}

onUnmounted(() => {
  clearTimeout(timeId)
})
</script>

<template>
  <div flex="~ justify-center items-center">
    <div max-w-4xl flex-1 overflow-hidden>
      <h2 text-center text-6>
        搜索文章标题、描述、站点名称
      </h2>
      <div relative mx-auto mb-12 max-w-xl>
        <NInput v-model:value="searchQuery" :bordered="false" mt-2 placeholder="输入搜索内容..." @keyup.enter="handleSearch">
          <template #suffix>
            <div class="i-carbon-search" cursor-pointer text-4 transition hover:op-60 @click="handleSearch" />
          </template>
        </NInput>
        <SearchOptions v-model="fuseOptions" :on-enter="handleSearch" />
      </div>
      <div>
        <DataView :group="false" :feed="lazyResult" />
        <div ref="target" />
      </div>
    </div>
  </div>
</template>
