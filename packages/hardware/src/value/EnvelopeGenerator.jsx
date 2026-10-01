import { useMemo, useRef, useState } from 'react'
import { Button, Divider, Input, SegmentedToggle, Slider } from '@kolkrabbi/kol-component'
import Knob from './Knob.jsx'
import Toggle from '../switches/Toggle.jsx'
import SignalScope from '../indicators/SignalScope.jsx'
import SignalReference from '../panel/SignalReference.jsx'
import { compileExpression, fitRange } from '../signal/expression.js'
import { envelopeAt, envelopeLength, gateSeconds, stageSeconds, ADSR_DEFAULTS } from '../signal/adsr.js'
import { EXPRESSION_SECTIONS, EXPRESSION_TABS, ADSR_SECTIONS, ADSR_TABS, ADSR_PRESETS } from '../signal/reference.js'

const MODES = [{ value: 'equation', label: 'Equation' }, { value: 'adsr', label: 'ADSR' }]
const VIEW = { min: 0, max: 100, sec: 5, ofs: 0, zoomX: 1, zoomY: 1, panY: 0 }
const num = (s, fallback) => { const n = parseFloat(s); return Number.isFinite(n) ? n : fallback }
const r2 = (v) => Math.round(v * 100) / 100

/* an envelope as text and back — what the Saved rows carry */
export const adsrCode = (p) =>
  `a${Math.round(p.attack)} d${Math.round(p.decay)} s${Math.round(p.sustain)} r${Math.round(p.release)} h${r2(p.hold ?? ADSR_DEFAULTS.hold)}`
const parseAdsr = (code) => {
  const m = /^a(\d+) d(\d+) s(\d+) r(\d+)(?: h([\d.]+))?$/.exec(String(code))
  return m ? { attack: +m[1], decay: +m[2], sustain: +m[3], release: +m[4], hold: m[5] ? +m[5] : ADSR_DEFAULTS.hold } : null
}
/* seconds → the knob value that gives them (inverse of stageSeconds) */
const knobFor = (seconds) => Math.max(0, Math.min(100, ((seconds - 0.005) / 1.995) * 100))
/* the ADSR window: one pass, and room past it to drag R into */
const adsrWindow = (adsr) => envelopeLength(adsr) * 1.15

/**
 * useEnvelopeGenerator(options) — the generator's state, for a host that arranges the parts.
 * Takes the component's own options (`default*`, `saved`, `savedAdsr`, `onSave`, `onChange`).
 */
export function useEnvelopeGenerator({
  defaultMode = 'equation', defaultExpr = 'wave(t)', defaultAdsr = ADSR_DEFAULTS,
  saved, savedAdsr, onSave, onChange,
} = {}) {
  const [mode, setModeState] = useState(defaultMode)
  const [expr, setExprState] = useState(defaultExpr)
  const [adsr, setAdsrState] = useState({ ...ADSR_DEFAULTS, ...defaultAdsr })
  const [view, setViewState] = useState(VIEW)
  const [cycle, setCycle] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [bpm, setBpm] = useState(60)
  const [trigger, setTrigger] = useState(0)
  const [heldSec, setHeldSec] = useState(null)   // the ADSR window, frozen while a handle drags

  const compiled = useMemo(() => compileExpression(expr), [expr])
  const emit = (patch) => onChange?.({ mode, expr, adsr, min: view.min, max: view.max, sec: view.sec, ofs: view.ofs, ...patch })
  const setMode = (m) => { setModeState(m); emit({ mode: m }) }
  const setExpr = (e) => { setExprState(e); emit({ expr: e }) }
  const setAdsr = (p) => { const next = { ...adsr, ...p }; setAdsrState(next); emit({ adsr: next }) }
  const setView = (p) => { const next = { ...view, ...p }; setViewState(next); emit(next) }

  const fit = () => { const r = fitRange(expr, { sec: view.sec, ofs: view.ofs }); if (r) setView({ ...r, zoomY: 1, panY: 0 }) }
  const reset = () => setView(VIEW)
  /* a load replaces the expression and fits the scope to it — mirror's */
  const pick = (code) => {
    if (mode === 'equation') {
      setExpr(code)
      const r = fitRange(code, { sec: view.sec, ofs: view.ofs })
      if (r) setView({ ...r, zoomY: 1, panY: 0 })
      return
    }
    const params = ADSR_PRESETS.find((p) => p.id === code)?.params ?? parseAdsr(code)
    if (params) setAdsr(params)
  }
  const append = mode === 'equation' ? (code) => setExpr(`${expr}+${code}`) : undefined
  const save = onSave ? () => onSave({ mode, code: mode === 'equation' ? expr : adsrCode(adsr) }) : undefined

  return {
    mode, setMode, expr, setExpr, compiled, adsr, setAdsr, view, setView, fit, reset,
    cycle, setCycle, playing, setPlaying, bpm, setBpm, trigger, fire: () => setTrigger((n) => n + 1),
    heldSec, setHeldSec, save,
    /* spread into <SignalReference> — the current mode's data, whichever shape it takes. Key the
     * element on `mode` so its open tab resets when the data changes under it. */
    reference: {
      sections: mode === 'equation' ? EXPRESSION_SECTIONS : ADSR_SECTIONS,
      tabs: mode === 'equation' ? EXPRESSION_TABS : ADSR_TABS,
      saved: mode === 'equation' ? saved : savedAdsr,
      onPick: pick,
      onAppend: append,
    },
  }
}

