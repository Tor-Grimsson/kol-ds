import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CatalogPage, StudioDetail } from '@kolkrabbi/kol-shell'
import { downloadBlob } from '@kolkrabbi/kol-component'
import { PRESETS, GROUPS, groupOfPreset } from '../../../../packages/design-editor/src/loops/registry.js'
import { KINETIC_PRESETS } from '../../../../packages/design-editor/src/kinetic/presets.js'
import { cover, title } from '../../../studio-hub/src/covers.js'

/**
 * Library — WHAT FXR SHIPS, as files (plan home-library-detail-one-card 1.5, user 2026-10-24: *"each category in labs
 * IS A CATEGORY, GENERATE/SCANLINE has 5 PRESETS … THESE ARE ALL SAVED PRESETS IN LABS … Randomiser also has presets …
 * MORPH just needs to generate 10 presets … EDITOR, just save 10 EDITOR FILES"*). Home is the user's saves; the Library
 * is every preset the app ships, by chrome — the view strip is EDITOR · LABS · RANDOMISER · MORPH:
 *
 *   LABS         every loops preset (the catalog's groups and subs — Scanline › Spaced › Drift …) and every kinetic
 *                preset, one file each, read off the editor's own tables
 *   RANDOMISER   the same pool — a Randomiser file records the pick
 *   MORPH        ten generated morph files, two labs presets as the steps
 *   EDITOR       ten made files — preset, type, logo, vector form
 *
 * Every one is THE card with every field and icon (title · date · size · cover with download · cog · trash), the chrome
 * as the cover's mark; the verbs write this device's library (state here; kol-fxr's write its library's `preset` slot
 * with `shipped: true` on first load). COVERS: the twin draws studio-hub's pictures — kol-fxr renders each file's
 * OUTPUT frame (1.6) when it seeds. A card opens its page — `/library/<chrome>/<id>` on `StudioDetail` — and Open
 * lands in the chrome (3.4).
 */
const SHIP_DATE = Date.parse('2026-10-19T12:00:00Z')
const DAY = 86400000
const CHROMES = {
  editor: { icon: 'desktop', label: 'Editor', of: 'Chrome' },
  labs: { icon: 'globe', label: 'Labs', of: 'Chrome' },
  randomiser: { icon: 'refresh', label: 'Randomiser', of: 'Chrome' },
  morph: { icon: 'swap', label: 'Morph', of: 'Chrome' },
}
/* `groupOfPreset` answers the group's id; the catalog's label is the Library's word for it */
const groupLabel = (p) => { const gid = groupOfPreset(p.id); return GROUPS.find((g) => g.id === gid)?.label ?? gid ?? GROUPS[0].label }

/* the labs pool — the loops presets by group and sub, the kinetic presets by sub */
const LABS_POOL = [
  ...PRESETS.map((p) => ({ id: p.id, name: p.label ?? p.name ?? p.id, group: groupLabel(p), sub: p.sub ?? null, kind: 'loop' })),
  ...KINETIC_PRESETS.map((p) => ({ id: p.id, name: p.label, group: 'Kinetic type', sub: p.sub ?? null, kind: 'kinetic' })),
]
const asFile = (chrome, p, i) => ({
  id: `${chrome}:${p.id}`, chrome, presetId: p.id, name: p.name, group: p.group, sub: p.sub,
  updatedAt: SHIP_DATE - (i % 60) * DAY, bytes: 640 + (i * 97) % 2400, cover: cover(i % 40),
  tags: [p.group, ...(p.sub ? [p.sub] : [])].map((t) => t.toLowerCase()), note: '', mark: CHROMES[chrome],
  details: [{ label: 'Group', value: p.group }, ...(p.sub ? [{ label: 'Category', value: p.sub }] : []), { label: 'Aspect', value: ['1:1', '4:5', '16:9'][i % 3] }],
})
const LABS = LABS_POOL.map((p, i) => asFile('labs', p, i))
const RANDOMISER = LABS_POOL.map((p, i) => asFile('randomiser', p, i + 7))
/* ten morph files — two labs presets as the steps (kol-fxr generates these on first load) */
const MORPH = Array.from({ length: 10 }, (_, i) => {
  const a = LABS_POOL[(i * 13) % LABS_POOL.length], b = LABS_POOL[(i * 29 + 5) % LABS_POOL.length]
  return { ...asFile('morph', { id: `morph-${i + 1}`, name: `${a.name} → ${b.name}`, group: 'Morph', sub: null }, i + 3), steps: [a.name, b.name], details: [{ label: 'Steps', value: 2 }, { label: 'From', value: a.name }, { label: 'To', value: b.name }] }
})
/* ten editor files — preset, type, logo, vector form (kol-fxr makes these from the editor's own layer kinds) */
const EDITOR_KINDS = ['Preset', 'Type', 'Logo', 'Vector form', 'Preset', 'Type', 'Logo', 'Vector form', 'Preset', 'Type']
const EDITOR = EDITOR_KINDS.map((kind, i) => ({
  ...asFile('editor', { id: `editor-${i + 1}`, name: `${kind} ${Math.floor(i / 4) + 1}${['a', 'b', 'c', 'd'][i % 4]}`, group: kind, sub: null }, i + 11),
  details: [{ label: 'Kind', value: kind }, { label: 'Layers', value: 2 + (i % 5) }, { label: 'Aspect', value: ['1:1', '4:5', '16:9'][i % 3] }],
}))
const SHIPPED = { editor: EDITOR, labs: LABS, randomiser: RANDOMISER, morph: MORPH }
const VIEWS = [{ value: 'editor', label: 'EDITOR' }, { value: 'labs', label: 'LABS' }, { value: 'randomiser', label: 'RANDOMISER' }, { value: 'morph', label: 'MORPH' }]
const GROUPS_OF = (list) => [...new Set(list.map((f) => f.group))]

