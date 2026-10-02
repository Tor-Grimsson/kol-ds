import { Knob as KolKnob } from '@kolkrabbi/kol-component'

/**
 * @deprecated 2026-10-01 — use `<Knob variant="panel">` from kol-component. Drops when nobody imports it (04-retirements.md).
 * Knob — A rotary knob. there is one Knob and it is kol-component's (user rulings 2026-10-01 · 02);
 * this is its panel variant under the import path the racks already use. One prop is renamed on the
 * replacement: this `variant` (the label placement — `column · row · row-left · row-right`) is
 * `labelPlacement` there.
 */
export default function Knob({ variant, size = 'sm', ...props }) {
  return <KolKnob variant="panel" labelPlacement={variant} size={size} {...props} />
}
