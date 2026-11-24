import {
  aboutOf, allScopeParams, FILTERS, MAX_FILTERS, resolvedChain, axisKeys, canRandomLevel, computeRoll, deriveScopes, DEFAULT_THEME, GENERATIVE_TREE, groupById,
  LEGACY_GROUP_LABELS, loopBgToggleable, loopById, lookPresetsFor, motionPresetsFor, mulberry32, nudgeSettings,
  openColorModes, PICKER_TREE, presetLayerPatch, presetParams, presetsInGroup, randomPresetPatch, randomSeed, RELATIONS,
  resolvePalette, rollPalette, stepPreset, themeParams, THEME_OPTIONS, tidyScopes, useComposeState, useLabsKeys,
  useLabsLayer, useLayerEdit, useRollSeed, fitBounds, paramSection, resolveCameraKeys, setAppSetting, useAppSettings,
  wildExpression,
} from './engine.js'
import { AboutButton, InputList, ModulateList, ModulationList, OffOn, ParamList, ParamSelect, RollScopes } from './Params.jsx'
import { StackCards } from './Effect.jsx'
import ModalRollScopes from './ModalRollScopes.jsx'
import { CameraPoseSlots, ParatypeExplore, ParatypeFlatten, PenroseLayers, SoftformsLayers } from './Parts.jsx'
import { useState } from 'react'
import { Button, ButtonGroup, Dropdown, DropdownStepper, LabeledControl, Tooltip, LabeledControlSection } from '@kolkrabbi/kol-component'
import { mixedLabel, useMixed } from '../editor/generate/ContentScopeAll.jsx'

/* The generator's settings (the package's GenerativeSurface, LoopPicker and LoopFields), as
   apps/minimal/src/labs/Generative.jsx reads them; drawn with kolbox's rail parts. */
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
  const mixedPreset = useMixed((v) => v.presetId ?? null)
  return (
    <>
      {(tree.length > 1 || !parent) && (
        <LabeledControl variant="kolbox" horizontal label="Type">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {parent
              ? <Dropdown variant="kolbox" className="min-w-0" value={parent.label} options={tree.map((t) => t.label)} onChange={(l) => { const t = tree.find((x) => x.label === l); if (t) apply(presetsInGroup(t.groups[0])[0], t.groups[0]) }} />
              : <span className="text-label text-muted">{LEGACY_GROUP_LABELS[group] ?? groupById(group).label}</span>}
            {parent && parent.groups.length > 1 && (
              <Dropdown variant="kolbox" className="min-w-0" value={group} options={parent.groups.map((gid) => ({ value: gid, label: parent.labels?.[gid] ?? groupById(gid).label }))} onChange={(g) => apply(presetsInGroup(g)[0], g)} />
            )}
          </div>
        </LabeledControl>
      )}
      {subs.length > 1 && (
        <LabeledControl variant="kolbox" horizontal label="Category"><Dropdown variant="kolbox" className="min-w-0 flex-1" value={sub} options={subs} onChange={(s) => apply(presets.find((p) => p.sub === s))} /></LabeledControl>
      )}
      <LabeledControl variant="kolbox" label={mixedLabel('Preset', mixedPreset)}>
        <DropdownStepper variant="kolbox" value={layer.presetId} options={subPresets.map((p) => ({ value: p.id, label: p.label }))} onChange={(id) => apply(presets.find((p) => p.id === id))}
          onStep={step} prevLabel="Previous preset (H)" nextLabel="Next preset (L)" />
        <AboutButton about={aboutOf(loopById(layer.loopId), false)} />
      </LabeledControl>
    </>
  )
}

/* picker: false leaves out Type, Category and Preset, as the real Morph rail edits a step (LoopFields picker={false}).
   editor: the body sits in the editor's rail, on one layer of many, as the real Parameters tab's LoopFields does: the
   R and Shift+R keys stay the editor's (R is its Rectangle tool) and Reset returns the params to their defaults on this
   layer, never Labs' one-layer swap, which would drop every other layer. */
