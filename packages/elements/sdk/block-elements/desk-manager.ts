import type { LinkableResource } from '../common/utils'

import data from 'data'
import { getFromData, normalizeLinkableResource } from '../common/utils'

let desks: string[] = []

if (data.onReset) {
  data.onReset(() => {
    desks = []
  })
}

function populateDesks() {
  desks = listDesks().map(({ name }) => name)
}

export function getDesk(): string {
  if (desks.length === 0) {
    populateDesks()
  }

  return desks.shift() ?? 'No Desk'
}

export function listDesks(): LinkableResource[] {
  return normalizeLinkableResource(getFromData(data, 'desks'))
}

export function putDesk(desk: string) {
  desks.push(desk)
}
