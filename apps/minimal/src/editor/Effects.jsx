import { useEffect, useRef, useState } from 'react'
import {
  allScopeParams, computeRoll, deriveScopes, effectHost, findLayerDeep, flatCategories, MAX_FILTERS, pack, paramTab,
  presetParamOf, presetPatchFor, resolvedChain, SEED_MIN_PARAMS, tidyScopes, useComposeState, useLayerEdit, useRollSeed,
} from './engine.js'
import { OffOn, ParamList } from '../labs/Params.jsx'
import Button from '../ui/Button.jsx'
import FieldRow from '../ui/FieldRow.jsx'
import InputNumber from '../ui/InputNumber.jsx'
import Segmented from '../ui/Segmented.jsx'

/* The Effects tab, as the real one is (the package's EffectsPanel): the layer's stack, one row per effect (on or off, which
   effect, up, down, delete), the open one's preset, its Effect and Animation params and rolls; an empty slot at the foot
   adds one. */
const FX_TABS = [{ value: 'effect', label: 'Effect' }, { value: 'anim', label: 'Animation' }]
const Hint = ({ children }) => <p className="text-label text-faint">{children}</p>

export default function Effects() {
  const { selectedId, layers } = useComposeState()
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  return <div className="flex flex-col gap-4 p-4">{layer ? <LayerEffects key={layer.id} layer={layer} /> : <Hint>Select a layer to edit its effect.</Hint>}</div>
}

/* a native select with the categories as groups */
function EffectSelect({ value, options, onChange }) {
  const groups = []
  for (const o of options) { if (o.heading) groups.push({ label: o.heading, items: [] }); else if (groups.length) groups[groups.length - 1].items.push(o); else groups.push({ label: null, items: [o] }) }
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Effect"
      className="select h-7 min-w-0 flex-1 appearance-none rounded-field bg-field pr-7 pl-2 text-label text-fg outline-none hover:bg-field-hover focus-visible:outline-1 focus-visible:outline-fg">
      {groups.map((g, i) => (g.label
        ? <optgroup key={g.label} label={g.label}>{g.items.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</optgroup>
        : g.items.map((o) => <option key={o.value || `none-${i}`} value={o.value}>{o.label}</option>)))}
    </select>
  )
}

function Rolls({ def, view, tab, onPatch }) {
  const seed = useRollSeed(view)
  const motion = tab === 'anim'
  const params = def.params.filter((p) => (paramTab(p) === 'anim') === motion)
  const all = motion ? params.filter((p) => !p.noRandom) : allScopeParams(params, view)
  const scopes = tidyScopes(deriveScopes(params, view), all)
  const roll = (ps, scope) => ps.length && onPatch(computeRoll(view, ps, seed.take(), { stripNoRandom: !!scope?.motion }))
  const reset = (ps) => { const patch = {}; for (const p of ps) if (p.default !== undefined) patch[p.key] = p.default; if (Object.keys(patch).length) onPatch(patch) }
  if (!all.length && !scopes.length) return null
  return (
    <div className="flex flex-col gap-2">
      {all.length >= SEED_MIN_PARAMS && (
        <FieldRow label="Seed"><InputNumber chars={10} value={seed.value} aria-label="Seed" onCommit={(s) => { const n = Math.floor(Number(s)); if (Number.isFinite(n) && n >= 0) seed.commit(n) }} /></FieldRow>
      )}
      {all.length > 0 && (
        <div className="flex gap-2">
          <Button variant="outline" className="min-w-0 flex-1" onClick={(e) => (e.altKey ? reset(all) : roll(all))}>{motion ? 'Randomize motion' : 'Randomize all'}</Button>
          <Button variant="outline" icon="refresh" aria-label="Reset to defaults" onClick={() => reset(all)} />
        </div>
      )}
      {scopes.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {scopes.map((sc) => <Button key={sc.id} variant="outline" onClick={(e) => (e.altKey ? reset(sc.params) : roll(sc.params, sc))}>{sc.label}</Button>)}
        </div>
      )}
    </div>
  )
}

