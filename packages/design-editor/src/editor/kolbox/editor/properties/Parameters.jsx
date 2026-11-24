import { useRef } from 'react'
import {
  CURVE_OPTIONS, editLayer, isBinding, isOutlineFamily, layerFamily, layerWeight, PATTERN_SCHEMA, SHAPE_SCHEMA,
  TEXT_SCHEMA, TEXT_TAB_KEYS, useComposeState, useGeneratorLibrary, visibleParams, weightRange,
} from '../engine.js'
import { MISC_TREE } from '../../labs/engine.js'
import GenerativeBody from '../../labs/Generative.jsx'
import EffectBody, { EFFECT_TABS } from '../../labs/Effect.jsx'
import KineticBody from '../../labs/Kinetic.jsx'
import { pickMedia } from '../windows/WindowMediaPicker.jsx'
import { ParamList } from '../../labs/Params.jsx'
import PatternSurface from './Pattern.jsx'
import { Button, Dropdown, FieldPair, LabeledControl, Slider, TabsRow, LabeledControlSection } from '@kolkrabbi/kol-component'

/* The selected layer's Parameters (the real ParametersPanel, round 3, 2.1) and the type's own inspector panes (the real
   LayerInspector's Image, Path, Parameters and Group). For the layers that keep tabs (paramTabs) the rail's tabs are the
   real Generate, Style and Animation strip and the first also carries the inspector's sections (Properties.jsx); every
   other layer takes the three as sections in the rail (InlineParams). A generator, misc, kinetic or photo layer's Parameters are the Labs bodies themselves (the real editor's
   Parameters tab is the Labs panel), mounted with `editor`. Only the tabs that hold something are shown. */
export const GEN_TABS = [{ value: 'generate', label: 'Generate' }, { value: 'style', label: 'Style' }, { value: 'anim', label: 'Animation' }]
const TEXT_PARAMS_SCHEMA = TEXT_SCHEMA.filter((p) => !TEXT_TAB_KEYS.has(p.key))
/* W11.2: a shape's own parameters (sides, points, inner ratio, slope, apex, arc, a logo's variant, a flatten's fit)
   open from the Vector menu's Shape parameters… in an effect card beside the rail; the Kind dropdown is gone (his word:
   "we dont need dropdown to change shape") and the corner radius is Appearance's. */
export const shapeParamsOf = (layer) => (layer?.type === 'shape' ? visibleParams(SHAPE_SCHEMA, layer).filter((p) => p.key !== 'kind' && p.key !== 'radius') : [])

/* his ruling (round 4, the standing fault): the property rail has no tab track for a plain layer; a shape, text,
   pattern or path takes its Parameters (the real tab's Generate, Style and Animation) as sections in the one scrolling
   rail (InlineParams). The tabs stay for the layers whose Parameters are a Labs body: generative, misc, kinetic, photo. */
export function paramTabs(layer) {
  switch (layer.type) {
    case 'photo': return EFFECT_TABS
    case 'loop': case 'misc': case 'kinetic': return GEN_TABS
    default: return null
  }
}

/* a tab-less layer's Parameters, in the real tab's order: Generate, Style, Animation (data-rail-params: the rail's
   Parameters pointer and Window > Right rail > Parameters scroll here) */
export function InlineParams({ layer, edit }) {
  return (
    <div className="contents" data-rail-params="">
      {GEN_TABS.map((t) => <ParametersBody key={t.value} layer={layer} tab={t.value} edit={edit} />)}
    </div>
  )
}

/* ParamsLink: the real pointer row to the Parameters (here: Style) tab; the real label's middot is a slash here */
const PARAMS_LABELS = {
  pattern: () => 'Pattern parameters',
  loop: (l) => `Loop / ${l.presetLabel ?? 'parameters'}`,
  misc: (l) => `Misc / ${l.presetLabel ?? 'parameters'}`,
  kinetic: (l) => `Kinetic / ${l.presetLabel ?? 'parameters'}`,
}

