<script lang="ts">
import type { DialogInfo } from '@storipress/editor-core'
import type Vue from 'vue'
import { useRemoteDialog } from '@storipress/editor-core'
import { ResponsiveImage } from '@storipress/elements/common'
import { CircularProgress } from 'shared/components/circular-progress'
import createTippy from 'tippy.js'
import { computed, defineComponent, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue-demi'

import { isAnimated } from '../../../utils/file'
import { useArticleElement } from '../../inject'
import { HEADLINE_TARGET } from '../headline-symbol'
import EditButtons from './edit-buttons.vue'

interface Focus {
  x: number
  y: number
}

interface Info {
  url: string
  original: Focus
}

type FocusDialogInfo = DialogInfo<'focus', Info, Focus>

export default defineComponent({
  components: { ResponsiveImage, CircularProgress, EditButtons },

  setup() {
    const root = ref<HTMLElement>()
    const buttons = ref<Vue>()
    const tempImage = ref('')
    const dragStatus = ref(false)

    const $element = useArticleElement()

    const headline = computed(() => tempImage.value || $element.value.headlineURL)
    const headlineAlt = computed({
      get() {
        return $element.value.headlineAlt
      },
      set(val: string) {
        $element.value.headlineAlt = val
      },
    })

    onMounted(() => {
      const target = inject(HEADLINE_TARGET, ref())
      const tippy = createTippy(root.value!, {
        content: buttons.value!.$el,
        interactive: true,
        offset: [0, 8],
        placement: 'bottom',
        trigger: 'mouseenter focusin',
        delay: [150, 0],
        duration: 150,
      })

      watch(
        target,
        (triggerTarget) => {
          if (triggerTarget) {
            tippy.setProps({
              triggerTarget,
            })
          }
        },
        { immediate: true }
      )

      onBeforeUnmount(() => {
        tippy.destroy()
      })
    })

    async function handleOpenFocus() {
      const { headlineURL, headlineFocus } = $element.value
      if (!headlineURL) {
        return
      }
      const { open } = useRemoteDialog<FocusDialogInfo>('focus')

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const newFocus = await open({
        url: headlineURL,
        original: headlineFocus,
      })

      $element.value.headlineFocus = newFocus ?? headlineFocus
    }

    async function processFile(file: File) {
      if (!(await isAnimated(file))) {
        tempImage.value = URL.createObjectURL(file)
        const res = await $element.value.uploadImage(file)
        if (tempImage.value) {
          URL.revokeObjectURL(tempImage.value)
          tempImage.value = ''
        }
        const headline = $element.value.createImageURL(res)
        $element.value.headlineURL = headline
        // handleOpenFocus()
      }
    }

    return {
      root,
      buttons,

      tempImage,
      dragStatus,
      headline,
      headlineAlt,
      focus: computed(() => $element.value.headlineFocus),
      indicator: computed(() => {
        if (!headline.value) {
          return 'Add Header Photo'
        } else if (!headlineAlt.value) {
          return 'Missing alt text'
        }
        return ''
      }),

      handleRemove() {
        $element.value.headlineURL = null
        $element.value.headlineAlt = ''
        $element.value.headlineFocus = { x: 0, y: 0 }
      },

      handleDragLeave() {
        dragStatus.value = false
      },

      handleDragOver(event: DragEvent) {
        event.preventDefault()
        event.stopPropagation()

        dragStatus.value = true
      },

      handleDrop(event: DragEvent) {
        dragStatus.value = false

        const hasFiles = (event.dataTransfer?.files?.length ?? 0) > 0

        if (!hasFiles) {
          return
        }

        const images = [...(event.dataTransfer?.files ?? [])].filter((file) => /image/i.test(file.type))

        if (images.length === 0) {
          return
        }

        const image = images[0]

        event.preventDefault()
        processFile(image)
      },

      processFile,
      handleOpenFocus,
    }
  },
})
</script>

<template>
  <div ref="root" class="headline tippy-none" :class="!headline && $style.headlineEmpty">
    <div
      :class="$style.headlineContainer"
      @dragenter="handleDragOver"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <!-- w-auto h-auto is used to prevent aspect ratio plugin affect -->
      <ResponsiveImage
        v-if="headline"
        class="absolute inset-0 h-auto min-h-full w-auto min-w-full object-cover"
        :src="headline"
        :alt="headlineAlt || 'headline'"
        :value="focus"
      />

      <div v-if="indicator" :class="$style.indicator">{{ indicator }}</div>
    </div>
    <div v-if="tempImage" class="absolute inset-0 flex h-full w-full flex-col items-center justify-center">
      <CircularProgress indeterminate />
      <div class="text-white">Uploading</div>
    </div>
    <EditButtons
      ref="buttons"
      v-model="headlineAlt"
      :has-image="!!headline"
      :is-dragging="dragStatus"
      @open-focus="handleOpenFocus"
      @remove="handleRemove"
      @upload="processFile"
    />
  </div>
</template>

<style lang="scss" module>
.headline-empty {
  min-height: 12rem;

  @screen md {
    min-height: 32rem;
  }
}

.headline-container {
  @apply relative h-full overflow-hidden;

  background-color: rgba(0, 0, 0, 0.8);

  .headline-empty & {
    min-height: 12rem;

    @screen md {
      min-height: 32rem;
    }
  }

  .indicator {
    @apply text-almost-black absolute bottom-0 left-1/2 mx-auto -translate-x-1/2 transform bg-white px-2 py-1 font-light;
    @apply shadow-1;

    border-radius: 3px;
    margin-bottom: 0.625rem;
  }
}
</style>
