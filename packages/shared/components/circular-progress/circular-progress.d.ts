interface CircleOptions {
  value: number | string
  max: number
  textFormat: string
}

export class CircleProgress {
  constructor(el: Element, options: CircleOptions)
  get value(): number | string
  set value(val: number | string)

  get max(): number
  set max(val: number)
}
