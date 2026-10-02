import { useState } from 'react'
import { NavRail } from '@kolkrabbi/kol-shell'
import { Icon } from '@kolkrabbi/kol-icons'

export const frame = 520

const ITEMS = [
  { icon: 'grid', path: '/', label: 'Home' },
  { icon: 'layers', path: '/library', label: 'Library' },
  { icon: 'book-open', path: '/docs', label: 'Docs' },
  { icon: 'search', path: '/search', label: 'Search' },
]

/* The flat app rail: grab its edge to open it and reveal the labels. */
export default function NavRailPreview() {
  const [path, setPath] = useState('/')
  return (
    <>
      <NavRail items={ITEMS} bottomItems={[{ icon: 'settings-01', path: '/settings', label: 'Settings' }]} currentPath={path} onNavigate={setPath} iconComponent={Icon} />
      <p className="kol-mono-14 text-meta" style={{ padding: '24px 24px 24px 88px' }}>{path}</p>
    </>
  )
}
