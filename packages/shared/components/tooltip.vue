<script lang="ts">
import type { Instance, Modifier } from '@popperjs/core'
import type { VueConstructor } from 'vue'
import { createPopper } from '@popperjs/core'
import Vue from 'vue'

type withPopper = VueConstructor<Vue & { popper: Instance }>

export default (Vue as withPopper).extend({
  props: {
    element: {
      type: String,
      default: 'div',
    },

    enabled: {
      type: Boolean,
      default: false,
    },

    content: {
      type: String,
    },

    arrow: {
      type: Boolean,
      default: true,
    },

    force: {
      type: Boolean,
      default: false,
    },

    forceCenter: {
      type: Boolean,
      default: false,
    },

    skidding: {
      type: Number,
      default: 0,
    },

    distance: {
      type: Number,
      default: 0,
    },

    placement: {
      type: String,
      default: 'auto',
    },
  },

  data: () => ({ hovered: false }),

  computed: {
    show(): boolean {
      return this.enabled && this.hovered
    },
  },

  watch: {
    async show(val: boolean) {
      if (val) {
        await Vue.nextTick()
        this.popper.update()
      }
    },
  },

  mounted() {
    const modifiers: Array<Pick<Modifier<string, Record<string, unknown>>, 'name' | 'options'>> = [
      {
        name: 'offset',
        options: {
          offset: [this.skidding, this.distance],
        },
      },
    ]

    if (!this.forceCenter) {
      modifiers.push({
        name: 'arrow',
        options: {
          element: this.$refs.arrow as HTMLElement,
        },
      })
    }

    this.popper = createPopper(this.$refs.trigger as HTMLElement, this.$refs.tooltip as HTMLElement, {
      placement: this.placement as any,
      modifiers,
    })
  },
})
</script>

<template>
  <component :is="element" ref="trigger" @mouseenter="hovered = true" @mouseleave="hovered = false" v-on="$listeners">
    <slot />
    <transition name="fade">
      <div
        v-show="show"
        ref="tooltip"
        class="tooltip"
        :class="{ 'tooltip--force': force }"
        :data-popper-placement="placement"
      >
        <slot name="tooltip">{{ content }}</slot>

        <div v-if="arrow" ref="arrow" class="arrow" :class="forceCenter && 'arrow--center'"></div>
      </div>
    </transition>
  </component>
</template>

<style scoped lang="scss">
.tooltip {
  @apply pointer-events-none p-2 text-sm leading-none text-white;

  background-color: hsl(0, 0%, 20%);

  .arrow {
    &--center {
      position: absolute;
    }

    &::before {
      position: absolute;
      width: 8px;
      height: 8px;
      z-index: -1;
      content: '';
      transform: rotate(45deg);
      background-color: hsl(0, 0%, 20%);
    }
  }
}

.tooltip[data-popper-placement^='top'] > .arrow {
  bottom: -4px;
}

.tooltip[data-popper-placement^='bottom'] > .arrow {
  top: -4px;
}

.tooltip[data-popper-placement^='left'] > .arrow {
  right: 4px;

  &--center {
    @apply top-1/2;

    &::before {
      transform: rotate(45deg) translate(-50%, -50%);
    }
  }
}

.tooltip[data-popper-placement^='right'] > .arrow {
  left: 4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
