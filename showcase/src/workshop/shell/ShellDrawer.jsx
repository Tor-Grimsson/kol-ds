import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import KolWordmark from '../vendor/Wordmark.jsx'

const ShellDrawer = ({
  isOpen,
  onClose,
  anchor = 'left',
  showHeader = true,
  breakpointClass = 'lg:hidden',
  children
}) => {
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  if (!isOpen) return null

  const anchorClass = anchor === 'right' ? 'right-0' : 'left-0'

  return createPortal(
    <div className={breakpointClass}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`fixed inset-y-0 ${anchorClass} z-[200] flex w-full flex-col border-r border-fg-08 bg-surface-primary px-4 md:px-5 lg:px-6 py-4 shadow-2xl`}
      >
        {showHeader && (
          <div className="mb-6 flex items-center justify-between">
            <KolWordmark className="h-6 w-auto" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="flex h-8 w-8 items-center justify-center rounded-md text-fg-64 transition-colors hover:bg-fg-08 hover:text-fg"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto pr-1" style={{ overflowAnchor: 'none' }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ShellDrawer
