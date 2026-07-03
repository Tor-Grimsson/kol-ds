import { useCallback, useEffect, useRef, useState } from 'react'
import {
  EditorShell,
  Canvas,
  CANVAS_VIRTUAL_W,
  SelectionOverlay,
  AlignmentGrid,
  TabsRow,
  EmptyState,
  ColorInputRow,
  Button,
} from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Design editor',
  description: 'A working mini design editor — draggable, resizable, recolourable boxes on a 1080-virtual canvas with a live selection overlay, tool rail, and inspector',
  category: 'editor',
  featured: true,
}
export const stage = 'full'

/* A self-contained design-editor apparatus wired to a small in-memory layer
 * model (no store, no network). It exercises the four ported members and their
 * shared coordinate contract:
 *
 *   EditorShell   — the two-rail frame (tool rail · canvas · inspector rail)
 *   Canvas        — the aspect stage that owns the 1080-virtual pixel space
 *   SelectionOverlay — bounding box + resize handles on the active box
 *   AlignmentGrid — aligns the active box to the artboard bounds
 *
 * Interactivity is local: click a box to select, drag to move, drag a handle
 * to resize, recolour via the inspector, align via the grid, add/duplicate/
 * delete via the tool rail. Boxes live in **1080-virtual coordinates**; screen
 * deltas convert to virtual by dividing by the live scale (stageWidth / 1080),
 * so the SelectionOverlay always registers with the box under Canvas's scale
 * layer. Aspect is 1:1 → the virtual artboard is 1080 × 1080. */

const VW = CANVAS_VIRTUAL_W          // 1080 — virtual artboard width
const VH = CANVAS_VIRTUAL_W          // 1:1 aspect → same height
const MIN = 24                       // min box side in virtual px

const INITIAL_BOXES = [
  { id: 'panel',  x: 96,  y: 150, w: 360, h: 320, color: '#4F7CFF', label: 'Panel' },
  { id: 'card',   x: 560, y: 210, w: 300, h: 220, color: '#F5C451', label: 'Card' },
  { id: 'banner', x: 300, y: 610, w: 430, h: 240, color: '#E0574F', label: 'Banner' },
]

/* Oversized grid backdrop behind the pan viewport — pure inline CSS so the set
 * stays self-contained (no external stylesheet). Overhangs the letterbox so
 * Space+drag panning never reveals an edge. */
const GRID_BACKDROP = (
  <div
    style={{
      position: 'absolute',
      left: '-200%', top: '-200%', width: '500%', height: '500%',
      backgroundColor: '#0E0E11',
      backgroundImage:
        'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px),' +
        'linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
      backgroundSize: '32px 32px',
    }}
  />
)

const TABS = [
  { id: 'design', label: 'Design' },
  { id: 'layers', label: 'Layers' },
]

