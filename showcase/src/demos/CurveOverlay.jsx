import { useRef, useState } from 'react'
import { CurveOverlay } from '@kolkrabbi/kol-component'

export const stage = 'md'

const W = 384
const H = 144

const Frame = ({ children, ...rest }) => (
  <div
    className="relative rounded border bg-fg-02"
    style={{ width: W, height: H, borderColor: 'var(--kol-fg-12)' }}
    {...rest}
  >
    {children}
  </div>
)

/* Preset curve first (sampled polyline, no handles), then custom mode
 * with the demo acting as the parent drag system: it hit-tests the
 * handles by data-role, maps pointer → normalized cp and passes the
 * control points back down — the overlay itself never handles drag. */
export default function CurveOverlayDemo() {
  const [cp1, setCp1] = useState({ x: 0.3, y: 0.1 })
  const [cp2, setCp2] = useState({ x: 0.7, y: 0.9 })
  const dragging = useRef(null)
  const frameRef = useRef(null)

  const toNorm = (e) => {
    const r = frameRef.current.getBoundingClientRect()
    const c = (v) => Math.min(1, Math.max(0, v))
    return { x: c((e.clientX - r.left) / r.width), y: c(1 - (e.clientY - r.top) / r.height) }
  }

  const onPointerDown = (e) => {
    const role = e.target.dataset?.role
    if (role !== 'curve-cp1' && role !== 'curve-cp2') return
    dragging.current = role
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragging.current) return
    const cp = toNorm(e)
    dragging.current === 'curve-cp1' ? setCp1(cp) : setCp2(cp)
  }
  const onPointerUp = () => { dragging.current = null }

  return (
    <>
      <Frame>
        <CurveOverlay width={W} height={H} curve="ease" blend={0.5} />
      </Frame>
      <Frame
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <CurveOverlay width={W} height={H} curve="custom" blend={0.5} cp1={cp1} cp2={cp2} />
      </Frame>
    </>
  )
}
