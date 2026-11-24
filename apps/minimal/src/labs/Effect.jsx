import { useRef } from 'react'
import {
  aboutOf, allScopeParams, canEffectLevel, categoryOf, computeRoll, deriveScopes, effectCategories, ensureWebcam, FILTERS,
  FX_RACK_GROUPS, MAX_FILTERS, mulberry32, nudgeSettings, paramTab, PHOTO_SCHEMA, postProcessingFilters, presetParamOf,
  presetPatchFor, rackGroupFilters, randomEffectId, randomEffectPreset, randomSeed, resolvedChain, SEED_MIN_PARAMS,
  stillToDataUrl, tidyScopes, useComposeState, useLabsKeys, useLayerEdit, useRollSeed,
} from './engine.js'
import { AboutButton, Group, InputList, ModulateList, ParamList, ParamSelect } from './ParamsRail.jsx'
import Button from '../ui/Button.jsx'
import FieldRow from '../ui/FieldRow.jsx'
import InputNumber from '../ui/InputNumber.jsx'
import Segmented from '../ui/Segmented.jsx'
import Toggle from '../ui/Toggle.jsx'
import { PickerCard } from '../ui/PickerCard.jsx'

/* The effect page's rail (the package's EffectSurface: Effect and Motion tabs over the layer's filter chain), redrawn. */
export const EFFECT_TABS = [{ value: 'effect', label: 'Effect' }, { value: 'anim', label: 'Motion' }]

export function effectTitle(layer) {
  if (layer.fxGroup) return 'Effects'
  const chain = resolvedChain(layer)
  const stage = chain.find((s) => !s.def?.first)
  return stage && categoryOf(stage.id) !== 'halftone' ? stage.def.label : null
}

