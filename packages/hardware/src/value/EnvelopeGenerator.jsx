import { useMemo, useRef, useState } from 'react'
import { Button, Input, SegmentedToggle } from '@kolkrabbi/kol-component'
import Knob from './Knob.jsx'
import Toggle from '../switches/Toggle.jsx'
import SignalScope from '../indicators/SignalScope.jsx'
import SignalReference from '../panel/SignalReference.jsx'
import { compileExpression, fitRange } from '../signal/expression.js'
import { envelopeAt, envelopeLength, stageSeconds, ADSR_DEFAULTS } from '../signal/adsr.js'
import { EXPRESSION_SECTIONS, EXPRESSION_TABS, ADSR_SECTIONS, ADSR_TABS, ADSR_PRESETS } from '../signal/reference.js'

/**
 * EnvelopeGenerator — a value over time, typed as an equation or shaped as an ADSR envelope
 * (signal engine, 2026-09-27). One tool for what kol-mirror's /expressions page, kol-monitor's
 * Scope+ and Env modules and the design editor's Oscilloscope each built alone: the scope in the
 * middle, the window controls under it, the reference beside it — mirror's layout.
 *
 * Uncontrolled: `default*` seeds it, `onChange` reports every change as
 * `{ mode, expr, adsr, min, max, sec, ofs }` — hand it to a store, a module, a layer.
 *
 * @param {'equation'|'adsr'} defaultMode
 * @param {string}  defaultExpr
 * @param {object}  defaultAdsr        knob values 0…100 (`ADSR_DEFAULTS`)
 * @param {Array}   saved · savedAdsr  the host's own rows for each mode's Saved tab
 * @param {Function} onSave            `({ mode, code }) => void` — shows a Save button; `code` is the
 *                                     expression, or the envelope as `a10 d30 s70 r50` (pick loads it back)
 * @param {boolean} reference          show the reference panel (default true)
 *
 * In ADSR mode the envelope's three corners drag on the scope — attack peak (A), decay → sustain
 * (D and S), release end (R) — and the knobs follow; the window holds still while you drag.
 */
const MODES = [{ value: 'equation', label: 'Equation' }, { value: 'adsr', label: 'ADSR' }]
const num = (s, fallback) => { const n = parseFloat(s); return Number.isFinite(n) ? n : fallback }

/* an envelope as text and back — what the Saved rows carry */
export const adsrCode = (p) => `a${Math.round(p.attack)} d${Math.round(p.decay)} s${Math.round(p.sustain)} r${Math.round(p.release)}`
const parseAdsr = (code) => {
  const m = /^a(\d+) d(\d+) s(\d+) r(\d+)$/.exec(String(code))
  return m ? { attack: +m[1], decay: +m[2], sustain: +m[3], release: +m[4] } : null
}
/* seconds → the knob value that gives them (inverse of stageSeconds) */
const knobFor = (seconds) => Math.max(0, Math.min(100, ((seconds - 0.005) / 1.995) * 100))

const PAD = 12   // SignalScope's inner padding — the handles sit on its grid
const HEIGHT = 320

function EnvelopeHandles({ adsr, sec, onDragStart, onDrag, onDragEnd }) {
  const ref = useRef(null)
  const a = stageSeconds(adsr.attack)
  const d = stageSeconds(adsr.decay)
  const gate = a + d + 1
  const r = stageSeconds(adsr.release)
  const y = (level) => PAD + (HEIGHT - PAD * 2) * (1 - level / 100)
  const pts = [
    { id: 'a', x: a / sec, y: y(100), label: 'A' },
    { id: 'ds', x: (a + d) / sec, y: y(adsr.sustain), label: 'D · S' },
    { id: 'r', x: (gate + r) / sec, y: y(0), label: 'R' },
  ]
  const drag = (id) => (e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    onDragStart()
    const move = (ev) => {
      const box = ref.current.getBoundingClientRect()
      const t = Math.max(0, ((ev.clientX - box.left) / box.width) * sec)
      const level = Math.max(0, Math.min(100, (1 - (ev.clientY - box.top - PAD) / (HEIGHT - PAD * 2)) * 100))
      if (id === 'a') onDrag({ attack: knobFor(t) })
      else if (id === 'ds') onDrag({ decay: knobFor(t - a), sustain: level })
      else onDrag({ release: knobFor(t - gate) })
    }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); onDragEnd() }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  return (
    <div ref={ref} className="pointer-events-none absolute inset-x-0 top-0" style={{ height: HEIGHT }}>
      {pts.map((pt) => (
        <button
          key={pt.id}
          type="button"
          aria-label={`Drag ${pt.label}`}
          onPointerDown={drag(pt.id)}
          className="pointer-events-auto absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-full"
          style={{ left: `${Math.min(1, pt.x) * 100}%`, top: pt.y }}
        >
          <span className="block h-2.5 w-2.5 rounded-full border border-oq-64 bg-surface-primary" />
        </button>
      ))}
    </div>
  )
}

function Field({ label, value, onCommit }) {
  return (
    <label className="flex items-center gap-2">
      <span className="kol-helper-10 uppercase text-fg-48">{label}</span>
      <Input size="xs" chars={4} value={String(value)} onCommit={onCommit} />
    </label>
  )
}

