import { useState } from 'react'
import type { FC } from 'react'

export const LoginForm: FC<{
  login: (username: string, password: string) => void
}> = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form>
      <input
        type="text"
        autoComplete="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={(e) => {
          e.preventDefault()
          login(username, password)
        }}
      >
        Log in
      </button>
    </form>
  )
}
