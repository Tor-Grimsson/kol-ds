import { useRef } from 'react'
import { seekToSeconds } from '../signal/transport.js'
import { useTransport, useTransportNow } from './useTransport.js'

/**
 * TimeStrip — the one clock drawn as a line you can grab (user 2026-10-15:
 * *"loop section? or timeline preview with scrubber? like |-->----------|"* and
 * *"a timeline section like fxr labs has, it could be hidden by default but
 * shown on shortcut"*).
 *
 * Two faces over ONE scrubber: `Scrubber` sits on the Transport panel; the
 * default export is the studio's bottom strip, fxr labs' shape (`docs/
 * documentation/05-blueprint/_assets/ref-fxr-timeline.png`) — a readout column,
 * a ruler with the head, and the loop row with its start marked "1" in the
 * accent (*"a thin yellow or accent color vertical divider with a label showing
 * where it starts"*).
 *
 * Grabbing never starts or stops the clock; it moves the head (`transport.seek`).
 *
 * kol-mirror's `components/mirror/TimeStrip.jsx`, carried into kol-hardware (TransportAndTimeline, 2026-10-28): the same
 * strip and scrubber, reading the clock they are handed (`transport`, from `createTransport()`) instead of mirror's own
 * module. What an app lays on the strip under the bar — kol-fxr's keyframe lanes — goes in `children`, on the same span.
 */

/* The visible span: the loop window's far edge, at least four seconds, and on a
   free-running clock it grows in four-second steps to keep the head on screen.
   `span="loop"` (TimeStripInADock, kol-fxr 2026-10-28): the loop window exactly, so a lane's `t` 0..1 is the full width;
   `span={seconds}`: that many seconds from 0. Returns [origin, span] — origin is where the left edge sits, in seconds. */
function viewOf(t, now, mode = 'auto') {
  if (mode === 'loop') {
    const a = Math.min(t.loopIn, t.loopOut)
    return [a, Math.max(Math.max(t.loopIn, t.loopOut) - a, 1e-6)]
  }
  if (typeof mode === 'number' && mode > 0) return [0, mode]
  const far = Math.max(t.loopIn, t.loopOut, 4)
  const free = t.mode === 'forward' && !t.looping
  return [0, free && now > far ? Math.ceil(now / 4) * 4 : far]
}

/* The bar itself — the loop window shaded, IN marked in the accent, the head. */
function Bar({ transport, t, now, span, origin = 0, height = 14, marker = false }) {
  const ref = useRef(null)
  const drag = useRef(false)
  const at = (e) => {
    const box = ref.current.getBoundingClientRect()
    seekToSeconds(transport, origin + Math.max(0, Math.min(1, (e.clientX - box.left) / box.width)) * span)
  }
  const a = Math.min(t.loopIn, t.loopOut)
  const b = Math.max(t.loopIn, t.loopOut)
  const pct = (x) => `${Math.max(0, Math.min(100, ((x - origin) / span) * 100))}%`
  return (
    <div
      ref={ref}
      className="relative w-full cursor-ew-resize select-none"
      style={{ height, background: 'var(--kol-fg-08)', borderRadius: 2, touchAction: 'none' }}
      onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); at(e) }}
      onPointerMove={(e) => { if (drag.current) at(e) }}
      onPointerUp={() => { drag.current = false }}
      title="Drag to move the head (↑ start · ↓ end)"
    >
      {/* the loop window — lit when the clock wraps inside it */}
      <div
        className="absolute top-0 bottom-0"
        style={{ left: pct(a), width: `${Math.max(0, Math.min(100, ((b - a) / span) * 100))}%`, background: t.looping || t.mode !== 'forward' ? 'var(--kol-fg-24)' : 'var(--kol-fg-12)' }}
      />
      {marker && (
        <div className="absolute top-0 bottom-0" style={{ left: pct(a), width: 1, background: 'var(--kol-accent-primary)' }}>
          <span className="absolute kol-helper-10" style={{ left: 3, top: 0, lineHeight: `${height}px`, color: 'var(--kol-accent-primary)' }}>1</span>
        </div>
      )}
      <div className="absolute top-0 bottom-0" style={{ left: pct(b), width: 1, background: 'var(--kol-fg-24)' }} />
      {/* the head */}
      <div className="absolute" style={{ left: pct(now), top: -2, bottom: -2, width: 2, marginLeft: -1, background: 'var(--kol-fg-96)' }} />
    </div>
  )
}

