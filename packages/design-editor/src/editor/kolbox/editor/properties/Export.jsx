import { useState } from 'react'
import { findLayerDeep, useComposeState } from '../engine.js'
import { regionFile, regionsOf, SCALES, STILL_FORMATS, writeFiles } from '../export/render.js'
import { Act } from './parts.jsx'
import { Button, Dropdown, FieldPair, Input, LabeledControlSection } from '@kolkrabbi/kol-component'

/* THE INSPECTOR'S EXPORT (plan-2026-11-19-kolbox-whats-left C8, W30.2): the Export window's settings, kept per layer or
   frame in the document (`layer.exports`, a list of { format, scale, suffix }, saved with the file and undone like any
   edit). The plus adds a setting (PNG at 1x, then the next scale up). A setting is Figma's export row (W11.2): its scale
   (PNG, JPG and PDF; an SVG has none), its format (PNG, JPG, SVG, PDF) and a minus, and under them its suffix, written
   after the name (empty, a scale other than 1 writes `@2x`). "Export" writes the item once per setting (several in one
   .zip). A frame exports with its own fill; a layer in its own bounds,
   on nothing. Video is the Export window's, not a row's: a loop is the frame's, not one layer's.
   `page` (C9 loose end 2, W11.3): with nothing selected the section is the open page's, writing ONE picture per setting
   of the whole page, every frame and layer in their bounds. The engine's page keeps only its id, name and color, so a page's settings live here for the session.
   ponytail: session only; an `exports` field on the engine's page (pagesSpec, toPages) puts them in the file */
const pageExports = new Map()
const scaleOptions = SCALES.map((s) => ({ value: s, label: `${s}x` }))

export default function ExportSection({ page = false }) {
  const state = useComposeState()
  const { layers, selectedId, updateLayer, palette, aspect, pageId, pages = [] } = state
  const [, bump] = useState(0)
  const item = page
    ? { id: pageId, type: 'page', name: pages.find((p) => p.id === pageId)?.name || 'Page', exports: pageExports.get(pageId) }
    : selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  const [busy, setBusy] = useState(false)
  if (!item) return null
  const rows = Array.isArray(item.exports) ? item.exports : []
  const put = page ? (next) => { pageExports.set(item.id, next); bump((n) => n + 1) } : (next) => updateLayer(item.id, { exports: next })
  const add = () => {
    const used = new Set(rows.filter((r) => r.format === 'png').map((r) => r.scale))
    put([...rows, { format: 'png', scale: SCALES.find((s) => s >= 1 && !used.has(s)) ?? 1 }])
  }
  const set = (i, patch) => put(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const run = async () => {
    const regions = regionsOf(state, page ? 'page' : `layer:${item.id}`)
    if (!regions.length || busy) return
    setBusy(true)
    try {
      const files = await Promise.all(regions.flatMap((region) => rows.map((r) => regionFile(region, { format: r.format, scale: r.scale, suffix: r.suffix, fill: true, palette, aspect }))))
      /* two settings that write the same name (two SVGs) are told apart by their place in the list */
      const seen = new Map()
      files.forEach((f) => { const n = seen.get(f.name) ?? 0; seen.set(f.name, n + 1); if (n) f.name = f.name.replace(/(\.\w+)$/, ` ${n + 1}$1`) })
      await writeFiles(files, page ? item.name : regions[0].name)
    } finally { setBusy(false) }
  }
  return (
    <LabeledControlSection variant="kolbox" label="Export" end={<Act icon="plus" label="Add export" onClick={add} />}>
      {rows.length > 0 && (
        <div className="flex flex-col gap-2" data-export-rows>
          {rows.map((r, i) => {
            /* on the rail's grid (R3.1): scale and format in the field columns (an SVG's format over both), the minus on
               the icon column; the suffix under them over both */
            const raster = r.format !== 'svg'
            const format = <Dropdown variant="kolbox" ariaLabel="Format" options={STILL_FORMATS} value={r.format} onChange={(v) => set(i, { format: v })} className="min-w-0 flex-1" />
            return (
              <div key={i} className="flex flex-col gap-2" data-export-row={i}>
                <FieldPair variant="kolbox" span={!raster}
                  first={raster ? <Dropdown variant="kolbox" ariaLabel="Scale" options={scaleOptions} value={r.scale} onChange={(v) => set(i, { scale: Number(v) })} className="min-w-0 flex-1" /> : format}
                  second={raster && format}
                  trailing={<Act icon="minus" label="Remove export" onClick={() => put(rows.filter((_, j) => j !== i))} />}
                />
                <FieldPair variant="kolbox" span
                  first={<Input variant="kolbox" aria-label="Suffix" placeholder="Suffix" value={r.suffix ?? ''} onChange={(e) => set(i, { suffix: e.target.value })} className="min-w-0 flex-1" />}
                />
              </div>
            )
          })}
          <Button variant="kolbox" iconLeft="download" className="w-full" disabled={busy} onClick={run} data-export-run>
            {`Export ${item.name || (item.type === 'frame' ? 'Frame' : 'layer')}`}
          </Button>
        </div>
      )}
    </LabeledControlSection>
  )
}
