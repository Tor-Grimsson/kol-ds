import { useState } from 'react'
import { Toggle } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* The LED-dot toggle: latching, momentary (flashes and fires true), blinking,
 * horizontal with the label beside it, and a green dot through `color`. */
export const sizes = ['md', 'sm']

export default function ToggleDemo({ size = 'md' }) {
  const [on, setOn] = useState(true)
  const [fired, setFired] = useState(0)
  return (
    <div style={PLATE}>
      <Toggle size={size} value={on} onChange={setOn} label="sync" />
      <Toggle size={size} value={false} onChange={() => setFired((n) => n + 1)} label={`trig ${fired}`} momentary />
      <Toggle size={size} value={on} onChange={setOn} label="clk" blink blinkPeriodMs={800} />
      <Toggle size={size} value={on} onChange={setOn} label="rec" horizontal />
      <Toggle size={size} value={on} onChange={setOn} label="ok" color="var(--kol-ctl-led-green)" />
    </div>
  )
}
