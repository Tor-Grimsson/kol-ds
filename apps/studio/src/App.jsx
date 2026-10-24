import { useState } from 'react'
import { PageShell } from '@kolkrabbi/kol-shell'
import { CanvasStudio, PageHeader } from '@kolkrabbi/kol-component'

/* THE STUDIO CANVAS ALONE (apps-tier naming D2: `apps/<tool>` is the tool, `apps/studio-hub` adds the Shell and Hub
 * around it; plan-2026-10-23 § 3.1). kol-component's `CanvasStudio` — the dotted surface monitor's rack and mirror's
 * desk sit on — under the tool frame, with a few real tiles to move around and nothing else.
 *
 *   Space + drag   grab and pan        ⌘ scroll / pinch   zoom at the pointer
 *   ⌘ 0            reset               G                  dot grid
 *   L              lock the view       F                  frame rate */

const TILES = ['clock', 'lfo', 'mixer', 'scope', 'noise', 'filter', 'sequencer', 'output']

export default function App() {
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 })
  return (
    <PageShell mode="fixed" className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader level="app" title="Studio" subtitle={`${Math.round(view.zoom * 100)}%`} />
      <div className="flex min-h-0 flex-1 flex-col" style={{ margin: '0 calc(var(--kol-shell-page-pad) * -1)' }}>
        <CanvasStudio className="flex-1" view={view} onViewChange={setView}>
          <div className="inline-flex flex-wrap gap-2" style={{ padding: 96, width: 1400 }}>
            {TILES.map((t) => (
              <img key={t} src={`/previews/modules/${t}.png`} alt={t} style={{ height: 240, width: 'auto', display: 'block', borderRadius: 'var(--kol-radius-xs)' }} />
            ))}
          </div>
        </CanvasStudio>
      </div>
    </PageShell>
  )
}
