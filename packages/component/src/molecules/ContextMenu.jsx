import { useCallback, useEffect, useState } from 'react'
import { Menu } from './Menu.jsx'
import { pushLayer, popLayer } from '../utilities/layerStack.js'

/**
 * ContextMenu — a right-click menu, anchored at the pointer.
 *
 * `onContextMenu` appeared NOWHERE in this package before 2026-09-21, which is
 * why every file-manager verb the media product needed (new folder, rename,
 * move, delete) had no surface to be invoked from: the operations existed on
 * the client and nothing could reach them. This is that surface.
 *
 * Built on `Menu`'s `anchor` (since 2026-10-31; before, `usePopover`'s seam directly) rather than a new floating
 * implementation — a context menu is a popover whose anchor is a point instead
 * of an element, and floating-ui takes a virtual element for exactly this. So
 * it inherits flip, shift, the portal, dismissal and the `.kol-popover` chrome,
 * and a menu near the viewport edge behaves like every other panel.
 *
 *   const menu = useContextMenu()
 *   <li onContextMenu={(e) => menu.openAt(e, row)}>…</li>
 *   <ContextMenu menu={menu}>
 *     {(row) => <MenuRow onClick={() => rename(row)}>Rename</MenuRow>}
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

  /* the point and the panel are `Menu`'s (plan-2026-10-31-menu-engine W1.4): it takes `anchor={{ x, y }}` */
  return { open: !!state, x: state?.x, y: state?.y, payload: state?.payload ?? null, openAt, close }
}

/** `variant="float"` (float-everything W4 row 55, 2026-11-04): the float list — the list radius, 34 rows, the float flyouts */
export default function ContextMenu({ menu, children, variant, className = '' }) {
  /* ONE ESCAPE, ONE LEVEL (kol-fxr 2026-10-08: a menu opened inside a FullscreenOverlay took the
   * dialog with it). Open, the menu is the top layer, so the overlay under it ignores that Escape. */
  useEffect(() => {
    if (!menu.open) return undefined
    const layer = pushLayer()
    return () => popLayer(layer)
  }, [menu.open])
  if (!menu.open) return null
  return (
    <Menu anchor={{ x: menu.x, y: menu.y }} open onOpenChange={(v) => { if (!v) menu.close() }} variant={variant} panelClassName={`min-w-44 ${className}`.trim()}>
      {/* Any click inside closes — a menu item that leaves the menu open after acting is the one interaction people
        * report as broken. Items keep their own onClick; this runs after it on the way up. */}
      <div onClick={menu.close} role="none" className="flex flex-col">
        {typeof children === 'function' ? children(menu.payload) : children}
      </div>
    </Menu>
  )
}
