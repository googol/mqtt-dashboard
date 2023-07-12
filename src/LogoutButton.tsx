import { useMqttContext } from './MqttContext'
import type { FC } from 'react'

export const LogoutButton: FC = () => {
  const { logout } = useMqttContext()

  return <button onClick={logout}>Logout</button>
}
