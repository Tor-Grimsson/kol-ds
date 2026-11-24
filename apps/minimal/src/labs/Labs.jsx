import { useEffect, useRef, useState } from 'react'
import { fixtureClient } from 'media-fixture'
import Logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?react'
import {
  EditorProviders, getAppSettings, isTyping, KINETIC_PRESETS, KINETIC_TREE, MISC_TREE, OutputCanvas, presetById, presetLayerPatch,
  presetsInSub, setMediaClient, setSettingsStore, sheetLabels, stepPreset, STEP_KEYS, transport, useComposeState,
  useLabsBoot, useLabsLayer, useMorph,
} from './engine.js'
import { useCatalog } from './useCatalog.js'
import GenerativeBody, { generativeTitle } from './Generative.jsx'
import EffectBody, { EFFECT_TABS, EffectChips, effectTitle, SourceCard } from './Effect.jsx'
import ToolbarDock from './ToolbarDock.jsx'
import { Group } from './ParamsRail.jsx'
import Button from '../ui/Button.jsx'
import Panel from '../ui/Panel.jsx'
import Segmented from '../ui/Segmented.jsx'
import { PickerCard } from '../ui/PickerCard.jsx'
import { SidebarGroupLabel, SidebarHeader, SidebarItem, SidebarSub, SidebarSubItem } from '../ui/Sidebar.jsx'

/* Labs, round 3: round 1's look and layout (the minimal-labs frame: both rails 240 as the Figma frame labs-flow 16:2484, the canvas with its floating pill,
   no top bar) holding every part of the real Labs (plan-2026-11-17-minimal-labs-round-3, its map).
   The state, the catalog and every write are the package's own, reached through ./engine.js. The host's configuration
   is apps/labs' own. */
setMediaClient(fixtureClient)
setSettingsStore({
  load: () => fixtureClient.loadToolSettings('minimal-labs'),
  save: (s) => fixtureClient.saveToolSettings('minimal-labs', s),
})

const GEN_TABS = [{ value: 'generate', label: 'Generate' }, { value: 'style', label: 'Style' }, { value: 'anim', label: 'Animation' }]
const MEDIA_DOOR = 'sec:effects'

/* undo and redo beside the title; one that cannot act keeps its slot but is not drawn */
function History() {
  const { undo, redo, canUndo, canRedo } = useComposeState()
  const slot = (on, node) => <span className={on ? 'contents' : 'invisible pointer-events-none'} aria-hidden={!on}>{node}</span>
  return (
    <>
      {slot(canUndo, <Button icon="arrow-left" aria-label="Undo" tabIndex={canUndo ? undefined : -1} onClick={undo} />)}
      {slot(canRedo, <Button icon="arrow-right" aria-label="Redo" tabIndex={canRedo ? undefined : -1} onClick={redo} />)}
    </>
  )
}

/* Para Type's single glyphs: its presets as chips */
function GlyphChips({ layer }) {
  const { setOnly } = useLabsLayer()
  const current = layer.loopGroup === 'paratype' && presetsInSub('paratype', 'Glyphs').find((p) => p.id === layer.presetId)
  if (!current) return null
  return (
    <div className="flex flex-wrap items-center gap-1">
      {presetsInSub('paratype', 'Glyphs').map((p) => (
        <Button key={p.id} variant={p.id === layer.presetId ? 'filled' : 'outline'} onClick={() => p.id !== layer.presetId && setOnly(layer.type, presetLayerPatch(p, layer.loopGroup))}>{p.label}</Button>
      ))}
    </div>
  )
}

function Surface({ layer }) {
  const isGen = layer.type === 'loop' || layer.type === 'misc' || layer.type === 'kinetic'
  const [tab, setTab] = useState(isGen ? 'generate' : 'effect')
  useEffect(() => {
    if (isGen) return undefined
    const on = () => setTab('effect')
    window.addEventListener('kol:open-effects', on)
    return () => window.removeEventListener('kol:open-effects', on)
  }, [isGen])
  return (
    <>
      <div className="flex flex-col gap-2 px-4 pt-3">
        {layer.type === 'photo' ? <EffectChips layer={layer} /> : <GlyphChips layer={layer} />}
        <Segmented options={isGen ? GEN_TABS : EFFECT_TABS} value={tab} onChange={setTab} />
      </div>
      {layer.type === 'photo' && <EffectBody layer={layer} tab={tab} />}
      {layer.type === 'loop' && <GenerativeBody layer={layer} tab={tab} />}
      {layer.type === 'misc' && <GenerativeBody layer={layer} tab={tab} tree={MISC_TREE} />}
      {layer.type === 'kinetic' && <Group><p className="text-label text-faint">The type composer is not redrawn in the minimal style.</p></Group>}
    </>
  )
}