export default function DesignEditorSet() {
  const [boxes, setBoxes]           = useState(INITIAL_BOXES)
  const [selectedId, setSelectedId] = useState('panel')
  const [tab, setTab]               = useState('design')
  const [drag, setDrag]             = useState(null)
  const stageRef = useRef(null)
  const idSeq    = useRef(1)

  const selectedBox = boxes.find((b) => b.id === selectedId) ?? null

  const patchBox = useCallback((id, patch) => {
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }, [])

  /* screen-px → virtual-px scale, read fresh from the stage rect each call
   * (ResizeObserver can't see the CSS transform Canvas applies to a parent). */
  const getScale = useCallback(() => {
    const node = stageRef.current
    if (!node) return 1
    const w = node.getBoundingClientRect().width
    return w > 0 ? w / VW : 1
  }, [])

  /* Figma-style pointer router: a resize handle wins, then a box (select +
   * move), then empty stage (deselect). */
  const onStageMouseDown = (e) => {
    if (e.button !== 0) return

    const handleEl = e.target.closest('[data-handle]')
    if (handleEl && selectedBox) {
      e.preventDefault()
      setDrag({
        mode: `resize-${handleEl.getAttribute('data-handle')}`,
        boxId: selectedBox.id,
        startX: e.clientX, startY: e.clientY,
        startBox: { ...selectedBox },
      })
      return
    }

    const boxEl = e.target.closest('[data-box-id]')
    if (boxEl) {
      const id = boxEl.getAttribute('data-box-id')
      const box = boxes.find((b) => b.id === id)
      setSelectedId(id)
      if (box) {
        e.preventDefault()
        setDrag({
          mode: 'move',
          boxId: id,
          startX: e.clientX, startY: e.clientY,
          startBox: { ...box },
        })
      }
      return
    }

    setSelectedId(null)
  }

  /* Window listeners while dragging — move/resize math in virtual coords. */
  useEffect(() => {
    if (!drag) return
    const onMove = (e) => {
      const s = getScale()
      const dx = (e.clientX - drag.startX) / s
      const dy = (e.clientY - drag.startY) / s
      const { startBox, mode, boxId } = drag

      if (mode === 'move') {
        patchBox(boxId, { x: startBox.x + dx, y: startBox.y + dy })
        return
      }

      let { x, y, w, h } = startBox
      const dir = mode.slice('resize-'.length)
      if (dir.includes('E')) w = Math.max(MIN, startBox.w + dx)
      if (dir.includes('S')) h = Math.max(MIN, startBox.h + dy)
      if (dir.includes('W')) { const nw = Math.max(MIN, startBox.w - dx); x = startBox.x + (startBox.w - nw); w = nw }
      if (dir.includes('N')) { const nh = Math.max(MIN, startBox.h - dy); y = startBox.y + (startBox.h - nh); h = nh }
      patchBox(boxId, { x, y, w, h })
    }
    const onUp = () => setDrag(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [drag, getScale, patchBox])

  /* Keyboard: Delete removes, Escape deselects, arrows nudge (±1 / ±10 with
   * Shift). Skips when typing into an input. */
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'Escape') { setSelectedId(null); return }
      if (!selectedBox) return
      if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); removeSelected(); return }
      const step = e.shiftKey ? 10 : 1
      const nudge =
        e.key === 'ArrowLeft'  ? [-step, 0] :
        e.key === 'ArrowRight' ? [step, 0]  :
        e.key === 'ArrowUp'    ? [0, -step] :
        e.key === 'ArrowDown'  ? [0, step]  : null
      if (nudge) {
        e.preventDefault()
        patchBox(selectedBox.id, { x: selectedBox.x + nudge[0], y: selectedBox.y + nudge[1] })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }) // no deps — re-bind each render so it closes over the live selection

  const addBox = () => {
    const id = `box-${idSeq.current++}`
    setBoxes((prev) => [...prev, { id, x: 380, y: 400, w: 300, h: 240, color: '#7AA5A0', label: 'Shape' }])
    setSelectedId(id)
  }

  const duplicateSelected = () => {
    if (!selectedBox) return
    const id = `box-${idSeq.current++}`
    setBoxes((prev) => [...prev, { ...selectedBox, id, x: selectedBox.x + 40, y: selectedBox.y + 40 }])
    setSelectedId(id)
  }

  const removeSelected = () => {
    if (!selectedId) return
    setBoxes((prev) => prev.filter((b) => b.id !== selectedId))
    setSelectedId(null)
  }

  /* Align the selected box to the artboard bounds (0..VW × 0..VH). */
  const alignSelected = (axis, mode) => {
    if (!selectedBox) return
    if (axis === 'h') {
      const x = mode === 'start' ? 0 : mode === 'center' ? (VW - selectedBox.w) / 2 : VW - selectedBox.w
      patchBox(selectedBox.id, { x })
    } else {
      const y = mode === 'start' ? 0 : mode === 'center' ? (VH - selectedBox.h) / 2 : VH - selectedBox.h
      patchBox(selectedBox.id, { y })
    }
  }

  /* ── slots ─────────────────────────────────────────────────────────── */

  const topbar = (
    <div className="flex items-center justify-between px-4 h-12">
      <span className="kol-helper-12 text-emphasis">Untitled composition</span>
      <span className="kol-mono-12 text-meta">
        {boxes.length} {boxes.length === 1 ? 'layer' : 'layers'}
        {selectedBox ? ` · ${selectedBox.label} selected` : ''}
      </span>
    </div>
  )

  const canvasHeader = (
    <div className="flex items-center justify-between px-4 h-9">
      <span className="kol-mono-12 text-meta">1:1 · 1080 × 1080</span>
      <span className="kol-mono-12 text-meta">Space + drag to pan</span>
    </div>
  )

  const toolRail = (
    <div className="flex flex-col items-center gap-1 p-2">
      <Button quiet iconOnly="pointer" iconSize={18} selected aria-label="Select" title="Select" style={{ width: 40, height: 40 }} />
      <div className="my-1 h-px w-6 bg-fg-08" />
      <Button quiet iconOnly="plus"  iconSize={18} onClick={addBox}            aria-label="Add box"    title="Add box"          style={{ width: 40, height: 40 }} />
      <Button quiet iconOnly="copy"  iconSize={18} onClick={duplicateSelected} aria-label="Duplicate"  title="Duplicate"        style={{ width: 40, height: 40 }} disabled={!selectedBox} />
      <Button quiet iconOnly="trash" iconSize={18} onClick={removeSelected}    aria-label="Delete"     title="Delete"           style={{ width: 40, height: 40 }} disabled={!selectedBox} />
    </div>
  )

  const rightHeader = (
    <TabsRow tabs={TABS} value={tab} onChange={setTab} />
  )

  const inspector = !selectedBox ? (
    <div className="p-4">
      <EmptyState
        eyebrow="Inspector"
        title="Nothing selected"
        body="Select a box on the canvas to edit its fill and alignment."
        footer="Tip: drag a handle to resize, arrow keys to nudge."
      />
    </div>
  ) : tab === 'design' ? (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <p className="kol-helper-10 text-meta">Fill</p>
        <ColorInputRow value={selectedBox.color} onChange={(hex) => patchBox(selectedBox.id, { color: hex })} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="kol-helper-10 text-meta">Align to artboard</p>
        <AlignmentGrid onAlign={alignSelected} />
      </div>

      <div className="flex flex-col gap-1 pt-1">
        <p className="kol-helper-10 text-meta">Dimensions</p>
        <p className="kol-mono-12 text-body">{Math.round(selectedBox.w)} × {Math.round(selectedBox.h)}</p>
        <p className="kol-mono-12 text-meta">X {Math.round(selectedBox.x)} · Y {Math.round(selectedBox.y)}</p>
      </div>
    </div>
  ) : (
    <ul className="flex flex-col p-2 gap-1">
      {boxes.map((b) => (
        <li key={b.id}>
          <button
            type="button"
            onClick={() => setSelectedId(b.id)}
            className={`flex items-center gap-3 w-full px-2 py-2 rounded text-left transition-colors ${b.id === selectedId ? 'bg-fg-08' : 'hover:bg-fg-04'}`}
          >
            <span className="w-4 h-4 shrink-0 rounded-sm" style={{ background: b.color }} />
            <span className="kol-mono-12 text-emphasis">{b.label}</span>
            <span className="kol-mono-12 text-meta ml-auto">{Math.round(b.w)}×{Math.round(b.h)}</span>
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <EditorShell
      height="min(88vh, 920px)"
      canvasBg="#0E0E11"
      railWidth={260}
      topbar={topbar}
      left={toolRail}
      canvasHeader={canvasHeader}
      rightHeader={rightHeader}
      right={inspector}
    >
      <Canvas aspect="1:1" bgColor="#17171C" panEnabled backdrop={GRID_BACKDROP}>
        <div
          ref={stageRef}
          className="relative w-full h-full"
          onMouseDown={onStageMouseDown}
        >
          {boxes.map((b) => (
            <div
              key={b.id}
              data-box-id={b.id}
              style={{
                position: 'absolute',
                left: b.x, top: b.y, width: b.w, height: b.h,
                background: b.color,
                cursor: 'move',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--kol-font-family-mono)',
                  fontSize: 20,
                  letterSpacing: '0.04em',
                  color: 'rgba(0,0,0,0.55)',
                  pointerEvents: 'none',
                }}
              >
                {b.label}
              </span>
            </div>
          ))}
          {selectedBox && <SelectionOverlay box={selectedBox} />}
        </div>
      </Canvas>
    </EditorShell>
  )
}
