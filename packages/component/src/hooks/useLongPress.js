import { useRef } from 'react'

/**
 * useLongPress — the touch half of right-click. iOS never fires `contextmenu` from a held press,
 * so a container spreads these props and a held touch dispatches that event itself, at the finger,
 * on whatever was pressed. Every `onContextMenu` inside — and the payload it builds — works
 * unchanged, with no per-row wiring.
 *
 *   const press = useLongPress()
 *   <div {...press}> …rows and tiles with onContextMenu… </div>
 *
 * Touch only (a mouse and a pen have a right button). It acts only when a handler took the event
 * (`preventDefault`, which is what `useContextMenu().openAt` does): a held press on anything else
 * stays a press, and its click is not swallowed. When one did, the click that follows the lift is
 * swallowed so the row underneath does not also select or open. Moving past `slop` px is a scroll
 * or a drag and cancels it. A trusted `contextmenu` after ours (Android fires one) is dropped.
 */
export default function useLongPress({ ms = 450, slop = 10 } = {}) {
  const s = useRef({ timer: 0, x: 0, y: 0, target: null, fired: false })
  const cancel = () => { clearTimeout(s.current.timer); s.current.timer = 0 }
  return {
    /* iOS draws its own callout over a held image — the thumbnails are images */
    style: { WebkitTouchCallout: 'none' },
    onPointerDown: (e) => {
      const t = s.current
      cancel()
      t.fired = false
      if (e.pointerType !== 'touch' || !e.isPrimary || e.target.closest('input,textarea,select')) return
      t.x = e.clientX; t.y = e.clientY; t.target = e.target
      t.timer = setTimeout(() => {
        t.timer = 0
        t.fired = !t.target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: t.x, clientY: t.y, button: 2 }))
      }, ms)
    },
    onPointerMove: (e) => { const t = s.current; if (t.timer && Math.hypot(e.clientX - t.x, e.clientY - t.y) > slop) cancel() },
    onPointerUp: cancel,
    onPointerCancel: cancel,
    onClickCapture: (e) => { if (s.current.fired) { s.current.fired = false; e.preventDefault(); e.stopPropagation() } },
    onContextMenuCapture: (e) => { if (s.current.fired && e.nativeEvent.isTrusted) { e.preventDefault(); e.stopPropagation() } },
  }
}
