/**
 * @deprecated 2026-11-06 — alias of `<ButtonGroup layout="joined">` (plan-2026-11-06-buttons-page 2.7). Drops when nobody imports it (04-retirements.md).
 * SegmentedToggle — Old name for the joined ButtonGroup. Same props, same DOM: the implementation lives
 * in ButtonGroup's `joined` layout; this alias is kept so a consumer's next bump does not break.
 */
import ButtonGroup from './ButtonGroup.jsx'

let warned = false

export default function SegmentedToggle(props) {
  if (import.meta.env?.DEV && !warned) {
    warned = true
    console.warn('SegmentedToggle is deprecated — use <ButtonGroup layout="joined">')
  }
  return <ButtonGroup layout="joined" {...props} />
}
