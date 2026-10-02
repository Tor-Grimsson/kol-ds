import { useState } from 'react'
import { Slider } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* One bare inline row: label · track · readout. For a stacked
 * label around a label-less control, use LabeledControl instead.
 *
 * The dual + playhead + readout seams landed 2026-08-30
 * (SliderDualThumbAndPlayhead, kol-mirror) — a mixer running 23 faders in a
 * 24px row is why `readout="value"` exists, and an in/out trim pair is why
 * `variant="dual"` does. */
export const variants = ['minimal', 'vertical', 'scrub', 'dual', 'panel']

export default function SliderPreview({ variant = 'minimal' }) {
  const [v, setV] = useState(40)
  const [inV, setInV] = useState(20)
  const [outV, setOutV] = useState(80)
  const [head, setHead] = useState(50)
  const [lvl, setLvl] = useState(40)
  return (
    <div className="flex w-full flex-col gap-4">
      {variant === 'minimal' && (<>
      <Slider min={0} max={100} value={v} onChange={setV} />
      <Slider label="Opacity" min={0} max={100} value={v} onChange={setV} />

      {/* readout="value" — Knob's display-only readout. alt-click resets
        * to defaultValue; the same gesture works on Knob. */}
      <Slider
        label="Gain"
        min={0}
        max={100}
        value={v}
        onChange={setV}
        readout="value"
        defaultValue={50}
        formatValue={(n) => `${Math.round(n)}%`}
      />
      <Slider label="Send" min={0} max={100} value={v} onChange={setV} readout="none" />
      </>)}
      {variant === 'vertical' && (
        /* direction="vertical" — the same track stood upright at `height`; label above, readout below */
        <div className="flex items-end gap-8">
          <Slider direction="vertical" readout="none" min={0} max={100} value={v} onChange={setV} aria-label="Volume" />
          <Slider direction="vertical" label="Vol" readout="value" min={0} max={100} value={v} onChange={setV} height={128} />
        </div>
      )}
      {variant === 'scrub' && (
        /* scrub — the media scrubber: a thin track and a 4 × 28 pill knob. PlaybackBar's. */
        <Slider variant="scrub" readout="none" min={0} max={100} value={v} onChange={setV} aria-label="Scrub" />
      )}
      {variant === 'dual' && (<>

      {/* dual — two thumbs on one rail, in-mark hollow and out-mark solid so
        * you can tell which end you grabbed. The clamp is the component's. */}
      <Slider
        label="Trim"
        variant="dual"
        min={0}
        max={100}
        value={inV}
        onChange={setInV}
        value2={outV}
        onChange2={setOutV}
      />

      {/* the same pair carrying a draggable playhead — drag the marker or
        * click anywhere on the rail to seek */}
      <Slider
        label="Loop"
        variant="dual"
        min={0}
        max={100}
        value={inV}
        onChange={setInV}
        value2={outV}
        onChange2={setOutV}
        label1={`in ${Math.round(inV)}`}
        label2={`out ${Math.round(outV)}`}
        playhead={head}
        onPlayheadChange={setHead}
      />
      </>)}
      {variant === 'panel' && (
        /* panel — the rack slider (was kol-hardware `Fader`): a 2px track and an 8px thumb.
         * Horizontal takes the row and shows a readout; vertical is a fixed height. A 500ms
         * touch hold reports `onHold`. */
        <div className="flex w-80 items-center gap-4">
          <Slider variant="panel" value={v} onChange={setV} label="mix" />
          <Slider variant="panel" value={lvl} onChange={setLvl} label="lvl" direction="vertical" height={72} />
        </div>
      )}
    </div>
  )
}
