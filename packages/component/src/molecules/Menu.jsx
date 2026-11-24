import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import KolboxGlyph from '../utilities/kolboxGlyph.jsx'
import { MenuRow, MenuDivider } from './MenuItem.jsx'
import { MenuList, MenuLabel, panelClass } from './MenuList.jsx'
import { PopoverPanel, PopoverLayer, usePopover } from '../utilities/Popover.jsx'
import { TONE_VARS } from '../utilities/tone.js'

/**
 * The Menu* family (metric Round 4, 2026-10-31) — one family, one prefix.
 *
 *   MenuTrigger  the chip: `Button variant="tab" size="sm"`, `pressed` while open; `iconOnly` is the ⋮
 *   MenuPanel    the faint raised panel (kol-theme `.kol-menu-panel`)
 *   MenuRow · MenuDivider · MenuLabel · MenuFlyout — the parts (MenuRow / MenuFlyout / MenuDivider live in MenuItem.jsx)
 *   MenuList     the rows from `items` — the one place rows are mapped (MenuList.jsx, 2026-11-07); Menu renders it in its panel
 *   Menu         the base: `trigger` (render prop `({ open, props })`) + `items` (rows as data)
 *   MenuFilter · MenuDatePicker · MenuMore — ready-made menus, data and callbacks only
 *
 *   <Menu align="end" minWidth={224} trigger={({ open, props }) => <MenuTrigger open={open} icon="filter-lines" {...props}>Filter</MenuTrigger>} items={[
 *     { heading: 'Graph interval' },                                   // a MenuLabel row
 *     { label: 'Days', current: true, checked: true, onClick },
 *     { divider: true },
 *     { label: 'Segment', icon: 'star', disabled: true, tooltip: 'No segments saved' },
 *     { label: 'Browser', icon: 'layout', items: [{ label: 'Browser', onClick }] },   // a flyout
 *     { label: 'Last 7 days', kbd: 'W', onClick },
 *     { label: 'Export stats', trailing: 'download', onClick },
 *   ]} />
 *
 *   row keys: `icon` (kol-icons name or node) · `trailing` (+ `trailingSize`) · `current` fills the row · `indicator`
 *   'dot' (single pick) | 'check' (many-of-N) | 'chevron' · `checked` = 'check' (before the `kbd` cap) · `kbd` · `disabled` + `tooltip` (why) · `items` (a flyout of the same rows)
 *   · `tone: 'danger'` the destructive row (the error ink).
 *   `search` ({ placeholder, empty }) puts a search field above the rows and filters them by label.
 *   `children` sit above the rows.
 *
 *   THE FLOAT LOOK (float-everything W4, 2026-11-04 — rows 46–60 of the gap map): `variant="float"` on any of them. The
 *   panel is a list on `--kol-float-list-r` (8), 4 in, the float surface and shadow; its rows are 34, 12 in, Inter 12/500,
 *   lifted on `--kol-fg-16`; a flyout opens 8 off the row on the same list. `MenuMore variant="float"` is the More sheet —
 *   `--kol-float-menu-r` (20), 6 in. `MenuTrigger variant="float"` is a `Button variant="float"` capsule on the float well;
 *   `MenuDatePicker variant="float"` sets its value in mono — the date chip (row 33). Today's defaults do not move.
 */

/* the ⋮ — kol-icons `more-vertical` (user 2026-10-31: *"just make a vertical version"* — was `more` turned 90°) */
const MORE = <IconLoader name="more-vertical" size={16} />

