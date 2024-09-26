<script lang="ts">
// https://github.com/TowelSoftware/tailwindcss-toggle

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
    },
  },

  data() {
    return {
      ignore: false,
    }
  },

  methods: {
    emitInput(event: InputEvent) {
      if (this.ignore) {
        event.preventDefault()
        return
      }

      if (this.disabled) {
        event.preventDefault()
        return
      }

      const $el = event.target as HTMLInputElement
      this.$emit('input', $el.checked)
    },
  },
})
</script>

<template>
  <div class="my-2 mb-2 w-full">
    <label class="pointer flex items-center">
      <span class="mr-2 grow select-none">
        <slot />
      </span>
      <label class="switch" :for="name" :class="{ 'switch--disabled': disabled }">
        <input
          v-if="!disabled"
          :id="name"
          type="checkbox"
          :name="name"
          class="switch__checkbox"
          :checked="value"
          @change="emitInput"
        />
        <span class="switch__slider" @transitionstart="ignore = true" @transitionend="ignore = false" />
      </label>
    </label>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';

.switch {
  @apply relative inline-block w-12 select-none leading-normal;

  &__checkbox {
    @apply hidden;
  }

  &__slider {
    @apply flex cursor-pointer items-center justify-start rounded-full shadow-inner;
    @apply h-3.5 w-9;

    min-width: 36px;
    background-color: #9f9f9f;
    transition: background-color 0.2s ease-in;

    &::before {
      @apply absolute right-0 block rounded-full border-4;
      @apply h-5 w-5;

      left: 28px;
      margin-left: -30px;
      top: -25%;
      content: '';
      background-color: #fff;
      border: 0.5px solid;
      box-shadow:
        0 1px 1px 0 rgba(0, 0, 0, 0.24),
        0 1px 5px 0 rgba(0, 0, 0, 0.12);
      border-image-source: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.12),
        rgba(255, 255, 255, 0.06) 20%,
        rgba(255, 255, 255, 0)
      );
      border-image-slice: 1;
      transition: all 0.2s ease-in;
    }
  }

  &__checkbox:checked + &__slider {
    @apply justify-end shadow-none;

    background-color: #9ccd7c;
  }

  &__checkbox:checked + &__slider::before {
    left: 46px;
    background-color: #44a604;
    border: 0.5px solid #44a604;
    border-image-source: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.06) 20%,
      rgba(255, 255, 255, 0)
    );
    border-image-slice: 1;
  }

  &.switch--disabled {
    .switch__slider {
      cursor: not-allowed;
      background-color: color.change(#e4e4e4, $alpha: 0.2);

      &::before {
        background-color: color.change(#bdbdbd, $alpha: 0.2);
        border-color: color.change(#bdbdbd, $alpha: 0.2);
      }
    }

    .switch__checkbox:checked + &__slider {
      background-color: color.change(#9ccd7c, $alpha: 0.2);
    }

    .switch__checkbox:checked + &__slider::before {
      background-color: color.change(#44a604, $alpha: 0.2);
      border-color: color.change(#44a604, $alpha: 0.2);
    }
  }
}
</style>
