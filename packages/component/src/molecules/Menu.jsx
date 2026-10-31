import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import Kbd from '../atoms/Kbd.jsx'
import SearchInput from './SearchInput.jsx'
import { MenuRow, MenuDivider, MenuFlyout } from './MenuItem.jsx'
import { PopoverPanel, usePopover, Tooltip } from '../utilities/Popover.jsx'

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
 *   row keys: `icon` (kol-icons name or node) · `trailing` (+ `trailingSize`) · `current` fills the row · `checked` ✓
 *   (before the `kbd` cap) · `kbd` · `disabled` + `tooltip` (why) · `items` (a flyout of the same rows).
 *   `search` ({ placeholder, empty }) puts a search field above the rows and filters them by label.
 *   `children` sit above the rows.
 */

/* the ⋮ — kol-icons `more-vertical` (user 2026-10-31: *"just make a vertical version"* — was `more` turned 90°) */
const MORE = <Icon name="more-vertical" size={16} />

export function MenuTrigger({ open = false, iconOnly, icon, iconComponent, children, ...rest }) {
  if (iconOnly) {
    return <Button variant="tab" size="sm" pressed={open} iconOnly={iconOnly === true ? 'more-vertical' : iconOnly} iconComponent={iconOnly === true ? MORE : iconComponent} {...rest} className={`kol-menu-trigger ${rest.className ?? ''}`.trim()} />
  }
  /* a labelled trigger has NO hover wash — its ground shows only while its menu is open (user 2026-10-31, on Plausible:
   * *"its not supposed to be solid, only bg on hover … no hover just click … only [...] has hover"*); the ⋮ keeps it */
  return <Button variant="tab" size="sm" pressed={open} iconLeft={icon} iconComponent={iconComponent} {...rest} className={`kol-menu-trigger kol-menu-trigger--quiet ${rest.className ?? ''}`.trim()}>{children}</Button>
}

export const MenuPanel = ({ className = '', children, ...rest }) => (
  <div className={`kol-menu-panel ${className}`.trim()} {...rest}>{children}</div>
)

export const MenuLabel = ({ children }) => <div className="kol-menu-label kol-helper-12">{children}</div>

const glyph = (icon, size) => (typeof icon === 'string' ? <Icon name={icon} size={size} /> : icon)
const Check = () => <Icon name="check" size={14} className="text-oq-88" />

function trailingOf(it) {
  if (it.kbd != null) {
    return (
      <span className="inline-flex items-center gap-2">
        {it.checked && <Check />}
        <Kbd size="md" className="kol-menu-kbd">{it.kbd}</Kbd>
      </span>
    )
  }
  if (it.checked) return <Check />
  return it.trailing ? <span className="text-oq-88 inline-flex">{glyph(it.trailing, it.trailingSize ?? 14)}</span> : undefined
}

function Rows({ items }) {
  return items.map((it, i) => {
    if (it.divider) return <MenuDivider key={`d${i}`} className="kol-menu-rule" />
    if (it.heading) return <MenuLabel key={`h${i}`}>{it.heading}</MenuLabel>
    const icon = it.icon && <span className="text-oq-88 inline-flex">{glyph(it.icon, 16)}</span>
    const cls = `kol-menu-row kol-helper-12${it.current ? ' kol-menu-row--current' : ''}`
    const row = it.items?.length && !it.disabled ? (
      <MenuFlyout flyout iconLeft={icon} label={it.label} rowClass={cls} panelClassName="kol-menu-panel min-w-[200px]" panelStyle={{ marginLeft: 4 }}>
        <Rows items={it.items} />
      </MenuFlyout>
    ) : (
      <MenuRow href={it.href} disabled={it.disabled} rowClass={cls} onClick={it.onClick} iconLeft={icon} shortcut={trailingOf(it)}>
        {it.label}
      </MenuRow>
    )
    const key = it.key ?? `r${i}`
    return it.tooltip
      ? <Tooltip key={key} label={it.tooltip} placement="left" triggerClassName="block w-full">{row}</Tooltip>
      : <div key={key}>{row}</div>
  })
}

