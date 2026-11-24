import { useState } from 'react'
import {
  compileExpr, getSource, isBinding, paramSection, paramTab, resolveColor, resolveValue, transport, useTransportCtx, visibleParams,
} from './engine.js'
import Button from '../ui/Button.jsx'
import Section from '../ui/Section.jsx'
import FieldRow from '../ui/FieldRow.jsx'
import InputColor from '../ui/InputColor.jsx'
import InputNumber from '../ui/InputNumber.jsx'
import Segmented from '../ui/Segmented.jsx'
import Select from '../ui/Select.jsx'
import Slider from '../ui/Slider.jsx'
import Textarea from '../ui/Textarea.jsx'
import Toggle from '../ui/Toggle.jsx'

/* The real rail's renderers (AutoControls, QuickMotion, InputRows in the package) drawn with this style's parts: the
   same params, the same order, the same sections and the same writes. Only the drawing is local. This is the Labs
   screen's copy in round 1's sections; ./Params.jsx is round 2's, kept as it was because the editor screen and
   ./Dock.jsx import it. */

/* A section: round 1's titled block (the hairline under it, 16 round). `flat` draws the rows alone, for a card that sits
   inside a section already. */
export function Group({ label, flat = false, children }) {
  if (flat) return <div className="flex flex-col gap-2">{children}</div>
  return <Section title={label}>{children}</Section>
}

/* the real Off/On pair, drawn as round 1's switch */
export function OffOn({ on, onChange, label }) {
  return <Toggle checked={on} onChange={onChange} aria-label={label} />
}

/* a select whose options carry numbers hands the number back, not its text */
export function ParamSelect({ value, options, onChange }) {
  return <Select value={value} options={options} onChange={(v) => onChange(options.find((o) => String(o.value ?? o) === v)?.value ?? v)} />
}

/* As wide as its longest value (the real rangeChars). */
function rangeChars(p) {
  const dec = p.step && p.step < 1 ? (String(p.step).split('.')[1]?.length ?? 2) : 0
  return Math.max(2, String(Math.round(p.max ?? 0)).length, String(Math.round(p.min ?? 0)).length) + (dec ? dec + 1 : 0)
}

/* The slider with its number box: a number sets a constant, an expression binds it; while bound the track goes and
   the box shows the expression or the live value. */
function RangeRow({ param: p, layer, setProp, chars }) {
  const raw = layer[p.key]
  const bound = isBinding(raw)
  const boundExpr = bound && raw.bind === 'mod' && raw.source === 'expr'
  const ctx = useTransportCtx(bound)
  const live = bound ? resolveValue(raw, ctx, layer) : raw
  const num = typeof live === 'number' ? live : (p.default ?? 0)
  const dec = p.step && p.step < 1 ? (String(p.step).split('.')[1]?.length ?? 2) : 0
  const shown = boundExpr ? (raw.transform?.expr ?? 'wave(t)') : (p.format ? String(p.format(num)) : (dec ? num.toFixed(dec) : String(Math.round(num))))
  const commit = (s) => {
    const n = Number(s)
    if (Number.isFinite(n)) { setProp(p.key, n); return }
    if (!compileExpr(s).ok) return
    const range = (bound && raw.transform?.range) || (p.min != null && p.max != null ? [p.min, p.max] : [0, 1])
    setProp(p.key, { bind: 'mod', source: 'expr', transform: { ...(bound ? raw.transform : {}), expr: s, range } })
  }
  return (
    <FieldRow label={p.label}>
      {bound
        ? <InputNumber value={shown} chars={chars ?? rangeChars(p)} onCommit={commit} aria-label={p.label} className="flex-1" />
        : <Slider value={num} min={p.min} max={p.max} step={p.step ?? 1} label={p.label} format={() => shown} onCommit={commit} onChange={(v) => setProp(p.key, v)} />}
    </FieldRow>
  )
}

