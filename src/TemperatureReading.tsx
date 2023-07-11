import { MqttValueBox } from './MqttValueBox'
import type { FC } from 'react'

export const TemperatureReading: FC<{
  title: string
  topic: string
}> = ({ title, topic }) => {
  return (
    <MqttValueBox
      title={title}
      topic={topic}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- foo bar
      extractValue={(message) => Number(message as any).toString()}
    ></MqttValueBox>
  )
}
