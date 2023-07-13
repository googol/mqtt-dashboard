import './MqttValueChangingBox.css'
import { useCallback, useEffect, useState } from 'react'
import { useMqttContext } from './MqttContext'
import { ReadingBox } from './ReadingBox'
import type { SendOptions } from './MqttContext'
import type { ChangeEventHandler, ReactNode } from 'react'
import type { ZodSchema, ZodTypeDef } from 'zod'

const failureValue = 'Unable to parse value'

export function MqttValueChangingBox<ValueType extends string>(props: {
  title: string
  topic: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- need to allow any values here
  schema: ZodSchema<ValueType, ZodTypeDef, any>
  options: readonly ValueType[]
  mqttOptions: SendOptions
}): ReactNode {
  const [currentValue, setCurrentValue] = useState<
    ValueType | typeof failureValue | undefined
  >(undefined)
  const [upstreamValue, setUpstreamValue] = useState<
    ValueType | typeof failureValue | undefined
  >(undefined)
  const { listenToTopic, sendToTopic } = useMqttContext()
  useEffect(() => {
    const listener = (messageTopic: string, message: unknown) => {
      if (messageTopic === props.topic) {
        const parseResult = props.schema.safeParse(message)
        if (parseResult.success) {
          setUpstreamValue(parseResult.data)
          setCurrentValue(parseResult.data)
        } else {
          console.error('Unable to parse value', {
            topic: props.topic,
            value: message,
            error: parseResult.error,
          })
          setUpstreamValue(failureValue)
          setCurrentValue(failureValue)
        }
      }
    }
    return listenToTopic(props.topic, listener)
  }, [props.topic, props.schema])

  const handleValueChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- foo bar
      const value = event.target.value as any as ValueType
      setCurrentValue(value)
      sendToTopic(props.topic, value, props.mqttOptions)
    },
    [props.schema, upstreamValue, sendToTopic, props.mqttOptions],
  )

  return (
    <ReadingBox
      title={props.title}
      className={
        currentValue !== upstreamValue
          ? 'mqtt-value-changing-box__select--updating'
          : undefined
      }
    >
      <select value={currentValue} onChange={handleValueChange}>
        {props.options.map((option) => (
          <option id={option}>{option}</option>
        ))}
      </select>
    </ReadingBox>
  )
}
