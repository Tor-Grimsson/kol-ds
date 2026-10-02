import { useState } from 'react'
import { PhoneNav } from '@kolkrabbi/kol-shell'

export const stage = 'sm'

const ITEMS = [
  { icon: 'folder', path: '/one', label: 'One' },
  { icon: 'layers', path: '/two', label: 'Two' },
  { icon: 'edit', path: '/three', label: 'Three' },
  { icon: 'rectangle', path: '/four', label: 'Four' },
  { icon: 'book-open', path: '/five', label: 'Five' },
  { icon: 'grid', path: '/six', label: 'Six' },
  { icon: 'nav-settings', path: '/settings', label: 'Settings' },
]

export default function PhoneNavPreview() {
  const [path, setPath] = useState('/one')
  return (
    /* The real bar is fixed to the viewport and shows below 768 only. The frame's `transform`
     * makes it the containing block for the bar and the More sheet, and `!flex` lifts the
     * breakpoint, so both can be seen in a stage. apps/shell shows it for real. */
    <div className="w-full max-w-sm">
      <div
        className="relative overflow-hidden rounded border border-fg-08 bg-surface-secondary [&_.kol-mobile-tabbar]:!flex"
        style={{ height: 360, transform: 'translateZ(0)' }}
      >
        <div className="p-4 kol-mono-12 text-meta">{path}</div>
        <PhoneNav items={ITEMS} currentPath={path} onNavigate={setPath} />
      </div>
    </div>
  )
}
