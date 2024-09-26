<script lang="ts" setup>
import { PREVIEW_MAP } from '@storipress/templates/articles'
import { masonry, masonryItem } from 'shared/directives/masonry'

defineProps<{
  value: string
}>()
defineEmits<{
  (event: 'input', value: string): void
}>()
const vMasonry = masonry
const vMasonryItem = masonryItem
const articleMap = PREVIEW_MAP
</script>

<template>
  <div v-masonry="{ id: 'article-templates', horizontalOrder: false, percentPosition: true, gutter: 16 }" class="px-4">
    <img
      v-for="(url, name) of articleMap"
      :key="name"
      v-masonryItem="'article-templates'"
      class="ring-clear-blue shadow-1 round-lg mb-4 w-5/12 overflow-hidden transition-shadow hover:ring-2 hover:ring-blue-300"
      role="button"
      :class="{ 'hover:ring-clear-blue ring-2': value === name }"
      :src="url"
      :alt="name"
      @click="$emit('input', name)"
    />
  </div>
</template>
