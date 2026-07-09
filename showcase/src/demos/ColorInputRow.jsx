import { useState } from 'react'
import { ColorInputRow } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* Pre-resolved palette entries — the KOL brand ramp anchors from
 * packages/framework/kol-brand-color.css. value === hex here (no ref-string
 * convention); the row emits entry.value on pick. */
const KOL_RAMP = [
  { value: '#FFCF33', label: 'Yellow 300', hex: '#FFCF33' },
  { value: '#AD5038', label: 'Red 200', hex: '#AD5038' },
  { value: '#222D3D', label: 'Blue 400', hex: '#222D3D' },
  { value: '#DF760B', label: 'Orange 300', hex: '#DF760B' },
  { value: '#49A0A2', label: 'Teal 300', hex: '#49A0A2' },
  { value: '#F5EBD8', label: 'Cream 300', hex: '#F5EBD8' },
]

export default function ColorInputRowDemo() {
  const [fill, setFill] = useState('#49A0A2')
  const [accent, setAccent] = useState('#FFCF33')
  const [slot, setSlot] = useState('#AD5038')
  const [locked, setLocked] = useState(true)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {/* Core row: swatch + # hex input, emits #UPPER per keystroke */}
      <ColorInputRow label="Fill" value={fill} onChange={setFill} />

      {/* Palette-refs mode: swatch opens a grid of pre-resolved KOL ramp entries */}
      <ColorInputRow label="Accent" value={accent} onChange={setAccent} refs={KOL_RAMP} />

      {/* Lock + token mode: 4-column grid, swatch is the lock toggle */}
      <ColorInputRow
        label="Primary"
        tokenName="--kol-color-red-200"
        value={slot}
        onChange={setSlot}
        locked={locked}
        onToggleLock={() => setLocked((l) => !l)}
      />

      {/* Unused slot: transparent swatch, muted label/token, dimmed input */}
      <ColorInputRow
        label="Tertiary"
        tokenName="--kol-color-slot-3"
        value={null}
        unused
        onToggleLock={() => {}}
      />
    </div>
  )
}
