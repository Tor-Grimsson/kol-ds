import { useEffect, useRef, useState } from 'react'
import {
  compileExpr, getSource, getSources, isBinding, isGamepadSource, useBindDots, learnCC, learnGamepad, paramSection, paramTab, resolveColor, resolveValue,
  transport, useTransportCtx, visibleParams,
} from './engine.js'
import { Button, ButtonGroup, Dropdown, FieldPair, Input, LabeledControl, Menu, ParamBindDot, Slider, TabsRow, Textarea, ToggleSwitch, Tooltip, LabeledControlSection, ColorInputRow, ColorPickerPopover } from '@kolkrabbi/kol-component'
import { mixedLabel, useMixed } from '../editor/generate/ContentScopeAll.jsx'

/* The real rail's renderers (AutoControls, QuickMotion, InputRows in the package), as apps/minimal/src/labs/ParamsRail.jsx
   reads them: the same params, the same order, the same sections and the same writes. Only the drawing is kolbox's:
   a section is a RailSection, a row a LabeledControl. */

/* options as the kit takes them: { value, label } with string values */
const opts = (options) => options.map((o) => (typeof o === 'object' && o !== null
  ? { value: String(o.value), label: String(o.label ?? o.value) }
  : { value: String(o), label: String(o) }))

/* a select whose options carry numbers hands the number back, not its text */
export function ParamSelect({ value, options, onChange, className = 'min-w-0 flex-1' }) {
  return <Dropdown variant="kolbox" value={String(value)} options={opts(options)} className={className} onChange={(v) => onChange(options.find((o) => String(o?.value ?? o) === v)?.value ?? v)} />
}

const OFF_ON = [{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }]
/* the real Off/On pair: a two-tab track */
export function OffOn({ on, onChange }) {
  return <TabsRow variant="kolbox" className="w-full" tabs={OFF_ON} value={on ? 'on' : 'off'} onChange={(v) => onChange(v === 'on')} />
}

/* a text box that commits on Enter or blur (an expression, a seed) */
export function CommitInput({ value, onCommit, lead, ...rest }) {
  return (
    <Input variant="kolbox"
      prefix={lead}
      className="min-w-0 flex-1"
      value={String(value)}
      onCommit={(text) => { if (text !== '') onCommit(text) }}
      {...rest}
    />
  )
}

/* The modulation dot (round 4, W5: M), the real BindDot (editor/params/BindDot.jsx) carried: beside a slider while the
   dots are on (M, Settings' Modulation dots) or the value is bound; its menu is Constant, Keyframes, every source but
   the gamepad's, which are one Joystick row, and a pick binds as the real one binds. Hollow, filled once bound. */
export function BindDot({ param, layer, setProp }) {
  const dotsOn = useBindDots()
  const value = layer[param.key]
  const bound = isBinding(value)
  if (!dotsOn && !bound) return null
  const mode = bound ? (value.bind === 'track' ? 'track' : value.source) : 'none'
  const current = () => {
    const v = resolveValue(value, transport.getCtx(), layer)
    return v !== undefined && v !== null ? v : (param.default ?? 0)
  }
  const range = () => (param.min != null && param.max != null ? [param.min, param.max] : [0, 1])
  const pick = (m) => {
    if (m === 'none') setProp(param.key, current())
    else if (m === 'track') { const v = current(); setProp(param.key, { bind: 'track', keys: [{ t: 0, v, easing: 'linear' }, { t: 1, v, easing: 'linear' }] }) }
    else { getSource(m)?.ensure?.().catch(() => {}); setProp(param.key, { bind: 'mod', source: m, transform: { range: range() } }) }
  }
  const srcs = getSources().filter((s) => !s.hidden)
  const firstPad = srcs.find((s) => isGamepadSource(s.id))
  const entries = [
    { value: 'none', label: 'Constant' },
    { value: 'track', label: 'Keyframes' },
    /* the engine's labels carry a middot; shown with a comma, as the input rows below show them */
    ...srcs.filter((s) => !isGamepadSource(s.id)).map((s) => ({ value: s.id, label: s.label.replace(/ · /g, ', ') })),
    ...(firstPad ? [{ value: firstPad.id, label: 'Joystick' }] : []),
  ]
  /* the dot and its menu are ParamBindDot's kolbox look (W31.2 batch 5); the binding stays here */
  return (
    <ParamBindDot variant="kolbox" bound={bound} label={param.label ?? param.key} minWidth={220}
      tooltip={bound ? `Modulated (${mode}) — shape it in the Animation tab` : 'Modulate'}
      items={entries.map((e) => ({ label: e.label, checked: mode === e.value, onClick: () => pick(e.value) }))} />
  )
}

