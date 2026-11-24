import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

/* A button over a fold of related choices (the tools' and the action band's split buttons): the press runs the shown
   choice, the corner mark opens the fold beside it (to the right in a column, below in a row). The shown choice is the
   active one when it is in the fold, else the last picked. `variants`: { id, label, icon, shortcut, disabled }. */
export default function ButtonFold({ variants, activeId, onSelect, disabled, place = 'right' }) {
  const inFold = variants.find((v) => v.id === activeId)
  const [last, setLast] = useState(variants[0].id)
  const shown = inFold ?? variants.find((v) => v.id === last) ?? variants[0]
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const away = (e) => { if (!root.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])
  const pick = (v) => { setLast(v.id); setOpen(false); onSelect(v.id) }
  const many = variants.length > 1
  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label={shown.label}
        title={shown.shortcut ? `${shown.label} (${shown.shortcut})` : shown.label}
        aria-pressed={!!inFold}
        disabled={disabled}
        onClick={() => onSelect(shown.id)}
        onContextMenu={(e) => { if (many) { e.preventDefault(); setOpen(true) } }}
        className={`flex size-7 items-center justify-center rounded-full outline-none focus-visible:outline-1 focus-visible:outline-fg disabled:opacity-40 ${inFold ? 'bg-field-hover text-fg' : 'text-muted hover:bg-field hover:text-fg'}`}
      >
        <Icon name={shown.icon} />
      </button>
      {many && (
        <span
          role="button"
          tabIndex={0}
          aria-label={`More ${shown.label.toLowerCase()} choices`}
          onClick={() => setOpen(!open)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open) } }}
          className="absolute right-0.5 bottom-0.5 size-1.5 cursor-pointer bg-faint [clip-path:polygon(100%_0,100%_100%,0_100%)] hover:bg-fg"
        />
      )}
      {open && (
        <div role="menu" className={`absolute z-50 flex w-[200px] flex-col rounded-field border border-line bg-panel p-1 ${place === 'right' ? 'top-0 left-full ml-2' : 'top-full left-0 mt-2'}`}>
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              role="menuitem"
              disabled={v.disabled}
              onClick={() => pick(v)}
              className={`flex h-7 items-center gap-2 rounded-inner px-2 text-left text-label outline-none hover:bg-field focus-visible:bg-field disabled:pointer-events-none disabled:opacity-40 ${v.id === shown.id ? 'text-fg' : 'text-muted'}`}
            >
              <Icon name={v.icon} />
              <span className="min-w-0 flex-1 truncate">{v.label}</span>
              {v.shortcut && <span className="font-mono text-faint">{v.shortcut}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
