import { Icon } from '@kolkrabbi/kol-icons'
import JackSocket from './JackSocket.jsx'

/**
 * LabeledJack — a `JackSocket` with an 8px label or a dim icon beside it
 * (kol-monitor's rack, lifted 2026-09-01). Use instead of the socket's own
 * `label` when the label should sit left / right / above.
 *
 * @param {string}   label · {string} icon · {number} iconSize (8)
 * @param {'top'|'bottom'|'left'|'right'} labelPosition  (default bottom)
 * @param {boolean}  dim          the whole jack at 30%
 * @param {ElementType} iconComponent  icon renderer seam (default kol-icons `Icon`)
 * @param {ElementType} jackComponent  the jack to label (ControlsJackSeams, kol-monitor 2026-09-01):
 *                                     a consumer whose jack is WIRED — routing props computed from its
 *                                     own context — passes it here and keeps no copy of this layout;
 *                                     default the package's presentational `JackSocket`
 * @param {...*}     jackProps    everything else goes to the jack
 */
export default function LabeledJack({ label, icon, iconSize = 8, labelPosition = 'bottom', dim = false, iconComponent: IconCmp = Icon, jackComponent: Jack = JackSocket, ...jackProps }) {
  const labelEl = icon
    ? <IconCmp name={icon} size={iconSize} style={{ opacity: 0.35 }} />
    : label && (
      <span className="kol-helper-8 text-fg-32" style={{ textTransform: 'uppercase', lineHeight: 1 }}>
        {label}
      </span>
    )
  const isRow = labelPosition === 'left' || labelPosition === 'right'
  return (
    <div style={{ display: 'flex', flexDirection: isRow ? 'row' : 'column', alignItems: 'center', gap: 2, opacity: dim ? 0.3 : 1 }}>
      {(labelPosition === 'top' || labelPosition === 'left') && labelEl}
      <Jack {...jackProps} />
      {(labelPosition === 'bottom' || labelPosition === 'right') && labelEl}
    </div>
  )
}
