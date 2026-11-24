import { useEffect, useState } from 'react'
import { drawForm, sourceOf } from '../../../../generate/lineSwell/index.js'
import { letterRings } from '../../../generate/rings.js'

/* A form drawn by the board engine at its values on a 1200 by 800 board: the picker's tiles and the preset grid. Every
   tile is drawn the same way, whatever colors its board declares: the text ink on the one tile ground (the field).
   Drawn after the first paint, one at a time, and kept per values. */
const done = new Map()
let queue = Promise.resolve()
function picture(form, values) {
  const key = JSON.stringify([form, values])
  if (done.has(key)) return Promise.resolve(done.get(key))
  queue = queue.then(async () => {
    if (done.has(key)) return
    const src = sourceOf(form, values)
    const rings = src.kind === 'letter' ? await letterRings(src.char, 'inter', src.weight).catch(() => null) : null
    await new Promise((r) => setTimeout(r))
    const v = drawForm(form, values, rings ? { rings } : {})
    done.set(key, { d: [v.d, v.d2, v.dh, v.d3].filter(Boolean).join(''), rot: v.rot })
  })
  return queue.then(() => done.get(key))
}

export default function LineSwellPicture({ form, values, className = '' }) {
  const [v, setV] = useState(() => done.get(JSON.stringify([form, values])) ?? null)
  useEffect(() => {
    let live = true
    picture(form, values).then((p) => { if (live) setV(p) })
    return () => { live = false }
  }, [form, values])
  return (
    <svg viewBox="0 0 1200 800" aria-hidden className={`block w-full rounded-control bg-field text-text ${className}`}>
      {v && <g transform={v.rot}><path d={v.d} fill="currentColor" /></g>}
    </svg>
  )
}
