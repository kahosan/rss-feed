<script lang="ts" setup>
defineProps<{ data: string[] }>()
</script>

<template>
  <div>
    <div text-5 color="[var(--c-h2-color)]">
      <div v-for="entry in data" :key="entry" mb-4 overflow-hidden>
        <p op-40>
          {{ entry.split(' | ').at(1) }}
        </p>
        <a target="_blank" :href="entry" block truncate transition hover:op-60>{{ entry.split(' | ').at(2) }}</a>
      </div>
    </div>
  </div>
</template>
