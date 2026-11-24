import { useRef, useState } from 'react'
import { useZoom } from '../shell/zoomStore'
import { SelectionOverlay } from '@kolkrabbi/kol-component'
import { useChrome } from '../float/chrome'

/* THE FRAME'S CHROME (plan-2026-11-18-kolbox-system 28.1, 28.2; his design 149:26890, SelectionBox 28:9356): the
 * outline, the four corner handles and the name label, drawn inside the stage (the frame's 1080-wide virtual space)
 * and sized in SCREEN px by dividing by the stage's screen scale (fit × zoom), so they hold at every zoom.
 *
 *   outline   1px accent, while the frame is selected, dragged or hovered (its label or its edge band)
 *   handles   four 6 × 6 accent squares centred on the corners, while selected
 *   label     the frame's name, 1 out and 25 up from its top left, 18 high, 8 by 2 in, radius 4, sans medium 10 / 14:
 *             plain words: in the accent while selected, muted otherwise (a frame title); never a pill
 *
 * A press on the label is the stage's (CanvasArea's onStageMouseDown): a drag moves the frame, a click selects it. A
 * double-click on the label renames the frame in place: Enter or leaving the field commits, Escape cancels. The colors
 * are the page's (index.lib.css: --kol-canvas-*), not the editor's teal.
 *
 * FRAMES AS OBJECTS (plan-2026-11-19-kolbox-whats-left C1): with `box`, the chrome sits on that frame's box in the
 * page and its handles resize it (`data-handle`, the stage's own resize path); `origin` marks the frame the rulers,
 * the guides and zoom fit read. Without `box` it is the one built-in frame's, as before. A frame turns (W5): the chrome
 * turns with it about its centre, and the selection's corner zones rotate it as they rotate a shape. */
const HANDLE = 6
const CORNERS = [[0, 0], [1, 0], [0, 1], [1, 1]]
const CORNER_DIR = { '00': 'NW', '10': 'NE', '01': 'SW', '11': 'SE' }

/* screen px per virtual px (fit × zoom), as CanvasArea's ZoomProbe publishes it from inside the viewport. Shared with
   CanvasArea's selection, which sits outside the viewport's zoom context, so a frame and a layer draw the same 1 px. */
export function useScreenScale() {
  return useZoom() || 1
}

export default function FrameChrome({ stageRef, selected, hover, name, onRename, onLabelHover, box, origin }) {
  const s = useScreenScale()
  const k = 1 / s /* virtual px per screen px */
  /* THE KOLBOX STYLE (plan-2026-11-19-kolbox-whats-left R2): a drawn frame's line, handles and size chip are the one
     selection drawing every layer has (SelectionOverlay variant="kolbox"); only the name above stays the frame's */
  const kolbox = useChrome() === 'kolbox' && !!box

  const [renaming, setRenaming] = useState(false)
  const cancel = useRef(false)
  const label = name || (box ? 'Frame' : 'Canvas')
  const commit = (value) => {
    if (!cancel.current) onRename(value)
    cancel.current = false
    setRenaming(false)
  }
  const lit = selected || renaming

  return (
    <div
      aria-hidden={!renaming}
      className={`absolute pointer-events-none ${box ? '' : 'inset-0'}`}
      style={{ zIndex: 5, ...(box ? { left: box.x, top: box.y, width: box.w, height: box.h, transform: box.rotation ? `rotate(${box.rotation}deg)` : undefined } : null) }}
      data-frame-chrome
      data-frame-id={box?.id}
      data-ruler-origin={origin ? '' : undefined}
    >
      {kolbox && (lit || hover) && (
        <SelectionOverlay variant="kolbox" box={{ x: 0, y: 0, w: box.w, h: box.h }} scale={s} showHandles={lit} showRotate={lit} showLabel={lit} />
      )}
      {!kolbox && (lit || hover) && (
        /* a spread shadow, not an outline: the browser rounds an outline's width to whole layout px before the
           zoom scales it, so 1 screen px drew 0.59 */
        <div className="absolute inset-0" style={{ boxShadow: `0 0 0 ${k}px var(--kol-accent-primary)` }} data-frame-outline />
      )}
      {!kolbox && lit && CORNERS.map(([x, y]) => (
        <div
          key={`${x}${y}`}
          data-frame-handle
          data-handle={box ? CORNER_DIR[`${x}${y}`] : undefined}
          className="absolute"
          style={{
            ...(box ? { pointerEvents: 'auto', cursor: x === y ? 'nwse-resize' : 'nesw-resize' } : null),
            left: `${x * 100}%`, top: `${y * 100}%`,
            width: HANDLE * k, height: HANDLE * k, marginLeft: -(HANDLE / 2) * k, marginTop: -(HANDLE / 2) * k,
            background: 'var(--kol-accent-primary)',
          }}
        />
      ))}
      <div
        data-frame-label
        onDoubleClick={(e) => { e.stopPropagation(); setRenaming(true) }}
        onPointerEnter={() => onLabelHover?.(true)}
        onPointerLeave={() => onLabelHover?.(false)}
        className="absolute flex items-center whitespace-nowrap select-none"
        style={{
          left: 0, top: -22 * k,
          transform: `scale(${k})`, transformOrigin: '0 0',
          height: 18, padding: '2px 0',
          fontFamily: 'var(--kol-font-family-sans)', fontSize: 10, lineHeight: '14px', fontWeight: 500,
          /* no pill: the name is plain words, in the accent while the frame is selected, muted otherwise (his ruling
           * 2026-11-19: "the title doesnt get background when selected, this is wrong"; Figma's frame name) */
          color: lit || (kolbox && hover) ? 'var(--kol-accent-primary)' : 'var(--kol-canvas-label, var(--kol-fg-64))',
          pointerEvents: 'auto',
          cursor: 'default',
        }}
      >
        {renaming ? (
          <input
            autoFocus
            aria-label="Frame name"
            defaultValue={name ?? ''}
            placeholder={box ? 'Frame' : 'Canvas'}
            size={Math.max(6, label.length + 2)}
            onFocus={(e) => e.target.select()}
            onMouseDown={(e) => e.stopPropagation()}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Enter') e.currentTarget.blur()
              else if (e.key === 'Escape') { cancel.current = true; e.currentTarget.blur() }
            }}
            className="bg-transparent outline-none p-0 m-0 border-0"
            style={{ font: 'inherit', color: 'inherit', width: 'auto', userSelect: 'text' }}
          />
        ) : label}
      </div>
    </div>
  )
}
