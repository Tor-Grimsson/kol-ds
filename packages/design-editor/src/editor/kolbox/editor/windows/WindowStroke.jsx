import { findLayerDeep, useComposeState, useLayerEdit } from '../engine.js'
import WindowPane from './WindowPane.jsx'
import { Input, LabeledControl, TabsRow } from '@kolkrabbi/kol-component'

/* Stroke, as the real StrokeBody (color/StrokePanel.jsx): Weight (0 to 64 pt; a weight on a fill-only layer gives it a
   black stroke to draw), Style (solid, dashed, dotted, stored as the dash array and a round cap for dots), Cap and Join,
   on the selected layer, one undo step per burst (coalesce). Strokeable: shape, text and pattern layers, unlocked;
   anything else and the rows are greyed, as they do not apply. The style previews are the real one's drawings. */
const LinePreview = ({ dash }) => (
  <svg width="40" height="2" viewBox="0 0 40 2" className="block"><line x1="0" y1="1" x2="40" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray={dash} /></svg>
)
const DotsPreview = () => (
  <svg width="40" height="3" viewBox="0 0 40 3" className="block">{[3, 11, 19, 27, 35].map((cx) => <circle key={cx} cx={cx} cy="1.5" r="1.25" fill="currentColor" />)}</svg>
)
const STYLE_OPTIONS = [
  { value: 'solid', label: <span className="flex justify-center" aria-label="Solid"><LinePreview /></span> },
  { value: 'dashed', label: <span className="flex justify-center" aria-label="Dashed"><LinePreview dash="4 3" /></span> },
  { value: 'dotted', label: <span className="flex justify-center" aria-label="Dotted"><DotsPreview /></span> },
]
const CAP_OPTIONS = [{ value: 'butt', label: 'Butt' }, { value: 'round', label: 'Round' }, { value: 'square', label: 'Square' }]
const JOIN_OPTIONS = [{ value: 'miter', label: 'Miter' }, { value: 'round', label: 'Round' }, { value: 'bevel', label: 'Bevel' }]
const DASH_FOR_STYLE = { solid: '', dashed: '8 6', dotted: '2 6' }
const styleFromDash = (dash, cap) => (!dash ? 'solid' : cap === 'round' && /^[0-2]\s+[3-9]/.test(dash) ? 'dotted' : 'dashed')
const STROKEABLE_TYPES = new Set(['shape', 'text', 'pattern'])
const off = (tabs, disabled) => (disabled ? tabs.map((t) => ({ ...t, disabled: true })) : tabs)

export default function WindowStroke({ onClose }) {
  const { selectedId, layers } = useComposeState()
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  const ok = !!layer && STROKEABLE_TYPES.has(layer.type) && !layer.locked
  const edit = useLayerEdit(ok ? layer.id : null, { history: 'coalesce' })
  const weight = layer?.strokeWidth ?? 0
  const cap = layer?.strokeLinecap ?? 'butt'
  const join = layer?.strokeLinejoin ?? 'miter'
  const style = styleFromDash(layer?.strokeDasharray ?? '', cap)

  const onWeight = (raw) => {
    if (!ok) return
    const n = Math.max(0, Math.min(64, Number(parseFloat(raw)) || 0))
    if (n > 0 && !layer.stroke) edit.patch({ strokeWidth: n, stroke: '#000000' })
    else edit.setProp('strokeWidth', n)
  }
  const onStyle = (s) => ok && edit.patch({ strokeDasharray: DASH_FOR_STYLE[s] ?? '', strokeLinecap: s === 'dotted' ? 'round' : cap === 'round' ? 'butt' : cap })

  return (
    <WindowPane title="Stroke" name="stroke" onClose={onClose}>
      <LabeledControl variant="kolbox" horizontal label="Weight">
        <Input variant="kolbox" key={`${layer?.id}-${weight}`} aria-label="Weight" defaultValue={`${weight} pt`} disabled={!ok} className="w-24"
          onBlur={(e) => onWeight(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} />
      </LabeledControl>
      <LabeledControl variant="kolbox" horizontal label="Style"><TabsRow variant="kolbox" tabs={off(STYLE_OPTIONS, !ok)} value={style} onChange={onStyle} className="w-full" /></LabeledControl>
      <LabeledControl variant="kolbox" horizontal label="Cap"><TabsRow variant="kolbox" tabs={off(CAP_OPTIONS, !ok)} value={cap} onChange={(v) => edit.setProp('strokeLinecap', v)} className="w-full" /></LabeledControl>
      <LabeledControl variant="kolbox" horizontal label="Join"><TabsRow variant="kolbox" tabs={off(JOIN_OPTIONS, !ok)} value={join} onChange={(v) => edit.setProp('strokeLinejoin', v)} className="w-full" /></LabeledControl>
    </WindowPane>
  )
}
