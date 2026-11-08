import { useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import SearchInput from './SearchInput.jsx'
import { MenuRow, MenuDivider, MenuFlyout } from './MenuItem.jsx'
import { Tooltip } from '../utilities/Popover.jsx'

/**
 * MenuList — THE rows of every menu (plan-2026-11-07-menu-system W1.1). `Menu`, `Dropdown` and `ContextMenu` (through
 * `Menu`) render it inside their PopoverPanel; nothing else maps rows. It is the list only — no panel, no trigger.
 *
 *   <MenuList variant="float" search={{ placeholder: 'Find' }} items={[
 *     { heading: 'Graph interval' },                         // a MenuLabel
 *     { label: 'Days', current: true, indicator: 'dot', onClick },
 *     { divider: true },                                     // a MenuDivider
 *     { label: 'Browser', icon: 'layout', items: [...] },    // a flyout of the same rows
 *   ]} />
 *
 *   items     rows as data — the row keys `Menu` documents: `label` · `icon` · `trailing` (+ `trailingSize`) · `current`
 *             · `indicator` 'dot' | 'check' | 'chevron' · `checked` · `kbd` · `disabled` + `tooltip` · `tone: 'danger'`
 *             · `href` · `onClick` · `items` (a flyout) · `key`. A row may also carry MenuRow's own `rowClass` · `hover`
 *             · `size` · `height` · `shortcut` · `prefix` · `onPointerEnter` / `onPointerLeave` (Dropdown's rows do).
 *   search    `{ placeholder, empty }` — a search field above the rows that filters them by label
 *   children  sit above the rows (under the search)
 *   variant   'float' the float list's rows and flyouts · 'sheet' the More sheet's (the same rows)
 *   dividerClassName  the rule's class, whole (default `kol-menu-rule` — the panel's edge-to-edge rule)
 *   headingClassName  the heading's class, whole (default the MenuLabel's)
 */

/* `variant="float"` the list (8) · `sheet` the More sheet (20) on it */
export const panelClass = (variant, sheet) => (variant === 'float' ? `kol-menu-panel--float${sheet ? ' kol-menu-panel--sheet' : ''}` : '')

export const MenuLabel = ({ className = 'kol-menu-label kol-helper-12', children }) => <div className={className}>{children}</div>

const glyph = (icon, size) => (typeof icon === 'string' ? <IconLoader name={icon} size={size} /> : icon)
/* a row's trailing marks — real icons and Kbd only (W2): `indicator` 'dot' | 'check' | 'chevron', `checked` = 'check',
 * `kbd` a key cap, `trailing` an icon name for an action (download) */
const indicatorOf = (it) => it.indicator ?? (it.checked ? 'check' : undefined)

export function MenuList({ items = [], search, variant, dividerClassName = 'kol-menu-rule', headingClassName, children }) {
  const float = variant === 'float' || variant === 'sheet'
  const [q, setQ] = useState('')
  let rows = items
  if (search) {
    const s = q.toLowerCase()
    rows = rows.filter((it) => it.label == null || String(it.label).toLowerCase().includes(s))
    if (!rows.some((it) => it.label != null)) rows = [...rows, { key: 'empty', label: search.empty || 'Nothing matches', disabled: true }]
  }
  return (
    <>
      {search && <div className="pb-1"><SearchInput variant={float ? 'float' : 'outline'} size="sm" value={q} onChange={(e) => setQ(e.target?.value ?? e)} onClear={() => setQ('')} placeholder={search.placeholder || 'Search'} /></div>}
      {children}
      {rows.map((it, i) => {
        if (it.divider) return <MenuDivider key={it.key ?? `d${i}`} className={dividerClassName} />
        if (it.heading) return <MenuLabel key={it.key ?? `h${i}`} className={headingClassName}>{it.heading}</MenuLabel>
        const icon = it.icon && <span className="text-oq-88 inline-flex">{glyph(it.icon, 16)}</span>
        const cls = it.rowClass ?? `kol-menu-row kol-helper-12${it.current ? ' kol-menu-row--current' : ''}${it.tone === 'danger' ? ' kol-menu-row--danger' : ''}`
        const row = it.items?.length && !it.disabled ? (
          /* a float flyout is the same list, 8 off the row (row 55) */
          <MenuFlyout flyout iconLeft={icon} label={it.label} rowClass={cls} panelClassName={`kol-menu-panel ${float ? 'kol-menu-panel--float' : ''} min-w-[200px]`.replace(/\s+/g, ' ')} panelStyle={{ marginLeft: float ? 8 : 4 }}>
            <MenuList items={it.items} variant={variant} dividerClassName={dividerClassName} headingClassName={headingClassName} />
          </MenuFlyout>
        ) : (
          <MenuRow href={it.href} disabled={it.disabled} rowClass={cls} onClick={it.onClick} iconLeft={icon} prefix={it.prefix}
            indicator={indicatorOf(it)} kbd={it.kbd} hover={it.hover} size={it.size} height={it.height}
            onPointerEnter={it.onPointerEnter} onPointerLeave={it.onPointerLeave}
            shortcut={it.shortcut ?? (it.trailing ? <span className="text-oq-88 inline-flex">{glyph(it.trailing, it.trailingSize ?? 14)}</span> : undefined)}>
            {it.label}
          </MenuRow>
        )
        const key = it.key ?? `r${i}`
        return it.tooltip
          ? <Tooltip key={key} label={it.tooltip} placement="left" triggerClassName="block w-full">{row}</Tooltip>
          : <div key={key}>{row}</div>
      })}
    </>
  )
}

export default MenuList
