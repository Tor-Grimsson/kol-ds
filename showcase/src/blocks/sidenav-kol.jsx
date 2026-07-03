import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-loader'

export const meta = {
  title: 'KOL sidenav',
  description: 'The KOL app sidenav — icon hops with an expanding page tree',
  category: 'sidenav',
  featured: true,
}
export const stage = 'full'

/* The original kol-framework SideNav, recreated presentationally on the same
 * .kol-sidenav* chrome (ships in kol-framework.css). The real component is
 * router-coupled app chrome; this block swaps NavLink/scroll-spy for local
 * state so it renders anywhere. Collapse toggle + hop tree + footer intact. */

const HOPS = [
  { id: 'home', icon: 'book-open', label: 'Home' },
  {
    id: 'library', icon: 'library', label: 'Library',
    groups: [
      { label: 'Atoms', leaves: ['Button', 'Badge', 'Input', 'Slider'] },
      { label: 'Molecules', leaves: ['LabeledControl', 'PropertyInput'] },
    ],
  },
  { id: 'icons', icon: 'grid-02', label: 'Icons' },
  { id: 'foundations', icon: 'layers', label: 'Foundations' },
]

export default function SidebarNav() {
  const [activeHop, setActiveHop] = useState('library')
  const [activeLeaf, setActiveLeaf] = useState('Input')
  const [collapsed, setCollapsed] = useState(false)

  const leafCls = (active) =>
    `kol-sidenav-link kol-helper-10 block relative w-full py-[4px] text-left transition-colors duration-150 ${active ? 'is-active' : 'text-body hover:text-emphasis'}`

  return (
    <div className="flex h-full min-h-0 w-full bg-surface-primary">
      {/* ── The sidenav ─────────────────────────────────────── */}
      <aside className={`kol-sidenav relative flex h-full flex-col border-r border-fg-08 bg-surface-primary${collapsed ? ' is-collapsed' : ''}`}>
        <button
          type="button"
          className="kol-sidenav-toggle absolute top-5 right-[-12px] z-[2] w-6 h-6 inline-flex items-center justify-center bg-[var(--kol-surface-primary)] border border-[var(--kol-border-default)] rounded-full p-0 cursor-pointer kol-helper-14 transition-colors duration-150 text-meta hover:text-emphasis hover:border-fg-24"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed((v) => !v)}
        >
          <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={12} />
        </button>

        <div className="kol-sidenav-scroll flex-1 flex flex-col justify-between overflow-y-auto pt-4 pb-4 [scrollbar-width:thin]">
          <ul className="kol-sidenav-tree flex flex-col gap-[2px]">
            {HOPS.map((hop) => (
              <li key={hop.id}>
                <button
                  type="button"
                  onClick={() => setActiveHop(hop.id)}
                  className={`kol-sidenav-hop kol-helper-12 relative flex w-full items-center gap-3 py-2 pr-10 pl-6 text-left${activeHop === hop.id ? ' is-active' : ''}`}
                >
                  <span className="kol-sidenav-hop-icon inline-flex items-center justify-center w-5 h-5 shrink-0" aria-hidden="true">
                    <Icon name={hop.icon} size={16} />
                  </span>
                  <span className="kol-sidenav-hop-label flex-1 min-w-0">{hop.label}</span>
                </button>

                {activeHop === hop.id && hop.groups && (
                  <ul className="kol-sidenav-list mb-2 flex flex-col gap-2">
                    {hop.groups.map((group) => (
                      <li key={group.label}>
                        <div className="kol-sidenav-group kol-helper-10 uppercase text-subtle" style={{ paddingLeft: 56 }}>
                          {group.label}
                        </div>
                        <ul className="kol-sidenav-list">
                          {group.leaves.map((leaf) => (
                            <li key={leaf}>
                              <button
                                type="button"
                                onClick={() => setActiveLeaf(leaf)}
                                className={leafCls(activeLeaf === leaf)}
                                style={{ paddingLeft: 68, '--kol-sidenav-dot-left': '54px' }}
                              >
                                {leaf}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="kol-sidenav-footer flex items-center pl-6 pr-4 h-14 border-t border-fg-08 min-w-0">
          <span className="kol-helper-10 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
            <span className="text-body">Kolkrabbi Vinnustofa</span>
            <span className="text-meta"> · 2026</span>
          </span>
        </div>
      </aside>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center gap-3 border-b border-fg-08 px-5">
          <span className="kol-helper-12 text-meta">Library</span>
          <Icon name="chevron-right" size={12} className="text-subtle" />
          <span className="kol-helper-12 text-emphasis">{activeLeaf}</span>
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-hidden p-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-28 rounded-[var(--kol-radius-md)] border border-fg-08 bg-fg-02" />
            <div className="h-28 rounded-[var(--kol-radius-md)] border border-fg-08 bg-fg-02" />
            <div className="h-28 rounded-[var(--kol-radius-md)] border border-fg-08 bg-fg-02" />
          </div>
          <div className="flex-1 rounded-[var(--kol-radius-md)] border border-fg-08 bg-fg-02" />
        </div>
      </div>
    </div>
  )
}
