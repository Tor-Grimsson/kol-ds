import { useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import Kbd from '../atoms/Kbd.jsx'
import TreeRow from '../molecules/TreeRow.jsx'
import RailFloat from '../molecules/RailFloat.jsx'
import { LabeledControlSection } from './SettingsPanel.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import { floatMotion } from '../utilities/motion.js'

/* taxonomy-ok: organism — nests RailFloat + TreeRow (molecules) + LabeledControlSection (organism) + Kbd (atom) + Tooltip (utility) + kol-icons's Icon. */

/**
 * NavRailFloat — the float sidebar, `NavRail variant="float"` (float-everything W9 rows 122 · 127 · 128 · 131,
 * 2026-11-04 — kol-float--style 48:4015 expanded, 48:4277 rail). Its own path: none of the app rail's grab, drag or
 * width token. Two states, the rail's words — EXPANDED (264) and COLLAPSED (72):
 *
 *   expanded  the switcher row — Header variant="nav" (glyph · title · ⌄ 12, or your `switcher`) · the search capsule (`Search pages ⌘K`) · the
 *             tree: a `{ heading }` entry opens a group, a float `LabeledControlSection` whose label is the heading
 *             (`kol-float-ruler`, fg-64, as authored) over the items under it; an item a
 *             `TreeRow size="lg"` (40 · 18 glyph · Inter 13 · count · chevron), its `sub` rows `TreeRow size="sm"`
 *             indented under it · `footer` at the foot (kol-shell's RailDisplayControls, a theme row)
 *   collapsed 44 round slots on a 72 rail, 20 glyphs; the lit slot fg-16 with a 3 × 14 bar at the rail's edge — a
 *             section with the current page inside lights too; each group is a LabeledControlSection without its
 *             label, 24 apart. Expand on top and search ·
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
 * @param {boolean} [collapsibleV]  the collapse-v chevron beside the switcher row (plan-2026-11-12-one-header W2.1): the rail
 *                                  collapses up to RailFloat's pill — `title` and ⌄ at the expanded width — apart from its
 *                                  72 collapse and its hide. `collapsedV` controlled, `defaultCollapsedV` uncontrolled,
 *                                  `onCollapseV(collapsedV)`. Deprecated aliases: `foldable` · `folded` · `defaultFolded` · `onFold`
 * @param {boolean|Object} [motion=true]  expand ↔ collapse eases the width and fades the new rows in, and the slots and rows ease
 *                                  their hover (`.kol-float-rail`, FloatActionStatesAndMotion 2026-11-04): `true` the
 *                                  `--kol-float-*` tokens · `false` none · `{ duration, ease }` per app. Hide and show are
 *                                  FloatLayout's (it holds the rail while it leaves)
 */
const isOn = (path, current) => !!path && path === current
/* the flat item list in groups: the items before the first `{ heading }`, then each heading with the items under it —
 * each group one float LabeledControlSection (plan-2026-11-12-float-rails-figma W10.1), never a loose heading */
const groupsOf = (items) => {
  const out = [{ items: [] }]
  for (const it of items) it.heading ? out.push({ heading: it.heading, items: [] }) : out[out.length - 1].items.push(it)
  return out[0].items.length ? out : out.slice(1)
}

export default function NavRailFloat({ items = [], currentPath = '', onNavigate, collapsed = false, onCollapsedChange, title, icon = 'grid', onSwitch, switcher, onSearch, onHide, defaultExpanded = [], footer, onItemHover, motion = true, collapsibleV, collapsedV, defaultCollapsedV, onCollapseV, foldable, folded, defaultFolded, onFold, className = '' }) {
  const motionStyle = floatMotion(motion).style
  const [open, setOpen] = useState(() => new Set(defaultExpanded))
  const toggle = (path) => setOpen((s) => { const n = new Set(s); n.has(path) ? n.delete(path) : n.add(path); return n })
  const go = (path) => () => onNavigate?.(path)

  if (collapsed) {
    const slot = (key, label, glyph, { on = false, well = false, onClick } = {}) => (
      <Tooltip key={key} label={label} placement="right" variant="float" asChild>
        <button type="button" aria-label={label} aria-current={on ? 'page' : undefined} onClick={onClick}
          className={`relative inline-flex size-11 shrink-0 items-center justify-center rounded-full cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] ${on ? 'bg-fg-16 text-oq-96' : well ? 'bg-[var(--kol-float-well)] text-oq-64 hover:text-oq-96' : 'text-oq-64 hover:bg-fg-08 hover:text-oq-96'}`}>
          <IconLoader name={glyph} size={well ? 18 : 20} />
        </button>
      </Tooltip>
    )
    return (
      <RailFloat as="nav" aria-label="Navigation" inset="none" width="var(--kol-shell-float-rail-width, 72px)" style={motionStyle} bodyClassName="items-center !gap-1"
        className={`kol-float-rail h-full !gap-1 items-center py-3.5 ${className}`.trim()}>
        {onCollapsedChange && slot('expand', 'Expand', 'panel-left', { well: true, onClick: () => onCollapsedChange(false) })}
        <div className="flex min-h-0 w-full flex-1 flex-col gap-6 overflow-y-auto py-3 [scrollbar-width:none]">
          {groupsOf(items).map((g, gi) => (
            <LabeledControlSection key={gi} variant="float" rowGap={1} className="w-full">
              {g.items.map((it) => {
                const on = isOn(it.path, currentPath) || !!it.sub?.some((c) => isOn(c.path, currentPath))
                return (
                  <span key={it.path ?? it.label} className="relative flex w-full justify-center"
                    onMouseEnter={onItemHover && ((e) => onItemHover(it, e.currentTarget))} onMouseLeave={onItemHover && (() => onItemHover(null, null))}>
                    {on && <span className="absolute left-[5px] top-1/2 h-3.5 w-[3px] -translate-y-1/2 rounded-full bg-[var(--kol-surface-on-primary)]" aria-hidden />}
                    {slot(it.path ?? it.label, it.label, it.icon, { on, onClick: go(it.path) })}
                  </span>
                )
              })}
            </LabeledControlSection>
          ))}
        </div>
        {onSearch && slot('search', 'Search pages', 'search', { well: true, onClick: onSearch })}
        {onHide && slot('hide', 'Hide', 'hamburger', { well: true, onClick: onHide })}
      </RailFloat>
    )
  }

  return (
    <RailFloat as="nav" aria-label="Navigation" inset="sm" width="var(--kol-shell-float-rail-open, 264px)" style={motionStyle}
      headerVariant="nav" icon={icon} onSwitch={onSwitch} title={title} head={switcher}
      collapsibleV={collapsibleV ?? foldable} collapsedV={collapsedV ?? folded} defaultCollapsedV={defaultCollapsedV ?? defaultFolded} onCollapseV={onCollapseV ?? onFold}
      bodyClassName="!gap-3" className={`kol-float-rail h-full !gap-3 ${className}`.trim()}
      footer={footer && <div className="flex shrink-0 flex-col gap-2">{footer}</div>}>
      {onSearch && (
        <button type="button" onClick={onSearch} className="flex h-[var(--kol-float-h-md)] w-full items-center gap-2.5 rounded-full bg-[var(--kol-float-well)] px-3 text-left cursor-pointer hover:bg-fg-08 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]">
          <IconLoader name="search" size={16} className="shrink-0 text-oq-64" />
          <span className="kol-float-hint min-w-0 flex-1 truncate text-fg-64">Search pages</span>
          <Kbd size="sm" icon="command">K</Kbd>
        </button>
      )}
      <div className="flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto [scrollbar-width:none]">
        {groupsOf(items).map((g, gi) => (
          <LabeledControlSection key={gi} variant="float" gap={1.5} rowGap={0.5} className={gi === 0 && g.heading ? 'pt-1' : ''}
            label={g.heading && <span className="kol-float-ruler px-2.5 text-fg-64">{g.heading}</span>}>
            {g.items.map((it) => {
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
          </LabeledControlSection>
        ))}
      </div>
    </RailFloat>
  )
}
