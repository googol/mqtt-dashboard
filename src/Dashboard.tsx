import { connect } from 'mqtt'
import { useCallback, useEffect, useState } from 'react'
import { LoginForm } from './LoginForm'
import { TemperatureReading } from './TemperatureReading'
import type { MqttClient } from 'mqtt'
import type { FC } from 'react'

export const Dashboard: FC = () => {
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
  const logout = useCallback(() => {
    if (mqttClient === undefined) {
      return
    }

    localStorage.removeItem('mqtt_credentials')
    setMqttClient(undefined)
    mqttClient.end()
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
      <>
        <TemperatureReading
          title={'olohuone'}
          topic="airgradient/olohuone/sensor/temperature/state"
        />
        <TemperatureReading
          title={'makuuhuone'}
          topic="airgradient/makuuhuone/sensor/temperature/state"
        />
        <button onClick={logout}>Logout</button>
      </>
    )
  }
}
