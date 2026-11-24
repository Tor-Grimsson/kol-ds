export function Toolbar({ children, className = '' }) {
  return <div className={`flex h-10 items-center gap-1 rounded-bar border border-line bg-panel px-1.5 ${className}`}>{children}</div>
}

export function ToolbarDivider() {
  return <span className="mx-1 h-4 w-px bg-line" />
}
