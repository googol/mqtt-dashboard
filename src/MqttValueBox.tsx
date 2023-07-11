import './MqttValueBox.css'
import { useEffect, useState } from 'react'
import { useMqttContext } from './MqttContext'
import type { FC, PropsWithChildren, ReactNode } from 'react'

export function MqttValueBox<ValueType extends ReactNode>(props: {
  title: string
  topic: string
  extractValue: (message: unknown) => ValueType
}): ReactNode {
  const [value, setValue] = useState<ValueType | undefined>(undefined)
  const { listenToTopic } = useMqttContext()
  useEffect(() => {
    const listener = (messageTopic: string, message: Buffer) => {
      if (messageTopic === props.topic) {
        setValue(props.extractValue(message))
      }
    }
    return listenToTopic(props.topic, listener)
  }, [props.topic])

  return <ReadingBox title={props.title}>{value}</ReadingBox>
}

const ReadingBox: FC<
  PropsWithChildren<{
    title: string
  }>
> = ({ title, children }) => {
  return (
    <div className="mqtt-value-box">
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  )
}
