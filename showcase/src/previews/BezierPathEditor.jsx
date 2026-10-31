import { useState } from 'react'
import { BezierPathEditor } from '@kolkrabbi/kol-component'

export const stage = 'sm'
export const sizes = ['sm', 'xs', 'md']
/* `open`: fxr's band edge profile (a 2:1 strip) · `closed`: a kinetic layer's custom path (a square) */
export const variants = ['open', 'closed']

const PROFILE = [
  { x: 0, y: 0.5, hr: { x: 0.12, y: -0.3 } },
  { x: 0.5, y: 0.5, hl: { x: -0.12, y: 0.3 }, hr: { x: 0.12, y: -0.3 } },
  { x: 1, y: 0.5, hl: { x: -0.12, y: 0.3 } },
]
const LOOP = [
  { x: 0.2, y: 0.5, hl: { x: 0, y: 0.17 }, hr: { x: 0, y: -0.17 } },
  { x: 0.5, y: 0.2, hl: { x: -0.17, y: 0 }, hr: { x: 0.17, y: 0 } },
  { x: 0.8, y: 0.5, hl: { x: 0, y: -0.17 }, hr: { x: 0, y: 0.17 } },
  { x: 0.5, y: 0.8, hl: { x: 0.17, y: 0 }, hr: { x: -0.17, y: 0 } },
]

/* Controlled: the value lives here. Drag a node or a handle, double-click to add, alt-click to delete. */
export default function BezierPathEditorPreview({ size = 'sm', variant = 'open' }) {
  return <Editor key={variant} closed={variant === 'closed'} size={size} />
}

function Editor({ closed, size }) {
  const [pts, setPts] = useState(closed ? LOOP : PROFILE)
  return (
    <div className="w-[240px]">
      <BezierPathEditor value={pts} onChange={setPts} closed={closed} aspect={closed ? 1 : 2} size={size} />
    </div>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [pts, setPts] = useState(PROFILE)
  return <div className="w-[200px]"><BezierPathEditor value={pts} onChange={setPts} aspect={2} /></div>
}
