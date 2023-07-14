import { createContext, useContext } from 'react'

export type MqttContext = {
  listenToTopic: (
    topic: string,
    handler: (messageTopic: string, message: unknown) => void,
  ) => () => void
  sendToTopic: (topic: string, value: string, opts?: SendOptions) => void
  logout: () => void
}

export type SendOptions = {
  retain?: boolean
}

const noOp = (): void => {
  /* no-op */
}
export const defaultMqttContext = {
  listenToTopic: (): typeof noOp => noOp,
  sendToTopic: noOp,
  logout: noOp,
}

export const MqttContext = createContext<MqttContext>(defaultMqttContext)

export const useMqttContext = (): MqttContext => useContext(MqttContext)
