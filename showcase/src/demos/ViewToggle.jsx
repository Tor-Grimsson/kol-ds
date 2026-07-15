import { useState } from 'react'
import { ViewToggle } from '@kolkrabbi/kol-component'

export default function ViewToggleDemo() {
  const [view, setView] = useState('grid')
  return (
    <>
      <ViewToggle viewMode={view} onViewChange={setView} />
      <ViewToggle viewMode={view} onViewChange={setView} variant="icon" />
      <ViewToggle viewMode={view} onViewChange={setView} variant="single" />
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [view, setView] = useState('grid')
  return <ViewToggle viewMode={view} onViewChange={setView} />
}
