<script lang="ts" setup>
import type { SnackbarType } from './definition'

// from https://github.com/storipress/core-component/blob/master/stories/App%20Components/Snackbar/index.vue
import { computed } from 'vue'
import { classname } from './classname'

const props = withDefaults(
  defineProps<{
    title?: string
    icon?: string
    buttonText?: string | false
    buttonIcon?: string | false
    type?: SnackbarType
  }>(),
  {
    title: '',
    icon: 'tick_circle',
    buttonText: '',
    buttonIcon: 'arrow_right',
    type: 'default',
  },
)

defineEmits<{
  (event: 'click'): void
}>()

const backgroundColor = computed(() => {
  return props.type ? classname[props.type].backgroundColor : classname.default.backgroundColor
})
const textColor = computed(() => {
  return props.type ? classname[props.type].textColor : classname.default.textColor
})
const textHover = computed(() => {
  return props.type ? classname[props.type].textHover : classname.default.textHover
})
</script>

<template>
  <div class="layer-2 w-fit min-w-[33rem] rounded border border-gray-100 bg-white">
    <div class="flex items-center justify-center p-4" :class="backgroundColor">
      <div class="flex-shrink-0">
        <slot name="icon">
          <i :class="[textColor, `icon-${icon}`]" />
        </slot>
      </div>
      <div class="ml-3 flex-1 md:flex md:justify-between">
        <p class="text-body" :class="textColor">{{ title }}</p>
        <button
          v-if="buttonText"
          type="button"
          class="text-body mt-3 whitespace-nowrap md:ml-6 md:mt-0"
          :class="[textColor, textHover]"
          @click="$emit('click')"
        >
          {{ buttonText }}
          <i v-if="buttonIcon" class="ml-1.5 text-[0.7rem]" :class="`icon-${buttonIcon}`" />
        </button>
      </div>
    </div>
  </div>
</template>
