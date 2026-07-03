import { useState } from 'react'
import { ShellDrawer, Button } from '@kolkrabbi/kol-component'

const Body = () => (
  <div className="flex flex-col gap-1">
    {['Overview', 'Fleet', 'Journal', 'Contact'].map((label) => (
      <a
        key={label}
        href="#"
        onClick={(e) => e.preventDefault()}
        className="kol-mono-14 rounded px-2 py-2 text-fg-64 no-underline transition-colors hover:bg-fg-04 hover:text-emphasis"
      >
        {label}
      </a>
    ))}
  </div>
)

export const LeftAndRight = () => {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState('left')
  const openFrom = (s) => {
    setSide(s)
    setOpen(true)
  }
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button onClick={() => openFrom('left')}>Open left</Button>
      <Button onClick={() => openFrom('right')}>Open right</Button>
      <span className="kol-mono-12">Esc / backdrop / close button all close</span>
      <ShellDrawer
        open={open}
        onClose={() => setOpen(false)}
        side={side}
        width={320}
        header={<span className="kol-helper-12 text-fg-48">NAVIGATION</span>}
      >
        <Body />
      </ShellDrawer>
    </div>
  )
}

export const FullWidthSheet = () => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button onClick={() => setOpen(true)}>Open full-width</Button>
      <span className="kol-mono-12">no width → sheet spans the viewport (mobile-nav shape)</span>
      <ShellDrawer open={open} onClose={() => setOpen(false)} header={<span className="kol-helper-12 text-fg-48">MENU</span>}>
        <Body />
      </ShellDrawer>
    </div>
  )
}

export const BareBody = () => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button onClick={() => setOpen(true)}>Open bare</Button>
      <span className="kol-mono-12">no header slot → just the close button row</span>
      <ShellDrawer open={open} onClose={() => setOpen(false)} side="right" width={280}>
        <p className="kol-mono-12 text-fg-64">Any children render in the scrollable body.</p>
      </ShellDrawer>
    </div>
  )
}
