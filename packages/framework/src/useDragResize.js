import { useEffect, useMemo, useRef, useState } from 'react'

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
 * Every value the gesture needs is a --<token>-* custom property in the
 * consumer's CSS — no literals here except the click slop, which is a
 * gesture constant, not chrome. Missing tokens leave the gesture inert.
 *
 * SIDE-AGNOSTIC since ThreeColumnEditorShell (kol-fxr, 2026-08-15): the name
 * family and the drag direction are both arguments now, so a right-hand
 * inspector rail reuses this gesture — pointer, keyboard, snap, collapse and
 * persistence — instead of reimplementing it. The bullets above describe the
 * DEFAULT ('kol-sidenav', side 'left'), which is byte-identical to 0.17.0. */

const CLICK_SLOP_PX = 3

const root = () => document.documentElement

/* Every name the gesture touches, derived from ONE token (ThreeColumnEditorShell,
 * filed from kol-fxr 2026-08-15). The default token reproduces the hardcoded
 * 0.17.0 names EXACTLY — 'kol-sidenav' → data-sidenav, --kol-sidenav-w,
 * storage 'kol-sidenav'/'kol-sidenav-w' — so SideNav and every existing caller
 * are untouched by this generalisation.
 *
 * The data-attribute drops the `kol-` prefix because that is what the shipped
 * CSS already selects (`:root[data-sidenav="collapsed"]`), not a new scheme. */
export function buildNames(token) {
  const base = token.replace(/^kol-/, '')
  return {
    stateKey: token,
    widthKey: `${token}-w`,
    collapsedAttr: `data-${base}`,
    draggingAttr: `data-${base}-dragging`,
    wVar: `--${token}-w`,
    collapsedVar: `--${token}-w-collapsed`,
    snapVar: `--${token}-snap`,
    stepVar: `--${token}-step`,
    snapDefaultVar: `--${token}-snap-default`,
  }
}

/* Resolve a length token to px, or null when it is absent/unparsable. */
function readVarPx(name) {
  const raw = getComputedStyle(root()).getPropertyValue(name).trim()
  const n = parseFloat(raw)
  if (!raw || Number.isNaN(n)) return null
  return raw.endsWith('rem') ? n * parseFloat(getComputedStyle(root()).fontSize) : n
}

/* Imperative DOM writes — pointermove must never re-render the nav tree.
 * React state syncs from the DOM at rest (release / key press / reset). */
const stampCollapsed = (n, on) => {
  if (on) root().setAttribute(n.collapsedAttr, 'collapsed')
  else root().removeAttribute(n.collapsedAttr)
}
const writeWidth = (n, px) => {
  if (px == null) root().style.removeProperty(n.wVar)
  else root().style.setProperty(n.wVar, `${px}px`)
}
const readBack = (n) => {
  const inline = parseFloat(root().style.getPropertyValue(n.wVar))
  return {
    collapsed: root().getAttribute(n.collapsedAttr) === 'collapsed',
    widthPx: Number.isNaN(inline) ? null : inline,
  }
}

/* @param ref      the panel being resized — its measured width seeds the drag
 * @param options  { token, side }
 *   token — the CSS/storage name family. Default 'kol-sidenav' (SideNav).
 *           A right-hand inspector passes its own, e.g. 'kol-rail', so the two
 *           rails never share one :root variable and drag together.
 *   side  — which EDGE the grab handle sits on. 'left' (default) is a rail on
 *           the left of the viewport whose handle is on its right edge, so
 *           rightward drag = wider. 'right' inverts both the pointer sign and
 *           the arrow keys. */