/* The effect cards: the name as the switch, a remove button, its params while on. */
export function StackCards({ chain, from = 0, layer, hostView, toggleFilter, removeFilter, setStagePropAt, palette }) {
  return chain.slice(from).map((s, i) => {
    const idx = i + from
    const on = s.enabled !== false
    const view = { ...hostView, ...s.params, id: layer.id }
    return (
      <div key={s.key ?? idx} className="flex flex-col gap-2 rounded-field bg-field/50 p-2">
        <div className="flex items-center gap-2">
          <Toggle checked={on} onChange={() => toggleFilter(layer.id, idx)} />
          <span className="min-w-0 flex-1 truncate text-label text-fg">{s.def?.label ?? s.id}</span>
          <Button icon="x" aria-label="Delete effect" onClick={() => removeFilter(layer.id, idx)} />
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
    <div className="flex flex-col gap-2">
      {all.length >= SEED_MIN_PARAMS && <FieldRow label="Seed"><InputNumber value={seed.value} chars={10} onCommit={(s) => { const n = Number(s); if (Number.isFinite(n)) seed.commit(n >>> 0) }} aria-label="Seed" /></FieldRow>}
      {all.length > 0 && (
        <div className="flex gap-2">
          {levels ?? <Button variant="outline" className="min-w-0 flex-1" onClick={(e) => (e.altKey ? reset(all) : roll(all))}>{motion ? 'Randomize motion' : 'Randomize all'}</Button>}
          <Button variant="outline" icon="refresh" aria-label="Reset to defaults" onClick={() => reset(all)} />
        </div>
      )}
      {scopes.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {scopes.map((sc) => <Button key={sc.id} variant="outline" onClick={(e) => (e.altKey ? reset(sc.params) : roll(sc.params, sc))}>{sc.label}</Button>)}
        </div>
      )}
    </div>
  )
}

function PostList({ chain, from, layer, hostView, setStagePropAt, filters = null }) {
  const { addFilter, removeFilter, toggleFilter, palette } = useComposeState()
  const options = [{ value: '', label: 'Add FX…' }, ...(filters ?? postProcessingFilters(FILTERS)).map((f) => ({ value: f.id, label: f.label ?? f.id }))]
  return (
    <Group label="Post-Processing">
      <StackCards chain={chain} from={from} layer={layer} hostView={hostView} toggleFilter={toggleFilter} removeFilter={removeFilter} setStagePropAt={setStagePropAt} palette={palette} />
      {chain.length < MAX_FILTERS && <div className="flex"><ParamSelect value="" options={options} onChange={(id) => { if (id) addFilter(layer.id, id) }} /></div>}
    </Group>
  )
}

/* the chips row: the halftone trio's siblings (labs' one chipped effect family) */
export function EffectChips({ layer }) {
  const { addFilter, replaceFilter } = useComposeState()
  const chain = resolvedChain(layer)
  const eff = chain.findIndex((s) => !s.def?.first)
  const stage = eff < 0 ? null : chain[eff]
  const cat = effectCategories(FILTERS).find((c) => c.id === categoryOf(stage?.id))
  if (layer.fxGroup || cat?.id !== 'halftone') return null
  return (
    <Segmented
      options={cat.filters.map((f) => ({ value: f.id, label: f.label }))}
      value={stage?.id ?? null}
      onChange={(id) => { if (!stage) addFilter(layer.id, id); else if (id !== stage.id) replaceFilter(layer.id, eff, id) }}
    />
  )
}

export default function EffectBody({ layer, tab }) {
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
  useLabsKeys(
    () => { if (stage) updateLayer(layer.id, { filters: bare.map((s, i) => (i === 0 ? { ...s, params: {} } : s)) }) },
    () => { if (stage) patchStage(computeRoll(view, allScopeParams(stage.def.params, view), randomSeed())) },
  )

  /* the rack: the layer is a stack */
  const rack = layer.fxGroup ? FX_RACK_GROUPS.find((g) => g.id === layer.fxGroup) : null
  if (rack) {
    if (tab !== 'effect') return null
    return (
      <>
        <Group label="Effect stack">
          {chain.length === 0 && <p className="text-label text-faint">No effects yet — add one below.</p>}
          <StackCards chain={chain} from={0} layer={layer} hostView={view} toggleFilter={toggleFilter} removeFilter={removeFilter} setStagePropAt={setStagePropAt} palette={palette} />
        </Group>
        {chain.length < MAX_FILTERS && (
          <Group label={rack.label}>
            <div className="flex"><ParamSelect value="" options={[{ value: '', label: 'Add effect…' }, ...rackGroupFilters(rack, FILTERS).map((f) => ({ value: f.id, label: `${f.label ?? f.id}${f.kind === 'pixi' ? ', GPU' : ''}` }))]} onChange={(id) => { if (id) addFilter(layer.id, id) }} /></div>
          </Group>
        )}
      </>
    )
  }

  /* a bare photo: its fit params */
  if (!stage) return <ParamList schema={PHOTO_SCHEMA} layer={layer} setProp={edit.setProp} palette={palette} tab={tab === 'anim' ? 'anim' : 'style'} emptyHint="Pick an effect from the nav." />

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
        <Group>
          <ParamList flat schema={cluster} {...auto} />
          <StageRolls def={stage.def} view={view} tab="effect" onPatch={patchStage} levels={(
            <>
              {[['type', 'Type'], ['category', 'Category'], ['preset', 'Preset']].filter(([lvl]) => canEffectLevel(stage.def, lvl)).map(([lvl, label]) => (
                <Button key={lvl} variant="outline" className="min-w-0 flex-1" aria-label={`Randomize ${label.toLowerCase()}`} onClick={() => {
                  const rand = mulberry32(randomSeed() >>> 0)
                  if (lvl === 'preset') { const v = randomEffectPreset(stage.def, view, rand); if (v != null) patchStage(presetPatchFor(stage.def, v)); return }
                  const id = randomEffectId(stage.id, lvl, rand)
                  if (id) replaceFilter(layer.id, at, id)
                }}>{label}</Button>
              ))}
              <Button variant="outline" className="min-w-0 flex-1" aria-label="Randomize settings" onClick={() => patchStage(nudgeSettings(view, allScopeParams(params, view), mulberry32(randomSeed() >>> 0)))}>Settings</Button>
              <AboutButton about={aboutOf(stage.def, true)} />
            </>
          )} />
        </Group>
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
      <Group><StageRolls def={stage.def} view={view} tab="anim" onPatch={patchStage} /></Group>
      <ModulateList schema={stage.def.params} layer={view} setProp={setStageProp} />
      <Group label="Media">
        {mediaStage?.def ? (
          <>
            <ParamList flat schema={mediaStage.def.params} layer={{ ...view, ...mediaStage.params, id: layer.id }} setProp={setStagePropAt(media)} palette={palette} />
            <Button variant="outline" icon="x" className="w-full" onClick={() => removeFilter(layer.id, media)}>Remove media motion</Button>
          </>
        ) : chain.length < MAX_FILTERS && (
          <Button variant="outline" icon="plus" className="w-full" onClick={() => addFilter(layer.id, 'fx-media')}>Add media motion</Button>
        )}
      </Group>
    </>
  )
}

/* An effect picked before any media: the card asks for it. From library is the package's media window, not redrawn
   here: drawn in place, inert. */
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
    <>
      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFile} />
      <PickerCard
        title={title}
        subtitle="Pick the media it works on."
        rows={[
          { label: 'From library', icon: 'image', onClick: () => {} },
          { label: 'Upload', icon: 'upload', onClick: () => fileRef.current?.click() },
          { label: 'Camera', icon: 'camera', onClick: () => ensureWebcam(layer.id).then(() => patch({ src: null, srcType: 'webcam' })).catch(() => {}) },
        ]}
        onBack={onBack}
      />
    </>
  )
}
