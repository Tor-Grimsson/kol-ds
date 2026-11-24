import { useMemo, useState } from 'react'
import {
  allScopeParams, computeRoll, newRule, patternFromSpec, PATTERN_SCHEMA, randomRule, resolveColor, resolveCssVar, ROTATE_OPTIONS,
  SELECT_OPTIONS, useComposeState, useGeneratorLibrary, useRollSeed,
} from '../engine.js'
import { CommitInput, ParamList } from '../../labs/Params.jsx'
import { mixedLabel, useMixed } from '../generate/ContentScopeAll.jsx'
import { Cell, Field } from './parts.jsx'
import { Button, Dropdown, FieldPair, Input, LabeledControl, Slider, SwatchGrid, TabsRow, LabeledControlSection, ColorInputRow, ColorPickerPopover } from '@kolkrabbi/kol-component'

/* The pattern layer's own surface (the real PatternPanel, the Pattern tab, E209), in the Style tab: Randomize all and
   its Seed, the schema's params under the panel's own names, the rules stack, the Color and Background swatches with
   their field, Copy CSS and Reset, Save pattern to library. Every write is the real one's. */
const RELABEL = { cols: { label: 'Columns' }, rows: { label: 'Rows' }, bgOn: { label: 'Bg', section: 'Tile' } }
const PATTERN_TAB_SCHEMA = PATTERN_SCHEMA.filter((p) => p.key !== 'bg').map((p) => (RELABEL[p.key] ? { ...p, ...RELABEL[p.key] } : p))
const ROW_WARM = ['--kol-color-cream-100', '--kol-color-cream-200', '--kol-color-cream-300', '--kol-color-cream-400', '--kol-color-cream-500',
  '--kol-color-red-100', '--kol-color-red-200', '--kol-color-red-300', '--kol-color-red-400', '--kol-color-red-500']
const ROW_GREY = ['--grey-50', '--grey-100', '--grey-200', '--grey-300', '--grey-400', '--grey-500', '--grey-600', '--grey-700', '--grey-800', '--grey-900']
const COLOR_TABS = [{ value: 'color', label: 'Color' }, { value: 'background', label: 'Background' }]

export default function PatternSurface({ layer, edit }) {
  const { updateLayer, palette } = useComposeState()
  const { savePattern } = useGeneratorLibrary()
  const setProp = edit.setProp
  const rules = layer.rules ?? []
  const setRules = (next) => updateLayer(layer.id, { rules: next })
  const seed = useRollSeed(layer)
  const [tab, setTab] = useState('color')
  const swatches = useMemo(() => [...ROW_WARM, ...ROW_GREY].map((t) => resolveCssVar(t)), [])

  const resolvedColor = resolveColor(layer.color, palette) ?? layer.color
  const resolvedBg = layer.bgOn ? (resolveColor(layer.bg, palette) ?? layer.bg) : null
  const current = tab === 'color' ? resolvedColor : resolvedBg
  const onColor = (hex) => {
    if (tab === 'color') { if (hex != null) setProp('color', hex) }
    else if (hex == null) setProp('bgOn', false)
    else updateLayer(layer.id, { bg: hex, bgOn: true })
  }
  const copyCss = () => {
    const bg = resolveColor(layer.bg, palette) ?? layer.bg
    navigator.clipboard?.writeText(`color: ${resolvedColor};\nbackground: ${bg};`).catch(() => {})
  }
  const resetColors = () => { const d = patternFromSpec({}); updateLayer(layer.id, { color: d.color, bg: d.bg }) }
  const mixedRules = useMixed((v) => v.rules ?? [])
  const mixedColor = useMixed((v) => [v.color ?? null, v.bg ?? null, v.bgOn ?? null])
  const onSave = () => savePattern({
    shapeId: layer.shapeId, customSvg: layer.customSvg, cols: layer.cols, rows: layer.rows, gap: layer.gap, padding: layer.padding,
    stretch: layer.stretch, overflow: layer.overflow, bg: layer.bgOn ? layer.bg : null, color: layer.color, rules: layer.rules ?? [], scale: layer.scale,
  })

  return (
    <>
      <LabeledControlSection variant="kolbox">
        <Button variant="kolbox" className="w-full" onClick={() => updateLayer(layer.id, computeRoll(layer, allScopeParams(PATTERN_TAB_SCHEMA, layer), seed.take()))}>Randomize all</Button>
        <LabeledControl variant="kolbox" horizontal label="Seed">
          <CommitInput value={seed.value} aria-label="Seed" onCommit={(s) => { const n = Math.floor(Number(s)); if (Number.isFinite(n) && n >= 0) seed.commit(n) }} />
        </LabeledControl>
      </LabeledControlSection>
      <ParamList schema={PATTERN_TAB_SCHEMA} layer={layer} setProp={setProp} palette={palette} />
      {/* the real title reads "Rules" and the count with a middot between; here a space (no middots) */}
      <LabeledControlSection variant="kolbox" label={mixedLabel(`Rules ${rules.length}`, mixedRules)}>
        {rules.map((rule, i) => (
          <RuleRow
            key={rule.id}
            rule={rule}
            onChange={(r) => setRules(rules.map((x, k) => (k === i ? r : x)))}
            onRemove={() => setRules(rules.filter((_, k) => k !== i))}
            onReroll={() => setRules(rules.map((x, k) => (k === i ? { ...randomRule(), id: x.id } : x)))}
          />
        ))}
        <FieldPair variant="kolbox"
          first={<Button variant="kolbox" iconLeft="plus" className="w-full" onClick={() => setRules([...rules, newRule()])}>Add rule</Button>}
          second={<Button variant="kolbox" className="w-full" onClick={() => setRules(Array.from({ length: Math.floor(Math.random() * 3) + 1 }, randomRule))}>Randomize</Button>}
        />
      </LabeledControlSection>
      <LabeledControlSection variant="kolbox" label={mixedLabel('Color', mixedColor)}>
        <TabsRow variant="kolbox" className="w-full" tabs={COLOR_TABS} value={tab} onChange={setTab} />
        <SwatchGrid colors={swatches} value={current?.toUpperCase?.()} onChange={onColor} />
        <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label={tab === 'color' ? 'Pattern color' : 'Pattern background'} value={current ?? ''} onChange={onColor} />
        <FieldPair variant="kolbox"
          first={<Button variant="kolbox" className="w-full" onClick={copyCss}>Copy CSS</Button>}
          second={<Button variant="kolbox" className="w-full" onClick={resetColors}>Reset</Button>}
        />
      </LabeledControlSection>
      <LabeledControlSection variant="kolbox">
        <Button variant="kolbox" className="w-full" aria-label="Save current pattern params to the shared library" onClick={onSave}>Save pattern to library</Button>
      </LabeledControlSection>
    </>
  )
}

