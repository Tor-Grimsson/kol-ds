import { useState } from 'react'
import { DropdownStepper } from '@kolkrabbi/kol-component'

export const stage = 'sm'

const PRESETS = ['Flow obstacles', 'Streamlines', 'Curl noise', 'Vortex street']

/* kolbox's preset stepper (plan-2026-11-18-kolbox-system W31.2 batch 4): previous, the Dropdown, next */
export default function DropdownStepperPreview() {
  const [value, setValue] = useState(PRESETS[0])
  const step = (d) => setValue((v) => PRESETS[(PRESETS.indexOf(v) + d + PRESETS.length) % PRESETS.length])
  return (
    <div className="flex w-64 items-center gap-1">
      <DropdownStepper variant="kolbox" value={value} options={PRESETS} onChange={setValue} onStep={step} />
    </div>
  )
}
