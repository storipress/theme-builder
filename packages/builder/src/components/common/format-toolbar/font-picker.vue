<script lang="ts">
import type { VueConstructor } from 'vue'
import { fontList } from '@storipress/fonts-meta'
import Vue from 'vue'

type GroupName = keyof typeof fontList | 'All'

interface Refs {
  fonts: HTMLElement
}

type withRefs = VueConstructor<Vue & { $refs: Refs }>

export default (Vue as withRefs).extend({
  data: () => ({
    groups: ['All', 'Sans', 'Serif', 'Display', 'Mono', 'Condensed'],
    selectedGroup: 'Sans' as GroupName,
  }),
  computed: {
    fonts(): string[] {
      if (this.selectedGroup === 'All') return Object.values(fontList).flat()
      return fontList[this.selectedGroup]
    },
  },
  watch: {
    async selectedGroup() {
      await Vue.nextTick()
      this.$refs.fonts.scrollTo({ top: 0 })
    },
  },
})
</script>

<template>
  <div :class="$style.fontPicker">
    <div :class="$style.fontPickerGroups">
      <button
        v-for="(group, i) in groups"
        :key="group"
        :class="[$style.fontPickerGroup, selectedGroup === group && $style.fontPickerGroupActive]"
        :style="{ '--fade-delay': `${i * 40}ms` }"
        @click="selectedGroup = group"
      >
        {{ group }}
      </button>
    </div>
    <div ref="fonts" class="grow overflow-y-auto">
      <div
        v-for="font in fonts"
        :key="font"
        class="py-1"
        :class="$style.fontPickerItem"
        :style="`font-family: '${font}'`"
        @click="$emit('input', font)"
      >
        {{ font }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.font-picker {
  @apply shadow-3 relative mt-1 flex rounded;

  width: 12rem;
  max-height: 63vh;
  min-height: 16rem;

  &__groups {
    @apply absolute flex flex-col items-end;

    color: #4c4c4c;
    left: -108px;
  }

  &__group {
    @apply text-greyish-brown shadow-1 mb-1 rounded-sm bg-white p-2 text-sm text-xs uppercase leading-none text-opacity-70 opacity-0;

    animation: fade 250ms ease-in-out;
    animation-fill-mode: forwards;
    animation-delay: var(--fade-delay);

    &--active {
      @apply bg-white-grey;
    }
  }

  &__item {
    @apply whitespace-nowrap px-3 py-2 transition-colors;

    &:hover {
      @apply bg-white-grey;
    }
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
