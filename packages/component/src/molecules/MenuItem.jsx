import { useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { Menu } from './Menu.jsx'
import Kbd from '../atoms/Kbd.jsx'
import { indicatorSize } from '../hooks/glyphLadders.js'

/**
 * MenuItem — top-level menu entry. Trigger button + popover panel.
 *
 *   <MenuItem label="File">
 *     <MenuRow onClick={…} kbd="⌘S">Save</MenuRow>
 *     <MenuRow onClick={…}>Export…</MenuRow>
 *   </MenuItem>
 *
 * Built on `Menu` (the one engine, 2026-10-31), which is `usePopover` (`@floating-ui/react`): portal-rendered panel
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
  /* `Menu` is the engine (plan-2026-10-31-menu-engine W1.4): this is a menubar trigger on it, the panel is the menu panel */
  return (
    <Menu
      align={align}
      offset={offset}
      defaultOpen={defaultOpen}
      panelClassName={panelClassName}
      panelStyle={panelStyle}
      trigger={({ open, props }) => (
        <button
          {...props}
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
      )}
    >
      {children}
    </Menu>
  )
}

/**
 * MenuRow — action row inside a menu panel (`Menu`, `MenuItem`). Was `MenuDropdownItem` (alias kept, 2026-10-31).
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
 *   - indicator — the row's state mark, ALWAYS a kol-icon (plan-2026-10-31-menu-engine W2, user: *"its mainly about
 *                 using real icons, not typed symbols"*): `dot` the current pick of a single choice (*"• replaces ✓ for
 *                 single picks, definitely"*), `check` a row that is on in a many-of-N, `chevron` a row that opens more.
 *   - kbd       — a key, drawn as `Kbd`. Nothing trails a row unless the caller passes one of these.
 *   - shortcut  — @deprecated: the free trailing node the typed ✓ › ⌘S came through. A string renders as `Kbd`.
 *   - tone      — `'danger'` (float-everything W4 row 50, 2026-11-04): the destructive row — the error ink, the same
 *                 lift as every row (`.kol-menu-row--danger`). Delete layer, Remove, Sign out.
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
const INDICATOR = { dot: 'ascii-dot', check: 'check', chevron: 'chevron-right' }

export function MenuRow({ href, onClick, onPointerEnter, onPointerLeave, disabled, prefix, iconLeft, indicator, kbd, shortcut, hover = true, height, size = 'sm', rowClass, tone, children }) {
  /* `href` makes the row a real link — cmd/ctrl-click and middle-click open a new tab (DocumentHeader, 2026-10-31);
   * a plain click still runs `onClick` (the app's router), which may preventDefault */
  const Row = href && !disabled ? 'a' : 'button'
  return (
    <Row
      {...(Row === 'a' ? { href, onClick: (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; onClick?.(e) } } : { type: 'button', onClick })}
      data-menu-item
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      disabled={Row === 'button' ? disabled : undefined}
      role="menuitem"
      style={height != null ? { height } : undefined}
      className={`kol-menu-btn w-full ${rowClass ?? ROW_BY_SIZE[size] ?? ROW_BY_SIZE.sm} shrink-0 flex items-center gap-2 text-body ${hover ? 'hover:text-emphasis' : ''} ${tone === 'danger' ? 'kol-menu-row--danger' : ''} disabled:opacity-40 disabled:cursor-not-allowed text-left`.replace(/\s+/g, ' ')}
    >
      {prefix && <span className="shrink-0 inline-flex items-center">{prefix}</span>}
      {iconLeft && <span className="shrink-0 w-4 inline-flex items-center justify-center">{iconLeft}</span>}
      {/* leading-normal: kol-helper-12 is line-height 1, and truncate's
        * overflow clip cuts mono descenders on a 1-em line box ("Show grid"
        * loses its g). The h-8 centered row absorbs the taller line box —
        * zero layout shift (MenuItemDescenderClip, 2026-08-12). */}
      <span className="flex-1 truncate leading-normal">{children}</span>
      {(indicator || kbd != null || shortcut) && (
        <span className="shrink-0 inline-flex items-center gap-2 text-oq-88">
          {/* the dot is kol-icons `ascii-dot` drawn at twice the slot and pulled back into it: at the slot's own size its
            * 2.25/24 circle is a 2.6px speck; at 24 it is the rail's • (≈4.5px) and still takes the check's 14px column */}
          {indicator === 'dot'
            ? <Icon name="ascii-dot" size={size === 'xs' ? 16 : 24} style={{ margin: size === 'xs' ? -4 : -5 }} />
            : indicator && <Icon name={INDICATOR[indicator] ?? indicator} size={size === 'xs' ? indicatorSize('xs') : 14} />}
          {/* ⌘ is drawn, never typed — the Kbd's `command` glyph (as SearchInput's and Button's caps; W2 row 27, 2026-11-04) */}
          {kbd != null && (typeof kbd === 'string' && kbd.startsWith('⌘')
            ? <Kbd size="md" icon="command" className="kol-menu-kbd">{kbd.slice(1)}</Kbd>
            : <Kbd size="md" className="kol-menu-kbd">{kbd}</Kbd>)}
          {typeof shortcut === 'string' ? <Kbd size="md" className="kol-menu-kbd">{shortcut}</Kbd> : shortcut}
        </span>
      )}
    </Row>
  )
}

