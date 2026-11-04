import { useState } from 'react'
import { Button, usePopover, PopoverPanel, floatSurfaceClass } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import MoreRows, { FloatMenu } from './MoreSheet.jsx'

/* taxonomy-ok: molecule — a float Button, the name, the More sheet's rows */

/**
 * DocumentCapsule — The open document's capsule (float-everything W5 row 71, 2026-11-04): 48 tall, the way back, the
 * name (`kol-float-panel`) with a ▾ that opens its rows (the float menu), and the save state (`kol-float-label`,
 * oq-64). The exploration's `Document pill` (kol-float--style 9:9358).
 *
 * @param {string}   name       the document
 * @param {string}   status     the save state, verbatim ("✓ Saved")
 * @param {Function} onBack     the ← press; unset, no ←
 * @param {Array}    menuItems  `[{ label, icon?, onPress, sub? }]` — the ▾ menu's rows (MoreRows float); unset with `onMenu`, the ▾ runs it
 * @param {Function} onMenu     `() => void` — the ▾ press when the consumer owns the menu
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the capsule (and its menu) is made of (default `solid`)
 * @param {string}   className
 */
export default function DocumentCapsule({ name, status, onBack, menuItems, onMenu, surface = 'solid', className = '' }) {
  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-start', offset: 8 })
  const hasMenu = menuItems?.length > 0
  const card = `kol-more-sheet kol-more-sheet-float ${floatSurfaceClass(surface, true)}`
  return (
    <div className={`kol-document-capsule kol-float-chrome inline-flex items-center gap-3 h-12 pl-2 pr-4 rounded-full ${floatSurfaceClass(surface)} ${className}`.trim()}>
      {onBack && <Button variant="float" tone="ghost" size="sm" iconOnly="arrow-left" aria-label="Back" onClick={onBack} />}
      {hasMenu || onMenu ? (
        <button
          type="button"
          ref={hasMenu ? popover.refs.setReference : undefined}
          {...(hasMenu ? popover.getReferenceProps() : {})}
          onClick={hasMenu ? undefined : onMenu}
          aria-haspopup="menu"
          aria-expanded={hasMenu ? open : undefined}
          className="kol-float-panel text-emphasis inline-flex items-center gap-3 h-9 rounded-full bg-transparent border-0 p-0 cursor-pointer"
        >
          {name}
          <Icon name="chevron-down" size={16} className="text-oq-64" />
        </button>
      ) : (
        <span className="kol-float-panel text-emphasis">{name}</span>
      )}
      {status && <span className="kol-float-label text-oq-64">{status}</span>}
      {hasMenu && (
        <PopoverPanel popover={popover} panel={false} focus={false} className={card} style={{ minWidth: 220, maxWidth: 'calc(100vw - 24px)' }}>
          <FloatMenu beside cardClass={card} onLeaf={() => setOpen(false)}>
            <MoreRows variant="float" actions={menuItems} onPick={() => setOpen(false)} />
          </FloatMenu>
        </PopoverPanel>
      )}
    </div>
  )
}
