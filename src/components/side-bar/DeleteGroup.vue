<script setup lang="ts">
import { NButton, NSelect, useMessage } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useFeedGroup } from '~/store/feed-group'

const feedGroup = useFeedGroup()
const { groups } = storeToRefs(feedGroup)
const { removeGroup } = feedGroup

const selected = ref<string[]>([])
const message = useMessage()

const options = computed(() => groups.value.map(group => ({
  label: group.name,
  value: group.name,
})))

function handleDelete() {
  if (!selected.value.length) {
    message.warning('请选择要删除的分组!')
    return
  }

  selected.value.forEach(value => removeGroup(value))
  selected.value = []
}

onUnmounted(() => selected.value = [])
</script>

<template>
  <div flex gap-2>
    <NSelect
      v-model:value="selected"
      :options="options"

      placeholder="请选择要删除的分组"
      clearable multiple
    />
    <NButton @click="handleDelete">
      删除
    </NButton>
  </div>
</template>
