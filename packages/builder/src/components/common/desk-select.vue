<script lang="ts">
import type { State } from '../../store/modules/front'
import { computed, defineComponent, ref } from 'vue-demi'

import { useState } from 'vuex-hooks'

// FIXME: refactor that for SSOT
const DEFAULT_DESKS = [
  { slug: 'latest', name: 'Latest' },
  { slug: 'featured', name: 'Featured' },
]

export default defineComponent({
  props: {
    order: String,
    value: String,
  },

  setup(props, { emit }) {
    const active = ref(false)
    const { desks } = useState<State>('front')

    return {
      active,
      name: computed(() => {
        const { value } = props
        const desk = desks.value.find(({ slug }) => slug === value)
        return desk?.name ?? value
      }),
      desks: computed(() => [...DEFAULT_DESKS, ...desks.value]),
      handleClick(desk: string) {
        emit('input', [props.order, desk])
        active.value = false
      },
    }
  },
})
</script>

<template>
  <div class="desk-select" :class="[active && 'z-20']">
    <button class="select-btn" @click.stop="active = !active">
      <span class="flex items-center justify-center text-sm">
        <i class="icon-desk" />
      </span>
      <span class="ml-2 truncate text-sm uppercase leading-none">{{ name }}</span>
      <span class="ml-2 flex items-center justify-center text-xs">
        <i class="icon-chevron_down" />
      </span>
    </button>
    <div v-show="active" class="dropdown">
      <div
        v-for="desk of desks"
        :key="desk.slug"
        class="dropdown-item"
        :class="[value === desk.slug && 'text-clear-blue']"
        role="button"
        @click.stop="handleClick(desk.slug)"
      >
        {{ desk.name }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.desk-select {
  @apply relative flex flex-col items-end;

  color: #4c4c4c;
}

.select-btn {
  @apply shadow-1 relative flex items-center justify-center rounded-sm bg-white px-3 py-2 text-right transition-colors;

  &:hover,
  &--active {
    @apply bg-white-grey;
  }
}

.shadow {
  @apply shadow-1;

  clip-path: inset(1px -3px 1px -3px);
}

.dropdown {
  @apply shadow-2 absolute left-0 top-full z-10 mt-2 rounded-sm bg-white py-1 text-sm;

  border-radius: 3px;
  width: max-content;

  &-item {
    @apply cursor-pointer select-none px-4 py-2 uppercase;

    &:hover {
      background-color: #f0f0f0;
    }
  }
}

.overlay {
  @apply shadow-1;
  @apply absolute inset-0 h-full w-full;

  border-radius: 29.5px;
}
</style>
