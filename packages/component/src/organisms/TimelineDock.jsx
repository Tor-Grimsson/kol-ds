import { useRef, useState } from 'react'
import Input from '../atoms/Input.jsx'
import Dropdown from '../molecules/Dropdown.jsx'
import { Tooltip } from '../utilities/Popover.jsx'

/* The six easings the key editor offers. The CURVES stay the consumer's
 * (its interpolator resolves the name); this is the menu, not the math. */
export const TIMELINE_EASINGS = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease',   label: 'Ease' },
  { value: 'in',     label: 'Ease in' },
  { value: 'out',    label: 'Ease out' },
  { value: 'in-out', label: 'Ease in-out' },
  { value: 'hold',   label: 'Hold' },
]

/* Sample a track's value at t (linear across the segment — good enough for
 * the "add key without a jump" affordance). Exported: a consumer's renderer
 * wants the same answer the dock used when it placed the key. */
export function sampleTrack(keys, t) {
  if (keys.length === 0) return 0
  if (t <= keys[0].t) return keys[0].v
  const last = keys[keys.length - 1]
  if (t >= last.t) return last.v
  let i = 0
  while (i < keys.length - 1 && keys[i + 1].t <= t) i++
  const a = keys[i], b = keys[i + 1]
  if (typeof a.v !== 'number' || typeof b.v !== 'number') return a.v
  const span = b.t - a.t || 1
  return a.v + (b.v - a.v) * ((t - a.t) / span)
}

/* Click/drag to seek. */
function ScrubRuler({ t, onSeek }) {
  const ref = useRef(null)
  const fracFromEvent = (e) => {
    const r = ref.current.getBoundingClientRect()
    return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  }
  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    onSeek?.(fracFromEvent(e))
  }
  const onPointerMove = (e) => {
    if (e.buttons & 1) onSeek?.(fracFromEvent(e))
  }
  return (
    <div className="flex items-center gap-3">
      <span className="kol-mono-12 text-meta tabular-nums shrink-0 text-right" style={{ width: 120 }}>{t.toFixed(2)}</span>
      <div
        ref={ref}
        className="relative flex-1 h-4 cursor-ew-resize rounded"
        style={{ background: 'var(--kol-fg-04)' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <Playhead t={t} />
      </div>
    </div>
  )
}

function Playhead({ t }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-0 bottom-0"
      style={{ left: `${t * 100}%`, width: 1.5, background: 'var(--kol-accent-primary)' }}
    />
  )
}