export function MenuTrigger({ open = false, iconOnly, icon, iconComponent, variant, mono = false, size, children, ...rest }) {
  /* the float trigger: a capsule on the float well, lit fg-16 while its menu is open; `mono` for a value (the date chip) */
  if (variant === 'float') {
    const cls = `kol-menu-trigger kol-menu-trigger--float${mono ? ' kol-menu-trigger--mono' : ''} ${rest.className ?? ''}`.trim()
    if (iconOnly) return <Button variant="float" size={size ?? 'md'} pressed={open} iconOnly={iconOnly === true ? 'more-vertical' : iconOnly} iconComponent={iconOnly === true ? MORE : iconComponent} {...rest} className={cls} />
    return <Button variant="float" size={size ?? 'md'} pressed={open} iconLeft={icon} iconComponent={iconComponent} {...rest} className={cls}>{children}</Button>
  }
  if (iconOnly) {
    return <Button variant="tab" size="sm" pressed={open} iconOnly={iconOnly === true ? 'more-vertical' : iconOnly} iconComponent={iconOnly === true ? MORE : iconComponent} {...rest} className={`kol-menu-trigger ${rest.className ?? ''}`.trim()} />
  }
  /* a labelled trigger has NO hover wash — its ground shows only while its menu is open (user 2026-10-31, on Plausible:
   * *"its not supposed to be solid, only bg on hover … no hover just click … only [...] has hover"*); the ⋮ keeps it */
  return <Button variant="tab" size="sm" pressed={open} iconLeft={icon} iconComponent={iconComponent} {...rest} className={`kol-menu-trigger kol-menu-trigger--quiet ${rest.className ?? ''}`.trim()}>{children}</Button>
}

export const MenuPanel = ({ variant, sheet = false, className = '', children, ...rest }) => (
  <div className={`kol-menu-panel flex flex-col gap-[var(--kol-spacing-0-5)] ${panelClass(variant, sheet)} ${className}`.replace(/\s+/g, ' ').trim()} {...rest}>{children}</div>
)

export { MenuLabel }


/* ── the kolbox look (plan-2026-11-18-kolbox-system W31.2 batch 4, 2026-11-18) ──
 * kolbox's Menu carried line for line, the chrome in kol-theme `.kol-menu--kolbox` and its rows. Its own API, which no
 * other look shares: an `anchor` (an element, a ref, or anything with getBoundingClientRect), controlled `open` with
 * `onClose`, `onSelect(row)`, and `groups` `[[row, ...], { title, rows: [...] }]` with a rule between groups; a row is
 * `{ label, value, icon, check, shortcut, tag, submenu, disabled, highlighted, inset }`; `highlighted` marks the chosen row
 * (where the keys start, the row an `over` list lays on its field), never a lit row: a menu opens with none lit. KOL's words where they are the
 * same thing: `aria-label`, `minWidth`, `panelClassName` (the panel's class), `children` (a node above the rows: the
 * zoom menu's field). A row's `icon` is the set's name. `placement` is the layer's (`PopoverLayer`): bottom-start, left-start, right-start, beside, over
 * (a Dropdown's list lying over its field). */

/* One row: a leading check or icon, the label, then a shortcut, a tag or a submenu chevron. The active row (the pointer's
   or the keys') is solid accent with on-accent ink. The pointer lights a row when it moves on it, so a list that opens
   under a resting pointer (a dropdown laid over its field) opens with no row lit.
   `inset`: a row with no glyph held in the glyph's column. */
function MenuRowKolbox({ row, index, lead, active, onEnter, onPick }) {
  const { label, icon, check, shortcut, tag, submenu, disabled, inset } = row
  return (
    <div
      role={check === undefined ? 'menuitem' : 'menuitemcheckbox'}
      aria-checked={check === undefined ? undefined : !!check}
      aria-disabled={disabled || undefined}
      aria-haspopup={submenu ? 'menu' : undefined}
      data-menu-row={index}
      data-active={active || undefined}
      data-chosen={row.highlighted || undefined}
      onPointerMove={disabled || active ? undefined : onEnter}
      onClick={disabled ? undefined : onPick}
      className={`kol-menu-row--kolbox${disabled ? ' is-disabled' : active ? ' is-active' : ''} flex h-6 shrink-0 cursor-default items-center gap-2 px-2 whitespace-nowrap${disabled ? ' opacity-50' : ''}`}
    >
      {lead ? (
        <span className="flex size-4 shrink-0 items-center justify-center">
          {check ? <KolboxGlyph name="check" size={12} /> : icon ? <KolboxGlyph name={icon} /> : null}
        </span>
      ) : icon ? <KolboxGlyph name={icon} /> : inset && <span className="size-4 shrink-0" />}
      <span className="flex-1">{label}</span>
      {shortcut && <span className={`shrink-0 ${active ? '' : 'kol-menu-sub--kolbox'}`}>{shortcut}</span>}
      {tag && <span className={`kol-menu-tag--kolbox${active ? ' is-active' : ''} px-1`}>{tag}</span>}
      {submenu && <KolboxGlyph name="chevron-right" className={active ? '' : 'kol-menu-sub--kolbox'} />}
    </div>
  )
}

