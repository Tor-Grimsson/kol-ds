import { useEffect, useRef, useState } from 'react'
import { KindPreview } from '@kolkrabbi/kol-component'

/* taxonomy-ok: molecule — KindPreview scaled into a card's media box */

/**
 * NoteThumb — a note's own markdown, rendered by the DS previewer and scaled down to fit a card's
 * media box (kol-olina's brand Notes, verbatim).
 *
 * `KindPreview` renders a document at READING size; dropped into a 120px thumb you get one enormous
 * letter. `zoom`, not `transform: scale` — zoom affects layout, so the scaled page occupies the space
 * it draws in and the box clips it honestly. THE SCALE IS MEASURED: a `ResizeObserver` on the frame
 * divides by the page width, correct in the grid and in a list row alike.
 *
 * 640 is the DS's own logical width for a scaled document (`.kol-doc-page` at `zoom: 0.5` in the
 * 320px column-browser frame).
 *
 * @param {{slug: string, preview: string}} note  `preview` is the body's head — the list never ships whole bodies
 */
const THUMB_PAGE = 640

export default function NoteThumb({ note }) {
  const frame = useRef(null)
  const [zoom, setZoom] = useState(null)

  useEffect(() => {
    const el = frame.current
    if (!el) return undefined
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w) setZoom(w / THUMB_PAGE)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={frame} className="w-full h-full overflow-hidden bg-surface-primary pointer-events-none">
      {/* nothing until the frame has a width — one blank frame beats a page drawn at the wrong scale */}
      {zoom != null && (
        <div style={{ width: THUMB_PAGE, zoom }} aria-hidden="true">
          <KindPreview o={{ key: note.slug }} text={note.preview} kind="markdown" />
        </div>
      )}
    </div>
  )
}
