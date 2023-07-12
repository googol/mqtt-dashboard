import { z } from 'zod'
import { MqttValueBox } from './MqttValueBox'
import { StringFromBuffer } from './StringFrmoBuffer'
import type { FC } from 'react'

const TemperatureValue = StringFromBuffer.pipe(z.coerce.number())

export const TemperatureReading: FC<{
  title: string
  topic: string
}> = ({ title, topic }) => {
  return (
    <MqttValueBox
      title={title}
      topic={topic}
      schema={TemperatureValue}
    ></MqttValueBox>
  )
}
