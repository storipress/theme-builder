import data from 'data'

import { error } from '../common/utils'
import { MockDataSchema } from './utils'

export function _validateData() {
  if (process.env.NODE_ENV === 'test') {
    return
  }
  const result = MockDataSchema.safeParse(data)

  if (!result.success) {
    error('data validation fail', result.error)
  }
}

if (!data.getData) {
  _validateData()
}
