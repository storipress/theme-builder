import type { ComputedOptions } from 'vue'
import Vue from 'vue'

interface EditableStylesOptions {
  getStyles: () => Record<string, any>
  setStyle: (style: Record<string, any>) => void
}

type VueWithEditableStyles = Vue & { editableStyles: Record<string, any> }

const KEYS = [
  'fontSize',
  'fontFamily',
  'bold',
  'italic',
  'underline',
  'lineHeight',
  'align',
  'color',
  'uppercase',
  'lowercase',
]

function createFlatAccessor(): Record<string, ComputedOptions<any>> {
  return Object.fromEntries(
    KEYS.map((key) => [
      key,
      {
        get(this: VueWithEditableStyles) {
          return this.editableStyles[key]
        },

        set(this: VueWithEditableStyles, val: any) {
          this.editableStyles[key] = val
        },
      },
    ]),
  )
}

export const flatAccessor = createFlatAccessor()

export function createEditableStyles({ getStyles, setStyle }: EditableStylesOptions): Vue {
  const createAccessor = (names: string[], nameWithMapper: Record<string, (val: any) => object> = {}) => {
    const mergedMapper = [
      ...names.map<[string, (val: any) => object]>((name) => [name, (val: any) => ({ [name]: val })]),
      ...Object.entries(nameWithMapper),
    ]

    return {
      ...Object.fromEntries(
        mergedMapper.map(([name, mapper]) => [
          name,
          {
            get() {
              return getStyles()[name]
            },

            set(val: unknown) {
              setStyle(mapper(val))
            },
          },
        ]),
      ),
    }
  }

  return new Vue({
    computed: createAccessor(
      ['fontSize', 'fontFamily', 'bold', 'italic', 'underline', 'lineHeight', 'align', 'color'],
      {
        uppercase: (uppercase: boolean) => ({
          uppercase,
          lowercase: false,
        }),
        lowercase: (lowercase: boolean) => ({
          lowercase,
          uppercase: false,
        }),
      },
    ),
  })
}
