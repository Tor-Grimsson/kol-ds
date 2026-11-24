import { useEffect, useRef, useState } from 'react'
import { hostClient, hostStore } from '../host.js'
import { sampleMediaClient } from '../app/sampleMedia.js'
import {
  getAppSettings, isTyping, LABS_DRAFT_KEY, matchCombo, setAppSetting, toggleDots, KINETIC_PRESETS, KINETIC_TREE, MISC_TREE, OutputCanvas, presetById, presetLayerPatch,
  presetsInSub, setMediaClient, setSettingsStore, sheetLabels, stepPreset, STEP_KEYS, transport, useComposeState,
  useLabsBoot, useLabsLayer,
} from '../labs/engine.js'
import { useCatalog } from '../labs/useCatalog.js'
import GenerativeBody, { generativeTitle } from '../labs/Generative.jsx'
import KineticBody from '../labs/Kinetic.jsx'
import EffectBody, { EFFECT_TABS, EffectChips, effectTitle, SourceCard } from '../labs/Effect.jsx'
import LabsTransport from '../labs/Transport.jsx'
import LabsStage from '../labs/Stage.jsx'
import LabsWindows from '../labs/LabsWindows.jsx'
import LineSwellLabs from '../labs/LineSwellLabs.jsx'
import LeftRail from '../ui/LeftRail.jsx'
import RightRail, { RailTop, RightRailTop } from '../ui/RightRail.jsx'
import { appRows, labsAction, LABS_MENUS } from '../ui/MenuMain.jsx'
import { useMainMenu } from '../app/chrome.js'
import ModalSearchHost from '../search/ModalSearchHost.jsx'
import Providers from '../app/Providers.jsx'
import LabsStartPicker from '../app/LabsStartPicker.jsx'
import { useLabsAddress } from '../app/labsAddress.js'
import { Button, EditorShell } from '@kolkrabbi/kol-component'

/* Labs (plan 4.1): the Shell with Labs lit; LeftRail labs is the lab picker, RightRail labs the open lab's title, tabs
   and settings; the canvas is the engine's output. State, catalog and every write are the package's own, through
   ../labs/engine.js. It opens on the start picker (round 4, W9), as the real Labs: nothing on the stage until a pick,
   unless the address names one or the draft is restored. Timeline off, the transport toolbar on (Figma plan W15), on the engine's
   transport. */
/* the host's media, or the sample library when it passed none (W4.2) */
setMediaClient(hostClient() ?? sampleMediaClient)
setSettingsStore(hostStore('kolbox-labs'))

/* round 4, W11, his ruling: the Randomiser is reached from the Labs rail, a row at the foot of the picker (the real
   rail's glyph) */
const RANDOMISER_ROW = { key: 'randomiser', icon: 'refresh', label: 'Randomiser', run: () => { window.location.hash = '#/randomiser' } }

const GEN_TABS = [{ value: 'generate', label: 'Generate' }, { value: 'style', label: 'Style' }, { value: 'anim', label: 'Animation' }]

/* Para Type's single glyphs: its presets as buttons */
function GlyphChips({ layer }) {
  const { setOnly } = useLabsLayer()
  const current = layer.loopGroup === 'paratype' && presetsInSub('paratype', 'Glyphs').find((p) => p.id === layer.presetId)
  if (!current) return null
  return (
    <div className="flex flex-wrap items-center gap-1">
      {presetsInSub('paratype', 'Glyphs').map((p) => (
        <Button variant="kolbox" key={p.id} tone={p.id === layer.presetId ? 'primary' : 'secondary'} onClick={() => p.id !== layer.presetId && setOnly(layer.type, presetLayerPatch(p, layer.loopGroup))}>{p.label}</Button>
      ))}
    </div>
  )
}

