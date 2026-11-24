import { useState } from 'react'
import { ColorInputRow, ColorPickerPopover, Dropdown, Input, LabeledControl, LabeledControlSection, Slider, SwatchGrid, TabsRow, ToggleSwitch } from '@kolkrabbi/kol-component'

/* A board's Tweaks panel drawn in kolbox's kit (plan-2026-11-19-kolbox-whats-left R9, R8.2): the one spec-drawing panel
 * (the Tune panels, apps/tuner, and Line Swell through lineSwell/LineSwellSettings.jsx). `spec` is either a board's
 * `data-props` (kol-tuner's specs.js: { key: { section, editor, ... } }) or a sections list (Line Swell's spec.json:
 * { sections: [{ title, controls: [{ name, editor, ... }] }] }). One section per section title, one row per control,
 * the control's own name as its label, in the inspector's 76 label column (see `labelWidth`):
 *   range: the number box and the slider; int and text: a field; boolean: the switch at the row's end;
 *   enum: a two-way toggle for two options, a dropdown for more; color: the color row, with its swatches when the spec
 *   lists them, else the picker.
 * `values[key]` is shown, else the spec's default; `onChange(key, value)` writes. `help[key]` is a line under the row.
 * `labelWidth` widens the label column for a spec whose names pass 76 (Line Swell's waveHarmonic is 84 at the row's 12
 * px): the controls then start 12 right of the grid's second column, the price of not cutting his names.
 * `labels[key]`, when given, is the row's label in place of the key.
 * `keys` limits the rows (a section with none left is not drawn). Each row carries `data-tweak` (its key) inside its
 * section's `data-rail-section`, so a script can lay the panel beside the spec. */
const two = (o) => o.map((v) => ({ value: String(v), label: String(v) }))
const clamp = (n, s) => Math.min(s.max ?? Infinity, Math.max(s.min ?? -Infinity, n))

const sectionsOf = (spec, keys) => {
  const rows = spec.sections
    ? spec.sections.flatMap((s) => s.controls.map((c) => [c.name, { ...c, section: s.title }]))
    : Object.entries(spec).filter(([k]) => !k.startsWith('$'))
  const out = []
  for (const [key, s] of rows) {
    if (keys && !keys.includes(key)) continue
    const last = out[out.length - 1]
    if (last && last.title === s.section) last.rows.push([key, s])
    else out.push({ title: s.section, rows: [[key, s]] })
  }
  return out
}

/* a field that commits on Enter or blur (kolbox's Input has no draft of its own); Escape puts the value back */
function Field({ name, value, onCommit, unit, describedBy, numeric = false }) {
  const [draft, setDraft] = useState(null)
  return (
    <Input variant="kolbox" className="min-w-0 flex-1" aria-label={name} aria-describedby={describedBy} inputMode={numeric ? 'numeric' : undefined} suffix={unit}
      value={draft ?? String(value ?? '')}
      onFocus={() => setDraft(String(value ?? ''))} onChange={(e) => setDraft(e.target.value)}
      onBlur={() => { if (draft != null && draft !== String(value ?? '')) onCommit(draft.trim()); setDraft(null) }}
      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') { setDraft(String(value ?? '')); requestAnimationFrame(() => e.target.blur()) } }} />
  )
}

function ColorRow({ name, s, value, onChange }) {
  const [open, setOpen] = useState(false)
  if (!s.options?.length) return <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label={name} value={value} onChange={onChange} />
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <ColorInputRow variant="kolbox" label={name} value={value} opacity={null} clearable={s.name === 'ground'} onChange={onChange} onSwatch={() => setOpen((o) => !o)} lit={open} />
      {open && <SwatchGrid colors={s.options} value={value} onChange={(v) => { onChange(v); setOpen(false) }} />}
    </div>
  )
}

function Control({ name, s, value, onChange, describedBy }) {
  if (s.editor === 'range') {
    const dec = s.step && s.step < 1 ? (String(s.step).split('.')[1]?.length ?? 2) : 0
    return <Slider variant="kolbox" readout="input" className="min-w-0 flex-1" aria-label={name} value={Number(value)} min={s.min} max={s.max} step={s.step ?? 1}
      formatValue={(v) => `${dec ? Number(v).toFixed(dec) : v}${s.unit ?? ''}`} onChange={(v) => onChange(v)} />
  }
  if (s.editor === 'int') {
    return <Field numeric name={name} value={value} unit={s.unit} describedBy={describedBy}
      onCommit={(t) => { const n = Math.round(Number(t)); if (t !== '' && Number.isFinite(n)) onChange(clamp(n, s)) }} />
  }
  if (s.editor === 'text') return <Field name={name} value={value} describedBy={describedBy} onCommit={(t) => onChange(t)} />
  if (s.editor === 'boolean') {
    const on = value === true || value === 'true'
    return <span className="flex flex-1 justify-end"><ToggleSwitch variant="kolbox" aria-label={name} checked={on} onChange={(v) => onChange(v)} /></span>
  }
  if (s.editor === 'enum' && s.options?.length === 2) return <TabsRow variant="kolbox" className="w-full" tabs={two(s.options)} value={String(value)} onChange={(v) => onChange(v)} />
  if (s.editor === 'enum') return <Dropdown variant="kolbox" ariaLabel={name} className="min-w-0 flex-1" value={String(value)} options={two(s.options ?? [])} onChange={(v) => onChange(v)} />
  if (s.editor === 'color') return <ColorRow name={name} s={s} value={value} onChange={onChange} />
  return null
}

export default function RailTweaks({ spec, values = {}, onChange, help = {}, keys = null, labelWidth, labels = {} }) {
  return sectionsOf(spec, keys).map(({ title, rows }) => (
    <LabeledControlSection key={title} variant="kolbox" label={title}>
      {rows.map(([key, s]) => {
        const helpId = help[key] ? `tweak-help-${key}` : undefined
        return [
          <LabeledControl key={key} variant="kolbox" horizontal labelWidth={labelWidth} label={labels[key] ?? key} data-tweak={key}>
            <Control name={labels[key] ?? key} s={s} value={values[key] ?? s.default} onChange={(v) => onChange(key, v)} describedBy={helpId} />
          </LabeledControl>,
          help[key] && <p key={`${key}-help`} id={helpId} className="text-help text-muted">{help[key]}</p>,
        ]
      })}
    </LabeledControlSection>
  ))
}