/**
 * MenuScroll — the foot of a kolbox menu taller than the window (Menu family, W31.2 batch 4; Figma 288:8017): the full
 * panel width, 24 high, the 12 chevron-down centred in oq-64. While the pointer is on it the panel scrolls down, 4 px a
 * frame, until the end or the pointer leaves. It sits sticky on the menu's own fill so the rows pass under it.
 * `Menu variant="kolbox"` draws it on its own; `panel` is the scrolling panel's ref.
 */
export function MenuScroll({ panel }) {
  const run = useRef(0)
  const stop = () => cancelAnimationFrame(run.current)
  const go = () => {
    const p = panel.current
    if (!p) return
    p.scrollTop += 4
    run.current = requestAnimationFrame(go)
  }
  useEffect(() => stop, [])
  return (
    <div data-menu-more="" aria-hidden onPointerEnter={go} onPointerLeave={stop}
      className="kol-menu-scroll--kolbox sticky -bottom-2 -mx-2 -mb-2 flex h-6 shrink-0 items-center justify-center">
      <KolboxGlyph name="chevron-down" />
    </div>
  )
}

/* Flyouts: a row whose `submenu` holds groups (the same shape) opens a second Menu, on hover, a click, ArrowRight or
   Enter; ArrowLeft in the flyout closes it and gives the keys back. A pick in a flyout runs this Menu's onSelect and
   closes every level. The child is a panel beside this whole panel, not hung from its row; the row stays lit in the
   accent while its child is open. A list taller than the window scrolls and ends in MenuScroll while there is more below.
   The keys: the arrows move the lit row, Enter picks, a letter jumps to the next row that starts with it, Escape (the
   layer's) closes. */
