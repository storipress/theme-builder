<script lang="ts" setup>
defineProps({
  value: Number,
})

const emit = defineEmits(['input', 'resize'])

const root = ref<HTMLElement>()

onMounted(() => {
  const $root = root.value!

  const observer = new ResizeObserver((entries) => {
    const height = $root.scrollHeight
    emit('resize', { width: $root.scrollWidth, height })
    emit('input', height)
  })

  observer.observe($root)

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})
</script>

<template>
  <div ref="root">
    <slot />
  </div>
</template>
