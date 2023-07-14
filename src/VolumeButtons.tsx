import { useCallback } from 'react'
import { useMqttContext } from './MqttContext'
import { ReadingBox } from './ReadingBox'
import type { FC, MouseEventHandler } from 'react'

export const VolumeButtons: FC = () => {
  const { sendToTopic } = useMqttContext()

  const handleVolumeUpClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(() => {
    sendToTopic('broadlink/pre-01/vol-up', 'replay')
  }, [])
  const handleVolumeDownClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(() => {
    sendToTopic('broadlink/pre-01/vol-down', 'replay')
  }, [])
  return (
    <ReadingBox title="Volume">
      <button type="button" onClick={handleVolumeUpClick}>
        Volume up
      </button>
      <button type="button" onClick={handleVolumeDownClick}>
        Volume down
      </button>
    </ReadingBox>
  )
}
