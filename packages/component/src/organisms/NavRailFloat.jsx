import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import Kbd from '../atoms/Kbd.jsx'
import TreeRow from '../molecules/TreeRow.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import { floatMotion } from '../utilities/motion.js'

/* taxonomy-ok: organism — nests TreeRow (molecule) + Kbd (atom) + Tooltip (utility) + kol-icons's Icon. */

/**
 * NavRailFloat — the float sidebar, `NavRail variant="float"` (float-everything W9 rows 122 · 127 · 128 · 131,
 * 2026-11-04 — kol-float--style 48:4015 expanded, 48:4277 rail). Its own path: none of the app rail's grab, drag or
 * width token. Two states, the rail's words — EXPANDED (280) and COLLAPSED (72):
 *
 *   expanded  the switcher row (glyph · title · ⌄, or your `switcher`) · the search capsule (`Search pages ⌘K`) · the
 *             tree: a `{ heading }` entry is a section label (`kol-float-ruler`, fg-64, as authored), an item a
 *             `TreeRow size="lg"` (40 · 18 glyph · Inter 13 · count · chevron), its `sub` rows `TreeRow size="sm"`
 *             indented under it · `footer` at the foot (kol-shell's RailDisplayControls, a theme row)
 *   collapsed 44 round slots on a 72 rail, 20 glyphs; the lit slot fg-16 with a 3 × 14 bar at the rail's edge — a
 *             section with the current page inside lights too; a heading becomes a 16 gap. Expand on top and search ·
 *             hide at the foot, on the well. Each slot names itself in the float Tooltip
 *
 * On `surface-secondary` lifted by the float shadow (`--kol-shadow-float`, the pill's and the card's — FloatRailOverlayShadowRestore,
 * 2026-11-04) at the sheet radius, 12 in, full height of its container. Nothing auto-expands: a section
 * opens by its chevron, or by `defaultExpanded`.
 *
 * @param {Array}    items          `{ heading }` | `{ icon, label, path, count?, sub?: [{ icon, label, path, count? }] }`
 * @param {string}   currentPath    the active path (exact match)
 * @param {Function} onNavigate     `(path) => void`
 * @param {boolean}  [collapsed]    the 72 rail · {Function} [onCollapsedChange]
 * @param {string}   [title] · {string} [icon='grid'] · {Function} [onSwitch]  the switcher row; `switcher` replaces it
 * @param {Function} [onSearch]     shows the search capsule (and the rail's search slot)
 * @param {Function} [onHide]       the rail's hide slot (expanded: put kol-shell's RailDisplayControls in `footer`)
 * @param {Array}    [defaultExpanded]  paths of sections open at mount
 * @param {ReactNode} [footer]
 * @param {Function} [onItemHover]  collapsed only: `(item, element)` when the pointer enters a slot, `(null, null)` when it
 *                                  leaves — the seam a hover flyout hangs off (kol-shell's RailFlyout, FloatLayout 2026-11-04)
 * @param {boolean|Object} [motion=true]  expand ↔ collapse eases the width and fades the new rows in, and the slots and rows ease
 *                                  their hover (`.kol-float-rail`, FloatActionStatesAndMotion 2026-11-04): `true` the
 *                                  `--kol-float-*` tokens · `false` none · `{ duration, ease }` per app. Hide and show are
 *                                  FloatLayout's (it holds the rail while it leaves)
 */
const isOn = (path, current) => !!path && path === current

