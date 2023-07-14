import { connect } from 'mqtt'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { LoginForm } from './LoginForm'
import { MqttContext, defaultMqttContext } from './MqttContext'
import type { MqttClient } from 'mqtt'
import type { FC, PropsWithChildren } from 'react'

const MqttCredentials = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
})
type MqttCredentials = z.infer<typeof MqttCredentials>

export const MqttConnection: FC<PropsWithChildren> = ({ children }) => {
  const [mqttClient, setMqttClient] = useState<MqttClient | undefined>(
    undefined,
  )
  const login = useCallback((username: string, password: string) => {
    console.log('login here')
    const client = connect('wss://tools.hanninen.me/ws', {
      username,
      password,
    })

    client.on('error', (error) => {
      console.error('Mqtt connection error', { error })
    })

    client.once('connect', () => {
      const credentialsToStore: MqttCredentials = { username, password }
      localStorage.setItem(
        'mqtt_credentials',
        JSON.stringify(credentialsToStore),
      )
    })

    setMqttClient(client)
  }, [])
  const mqttContextValue = useMemo((): MqttContext => {
    if (mqttClient === undefined) {
      return defaultMqttContext
    }

    return {
      listenToTopic: (topic, handler) => {
        mqttClient.subscribe(topic)
        mqttClient.on('message', handler)

        return () => {
          mqttClient.unsubscribe(topic)
          mqttClient.removeListener('message', handler)
        }
      },
      sendToTopic: (topic, message, opts) => {
        if (opts !== undefined) {
          mqttClient.publish(topic, message, opts)
        } else {
          mqttClient.publish(topic, message)
        }
      },
      logout: () => {
        localStorage.removeItem('mqtt_credentials')
        setMqttClient(undefined)
        mqttClient.end()
      },
    }
  }, [mqttClient])

  useEffect(() => {
    try {
      console.log('looking for login creds')
      const localStorageValue = localStorage.getItem('mqtt_credentials')
      if (localStorageValue === null) {
        console.log('no credentials found')
        return
      }
      const json = JSON.parse(localStorageValue)
      const value = MqttCredentials.parse(json)
      login(value.username, value.password)
    } catch (e) {
      console.warn('invalid data in localstorage for credentials', e)
    }
  }, [login])

  if (mqttClient === undefined) {
    return <LoginForm login={login} />
  } else {
    return (
      <MqttContext.Provider value={mqttContextValue}>
        {children}
      </MqttContext.Provider>
    )
  }
}
