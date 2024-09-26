import type { PropOptions, PropType } from 'vue'

type StyleProp<T> = PropType<T | Record<string, T>>
type StyleOptions<T> = PropOptions<T | Record<string, T>>

export const styleProps = {
  fontSize: [Number, Object] as StyleProp<number>,
  fontFamilly: [String, Object] as StyleProp<string>,
  bold: { type: [Boolean, Object], default: undefined } as StyleOptions<boolean>,
  italic: { type: [Boolean, Object], default: undefined } as StyleOptions<boolean>,
  underline: { type: [Boolean, Object], default: undefined } as StyleOptions<boolean>,
  uppercase: { type: [Boolean, Object], default: undefined } as StyleOptions<boolean>,
  lowercase: { type: [Boolean, Object], default: undefined } as StyleOptions<boolean>,
  align: [String, Object] as StyleProp<string>,
  color: [String, Object] as StyleProp<string>,
  lineHeight: [Number, Object] as StyleProp<number>,
}
