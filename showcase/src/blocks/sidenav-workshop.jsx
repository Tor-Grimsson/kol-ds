import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-loader'

export const meta = {
  title: 'Workshop sidenav',
  description: 'A workshop sidenav with collapsible sections and quick actions',
  category: 'sidenav',
}
export const stage = 'full'

/* The monorepo workshop shell's sidebar, recreated presentationally on its own
 * shell-* chrome (workshop/shell/shell.css, loaded app-wide via the vendored
 * /workshop-preview). Router links become local state so it renders anywhere. */

const GROUPS = [
  { id: 'guides', label: 'Guides', items: ['Getting started', 'Theming', 'Publishing'] },
  { id: 'reference', label: 'Reference', items: ['Components', 'Tokens', 'Icons', 'CLI'] },
]

function Section({ label, children }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div>
      <button
        type="button"
        className="shell-sidebar-toggle shell-sidebar-label w-full"
        onClick={() => setCollapsed((v) => !v)}
        style={{ justifyContent: 'space-between', paddingRight: 4, paddingBottom: 12 }}
      >
        <span>{label}</span>
        <Icon name="stroke-chevron-down" size={10} className={`stroke-[2.5] transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
      {!collapsed && children}
    </div>
  )
}

export default function SidebarWorkshop() {
  const [active, setActive] = useState('Tokens')
  const [openGroups, setOpenGroups] = useState(() => new Set(['reference']))

  const toggleGroup = (id) => setOpenGroups((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  return (
    <div className="flex h-full min-h-0 w-full bg-surface-primary">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-fg-08 px-4 py-5 [scrollbar-width:thin]">
        <div className="space-y-10">
          <Section label="Documentation">
            <div className="space-y-4">
              {GROUPS.map((group) => {
                const open = openGroups.has(group.id)
                return (
                  <div key={group.id} className="shell-nav-group">
                    <button type="button" className="shell-nav-group-header w-full text-left" onClick={() => toggleGroup(group.id)}>
                      <span className="flex items-center gap-2">
                        <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {group.label}
                      </span>
                      <span className="shell-nav-group-count">({group.items.length})</span>
                    </button>
                    {open && (
                      <div className="shell-nav-items">
                        {group.items.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setActive(item)}
                            className={`shell-nav-item w-full text-left${active === item ? ' active' : ''}`}
                          >
                            <span className="shell-nav-item-title">{item}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Section>

          <Section label="Quick actions">
            <div className="space-y-1">
              <button className="shell-sidebar-action w-full" type="button">
                <Icon name="arrow-left" size={14} />
                Back
              </button>
              <button className="shell-sidebar-action w-full" type="button">
                <Icon name="dashboard-book-open" size={14} />
                All documentation
              </button>
              <button className="shell-sidebar-action w-full" type="button">
                <Icon name="copy" size={14} />
                Copy path
              </button>
            </div>
          </Section>
        </div>
      </aside>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center gap-3 border-b border-fg-08 px-5">
          <span className="kol-helper-12 text-meta">Reference</span>
          <Icon name="chevron-right" size={12} className="text-subtle" />
          <span className="kol-helper-12 text-emphasis">{active}</span>
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
