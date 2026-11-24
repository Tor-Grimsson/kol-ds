import {
  aboutOf, allScopeParams, FILTERS, MAX_FILTERS, resolvedChain, axisKeys, canRandomLevel, computeRoll, deriveScopes, DEFAULT_THEME, GENERATIVE_TREE, groupById,
  LEGACY_GROUP_LABELS, loopBgToggleable, loopById, lookPresetsFor, motionPresetsFor, mulberry32, nudgeSettings,
  openColorModes, PICKER_TREE, presetLayerPatch, presetParams, presetsInGroup, randomPresetPatch, randomSeed, RELATIONS,
  resolvePalette, rollPalette, stepPreset, themeParams, THEME_OPTIONS, tidyScopes, useComposeState, useLabsKeys,
  useLabsLayer, useLayerEdit, useRollSeed,
} from './engine.js'
import { AboutButton, Group, InputList, ModulateList, OffOn, ParamList, ParamSelect } from './ParamsRail.jsx'
import { StackCards } from './Effect.jsx'
import Button from '../ui/Button.jsx'
import FieldRow from '../ui/FieldRow.jsx'
import Select from '../ui/Select.jsx'
import SelectStep from '../ui/SelectStep.jsx'

/* The generator's rail (the package's GenerativeSurface, LoopPicker and LoopFields in the labs skin), redrawn. */
const RANDOM_GROUPS = GENERATIVE_TREE.flatMap((t) => t.groups)
const motionOpts = (presets, val) => {
  const opts = presets.map((p) => ({ value: p.id, label: p.label }))
  return (val == null || val === 'custom') ? [{ value: 'custom', label: 'Custom' }, ...opts] : opts
}

export function generativeTitle(layer, tree) {
  const group = groupById(layer.loopGroup)
  const type = (tree ?? GENERATIVE_TREE).find((t) => t.groups.includes(layer.loopGroup))
  const name = type?.labels?.[layer.loopGroup] ?? group?.label ?? ''
  return type && type.label !== name ? `${type.label} / ${name}` : name
}

/* Type, Category, Preset: the picking stack */
function Picker({ layer, tree = PICKER_TREE }) {
  const { updateLayer } = useComposeState()
  const group = layer.loopGroup ?? 'shape'
  const parent = tree.find((t) => t.groups.includes(group)) ?? null
  const presets = presetsInGroup(group)
  const current = presets.find((p) => p.id === layer.presetId)
  const subs = [...new Set(presets.map((p) => p.sub).filter(Boolean))]
  const sub = current?.sub ?? subs[0]
  const subPresets = subs.length ? presets.filter((p) => p.sub === sub) : presets
  const apply = (preset, g = group) => {
    if (!preset) return
    updateLayer(layer.id, {
      loopGroup: g, presetId: preset.id, presetLabel: preset.label, loopId: preset.loop,
      _framePreset: 'custom', _formPreset: 'custom', _lookPreset: 'custom', ...presetParams(preset),
    })
  }
  const step = (dir) => { const pt = stepPreset(layer, dir); if (pt) updateLayer(layer.id, pt) }
  return (
    <>
      {(tree.length > 1 || !parent) && (
        <FieldRow label="Type">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {parent
              ? <div className="flex"><Select value={parent.label} options={tree.map((t) => t.label)} onChange={(l) => { const t = tree.find((x) => x.label === l); if (t) apply(presetsInGroup(t.groups[0])[0], t.groups[0]) }} /></div>
              : <span className="px-1 text-label text-muted">{LEGACY_GROUP_LABELS[group] ?? groupById(group).label}</span>}
            {parent && parent.groups.length > 1 && (
              <div className="flex"><Select value={group} options={parent.groups.map((gid) => ({ value: gid, label: parent.labels?.[gid] ?? groupById(gid).label }))} onChange={(g) => apply(presetsInGroup(g)[0], g)} /></div>
            )}
          </div>
        </FieldRow>
      )}
      {subs.length > 1 && (
        <FieldRow label="Category"><Select value={sub} options={subs} onChange={(s) => apply(presets.find((p) => p.sub === s))} /></FieldRow>
      )}
      <FieldRow label="Preset" stacked>
        <SelectStep
          value={layer.presetId}
          options={subPresets.map((p) => ({ value: p.id, label: p.label }))}
          onChange={(id) => apply(presets.find((p) => p.id === id))}
          onPrev={subPresets.length > 1 ? () => step(-1) : null}
          onNext={subPresets.length > 1 ? () => step(1) : null}
          prevLabel="Previous preset (H)"
          nextLabel="Next preset (L)"
        >
          <AboutButton about={aboutOf(loopById(layer.loopId), false)} />
        </SelectStep>
      </FieldRow>
    </>
  )
}

