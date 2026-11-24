import { allScopeParams, computeRoll, deriveScopes, paramTab, SEED_MIN_PARAMS, tidyScopes, useRollSeed } from '../../labs/engine.js'
import { CommitInput, OffOn } from '../../labs/Params.jsx'
import { Button, Dropdown, LabeledControl } from '@kolkrabbi/kol-component'

/* The real effect card's parts (EffectsPanel's open slot, round 4, 2.3), drawn in kolbox's kit for PopoverEffect: the
   Preset row, the cropped-photo note, Camera drag and the rolls block (StageRolls); the sweep rig is labs' SweepStack (labs/Parts.jsx). Same
   params, same writes, same words as the real ones. */

export const FX_TABS = [{ value: 'effect', label: 'Effect' }, { value: 'anim', label: 'Animation' }]

/* the card's head: Preset (the filter's preset param), the note for a cropped photo, Camera drag for an orbit effect */
export function StageHead({ layer, stage, presetParam, onPreset, onCameraDrag }) {
  return (
    <>
      {presetParam && (
        <LabeledControl variant="kolbox" horizontal label="Preset">
          <Dropdown variant="kolbox" ariaLabel="Preset" className="min-w-0 flex-1" value={String(stage.params[presetParam.key] ?? presetParam.default)}
            options={(presetParam.options ?? []).map((o) => (typeof o === 'object' ? { value: String(o.value), label: String(o.label ?? o.value) } : { value: String(o), label: String(o) }))}
            onChange={(v) => onPreset((presetParam.options ?? []).map((o) => (typeof o === 'object' ? o.value : o)).find((x) => String(x) === v) ?? v)} />
        </LabeledControl>
      )}
      {layer.imgW != null && <span className="text-help text-muted">Filters don't apply to cropped photos.</span>}
      {stage.def.orbit && <LabeledControl variant="kolbox" horizontal label="Camera drag"><OffOn on={!!layer.cameraDrag} onChange={onCameraDrag} /></LabeledControl>}
    </>
  )
}

/* StageRolls: the real one's block, split by tab: the seed, Randomize all (Randomize motion), Reset to defaults, the
   scope buttons two across; an Alt press on a button resets what it would roll */
export function StageRolls({ def, view, tab, onPatch }) {
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
        <div className="flex items-center gap-2">
          <Button variant="kolbox" className="min-w-0 flex-1" onClick={(e) => (e.altKey ? reset(all) : roll(all))}>{motion ? 'Randomize motion' : 'Randomize all'}</Button>
          <Button variant="kolbox" iconOnly="refresh" aria-label="Reset to defaults" onClick={() => reset(all)}/>
        </div>
      )}
      {scopes.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {scopes.map((sc) => <Button variant="kolbox" key={sc.id} onClick={(e) => (e.altKey ? reset(sc.params) : roll(sc.params, sc))}>{sc.label}</Button>)}
        </div>
      )}
    </>
  )
}
