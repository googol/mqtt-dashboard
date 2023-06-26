import { MqttValueBox } from './MqttValueBox'
import type { MqttClient } from 'mqtt'
import type { FC } from 'react'

export const TemperatureReading: FC<{
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
