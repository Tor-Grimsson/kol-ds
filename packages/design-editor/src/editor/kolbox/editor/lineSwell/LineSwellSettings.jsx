import { useMemo, useState } from 'react'
import { Button, LabeledControl, LabeledControlSection, PopoverPanel } from '@kolkrabbi/kol-component'
import { formOf, presetsOf } from '../../../../generate/lineSwell/index.js'
import LineSwellPicture from './LineSwellPicture.jsx'
import { useBeside } from '../properties/parts.jsx'
import RailTweaks from '../../ui/RailTweaks.jsx'

/* A form's settings (plan-2026-11-19-kolbox-whats-left R8.2): the board's Tweaks panel (spec.json) drawn by the kit's
   one spec panel, ui/RailTweaks.jsx. What is Line Swell's alone stays here: the head's `preset`, the References page's
   marks for this form as pictures; `layerSource`, the selected layer offered as a `shape`; the controls' names in plain words.
   onChange(name, value); onValues(values) sets them all. `spec`, when given, is the declaration to draw in place of the
   form's (Labs: a loop board, or a form with its Motion section). The previous panel is in
   _tmp/2026-11-19-panel-merge/. */

/* each control's name in plain words (the spec keeps the boards' own keys); a key not listed reads as its words */
const LABELS = {
  random: 'Random set', randomSpread: 'Variation', source: 'Source', preset: 'Preset', variant: 'Variant', effect: 'Amount',
  shape: 'Shape', size: 'Size', depth: 'Depth', breakUp: 'Break up', pattern: 'Pattern', letter: 'Letter', letterFont: 'Font',
  letterWeight: 'Weight', letterStretch: 'Stretch', letterLean: 'Lean', letterX: 'Left right', letterY: 'Up down', contrast: 'Contrast',
  waveAmp: 'Height', waveLength: 'Length', waveSpeed: 'Speed', waveDir: 'Direction', waveFill: 'Fill', waveInvert: 'Invert',
  waveAmp2: 'Height', waveLength2: 'Length', waveSpeed2: 'Speed', waveDir2: 'Direction', waveOffset: 'Offset', waveFill2: 'Fill',
  waveInvert2: 'Invert', waveSync: 'Same speed', waveHarmonic: 'Speed ratio', waveCombine: 'Combine', waveBand: 'Band', waveTurn: 'Turn',
  levels: 'Steps', invert: 'Invert', density: 'Density', angle: 'Angle', thin: 'Thinnest', thick: 'Thickest', taper: 'Taper',
  dash: 'Dashes', length: 'Line length', overhang: 'Overhang', ends: 'Ends', solid: 'Solid', solidTurn: 'Solid turn', solidGap: 'Solid gap',
  keys: 'Keys', keysFrom: 'Keys from', transition: 'Transition', curve: 'Curve', shift: 'Shift', growFrom: 'Grow from',
  palette: 'Colors', ink: 'Ink', ground: 'Ground', thickPart: 'Thick part', count: 'Lines', weight: 'Line weight', bend: 'Bend',
  softness: 'Softness', swell: 'Swell', wave: 'Wave', wavelength: 'Wavelength', phase: 'Phase', mode: 'Draw', hole: 'Hole',
  spread: 'Angle spread', ratio: 'Spacing ratio', push: 'Push', poles: 'Poles', position: 'Position', strength: 'Strength',
  gather: 'Gather', release: 'Release', fan: 'Fan', path: 'Path', bands: 'Bands', amplitude: 'Height', stretch: 'Stretch',
  drift: 'Drift', stagger: 'Stagger', seed: 'Random set', unit: 'Piece', width: 'Width', twist: 'Twist', inner: 'Inner edge',
  outer: 'Outer edge', rings: 'Rings', gap: 'Gap', count2: 'Pieces', unit2: 'Piece', width2: 'Width', twist2: 'Twist',
  inner2: 'Inner edge', outer2: 'Outer edge', angle2: 'Angle', ring: 'Ring', ringRadius: 'Ring size', ringWeight: 'Ring weight',
  ringCount: 'Ring waves', ringDepth: 'Ring depth', ringColor: 'Ring color', well: 'Depth shape', radius: 'Radius', fade: 'Fade',
  frame: 'Frame', tilt: 'Tilt', turn: 'Turn', x: 'Left right', y: 'Up down',
}
const words = (k) => { const w = k.replace(/([a-z])([A-Z0-9])/g, '$1 $2').toLowerCase(); return w[0].toUpperCase() + w.slice(1) }
export const plainLabel = (name) => LABELS[name] ?? words(name)
const labelsOf = (spec) => Object.fromEntries((spec.sections ?? []).flatMap((s) => s.controls.map((c) => [c.name, plainLabel(c.name)])))

/* his longest names pass the grid's 76 */
const LABEL_W = 88
const same = (a, b) => Object.keys(a).every((k) => a[k] === b[k])

export default function LineSwellSettings({ form, spec: given, values, label, onChange, onValues, layerSource = false }) {
  const base = given ?? formOf(form)
  const spec = useMemo(() => (base && layerSource
    ? { ...base, sections: base.sections.map((s) => ({ ...s, controls: s.controls.map((c) => (c.name === 'shape' ? { ...c, options: ['layer', ...c.options] } : c)) })) }
    : base), [base, layerSource])
  const presets = presetsOf(form)
  const [presetRef, presetAnchor] = useBeside()
  const [picking, setPicking] = useState(false)
  if (!spec) return null
  const current = presets.find((p) => same(p.values, values))
  return (
    <div className="contents" data-line-swell-settings={form}>
      {(label || presets.length > 0) && (<LabeledControlSection variant="kolbox" label={label}>
        {presets.length > 0 && (
          <div ref={presetRef}>
            <LabeledControl variant="kolbox" horizontal labelWidth={LABEL_W} label="Preset" data-tweak="preset">
              <Button variant="kolbox" className="min-w-0 flex-1" aria-haspopup="dialog" aria-expanded={picking} onClick={() => setPicking((o) => !o)}>
                <span className="truncate">{current ? current.label : 'none'}</span>
              </Button>
            </LabeledControl>
          </div>
        )}
        {presets.length > 0 && (
          <PopoverPanel variant="kolbox" anchor={presetAnchor} open={picking} onClose={() => setPicking(false)} title="Preset" aria-label="Preset" className="max-h-120">
            <div className="grid grid-cols-2 gap-2 px-4 pb-4" data-line-swell-presets>
              {presets.map((p) => (
                <button key={p.id} type="button" data-preset={p.id} aria-pressed={p === current} onClick={() => { onValues(p.values); setPicking(false) }}
                  className={`flex flex-col gap-1 rounded-well p-1 text-left outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent ${p === current ? 'bg-accent-tint-soft' : 'hover:bg-field'}`}>
                  <LineSwellPicture form={form} values={p.values} />
                  <span className="line-clamp-2 px-1 text-help text-text">{p.label}</span>
                </button>
              ))}
            </div>
          </PopoverPanel>
        )}
      </LabeledControlSection>)}
      <RailTweaks spec={spec} values={values} onChange={onChange} labels={labelsOf(spec)} labelWidth={LABEL_W} />
    </div>
  )
}
