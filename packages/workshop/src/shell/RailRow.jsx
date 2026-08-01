import { NavLink } from 'react-router-dom'

/**
 * RailRow — THE L3 rail row. The ladder's bottom rung, owned like the other two.
 *
 * WHY IT EXISTS (user ruling 2026-08-01). `.shell-nav-item` was a shared class
 * name and nothing more: every call site hand-wrote its own utility stack
 * around it, so ONE row idiom shipped as NINE different strings across five
 * files —
 *
 *   left tree      `shell-nav-item kol-mono-14 ${active ? … }`
 *   toc rows       `shell-nav-item block kol-mono-14 text-body transition-colors
 *                   focus-visible:ring-focus hover:text-emphasis`
 *   related rows   the same minus the focus ring
 *   quick actions  `shell-nav-item flex items-center gap-2 …`
 *
 * — and their containers disagreed too (`space-y-0` against `space-y-4` for the
 * same list). R1/R2 lock the TYPE class; nothing locked the stack. That is the
 * eyebrow-box failure exactly, one rung further down, which is why the rails
 * kept drifting after RailSection fixed L1 and L2.
 *
 * The look now lives in `.shell-nav-item` (layout, colour, hover, focus,
 * active); this component owns the markup. `validate:rails` R4 fails a
 * hand-written `shell-nav-item` anywhere but here.
 *
 * ACTIVE IS BOTH RAILS' (user ruling 2026-08-01). The left tree highlighted the
 * current page and the right rail highlighted nothing — same rung, one state.
 * `NavLink` drives it for routes; `active` drives it for hash links and
 * buttons, which react-router cannot resolve.
 *
 * @param {string}   [to]       route → NavLink, active resolved by the router
 * @param {string}   [href]     plain anchor (hash links: on-this-page)
 * @param {Function} [onClick]  no `to`/`href` → a <button>
 * @param {boolean}  [active]   forced active state (hash links, buttons)
 * @param {node}     [icon]     leading glyph
 * @param {node}     [trailing] pushed right — a count, a doc number
 * @param {boolean}  [sub]      nested depth (h3 under h2)
 */
export default function RailRow({
  to,
  href,
  onClick,
  active = false,
  icon,
  trailing,
  sub = false,
  onNavigate,
  children,
  className = '',
}) {
  /* ONE string. It is assembled here and nowhere else — that is the entire
   * point of the component. `kol-mono-14` is the rail's row ramp (R1). */
  const cls = (isActive) =>
    ['shell-nav-item', 'kol-mono-14', sub ? 'shell-nav-item-sub' : '', isActive ? 'is-active' : '', className]
      .filter(Boolean)
      .join(' ')

  const inner = (
    <>
      {icon}
      <span className="truncate">{children}</span>
      {trailing != null && <span className="shell-nav-item-trailing kol-mono-14">{trailing}</span>}
    </>
  )

  if (to) {
    return (
      <NavLink to={to} end className={({ isActive }) => cls(isActive || active)} onClick={onNavigate}>
        {inner}
      </NavLink>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls(active)} onClick={onNavigate}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" className={cls(active)} onClick={onClick}>
      {inner}
    </button>
  )
}
