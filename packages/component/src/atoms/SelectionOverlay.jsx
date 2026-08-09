/* taxonomy-ok: presentational transform-chrome overlay. It nests no KOL
 * component (pure inline-styled squares + label), so by the letter of the
 * molecule test it reads as an atom — but the lobby spec places it as a
 * molecule: a reusable compound bounding-box/handles primitive that pairs with
 * the Canvas scale layer, not a base atom. Kept here per that spec. */

/**
 * SelectionOverlay — pure transform chrome for a selected box.
 *
 * Renders a dashed outline, 8 named resize handles, and a `W × H` dimension
 * label, all positioned in the **same 1080-virtual coordinate space** the
 * target lives in (pairs with Canvas's scale layer — place it as a sibling of
 * the box inside the same scale layer). Each handle carries a
 * `data-handle="NW|N|NE|E|SE|S|SW|W"` attribute so a parent's pointer router
 * can start the right resize mode. No interaction logic of its own — the drag
 * math lives in the consumer, which reads `e.target.dataset.handle`.
 *
 * Ported from the brand editor with the `layer` model reduced to a flat `box`
 * (per lobby spec): renders nothing when there's no positional box.
 *
 * @param {{x:number,y:number,w:number,h:number}} box  virtual-coord position + size; null/x==null → renders nothing
 * @param {boolean}  showHandles  render the 8 resize handles (default true)
 * @param {boolean}  showLabel    render the `W × H` dimension label (default true)
 * @param {number}   handleSize   handle square size in virtual px (default 10)
 * @param {string}   accentColor  outline + handle + label color (default var(--kol-accent-primary))
 * @param {Function} labelFormatter (box) => string — dimension readout (default `${round(w)} × ${round(h)}`)
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

export default function SelectionOverlay({
  box,
  showHandles = true,
  showLabel = true,
  handleSize = 10,
  accentColor = 'var(--kol-accent-primary)',
  labelFormatter = (b) => `${Math.round(b.w)} × ${Math.round(b.h)}`,
}) {
  if (!box || box.x == null) return null  /* no positional box → no chrome */

  const { x, y, w, h } = box

  return (
    <div
      style={{
        position: 'absolute',
        left: x, top: y,
        width: w, height: h,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          outline: `1px dashed ${accentColor}`,
          outlineOffset: 0,
        }}
      />
      {showHandles && HANDLE_DIRS.map(({ dir, cursor, x: hx, y: hy }) => (
        <div
          key={dir}
          data-handle={dir}
          style={{
            position: 'absolute',
            left:   `calc(${hx * 100}% - ${handleSize / 2}px)`,
            top:    `calc(${hy * 100}% - ${handleSize / 2}px)`,
            width:  handleSize,
            height: handleSize,
            background: 'white',
            border: `1px solid ${accentColor}`,
            cursor,
            pointerEvents: 'auto',
          }}
        />
      ))}
      {showLabel && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: '100%',
            marginTop: 6,
            fontFamily: 'var(--kol-font-family-mono)',
            fontSize: 10,
            letterSpacing: '0.04em',
            color: accentColor,
            background: 'rgba(0,0,0,0.6)',
            padding: '2px 6px',
            borderRadius: 2,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {labelFormatter(box)}
        </span>
      )}
    </div>
  )
}
