import { useEffect, useState } from 'react'
import { FunctionPlot } from '@kolkrabbi/kol-component'

export const stage = 'sm'
/* fxr's modulation plot: the bound expression over one loop, the cursor riding the loop phase */
export const variants = ['sine', 'steps']

const FN = {
  sine: (u) => Math.sin(u * Math.PI * 2),
  steps: (u) => Math.floor(u * 4) / 3,
}

export default function FunctionPlotPreview({ variant = 'sine' }) {
  const [u, setU] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (t) => { setU(((t - t0) / 4000) % 1); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="w-[220px]">
      <FunctionPlot fn={FN[variant] ?? FN.sine} cursor={u} height={64} />
    </div>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return <div className="w-[200px]"><FunctionPlot fn={FN.sine} cursor={0.3} /></div>
}