/** The Equation | ADSR toggle, for a host that puts it in its own masthead. */
export function EnvelopeModeToggle({ generator, size = 'sm', className = '' }) {
  return <SegmentedToggle value={generator.mode} onChange={generator.setMode} options={MODES} size={size} ariaLabel="Mode" className={className} />
}

/* mirror's Eyebrow — the box's name above it. `bare` when the child draws its own box. */
function Box({ title, className = '', bodyClass = '', bare = false, children }) {
  return (
    <div className={`flex min-h-0 flex-col ${className}`}>
      <div className="kol-helper-12 flex h-6 shrink-0 items-start uppercase text-fg-48">{title}</div>
      {bare
        ? <div className="min-h-0 flex-1">{children}</div>
        : (
          <div className={`kol-helper-12 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[4px] border border-oq-08 bg-surface-secondary p-4 ${bodyClass}`}>
            {children}
          </div>
        )}
    </div>
  )
}

function Field({ label, value, onCommit, chars = 4 }) {
  return (
    <label className="flex items-center gap-2">
      <span className="uppercase text-fg-48">{label}</span>
      <Input size="sm" chars={chars} value={String(value)} onCommit={onCommit} />
    </label>
  )
}

function ZoomRow({ label, value, onChange }) {
  return (
    <Slider label={label} min={0.1} max={10} step={0.1} value={value} onChange={onChange} defaultValue={1} displayWidth={4} />
  )
}

/* the handles sit on SignalScope's grid: 12px inner padding, the level across the rest */
const PAD = 12
const top = (level) => `calc(${PAD}px + (100% - ${PAD * 2}px) * ${1 - level / 100})`

function EnvelopeHandles({ adsr, sec, onDragStart, onDrag, onDragEnd }) {
  const ref = useRef(null)
  const a = stageSeconds(adsr.attack)
  const d = stageSeconds(adsr.decay)
  const gate = gateSeconds(adsr)
  const r = stageSeconds(adsr.release)
  const pts = [
    { id: 'a', t: a, level: 100, label: 'A' },
    { id: 'd', t: a + d, level: adsr.sustain, label: 'D' },
    { id: 's', t: gate, level: adsr.sustain, label: 'S' },
    { id: 'r', t: gate + r, level: 0, label: 'R' },
  ]
  const drag = (id) => (e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    onDragStart()
    const move = (ev) => {
      const box = ref.current.getBoundingClientRect()
      const t = Math.max(0, ((ev.clientX - box.left) / box.width) * sec)
      const level = Math.max(0, Math.min(100, (1 - (ev.clientY - box.top - PAD) / (box.height - PAD * 2)) * 100))
      if (id === 'a') onDrag({ attack: knobFor(t) })
      else if (id === 'd') onDrag({ decay: knobFor(t - a) })
      else if (id === 's') onDrag({ hold: r2(Math.max(0, t - a - d)), sustain: level })
      else onDrag({ release: knobFor(t - gate) })
    }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); onDragEnd() }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {pts.map((pt) => (
        <button
          key={pt.id}
          type="button"
          aria-label={`Drag ${pt.label}`}
          onPointerDown={drag(pt.id)}
          className="pointer-events-auto absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-full"
          style={{ left: `${Math.min(1, pt.t / sec) * 100}%`, top: top(pt.level) }}
        >
          <span className="block h-2.5 w-2.5 rounded-full border border-oq-64 bg-surface-primary" />
          <span className="kol-helper-10 absolute -top-3 text-fg-48">{pt.label}</span>
        </button>
      ))}
    </div>
  )
}

