import { useEffect, useRef, useState } from 'react'
import { hostClient, hostStore } from '../host.js'
import { sampleMediaClient } from '../app/sampleMedia.js'
import { getAppSettings, isTyping, OutputCanvas, setMediaClient, setSettingsStore, transport, useComposeFile, useComposeState, useLabsBoot } from '../labs/engine.js'
import { useClock } from '../labs/Transport.jsx'
import GenerativeBody from '../labs/Generative.jsx'
import { CURVES, CYCLES, firstMorphPreset, MORPH_TYPES, morphPresetById, morphPresets, removeStep, reorderStep, sampleTrack, setMorph, stepLabel, useGeneratorLibrary } from '../morph/engine.js'
import { loadMorphPreset, morphTimeline, useMorphStage } from '../morph/stage.js'
import LabsWindows from '../labs/LabsWindows.jsx'
import StepPicker from '../morph/StepPicker.jsx'
import MorphFiles from '../morph/Files.jsx'
import { appRows, labsAction, LABS_MENUS } from '../ui/MenuMain.jsx'
import { useMainMenu } from '../app/chrome.js'
import LeftRail from '../ui/LeftRail.jsx'
import RightRail, { RailTop, RightRailTop } from '../ui/RightRail.jsx'
import { askPrompt } from '../ui/ask.js'
import ModalSearchHost from '../search/ModalSearchHost.jsx'
import Providers from '../app/Providers.jsx'
import { Button, Dropdown, LabeledControl, Slider, ToggleSwitch, LabeledControlSection, TreeRow, TimelineDock, EditorShell, Tooltip } from '@kolkrabbi/kol-component'
import { AppFloatNav } from '@kolkrabbi/kol-shell'

/* Morph (plan 4.3, Figma plan W17): its own mode, Morph lit on the track. The package's morph on the real engine: the
   store, presets and stage rule through ../morph/. LeftRail labs picks (the Morph section of the real Labs picker: the
   three types, each with its categories); RightRail labs holds the real Morph rail's settings (mode, Type, Category,
   Preset, the steps, Curve, Cycle, Sync loop, Resolution, Save). The timeline on, the transport toolbar off (Figma plan
   W15). Steps (plan 4.1), as the real MorphTab: the plus opens the add-step picker, a step pressed goes on the stage
   for editing with its Generate, Style and Animation fields in the rail (the Labs bodies), a drag or Alt+Up/Down
   reorders, Save names the morph and writes it to the file library; ⌘O opens the Files window. */
/* the host's media, or the sample library when it passed none (W4.2) */
setMediaClient(hostClient() ?? sampleMediaClient)
setSettingsStore(hostStore('kolbox-labs'))

const MODE_TABS = MORPH_TYPES.map((t) => ({ value: t.id, label: t.label }))
/* the mode strip, as the real MorphTab's: a mode the steps cannot take is a disabled tab, its reason the tab's tip */
const modeTabs = (blocked) => MORPH_TYPES.map((t) => ({ value: t.id, label: t.label, disabled: !!blocked[t.id], tooltip: blocked[t.id] ?? undefined }))
const GEN_TABS = [{ value: 'generate', label: 'Generate' }, { value: 'style', label: 'Style' }, { value: 'anim', label: 'Animation' }]
const categoriesOf = (type) => [...new Set(morphPresets().filter((p) => p.type === type).map((p) => p.category))]

/* the timeline on the engine's transport and the engine's layers, as the real Morph shows it (morph/stage.js
   morphTimeline); its own component, since the clock re-renders it every tick. The + adds a key at the head on the
   selected layer's first writable track, as the real one; a press on a row selects its layer; the eye and the lock
   are the engine's. The panel's own button hides it. */
function MorphTimeline({ morph, onClose }) {
  const c = useClock()
  const { layers, selectedIds, select, toggleLayer, toggleLayerLock, updateLayer, currentPresetName } = useComposeState()
  const { rows, count } = morphTimeline({ layers, morph, selectedIds, seconds: c.loopSeconds })
  const target = rows.find((r) => r.key && !r.readOnly && selectedIds.includes(r.layerId))
  const addKey = () => {
    const t = c.t
    updateLayer(target.layerId, { [target.key]: { bind: 'track', keys: [...target.keys, { t, v: sampleTrack(target.keys, t), easing: 'linear' }].sort((a, b) => a.t - b.t) } })
  }
  return (
    <TimelineDock variant="kolbox"
      tracks={rows}
      title={currentPresetName || 'Untitled'}
      count={count}
      time={c.time}
      duration={c.loopSeconds}
      playing={c.playing}
      loop={c.loop}
      onSeek={(s) => c.seek(s / c.loopSeconds)}
      onPlay={(on) => (on ? c.play() : c.pause())}
      onLoop={c.setLoop}
      onAddKeyframe={target ? addKey : undefined}
      onKeyframe={(_, __, k) => k.step != null && setMorph({ editRequest: k.step })}
      onSelect={(r) => r.layerId && select(r.layerId)}
      onToggleVisible={(r) => toggleLayer(r.layerId)}
      onToggleLock={(r) => toggleLayerLock(r.layerId)}
      onClose={onClose}
    />
  )
}