/* `className` — the rule's colour and spacing, whole (MetricDashboardUpstream, kol-website 2026-10-31): on a filled
 * panel the default `border-oq-08` vanishes. */
/* MenuDivider — a rule between a menu's groups. Was `MenuDropdownDivider` (alias kept, 2026-10-31). */
export function MenuDivider({ className = 'border-oq-08 my-1' }) {
  return <div className={`border-t ${className}`} />
}

/**
 * MenuFlyout — a menu row that holds a submenu. Was `MenuDropdownNest` (alias kept, 2026-10-31).
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
 * `rowClass` (flyout) — the nest row's type, padding, height and fill, whole, as `MenuDropdownItem rowClass`.
 * `panelClassName` / `panelStyle` (flyout) — the panel's surface and its place beside the row; a `marginLeft` gap
 * mirrors to `marginRight` when the panel flips (MetricDashboardUpstream, kol-website 2026-10-31).
 *
 * Either way, a leaf MenuDropdownItem inside still closes the whole menu via the
 * standard data-menu-item bubble; the nest row itself only toggles.
 */
export function MenuFlyout({ prefix, iconLeft, label, disabled, flyout = false, scroll = false, rowClass, panelClassName, panelStyle, children }) {
  if (flyout) return <MenuFlyoutNest prefix={prefix} iconLeft={iconLeft} label={label} disabled={disabled} scroll={scroll} rowClass={rowClass} panelClassName={panelClassName} panelStyle={panelStyle}>{children}</MenuFlyoutNest>
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

function MenuFlyoutNest({ prefix, iconLeft, label, disabled, scroll, rowClass, panelClassName, panelStyle, children }) {
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
        className={rowClass ? `kol-menu-btn w-full shrink-0 flex items-center gap-2 text-left disabled:opacity-40 disabled:cursor-not-allowed ${rowClass}` : `${NEST_ROW} ${open ? 'text-emphasis' : 'text-body hover:text-emphasis'}`}
      >
        <NestRowBody prefix={prefix} iconLeft={iconLeft} label={label} />
        <Icon name="chevron-right" size={10} className="text-emphasis shrink-0" />
      </button>
      {open && (
        /* top -5 = the panel's 1px border + 4px pad, so its first row sits on the trigger row */
        <div
          ref={panel}
          role="menu"
          className={`absolute ${fit.flip ? 'right-full' : 'left-full'} flex flex-col w-max min-w-[180px] max-w-[320px] z-10 ${panelClassName ?? 'py-1 bg-surface-secondary rounded border border-oq-08 shadow-lg'} ${scroll ? 'max-h-[60vh] overflow-y-auto' : ''}`}
          style={{ top: -5 + fit.dy, ...(fit.flip && panelStyle?.marginLeft != null ? { ...panelStyle, marginLeft: undefined, marginRight: panelStyle.marginLeft } : panelStyle) }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/** @deprecated 2026-10-31 → MenuRow (the Menu* family, metric Round 4) */
export const MenuDropdownItem = MenuRow
/** @deprecated 2026-10-31 → MenuDivider */
export const MenuDropdownDivider = MenuDivider
/** @deprecated 2026-10-31 → MenuFlyout */
export const MenuDropdownNest = MenuFlyout
