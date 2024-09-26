import type { FetchResult, NextLink, Operation } from '@apollo/client/core'
import type { Span } from '@sentry/types'
import { ApolloLink, Observable } from '@apollo/client/core'
import { getCurrentHub } from '@sentry/hub'

export class SentryTransactionLink extends ApolloLink {
  override request(operation: Operation, forward: NextLink) {
    const scope = getCurrentHub().getScope()
    const transaction = scope?.getTransaction()
    let childSpan: Span | undefined
    if (transaction) {
      childSpan = transaction.startChild({
        op: 'apollo',
        description: operation.operationName,
      })

      if (scope) {
        scope.setSpan(childSpan)
      }
    }

    return new Observable<FetchResult>((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result: FetchResult) => {
          observer.next(result)
        },
        complete: () => {
          if (childSpan) {
            childSpan.finish()
          }
          observer.complete()
        },
        error: (error: Error) => {
          if (childSpan) {
            childSpan.setTag('error', true)
            childSpan.finish()
          }
          observer.error(error)
        },
      })

      return () => {
        subscription.unsubscribe()
      }
    })
  }
}
