import { useState } from 'react'
import { Button, PopoverPanel, usePopover } from '@kolkrabbi/kol-component'

/* A floating panel anchored to its trigger: click the button to open it. */
export const variants = ['default', 'kolbox']

/* kolbox (W31.2 batch 4): the kolbox shell beside its anchor; a press outside or Escape closes it */
function KolboxPopover() {
  const [anchor, setAnchor] = useState(null)
  const [open, setOpen] = useState(false)
  return (
    <>
      <span ref={setAnchor}><Button variant="kolbox" pressed={open} onClick={() => setOpen(!open)}>Open popover</Button></span>
      <PopoverPanel variant="kolbox" anchor={anchor} open={open} onClose={() => setOpen(false)} placement="right-start" title="Stroke">
        <p className="kol-kolbox-help px-4 pb-4 text-oq-64">The body is the children.</p>
      </PopoverPanel>
    </>
  )
}

export default function PopoverPanelPreview({ variant = 'default' }) {
  if (variant === 'kolbox') return <KolboxPopover />
  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen })
  return (
    <>
      {/* the anchor is a wrapper: Button takes no ref */}
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()}><Button>Open panel</Button></span>
      {open && (
        <PopoverPanel popover={popover} className="p-4">
          <p className="kol-mono-12 text-body">A panel in a portal.</p>
        </PopoverPanel>
      )}
    </>
  )
}