/**
 * EnvelopeGenerator — A value over time. a value over time, typed as an equation or shaped as an ADSR envelope
 * (signal engine, 2026-09-27). One tool for what kol-mirror's /expressions page, kol-monitor's
 * Scope+ and Env modules and the design editor's Oscilloscope each built alone.
 *
 * MIRROR'S PAGE, CLASS FOR CLASS (app frame and curves, 2026-09-27): it fills its parent — the
 * OSCILLOSCOPE box takes every pixel the REFERENCE panel (320px) leaves, the scope takes every
 * pixel its controls leave. Each box is an eyebrow over `bg-surface-secondary border-oq-08
 * rounded-4`; the scope box is `kol-tone-sunken`, so its fields sit in mirror's dark wells. Collapse narrows the scope to 320px and the reference spreads into the rest as the
 * desk (every section at once) — mirror's Collapse.
 *
 * THE PARTS ARE THE HOST'S TO ARRANGE. `useEnvelopeGenerator()` holds the state; pass it as
 * `generator` and the host can put the mode toggle (`EnvelopeModeToggle`) and the reference
 * (`generator.reference`, spread into `SignalReference`) wherever its page wants them — a tool
 * frame's masthead, say. Without `generator` the component keeps its own and draws the toggle
 * itself.
 *
 * TIME is the scope's clock: `bpm` sets its speed (60 BPM = one unit a second, so `t` reads as
 * seconds at the default and as beats at any other). Play / pause stops it where it is.
 *
 * ADSR: four handles on the scope — A (attack time), D (decay time), S (at the end of the hold:
 * sideways = how long the gate holds, up/down = the sustain level), R (release time). The scope
 * draws one pass and never wraps; the window holds still while a handle drags and refits on
 * release. Cycle on loops the playhead; off, it runs once and Trigger fires it again.
 *
 * `onChange` reports every change as `{ mode, expr, adsr, min, max, sec, ofs }`.
 *
 * @param {object}  generator          state from `useEnvelopeGenerator()` (else it keeps its own)
 * @param {'panel'|'none'} reference   the reference panel beside the scope (default panel; `false` = none)
 *
 * It FILLS its parent's height — give it one (a tool frame's body, or a fixed-height box).
 * @param {'equation'|'adsr'} defaultMode
 * @param {string}  defaultExpr
 * @param {object}  defaultAdsr        knob values 0…100, `hold` in seconds (`ADSR_DEFAULTS`)
 * @param {Array}   saved · savedAdsr  the host's own rows for each mode's Saved tab
 * @param {Function} onSave            `({ mode, code }) => void` — shows a Save button; `code` is the
 *                                     expression, or the envelope as `a10 d30 s70 r50 h1`
 */
