import './source/block/style.scss'
import './source/bold/style.scss'
import './source/left/style.scss'
import './source/regular/style.scss'
import './source/right/style.scss'
import './source/slim/style.scss'
import './source/wide/style.scss'

import * as block from './source/block'
import * as bold from './source/bold'
import * as left from './source/left'
import * as regular from './source/regular'
import * as right from './source/right'
import * as slim from './source/slim'
import * as wide from './source/wide'

export const BLOCKQUOTES: Record<string, Record<string, unknown>> = Object.fromEntries(
  [block, bold, left, regular, right, slim, wide].map((mod) => {
    const { name, style } = mod
    return [name, style as Record<string, unknown>]
  }),
)
