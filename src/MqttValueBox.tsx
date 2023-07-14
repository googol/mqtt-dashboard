import { ReadingBox } from './ReadingBox'
import { useMqttTopicValue } from './mqttHooks'
import { extractTopicValue } from './topicValue'
import type { ReactNode } from 'react'
import type { ZodSchema, ZodTypeDef } from 'zod'

export function MqttValueBox<ValueType extends ReactNode>(props: {
  title: string
  topic: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- need to allow any values here
  schema: ZodSchema<ValueType, ZodTypeDef, any>
}): ReactNode {
  const value = useMqttTopicValue(props.topic, props.schema)

  return (
    <ReadingBox title={props.title}>
      {extractTopicValue(value, undefined, 'Unable to parse value')}
    </ReadingBox>
  )
}