function MenuKolbox({ anchor, open, onClose, onSelect, groups = [], 'aria-label': label, placement = 'bottom-start', panelClassName = '', minWidth, nested = false, children }) {
  const all = groups.map((g) => (Array.isArray(g) ? { rows: g } : g))
  const rows = all.flatMap((g) => g.rows)
  /* the lead column is kept for checks only, so a checked list lines up; a row's icon sits in its row */
  const lead = rows.some((r) => r.check !== undefined)
  /* no row is lit on open (the accent is the pointer's and the keys'); the chosen row (`highlighted`) is where the keys
     start and, under `placement="over"`, the row laid on the field */
  const chosen = rows.findIndex((r) => r.highlighted)
  const [active, setActive] = useState(-1)
  const [flyout, setFlyout] = useState(null)
  useEffect(() => { if (open) setActive(-1); else setFlyout(null) }, [open])

  /* focus once, when the panel mounts: a flyout takes the keys while it is open */
  const panel = useRef(null)
  const [more, setMore] = useState(false)
  const measure = useCallback(() => { const p = panel.current; if (p) setMore(p.scrollHeight - p.scrollTop - p.clientHeight > 1) }, [])
  const mount = useCallback((node) => { panel.current = node; node?.focus({ preventScroll: true }); if (node) requestAnimationFrame(measure) }, [measure])
  const refocus = () => panel.current?.focus({ preventScroll: true })
  /* the keys move the lit row; a long list follows it */
  useEffect(() => { panel.current?.querySelector(`[data-menu-row="${active}"]`)?.scrollIntoView({ block: 'nearest' }) }, [active])

  const pick = (row) => { onSelect?.(row); onClose?.() }
  const show = (i) => { if (flyout !== null && flyout !== i) refocus(); setFlyout(i !== null && rows[i]?.submenu && !rows[i].disabled ? i : null) }
  const press = (i) => (rows[i].submenu ? show(i) : pick(rows[i]))
  const key = (e) => {
    /* the page's own shortcuts never see a key meant for the menu; Escape goes on to the layer's listener */
    if (e.key !== 'Escape') e.stopPropagation()
    if (e.key === 'ArrowLeft' && nested) { e.preventDefault(); onClose?.(); return }
    const live = rows.map((r, i) => (r.disabled ? -1 : i)).filter((i) => i >= 0)
    if (!live.length) return
    const at = live.indexOf(active)
    if (e.key === 'ArrowDown') { e.preventDefault(); show(null); setActive(at < 0 && live.includes(chosen) ? chosen : live[(at + 1) % live.length]) }
    if (e.key === 'ArrowUp') { e.preventDefault(); show(null); setActive(live[at < 0 ? live.length - 1 : (at - 1 + live.length) % live.length]) }
    if (e.key === 'ArrowRight' && rows[active]?.submenu) { e.preventDefault(); show(active) }
    /* preventDefault: else the Enter's keypress lands on the trigger that takes focus back, and opens it again */
    if (e.key === 'Enter' && rows[active] && !rows[active].disabled) { e.preventDefault(); press(active) }
    /* a letter jumps to the next live row that starts with it */
    if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey && e.target.tagName !== 'INPUT') {
      const k = e.key.toLowerCase()
      const next = [...live.slice(at + 1), ...live.slice(0, at + 1)].find((i) => String(rows[i].label).toLowerCase().startsWith(k))
      if (next !== undefined) { show(null); setActive(next) }
    }
  }

  let n = -1
  const sub = flyout !== null ? rows[flyout] : null
  return (
    <>
      <PopoverLayer anchor={anchor} open={open} onClose={onClose} placement={placement} kind="menu">
        <div
          role="menu"
          aria-label={label}
          tabIndex={-1}
          ref={mount}
          onKeyDown={key}
          onScroll={measure}
          data-kolbox-menu=""
          style={minWidth != null ? { minWidth } : undefined}
          className={`kol-menu--kolbox kol-kolbox-surface flex min-w-40 flex-col overflow-y-auto p-2 outline-none ${panelClassName}`}
        >
          {children}
          {all.map((g, gi) => (
            <Fragment key={gi}>
              {gi > 0 && <div role="separator" className="kol-menu-rule--kolbox -mx-2 my-1 h-px shrink-0" />}
              {g.title && <div className="kol-menu-heading--kolbox flex h-6 shrink-0 items-center px-2">{g.title}</div>}
              {g.rows.map((row) => {
                const i = ++n
                return <MenuRowKolbox key={i} row={row} index={i} lead={lead} active={i === active || i === flyout} onEnter={() => { setActive(i); show(i) }} onPick={() => press(i)} />
              })}
            </Fragment>
          ))}
          {more && <MenuScroll panel={panel} />}
        </div>
      </PopoverLayer>
      {sub?.submenu && (
        <MenuKolbox
          key={flyout}
          nested
          anchor={panel.current}
          open={open}
          placement="beside"
          aria-label={sub.label}
          groups={sub.submenu}
          onSelect={pick}
          onClose={() => { setFlyout(null); refocus() }}
        />
      )}
    </>
  )
}

/* Menu's own rows under the kolbox look (Folio on kolbox, 2026-11-22), so a host that passes `items` switches by the
   variant alone: `{ label, onClick, kbd, checked, disabled, icon, items }`, `{ divider: true }` (a new group) and
   `{ heading }` (a titled group) become kolbox's groups; a row's `onClick` runs as it is picked. `anchor` may also be a
   point `{ x, y }` (a right-click list): the list opens at it. */
