import { useContext } from 'react'
import { CanvasZoomContext } from '../hooks/canvasZoom.js'
import { Tooltip } from '../utilities/Popover.jsx'

/* taxonomy-ok: presentational transform-chrome overlay. It nests no KOL
 * component (pure inline-styled squares + label), so by the letter of the
 * molecule test it reads as an atom — but the lobby spec places it as a
 * molecule: a reusable compound bounding-box/handles primitive that pairs with
 * the Canvas scale layer, not a base atom. Kept here per that spec. */

/**
 * SelectionOverlay — pure transform chrome for a selected box.
 *
 * Renders a dashed outline, 8 named resize handles, a rotate handle and a
 * `W × H` dimension label, all positioned in the **same 1080-virtual
 * coordinate space** the target lives in (pairs with Canvas's scale layer —
 * place it as a sibling of the box inside the same scale layer). Each handle
 * carries a `data-handle="NW|N|NE|E|SE|S|SW|W|ROT"` attribute so a parent's
 * pointer router can start the right drag mode. No interaction logic of its
 * own — the drag math lives in the consumer, which reads
 * `e.target.dataset.handle`.
 *
 * Ported from kol-fxr's editor with the `layer` model reduced to a flat `box`
 * (per lobby spec): renders nothing when there's no positional box.
 *
 * ZOOM COMPENSATION IS THE POINT (restored 2026-09-03,
 * `editor-set-is-behind-its-source`). The chrome renders in virtual px INSIDE
 * the canvas's zoomed transform, so every screen-constant dimension — handle
 * size, outline width, the rotate handle's offset, the label — divides by the
 * live zoom from `CanvasZoomContext`. The first port hardcoded `1px` / `10px`
 * / `marginTop: 6`, so at 3× the handles drew 30px and the label ballooned;
 * kol-fxr measured it and reverted the adoption. Outside a `PanZoomViewport`
 * the context is 1 and every division is a no-op, so a static canvas is
 * unaffected.
 *
 * The label also counter-SCALES rather than just re-sizing: `scale(1/zoom)`
 * keeps its padding, radius and letter-spacing screen-constant too, which a
 * font-size alone does not.
 *
 * THE LABEL DOES NOT ROTATE (SelectionOverlayLabelUpright, kol-fxr 2026-10-13 —
 * user: *"the size here glued to the side is so small it can't be read"*). It
 * sits outside the rotated chrome, upright and centred under the rotated box's
 * BOUNDS — Figma's chip — so at −90° it reads below the box instead of standing
 * on end against its side. 12px.
 *
 * @param {{x:number,y:number,w:number,h:number,rotation?:number}} box  virtual-coord position + size; null/x==null → renders nothing. `rotation` in degrees turns the chrome with the box about its centre
 * @param {boolean}  showHandles  render the 8 resize handles (default true)
 * @param {boolean}  showRotate   render the rotate handle (default: follows `showHandles`) — independent because a path hides the resize handles, node-edit owning their geometry, and still rotates
 * @param {boolean}  showLabel    render the `W × H` dimension label (default true)
 * @param {number}   handleSize   handle square size in virtual px BEFORE zoom compensation (default 10)
 * @param {string}   accentColor  outline + handle + label color (default var(--kol-accent-primary))
 * @param {Function} labelFormatter (box) => string — dimension readout (default `${round(w)} × ${round(h)}`)
 * @param {string}   rotateTitle  tooltip on the rotate handle (default 'Rotate')
 */
const HANDLE_DIRS = [
  { dir: 'NW', cursor: 'nwse-resize', x: 0,    y: 0    },
  { dir: 'N',  cursor: 'ns-resize',   x: 0.5,  y: 0    },
  { dir: 'NE', cursor: 'nesw-resize', x: 1,    y: 0    },
  { dir: 'E',  cursor: 'ew-resize',   x: 1,    y: 0.5  },
  { dir: 'SE', cursor: 'nwse-resize', x: 1,    y: 1    },
  { dir: 'S',  cursor: 'ns-resize',   x: 0.5,  y: 1    },
  { dir: 'SW', cursor: 'nesw-resize', x: 0,    y: 1    },
  { dir: 'W',  cursor: 'ew-resize',   x: 0,    y: 0.5  },
]

/* The rotate handle's float above the top edge, in virtual px before zoom
 * compensation — fxr's number. */
const ROTATE_OFFSET = 22