export default function GenerativeBody({ layer, tab, tree }) {
  const { updateLayer, palette } = useComposeState()
  const { setOnly } = useLabsLayer()
  const edit = useLayerEdit(layer.id, { history: 'coalesce' })
  const setProp = edit.setProp
  const loop = loopById(layer.loopId)
  const schema = loop?.params ?? []
  const current = presetsInGroup(layer.loopGroup).find((p) => p.id === layer.presetId)

  const reset = () => { if (current) setOnly(layer.type, presetLayerPatch(current, layer.loopGroup)) }
  useLabsKeys(reset, () => updateLayer(layer.id, computeRoll(layer, allScopeParams(schema, layer), randomSeed(), { withFilters: true })))

  /* theme, invert, palette, rolls */
  const themeId = layer.themeId ?? DEFAULT_THEME
  const invert = !!layer.themeInvert
  const relation = layer._paletteRelation ?? 'analogous'
  const colorParams = schema.filter((p) => p.type === 'color')
  const keep = new Set(layer._rollKeep ?? [])
  const rollColors = (rel = relation, extra = {}) => {
    const next = resolvePalette(layer, schema, rollPalette(mulberry32(randomSeed()), rel), { rotate: true })
    updateLayer(layer.id, { ...extra, ...Object.fromEntries(colorParams.filter((p) => !keep.has(p.key)).map((p) => [p.key, next[p.key]])) })
  }
  const toggleKeep = (k) => setProp('_rollKeep', keep.has(k) ? [...keep].filter((x) => x !== k) : [...keep, k])

  /* look, motion quick-selects: an edit to a key they cover flips them to Custom */
  const looks = lookPresetsFor(layer.loopId)
  const lookKeys = looks ? new Set(Object.values(looks).flatMap((p) => Object.keys(p))) : null
  const tables = motionPresetsFor(layer.loopId, layer)
  const frameKeys = tables ? axisKeys(tables.frame) : null
  const formKeys = tables ? axisKeys(tables.form) : null
  const setParam = (k, v) => {
    const extra = {}
    if (frameKeys?.has(k)) extra._framePreset = 'custom'
    if (formKeys?.has(k)) extra._formPreset = 'custom'
    if (lookKeys?.has(k)) extra._lookPreset = 'custom'
    edit.patch({ [k]: v, ...extra })
  }

  /* scoped, seeded rolls */
  const seed = useRollSeed(layer)
  const scopes = tidyScopes(deriveScopes(schema, layer), allScopeParams(schema, layer))
  const roll = (params, scope) => {
    const patch = computeRoll(layer, params, seed.take(), { stripNoRandom: !!scope?.motion })
    if (tables && scope?.motion) {
      if (scope.id !== 'Form') patch._framePreset = 'custom'
      if (scope.id !== 'Frame') patch._formPreset = 'custom'
    }
    if (lookKeys && Object.keys(patch).some((k) => lookKeys.has(k))) patch._lookPreset = 'custom'
    updateLayer(layer.id, patch)
  }
  const resetScope = (params) => {
    const base = current?.params ?? {}
    const patch = {}
    for (const p of params) { const v = base[p.key] !== undefined ? base[p.key] : p.default; if (v !== undefined) patch[p.key] = v }
    updateLayer(layer.id, patch)
  }

  if (tab === 'generate') {
    return (
      <>
        <Group label={generativeTitle(layer, tree)}>
          <Picker layer={layer} tree={tree} />
          {looks && (
            <FieldRow label="Look">
              <Select value={layer._lookPreset ?? 'custom'} options={motionOpts(Object.keys(looks).map((n) => ({ id: n, label: n })), layer._lookPreset)} onChange={(n) => edit.patch({ _lookPreset: n, ...(looks[n] ?? {}) })} />
            </FieldRow>
          )}
          <FieldRow label="Theme">
            <Select value={themeId} options={THEME_OPTIONS} onChange={(id) => updateLayer(layer.id, { themeId: id, ...themeParams(layer, schema, id, invert) })} />
          </FieldRow>
          <FieldRow label="Invert">
            <OffOn label="Invert" on={invert} onChange={(v) => updateLayer(layer.id, { themeInvert: v, ...themeParams(layer, schema, themeId, v) })} />
          </FieldRow>
          {colorParams.length > 0 && (
            <FieldRow label="Palette" stacked>
              <Select value={relation} options={RELATIONS.map((r) => ({ value: r.id, label: r.label }))} onChange={(v) => rollColors(v, { _paletteRelation: v })} />
              <Button variant="outline" onClick={() => rollColors()}>Roll</Button>
              <Button icon="clr-tri" aria-label="Edit in Color Modes" onClick={openColorModes} />
            </FieldRow>
          )}
          {colorParams.length > 1 && (
            <FieldRow label="Rolls" align="start">
              <div className="flex flex-1 flex-wrap gap-1">
                {colorParams.map((p) => (
                  <Button key={p.key} variant={keep.has(p.key) ? 'ghost' : 'outline'} aria-pressed={!keep.has(p.key)} aria-label={`Roll ${p.label}`} onClick={() => toggleKeep(p.key)}>{p.label}</Button>
                ))}
              </div>
            </FieldRow>
          )}
          {loopBgToggleable(loop) && (
            <FieldRow label="Background"><OffOn label="Background" on={layer.bgOn !== false} onChange={(v) => setProp('bgOn', v)} /></FieldRow>
          )}
        </Group>
        <ParamList schema={schema} layer={layer} setProp={setParam} palette={palette} tab="generate" title="Parameters" />
        <Group label="Randomise">
          <div className="flex flex-wrap items-center gap-1">
            {[['type', 'Type'], ['category', 'Category'], ['preset', 'Preset']].filter(([lvl]) => canRandomLevel(layer, lvl, RANDOM_GROUPS)).map(([lvl, label]) => (
              <Button key={lvl} variant="outline" aria-label={`Randomize ${label.toLowerCase()}`} onClick={() => {
                const s = seed.take()
                const patch = randomPresetPatch(layer, lvl, mulberry32(s >>> 0), RANDOM_GROUPS)
                if (patch) updateLayer(layer.id, { ...patch, _rollSeed: s })
              }}>{label}</Button>
            ))}
            <Button variant="outline" aria-label="Randomize settings" onClick={(e) => {
              if (e.altKey) return resetScope(allScopeParams(schema, layer))
              const s = seed.take()
              updateLayer(layer.id, { ...nudgeSettings(layer, allScopeParams(schema, layer), mulberry32(s >>> 0)), _rollSeed: s })
            }}>Settings</Button>
          </div>
          <div className="flex items-center gap-0.5">
            {scopes.map((s) => (
              <Button key={s.id} onClick={(e) => (e.altKey ? resetScope(s.params) : roll(s.params, s))}>{s.label}</Button>
            ))}
            <span className="flex-1" />
            {/* the scope dialog is the package's own window, not redrawn here: drawn in place, inert */}
            <Button icon="nav-settings" aria-label="What Settings rolls" />
            <Button icon="refresh" aria-label="Reset to defaults" onClick={reset} />
          </div>
        </Group>
      </>
    )
  }

  if (tab === 'style') {
    return (
      <>
        <ParamList schema={schema} layer={layer} setProp={setParam} palette={palette} tab="style" />
        <PostList layer={layer} edit={edit} />
      </>
    )
  }

  /* animation */
  return (
    <>
      <InputList schema={schema} layer={layer} setProp={setProp} inputs={loop?.inputs} />
      {tables && (
        <Group label="Motion">
          <FieldRow label="Frame">
            <Select value={layer._framePreset ?? 'custom'} options={motionOpts(tables.frame, layer._framePreset)} onChange={(id) => edit.patch({ _framePreset: id, ...(tables.frame.find((x) => x.id === id)?.params ?? {}) })} />
          </FieldRow>
          <FieldRow label="Form">
            <Select value={layer._formPreset ?? 'custom'} options={motionOpts(tables.form, layer._formPreset)} onChange={(id) => edit.patch({ _formPreset: id, ...(tables.form.find((x) => x.id === id)?.params ?? {}) })} />
          </FieldRow>
        </Group>
      )}
      <ParamList schema={schema} layer={layer} setProp={setParam} palette={palette} tab="anim" />
      {loop?.camera && <ParamList schema={loop.camera.map((p) => ({ ...p, section: 'Camera' }))} layer={layer} setProp={setProp} palette={palette} />}
      <ModulateList schema={schema} layer={layer} setProp={setProp} />
    </>
  )
}

/* Post-processing on a generator's Style tab: the canvas-tier effects stacked on its frame, and the Add FX select. */
const GEN_POST = FILTERS.filter((f) => !f.kind && !f.first)
function PostList({ layer, edit }) {
  const { addFilter, removeFilter, toggleFilter, palette } = useComposeState()
  const chain = resolvedChain(layer)
  const bare = chain.map(({ def: _def, ...s }) => s)
  const setStagePropAt = (idx) => (k, v) => edit.patch({ filters: bare.map((s, i) => (i === idx ? { ...s, params: { ...s.params, [k]: v } } : s)) })
  return (
    <Group label="Post-Processing">
      <StackCards chain={chain} from={0} layer={layer} hostView={layer} toggleFilter={toggleFilter} removeFilter={removeFilter} setStagePropAt={setStagePropAt} palette={palette} />
      {chain.length < MAX_FILTERS && (
        <div className="flex"><ParamSelect value="" options={[{ value: '', label: 'Add FX…' }, ...GEN_POST.map((f) => ({ value: f.id, label: f.label ?? f.id }))]} onChange={(id) => { if (id) addFilter(layer.id, id) }} /></div>
      )}
    </Group>
  )
}
