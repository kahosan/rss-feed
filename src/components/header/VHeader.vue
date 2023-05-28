<script lang="ts" setup>
import type { DataSource } from '~/types/source'
defineProps<{ changeSource: (s: DataSource) => void; active: (s: DataSource) => boolean }>()
</script>

<template>
  <div bg="#ebebeb" dark:bg="#272626" h-14 flex items-center p-4>
    <div mx-auto max-w-6xl flex="~ 1 justify-between items-center">
      <h2>RSS Feed</h2>
      <div flex="~ items-center">
        <div children:pr-4 children:transition>
          <button :class="active('search') ? 'op-60' : ''" @click="() => changeSource('search')">
            搜索
          </button>
          <button :class="active('default') ? 'op-60' : ''" @click="() => changeSource('default')">
            默认
          </button>
          <button :class="active('unknownDate') ? 'op-60' : ''" @click="() => changeSource('unknownDate')">
            未知时间
          </button>
          <button :class="active('unknownURI') ? 'op-60' : ''" @click="() => changeSource('unknownURI')">
            失败列表
          </button>
        </div>
        <div i-carbon-moon dark:i-carbon-sun cursor-pointer transition-300 hover:op-60 @click="() => toggleDark()" />
      </div>
    </div>
  </div>
</template>