function LayerEffects({ layer }) {
  const { palette, addFilter, removeFilter, toggleFilter, moveFilter, replaceFilter } = useComposeState()
  const edit = useLayerEdit(layer.id, { history: 'coalesce' })
  const chain = resolvedChain(layer)
  const hasEngine = chain.some((s) => s.def?.kind === 'engine')
  const { effectable, engineHost, engineLoop } = effectHost(layer)
  const [sel, setSel] = useState(chain.length ? 0 : null)
  const stage = sel != null ? chain[sel] ?? null : null
  const [tab, setTab] = useState('effect')
  const keys = useRef(chain.map((s) => s.key))
  useEffect(() => {
    const prev = keys.current
    const now = chain.map((s) => s.key)
    keys.current = now
    const added = now.find((k) => !prev.includes(k))
    if (added != null) { setSel(now.indexOf(added)); return }
    if (sel != null && sel >= now.length) setSel(now.length ? now.length - 1 : null)
  }, [chain.length]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!effectable) return <Hint>{engineLoop ? "Engine loops can't host effects yet." : "This layer can't host an effect."}</Hint>

  const FILTERS = pack('effects')?.FILTERS ?? []
  const optionsFor = (i) => {
    const engineOk = engineHost && (i == null ? !hasEngine : chain[i]?.def?.kind === 'engine' || (!hasEngine && i === chain.length - 1))
    const seen = new Set()
    return flatCategories(FILTERS.filter((f) => f.kind !== 'engine' || engineOk)).flatMap((c) => {
      const fs = c.filters.filter((f) => !seen.has(f.id) && seen.add(f.id))
      return fs.length ? [{ heading: c.label }, ...fs.map((f) => ({ value: f.id, label: f.label }))] : []
    })
  }
  const bare = chain.map(({ def: _d, ...s }) => s)
  const view = stage ? { ...layer, ...stage.params, id: layer.id } : null
  const setStageParams = (patch) => sel != null && edit.patch({ filters: bare.map((s, i) => (i === sel ? { ...s, params: { ...s.params, ...patch } } : s)) })
  const setStageProp = (k, v) => (k === 'cameraDrag' ? edit.setProp(k, v) : setStageParams({ [k]: v }))
  const presetKey = stage?.def ? presetParamOf(stage.def.id) : null
  const presetParam = presetKey ? stage.def.params.find((p) => p.key === presetKey) : null
  const effectParams = stage?.def ? stage.def.params.filter((p) => paramTab(p) !== 'anim' && p !== presetParam) : []
  const slot = (on, node) => (on ? node : <span className="invisible pointer-events-none" aria-hidden>{node}</span>)

  return (
    <>
      {chain.map((s, i) => {
        const on = s.enabled !== false
        const canUp = i > 0 && s.def?.kind !== 'engine'
        const canDown = i < chain.length - 1 && s.def?.kind !== 'engine' && chain[i + 1]?.def?.kind !== 'engine'
        return (
          <div key={s.key} className="flex flex-col gap-3">
            <div onClick={() => setSel(i)} className={`flex items-center gap-1 rounded-field ${i === sel ? 'bg-field/50' : ''}`}>
              <Button icon={on ? 'eye-on' : 'eye-off'} aria-label={on ? 'Disable effect' : 'Enable effect'} onClick={(e) => { e.stopPropagation(); toggleFilter(layer.id, i) }} />
              <div className={`flex min-w-0 flex-1 ${on ? '' : 'opacity-60'}`}>
                <EffectSelect value={s.id} options={optionsFor(i)} onChange={(id) => { if (id && id !== s.id) replaceFilter(layer.id, i, id); setSel(i) }} />
              </div>
              {slot(canUp, <Button icon="chevron-up" aria-label="Move up" onClick={(e) => { e.stopPropagation(); moveFilter(layer.id, i, i - 1) }} />)}
              {slot(canDown, <Button icon="chevron-down" aria-label="Move down" onClick={(e) => { e.stopPropagation(); moveFilter(layer.id, i, i + 1) }} />)}
              <Button icon="x" aria-label="Delete effect" onClick={(e) => { e.stopPropagation(); removeFilter(layer.id, i) }} />
            </div>
            {i === sel && stage?.def && (
              <div className="flex flex-col gap-3">
                {presetParam && (
                  <FieldRow label="Preset">
                    <select value={stage.params[presetParam.key] ?? presetParam.default} aria-label="Preset" onChange={(e) => setStageParams(presetPatchFor(stage.def, e.target.value))}
                      className="select h-7 min-w-0 flex-1 appearance-none rounded-field bg-field pr-7 pl-2 text-label text-fg outline-none hover:bg-field-hover">
                      {(presetParam.options ?? []).map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
                    </select>
                  </FieldRow>
                )}
                {layer.imgW != null && <span className="text-label text-faint">Filters don't apply to cropped photos.</span>}
                {stage.def.orbit && <FieldRow label="Camera drag"><OffOn on={!!layer.cameraDrag} onChange={(v) => setStageProp('cameraDrag', v)} /></FieldRow>}
                <Segmented options={FX_TABS} value={tab} onChange={setTab} />
                {tab === 'effect' && <><ParamList schema={effectParams} layer={view} setProp={setStageProp} palette={palette} /><Rolls def={stage.def} view={view} tab="effect" onPatch={setStageParams} /></>}
                {tab === 'anim' && <><ParamList schema={stage.def.params} layer={view} setProp={setStageProp} palette={palette} tab="anim" /><Rolls def={stage.def} view={view} tab="anim" onPatch={setStageParams} />
                  {stage.def.sweeps && <Hint>The sweep stack is not redrawn in the minimal style.</Hint>}</>}
              </div>
            )}
          </div>
        )
      })}
      {chain.length < MAX_FILTERS
        ? <div className="flex"><EffectSelect value="" options={[{ value: '', label: 'Add effect…' }, ...optionsFor(null)]} onChange={(id) => { if (id) addFilter(layer.id, id) }} /></div>
        : <span className="text-label text-faint">{`Chain is full (${MAX_FILTERS} effects)`}</span>}
    </>
  )
}
