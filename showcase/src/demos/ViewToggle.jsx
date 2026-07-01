import { useState } from 'react'
import { ViewToggle } from '@kolkrabbi/kol-component'

export default function ViewToggleDemo() {
  const [view, setView] = useState('grid')
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ViewToggle viewMode={view} onViewChange={setView} />
      <ViewToggle viewMode={view} onViewChange={setView} variant="icon" />
    </div>
  )
}
