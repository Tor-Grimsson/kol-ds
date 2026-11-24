import { useState } from 'react'
import { AlphaStrip, HueStrip, SBSquare, SpectrumControls, WheelTriangle } from '@kolkrabbi/kol-component'

export const stage = 'md'
/* kolbox (W31.2): WheelTriangle's kolbox handles and focus ring; batch 5: SBSquare, HueStrip and AlphaStrip kolbox (kolbox's color field and its two runs) */
export const variants = ['default', 'kolbox']

/* HSV → CSS rgb() for the live preview swatch. HSV isn't a CSS color space,
 * so the spectrum's { hue, sat, val } is converted here at the call site
 * (the picker family stays color-math-only and never renders a preview). */
function hsvCss(h, s, v) {
  s /= 100
  v /= 100
  const c = v * s
  const hh = ((h % 360) + 360) % 360 / 60
  const x = c * (1 - Math.abs((hh % 2) - 1))
  const [r, g, b] =
    hh < 1 ? [c, x, 0] :
    hh < 2 ? [x, c, 0] :
    hh < 3 ? [0, c, x] :
    hh < 4 ? [0, x, c] :
    hh < 5 ? [x, 0, c] : [c, 0, x]
  const m = v - c
  const to255 = (n) => Math.round((n + m) * 255)
  return `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`
}

export default function SpectrumControlsPreview({ variant = 'default' }) {
  const [hsv, setHsv] = useState({ hue: 210, sat: 72, val: 90 })
  const { hue, sat, val } = hsv
  const preview = hsvCss(hue, sat, val)

  return (
    <div className="flex flex-wrap items-start gap-8">
      {variant === 'kolbox' && (
        <div className="flex w-52 flex-col gap-3">
          <SBSquare variant="kolbox" hue={hue} sat={sat} val={val} onChange={(s2, v2) => setHsv({ ...hsv, sat: s2, val: v2 })} className="rounded-sm" />
          <HueStrip variant="kolbox" hue={hue} onChange={(h) => setHsv({ ...hsv, hue: h })} />
          <AlphaStrip variant="kolbox" alpha={1} color={preview} />
        </div>
      )}
      {/* Composed classic picker — HueStrip over a fill-height SBSquare. */}
      <div style={{ width: 240, height: 240 }}>
        <SpectrumControls value={hsv} onChange={setHsv} />
      </div>

      {/* Ring picker — the same HSV state driven by WheelTriangle. */}
      <div style={{ width: 220, height: 220 }}>
        <WheelTriangle
          variant={variant}
          hue={hue}
          sat={sat}
          val={val}
          onChangeHue={(h) => setHsv((p) => ({ ...p, hue: h }))}
          onChangeSV={(s, v) => setHsv((p) => ({ ...p, sat: s, val: v }))}
        />
      </div>

      {/* Live preview + HSV readout at the call site. */}
      <div className="flex flex-col gap-2">
        <div
          className="rounded"
          style={{ width: 96, height: 96, background: preview, boxShadow: 'inset 0 0 0 1px var(--kol-fg-12)' }}
        />
        <p className="kol-mono-12 text-fg-48">{`H ${Math.round(hue)}° · S ${Math.round(sat)}% · B ${Math.round(val)}%`}</p>
      </div>
    </div>
  )
}
