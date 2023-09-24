<script setup lang="ts">
import { NButton, NCheckbox, NCheckboxGroup, NDivider, NSelect, useMessage } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useFeedGroup } from '~/store/feed-group'
import { useRssData } from '~/store/rss-data'

const feedGroup = useFeedGroup()
const { groups } = storeToRefs(feedGroup)
const { insertItem } = feedGroup

const { collects } = storeToRefs(useRssData())

const selectedGroup = ref<string[]>([])
const selected = ref<string[]>([])
const hidden = ref(false)

const message = useMessage()

const options = computed(() => collects.value
  .filter(item => !item.groupBy)
  .map(item => ({
    label: item.title,
    value: item.title,
  })))

function clean() {
  selected.value = []
  selectedGroup.value = []
}

function handleInsert() {
  if (!selectedGroup.value.length) {
    message.warning('请选择要添加的分组!')
    return
  }

  if (!selected.value.length) {
    message.warning('请选择要添加的站点!')
    return
  }

  selected.value
    .forEach(value => insertItem(selectedGroup.value.at(0) ?? '', { title: value, hidden: hidden.value }))
  clean()
}

onUnmounted(() => clean())
</script>

<template>
  <NCheckboxGroup v-model:value="selectedGroup" :max="1">
    <NCheckbox v-for="group in groups" :key="group.name" :value="group.name">
      {{ group.name }}
    </NCheckbox>
  </NCheckboxGroup>
  <NDivider />
  <div flex gap-2>
    <NSelect
      v-model:value="selected"
      :options="options"
      multiple
      placeholder="请选择要添加的站点"
      clearable
    />
    <NButton @click="handleInsert">
      添加
    </NButton>
  </div>
  <NCheckbox v-model:checked="hidden" mt-2>
    在全部文章中隐藏站点
  </NCheckbox>
</template>
