<script setup lang="ts">
import { NCheckbox, NCheckboxGroup, NInputNumber } from 'naive-ui'
import type { FuseOptions } from '~/types/fuse'

defineProps<{ onEnter: () => void }>()
const modelValue = defineModel<FuseOptions>()

const options = ref<FuseOptions>({ ...modelValue.value })

watch(
  options,
  (opts) => {
    modelValue.value = opts
  },
  { deep: true },
)
</script>

<template>
  <div mt-4 flex items-center>
    <NCheckboxGroup v-model:value="options.keys">
      <NCheckbox value="postTitle">
        标题
      </NCheckbox>
      <NCheckbox value="description">
        描述
      </NCheckbox>
      <NCheckbox value="siteTitle">
        站点
      </NCheckbox>
    </NCheckboxGroup>
    <div w-30 flex items-center>
      匹配阈值
      <NInputNumber
        ml-2
        flex-1
        :autosize="true"
        :show-button="false"
        :bordered="false"
        max="1"
        min="0"
        size="small"
        placeholder="0 - 1"
        :on-update:value="e => options.threshold = e ?? 0.6"
        @keyup.enter="onEnter"
      />
    </div>
  </div>
</template>
