import { useRef, useState } from 'react'
import Input from '../atoms/Input.jsx'
import Dropdown from '../molecules/Dropdown.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import Button from '../atoms/Button.jsx'
import KolboxGlyph from '../utilities/kolboxGlyph.jsx'

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
function TimelineDockDefault({ tracks = [], t = 0, onSeek, onChange, easingOptions = TIMELINE_EASINGS, className = '' }) {
  const [selected, setSelected] = useState(null)   /* { trackId, index } */

  if (tracks.length === 0) return null

  const writeKeys = (track, nextKeys) => {
    const sorted = [...nextKeys].sort((a, b) => a.t - b.t)
    onChange?.(track.id, sorted)
  }

  return (
    <div className={`kol-timeline-dock border-t border-oq-08 px-4 py-2 flex flex-col gap-1 select-none ${className}`.trim()} style={{ background: 'var(--kol-surface-primary)' }}>
      <ScrubRuler t={t} onSeek={onSeek} />
      {tracks.map((track) => (
        <TrackRow key={track.id} track={track} t={t} selected={selected} setSelected={setSelected} writeKeys={writeKeys} />
      ))}
      <SelectedKeyEditor tracks={tracks} selected={selected} setSelected={setSelected} writeKeys={writeKeys} easingOptions={easingOptions} />
    </div>
  )
}

/* ── kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5, 2026-11-18) ─────────────────────────────────────────────────
 * kolbox's MotionTimeline (Figma plan W15; the real Timeline's parts), carried from apps/kolbox/src/ui/MotionTimeline.jsx.
 * Draws itself only, the full width of its container, 200 high (480 expanded: `--kol-kolbox-timeline-h`, `-expanded`).
 * Header: play, Add a key at the head, the time as seconds and milliseconds, loop; the document's `title` and its layer
 * `count`; at the right Keyframes, Fit the loop, the zoom (100, 200, 400 %), Expand; the panel toggle (`onClose`).
 * Under it the ruler, "Layers" over the names. Body: a row per track, its name column and its lane (the clip, the keys).
 * Its data is kolbox's, in seconds, not the default look's 0..1 keys (the batch file's table): `tracks` [{ id, name,
 * keyframes: [t | { t, label }], icon, visible, locked, selected, sub, under, clip }], `time`, `duration`. The ruler's
 * press or drag is `onSeek(time)`; the rest of kolbox's callbacks are kept (onPlay, onLoop, onAddKeyframe, onKeyframe,
 * onSelect, onToggleVisible, onToggleLock, onClose, onLaneAdd, onKeyMove, onKeyDelete). A track's `icon` is the set's
 * name. */
const clampK = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
/* the real Timeline's zoom steps: the loop at 100 %, a span of it at 200 and 400 % that follows the head */
const ZOOMS_KOLBOX = [1, 2, 4]

/* a segment of the joined time field: the value mono 12, its unit muted, 2 apart, padding 8; commits on Enter or blur */
function TimeCellKolbox({ value, unit, label, onCommit }) {
  return (
    <label className="kol-timeline-time-cell flex shrink-0 items-center gap-0.5 px-2" data-time-segment={unit}>
      <input
        key={value}
        aria-label={label}
        defaultValue={value}
        className="field-sizing-content min-w-0 bg-transparent outline-none"
        onBlur={(e) => {
          const n = parseFloat(e.target.value)
          if (Number.isFinite(n)) onCommit(n)
          else e.target.value = value
        }}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
      <span>{unit}</span>
    </label>
  )
}

/* a row's eye or lock: 20 square, a 12 glyph; always drawn, as the real ones */
function RowToggleKolbox({ icon, label, on, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      className={`kol-timeline-toggle${on ? ' is-on' : ''} flex size-5 shrink-0 items-center justify-center outline-none focus-visible:outline-solid focus-visible:outline-1`}
    >
      <KolboxGlyph name={icon} size={12} />
    </button>
  )
}

