/**
 * ExitPreview — the escape hatch out of a preview surface, worn as a fixed
 * pill. Router-AGNOSTIC by the same seam kol-shell uses for navigation: it
 * renders a plain `<a>` unless the consumer hands it its router's link.
 *
 * It used to `import { Link, useLocation } from 'react-router-dom'` at module
 * level. react-router-dom is an OPTIONAL peer of this package, so that one line
 * made kol-component — and every package whose barrel touches it — unbuildable
 * for a consumer without a router (kol-client-olina, 2026-09-03). An optional
 * peer is never statically imported.
 *
 * @param {string} [to='/'] - Where exiting goes.
 * @param {React.ElementType} [linkComponent='a'] - Router link to render
 *   instead of an anchor, e.g. react-router's `Link`. Given one, `to` is passed
 *   as `to`; on the default anchor it is passed as `href`.
 *
 * @example
 *   <ExitPreview />                                  // plain anchor, hard nav
 *   <ExitPreview linkComponent={Link} />             // client-side nav
 */
export default function ExitPreview({ to = '/', linkComponent: Link = 'a' }) {
  const target = Link === 'a' ? { href: to } : { to }

  return (
    <Link {...target} className="kol-exit-preview" aria-label="Exit preview">
      <span className="kol-exit-preview-icon" aria-hidden="true">×</span>
      <span className="kol-exit-preview-label">Exit</span>
    </Link>
  )
}