function TrackRow({ track, t, selected, setSelected, writeKeys }) {
  const laneRef = useRef(null)
  /* Local drag state — committed once on pointer-up. */
  const drag = useRef(null)
  const [, force] = useState(0)

  const fracFromEvent = (e) => {
    const r = laneRef.current.getBoundingClientRect()
    return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  }

  const isSel = (i) => selected && selected.trackId === track.id && selected.index === i

  const onLanePointerDown = (e) => {
    if (e.target.dataset.diamond !== undefined) return
    /* Add a key at the click position, valued at the track's current value
     * there (no visual jump), then select it. */
    const clickT = fracFromEvent(e)
    const v = sampleTrack(track.keys, clickT)
    const next = [...track.keys, { t: clickT, v, easing: 'linear' }].sort((a, b) => a.t - b.t)
    writeKeys(track, next)
    setSelected({ trackId: track.id, index: next.findIndex((k) => k.t === clickT) })
  }

  const onDiamondPointerDown = (i) => (e) => {
    e.stopPropagation()
    if (e.altKey) {
      /* alt-click deletes (min 1 key stays — an empty track is a broken binding) */
      if (track.keys.length > 1) {
        writeKeys(track, track.keys.filter((_, j) => j !== i))
        setSelected(null)
      }
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { index: i, t: track.keys[i].t }
    setSelected({ trackId: track.id, index: i })
  }
  const onDiamondPointerMove = (i) => (e) => {
    if (!drag.current || drag.current.index !== i) return
    drag.current.t = fracFromEvent(e)
    force((n) => n + 1)
  }
  const onDiamondPointerUp = (i) => () => {
    if (!drag.current || drag.current.index !== i) return
    const moved = { ...track.keys[i], t: drag.current.t }
    const next = track.keys.map((k, j) => (j === i ? moved : k))
    drag.current = null
    writeKeys(track, next)
    setSelected(null)
  }

  return (
    <div className="flex items-center gap-3">
      <Tooltip label={track.label} asChild>
      <span className="kol-helper-10 text-meta truncate shrink-0 text-right" style={{ width: 120 }}>
        {track.label}
      </span>
      </Tooltip>
      <div
        ref={laneRef}
        className="relative flex-1 h-5 rounded cursor-copy"
        style={{ background: 'var(--kol-fg-04)' }}
        onPointerDown={onLanePointerDown}
      >
        <Playhead t={t} />
        {track.keys.map((k, i) => {
          const kt = drag.current?.index === i ? drag.current.t : k.t
          return (
            <Tooltip key={i} label={`t=${kt.toFixed(2)} v=${typeof k.v === 'number' ? Math.round(k.v * 100) / 100 : k.v} (alt-click deletes)`} asChild>
            <span
              data-diamond=""
              onPointerDown={onDiamondPointerDown(i)}
              onPointerMove={onDiamondPointerMove(i)}
              onPointerUp={onDiamondPointerUp(i)}
              className="absolute top-1/2 cursor-grab"
              style={{
                left: `${kt * 100}%`,
                width: 9, height: 9,
                transform: 'translate(-50%, -50%) rotate(45deg)',
                background: isSel(i) ? 'var(--kol-accent-primary)' : 'var(--kol-fg-emphasis)',
                borderRadius: 1.5,
              }}
            />
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

function SelectedKeyEditor({ tracks, selected, setSelected, writeKeys, easingOptions }) {
  if (!selected) return null
  const track = tracks.find((tr) => tr.id === selected.trackId)
  const key = track?.keys[selected.index]
  if (!key) return null

  const patchKey = (patch) => {
    writeKeys(track, track.keys.map((k, i) => (i === selected.index ? { ...k, ...patch } : k)))
  }
  const isNum = typeof key.v === 'number'

  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="kol-helper-10 text-meta shrink-0">key @ {key.t.toFixed(2)}</span>
      <Input
        variant="ghost" size="sm" chars={7}
        type={isNum ? 'number' : 'text'}
        value={String(key.v)}
        onChange={(e) => patchKey({ v: isNum ? Number(e.target.value) || 0 : e.target.value })}
      />
      <Dropdown
        variant="subtle" size="sm"
        options={easingOptions}
        value={Array.isArray(key.easing) ? 'linear' : (key.easing ?? 'linear')}
        onChange={(v) => patchKey({ easing: v })}
      />
      <button
        type="button"
        className="kol-helper-10 text-meta hover:text-emphasis px-2"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        onClick={() => {
          if (track.keys.length > 1) writeKeys(track, track.keys.filter((_, i) => i !== selected.index))
          setSelected(null)
        }}
      >
        Delete key
      </button>
      <button
        type="button"
        className="kol-helper-10 text-meta hover:text-emphasis px-2 ml-auto"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        onClick={() => setSelected(null)}
      >
        Close
      </button>
    </div>
  )
}

/**
 * TimelineDock — the keyframe timeline, docked below a canvas.
 *
 *   [t readout] [scrub ruler ................................ playhead]
 *   [track label] [lane: ◆ diamonds at t · click adds · drag moves · alt-click deletes]
 *   [selected key: value · easing · delete]
 *
 * Collapses to NOTHING while there are no tracks, so a static editor pays
 * zero chrome. Drags commit on pointer-up — one `onChange` per gesture, so a
 * consumer's undo gets one entry instead of a flood.
 *
 * Lifted from kol-fxr's editor (`params/TimelineDock.jsx`,
 * `editor-panels-the-held-specs` B3, 2026-09-03) with its couplings dropped
 * exactly as the row asked: `collectTracks`, which walked fxr's layer tree
 * for `{ bind: 'track' }` bindings, is the CONSUMER's — it hands in a flat
 * `tracks` array; `updateLayer` is `onChange(trackId, keys)`; and the clock
 * is two props, `t` and `onSeek`, so any clock drives it. fxr's `transport` is
 * an external store precisely so 60fps ticks re-render only bound renderers;
 * a consumer keeps that property by wrapping this in the one component that
 * subscribes to its clock. The clock itself does not ship.
 *
 * @param {Array<{id: string, label: string, keys: Array<{t: number, v: any, easing?: string}>}>} tracks - One lane each, `t` in 0..1; empty renders nothing
 * @param {number} t - The clock, 0..1
 * @param {Function} onSeek - `(t) => void` — the ruler scrubbed
 * @param {Function} onChange - `(trackId, keys) => void` — a track's keys after an add, move, edit or delete; already sorted by `t`
 * @param {Array<{value: string, label: string}>} [easingOptions] - The key editor's easing menu (default: `TIMELINE_EASINGS`)
 * @param {string} [className] - Extra classes on the dock
 */
export default function TimelineDock({ tracks = [], t = 0, onSeek, onChange, easingOptions = TIMELINE_EASINGS, className = '' }) {
  const [selected, setSelected] = useState(null)   /* { trackId, index } */

  if (tracks.length === 0) return null

  const writeKeys = (track, nextKeys) => {
    const sorted = [...nextKeys].sort((a, b) => a.t - b.t)
    onChange?.(track.id, sorted)
  }

  return (
    <div className={`kol-timeline-dock border-t border-fg-08 px-4 py-2 flex flex-col gap-1 select-none ${className}`.trim()} style={{ background: 'var(--kol-surface-primary)' }}>
      <ScrubRuler t={t} onSeek={onSeek} />
      {tracks.map((track) => (
        <TrackRow key={track.id} track={track} t={t} selected={selected} setSelected={setSelected} writeKeys={writeKeys} />
      ))}
      <SelectedKeyEditor tracks={tracks} selected={selected} setSelected={setSelected} writeKeys={writeKeys} easingOptions={easingOptions} />
    </div>
  )
}
