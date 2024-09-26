<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input'],
})
</script>

<template>
  <div class="sticky bottom-0 left-0 right-0 z-[1] mx-auto flex w-fit items-end">
    <transition name="edit">
      <div v-if="value">
        <button
          class="controller mx-auto h-10 w-36 rounded-sm px-14 py-2 text-center text-base"
          @click="$emit('input', false)"
        >
          Save
        </button>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.controller {
  color: #4c4c4c;
  background: #f0f0f0;
  box-shadow: 5px 10px 30px 0 rgb(0 0 0 / 15%);
}

.edit-enter-active {
  transition: all 0.25s ease;
}

.edit-leave-active {
  transition: all 0.15s ease;
}

.edit-enter,
.edit-leave-to {
  transform: translateY(10px);
  opacity: 0%;
}
</style>
