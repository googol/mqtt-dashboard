import { connect } from 'mqtt'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LoginForm } from './LoginForm'
import { MqttContext, defaultMqttContext } from './MqttContext'
import type { MqttClient } from 'mqtt'
import type { FC, PropsWithChildren } from 'react'

export const MqttConnection: FC<PropsWithChildren> = ({ children }) => {
  const [mqttClient, setMqttClient] = useState<MqttClient | undefined>(
    undefined,
  )
  const login = useCallback((username: string, password: string) => {
    const client = connect('wss://tools.hanninen.me/ws', {
      username,
      password,
    })

    client.once('connect', () => {
      localStorage.setItem(
        'mqtt_credentials',
        JSON.stringify({ username, password }),
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
      logout: () => {
        localStorage.removeItem('mqtt_credentials')
        setMqttClient(undefined)
        mqttClient.end()
      },
    }
  }, [mqttClient])

  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem('mqtt_credentials') ?? '{}')
      if (
        typeof value === 'object' &&
        value !== null &&
        'username' in value &&
        'password' in value &&
        typeof value.username === 'string' &&
        typeof value.password === 'string'
      ) {
        login(value.username, value.password)
      }
    } catch (e) {
      console.warn('invalid data in localstorage for credentials', e)
    }

    localStorage.removeItem('mqtt_credentials')
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
