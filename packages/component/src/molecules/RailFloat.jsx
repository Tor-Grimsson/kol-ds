import { useState } from 'react'
import Header from './Header.jsx'
import { floatSurfaceClass } from '../utilities/tone.js'

/* taxonomy-ok: molecule — Header (molecule) in the header slot over a body and a footer slot; the float module every float Rail is drawn on */

/**
 * RailFloat (was `FloatModule`, renamed 2026-11-12; the old name stays a deprecated alias) — the one float Rail shell (plan-2026-11-12-float-system W4.1; the user: *"why arent all rails in the same
 * shell? also the floating nav?? because it should ALSO have a collapsed state"*). Three slots on the float surface at the
 * sheet radius (plan-2026-11-12-float-rails-figma W4.1, his approved tree):
 *
 *   header  `header`, default a `Header` (the title, `actions`, expand, collapse-h, collapse-v); renders when any is given
 *   body    the children, scrolling under the header with its scrollbar hidden
 *   footer  `footer`, after the body, outside its scroll; renders only when given
 *
 * Collapsed-v is the SAME component (P14 *"EVEN THE FOLDED will get header body and footer"*): the same header, the body
 * and the footer hidden (never removed), drawn as the pill of `--kol-float-collapsed-h`, fully round, at the module's width.
 * PropertyRail (kol-shell), NavRail float and the reader's Contents draw on it. It lives in kol-component so NavRail float
 * can use it without a reverse dependency; kol-shell re-exports it (the way NavRail itself moved, ARCHITECTURE §3 2026-10-22).
 *
 * Every size is a token of the float spec (docs/documentation/04-compositions/25-float-spec.md): the width
 * `--kol-float-module-w` (`wide` `--kol-float-module-w-wide`), the radius `--kol-float-menu-r`, the rows
 * `--kol-float-module-gap` (`compact` spacing-2), the collapsed-v pill `--kol-float-collapsed-h`.
 *
 * @param {ReactNode} [header]       the header slot; unset, a Header of `title` · `head` · `actions` · the toggles
 * @param {'property'|'nav'} [headerVariant='property']  the Header's variant while open (`nav`: NavRail float's switcher,
 *                                   with `icon` and `onSwitch`); collapsed-v, the pill is always the plain title
 * @param {ReactNode} [title]        the header's title, and the collapsed pill's
 * @param {ReactNode} [kind]         the quiet second text beside the title (the preset beside the effect, W10.1)
 * @param {ReactNode} [head]         replaces the title in the open header (a consumer's own switcher)
 * @param {ReactNode} [actions]      the Header's `end`: before the toggles; not on the collapsed pill
 * @param {Function}  [onExpand]     · {Function} [onCollapseH]  the Header's expand and collapse-h; not on the collapsed pill
 * @param {boolean}   [collapsibleV] the collapse-v chevron in the header; `collapsedV` controlled, `defaultCollapsedV`
 *                                   uncontrolled, `onCollapseV(collapsedV)` on every press. Deprecated aliases: `foldable` ·
 *                                   `folded` · `defaultFolded` · `onFold`
 * @param {boolean}   [compact]      the tool Rail's rhythm: rows spacing-2 apart (default `--kol-float-module-gap`)
 * @param {boolean}   [wide]         the wide module width
 * @param {number|string} [width]    an explicit width (a phone's `100%`, a footprint token); unset, the module width
 * @param {'md'|'sm'|'none'} [inset='md']  the sheet's inset: spacing-4 · spacing-3 (a nav's) · none
 * @param {'solid'|'glass-dark'|'glass-light'} [surface='solid']
 * @param {ReactNode} [footer]       the footer slot (a status line, the tool's action)
 * @param {string}    [as='section'] the element (`nav` for NavRail float)
 * @param {string}    [className]    on the sheet · {string} [bodyClassName] on the body · {Object} [style]
 */
const INSET = { md: 'p-4', sm: 'p-3', none: '' }

export default function RailFloat({ header, headerVariant = 'property', icon, onSwitch, title, kind, head, actions, onExpand, onCollapseH, collapsibleV, collapsedV, defaultCollapsedV, onCollapseV, foldable, folded, defaultFolded, onFold, compact = false, wide = false, width, inset = 'md', surface = 'solid', footer, as: Tag = 'section', className = '', bodyClassName = '', style, 'aria-label': ariaLabel, children }) {
  const canV = collapsibleV ?? foldable ?? false
  const ctlV = collapsedV ?? folded
  const [ownV, setOwnV] = useState(defaultCollapsedV ?? defaultFolded ?? false)
  const isV = canV && (ctlV ?? ownV)
  const toggleV = () => { const next = !isV; if (ctlV === undefined) setOwnV(next); (onCollapseV ?? onFold)?.(next) }
  const w = width ?? `var(--kol-float-module-w${wide ? '-wide' : ''})`
  const label = ariaLabel ?? (typeof title === 'string' ? title : undefined)
  const gap = compact ? 'gap-2' : 'gap-[var(--kol-float-module-gap)]'
  const headerSlot = header ?? ((head || title || actions || canV || onExpand || onCollapseH) && (isV
    ? <Header variant="property" title={title} kind={kind} collapsedV onCollapseV={toggleV} />
    : <Header variant={headerVariant} icon={icon} onSwitch={onSwitch} title={head ?? title} kind={head ? undefined : kind} end={actions} onExpand={onExpand} onCollapseH={onCollapseH} onCollapseV={canV ? toggleV : undefined} />
  ))
  const shape = isV
    ? 'flex-row items-center rounded-full pl-4 pr-1.5'
    : `flex-col ${gap} rounded-[var(--kol-float-menu-r)] ${INSET[inset] ?? INSET.md}`
  return (
    <Tag data-float-module={isV ? 'collapsed' : 'open'} aria-label={label} style={{ ...style, width: w, ...(isV && { height: 'var(--kol-float-collapsed-h)' }) }}
      className={`kol-float-module kol-float-chrome flex min-h-0 ${isV ? 'shrink-0' : ''} ${shape} ${floatSurfaceClass(surface, true)} ${className}`.replace(/\s+/g, ' ').trim()}>
      {headerSlot}
      <div data-float-module-body="" hidden={isV} className={`flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] ${gap} ${bodyClassName}`.trim()}>
        {children}
      </div>
      {footer && <div data-float-module-footer="" hidden={isV} className="flex shrink-0 flex-col">{footer}</div>}
    </Tag>
  )
}
