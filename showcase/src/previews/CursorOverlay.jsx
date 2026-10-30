import { CursorProvider, CursorOverlay, useCursor } from '@kolkrabbi/kol-framework'

export const stage = 'full'
/* the ring follows the pointer across its whole document */
export const frame = 360

/* the website's cursor ring: it follows the pointer and shows when a page calls `setVisible(true)` — here, over the box */
function Target() {
  const { setVisible } = useCursor()
  return (
    <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} className="m-12 h-48 border border-fg-12 flex items-center justify-center kol-mono-12 text-meta">
      Move over this box
    </div>
  )
}

export default function CursorOverlayPreview() {
  return <CursorProvider><Target /><CursorOverlay /></CursorProvider>
}
