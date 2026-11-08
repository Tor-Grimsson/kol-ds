import { useLocation, Link } from 'react-router-dom'
import { IconLoader } from '@kolkrabbi/kol-component'
import { RailRow } from '../shell/index.js'

/**
 * WorkshopDefaultRail — EXAMPLE composition. The contextual right rail:
 * given the current route it shows sibling pages, the section's repo links, and
 * quick actions. Decoupled from app singletons via props:
 *
 *   routes   — nav tree (was `WORKSHOP_ROUTES`): [{ id, label, path, children }],
 *              where a child may carry `links: { live, repo }`.
 *   basePath — mount point of the workshop (drives route matching + hrefs).
 */

const WorkshopDefaultRail = ({ routes = [], basePath = '/workshop' }) => {
  const location = useLocation()
  const stripped = location.pathname.startsWith(basePath)
    ? location.pathname.slice(basePath.length).replace(/^\//, '')
    : location.pathname
  const firstSegment = stripped.split('/')[0]

  const parentRoute = routes.find(r => r.path === firstSegment)
  const siblings = parentRoute?.children || []
  const currentChild = siblings.find(c => `${basePath}/${c.path}` === location.pathname)
  const links = currentChild?.links

  return (
    <div className="shell-rail-stack-inner">
      {siblings.length > 1 && (
        <div>
          <div className="shell-sidebar-label kol-doc-eyebrow">{parentRoute.label}</div>
          <nav className="shell-nav-items">
            {siblings.map(child => (
              <RailRow key={child.id} to={`${basePath}/${child.path}`}>{child.label}</RailRow>
            ))}
          </nav>
        </div>
      )}

      {links && (
        <div>
          <div className="shell-sidebar-label kol-doc-eyebrow">Repository</div>
          <div>
            {links.live && (
              <RailRow href={links.live} icon={<IconLoader name="external-link" size={14} />}>Live site</RailRow>
            )}
            {links.repo && (
              <RailRow href={links.repo} icon={<IconLoader name="external-link" size={14} />}>GitHub</RailRow>
            )}
          </div>
        </div>
      )}

      <div>
        <div className="shell-sidebar-label kol-doc-eyebrow">Quick actions</div>
        <div>
          <RailRow to={basePath} icon={<IconLoader name="layout" size={14} />}>Workshop home</RailRow>
          <RailRow onClick={() => navigator.clipboard.writeText(window.location.pathname)} icon={<IconLoader name="copy" size={14} />}>Copy path</RailRow>
        </div>
      </div>
    </div>
  )
}

export default WorkshopDefaultRail
