import { useState } from 'react'
import Button from './Button.jsx'

/* A filled button with its menu: the press runs `onClick`, the chevron opens `items` ({ label, onPress }). */
export default function ButtonSplit({ icon, onClick, items, children, className = '' }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`relative flex min-w-0 ${className}`}>
      <Button variant="filled" icon={icon} className="min-w-0 flex-1 rounded-r-none" onClick={onClick}>{children}</Button>
      <Button variant="filled" icon="chevron-down" aria-label="More actions" aria-expanded={open} className="rounded-l-none border-l border-accent-fg/20" onClick={() => setOpen(!open)} />
      {open && (
        <div className="absolute bottom-9 left-0 z-10 flex w-56 flex-col rounded-field border border-line bg-panel p-1">
          {items.map((it) => (
            <button key={it.label} type="button" className="flex h-7 items-center rounded-inner px-2 text-left text-label text-fg hover:bg-field" onClick={() => { setOpen(false); it.onPress?.() }}>{it.label}</button>
          ))}
        </div>
      )}
    </div>
  )
}
