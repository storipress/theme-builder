import type { DirectiveOptions } from 'vue'

function fadeIn(e: Event) {
  if (!(e.target instanceof HTMLImageElement)) return false

  const el = e.target

  el.style.removeProperty('opacity')
  setTimeout(() => {
    el.style.removeProperty('will-change')
    el.style.removeProperty('transition-duration')
    el.classList.remove('transition-opacity')
  }, 500)
}

export const imageFadeIn: DirectiveOptions = {
  bind: (el) => {
    if (!(el instanceof HTMLImageElement)) return false
    el.style.willChange = 'opacity'
    el.style.opacity = '0'
    el.style.transitionDuration = '0.3s'
    el.classList.add('transition-opacity')

    el.addEventListener('load', fadeIn, { once: true })
  },
}
