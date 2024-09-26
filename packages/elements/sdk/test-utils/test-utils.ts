import { finder } from '@medv/finder'
import { createTestUtils } from 'shared/code-generator/style-tree/test-utils'
import { dedent } from 'ts-dedent'

import { fontSize, lineHeight } from '../../utils/limits'

const utils = createTestUtils({ getStore: () => Reflect.get(window, '__STORE__') })
const identity = (x: string): string => x

interface Target {
  name?: string
  values: () => Iterable<unknown>
  toStyle: (x: any, $el: HTMLElement) => string
  compare?: (a: any, b: any) => boolean
  possible?: string[]
}

interface BaseReport {
  type: string
  message: string
}

interface UsageReport extends BaseReport {
  type: 'usage'
  kind: string
  style?: string
  path?: string[]
  values?: [string, string]
}

interface GeneralReport extends BaseReport {
  type: 'general'
  selector: string
}

type Report = UsageReport | GeneralReport

const colorMap: Record<string, string> = {
  ff0000: 'rgb(255, 0, 0)',
  '00ff00': 'rgb(0, 255, 0)',
  '0000ff': 'rgb(0, 0, 255)',
}

const targets: Record<string, Target> = {
  fontSize: {
    // because Chrome has minimal font-size limit for accessibility, so here use 14 as font size lower bound
    values: createRangeValues(14, fontSize[1]),
    toStyle: (n: number) => `${n}px`,
    possible: ['text-xs', 'text-sm', '...'],
  },
  fontFamily: {
    values: () => ['Roboto'],
    toStyle: identity,
  },
  bold: {
    name: 'font-weight',
    values: () => [true, false],
    toStyle: (x: boolean) => (x ? '700' : '400'),
    possible: ['font-bold', 'font-semibold', '...'],
  },
  italic: {
    name: 'font-style',
    values: () => [true, false],
    toStyle: (x: boolean) => (x ? 'italic' : 'normal'),
    possible: ['italic'],
  },
  // underline: { type: [Boolean, Object], default: undefined } as StyleOptions<boolean>,
  uppercase: {
    name: 'text-transform',
    values: () => [true, false],
    toStyle: (x: boolean) => (x ? 'uppercase' : 'none'),
    possible: ['uppercase', 'lowercase', '...'],
  },
  lowercase: {
    name: 'text-transform',
    values: () => [true, false],
    toStyle: (x: boolean) => (x ? 'lowercase' : 'none'),
    possible: ['uppercase', 'lowercase', '...'],
  },
  align: {
    name: 'text-align',
    values: () => ['left', 'center', 'right'],
    toStyle: identity,
    possible: ['text-center', 'text-right', '...'],
  },
  color: {
    values: () => ['ff0000', '00ff00', '0000ff'],
    toStyle: (x: string) => colorMap[x],
    possible: ['text-*'],
  },
  lineHeight: {
    values: createRangeValues(...lineHeight),
    toStyle: (x: number, $el: HTMLElement) => {
      const styles = window.getComputedStyle($el)
      const base = Number.parseFloat(styles.fontSize) || 16
      return `${x * base}px`
    },
    possible: ['leading-*'],
  },
}

export const update = utils.update
export const nextTick = utils.nextTick

export async function testSpecificItem(path: string[], property: string): Promise<UsageReport[] | void> {
  const report: UsageReport[] = []
  const name = path[path.length - 1]
  const $el = document.querySelector(utils.resolveSelector(path))
  if (!$el) {
    report.push({ type: 'usage', kind: name, message: `could not found .${name}` })
    return
  }
  const computedStyles = getComputedStyle($el)
  const info = targets[property]
  const styleName = info.name ?? property
  for (const value of info.values()) {
    const restore = await update({ path, property: styleName, value: { xs: value } })
    const expected = info.toStyle(value, $el as HTMLElement)
    const actual = (computedStyles as any)[styleName]
    const compare = info.compare ?? Object.is
    if (!compare(expected, actual)) {
      console.log(`Expect ${name} has \`${styleName}: ${expected}\` but got \`${actual}\``)
      report.push({
        type: 'usage',
        kind: name,
        style: styleName,
        message: dedent`Found ${name} seem not respect to ${styleName} config${formatPossible(
          styleName,
          info.possible
        )}`,
        path,
        values: [expected, actual],
      })
      restore()
    }
  }

  return report
}

export async function generateReport(): Promise<Report[]> {
  const report: Report[] = await checkUsage()
  const extraChecks = [checkMargin, checkXAxis, checkMaxWidth]
  for (const check of extraChecks) {
    const res = check()
    if (res) {
      report.push(res)
    }
  }
  return report
}

