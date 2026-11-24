import { useMemo } from 'react'
import { LabeledControl, LabeledControlSection, ToggleSwitch, logoInks } from '@kolkrabbi/kol-component'
import { systemHelp, systemSeeds, systemSpec, tunerAdvancedSpec, tunerDefaults, tunerPresets, tunerSpec } from '@kolkrabbi/kol-tuner'
import RailTweaks from '../../ui/RailTweaks.jsx'

/* THE TUNE PANELS (plan-2026-11-19-kolbox-whats-left R9): System and Tuner as his canvas has them, one to one: System is
 * the `system-01-arcs` board's panel with the 24 rolls of `system-02-seeds` to pick from; Tuner is `tuner-01-form`'s,
 * and its `advanced` switch swaps in `tuner-02-advanced`'s, every setting. The editor's Tune mode and apps/tuner both
 * draw these. */

const defaults = (spec) => Object.fromEntries(Object.entries(spec).map(([k, s]) => [k, s.default]))

/* System starts on its board's defaults; `over` holds what a handle dragged (the canvas's rule) */
export const SYSTEM_START = { ...defaults(systemSpec), over: null }

/* Tuner starts on tuner-01-form's defaults; of the advanced board's settings it takes the ones that draw or read the
 * form (Form, the guides' steps, Show, Color) and leaves the tuning ones unset, so the preset governs them until one is
 * moved: the engine's own rule, and what tuner-01-form draws (decided for review) */
const TUNING = ['Follow the form', 'Ladder', 'Curves', 'Corners']
export const TUNER_START = {
  ...Object.fromEntries(Object.entries(tunerAdvancedSpec).filter(([, s]) => !TUNING.includes(s.section)).map(([k, s]) => [k, s.default])),
  ...defaults(tunerSpec),
}
/* a tuning setting still unset shows what is drawn: the preset's value, else the engine's plain default */
const shownTuner = (v) => {
  const pre = tunerPresets[v.preset] ?? {}, out = { ...v }
  for (const [k, s] of Object.entries(tunerAdvancedSpec)) if (out[k] === undefined && TUNING.includes(s.section)) out[k] = pre[k] ?? tunerDefaults[k] ?? s.default
  return out
}

/* a moved measure gives back what a handle dragged for it */
export const systemWrite = (s, k, v) => {
  const over = s.over && { ...s.over }
  if (over) delete over[k]
  return { ...s, [k]: v, over: over && Object.keys(over).length ? over : null }
}

/* his board's note: the key for the form alone */
export const PeekHint = () => (
  <LabeledControlSection variant="kolbox">
    <p className="text-help text-muted" data-peek-hint>H switches to the mark alone and back.</p>
  </LabeledControlSection>
)

/* system-02-seeds: random 1 to 24, each a real render of the mark on its board's ground; a pick sets random */
let seeds = null
function SystemRolls({ values, onPick }) {
  const value = values.random, inks = logoInks(values) ?? logoInks({ palette: 'ink on paper' })
  const items = useMemo(() => (seeds ??= systemSeeds({ construction: false, math: false, fill: 'ink' })), [])
  return (
    <LabeledControlSection variant="kolbox" label="Systems, 24 rolls">
      <div className="grid grid-cols-2 gap-2" data-system-rolls>
        {items.map((it, i) => (
          <button key={it.label} type="button" aria-label={it.label} aria-pressed={value === i + 1} onClick={() => onPick(i + 1)}
            className="block overflow-hidden rounded-control outline-none hover:opacity-80 focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">
            <svg viewBox="0 0 1200 800" className="block h-auto w-full" style={{ background: inks.ground }} aria-hidden="true">
              <path d={it.d} transform="translate(600 400)" fill={inks.ink} />
            </svg>
          </button>
        ))}
      </div>
    </LabeledControlSection>
  )
}

export function SystemPanel({ values, onChange }) {
  return (
    <>
      <RailTweaks spec={systemSpec} values={values} onChange={onChange} help={systemHelp} />
      <SystemRolls values={values} onPick={(n) => onChange('random', n)} />
      <PeekHint />
    </>
  )
}

export function TunerPanel({ values, onChange, advanced, onAdvanced }) {
  return (
    <>
      <RailTweaks spec={advanced ? tunerAdvancedSpec : tunerSpec} values={advanced ? shownTuner(values) : values} onChange={onChange} />
      <LabeledControlSection variant="kolbox">
        <LabeledControl variant="kolbox" horizontal label="advanced">
          <span className="flex flex-1 justify-end"><ToggleSwitch variant="kolbox" aria-label="advanced" checked={!!advanced} onChange={onAdvanced} /></span>
        </LabeledControl>
      </LabeledControlSection>
      <PeekHint />
    </>
  )
}
