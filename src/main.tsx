import './reset.css'
import { createRoot } from 'react-dom/client'
import { Dashboard } from './Dashboard'
import { ServiceWorker } from './ServiceWorker'
import type { FC } from 'react'

const App: FC = () => (
  <>
    <Dashboard />
    <ServiceWorker />
  </>
)

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- foo bar
const domNode = document.getElementById('app')!

const root = createRoot(domNode)
root.render(<App />)
