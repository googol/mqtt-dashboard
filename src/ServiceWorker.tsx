import { useCallback, useEffect, useState } from 'react'
import { Workbox } from 'workbox-window'
import type { FC } from 'react'

export const ServiceWorker: FC = () => {
  const [workbox, setWorkbox] = useState<Workbox | undefined>(undefined)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return
    }

    async function setupWorkbox() {
      const wb = new Workbox('./service-worker.js', { scope: './' })
      await wb.register()
      setWorkbox(wb)

      const showSkipWaitingPrompt = async () => {
        setUpdateAvailable(true)
      }

      wb.addEventListener('waiting', showSkipWaitingPrompt)
    }

    setupWorkbox().catch((reason) => {
      console.error('Service worker registration failed', reason)
    })
  }, [])

  const acceptUpdate = useCallback(() => {
    if (workbox === undefined) {
      return
    }

    function handleControllingChanged() {
      window.location.reload()
    }

    workbox.addEventListener('controlling', handleControllingChanged)

    workbox.messageSkipWaiting()

    return () => {
      workbox.removeEventListener('controlling', handleControllingChanged)
    }
  }, [workbox])

  if (workbox && updateAvailable) {
    return (
      <div>
        <h2>Update available</h2>
        <button type="button" onClick={acceptUpdate}>
          Update
        </button>
      </div>
    )
  } else {
    return (
      <div>
        <h2>No service worker available</h2>
      </div>
    )
  }
}
