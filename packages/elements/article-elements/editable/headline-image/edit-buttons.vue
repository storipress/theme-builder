<script lang="ts">
import type { DialogInfo } from '@storipress/editor-core'
import { useRemoteDialog } from '@storipress/editor-core'
import { defineComponent, ref, watch } from 'vue-demi'

import AutoSizeInput from '../../../common/auto-size-input.vue'
import { useArticleElement } from '../../inject'
import Unsplash from './unsplash.svg'

interface UnsplashPhoto {
  src: string
  alt: string
  title: string
}

type UnsplashDialogInfo = DialogInfo<'unsplash', true, UnsplashPhoto>

export default defineComponent({
  components: {
    AutoSizeInput,
    Unsplash,
  },
  props: {
    hasImage: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
  },

  setup(props, { emit }) {
    const element = useArticleElement()
    const localAlt = ref(props.value || '')

    watch(
      () => props.value,
      (val) => {
        if (val && val !== localAlt.value) {
          localAlt.value = val
        }
      }
    )
    const { open } = useRemoteDialog<UnsplashDialogInfo>('unsplash')

    return {
      localAlt,
      onUpload(event: Event) {
        const target = event.target as HTMLInputElement
        const files = target.files as FileList
        emit('upload', files[0])
      },
      async handleUnsplash() {
        const photo = await open(true)
        if (photo) {
          element.value.headlineURL = photo.src
          element.value.headlineAlt = photo.alt
          element.value.headlineCaption = photo.title
        }
      },
    }
  },
})
</script>

<template>
  <div class="edit-button">
    <div class="menu-bg">
      <div v-if="hasImage" class="alt-input">
        <AutoSizeInput
          v-model="localAlt"
          class="textinput-text w-full pl-px"
          input-class="placeholder-greyish-brown placeholder-opacity-50"
          placeholder="Enter alt text"
          @change="$emit('input', $event.target.value)"
        />

        <div class="alt-text-wrapper pl-2">
          <div class="alt-text-indicator">Alt</div>
        </div>
      </div>

      <!-- <div v-if="hasImage" class="button" @click="$emit('open-focus')">
        <span class="icon-focal_point icon" />
      </div> -->

      <label class="button">
        <span class="icon-add_image icon" />
        <input class="hidden" accept="image/*" type="file" @change="onUpload" />
      </label>

      <div class="button" role="button" @click="handleUnsplash">
        <Unsplash class="h-4 w-4" />
      </div>

      <div v-if="hasImage" class="button" @click="$emit('remove')">
        <span class="icon-delete icon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// tippy state
[data-state='visible'] {
  .edit-button {
    .menu-bg {
      @apply opacity-100;

      transition-delay: 0ms;
    }
  }
}

.edit-button {
  .menu-bg {
    @apply flex;
    @apply shadow-1;
    @apply h-8;
    @apply bg-white;
    @apply opacity-0;

    transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 400ms;

    .button {
      @apply transition-colors;
      @apply flex items-center justify-center;
      @apply w-8 px-1 py-2;
      @apply cursor-pointer;

      &:hover {
        background-color: #f0f0f0;
      }

      .icon {
        font-size: 0.8rem;
      }
    }
  }
}

.alt-input {
  @apply flex items-center justify-between;
  @apply py-2 pl-3 pr-1;
  @apply w-fit;
  @apply gap-x-2;

  border: 1.5px solid #b2def1;
  min-width: 9rem;
  border-radius: 2px 0 0 2px;
  background-color: #f0f0f0;
  color: #333;
}

.textinput-text {
  @apply placeholder-greyish-brown inline-block w-full items-center bg-transparent placeholder-opacity-50;
  @apply focus:outline-none;

  font-size: 0.9rem;
}

.alt-text-wrapper {
  @apply justify-center;
  @apply flex;
  @apply items-center;
  @apply h-6;
  @apply px-1;
  @apply border;
  @apply border-clear-blue;
  @apply rounded-sm;
  @apply bg-clear-blue;
  @apply bg-opacity-20;
}

.alt-text-indicator {
  font-family: Lato, sans-serif;
  color: #2b8bf2;
  line-height: 100%;
}
</style>
