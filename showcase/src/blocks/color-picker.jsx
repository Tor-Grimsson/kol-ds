import { useState } from 'react'
import {
  Section, Divider, SpectrumControls, SwatchControls, ColorInputRow,
} from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Color picker',
  description: 'An HSV spectrum, swatch stack and hex row on one shared color',
  category: 'color',
  featured: true,
}
export const stage = 'sm'

/* HSV ⇄ hex lives at the call site — the picker family is color-math-only and
 * never renders a preview. { hue: 0–360, sat/val: 0–100 } ⇄ '#RRGGBB'. */
function hsvToHex({ hue, sat, val }) {
  const s = sat / 100
  const v = val / 100
  const c = v * s
  const hh = (((hue % 360) + 360) % 360) / 60
  const x = c * (1 - Math.abs((hh % 2) - 1))
  const [r, g, b] =
    hh < 1 ? [c, x, 0] :
    hh < 2 ? [x, c, 0] :
    hh < 3 ? [0, c, x] :
    hh < 4 ? [0, x, c] :
    hh < 5 ? [x, 0, c] : [c, 0, x]
  const m = v - c
  const to = (n) => Math.round((n + m) * 255).toString(16).padStart(2, '0').toUpperCase()
  return `#${to(r)}${to(g)}${to(b)}`
}

function hexToHsv(hex) {
  const d = hex.replace(/^#/, '')
  const r = parseInt(d.slice(0, 2), 16) / 255
  const g = parseInt(d.slice(2, 4), 16) / 255
  const b = parseInt(d.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  if (delta !== 0) {
    if (max === r) h = 60 * ((((g - b) / delta) % 6 + 6) % 6)
    else if (max === g) h = 60 * (((b - r) / delta) + 2)
    else h = 60 * (((r - g) / delta) + 4)
  }
  return { hue: h, sat: max === 0 ? 0 : (delta / max) * 100, val: max * 100 }
}

export default function ColorPicker() {
  /* One record of the panel's two paints — picker + hex both edit `fill`, the
   * swatch stack shows both; swap exchanges them, clear resets fill to white. */
  const [fill, setFill] = useState({ hue: 14, sat: 66, val: 68 })
  const [stroke, setStroke] = useState({ hue: 220, sat: 34, val: 14 })

  const fillHex = hsvToHex(fill)
  const strokeHex = hsvToHex(stroke)

  const swap = () => { setFill(stroke); setStroke(fill) }
  const clear = () => setFill({ hue: 0, sat: 0, val: 100 })

  /* Real browser eyedropper where supported — feeds the same shared state. */
  const pick = async () => {
    if (!('EyeDropper' in window)) return
    try {
      const { sRGBHex } = await new window.EyeDropper().open()
      setFill(hexToHsv(sRGBHex))
    } catch { /* dismissed */ }
  }

  return (
    <div className="flex flex-col gap-4 rounded-[var(--kol-radius-md)] border border-fg-12 bg-surface-primary p-4">
      <Section label="Spectrum">
        <div className="h-[200px]">
          <SpectrumControls value={fill} onChange={setFill} />
        </div>
      </Section>
      <Divider />
      <Section label="Swatches">
        <SwatchControls
          fillColor={fillHex}
          strokeColor={strokeHex}
          activePaint="fill"
          onSwap={swap}
          onClear={clear}
          sampleColor={fillHex}
          onPick={pick}
        />
      </Section>
      <Divider />
      <Section label="Hex">
        {/* ColorInputRow emits #UPPER per keystroke — only fold complete hexes into HSV */}
        <ColorInputRow value={fillHex} onChange={(h) => { if (/^#[0-9A-F]{6}$/.test(h)) setFill(hexToHsv(h)) }} label="Fill" />
      </Section>
    </div>
  )
}
