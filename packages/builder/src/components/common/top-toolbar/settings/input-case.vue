<template>
  <div class="input-case">
    <div class="border-b border-b-[rgb(0_0_0/12%)]">
      <slot />
    </div>
    <slot name="error" />
  </div>
</template>

<style lang="scss" scoped>
.input-case {
  @apply flex h-auto w-full flex-col text-left;

  margin-bottom: 1.875rem;

  label {
    @apply text-xs;

    color: #717171;
  }

  input,
  textarea {
    @apply grow text-base text-black opacity-100;

    transition: opacity 0.2s ease-in;
    outline: none;

    &:disabled {
      opacity: 15%;
    }

    &::placeholder {
      opacity: 40%;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
