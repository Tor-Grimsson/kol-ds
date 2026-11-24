import { useState } from 'react'
import { Input, Menu } from '@kolkrabbi/kol-component'

/* MenuZoom (the Zoom menu view 242:36910, W12): opened OVER the zoom field (28.5; the right rail's top and the right pill
   since the top rail went, plan-2026-11-20 W1.2), its field lying on the zoom's
   field, flipped to the zoom's right edge. MenuField at its head (an Input holding
   the live percent; a number and Enter zooms to it), then Zoom in, Zoom out, Zoom to fit, Zoom to 50%, Zoom to 100%.
   Every row drives the editor's viewport through its own window events (`kol:zoom-to` { scale }, real, 1 = 100%, and
   `kol:zoom-fit`, packages/design-editor CanvasView.jsx); with no editor canvas on the screen nothing answers them.
   The shortcuts are the editor's own keys (its keymap: ⌘= ⌘- ⌘0 ⌘1), not the file's ⇧1 and ⇧0, which kolbox does not
   bind (decided 2026-11-18, for his review). */
const to = (scale) => window.dispatchEvent(new CustomEvent('kol:zoom-to', { detail: { scale } }))
const fit = () => window.dispatchEvent(new CustomEvent('kol:zoom-fit', { detail: { to: 'frame' } }))

export default function MenuZoom({ anchor, open, onClose, zoom = 1 }) {
  const pct = `${Math.round(zoom * 100)}%`
  const [draft, setDraft] = useState(null)
  const rows = [
    { label: 'Zoom in', shortcut: '⌘+', run: () => to(zoom * 1.2) },
    { label: 'Zoom out', shortcut: '⌘−', run: () => to(zoom / 1.2) },
    { label: 'Zoom to fit', shortcut: '⌘0', run: fit },
    { label: 'Zoom to 50%', run: () => to(0.5) },
    { label: 'Zoom to 100%', shortcut: '⌘1', run: () => to(1) },
  ]
  const field = (
    <div className="flex shrink-0" data-menu-field data-chosen>
      <Input variant="kolbox"
        aria-label="Zoom"
        className="flex-1"
        value={draft ?? pct}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => setDraft(null)}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return
          const n = parseFloat(draft ?? pct)
          if (Number.isFinite(n) && n > 0) to(n / 100)
          setDraft(null)
          onClose?.()
        }}
      />
    </div>
  )
  return <Menu variant="kolbox" aria-label="Zoom" anchor={anchor} open={open} onClose={onClose} groups={[rows]} onSelect={(row) => row.run?.()} placement="over" panelClassName="w-[198px]">{field}</Menu>
}
