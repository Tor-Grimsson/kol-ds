import { useCallback, useEffect, useRef, useState } from 'react'
import { CanvasGuides, CanvasRuler, CanvasZoomContext, SelectionOverlay } from '@kolkrabbi/kol-component'
import SlideRenderer from './SlideRenderer.jsx'
import { SLIDE_W, SLIDE_H } from './slideDoc.js'
import { computeSnapTargets, findSnap } from './snap.js'
/* taxonomy-ok: organism — SlideRenderer + kol-component's SelectionOverlay, CanvasRuler and CanvasGuides behind one pointer router */

/**
 * SlideStage — the editable slide (2026-09-03, the editor scope, step 2).
 *
 * kol-fxr's `CanvasArea` pointer router, cut to a deck's needs. The document
 * renders through `SlideRenderer` at 1920×1080 under a `zoom`, and the stage
 * routes mousedown by what was hit:
 *
 *   [data-handle] on the selection  → resize drag
 *   [data-layer-id]                 → select + move drag
 *   the stage itself                → deselect
 *
 * Pixel deltas divide by the live scale so a drag stays 1:1 with the cursor at
 * any zoom. Move snaps to the stage edges / centre and every other layer's
 * (fxr's snap.js). Arrows nudge 1 (⇧ 10), Delete removes, Escape deselects.
 *
 * Controlled: `doc` in, `onChange(nextDoc)` out; `selectedId` / `onSelect`
 * the same, so the inspector beside it edits what the stage has.
 *
 * THE CHROME IS THE PACKAGE'S (2026-09-03). The outline, the eight handles and
 * the `W × H` label were hand-rolled here against fxr's design; they are now
 * `SelectionOverlay` from kol-component, which speaks the same `data-handle`
 * contract the router below already read, so only the rendering moved. It also
 * brings the ROTATE handle, which this stage never had even though the document
 * model and the inspector both carried `rotate` — that is the `mode: 'rotate'`
 * branch in the drag handler.
 *
 * Still not lifted from fxr, and still not a deck's: groups, marquee select,
 * alt-from-centre, aspect lock, the tool palette.
 */
const MIN = 8       /* a box never collapses past this, stage px */
const ROT_SNAP = 15 /* degrees, while shift is held */
/* One frozen empty value, not a fresh `{h:[],v:[]}` per render — CanvasGuides
   keys effects on it and a new object every render would re-run them forever. */
const EMPTY_GUIDES = Object.freeze({ h: [], v: [] })
const RULER = 20   /* the gutter the rulers occupy, screen px */
/* THE LAYOUT GRID — the deck's own geometry, not a generic graph paper: the
   80px margin every eyebrow and foot already sits on, twelve columns inside it,
   and the two centre lines. kol-component dropped its hardwired `kol-grid-bg`
   in favour of a `backdrop` slot, and a backdrop is behind the FRAME anyway —
   a slide's grid has to be over the artwork, so it is ours to draw. */
const GRID_MARGIN = 80
const GRID_COLS = 12
/* fxr's guide colour — deliberately not a token: it has to pop on any fill */
const GUIDE = '#FF00C8'

