import { connect } from 'mqtt'
import { useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { MqttClient } from 'mqtt'
import type { FC, PropsWithChildren, ReactNode } from 'react'

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
  return (
    <MqttValueBox
      title={title}
      topic={topic}
      mqttClient={mqttClient}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- foo bar
      extractValue={(message) => Number(message as any).toString()}
    ></MqttValueBox>
  )
}

function MqttValueBox<ValueType extends ReactNode>(props: {
  title: string
  topic: string
  mqttClient: MqttClient
  extractValue: (message: unknown) => ValueType
}): ReactNode {
  const [value, setValue] = useState<ValueType | undefined>(undefined)
  useEffect(() => {
    console.error('subscribing', props.topic)
    const listener = (messageTopic: string, message: Buffer) => {
      console.log('listener', messageTopic, message)
      if (messageTopic === props.topic) {
        setValue(props.extractValue(message))
      }
    }
    props.mqttClient.subscribe(props.topic)
    props.mqttClient.on('message', listener)

    console.log('subscribed')

    return () => {
      props.mqttClient.unsubscribe(props.topic)
      props.mqttClient.removeListener('message', listener)
    }
  }, [props.topic, props.mqttClient])

  return <ReadingBox title={props.title}>{value}</ReadingBox>
}

const ReadingBox: FC<
  PropsWithChildren<{
    title: string
  }>
> = ({ title, children }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- foo bar
const domNode = document.getElementById('app')!

const root = createRoot(domNode)
root.render(<App />)
