import { useRef } from 'react'
import { useDragResize } from '@kolkrabbi/kol-component'

/* A RAIL'S SIZE BY A DRAG (plan-2026-11-20-kolbox-everything-left W2.3, [45] to [47]): the kit's own gesture
   (useDragResize, its `line` handle) on an edge, Figma's way: no line drawn, the pointer turns to the two arrows over the
   edge, a drag sizes it, a double press puts it back. The size lives in `--<token>-w` (or `-h`) on the root, with its
   floor `--<token>-snap` and its step and default beside it in kolbox.css; the hook's ceiling is three times the default.
   Remembered across reloads (the hook's persistWidth), as the rulers are.
   token: the name family; side: 'left' (the handle on the right edge), 'right' (on the left edge) or 'top' (a section
   whose foot is the handle, growing downward). The size reaches the child through the variable the rail reads:
   `--kol-kolbox-rail-w` for a rail, set on this wrapper. */
export function useRailResize(token, side) {
  const ref = useRef(null)
  const vertical = side === 'top'
  const { grabProps } = useDragResize(ref, { token, side, persistWidth: true, variant: 'line' })
  /* the hook's own Home key is its reset; a double press asks for it */
  const reset = () => grabProps.onKeyDown({ key: 'Home', preventDefault() {} })
  const handle = (
    <div {...grabProps} onDoubleClick={reset} aria-label={vertical ? 'Resize Pages' : 'Resize rail'}
      className={`absolute z-20 outline-none ${vertical ? 'inset-x-0 -bottom-1 h-2 cursor-row-resize' : `inset-y-0 w-2 cursor-col-resize ${side === 'left' ? '-right-1' : '-left-1'}`}`}
      data-rail-edge={side} />
  )
  return { ref, handle }
}

export default function RailResize({ token, side, children }) {
  const { ref, handle } = useRailResize(token, side)
  return (
    <div ref={ref} className="relative flex h-full shrink-0" style={{ '--kol-kolbox-rail-w': `var(--${token}-w)` }} data-rail-size={side}>
      {children}
      {handle}
    </div>
  )
}