function TimelineKolbox({
  tracks = [], time = 0, duration = 12, playing = false, loop = false, title, count,
  onSeek, onPlay, onLoop, onAddKeyframe, onKeyframe, onSelect, onToggleVisible, onToggleLock, onClose,
  onLaneAdd, onKeyMove, onKeyDelete, className = '',
}) {
  const ruler = useRef(null)
  const lanes = useRef(null)
  /* a key's drag, held here and committed once on release: { track, index, t } */
  const [drag, setDrag] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const [folded, setFolded] = useState(() => new Set())

  /* the window over the loop: the whole loop at 100 %, else a span that follows the head */
  const span = duration / zoom
  const origin = zoom === 1 ? 0 : clampK(time - span / 2, 0, duration - span)
  const X = (t) => (t - origin) / span
  const pct = (t) => `${clampK(X(t), 0, 1) * 100}%`
  const scrub = (e) => {
    const r = ruler.current.getBoundingClientRect()
    onSeek?.(origin + clampK((e.clientX - r.left) / r.width, 0, 1) * span)
  }
  const seconds = Math.floor(time)
  const ms = Math.round((time - seconds) * 1000)
  const step = span < 4 ? 1 : 2
  const ticks = []
  for (let t = Math.ceil(origin / step) * step; t <= origin + span + 1e-9; t += step) ticks.push(t)
  const headIn = X(time) >= 0 && X(time) <= 1
  const timeAt = (e) => { const r = lanes.current.getBoundingClientRect(); return origin + clampK((e.clientX - r.left) / r.width, 0, 1) * span }

  const folds = new Set(tracks.filter((t) => t.under).map((t) => t.under))
  const rows = tracks.filter((t) => !(t.under && folded.has(t.under)))
  const fold = (id) => setFolded((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })

  return (
    <div data-kol-timeline data-expanded={expanded || undefined} className={`kol-timeline--kolbox${expanded ? ' is-expanded' : ''} flex w-full flex-col border-t ${className}`.trim()}>
      <div className="kol-timeline-line flex shrink-0 border-b">
        <div className="kol-timeline-names kol-timeline-line flex shrink-0 items-center gap-1 border-r p-2">
          <Button variant="kolbox" iconOnly={playing ? 'pause' : 'play'} aria-label={playing ? 'Pause' : 'Play'} onClick={() => onPlay?.(!playing)} />
          {onAddKeyframe ? <Button variant="kolbox" iconOnly="diamond" aria-label="Add a key at the head" onClick={() => onAddKeyframe(time)} />
            : <Tooltip variant="kolbox" label="Select a layer to key"><Button variant="kolbox" iconOnly="diamond" aria-label="Add a key at the head" disabled /></Tooltip>}
          <div className="kol-timeline-time flex h-(--kol-kolbox-ctl) shrink-0 items-stretch focus-within:outline-1 focus-within:-outline-offset-1" data-time-field>
            <TimeCellKolbox value={seconds} unit="s" label="Seconds" onCommit={(n) => onSeek?.(clampK(n + ms / 1000, 0, duration))} />
            <span className="kol-timeline-time-rule w-px shrink-0" />
            <TimeCellKolbox value={ms} unit="ms" label="Milliseconds" onCommit={(n) => onSeek?.(clampK(seconds + n / 1000, 0, duration))} />
          </div>
          <Button variant="kolbox" iconOnly="repeat" aria-label={loop ? 'Loop off' : 'Loop on'} pressed={loop} onClick={() => onLoop?.(!loop)} />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 px-4" data-timeline-toolbar>
          {title != null && (
            <>
              <KolboxGlyph name="layers" className="kol-timeline-muted" />
              <span className="kol-timeline-title min-w-0 truncate">{title}</span>
              {count != null && <span className="kol-timeline-meta kol-timeline-mono shrink-0">{count} {count === 1 ? 'layer' : 'layers'}</span>}
            </>
          )}
          <span className="kol-timeline-label ml-auto">Keyframes</span>
          {zoom !== 1 ? <Button variant="kolbox" iconOnly="cap-round" aria-label="Fit the loop" onClick={() => setZoom(1)} />
            : <Tooltip variant="kolbox" label="The whole loop is in view"><Button variant="kolbox" iconOnly="cap-round" aria-label="Fit the loop" disabled /></Tooltip>}
          <button
            type="button"
            aria-label="Zoom the lanes"
            onClick={() => setZoom(ZOOMS_KOLBOX[(ZOOMS_KOLBOX.indexOf(zoom) + 1) % ZOOMS_KOLBOX.length])}
            className="kol-timeline-zoom h-(--kol-kolbox-ctl) shrink-0 px-1 tabular-nums outline-none focus-visible:outline-solid focus-visible:outline-1"
          >
            {zoom * 100}%
          </button>
          <Button variant="kolbox" iconOnly="nav-create" aria-label={expanded ? 'Fit the timeline to its lanes' : 'Expand the timeline'} pressed={expanded} onClick={() => setExpanded(!expanded)} />
        </div>
        <div className="kol-timeline-line flex w-11 shrink-0 items-center justify-center border-l">
          <Button variant="kolbox" iconOnly="panel-bottom" aria-label="Timeline" onClick={onClose} />
        </div>
      </div>
      {/* the ruler: Layers over the names, the seconds over the lanes; a press or a drag on it moves the head */}
      <div className="kol-timeline-line flex h-6 shrink-0 border-b">
        <div className="kol-timeline-names kol-timeline-line kol-timeline-meta flex shrink-0 items-center border-r px-4">Layers</div>
        <div
          className="relative min-w-0 flex-1 cursor-ew-resize touch-none px-4 select-none"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            scrub(e)
          }}
          onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && scrub(e)}
        >
          <div ref={ruler} className="relative h-full">
            {ticks.map((t) => (
              <div key={t} className="absolute inset-y-0 flex flex-col items-start" style={{ left: pct(t) }}>
                <span className="kol-timeline-tick h-1.5 w-px" />
                <span className="kol-timeline-meta kol-timeline-mono -translate-x-1/2">{t}s</span>
              </div>
            ))}
            {headIn && (
              <div data-kol-playhead className="absolute inset-y-0 flex -translate-x-1/2 flex-col items-center" style={{ left: pct(time) }}>
                <span className="kol-timeline-head h-4 w-2 rounded-full" />
                <span className="kol-timeline-head w-px flex-1" />
              </div>
            )}
          </div>
        </div>
        <div className="kol-timeline-line w-11 shrink-0 border-l" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full">
          <div className="kol-timeline-names kol-timeline-line shrink-0 border-r px-2 py-1">
            {rows.map((t) => (
              <div
                key={t.id}
                data-timeline-row={t.id}
                aria-current={t.selected || undefined}
                onClick={onSelect && !t.sub ? () => onSelect(t) : undefined}
                className={`kol-timeline-row${t.selected ? ' is-selected' : ''} flex h-7 items-center gap-2 rounded-sm px-2 ${t.sub ? 'pl-8' : ''} ${onSelect && !t.sub ? 'cursor-pointer' : ''}`}
              >
                {t.icon && !t.sub && <KolboxGlyph name={t.icon} className="kol-timeline-muted" />}
                <span className={`kol-timeline-name${t.sub ? ' is-sub' : ''} min-w-0 flex-1 truncate`}>{t.name}</span>
                {folds.has(t.id) && (
                  <Button variant="kolbox"
                    iconOnly={folded.has(t.id) ? 'chevron-right' : 'chevron-down'}
                    aria-label={folded.has(t.id) ? 'Show the morph’s tracks' : 'Hide the morph’s tracks'}
                    onClick={(e) => { e.stopPropagation(); fold(t.id) }}
                    className="size-5!"
                  />
                )}
                {t.visible !== undefined && <RowToggleKolbox icon={t.visible ? 'eye-on' : 'eye-off'} label={t.visible ? 'Hide layer' : 'Show layer'} on={false} onClick={() => onToggleVisible?.(t)} />}
                {t.locked !== undefined && <RowToggleKolbox icon={t.locked ? 'lock' : 'unlock'} label={t.locked ? 'Unlock layer' : 'Lock layer'} on={t.locked} onClick={() => onToggleLock?.(t)} />}
              </div>
            ))}
          </div>
          <div className="kol-timeline-ground relative min-w-0 flex-1 px-4 py-1">
            <div ref={lanes} className="relative h-full overflow-hidden">
              {rows.map((t) => {
                const empty = t.keyframes.length === 0
                const clip = t.clip ?? (empty ? `${duration.toFixed(2)} s` : null)
                return (
                  <div key={t.id} className={`relative h-7 ${onLaneAdd && !empty ? 'cursor-copy' : ''}`}
                    onPointerDown={onLaneAdd && !empty ? (e) => { if (!e.target.closest('[data-keyframe],[data-keyframe-label]')) onLaneAdd(t, timeAt(e)) } : undefined}>
                    {/* the clip: the loop's length on the lane, its name at its left; lit with the row */}
                    <div
                      data-clip
                      className={`kol-timeline-clip${t.selected ? ' is-selected' : ''} absolute inset-y-0.5 rounded-sm`}
                      style={{ left: `${X(0) * 100}%`, width: `${(X(duration) - X(0)) * 100}%` }}
                    >
                      {clip && <span className={`kol-timeline-meta pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 whitespace-nowrap${t.clip == null ? ' kol-timeline-mono' : ''}`}>{clip}</span>}
                    </div>
                    {t.keyframes.map((key, i) => {
                      const k0 = typeof key === 'number' ? { t: key } : key
                      const k = drag?.track === t.id && drag.index === i ? { ...k0, t: drag.t } : k0
                      const last = i === t.keyframes.length - 1 && k.t > duration / 2
                      return (
                        <span key={i}>
                          <span data-keyframe className="kol-timeline-key absolute top-1/2 size-2 -translate-1/2 rotate-45" style={{ left: `clamp(var(--kol-spacing-1), ${X(k.t) * 100}%, 100% - var(--kol-spacing-1))` }}
                            onPointerDown={(onKeyMove || onKeyDelete) ? (e) => {
                              e.stopPropagation()
                              if (e.altKey) { onKeyDelete?.(t, i); return }
                              if (!onKeyMove) return
                              e.currentTarget.setPointerCapture(e.pointerId)
                              setDrag({ track: t.id, index: i, t: k0.t, from: k0.t })
                            } : undefined}
                            onPointerMove={drag?.track === t.id && drag.index === i ? (e) => setDrag({ ...drag, t: timeAt(e) }) : undefined}
                            onPointerUp={drag?.track === t.id && drag.index === i ? () => { if (drag.t !== drag.from) onKeyMove(t, i, drag.t); setDrag(null) } : undefined} />
                          {/* a key's label after its diamond (the last one before it); pressing it calls onKeyframe */}
                          {k.label && (
                            <button
                              type="button"
                              data-keyframe-label
                              aria-label={`Edit step ${k.label}`}
                              onClick={() => onKeyframe?.(t, i, k)}
                              className="kol-timeline-meta kol-timeline-keylabel absolute inset-y-0 truncate"
                              style={last
                                ? { right: `calc(${(1 - clampK(X(k.t), 0, 1)) * 100}% + var(--kol-spacing-2))`, maxWidth: `${100 / t.keyframes.length}%` }
                                : { left: `calc(${clampK(X(k.t), 0, 1) * 100}% + var(--kol-spacing-2))`, maxWidth: `${100 / t.keyframes.length}%` }}
                            >
                              {k.label}
                            </button>
                          )}
                        </span>
                      )
                    })}
                  </div>
                )
              })}
              {headIn && <span className="kol-timeline-head pointer-events-none absolute inset-y-0 w-px -translate-x-1/2" style={{ left: pct(time) }} />}
            </div>
          </div>
          <div className="kol-timeline-ground w-11 shrink-0" />
        </div>
      </div>
    </div>
  )
}