/* The slider with its number box: a number sets a constant, an expression binds it; while bound the track goes and
   the box shows the expression or the live value. */
function RangeRow({ param: p, layer, setProp, wide }) {
  const mixed = useMixed((v) => v[p.key])
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
    <LabeledControl variant="kolbox" horizontal label={mixedLabel(p.label, mixed)} labelWidth={wide ? 160 : undefined}>
      {bound
        ? <CommitInput value={shown} onCommit={commit} aria-label={p.label} />
        : <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" value={dec ? Number(num.toFixed(dec)) : num} min={p.min} max={p.max} step={p.step ?? 1} aria-label={p.label} onChange={(v) => setProp(p.key, v)} />}
      <BindDot param={p} layer={layer} setProp={setProp} />
    </LabeledControl>
  )
}

function ParamRow({ param: p, layer, setProp, palette, wide }) {
  const mixed = useMixed((v) => v[p.key])
  const label = mixedLabel(p.label, mixed)
  const raw = layer[p.key]
  const value = raw === undefined ? p.default : raw
  if (p.type === 'color') {
    return (
      <LabeledControl variant="kolbox" horizontal label={label} labelWidth={wide ? 160 : undefined}>
        <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label={p.label} value={value} resolved={resolveColor(value, palette) ?? undefined} onChange={(v) => setProp(p.key, v)} />
      </LabeledControl>
    )
  }
  if (p.type === 'range') return <RangeRow param={p} layer={layer} setProp={setProp} wide={wide} />
  if (p.type === 'select') {
    return <LabeledControl variant="kolbox" horizontal label={label} labelWidth={wide ? 160 : undefined}><ParamSelect value={value} options={p.options ?? []} onChange={(v) => setProp(p.key, p.numeric ? Number(v) : v)} /></LabeledControl>
  }
  if (p.type === 'segmented') {
    return <LabeledControl variant="kolbox" horizontal label={label} labelWidth={wide ? 160 : undefined}><TabsRow variant="kolbox" className="w-full" tabs={opts(p.options ?? [])} value={String(value)} onChange={(v) => setProp(p.key, (p.options ?? []).find((o) => String(o?.value ?? o) === v)?.value ?? v)} /></LabeledControl>
  }
  if (p.type === 'toggle') {
    if (p.labels) {
      const [off, on] = p.labels
      return <LabeledControl variant="kolbox" horizontal label={label} labelWidth={wide ? 160 : undefined}><TabsRow variant="kolbox" className="w-full" tabs={[{ value: 'off', label: off }, { value: 'on', label: on }]} value={value ? 'on' : 'off'} onChange={(v) => setProp(p.key, v === 'on')} /></LabeledControl>
    }
    return <LabeledControl variant="kolbox" horizontal label={label} labelWidth={wide ? 160 : undefined}><span className="flex flex-1 justify-end"><ToggleSwitch variant="kolbox" aria-label={p.label} checked={!!value} onChange={(v) => setProp(p.key, v)} /></span></LabeledControl>
  }
  if (p.type === 'text') {
    /* multi-line: ui/Textarea */
    return (
      <LabeledControl variant="kolbox" label={label}>
        <Textarea variant="kolbox"
          rows={p.rows ?? 2}
          aria-label={p.label}
          value={value ?? ''}
          placeholder={p.placeholder}
          onChange={(e) => setProp(p.key, e.target.value)}
        />
      </LabeledControl>
    )
  }
  return null
}

/* a section the schema marks collapsed: shut until its chevron is pressed */
function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <LabeledControlSection variant="kolbox" label={title} end={<Button variant="kolbox" iconOnly={open ? 'chevron-down' : 'chevron-right'} aria-label={open ? `Collapse ${title}` : `Expand ${title}`} onClick={() => setOpen(!open)}/>}>
      {open && children}
    </LabeledControlSection>
  )
}

