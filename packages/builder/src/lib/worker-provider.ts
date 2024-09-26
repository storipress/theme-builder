import type { StyleTree } from 'shared/code-generator/style-tree'

import { expose } from 'comlink'
import { generate } from 'shared/code-generator'
import { assertStyleTree } from 'shared/code-generator/style-tree'
import './worker-bootstrap'

export interface WorkerInterface {
  renderStyle: (tree?: StyleTree) => string
}

const implementation: WorkerInterface = {
  renderStyle(tree: StyleTree, useDeepSelector = false) {
    return generate(assertStyleTree(tree), useDeepSelector)
  },
}

// @ts-expect-error worker
expose(implementation, self)
