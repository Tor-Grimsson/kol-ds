import { useRef, useState } from 'react'
import { CurveOverlay } from '@kolkrabbi/kol-component'

const W = 320
const H = 120

const Frame = ({ label, children, ...rest }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span className="kol-mono-12 text-fg-48">{label}</span>
    <div
      style={{ position: 'relative', width: W, height: H, border: '1px solid var(--kol-fg-12)', borderRadius: 4 }}
      {...rest}
    >
      {children}
    </div>
  </div>
)

const Column = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{children}</div>
)

export const Presets = () => (
  <Column>
    <Frame label="linear"><CurveOverlay width={W} height={H} curve="linear" blend={0.5} /></Frame>
    <Frame label="ease"><CurveOverlay width={W} height={H} curve="ease" blend={0.5} /></Frame>
    <Frame label="expo-in"><CurveOverlay width={W} height={H} curve="expo-in" blend={0.5} /></Frame>
    <Frame label="sine"><CurveOverlay width={W} height={H} curve="sine" blend={0.5} /></Frame>
  </Column>
)

/* The story is the parent drag system: hit-test the handles by
 * data-role, map pointer → normalized cp, pass the points back down. */
export const Custom = () => {
  const [cp1, setCp1] = useState({ x: 0.3, y: 0.1 })
  const [cp2, setCp2] = useState({ x: 0.7, y: 0.9 })
  const dragging = useRef(null)
  const frameRef = useRef(null)

  const toNorm = (e) => {
    const r = frameRef.current.getBoundingClientRect()
    const c = (v) => Math.min(1, Math.max(0, v))
    return { x: c((e.clientX - r.left) / r.width), y: c(1 - (e.clientY - r.top) / r.height) }
  }

  return (
    <Column>
      <Frame
        label="custom — drag the handles"
        ref={frameRef}
        onPointerDown={(e) => {
          const role = e.target.dataset?.role
          if (role !== 'curve-cp1' && role !== 'curve-cp2') return
          dragging.current = role
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return
          const cp = toNorm(e)
          dragging.current === 'curve-cp1' ? setCp1(cp) : setCp2(cp)
        }}
        onPointerUp={() => { dragging.current = null }}
      >
        <CurveOverlay width={W} height={H} curve="custom" blend={0.5} cp1={cp1} cp2={cp2} />
      </Frame>
    </Column>
  )
}

/* Math-agnostic seam: `easing` replaces the built-in presets. */
export const Easing = () => (
  <Column>
    <Frame label="easing: t => t * t * (3 - 2 * t)">
      <CurveOverlay width={W} height={H} easing={(t) => t * t * (3 - 2 * t)} />
    </Frame>
    <Frame label="easing: bounce-out">
      <CurveOverlay width={W} height={H} easing={(t) => 1 - Math.abs(Math.cos(t * Math.PI * 2.5)) * (1 - t)} />
    </Frame>
  </Column>
)
