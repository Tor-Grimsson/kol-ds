import { useState } from 'react'
import { LabeledControl, Slider, Input, ToggleSwitch } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* `panel` is the hardware panel label (was kol-hardware `PanelLabel`): helper-8, uppercase,
 * hugging the control, in four positions. */
export const variants = ['default', 'panel', 'float', 'kolbox', 'folio']

export default function LabeledControlPreview({ variant = 'default' }) {
  const [n, setN] = useState(8)
  const [hex, setHex] = useState('AD5038')
  const [email, setEmail] = useState('alex@studio.design')
  /* float (float-everything W3 row 37): the float hint over a capsule */
  if (variant === 'float') {
    return (
      <LabeledControl variant="float" label="Email" className="w-80">
        <Input variant="float" type="email" value={email} onChange={(e) => setEmail(e.target.value)} width="100%" />
      </LabeledControl>
    )
  }
  /* kolbox (W31.2): the 76 label column, a stacked row, the 160 column of a window */
  if (variant === 'kolbox') {
    return (
      <div className="flex w-52 flex-col gap-2">
        <LabeledControl variant="kolbox" horizontal label="Invert"><ToggleSwitch variant="kolbox" checked={n > 8} onChange={(v) => setN(v ? 16 : 8)} aria-label="Invert" /></LabeledControl>
        <LabeledControl variant="kolbox" label="Email"><Input value={email} onChange={(e) => setEmail(e.target.value)} width="100%" /></LabeledControl>
      </div>
    )
  }
  /* folio (Folio batch C): Folio's Setting, the 48 column and the stacked label */
  if (variant === 'folio') {
    return (
      <div className="flex w-64 flex-col gap-4">
        <LabeledControl variant="folio" horizontal label="Name"><Input value={email} onChange={(e) => setEmail(e.target.value)} width="100%" /></LabeledControl>
        <LabeledControl variant="folio" label="Columns"><Slider min={1} max={32} value={n} onChange={setN} /></LabeledControl>
      </div>
    )
  }
  if (variant === 'panel') {
    const dot = <span className="block size-2 rounded-full bg-fg-64" />
    return (
      <div className="flex items-center gap-4">
        {['top', 'bottom', 'left', 'right'].map((pos) => (
          <LabeledControl key={pos} variant="panel" label={pos} labelPosition={pos} gap={4}>{dot}</LabeledControl>
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-6 max-w-md">
      <LabeledControl label={`COLUMNS · ${n}`}>
        <Slider min={1} max={32} value={n} onChange={setN} />
      </LabeledControl>
      <LabeledControl label="HEX" hint="6-char">
        <Input prefix="#" value={hex} onChange={(e) => setHex(e.target.value)} chars={6} />
      </LabeledControl>
    </div>
  )
}