function railTitle(layer) {
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
  const rows = useCatalog()

  /* the provider seeds a square canvas under a 4:5 aspect; labs' boot then reads the default aspect and loop length */
  useEffect(() => { if (!getAppSettings().defaultAspect) setAspect(aspect) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useLabsBoot()
  /* the pick in the address: read once on arrival, written on every pick (app/labsAddress.js) */
  useLabsAddress()

  /* the start picker, the real LabsBody's rule: open while the stage is empty, gone on a pick, back when the layer goes.
     Effects on a stage with no media makes the empty photo layer (its source card asks for the media) and remembers the
     door; the media landing opens the picker again on that door */
  /* his ruling 2026-11-18: "this is only a quick select for mobile, not a standard labs greeting". The picker shows on a
     phone only; on a desktop an empty stage opens Flow, as kolbox did before, and the left rail is the picker */
  const isPhone = useRef(window.matchMedia('(max-width: 767px)').matches).current
  const [picker, setPicker] = useState(() => isPhone && !layer)
  useEffect(() => { setPicker(isPhone && !layer) }, [layer?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  const [door, setDoor] = useState(null)
  const hasMedia = layer?.type === 'photo' && (!!layer.src || layer.srcType === 'webcam')
  useEffect(() => { if (isPhone && door && hasMedia) setPicker(true) }, [door, hasMedia]) // eslint-disable-line react-hooks/exhaustive-deps
  /* seeded once per empty stage (a ref, so StrictMode's second effect run cannot add a second Flow), and never over a
     pick the address carries */
  const seeded = useRef(false)
  useEffect(() => {
    if (layer) { seeded.current = false; return }
    if (isPhone || seeded.current || new URL(window.location.href).searchParams.get('preset')) return
    const flow = rows.flatMap((r) => r.sub ?? [r]).find((r) => r.label === 'Flow')
    if (flow?.run) { seeded.current = true; flow.run() }
  }, [layer?.id, rows.length]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!layer) setDoor(null) }, [layer])
  /* the picker lists Morph where the real catalog has it (before Vector); in kolbox Morph is its own mode, so the row
     goes there */
  const pickerRows = rows.flatMap((r) => (r.key === 'sec:vector' ? [{ key: 'sec:morph', icon: 'swap', label: 'Morph', run: () => { window.location.hash = '#/morph' } }, r] : [r]))

  /* the one layer stays selected: every write resolves its subject from the selection */
  useEffect(() => { if (layer && selectedId !== layer.id) select(layer.id) }, [layer, selectedId, select])

  /* `\` hides and shows both rails (round 4, W5: the real Collapse navigation, which leaves the stage and its play
     button); the transport toolbar stays, with the cell that brings them back */
  const [railsHidden, setRailsHidden] = useState(false)

  /* Space plays and pauses, Cmd+Z undoes, h l and the arrows step presets, j k categories; as the real LabsBody, C flips
     Settings' Grab (the stage's tool follows it), Z flips Zoom lock, M the modulation dots (the real LabsParams' key),
     and ⇧\ the rails (kolbox's `\` is RailSwitcher's, plan-2026-11-20 W1.3) */
  const ref = useRef({}); ref.current = { layer, undo, redo, updateLayer }
  useEffect(() => {
    const onKey = (e) => {
      if (isTyping(e)) return
      const r = ref.current
      if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); if (e.shiftKey) r.redo(); else r.undo(); return }
      if (e.code === 'Space') { e.preventDefault(); transport.toggle(); return }
      if (e.code === 'Backslash' && e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); setRailsHidden((v) => !v); return }
      const bare = !e.metaKey && !e.ctrlKey && !e.altKey
      if (bare && (e.key === 'c' || e.key === 'C')) { setAppSetting('grab', !getAppSettings().grab); return }
      if (bare && (e.key === 'z' || e.key === 'Z')) { setAppSetting('zoomLock', !getAppSettings().zoomLock); return }
      if (bare && !e.shiftKey && (e.key === 'm' || e.key === 'M')) { toggleDots(); return }
      const k = !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey && STEP_KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key]
      if (k && r.layer) { const patch = stepPreset(r.layer, k[1], k[0]); if (patch) { e.preventDefault(); r.updateLayer(r.layer.id, patch) } }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* the rail's tabs: Generate, Style, Animation for a generator; Effect, Motion for an effect; back to the first on a
     new lab, to Effect when an effect is picked */
  const isGen = layer && layer.type !== 'photo'
  /* a Line Swell board is one panel, its board's, so it has no tabs (R8.4) */
  const tabs = isGen ? (layer.loopGroup === 'lineswell' ? null : GEN_TABS) : EFFECT_TABS
  const [tab, setTab] = useState(null)
  useEffect(() => { setTab(null) }, [layer?.id])
  useEffect(() => {
    const on = () => setTab('effect')
    window.addEventListener('kol:open-effects', on)
    return () => window.removeEventListener('kol:open-effects', on)
  }, [])
  const current = tabs?.some((t) => t.value === tab) ? tab : tabs?.[0].value

  const needsSource = layer?.type === 'photo' && !layer.src && layer.srcType !== 'webcam'
  /* a kinetic layer's preset is the composer's own, never the generic loop list's (which answered Circle morph) */
  const presetLabel = layer?.presetId
    ? ((layer.type === 'kinetic' ? KINETIC_PRESETS.find((p) => p.id === layer.presetId) : presetById(layer.presetId))?.label ?? layer.presetLabel)
    : null
  const pick = (row) => row.run?.()

  /* the switcher's mark opens Labs' menus (the retired top rail's, W1.2) */
  useMainMenu({ menus: LABS_MENUS, app: appRows({ mode: 'labs' }) })
  return (
    <EditorShell variant="kolbox"
      toolbar={<LabsTransport railsHidden={railsHidden} onRails={() => setRailsHidden((v) => !v)} />}
      left={!railsHidden && <LeftRail variant="labs" rows={[...rows, RANDOMISER_ROW]} onPick={pick} />}
      right={!railsHidden && (
        <RailTop.Provider value={<RightRailTop onPreview={labsAction('preview')} onExport={labsAction('export-png')} />}>
        <RightRail variant="labs" title={railTitle(layer)} meta={presetLabel} tabs={tabs} tab={current} onTab={setTab}>
          {layer && (layer.type === 'photo' || layer.loopGroup === 'paratype') && (
            <div className="flex flex-col gap-2 px-4 pb-3 empty:hidden">
              {layer.type === 'photo' ? <EffectChips layer={layer} /> : <GlyphChips layer={layer} />}
            </div>
          )}
          {layer?.type === 'photo' && <EffectBody key={layer.id} layer={layer} tab={current} />}
          {layer?.type === 'loop' && (layer.loopGroup === 'lineswell' ? <LineSwellLabs key={layer.id} layer={layer} /> : <GenerativeBody key={layer.id} layer={layer} tab={current} />)}
          {layer?.type === 'misc' && <GenerativeBody key={layer.id} layer={layer} tab={current} tree={MISC_TREE} />}
          {layer?.type === 'kinetic' && <KineticBody key={layer.id} layer={layer} tab={current} />}
        </RightRail>
        </RailTop.Provider>
      )}
    >
      {/* the output with the engine's on-canvas editors (round 4 W7), its zoom, pan and fps (round 4, 6.3) */}
      <LabsStage />
      {needsSource && <SourceCard layer={layer} title={sheetLabels(layer).title} onBack={() => removeLayer(layer.id)} />}
      {picker && (
        <LabsStartPicker
          rows={pickerRows}
          initialOpen={door}
          hasMedia={hasMedia}
          onNeedMedia={(key) => { setDoor(key); setOnly('photo', { filters: [], fxGroup: null }) }}
          onPicked={() => { setDoor(null); setPicker(false) }}
          onClose={() => { setDoor(null); setPicker(false) }}
        />
      )}
      <ModalSearchHost mode="labs" />
      {/* the editor's windows on Labs: Output, File, Batch export, the bake, Shortcuts, Settings, the media picker (it
          serves the source card's From library too) and Files (round 4, 6.1, 6.2, 7.3) */}
      <LabsWindows />
    </EditorShell>
  )
}

/* the real Labs' draft (round 4, W9): its own slot, never the editor's, offered back with "Restore your last canvas?" */
export default function Labs() {
  return (
    <Providers draftKey={LABS_DRAFT_KEY}>
      <Screen />
    </Providers>
  )
}
