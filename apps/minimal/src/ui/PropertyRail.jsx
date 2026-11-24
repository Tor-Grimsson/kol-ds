/* The property rail, right, full height: 380 expanded, 48 collapsed. A header (the title, its actions), the scrolling
   body, and the dock pinned at its foot. Collapsed, only `collapsedFoot` shows. */
export default function PropertyRail({ collapsed, title, actions, children, dock, collapsedFoot }) {
  if (collapsed) {
    return (
      <aside className="flex h-full w-12 shrink-0 flex-col justify-end border-l border-line bg-panel px-2 pb-4">
        <div className="-mx-2 mb-2 border-t border-line" />
        <div className="flex justify-center">{collapsedFoot}</div>
      </aside>
    )
  }
  return (
    <aside className="flex h-full w-[380px] shrink-0 flex-col border-l border-line bg-panel">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-5">
        <div className="flex flex-col gap-5">
          {title != null && (
            <div className="flex h-7 items-center gap-1">
              <h2 className="min-w-0 flex-1 truncate text-label font-medium text-fg">{title}</h2>
              {actions}
            </div>
          )}
          {children}
        </div>
      </div>
      {dock}
    </aside>
  )
}
