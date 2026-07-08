import { useState } from 'react'
import { Input } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

export const meta = {
  title: 'Documentation sidenav',
  description: 'A docs sidenav with grouped navigation and search',
  category: 'sidenav',
  featured: true,
}
export const stage = 'full'

/* Self-contained: local active state, no router — so it renders anywhere (the
 * real SideNav is router-coupled app chrome and can't stand alone). Uses KOL
 * type + surface tokens throughout. No self-frame: the block fills its
 * container (the viewer iframe, or the viewport on /blocks/preview/:slug),
 * so standalone it reads as product UI, not a boxed preview. */
const NAV = [
  { group: 'Getting Started', items: ['Installation', 'Project Structure'] },
  { group: 'Build Your Application', items: ['Routing', 'Data Fetching', 'Rendering', 'Caching', 'Styling', 'Optimizing', 'Configuring'] },
  { group: 'API Reference', items: ['Components', 'File Conventions', 'Functions', 'CLI'] },
]

function Skeleton({ className = '' }) {
  return <div className={`rounded-[var(--kol-radius-md)] border border-fg-08 bg-fg-02 ${className}`} />
}

export default function SidebarDocs() {
  const [active, setActive] = useState('Data Fetching')

  return (
    <div className="flex h-full min-h-0 w-full bg-surface-primary">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-fg-08">
        <div className="flex items-center gap-3 px-4 py-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--kol-radius-md)] bg-fg-08 text-emphasis">
            <Icon name="book-open" size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="kol-sans-body-02 truncate text-emphasis">Documentation</p>
            <p className="kol-helper-10 text-meta">v1.0.1</p>
          </div>
          <Icon name="chevron-expanded" size={14} className="text-meta" />
        </div>
        <div className="px-3 pb-2">
          <Input variant="filled" size="sm" iconLeft="search" placeholder="Search the docs…" />
        </div>
        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-3 [scrollbar-width:thin]">
          {NAV.map((section) => (
            <div key={section.group} className="flex flex-col gap-1">
              <p className="kol-helper-10 uppercase tracking-widest text-meta px-2 pb-1">{section.group}</p>
              {section.items.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActive(item)}
                  className={`rounded-[var(--kol-radius-sm)] px-2 py-1.5 text-left kol-sans-body-02 transition-colors ${active === item ? 'bg-fg-08 text-emphasis' : 'text-meta hover:bg-fg-04 hover:text-emphasis'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center gap-3 border-b border-fg-08 px-5">
          <Icon name="sidebar" size={16} className="text-meta" />
          <span className="kol-helper-12 text-meta">Build Your Application</span>
          <Icon name="chevron-right" size={12} className="text-subtle" />
          <span className="kol-helper-12 text-emphasis">{active}</span>
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-hidden p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <Skeleton className="flex-1" />
        </div>
      </div>
    </div>
  )
}
