import { useEffect, useRef, useState } from 'react'

/**
 * Canvas — the editor's aspect-ratio stage.
 *
 * A letterboxed frame (dashed guide border + mono ratio label) that hosts its
 * children in a **fixed 1080-virtual-pixel coordinate space** and scales the
 * whole layer to fit the viewport via a single CSS `transform`. Because
 * children always render at 1080px-wide logical coords, a `168px` element is
 * always `168/1080` of the frame regardless of zoom or viewport size — the
 * scale seam is the only place real pixels enter. This 1080-virtual contract
 * is the whole point: anything placed inside (SelectionOverlay, boxes, guides)
 * shares it, so a consumer's drag math converts screen deltas to virtual by
 * dividing by the live scale (frameWidth / 1080).
 *
 * Three parts ship from this file: `CanvasFrame` (the bare scale layer),
 * `Canvas` (the letterbox, default export), and `PanViewport` (Space+drag pan).
 * Export all three so a consumer can place a bare frame or compose their own
 * viewport.
 *
 * Ported from the brand editor with three app-couplings dropped (per lobby
 * spec): the static `ASPECTS` table → an `aspects` prop (+ DEFAULT_ASPECTS);
 * the `#0E0E11` dark bg default → `transparent` (let the theme own the stage);
 * and the hardwired `kol-grid-bg` grid → a `backdrop` slot the consumer fills.
 */

/* Fixed virtual canvas width — children render in this pixel space and the
 * outer rect scales to fit the viewport via CSS transform. Height is derived
 * from the active aspect ratio. Load-bearing: the coordinate contract. */
export const CANVAS_VIRTUAL_W = 1080

/* Sensible DS default ratio table; a consumer passes its own `aspects` to
 * override. Each entry is { id, label, ratio }. */
export const DEFAULT_ASPECTS = [
  { id: '1:1',  label: '1:1',  ratio: 1 },
  { id: '4:5',  label: '4:5',  ratio: 4 / 5 },
  { id: '9:16', label: '9:16', ratio: 9 / 16 },
  { id: '5:4',  label: '5:4',  ratio: 5 / 4 },
  { id: '16:9', label: '16:9', ratio: 16 / 9 },
]

export const CANVAS_DEFAULTS = {
  guideColor: '#F5F3EF',
}

function resolveAspect(aspect, customRatio, aspects) {
  const table = aspects?.length ? aspects : DEFAULT_ASPECTS
  const found = table.find((x) => x.id === aspect) ?? table[0]
  const ratio = aspect === 'custom' && customRatio ? customRatio : found.ratio
  const label = aspect === 'custom' && customRatio
    ? `Custom · ${Number(customRatio).toFixed(2)}`
    : found.label
  return { ratio, label }
}

/**
 * Bare aspect frame — dashed guide border + label + virtual-pixel scale layer.
 * No outer letterbox. Sizes to its parent (`width: 100%; aspect-ratio: ratio`)
 * so the parent decides the frame's width/height.
 *
 * @param {string}   aspect      aspect id, selects ratio+label from the table
 * @param {number}   customRatio numeric ratio + `Custom · N.NN` label when aspect==='custom'
 * @param {Array}    aspects     [{ id, label, ratio }] ratio table (default DEFAULT_ASPECTS)
 * @param {string}   bgColor     frame background fill (default transparent)
 * @param {string}   guideColor  dashed border (@24%) + label (@70%) color
 * @param {ReactNode} children   rendered in the 1080-virtual scale layer
 */
