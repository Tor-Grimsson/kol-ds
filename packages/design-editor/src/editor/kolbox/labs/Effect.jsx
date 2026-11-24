import { useRef } from 'react'
import {
  aboutOf, allScopeParams, canEffectLevel, categoryOf, computeRoll, deriveScopes, effectCategories, ensureWebcam, FILTERS,
  FX_RACK_GROUPS, MAX_FILTERS, mulberry32, nudgeSettings, paramTab, PHOTO_SCHEMA, postProcessingFilters, presetParamOf,
  presetPatchFor, rackGroupFilters, randomEffectId, randomEffectPreset, randomSeed, resolvedChain, SEED_MIN_PARAMS,
  stillToDataUrl, tidyScopes, useComposeState, useLabsKeys, useLayerEdit, useRollSeed, setAppSetting, useAppSettings,
} from './engine.js'
import { AboutButton, CommitInput, InputList, ModulateList, OffOn, ParamList, ParamSelect, RollScopes } from './Params.jsx'
import { SweepStack } from './Parts.jsx'
import { pickMedia } from '../editor/windows/WindowMediaPicker.jsx'
import { Button, Dropdown, LabeledControl, LabeledControlSection, TreeRow } from '@kolkrabbi/kol-component'

/* The effect page's settings (the package's EffectSurface: Effect and Motion tabs over the layer's filter chain), as
   apps/minimal/src/labs/Effect.jsx reads them; drawn with kolbox's rail parts. */
export const EFFECT_TABS = [{ value: 'effect', label: 'Effect' }, { value: 'anim', label: 'Motion' }]

export function effectTitle(layer) {
  if (layer.fxGroup) return 'Effects'
  const chain = resolvedChain(layer)
  const stage = chain.find((s) => !s.def?.first)
  return stage && categoryOf(stage.id) !== 'halftone' ? stage.def.label : null
}

/* The added effects: one row each (name, eye, minus; Figma plan 13.2's effect row), its params under it while on. */
export function StackCards({ chain, from = 0, layer, hostView, toggleFilter, removeFilter, setStagePropAt, palette }) {
  return chain.slice(from).map((s, i) => {
    const idx = i + from
    const on = s.enabled !== false
    const view = { ...hostView, ...s.params, id: layer.id }
    return (
      <div key={s.key ?? idx} className="flex flex-col gap-2">
        <div className="flex h-control items-center gap-1">
          <span className={`min-w-0 flex-1 truncate text-label ${on ? 'text-text' : 'text-muted'}`}>{s.def?.label ?? s.id}</span>
          <Button variant="kolbox" iconOnly={on ? 'eye-on' : 'eye-off'} aria-label={on ? 'Hide effect' : 'Show effect'} onClick={() => toggleFilter(layer.id, idx)}/>
          <Button variant="kolbox" iconOnly="minus" aria-label="Delete effect" onClick={() => removeFilter(layer.id, idx)}/>
        </div>
        {on && s.def && <ParamList flat schema={s.def.params.filter((p) => paramTab(p) !== 'anim')} layer={view} setProp={setStagePropAt(idx)} palette={palette} />}
      </div>
    )
  })
}

/* the roll block: the seed, the level buttons (or Randomize all), reset, the scope buttons */
function StageRolls({ def, view, tab, onPatch, levels }) {
  const seed = useRollSeed(view)
  const motion = tab === 'anim'
  const params = def.params.filter((p) => (paramTab(p) === 'anim') === motion)
  const all = motion ? params.filter((p) => !p.noRandom) : allScopeParams(params, view)
  const scopes = tidyScopes(deriveScopes(params, view), all)
  const roll = (ps, scope) => { if (ps.length) onPatch(computeRoll(view, ps, seed.take(), { stripNoRandom: !!scope?.motion })) }
  const reset = (ps) => { const patch = {}; for (const p of ps) if (p.default !== undefined) patch[p.key] = p.default; if (Object.keys(patch).length) onPatch(patch) }
  if (!all.length && !scopes.length) return null
  return (
    <>
      {all.length >= SEED_MIN_PARAMS && (
        <LabeledControl variant="kolbox" horizontal label="Seed"><CommitInput value={seed.value} aria-label="Seed" onCommit={(s) => { const n = Number(s); if (Number.isFinite(n)) seed.commit(n >>> 0) }} /></LabeledControl>
      )}
      {all.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {levels ?? <Button variant="kolbox" tone="secondary" className="min-w-0 flex-1" onClick={(e) => (e.altKey ? reset(all) : roll(all))}>{motion ? 'Randomize motion' : 'Randomize all'}</Button>}
          <Button variant="kolbox" iconOnly="refresh" aria-label="Reset to defaults" onClick={() => reset(all)}/>
        </div>
      )}
      <RollScopes scopes={scopes} onRoll={(sc) => roll(sc.params, sc)} onReset={(sc) => reset(sc.params)} />
    </>
  )
}

