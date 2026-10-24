import { useState } from 'react'
import { CanvasStudio } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* The studio canvas — the infinite dotted surface kol-monitor's rack and kol-mirror's desk sit on
 * (the canvas family, 2026-10-23; CanvasEditor is the artboard, both on useCanvasViewport). The
 * surface is the background only: a few placeholder tiles stand on it here, where an app puts its
 * modules. Space+drag or middle-drag pans, a plain scroll pans, ⌘ wheel or a pinch zooms at the
 * pointer, ⌘0 resets, G toggles the grid, L locks the view, F shows the framerate. */
const TILES = [
  { x: 80, y: 80, w: 220, h: 140, label: 'Clock' },
  { x: 340, y: 80, w: 160, h: 140, label: 'LFO' },
  { x: 80, y: 260, w: 420, h: 120, label: 'Mixer' },
]

export default function CanvasStudioPreview() {
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 })
  const [grid, setGrid] = useState(true)
  const [locked, setLocked] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-[420px] w-full flex-col overflow-hidden rounded border border-fg-16 bg-fg-02">
        <CanvasStudio view={view} onViewChange={setView} grid={grid} onGridChange={setGrid} locked={locked} onLockChange={setLocked}>
          {TILES.map((t) => (
            <div
              key={t.label}
              className="absolute flex items-center justify-center rounded border border-fg-16 bg-surface-secondary kol-mono-12 text-emphasis"
              style={{ left: t.x, top: t.y, width: t.w, height: t.h }}
            >
              {t.label}
            </div>
          ))}
        </CanvasStudio>
      </div>
      <span className="kol-helper-10 text-meta">
        {`Zoom ${Math.round(view.zoom * 100)}%, grid ${grid ? 'on' : 'off'}, ${locked ? 'locked' : 'unlocked'} — Space+drag pans, ⌘ wheel zooms, ⌘0 resets, G grid, L lock, F fps`}
      </span>
    </div>
  )
}
