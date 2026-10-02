import { Slider } from '@kolkrabbi/kol-component'

/**
 * @deprecated 2026-10-01 — use `<Slider variant="panel">` from kol-component. Drops when nobody imports it (04-retirements.md).
 * Fader — A panel slider. the rack slider is Slider's panel variant now (user ruling 2026-10-01: one
 * slider, not two that look alike). Same props: `value · onChange · min · max · step · label ·
 * direction · height · onHold`.
 */
export default function Fader(props) {
  return <Slider variant="panel" {...props} />
}
