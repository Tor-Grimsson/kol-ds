import { useEffect, useRef, useState } from 'react'

/* Grab-edge resize + collapse for SideNav — THE single control since 0.17.0
 * (user build order 2026-08-09, completing the SideNavGrabResize brief: the
 * chip Button is gone in both states; the pill-marked edge does everything).
 * Logic lifted from the hand-tested brand proto (kol-website _tmp
 * useDragResizeProto.js), which forked this hook's 0.16.0 form.
 *
 *  - CLICK TOGGLES expand↔collapse: pointerup with < 3px of travel is a
 *    click, never a resize — drags only start past the slop, so toggle
 *    presses can't jitter the rail.
 *  - DRAG resizes; live width goes to --kol-sidenav-w on :root so the grid,
 *    shell-header brand block and aside follow one number. Dragging under
 *    --kol-sidenav-snap stamps :root[data-sidenav="collapsed"].
 *  - SNAP-TO-DEFAULT: releasing within --kol-sidenav-snap-default of the
 *    stylesheet default clears the override — you land exactly on default,
 *    never 249px or 263px.
 *  - DOUBLE-CLICK RESET IS GONE — it cannot coexist with click-toggle (two
 *    clicks would toggle-toggle-reset). Home keeps the reset; the snap band
 *    covers pointer users.
 *  - Keyboard on the focused separator: arrows resize by --kol-sidenav-step
 *    (ArrowLeft past the snap collapses), Home resets, Enter/Space toggle.
 *  - Width + state survive reload ('kol-sidenav' keeps the consumers'
 *    existing 'collapsed'|'expanded' schema; width under its own key).
 *
 * Every value the gesture needs is a --kol-sidenav-* token in
 * kol-framework.css — no literals here except the click slop, which is a
 * gesture constant, not chrome. Missing tokens leave the gesture inert. */

const STATE_KEY = 'kol-sidenav'
const WIDTH_KEY = 'kol-sidenav-w'
const CLICK_SLOP_PX = 3

const root = () => document.documentElement

/* Resolve a length token to px, or null when it is absent/unparsable. */
function readVarPx(name) {
  const raw = getComputedStyle(root()).getPropertyValue(name).trim()
  const n = parseFloat(raw)
  if (!raw || Number.isNaN(n)) return null
  return raw.endsWith('rem') ? n * parseFloat(getComputedStyle(root()).fontSize) : n
}

/* Imperative DOM writes — pointermove must never re-render the nav tree.
 * React state syncs from the DOM at rest (release / key press / reset). */
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
  const drag = useRef(null) // { startX, startW, snapPx, maxPx, moved } during a drag
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

  const toggleCollapsed = () => {
    const { collapsed: c } = readBack()
    stampCollapsed(!c)
    syncAndPersist()
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
      const d = drag.current
      const dx = e.clientX - d.startX
      /* Below the slop the pointer is still a CLICK — resizing from the
       * first pixel would jitter the rail on every toggle press. */
      if (!d.moved) {
        if (Math.abs(dx) < CLICK_SLOP_PX) return
        d.moved = true
      }
      const next = d.startW + dx
      if (next < d.snapPx) {
        stampCollapsed(true)
      } else {
        stampCollapsed(false)
        writeWidth(Math.min(next, d.maxPx))
      }
    }
    const onUp = () => {
      if (!drag.current) return
      const { moved } = drag.current
      drag.current = null
      root().removeAttribute('data-sidenav-dragging')
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      if (!moved) { toggleCollapsed(); return } // a click, not a drag
      /* Snap-to-default: release near the stylesheet default clears the
       * override entirely. */
      const { collapsed: c, widthPx: w } = readBack()
      const band = readVarPx('--kol-sidenav-snap-default') ?? readVarPx('--kol-sidenav-step') ?? 16
      if (!c && w != null && defaultPx.current != null && Math.abs(w - defaultPx.current) <= band) {
        writeWidth(null)
      }
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
      moved: false,
    }
    /* the grid's grid-template-columns ease would trail the pointer —
     * kol-framework.css suspends it while this attribute is stamped */
    root().setAttribute('data-sidenav-dragging', '')
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const resetToDefault = () => {
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
      resetToDefault()
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleCollapsed()
    }
  }

  return {
    collapsed,
    toggleCollapsed,
    grabProps: {
      role: 'separator',
      'aria-orientation': 'vertical',
      'aria-label': 'Resize navigation',
      'aria-valuenow': Math.round(collapsed ? collapsedPx.current : (widthPx ?? defaultPx.current)) || undefined,
      'aria-valuemin': collapsedPx.current == null ? undefined : Math.round(collapsedPx.current),
      'aria-valuemax': defaultPx.current == null ? undefined : Math.round(defaultPx.current * 3),
      tabIndex: 0,
      onPointerDown,
      onKeyDown,
    },
  }
}
