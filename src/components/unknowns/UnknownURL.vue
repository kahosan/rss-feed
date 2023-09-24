<script lang="ts" setup>
defineProps<{ data: string[] }>()
const sp = (str: string, index: number) => str.split(' | ').at(index)
</script>

<template>
  <div>
    <div text-5>
      <div v-for="entry in data" :key="entry" mb-4 overflow-hidden>
        <p op-40>
          {{ sp(entry, 1) }}
        </p>
        <a target="_blank" :href="sp(entry, 2)" block truncate transition hover:op-60>{{ sp(entry, 2) }}</a>
      </div>
    </div>
  </div>
</template>
