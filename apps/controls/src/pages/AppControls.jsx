import { useState } from 'react'
import {
  Button, SegmentedToggle, ToggleSwitch, ToggleCheckbox, Slider, Stepper, Dropdown, Input, RotaryDial, XYPad,
  LabeledControl, InspectorSection, LabeledControlSection, SettingsRow, SettingsSwitch,
} from '@kolkrabbi/kol-component'
import Specimen from '../Specimen.jsx'

/* The app rung — kol-component's controls and the section panels they sit in. The panel
 * formats are the standard the labs params rail, the deck inspector and Hub settings share. */

const SORT = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'az', label: 'A → Z' },
]
const VIEWS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'feed', label: 'Feed' },
]

export default function AppControls() {
  const [v, setV] = useState(40)
  const [inV, setInV] = useState(20)
  const [outV, setOutV] = useState(80)
  const [n, setN] = useState(2)
  const [wave, setWave] = useState('tri')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const [on, setOn] = useState(true)
  const [hex, setHex] = useState('AD5038')
  const [dial, setDial] = useState(65)
  const [xy, setXy] = useState({ x: 100, y: 500 })

  return (
    <div className="mt-8">
      <Specimen title="Button" ships="kol-component · Button">
        {['primary', 'grey', 'outline', 'ghost'].map((tone) => (
          <Button key={tone} tone={tone} size="sm">{tone}</Button>
        ))}
        {['nav', 'danger'].map((variant) => (
          <Button key={variant} variant={variant} size="sm">{variant}</Button>
        ))}
        <Button tone="grey" size="sm" iconLeft="play">With icon</Button>
      </Specimen>

      <Specimen title="SegmentedToggle" ships="kol-component · SegmentedToggle">
        <SegmentedToggle value={view} onChange={setView} options={VIEWS} size="sm" />
        <SegmentedToggle variant="filled" value={view} onChange={setView} options={VIEWS} size="sm" />
        <SegmentedToggle variant="tonal" value={view} onChange={setView} options={VIEWS} size="sm" />
      </Specimen>

      <Specimen title="Switch · Checkbox" ships="kol-component · ToggleSwitch · ToggleCheckbox">
        <ToggleSwitch label="Bare" checked={on} onChange={setOn} />
        <ToggleSwitch label="Primary" checked={on} onChange={setOn} variant="primary" />
        <ToggleSwitch label="Outline" checked={on} onChange={setOn} variant="outline" />
        <ToggleCheckbox label="ACCEPT" checked={on} onChange={setOn} />
      </Specimen>

      <Specimen title="Slider" ships="kol-component · Slider">
        <div className="flex w-full max-w-md flex-col gap-4">
          <Slider label="Opacity" min={0} max={100} value={v} onChange={setV} />
          <Slider label="Gain" min={0} max={100} value={v} onChange={setV} readout="value" defaultValue={50} formatValue={(x) => `${Math.round(x)}%`} />
          <Slider label="Trim" variant="dual" min={0} max={100} value={inV} onChange={setInV} value2={outV} onChange2={setOutV} />
        </div>
      </Specimen>

      <Specimen title="Stepper · Dropdown · Input" ships="kol-component · Stepper · Dropdown · Input">
        <Stepper value={n} onChange={(e) => setN(e.target.value)} min={0} max={10} size="sm" />
        <Stepper value={wave} onChange={(e) => setWave(e.target.value)} options={['sine', 'tri', 'saw', 'sqr']} size="sm" />
        <Stepper value={wave} onChange={(e) => setWave(e.target.value)} options={['sine', 'tri', 'saw', 'sqr']} size="sm" layout="inline" />
        {['primary', 'grey', 'outline'].map((variant) => (
          <Dropdown key={variant} value={sort} onChange={setSort} variant={variant} size="sm" options={SORT} />
        ))}
        <Input prefix="#" value={hex} onChange={(e) => setHex(e.target.value)} chars={6} />
      </Specimen>

      <Specimen title="RotaryDial · XYPad" ships="kol-component · RotaryDial · XYPad"
        handBuilt={['kol-mirror — its own RotaryDial: compact, dense/master variants, modulation assign (hall-of-mirrors/RotaryDial.jsx)']}>
        <RotaryDial value={dial} onChange={setDial} />
        <RotaryDial label="Drive" value={dial} onChange={setDial} step={5} size={64} />
        <RotaryDial label="INT" value={dial} onChange={setDial} size={36} />
        <div className="w-56">
          <XYPad xValue={xy.x} yValue={xy.y} xMin={50} xMax={200} yMin={100} yMax={900} xLabel="Width" yLabel="Weight"
            onChange={(x, y) => setXy({ x: Math.round(x), y: Math.round(y) })} />
        </div>
      </Specimen>

      <Specimen title="LabeledControl" ships="kol-component · LabeledControl — the most-consumed control wrapper">
        <div className="grid w-full max-w-lg grid-cols-2 gap-6">
          <LabeledControl label={`COLUMNS · ${n}`}><Slider min={1} max={32} value={n} onChange={setN} /></LabeledControl>
          <LabeledControl label="HEX" hint="6-char"><Input prefix="#" value={hex} onChange={(e) => setHex(e.target.value)} chars={6} /></LabeledControl>
          <LabeledControl inline label="Sort"><Dropdown value={sort} onChange={setSort} variant="grey" size="sm" options={SORT} /></LabeledControl>
          <LabeledControl inline label="Wave"><Stepper value={wave} onChange={(e) => setWave(e.target.value)} options={['sine', 'tri', 'saw', 'sqr']} size="xs" /></LabeledControl>
        </div>
      </Specimen>

      <Specimen title="Panel formats" ships="kol-component · InspectorSection · LabeledControlSection · SettingsRow">
        <div className="flex w-64 flex-col gap-4 rounded-[var(--kol-radius-sm)] bg-surface-primary p-4">
          <InspectorSection label="ASPECT" divided>
            <SegmentedToggle value={view} onChange={setView} options={VIEWS} size="xs" />
          </InspectorSection>
          <InspectorSection label="FILL" divided>
            <Slider label="Opacity" min={0} max={100} value={v} onChange={setV} />
          </InspectorSection>
        </div>
        <div className="flex w-80 flex-col gap-6 rounded-[var(--kol-radius-sm)] bg-surface-primary p-4">
          <LabeledControlSection label="Motion">
            <LabeledControl label={`SPEED · ${v}`}><Slider min={0} max={100} value={v} onChange={setV} /></LabeledControl>
            <LabeledControl label="WAVE"><Stepper value={wave} onChange={(e) => setWave(e.target.value)} options={['sine', 'tri', 'saw', 'sqr']} size="xs" layout="inline" /></LabeledControl>
          </LabeledControlSection>
          <LabeledControlSection label="Display" divided rowGap={1}>
            <SettingsRow label="Autoplay"><SettingsSwitch on={on} onChange={setOn} /></SettingsRow>
            <SettingsRow label="Sort" align="fill"><Dropdown value={sort} onChange={setSort} variant="grey" size="sm" options={SORT} /></SettingsRow>
          </LabeledControlSection>
        </div>
      </Specimen>
    </div>
  )
}
