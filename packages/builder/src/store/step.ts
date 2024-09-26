import type { Patch } from 'immer'
import { applyPatches } from 'immer'

export interface BaseStep {
  patches: Patch[]
  inversePatches: Patch[]
  isEmpty: boolean
  inverse: () => BaseStep
  apply: (obj: any) => void
}

export class Step implements BaseStep {
  target: string
  patches: Patch[]
  inversePatches: Patch[]

  constructor(target: string, patches: Patch[], inversePatches: Patch[]) {
    this.target = target
    this.patches = patches
    this.inversePatches = inversePatches
  }

  get isEmpty() {
    return this.patches.length === 0 && this.inversePatches.length === 0
  }

  inverse(): Step {
    const { target, patches, inversePatches } = this
    return new Step(target, inversePatches, patches)
  }

  apply(obj: any) {
    obj[this.target] = applyPatches(obj[this.target], this.inversePatches)
  }
}

export class AggregateStep<T> implements BaseStep {
  steps: BaseStep[]

  constructor(steps: BaseStep[]) {
    this.steps = steps
  }

  get isEmpty() {
    return this.steps.every((step) => step.isEmpty)
  }

  get patches() {
    return this.steps.flatMap(({ patches }) => patches)
  }

  get inversePatches() {
    return this.steps.flatMap(({ inversePatches }) => inversePatches)
  }

  inverse() {
    return new AggregateStep<T>(this.steps.map((step) => step.inverse()))
  }

  apply(obj: any) {
    for (const step of this.steps) {
      step.apply(obj)
    }
  }
}
