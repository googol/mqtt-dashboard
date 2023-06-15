import type {FC} from 'react'
import { createRoot } from 'react-dom/client'

const App: FC = () => {
  return <h1>Hello</h1>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- foo bar
const domNode = document.getElementById('app')!

const root = createRoot(domNode)
root.render(<App />)
