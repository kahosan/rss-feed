<script lang="ts" setup>
import { NDropdown } from 'naive-ui'
import type { DataSource } from '~/types/source'

const props = defineProps<{
  changeSource: (s: DataSource) => void
  active: (s: DataSource) => boolean
  tocYears: number[]
  changeYear: (year: number) => void
}>()

const isActive = (s: DataSource) => props.active(s) && 'op-60'

const options = computed(() => props.tocYears.map(year => ({
  label: year.toString(),
  key: year,
})))
</script>

<template>
  <div bg="#ebebeb" dark:bg="#272626" fixed z-1 h-14 w-full flex items-center p-4 transition-all>
    <div mx-auto max-w-6xl flex="~ 1 justify-between items-center">
      <NDropdown size="large" trigger="click" :options="options" @select="changeYear">
        <h2 cursor-pointer text-5>
          RSS Feed
        </h2>
      </NDropdown>
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
          <button :class="isActive('unknownURI')" @click="() => changeSource('unknownURI')">
            失败列表
          </button>
        </div>
        <div i-carbon-moon cursor-pointer transition-300 dark:i-carbon-sun hover:op-60 @click="() => toggleDark()" />
      </div>
    </div>
  </div>
</template>