function PostList({ chain, from, layer, hostView, setStagePropAt, filters = null }) {
  const { addFilter, removeFilter, toggleFilter, palette } = useComposeState()
  const options = [{ value: '', label: 'Add FX…' }, ...(filters ?? postProcessingFilters(FILTERS)).map((f) => ({ value: f.id, label: f.label ?? f.id }))]
  return (
    <LabeledControlSection variant="kolbox" label="Post-Processing">
      <StackCards chain={chain} from={from} layer={layer} hostView={hostView} toggleFilter={toggleFilter} removeFilter={removeFilter} setStagePropAt={setStagePropAt} palette={palette} />
      {chain.length < MAX_FILTERS && <ParamSelect value="" options={options} onChange={(id) => { if (id) addFilter(layer.id, id) }} />}
    </LabeledControlSection>
  )
}

/* the halftone family (labs' one chipped effect family) */
export function EffectChips({ layer }) {
  const { addFilter, replaceFilter } = useComposeState()
  const chain = resolvedChain(layer)
  const eff = chain.findIndex((s) => !s.def?.first)
  const stage = eff < 0 ? null : chain[eff]
  const cat = effectCategories(FILTERS).find((c) => c.id === categoryOf(stage?.id))
  if (layer.fxGroup || cat?.id !== 'halftone') return null
  return (
    /* the family has five members, wider than one track in the rail's 208: drawn as the kit's Dropdown */
    <Dropdown variant="kolbox"
      className="w-full"
      value={stage?.id ?? ''}
      options={cat.filters.map((f) => ({ value: f.id, label: f.label }))}
      onChange={(id) => { if (!stage) addFilter(layer.id, id); else if (id !== stage.id) replaceFilter(layer.id, eff, id) }}
    />
  )
}