/* the type's own panes, in the real order: Image, Path, Parameters, Group */
export function TypePanes({ layer, edit, onParams }) {
  const { ungroupLayer } = useComposeState()
  const label = PARAMS_LABELS[layer.type]
  const kids = Array.isArray(layer.children) ? layer.children.length : 0
  return (
    <>
      {layer.type === 'photo' && <ImageSource layer={layer} patch={edit.patch} />}
      {layer.type === 'path' && (
        <LabeledControlSection variant="kolbox" label="Path">
          <TabsRow variant="kolbox" className="w-full" tabs={[{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }]} value={layer.closed ? 'closed' : 'open'} onChange={(v) => edit.setProp('closed', v === 'closed')} />
        </LabeledControlSection>
      )}
      {label && (
        <LabeledControlSection variant="kolbox" label="Parameters">
          <Button variant="kolbox" className="w-full" aria-label={layer.type === 'pattern' ? 'Open the Pattern tab' : 'Open the Parameters tab'} onClick={onParams}>{label(layer)}</Button>
        </LabeledControlSection>
      )}
      {layer.type === 'group' && (
        <LabeledControlSection variant="kolbox" label="Group">
          <LabeledControl variant="kolbox" horizontal label="Children"><span className="font-mono text-value text-text">{kids} layer{kids === 1 ? '' : 's'}</span></LabeledControl>
          <Button variant="kolbox" className="w-full" onClick={() => ungroupLayer(layer.id)}>Ungroup</Button>
        </LabeledControlSection>
      )}
    </>
  )
}

/* the photo's content source: preview, upload or replace, the library, delete */
function ImageSource({ layer, patch }) {
  const fileRef = useRef(null)
  const onPick = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => patch({ src: reader.result, srcType: 'image' })
    reader.readAsDataURL(file)
  }
  return (
    <LabeledControlSection variant="kolbox" label="Image">
      <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
      {layer.src && (layer.srcType === 'video'
        ? <video src={layer.src} muted preload="metadata" aria-label="Video preview" className="aspect-video w-full rounded-well" style={{ objectFit: layer.fit ?? 'cover' }} />
        : <div aria-label="Image preview" className="aspect-video w-full rounded-well bg-center bg-no-repeat" style={{ backgroundImage: `url("${layer.src}")`, backgroundSize: layer.fit ?? 'cover' }} />)}
      <div className="flex items-center gap-2">
        <Button variant="kolbox" iconLeft="upload" className="min-w-0 flex-1" onClick={() => fileRef.current?.click()}>{layer.src ? 'Replace' : 'Upload image'}</Button>
        {/* the media picker (round 3, 3.1), the pick into this photo's source */}
        <Button variant="kolbox" onClick={() => pickMedia({ layerId: layer.id })}>Library</Button>
        {layer.src && <Button variant="kolbox" iconOnly="trash" aria-label="Delete image" onClick={() => { patch({ src: null, srcType: 'image' }); if (fileRef.current) fileRef.current.value = '' }}/>}
      </div>
    </LabeledControlSection>
  )
}

