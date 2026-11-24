import { useEffect, useMemo, useRef, useState } from 'react'
import { pack, useComposeState } from '../engine.js'
import WindowFrame from '../windows/WindowFrame.jsx'
import { plainLabel } from '../lineSwell/LineSwellSettings.jsx'
import { Button, ColorInputRow, ColorPickerPopover, Dropdown, Input, LabeledControl, Slider, ToggleSwitch } from '@kolkrabbi/kol-component'

/* THE MOTION FAMILY (plan-2026-11-19 C5.2, W23.0's Motion row): the generator's style contract carries no time, so the
   styles that move are Labs loops, and this window lists them through the engine's loop registry (`pack('generators')`):
   the Line Swell loops that move, Wave and Keys, and Swell on its wave source (its other presets are still and stay in
   Line effects). On the generator's frame: Style and Preset in the header, the loop's own sections as the steps, the
   section's rows, a preview that plays the loop, and the foot. Apply puts the chosen loop on the page as a loop layer
   with the window's settings, as the Tools › Generative rows do (MenuBar's addGenerative). */
const GROUP = 'lineswell'
/* the loops' params carry the boards' own keys as labels: each reads in plain words, as Line Swell's rail */
const named = (r) => ({ ...r, label: plainLabel(r.label) })
const fmt = (r) => r.format ?? ((v) => Number(v).toFixed(String(r.step ?? 1).split('.')[1]?.length ?? 0))

/* the moving presets: his Motion and Wave shapes boards (R8.4) */
function motionPresets(g) {
  return g.presetsInGroup(GROUP).filter((p) => g.loopById(p.loop)?.lineSwell?.kind === 'loop')
}
const defaultsOf = (def) => Object.fromEntries(def.params.map((r) => [r.key, r.default]))

function Control({ r, value, set }) {
  switch (r.type) {
    case 'range': return <Slider variant="kolbox" readout="input" aria-label={r.label} value={Number(value)} min={r.min} max={r.max} step={r.step} formatValue={fmt(r)} onChange={set} className="w-full" />
    case 'select': return <Dropdown variant="kolbox" ariaLabel={r.label} value={value} options={r.options} onChange={set} className="w-full" />
    case 'toggle': return <ToggleSwitch variant="kolbox" aria-label={r.label} checked={!!value} onChange={set} />
    case 'color': return <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label={r.label} value={value} onChange={set} />
    case 'text': return <Input variant="kolbox" aria-label={r.label} value={value ?? ''} onChange={(e) => set(e.target.value)} className="w-full" />
    default: return null
  }
}

/* the loop, playing: the engine's own draw at its own duration */
function LoopPreview({ def, params }) {
  const ref = useRef(null)
  const live = useRef(params)
  live.current = params
  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    let raf = 0
    const t0 = performance.now()
    const tick = (now) => {
      const u = (((now - t0) / 1000) / (def.duration || 3)) % 1
      try { def.draw(ctx, u, cv.width, cv.height, live.current) } catch { /* a half-typed value draws nothing this frame */ }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [def])
  return <canvas ref={ref} width={512} height={512} className="aspect-square w-full rounded-well bg-ground" data-preview-pad />
}