/* editor: the body sits in the editor's rail, where R and Shift+R stay the editor's keys (R is its Rectangle tool) */
export default function EffectBody({ layer, tab, editor = false }) {
  const { addFilter, replaceFilter, removeFilter, toggleFilter, updateLayer, palette } = useComposeState()
  const edit = useLayerEdit(layer.id, { history: 'coalesce' })
  const chain = resolvedChain(layer)
  const eff = chain.findIndex((s) => !s.def?.first)
  const at = eff < 0 ? chain.length : eff
  const stage = eff < 0 ? null : chain[eff]
  const bare = chain.map(({ def: _def, ...s }) => s)
  const view = stage ? { ...layer, ...stage.params, id: layer.id } : layer
  const setStagePropAt = (idx) => (k, v) => edit.patch({ filters: bare.map((s, i) => (i === idx ? { ...s, params: { ...s.params, [k]: v } } : s)) })
  const setStageProp = setStagePropAt(at)
  const patchStage = (patch) => updateLayer(layer.id, { filters: bare.map((s, i) => (i === at ? { ...s, params: { ...s.params, ...patch } } : s)) })
  /* `editor` is fixed for a mount, so the hook order never changes */
  if (!editor) useLabsKeys( // eslint-disable-line react-hooks/rules-of-hooks
    () => { if (stage) updateLayer(layer.id, { filters: bare.map((s, i) => (i === 0 ? { ...s, params: {} } : s)) }) },
    () => { if (stage) patchStage(computeRoll(view, allScopeParams(stage.def.params, view), randomSeed())) },
  )

  /* the rack: the layer is a stack */
  const appSettings = useAppSettings()
  const rack = layer.fxGroup ? FX_RACK_GROUPS.find((g) => g.id === layer.fxGroup) : null
  if (rack) {
    /* the rack's Motion tab: the sweeps of its stage, when it takes them (the real EffectSurface) */
    if (tab !== 'effect') return stage?.def?.sweeps ? <SweepStack sweeps={Array.isArray(stage.params.sweeps) ? stage.params.sweeps : []} onChange={(sw) => setStageProp('sweeps', sw)} /> : null
    return (
      <>
        <LabeledControlSection variant="kolbox" label="Effect stack">
          {chain.length === 0 && <p className="text-help text-muted">No effects yet — add one below.</p>}
          <StackCards chain={chain} from={0} layer={layer} hostView={view} toggleFilter={toggleFilter} removeFilter={removeFilter} setStagePropAt={setStagePropAt} palette={palette} />
        </LabeledControlSection>
        {chain.length < MAX_FILTERS && (
          <LabeledControlSection variant="kolbox" label={rack.label}>
            <ParamSelect value="" options={[{ value: '', label: 'Add effect…' }, ...rackGroupFilters(rack, FILTERS).map((f) => ({ value: f.id, label: `${f.label ?? f.id}${f.kind === 'pixi' ? ', GPU' : ''}` }))]} onChange={(id) => { if (id) addFilter(layer.id, id) }} />
          </LabeledControlSection>
        )}
      </>
    )
  }

  /* a bare photo: its fit params; the hint names Labs' nav, which the editor does not have, so there it shows nothing */
  if (!stage) return <ParamList schema={PHOTO_SCHEMA} layer={layer} setProp={edit.setProp} palette={palette} tab={tab === 'anim' ? 'anim' : 'style'} emptyHint={editor ? undefined : 'Pick an effect from the nav.'} />

  const params = stage.def.params.filter((p) => paramTab(p) !== 'anim')
  const pKey = presetParamOf(stage.def.id)
  const pIdx = pKey ? params.findIndex((x) => x.key === pKey) : -1
  let cut = params.length
  if (pIdx >= 0) { let i = pIdx; while (i + 1 < params.length && params[i + 1].type === 'select') i++; cut = i + 1 }
  const head = pIdx > 0 ? params.slice(0, pIdx) : []
  const cluster = pIdx >= 0 ? params.slice(pIdx, cut).map((p) => ({ ...p, section: undefined })) : params
  const auto = { layer: view, setProp: setStageProp, palette }

  if (tab === 'effect') {
    return (
      <>
        {head.length > 0 && <ParamList schema={head} {...auto} />}
        <LabeledControlSection variant="kolbox">
          <ParamList flat schema={cluster} {...auto} />
          <StageRolls def={stage.def} view={view} tab="effect" onPatch={patchStage} levels={(
            <>
              {[['type', 'Type'], ['category', 'Category'], ['preset', 'Preset']].filter(([lvl]) => canEffectLevel(stage.def, lvl)).map(([lvl, label]) => (
                <Button variant="kolbox" key={lvl} tone="secondary" aria-label={`Randomize ${label.toLowerCase()}`} onClick={() => {
                  const rand = mulberry32(randomSeed() >>> 0)
                  if (lvl === 'preset') { const v = randomEffectPreset(stage.def, view, rand); if (v != null) patchStage(presetPatchFor(stage.def, v)); return }
                  const id = randomEffectId(stage.id, lvl, rand)
                  if (id) replaceFilter(layer.id, at, id)
                }}>{label}</Button>
              ))}
              <Button variant="kolbox" tone="secondary" aria-label="Randomize settings" onClick={() => patchStage(nudgeSettings(view, allScopeParams(params, view), mulberry32(randomSeed() >>> 0)))}>Settings</Button>
              <AboutButton about={aboutOf(stage.def, true)} />
            </>
          )} />
        </LabeledControlSection>
        {cut < params.length && <ParamList schema={params.slice(cut)} {...auto} />}
        <PostList chain={chain} from={at + 1} layer={layer} hostView={view} setStagePropAt={setStagePropAt} />
      </>
    )
  }

  /* Motion */
  const media = chain.findIndex((s) => s.id === 'fx-media')
  const mediaStage = media < 0 ? null : chain[media]
  return (
    <>
      <InputList schema={stage.def.params} layer={view} setProp={setStageProp} inputs={stage.def.inputs} />
      <ParamList schema={stage.def.params} {...auto} tab="anim" />
      {/* Orbit on an effect with a camera: on only while Grab (C) is; switching it on switches Grab on */}
      {stage.def.orbit && (
        <LabeledControlSection variant="kolbox" label="Interaction">
          <LabeledControl variant="kolbox" horizontal label="Orbit (C)">
            <OffOn on={!!appSettings.grab && view.orbit !== false} onChange={(v) => { setStageProp('orbit', v); if (v && !appSettings.grab) setAppSetting('grab', true) }} />
          </LabeledControl>
        </LabeledControlSection>
      )}
      <LabeledControlSection variant="kolbox"><StageRolls def={stage.def} view={view} tab="anim" onPatch={patchStage} /></LabeledControlSection>
      {stage.def.sweeps && <SweepStack sweeps={Array.isArray(stage.params.sweeps) ? stage.params.sweeps : []} onChange={(sw) => setStageProp('sweeps', sw)} />}
      <ModulateList schema={stage.def.params} layer={view} setProp={setStageProp} />
      <LabeledControlSection variant="kolbox"
        label="Media"
        end={!mediaStage?.def && chain.length < MAX_FILTERS && <Button variant="kolbox" iconOnly="plus" aria-label="Add media motion" onClick={() => addFilter(layer.id, 'fx-media')}/>}
      >
        {mediaStage?.def && (
          <>
            <div className="flex h-control items-center gap-1">
              <span className="min-w-0 flex-1 truncate text-label text-text">{mediaStage.def.label ?? mediaStage.id}</span>
              <Button variant="kolbox" iconOnly="minus" aria-label="Remove media motion" onClick={() => removeFilter(layer.id, media)}/>
            </div>
            <ParamList flat schema={mediaStage.def.params} layer={{ ...view, ...mediaStage.params, id: layer.id }} setProp={setStagePropAt(media)} palette={palette} />
          </>
        )}
      </LabeledControlSection>
    </>
  )
}

