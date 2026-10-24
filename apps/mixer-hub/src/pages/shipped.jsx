import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { downloadBlob } from '@kolkrabbi/kol-component'
import { PatchThumb } from '../components/PatchThumb.jsx'
import ModuleMedia from '../components/ModuleMedia.jsx'
import { PRESETS } from '../../../mixer/src/hooks/useLibraryStore.js'
import { MODULE_REGISTRY, slugFor } from '../../../mixer/src/data/moduleRegistry.js'

/**
 * shipped — WHAT THE APP SHIPS, as the Library's files (plan home-library-detail-one-card 1.2 · 2.3, 2026-10-24).
 * Home is the user's saved patches; the Library is the shipped presets, the registry's one-tap patches and the
 * desk's modules — system saves — and every one is THE card with every field and icon (user 2026-10-24: *"EVERY CARD
 * HAS THE SAME FIELDS AND ICONS … NON NEGOTIABLE"*): title · date · size · cover with download · cog (the rail:
 * Details, tags, note, Upload image) · trash. The verbs write this device's library (state here; kol-mirror's write its
 * store); a shipped item the user deletes leaves his Library, the registry is untouched. A card opens its page —
 * `/library/patch/<id>` · `/library/module/<slug>` — never the studio (3.2). The FX view is gone: expressions are the
 * studio's Expressions tab, not library content (user 2026-10-24).
 */
const SHIP_DATE = Date.parse('2026-10-19T12:00:00Z')
const DAY = 86400000
const channelsOf = (p) => (p.data?.channels || []).filter((c) => c.variantId).length

/* a shipped preset as a file — its cover is the patch's OUTPUT (1.6): the capture, then the wiring drawing */
export const SHIPPED_PRESETS = PRESETS.filter((p) => p.kind === 'patch').map((p, i) => ({
  id: p.id, kind: 'patch', name: p.name, tags: p.tags ?? [], note: p.description ?? '',
  updatedAt: SHIP_DATE - i * DAY, bytes: new Blob([JSON.stringify(p)]).size, cover: <PatchThumb patch={p} />,
  details: [{ label: 'Channels', value: channelsOf(p) }], data: p,
}))
/* a registry one-tap patch as a file — Slit-Scan Camera and its kin; `detail` is its one line, in the rail */
/* `kind: 'Patch'` WITHOUT a front — the desk's Patch module has the kind and a front, and is a module (kol-mirror's reading, 2026-10-24) */
export const SHIPPED_REGISTRY_PATCHES = MODULE_REGISTRY.filter((m) => m.kind === 'Patch' && !m.front).map((m, i) => ({
  id: m.id, kind: 'patch', name: m.name, tags: m.tags ?? [], note: m.detail ?? '',
  updatedAt: SHIP_DATE - (SHIPPED_PRESETS.length + i) * DAY, bytes: new Blob([JSON.stringify({ id: m.id, name: m.name, detail: m.detail, tags: m.tags })]).size,
  cover: <ModuleMedia src={m.preview} />, details: [{ label: 'Kind', value: m.kind }, { label: 'Group', value: m.group }], data: { id: m.id, name: m.name, detail: m.detail, tags: m.tags },
}))
/* a module as a file — the desk's furniture and every addable unit, its front contained as the cover */
const FX_GROUPS = ['Displacement', 'Movement', 'Copies', 'Canvas FX']
export const SHIPPED_MODULES = MODULE_REGISTRY.filter((m) => (m.kind !== 'Patch' || m.front) && !FX_GROUPS.includes(m.group)).map((m, i) => ({
  id: slugFor(m), kind: 'module', name: m.name, group: m.group, tags: m.tags ?? [], note: m.detail ?? '',
  updatedAt: SHIP_DATE - i * DAY, bytes: new Blob([JSON.stringify({ id: m.id, name: m.name, kind: m.kind, group: m.group, detail: m.detail })]).size,
  cover: <ModuleMedia src={m.preview} contain={m.front?.kind === 'desk'} />,
  details: [{ label: 'Kind', value: m.kind }, { label: 'Group', value: m.group }], data: { id: m.id, name: m.name, kind: m.kind, group: m.group, detail: m.detail },
}))
export const MODULE_GROUP_VALUES = [...new Set(SHIPPED_MODULES.map((m) => m.group))]
/* Create's parts — every registry entry with its own `add` verb (variants, generators, FX units), as the same files */
export const SHIPPED_ADDABLE = MODULE_REGISTRY.filter((m) => m.add).map((m, i) => ({
  id: slugFor(m), kind: 'part', entryId: m.id, name: m.name, group: m.group, kindLabel: m.kind, tags: m.tags ?? [], note: m.detail ?? '',
  updatedAt: SHIP_DATE - i * DAY, bytes: new Blob([JSON.stringify({ id: m.id, name: m.name, kind: m.kind, group: m.group, detail: m.detail })]).size,
  cover: <ModuleMedia src={m.preview} contain={m.front?.kind === 'desk'} />,
  details: [{ label: 'Kind', value: m.kind }, { label: 'Group', value: m.group }], data: { id: m.id, name: m.name, kind: m.kind, group: m.group, detail: m.detail },
}))
export const entryOf = (f) => MODULE_REGISTRY.find((m) => m.id === (f.entryId ?? f.id))

/* the shipped lists as this device's library, with every verb, and the ONE card both views draw */
export function useShipped() {
  const navigate = useNavigate()
  const [patches, setPatches] = useState([...SHIPPED_PRESETS, ...SHIPPED_REGISTRY_PATCHES])
  const [modules, setModules] = useState(SHIPPED_MODULES)
  const [addable, setAddable] = useState(SHIPPED_ADDABLE)
  const setOf = (f) => (f.kind === 'module' ? setModules : f.kind === 'part' ? setAddable : setPatches)
  const edit = (f, patch) => setOf(f)((fs) => fs.map((x) => (x.id === f.id ? { ...x, ...patch } : x)))
  const card = (f) => ({
    key: f.id, title: f.name, date: f.updatedAt, size: f.bytes, media: f.cover, tags: f.tags, details: f.details,
    onTags: (tags) => edit(f, { tags }),
    note: f.note, onNote: (note) => edit(f, { note }),
    onCover: (src) => edit(f, { cover: src }),
    verbs: {
      rename: (name) => edit(f, { name, updatedAt: Date.now() }),
      duplicate: () => setOf(f)((fs) => [{ ...f, id: `${f.id}-${Date.now().toString(36)}`, name: `${f.name} copy`, updatedAt: Date.now() }, ...fs]),
      remove: () => setOf(f)((fs) => fs.filter((x) => x.id !== f.id)),
    },
    download: () => downloadBlob(new Blob([JSON.stringify(f.data, null, 2)], { type: 'application/json' }), `${f.name}.json`),
    onClick: () => navigate(f.kind === 'patch' ? `/library/patch/${f.id}` : `/library/module/${f.id}`),
  })
  return { patches, modules, addable, card }
}
