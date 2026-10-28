import { useEffect, useRef, useState } from 'react'
import { Modulatable } from '@kolkrabbi/kol-hardware'
import { createTransport } from '@kolkrabbi/kol-hardware/signal'
import { Knob, Slider } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* any value control, patchable: click the readout and type `wave(t)` — it runs on the clock; right-click the knob for a
 * source on the bus (Expression A–D here), the red dot says it is patched. The app passes its bus and its clock. */
const clock = createTransport()
clock.play()

export default function ModulatablePreview() {
  const bus = useRef({ A: 0, B: 0, C: 0, D: 0 })
  /* the bus's values move on the same clock — an app's Expression module writes these */
  useEffect(() => {
    let raf
    const tick = () => { const t = clock.now(); bus.current.A = (Math.sin(t * 2) + 1) * 50; bus.current.B = (t * 25) % 100; raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const [gain, setGain] = useState(40)
  const [mix, setMix] = useState(60)
  return (
    <div className="flex items-end gap-10">
      <Modulatable label="Gain" value={gain} onChange={setGain} bus={bus} clock={clock}>
        <Knob variant="panel" size="lg" />
      </Modulatable>
      <Modulatable label="Mix" value={mix} onChange={setMix} bus={bus} clock={clock}>
        <Slider variant="panel" className="w-32" />
      </Modulatable>
    </div>
  )
}