export function Menu({ items = [], trigger, align = 'start', minWidth, offset = 4, defaultOpen = false, stayOpen = false, search, className = '', children }) {
  const [open, setOpen] = useState(defaultOpen)
  const [q, setQ] = useState('')
  const popover = usePopover({
    open,
    onOpenChange: setOpen,
    placement: align === 'end' ? 'bottom-end' : 'bottom-start',
    offset,
    role: 'menu',
    dismiss: stayOpen ? { outsidePress: false } : true,
  })
  let rows = items
  if (search) {
    const s = q.toLowerCase()
    rows = items.filter((it) => it.label == null || String(it.label).toLowerCase().includes(s))
    if (!rows.some((it) => it.label != null)) rows = [...rows, { key: 'empty', label: search.empty || 'Nothing matches', disabled: true }]
  }
  /* the wrapper takes the ref (a Button need not forward one); the trigger takes the handlers and the aria —
   * `aria-pressed` cleared, an open menu is `aria-expanded`, its fill is the trigger's `pressed` */
  return (
    <>
      <span ref={popover.refs.setReference} className={`inline-flex align-middle ${className}`.trim()}>
        {trigger({ open, props: { ...popover.getReferenceProps(), 'aria-pressed': undefined } })}
      </span>
      <PopoverPanel popover={popover} panel={false} focus={false} className="kol-menu-panel w-max" style={minWidth ? { minWidth } : undefined}>
        {/* a row's click closes the menu (it bubbles from `[data-menu-item]`); a flyout row only toggles */}
        <div onClick={(e) => { if (e.target.closest('[data-menu-item]')) setOpen(false) }}>
          {search && <div className="pb-1"><SearchInput variant="outline" size="sm" value={q} onChange={(e) => setQ(e.target?.value ?? e)} onClear={() => setQ('')} placeholder={search.placeholder || 'Search'} /></div>}
          {children}
          <Rows items={rows} />
        </div>
      </PopoverPanel>
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
export function MenuFilter({ groups = [], onPick, active = [], onRemove, onClear, label = 'Filter', icon = 'filter-lines', align = 'end', minWidth = 224 }) {
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
    <Menu align={align} minWidth={minWidth} offset={8} items={items}
      trigger={({ open, props }) => <MenuTrigger open={open || active.length > 0} icon={icon} {...props}>{label}</MenuTrigger>}>
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
export function MenuDatePicker({ groups = [], value, onChange, label, icon = 'calendar', iconComponent, compare, align = 'end', minWidth = 224 }) {
  const items = [
    ...groups.flatMap((g, i) => [
      ...(i > 0 ? [{ divider: true }] : []),
      ...g.map((r) => ({ key: r.key, label: r.label, current: r.key === value, checked: r.key === value, kbd: r.kbd, onClick: () => onChange?.(r.key) })),
    ]),
    ...(compare ? [{ divider: true }, { key: 'compare', label: compare.label, kbd: compare.kbd, onClick: compare.onClick }] : []),
  ]
  return (
    <Menu align={align} minWidth={minWidth} offset={8} items={items}
      trigger={({ open, props }) => <MenuTrigger open={open} icon={icon} iconComponent={iconComponent} {...props}>{label}</MenuTrigger>} />
  )
}

/** MenuMore — the ⋮ chip and its rows (`items`, as `Menu`'s); `label` names it for a screen reader. */
export function MenuMore({ label, items = [], align = 'end', minWidth = 224, defaultOpen, stayOpen }) {
  return (
    <Menu align={align} minWidth={minWidth} offset={8} items={items} defaultOpen={defaultOpen} stayOpen={stayOpen}
      trigger={({ open, props }) => <MenuTrigger open={open} iconOnly aria-label={label} {...props} />} />
  )
}
