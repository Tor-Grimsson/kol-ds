import { useCallback, useEffect, useState } from 'react'
import { usePopover, PopoverPanel } from './Popover.jsx'

/**
 * ContextMenu — a right-click menu, anchored at the pointer.
 *
 * `onContextMenu` appeared NOWHERE in this package before 2026-09-21, which is
 * why every file-manager verb the media product needed (new folder, rename,
 * move, delete) had no surface to be invoked from: the operations existed on
 * the client and nothing could reach them. This is that surface.
 *
 * Built on `usePopover`'s `referenceElement` seam rather than a new floating
 * implementation — a context menu is a popover whose anchor is a point instead
 * of an element, and floating-ui takes a virtual element for exactly this. So
 * it inherits flip, shift, the portal, dismissal and the `.kol-popover` chrome,
 * and a menu near the viewport edge behaves like every other panel.
 *
 *   const menu = useContextMenu()
 *   <li onContextMenu={(e) => menu.openAt(e, row)}>…</li>
 *   <ContextMenu menu={menu}>
 *     {(row) => <MenuDropdownItem onClick={() => rename(row)}>Rename</MenuDropdownItem>}
 *   </ContextMenu>
 *
 * `children` may be a render function taking the payload handed to `openAt`,
 * so one menu instance serves a whole list instead of one per row.
 */
export function useContextMenu() {
  const [state, setState] = useState(null) // { x, y, payload } | null

  const openAt = useCallback((event, payload = null) => {
    event.preventDefault()
    event.stopPropagation()
    setState({ x: event.clientX, y: event.clientY, payload })
  }, [])

  const close = useCallback(() => setState(null), [])

  const popover = usePopover({
    open: !!state,
    onOpenChange: (v) => { if (!v) close() },
    placement: 'right-start',
    offset: 2,
    click: false,
    role: 'menu',
  })

  /* A VIRTUAL ELEMENT — a zero-size rect at the pointer. It goes through
   * `setPositionReference`, NOT the `elements.reference` option: floating-ui
   * rejects a virtual element there ("must be a real DOM element") because that
   * slot also feeds the interaction hooks, which call `getAttribute` on it.
   * `setPositionReference` is the seam for exactly this — position from a point,
   * interactions from nothing. */
  const { setPositionReference } = popover.refs
  useEffect(() => {
    if (!state) return
    const { x, y } = state
    setPositionReference({
      getBoundingClientRect: () => ({ width: 0, height: 0, x, y, top: y, left: x, right: x, bottom: y }),
    })
  }, [state, setPositionReference])

  return { open: !!state, payload: state?.payload ?? null, openAt, close, popover }
}

export default function ContextMenu({ menu, children, className = '' }) {
  if (!menu.open) return null
  return (
    /* `focus={false}` — FloatingFocusManager reads attributes off the reference,
     * and a point has none. Dismissal is outside-click and Escape, which the
     * popover already wires. */
    <PopoverPanel popover={menu.popover} focus={false} className={`kol-dd-list min-w-44 ${className}`.trim()}>
      {/* Any click inside closes — a menu item that leaves the menu open after
        * acting is the one interaction people report as broken. Items keep their
        * own onClick; this runs after it on the way up. */}
      {/* A COLUMN, not a block: the items are `inline-flex`, so in a block they are one line of
        * inline boxes to the float's shrink-to-fit, and the menu took the width of every label
        * side by side — 510px for seven short verbs, past the edge of a phone. */}
      <div onClick={menu.close} role="none" className="flex flex-col">
        {typeof children === 'function' ? children(menu.payload) : children}
      </div>
    </PopoverPanel>
  )
}