export default function MotionWindow({ onClose }) {
  const g = pack('generators')
  const { addLayer } = useComposeState()
  const presets = useMemo(() => (g ? motionPresets(g) : []), [g])
  const styles = useMemo(() => [...new Set(presets.map((p) => p.loop))].map((id) => ({ value: id, label: g.loopById(id).label })), [presets, g])
  const [presetId, setPresetId] = useState(presets[0]?.id)
  const preset = presets.find((p) => p.id === presetId) ?? presets[0]
  const def = preset && g.loopById(preset.loop)
  const fromPreset = (p) => ({ ...defaultsOf(g.loopById(p.loop)), ...g.presetParams(p) })
  const [params, setParams] = useState(() => (preset ? fromPreset(preset) : {}))
  const [edited, setEdited] = useState(false)
  const sections = useMemo(() => (def ? [...new Set(def.params.map((r) => r.section ?? 'Settings'))] : []), [def])
  const [step, setStep] = useState(sections[0])
  const current = sections.includes(step) ? step : sections[0]

  if (!def) return null
  const pick = (p) => { setPresetId(p.id); setParams(fromPreset(p)); setEdited(false) }
  const pickStyle = (loopId) => pick(presets.find((p) => p.loop === loopId))
  const set = (key) => (v) => { setParams((p) => ({ ...p, [key]: v })); setEdited(true) }
  const apply = () => {
    addLayer('loop', { ...g.presetLayerPatch(preset, GROUP), ...params })
    onClose()
  }
  const rows = def.params.filter((r) => (r.section ?? 'Settings') === current).map(named)
  const presetOptions = presets.filter((p) => p.loop === def.id).map((p) => ({ value: p.id, label: p.label }))

  return (
    <WindowFrame
      movable="motion"
      dock={['Motion']}
      onClose={onClose}
      title={def.label}
      kind="Motion"
      dataWindow="motion"
      steps={sections.map((s) => ({ key: s, label: s }))}
      step={current}
      onStep={setStep}
      actions={(
        <div className="mr-1 flex items-center gap-3">
          <LabeledControl variant="kolbox" horizontal labelWidth="auto" label="Style">
            <Dropdown variant="kolbox" ariaLabel="Style" data-control="Style" value={def.id} options={styles} onChange={pickStyle} className="w-35" />
          </LabeledControl>
          <LabeledControl variant="kolbox" horizontal labelWidth="auto" label="Preset">
            <Dropdown variant="kolbox" ariaLabel="Preset" data-control="Preset" value={edited ? 'custom' : preset.id} options={[...(edited ? [{ value: 'custom', label: 'Custom' }] : []), ...presetOptions]} onChange={(v) => v !== 'custom' && pick(presets.find((p) => p.id === v))} className="w-35" />
          </LabeledControl>
        </div>
      )}
      aside={(
        <div className="flex flex-col" data-preview-column>
          <header className="flex items-baseline justify-between pb-4">
            <h3 className="text-section text-text">Preview</h3>
            <span className="text-help text-muted">●  Live</span>
          </header>
          <LoopPreview def={def} params={params} />
          <div className="flex justify-between border-b border-border pt-3 pb-5">
            <span className="text-help text-muted">{def.duration || 3} s loop</span>
            <span className="font-mono text-meta text-muted">512 × 512 px</span>
          </div>
          {def.about && <p className="pt-6 text-help text-muted">{def.about}</p>}
        </div>
      )}
      footer={(
        <>
          <Button variant="kolbox" onClick={() => pick(preset)}>Reset</Button>
          <span className="flex-1" />
          <Button variant="kolbox" onClick={onClose}>Cancel</Button>
          <Button variant="kolbox" tone="primary" onClick={apply}>Apply</Button>
        </>
      )}
    >
      <section className="flex flex-col gap-4" data-group={current}>
        <h3 className="text-section text-text">{current}</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {rows.map((r) => (
            <div key={r.key} data-control={r.label}>
              {r.type === 'toggle'
                ? <LabeledControl variant="kolbox" horizontal labelWidth={160} label={r.label}><Control r={r} value={params[r.key]} set={set(r.key)} /></LabeledControl>
                : <LabeledControl variant="kolbox" label={r.label}><Control r={r} value={params[r.key]} set={set(r.key)} /></LabeledControl>}
            </div>
          ))}
        </div>
      </section>
    </WindowFrame>
  )
}

/* opened by `kol:open-motion-window` (the Effects menu's Generate › Motion, editor/Properties.jsx) */
export function MotionWindowHost() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setOpen(true)
    window.addEventListener('kol:open-motion-window', on)
    return () => window.removeEventListener('kol:open-motion-window', on)
  }, [])
  return open ? <MotionWindow onClose={() => setOpen(false)} /> : null
}
