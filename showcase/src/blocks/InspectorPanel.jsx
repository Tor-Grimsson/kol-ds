import { useState } from 'react'
import {
  Section, LabeledControl, Slider, PropertyInput, SegmentedToggle, ColorSwatch, Divider,
} from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Inspector panel',
  description: 'The KOL moat in one block — numeric properties, sliders, swatches, and mode toggles composed as an editor inspector.',
}
export const stage = 'sm'

export default function InspectorPanel() {
  const [x, setX] = useState(707)
  const [y, setY] = useState(499)
  const [opacity, setOpacity] = useState(64)
  const [blend, setBlend] = useState('normal')

  return (
    <div className="flex flex-col gap-5 rounded-[var(--kol-radius-md)] border border-fg-12 bg-surface-primary p-4">
      <Section label="Position">
        <div className="grid grid-cols-2 gap-3">
          <PropertyInput label="X" type="number" value={x} onChange={(e) => setX(Number(e.target.value))} step={1} />
          <PropertyInput label="Y" type="number" value={y} onChange={(e) => setY(Number(e.target.value))} step={1} />
        </div>
      </Section>
      <Divider />
      <Section label="Appearance">
        <LabeledControl label={`Opacity · ${opacity}%`}>
          <Slider min={0} max={100} value={opacity} onChange={setOpacity} variant="minimal" />
        </LabeledControl>
        <SegmentedToggle
          value={blend}
          onChange={setBlend}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'multiply', label: 'Multiply' },
            { value: 'screen', label: 'Screen' },
          ]}
        />
      </Section>
      <Divider />
      <Section label="Fill">
        <div className="flex items-center gap-2">
          {['#0E0E11', '#AD5038', '#3b82f6', '#22c55e', '#FAFAFA'].map((hex) => (
            <ColorSwatch key={hex} hex={hex} selected={hex === '#AD5038'} />
          ))}
        </div>
      </Section>
    </div>
  )
}