function ParamRow({ param: p, layer, setProp, palette, chars }) {
  const raw = layer[p.key]
  const value = raw === undefined ? p.default : raw
  if (p.type === 'color') {
    return <div className="flex"><InputColor label={p.label} value={value} resolved={resolveColor(value, palette) ?? '#ffffff'} onChange={(v) => setProp(p.key, v)} /></div>
  }
  if (p.type === 'range') return <RangeRow param={p} layer={layer} setProp={setProp} chars={chars} />
  if (p.type === 'select') {
    return <FieldRow label={p.label}><ParamSelect value={value} options={p.options ?? []} onChange={(v) => setProp(p.key, p.numeric ? Number(v) : v)} /></FieldRow>
  }
  if (p.type === 'segmented') {
    return <FieldRow label={p.label}><Segmented className="flex-1" options={p.options ?? []} value={value} onChange={(v) => setProp(p.key, v)} /></FieldRow>
  }
  if (p.type === 'toggle') {
    if (p.labels) {
      const [off, on] = p.labels
      return <FieldRow label={p.label}><Segmented className="flex-1" options={[{ value: 'off', label: off }, { value: 'on', label: on }]} value={value ? 'on' : 'off'} onChange={(v) => setProp(p.key, v === 'on')} /></FieldRow>
    }
    return <FieldRow label={p.label}><span className="flex flex-1 justify-end"><Toggle checked={!!value} onChange={(v) => setProp(p.key, v)} /></span></FieldRow>
  }
  if (p.type === 'text') {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-label text-muted">{p.label}</span>
        <Textarea rows={p.rows ?? 2} value={value ?? ''} placeholder={p.placeholder} onChange={(e) => setProp(p.key, e.target.value)} />
      </div>
    )
  }
  return null
}

/* AutoControls: the schema's params for `tab`, grouped by section; the leading run of selects in an unsectioned group
   stands apart (the picking cluster); a section any of whose params is `collapsed` is shut until pressed. */
export function ParamList({ schema, layer, setProp, palette, tab, emptyHint, title, flat = false }) {
  let params = visibleParams(schema ?? [], layer)
  if (tab) params = params.filter((p) => paramTab(p) === tab)
  if (!params.length) return emptyHint ? <Group><p className="text-label text-faint">{emptyHint}</p></Group> : null
  const groups = []
  for (const p of params) {
    const section = paramSection(p)
    const last = groups[groups.length - 1]
    if (last && last.section === section) last.params.push(p)
    else groups.push({ section, params: [p] })
  }
  return groups.map((g) => {
    const chars = Math.max(0, ...g.params.filter((p) => p.type === 'range').map(rangeChars)) || undefined
    const rows = g.params.map((p) => <ParamRow key={p.key} param={p} layer={layer} setProp={setProp} palette={palette} chars={chars} />)
    if (g.section && g.params.some((p) => p.collapsed)) {
      return (
        <details key={g.params[0].key} className="group flex flex-col gap-2 border-b border-line p-4">
          <summary className="flex h-7 cursor-pointer items-center text-label font-medium text-fg">{g.section}</summary>
          <div className="flex flex-col gap-2 pt-2">{rows}</div>
        </details>
      )
    }
    const label = g.section && g.section !== g.params[0].label ? g.section : title
    return <Group key={g.params[0].key} label={label} flat={flat}>{rows}</Group>
  })
}

/* QuickMotion: one mode select per numeric param (Off, Breathe, Sweep, Jitter). */
const MOTIONS = [
  { value: 'breathe', label: 'Breathe', source: 'lfo-sine', rate: 1 },
  { value: 'sweep', label: 'Sweep', source: 'lfo-triangle', rate: 1 },
  { value: 'jitter', label: 'Jitter', source: 'lfo-square', rate: 8 },
]
const modeOf = (v) => {
  if (!isBinding(v)) return 'off'
  if (v.bind !== 'mod') return 'custom'
  return MOTIONS.find((m) => m.source === v.source && (v.transform?.rate ?? 1) === m.rate)?.value ?? 'custom'
}
export function ModulateList({ schema, layer, setProp }) {
  const params = visibleParams(schema ?? [], layer).filter((p) =>
    p.type === 'range' && p.animatable !== false && paramTab(p) !== 'anim' && p.min != null && p.max != null && !/seed/i.test(p.key))
  if (!params.length) return null
  const pick = (p, mode) => {
    const v = layer[p.key]
    if (mode === 'off') {
      const r = v?.transform?.range
      setProp(p.key, Array.isArray(r) ? (r[0] + r[1]) / 2 : resolveValue(v, transport.getCtx(), layer) ?? p.default ?? p.min)
      return
    }
    const m = MOTIONS.find((x) => x.value === mode)
    const cur = Number(resolveValue(v, transport.getCtx(), layer) ?? p.default ?? p.min)
    const span = (p.max - p.min) * 0.2
    setProp(p.key, { bind: 'mod', source: m.source, transform: { range: [Math.max(p.min, cur - span), Math.min(p.max, cur + span)], rate: m.rate } })
  }
  return (
    <Group label="Modulate">
      {params.map((p) => {
        const mode = modeOf(layer[p.key])
        const options = [{ value: 'off', label: 'Off' }, ...MOTIONS.map(({ value, label }) => ({ value, label })), ...(mode === 'custom' ? [{ value: 'custom', label: 'Custom' }] : [])]
        return <FieldRow key={p.key} label={p.label}><Select value={mode} options={options} onChange={(m) => m !== 'custom' && pick(p, m)} /></FieldRow>
      })}
    </Group>
  )
}

