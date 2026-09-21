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

/* Palette REFS — the values a consumer's own store holds. They carry no `hex`
 * on purpose: this is the shape the resolver seam exists for. */
const PALETTE_REFS = [
  { value: 'palette:primary',   label: 'Primary' },
  { value: 'palette:secondary', label: 'Secondary' },
  { value: 'palette:light',     label: 'Light' },
  { value: 'palette:dark',      label: 'Dark' },
  { value: 'palette:accent',    label: 'Accent' },
  { value: 'palette:bg',        label: 'Background' },
]

/* The app's own resolution — a lookup here, a store read in a real editor. */
const PALETTE = {
  'palette:primary':   '#222D3D',
  'palette:secondary': '#49A0A2',
  'palette:light':     '#F5EBD8',
  'palette:dark':      '#131316',
  'palette:accent':    '#FFCF33',
  'palette:bg':        '#FCFBFB',
}
const resolveRef = (value) => PALETTE[value] ?? null

export default function ColorInputRowDemo() {
  const [fill, setFill] = useState('#49A0A2')
  const [ref, setRef] = useState('palette:accent')
  const [accent, setAccent] = useState('#FFCF33')
  const [slot, setSlot] = useState('#AD5038')
  const [locked, setLocked] = useState(true)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {/* Core row: swatch + # hex input, emits #UPPER per keystroke */}
      <ColorInputRow label="Fill" value={fill} onChange={setFill} />

      {/* Palette-refs mode: swatch opens a grid of pre-resolved KOL ramp entries */}
      <ColorInputRow label="Accent" value={accent} onChange={setAccent} refs={KOL_RAMP} />

      {/* THE RESOLVER SEAM + the quick states (editor-set-is-behind-its-source,
        * 2026-09-03). The value here is a `palette:` REF, not a hex — the row
        * never sees a colour, it asks `resolveRef` for one, so an app keeps its
        * own palette and this stays a composition. The popover's Theme button
        * sets `autoValue`, a `var(--kol-*)` token that flips with light/dark:
        * the swatch paints it LIVE and the field shows `auto` rather than a
        * frozen literal. None clears to null. */}
      <ColorInputRow
        label="Stroke"
        value={ref}
        onChange={setRef}
        refs={PALETTE_REFS}
        resolveRef={resolveRef}
        autoValue="var(--kol-fg-96)"
        transparentTone="error"
      />

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
