import { LogoutButton } from './LogoutButton'
import { MqttConnection } from './MqttConnection'
import { TemperatureReading } from './TemperatureReading'
import type { FC } from 'react'

export const Dashboard: FC = () => {
  return (
    <MqttConnection>
      <TemperatureReading
        title={'olohuone'}
        topic="airgradient/olohuone/sensor/temperature/state"
      />
      <TemperatureReading
        title={'makuuhuone'}
        topic="airgradient/makuuhuone/sensor/temperature/state"
      />
      <LogoutButton />
    </MqttConnection>
  )
}
