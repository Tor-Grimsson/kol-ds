import { useState } from 'react'
import { Button, usePopover, PopoverPanel, floatSurfaceClass } from '@kolkrabbi/kol-component'
import MoreRows, { FloatMenu } from './MoreSheet.jsx'

/* taxonomy-ok: molecule — a float Button that opens the More sheet's rows */

/**
 * RailTrigger — The rail's hidden state (float-everything W9 row 129, 2026-11-04): no rail space is reserved — one 44
 * float button at the page's corner, the breadcrumb beside it (`kol-float-hint`, oq-64), and a press opens the whole
 * nav as a float card over the page (the title with its ×, then the rail's rows as the float menu — a row with `sub`
 * opens its level in place). Escape and an outside press close it; a pick routes and closes. `AppShell railTrigger`
 * draws it while the rail is hidden. The exploration's `Hidden navigation · Closed` + `Temporary navigation overlay`
 * (kol-float--style 9:15047 · 9:15071).
 *
 * @param {Array}    items        `[{ path, label, icon?, sub? }]` — the nav, in rail order
 * @param {string}   currentPath  the current route, lit in the card
 * @param {Function} onNavigate   `(path) => void`
 * @param {string}   title        the card's head (the app's name)
 * @param {string|string[]} breadcrumb  the words beside the button, or crumbs joined by ` / `
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the button and the card are made of (default `solid`)
 * @param {string}   className
 */
export default function RailTrigger({ items = [], currentPath = '/', onNavigate, title, breadcrumb, surface = 'solid', className = '' }) {
  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-start', offset: 8, dismiss: { outsidePress: (e) => !e.target?.closest?.('.kol-float-level') } })
  const card = `kol-more-sheet kol-more-sheet-float ${floatSurfaceClass(surface, true)}`
  const pick = (x) => { setOpen(false); if (x.onPress) { x.onPress(); return } if (x.path) onNavigate?.(x.path) }
  return (
    <div className={`kol-rail-trigger kol-float-chrome inline-flex items-center gap-4 ${className}`.trim()}>
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex">
        <Button variant="float" size="lg" iconOnly="hamburger" aria-label="Open navigation" aria-haspopup="menu" aria-expanded={open} className={floatSurfaceClass(surface)} />
      </span>
      {breadcrumb && <span className="kol-float-hint text-oq-64">{Array.isArray(breadcrumb) ? breadcrumb.join('  /  ') : breadcrumb}</span>}
      <PopoverPanel popover={popover} panel={false} focus={false} className={`${card} w-[280px]`} style={{ maxWidth: 'calc(100vw - 24px)' }}>
        {title && (
          <div className="flex items-center justify-between pl-3 pr-1 pt-1 pb-2">
            <span className="kol-float-body text-emphasis">{title}</span>
            <Button variant="float" tone="ghost" size="sm" iconOnly="x" aria-label="Close" onClick={() => setOpen(false)} />
          </div>
        )}
        <FloatMenu cardClass={card} onLeaf={pick}>
          <MoreRows variant="float" items={items} active={currentPath} onPick={pick} />
        </FloatMenu>
      </PopoverPanel>
    </div>
  )
}
