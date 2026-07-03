import { useState } from 'react'
import { ErrorBoundary, Button } from '@kolkrabbi/kol-component'

/* Bomb — throws during render once armed, so the boundary's fallback shows.
 * Reset unmounts/remounts it, so "Try again" genuinely recovers. */
function Bomb() {
  const [armed, setArmed] = useState(false)
  if (armed) throw new Error('Demo crash: the bomb went off')
  return (
    <Button variant="primary" onClick={() => setArmed(true)}>
      Throw an error
    </Button>
  )
}

export const stage = 'full'

export default function ErrorBoundaryDemo() {
  return (
    <ErrorBoundary homeHref="#">
      <div className="min-h-[240px] flex items-center justify-center">
        <Bomb />
      </div>
    </ErrorBoundary>
  )
}
