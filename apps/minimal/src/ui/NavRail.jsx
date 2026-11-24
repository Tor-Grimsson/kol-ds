import Icon from './Icon.jsx'

/* The nav rail, left, full height: 380 expanded and 48 collapsed (Labs' widths). The brand row on top, the rows under
   it; the strip on the inner edge expands and collapses it, as the real rail's grab does. */
export function NavRail({ collapsed, onToggle, brand, logomark, className = '', children }) {
  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col gap-1 border-r border-line bg-panel px-2 py-4 transition-[width] duration-200 ${collapsed ? 'w-12' : 'w-[380px]'} ${className}`}
    >
      <button
        type="button"
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        aria-expanded={!collapsed}
        onClick={onToggle}
        className="absolute inset-y-0 -right-1 z-10 w-2 cursor-col-resize outline-none hover:bg-line-strong focus-visible:bg-fg"
      />
      <div className="mb-4 flex h-8 shrink-0 items-center gap-3 overflow-hidden">
        <span className="flex w-8 shrink-0 justify-center text-fg">{logomark}</span>
        {!collapsed && <span className="truncate text-nav font-medium text-fg">{brand}</span>}
      </div>
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden">{children}</nav>
    </aside>
  )
}

/* One row: icon, label, and a chevron when it expands a list (down while expanded). `sub` is a row of that list,
   indented under it. Collapsed, the icon alone (the label is its name). */
export function NavRailRow({ icon, children, chevron = false, expanded = false, sub = false, active = false, collapsed = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? String(children) : undefined}
      aria-expanded={chevron ? expanded : undefined}
      title={collapsed ? String(children) : undefined}
      className={`flex w-full shrink-0 items-center gap-3 rounded-nav text-left outline-none focus-visible:outline-1 focus-visible:outline-fg ${sub ? 'h-7 pl-8 text-label' : 'h-9 text-nav'} ${active ? 'bg-field-hover text-fg' : 'text-fg hover:bg-field'}`}
    >
      <span className="flex w-8 shrink-0 justify-center">{icon && <Icon name={icon} size={sub ? 16 : 20} />}</span>
      {!collapsed && <span className="min-w-0 flex-1 truncate">{children}</span>}
      {!collapsed && chevron && <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={16} className="mr-2 text-muted" />}
    </button>
  )
}
