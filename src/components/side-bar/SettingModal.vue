<script setup lang="ts">
import { NCascader, NCheckbox, NCheckboxGroup, NModal, NSelect, NSpace, useMessage } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useRssData } from '~/store/rss-data'
import { useRssGroup } from '~/store/rss-group'

const { toggleModal } = defineProps<{
  isOpen: boolean
  toggleModal: () => void
}>()

const message = useMessage()

const { rssGroup } = storeToRefs(useRssGroup())
const { addGroupItem, removeGroup, removeGroupItem } = useRssGroup()

const selectRssGroupForRemove = ref<string[]>([])

const selectOptions = computed(() => rssGroup.value?.map(group => ({
  value: group.name,
  label: group.name,
  children: group.items.map(item => ({
    value: item.title,
    label: item.title,
  })),
})))

const { rssData } = storeToRefs(useRssData())

const siteList = computed(() =>
  [
    ...new Set(rssData.value?.contents
      .map(item => item.entries
        .map(entry => entry)).flat(),
    ),
  ],
)

const siteTitleList = () => [...new Set(siteList.value.filter(item => !item.groupBy).map(item => item.siteTitle))]

function groupItems() {
  return siteTitleList().map(item => ({
    label: item,
    value: item,
  }))
}

const selectRssGroupForAdd = ref<string[]>([])
const groupSelect = ref<string[]>([])
const groupList = computed(() => rssGroup.value?.map(group => group.name))

function clean() {
  selectRssGroupForRemove.value = []
  selectRssGroupForAdd.value = []
  groupSelect.value = []
}

function submit() {
  if (selectRssGroupForRemove.value.length === 0 && selectRssGroupForAdd.value.length === 0 && groupSelect.value.length === 0) {
    message.warning('选项不能为空')
    return
  }

  selectRssGroupForRemove.value.forEach(itemTitle => removeGroupItem(itemTitle))
  selectRssGroupForRemove.value.forEach(group => removeGroup(group))

  if (selectRssGroupForAdd.value.length !== 0 && groupSelect.value.length !== 0) {
    const groupItems = selectRssGroupForAdd.value.map(value => ({
      title: value,
      link: siteList.value.find(item => item.siteTitle === value)?.siteLink ?? '',
      description: siteList.value.find(item => item.siteTitle === value)?.description ?? '',
    }))

    addGroupItem(groupSelect.value[0], groupItems)
  }

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
    :show="isOpen"
    :on-close="cancel"
    transform-origin="center"
    preset="dialog"
    mt-30
    positive-text="确认"
    negative-text="算了"
    :on-positive-click="submit"
    :on-negative-click="cancel"
  >
    <NSpace vertical size="medium">
      <NSpace vertical>
        删除分组或分组内的内容
        <NCascader
          v-model:value="selectRssGroupForRemove"
          :options="selectOptions"
          placeholder="请选择"
          multiple
          check-strategy="parent"
        />
      </NSpace>
      <NSpace vertical>
        为分组添加内容
        <NCheckboxGroup v-model:value="groupSelect" :max="1">
          <NCheckbox v-for="group in groupList" :key="group" :value="group" :label="group" />
        </NCheckboxGroup>
        <NSelect
          v-model:value="selectRssGroupForAdd"
          multiple
          placeholder="选择站点"
          :options="groupItems()"
        />
      </NSpace>
    </NSpace>
  </NModal>
</template>
