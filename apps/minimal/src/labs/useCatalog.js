import { useRef } from 'react'
import { buildLabsCatalog, SECTION_ICONS, useComposeState, useLabsLayer } from './engine.js'

/* The package's labs catalog folded into the rail's two levels, the way its LabsNav folds it for the shell rail: a
   `sec:` marker becomes a row that enters a list, the groups after it become that list, and a group runs its first
   leaf. Color is a row of its own. The media a photo layer carried outlives the layer (LabsNav's remembered source). */
export function useCatalog() {
  const { addFilter, patchFilter } = useComposeState()
  const { layer, setOnly } = useLabsLayer()
  const last = useRef(null)
  if (layer?.type === 'photo' && layer.src) last.current = { src: layer.src, srcType: layer.srcType, fit: layer.fit }
  const carriedSource = () => (layer?.type === 'photo' ? { src: layer.src, srcType: layer.srcType, fit: layer.fit } : (last.current ?? {}))
  const stream = buildLabsCatalog({ layer, setOnly, addFilter, patchFilter, carriedSource })

  const rows = []
  for (const e of stream) {
    if (e.id.startsWith('sec:')) {
      rows.push({ key: e.id, icon: SECTION_ICONS[e.id.slice(4)] ?? 'square', label: e.label, sub: [] })
      continue
    }
    const pages = e.pages ?? []
    /* a Morph pick moves the page to the package's /morph route and needs its MorphTab to build the stage: drawn, inert */
    const run = e.id.startsWith('morph:') ? null : (e.onSelect ?? pages[0]?.onSelect ?? pages[0]?.children?.[0]?.onSelect)
    const active = pages.some((p) => p.active || p.children?.some((c) => c.active))
    const row = { key: e.id, icon: e.icon, label: e.label, run, active }
    const section = rows[rows.length - 1]
    if (section?.sub) section.sub.push(row)
    else rows.push(row)
  }
  return rows
}
