import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppProviders } from './app/providers/AppProviders'
import { App } from './app/App'

async function enableMocks() {
  if (!import.meta.env.DEV) return
  const { worker } = await import('./mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocks()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
)