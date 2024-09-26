import type { WorkerInterface } from './worker-provider'

import { wrap } from 'comlink'

const worker = new Worker(new URL('./worker-provider.ts', import.meta.url))

export const remote = wrap<WorkerInterface>(worker)
