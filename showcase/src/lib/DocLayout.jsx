import TopBar from './TopBar.jsx'
import SidebarNav from './SidebarNav.jsx'

/**
 * DocLayout — the shadcn-style doc shell shared by every docs page:
 * TopBar + unified sidebar (overview pages, then the component tree) +
 * content + on-this-page TOC. Active sidebar link derives from the path.
 * Below lg the same nav renders in TopBar's NavDrawer instead.
 *
 * `wide` mode hands layout to the children (Foundations/Icons pages own
 * their width via PageSection); default mode centres a max-w-3xl column.
 */

function DocSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-fg-08 lg:block">
      <div className="sticky top-14 flex max-h-[calc(100vh-3.5rem)] flex-col gap-6 overflow-y-auto px-5 py-8">
        <SidebarNav />
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