/* InputRows: Add input binds the next of the def's shortlist to Mouse X; each bound row picks its source and what it
   drives. The real row is one two-group menu; here it is two selects in one row. */
const SOURCES = [
  { value: 'off', label: 'Off' }, { value: 'mouseX', label: 'Mouse X' }, { value: 'mouseY', label: 'Mouse Y' },
  { value: 'audio-level', label: 'Mic' }, { value: 'audio-bass', label: 'Beat' }, { value: 'lfo-sine', label: 'LFO' },
]
const IS_INPUT = new Set(SOURCES.map((s) => s.value))
export function InputList({ schema, layer, setProp, inputs = null }) {
  const params = visibleParams(schema ?? [], layer).filter((p) =>
    p.type === 'range' && p.animatable !== false && p.min != null && p.max != null && !/seed/i.test(p.key))
  if (!params.length) return null
  const byKey = new Map(params.map((p) => [p.key, p]))
  const shortlist = (inputs ?? []).filter((k) => byKey.has(k))
  const order = [...shortlist, ...params.map((p) => p.key).filter((k) => !shortlist.includes(k))]
  const best = shortlist.length ? shortlist : order.slice(0, 3)
  const bound = (k) => { const v = layer[k]; return isBinding(v) && v.bind === 'mod' && IS_INPUT.has(v.source) }
  const now = (k) => { const p = byKey.get(k); return Number(resolveValue(layer[k], transport.getCtx(), layer) ?? p.default ?? p.min) }
  const bind = (k, source, base = isBinding(layer[k]) ? layer[k].transform?.base ?? now(k) : now(k)) => {
    const p = byKey.get(k)
    getSource(source)?.ensure?.().catch(() => {})
    setProp(k, { bind: 'mod', source, transform: { range: [p.min, p.max], base, ...(source.startsWith('lfo') ? { rate: 1 } : {}) } })
  }
  const unbind = (k) => setProp(k, isBinding(layer[k]) ? layer[k].transform?.base ?? now(k) : now(k))
  const next = best.find((k) => !bound(k)) ?? order.find((k) => !bound(k))
  return (
    <Group label="Inputs">
      {order.filter(bound).map((k) => (
        <div key={k} className="flex gap-2">
          <Select value={layer[k].source} options={SOURCES} onChange={(v) => (v === 'off' ? unbind(k) : bind(k, v))} />
          <Select
            value={k}
            options={order.map((x) => ({ value: x, label: byKey.get(x).label + (best.includes(x) ? ' ★' : '') }))}
            onChange={(v) => { if (v === k || bound(v)) return; const s = layer[k].source; unbind(k); bind(v, s) }}
          />
        </div>
      ))}
      {next && <Button variant="outline" icon="plus" className="w-full" onClick={() => bind(next, 'mouseX')}>Add input</Button>}
    </Group>
  )
}

/* The info button at the end of the picking row: the native popover, as the real one is. */
export function AboutButton({ about }) {
  const [id] = useState(() => `about-${Math.random().toString(36).slice(2)}`)
  if (!about) return null
  return (
    <>
      <Button icon="info" aria-label="About this preset" popoverTarget={id} />
      <div id={id} popover="auto" className="m-auto w-[min(320px,calc(100vw-32px))] rounded-bar border border-line bg-panel p-4 text-label text-fg">
        <p className="text-label text-muted">{[about.kind, about.engine, about.dimension].filter(Boolean).join(', ')}</p>
        {about.basis && <p className="mt-2">{about.basis}</p>}
      </div>
    </>
  )
}
