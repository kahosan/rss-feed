<script setup lang="ts">
import { NButton, NCheckbox, NCheckboxGroup, NDivider, NInput, useMessage } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useFeedGroup } from '~/store/feed-group'

const feedGroup = useFeedGroup()
const { groups } = storeToRefs(feedGroup)
const { renameGroup } = feedGroup

const selectedGroup = ref<string[]>([])
const name = ref<string>()
const message = useMessage()

function cleanup() {
  selectedGroup.value = []
  name.value = ''
}

function handleRename() {
  if (!selectedGroup.value.length) {
    message.warning('请选择要操作的分组!')
    return
  }
  else if (!name.value) {
    message.warning('请输入新的名称!')
    return
  }

  renameGroup(selectedGroup.value[0], name.value)
  cleanup()
}

onUnmounted(() => cleanup())
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
    <NInput v-model:value="name" placeholder="请输入新的名称" />
    <NButton secondary strong @click="handleRename">
      重命名
    </NButton>
  </div>
</template>
