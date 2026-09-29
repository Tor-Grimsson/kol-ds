import { useEffect, useMemo, useState } from 'react'
import { AppShell, PageShell } from '@kolkrabbi/kol-shell'
import { Dropdown, PageHeader, SegmentedToggle, SettingsSwitch, LabeledControlSection } from '@kolkrabbi/kol-component'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'
/* the editor's OWN panel machinery and data, from its source (see vite.config.js) */
import AutoControls from 'design-editor-src/editor/params/AutoControls'
import BindDot from 'design-editor-src/editor/params/BindDot'
import { useBindDots, toggleDots } from 'design-editor-src/editor/params/dotVisibility'
import { paramTab, schemaDefaults } from 'design-editor-src/editor/params/schema'
import { FILTERS } from 'design-editor-src/filters'
import { flatCategories } from 'design-editor-src/editor/compose/inspectors/effectCategories'
import { GENERATIVE_TREE } from 'design-editor-src/loops/taxonomy'
import { groupById, presetsInGroup, isToolPreset, loopById, presetParams } from 'design-editor-src/loops/registry'
import { PHOTO_SCHEMA } from 'design-editor-src/editor/params/schemas/photo'
import { SHAPE_SCHEMA } from 'design-editor-src/editor/params/schemas/shape'
import { TEXT_SCHEMA } from 'design-editor-src/editor/params/schemas/text'
import { PATTERN_SCHEMA } from 'design-editor-src/editor/params/schemas/pattern'

/* PARAMETER PANELS, ALONE (apps review §6c-5, 2026-09-29). The layout labs · the generator · the
 * editor's inspector · the settings drawer all share — categories → sub-categories → a leaf, its
 * TABS, its folded SECTIONS, LABELED controls, the MODULATION dot beside every animatable one —
 * rendered by the editor's real `AutoControls` over the editor's real schemas, with no stage and
 * no engine. A panel bug shows here without an image in the way, and is fixed in design-editor's
 * source, which this app reads directly.
 *
 *   /effects/<category>        the effect catalogue (FILTERS through flatCategories) — leaf = a filter
 *   /generators/<entry>        the generative tree — leaf = a preset, params = its loop's schema
 *   /inspector/<type>          the compositor's layer schemas — photo · shape · text · pattern
 *
 * Every leaf renders TWICE, side by side: the inspector RAIL (inline rows, the labs / drawer form)
 * and the EDITOR form (label above). At phone width they stack — that is the phone form.
 * Routing is the hash. */

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const EFFECTS = flatCategories(FILTERS).map((c) => ({
  id: c.id, label: c.label,
  leaves: c.filters.map((f) => ({ id: f.id, label: f.label, schema: f.params ?? [] })),
}))

const GENERATORS = GENERATIVE_TREE.map((e) => ({
  id: slug(e.label), label: e.label,
  leaves: e.groups.flatMap((g) => presetsInGroup(g).filter((p) => !isToolPreset(p)).map((p) => ({
    id: p.id,
    label: `${e.labels?.[g] ?? groupById(g).label} · ${p.label}`,
    schema: loopById(p.loop)?.params ?? [],
    values: presetParams(p),
  }))),
}))

const INSPECTOR = [
  { id: 'photo', label: 'Photo', schema: PHOTO_SCHEMA },
  { id: 'shape', label: 'Shape', schema: SHAPE_SCHEMA },
  { id: 'text', label: 'Text', schema: TEXT_SCHEMA },
  { id: 'pattern', label: 'Pattern', schema: PATTERN_SCHEMA },
].map((t) => ({ id: t.id, label: t.label, leaves: [{ id: t.id, label: t.label, schema: t.schema }] }))

const SPACES = [
  { id: 'effects', label: 'Effects', icon: 'filter', cats: EFFECTS },
  { id: 'generators', label: 'Generators', icon: 'refresh', cats: GENERATORS },
  { id: 'inspector', label: 'Inspector', icon: 'layers', cats: INSPECTOR },
]

const TAB_LABELS = { generate: 'Generate', style: 'Style', anim: 'Motion' }

