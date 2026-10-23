import { useLayoutEffect, useRef, useState } from 'react'
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
/* the ladder's tokens, so the touch rung (D5, 2026-09-29) grows the trigger with its row */
const TRIGGER_H = { xs: 'var(--kol-ctl-xs)', sm: 'var(--kol-ctl-sm)', md: 'var(--kol-ctl-md)', lg: 'var(--kol-ctl-lg)' }
/* and its type: xs wears its rows' face, as `Button size="xs"` beside it does (MenuItemXsTriggerType,
 * kol-monitor 2026-10-15 — 12px helper type in a 22px box) */
const TRIGGER_BY_SIZE = { xs: 'kol-mono-8 px-2', sm: 'kol-helper-12 px-3', md: 'kol-helper-12 px-3', lg: 'kol-helper-12 px-3' }

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
  /* THE TRIGGER IS ON THE LADDER (apps review 2026-09-29). It was a fixed `h-8` — 32px whatever sat
   * beside it, so media's phone `···` stood 32 next to a 26 `sm` search field. `size` pins it to the
   * control heights (01-foundations/09-sizes: 22 · 26 · 32 · 40); `md` is the 32 it always was. */
  size = 'md',
  /* the panel's gap below the trigger. A trigger inside a taller bar passes a negative value so
   * the panel's top lands on the bar's own line (MenuItemOffset, kol-fxr 2026-10-13) */
  offset = 4,
}) {
  const [open, setOpen] = useState(defaultOpen)
  const popover = usePopover({
    open,
    onOpenChange: setOpen,
    placement: align === 'end' ? 'bottom-end' : 'bottom-start',
    offset,
    role: 'menu',
  })

  const close = () => setOpen(false)

  return (
    <>
      <button
        ref={popover.refs.setReference}
        {...popover.getReferenceProps()}
        type="button"
        className={`kol-menu-btn ${TRIGGER_BY_SIZE[size] ?? TRIGGER_BY_SIZE.md} inline-flex items-center gap-2 rounded text-body hover:text-emphasis transition-colors ${buttonClassName}`}
        style={{ height: TRIGGER_H[size] ?? TRIGGER_H.md }}
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
const ROW_BY_SIZE = { xs: 'kol-mono-8 px-2 h-5', sm: 'kol-helper-12 px-2 h-8', md: 'kol-helper-12 px-2 h-8', lg: 'kol-helper-12 px-2 h-8' }
/* `rowClass` — the row's type, side padding and height, whole, in place of the size's own
 * (Dropdown passes it, 2026-10-02: its rows wear the trigger's face and sit on the trigger's
 * text edge; a menu's rows keep `ROW_BY_SIZE`). */
/* `flex`, not `inline-flex` (MenuDropdownItemBlockRow, kol-fxr 2026-10-13): as bare children of a
 * content-sized (`w-max`) panel, inline rows measured as ONE line — five starters ≈ 795px. A block
 * row still fills a fixed panel through `w-full` and lets a content-sized one hug its longest label. */
export function MenuDropdownItem({ onClick, onPointerEnter, onPointerLeave, disabled, prefix, iconLeft, shortcut, hover = true, height, size = 'sm', rowClass, children }) {
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
      className={`kol-menu-btn w-full ${rowClass ?? ROW_BY_SIZE[size] ?? ROW_BY_SIZE.sm} shrink-0 flex items-center gap-2 text-body ${hover ? 'hover:text-emphasis' : ''} disabled:opacity-40 disabled:cursor-not-allowed text-left`}
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
  return <div className="border-t border-oq-08 my-1" />
}

/**
 * MenuDropdownNest — A dropdown row that opens a submenu. a row inside a dropdown panel that holds a submenu.
 *
 * Default — ACCORDION: click the row to expand/collapse its children inline
 * (below the row, in the same panel); the trailing chevron rotates 90°.
 *
 * `flyout` — the submenu opens BESIDE the row, the way a desktop menu bar does
 * (MenuDropdownNestFlyout, kol-fxr 2026-10-13 — the editor's Affinity-style
 * bar: Tools › Generative › Loops › Field › preset). Hover opens, leaving the
 * row and its panel closes, a click toggles (touch), → opens and ← closes from
 * the keyboard. The panel is a DOM CHILD of the row, never a portal: MenuItem
 * closes on a click bubbling from `[data-menu-item]` and dismisses on an outside
 * press, so a portalled panel would read as "outside" and close the menu under
 * the pointer. One measure on open keeps it on screen — lifted to end above the
 * window's foot (never past its head), flipped to the row's left when it would
 * cross the right edge. Flyouts nest to any depth.
 *
 * `scroll` (flyout only) — caps the panel at 60vh and scrolls it, for long leaf
 * lists. A scrolling panel clips its own flyouts, so give it to a panel with no
 * flyouts inside.
 *
 * Either way, a leaf MenuDropdownItem inside still closes the whole menu via the
 * standard data-menu-item bubble; the nest row itself only toggles.
 */
export function MenuDropdownNest({ prefix, iconLeft, label, disabled, flyout = false, scroll = false, children }) {
  if (flyout) return <MenuFlyoutNest prefix={prefix} iconLeft={iconLeft} label={label} disabled={disabled} scroll={scroll}>{children}</MenuFlyoutNest>
  return <MenuAccordionNest prefix={prefix} iconLeft={iconLeft} label={label} disabled={disabled}>{children}</MenuAccordionNest>
}

const NEST_ROW = 'kol-menu-btn w-full kol-helper-12 px-3 h-8 shrink-0 flex items-center gap-2 text-left disabled:opacity-40 disabled:cursor-not-allowed'

function NestRowBody({ prefix, iconLeft, label }) {
  return (
    <>
      {prefix && <span className="shrink-0 inline-flex items-center">{prefix}</span>}
      {iconLeft && <span className="shrink-0 w-4 inline-flex items-center justify-center">{iconLeft}</span>}
      {/* leading-normal — same descender fix as MenuDropdownItem above. */}
      <span className="flex-1 truncate leading-normal">{label}</span>
    </>
  )
}

function MenuAccordionNest({ prefix, iconLeft, label, disabled, children }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        disabled={disabled}
        className={`${NEST_ROW} text-body hover:text-emphasis`}
      >
        <NestRowBody prefix={prefix} iconLeft={iconLeft} label={label} />
        <Icon
          name="chevron-down"
          size={10}
          className="text-emphasis shrink-0"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms' }}
        />
      </button>
      {open && (
        <div className="ml-3 border-l border-oq-08">
          {children}
        </div>
      )}
    </>
  )
}

function MenuFlyoutNest({ prefix, iconLeft, label, disabled, scroll, children }) {
  const [open, setOpen] = useState(false)
  const [fit, setFit] = useState({ dy: 0, flip: false })
  const row = useRef(null)
  const panel = useRef(null)

  useLayoutEffect(() => {
    if (!open) { setFit({ dy: 0, flip: false }); return }
    const r = panel.current?.getBoundingClientRect()
    /* lift it to end above the window's foot, never past its head — a panel taller than the
     * window keeps its top rows (`scroll` is the answer for a long one) */
    if (r) setFit({ dy: Math.max(8 - r.top, Math.min(0, window.innerHeight - 8 - r.bottom)), flip: r.right > window.innerWidth - 8 })
  }, [open])

  return (
    <div
      className="relative"
      onPointerEnter={() => !disabled && setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' && open) { e.stopPropagation(); setOpen(false); row.current?.focus() }
      }}
    >
      <button
        ref={row}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            setOpen(true)
            requestAnimationFrame(() => panel.current?.querySelector('button:not(:disabled)')?.focus())
          }
        }}
        className={`${NEST_ROW} ${open ? 'text-emphasis' : 'text-body hover:text-emphasis'}`}
      >
        <NestRowBody prefix={prefix} iconLeft={iconLeft} label={label} />
        <Icon name="chevron-right" size={10} className="text-emphasis shrink-0" />
      </button>
      {open && (
        /* top -5 = the panel's 1px border + 4px pad, so its first row sits on the trigger row */
        <div
          ref={panel}
          role="menu"
          className={`absolute ${fit.flip ? 'right-full' : 'left-full'} flex flex-col w-max min-w-[180px] max-w-[320px] py-1 bg-surface-secondary rounded border border-oq-08 shadow-lg z-10 ${scroll ? 'max-h-[60vh] overflow-y-auto' : ''}`}
          style={{ top: -5 + fit.dy }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