/** The Transport panel's strip: `|-->----------|`, IN to OUT, grab to move. */
export function Scrubber({ transport, width = 232 }) {
  const t = useTransport(transport)
  const now = useTransportNow(transport)
  return (
    <div style={{ width }}>
      <Bar transport={transport} t={t} now={now} span={viewOf(t, now)[1]} height={10} />
    </div>
  )
}

/** The studio's bottom strip — hidden by default, `B` shows it. `children` render under the bar, on its span (lanes); as a
 * function they get `{ now, span, origin, state }`.
 *
 * For a host that frames it (TimeStripInADock, kol-fxr 2026-10-28 — fxr's TimelineDock is an in-flow panel):
 *   framed={false}   in flow — no absolute position, border, padding, background or z; the host frames it
 *   span="loop"      the loop window exactly (or `span={seconds}`); default `"auto"` is mirror's
 *   gutter={px}      a left column that wide: the readout sits in it, the ruler and bar start after it, and `children`
 *                    render full width beneath — so a lane's own label column lines up with the ruler
 */
export default function TimeStrip({ transport, onClose, children, framed = true, span: spanMode = 'auto', gutter }) {
  const t = useTransport(transport)
  const now = useTransportNow(transport)
  const [origin, span] = viewOf(t, now, spanMode)
  const first = Math.ceil(origin)
  const ticks = Array.from({ length: Math.max(0, Math.floor(origin + span) - first + 1) }, (_, i) => first + i)
  const x = (s) => ((s - origin) / span) * 100
  const loopOn = t.looping || t.mode !== 'forward'
  const lanes = typeof children === 'function' ? children({ now, span, origin, state: t }) : children
  const ruler = (
    <div className="relative w-full" style={{ height: 12 }}>
      {ticks.map((s) => (
        <span key={s} className="absolute text-fg-32" style={{ left: `${x(s)}%`, transform: s > origin ? 'translateX(-50%)' : undefined }}>
          {span <= 16 || s % 4 === 0 ? s : ''}
        </span>
      ))}
      <div className="absolute" style={{ left: `${Math.max(0, Math.min(100, x(now)))}%`, top: 0, bottom: -4, width: 1, background: 'var(--kol-fg-96)' }} />
    </div>
  )
  const bar = <Bar transport={transport} t={t} now={now} span={span} origin={origin} height={16} marker />
  const readout = <span>{now.toFixed(2)} / {span.toFixed(2)} s</span>
  const loopLabel = <span className="text-fg-96">Loop {loopOn ? 'on' : 'off'}</span>
  const frame = framed
    ? { className: 'absolute left-0 right-0 bottom-0 flex items-stretch gap-4 px-4 py-3 border-t border-fg-08 kol-helper-10 group', style: { background: 'var(--kol-surface-primary)', zIndex: 'var(--kol-z-overlay)' } }
    : { className: 'relative flex items-stretch gap-4 kol-helper-10 group', style: undefined }
  const close = onClose && <button
    type="button"
    onClick={onClose}
    className="self-start text-fg-32 hover:text-fg-96 opacity-0 group-hover:opacity-100 cursor-pointer"
    aria-label="Hide timeline"
    title="Hide timeline (B)"
  >
    ×
  </button>

  if (gutter != null) {
    const cell = { width: gutter, fontVariantNumeric: 'tabular-nums' }
    return (
      <div className={frame.className} style={frame.style}>
        <div className="flex flex-col flex-1 gap-2" style={{ minWidth: 0 }}>
          <div className="flex items-end">
            <div className="shrink-0 text-fg-64" style={cell}>{readout}</div>
            <div className="flex-1" style={{ minWidth: 0 }}>{ruler}</div>
          </div>
          <div className="flex items-center">
            <div className="shrink-0" style={cell}>{loopLabel}</div>
            <div className="flex-1" style={{ minWidth: 0 }}>{bar}</div>
          </div>
          {lanes}
        </div>
        {close}
      </div>
    )
  }

  return (
    <div className={frame.className} style={frame.style}>
      <div className="flex flex-col justify-between shrink-0 text-fg-64" style={{ width: 112, fontVariantNumeric: 'tabular-nums' }}>
        {readout}
        {loopLabel}
      </div>
      <div className="flex flex-col flex-1 gap-2" style={{ minWidth: 0 }}>
        {ruler}
        {bar}
        {lanes}
      </div>
      {close}
    </div>
  )
}