export default function EnvelopeGenerator({ generator, reference = 'panel', className = '', ...options }) {
  const own = useEnvelopeGenerator(options)
  const g = generator ?? own
  const [collapsed, setCollapsed] = useState(false)
  const { mode, adsr, view } = g

  const sample = mode === 'equation'
    ? (t) => g.compiled.fn(t, Math.round(t * 60), 0, 100)
    : (t) => envelopeAt(t, adsr)
  const sec = mode === 'equation' ? view.sec : (g.heldSec ?? adsrWindow(adsr))
  const passSec = mode === 'equation' ? sec : envelopeLength(adsr)
  const panel = reference === true || reference === 'panel'

  const transport = (
    <div className="flex h-6 shrink-0 items-center gap-3">
      <Button variant="ghost" size="sm" iconOnly={g.playing ? 'pause' : 'play'} aria-label={g.playing ? 'Pause' : 'Play'} onClick={() => g.setPlaying(!g.playing)} />
      <Field label="BPM" value={g.bpm} chars={3} onCommit={(v) => g.setBpm(Math.max(1, Math.min(999, num(v, g.bpm))))} />
      {mode === 'adsr' && (
        <>
          <Toggle value={g.cycle} onChange={g.setCycle} label="cycle" />
          <Button variant="ghost" size="sm" onClick={g.fire}>Trigger</Button>
        </>
      )}
      <span className="ml-auto text-fg-48">{mode === 'adsr' ? `${passSec.toFixed(2)} s` : ''}</span>
    </div>
  )

  return (
    <div className={`flex h-full min-h-0 flex-col gap-4 lg:flex-row ${className}`}>
      <Box
        title="Oscilloscope"
        className={collapsed && panel ? 'shrink-0 lg:w-[320px]' : 'min-w-0 flex-1'}
        bodyClass="kol-tone-sunken gap-2"
      >
        {!generator && <EnvelopeModeToggle generator={g} className="self-start" />}
        {mode === 'equation' && (
          <Input
            size="sm"
            value={g.expr}
            onCommit={(v) => g.setExpr(v || 'wave(t)')}
            aria-label="Expression"
            className={`shrink-0 ${g.compiled.ok ? '' : 'text-[var(--kol-ctl-led-red)]'}`}
          />
        )}
        <div className="relative min-h-[160px] flex-1">
          <SignalScope
            sample={sample}
            height="fill"
            min={mode === 'equation' ? view.min : 0}
            max={mode === 'equation' ? view.max : 100}
            sec={mode === 'equation' ? view.sec : sec}
            ofs={mode === 'equation' ? view.ofs : 0}
            zoomX={mode === 'equation' ? view.zoomX : 1}
            zoomY={mode === 'equation' ? view.zoomY : 1}
            panY={mode === 'equation' ? view.panY : 0}
            onPan={mode === 'equation' ? g.setView : undefined}
            playing={g.playing}
            rate={g.bpm / 60}
            loop={mode === 'equation' || g.cycle}
            trigger={g.trigger}
            className="absolute inset-0"
          />
          {mode === 'adsr' && (
            <EnvelopeHandles adsr={adsr} sec={sec}
              onDragStart={() => g.setHeldSec(adsrWindow(adsr))} onDrag={g.setAdsr} onDragEnd={() => g.setHeldSec(null)} />
          )}
        </div>
        <div className="flex min-h-6 shrink-0 flex-wrap items-center justify-between gap-x-2">
          {mode === 'equation' && <Button variant="ghost" size="sm" iconLeft="maximize" onClick={g.fit}>Fit</Button>}
          {panel && <Button variant="ghost" size="sm" iconLeft="columns" onClick={() => setCollapsed(!collapsed)} className="hidden lg:inline-flex">{collapsed ? 'Expand' : 'Collapse'}</Button>}
          {g.save && <Button variant="ghost" size="sm" iconLeft="save" onClick={g.save}>Save</Button>}
          <Button variant="ghost" size="sm" iconLeft="refresh" onClick={mode === 'equation' ? g.reset : () => g.setAdsr(ADSR_DEFAULTS)}>Reset</Button>
        </div>
        <Divider className="shrink-0 py-1" />
        {mode === 'equation' ? (
          <>
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <Field label="Min" value={view.min} onCommit={(v) => g.setView({ min: num(v, view.min) })} />
              <Field label="Max" value={view.max} onCommit={(v) => g.setView({ max: num(v, view.max) })} />
              <Field label="Sec" value={view.sec} onCommit={(v) => g.setView({ sec: Math.max(0.1, num(v, view.sec)) })} />
              <Field label="Ofs" value={r2(view.ofs)} onCommit={(v) => g.setView({ ofs: num(v, view.ofs) })} />
            </div>
            <div className="flex shrink-0 flex-col">
              <ZoomRow label="X" value={view.zoomX} onChange={(v) => g.setView({ zoomX: v })} />
              <ZoomRow label="Y" value={view.zoomY} onChange={(v) => g.setView({ zoomY: v })} />
              <ZoomRow label="Scale" value={r2((view.zoomX + view.zoomY) / 2)} onChange={(v) => g.setView({ zoomX: v, zoomY: v })} />
            </div>
          </>
        ) : (
          <div className="flex shrink-0 flex-wrap items-end justify-between gap-4">
            {[['attack', 'A'], ['decay', 'D'], ['sustain', 'S'], ['release', 'R']].map(([key, label]) => (
              <Knob key={key} value={adsr[key]} onChange={(v) => g.setAdsr({ [key]: v })} label={label} size="md" defaultValue={ADSR_DEFAULTS[key]} />
            ))}
            <Field label="Hold" value={r2(adsr.hold)} onCommit={(v) => g.setAdsr({ hold: Math.max(0, num(v, adsr.hold)) })} />
          </div>
        )}
        <Divider className="shrink-0 py-1" />
        {transport}
      </Box>
      {panel && (
        <Box
          title="Reference"
          className={`hidden lg:flex ${collapsed ? 'min-w-0 flex-1' : 'w-[320px] shrink-0'}`}
          bodyClass="overflow-y-auto"
          bare={!collapsed}
        >
          {collapsed
            ? <SignalReference key={mode} {...g.reference} variant="sheet" />
            : <SignalReference key={mode} {...g.reference} variant="panel" />}
        </Box>
      )}
    </div>
  )
}
