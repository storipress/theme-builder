<script lang="ts">
import { clickOutside } from 'shared/directives/click-outside'

export default defineComponent({
  directives: { clickOutside },

  props: {
    value: {
      type: Boolean,
      default: null,
    },

    cover: {
      type: Boolean,
    },

    disabled: {
      type: Boolean,
    },

    lazy: {
      type: Boolean,
    },
  },

  data: () => ({ isActive: false }),

  computed: {
    active: {
      get(): boolean {
        if (this.value != null) {
          return this.value
        }
        return this.isActive
      },
      set(val: boolean) {
        if (val === false) {
          this.setActive(false)
          return
        }
        if (this.disabled) {
          return
        }
        this.setActive(val)
      },
    },
  },

  methods: {
    setActive(val: boolean) {
      if (this.value == null) {
        this.isActive = val
      }

      this.$emit('input', val)
    },

    handleClose() {
      this.setActive(false)
    },
  },
})
</script>

<template>
  <div
    v-click-outside="handleClose"
    class="popup"
    :class="active && 'popup--active'"
    aria-haspopup="true"
    :aria-expanded="`${active}`"
    @click="active = !active"
  >
    <slot name="activator" :active="active" />
    <div class="popup__content" :class="!cover && 'transform'">
      <slot v-if="!lazy || active" :on-close="handleClose" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  @apply relative float-right ml-0 mr-3 block;

  width: 2rem;
  height: 2rem;

  &__content {
    @apply absolute bottom-0 top-0 z-10 hidden  min-w-full translate-y-full;

    .popup--active & {
      @apply block;
    }
  }
}
// .popup {
//   @apply relative;

//   &__content {
//     @apply absolute top-0 bottom-0 min-w-full translate-y-full hidden z-10;

//     .popup--active & {
//       @apply block;
//     }
//   }
// }
</style>