/* the transport toolbar while the timeline is hidden (Labs' toolbar, Figma plan W15), its Timeline cell bringing the
   timeline back */
function MorphTransport({ onTimeline }) {
  const c = useClock()
  return (
    <AppFloatNav variant="kolbox" transport
      playing={c.playing}
      time={c.time}
      loop={c.loop}
      loopLength={Math.round(c.loopSeconds * 100) / 100}
      onPlay={(on) => (on ? c.play() : c.pause())}
      onRewind={c.rewind}
      onStop={c.stop}
      onLoop={c.setLoop}
      onLoopLength={c.setLoopSeconds}
      onTimeline={onTimeline}
    />
  )
}

/* The steps, as the real StepList: a row per step (pressed, it is edited), its remove; a row dragged (pointer events,
   the real `grab` sort) or moved with Alt+Up and Alt+Down lands where it is dropped, through the store's reorderStep. */
function StepRows({ steps, editing, onEdit }) {
  const rows = useRef([])
  const [drag, setDrag] = useState(null)
  const swallow = useRef(false)
  const focusAt = useRef(null)
  useEffect(() => {
    if (focusAt.current == null) return
    rows.current[focusAt.current]?.querySelector('button')?.focus()
    focusAt.current = null
  })
  const down = (i) => (e) => {
    if (e.button !== 0 || e.target.closest('[data-remove]')) return
    const y0 = e.clientY
    const mids = rows.current.slice(0, steps.length).map((el) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2 })
    let moved = false
    const move = (ev) => {
      if (!moved && Math.abs(ev.clientY - y0) < 4) return
      moved = true
      setDrag({ i, dy: ev.clientY - y0 })
    }
    const up = (ev) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setDrag(null)
      if (!moved) return
      swallow.current = true
      setTimeout(() => { swallow.current = false }, 0)
      const y = mids[i] + ev.clientY - y0
      const to = mids.reduce((best, m, k) => (Math.abs(m - y) < Math.abs(mids[best] - y) ? k : best), 0)
      reorderStep(i, to)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  const key = (i) => (e) => {
    if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return
    const to = i + (e.key === 'ArrowUp' ? -1 : 1)
    if (to < 0 || to >= steps.length) return
    e.preventDefault()
    focusAt.current = to
    reorderStep(i, to)
  }
  return steps.map((s, i) => (
    <div
      key={i}
      ref={(el) => { rows.current[i] = el }}
      data-step-row={i}
      onPointerDown={down(i)}
      onKeyDown={key(i)}
      className={`relative flex touch-none items-center gap-1 select-none ${drag?.i === i ? 'z-10 cursor-grabbing' : 'cursor-grab'}`}
      style={drag?.i === i ? { transform: `translateY(${drag.dy}px)` } : undefined}
    >
      <span className="min-w-0 flex-1"><TreeRow variant="kolbox" label={`${i + 1} ${stepLabel(s, i)}`} active={editing === i} onClick={() => !swallow.current && onEdit(i)} /></span>
      <span data-remove><Button variant="kolbox" iconOnly="minus" aria-label="Remove step" onClick={() => removeStep(i)}/></span>
    </div>
  ))
}

/* Save, as the real MorphTab's: two steps or more; a morph not yet saved asks its name first ("Name this morph:", the
   real prompt's words and buttons), then the frame's spec with the morph on it goes into the file library; a morph
   opened from a file overwrites it. An edit in progress ends first and the stage rebuilds. */
function useSave(morph, endEdit) {
  const { setCurrentPresetId, setCurrentPresetName } = useComposeState()
  const { buildSavedSpec } = useComposeFile()
  const { addItem, updateItem } = useGeneratorLibrary()
  const [asking, setAsking] = useState(false)
  const write = async (name) => {
    const { steps, mode, curve, cycle, resolution, fileId } = morph
    endEdit()
    const spec = { ...(await buildSavedSpec(name || null)), mode: 'morph', morph: { mode, loopId: morph.loopId, steps, curve, cycle, resolution, syncLoop: morph.syncLoop, seconds: transport.getLoopSeconds() } }
    if (fileId) { updateItem('preset', fileId, spec); return }
    const id = addItem('preset', spec)
    if (id) { setMorph({ fileId: id, fileName: name || null }); setCurrentPresetId(id); setCurrentPresetName(name || null) }
  }
  const save = () => {
    if (morph.steps.length < 2) return
    if (morph.fileId) write(morph.fileName)
    else setAsking(true)
  }
  return { save, asking, cancel: () => setAsking(false), submit: (name) => { setAsking(false); write(name) } }
}