const kolboxGroupsOf = (items) => {
  const groups = [{ rows: [] }]
  for (const it of items) {
    if (it.divider || it.heading) { if (groups.at(-1).rows.length || groups.at(-1).title) groups.push({ rows: [] }); if (it.heading) groups.at(-1).title = it.heading; continue }
    groups.at(-1).rows.push({ label: it.label, check: it.checked, shortcut: it.kbd || undefined, disabled: it.disabled, icon: typeof it.icon === 'string' ? it.icon : undefined, submenu: it.items?.length ? kolboxGroupsOf(it.items) : undefined, run: it.onClick })
  }
  return groups.filter((g) => g.rows.length)
}
function MenuKolboxItems({ items, anchor, onSelect, ...props }) {
  const point = anchor != null && !('current' in anchor) && typeof anchor.getBoundingClientRect !== 'function' && anchor.x != null
  const { x, y } = point ? anchor : {}
  const at = useMemo(() => (point ? { getBoundingClientRect: () => ({ x, y, left: x, right: x, top: y, bottom: y, width: 0, height: 0 }) } : anchor), [point, x, y, point ? null : anchor]) // eslint-disable-line react-hooks/exhaustive-deps
  return <MenuKolbox {...props} anchor={at} groups={kolboxGroupsOf(items)} onSelect={(row) => { onSelect?.(row); row.run?.() }} />
}

/* ── the folio look (Folio migration batch B, 2026-11-22) ──
 * Folio's menu list (apps/folio EditorChrome `Items`) carried class for class, the chrome in kol-theme `.kol-menu--folio`.
 * The host owns the trigger, as kolbox's does; the list is drawn in place, never portalled, so it keeps the frame's
 * `data-folio-*` switches. KOL's words: `open`, `onClose`, `items` (`{ label, onClick, kbd, checked, disabled }` or
 * `{ divider: true }`), `aria-label`, `minWidth`, `panelClassName` (where the list sits: the host's `absolute ...`).
 * `anchor` a point `{ x, y }`: a right-click list, fixed at the point and kept on screen, closed by any press, a scroll or
 * the window's blur. Without one a press outside the host's wrapper (the list's parent) closes it. Escape closes either.
 * The check column is drawn when any row says `checked`; the key column when a row says `kbd`. A row's click closes
 * the list, then runs. */
function MenuFolioCheck({ checked }) {
  return <span aria-hidden className="kol-menu-check--folio inline-flex size-[16px] shrink-0 items-center justify-center">{checked ? '✓' : ''}</span>
}
function MenuFolio({ open, onClose, items = [], anchor, 'aria-label': label, minWidth, panelClassName = '' }) {
  const panel = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const esc = (e) => e.key === 'Escape' && onClose?.()
    if (anchor) {
      const shut = () => onClose?.()
      addEventListener('mousedown', shut); addEventListener('keydown', esc); addEventListener('scroll', shut, true); addEventListener('blur', shut)
      return () => { removeEventListener('mousedown', shut); removeEventListener('keydown', esc); removeEventListener('scroll', shut, true); removeEventListener('blur', shut) }
    }
    const off = (e) => { if (!panel.current?.parentElement?.contains(e.target)) onClose?.() }
    addEventListener('mousedown', off); addEventListener('keydown', esc)
    return () => { removeEventListener('mousedown', off); removeEventListener('keydown', esc) }
  }, [open, onClose, anchor])
  if (!open) return null
  const lead = items.some((it) => it.checked !== undefined)
  const rows = items.filter((it) => !it.divider).length, seps = items.length - rows
  const at = anchor ? { left: Math.min(anchor.x, innerWidth - 260), top: Math.max(8, Math.min(anchor.y, innerHeight - (rows * 32 + seps * 13 + 16) - 8)) } : null
  return (
    <span ref={panel} role="menu" aria-label={label} style={{ ...at, ...(minWidth != null ? { minWidth } : null) }} onMouseDown={(e) => e.stopPropagation()}
      className={`kol-menu--folio z-50 flex min-w-[240px] flex-col rounded-[4px] border py-[6px] ${anchor ? 'fixed' : ''} ${panelClassName}`}>
      {items.map((it, i) => (it.divider ? <span key={i} className="kol-menu-rule--folio my-[6px] h-px" /> : (
        <button key={`${it.label}${i}`} type="button" role="menuitem" disabled={it.disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => { onClose?.(); it.onClick?.() }}
          className="kol-menu-row--folio flex h-[32px] items-center gap-[16px] px-[14px] text-left">
          {lead && <MenuFolioCheck checked={it.checked} />}{it.label}{it.kbd !== undefined && <span className="kol-menu-kbd--folio ml-auto">{it.kbd}</span>}
        </button>
      )))}
    </span>
  )
}

