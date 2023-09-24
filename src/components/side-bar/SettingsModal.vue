<script setup lang="ts">
import { NModal, NTabPane, NTabs } from 'naive-ui'

const { toggleModal } = defineProps<{
  isOpen: boolean
  toggleModal: () => void
}>()

function cancel() {
  toggleModal()
}
</script>

<template>
  <NModal
    :show="isOpen"
    :on-close="cancel"
    transform-origin="center"
    preset="dialog"
    mt-30
  >
    <NTabs type="line" justify-content="space-evenly" animated>
      <NTabPane name="删除分组">
        <DeleteGroup />
      </NTabPane>
      <NTabPane name="删除分组内容">
        <DeleteItem />
      </NTabPane>
      <NTabPane name="添加分组内容">
        <InsertItem />
      </NTabPane>
    </NTabs>
  </NModal>
</template>
