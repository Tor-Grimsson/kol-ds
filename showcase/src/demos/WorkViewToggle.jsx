import { useState } from 'react'
import { WorkViewToggle } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function WorkViewToggleDemo() {
  const [view, setView] = useState('shelf')
  const [query, setQuery] = useState('')

  return (
    <div className="flex flex-col items-center gap-6">
      <WorkViewToggle
        view={view}
        onView={setView}
        query={query}
        onQuery={setQuery}
        placeholder="Search projects…"
      />
      <p className="kol-mono-12 text-fg-48">
        view: {view}
        {query ? ` · query: ${query}` : ''}
      </p>
    </div>
  )
}
