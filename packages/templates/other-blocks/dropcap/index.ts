import './source/black/style.scss'
import './source/float/style.scss'
import './source/large/style.scss'
import './source/none/style.scss'
import './source/out/style.scss'
import './source/regular/style.scss'

import * as black from './source/black'
import * as float from './source/float'
import * as large from './source/large'
import * as none from './source/none'
import * as out from './source/out'
import * as regular from './source/regular'

export const DROPCAPS: Record<string, Record<string, unknown>> = Object.fromEntries(
  [black, float, large, none, out, regular].map((mod) => {
    const { name, style } = mod
    return [name, style as Record<string, unknown>]
  }),
)
