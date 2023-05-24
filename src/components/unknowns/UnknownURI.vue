<script lang="ts" setup>
defineProps<{ data: string[] }>()
</script>

<template>
  <div>
    <div text-5 color="[var(--c-h2-color)]">
      <div v-for="entry in data" :key="entry" mb-4 overflow-hidden>
        <a target="_blank" :href="entry" block truncate transition hover:op-60>{{ entry }}</a>
      </div>
    </div>
  </div>
</template>
