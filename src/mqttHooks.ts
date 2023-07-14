import { useEffect, useState } from 'react'
import { useMqttContext } from './MqttContext'
import type { TopicValue } from './topicValue'
import type { ZodSchema, ZodTypeDef } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- need to allow any values here
export function useMqttTopicValue<ValueType>(
  topic: string,
  schema: ZodSchema<ValueType, ZodTypeDef, any>,
): TopicValue<ValueType> {
  const [value, setValue] = useState<TopicValue<ValueType>>({
    state: 'no-value',
  })
  const { listenToTopic } = useMqttContext()

  useEffect(() => {
    return listenToTopic(topic, (messageTopic: string, message: unknown) => {
      if (messageTopic === topic) {
        const parseResult = schema.safeParse(message)
        if (parseResult.success) {
          setValue({ state: 'value', value: parseResult.data })
        } else {
          console.error('Unable to parse value', {
            topic,
            value: message,
            error: parseResult.error,
          })
          setValue({ state: 'parse-failure' })
        }
      }
    })
  }, [topic, schema])

  return value
}
