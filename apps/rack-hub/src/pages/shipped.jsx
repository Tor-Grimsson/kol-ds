import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { downloadBlob } from '@kolkrabbi/kol-component'
import { patches } from '../../../rack/src/data/patches'
import { MODULE_DEFS } from '../../../rack/src/modules/registry'

/**
 * shipped — WHAT THE APP SHIPS, as the Library's files (plan home-library-detail-one-card 1.1 · 2.3, 2026-10-24).
 * Home is the user's saves; the Library is the shipped presets and the module definitions — system saves — and
 * every one is THE card with every field and icon (user 2026-10-24: *"EVERY CARD HAS THE SAME FIELDS AND ICONS …
 * NON NEGOTIABLE"*): title · date · size · cover with download · cog (the rail: Details, tags, note, Upload image) ·
 * trash. The verbs write this device's library — rename, duplicate, delete, tags, note and the cover live in state here
 * (kol-monitor's write the library store); a shipped item the user deletes leaves his Library, the app's data is
 * untouched. A card opens its page — `/library/patch/<id>` · `/library/module/<type>` — never the rack (3.2).
 */
const SHIP_DATE = Date.parse('2026-10-19T12:00:00Z') /* the preset set's stamp; kol-monitor reads its build date */
const DAY = 86400000
const titleOf = (name) => name.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').trim()
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const PATCH_NAMES = Object.keys(patches).filter((k) => k !== 'ref' && k !== 'empty')
/* a shipped patch as a file — its cover is the patch's OUTPUT (1.6; /previews/patches holds the output capture) */
export const SHIPPED_PATCHES = PATCH_NAMES.map((name, i) => {
  const src = patches[name]
  return {
    id: name, kind: 'patch', name: titleOf(name), type: src.type ?? 'patches', tags: src.tags ?? [],
    updatedAt: SHIP_DATE - i * DAY, bytes: new Blob([JSON.stringify(src)]).size, cover: `/previews/patches/${name}.png`,
    details: [{ label: 'Modules', value: src.rows?.reduce((n, r) => n + (r.modules?.length || 0), 0) || 0 }, { label: 'Connections', value: src.connections?.length || 0 }],
    data: src,
  }
})
/* a module definition as a file — the front, contained, is its cover */
export const SHIPPED_MODULES = Object.entries(MODULE_DEFS).map(([type, def], i) => ({
  id: type, kind: 'module', name: def.label, category: def.category, u_label: `${def.u}U`, tags: [def.category],
  updatedAt: SHIP_DATE - i * DAY, bytes: new Blob([JSON.stringify(def)]).size, cover: `/previews/modules/${type}.png`,
  details: [{ label: 'Category', value: cap(def.category) }, { label: 'Width', value: `${def.hp}HP` }, { label: 'Height', value: `${def.u}U` }],
  data: def,
}))

/* the shipped lists as this device's library, with every verb, and the ONE card both views draw */
export function useShipped() {
  const navigate = useNavigate()
  const [patchFiles, setPatches] = useState(SHIPPED_PATCHES)
  const [moduleFiles, setModules] = useState(SHIPPED_MODULES)
  const setOf = (f) => (f.kind === 'module' ? setModules : setPatches)
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
    onClick: () => navigate(f.kind === 'module' ? `/library/module/${f.id}` : `/library/patch/${f.id}`),
  })
  return { patches: patchFiles, modules: moduleFiles, card }
}
