import { Link, useNavigate } from 'react-router-dom'
import { DocsToc, Icon } from '@kolkrabbi/kol-component'
import RailSection from '../shell/RailSection.jsx'
import RailRow from '../shell/RailRow.jsx'

/**
 * ExhibitSidebar — the rail block an exhibit page registers into the shell's
 * TOC slot: on-this-page, the section's documentation links, and quick actions.
 * Recreated from kol-website's local `WorkshopSidebarContent`.
 *
 * THE DRIFT FIXED ON RECREATION. The source hand-rolled its own collapsible
 * section: `.shell-sidebar-toggle` AND `.shell-sidebar-label` stacked on one
 * element, inline `paddingRight`/`paddingBottom`/`justifyContent`, and its own
 * chevron at L1. Every one of those is something RailSection exists to prevent
 * — the eyebrow-box law in kol-components-workshop.css says an eyebrow wears
 * ONE box class and sets no y-spacing inline, and the 2026-08-01 ruling says L1
 * draws no chevron (it still collapses; the glyph is simply not there). The
 * rungs come from RailSection now, so this block cannot drift from either rail.
 * `pnpm validate:rails` R3 + R4 assert both halves.
 *
 * Router-agnostic in the same way as WorkshopSidebar: hrefs are built from
 * `basePath`/`docHref`, never from an app singleton.
 *
 * @param {Array}  [sections] on-this-page entries for DocsToc: [{ id, title, level }]
 * @param {Array}  [links]    documentation links: [{ id, label }]
 * @param {string} [basePath] workshop mount point — drives the quick-action hrefs
 * @param {Function} [docHref] `(id) => url`; omit for `${basePath}/docs/${id}`
 * @param {boolean} [actions=true] render the quick-actions rung
 */
export default function ExhibitSidebar({
  sections = [],
  links = [],
  basePath = '/workshop',
  docHref = (id) => (id ? `${basePath}/docs/${id}` : `${basePath}/docs`),
  actions = true,
}) {
  const navigate = useNavigate()

  return (
    <div className="shell-rail-stack-inner">
      {sections.length > 0 && (
        <RailSection level={1} label="On this page" icon={Icon}>
          <DocsToc toc={sections} />
        </RailSection>
      )}

      {links.length > 0 && (
        <RailSection level={1} label="Documentation" icon={Icon}>
          <nav className="shell-nav-items">
            {links.map(({ id, label }) => (
              <RailRow key={id} to={docHref(id)}>
                {label}
              </RailRow>
            ))}
          </nav>
        </RailSection>
      )}

      {actions && (
        <RailSection level={1} label="Quick actions" icon={Icon}>
          <div className="space-y-1">
            <button
              type="button"
              className="shell-sidebar-action kol-mono-14 text-body"
              onClick={() => navigate(-1)}
            >
              <Icon name="arrow-left" size={14} />
              Back
            </button>
            <Link to={docHref()} className="shell-sidebar-action kol-mono-14 text-body">
              <Icon name="book-open" size={14} className="text-oq-64" />
              All documentation
            </Link>
            <Link to={basePath} className="shell-sidebar-action kol-mono-14 text-body">
              <Icon name="layout" size={14} className="text-oq-64" />
              Workshop home
            </Link>
            <button
              type="button"
              className="shell-sidebar-action kol-mono-14 text-body"
              onClick={() => navigator.clipboard?.writeText(window.location.pathname)}
              title="Copy page path to clipboard"
            >
              <Icon name="copy" size={14} />
              Copy path
            </button>
          </div>
        </RailSection>
      )}
    </div>
  )
}
