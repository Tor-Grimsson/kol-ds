import { useEffect, useRef, useState } from 'react'
import Button from '../atoms/Button.jsx'
import SegmentedToggle from '../atoms/SegmentedToggle.jsx'
import { usePopover, PopoverPanel } from '../utilities/Popover.jsx'

const cap = (v) => String(v).charAt(0).toUpperCase() + String(v).slice(1)
const KEY = 'kol-variants-control'
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) ?? 'null') } catch { return null } }
const write = (p) => { try { p ? localStorage.setItem(KEY, JSON.stringify(p)) : localStorage.removeItem(KEY) } catch { /* private mode */ } }
const clamp = (p) => (typeof window === 'undefined' ? p : { x: Math.min(Math.max(8, p.x), window.innerWidth - 56), y: Math.min(Math.max(8, p.y), window.innerHeight - 56) })

/**
 * VariantsControl — a page's variants: a round `slider-01` button pinned top-right at the shell's page pad that opens a
 * panel of labelled segmented rows, one per axis. apps/catalog's `VariantsButton`, shipped (OneVariantsControl, kol-website
 * 2026-10-29 — user: *"why are they reinventing the wheel? we already have a component for this"*); catalog, rails, shell
 * and layouts each had it, by hand or reinvented. Each axis is a SEGMENTED row, not a dropdown (user 2026-10-22, on a
 * dropdown list opening over the panel in the panel's own colour): every option visible, one click, nothing floats over the
 * panel.
 *
 * DRAGGABLE (LayoutsAppPages 2026-10-29 — user: *"action button should be draggable if it's in the way of something"*):
 * drag the button anywhere in the viewport and it stays there (remembered per app, in local storage); a double-click puts it
 * back in its corner. A drag never opens the panel; a click still does.
 *
 * @param {Array}    axes      `[{ key, label, values }]` (each value labelled with its first letter capitalised) or
 *                             `[{ key, label, options: [{ value, label }] }]`
 * @param {Object}   value     the current value by axis key
 * @param {Function} onChange  `(key, value)`
 * @param {node}     [children] under the rows, in the panel — what the current variant is (a page's name, its purpose)
 * @param {Object}   [style]   merged onto the pinned wrapper — a host whose own chrome holds that corner moves it
 */
export default function VariantsControl({ axes = [], value = {}, onChange, children, style, className = '' }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(read)
  const drag = useRef(null)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-end', offset: 8 })

  useEffect(() => {
    const onResize = () => setPos((p) => (p ? clamp(p) : p))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    const box = e.currentTarget.getBoundingClientRect()
    drag.current = { sx: e.clientX, sy: e.clientY, ox: e.clientX - box.left, oy: e.clientY - box.top, moved: false }
    const move = (ev) => {
      const d = drag.current
      if (!d) return
      if (!d.moved && Math.hypot(ev.clientX - d.sx, ev.clientY - d.sy) < 4) return
      d.moved = true
      setOpen(false)
      setPos(clamp({ x: ev.clientX - d.ox, y: ev.clientY - d.oy }))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      const d = drag.current
      if (d?.moved) setPos((p) => { write(p); return p })
      /* the click that ends a drag is swallowed below; clear the flag after it has passed */
      setTimeout(() => { drag.current = null }, 0)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  /* a drag's closing click never reaches the button (so it never opens the panel) */
  const onClickCapture = (e) => { if (drag.current?.moved) { e.stopPropagation(); e.preventDefault() } }
  const reset = () => { write(null); setPos(null) }

  const where = pos
    ? { left: pos.x, top: pos.y }
    : { top: 'var(--kol-shell-page-pad, 24px)', right: 'var(--kol-shell-page-pad, 24px)', ...style }
  return (
    <div className={`fixed z-10 ${className}`.trim()} style={pos ? { ...style, top: undefined, right: undefined, ...where } : where}>
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} onPointerDown={onPointerDown} onClickCapture={onClickCapture} onDoubleClick={reset} className="inline-flex touch-none" title="Drag to move · double-click to put back">
        <Button iconOnly="slider-01" size="lg" tone="inverted" radius="full" aria-label="Variants" style={{ boxShadow: 'var(--kol-shadow-lg)' }} pressed={open} />
      </span>
      <PopoverPanel popover={popover} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-2 p-3 max-w-[calc(100vw-16px)]">
        {axes.map((a) => [
          <span key={`${a.key}-l`} className="kol-mono-12 text-fg-64">{a.label}</span>,
          /* a row wider than the panel (a phone, a long axis) scrolls sideways in its cell — every option still one tap away */
          <div key={a.key} className="min-w-0 overflow-x-auto">
            <SegmentedToggle size="sm" className="w-max min-w-full" ariaLabel={a.label} value={value[a.key]} onChange={(v) => onChange?.(a.key, v)}
              options={a.options ?? (a.values ?? []).map((v) => ({ value: v, label: cap(v) }))} />
          </div>,
        ])}
        {children != null && <div className="col-span-2 border-t border-fg-08 pt-3 mt-1">{children}</div>}
      </PopoverPanel>
    </div>
  )
}
