import type { PropOptions } from 'vue'

import { fontSize, lineHeight } from '../../utils/limits'
import { error, warning } from '../common/utils'

type StyleOptions<T> = PropOptions<T | Record<string, T>>

const BREAKPOINTS = { xs: true, md: true, lg: true } as Record<string, boolean>
const VALID_ALIGN = new Set(['left', 'center', 'right'])

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object'
}

const stubTrue = () => true

function createValidator(
  name: string,
  type: 'string' | 'number' | 'boolean',
  extraCheck: (name: string, val: unknown) => boolean = stubTrue
): (val: unknown) => boolean {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  return (val): boolean => {
    if (val == null) {
      return true
    }

    if (isObject(val)) {
      const unexpected = Object.keys(val)
        .filter((key) => !BREAKPOINTS[key])
        .join(', ')
      if (unexpected.length > 0) {
        warning(`You have passed [${unexpected}] for ${name} as style config, expected keys are only 'xs', 'md', 'lg'`)
      }
      for (const key of Object.keys(BREAKPOINTS)) {
        if (val[key] != null) {
          if (typeof val[key] !== type) {
            error(`${name} expect type ${type}, but got '${typeof val[key]}'`)
            return false
          }

          if (!extraCheck(name, val[key])) {
            return false
          }
        }
      }
      return true
    }

    if (typeof val !== type) {
      error(`${name} expect type ${type}, but got '${typeof val}'`)
      return false
    }
    if (!extraCheck(name, val)) {
      return false
    }
    return true
  }
}

function createRangeValid(min: number, max: number): (name: string, val: unknown) => boolean {
  return (name: string, val: unknown): boolean => {
    if ((val as number) < min || (val as number) > max) {
      error(`valid range for ${name} is ${min}~${max}, but got ${val}`)
      return false
    }
    return true
  }
}

export const styleProps = {
  fontSize: {
    types: [Number, Object],
    validator: createValidator('fontSize', 'number', createRangeValid(...fontSize)),
  } as StyleOptions<number>,
  fontFamily: { types: [Number, Object], validator: createValidator('fontFamily', 'string') } as StyleOptions<number>,
  bold: {
    type: [Boolean, Object],
    default: undefined,
    validator: createValidator('bold', 'boolean'),
  } as StyleOptions<boolean>,
  italic: {
    type: [Boolean, Object],
    default: undefined,
    validator: createValidator('italic', 'boolean'),
  } as StyleOptions<boolean>,
  underline: {
    type: [Boolean, Object],
    default: undefined,
    validator: createValidator('underline', 'boolean'),
  } as StyleOptions<boolean>,
  uppercase: {
    type: [Boolean, Object],
    default: undefined,
    validator: createValidator('uppercase', 'boolean'),
  } as StyleOptions<boolean>,
  lowercase: {
    type: [Boolean, Object],
    default: undefined,
    validator: createValidator('lowercase', 'boolean'),
  } as StyleOptions<boolean>,
  align: {
    types: [String, Object],
    validator: createValidator('align', 'string', (_name, val: unknown) => {
      if (!VALID_ALIGN.has(val as string)) {
        error('valid value for align are: `left`, `center`, `right`')
        return false
      }
      return true
    }),
  } as StyleOptions<string>,
  color: { types: [String, Object], validator: createValidator('color', 'string') } as StyleOptions<string>,
  lineHeight: {
    types: [Number, Object],
    validator: createValidator('lineHeight', 'number', createRangeValid(...lineHeight)),
  } as StyleOptions<number>,
  hoverColor: { types: [String, Object], validator: createValidator('hoverColor', 'string') } as StyleOptions<string>,
}