export default function SelectionOverlay({
  box,
  showHandles = true,
  showRotate,
  showLabel = true,
  handleSize = 10,
  accentColor = 'var(--kol-accent-primary)',
  labelFormatter = (b) => `${Math.round(b.w)} × ${Math.round(b.h)}`,
  rotateTitle = 'Rotate',
}) {
  /* Chrome renders in virtual px inside the zoomed transform — divide by zoom
   * so handles / outline / label stay screen-constant at any zoom. 1 outside a
   * PanZoomViewport, which makes every division below a no-op. */
  const zoom = useContext(CanvasZoomContext)

  if (!box || box.x == null) return null  /* no positional box → no chrome */

  const { x, y, w, h } = box
  const size = handleSize / zoom
  const hairline = 1 / zoom
  const rotate = showRotate ?? showHandles
  /* `rotation` may arrive as a BINDING OBJECT on an animated prop; chrome uses
   * the base 0 rather than throwing on `${{…}}deg` — editing chrome over
   * animated transforms is a consumer-side v1 limitation, and fxr's guard. */
  const rot = typeof box.rotation === 'number' ? box.rotation : 0
  /* half the rotated box's axis-aligned height — the label hangs below that, centred */
  const rad = (rot * Math.PI) / 180
  const halfBoundsH = (Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad))) / 2
  /* …and clear the rotate handle when the box points down (SelectionOverlayLabelClearsRotateHandle,
   * kol-fxr 2026-10-13: at 180° the handle sat on the label's ×). The handle's centre, from the box
   * centre, after the chrome's rotation; if it falls in the label's column below the box, the label
   * hangs under the handle instead. Label width estimated from its text — mono, 12px. */
  const labelText = showLabel ? labelFormatter(box) : ''
  const handleDy = -(h / 2) - ROTATE_OFFSET / zoom + size / 2
  const handleX = -handleDy * Math.sin(rad)
  const handleY = handleDy * Math.cos(rad)
  const labelHalfW = (labelText.length * 7.5 + 12) / 2 / zoom
  const clearsHandle = rotate && handleY > 0 && Math.abs(handleX) < labelHalfW + size / 2
  const labelBelow = Math.max(halfBoundsH, clearsHandle ? handleY + size / 2 : 0)

  return (
    <>
    <div
      style={{
        position: 'absolute',
        left: x, top: y,
        width: w, height: h,
        /* the chrome rotates WITH the box (centre origin) so the wireframe and
         * the handles hug the actually-rendered box, not its unrotated slot */
        transform: rot ? `rotate(${rot}deg)` : undefined,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          outline: `${hairline}px dashed ${accentColor}`,
          outlineOffset: 0,
        }}
      />
      {/* rotate handle — a circle floating above the top edge; a drag rotates
        * the box about its centre. Independent of the resize handles: a path
        * hides those (node-edit owns their geometry) and still rotates. */}
      {rotate && (
        <Tooltip label={rotateTitle} asChild>
        <div
          data-handle="ROT"
          style={{
            position: 'absolute',
            left: `calc(50% - ${size / 2}px)`,
            top: -(ROTATE_OFFSET / zoom),
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'white',
            border: `${hairline}px solid ${accentColor}`,
            cursor: 'grab',
            pointerEvents: 'auto',
          }}
        />
        </Tooltip>
      )}
      {showHandles && HANDLE_DIRS.map(({ dir, cursor, x: hx, y: hy }) => (
        <div
          key={dir}
          data-handle={dir}
          style={{
            position: 'absolute',
            left:   `calc(${hx * 100}% - ${size / 2}px)`,
            top:    `calc(${hy * 100}% - ${size / 2}px)`,
            width:  size,
            height: size,
            background: 'white',
            border: `${hairline}px solid ${accentColor}`,
            cursor,
            pointerEvents: 'auto',
          }}
        />
      ))}
    </div>
      {showLabel && (
        <span
          style={{
            position: 'absolute',
            left: x + w / 2,
            top: y + h / 2 + labelBelow + 6 / zoom,
            /* counter-scale, not just a smaller font: padding, radius and
             * tracking have to stay screen-constant too */
            transform: `translateX(-50%) scale(${1 / zoom})`,
            transformOrigin: 'top center',
            fontFamily: 'var(--kol-font-family-mono)',
            fontSize: 12,
            letterSpacing: '0.04em',
            color: accentColor,
            background: 'rgba(0,0,0,0.6)', /* a label chip on a canvas, not a scrim (sweep 2026-09-03) */
            padding: '2px 6px',
            borderRadius: 2,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          {labelText}
        </span>
      )}
    </>
  )
}
