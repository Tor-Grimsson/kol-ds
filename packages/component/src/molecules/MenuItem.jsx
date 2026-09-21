import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { PopoverPanel, usePopover } from '../utilities/Popover.jsx'

/**
 * MenuItem — top-level menu entry. Trigger button + popover panel.
 *
 *   <MenuItem label="File">
 *     <MenuDropdownItem onClick={…}>Save</MenuDropdownItem>
 *     <MenuDropdownItem onClick={…}>Export…</MenuDropdownItem>
 *   </MenuItem>
 *
 * Built on `usePopover` (`@floating-ui/react`): portal-rendered panel
 * (escapes overflow), auto-flip + viewport shift, click-outside / Escape
 * dismiss, focus management. `align="end"` switches the placement to
 * `bottom-end` for right-aligned panels (Templates menu).
 *
 * For value-list selection (pick one of N with active state) use the
 * `Dropdown` molecule instead — MenuItem is for action menus / popovers
 * that hold arbitrary children.
 */
export function MenuItem({
  label,
  children,
  align = 'start',
  panelClassName = '',
  panelStyle,
  buttonClassName = '',
  defaultOpen = false,
  /* THE CARET IS NOT ALWAYS RIGHT. The trigger draws `label ▾`, which is the
   * shape of a named menu — File, Sort. An ICON trigger (`···`, a gear) is
   * already complete and a caret beside it reads as a second glyph rather than
   * an affordance; neither reference draws one (ColumnBrowserMobileViews item
   * 15, kol-r2b2 2026-09-04). Default keeps every existing call-site. */
  caret = true,
}) {
  const [open, setOpen] = useState(defaultOpen)
  const popover = usePopover({
    open,
    onOpenChange: setOpen,
    placement: align === 'end' ? 'bottom-end' : 'bottom-start',
    offset: 4,
    role: 'menu',
  })

  const close = () => setOpen(false)

  return (
    <>
      <button
        ref={popover.refs.setReference}
        {...popover.getReferenceProps()}
        type="button"
        className={`kol-helper-12 px-3 h-8 inline-flex items-center gap-2 rounded text-body hover:text-emphasis transition-colors ${buttonClassName}`}
      >
        <span>{label}</span>
        {caret && (
          <Icon
            name="chevron-down"
            size={10}
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}
          />
        )}
      </button>
      {/* w-max: floats size to CONTENT, never to the containing block —
        * same family law as ShapeDropdown's panel (2026-08-09 review). */}
      <PopoverPanel
        popover={popover}
        panel={false}
        focus={false}
        className={`w-max bg-surface-secondary rounded ${panelClassName}`}
        style={panelStyle}
      >
        <div
          onClick={(e) => {
            /* close on item click — items inside fire their handler then bubble. */
            if (e.target.closest('[data-menu-item]')) close()
          }}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      </PopoverPanel>
    </>
  )
}

/**
 * MenuDropdownItem — action row inside a MenuItem's dropdown panel.
 *
 * `height` (default none — the `h-8` rung) — an inline row height, for a panel
 * in a chrome whose own rows are shorter (DropdownGhostWidthAndListHeight,
 * kol-mirror 2026-08-28: its controls sit in 24px rows and the DS row was a
 * third taller). Inline because `h-8` is a utility and a rule cannot out-rank it.
 *
 * `hover` (default true) — `false` drops the ink brighten, for a panel ruled
 * to carry NO hover state at all (user 2026-08-28, on `Dropdown`: "delete any
 * hover state on dropdowns"). Scoped to the caller: a MenuItem's own menu keeps
 * its hover, because that ruling was about the select, not every panel.
 * Renders as a button so it picks up disabled, focus, and keyboard
 * activation. The parent MenuItem closes automatically on click via a
 * delegated handler that matches the `data-menu-item` attr.
 *
 * Slots:
 *   - prefix    — leading content of arbitrary width (e.g. palette swatch
 *                 strip). Use for visuals wider than a single icon.
 *   - iconLeft  — leading icon, fixed 16px width column (rows align).
 *   - children  — main label, flex-1.
 *   - shortcut  — trailing content (text shortcut hint, ✓ marker, or icon).
 */
/* the row follows the trigger's rung (DropdownXsList, kol-monitor 2026-09-01):
 * at xs the list kept sm rows — kol-helper-12 in a 32px pitch — inside a panel
 * fused to an 8px-type trigger, so the options truncated. One map, both ends. */
/* xs wears the TRIGGER's face (kol-mono-8), not the helper: the trigger's ghost
 * stack reserves the widest label in its own face, and a row set in a different
 * one measured 3px wider and clipped the selected row beside its check. */
const ROW_BY_SIZE = { xs: 'kol-mono-8 px-2 h-5', sm: 'kol-helper-12 px-3 h-8', md: 'kol-helper-12 px-3 h-8', lg: 'kol-helper-12 px-3 h-8' }
export function MenuDropdownItem({ onClick, onPointerEnter, onPointerLeave, disabled, prefix, iconLeft, shortcut, hover = true, height, size = 'sm', children }) {
  return (
    <button
      type="button"
      data-menu-item
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      disabled={disabled}
      role="menuitem"
      style={height != null ? { height } : undefined}
      className={`w-full ${ROW_BY_SIZE[size] ?? ROW_BY_SIZE.sm} shrink-0 inline-flex items-center gap-2 text-body ${hover ? 'hover:text-emphasis' : ''} disabled:opacity-40 disabled:cursor-not-allowed text-left`}
    >
      {prefix && <span className="shrink-0 inline-flex items-center">{prefix}</span>}
      {iconLeft && <span className="shrink-0 w-4 inline-flex items-center justify-center">{iconLeft}</span>}
      {/* leading-normal: kol-helper-12 is line-height 1, and truncate's
        * overflow clip cuts mono descenders on a 1-em line box ("Show grid"
        * loses its g). The h-8 centered row absorbs the taller line box —
        * zero layout shift (MenuItemDescenderClip, 2026-08-12). */}
      <span className="flex-1 truncate leading-normal">{children}</span>
      {shortcut && <span className="kol-helper-10 text-emphasis shrink-0 inline-flex items-center">{shortcut}</span>}
    </button>
  )
}

export function MenuDropdownDivider() {
  return <div className="border-t border-fg-08 my-1" />
}

/**
 * MenuDropdownNest — accordion-style row inside a dropdown panel. Click
 * the row to expand/collapse its children inline (below the row, in the
 * same panel). The trailing chevron rotates 90° to indicate state.
 *
 * Same visual shape as MenuDropdownItem at rest. Clicking a leaf
 * MenuDropdownItem inside an open nest still closes the entire menu via
 * the standard data-menu-item bubble. Clicking the nest row itself only
 * toggles its own expansion.
 */
export function MenuDropdownNest({ prefix, iconLeft, label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full kol-helper-12 px-3 h-8 inline-flex items-center gap-2 text-body hover:text-emphasis text-left"
      >
        {prefix && <span className="shrink-0 inline-flex items-center">{prefix}</span>}
        {iconLeft && <span className="shrink-0 w-4 inline-flex items-center justify-center">{iconLeft}</span>}
        {/* leading-normal — same descender fix as MenuDropdownItem above. */}
        <span className="flex-1 truncate leading-normal">{label}</span>
        <Icon
          name="chevron-down"
          size={10}
          className="text-emphasis shrink-0"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms' }}
        />
      </button>
      {open && (
        <div className="ml-3 border-l border-fg-08">
          {children}
        </div>
      )}
    </>
  )
}