const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'

export default function App() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (p) => { location.hash = encodeURI(p) }

  const [, spaceId, catId] = path.split('/')
  const space = SPACES.find((s) => s.id === spaceId) ?? SPACES[0]
  const cat = space.cats.find((c) => c.id === catId) ?? space.cats[0]

  const items = SPACES.map((s) => ({
    icon: s.icon, path: `/${s.id}`, label: s.label,
    sub: s.cats.map((c) => ({ path: `/${s.id}/${c.id}`, label: c.label })),
  }))

  return (
    <AppShell
      items={items}
      logomark={{ svgUrl: logomark, title: 'KOL panels' }}
      currentPath={`/${space.id}/${cat.id}`}
      onNavigate={navigate}
      railToggleKey={'\\'}
      touch="drawer"
      navKeys
      pageWash="var(--kol-fg-02)"
    >
      <PageShell>
        <Category key={`${space.id}/${cat.id}`} space={space} cat={cat} />
      </PageShell>
    </AppShell>
  )
}

function Category({ space, cat }) {
  const [leafId, setLeafId] = useState(cat.leaves[0]?.id)
  const leaf = cat.leaves.find((l) => l.id === leafId) ?? cat.leaves[0]
  const dots = useBindDots()

  return (
    <>
      <PageHeader
        size="sm"
        voice="mono"
        eyebrow={space.label}
        title={cat.label}
        subtitle={`${cat.leaves.length} ${cat.leaves.length === 1 ? 'panel' : 'panels'} — the editor's own schema, rendered by its AutoControls`}
      />
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {cat.leaves.length > 1 && (
          <Dropdown
            className="w-72"
            options={cat.leaves.map((l) => ({ value: l.id, label: l.label }))}
            value={leaf?.id}
            onChange={setLeafId}
            aria-label="Panel"
          />
        )}
        <label className="flex items-center gap-2 kol-helper-12 text-meta">
          <SettingsSwitch on={dots} onChange={toggleDots} />
          Modulation dots
        </label>
      </div>
      {leaf ? <Leaf key={leaf.id} leaf={leaf} /> : null}
    </>
  )
}

function Leaf({ leaf }) {
  const [layer, setLayer] = useState(() => ({ id: `panel-${leaf.id}`, ...schemaDefaults(leaf.schema), ...(leaf.values ?? {}) }))
  const setProp = (k, v) => setLayer((l) => ({ ...l, [k]: v }))
  const tabs = useMemo(() => {
    const present = new Set(leaf.schema.map(paramTab))
    return ['generate', 'style', 'anim'].filter((t) => present.has(t)).map((t) => ({ value: t, label: TAB_LABELS[t] }))
  }, [leaf])
  const [tab, setTab] = useState(tabs[0]?.value)

  if (!leaf.schema.length) return <p className="kol-helper-12 text-meta">This leaf declares no parameters.</p>

  const auto = {
    schema: leaf.schema,
    layer,
    setProp,
    palette: [],
    tab,
    renderAnimate: (p) => <BindDot layer={layer} param={p} setProp={setProp} />,
    emptyHint: 'Nothing on this tab.',
  }
  return (
    <div className="kol-design-editor flex flex-wrap gap-12 items-start">
      <Frame label="Rail — inline rows (labs · the drawer)" width={320}>
        {tabs.length > 1 && <SegmentedToggle value={tab} onChange={setTab} options={tabs} size="sm" ariaLabel="Tab" />}
        <AutoControls {...auto} inline />
      </Frame>
      <Frame label="Editor — label above (the inspector)" width={280}>
        {tabs.length > 1 && <SegmentedToggle value={tab} onChange={setTab} options={tabs} size="sm" ariaLabel="Tab" />}
        <AutoControls {...auto} />
      </Frame>
    </div>
  )
}

function Frame({ label, width, children }) {
  return (
    <section className="flex flex-col gap-4 max-w-full" style={{ width }}>
      <LabeledControlSection label={label} divided>
        <div className="flex flex-col gap-4">{children}</div>
      </LabeledControlSection>
    </section>
  )
}
