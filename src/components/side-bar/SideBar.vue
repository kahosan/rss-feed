<script setup lang="ts">
import { NButton, NMenu } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useFeedGroup } from '~/store/feed-group'

const props = defineProps<{
  isSideBarVisible: boolean
}>()

const listIcon = () => h('div', { class: 'i-carbon-list text-4' })

const visibleCss = computed(() => {
  return props.isSideBarVisible ? 'left-0' : 'left--80'
})

const { groups } = storeToRefs(useFeedGroup())
const { setCurrentGroup, setCurrentFeed } = useFeedGroup()

const openSelectModal = ref(false)
const toggleSelectModal = () => openSelectModal.value = !openSelectModal.value

const openSettingModal = ref(false)
const toggleSettingModal = () => openSettingModal.value = !openSettingModal.value

const menuOptions = computed(() => [
  {
    label: '全部文章',
    key: 'default',
    icon: listIcon,
  },
  ...groups.value.map(group => ({
    label: group.name,
    key: group.name,
    icon: listIcon,
    children: group.items.map(feed => ({
      label: feed.title,
      key: feed.title,
      icon: listIcon,
    })),
  })),
])

function handleExpendKey(key: string[]) {
  setCurrentGroup(key[0] || 'default')
}

function handleFeedUpdate(feed: string) {
  if (feed !== 'default') {
    setCurrentFeed(feed)
  }
  else {
    setCurrentGroup('default')
    setCurrentFeed(undefined)
  }
}
</script>

<template>
  <aside
    fixed top-0 z-2 w-80 overflow-x-hidden p-4 pt-18 transition-all md:pt-4
    :class="`md:left-0 ${visibleCss} h-100% bg-[var(--c-side-bar-bg)]`"
  >
    <div flex="~ col" children:mb-4>
      <div flex="~ justify-between items-center" px-2>
        <small>分组</small>
        <NButton size="small" text @click="toggleSettingModal">
          <div class="i-carbon-settings" text-3 />
        </NButton>
      </div>
      <NMenu
        accordion
        :on-update:value="feed => handleFeedUpdate(feed)"
        :on-update:expanded-keys="key => handleExpendKey(key)"
        :options="menuOptions"
        default-value="default"
      />
      <NButton @click="toggleSelectModal">
        <div class="i-carbon-add" mr-2 />
        添加分组
      </NButton>
    </div>
    <SelectModal :is-open="openSelectModal" :toggle-modal="toggleSelectModal" />
    <SettingsModal :is-open="openSettingModal" :toggle-modal="toggleSettingModal" />
  </aside>
</template>
