import type { CreateLinkInput } from './link'

import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createLink } from './link'

export function createClient(input: CreateLinkInput) {
  return new ApolloClient({
    link: createLink(input),
    cache: new InMemoryCache(),
  })
}