export default function EnvelopeGenerator({
  defaultMode = 'equation', defaultExpr = 'wave(t)', defaultAdsr = ADSR_DEFAULTS,
  saved, savedAdsr, onSave, reference = true, onChange, className = '',
}) {
  const [mode, setMode] = useState(defaultMode)
  const [expr, setExpr] = useState(defaultExpr)
  const [adsr, setAdsr] = useState({ ...ADSR_DEFAULTS, ...defaultAdsr })
  const [cycle, setCycle] = useState(true)
  const [view, setView] = useState({ min: 0, max: 100, sec: 5, ofs: 0 })
  const [heldSec, setHeldSec] = useState(null)   // the ADSR window, frozen while a handle drags

  const compiled = useMemo(() => compileExpression(expr), [expr])
  const adsrSec = envelopeLength(adsr)
  const sample = mode === 'equation'
    ? (t) => compiled.fn(t, Math.round(t * 60), 0, 100)
    : (t) => envelopeAt(t, adsr, { cycle })
  const sec = mode === 'equation' ? view.sec : (heldSec ?? adsrSec)
  const ofs = mode === 'equation' ? view.ofs : 0

  const emit = (patch) => onChange?.({ mode, expr, adsr, ...view, ...patch })
  const change = {
    mode: (m) => { setMode(m); emit({ mode: m }) },
    expr: (e) => { setExpr(e); emit({ expr: e }) },
    adsr: (p) => { const next = { ...adsr, ...p }; setAdsr(next); emit({ adsr: next }) },
    view: (p) => { const next = { ...view, ...p }; setView(next); emit(next) },
  }
  const fit = () => { const r = fitRange(expr, { sec: view.sec, ofs: view.ofs }); if (r) change.view(r) }
  const reset = () => change.view({ min: 0, max: 100, sec: 5, ofs: 0 })
  const pick = (code) => {
    if (mode === 'equation') { change.expr(code); return }
    const params = ADSR_PRESETS.find((p) => p.id === code)?.params ?? parseAdsr(code)
    if (params) change.adsr(params)
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <SegmentedToggle value={mode} onChange={change.mode} options={MODES} size="sm" />
      <div className={`grid gap-6 ${reference ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : ''}`}>
        <div className="flex min-w-0 flex-col gap-3">
          {mode === 'equation' && (
            <Input
              value={expr}
              onCommit={(v) => change.expr(v || 'wave(t)')}
              aria-label="Expression"
              className={compiled.ok ? '' : 'text-[var(--kol-ctl-led-red)]'}
            />
          )}
          <div className="relative">
            <SignalScope sample={sample} min={mode === 'equation' ? view.min : 0} max={mode === 'equation' ? view.max : 100} sec={sec} ofs={ofs} height={HEIGHT} />
            {mode === 'adsr' && (
              <EnvelopeHandles adsr={adsr} sec={sec}
                onDragStart={() => setHeldSec(adsrSec)} onDrag={change.adsr} onDragEnd={() => setHeldSec(null)} />
            )}
          </div>
          {mode === 'equation' ? (
            <>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" iconLeft="maximize" onClick={fit}>Fit</Button>
                {onSave && <Button variant="ghost" size="sm" iconLeft="save" onClick={() => onSave({ mode, code: expr })}>Save</Button>}
                <Button variant="ghost" size="sm" iconLeft="refresh" onClick={reset}>Reset</Button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Field label="Min" value={view.min} onCommit={(v) => change.view({ min: num(v, view.min) })} />
                <Field label="Max" value={view.max} onCommit={(v) => change.view({ max: num(v, view.max) })} />
                <Field label="Sec" value={view.sec} onCommit={(v) => change.view({ sec: Math.max(0.1, num(v, view.sec)) })} />
                <Field label="Ofs" value={view.ofs} onCommit={(v) => change.view({ ofs: num(v, view.ofs) })} />
              </div>
            </>
          ) : (
            <div className="flex flex-wrap items-end justify-center gap-6 py-2">
              {[['attack', 'A'], ['decay', 'D'], ['sustain', 'S'], ['release', 'R']].map(([key, label]) => (
                <Knob key={key} value={adsr[key]} onChange={(v) => change.adsr({ [key]: v })} label={label} size="lg" defaultValue={ADSR_DEFAULTS[key]} />
              ))}
              <Toggle value={cycle} onChange={setCycle} label="cycle" />
              <span className="kol-helper-10 text-fg-48">{adsrSec.toFixed(2)} s</span>
              {onSave && <Button variant="ghost" size="sm" iconLeft="save" onClick={() => onSave({ mode, code: adsrCode(adsr) })}>Save</Button>}
            </div>
          )}
        </div>
        {reference && (
          <SignalReference
            className="rounded-[4px] border border-oq-08 p-4"
            sections={mode === 'equation' ? EXPRESSION_SECTIONS : ADSR_SECTIONS}
            tabs={mode === 'equation' ? EXPRESSION_TABS : ADSR_TABS}
            saved={mode === 'equation' ? saved : savedAdsr}
            onPick={pick}
            onAppend={mode === 'equation' ? (code) => change.expr(`${expr}+${code}`) : undefined}
            key={mode}
          />
        )}
      </div>
    </div>
  )
}