export default function GenerativeBody({ layer, tab, tree, picker = true, editor = false }) {
  const { updateLayer, palette } = useComposeState()
  const { setOnly } = useLabsLayer()
  const edit = useLayerEdit(layer.id, { history: 'coalesce' })
  const setProp = edit.setProp
  const loop = loopById(layer.loopId)
  const schema = loop?.params ?? []
  const current = presetsInGroup(layer.loopGroup).find((p) => p.id === layer.presetId)

  const reset = () => {
    if (editor) resetScope(allScopeParams(schema, layer))
    else if (current) setOnly(layer.type, presetLayerPatch(current, layer.loopGroup))
  }
  /* `editor` is fixed for a mount, so the hook order never changes */
  if (!editor) useLabsKeys(reset, () => updateLayer(layer.id, computeRoll(layer, allScopeParams(schema, layer), randomSeed(), { withFilters: true }))) // eslint-disable-line react-hooks/rules-of-hooks

  /* theme, invert, palette, rolls */
  const themeId = layer.themeId ?? DEFAULT_THEME
  const mixedLook = useMixed((v) => v._lookPreset ?? 'custom')
  const mixedTheme = useMixed((v) => v.themeId ?? DEFAULT_THEME)
  const mixedInvert = useMixed((v) => !!v.themeInvert)
  const mixedBg = useMixed((v) => v.bgOn !== false)
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

  /* What Settings rolls: its window (round 4 W7) */
  const [scopesOpen, setScopesOpen] = useState(false)
  /* the camera and the drag rig, as the real LoopFields reads them: the hint under the theme rows says what C does
     here; Drag (C) on a 2D patch with a rig, Orbit (C) on a 3D one, both the app's Grab plus the patch's own `orbit` */
  const appSettings = useAppSettings()
  const hasRig = schema.some((p) => p.key === 'orbit')
  const setOrbit = (v) => { setParam('orbit', v); if (v && !appSettings.grab) setAppSetting('grab', true) }
  const cameraKeys = loop?.orbit ? { yaw: 1, dist: 1 } : resolveCameraKeys(loop)
  const cameraHint = cameraKeys
    ? (loop?.orbit ? 'Press C, then drag to orbit the camera and scroll to zoom.' : cameraKeys.yaw ? 'Press C, then drag to rotate and scroll to zoom.' : 'Press C, then scroll to zoom.')
    : null
  const camParams = [...(loop?.camera ?? []), ...schema.filter((p) => paramSection(p) === 'Camera')]
  const isEngine = loop?.kind === 'engine'
  const showCamSlots = camParams.length > 0 || (isEngine && loop?.orbit)
  const grabOn = !!appSettings.grab && layer.orbit !== false

  if (tab === 'generate') {
    return (
      <>
        {picker && <LabeledControlSection variant="kolbox"><Picker layer={layer} tree={tree} /></LabeledControlSection>}
        {/* Soft Forms' per-form editing, above Look and Theme as the real one has it */}
        {(layer.loopId === 'softforms' || layer.loopId === 'softforms3d') && <SoftformsLayers layer={layer} />}
        <LabeledControlSection variant="kolbox">
          {looks && (
            <LabeledControl variant="kolbox" horizontal label={mixedLabel('Look', mixedLook)}>
              <Dropdown variant="kolbox" className="min-w-0 flex-1" value={layer._lookPreset ?? 'custom'} options={motionOpts(Object.keys(looks).map((n) => ({ id: n, label: n })), layer._lookPreset)} onChange={(n) => edit.patch({ _lookPreset: n, ...(looks[n] ?? {}) })} />
            </LabeledControl>
          )}
          <LabeledControl variant="kolbox" horizontal label={mixedLabel('Theme', mixedTheme)}>
            <Dropdown variant="kolbox" className="min-w-0 flex-1" value={themeId} options={THEME_OPTIONS} onChange={(id) => updateLayer(layer.id, { ...themeParams(layer, schema, id, invert), themeId: id })} />
          </LabeledControl>
          <LabeledControl variant="kolbox" horizontal label={mixedLabel('Invert', mixedInvert)}>
            <OffOn on={invert} onChange={(v) => updateLayer(layer.id, { ...themeParams(layer, schema, themeId, v), themeInvert: v })} />
          </LabeledControl>
          {colorParams.length > 0 && (
            <LabeledControl variant="kolbox" label="Palette">
              <Dropdown variant="kolbox" className="min-w-0 flex-1" value={relation} options={RELATIONS.map((r) => ({ value: r.id, label: r.label }))} onChange={(v) => rollColors(v, { _paletteRelation: v })} />
              <Button variant="kolbox" tone="secondary" onClick={() => rollColors()}>Roll</Button>
              <Button variant="kolbox" iconOnly="clr-tri" aria-label="Edit in Color Modes" onClick={openColorModes}/>
            </LabeledControl>
          )}
          {colorParams.length > 1 && (
            /* the real LoopFields' Rolls: one label, the chips wrapping in a row after it; stacked, as Palette, so the
               chips get the rail's width and wrap as the real one's do (two, then one), not one per line */
            <LabeledControl variant="kolbox" label="Rolls">
              <ButtonGroup layout="wrap">
                {colorParams.map((p) => (
                  /* on (rolls) lit, off (held) ghost: the real one's dark and light */
                  <Button variant="kolbox" key={p.key} tone="ghost" pressed={!keep.has(p.key)} aria-pressed={!keep.has(p.key)} aria-label={`Roll ${p.label}`} onClick={() => toggleKeep(p.key)}>{p.label}</Button>
                ))}
              </ButtonGroup>
            </LabeledControl>
          )}
          {loopBgToggleable(loop) && (
            <LabeledControl variant="kolbox" horizontal label={mixedLabel('Background', mixedBg)}><OffOn on={layer.bgOn !== false} onChange={(v) => setProp('bgOn', v)} /></LabeledControl>
          )}
          {cameraHint && <p className="text-help text-muted" data-camera-hint>{cameraHint}</p>}
        </LabeledControlSection>
        <ParamList schema={schema} layer={layer} setProp={setParam} palette={palette} tab="generate" />
        {/* the randomise block as the real rail has it; untitled (Figma plan, left for later) */}
        <LabeledControlSection variant="kolbox">
          <ButtonGroup layout="wrap">
            {[['type', 'Type'], ['category', 'Category'], ['preset', 'Preset']].filter(([lvl]) => canRandomLevel(layer, lvl, RANDOM_GROUPS)).map(([lvl, label]) => (
              <Button variant="kolbox" key={lvl} tone="secondary" aria-label={`Randomize ${label.toLowerCase()}`} onClick={() => {
                const s = seed.take()
                const patch = randomPresetPatch(layer, lvl, mulberry32(s >>> 0), RANDOM_GROUPS)
                if (patch) updateLayer(layer.id, { ...patch, _rollSeed: s })
              }}>{label}</Button>
            ))}
            <Button variant="kolbox" tone="secondary" aria-label="Randomize settings" onClick={(e) => {
              if (e.altKey) return resetScope(allScopeParams(schema, layer))
              const s = seed.take()
              updateLayer(layer.id, { ...nudgeSettings(layer, allScopeParams(schema, layer), mulberry32(s >>> 0)), _rollSeed: s })
            }}>Settings</Button>
            {/* the real row: Settings, then what Settings rolls (its window), then Reset */}
            <span className="ml-auto flex items-center gap-1">
              <Button variant="kolbox" iconOnly="nav-settings" aria-label="What Settings rolls" onClick={() => setScopesOpen(true)}/>
              <Tooltip variant="kolbox" label="Reset to defaults (R)"><Button variant="kolbox" iconOnly="refresh" aria-label="Reset to defaults" onClick={reset}/></Tooltip>
            </span>
          </ButtonGroup>
          <RollScopes
            scopes={scopes}
            onRoll={(s) => roll(s.params, s)}
            onReset={(s) => resetScope(s.params)}
            extra={layer.loopId === 'math-expression' && (
              /* Wild: the oscilloscope's second expression button, seeded through the same _rollSeed flow; alt resets */
              <Button variant="kolbox" tone="secondary" className="min-w-0 pr-1 pl-1" onClick={(e) => {
                if (e.altKey) return resetScope(scopes.find((s) => s.id === 'Expression')?.params ?? [])
                const s = seed.take()
                updateLayer(layer.id, { expr: wildExpression(mulberry32(s >>> 0)), _rollSeed: s })
              }}>Wild</Button>
            )}
          />
        </LabeledControlSection>
        <ParatypeFlatten layer={layer} />
        <ModalRollScopes open={scopesOpen} onClose={() => setScopesOpen(false)} schema={schema} layer={layer} />
      </>
    )
  }

  if (tab === 'style') {
    return (
      <>
        <ParamList schema={schema} layer={layer} setProp={setParam} palette={palette} tab="style" />
        {loop?.group === 'penrose' && layer.loopId?.startsWith('penrose-') && <PenroseLayers layer={layer} setProp={setParam} patch={edit.patch} />}
        {/* the oscilloscope's view: Fit snaps min and max to the curve, Reset puts the View section back */}
        {layer.loopId === 'math-expression' && (
          <LabeledControlSection variant="kolbox">
            <ButtonGroup layout="grid">
              <Button variant="kolbox" tone="secondary" onClick={() => updateLayer(layer.id, fitBounds(layer))}>Fit</Button>
              <Button variant="kolbox" tone="secondary" onClick={() => resetScope(scopes.find((s) => s.id === 'View')?.params ?? [])}>Reset</Button>
            </ButtonGroup>
          </LabeledControlSection>
        )}
        <ParatypeExplore layer={layer} patch={edit.patch} />
        <PostList layer={layer} edit={edit} />
      </>
    )
  }

  /* animation */
  return (
    <>
      <InputList schema={schema} layer={layer} setProp={setProp} inputs={loop?.inputs} />
      {tables && (
        <LabeledControlSection variant="kolbox" label="Motion">
          <LabeledControl variant="kolbox" horizontal label="Frame">
            <Dropdown variant="kolbox" className="min-w-0 flex-1" value={layer._framePreset ?? 'custom'} options={motionOpts(tables.frame, layer._framePreset)} onChange={(id) => edit.patch({ _framePreset: id, ...(tables.frame.find((x) => x.id === id)?.params ?? {}) })} />
          </LabeledControl>
          <LabeledControl variant="kolbox" horizontal label="Form">
            <Dropdown variant="kolbox" className="min-w-0 flex-1" value={layer._formPreset ?? 'custom'} options={motionOpts(tables.form, layer._formPreset)} onChange={(id) => edit.patch({ _formPreset: id, ...(tables.form.find((x) => x.id === id)?.params ?? {}) })} />
          </LabeledControl>
        </LabeledControlSection>
      )}
      {/* the real LoopFields' order: the Modulation card, Interaction or 3D, the params, the camera, its poses */}
      <ModulationList layer={layer} schema={schema} setProp={setParam} />
      {hasRig && !loop?.is3D && (
        <LabeledControlSection variant="kolbox" label="Interaction">
          <LabeledControl variant="kolbox" horizontal label="Drag (C)"><OffOn on={grabOn} onChange={setOrbit} /></LabeledControl>
        </LabeledControlSection>
      )}
      {loop?.is3D && (
        <LabeledControlSection variant="kolbox" label="3D">
          <LabeledControl variant="kolbox" horizontal label="Orbit (C)"><OffOn on={grabOn} onChange={setOrbit} /></LabeledControl>
          {loop.zoom3dKey && <ParamList flat schema={schema.filter((p) => p.key === loop.zoom3dKey).map(({ section: _s, ...p }) => ({ ...p, tab: 'anim' }))} layer={layer} setProp={setParam} palette={palette} />}
        </LabeledControlSection>
      )}
      <ParamList schema={loop?.is3D && loop.zoom3dKey ? schema.filter((p) => p.key !== loop.zoom3dKey) : schema} layer={layer} setProp={setParam} palette={palette} tab="anim" />
      {loop?.camera && <ParamList schema={loop.camera.map((p) => ({ ...p, section: 'Camera' }))} layer={layer} setProp={setProp} palette={palette} />}
      {showCamSlots && <CameraPoseSlots layer={layer} patch={edit.patch} camParams={camParams} isEngine={isEngine} showHeader={!loop?.camera} />}
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
    <LabeledControlSection variant="kolbox" label="Post-Processing">
      <StackCards chain={chain} from={0} layer={layer} hostView={layer} toggleFilter={toggleFilter} removeFilter={removeFilter} setStagePropAt={setStagePropAt} palette={palette} />
      {chain.length < MAX_FILTERS && (
        <ParamSelect value="" options={[{ value: '', label: 'Add FX…' }, ...GEN_POST.map((f) => ({ value: f.id, label: f.label ?? f.id }))]} onChange={(id) => { if (id) addFilter(layer.id, id) }} />
      )}
    </LabeledControlSection>
  )
}
