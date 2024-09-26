<script lang="ts">
import Logo from '../../../assets/logo.svg'
import Dialog from './dialog.vue'

export default defineComponent({
  components: { Dialog, Logo },
  props: {
    buttons: Array,
    logo: {
      type: Boolean,
      default: true,
    },
    value: Boolean,
  },
})
</script>

<template>
  <Dialog v-if="value" center @click="$emit('input', false)">
    <div class="confirm">
      <div class="confirm-content">
        <div v-if="logo" class="logo">
          <Logo class="text-almost-black" />
        </div>
        <div>
          <slot />
        </div>
      </div>
      <div class="divide-warm-grey confirm-actions divide-x">
        <button
          v-for="btn in buttons"
          :key="btn"
          class="text-brownish-grey block w-full py-3 uppercase"
          @click="$emit('click', btn)"
        >
          {{ btn }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
.confirm {
  @apply shadow-1;
  @apply w-128 rounded bg-white;

  &__content {
    @apply flex justify-center;

    padding: 1.563rem 2.438rem;
  }

  &__actions {
    @apply border-warm-grey flex border-t;
  }
}

.logo {
  @apply shadow-2;
  @apply bg-white-grey flex items-center justify-center rounded-full;

  margin-right: 1.25rem;
  padding: 1.313rem;
  width: 5.313rem;
  height: 5.313rem;
}
</style>
