import { useState } from 'react'
import { Button, PopoverPanel, usePopover } from '@kolkrabbi/kol-component'

/* A floating panel anchored to its trigger: click the button to open it. */
export default function PopoverPanelPreview() {
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
