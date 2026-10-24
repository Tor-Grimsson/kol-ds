// RackViewport — the rack on the studio canvas: snap, cables and the workbench on kol-component's
// CanvasStudio (the canvas family, 2026-10-23). The pan, the zoom, the dot grid, the lock and the
// keys are the canvas's — Space+drag, middle-drag, scroll pans; ⌘ wheel and pinch zoom; ⌘0 resets;
// G grid; L lock; two fingers pan and pinch, one finger pans empty surface. What is the rack's stays
// here: the 1–9 snap positions, the cables, the workbench, the Space-tap transport toggle.
// Used by both VideoModulo (full page) and CreatePage (embedded)

import { useRef, useEffect, useCallback } from 'react'
import { CanvasStudio } from '@kolkrabbi/kol-component'
import usePersistedState from '../hooks/usePersistedState'
import { useModuleRegistry } from '../hooks/useModuleRegistry.jsx'
import { usePatchRouting } from '../hooks/usePatchRouting.jsx'
import { useCasePower } from '../hooks/useCasePower.jsx'
import { useRenderLoop } from '../hooks/useRenderLoop'
import { RenderControlProvider } from '../hooks/useRenderControl'
import { useRack } from '../hooks/useRackContext.jsx'
import { MODULE_DEFS } from '../modules/registry'
import { ROW_WIDTH } from '../modules/utility/eurorack'
import PatchCableOverlay from '../modules/utility/PatchCableOverlay.jsx'
import RackView from './RackView.jsx'
import Workbench from './Workbench.jsx'

const BASE_WIDTH = ROW_WIDTH + 52
// Floor was 0.5 until touch (2026-09-01), then 0.25 — still 429px for a 1716px rack,
// wider than a 390 phone at any zoom, so the case was always cut on the right
// (user, 2026-09-02: "it's clipping"). 0.1 — the stage's floor — lets it fit.
const MIN_ZOOM = 0.1
const MAX_ZOOM = 2
const REST = { zoom: 1, x: 0, y: 0 }