/* one rule (the real RuleRow): which cells, reroll and delete; N and Offset; Row N and Row offset; the expression;
   Group W and H; rotation and the three chips; opacity */
function RuleRow({ rule, onChange, onRemove, onReroll }) {
  const set = (patch) => onChange({ ...rule, ...patch })
  const showN = ['every-col', 'every-row', 'every-nth', 'both'].includes(rule.selectKind)
  const int = (n, min) => Math.max(min, Math.round(n))
  const chip = (key, label, title) => (
    <Button variant="kolbox" tone={rule[key] ? 'primary' : 'secondary'} aria-label={title} aria-pressed={!!rule[key]} onClick={() => set({ [key]: !rule[key] })}>{label}</Button>
  )
  return (
    <div className="flex flex-col gap-2" data-rule>
      <div className="flex items-center gap-1">
        <Dropdown variant="kolbox" ariaLabel="Select cells" className="min-w-0 flex-1" value={rule.selectKind} options={SELECT_OPTIONS} onChange={(v) => set({ selectKind: v })} />
        <Button variant="kolbox" iconOnly="refresh" aria-label="Re-randomize rule" onClick={onReroll}/>
        <Button variant="kolbox" iconOnly="x" aria-label="Delete rule" onClick={onRemove}/>
      </div>
      {showN && (
        <FieldPair variant="kolbox"
          first={<Cell label="N"><Field aria-label="N" value={rule.n} onCommit={(n) => set({ n: int(n, 1) })} /></Cell>}
          second={<Cell label="Offset"><Field aria-label="Offset" value={rule.offset} onCommit={(n) => set({ offset: int(n, 0) })} /></Cell>}
        />
      )}
      {rule.selectKind === 'both' && (
        <FieldPair variant="kolbox"
          first={<Cell label="Row N"><Field aria-label="Row N" value={rule.n2} onCommit={(n) => set({ n2: int(n, 1) })} /></Cell>}
          second={<Cell label="Row offset"><Field aria-label="Row offset" value={rule.offset2} onCommit={(n) => set({ offset2: int(n, 0) })} /></Cell>}
        />
      )}
      {rule.selectKind === 'expression' && (
        <Cell label="Expression, matches when > 0">
          <Input variant="kolbox" aria-label="Expression" value={rule.expression} placeholder="sin(col * 0.6) + cos(row * 0.6)" onChange={(e) => set({ expression: e.target.value })} />
          <span className="font-mono text-meta text-muted">vars: i, col, row, cols, rows, Math.* in scope</span>
        </Cell>
      )}
      <FieldPair variant="kolbox"
        first={<Cell label="Group W"><Field aria-label="Group W" value={rule.groupW} onCommit={(n) => set({ groupW: int(n, 1) })} /></Cell>}
        second={<Cell label="Group H"><Field aria-label="Group H" value={rule.groupH} onCommit={(n) => set({ groupH: int(n, 1) })} /></Cell>}
      />
      <div className="flex items-center gap-1">
        <Dropdown variant="kolbox" ariaLabel="Rotate" className="min-w-0 flex-1" value={rule.rotate} options={ROTATE_OPTIONS.map((o) => ({ value: String(o.value), label: o.label }))} onChange={(v) => set({ rotate: Number(v) })} />
        {chip('flipH', '⇋', 'Flip horizontal')}
        {chip('flipV', '⇵', 'Flip vertical')}
        {chip('hide', 'hide', 'Hide cell')}
      </div>
      <LabeledControl variant="kolbox" horizontal label="Opacity">
        <Slider variant="kolbox" className="min-w-0 flex-1" aria-label="Rule opacity" min={0} max={100} value={Math.round(rule.opacity * 100)} formatValue={(v) => `${v}%`} onChange={(v) => set({ opacity: v / 100 })} />
      </LabeledControl>
    </div>
  )
}