/* AutoControls: the schema's params for `tab`, grouped by section. `flat` gives the rows alone, for a block that already
   sits in a section (an effect under its row). `wide`: the 160 label column (LabeledControl's), for a window's longer
   names; the rails keep 76. */
export function ParamList({ schema, layer, setProp, palette, tab, emptyHint, flat = false, wide = false }) {
  let params = visibleParams(schema ?? [], layer)
  if (tab) params = params.filter((p) => paramTab(p) === tab)
  if (!params.length) return emptyHint ? <LabeledControlSection variant="kolbox"><p className="text-help text-muted">{emptyHint}</p></LabeledControlSection> : null
  const groups = []
  for (const p of params) {
    const section = paramSection(p)
    const last = groups[groups.length - 1]
    if (last && last.section === section) last.params.push(p)
    else groups.push({ section, params: [p] })
  }
  return groups.map((g) => {
    /* data-param: each row names its param, so a script can lay the rows beside the schema's (layout untouched) */
    const rows = g.params.map((p) => <div key={p.key} data-param={p.key} className="contents"><ParamRow param={p} layer={layer} setProp={setProp} palette={palette} wide={wide} /></div>)
    if (flat) return <div key={g.params[0].key} className="flex flex-col gap-2">{rows}</div>
    if (g.section && g.params.some((p) => p.collapsed)) return <Collapsible key={g.params[0].key} title={g.section}>{rows}</Collapsible>
    const label = g.section && g.section !== g.params[0].label ? g.section : undefined
    return <LabeledControlSection variant="kolbox" key={g.params[0].key} label={label}>{rows}</LabeledControlSection>
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
    <LabeledControlSection variant="kolbox" label="Modulate">
      {params.map((p) => {
        const mode = modeOf(layer[p.key])
        const options = [{ value: 'off', label: 'Off' }, ...MOTIONS.map(({ value, label }) => ({ value, label })), ...(mode === 'custom' ? [{ value: 'custom', label: 'Custom' }] : [])]
        return <LabeledControl variant="kolbox" horizontal key={p.key} label={p.label}><Dropdown variant="kolbox" className="min-w-0 flex-1" value={mode} options={options} onChange={(m) => m !== 'custom' && pick(p, m)} /></LabeledControl>
      })}
    </LabeledControlSection>
  )
}

/* InputRows: Add input binds the next of the def's shortlist to Mouse X; each bound row picks its source and what it
   drives, two equal cells. */
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
    <LabeledControlSection variant="kolbox" label="Inputs" end={next && <Button variant="kolbox" iconOnly="plus" aria-label="Add input" onClick={() => bind(next, 'mouseX')}/>}>
      {order.filter(bound).map((k) => (
        <FieldPair variant="kolbox"
          key={k}
          first={<Dropdown variant="kolbox" className="min-w-0 flex-1" value={layer[k].source} options={SOURCES} onChange={(v) => (v === 'off' ? unbind(k) : bind(k, v))} />}
          second={(
            <Dropdown variant="kolbox"
              className="min-w-0 flex-1"
              value={k}
              options={order.map((x) => ({ value: x, label: byKey.get(x).label + (best.includes(x) ? ' ★' : '') }))}
              onChange={(v) => { if (v === k || bound(v)) return; const s = layer[k].source; unbind(k); bind(v, s) }}
            />
          )}
        />
      ))}
    </LabeledControlSection>
  )
}

/* The info button at the end of the picking row: the platform's popover, as the real one is, until the kit's Popover
   lands (plan 2.3). */
export function AboutButton({ about }) {
  const [id] = useState(() => `about-${Math.random().toString(36).slice(2)}`)
  if (!about) return null
  return (
    <>
      <Button variant="kolbox" iconOnly="info" aria-label="About this preset" popoverTarget={id}/>
      <div id={id} popover="auto" className="m-auto w-80 rounded-modal bg-menu p-4 text-label text-text">
        <p className="text-help text-muted">{[about.kind, about.engine, about.dimension].filter(Boolean).join(', ')}</p>
        {about.basis && <p className="mt-2 text-help">{about.basis}</p>}
      </div>
    </>
  )
}

