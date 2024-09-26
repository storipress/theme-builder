import type { RequestHandler } from 'msw'
import { pipe, Record } from 'effect'
import { setupServer } from 'msw/node'

const handlers = pipe(
  import.meta.glob<{ handler: RequestHandler }>('./graphql/*.ts', { eager: true }),
  Record.map((m) => m.handler),
  Record.values,
)

export const server = setupServer(...handlers)