export default function NavRailFloat({ items = [], currentPath = '', onNavigate, collapsed = false, onCollapsedChange, title, icon = 'grid', onSwitch, switcher, onSearch, onHide, defaultExpanded = [], footer, onItemHover, motion = true, className = '' }) {
  const motionStyle = floatMotion(motion).style
  const [open, setOpen] = useState(() => new Set(defaultExpanded))
  const toggle = (path) => setOpen((s) => { const n = new Set(s); n.has(path) ? n.delete(path) : n.add(path); return n })
  const go = (path) => () => onNavigate?.(path)

  if (collapsed) {
    const slot = (key, label, glyph, { on = false, well = false, onClick } = {}) => (
      <Tooltip key={key} label={label} placement="right" variant="float" asChild>
        <button type="button" aria-label={label} aria-current={on ? 'page' : undefined} onClick={onClick}
          className={`relative inline-flex size-11 shrink-0 items-center justify-center rounded-full cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] ${on ? 'bg-fg-16 text-oq-96' : well ? 'bg-[var(--kol-float-well)] text-oq-64 hover:text-oq-96' : 'text-oq-64 hover:bg-fg-08 hover:text-oq-96'}`}>
          <Icon name={glyph} size={well ? 18 : 20} />
        </button>
      </Tooltip>
    )
    return (
      <nav aria-label="Navigation" style={motionStyle} className={`kol-float-rail flex h-full w-[72px] flex-col items-center gap-1 rounded-[var(--kol-float-menu-r)] bg-surface-secondary shadow-[var(--kol-shadow-float)] py-3.5 ${className}`.trim()}>
        {onCollapsedChange && slot('expand', 'Expand', 'panel-left', { well: true, onClick: () => onCollapsedChange(false) })}
        <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-1 overflow-y-auto py-3 [scrollbar-width:none]">
          {items.map((it, i) => {
            if (it.heading) return i === 0 ? null : <span key={`h${i}`} className="h-4 shrink-0" aria-hidden />
            const on = isOn(it.path, currentPath) || !!it.sub?.some((c) => isOn(c.path, currentPath))
            return (
              <span key={it.path ?? it.label} className="relative flex w-full justify-center"
                onMouseEnter={onItemHover && ((e) => onItemHover(it, e.currentTarget))} onMouseLeave={onItemHover && (() => onItemHover(null, null))}>
                {on && <span className="absolute left-[5px] top-1/2 h-3.5 w-[3px] -translate-y-1/2 rounded-full bg-[var(--kol-surface-on-primary)]" aria-hidden />}
                {slot(it.path ?? it.label, it.label, it.icon, { on, onClick: go(it.path) })}
              </span>
            )
          })}
        </div>
        {onSearch && slot('search', 'Search pages', 'search', { well: true, onClick: onSearch })}
        {onHide && slot('hide', 'Hide', 'hamburger', { well: true, onClick: onHide })}
      </nav>
    )
  }

  return (
    <nav aria-label="Navigation" style={motionStyle} className={`kol-float-rail flex h-full w-[280px] flex-col gap-3 rounded-[var(--kol-float-menu-r)] bg-surface-secondary shadow-[var(--kol-shadow-float)] p-3 ${className}`.trim()}>
      {switcher ?? (title && (
        <button type="button" onClick={onSwitch} className="flex h-10 w-full items-center gap-2.5 rounded-[var(--kol-float-list-r)] px-2.5 text-left cursor-pointer hover:bg-fg-08 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]">
          <Icon name={icon} size={18} className="shrink-0 text-oq-96" />
          <span className="kol-float-body-lg min-w-0 flex-1 truncate text-fg-emphasis">{title}</span>
          {onSwitch && <Icon name="chevron-down" size={14} className="shrink-0 text-oq-64" />}
        </button>
      ))}
      {onSearch && (
        <button type="button" onClick={onSearch} className="flex h-[var(--kol-float-h-md)] w-full items-center gap-2.5 rounded-full bg-[var(--kol-float-well)] pl-3 pr-2 text-left cursor-pointer hover:bg-fg-08 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]">
          <Icon name="search" size={16} className="shrink-0 text-oq-64" />
          <span className="kol-float-hint min-w-0 flex-1 truncate text-fg-64">Search pages</span>
          <Kbd size="sm" icon="command">K</Kbd>
        </button>
      )}
      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto [scrollbar-width:none]">
        {items.map((it, i) => {
          if (it.heading) return <span key={`h${i}`} className={`kol-float-ruler px-2.5 pb-1 text-fg-64 ${i === 0 ? 'pt-1' : 'pt-4'}`}>{it.heading}</span>
          const kids = it.sub ?? []
          const isOpen = open.has(it.path)
          const childOn = kids.some((c) => isOn(c.path, currentPath))
          return (
            <div key={it.path ?? it.label} className="flex flex-col gap-0.5">
              <TreeRow size="lg" icon={it.icon} label={it.label} count={it.count}
                active={isOn(it.path, currentPath)} open={childOn && isOpen}
                expanded={kids.length ? isOpen : undefined} onToggle={kids.length ? () => toggle(it.path) : undefined}
                onClick={kids.length && !it.to ? () => toggle(it.path) : go(it.to ?? it.path)} />
              {isOpen && kids.map((c) => (
                <TreeRow key={c.path} size="sm" depth={1} icon={c.icon} label={c.label} count={c.count} active={isOn(c.path, currentPath)} onClick={go(c.path)} />
              ))}
            </div>
          )
        })}
      </div>
      {footer && <div className="flex shrink-0 flex-col gap-2">{footer}</div>}
    </nav>
  )
}