/* The roll scope buttons, the one place they are drawn (round 4 W7): the generator's Generate tab and an effect's
   StageRolls both hand their scopes here. The real rail sets them three to a row in its 380; the kolbox rail's 208 holds
   two of the longest ("Motion Frame") to a row, so the grid is two wide and wraps, and no chip can run off the rail.
   extra: a lab's own chip after the scopes (Math's Wild). Alt-click resets the scope, as the real chips do. */
export function RollScopes({ scopes, onRoll, onReset, extra = null }) {
  if (!scopes.length && !extra) return null
  return (
    <ButtonGroup layout="grid" data-roll-scopes>
      {scopes.map((s) => (
        <Button variant="kolbox" key={s.id} tone="secondary" className="min-w-0 pr-1 pl-1" onClick={(e) => (e.altKey ? onReset(s) : onRoll(s))}>
          <span className="truncate">{s.label}</span>
        </Button>
      ))}
      {extra}
    </ButtonGroup>
  )
}

/* ModulationList (the package's params/ModulationEditor.jsx), the Animation tab's Modulation card: every param bound to
   a source, its name and source, then the real card's controls in the real order, Range, Invert, Smooth, Curve, and Rate
   and Phase for an LFO, the Expression field, plot and examples for an expression, Learn for MIDI and a gamepad. Every
   control writes the binding's `transform` through `setProp`, as the real one does. The real card pairs Invert with
   Smooth and Rate with Phase two to a row; the kolbox rail's 208 gives each its own row. */
const EXPR_EXAMPLES = [
  { code: 'wave(t*2)', desc: 'Fast sine' },
  { code: 'saw(t)*0.8', desc: 'Ramp to 80' },
  { code: 'tri(t*0.5)', desc: 'Slow bounce' },
  { code: 'pulse(t, 0.3)', desc: 'PWM 30%' },
  { code: 'ease(t*2, 4)', desc: 'Fast + punchy' },
  { code: 'bell(t)', desc: 'Bell curve' },
  { code: 'step(t, 4)', desc: '4 steps' },
  { code: 'rand()', desc: 'Noise' },
]
/* the engine's source names carry a middot ("LFO · sine"); shown with a comma */
const sourceLabel = (id) => (getSource(id)?.label ?? id).replace(/ · /g, ', ')

export function ModulationList({ layer, schema, setProp }) {
  const bound = (schema ?? []).filter((p) => { const v = layer[p.key]; return isBinding(v) && v.bind === 'mod' })
  if (!bound.length) return null
  return (
    <LabeledControlSection variant="kolbox" label="Modulation">
      {bound.map((p) => (
        <div key={p.key} className="flex flex-col gap-2 pb-2" data-modulation={p.key}>
          <div className="flex h-6 items-center gap-2">
            <span className="min-w-0 flex-1 truncate text-label text-text">{p.label ?? p.key}</span>
            <span className="shrink-0 font-mono text-meta text-muted">{sourceLabel(layer[p.key].source)}</span>
          </div>
          <ModulationEditor layer={layer} param={p} setProp={setProp} />
        </div>
      ))}
    </LabeledControlSection>
  )
}