/* An effect picked before any media: the card on the canvas asks for it. From library opens the media picker (round 3,
   3.1), its pick into this layer's source; the screen mounts the picker's host. */
export function SourceCard({ layer, title, onBack }) {
  const { patch } = useLayerEdit(layer.id)
  const fileRef = useRef(null)
  const onFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.type.startsWith('video/')) patch({ src: URL.createObjectURL(file), srcType: 'video' })
    else stillToDataUrl(file).then((src) => patch({ src, srcType: 'image' }))
  }
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center p-8" data-source-card>
      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFile} />
      <div className="flex w-80 flex-col gap-3 rounded-modal bg-panel p-4">
        <div className="flex flex-col gap-1">
          <span className="text-section text-text">{title}</span>
          <span className="text-help text-muted">Pick the media it works on.</span>
        </div>
        <div className="flex flex-col gap-2">
          <TreeRow variant="kolbox" icon="image" label="From library" onClick={() => pickMedia({ layerId: layer.id })} />
          <TreeRow variant="kolbox" icon="upload" label="Upload" onClick={() => fileRef.current?.click()} />
          <TreeRow variant="kolbox" icon="camera" label="Camera" onClick={() => ensureWebcam(layer.id).then(() => patch({ src: null, srcType: 'webcam' })).catch(() => {})} />
          <TreeRow variant="kolbox" icon="arrow-left" label="Back" onClick={onBack} />
        </div>
      </div>
    </div>
  )
}

