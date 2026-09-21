import { useState } from 'react'
import Button from '../atoms/Button.jsx'
import Dropdown from '../molecules/Dropdown.jsx'
import LabeledControl from '../molecules/LabeledControl.jsx'
import Slider from '../molecules/Slider.jsx'

const deg = (r) => Math.round(((r || 0) * 180) / Math.PI)
const rad = (d) => (d * Math.PI) / 180

/* The engine's easings by name; the curves are the consumer's interpolator's. */
export const KEYFRAME_EASES = [
  { value: 'linear', label: 'Linear' },
  { value: 'in',     label: 'Ease in' },
  { value: 'out',    label: 'Ease out' },
  { value: 'inout',  label: 'Ease in-out' },
]

export const DEFAULT_KEYFRAMES = [
  { t: 0, rot: [0, 0, 0], pos: [0, 0, 0], scale: 1, ease: 'inout' },
  { t: 1, rot: [0, Math.PI * 2, 0], pos: [0, 0, 0], scale: 1, ease: 'inout' },
]

/**
 * KeyframeEditor — a keyframe list over a pose track, kept sorted by `t`.
 *
 *   { t: 0..1, rot: [x, y, z] RADIANS, pos: [x, y, z], scale, ease }
 *
 * Rotations are stored in radians (engine-native) and EDITED IN DEGREES here.
 * Selecting a key pauses the clock and seeks to its `t`, so the live render is
 * the pose being edited; "Add @ playhead" reads the clock's current `t`.
 *
 * Lifted from kol-fxr's editor (`compose/inspectors/KeyframeEditor.jsx`,
 * `editor-panels-the-held-specs` A5, 2026-09-03) with the transport singleton
 * and the layer patch path dropped, as the row asked: the track is `keyframes`
 * + `onChange`, the clock is `t` + `onSeek` + `onPause`. The engine's
 * cycles arithmetic (a layer's phase runs N loops per transport loop) is the
 * CONSUMER's — it hands in the layer-local `t` and maps `onSeek`'s local `t`
 * back to its global playhead. The pose shape stays rot / pos / scale; the
 * row notes it should be schema-described, and that is a design change
 * rather than a port, so it is not done here.
 *
 * @param {Array<Object>} keyframes - The track; empty falls back to `DEFAULT_KEYFRAMES`
 * @param {Function} onChange - `(keyframes) => void` — the whole track, sorted
 * @param {number} t - The clock's current LAYER-LOCAL phase, 0..1 — what "Add @ playhead" stamps
 * @param {Function} onSeek - `(t) => void` — a key was selected; seek the clock to its local `t`
 * @param {Function} [onPause] - Called before the seek, so the render holds on the pose
 * @param {Array<{value: string, label: string}>} [easeOptions] - The Ease menu (default `KEYFRAME_EASES`)
 * @param {Array<Object>} [defaultKeyframes] - What an empty track shows (default `DEFAULT_KEYFRAMES`)
 */
export default function KeyframeEditor({
  keyframes,
  onChange,
  t = 0,
  onSeek,
  onPause,
  easeOptions = KEYFRAME_EASES,
  defaultKeyframes = DEFAULT_KEYFRAMES,
}) {
  const kfs = Array.isArray(keyframes) && keyframes.length ? keyframes : defaultKeyframes
  const [selected, setSelected] = useState(0)
  const sel = Math.min(selected, kfs.length - 1)
  const k = kfs[sel] || { rot: [0, 0, 0], pos: [0, 0, 0], scale: 1 }

  const write = (next) => onChange?.(next)

  const onSelect = (i) => {
    setSelected(i)
    onPause?.()
    onSeek?.(kfs[i].t ?? 0)
  }
  const onAdd = () => {
    const base = kfs[sel] || { rot: [0, 0, 0], pos: [0, 0, 0], scale: 1, ease: 'inout' }
    const nk = {
      t: Math.max(0, Math.min(1, t)),
      rot: [...(base.rot || [0, 0, 0])],
      pos: [...(base.pos || [0, 0, 0])],
      scale: base.scale ?? 1,
      ease: base.ease || 'inout',
    }
    const next = [...kfs, nk].sort((a, b) => a.t - b.t)
    write(next)
    setSelected(next.indexOf(nk))
  }
  const onDelete = () => {
    if (kfs.length <= 1) return
    write(kfs.filter((_, i) => i !== sel))
    setSelected((s) => Math.max(0, s - 1))
  }
  const onPatch = (p) => write(kfs.map((kf, i) => (i === sel ? { ...kf, ...p } : kf)))

  const setRot = (axis, d) => { const r = [...(k.rot || [0, 0, 0])]; r[axis] = rad(d); onPatch({ rot: r }) }
  const setPos = (axis, v) => { const p = [...(k.pos || [0, 0, 0])]; p[axis] = v; onPatch({ pos: p }) }

  const pose = (label, min, max, step, value, onValue) => (
    <LabeledControl label={label}>
      <Slider min={min} max={max} step={step} value={value} onChange={onValue} />
    </LabeledControl>
  )

  return (
    <div className="kol-keyframe-editor flex flex-col gap-3">
      <span className="kol-helper-10 text-meta">Keyframes</span>
      <div className="flex flex-col gap-1">
        {kfs.map((kf, i) => (
          <Button
            key={i}
            variant={i === sel ? 'primary' : 'secondary'}
            size="sm"
            className="w-full"
            style={{ justifyContent: 'space-between' }}
            onClick={() => onSelect(i)}
          >
            <span>Key {i + 1}</span>
            <span className="kol-helper-10 tabular-nums">{Math.round((kf.t ?? 0) * 100)}%</span>
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button variant="primary" size="sm" className="flex-1" onClick={onAdd}>Add @ playhead</Button>
        <Button variant="ghost" size="sm" title="Delete keyframe" onClick={onDelete} disabled={kfs.length <= 1}>Delete</Button>
      </div>

      <span className="kol-helper-10 text-meta">Pose</span>
      {pose('Rotate X', -360, 360, 1, deg(k.rot?.[0]), (v) => setRot(0, v))}
      {pose('Rotate Y', -360, 360, 1, deg(k.rot?.[1]), (v) => setRot(1, v))}
      {pose('Rotate Z', -360, 360, 1, deg(k.rot?.[2]), (v) => setRot(2, v))}
      {pose('Move X', -2, 2, 0.05, k.pos?.[0] || 0, (v) => setPos(0, v))}
      {pose('Move Y', -2, 2, 0.05, k.pos?.[1] || 0, (v) => setPos(1, v))}
      {pose('Move Z', -2, 2, 0.05, k.pos?.[2] || 0, (v) => setPos(2, v))}
      {pose('Scale', 0.2, 2, 0.05, k.scale ?? 1, (v) => onPatch({ scale: v }))}
      <LabeledControl label="Ease">
        <Dropdown variant="subtle" size="sm" className="w-full" options={easeOptions} value={k.ease || 'inout'} onChange={(v) => onPatch({ ease: v })} />
      </LabeledControl>
    </div>
  )
}
