import { useState } from 'react'
import { ViewToggle } from '@kolkrabbi/kol-component'

export default function ViewToggleDemo() {
  const [view, setView] = useState('grid')
  return (
    <>
      <ViewToggle viewMode={view} onViewChange={setView} />
      <ViewToggle viewMode={view} onViewChange={setView} variant="icon" />
    </>
  )
}
