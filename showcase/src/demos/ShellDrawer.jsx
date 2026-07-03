import { useState } from 'react'
import { Button, ShellDrawer } from '@kolkrabbi/kol-component'

export const stage = 'md'

const LINKS = ['Overview', 'Fleet', 'Journal', 'Contact']

export default function ShellDrawerDemo() {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState('left')
  const openFrom = (s) => {
    setSide(s)
    setOpen(true)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button onClick={() => openFrom('left')}>Open left</Button>
      <Button onClick={() => openFrom('right')}>Open right</Button>
      <p className="kol-mono-12 text-fg-48">Esc or backdrop closes · focus returns to the opener</p>
      <ShellDrawer
        open={open}
        onClose={() => setOpen(false)}
        side={side}
        width={320}
        header={<span className="kol-helper-12 text-fg-48">NAVIGATION</span>}
      >
        <nav className="flex flex-col gap-1">
          {LINKS.map((label) => (
            <a
              key={label}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="kol-mono-14 rounded px-2 py-2 text-fg-64 no-underline transition-colors hover:bg-fg-04 hover:text-emphasis"
            >
              {label}
            </a>
          ))}
        </nav>
      </ShellDrawer>
    </div>
  )
}
