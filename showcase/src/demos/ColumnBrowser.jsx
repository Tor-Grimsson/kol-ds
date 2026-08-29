import { useState } from 'react'
import { ColumnBrowser, ViewToggle } from '@kolkrabbi/kol-component'

export const stage = 'full'

const IMG = (hue) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="hsl(${hue} 30% 55%)"/></svg>`)
const OBJECTS = [
  { key: 'labs/render-01.jpg', size: 358200, uploaded: '2026-06-19T10:00:00Z', contentType: 'image/jpeg', url: IMG(20) },
  { key: 'labs/render-02.jpg', size: 370400, uploaded: '2026-06-19T10:00:00Z', contentType: 'image/jpeg', url: IMG(200) },
  { key: 'labs/notes.txt', size: 1200, uploaded: '2026-06-20T10:00:00Z', contentType: 'text/plain', url: 'data:text/plain,' + encodeURIComponent('field notes\n— the row is the unit\n— the column is the path') },
  { key: 'type/specimen/rot-vf.ttf', size: 184000, uploaded: '2026-07-01T10:00:00Z', contentType: 'font/ttf' },
  { key: 'type/specimen/poster.png', size: 902000, uploaded: '2026-07-02T10:00:00Z', contentType: 'image/png', url: IMG(320) },
  { key: 'video/reel-cut-04.mp4', size: 48000000, uploaded: '2026-06-21T10:00:00Z', contentType: 'video/mp4' },
  { key: 'README.md', size: 2400, uploaded: '2026-06-01T10:00:00Z', contentType: 'text/markdown', url: 'data:text/markdown,' + encodeURIComponent('# kol-r2b2\n\nA read-only **bucket** browser.\n\n- columns\n- quick look\n') },
]
const FOLDER_VIEW_OPTIONS = [
  { value: 'rows', label: 'Rows', icon: 'view-list' },
  { value: 'columns', label: 'Columns', icon: 'columns' },
]

/* Finder-style Miller columns — click a folder to open its column, a file to
 * preview it; ↑/↓ → ← walk the tree, space opens Quick Look. The folder-view
 * toggle is the consumer's ViewToggle (rows · columns — the `columns` glyph
 * shipped with kol-icons 0.19.0). */
export default function ColumnBrowserDemo() {
  const [prefix, setPrefix] = useState('type/specimen/')
  const [calls, setCalls] = useState(0)
  const [quickLook, setQuickLook] = useState(null)
  const [view, setView] = useState('columns')
  const [picked, setPicked] = useState(null)
  const [size, setSize] = useState({ height: 528, cols: {} })
  return (
    <div className="flex w-full flex-col gap-4">
      <ViewToggle viewMode={view} onViewChange={setView} variant="icon" options={FOLDER_VIEW_OPTIONS} />
      <ColumnBrowser objects={OBJECTS} prefix={prefix} onPrefix={(p) => { setPrefix(p); setCalls((c) => c + 1) }} quickLook={quickLook} onQuickLook={setQuickLook} onPick={setPicked} urlOf={(o) => o.url} onHeightChange={(height) => setSize((s) => ({ ...s, height }))} onColumnResize={(i, px) => setSize((s) => ({ ...s, cols: { ...s.cols, [i]: px } }))} />
      {/* drag the bottom edge (height) and any column's right edge (width) — Finder's handles */}
      <p className="kol-mono-12 text-fg-48">height {size.height}px{Object.entries(size.cols).map(([i, px]) => ` · col ${i} ${px}px`).join('')}</p>
      <p className="kol-mono-12 text-fg-48" data-crumb>{prefix}{picked ? picked.key.slice(prefix.length) : '—'} <span data-calls>{calls}</span></p>
      {quickLook && <p className="kol-mono-12 text-fg-48">Quick Look: {quickLook.files[quickLook.index]?.key} · {quickLook.index + 1} / {quickLook.files.length} (space closes)</p>}
    </div>
  )
}
