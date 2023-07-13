import { useEffect, useState } from 'react'
import { useMqttContext } from './MqttContext'
import { ReadingBox } from './ReadingBox'
import type { ReactNode } from 'react'
import type { ZodSchema, ZodTypeDef } from 'zod'

export function MqttValueBox<ValueType extends ReactNode>(props: {
  title: string
  topic: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- need to allow any values here
  schema: ZodSchema<ValueType, ZodTypeDef, any>
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
