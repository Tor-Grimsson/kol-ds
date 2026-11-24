import { useRef } from 'react'
import { buildLabsCatalog, SECTION_ICONS, useComposeState, useLabsLayer } from './engine.js'

/* The package's labs catalog folded into the picker's two levels (copied from apps/minimal/src/labs/useCatalog.js): a
   `sec:` marker becomes a row that opens a list, the groups after it become that list, and a group runs its first
   leaf. Color is a row of its own. Morph is its own mode on the track (Figma plan 17.1), so its section is left out.
   The media a photo layer carried outlives the layer (LabsNav's remembered source). */
const OWN_MODE = 'sec:morph'

export function useCatalog() {
  const { addFilter, patchFilter } = useComposeState()
  const { layer, setOnly } = useLabsLayer()
  const last = useRef(null)
  if (layer?.type === 'photo' && layer.src) last.current = { src: layer.src, srcType: layer.srcType, fit: layer.fit }
  const carriedSource = () => (layer?.type === 'photo' ? { src: layer.src, srcType: layer.srcType, fit: layer.fit } : (last.current ?? {}))
  const stream = buildLabsCatalog({ layer, setOnly, addFilter, patchFilter, carriedSource })

  const rows = []
  let skip = false
  for (const e of stream) {
    if (e.id.startsWith('sec:')) {
      skip = e.id === OWN_MODE
      if (!skip) rows.push({ key: e.id, icon: SECTION_ICONS[e.id.slice(4)] ?? 'square', label: e.label, sub: [] })
      continue
    }
    if (skip) continue
    const pages = e.pages ?? []
    const run = e.onSelect ?? pages[0]?.onSelect ?? pages[0]?.children?.[0]?.onSelect
    const active = pages.some((p) => p.active || p.children?.some((c) => c.active))
    const row = { key: e.id, icon: e.icon, label: e.label, run, active }
    const section = rows[rows.length - 1]
    if (section?.sub) section.sub.push(row)
    else rows.push(row)
  }
  return rows
}