export default function Library() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [view, setView] = useState('labs')
  const [lists, setLists] = useState(SHIPPED)
  const setList = (chrome, fn) => setLists((l) => ({ ...l, [chrome]: fn(l[chrome]) }))
  const edit = (f, patch) => setList(f.chrome, (fs) => fs.map((x) => (x.id === f.id ? { ...x, ...patch } : x)))
  const card = (f) => ({
    key: f.id, title: f.name, date: f.updatedAt, size: f.bytes, media: f.cover, tags: f.tags, details: f.details, mark: f.mark,
    onTags: (tags) => edit(f, { tags }),
    note: f.note, onNote: (note) => edit(f, { note }),
    onCover: (src) => edit(f, { cover: src }),
    verbs: {
      rename: (name) => edit(f, { name, updatedAt: Date.now() }),
      duplicate: () => setList(f.chrome, (fs) => [{ ...f, id: `${f.id}-${Date.now().toString(36)}`, name: `${f.name} copy`, updatedAt: Date.now() }, ...fs]),
      remove: () => setList(f.chrome, (fs) => fs.filter((x) => x.id !== f.id)),
    },
    download: () => downloadBlob(new Blob([JSON.stringify({ ...f, cover: undefined, mark: undefined }, null, 2)], { type: 'application/json' }), `${f.name}.json`),
    onClick: () => navigate(`/library/${f.chrome}/${encodeURIComponent(f.presetId)}`),
  })

  /* the detail page — `/library/<chrome>/<id>` */
  const m = /^\/library\/(editor|labs|randomiser|morph)\/([^/]+)$/.exec(pathname)
  if (m) {
    const [, chrome, raw] = m
    const id = decodeURIComponent(raw)
    const f = lists[chrome].find((x) => x.presetId === id)
    if (!f) return <StudioDetail notFound={{ title: 'File not found', subtitle: id }} />
    return (
      <StudioDetail
        back={{ onClick: () => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/library')) }}
        title={f.name}
        subtitle={`${CHROMES[chrome].label} — ${f.group}${f.sub ? ` › ${f.sub}` : ''}`}
        description={`A shipped ${CHROMES[chrome].label} file. Open loads it in its chrome; Duplicate makes it yours.`}
        sections={[
          { label: 'Specifications', rows: f.details.map((d) => ({ label: `${d.label}: ${d.value}` })) },
          ...(f.steps ? [{ label: 'Steps', rows: f.steps.map((s, i) => ({ kind: `${i + 1}`, label: s })) }] : []),
          ...(f.tags?.length ? [{ label: 'Tags', text: f.tags.join(', ') }] : []),
        ]}
        preview={{ src: typeof f.cover === 'string' ? f.cover : cover(0), alt: f.name }}
        actions={[
          { label: 'Open', onClick: () => navigate(`/${chrome}`) },
          { label: 'Duplicate', onClick: () => card(f).verbs.duplicate() },
        ]}
      />
    )
  }

  const items = lists[view]
  return (
    <CatalogPage
      key={view}
      preset="app"
      header={{ title: 'Library', subtitle: 'Everything the app ships with, by chrome.' }}
      items={items}
      views={VIEWS}
      view={view}
      onViewChange={setView}
      filtersTitle={`All ${CHROMES[view].label}`}
      filterGroups={[{ label: 'Group', key: 'group', values: GROUPS_OF(items) }]}
      searchKeys={['title', 'name', 'group', 'sub']}
      toCard={card}
    />
  )
}
