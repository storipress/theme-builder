<script lang="ts">
import { stubArray } from 'lodash'

import Popup from '../popup.vue'

interface Option {
  name?: string
  value: unknown
  component: unknown
}

export default defineComponent({
  components: { Popup },

  props: {
    options: {
      type: Array,
      default: stubArray,
    },
    activeClass: {
      type: String,
      default: 'text-clear-blue bg-clear-blue bg-opacity-15',
    },
    valueStyle: {
      type: [String, Object],
    },
    disabled: {
      type: Boolean,
    },
    editable: {
      type: Boolean,
    },
    value: {},
  },

  data: () => ({ isActive: false }),

  computed: {
    normalizedOptions(): Option[] {
      return this.options.map((option) => {
        if (typeof option === 'object' && option !== null) {
          return option
        }

        return {
          value: option,
        }
      })
    },
  },

  methods: {
    handleInput(event: InputEvent) {
      const $input = event.target as HTMLInputElement
      this.$emit('input', ($input.value && Number.parseInt($input.value, 10)) || 0)
    },

    handleSelect(value: unknown) {
      this.$emit('input', value)
      this.isActive = false
    },
  },
})
</script>

<template>
  <Popup
    v-model="isActive"
    class="dropdown"
    :class="[disabled && 'dropdown--disabled', isActive && 'dropdown--active']"
    :disabled="disabled"
    role="listbox"
  >
    <template #activator>
      <div class="dropdown__value flex items-center px-2 py-1">
        <slot name="prefix" />
        <div class="flex-1">
          <slot>
            <input
              v-if="!disabled && editable"
              class="input"
              :class="[isActive && 'dropdown--active']"
              :value="value"
              @input="handleInput"
            />
            <span v-else class="truncate" :class="disabled && 'text-transparent'" :style="valueStyle">{{ value }}</span>
          </slot>
        </div>
        <i class="icon-chevron_down dropdown__arrow" />
      </div>
    </template>
    <template #default>
      <div class="dropdown__menu">
        <slot name="dropdown" :value="value" :on-select="handleSelect">
          <ul>
            <template v-for="option in normalizedOptions">
              <component
                :is="option.component || 'li'"
                :key="option.value"
                role="option"
                class="dropdown__option"
                :class="[option.value === value && activeClass]"
                :aria-selected="`${option.value === value}`"
                @click.stop="handleSelect(option.value)"
              >
                {{ option.name || option.value }}
              </component>
            </template>
          </ul>
        </slot>
      </div>
    </template>
  </Popup>
</template>

<style lang="scss" scoped>
.dropdown {
  @apply h-full;

  &__value {
    @apply flex h-full w-full cursor-pointer select-none items-center;

    .dropdown--disabled & {
      @apply text-opacity-24;
      @apply cursor-not-allowed;

      &:hover {
        @apply bg-white;
      }
    }

    .dropdown--active & {
      @apply text-clear-blue opacity-100;
    }
  }

  &__arrow {
    @apply ml-1 shrink-0 opacity-50;

    font-size: 8px;

    .dropdown--active & {
      @apply text-clear-blue;
    }
  }

  &__menu {
    @apply bg-white;
  }

  &__option {
    @apply cursor-pointer select-none px-3 py-1 text-center;

    &:hover {
      @apply bg-light-pale-grey;
    }
  }
}

.input {
  @apply w-8 text-center;

  background: initial;
}
</style>
