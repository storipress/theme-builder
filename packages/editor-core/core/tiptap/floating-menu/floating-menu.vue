<script lang="ts">
import type { Editor } from '@tiptap/vue-2'
import type { Instance, Props } from 'tippy.js'
import type { PropType } from 'vue-demi'
import type { Format } from './action-list'
import Icon from 'shared/components/icon.vue'
import invariant from 'tiny-invariant'
import tippy from 'tippy.js'

import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue-demi'
import { getBoundary, listenToViewport } from '../../../virtual-viewport/tippy-integration'
import { embed, primary } from './action-list'
import { FloatingMenu } from './floating-menu'

export default defineComponent({
  components: {
    FloatingMenu,
    Icon,
  },

  props: {
    editor: {
      required: true,
      // Editor is just a interface, so we can't use it as type validation
      type: Object as PropType<Editor>,
    },
  },

  setup(props) {
    const button = ref<HTMLElement>()
    const card = ref<HTMLElement>()
    const mq = window.matchMedia('(max-width: 375px')
    let offset: [number, number] = mq.matches ? [0, 10] : [0, 18]
    const isActive = ref(false)
    const tippyOptions: Partial<Props> = {
      offset: () => offset,
      duration: 100,
      arrow: false,
      placement: 'left',
      moveTransition: 'transform 0.2s ease-out',
      popperOptions: {
        modifiers: [
          {
            name: 'flip',
            enabled: false,
          },
        ],
      },
      onHide() {
        closeMenu()
      },
      onMount(instance) {
        instance.popper.firstElementChild!.classList.add('transition-opacity', 'editor-menu-effect')
      },
    }

    let tp: Instance

    function applyOn(format: Format): boolean {
      return props.editor.commands[format.action](format.options as any)
    }

    function toggleMenu() {
      isActive.value = !isActive.value
    }

    function closeMenu(): void {
      isActive.value = false
    }

    function updateOffset() {
      offset = mq.matches ? [0, 10] : [0, 18]
    }

    watch(isActive, (val) => {
      if (val) {
        tp.show()
        document.body.classList.add('no-tooltip')
      } else {
        tp.hide()
        document.body.classList.remove('no-tooltip')
      }
    })

    onMounted(() => {
      document.body.addEventListener('click', closeMenu, { passive: true })
      mq.addEventListener('change', updateOffset)

      const boundary = getBoundary()
      invariant(boundary instanceof HTMLElement, 'boundary is not virtual viewport')

      tp = tippy(button.value as HTMLElement, {
        content: card.value as HTMLElement,
        duration: 150,
        arrow: false,
        hideOnClick: 'toggle',
        interactive: true,
        onMount(instance) {
          instance.popper.firstElementChild!.classList.add('transition-opacity', 'editor-menu-effect')
        },
        placement: 'right-start',
        popperOptions: {
          modifiers: [
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['right', 'right-end'],
                boundary,
              },
            },
          ],
        },
        trigger: 'manual',
      })

      listenToViewport(tp)
    })

    onBeforeUnmount(() => {
      document.body.removeEventListener('click', closeMenu)
      mq.removeEventListener('change', updateOffset)
    })

    return {
      button,
      card,

      isActive,
      primary,
      embed,
      tippyOptions,

      toggleMenu,
      closeMenu,
      applyOn,
      applyCommand(format: Format) {
        applyOn(format)
        isActive.value = false
      },
    }
  },
})
</script>

<template>
  <FloatingMenu
    class="outline-none"
    tabindex="-1"
    :editor="editor"
    :tippy-options="tippyOptions"
    @blur.native="closeMenu"
    @hide="isActive = false"
  >
    <div ref="container" class="z-20">
      <button ref="button" class="toggle-btn" @click.stop="toggleMenu">
        <span class="icon-plus" />
      </button>

      <div ref="card" class="resources" @click.stop>
        <p class="group-title">Basic Blocks</p>

        <section class="group-actions group-actions-basic">
          <div
            v-for="format in primary"
            :key="format.name"
            class="group-action basic-action"
            @click="applyCommand(format)"
          >
            <div class="action-icon">
              <componet :is="format.component" />
            </div>

            <span>{{ format.name }}</span>
          </div>
        </section>

        <hr />

        <p class="group-title">Rich Media Embeds</p>

        <section class="group-actions group-actions-rich">
          <div v-for="format in embed" :key="format.name" class="group-action rich-action" @click="applyOn(format)">
            <div class="action-icon">
              <componet :is="format.component" />
            </div>

            <div class="action-content">
              <div class="action-name">{{ format.name }}</div>
              <div class="action-description">{{ format.description }}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </FloatingMenu>
</template>

<style lang="scss" scoped>
.toggle-btn {
  @apply transition-colors;
  @apply flex items-center justify-center;

  border-radius: 2px;
  height: 1.25rem;
  width: 1.25rem;

  &:hover {
    background-color: rgb(0 0 0 / 5%);
  }

  span {
    color: rgb(0 0 0 / 25%);
    font-size: 0.813rem;
  }
}

.resources {
  @apply bg-white;

  border-radius: 2px;
  box-shadow: 0 2px 5px 2px rgb(0 0 0 / 10%);
  padding: 1rem 0.7rem;
  width: 21.5rem;

  hr {
    margin: 1rem 0;
  }

  .group-title {
    @apply uppercase;

    color: #485353;
    font-size: 0.625rem;
    font-weight: 700;
    line-height: 0.625rem;
    margin: 0 0.35rem 0.5rem;
    opacity: 75%;
  }

  .group-actions {
    @apply grid;

    gap: 10px;

    .group-action {
      @apply flex items-center;
      @apply cursor-pointer;

      border-radius: 5px;
      box-shadow: 0 1px 5px 0 rgb(0 0 0 / 15%);
      transition:
        box-shadow 200ms ease,
        background-color 100ms ease;

      &:hover {
        background-color: #f0f0f0;
        box-shadow:
          0 2px 10px 0 rgb(0 0 0 / 15%),
          0 1px 5px 0 rgb(0 0 0 / 15%);
      }
    }
  }

  .group-actions-basic {
    @apply grid-cols-5;

    .group-action {
      @apply flex-col justify-center;
      @apply h-14 w-14;

      .action-icon {
        @apply flex justify-center;
        @apply h-6 w-6;

        svg {
          max-height: 100%;
          max-width: 100%;
        }
      }

      span {
        @apply mt-1;

        color: #3d3d3d;
        font-size: 0.6rem;
        font-weight: 300;
      }
    }
  }

  .group-actions-rich {
    @apply grid-cols-2;

    .group-action {
      height: 3.5rem;
      padding: 0.625rem;

      .action-icon {
        @apply flex justify-center;
        @apply h-6 w-6;

        svg {
          max-height: 100%;
          max-width: 100%;
        }
      }

      .action-content {
        @apply flex flex-col justify-center;

        height: 100%;
        margin-left: 0.625rem;

        .action-name,
        .action-description {
          color: #181918;
          line-height: 100%;
        }

        .action-name {
          font-size: 0.813rem;
          margin-bottom: 0.2rem;
        }

        .action-description {
          font-size: 0.6rem;
          font-weight: 300;
        }
      }
    }
  }
}
</style>
