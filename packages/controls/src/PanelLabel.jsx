/**
 * PanelLabel — wraps any control with the panel's text label (kol-monitor's
 * rack `LabeledControl`, lifted 2026-09-01; named `PanelLabel` because
 * `LabeledControl` is kol-component's settings-row control). Matches Knob /
 * Toggle: `kol-helper-8`, `text-fg-32`, uppercase.
 *
 * @param {string}   label
 * @param {boolean}  horizontal      shorthand for a row
 * @param {'top'|'bottom'|'left'|'right'} labelPosition  (default bottom)
 * @param {string}   labelClass      type class (default `kol-helper-8`)
 * @param {number}   gap
 * @param {ReactNode} children
 */
export default function PanelLabel({ label, horizontal = false, labelPosition = 'bottom', labelClass = 'kol-helper-8', gap = 0, children }) {
  const isRow = horizontal || labelPosition === 'left' || labelPosition === 'right'
  const labelEl = label && (
    <span className={`${labelClass} text-fg-32`} style={{ textTransform: 'uppercase', lineHeight: 1 }}>
      {label}
    </span>
  )
  return (
    <div style={{ display: 'inline-flex', flexDirection: isRow ? 'row' : 'column', alignItems: 'center', gap }}>
      {(labelPosition === 'top' || labelPosition === 'left') && labelEl}
      {children}
      {(labelPosition === 'bottom' || labelPosition === 'right') && labelEl}
    </div>
  )
}
