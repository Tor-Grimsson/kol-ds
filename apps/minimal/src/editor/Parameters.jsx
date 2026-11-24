import { useEffect, useState } from 'react'
import {
  editLayer, findLayerDeep, isOutlineFamily, layerFamily, pack, PATTERN_SCHEMA, PHOTO_SCHEMA, SHAPE_SCHEMA, TEXT_SCHEMA, TEXT_TAB_KEYS, useComposeState,
  useGeneratorLibrary, useLayerEdit, VECTOR_FX_SCHEMA,
} from './engine.js'
import { ParamList } from '../labs/Params.jsx'
import Button from '../ui/Button.jsx'
import FieldRow from '../ui/FieldRow.jsx'
import Segmented from '../ui/Segmented.jsx'
import Select from '../ui/Select.jsx'

/* The Parameters tab, as the real one is (the package's ParametersPanel): Generate, Style and Animation over the selected
   layer's own schema; the same params, the same order, the same writes. */
const SUBTABS = [{ value: 'generate', label: 'Generate' }, { value: 'style', label: 'Style' }, { value: 'anim', label: 'Animation' }]
const TEXT_PARAMS = TEXT_SCHEMA.filter((p) => !TEXT_TAB_KEYS.has(p.key))
const Hint = ({ children }) => <p className="text-label text-faint">{children}</p>

export default function Parameters() {
  const { selectedId, layers } = useComposeState()
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  return <div className="flex flex-col gap-4 p-4">{layer ? <LayerParameters key={layer.id} layer={layer} /> : <Hint>Select a layer to edit its parameters.</Hint>}</div>
}

function LayerParameters({ layer }) {
  const { updateLayer, convertShapeToPath, flattenGenerate, flattenRepeat, flattenPattern, flattenText, palette } = useComposeState()
  const { library } = useGeneratorLibrary()
  const edit = useLayerEdit(layer.id, { history: 'coalesce' })
  const setProp = edit.setProp
  const [tab, setTab] = useState('style')
  useEffect(() => {
    const on = (e) => { if (e.detail?.tab) setTab(e.detail.tab) }
    window.addEventListener('kol:params-subtab', on)
    return () => window.removeEventListener('kol:params-subtab', on)
  }, [])
  const list = (schema, t = tab) => <ParamList schema={schema} layer={layer} setProp={setProp} palette={palette} tab={t} />
  const strip = <Segmented options={SUBTABS} value={tab} onChange={setTab} />

  let body = null
  const t = layer.type
  if (t === 'shape') {
    body = (
      <>
        {tab === 'generate' && ['rect', 'ellipse', 'triangle', 'polygon', 'star', 'line'].includes(layer.kind) && (
          <Button variant="outline" className="w-full" title="Convert the shape to an editable bezier path (one-way)" onClick={() => convertShapeToPath(layer.id)}>Convert to path</Button>
        )}
        {tab === 'style' && <>{list(SHAPE_SCHEMA)}{list(VECTOR_FX_SCHEMA)}</>}
        {tab === 'anim' && list(SHAPE_SCHEMA)}
      </>
    )
  } else if (t === 'generate' || t === 'repeat') {
    body = tab === 'generate' ? (
      <div className="flex flex-col gap-2">
        <Button variant="outline" className="w-full" onClick={() => editLayer(t, layer)}>{t === 'generate' ? 'Generate settings…' : 'Repeat settings…'}</Button>
        <Button variant="outline" className="w-full" onClick={() => (t === 'generate' ? flattenGenerate : flattenRepeat)(layer.id)}>Expand</Button>
      </div>
    ) : null
  } else if (t === 'text') {
    const specs = library.type ?? []
    body = (
      <>
        {tab === 'generate' && specs.length > 0 && (
          <FieldRow label="Apply saved spec">
            <Select value="" options={[{ value: '', label: '— free-form' }, ...specs.map((s, i) => ({ value: s.id, label: s.text?.slice(0, 24) || `Spec ${i + 1}` }))]}
              onChange={(id) => { const s = specs.find((x) => x.id === id); if (s) updateLayer(layer.id, Object.fromEntries(['text', 'width', 'weight', 'italic', 'size', 'tracking', 'lineHeight', 'case', 'textAlign'].map((k) => [k, s[k] ?? layer[k]]))) }} />
          </FieldRow>
        )}
        {tab === 'generate' && isOutlineFamily(layerFamily(layer)) && <Button variant="outline" className="w-full" onClick={() => flattenText(layer.id)}>Flatten</Button>}
        {tab === 'style' && list(TEXT_PARAMS)}
        {tab === 'anim' && list(TEXT_SCHEMA)}
      </>
    )
  } else if (t === 'pattern') {
    const pats = library.pattern ?? []
    body = (
      <>
        {tab === 'generate' && pats.length > 0 && (
          <FieldRow label="Apply saved pattern">
            <Select value="" options={[{ value: '', label: '— pick spec' }, ...pats.map((p, i) => ({ value: p.id, label: `Pattern ${i + 1}` }))]}
              onChange={(id) => { const s = pats.find((x) => x.id === id); if (s) updateLayer(layer.id, Object.fromEntries(['shapeId', 'customSvg', 'cols', 'rows', 'gap', 'padding', 'stretch', 'overflow', 'rules', 'scale'].map((k) => [k, s[k] ?? layer[k]]))) }} />
          </FieldRow>
        )}
        {tab === 'generate' && <Button variant="outline" className="w-full" title="Flatten the pattern to static SVG shapes (one-way)" onClick={() => flattenPattern(layer.id)}>Flatten</Button>}
        {tab === 'style' && <Hint>Pattern styling lives in the Pattern tab.</Hint>}
        {tab === 'anim' && list(PATTERN_SCHEMA)}
      </>
    )
  } else if (t === 'photo') {
    body = tab === 'generate' ? null : list(PHOTO_SCHEMA)
  } else if (t === 'loop' || t === 'misc') {
    const g = pack('generators')
    if (!g) return <Hint>This layer has no parameters.</Hint>
    body = list(g.loopById(layer.loopId)?.params ?? [])
  } else if (t === 'kinetic') {
    if (!pack('motion')) return <Hint>This layer has no parameters.</Hint>
    body = <Hint>The type composer is not redrawn in the minimal style.</Hint>
  } else if (t === 'path') {
    body = tab === 'style' ? list(VECTOR_FX_SCHEMA) : null
  } else {
    return <Hint>This layer has no parameters.</Hint>
  }
  return <>{strip}{body}</>
}
