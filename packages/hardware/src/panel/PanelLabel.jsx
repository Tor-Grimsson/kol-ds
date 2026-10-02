import { LabeledControl } from '@kolkrabbi/kol-component'

/**
 * @deprecated 2026-10-01 — use `<LabeledControl variant="panel">` from kol-component. Drops when nobody imports it (04-retirements.md).
 * PanelLabel — A control with its panel label. the panel label is LabeledControl's panel variant now
 * (user ruling 2026-10-01). Same props; `horizontal` is `labelPosition="right"`.
 */
export default function PanelLabel({ horizontal = false, labelPosition = 'bottom', ...props }) {
  return <LabeledControl variant="panel" labelPosition={horizontal && labelPosition === 'bottom' ? 'right' : labelPosition} {...props} />
}
