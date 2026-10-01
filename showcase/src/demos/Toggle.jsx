import { useState } from 'react'
import { Toggle } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
/* no panel behind it (2026-10-01 — user: "the component is not the component + its panel, that would be a module") */
const ROW = { display: 'flex', alignItems: 'center', gap: 16 }

/* The LED-dot toggle: latching, momentary (flashes and fires true), blinking,
 * horizontal with the label beside it, and a green dot through `color`. */
export const sizes = ['md', 'sm']

export default function ToggleDemo({ size = 'md' }) {
  const [on, setOn] = useState(true)
  const [fired, setFired] = useState(0)
  return (
    <div style={ROW}>
      <Toggle size={size} value={on} onChange={setOn} label="sync" />
      <Toggle size={size} value={false} onChange={() => setFired((n) => n + 1)} label={`trig ${fired}`} momentary />
      <Toggle size={size} value={on} onChange={setOn} label="clk" blink blinkPeriodMs={800} />
      <Toggle size={size} value={on} onChange={setOn} label="rec" horizontal />
      <Toggle size={size} value={on} onChange={setOn} label="ok" color="var(--kol-ctl-led-green)" />
    </div>
  )
}
