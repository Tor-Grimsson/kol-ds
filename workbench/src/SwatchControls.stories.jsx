import { useState } from 'react'
import { SwatchControls, SwatchStack, EyedropPick } from '@kolkrabbi/kol-component'

/* Drive the real browser EyeDropper at the call site (the component hides the
 * button where the API is absent, so this only runs where it exists). */
async function eyedrop(setSample) {
  if (!('EyeDropper' in window)) return
  try {
    const { sRGBHex } = await new window.EyeDropper().open()
    setSample(sRGBHex)
  } catch {
    /* cancelled */
  }
}

const Frame = ({ children }) => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 16 }}>{children}</div>
)

/* Composed default export — the full colour-panel top row. */
export const Composed = () => {
  const [fill, setFill] = useState('#F59E0B')
  const [stroke, setStroke] = useState('#0EA5E9')
  const [active, setActive] = useState('fill')
  const [sample, setSample] = useState('#22C55E')
  return (
    <Frame>
      <SwatchControls
        fillColor={fill}
        strokeColor={stroke}
        activePaint={active}
        onSwap={() => { setFill(stroke); setStroke(fill) }}
        onClear={() => (active === 'fill' ? setFill('transparent') : setStroke('transparent'))}
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
    </Frame>
  )
}

/* SwatchStack — fill-front vs stroke-front (the overlap-by-DOM-order trick). */
export const Stack = () => {
  const [fill, setFill] = useState('#F59E0B')
  const [stroke, setStroke] = useState('#0EA5E9')
  const swap = () => { setFill(stroke); setStroke(fill) }
  return (
    <Frame>
      <SwatchStack fillColor={fill} strokeColor={stroke} activePaint="fill"   onSwap={swap} onClear={() => setFill('transparent')} />
      <SwatchStack fillColor={fill} strokeColor={stroke} activePaint="stroke" onSwap={swap} onClear={() => setStroke('transparent')} />
    </Frame>
  )
}

/* EyedropPick — supported (button shown), and explicitly disabled. Where the
 * EyeDropper API is missing the button is hidden entirely (sample chip stays). */
export const Eyedrop = () => {
  const [sample, setSample] = useState('#22C55E')
  return (
    <Frame>
      <EyedropPick sampleColor={sample} onPick={() => eyedrop(setSample)} />
      <EyedropPick sampleColor={sample} onPick={() => {}} disabled />
    </Frame>
  )
}
