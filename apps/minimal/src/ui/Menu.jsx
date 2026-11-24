import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

/* The menu family: a trigger with its panel (MenuButton), the bar of them (MenuBar), and the panel's rows (MenuRow), its
   flyouts (MenuNest), dividers and eyebrows. A flyout opens beside its row on hover or focus; a row that does not apply
   is greyed, never hidden. */
const MenuContext = createContext({ close: () => {} })

const PANEL = 'flex flex-col rounded-field border border-line bg-panel p-1 text-label text-fg'

/* `variant` filled is the pill's primary trigger (Export); `align` right opens the panel from the trigger's right edge */
export function MenuButton({ label, icon, ariaLabel, disabled, place = 'below', align = 'left', variant = 'ghost', open: openProp, onOpenChange, onPointerEnter, width = 240, triggerClassName = '', children }) {
  const [own, setOwn] = useState(false)
  const open = openProp ?? own
  const setOpen = (v) => { if (onOpenChange) onOpenChange(v); else setOwn(v) }
  const root = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const away = (e) => { if (!root.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', away)
    window.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); window.removeEventListener('keydown', esc) }
  })
  const iconOnly = !label
  return (
    <div ref={root} className={`relative ${disabled ? 'pointer-events-none opacity-40' : ''}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        onPointerEnter={onPointerEnter}
        className={`inline-flex h-7 items-center justify-center gap-2 rounded-full text-label font-medium whitespace-nowrap outline-none focus-visible:outline-1 focus-visible:outline-fg ${iconOnly ? 'w-7' : 'px-3'} ${variant === 'filled' ? 'bg-accent text-accent-fg' : open ? 'bg-field-hover text-fg' : 'text-muted hover:bg-field hover:text-fg'} ${triggerClassName}`}
      >
        {icon && <Icon name={icon} />}
        {label}
      </button>
      {open && (
        <MenuContext.Provider value={{ close: () => setOpen(false) }}>
          <div role="menu" className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} z-50 ${place === 'above' ? 'bottom-full mb-1' : 'top-full mt-1'} ${PANEL}`} style={{ width }}>
            {children}
          </div>
        </MenuContext.Provider>
      )}
    </div>
  )
}

/* One menu open at a time; once one is open, the pointer moving onto another trigger opens that one (the mac bar). */
export function MenuBar({ menus, className = '' }) {
  const [open, setOpen] = useState(null)
  return (
    <nav className={`flex items-center gap-0.5 ${className}`}>
      {menus.map((m) => (
        <MenuButton
          key={m.label}
          label={m.label}
          width={m.width}
          triggerClassName={m.bold ? '!text-fg font-semibold' : ''}
          open={open === m.label}
          onOpenChange={(v) => setOpen(v ? m.label : null)}
          onPointerEnter={() => { if (open && open !== m.label) setOpen(m.label) }}
        >
          {m.children}
        </MenuButton>
      ))}
    </nav>
  )
}

export function MenuRow({ children, onClick, disabled, shortcut, checked, icon, prefix }) {
  const { close } = useContext(MenuContext)
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={() => { close(); onClick?.() }}
      className="flex h-7 shrink-0 items-center gap-2 rounded-inner px-2 text-left text-label text-fg outline-none hover:bg-field focus-visible:bg-field disabled:pointer-events-none disabled:opacity-40"
    >
      {icon && <Icon name={icon} className="text-muted" />}
      {prefix}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {checked && <Icon name="check" size={12} />}
      {shortcut && <span className="shrink-0 font-mono text-label text-faint">{shortcut}</span>}
    </button>
  )
}

/* a row that opens its rows beside it; `scroll` caps a long list */
export function MenuNest({ label, icon, disabled, scroll, width = 220, children }) {
  return (
    <div className={`relative [&:focus-within>[data-flyout]]:flex [&:hover>[data-flyout]]:flex ${disabled ? 'pointer-events-none opacity-40' : ''}`}>
      <button type="button" role="menuitem" aria-haspopup="menu" disabled={disabled} className="flex h-7 w-full items-center gap-2 rounded-inner px-2 text-left text-label text-fg outline-none hover:bg-field focus-visible:bg-field">
        {icon && <Icon name={icon} className="text-muted" />}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <Icon name="chevron-right" size={12} className="text-faint" />
      </button>
      <div data-flyout role="menu" className={`absolute top-0 left-full z-10 ml-1 hidden ${PANEL} ${scroll ? 'max-h-[60vh] overflow-y-auto' : ''}`} style={{ width }}>
        {children}
      </div>
    </div>
  )
}

export function MenuDivider() {
  return <div role="separator" className="my-1 h-px shrink-0 bg-line" />
}

export function MenuEyebrow({ children }) {
  return <div className="px-2 pt-2 pb-1 text-caps text-faint">{children}</div>
}