export function CanvasFrame({
  aspect,
  customRatio,
  aspects,
  bgColor,
  guideColor = CANVAS_DEFAULTS.guideColor,
  children,
}) {
  const { ratio, label } = resolveAspect(aspect, customRatio, aspects)
  const virtualH = CANVAS_VIRTUAL_W / ratio

  const rectRef = useRef(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const node = rectRef.current
    if (!node) return
    const compute = () => {
      const w = node.getBoundingClientRect().width
      if (w > 0) setScale(w / CANVAS_VIRTUAL_W)
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(node)
    return () => ro.disconnect()
  }, [ratio])

  return (
    <div
      ref={rectRef}
      className="relative w-full"
      style={{
        aspectRatio: ratio,
        background:  bgColor ?? 'transparent',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          border:      '1px solid',
          borderColor: `color-mix(in srgb, ${guideColor} 24%, transparent)`,
        }}
      />
      <span
        className="z-[2]"
        style={{
          position:      'absolute',
          top:           6,
          left:          8,
          fontSize:      10,
          fontFamily:    'var(--kol-font-family-mono)',
          letterSpacing: '0.1em',
          color:         `color-mix(in srgb, ${guideColor} 70%, transparent)`,
          pointerEvents: 'none',
        }}
      >
        {label}
      </span>
      {scale > 0 && (
        <div
          className="absolute top-0 left-0 z-[1]"
          style={{
            width:           `${CANVAS_VIRTUAL_W}px`,
            height:          `${virtualH}px`,
            transformOrigin: 'top left',
            transform:       `scale(${scale})`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * Canvas — letterboxed stage (default export).
 *
 * The OUTER wrapper letterboxes the inner `<CanvasFrame>` (rect carries the
 * optional `bgColor`, dashed border, label, and virtual-pixel scale layer).
 *
 * `panEnabled` opts into Space-key + drag panning. When held, the cursor
 * flips to grab/grabbing and the frame translates with the cursor; pointer
 * events on the frame are suppressed while Space is held so layer handlers
 * don't fire mid-pan. Decorative chrome (grid bg / dark bg / inset borders)
 * is the consumer's responsibility — pass a `backdrop` node to fill the pan
 * viewport behind the frame.
 *
 * @param {string}    aspect      aspect id (see aspects table)
 * @param {number}    customRatio numeric ratio when aspect==='custom'
 * @param {Array}     aspects     [{ id, label, ratio }] ratio table
 * @param {string}    bgColor     frame background fill
 * @param {string}    guideColor  guide border + label color
 * @param {'center'|'start'} align vertical placement in the letterbox
 * @param {boolean}   panEnabled  wrap in a Space+drag PanViewport
 * @param {ReactNode} backdrop    node placed behind the frame in the pan viewport (e.g. a grid)
 * @param {ReactNode} children    rendered in the 1080-virtual scale layer
 */
export default function Canvas({
  aspect,
  customRatio,
  aspects,
  bgColor,
  guideColor = CANVAS_DEFAULTS.guideColor,
  align = 'center',
  panEnabled = false,
  backdrop,
  children,
}) {
  const { ratio } = resolveAspect(aspect, customRatio, aspects)

  const letterbox = (
    <div
      className={`flex ${align === 'start' ? 'items-start' : 'items-center'} justify-center w-full h-full`}
      style={{ containerType: 'size' }}
    >
      <div
        style={{
          width: `min(calc(100cqw - 48px), calc((100cqh - 48px) * ${ratio}))`,
        }}
      >
        <CanvasFrame
          aspect={aspect}
          customRatio={customRatio}
          aspects={aspects}
          bgColor={bgColor}
          guideColor={guideColor}
        >
          {children}
        </CanvasFrame>
      </div>
    </div>
  )

  if (!panEnabled) return letterbox
  return <PanViewport backdrop={backdrop}>{letterbox}</PanViewport>
}

/**
 * PanViewport — Space + drag pan wrapper.
 *
 * Hold Space → cursor `grab`. Mousedown while held → drag-pan, cursor
 * `grabbing`. The pan transform applies to the child div that holds the frame;
 * the viewport itself stays fixed. Pointer events on the transform layer
 * disable while Space is held so layer-level mousedowns don't fire mid-pan.
 * At rest the cursor is left unset so a consumer's tool cursor shows through.
 *
 * @param {ReactNode} backdrop  placed behind the frame (grid / dark bg); the
 *                              consumer owns its sizing (oversize it so panning
 *                              never reveals an edge)
 * @param {ReactNode} children  the letterboxed frame
 */
export function PanViewport({ backdrop, children }) {
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [pan, setPan]             = useState({ x: 0, y: 0 })
  const [dragging, setDragging]   = useState(false)
  const dragStart                 = useRef(null)

  useEffect(() => {
    const isInputTarget = (el) =>
      el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
    const onKeyDown = (e) => {
      if (e.code === 'Space' && !isInputTarget(e.target)) {
        e.preventDefault()
        setSpaceHeld(true)
      }
    }
    const onKeyUp = (e) => {
      if (e.code === 'Space') {
        setSpaceHeld(false)
        setDragging(false)
        dragStart.current = null
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      if (!dragStart.current) return
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      })
    }
    const onUp = () => {
      setDragging(false)
      dragStart.current = null
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  const onMouseDown = (e) => {
    if (!spaceHeld) return
    e.preventDefault()
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    setDragging(true)
  }

  const cursor = dragging ? 'grabbing' : spaceHeld ? 'grab' : undefined

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={cursor ? { cursor } : undefined}
      onMouseDown={onMouseDown}
    >
      <div
        className="absolute inset-0"
        style={{
          transform:     `translate(${pan.x}px, ${pan.y}px)`,
          transition:    dragging ? 'none' : 'transform 120ms ease-out',
          pointerEvents: spaceHeld ? 'none' : 'auto',
        }}
      >
        {backdrop}
        <div className="relative w-full h-full">{children}</div>
      </div>
    </div>
  )
}
