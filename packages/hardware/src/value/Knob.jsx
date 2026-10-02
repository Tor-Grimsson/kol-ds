import { RotaryDial } from '@kolkrabbi/kol-component'

/**
 * @deprecated 2026-10-01 — use `<RotaryDial variant="panel">` from kol-component. Drops when nobody imports it (04-retirements.md).
 * Knob — A rotary knob. the rack knob is RotaryDial's panel variant now (user ruling 2026-10-01).
 * Same props, one renamed on the replacement: this `variant` (the label placement — `column · row ·
 * row-left · row-right`) is RotaryDial's `labelPlacement`.
 */
export default function Knob({ variant, size = 'sm', ...props }) {
  return <RotaryDial variant="panel" labelPlacement={variant} size={size} {...props} />
}
