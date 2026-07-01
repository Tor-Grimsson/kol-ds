import { useState } from 'react'
import { usePopover, PopoverPanel, Tooltip, Button } from '@kolkrabbi/kol-component'

export const Tooltips = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Tooltip label="Settings" shortcut="S">
      <Button variant="outline" iconOnly="settings-01" aria-label="Settings" />
    </Tooltip>
    <Tooltip label="Search" placement="bottom">
      <Button variant="outline" iconOnly="search" aria-label="Search" />
    </Tooltip>
  </div>
)

export const ClickPopover = () => {
  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-start' })
  return (
    <>
      <button
        ref={popover.refs.setReference}
        {...popover.getReferenceProps()}
        type="button"
        className="kol-mono-12"
        style={{
          padding: '6px 12px',
          border: '1px solid var(--kol-border-default)',
          borderRadius: 8,
          background: 'var(--kol-surface-primary)',
          color: 'var(--kol-surface-on-primary)',
        }}
      >
        Toggle popover
      </button>
      <PopoverPanel popover={popover}>
        <div style={{ padding: 16, maxWidth: 240, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="kol-helper-12 text-emphasis">Popover panel</span>
          <span className="kol-helper-12">
            Anchored to the trigger via floating-ui. Click outside or press Esc to dismiss.
          </span>
        </div>
      </PopoverPanel>
    </>
  )
}
