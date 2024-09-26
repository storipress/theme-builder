import type { IntrospectionQuery } from 'graphql'
import type { JsonObject } from 'type-fest'
import { withScalars } from 'apollo-link-scalars'
import { buildClientSchema } from 'graphql'
import invariant from 'tiny-invariant'

import introspectionResult from '../generated/graphql.schema.json'

const schema = buildClientSchema(introspectionResult as unknown as IntrospectionQuery)

export const scalarsLink = withScalars({
  schema,
  typesMap: {
    JSON: {
      serialize: (parsed: JsonObject) => JSON.stringify(parsed),
      parseValue: (raw: string | number | null): JsonObject | null => {
        if (raw == null) {
          return raw
        }
        invariant(typeof raw !== 'number')
        return JSON.parse(raw)
      },
    },
  },
})