export default function useDragResize(ref, options = {}) {
  const { token = 'kol-sidenav', side = 'left' } = options
  /* -1 on a right-hand rail: the same rightward pointer travel that widens a
   * left rail must NARROW a right one, because its handle faces the canvas. */
  const dir = side === 'right' ? -1 : 1
  const names = useMemo(() => buildNames(token), [token])

  const drag = useRef(null) // { startX, startW, snapPx, maxPx, moved } during a drag
  const defaultPx = useRef(null)
  const collapsedPx = useRef(null)
  const [collapsed, setCollapsed] = useState(false)
  const [widthPx, setWidthPx] = useState(null) // null = stylesheet default

  const syncAndPersist = () => {
    const { collapsed: c, widthPx: w } = readBack(names)
    setCollapsed(c)
    setWidthPx(w)
    try {
      localStorage.setItem(names.stateKey, c ? 'collapsed' : 'expanded')
      if (w == null) localStorage.removeItem(names.widthKey)
      else localStorage.setItem(names.widthKey, String(Math.round(w)))
    } catch { /* storage blocked */ }
  }

  const toggleCollapsed = () => {
    const { collapsed: c } = readBack(names)
    stampCollapsed(names, !c)
    syncAndPersist()
  }

  /* Boot: capture the stylesheet defaults BEFORE any inline override lands,
   * then restore the persisted width/state. */
  useEffect(() => {
    defaultPx.current = readVarPx(names.wVar)
    collapsedPx.current = readVarPx(names.collapsedVar)
    let w = null
    let c = false
    try {
      w = parseFloat(localStorage.getItem(names.widthKey)) || null
      c = localStorage.getItem(names.stateKey) === 'collapsed'
    } catch { /* storage blocked */ }
    if (w) { writeWidth(names, w); setWidthPx(w) }
    if (c) { stampCollapsed(names, true); setCollapsed(true) }
  }, [names])

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
      const next = d.startW + dx * dir
      if (next < d.snapPx) {
        stampCollapsed(names, true)
      } else {
        stampCollapsed(names, false)
        writeWidth(names, Math.min(next, d.maxPx))
      }
    }
    const onUp = () => {
      if (!drag.current) return
      const { moved } = drag.current
      drag.current = null
      root().removeAttribute(names.draggingAttr)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      if (!moved) { toggleCollapsed(); return } // a click, not a drag
      /* Snap-to-default: release near the stylesheet default clears the
       * override entirely. */
      const { collapsed: c, widthPx: w } = readBack(names)
      const band = readVarPx(names.snapDefaultVar) ?? readVarPx(names.stepVar) ?? 16
      if (!c && w != null && defaultPx.current != null && Math.abs(w - defaultPx.current) <= band) {
        writeWidth(names, null)
      }
      syncAndPersist()
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [names, dir])

  const onPointerDown = (e) => {
    const snapPx = readVarPx(names.snapVar)
    if (defaultPx.current == null || snapPx == null) return // tokens absent → inert
    e.preventDefault()
    drag.current = {
      startX: e.clientX,
      startW: ref.current?.getBoundingClientRect().width ?? defaultPx.current,
      snapPx,
      /* mirror's ceiling (default × 3), resolved from the token not hardcoded */
      maxPx: defaultPx.current * 3,
      moved: false,
    }
    /* the grid's grid-template-columns ease would trail the pointer —
     * kol-framework.css suspends it while this attribute is stamped */
    root().setAttribute(names.draggingAttr, '')
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const resetToDefault = () => {
    stampCollapsed(names, false)
    writeWidth(names, null)
    syncAndPersist()
  }

  const onKeyDown = (e) => {
    const snapPx = readVarPx(names.snapVar)
    const stepPx = readVarPx(names.stepVar)
    if (defaultPx.current == null || snapPx == null || stepPx == null) return
    const { collapsed: c, widthPx: w } = readBack(names)
    const current = w ?? defaultPx.current
    /* The arrow that GROWS is the one pointing away from the rail's own edge —
     * ArrowRight on a left rail, ArrowLeft on a right one. Same inversion the
     * pointer gets, so keyboard and drag never disagree. */
    const growKey = dir === 1 ? 'ArrowRight' : 'ArrowLeft'
    const shrinkKey = dir === 1 ? 'ArrowLeft' : 'ArrowRight'
    if (e.key === growKey) {
      e.preventDefault()
      if (c) stampCollapsed(names, false)
      else writeWidth(names, Math.min(current + stepPx, defaultPx.current * 3))
      syncAndPersist()
    } else if (e.key === shrinkKey) {
      e.preventDefault()
      if (c) return
      const next = current - stepPx
      if (next < snapPx) stampCollapsed(names, true)
      else writeWidth(names, next)
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
