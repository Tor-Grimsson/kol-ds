import { useState } from 'react'
import { Canvas, SelectionOverlay } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* Children render in a fixed 1080-virtual pixel space, so these boxes stay
 * proportional to the frame at any zoom or viewport size. */
const BOX = { x: 120, y: 150, w: 420, h: 420 }

/* The pan-zoom canvas is the whole seam in one frame (2026-09-03,
 * editor-set-is-behind-its-source): Space+drag pans, ⌘/ctrl+wheel or a pinch
 * zooms at the pointer, ⌘0 resets, the rulers read in VIRTUAL px, dragging off
 * a ruler makes a guide (drop it back on the ruler to delete), and `f` toggles
 * the fps chip.
 *
 * Zoom in and watch the SelectionOverlay: its handles, hairline and label stay
 * screen-constant because it divides by CanvasZoomContext, which this viewport
 * publishes. That is the pairing the first port of this set broke — pan-only,
 * no context, so handles drew 30px at 3×. */
export default function CanvasDemo() {
  const [guides, setGuides] = useState({ h: [270], v: [540] })

  return (
    <div className="flex flex-col gap-3">
      <div className="h-[420px] w-full overflow-hidden rounded border border-fg-16 bg-fg-04">
        <Canvas
          aspect="1:1"
          guideColor="var(--kol-surface-on-primary)"
          panEnabled
          guides={guides}
          setGuides={setGuides}
          backdrop={
            /* the consumer owns the backdrop — oversized so panning never
               reveals an edge, which is the contract the prop replaced the
               package's old hardwired grid with */
            <div
              className="absolute"
              style={{
                left: '-200%', top: '-200%', width: '500%', height: '500%',
                background: 'var(--kol-fg-02)',
              }}
            />
          }
        >
          <div
            style={{
              position: 'absolute',
              left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h,
              background: 'var(--kol-accent-primary)',
              borderRadius: 8,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 520, top: 520, width: 440, height: 340,
              border: '3px solid var(--kol-surface-on-primary)',
              borderRadius: 8,
            }}
          />
          <SelectionOverlay box={BOX} />
        </Canvas>
      </div>
      <span className="kol-helper-10 text-meta">
        Space+drag pans · ⌘/ctrl+wheel zooms at the pointer · ⌘0 resets · drag off a ruler for a guide · f toggles fps
      </span>
    </div>
  )
}
