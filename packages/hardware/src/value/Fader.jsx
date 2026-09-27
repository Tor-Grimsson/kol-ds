import { useRef, useCallback, useState } from 'react'
import ParamSheet from './ParamSheet.jsx'
import { armLongPress } from './armLongPress.js'

/**
 * Fader — the rack slider (kol-monitor's panel `Slider`, lifted 2026-09-01;
 * named `Fader` because `Slider` is kol-component's app control and the two are
 * different tiers on purpose — a 2px track on a 24px eurorack panel is not app
 * chrome). Same conventions as Knob: `kol-helper-8` label, inline styles, pointer
 * drag; on touch a 500ms hold opens `ParamSheet`.
 *
 * @param {number}   value · onChange `(value) => void`
 * @param {number}   min (0) · max (100) · step (1)
 * @param {string}   label
 * @param {'horizontal'|'vertical'} direction  horizontal = flex-1 track + numeric readout; vertical = fixed `height`
 * @param {number}   height    vertical only (default 60)
 */
export default function Fader({ value, onChange, min = 0, max = 100, step = 1, label, direction = 'horizontal', height }) {
  const trackRef = useRef(null)
  const vertical = direction === 'vertical'
  const [sheet, setSheet] = useState(false)

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
    // Touch: hold still 500ms → the big sheet instead of the drag
    const hold = armLongPress(e, () => { onUp(); setSheet(true) })
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [min, max, step, onChange, vertical])

  const norm = max > min ? ((value ?? 0) - min) / (max - min) : 0
  const sheetEl = sheet && (
    <ParamSheet label={label} value={value} min={min} max={max} step={step} onChange={onChange} onClose={() => setSheet(false)} />
  )

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
        {sheetEl}
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
      {sheetEl}
    </div>
  )
}
