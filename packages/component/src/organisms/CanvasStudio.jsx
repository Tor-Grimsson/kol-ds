import { useLayoutEffect, useRef } from 'react'
import { CanvasZoomContext } from '../hooks/canvasZoom.js'
import { useCanvasViewport, CANVAS_GRID_CELL, CANVAS_GRID_IMAGE } from '../hooks/canvasViewport.js'
import { Tooltip } from '../utilities/Popover.jsx'

/**
 * CanvasStudio — An infinite dotted surface to arrange things on. The studio canvas: the background the rack's
 * modules and the desk's channel strips sit on (the canvas family, 2026-10-23). kol-monitor's
 * `RackViewport` and kol-mirror's desk each carried a copy of it — the same dot grid, the same
 * Space-and-drag, their own zoom modifier — and `apps/rack` and `apps/mixer` run on this one now.
 *
 * It is the BACKGROUND ONLY: the dot grid, pan, zoom, the lock and the keys. What sits on it —
 * modules snapping to HP, the patch cables, the workbench, the desk's embla loop — stays the
 * app's, rendered as `children` (in the pan-zoom layer) or `overlay` (screen space, over it).
 * `CanvasEditor` is its sibling: a fixed artboard with rulers; both read `useCanvasViewport`,
 * so a gesture or a key means the same thing on either. The keys are `CANVAS_KEYS`.
 *
 * The grid: a 1px `--kol-fg-12` dot on a 36px cell, the cell scaled by the zoom and the field
 * offset by the pan, so the surface moves under the work. A consumer may host it on a bigger box
 * (monitor's Create paints it on the whole page) through `gridRef` — same cell, same offset.
 *
 * @param {boolean}  grid         the dot grid (default true); with `onGridChange` it is controlled
 * @param {Function} onGridChange (on) => void — `G` and the consumer's own toggle both land here
 * @param {boolean}  locked       the view lock — every pan and zoom returns early while on; with `onLockChange` controlled
 * @param {Function} onLockChange (on) => void — `L` lands here
 * @param {{zoom: number, x: number, y: number}} view  the view, controlled; `defaultView` seeds an uncontrolled one
 * @param {Object}   defaultView  `{ zoom, x, y }` (default zoom 1 at 0, 0)
 * @param {Function} onViewChange (view) => void — persist it if you want it back
 * @param {number}   minZoom      the zoom floor (default 0.1 — a 1716px rack fits a 390 phone)
 * @param {number}   maxZoom      the zoom ceiling (default 2)
 * @param {boolean}  fit          FIT THE HEIGHT on open (user 2026-10-23, the rack on a phone: *"youd have to start every time
 *                                by zooming in"*): the zoom that puts the content's full height in the surface, clamped, at
 *                                0, 0 — and ⌘0 returns to that fit, not to 100 %. The width may overhang; pan to it
 * @param {React.RefObject<HTMLElement>} gridRef  an element to paint the grid on INSTEAD of the surface — a bigger box
 * @param {React.RefObject<HTMLElement>} surfaceRef  a ref to the surface element, for an overlay that measures against it (cables)
 * @param {'studio'|'editor'|'none'} touch  the touch policy (default `studio`: one finger pans unless on a control, two pan and pinch)
 * @param {boolean}  spaceWhenOver  Space grabs only while the pointer is over the surface (an app whose Space is the transport's elsewhere)
 * @param {string}   ignore       a selector whose matches keep their own wheel and touch (an inner scroller); default fields and `[data-scroll-own]`
 * @param {Function} onSpaceTap   a Space press released without a pan
 * @param {ReactNode} backdrop    a node behind the children, inside the pan-zoom layer
 * @param {ReactNode} overlay     nodes in screen space over the layer — cables, chips
 * @param {string}   className    on the surface
 * @param {Object}   style        on the surface, last — `overflow` and `touchAction` may be overridden here
 * @param {ReactNode} children    what sits on the surface, in the pan-zoom layer
 */
export default function CanvasStudio({
  grid = true,
  onGridChange,
  locked,
  onLockChange,
  view,
  defaultView,
  onViewChange,
  minZoom = 0.1,
  maxZoom = 2,
  fit = false,
  gridRef,
  surfaceRef,
  touch = 'studio',
  spaceWhenOver = false,
  ignore,
  onSpaceTap,
  backdrop,
  overlay,
  className = '',
  style,
  children,
}) {
  const own = useRef(null)
  const ref = surfaceRef ?? own
  const layer = useRef(null)
  /* the fit: the layer's untransformed height (its own box, so zoom 1) against the surface's; nothing measurable → rest */
  const fitView = () => {
    const sh = ref.current?.clientHeight, h = layer.current?.scrollHeight
    if (!fit || !sh || !h) return undefined
    return { zoom: Math.min(maxZoom, Math.max(minZoom, sh / h)), x: 0, y: 0 }
  }
  const vp = useCanvasViewport({
    ref, view, defaultView, onViewChange, minZoom, maxZoom, rest: fitView,
    locked, onLockChange, grid, onGridChange, gridKey: true, lockKey: true,
    touch, spaceWhenOver, ignore, onSpaceTap,
  })
  const { zoom, x, y } = vp.view
  /* on open, the fit is the view — after layout, so the layer has its height */
  useLayoutEffect(() => { if (fit) vp.reset() }, [fit]) // eslint-disable-line react-hooks/exhaustive-deps
  const cell = `${CANVAS_GRID_CELL * zoom}px ${CANVAS_GRID_CELL * zoom}px`
  const gridStyle = vp.grid && !gridRef ? { backgroundImage: CANVAS_GRID_IMAGE, backgroundSize: cell, backgroundPosition: `${x}px ${y}px` } : null

  /* a hosted grid rides the same zoom and pan — the host keeps its own colour, only the dots are written */
  useLayoutEffect(() => {
    const el = gridRef?.current
    if (!el) return undefined
    if (vp.grid) {
      el.style.setProperty('background-image', CANVAS_GRID_IMAGE)
      el.style.setProperty('background-size', cell)
      el.style.setProperty('background-position', `${x}px ${y}px`)
    } else {
      el.style.removeProperty('background-image')
      el.style.removeProperty('background-size')
      el.style.removeProperty('background-position')
    }
    return undefined
  }, [gridRef, vp.grid, cell, x, y])

  return (
    <CanvasZoomContext.Provider value={zoom}>
      <div
        ref={ref}
        className={`kol-canvas-studio relative overflow-hidden select-none ${className}`.trim()}
        style={{ flex: 1, minHeight: 0, touchAction: touch === 'none' ? undefined : 'none', cursor: vp.cursor, ...gridStyle, ...style }}
      >
        {/* no transition on the transform: chrome that sizes by 1/zoom updates in the same frame */}
        <div ref={layer} style={{ transform: vp.transform, transformOrigin: '0 0', width: '100%', pointerEvents: vp.deaf ? 'none' : 'auto' }}>
          {backdrop}
          {children}
        </div>
        {overlay}
        {vp.showFps && (
          <div className="absolute bottom-3 right-3 z-[3]">
            <Tooltip label="Framerate — press F to hide" asChild>
              <span className="px-2 py-1 rounded border border-fg-08 bg-surface-secondary kol-mono-12 text-emphasis tabular-nums">{vp.fps} fps</span>
            </Tooltip>
          </div>
        )}
      </div>
    </CanvasZoomContext.Provider>
  )
}
