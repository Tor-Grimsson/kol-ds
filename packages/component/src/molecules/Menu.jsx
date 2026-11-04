import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import SearchInput from './SearchInput.jsx'
import { MenuRow, MenuDivider, MenuFlyout } from './MenuItem.jsx'
import { PopoverPanel, usePopover, Tooltip } from '../utilities/Popover.jsx'
import { TONE_VARS } from '../utilities/tone.js'

/**
 * The Menu* family (metric Round 4, 2026-10-31) — one family, one prefix.
 *
 *   MenuTrigger  the chip: `Button variant="tab" size="sm"`, `pressed` while open; `iconOnly` is the ⋮
 *   MenuPanel    the faint raised panel (kol-theme `.kol-menu-panel`)
 *   MenuRow · MenuDivider · MenuLabel · MenuFlyout — the parts (MenuRow / MenuFlyout / MenuDivider live in MenuItem.jsx)
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
const MORE = <Icon name="more-vertical" size={16} />

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

/* `variant="float"` the list (8) · `sheet` the More sheet (20) on it */
const panelClass = (variant, sheet) => (variant === 'float' ? `kol-menu-panel--float${sheet ? ' kol-menu-panel--sheet' : ''}` : '')

export const MenuPanel = ({ variant, sheet = false, className = '', children, ...rest }) => (
  <div className={`kol-menu-panel ${panelClass(variant, sheet)} ${className}`.replace(/\s+/g, ' ').trim()} {...rest}>{children}</div>
)

export const MenuLabel = ({ children }) => <div className="kol-menu-label kol-helper-12">{children}</div>

const glyph = (icon, size) => (typeof icon === 'string' ? <Icon name={icon} size={size} /> : icon)
/* a row's trailing marks — real icons and Kbd only (W2): `indicator` 'dot' | 'check' | 'chevron', `checked` = 'check',
 * `kbd` a key cap, `trailing` an icon name for an action (download) */
const indicatorOf = (it) => it.indicator ?? (it.checked ? 'check' : undefined)

function Rows({ items, variant }) {
  const float = variant === 'float'
  return items.map((it, i) => {
    if (it.divider) return <MenuDivider key={`d${i}`} className="kol-menu-rule" />
    if (it.heading) return <MenuLabel key={`h${i}`}>{it.heading}</MenuLabel>
    const icon = it.icon && <span className="text-oq-88 inline-flex">{glyph(it.icon, 16)}</span>
    const cls = `kol-menu-row kol-helper-12${it.current ? ' kol-menu-row--current' : ''}${it.tone === 'danger' ? ' kol-menu-row--danger' : ''}`
    const row = it.items?.length && !it.disabled ? (
      /* a float flyout is the same list, 8 off the row (row 55) */
      <MenuFlyout flyout iconLeft={icon} label={it.label} rowClass={cls} panelClassName={`kol-menu-panel ${panelClass(variant)} min-w-[200px]`.replace(/\s+/g, ' ')} panelStyle={{ marginLeft: float ? 8 : 4 }}>
        <Rows items={it.items} variant={variant} />
      </MenuFlyout>
    ) : (
      <MenuRow href={it.href} disabled={it.disabled} rowClass={cls} onClick={it.onClick} iconLeft={icon} indicator={indicatorOf(it)} kbd={it.kbd}
        shortcut={it.trailing ? <span className="text-oq-88 inline-flex">{glyph(it.trailing, it.trailingSize ?? 14)}</span> : undefined}>
        {it.label}
      </MenuRow>
    )
    const key = it.key ?? `r${i}`
    return it.tooltip
      ? <Tooltip key={key} label={it.tooltip} placement="left" triggerClassName="block w-full">{row}</Tooltip>
      : <div key={key}>{row}</div>
  })
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
 */
export function Menu({
  items, trigger, anchor, align = 'start', minWidth, offset, defaultOpen = false, open: openProp, onOpenChange,
  stayOpen = false, closeOnSelect = true, fused = false, search, role = 'menu', variant, sheet = false,
  panelClassName = '', panelStyle, rootClassName, className = '', children,
}) {
  const [own, setOwn] = useState(defaultOpen)
  const controlled = openProp !== undefined
  const open = controlled ? openProp : own
  const setOpen = (v) => { if (!controlled) setOwn(v); onOpenChange?.(v) }
  const [q, setQ] = useState('')
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
    for (const v of TONE_VARS) { const val = cs.getPropertyValue(v).trim(); if (val) vars[v] = val }
    setAmbient(vars)
  }, [open])

  let rows = items ?? []
  if (search) {
    const s = q.toLowerCase()
    rows = rows.filter((it) => it.label == null || String(it.label).toLowerCase().includes(s))
    if (!rows.some((it) => it.label != null)) rows = [...rows, { key: 'empty', label: search.empty || 'Nothing matches', disabled: true }]
  }
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
          <div role="none" className="flex flex-col min-h-0" onClick={(e) => { if (closeOnSelect && e.target.closest('[data-menu-item]')) setOpen(false) }}>
            {search && <div className="pb-1"><SearchInput variant={variant === 'float' ? 'float' : 'outline'} size="sm" value={q} onChange={(e) => setQ(e.target?.value ?? e)} onClear={() => setQ('')} placeholder={search.placeholder || 'Search'} /></div>}
            {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
            {rows.length > 0 && <Rows items={rows} variant={variant} />}
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
