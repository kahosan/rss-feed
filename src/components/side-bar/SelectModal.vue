<script setup lang="ts">
import { NInput, NModal, NSelect, NSpace, useMessage } from 'naive-ui'

import { storeToRefs } from 'pinia'
import { useRssData } from '~/store/rss-data'
import { useRssGroup } from '~/store/rss-group'

const { toggleModal } = defineProps<{
  isOpen: boolean
  toggleModal: () => void
}>()

const groupName = ref('')

const { rssData } = storeToRefs(useRssData())
const { rssGroup } = storeToRefs(useRssGroup())
const { addGroupItem } = useRssGroup()

const message = useMessage()

const siteList = computed(() =>
  [
    ...new Set(rssData.value?.contents
      .map(item => item.entries
        .map(entry => entry)).flat(),
    ),
  ],
)

const siteTitleList = () => [...new Set(siteList.value.filter(item => !item.groupBy).map(item => item.siteTitle))]

const selectOptions = () => {
  return siteTitleList().map(item => ({
    label: item,
    value: item,
  }))
}

const selectedValues = ref<string[]>([])

const clean = () => {
  groupName.value = ''
  selectedValues.value = []
}

const submit = () => {
  if (rssGroup.value?.find(group => group.name === groupName.value)) {
    message.error('分组已存在')
    return
  }

  const groupItems = selectedValues.value.map(value => ({
    title: value,
    link: siteList.value.find(item => item.siteTitle === value)?.siteLink ?? '',
    description: siteList.value.find(item => item.siteTitle === value)?.description ?? '',
  }))

  addGroupItem(groupName.value, groupItems)
  toggleModal()
  clean()
}

const cancel = () => {
  toggleModal()
  clean()
}
</script>

<template>
  <NModal
    :show="isOpen"
    :on-close="toggleModal"
    transform-origin="center"
    preset="dialog"
    mt-30
    positive-text="确认"
    negative-text="算了"
    @positive-click="submit"
    @negative-click="cancel"
  >
    <template #header>
      请填写所需信息创建分组
    </template>
    <NSpace vertical>
      <NInput v-model:value="groupName" placeholder="输入分组名称" />
      <NSelect
        v-model:value="selectedValues"
        :options="selectOptions()"
        placeholder="选择站点"
        filterable
        multiple
      />
    </NSpace>
  </NModal>
</template>
