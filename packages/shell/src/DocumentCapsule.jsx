import { useState } from 'react'
import { Button, MenuTrigger, usePopover, PopoverPanel, floatSurfaceClass } from '@kolkrabbi/kol-component'
import { IconLoader } from '@kolkrabbi/kol-icons'
import MoreRows, { FloatMenu } from './MoreSheet.jsx'

/* taxonomy-ok: molecule — a float Button, a float MenuTrigger (the name), the More sheet's rows */

/**
 * DocumentCapsule — The open document's capsule (float-everything W5 row 71, 2026-11-04): 48 tall, the way back (at full
 * ink, oq-96 — his frame 19:6067, plan-2026-11-05-float-editor W1.3), the
 * name (`kol-float-panel`) with a ▾ that opens its rows (the float menu), and the save state (`kol-float-label`,
 * oq-64). The exploration's `Document pill` (kol-float--style 9:9358).
 *
 * @param {string}   name       the document
 * @param {string}   status     the save state, verbatim ("Saved")
 * @param {string}   statusIcon an icon before the status (`check` for a saved document) — a glyph is an Icon, never a text
 *                              character (plan-2026-11-06-buttons-page 1.4: the "✓" was a string)
 * @param {Function} onBack     the ← press; unset, no ←
 * @param {Array}    menuItems  `[{ label, icon?, onPress, sub? }]` — the ▾ menu's rows (MoreRows float); unset with `onMenu`, the ▾ runs it
 * @param {Function} onMenu     `() => void` — the ▾ press when the consumer owns the menu
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the capsule (and its menu) is made of (default `solid`)
 * @param {string}   className
 */
export default function DocumentCapsule({ name, status, statusIcon, onBack, menuItems, onMenu, surface = 'solid', className = '' }) {
  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-start', offset: 8 })
  const hasMenu = menuItems?.length > 0
  const card = `kol-more-sheet kol-more-sheet-float ${floatSurfaceClass(surface, true)}`
  return (
    <div className={`kol-document-capsule kol-float-chrome inline-flex items-center gap-3 h-12 pl-2 pr-4 rounded-full ${floatSurfaceClass(surface)} ${className}`.trim()}>
      {onBack && <Button variant="float" tone="ghost" size="sm" iconOnly="arrow-left" aria-label="Back" onClick={onBack} className="[--kol-tone-fg:var(--kol-oq-96)]" />}
      {hasMenu || onMenu ? (
        /* the name ▾ is a MenuTrigger float (plan-2026-11-06-buttons-page 2.3 — it was a hand-rolled <button>): clear at
         * rest on the capsule, lit while its menu is open; the popover holds the span, the pattern TopControlsBar uses */
        <span ref={hasMenu ? popover.refs.setReference : undefined} {...(hasMenu ? popover.getReferenceProps() : {})} className="inline-flex">
          {/* inline: the theme's menu-trigger rule sets the well at 3-class weight, a utility class cannot reach it */}
          <MenuTrigger variant="float" open={hasMenu && open} iconRight="chevron-down" aria-haspopup="menu" aria-expanded={hasMenu ? open : undefined}
            onClick={hasMenu ? undefined : onMenu}
            style={{ '--kol-tone-bg': 'transparent', '--kol-float-px-md': 'var(--kol-spacing-2)' }}>
            {name}
          </MenuTrigger>
        </span>
      ) : (
        <span className="kol-float-panel text-emphasis">{name}</span>
      )}
      {status && (
        <span className="kol-float-label text-oq-64 inline-flex items-center gap-1">
          {statusIcon && <IconLoader name={statusIcon} size={16} />}
          {status}
        </span>
      )}
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
