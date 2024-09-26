<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  functional: true,
  props: {
    meta: {
      type: Object,
      required: true,
    },
  },
})
</script>

<template functional>
  <div class="relative w-full">
    <div v-if="props.meta.thumbnail" v-html="props.meta.html" />
    <div v-else class="bookmark">
      <div class="bookmark__info">
        <div class="bookmark__headline">{{ props.meta.title }}</div>
        <div v-if="props.meta.description" class="bookmark__description">
          <div class="bookmark__content">{{ props.meta.description }}</div>
        </div>
        <div class="bookmark__meta">
          <img
            v-if="props.meta.icon"
            class="bookmark__icon"
            :src="props.meta.icon"
            alt="icon"
            onerror="this.style.display = 'none'"
          />
          <template v-if="props.meta.author">
            <span class="bookmark__author">{{ props.meta.author }}</span>
            <span class="bookmark__dot">•</span>
          </template>
          <span>{{ props.meta.publisher }}</span>
        </div>
      </div>
    </div>
    <div class="absolute inset-0 h-full w-full" />
  </div>
</template>
