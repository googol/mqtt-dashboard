import { z } from 'zod'
import { MqttValueChangingBox } from './MqttValueChangingBox'
import { StringFromBuffer } from './StringFrmoBuffer'
import type { FC } from 'react'

const MediaStatusSchema = StringFromBuffer.pipe(
  z.enum(['off', 'tv', 'bluetooth']),
)
const mediaStatusOptions = ['off', 'tv', 'bluetooth'] as const

export const MediaStatus: FC = () => {
  return (
    <MqttValueChangingBox
      title="Mediatila"
      topic="home/mediacenter"
      schema={MediaStatusSchema}
      options={mediaStatusOptions}
      mqttOptions={{ retain: true }}
    />
  )
}
