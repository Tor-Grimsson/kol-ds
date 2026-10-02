import { useRef, useCallback } from 'react'
import { armLongPress } from '../utilities/armLongPress.js'

const NO_HOLD = { move() {}, cancel() {} }

/**
 * SliderPanel — Slider's `variant="panel"`: the rack slider. A 2px track and an 8px thumb for a
 * 24px hardware panel, drawn rather than a native range, with a vertical direction. It was
 * kol-hardware's `Fader` (kol-monitor's rack, lifted 2026-09-01) and is carried here class for
 * class — merged into Slider 2026-10-01 (user ruling: one slider, not two that look alike).
 * Not exported: reach it through `<Slider variant="panel">`.
 */
export default function SliderPanel({ value, onChange, min = 0, max = 100, step = 1, label, direction = 'horizontal', height, onHold }) {
  const trackRef = useRef(null)
  const vertical = direction === 'vertical'

  const handlePointerDown = useCallback((e) => {
    e.preventDefault()
    const track = trackRef.current
    if (!track) return

    const update = (e) => {
      const rect = track.getBoundingClientRect()
      const ratio = vertical
        ? Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height))
        : Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const raw = min + ratio * (max - min)
      onChange(Math.round(raw / step) * step)
    }

    update(e)
    const id = e.pointerId
    const onMove = (e) => { if (e.pointerId === id) { hold.move(e); update(e) } }  // a second finger is a pan
    const onUp = () => {
      hold.cancel()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    // Touch: hold still 500ms → the holder's sheet instead of the drag
    const hold = onHold ? armLongPress(e, () => { onUp(); onHold({ label, value, min, max, step }) }) : NO_HOLD
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [min, max, step, onChange, vertical, onHold, label, value])

  const norm = max > min ? ((value ?? 0) - min) / (max - min) : 0

  if (vertical) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {label && (
          <span className="kol-helper-8 text-fg-32" style={{ textTransform: 'uppercase', lineHeight: 1 }}>
            {label}
          </span>
        )}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          className="bg-fg-16"
          style={{ width: 2, height: height ?? 60, position: 'relative', cursor: 'ns-resize', touchAction: 'none' }}
        >
          <div className="bg-fg-16" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${norm * 100}%` }} />
          <div className="bg-fg-72" style={{ position: 'absolute', bottom: `calc(${norm * 100}% - 4px)`, left: -3, width: 8, height: 8, borderRadius: '50%' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
      {label && (
        <span className="kol-helper-8 text-fg-32" style={{ textTransform: 'uppercase', lineHeight: 1, flexShrink: 0, minWidth: 20 }}>
          {label}
        </span>
      )}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className="bg-fg-16"
        style={{ flex: 1, height: 2, position: 'relative', cursor: 'pointer', touchAction: 'none' }}
      >
        <div className="bg-fg-72" style={{ position: 'absolute', left: `calc(${norm * 100}% - 4px)`, top: -3, width: 8, height: 8, borderRadius: '50%' }} />
      </div>
      <span className="kol-helper-8 text-fg-32" style={{ lineHeight: 1, flexShrink: 0, minWidth: 16, textAlign: 'right' }}>
        {Math.round(value ?? 0)}
      </span>
    </div>
  )
}