const MARGIN_CONTAIN_DISPLAY = new Set(['flex', 'grid'])

async function checkUsage(): Promise<UsageReport[]> {
  const report: UsageReport[] = []
  await utils.traverse(async ({ name, path, apply }) => {
    let $el
    try {
      $el = document.querySelector(utils.resolveSelector(path))
    } catch {}
    if (!$el) {
      report.push({ type: 'usage', kind: name, message: `could not found .${name}` })
      return
    }
    const computedStyles = getComputedStyle($el)
    for (const [key, styleInfo] of Object.entries(targets)) {
      const styleName = styleInfo.name ?? key
      for (const value of styleInfo.values()) {
        await apply({ [key]: { xs: value } })
        const expected = styleInfo.toStyle(value, $el as HTMLElement)
        const actual = (computedStyles as any)[styleName]
        const compare = styleInfo.compare ?? Object.is
        if (!compare(expected, actual)) {
          console.log(`Expect ${name} has \`${styleName}: ${expected}\` but got \`${actual}\``)
          report.push({
            type: 'usage',
            kind: name,
            style: key,
            path,
            message: dedent`Found ${name} seem not respect to ${key} config${formatPossible(key, styleInfo.possible)}`,
            values: [expected, actual],
          })
        }
      }
    }
  })
  return report
}

const ROOT_CONTAINER = '#block-container'

function checkMargin(): GeneralReport | void {
  const $root = document.querySelector(ROOT_CONTAINER)
  let $current = $root
  if (!$current) {
    return
  }

  while ($current.firstElementChild) {
    $current = $current.firstElementChild
    const styles = window.getComputedStyle($current)
    const { marginTop, display } = styles

    // break at flex or grid
    if (MARGIN_CONTAIN_DISPLAY.has(display)) {
      break
    }

    // skip zero margin top
    if (isZero(marginTop)) {
      continue
    }

    return {
      type: 'general',
      message: 'found element has marin-top, please use padding or consider wrap in flex or grid container',
      selector: finder($current, { root: $root! }),
    }
  }
}

function checkXAxis(): GeneralReport | void {
  const $root = document.querySelector(ROOT_CONTAINER) as HTMLElement

  for (const el of listOuterContainer($root)) {
    const style = window.getComputedStyle(el)
    if (!isZero(style.marginLeft) || !isZero(style.marginRight)) {
      return {
        type: 'general',
        message: 'found an outer container has x axis margin, please check is it follow the guides',
        selector: finder(el, { root: $root }),
      }
    }

    if (!isZero(style.paddingLeft) || !isZero(style.paddingRight)) {
      return {
        type: 'general',
        message: 'found an outer container has x axis padding, please check is it follow the guides',
        selector: finder(el, { root: $root }),
      }
    }
  }
}

function checkMaxWidth(): GeneralReport | void {
  const $root = document.querySelector(ROOT_CONTAINER) as HTMLElement

  for (const el of listOuterContainer($root)) {
    const style = window.getComputedStyle(el)

    if (style.maxWidth !== 'none') {
      return {
        type: 'general',
        message: 'found an outer container has max-width, please check is it follow the guides',
        selector: finder(el, { root: $root }),
      }
    }
  }
}

function formatPossible(key: string, possible?: string[]): string {
  if (!possible) {
    return ''
  }
  const last = possible[possible.length - 1]
  const initial = possible.slice(0, -1)
  const str =
    last === '...'
      ? `[${initial.map((x) => `\`${x}\``).join(', ')}, ...]`
      : `[${possible.map((x) => `\`${x}\``).join(', ')}]`
  return `, you are possibly using the follow class ${str}, please use ${key} instead`
}

const MAX_DEPTH = 10

function* listOuterContainer(root: HTMLElement) {
  const rect = root.getBoundingClientRect()

  const queue = [{ el: root, depth: 0 }]
  while (queue.length > 0) {
    const { el, depth } = queue.shift() as { el: HTMLElement; depth: number }
    const inner = el.getBoundingClientRect()
    const radio = inner.height / rect.height

    if (depth < MAX_DEPTH) {
      for (const child of el.children) {
        queue.push({ el: child as HTMLElement, depth: depth + 1 })
      }
    }

    // don't treat too small div as outer container
    if (radio <= 0.8) {
      continue
    }

    // ignore our width restricting element
    if (el.className === 'spacing') {
      continue
    }

    yield el
  }
}

function isZero(value: string) {
  return value === '0' || value === '' || Number.parseInt(value) === 0
}

function createRangeValues(min: number, max: number): () => IterableIterator<number> {
  return function* () {
    yield min
    yield max
    yield (min + max) / 2
  }
}
