import { useLocation, Link } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-component'

/**
 * WorkshopDefaultSidebar — EXAMPLE composition. The contextual right rail:
 * given the current route it shows sibling pages, the section's repo links, and
 * quick actions. Decoupled from app singletons via props:
 *
 *   routes   — nav tree (was `WORKSHOP_ROUTES`): [{ id, label, path, children }],
 *              where a child may carry `links: { live, repo }`.
 *   basePath — mount point of the workshop (drives route matching + hrefs).
 */

const WorkshopDefaultSidebar = ({ routes = [], basePath = '/workshop' }) => {
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
    <div className="space-y-4">
      {siblings.length > 1 && (
        <div>
          <div className="shell-sidebar-label kol-helper-10 text-meta">{parentRoute.label}</div>
          <nav className="space-y-0">
            {siblings.map(child => (
              <Link
                key={child.id}
                to={`${basePath}/${child.path}`}
                className={`shell-sidebar-link block kol-mono-14 ${
                  location.pathname === `${basePath}/${child.path}` ? 'text-emphasis' : 'text-body'
                }`}
              >
                {child.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {links && (
        <div>
          <div className="shell-sidebar-label kol-helper-10 text-meta">Repository</div>
          <div className="space-y-1">
            {links.live && (
              <a href={links.live} target="_blank" rel="noopener noreferrer" className="shell-sidebar-action kol-mono-14 text-body">
                <Icon name="external-link" size={14} />
                Live site
              </a>
            )}
            {links.repo && (
              <a href={links.repo} target="_blank" rel="noopener noreferrer" className="shell-sidebar-action kol-mono-14 text-body">
                <Icon name="external-link" size={14} />
                GitHub
              </a>
            )}
          </div>
        </div>
      )}

      <div>
        <div className="shell-sidebar-label kol-helper-10 text-meta">Quick actions</div>
        <div className="space-y-1">
          <Link to={basePath} className="shell-sidebar-action kol-mono-14 text-body">
            <Icon name="layout" size={14} />
            Workshop home
          </Link>
          <button
            type="button"
            className="shell-sidebar-action kol-mono-14 text-body"
            onClick={() => navigator.clipboard.writeText(window.location.pathname)}
            title="Copy page path to clipboard"
          >
            <Icon name="copy" size={14} />
            Copy path
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkshopDefaultSidebar
