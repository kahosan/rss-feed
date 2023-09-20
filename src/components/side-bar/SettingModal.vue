<script setup lang="ts">
import { NCascader, NModal } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useRssGroup } from '~/store/rss-group'

const { toggleModal } = defineProps<{
  isOpen: boolean
  toggleModal: () => void
}>()

const { rssGroup } = storeToRefs(useRssGroup())
const { removeGroup, removeGroupItem } = useRssGroup()

const selectRssGroup = ref<string[]>([])

const selectOptions = computed(() => rssGroup.value?.map(group => ({
  value: group.name,
  label: group.name,
  children: group.items.map(item => ({
    value: item.title,
    label: item.title,
  })),
})))

const clean = () => {
  selectRssGroup.value = []
}

const submit = () => {
  if (selectRssGroup.value.length !== 0) {
    selectRssGroup.value.forEach(itemTitle => removeGroupItem(itemTitle))
    selectRssGroup.value.forEach(group => removeGroup(group))
  }

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
    :on-positive-click="submit"
    :on-negative-click="cancel"
  >
    <template #header>
      删除分组或分组内的内容
    </template>
    <div mt-4>
      <NCascader
        v-model:value="selectRssGroup"
        :options="selectOptions"
        multiple
        check-strategy="parent"
      />
    </div>
  </NModal>
</template>
