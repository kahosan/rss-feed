<script lang="ts" setup>
import { NButton } from 'naive-ui'
import type { DataSource } from '~/types/source'

const props = defineProps<{
  changeSource: (s: DataSource) => void
  active: (s: DataSource) => boolean
  isSideBarVisible: boolean
  toggleSideBarVisible: () => void
}>()

const isActive = (s: DataSource) => props.active(s) && 'op-60'
</script>

<template>
  <div class="w-full md:w-[calc(100%-20rem)]" bg="#f6f6f6" dark:bg="#272626" fixed z-3 h-14 flex items-center p-4 md:ml-80>
    <div mx-auto flex="~ 1 justify-between items-center">
      <h2 text-5 class="lt-md:hidden!">
        RSS Feed
      </h2>
      <NButton secondary class="md:hidden!" @click="toggleSideBarVisible">
        <div class="i-carbon:list text-4" />
      </NButton>
      <div flex="~ items-center">
        <div text-3.5 children:pr-4 children:transition>
          <button :class="isActive('search')" @click="() => changeSource('search')">
            搜索
          </button>
          <button :class="isActive('default')" @click="() => changeSource('default')">
            默认
          </button>
          <button :class="isActive('unknownDate')" @click="() => changeSource('unknownDate')">
            未知时间
          </button>
          <button :class="isActive('unknownURL')" @click="() => changeSource('unknownURL')">
            失败列表
          </button>
        </div>
        <div i-carbon-moon cursor-pointer transition-300 dark:i-carbon-sun hover:op-60 @click="() => toggleDark()" />
      </div>
    </div>
  </div>
</template>
