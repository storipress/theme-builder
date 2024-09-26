<script lang="ts">
import { ColorPickerPopup } from '@storipress/color-picker'
import { fontSize } from '@storipress/elements/utils/limits'
import Slider from '@storipress/vue-slider-component'
import ToggleButton from 'shared/components/toggle-button.vue'
import { clickOutside } from 'shared/directives/click-outside'

import Dropdown from './dropdown.vue'
import FontPicker from './font-picker.vue'
import { flatAccessor } from './helpers'

export default defineComponent({
  directives: { clickOutside },

  components: {
    ColorPickerPopup,
    Dropdown,
    FontPicker,
    Slider,
    ToggleButton,
  },

  props: {
    editableStyles: {
      type: Object,
      required: true,
    },
    hasSelected: {},
    sectionName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      alignOptions: ['left', 'center', 'right'],
      fontSizeRange: {
        min: fontSize[0],
        max: fontSize[1],
      },
      alignIcon: {
        left: 'icon-format_align_left',
        center: 'icon-format_align_center',
        right: 'icon-format_align_right',
      },
    }
  },

  computed: {
    ...flatAccessor,
    sliderStyle(): object {
      return {
        'background-color': '#7f7f7f',
      }
    },
  },
  methods: {
    handleClickOutside() {
      this.$emit('click-outside')
    },
  },
})
</script>

<template>
  <div class="sticky-container">
    <div v-click-outside="handleClickOutside" class="format-toolbar" :class="{ selected: hasSelected }" @click.stop>
      <div class="format-toolbar__selected-name">{{ sectionName }}</div>
      <div class="flex grow items-center">
        <div class="toolbar-btn h-8 border-l">
          <Dropdown
            v-model="fontFamily"
            class="w-48"
            :disabled="!hasSelected"
            :value-style="`font-family: '${fontFamily}'`"
            active-class="bg-white-grey"
          >
            <template #prefix>
              <span class="mr-2 flex items-center justify-center text-sm">
                <i class="icon-font" />
              </span>
            </template>
            <template #dropdown="{ onSelect }">
              <FontPicker class="text-black text-opacity-100" @input="onSelect" />
            </template>
          </Dropdown>
        </div>
        <div class="toolbar-btn h-8 border-l">
          <Dropdown v-model="fontSize" editable :disabled="!hasSelected">
            <template #dropdown>
              <div class="font-size-slider">
                <div class="font-size-slider__container">
                  <Slider
                    v-model="fontSize"
                    :min="fontSizeRange.min"
                    :max="fontSizeRange.max"
                    :process-style="sliderStyle"
                  />
                </div>
              </div>
            </template>
          </Dropdown>
        </div>
        <div class="toolbar-btn h-8 border-l">
          <ToggleButton v-model="bold" :disabled="!hasSelected">
            <span class="flex items-center justify-center text-sm">
              <i class="icon-format_bold" />
            </span>
          </ToggleButton>
        </div>
        <div class="toolbar-btn h-8">
          <ToggleButton v-model="italic" :disabled="!hasSelected">
            <span class="flex items-center justify-center text-sm">
              <i class="icon-format_italics" />
            </span>
          </ToggleButton>
        </div>
        <div class="toolbar-btn h-8">
          <ToggleButton v-model="underline" :disabled="!hasSelected">
            <span class="flex items-center justify-center text-sm">
              <i class="icon-format_underline" />
            </span>
          </ToggleButton>
        </div>
        <div class="toolbar-btn h-8 border-l">
          <ColorPickerPopup v-model="color" text :disabled="!hasSelected" />
        </div>
        <div class="toolbar-btn h-8 border-l">
          <ToggleButton v-model="uppercase" :disabled="!hasSelected">
            <span class="flex items-center justify-center text-sm">
              <i class="icon-all_caps" />
            </span>
          </ToggleButton>
        </div>
        <div class="toolbar-btn h-8">
          <ToggleButton v-model="lowercase" :disabled="!hasSelected">
            <span class="flex items-center justify-center text-sm">
              <i class="icon-lower_caps" />
            </span>
          </ToggleButton>
        </div>
        <div class="toolbar-btn h-8 border-l">
          <Dropdown v-model="align" :disabled="!hasSelected" :options="alignOptions">
            <span class="flex items-center justify-center text-sm">
              <i :class="alignIcon[align]" />
            </span>
            <template #dropdown="{ value, onSelect }">
              <div class="shadow-3 mt-1 flex w-auto">
                <button
                  v-for="alignOption in alignOptions"
                  :key="alignOption"
                  class="hover:bg-white-grey p-1 transition-colors"
                  :class="value === alignOption && 'bg-clear-blue bg-opacity-15 text-clear-blue'"
                  @click="onSelect(alignOption)"
                >
                  <span class="flex items-center justify-center p-1 text-sm">
                    <i :class="alignIcon[alignOption]" />
                  </span>
                </button>
              </div>
            </template>
          </Dropdown>
        </div>
        <div class="toolbar-btn h-8 rounded-r-sm" :class="{ selected: hasSelected }">
          <Dropdown class="rounded-r-sm" :disabled="!hasSelected">
            <span class="flex items-center justify-center text-sm">
              <i class="icon-format_line_spacing" />
            </span>
            <template #dropdown>
              <div class="line-spacing-slider">
                <div class="line-spacing-slider__container">
                  <Slider v-model="lineHeight" :min="1" :max="2" :interval="0.1" :process-style="sliderStyle" />
                </div>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
    </div>
    <div v-show="$slots.extraColorPickers" class="shadow-1 ml-2 flex h-8 rounded-sm bg-white text-sm leading-none">
      <slot name="extraColorPickers" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sticky-container {
  @apply sticky top-0 z-10 flex;

  .expanded & {
    @apply absolute;
  }
}

.format-toolbar {
  @apply shadow-1 relative z-10 mb-px flex h-8 items-center rounded-sm bg-white text-sm leading-none text-black text-opacity-50 opacity-70 transition-all;

  &__selected-name {
    @apply whitespace-nowrap px-3 py-2 uppercase;

    min-width: 135px;
  }

  &__font-select {
    @apply w-full pl-4;

    &:disabled {
      @apply bg-white;
    }
  }

  .toolbar-btn {
    @apply flex cursor-not-allowed items-center justify-center transition-colors;
  }

  &.selected {
    @apply opacity-100;

    .toolbar-btn {
      @apply hover:bg-white-grey cursor-pointer;
    }
  }
}

.font-size-slider {
  @apply shadow-3 mt-1 flex rounded-md bg-white;

  width: 20.688rem;
  height: 1.875rem;

  &__container {
    @apply m-auto;

    width: 19.5rem;
  }
}

.line-spacing-slider {
  @apply shadow-3 mt-1 flex rounded-md bg-white;

  width: 6.75rem;
  height: 1.875rem;
  border-radius: 3px;

  &__container {
    @apply m-auto;

    width: 5rem;
  }
}
</style>
