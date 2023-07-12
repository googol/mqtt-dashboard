import './MqttValueBox.css'
import { useEffect, useState } from 'react'
import { useMqttContext } from './MqttContext'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import type { ZodSchema } from 'zod'

export function MqttValueBox<ValueType extends ReactNode>(props: {
  title: string
  topic: string
  schema: ZodSchema<ValueType>
}): ReactNode {
  const [value, setValue] = useState<ValueType | string | undefined>(undefined)
  const { listenToTopic } = useMqttContext()
  useEffect(() => {
    const listener = (messageTopic: string, message: unknown) => {
      if (messageTopic === props.topic) {
        const parseResult = props.schema.safeParse(message)
        if (parseResult.success) {
          setValue(parseResult.data)
        } else {
          console.error('Unable to parse value', {
            topic: props.topic,
            value: message,
            error: parseResult.error,
          })
          setValue('Unable to parse value')
        }
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
