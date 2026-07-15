import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'

export const meta = {
  title: 'Workshop sidenav',
  description: 'A workshop sidenav with collapsible sections and quick actions',
  category: 'sidenav',
}
export const stage = 'full'

/* The monorepo workshop shell's sidebar, recreated presentationally with KOL
 * primitives (kol-helper-* type, text-* roles, Icon) — no foreign shell-* chrome.
 * Router links become local state so it renders anywhere. */

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
        className="kol-helper-10 text-subtle hover:text-body w-full flex items-center justify-between pr-1 pb-3 transition-colors"
        onClick={() => setCollapsed((v) => !v)}
      >
        <span>{label}</span>
        <Icon name="chevron-down" size={10} className={`stroke-[2.5] transition-transform ${collapsed ? '' : 'rotate-180'}`} />
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
          <Section label="DOCUMENTATION">
            <div className="space-y-4">
              {GROUPS.map((group) => {
                const open = openGroups.has(group.id)
                return (
                  <div key={group.id}>
                    <button
                      type="button"
                      className="kol-helper-12 text-body hover:text-emphasis w-full flex items-center justify-between py-1.5 text-left transition-colors"
                      onClick={() => toggleGroup(group.id)}
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="chevron-right" size={12} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
                        {group.label}
                      </span>
                      <span className="kol-helper-10 text-subtle">({group.items.length})</span>
                    </button>
                    {open && (
                      <div className="mt-1 flex flex-col gap-1">
                        {group.items.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setActive(item)}
                            className={`kol-helper-12 w-full text-left py-1 pl-5 pr-3 transition-colors ${active === item ? 'text-emphasis' : 'text-body hover:text-emphasis'}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Section>

          <Section label="QUICK ACTIONS">
            <div className="space-y-1">
              <button type="button" className="kol-helper-12 text-body hover:text-emphasis w-full flex items-center gap-2 py-1 text-left transition-colors">
                <Icon name="arrow-left" size={14} />
                Back
              </button>
              <button type="button" className="kol-helper-12 text-body hover:text-emphasis w-full flex items-center gap-2 py-1 text-left transition-colors">
                <Icon name="book-open" size={14} />
                All documentation
              </button>
              <button type="button" className="kol-helper-12 text-body hover:text-emphasis w-full flex items-center gap-2 py-1 text-left transition-colors">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
