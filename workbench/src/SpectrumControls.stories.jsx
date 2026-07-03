import { useState } from 'react'
import { SpectrumControls, HueStrip, SBSquare, WheelTriangle } from '@kolkrabbi/kol-component'

/* HSV → CSS rgb() for the live preview swatch (HSV isn't a CSS color space). */
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

const Swatch = ({ hue, sat, val }) => (
  <div
    style={{ width: 40, height: 40, borderRadius: 6, background: hsvCss(hue, sat, val), boxShadow: 'inset 0 0 0 1px var(--kol-fg-12)' }}
  />
)

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>{children}</div>
)

/* HueStrip — 1D hue slider. */
export const Hue = () => {
  const [hue, setHue] = useState(210)
  return (
    <Row>
      <div style={{ width: 260 }}>
        <HueStrip hue={hue} onChange={setHue} />
      </div>
      <Swatch hue={hue} sat={100} val={100} />
    </Row>
  )
}

/* SBSquare — 2D saturation/value picker. Consumer owns the size and the
 * rounding (rounded-[2px] overflow-hidden on the wrapper). */
export const SaturationBrightness = () => {
  const [sv, setSv] = useState({ sat: 72, val: 90 })
  const hue = 210
  return (
    <Row>
      <div className="rounded-[2px] overflow-hidden" style={{ width: 220, height: 220 }}>
        <SBSquare hue={hue} sat={sv.sat} val={sv.val} onChange={(sat, val) => setSv({ sat, val })} />
      </div>
      <Swatch hue={hue} sat={sv.sat} val={sv.val} />
    </Row>
  )
}

/* WheelTriangle — hue ring + inscribed rotating HSV triangle. */
export const Wheel = () => {
  const [hsv, setHsv] = useState({ hue: 210, sat: 72, val: 90 })
  return (
    <Row>
      <div style={{ width: 240, height: 240 }}>
        <WheelTriangle
          hue={hsv.hue}
          sat={hsv.sat}
          val={hsv.val}
          onChangeHue={(hue) => setHsv((p) => ({ ...p, hue }))}
          onChangeSV={(sat, val) => setHsv((p) => ({ ...p, sat, val }))}
        />
      </div>
      <Swatch {...hsv} />
    </Row>
  )
}

/* Composed default export — HueStrip stacked over a fill-height SBSquare. */
export const Composed = () => {
  const [hsv, setHsv] = useState({ hue: 210, sat: 72, val: 90 })
  return (
    <Row>
      <div style={{ width: 240, height: 240 }}>
        <SpectrumControls value={hsv} onChange={setHsv} />
      </div>
      <Swatch {...hsv} />
    </Row>
  )
}
