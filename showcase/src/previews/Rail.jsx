import { useState } from 'react'
import { Button, Rail } from '@kolkrabbi/kol-component'

/* a rail on every edge, over the page — and one pushing the layout, resizable from its inner edge */
export const stage = 'md'
const LINKS = ['Overview', 'Fleet', 'Journal', 'Contact']

export default function RailPreview() {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState('left')
  const [docked, setDocked] = useState(true)
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {['left', 'right', 'top', 'bottom'].map((s) => <Button key={s} onClick={() => { setSide(s); setOpen(true) }}>Over · {s}</Button>)}
        <Button tone="ghost" onClick={() => setDocked((v) => !v)}>{docked ? 'Collapse' : 'Expand'} the bottom rail</Button>
      </div>
      <div className="flex h-72 flex-col overflow-hidden rounded border border-fg-08">
        <div className="flex flex-1 items-center justify-center kol-mono-12 text-meta">the page</div>
        <Rail mode="push" side="bottom" open={docked} height={140} resizable minSize={80} maxSize={240} header={<span className="kol-helper-12 text-meta">BOTTOM RAIL · drag its top edge</span>}>
          <p className="kol-mono-12 text-meta">Docked, pushing the page up.</p>
        </Rail>
      </div>
      <Rail open={open} onClose={() => setOpen(false)} side={side} width={320} height={260} header={<span className="kol-helper-12 text-fg-48">NAVIGATION</span>}>
        <nav className="flex flex-col gap-1">
          {LINKS.map((label) => <a key={label} href="#" onClick={(e) => e.preventDefault()} className="kol-mono-14 rounded px-2 py-2 text-fg-64 no-underline transition-colors hover:bg-fg-04 hover:text-emphasis">{label}</a>)}
        </nav>
      </Rail>
    </div>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return <Button>Open a rail</Button>
}