function ModulationEditor({ layer, param, setProp }) {
  const [learning, setLearning] = useState(false)
  const [padLearning, setPadLearning] = useState(false)
  const value = layer[param.key]
  const source = value.source
  const tr = value.transform ?? {}
  const patchTransform = (patch) => setProp(param.key, { ...value, transform: { ...tr, ...patch } })
  const range = tr.range ?? (param.min != null && param.max != null ? [param.min, param.max] : [0, 1])
  const num = (v, fallback) => { const n = Number(v); return Number.isFinite(n) ? n : fallback }
  const exprStr = tr.expr ?? 'wave(t)'
  const slider = (label, min, max, step, v, key) => (
    <LabeledControl variant="kolbox" horizontal label={label}>
      <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" min={min} max={max} step={step} value={v} aria-label={label} formatValue={(x) => x.toFixed(2)} onChange={(x) => patchTransform({ [key]: x })} />
    </LabeledControl>
  )
  return (
    <>
      <LabeledControl variant="kolbox" horizontal label="Range">
        <CommitInput value={range[0]} aria-label="Range from" onCommit={(s) => patchTransform({ range: [num(s, range[0]), range[1]] })} />
        <span className="shrink-0 text-meta text-muted">to</span>
        <CommitInput value={range[1]} aria-label="Range to" onCommit={(s) => patchTransform({ range: [range[0], num(s, range[1])] })} />
      </LabeledControl>
      <LabeledControl variant="kolbox" horizontal label="Invert"><OffOn on={!!tr.invert} onChange={(v) => patchTransform({ invert: v })} /></LabeledControl>
      {slider('Smooth', 0, 0.95, 0.05, tr.smooth ?? 0, 'smooth')}
      {slider('Curve', 0.25, 4, 0.05, tr.curve ?? 1, 'curve')}
      {source.startsWith('lfo-') && slider('Rate', 0.25, 16, 0.25, tr.rate ?? 1, 'rate')}
      {source.startsWith('lfo-') && slider('Phase', 0, 1, 0.01, tr.phase ?? 0, 'phase')}
      {source === 'expr' && (
        <>
          <LabeledControl variant="kolbox" horizontal label="Expression">
            <CommitInput value={exprStr} aria-label="Expression" onCommit={(s) => patchTransform({ expr: s })} />
          </LabeledControl>
          <ExprPlot expr={exprStr} />
          <div className="flex flex-col">
            {EXPR_EXAMPLES.map((ex) => (
              <button key={ex.code} type="button" onClick={() => patchTransform({ expr: ex.code })}
                className="flex h-6 items-center gap-2 rounded-control px-2 text-left outline-none hover:bg-hover focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">
                <span className="min-w-0 flex-1 truncate font-mono text-value text-text">{ex.code}</span>
                <span className="shrink-0 text-help text-muted">{ex.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {source === 'midi' && (
        <LabeledControl variant="kolbox" horizontal label={tr.cc != null ? `MIDI, CC ${tr.cc}` : 'MIDI, no CC yet'}>
          <Button variant="kolbox" tone="secondary" onClick={async () => { setLearning(true); const cc = await learnCC(); setLearning(false); if (cc != null) patchTransform({ cc }) }}>
            {learning ? 'Move a knob…' : 'Learn'}
          </Button>
        </LabeledControl>
      )}
      {isGamepadSource(source) && (
        <LabeledControl variant="kolbox" horizontal label={getSource(source)?.label ?? 'Gamepad'}>
          <Button variant="kolbox" tone="secondary" onClick={async () => { setPadLearning(true); const id = await learnGamepad(); setPadLearning(false); if (id) setProp(param.key, { ...value, source: id }) }}>
            {padLearning ? 'Move a control…' : 'Learn'}
          </Button>
        </LabeledControl>
      )}
    </>
  )
}

/* the expression over one loop (the real ExprPlot on kol-component's FunctionPlot): the 0 and 1 rails, the curve, the
   loop's playhead; redrawn every frame so an audio or random expression moves */
function ExprPlot({ expr }) {
  const [u, setU] = useState(0)
  useEffect(() => {
    let raf = 0
    const tick = () => { setU(transport.getCtx().t ?? 0); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const c = compileExpr(expr)
  const secs = transport.getLoopSeconds()
  const N = 200
  const samples = Array.from({ length: N + 1 }, (_, i) => (c.ok ? c.fn((i / N) * secs) : 0))
  const lo = Math.min(0, ...samples), hi = Math.max(1, ...samples)
  const y = (v) => 60 - ((v - lo) / (hi - lo || 1)) * 56
  /* the transport's t is the loop's phase, 0 to 1 */
  const cursor = (u % 1) * N
  return (
    <svg viewBox={`0 0 ${N} 64`} preserveAspectRatio="none" className="h-16 w-full rounded-well bg-field" role="img" aria-label="Expression plot over one loop">
      <line x1="0" x2={N} y1={y(0)} y2={y(0)} className="stroke-border" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
      <line x1="0" x2={N} y1={y(1)} y2={y(1)} className="stroke-border" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
      <polyline fill="none" className="stroke-text" strokeWidth="1.5" vectorEffect="non-scaling-stroke" points={samples.map((v, i) => `${i},${y(v)}`).join(' ')} />
      <line x1={cursor} x2={cursor} y1="0" y2="64" className="stroke-accent" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
