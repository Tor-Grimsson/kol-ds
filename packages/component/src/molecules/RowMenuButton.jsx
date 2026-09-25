/* taxonomy-ok: molecule — one Button behind the coarse-pointer gate; the menu it opens is the caller's. */
import Button from '../atoms/Button.jsx'
import useCoarsePointer from '../hooks/useCoarsePointer.js'

/**
 * RowMenuButton — the `···` that stands in for right-click on a touch device (media D-touch,
 * 2026-09-23). A finger has no right button, and a held press (`useLongPress`) is invisible until
 * you know it, so on `pointer: coarse` a row or tile that has a context menu wears this. It calls
 * the SAME handler right-click calls, with the tap as the event, so the payload, the selection
 * rules and the menu are the row's own; `openAt` stops the tap, so the row underneath does not
 * also select or open. Renders nothing on a fine pointer, or without a handler.
 *
 * @param {(e: Event) => void} onOpen  the row's `onContextMenu`
 * @param {string}             variant `ghost` on a row; `grey` — an opaque plate — over a picture
 */
export default function RowMenuButton({ onOpen, variant = 'ghost', className = '' }) {
  const coarse = useCoarsePointer()
  if (!coarse || !onOpen) return null
  return <Button variant={variant} size="md" iconOnly="more" aria-label="More actions" className={`shrink-0 ${className}`.trim()} onClick={onOpen} />
}