/* the tab's parameters for the layer's type */
export function ParametersBody({ layer, tab, edit }) {
  const { flattenGenerate, flattenRepeat, palette } = useComposeState()
  const setProp = edit.setProp
  const list = (schema, t) => <ParamList schema={schema} layer={layer} setProp={setProp} palette={palette} tab={t} />
  switch (layer.type) {
    /* W11: a shape's Parameters, Kind, Geometry and Vector effects sections are gone: Shape parameters… and Convert to
       path are the Vector menu's, the corner radius is Appearance's, the vector effects are Effects rows */
    case 'shape':
      return null
    case 'text':
      if (tab === 'generate') return <TextActions layer={layer} />
      /* R4.2: Morph is an effect row (Effects › Morph), its settings MorphSettings below, in the effect's card */
      if (tab === 'style') return list(TEXT_PARAMS_SCHEMA, 'style')
      return list(TEXT_SCHEMA, 'anim')
    case 'pattern':
      if (tab === 'generate') return <PatternActions layer={layer} />
      if (tab === 'style') return <PatternSurface layer={layer} edit={edit} />
      return list(PATTERN_SCHEMA, 'anim')
    case 'photo':
      return <EffectBody layer={layer} tab={tab} editor />
    case 'loop':
      return <GenerativeBody layer={layer} tab={tab} editor />
    case 'misc':
      return <GenerativeBody layer={layer} tab={tab} tree={MISC_TREE} editor />
    case 'path':
      return null
    case 'generate':
    case 'repeat':
      /* the generator window opens on the real mechanism: generate/store's editLayer, as the real Parameters tab fires it */
      return (
        <LabeledControlSection variant="kolbox">
          <Button variant="kolbox" className="w-full" onClick={() => editLayer(layer.type, layer)}>{layer.type === 'generate' ? 'Generate settings…' : 'Repeat settings…'}</Button>
          <Button variant="kolbox" className="w-full" onClick={() => (layer.type === 'generate' ? flattenGenerate : flattenRepeat)(layer.id)}>Expand</Button>
        </LabeledControlSection>
      )
    case 'kinetic':
      /* the composer, as Labs mounts it (round 3, 6.2): its Generate, Style and Animation are the rail's tabs */
      return <KineticBody layer={layer} tab={tab} editor />
    default:
      return null
  }
}

/* text, Generate: the saved-spec picker (when the library holds specs) and Flatten (outline families only) */
function TextActions({ layer }) {
  const { library } = useGeneratorLibrary()
  const { flattenText, updateLayer } = useComposeState()
  const specs = library.type ?? []
  const pick = (id) => {
    const s = specs.find((t) => t.id === id)
    if (!s) return
    const keys = ['text', 'width', 'weight', 'italic', 'size', 'tracking', 'lineHeight', 'case', 'textAlign']
    updateLayer(layer.id, Object.fromEntries(keys.map((k) => [k, s[k] ?? layer[k]])))
  }
  if (!specs.length && !isOutlineFamily(layerFamily(layer))) return null
  return (
    <LabeledControlSection variant="kolbox">
      {specs.length > 0 && (
        <LabeledControl variant="kolbox" horizontal label="Apply saved spec">
          <Dropdown variant="kolbox" ariaLabel="Apply saved spec" className="min-w-0 flex-1" value="" onChange={pick}
            options={[{ value: '', label: '— free-form' }, ...specs.map((t, i) => ({ value: t.id, label: t.text?.slice(0, 24) || `Spec ${i + 1}` }))]} />
        </LabeledControl>
      )}
      {isOutlineFamily(layerFamily(layer)) && (
        <FieldPair variant="kolbox" span first={<Button variant="kolbox" className="w-full" aria-label="Flatten the text to glyph-outline shapes (one-way)" onClick={() => flattenText(layer.id)}>Flatten</Button>} />
      )}
    </LabeledControlSection>
  )
}

/* pattern, Generate: the saved-pattern picker (when the library holds patterns) and Flatten */
function PatternActions({ layer }) {
  const { library } = useGeneratorLibrary()
  const { flattenPattern, updateLayer } = useComposeState()
  const patterns = library.pattern ?? []
  const pick = (id) => {
    const s = patterns.find((p) => p.id === id)
    if (!s) return
    const keys = ['shapeId', 'customSvg', 'cols', 'rows', 'gap', 'padding', 'stretch', 'overflow', 'rules', 'scale']
    updateLayer(layer.id, Object.fromEntries(keys.map((k) => [k, s[k] ?? layer[k]])))
  }
  return (
    <LabeledControlSection variant="kolbox">
      {patterns.length > 0 && (
        <LabeledControl variant="kolbox" horizontal label="Apply saved pattern">
          <Dropdown variant="kolbox" ariaLabel="Apply saved pattern" className="min-w-0 flex-1" value="" onChange={pick}
            options={[{ value: '', label: '— pick spec' }, ...patterns.map((p, i) => ({ value: p.id, label: `Pattern ${i + 1}` }))]} />
        </LabeledControl>
      )}
      <Button variant="kolbox" className="w-full" aria-label="Flatten the pattern to static SVG shapes (one-way)" onClick={() => flattenPattern(layer.id)}>Flatten</Button>
    </LabeledControlSection>
  )
}

