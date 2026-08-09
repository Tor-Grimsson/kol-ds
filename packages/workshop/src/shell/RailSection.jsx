import { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * RailSection — THE rail ladder. One component owns every rail header, at
 * every rung, in both rails.
 *
 * WHY IT EXISTS (user ruling 2026-08-01). The rails already had a class per
 * rung — `.shell-sidebar-toggle` (L1), `.shell-nav-group-header` (L2),
 * `.shell-nav-item` (L3) — and drifted anyway, because a class is vocabulary
 * and not grammar. Nothing declared the three a LADDER, and every affordance
 * that hangs off a rung (the count, the collapse, the chevron) was hand-typed
 * at each call site. So the right rail put its count on L1 and the left rail
 * put its count on L2, and the user had to catch it in a screenshot.
 *
 * L3 is the proof of the fix: it is the only rung a component already owned
 * (`DocsToc`), and it is the only rung that never drifted.
 *
 * THE LADDER
 *
 *   L1  section  `.shell-sidebar-toggle` + kol-doc-eyebrow    quiet, no chevron
 *   L2  group    `.shell-nav-group-header` + kol-mono-14      louder, chevron
 *
 * L2 carries NO colour class: `.shell-nav-group-header` owns weight 500 and
 * `--kol-fg-shout` itself (user ruling 2026-08-01). It used to carry
 * `text-body` — a utility that resolved to nothing at the time, and would now
 * fight the rule for the same property. One owner.
 *   L3  row      `.shell-nav-item` + kol-mono-14              leaf, DocsToc/links
 *
 * THE RULES THIS COMPONENT ENFORCES BY CONSTRUCTION
 *
 *   - A rung's class is chosen here, never at the call site. Same rung in
 *     either rail is literally the same string.
 *   - The COUNT is placed by the rung, not by the caller. You cannot put it in
 *     the wrong place because you never write the span.
 *   - No chevron at L1 (user ruling 2026-08-01) — the section still collapses
 *     and expands on click, the glyph is simply not drawn. L2 keeps its
 *     chevron: it is the rung where a caret means "there is a subtree here".
 *   - The box (padding + margin) belongs to the rung class alone. Nothing here
 *     sets y-spacing inline; see the eyebrow-box law in kol-components-workshop.css.
 *
 * `pnpm validate:rails` R4 asserts that rail headers come from here.
 *
 * @param {1|2}      level        which rung. L3 rows are links, not sections.
 * @param {string}   label        header text, rendered verbatim (casing is authored)
 * @param {number}   [count]      leaf rows this section contains — L1 counts the
 *                                whole subtree, L2 counts its own children
 * @param {string}   [to]         make the LABEL a link; the rest of the row still toggles
 * @param {boolean}  [collapsible=true]  false → a static header, no toggle, no aria
 * @param {boolean}  [collapsed]  controlled state; omit for uncontrolled
 * @param {Function} [onToggle]   required when `collapsed` is passed
 * @param {boolean}  [defaultCollapsed=false]  uncontrolled initial state
 * @param {Function} [onNavigate] click hook on the label link (close a drawer, etc.)
 * @param {Icon}     [icon]       the chevron renderer, injected — the shell package
 *                                must not reach into kol-component from here
 */
export default function RailSection({
  level = 1,
  label,
  count,
  to,
  collapsible = true,
  collapsed,
  onToggle,
  defaultCollapsed = false,
  onNavigate,
  icon: IconComponent,
  children,
}) {
  const [internal, setInternal] = useState(defaultCollapsed)
  const isControlled = collapsed !== undefined
  const isCollapsed = isControlled ? collapsed : internal
  const toggle = isControlled ? onToggle : () => setInternal((c) => !c)

  /* The rung decides the class. This is the single line that used to live at
   * four call sites in two rails, spelled differently at each. */
  const headerClass = level === 1
    ? 'shell-sidebar-toggle kol-doc-eyebrow'
    : 'shell-nav-group-header kol-mono-14'

  /* A static header is not a button and must not claim to be one. It still
   * wears the same box — `.shell-sidebar-label` shares L1's rule. */
  const staticClass = level === 1
    ? 'shell-sidebar-label kol-doc-eyebrow'
    : 'shell-nav-group-header kol-mono-14'

  /* L2 only. At L1 the caret is not drawn (user ruling) — the row is still the
   * toggle, so the affordance exists, it just isn't a glyph. */
  const chevron = level === 2 && collapsible && IconComponent ? (
    <IconComponent
      name="chevron-right"
      size={12}
      className={`transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
    />
  ) : null

  /* THE COUNT IS AN L2 AFFORDANCE (user ruling 2026-08-01): "dont list counter
   * next to eyebrow category, just inside". A category eyebrow names a body of
   * material; the tally belongs to the groups inside it, not to the label over
   * them. So L1 drops a `count` on the floor rather than rendering it — the
   * rung refuses it, so no call site can put one back. */
  const countNode = level === 2 && count !== undefined && count !== null
    ? <span className="kol-mono-14 text-subtle">({count})</span>
    : null

  const labelNode = to ? (
    /* The label navigates; the rest of the row toggles. stopPropagation keeps
     * one click from doing both. */
    <Link
      to={to}
      className={level === 1 ? 'kol-doc-eyebrow' : undefined}
      onClick={(e) => {
        e.stopPropagation()
        if (isCollapsed && toggle) toggle()
        if (onNavigate) onNavigate(e)
      }}
    >
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  )

  const inner = (
    <>
      <span className="flex items-center gap-2">
        {chevron}
        {/* L2 rows without a caret keep the caret's width as space, so an
          * expandable row and a childless one share a left edge. */}
        {level === 2 && !chevron && <span aria-hidden="true" style={{ width: 12 }} />}
        {labelNode}
      </span>
      {countNode}
    </>
  )

  if (!collapsible) {
    /* A rung with nothing to expand is not a section — it is a row that goes
     * somewhere. It used to render as a header anyway: a chevron rotating over
     * an empty body that never navigated, so "Icons" and "Components" did
     * nothing when clicked. With `to` the WHOLE row is the link (the label
     * alone would leave the rest of the row dead), and `inner` keeps the caret
     * column as space so it shares a left edge with its expandable siblings. */
    if (to) {
      return (
        <Link to={to} className={staticClass} onClick={onNavigate}>
          <span className="flex items-center gap-2">
            {level === 2 && <span aria-hidden="true" style={{ width: 12 }} />}
            {label}
          </span>
          {countNode}
        </Link>
      )
    }
    return (
      <div>
        <div className={staticClass}>{inner}</div>
        {children}
      </div>
    )
  }

  /* A div with role=button, not a <button>, because the label may be a Link —
   * an anchor inside a button is invalid markup. The keyboard handler restores
   * what the removed chevron button used to provide. */
  return (
    <div>
      <div
        className={headerClass}
        role="button"
        tabIndex={0}
        aria-expanded={!isCollapsed}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (toggle) toggle() }
        }}
      >
        {inner}
      </div>
      {!isCollapsed && children}
    </div>
  )
}