function railTitle(layer, morph) {
  if (morph.active) return 'Morph'
  if (!layer) return null
  if (layer.type === 'loop') return generativeTitle(layer)
  if (layer.type === 'misc') return generativeTitle(layer, MISC_TREE)
  if (layer.type === 'photo') return effectTitle(layer)
  if (layer.type === 'kinetic') return KINETIC_TREE.find((e) => e.subs.includes(KINETIC_PRESETS.find((p) => p.id === layer.presetId)?.sub))?.label ?? 'Kinetic'
  return null
}

function Screen() {
  const { aspect, setAspect, selectedId, select, removeLayer, undo, redo, updateLayer } = useComposeState()
  const { layer, setOnly } = useLabsLayer()
  const morph = useMorph()
  const rows = useCatalog()

  /* the provider seeds a square canvas under a 4:5 aspect; labs' boot then reads the default aspect and loop length */
  useEffect(() => { if (!getAppSettings().defaultAspect) setAspect(aspect) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useLabsBoot()

  /* the sidebar collapses to its icons from its footer row; a category row opens its list in place, a list is open
     while its lab is */
  const [collapsed, setCollapsed] = useState(false)
  const [expanded, setExpanded] = useState(() => new Set())
  const toggleSection = (key) => setExpanded((cur) => { const n = new Set(cur); if (n.has(key)) n.delete(key); else n.add(key); return n })
  const activeSection = rows.find((r) => r.sub?.some((s) => s.active))?.key
  useEffect(() => { if (activeSection) setExpanded((cur) => new Set(cur).add(activeSection)) }, [activeSection])

  /* the start picker: open while the stage is empty; Effects asks for media first, then reopens on its list */
  const [picker, setPicker] = useState(() => !layer)
  const [pickerSection, setPickerSection] = useState(null)
  const [door, setDoor] = useState(null)
  useEffect(() => { setPicker(!layer); if (!layer) setPickerSection(null) }, [layer?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  const hasMedia = layer?.type === 'photo' && (!!layer.src || layer.srcType === 'webcam')
  const needsSource = layer?.type === 'photo' && !layer.src && layer.srcType !== 'webcam'
  useEffect(() => { if (door && hasMedia) { setPickerSection(door); setPicker(true) } }, [door, hasMedia])
  useEffect(() => { if (!layer) setDoor(null) }, [layer])

  /* the one layer stays selected: every write resolves its subject from the selection */
  useEffect(() => { if (layer && selectedId !== layer.id) select(layer.id) }, [layer, selectedId, select])

  /* Space plays and pauses, Cmd+Z undoes, h l and the arrows step presets, j k categories */
  const ref = useRef({}); ref.current = { layer, undo, redo, updateLayer }
  useEffect(() => {
    const onKey = (e) => {
      if (isTyping(e)) return
      const r = ref.current
      if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); if (e.shiftKey) r.redo(); else r.undo(); return }
      if (e.code === 'Space') { e.preventDefault(); transport.toggle(); return }
      const k = !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey && STEP_KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key]
      if (k && r.layer) { const patch = stepPreset(r.layer, k[1], k[0]); if (patch) { e.preventDefault(); r.updateLayer(r.layer.id, patch) } }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const pickSection = rows.find((r) => r.key === pickerSection)
  const pickerRows = (pickSection ? pickSection.sub : rows).map((r) => ({
    key: r.key, icon: r.icon, label: r.label,
    onClick: () => {
      if (!pickSection && r.key === MEDIA_DOOR && !hasMedia) { setDoor(MEDIA_DOOR); setOnly('photo', { filters: [], fxGroup: null }); setPicker(false); return }
      if (!pickSection && r.sub?.length) { setPickerSection(r.key); return }
      if (r.run) { r.run(); setDoor(null); setPicker(false) }
    },
  }))

  const title = railTitle(layer, morph)
  const presetLabel = layer?.presetId ? (presetById(layer.presetId)?.label ?? layer.presetLabel) : null
  /* a Morph lab is drawn but inert (the package runs it on its own route): it leaves the screen as it is */
  const pick = (row) => { if (!row.run) return; row.run(); setPicker(false) }

  return (
    <div className="flex h-full min-w-[1280px] bg-ground font-sans text-label text-fg">
      {collapsed ? (
        <aside className="flex h-full w-12 shrink-0 flex-col border-r border-line bg-panel" data-sidebar>
          <SidebarHeader collapsed logomark={<Logomark width={16} height={16} />} title="KOL labs" />
          <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2">
            {rows.map((r) => (
              <SidebarItem key={r.key} collapsed icon={r.icon} active={!!r.active || r.key === activeSection} onClick={() => {
                if (!r.sub) { pick(r); return }
                setCollapsed(false); setExpanded((cur) => new Set(cur).add(r.key))
              }}>{r.label}</SidebarItem>
            ))}
          </nav>
          <div className="flex flex-col gap-1 p-2">
            <SidebarItem collapsed icon="panel-left" onClick={() => setCollapsed(false)}>Expand</SidebarItem>
          </div>
        </aside>
      ) : (
        <Panel side="left">
          <SidebarHeader logomark={<Logomark width={16} height={16} />} title="KOL labs" />
          <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2" data-sidebar>
            <SidebarGroupLabel>Labs</SidebarGroupLabel>
            {rows.map((r) => {
              const open = expanded.has(r.key)
              return (
                <div key={r.key} className="flex flex-col gap-1">
                  <SidebarItem icon={r.icon} open={r.sub ? open : undefined} active={!r.sub && !!r.active} onClick={() => (r.sub ? toggleSection(r.key) : pick(r))}>
                    {r.label}
                  </SidebarItem>
                  {r.sub && open && (
                    <SidebarSub>
                      {r.sub.map((s) => <SidebarSubItem key={s.key} active={!!s.active} onClick={() => pick(s)}>{s.label}</SidebarSubItem>)}
                    </SidebarSub>
                  )}
                </div>
              )
            })}
          </nav>
          <div className="flex flex-col gap-1 p-2">
            <SidebarItem icon="panel-left" onClick={() => setCollapsed(true)}>Collapse</SidebarItem>
          </div>
        </Panel>
      )}

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-canvas" data-stage>
        <div className="flex min-h-0 flex-1 px-12 pt-12 pb-28">
          {/* `.kol-design-editor` is the root class the engine's sheet scopes to; it stays on this box */}
          <div className="kol-design-editor min-h-0 min-w-0 flex-1">
            <OutputCanvas />
          </div>
        </div>
        {(layer || morph.active) && <ToolbarDock />}
        {needsSource && <SourceCard layer={layer} title={sheetLabels(layer).title} onBack={() => removeLayer(layer.id)} />}
        {picker && !needsSource && !morph.picker && (
          <PickerCard
            title={pickSection ? pickSection.label : 'Labs'}
            rows={pickerRows}
            onBack={pickSection ? () => setPickerSection(null) : null}
            onClose={() => { setDoor(null); setPicker(false) }}
          />
        )}
      </main>

      {/* an empty stage has no property rail, as in the real Labs */}
      {(layer || morph.active) && (
        <Panel side="right">
          <div className="flex h-12 shrink-0 items-center gap-2 pr-2 pl-3" data-rail-header>
            <span className="min-w-0 truncate text-label font-medium">{title}</span>
            {presetLabel && <span className="min-w-0 flex-1 truncate text-right font-mono text-label text-muted">{presetLabel}</span>}
            {!presetLabel && <span className="flex-1" />}
            <span className="flex shrink-0 items-center"><History /></span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {morph.active
              ? <Group><p className="text-label text-faint">The morph rail is not redrawn in the minimal style.</p></Group>
              : layer
                ? <Surface key={layer.id} layer={layer} />
                : null}
          </div>
        </Panel>
      )}
    </div>
  )
}

/* no draft restore: each visit opens on the empty stage, as the real Labs does without a saved draft */
export default function Labs() {
  return (
    <EditorProviders persistDraft={false} draftKey="kol.minimal.labs-draft">
      <Screen />
    </EditorProviders>
  )
}
