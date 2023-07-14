import { useCallback } from 'react'
import { useMqttContext } from './MqttContext'
import { ReadingBox } from './ReadingBox'
import type { FC, MouseEventHandler } from 'react'

const channels = {
  HDMI1: 'com.webos.app.hdmi1',
  Youtube: 'youtube.leanback.v4',
}

export const TvLauncher: FC = () => {
  const { sendToTopic } = useMqttContext()

  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      const id = event.currentTarget.dataset.channelId
      if (id !== undefined) {
        sendToTopic('lgtv/set/launch', id)
      }
    },
    [sendToTopic],
  )

  return (
    <ReadingBox title="Volume">
      {Object.entries(channels).map(([text, id]) => (
        <button type="button" data-channel-id={id} onClick={handleClick}>
          {text}
        </button>
      ))}
    </ReadingBox>
  )
}
