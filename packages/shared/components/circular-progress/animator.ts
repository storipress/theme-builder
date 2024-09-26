type Easing = (time: number, start: number, step: number, duration: number) => number
type EasingType =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc'

/**
 * Change any value using an animation easing function.
 * @param  {string}   Easing function.
 * @param  {number}   The initial value
 * @param  {number}   Change in value
 * @param  {number}   Animation duration
 * @param  {Function} Callback to be called on each iteration. The callback is passed one argument: current value.
 */
export function animator(
  easing: EasingType | Easing,
  startValue: number,
  valueChange: number,
  dur: number,
  cb: (val: number) => void
) {
  const easeFunc = typeof easing === 'string' ? animator.easings[easing] : easing
  let tStart: number

  const frame = (t: number) => {
    if (!tStart) tStart = t
    t -= tStart
    t = Math.min(t, dur)
    const curVal = easeFunc(t, startValue, valueChange, dur)
    cb(curVal)
    if (t < dur) requestAnimationFrame(frame)
    else cb(startValue + valueChange)
  }

  requestAnimationFrame(frame)
}

const easings: Record<EasingType, Easing> = {
  linear(t, b, c, d) {
    return (c * t) / d + b
  },

  easeInQuad(t, b, c, d) {
    t /= d
    return c * t * t + b
  },
  easeOutQuad(t, b, c, d) {
    t /= d
    return -c * t * (t - 2) + b
  },
  easeInOutQuad(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  },

  easeInCubic(t, b, c, d) {
    t /= d
    return c * t * t * t + b
  },
  easeOutCubic(t, b, c, d) {
    t /= d
    t--
    return c * (t * t * t + 1) + b
  },
  easeInOutCubic(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t * t + b
    t -= 2
    return (c / 2) * (t * t * t + 2) + b
  },

  easeInQuart(t, b, c, d) {
    t /= d
    return c * t * t * t * t + b
  },
  easeOutQuart(t, b, c, d) {
    t /= d
    t--
    return -c * (t * t * t * t - 1) + b
  },
  easeInOutQuart(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t * t * t + b
    t -= 2
    return (-c / 2) * (t * t * t * t - 2) + b
  },

  easeInQuint(t, b, c, d) {
    t /= d
    return c * t * t * t * t * t + b
  },
  easeOutQuint(t, b, c, d) {
    t /= d
    t--
    return c * (t * t * t * t * t + 1) + b
  },
  easeInOutQuint(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t * t * t * t + b
    t -= 2
    return (c / 2) * (t * t * t * t * t + 2) + b
  },

  easeInSine(t, b, c, d) {
    return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b
  },
  easeOutSine(t, b, c, d) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b
  },
  easeInOutSine(t, b, c, d) {
    return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b
  },

  easeInExpo(t, b, c, d) {
    return c * 2 ** (10 * (t / d - 1)) + b
  },
  easeOutExpo(t, b, c, d) {
    return c * (-(2 ** ((-10 * t) / d)) + 1) + b
  },
  easeInOutExpo(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * 2 ** (10 * (t - 1)) + b
    t--
    return (c / 2) * (-(2 ** (-10 * t)) + 2) + b
  },

  easeInCirc(t, b, c, d) {
    t /= d
    return -c * (Math.sqrt(1 - t * t) - 1) + b
  },
  easeOutCirc(t, b, c, d) {
    t /= d
    t--
    return c * Math.sqrt(1 - t * t) + b
  },
  easeInOutCirc(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b
    t -= 2
    return (c / 2) * (Math.sqrt(1 - t * t) + 1) + b
  },
}

/**
 * Map of easings' strings to functions
 * Easing functions from http://gizma.com/easing/
 * @type {object}
 */
animator.easings = easings