/* ── folio (Folio migration batch D, 2026-11-22) ──────────────────────────────────────────────────────────────────────
 * Folio's Timeline, carried from apps/folio's EditorChrome.jsx: the default dock's frame, padded 8 by 16 under a rule,
 * the names in a 120 column, a 16 ruler and 20 lanes at radius 4, keys 9 diamonds, the playhead 1.5; Folio's inks (the
 * rule, the surface lanes, the ink keys, the green head, the muted time and names). Display only: no key editing. The
 * default's words, `tracks`, `t` (0..1) and `onSeek(t)`; a track's `keys` are Folio's, plain positions 0..1 (the
 * default's are `{ t, v }`). */
function TimelineFolio({ tracks = [], t = 0, onSeek, className = '' }) {
  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    onSeek?.(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)))
  }
  const head = <span aria-hidden className="kol-timeline-head absolute inset-y-0 w-[1.5px]" style={{ left: `${t * 100}%` }} />
  return (
    <div className={`kol-timeline--folio flex select-none flex-col gap-[4px] border-t px-[16px] py-[8px] ${className}`.trim()}>
      <div className="flex items-center gap-[12px]">
        <span className="kol-timeline-time w-[120px] shrink-0 text-right tabular-nums">{t.toFixed(2)}</span>
        <div role="slider" aria-label="Time" aria-valuemin={0} aria-valuemax={1} aria-valuenow={t} className="kol-timeline-lane relative h-[16px] flex-1 cursor-ew-resize rounded-[4px]"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); seek(e) }} onPointerMove={(e) => e.buttons && seek(e)}>{head}</div>
      </div>
      {tracks.map((tr) => (
        <div key={tr.id} className="flex items-center gap-[12px]">
          <span title={tr.label} className="kol-timeline-name w-[120px] shrink-0 truncate text-right">{tr.label}</span>
          <div className="kol-timeline-lane relative h-[20px] flex-1 rounded-[4px]">
            {head}
            {tr.keys.map((k) => <span key={k} aria-hidden className="kol-timeline-key absolute top-1/2 size-[9px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1.5px]" style={{ left: `${k * 100}%` }} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TimelineDock(props) {
  if (props.variant === 'folio') return <TimelineFolio {...props} />
  return props.variant === 'kolbox' ? <TimelineKolbox {...props} /> : <TimelineDockDefault {...props} />
}
