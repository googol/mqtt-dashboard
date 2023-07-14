import { LogoutButton } from './LogoutButton'
import { MediaStatus } from './MediaStatus'
import { MqttConnection } from './MqttConnection'
import { TemperatureReading } from './TemperatureReading'
import { TvLauncher } from './TvLauncher'
import { VolumeButtons } from './VolumeButtons'
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
      <MediaStatus />
      <VolumeButtons />
      <TvLauncher />
      <LogoutButton />
    </MqttConnection>
  )
}
