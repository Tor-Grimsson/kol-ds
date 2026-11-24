import Icon from './Icon.jsx'

/* The sidebar's parts, round 1's look (the minimal-labs frame): a header block, a group label, item rows, the sub list
   behind its hairline, footer rows. `collapsed` draws the icon alone (the label is its name). */
export function SidebarHeader({ logomark, title, collapsed = false }) {
  return (
    <div className={`flex items-center gap-2 ${collapsed ? 'justify-center px-2 py-4' : 'p-4'}`}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-nav bg-accent text-accent-fg">{logomark}</span>
      {!collapsed && <span className="min-w-0 flex-1 truncate text-nav font-medium text-fg">{title}</span>}
    </div>
  )
}

export function SidebarGroupLabel({ children }) {
  return <div className="flex h-8 shrink-0 items-center px-2 text-label font-medium text-muted">{children}</div>
}

/* `open` draws the chevron (down while open); leave it undefined for a row with no list */
export function SidebarItem({ icon, children, open, active = false, collapsed = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? String(children) : undefined}
      aria-expanded={open}
      title={collapsed ? String(children) : undefined}
      className={`flex h-8 w-full shrink-0 items-center gap-2 rounded-nav p-2 text-left text-nav text-fg outline-none focus-visible:outline-1 focus-visible:outline-fg ${collapsed ? 'justify-center' : ''} ${active ? 'bg-field-hover' : 'hover:bg-field'}`}
    >
      {icon && <Icon name={icon} />}
      {!collapsed && <span className="flex-1 truncate">{children}</span>}
      {!collapsed && open !== undefined && <Icon name={open ? 'chevron-down' : 'chevron-right'} size={12} className="text-muted" />}
    </button>
  )
}

export function SidebarSub({ children }) {
  return <div className="ml-[15px] flex flex-col border-l border-line py-0.5 pl-2">{children}</div>
}

export function SidebarSubItem({ children, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex h-7 shrink-0 items-center rounded-nav px-2 text-left text-nav outline-none focus-visible:outline-1 focus-visible:outline-fg ${active ? 'bg-field-hover text-fg' : 'text-muted hover:bg-field hover:text-fg'}`}
    >
      <span className="truncate">{children}</span>
    </button>
  )
}
