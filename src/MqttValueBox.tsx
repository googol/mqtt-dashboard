import { useEffect, useState } from 'react'
import type { MqttClient } from 'mqtt'
import type { FC, PropsWithChildren, ReactNode } from 'react'

export function MqttValueBox<ValueType extends ReactNode>(props: {
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