/**
 * Menu — THE menu engine (plan-2026-10-31-menu-engine W1). Every list that floats over a trigger is this: the Menu*
 * menus, Dropdown (a `fused` select), MultiSelect (columns), MenuItem (a menubar entry), ContextMenu (a point).
 *
 *   trigger   render prop `({ open, props })` — any trigger: MenuTrigger chip, a select, the ⋮, a menubar button
 *   anchor    `{ x, y }` instead of a trigger — the panel opens at a point (right-click)
 *   align     'start' | 'end' — the panel's edge flush with the trigger's
 *   fused     the panel continues the trigger: no gap, its width, top corners squared, never flips
 *   tone      nothing to pass: the trigger's resolved `--kol-tone-*` ride onto the portalled panel, so a menu in a
 *             `kol-tone-*` wrapper floats on that tone's surface
 *   closeOnSelect  false keeps the panel open while rows toggle (a multiselect)
 *   open / onOpenChange  controlled, when the caller needs the state
 *   variant   'float' — the float list; `sheet` makes it the More sheet (20 radius, 6 in)
 *   offset    the gap under the trigger (default 4; a fused panel sits at -1, a point anchor at 2 — pass one to override)
 *   variant   'kolbox' (plan-2026-11-18-kolbox-system W31.2 batch 4): kolbox's menu, its own API — see `MenuKolbox` above;
 *             it also reads `items` and a point `anchor` (Folio on kolbox, 2026-11-22) — see `MenuKolboxItems`
 *   variant   'folio' (Folio migration batch B): Folio's list, drawn in place, the host's trigger — see `MenuFolio` above
 */
export function Menu(props) {
  if (props.variant === 'kolbox') return props.items ? <MenuKolboxItems {...props} /> : <MenuKolbox {...props} />
  if (props.variant === 'folio') return <MenuFolio {...props} />
  return <MenuOn {...props} />
}

