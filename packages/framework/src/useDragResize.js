import { useEffect, useRef, useState } from 'react'

/* Grab-edge resize + snap-collapse for SideNav (lobby: SideNavGrabResize).
 * Mechanics are kol-mirror's MirrorPlayground.jsx#L21-L76 — pointerdown on the
 * strip, window-level move/up, body cursor + userSelect held for the drag,
 * double-click resets. What the DS adds on top of that prior art:
 *   - live width goes to --kol-sidenav-w on :root, so the layout grid, the
 *     shell-header brand block and the aside all follow one number
 *   - dragging under --kol-sidenav-snap stamps :root[data-sidenav="collapsed"]
 *     (rendered again in kol-framework.css since 2026-08-09); back out re-expands
 *   - width + state survive reload. 'kol-sidenav' keeps the consumers' existing
 *     'collapsed'|'expanded' schema; width lives under its own key so the
 *     brand app's reader of that value never breaks
 * Keyboard path (a11y is not optional per the brief): the strip is a focusable
 * separator — arrows resize by --kol-sidenav-step, ArrowLeft past the snap
 * collapses, ArrowRight re-expands, Home resets to the stylesheet default.
 * Every value the gesture needs is a --kol-sidenav-* token in kol-framework.css
 * — no literals here, so a missing token (framework CSS not loaded) leaves the
 * gesture inert rather than improvising numbers. */

const STATE_KEY = 'kol-sidenav'
const WIDTH_KEY = 'kol-sidenav-w'

const root = () => document.documentElement

/* Resolve a length token to px, or null when it is absent/unparsable. */
function readVarPx(name) {
  const raw = getComputedStyle(root()).getPropertyValue(name).trim()
  const n = parseFloat(raw)
  if (!raw || Number.isNaN(n)) return null
  return raw.endsWith('rem') ? n * parseFloat(getComputedStyle(root()).fontSize) : n
}

/* Imperative DOM writes — pointermove must never re-render the nav tree.
 * React state syncs from the DOM at rest (drag end / key press / reset). */
const stampCollapsed = (on) => {
  if (on) root().setAttribute('data-sidenav', 'collapsed')
  else root().removeAttribute('data-sidenav')
}
const writeWidth = (px) => {
  if (px == null) root().style.removeProperty('--kol-sidenav-w')
  else root().style.setProperty('--kol-sidenav-w', `${px}px`)
}
const readBack = () => {
  const inline = parseFloat(root().style.getPropertyValue('--kol-sidenav-w'))
  return {
    collapsed: root().getAttribute('data-sidenav') === 'collapsed',
    widthPx: Number.isNaN(inline) ? null : inline,
  }
}

export default function useDragResize(asideRef) {
  const drag = useRef(null) // { startX, startW, snapPx, maxPx } during a drag
  const defaultPx = useRef(null)
  const collapsedPx = useRef(null)
  const [collapsed, setCollapsed] = useState(false)
  const [widthPx, setWidthPx] = useState(null) // null = stylesheet default

  const syncAndPersist = () => {
    const { collapsed: c, widthPx: w } = readBack()
    setCollapsed(c)
    setWidthPx(w)
    try {
      localStorage.setItem(STATE_KEY, c ? 'collapsed' : 'expanded')
      if (w == null) localStorage.removeItem(WIDTH_KEY)
      else localStorage.setItem(WIDTH_KEY, String(Math.round(w)))
    } catch { /* storage blocked */ }
  }

  /* Boot: capture the stylesheet defaults BEFORE any inline override lands,
   * then restore the persisted width/state. */
  useEffect(() => {
    defaultPx.current = readVarPx('--kol-sidenav-w')
    collapsedPx.current = readVarPx('--kol-sidenav-w-collapsed')
    let w = null
    let c = false
    try {
      w = parseFloat(localStorage.getItem(WIDTH_KEY)) || null
      c = localStorage.getItem(STATE_KEY) === 'collapsed'
    } catch { /* storage blocked */ }
    if (w) { writeWidth(w); setWidthPx(w) }
    if (c) { stampCollapsed(true); setCollapsed(true) }
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!drag.current) return
      const { startX, startW, snapPx, maxPx } = drag.current
      const next = startW + (e.clientX - startX)
      if (next < snapPx) {
        stampCollapsed(true)
      } else {
        stampCollapsed(false)
        writeWidth(Math.min(next, maxPx))
      }
    }
    const onUp = () => {
      if (!drag.current) return
      drag.current = null
      root().removeAttribute('data-sidenav-dragging')
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      syncAndPersist()
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  const onPointerDown = (e) => {
    const snapPx = readVarPx('--kol-sidenav-snap')
    if (defaultPx.current == null || snapPx == null) return // tokens absent → inert
    e.preventDefault()
    drag.current = {
      startX: e.clientX,
      startW: asideRef.current?.getBoundingClientRect().width ?? defaultPx.current,
      snapPx,
      /* mirror's ceiling (default × 3), resolved from the token not hardcoded */
      maxPx: defaultPx.current * 3,
    }
    /* the grid's 180ms grid-template-columns ease would trail the pointer —
     * kol-framework.css suspends it while this attribute is stamped */
    root().setAttribute('data-sidenav-dragging', '')
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const onDoubleClick = () => {
    stampCollapsed(false)
    writeWidth(null)
    syncAndPersist()
  }

  const onKeyDown = (e) => {
    const snapPx = readVarPx('--kol-sidenav-snap')
    const stepPx = readVarPx('--kol-sidenav-step')
    if (defaultPx.current == null || snapPx == null || stepPx == null) return
    const { collapsed: c, widthPx: w } = readBack()
    const current = w ?? defaultPx.current
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (c) stampCollapsed(false)
      else writeWidth(Math.min(current + stepPx, defaultPx.current * 3))
      syncAndPersist()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (c) return
      const next = current - stepPx
      if (next < snapPx) stampCollapsed(true)
      else writeWidth(next)
      syncAndPersist()
    } else if (e.key === 'Home') {
      e.preventDefault()
      onDoubleClick()
    }
  }

  return {
    collapsed,
    grabProps: {
      role: 'separator',
      'aria-orientation': 'vertical',
      'aria-label': 'Resize navigation',
      'aria-valuenow': Math.round(collapsed ? collapsedPx.current : (widthPx ?? defaultPx.current)) || undefined,
      'aria-valuemin': collapsedPx.current == null ? undefined : Math.round(collapsedPx.current),
      'aria-valuemax': defaultPx.current == null ? undefined : Math.round(defaultPx.current * 3),
      tabIndex: 0,
      onPointerDown,
      onDoubleClick,
      onKeyDown,
    },
  }
}
