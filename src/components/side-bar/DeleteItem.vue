<script setup lang="ts">
import { NButton, NCheckbox, NCheckboxGroup, NDivider, NSelect, useMessage } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useFeedGroup } from '~/store/feed-group'

const feedGroup = useFeedGroup()
const { groups } = storeToRefs(feedGroup)
const { removeItem } = feedGroup

const selectedGroup = ref<string[]>([])
const selected = ref<string[]>([])
const message = useMessage()

const options = computed(() => groups.value
  .find(group => group.name === selectedGroup.value.at(0))
  ?.items
  .map(item => ({
    label: item.title,
    value: item.title,
  })),
)

function clean() {
  selected.value = []
  selectedGroup.value = []
}

function handleDelete() {
  if (!selectedGroup.value.length) {
    message.warning('请选择要删除的分组!')
    return
  }

  if (!selected.value.length) {
    message.warning('请选择要删除的站点!')
    return
  }

  selected.value.forEach(value => removeItem(selectedGroup.value.at(0) ?? '', value))
  clean()
}

onUnmounted(() => clean())
</script>

<template>
  <NCheckboxGroup v-if="!!groups.length" v-model:value="selectedGroup" :max="1">
    <NCheckbox v-for="group of groups" :key="group.name" :value="group.name">
      {{ group.name }}
    </NCheckbox>
  </NCheckboxGroup>
  <p v-else>
    暂无分组
  </p>
  <NDivider />
  <div flex gap-2>
    <NSelect
      v-model:value="selected"
      :options="options"

      placeholder="请选择要删除的站点"
      clearable multiple
    />
    <NButton strong secondary @click="handleDelete">
      删除
    </NButton>
  </div>
</template>