function Screen() {
  const { aspect, setAspect, selectedId, select } = useComposeState()
  const { morph, layer, blocked, editStep, endEdit } = useMorphStage()
  const { steps, mode, editing } = morph
  const current = morphPresetById(morph.presetId)
  const saving = useSave(morph, endEdit)
  /* the name, in the one prompt (kol-component's ModalProvider variant="kolbox", through ui/ask.js; W31.2 batch 4) */
  useEffect(() => { if (saving.asking) askPrompt({ title: 'Name this morph:' }).then((v) => (v == null ? saving.cancel() : saving.submit(v))) }, [saving.asking]) // eslint-disable-line react-hooks/exhaustive-deps
  const [editTab, setEditTab] = useState('generate')
  useEffect(() => { setEditTab('generate') }, [editing])

  useEffect(() => { if (!getAppSettings().defaultAspect) setAspect(aspect) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useLabsBoot()
  /* the one layer stays selected, as on Labs: every write resolves its subject from the selection */
  useEffect(() => { if (layer && selectedId !== layer.id) select(layer.id) }, [layer, selectedId, select])
  /* the route says the rail, as the real LabsView's /morph: the surface is on while the screen is, off when it goes.
     An empty morph opens empty, "1 Add a step", as the real one (round 4, W8: it opened on the first Shape run). */
  useEffect(() => {
    setMorph({ active: true })
    return () => setMorph({ active: false, editing: null })
  }, [])

  /* the real dock under the Morph rail, in his design (round 4, W8): the timeline is up on Morph and its own button
     hides it, the transport toolbar standing in until its Timeline cell (or Window › Timeline) brings it back; Output
     and File are the Window menu's windows (labs/LabsWindows.jsx, Labs' rows), with Export and Preview; Window ›
     Timeline added to Labs' Window rows */
  /* under 768 (round 4, W15) it starts down: the stage and the rails share the height; its Timeline cell brings it up */
  const [timelineOn, setTimelineOn] = useState(() => !window.matchMedia('(max-width: 767px)').matches)
  const menus = LABS_MENUS.map((m) => (m.label === 'Window'
    ? { ...m, groups: [...m.groups, [{ label: 'Timeline', check: timelineOn, run: () => setTimelineOn((v) => !v) }]] }
    : m))

  /* Space plays and pauses, as on the real labs chrome */
  useEffect(() => {
    const onKey = (e) => { if (!isTyping(e) && e.code === 'Space') { e.preventDefault(); transport.toggle() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* the picker: the real Labs picker's Morph section, a type opens its categories, a category loads its first run */
  const rows = MORPH_TYPES.map((t) => ({
    key: `morph:${t.id}`,
    icon: t.icon,
    label: t.label,
    sub: categoriesOf(t.id).map((c) => ({
      key: `morph:${t.id}:${c}`,
      label: c,
      run: () => loadMorphPreset(firstMorphPreset(t.id, c)),
      active: current?.type === t.id && current.category === c,
    })),
  }))

  /* Type, Category, Preset: the Morph rail's picking stack (its TreePicker); a morph built by hand shows its mode */
  const type = current?.type ?? mode
  const category = current?.category ?? categoriesOf(type)[0]
  const presets = morphPresets().filter((p) => p.type === type && p.category === category)
  const pickPreset = (id) => loadMorphPreset(morphPresetById(id))
  const setSetting = (k, v) => setMorph({ [k]: v })

  /* the switcher's mark opens Morph's menus (the retired top rail's, W1.2) */
  useMainMenu({ menus, app: appRows({ mode: 'morph' }) })
  return (
    <EditorShell variant="kolbox"
      canvasFooter={timelineOn && <MorphTimeline morph={morph} onClose={() => setTimelineOn(false)} />}
      toolbar={!timelineOn && <MorphTransport onTimeline={() => setTimelineOn(true)} />}
      left={<LeftRail variant="labs" rows={rows} onPick={(r) => r.run?.()} />}
      right={<RailTop.Provider value={<RightRailTop onPreview={labsAction('preview')} onExport={labsAction('export-png')} />}>{editing != null && layer ? (
        /* a step being edited: its own fields, the Labs bodies writing to the step on the stage; the header's arrow goes
           back to the morph's settings */
        <RightRail
          variant="labs"
          title={`Step ${editing + 1}`}
          meta={stepLabel(steps[editing] ?? {}, editing)}
          actions={<Button variant="kolbox" iconOnly="arrow-left" aria-label="Back to Morph" onClick={endEdit}/>}
          tabs={GEN_TABS}
          tab={editTab}
          onTab={setEditTab}
        >
          <GenerativeBody key={layer.id} layer={layer} tab={editTab} picker={false} />
          <LabeledControlSection variant="kolbox"><p className="text-help text-muted">Editing step {editing + 1} — press Play to run the morph.</p></LabeledControlSection>
        </RightRail>
      ) : (
        <RightRail variant="labs" title="Morph" meta={morph.fileName} tabs={modeTabs(blocked)} tab={mode} onTab={(v) => !blocked[v] && setMorph({ mode: v })}>
          <LabeledControlSection variant="kolbox">
            <LabeledControl variant="kolbox" horizontal label="Type">
              <Dropdown variant="kolbox" className="min-w-0 flex-1" value={type} options={MODE_TABS} onChange={(t) => loadMorphPreset(firstMorphPreset(t))} />
            </LabeledControl>
            <LabeledControl variant="kolbox" horizontal label="Category">
              <Dropdown variant="kolbox" className="min-w-0 flex-1" value={category} options={categoriesOf(type)} onChange={(c) => loadMorphPreset(firstMorphPreset(type, c))} />
            </LabeledControl>
            <LabeledControl variant="kolbox" label="Preset">
              <Tooltip variant="kolbox" label="Preset"><Dropdown variant="kolbox" className="min-w-0 w-full" ariaLabel="Preset" value={current?.id ?? ''} options={current ? presets.map((p) => ({ value: p.id, label: p.label })) : []} onChange={pickPreset} /></Tooltip>
            </LabeledControl>
          </LabeledControlSection>
          <LabeledControlSection variant="kolbox" label="Steps" end={<Button variant="kolbox" iconOnly="plus" aria-label="Add a step" onClick={() => setMorph({ active: true, picker: 'preset' })}/>}>
            <StepRows steps={steps} editing={editing} onEdit={editStep} />
            {steps.length < 2 && <p className="text-help text-muted">Two steps or more and the stage plays the morph.</p>}
            {steps.length >= 2 && blocked[mode] && <p className="text-help text-muted">{blocked[mode]}</p>}
          </LabeledControlSection>
          <LabeledControlSection variant="kolbox">
            <LabeledControl variant="kolbox" horizontal label="Curve"><Dropdown variant="kolbox" className="min-w-0 flex-1" value={morph.curve} options={CURVES} onChange={(v) => setSetting('curve', v)} /></LabeledControl>
            <LabeledControl variant="kolbox" horizontal label="Cycle"><Dropdown variant="kolbox" className="min-w-0 flex-1" value={morph.cycle} options={CYCLES} onChange={(v) => setSetting('cycle', v)} /></LabeledControl>
            <LabeledControl variant="kolbox" horizontal label="Sync loop"><span className="flex flex-1 justify-end"><Tooltip variant="kolbox" label="Sync loop"><ToggleSwitch variant="kolbox" aria-label="Sync loop" checked={!!morph.syncLoop} onChange={(v) => setSetting('syncLoop', v)} /></Tooltip></span></LabeledControl>
            {mode === 'shape' && (
              <LabeledControl variant="kolbox" horizontal label="Resolution">
                <Slider variant="kolbox" className="min-w-0 flex-1" aria-label="Resolution" value={morph.resolution} min={0} max={1024} step={1} formatValue={(v) => (v ? v : 'Auto')} onChange={(v) => setSetting('resolution', v)} />
              </LabeledControl>
            )}
          </LabeledControlSection>
          {/* a morph needs two steps to save; until then the button is not drawn */}
          {steps.length >= 2 && (
            <LabeledControlSection variant="kolbox">
              <Button variant="kolbox" tone="primary" className="w-full" onClick={saving.save}>{morph.fileId ? 'Save' : 'Save…'}</Button>
            </LabeledControlSection>
          )}
        </RightRail>
      )}</RailTop.Provider>}
    >
      <div className="flex h-full p-8">
        {/* `.kol-design-editor` is the root class the engine's sheet scopes to; it stays on this box */}
        <div className="kol-design-editor min-h-0 min-w-0 flex-1" data-output>
          <OutputCanvas />
        </div>
      </div>
      <StepPicker />
      <MorphFiles />
      <ModalSearchHost mode="morph" />
      <LabsWindows files={false} />
    </EditorShell>
  )
}

/* no draft: the morph's steps are the store's module state, so they outlive a move; each visit opens on the morph in
   the store, or the first Shape run */
export default function Morph() {
  return (
    <Providers persistDraft={false}>
      <Screen />
    </Providers>
  )
}
