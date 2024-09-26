import type { Operation } from '@apollo/client'
import { ApolloLink, HttpLink, split } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { Axiom } from '@axiomhq/js'
import { SentryLink } from 'apollo-link-sentry'
import { createUploadLink } from 'apollo-upload-client'
import { destr } from 'destr'
import { stubObject } from 'lodash'
import { match } from 'ts-pattern'
import { exclude } from 'tsafe'

import { env } from '../env'
import { scalarsLink } from './scalars'
import { isContainFile } from './upload'

export interface CreateLinkInput {
  apiEndpoint: string
  getClient: () => string | null
  getToken: () => string | null | undefined
  getHeaders?: () => Record<string, string> | null | undefined
  onAuthFail: () => void
  sentryLink?: boolean
}

const axiom = new Axiom({
  token: env.AXIOM_API_TOKEN,
})

export function createLink({
  apiEndpoint,
  getClient,
  getToken,
  getHeaders = stubObject,
  onAuthFail: authFail,
  sentryLink = true,
}: CreateLinkInput) {
  const host = apiEndpoint

  function createGraphQLUri(op: Operation) {
    if (op.operationName === 'GetWorkspaces') {
      return `${host}/graphql`
    }

    const id = getClient()
    if (!id) {
      return `${host}/graphql`
    }
    return `${host}/client/${id}/graphql`
  }

  const browserInfo = {
    user_agent: navigator.userAgent,
    brands: navigator.userAgentData?.brands,
    platform: navigator.userAgentData?.platform,
    mobile: navigator.userAgentData?.mobile,
  }

  return ApolloLink.from(
    [
      setContext(() => {
        const token = getToken()
        if (token) {
          return {
            headers: {
              Authorization: `Bearer ${token}`,
              ...getHeaders(),
            },
          }
        }
        return {}
      }),
      onError(({ networkError, operation }) => {
        match(networkError)
          .with({ statusCode: 401 }, () => {
            authFail()
          })
          .with({ statusCode: 400 }, async (error) => {
            // HACK: Apollo will store response body in error.result, but it's undocumented
            const body = (error as { result?: Record<string, unknown> }).result ?? (await readResponse(error.response))
            axiom.ingest(env.AXIOM_DATASET, {
              type: 'error',
              operation: {
                name: operation.operationName,
                variables: operation.variables,
              },
              source: 'builder',
              message: error.message,
              statusCode: error.statusCode,
              stack: error.stack,
              body,
              ...browserInfo,
              client_id: getClient(),
            })
          })
      }),
      scalarsLink,
      sentryLink && new SentryLink(),
      split(
        (op) => isContainFile(op.variables),
        createUploadLink({ uri: createGraphQLUri }),
        import.meta.env.MODE === 'test'
          ? // msw doesn't support batching, so we use http instead
            new HttpLink({ uri: createGraphQLUri })
          : new BatchHttpLink({ uri: createGraphQLUri }),
      ),
    ].filter(exclude([false])),
  )
}

async function readResponse(response?: Response | null) {
  if (!response) {
    return null
  }
  const res = response.bodyUsed ? null : response.clone()
  if (!res) {
    return null
  }
  const text = await res.text()
  return destr(text)
}
