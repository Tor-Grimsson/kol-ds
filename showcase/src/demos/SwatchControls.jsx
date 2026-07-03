import { useState } from 'react'
import { SwatchControls, SwatchStack, EyedropPick } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* The EyeDropper call + canvas sampling are app-side (behind onPick). Here the
 * call site drives the real browser EyeDropper where it exists; the button is
 * hidden by the component when the API is absent, so this never runs there. */
async function eyedrop(setSample) {
  if (!('EyeDropper' in window)) return
  try {
    const { sRGBHex } = await new window.EyeDropper().open()
    setSample(sRGBHex)
  } catch {
    /* user hit Escape — ignore */
  }
}

export default function SwatchControlsDemo() {
  const [fill, setFill] = useState('#F59E0B')
  const [stroke, setStroke] = useState('#0EA5E9')
  const [active, setActive] = useState('fill')
  const [sample, setSample] = useState('#22C55E')

  /* onSwap — exchange the two paint colours (either chip or the arrow). */
  const swap = () => {
    setFill(stroke)
    setStroke(fill)
  }

  /* onClear — "set the active paint to none" (demo: paint it transparent). */
  const clear = () => {
    active === 'fill' ? setFill('transparent') : setStroke('transparent')
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Composed control — the full colour-panel top row. */}
      <div className="flex items-center gap-6">
        <SwatchControls
          fillColor={fill}
          strokeColor={stroke}
          activePaint={active}
          onSwap={swap}
          onClear={clear}
          sampleColor={sample}
          onPick={() => eyedrop(setSample)}
        />
        <button
          type="button"
          onClick={() => setActive((p) => (p === 'fill' ? 'stroke' : 'fill'))}
          className="kol-mono-12 text-fg-48 underline underline-offset-2"
        >
          {`active: ${active} — flip`}
        </button>
      </div>

      {/* Named sub-pieces, wired independently. */}
      <div className="flex flex-wrap items-start gap-10">
        <div className="flex flex-col gap-2">
          <p className="kol-mono-12 text-fg-48">SwatchStack</p>
          <SwatchStack
            fillColor={fill}
            strokeColor={stroke}
            activePaint={active}
            onSwap={swap}
            onClear={clear}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="kol-mono-12 text-fg-48">EyedropPick</p>
          <EyedropPick sampleColor={sample} onPick={() => eyedrop(setSample)} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="kol-mono-12 text-fg-48">EyedropPick · disabled</p>
          <EyedropPick sampleColor={sample} onPick={() => {}} disabled />
        </div>
      </div>
    </div>
  )
}
