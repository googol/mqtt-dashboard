import { createContext, useContext } from 'react'

export type MqttContext = {
  listenToTopic: (
    topic: string,
    handler: (messageTopic: string, message: Buffer) => void,
  ) => () => void
  logout: () => void
}

const noOp = (): void => {
  /* no-op */
}
export const defaultMqttContext = {
  listenToTopic: (): typeof noOp => noOp,
  logout: noOp,
}

export const MqttContext = createContext<MqttContext>(defaultMqttContext)

export const useMqttContext = (): MqttContext => useContext(MqttContext)