function MenuOn({
  items, trigger, anchor, align = 'start', minWidth, offset, defaultOpen = false, open: openProp, onOpenChange,
  stayOpen = false, closeOnSelect = true, fused = false, search, role = 'menu', variant, sheet = false,
  panelClassName = '', panelStyle, rootClassName, className = '', children,
}) {
  const [own, setOwn] = useState(defaultOpen)
  const controlled = openProp !== undefined
  const open = controlled ? openProp : own
  const setOpen = (v) => { if (!controlled) setOwn(v); onOpenChange?.(v) }
  const popover = usePopover({
    open,
    onOpenChange: setOpen,
    placement: anchor ? 'right-start' : align === 'end' ? 'bottom-end' : 'bottom-start',
    offset: offset ?? (fused ? -1 : anchor ? 2 : 4),
    flip: !fused,
    matchReferenceWidth: fused,
    click: !anchor,
    role,
    dismiss: stayOpen ? { outsidePress: false } : true,
  })

  /* a point anchor is a zero-size virtual rect — `setPositionReference`, never `elements.reference` (ContextMenu) */
  const { setPositionReference } = popover.refs
  useEffect(() => {
    if (!anchor) return
    const { x, y } = anchor
    setPositionReference({ getBoundingClientRect: () => ({ width: 0, height: 0, x, y, top: y, left: x, right: x, bottom: y }) })
  }, [anchor?.x, anchor?.y, setPositionReference]) // eslint-disable-line react-hooks/exhaustive-deps

  /* THE PANEL IS PORTALLED, so a tone the trigger inherits never reaches it through the cascade — copy it on open */
  const rootRef = useRef(null)
  const [ambient, setAmbient] = useState(null)
  useLayoutEffect(() => {
    if (!open || !rootRef.current) return
    const cs = getComputedStyle(rootRef.current.firstElementChild ?? rootRef.current)
    const vars = {}
    /* A FLOAT PANEL IS A FLOAT SURFACE (FloatMenuPanelInk, kol-website 2026-11-04): the theme's, as RailTrigger's card,
     * the search modal and the float Dropdown (which pins `--kol-tone-panel-bg` on its trigger) — never the trigger's
     * ground. Its rows read theme ink (fg-88, the fg-16 lift), so an inverted trigger's panel-bg painted them out. */
    for (const v of TONE_VARS) {
      if (variant === 'float' && v.startsWith('--kol-tone-panel')) continue
      const val = cs.getPropertyValue(v).trim(); if (val) vars[v] = val
    }
    setAmbient(vars)
  }, [open, variant])

  /* the wrapper takes the ref (a Button need not forward one); the trigger takes the handlers and the aria —
   * `aria-pressed` cleared, an open menu is `aria-expanded`, its fill is the trigger's `pressed` */
  return (
    <>
      {trigger && (
        <span ref={(el) => { rootRef.current = el; popover.refs.setReference(el) }} className={rootClassName ?? `inline-flex align-middle ${className}`.trim()}>
          {trigger({ open, props: { ...popover.getReferenceProps(), 'aria-pressed': undefined } })}
        </span>
      )}
      {open && (
        <PopoverPanel popover={popover} panel={false} focus={false}
          className={`kol-menu-panel${fused ? ' kol-menu-panel--fused' : ' w-max'} ${panelClass(variant, sheet)} ${panelClassName}`.replace(/\s+/g, ' ').trim()}
          style={{ ...ambient, ...(minWidth ? { minWidth } : null), ...panelStyle }}>
          {/* a row's click closes the menu (it bubbles from `[data-menu-item]`); a flyout row only toggles */}
          <div role="none" className="flex flex-col gap-[var(--kol-spacing-0-5)] min-h-0" onClick={(e) => { if (closeOnSelect && e.target.closest('[data-menu-item]')) setOpen(false) }}>
            <MenuList items={items} search={search} variant={variant}>
              {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
            </MenuList>
          </div>
        </PopoverPanel>
      )}
    </>
  )
}

/* ── the ready-made menus ── */

/**
 * MenuFilter — category rows (`groups`: `{ key, label, icon, fields: [{ key, label }], more, disabled: 'why' }` or
 * `{ divider: true }`). A group with one field is a plain row that opens it; a `more` group with 2+ fields opens a flyout
 * of them; a `more` group with none is disabled with ›; a disabled group shows its reason. `onPick({ group, field? })`.
 * `active` (`[{ key, label, group, field? }]`) — metric Round 6 (user: *"dont put this tag there, it breaks the layout"*):
 * the active filters live INSIDE the menu, an "Active" section on top (a row's click is `onPick` to edit it, its × is
 * `onRemove(f)`, "Clear all" at 2+ is `onClear`), and the trigger holds its pressed ground while any is set. No count.
 */
export function MenuFilter({ groups = [], onPick, active = [], onRemove, onClear, label = 'Filter', icon = 'filter-lines', align = 'end', minWidth = 224, variant }) {
  const items = groups.map((g) => {
    if (g.divider) return g
    const one = g.fields?.length === 1 && !g.disabled
    return {
      key: g.key, label: g.label, icon: g.icon, disabled: !!g.disabled, tooltip: g.disabled || undefined,
      trailing: g.more && g.disabled ? 'chevron-right' : undefined, trailingSize: 12,
      items: g.more && !g.disabled && !one ? g.fields.map((f) => ({ key: f.key, label: f.label, onClick: () => onPick?.({ group: g.key, field: f.key }) })) : undefined,
      onClick: () => onPick?.({ group: g.key }),
    }
  })
  const rowCls = 'kol-menu-row kol-helper-12'
  return (
    <Menu align={align} minWidth={minWidth} offset={8} items={items} variant={variant}
      trigger={({ open, props }) => <MenuTrigger open={open || active.length > 0} icon={icon} variant={variant} {...props}>{label}</MenuTrigger>}>
      {active.length > 0 && (
        <>
          <MenuLabel>Active</MenuLabel>
          {active.map((f) => (
            <div key={f.key} className="flex items-center">
              <div className="flex-1 min-w-0">
                <MenuRow rowClass={rowCls} onClick={() => onPick?.({ group: f.group, field: f.field })}>{f.label}</MenuRow>
              </div>
              <Button tone="ghost" size="xs" iconOnly="x" aria-label={`Remove filter: ${f.label}`} onClick={() => onRemove?.(f)} />
            </div>
          ))}
          {active.length > 1 && onClear && <MenuRow rowClass={rowCls} onClick={onClear}>Clear all</MenuRow>}
          <MenuDivider className="kol-menu-rule" />
        </>
      )}
    </Menu>
  )
}

/**
 * MenuDatePicker — range `groups` (`[[{ key, label, kbd }]]`, a rule between groups), `value` the current key (filled,
 * ✓), `onChange(key)` (a custom-range key is the caller's to open its dialog). `compare` (`{ label, kbd, onClick }`)
 * adds the compare row under a rule. The trigger shows `label` beside the calendar glyph (`icon` / `iconComponent`).
 * metric Round 6 (user: *"relation ship between tab and dropdown is much better at reference"* — plausible.io): the
 * trigger holds a value, so it wears its chip at rest — the tab's pressed oq-08, the panel's own ground, one family —
 * and the panel opens right-aligned 8px under it (plausible.io measured: 8px, right edges flush).
 */
export function MenuDatePicker({ groups = [], value, onChange, label, icon = 'calendar', iconComponent, compare, align = 'end', minWidth = 224, variant }) {
  const items = [
    ...groups.flatMap((g, i) => [
      ...(i > 0 ? [{ divider: true }] : []),
      ...g.map((r) => ({ key: r.key, label: r.label, current: r.key === value, indicator: r.key === value ? 'dot' : undefined, kbd: r.kbd, onClick: () => onChange?.(r.key) })),
    ]),
    ...(compare ? [{ divider: true }, { key: 'compare', label: compare.label, kbd: compare.kbd, onClick: compare.onClick }] : []),
  ]
  /* the float date chip (row 33): the value in mono on the well, the calendar glyph 16 */
  return (
    <Menu align={align} minWidth={minWidth} offset={8} items={items} variant={variant}
      trigger={({ open, props }) => <MenuTrigger open={open} icon={icon} iconComponent={iconComponent} variant={variant} mono={variant === 'float'} {...props}>{label}</MenuTrigger>} />
  )
}

/** MenuMore — the ⋮ chip and its rows (`items`, as `Menu`'s); `label` names it for a screen reader. `variant="float"` is
 *  the More sheet (row 53): the ⋮ as a float circle, the rows in a sheet on `--kol-float-menu-r`. */
export function MenuMore({ label, items = [], align = 'end', minWidth = 224, defaultOpen, stayOpen, variant }) {
  return (
    <Menu align={align} minWidth={minWidth} offset={8} items={items} defaultOpen={defaultOpen} stayOpen={stayOpen} variant={variant} sheet={variant === 'float'}
      trigger={({ open, props }) => <MenuTrigger open={open} iconOnly aria-label={label} variant={variant} {...props} />} />
  )
}
