import { Link, useLocation } from 'react-router-dom'
import TopBar from './TopBar.jsx'
import { componentsByCategory, CATEGORY_LABELS } from './registry.js'

/**
 * DocLayout — the shadcn-style doc shell shared by every docs page:
 * TopBar + unified sidebar (overview pages, then the component tree) +
 * content + on-this-page TOC. Active sidebar link derives from the path.
 *
 * `wide` mode hands layout to the children (Foundations/Icons pages own
 * their width via PageSection); default mode centres a max-w-3xl column.
 */

const OVERVIEW = [
  { to: '/foundations', label: 'Foundations' },
  { to: '/foundations/color', label: 'Color' },
  { to: '/foundations/typography', label: 'Typography' },
  { to: '/icons', label: 'Icons' },
  { to: '/icons/variants', label: 'Icon variants' },
  { to: '/components', label: 'Components' },
  { to: '/blocks', label: 'Blocks' },
]

const DOCS = [
  { to: '/docs/shell-and-layout', label: 'Shell & Layout' },
  { to: '/docs/menus', label: 'Menus' },
  { to: '/docs/loaders', label: 'Loaders' },
  { to: '/workshop-preview', label: 'Workshop shell ↗' },
]

/* Components grouped by type (atoms/molecules/…), A→Z within each group —
 * a new component's location is fixed: its type group, alphabetical slot.
 * Function tags stay filter metadata on the index. */
function DocSidebar() {
  const { pathname } = useLocation()
  const linkCls = (active) =>
    `kol-sans-body-02 py-1 transition-colors ${active ? 'text-emphasis' : 'text-meta hover:text-emphasis'}`

  const group = (label, links) => (
    <div>
      <p className="kol-helper-10 uppercase tracking-widest text-meta mb-2">{label}</p>
      <nav className="flex flex-col">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={linkCls(pathname === l.to)}>
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  )

  return (
    <aside className="hidden w-56 shrink-0 border-r border-fg-08 lg:block">
      <div className="sticky top-14 flex max-h-[calc(100vh-3.5rem)] flex-col gap-6 overflow-y-auto px-5 py-8">
        {group('Overview', OVERVIEW)}
        {group('Docs', DOCS)}
        {componentsByCategory().map(([cat, items]) => (
          <div key={cat}>
            {group(CATEGORY_LABELS[cat] ?? cat, items.map((c) => ({ to: `/components/${c.slug}`, label: c.name })))}
          </div>
        ))}
      </div>
    </aside>
  )
}

/* The rail is ALWAYS reserved (even with no items) so the main column never
 * shifts between pages that have a TOC and pages that don't. */
function Toc({ items }) {
  return (
    <aside className="hidden w-56 shrink-0 py-12 pr-8 xl:block">
      {items?.length > 0 && (
        <div className="sticky top-20">
          <p className="kol-helper-10 uppercase tracking-widest text-meta mb-3">On this page</p>
          <nav className="flex flex-col gap-2">
            {items.map((t) => (
              <a key={t.id} href={`#${t.id}`} className={`kol-mono-12 text-meta hover:text-emphasis transition-colors ${t.sub ? 'pl-3' : ''}`}>
                {t.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </aside>
  )
}

export default function DocLayout({ toc, wide = false, children }) {
  return (
    <div>
      <TopBar />
      <div className="flex">
        <DocSidebar />
        <div className="flex min-w-0 flex-1">
          {/* One column system for every page: same padding, same header
              position; `wide` only raises the width cap. */}
          <div className="flex min-w-0 flex-1 justify-center px-8 py-12 lg:px-12">
            <main className={`flex w-full min-w-0 flex-col gap-10 ${wide ? 'max-w-5xl' : 'max-w-3xl'}`}>
              {children}
            </main>
          </div>
          <Toc items={toc} />
        </div>
      </div>
    </div>
  )
}