export default function SlideStage({ doc, onChange, selectedId, selectedIds = [], onSelect, onEditStart, onEditEnd, showGrid = false }) {
  const wrapRef = useRef(null)   /* the container the rulers position against */
  const boxRef = useRef(null)    /* the frame the renderer draws into */
  const [scale, setScale] = useState(0)
  const [drag, setDrag] = useState(null)
  const [snap, setSnap] = useState(null)   /* transient snap line while dragging */

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => { if (e.contentRect.width > 0) setScale(e.contentRect.width / SLIDE_W) })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const selected = doc.layers.find((l) => l.id === selectedId) ?? null

  const patch = useCallback((id, partial) => {
    onChange({ ...doc, layers: doc.layers.map((l) => (l.id === id ? { ...l, ...partial } : l)) })
  }, [doc, onChange])
  /* MOVE MULTIPLE (user 2026-09-03: "missing stuff like bulk edit, or move
     multiple"). One delta applied to every selected layer in ONE onChange, so
     the group lands as a single history entry rather than N. Resize and rotate
     stay single — scaling a multi-selection about a shared origin is a
     different feature and needs a group bounding box. */
  const patchMany = useCallback((starts, dx, dy) => {
    onChange({
      ...doc,
      layers: doc.layers.map((l) => {
        const st = starts[l.id]
        return st ? { ...l, x: Math.round(st.x + dx), y: Math.round(st.y + dy) } : l
      }),
    })
  }, [doc, onChange])
  const remove = useCallback((id) => {
    onChange({ ...doc, layers: doc.layers.filter((l) => l.id !== id) })
    onSelect(null)
  }, [doc, onChange, onSelect])

  /* the router */
  const onMouseDown = (e) => {
    /* every branch below preventDefaults (no text selection mid-drag), which also stops the browser
       focusing the stage — so the keys (nudge, Delete, Esc) were dead after a click. Focus it here. */
    wrapRef.current?.focus({ preventScroll: true })
    const handleEl = e.target.closest('[data-handle]')
    if (handleEl && selected) {
      e.preventDefault()
      /* `ROT` is SelectionOverlay's rotate handle — the same `data-handle`
         channel as the eight resize dirs, so the router reads it the same way
         and only the mode differs. */
      const dir = handleEl.getAttribute('data-handle')
      const start = { x: selected.x, y: selected.y, w: selected.w, h: selected.h }
      onEditStart?.()
      setDrag({ mode: dir === 'ROT' ? 'rotate' : `resize-${dir}`, id: selected.id, startX: e.clientX, startY: e.clientY, start })
      return
    }
    const layerEl = e.target.closest('[data-layer-id]')
    if (layerEl) {
      const id = layerEl.getAttribute('data-layer-id')
      const l = doc.layers.find((x) => x.id === id)
      if (!l) return
      e.preventDefault()
      /* clicking a layer that is ALREADY part of a multi-selection keeps the
         selection and drags the group; clicking anything else selects just it */
      const inGroup = selectedIds.length > 1 && selectedIds.includes(id)
      if (!inGroup) onSelect(id)
      onEditStart?.()
      const group = inGroup ? selectedIds : [id]
      const starts = Object.fromEntries(
        doc.layers.filter((x) => group.includes(x.id)).map((x) => [x.id, { x: x.x, y: x.y }]),
      )
      setDrag({ mode: 'move', id, startX: e.clientX, startY: e.clientY, start: { x: l.x, y: l.y, w: l.w, h: l.h }, starts, group: inGroup })
      return
    }
    onSelect(null)
  }

  /* window listeners for the life of a drag */
  useEffect(() => {
    if (!drag) return
    const onMove = (e) => {
      const dx = (e.clientX - drag.startX) / scale
      const dy = (e.clientY - drag.startY) / scale
      const { start, id } = drag
      if (drag.mode === 'move') {
        if (drag.group) {
          /* no snapping on a group drag — the snap targets are per-box and
             snapping one member would shear the group apart */
          patchMany(drag.starts, dx, dy)
          return
        }
        const cand = { x: start.x + dx, y: start.y + dy, w: start.w, h: start.h }
        const sn = findSnap(cand, computeSnapTargets(doc.layers, id, SLIDE_W, SLIDE_H))
        patch(id, { x: Math.round(cand.x + sn.dx), y: Math.round(cand.y + sn.dy) })
        setSnap(sn.hGuide != null || sn.vGuide != null ? { h: sn.hGuide, v: sn.vGuide } : null)
        return
      }
      /* rotate about the box's centre. The handle floats ABOVE the top edge, so
         pointing straight up is 0° — hence the +90 on the atan2, which measures
         from the +x axis. Shift snaps to 15°. */
      if (drag.mode === 'rotate') {
        const rect = boxRef.current?.getBoundingClientRect()
        if (!rect) return
        const cx = rect.left + (start.x + start.w / 2) * scale
        const cy = rect.top + (start.y + start.h / 2) * scale
        let deg = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90
        if (e.shiftKey) deg = Math.round(deg / ROT_SNAP) * ROT_SNAP
        /* normalise into the inspector's own -180..180 stepper range */
        deg = ((Math.round(deg) + 180) % 360 + 360) % 360 - 180
        patch(id, { rotate: deg })
        return
      }
      let { x, y, w, h } = start
      const dir = drag.mode.slice('resize-'.length)
      if (dir.includes('E')) w = Math.max(MIN, start.w + dx)
      if (dir.includes('S')) h = Math.max(MIN, start.h + dy)
      if (dir.includes('W')) { const nw = Math.max(MIN, start.w - dx); x = start.x + (start.w - nw); w = nw }
      if (dir.includes('N')) { const nh = Math.max(MIN, start.h - dy); y = start.y + (start.h - nh); h = nh }
      patch(id, { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) })
    }
    const onUp = () => { setDrag(null); setSnap(null); onEditEnd?.() }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [drag, scale, doc.layers, patch, patchMany, onEditEnd])

  /* keyboard, only while the stage holds focus */
  const onKeyDown = (e) => {
    if (!selected) return
    const step = e.shiftKey ? 10 : 1
    if (e.key === 'ArrowLeft')  { e.preventDefault(); patch(selected.id, { x: selected.x - step }) }
    if (e.key === 'ArrowRight') { e.preventDefault(); patch(selected.id, { x: selected.x + step }) }
    if (e.key === 'ArrowUp')    { e.preventDefault(); patch(selected.id, { y: selected.y - step }) }
    if (e.key === 'ArrowDown')  { e.preventDefault(); patch(selected.id, { y: selected.y + step }) }
    if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); remove(selected.id) }
    if (e.key === 'Escape') onSelect(null)
  }

  const px = (n) => n / scale  /* screen px → stage px, for chrome that must not zoom */

  return (
    /* TWO BOXES, not one. The rulers position against the CONTAINER and measure
       the FRAME inside it, so a single element being both puts the ticks on top
       of the artwork — which is exactly what the first adoption did. The wrapper
       adds a gutter for them to live in; the frame keeps the 16:9 and the
       `overflow-hidden` that clips the slide. `boxRef` stays on the FRAME, since
       the scale observer and the rotate maths both want the drawn rect. */
    <div ref={wrapRef} className="relative isolate outline-none" style={{ paddingLeft: RULER, paddingTop: RULER }} tabIndex={0} onKeyDown={onKeyDown} onMouseDown={onMouseDown}>
      {/* RULERS + DRAGGABLE GUIDES, kol-component 0.203.0 — filed by this repo
          through kol-fxr and shipped the same night. The contract on our side is
          `position: relative` on this container and `data-canvas-frame` on the
          element the renderer draws into. `useFrameGeom` reads that element's
          rect, so it measures the RENDERED result and our CSS `zoom` needs no
          special case — fxr measured `zoom` against `transform: scale` and both
          report the same width, which is now in the component's own docstring.

          SIBLINGS OF THE FRAME, not children of it. They position absolutely
          against the nearest positioned ancestor, so nested inside the frame
          they drew their ticks ON TOP of the artwork — which is what the first
          attempt did. Out here they land in the padding gutter.

          `virtualWidth={1920}` is the prop we asked for: the rulers were only
          ever exercised at 1080. Guides live on the DOCUMENT, so they undo with
          everything else and persist with the draft. */}
      <CanvasRuler containerRef={wrapRef} virtualWidth={SLIDE_W} />
      <CanvasGuides
        containerRef={wrapRef}
        virtualWidth={SLIDE_W}
        guides={doc.guides ?? EMPTY_GUIDES}
        setGuides={(next) => onChange({ ...doc, guides: typeof next === 'function' ? next(doc.guides ?? EMPTY_GUIDES) : next })}
        interactive
      />
      <div ref={boxRef} data-canvas-frame className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
      {scale > 0 && (
        /* THE ZOOM SEAM. The DS's editing chrome renders in stage px inside our
           zoomed layer and divides every screen-constant dimension by whatever
           this context carries — so handing it our CSS `zoom` is what keeps
           handles, hairlines and the label the same size at any stage width.
           The context defaults to 1, so without this provider the chrome would
           silently scale with the slide; that is the exact regression kol-fxr
           reverted an adoption over. */
        <CanvasZoomContext.Provider value={scale}>
          <div style={{ width: SLIDE_W, height: SLIDE_H, zoom: scale, cursor: drag?.mode === 'move' ? 'grabbing' : undefined }}>
            <SlideRenderer doc={doc}>
              {/* the package's chrome — the eight resize handles on the same
                  `data-handle` contract our router already read, plus the rotate
                  handle we never had. `pointerEvents` is the overlay's own. */}
              {/* `accentColor` is ABSOLUTE, not the accent token. The token now
                  flips with the app theme (accent.css took it off Kolkrabbi's
                  yellow and back onto `surface-on-primary`), but a slide's ground
                  is `--kol-color-absolute-black` in BOTH themes — so on the light
                  theme the default would paint near-black chrome on a black
                  slide and the selection would vanish. Same reasoning as the
                  filmstrip's `text-ab-white`. */}
              {selected && (
                <SelectionOverlay
                  box={{ x: selected.x, y: selected.y, w: selected.w, h: selected.h, rotation: selected.rotate ?? 0 }}
                  accentColor="var(--kol-color-absolute-white)"
                />
              )}
              {/* off by default, `G` toggles it — see the editor's key handler */}
              {showGrid && (
                <>
                  {Array.from({ length: GRID_COLS + 1 }, (_, i) => {
                    const x = GRID_MARGIN + ((SLIDE_W - GRID_MARGIN * 2) / GRID_COLS) * i
                    return <div key={`c${i}`} style={{ position: 'absolute', left: x, top: 0, width: px(1), height: SLIDE_H, background: 'var(--kol-color-absolute-white)', opacity: 0.12, pointerEvents: 'none' }} />
                  })}
                  <div style={{ position: 'absolute', left: 0, top: GRID_MARGIN, width: SLIDE_W, height: px(1), background: 'var(--kol-color-absolute-white)', opacity: 0.12, pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', left: 0, top: SLIDE_H - GRID_MARGIN, width: SLIDE_W, height: px(1), background: 'var(--kol-color-absolute-white)', opacity: 0.12, pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', left: SLIDE_W / 2, top: 0, width: px(1), height: SLIDE_H, background: 'var(--kol-color-absolute-white)', opacity: 0.24, pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', left: 0, top: SLIDE_H / 2, width: SLIDE_W, height: px(1), background: 'var(--kol-color-absolute-white)', opacity: 0.24, pointerEvents: 'none' }} />
                </>
              )}
              {snap?.h != null && <div style={{ position: 'absolute', left: snap.h, top: 0, width: px(1), height: SLIDE_H, background: GUIDE, pointerEvents: 'none', zIndex: 99 }} />}
              {snap?.v != null && <div style={{ position: 'absolute', top: snap.v, left: 0, height: px(1), width: SLIDE_W, background: GUIDE, pointerEvents: 'none', zIndex: 99 }} />}
            </SlideRenderer>
          </div>
        </CanvasZoomContext.Provider>
      )}
      </div>
    </div>
  )
}
