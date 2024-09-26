import { createEventHook } from '@vueuse/core'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { shallowRef, watchEffect } from 'vue'
import { useStore } from 'vuex-hooks'
import { env } from '../env'

export const EchoEvent = {
  site: {
    deployment: {
      started: 'site.deployment.started',
      succeeded: 'site.deployment.succeeded',
      failed: 'site.deployment.failed',
    },
  },
} as const

// @ts-expect-error assign to global
globalThis.Pusher = Pusher

type DeploymentEvent = (typeof EchoEvent)['site']['deployment']
type DeploymentEventType = DeploymentEvent[keyof DeploymentEvent]

const echo = shallowRef<Echo>()

export default function useEcho() {
  const { state } = useStore()

  echo.value ??= new Echo({
    broadcaster: 'pusher',
    key: env.PUSHER_KEY,
    cluster: 'us3',
    forceTLS: true,
    authEndpoint: `${env.API_ENDPOINT}/broadcasting/auth`,
    authorizer: (channel: { name: string }) => {
      return {
        authorize: (socketId: string, callback: (...args: unknown[]) => void) => {
          fetch(`${env.API_ENDPOINT}/broadcasting/auth`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${state.auth?.token}`,
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              callback(null, data)
            })
            .catch((error) => {
              callback(error)
            })
        },
      }
    },
  })

  interface EventData {
    release_id: number | null
  }
  interface NotificationEvent {
    data: EventData
    id: string
    tenant_id: string
    type: DeploymentEventType
  }

  const notificationEvent = createEventHook<NotificationEvent>()
  const channel = shallowRef()
  watchEffect(() => {
    if (!state.profile?.intercomHashIdentity) return
    if (!echo.value) return

    channel.value = echo.value.private(`n.${state.profile?.intercomHashIdentity}`)
    channel.value.notification((event: NotificationEvent) => {
      notificationEvent.trigger(event)
    })
  })

  return {
    EchoEvent,
    echo,
    channel,
    onNotification: notificationEvent.on,
  }
}
