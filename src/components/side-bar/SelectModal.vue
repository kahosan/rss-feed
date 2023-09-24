<script setup lang="ts">
import { NCheckbox, NInput, NModal, NSelect, NSpace, useMessage } from 'naive-ui'

import { storeToRefs } from 'pinia'
import { useRssData } from '~/store/rss-data'
import { useFeedGroup } from '~/store/feed-group'
import type { FeedGroupItem } from '~/types/feeds'

const { toggleModal } = defineProps<{
  isOpen: boolean
  toggleModal: () => void
}>()

const groupname = ref('')
const hidden = ref(false)

const { collects } = storeToRefs(useRssData())
const { groups } = storeToRefs(useFeedGroup())
const { createGroup } = useFeedGroup()

const message = useMessage()

const options = computed(() => collects.value
  .filter(item => !item.groupBy)
  .map(item => ({
    label: item.title,
    value: item.title,
  })))

const selectedValues = ref<string[]>([])

function clean() {
  hidden.value = false
  groupname.value = ''
  selectedValues.value = []
}

function submit() {
  if (groups.value?.find(group => group.name === groupname.value)) {
    message.error('分组已存在')
    return
  }

  const groupItems: FeedGroupItem[] = []

  for (const value of selectedValues.value) {
    groupItems.push({
      title: value,
      hidden: hidden.value,
    })
  }

  createGroup(groupname.value, groupItems)
  toggleModal()
  clean()
}

function cancel() {
  toggleModal()
  clean()
}
</script>

<template>
  <NModal
    :show="isOpen" :on-close="toggleModal" transform-origin="center" preset="dialog" mt-30 positive-text="确认"
    negative-text="返回" @positive-click="submit" @negative-click="cancel"
  >
    <template #header>
      请填写所需信息创建分组
    </template>
    <NSpace vertical>
      <NInput v-model:value="groupname" placeholder="输入分组名称" />
      <NSelect v-model:value="selectedValues" :options="options" placeholder="选择站点" multiple filterable />
      <NCheckbox v-model:checked="hidden">
        在全部文章中隐藏站点
      </NCheckbox>
    </NSpace>
  </NModal>
</template>
