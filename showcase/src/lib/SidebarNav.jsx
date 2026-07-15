import { Link, useLocation } from 'react-router-dom'
import { SegmentedToggle } from '@kolkrabbi/kol-component'
import { groupComponents } from './registry.js'
import { useGrouping } from './grouping.jsx'

/**
 * SidebarNav — the docs navigation tree (Overview pages, Docs pages, group-by
 * toggle, component tree). ONE source for both surfaces that render it: the
 * DocLayout sidebar (≥lg) and the NavDrawer (<lg). `onNavigate` lets the
 * drawer close itself when a link is clicked.
 */

export const OVERVIEW = [
  { to: '/foundations', label: 'Foundations' },
  { to: '/foundations/color', label: 'Color' },
  { to: '/foundations/typography', label: 'Typography' },
  { to: '/icons', label: 'Icons' },
  { to: '/icons/v1', label: 'kol-icon-set-v1' },
  { to: '/components', label: 'Components' },
  { to: '/blocks', label: 'Blocks' },
  { to: '/sets', label: 'Sets' },
]

export const DOCS = [
  { to: '/docs/shell-and-layout', label: 'Shell & Layout' },
  { to: '/docs/menus', label: 'Menus' },
  { to: '/docs/loaders', label: 'Loaders' },
  { to: '/workshop-docs', label: 'Workshop shell ↗' },
]

export default function SidebarNav({ onNavigate }) {
  const { pathname } = useLocation()
  const { mode, setMode } = useGrouping()
  const linkCls = (active) =>
    `kol-sans-body-02 py-1 transition-colors ${active ? 'text-emphasis' : 'text-meta hover:text-emphasis'}`

  const group = (label, links) => (
    <div>
      <p className="kol-helper-10 uppercase tracking-widest text-meta mb-2">{label}</p>
      <nav className="flex flex-col">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={linkCls(pathname === l.to)} onClick={onNavigate}>
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  )

  return (
    <>
      {group('Overview', OVERVIEW)}
      {group('Docs', DOCS)}
      <div>
        <p className="kol-helper-10 uppercase tracking-widest text-meta mb-2">Group by</p>
        <SegmentedToggle
          ariaLabel="Group components by"
          value={mode}
          onChange={setMode}
          options={[{ value: 'function', label: 'Function' }, { value: 'atomic', label: 'Atomic' }]}
          className="w-full"
        />
      </div>
      {groupComponents(mode).map(([key, label, items]) => (
        <div key={key}>
          {group(label, items.map((c) => ({ to: `/components/${c.slug}`, label: c.name })))}
        </div>
      ))}
    </>
  )
}
