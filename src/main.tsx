import { connect } from 'mqtt'
import { useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { MqttClient } from 'mqtt'
import type { FC } from 'react'

const App: FC = () => {
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

  console.log(mqttClient)

  if (mqttClient === undefined) {
    return <LoginForm login={login} />
  } else {
    return (
      <>
        <TemperatureReading
          title={'olohuone'}
          mqttClient={mqttClient}
          topic="airgradient/olohuone/sensor/temperature/state"
        />
        <TemperatureReading
          title={'makuuhuone'}
          mqttClient={mqttClient}
          topic="airgradient/makuuhuone/sensor/temperature/state"
        />
        <button onClick={logout}>Logout</button>
      </>
    )
  }
}

const LoginForm: FC<{
  login: (username: string, password: string) => void
}> = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form>
      <input
        type="text"
        autoComplete="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={(e) => {
          e.preventDefault()
          login(username, password)
        }}
      >
        Log in
      </button>
    </form>
  )
}

const TemperatureReading: FC<{
  title: string
  topic: string
  mqttClient: MqttClient
}> = ({ title, topic, mqttClient }) => {
  const [temperature, setTemperature] = useState<number | undefined>(undefined)
  useEffect(() => {
    console.error('subscribing', topic)
    const listener = (messageTopic: string, message: Buffer) => {
      console.log('listener', messageTopic, message)
      if (messageTopic === topic) {
        setTemperature(Number(message.toString()))
      }
    }
    mqttClient.subscribe(topic)
    mqttClient.on('message', listener)

    console.log('subscribed')

    return () => {
      mqttClient.unsubscribe(topic)
      mqttClient.removeListener('message', listener)
    }
  }, [topic, mqttClient])

  return (
    <div>
      <h2>{title}</h2>
      <p>{temperature}</p>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- foo bar
const domNode = document.getElementById('app')!

const root = createRoot(domNode)
root.render(<App />)