/* Morph's settings (the real VariableBlock) on the variable families' weight axis: since R4.2 an effect row's card
   (Effects › Morph, Properties.jsx), no longer a section with an Off and On pair; the row's eye is its on and off */
const AXIS_CURVE_OPTIONS = CURVE_OPTIONS.map((o) => (o.value === 'custom' ? { ...o, label: 'Custom' } : o))
export function MorphSettings({ layer, setProp }) {
  const family = layerFamily(layer)
  if (!isOutlineFamily(family)) return <p className="text-help text-muted">Morph needs an outline font — switch the Family to Inter or Malromur.</p>
  const mode = layer.axisMode ?? 'morph'
  const range = weightRange(family)
  const blend = TEXT_SCHEMA.find((p) => p.key === 'axisBlend')
  const cp = (label, key, axis) => {
    const d = key === 'curveCp1' ? 0.33 : 0.66
    return (
      <LabeledControl variant="kolbox" horizontal key={label} label={label}>
        <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" aria-label={label} min={0} max={1} step={0.01} value={layer[key]?.[axis] ?? d}
          onChange={(v) => setProp(key, { ...(layer[key] ?? { x: d, y: d }), [axis]: v })} />
      </LabeledControl>
    )
  }
  return (
    <>
      <LabeledControl variant="kolbox" horizontal label="Mode">
        <Dropdown variant="kolbox" ariaLabel="Mode" className="min-w-0 flex-1" value={mode} options={[{ value: 'morph', label: 'Morph' }, { value: 'fade', label: 'Fade' }, { value: 'random', label: 'Random' }]} onChange={(v) => setProp('axisMode', v)} />
      </LabeledControl>
      {(mode === 'morph' || mode === 'fade') && (
        <LabeledControl variant="kolbox" horizontal label="Weight B">
          <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" aria-label="Weight B" min={range.min} max={range.max} step={1} value={layerWeight(layer, 'weight2')} onChange={(v) => setProp('weight2', Math.round(v))} />
        </LabeledControl>
      )}
      {mode === 'morph' && (
        <LabeledControl variant="kolbox" horizontal label="Curve">
          <Dropdown variant="kolbox" ariaLabel="Curve" className="min-w-0 flex-1" value={layer.axisCurve ?? 'flat'} options={AXIS_CURVE_OPTIONS} onChange={(v) => setProp('axisCurve', v)} />
        </LabeledControl>
      )}
      {mode === 'morph' && (layer.axisCurve ?? 'flat') === 'custom' && [cp('P1 X', 'curveCp1', 'x'), cp('P1 Y', 'curveCp1', 'y'), cp('P2 X', 'curveCp2', 'x'), cp('P2 Y', 'curveCp2', 'y')]}
      <LabeledControl variant="kolbox" horizontal label={mode === 'random' ? 'Seed' : 'Blend'}>
        {isBinding(layer.axisBlend)
          ? <span className="text-help text-muted italic">animated</span>
          : <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" aria-label={mode === 'random' ? 'Seed' : 'Blend'} min={blend.min} max={blend.max} step={blend.step} value={typeof layer.axisBlend === 'number' ? layer.axisBlend : blend.default} onChange={(v) => setProp('axisBlend', v)} />}
      </LabeledControl>
    </>
  )
}