export default function RackViewport({ style, onEditCase, editMode: editModeOverride, locked, onLockChange, snapPadding = 48, gridRef, onZoomChange, zoomSetterRef }) {
  const { modulesRef } = useModuleRegistry()
  const routing = usePatchRouting()
  const { connectionsRef } = routing
  const rackRef = useRef(null)
  const rowRefs = useRef({})
  const rackOuterRef = useRef(null)
  const rack = useRack()
  const { power, timingRef } = useCasePower()
  // THE VIEW IS THE CANVAS'S `{ zoom, x, y }` — one translate + scale, screen px — persisted for
  // the session as the old zoom and pan were
  const [view, setView] = usePersistedState('rack-view', REST)
  const [cableLocked, setCableLocked] = usePersistedState('rack-cableLocked', false)
  const [cableVisibility, setCableVisibility] = usePersistedState('rack-cableVis', 'trans')
  routing.lockedRef.current = cableLocked
  routing.visibilityRef.current = cableVisibility

  const { controlRef } = useRenderLoop(modulesRef, connectionsRef, power, timingRef)

  // A consumer's zoom control (Create's − % + bar, the sidebar) drives THIS zoom, and reads
  // it back — one store, the one the keys, wheel and pinch already write.
  useEffect(() => { onZoomChange?.(view.zoom) }, [view.zoom, onZoomChange])
  useEffect(() => {
    if (!zoomSetterRef) return undefined
    zoomSetterRef.current = (fn) => setView((v) => ({ ...v, zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, typeof fn === 'function' ? fn(v.zoom) : fn)) }))
    return () => { zoomSetterRef.current = null }
  }, [zoomSetterRef, setView])

  // Snap view: 7 8 9 = top, 4 5 6 = middle, 1 2 3 = bottom — the rack's own keys, screen px onto the view
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1 || !'123456789'.includes(e.key)) return
      if (e.target.closest('input, textarea, select, [contenteditable]')) return
      const el = rackRef.current
      const outer = rackOuterRef.current
      if (!el || !outer) return
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const cr = outer.getBoundingClientRect()
      const vw = cr.width
      const vh = cr.height
      const p = snapPadding
      const targets = {
        7: { x: cr.left + p, y: cr.top + p },
        8: { x: cr.left + (vw - rect.width) / 2, y: cr.top + p },
        9: { x: cr.left + vw - p - rect.width, y: cr.top + p },
        4: { x: cr.left + p, y: cr.top + (vh - rect.height) / 2 },
        5: { x: cr.left + (vw - rect.width) / 2, y: cr.top + (vh - rect.height) / 2 },
        6: { x: cr.left + vw - p - rect.width, y: cr.top + (vh - rect.height) / 2 },
        1: { x: cr.left + p, y: cr.top + vh - p - rect.height },
        2: { x: cr.left + (vw - rect.width) / 2, y: cr.top + vh - p - rect.height },
        3: { x: cr.left + vw - p - rect.width, y: cr.top + vh - p - rect.height },
      }
      const t = targets[e.key]
      setView((v) => ({ ...v, x: v.x + (t.x - rect.left), y: v.y + (t.y - rect.top) }))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [snapPadding, setView])

  // Transport: a clean Space tap toggles the patch's timing roots (the canvas tells a tap from a
  // pan). Anything driving a clk/trig/gate input is a clock regardless of module type, so walk
  // upstream from those drivers through every inbound cable to the sources with no inputs
  // patched — those are the masters; followers stop by proxy. ponytail: rootless cycles are
  // skipped; multiple roots all flip.
  const toggleTransport = useCallback(() => {
    const TEMPO_PORTS = new Set(['clk', 'trig', 'gate'])
    const conns = connectionsRef.current
    const inbound = new Map()
    conns.forEach(c => {
      if (!inbound.has(c.toModuleId)) inbound.set(c.toModuleId, [])
      inbound.get(c.toModuleId).push(c.fromModuleId)
    })
    const roots = new Set()
    const seen = new Set()
    const visit = (id) => {
      if (seen.has(id)) return
      seen.add(id)
      const ins = inbound.get(id)
      if (!ins || ins.length === 0) { roots.add(id); return }
      ins.forEach(visit)
    }
    conns.forEach(c => { if (TEMPO_PORTS.has(c.toPort)) visit(c.fromModuleId) })
    roots.forEach(id => modulesRef.current.get(id)?.setEnabled?.(v => !v))
  }, [connectionsRef, modulesRef])

  // Snap to position 7 (top-left) on mount
  const initialSnapRef = useRef(false)
  useEffect(() => {
    if (initialSnapRef.current) return
    const el = rackRef.current
    const outer = rackOuterRef.current
    if (!el || !outer) return
    initialSnapRef.current = true
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const cr = outer.getBoundingClientRect()
      const p = snapPadding
      setView((v) => ({ ...v, x: v.x + (cr.left + p - rect.left), y: v.y + (cr.top + p - rect.top) }))
    }))
  })

  const editMode = editModeOverride !== undefined ? editModeOverride : rack.editMode

  return (
    <RenderControlProvider value={controlRef}>
      <CanvasStudio
        surfaceRef={rackOuterRef}
        view={view}
        onViewChange={setView}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        locked={locked}
        onLockChange={onLockChange}
        /* `gridRef`: Create paints the grid on the whole page (user, 2026-08-27: the dots are not
           clipped, at all) — same cell, same offset, so it still rides zoom and pan */
        gridRef={gridRef}
        /* the workbench keeps its own wheel and touch scroll */
        ignore="[data-workbench], input, textarea, select"
        onSpaceTap={toggleTransport}
        style={style}
        overlay={editMode && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
            <Workbench
              modules={rack.workbench}
              rows={rack.rows}
              onReturn={rack.returnFromWorkbench}
              onAddRow={rack.addRow}
              onRemoveRow={rack.removeRow}
              onSetRowHeight={rack.setRowHeight}
              onEditCase={onEditCase}
              onAddModule={(type, rowId) => {
                if (rowId) {
                  rack.addModule(type, rowId)
                } else {
                  const def = MODULE_DEFS[type]
                  if (!def) return
                  const targetHeight = (def.u || 3) === 1 ? '1u' : '3u'
                  const row = rack.rows.find(r => r.height === targetHeight)
                  if (row) rack.addModule(type, row.id)
                }
              }}
            />
          </div>
        )}
      >
        <div ref={rackRef} className="relative" style={{ width: BASE_WIDTH }}>
          <PatchCableOverlay containerRef={rackRef} cableVisibility={cableVisibility} cableLocked={cableLocked} onCableUnlock={() => setCableLocked(false)} />
          <RackView
            rows={rack.rows}
            editMode={editMode}
            onSendToWorkbench={rack.sendToWorkbench}
            onSwapInRow={rack.swapInRow}
            onMoveToRow={rack.moveToRow}
            rowRefs={rowRefs}
          />
        </div>
      </CanvasStudio>
    </RenderControlProvider>
  )
}
