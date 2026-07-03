import { useState } from 'react'
import { ErrorBoundary, Button } from '@kolkrabbi/kol-component'

function Bomb() {
  const [armed, setArmed] = useState(false)
  if (armed) throw new Error('Demo crash: the bomb went off')
  return (
    <Button variant="primary" onClick={() => setArmed(true)}>
      Throw an error
    </Button>
  )
}

export const Default = () => (
  <ErrorBoundary homeHref="#">
    <div style={{ minHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Bomb />
    </div>
  </ErrorBoundary>
)

export const CustomFallback = () => (
  <ErrorBoundary
    fallback={({ error, reset }) => (
      <div className="p-6 rounded bg-surface-secondary space-y-4">
        <p className="kol-mono-14">Custom fallback: {error?.toString()}</p>
        <Button variant="primary" onClick={reset}>Reset</Button>
      </div>
    )}
  >
    <Bomb />
  </ErrorBoundary>
)
