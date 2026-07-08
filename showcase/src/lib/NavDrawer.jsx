import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Icon } from '@kolkrabbi/kol-icons'
import SidebarNav from './SidebarNav.jsx'

/**
 * NavDrawer — the <lg navigation for the docs chrome (workshop ShellDrawer
 * pattern: portal, backdrop, body-scroll lock, Escape to close). Content is
 * the same SidebarNav the ≥lg sidebar renders, plus a Home link on top.
 */
export default function NavDrawer({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="lg:hidden">
      <div className="fixed inset-0 z-[100] bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 z-[200] flex w-[85vw] max-w-[320px] flex-col border-r border-fg-08 bg-surface-primary px-5 py-4 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="kol-mono-13 tracking-tight text-emphasis" onClick={onClose}>Kolkrabbi</Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-[var(--kol-radius-sm)] text-meta transition-colors hover:bg-fg-08 hover:text-emphasis"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto pr-1" style={{ overflowAnchor: 'none' }}>
          <SidebarNav onNavigate={onClose} />
        </div>
      </div>
    </div>,
    document.body
  )
}
