import { useState } from 'react'
import { findLayerDeep, useColorTarget, useComposeState, useLayerEdit } from '../engine.js'
import WindowPane from './WindowPane.jsx'
import { eyedrop } from './eyedrop.jsx'
import { Button, Dropdown, Input, LabeledControl, Slider, WheelTriangle, SBSquare, HueStrip, hexToHsva, hsvaToHex } from '@kolkrabbi/kol-component'

/* the window's own hsv (h 0..360, s and v 0..1) on KOL's color math (W31.2 batch 5: kolbox's ColorField helpers moved) */
const hexToHsv = (hex) => { const c = hexToHsva(hex) ?? { hue: 0, sat: 0, val: 0 }; return { h: c.hue, s: c.sat / 100, v: c.val / 100 } }
const hsvToHex = ({ h, s, v }) => hsvaToHex({ hue: h, sat: s * 100, val: v * 100 })

/* Color, as the real ColourBody (color/ColourPanel.jsx), on the engine's colour target (useColorTarget: the app's fill
   and stroke pair, written to the selected layer or the canvas, drags coalesced to one undo step). In its order: the
   top row (the fill and stroke swatches with the focused one in front, swap and None; the eyedropper; Opacity), the
   view picker (Hue, Wheel, HSL, RGB), then the view: Hue is the hue strip over the saturation and brightness square,
   HSL and RGB three slider rows, Wheel the real one's wheel and triangle (ColorWheel, the real WheelMode's writes). */
const MODES = [{ value: 'hue', label: 'Hue' }, { value: 'wheel', label: 'Wheel' }, { value: 'hsl', label: 'HSL' }, { value: 'rgb', label: 'RGB' }]

const rgbOf = (hex) => { const n = parseInt(hex.replace('#', '').slice(0, 6), 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 } }
const hexOfRgb = ({ r, g, b }) => '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('').toUpperCase()
function hslOf(hex) {
  const { r, g, b } = rgbOf(hex), R = r / 255, G = g / 255, B = b / 255
  const max = Math.max(R, G, B), min = Math.min(R, G, B), l = (max + min) / 2, d = max - min
  if (!d) return { h: 0, s: 0, l: l * 100 }
  const s = d / (1 - Math.abs(2 * l - 1))
  const h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4
  return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 }
}
function hexOfHsl({ h, s, l }) {
  const S = s / 100, L = l / 100, k = (n) => (n + h / 30) % 12, a = S * Math.min(L, 1 - L)
  const f = (n) => L - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return hexOfRgb({ r: f(0) * 255, g: f(8) * 255, b: f(4) * 255 })
}

/* the paint pair: the focused paint in front; a press on the back one brings it forward, swap trades them, None clears
   the focused one */
function SwatchStack({ target }) {
  const { activePaint, fillHex, strokeHex, swap, setActivePaint } = target
  const chip = (paint, hex) => (
    <button type="button" aria-label={paint === 'fill' ? 'Fill' : 'Stroke'} aria-pressed={activePaint === paint} onClick={() => setActivePaint(paint)}
      className={`absolute size-5 rounded-xs outline-none ring-1 ring-border focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent ${paint === 'fill' ? 'top-0 left-0' : 'right-0 bottom-0'} ${activePaint === paint ? 'z-10' : ''} ${hex ? '' : 'kol-kolbox-checker'}`}
      style={hex ? (paint === 'fill' ? { background: hex } : { boxShadow: `inset 0 0 0 4px ${hex}` }) : undefined} />
  )
  return (
    <div className="flex items-center gap-1" data-swatch-stack>
      <span className="relative size-7 shrink-0">{chip('fill', fillHex)}{chip('stroke', strokeHex)}</span>
      <Button variant="kolbox" iconOnly="swap" aria-label="Swap fill and stroke" onClick={swap}/>
      <Button variant="kolbox" iconOnly="x" aria-label="None" onClick={() => target.onChange(null)}/>
    </div>
  )
}

/* Opacity at the top row's right: the selected layer's opacity, the canvas fill's, else held here, as the real one */
function OpacityField() {
  const { selectedId, layers, canvasFillOpacity, setCanvasFillOpacity } = useComposeState()
  const isCanvas = selectedId === 'canvas'
  const layer = !isCanvas && selectedId ? findLayerDeep(layers, selectedId) : null
  const edit = useLayerEdit(layer && !layer.locked ? layer.id : null, { history: 'coalesce' })
  const [local, setLocal] = useState(100)
  const value = isCanvas ? Math.round((canvasFillOpacity ?? 1) * 100) : layer ? Math.round((layer.opacity ?? 1) * 100) : local
  const onChange = isCanvas ? (v) => setCanvasFillOpacity(v / 100) : layer ? (v) => edit.setProp('opacity', v / 100) : setLocal
  return (
    <label className="ml-auto flex items-center gap-2">
      <span className="text-help text-muted">Opacity</span>
      <Input variant="kolbox" key={value} aria-label="Opacity" defaultValue={`${value}%`} className="w-16"
        onBlur={(e) => { const v = Math.round(parseFloat(e.target.value)); if (Number.isFinite(v)) onChange(Math.max(0, Math.min(100, v))); else e.target.value = `${value}%` }}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} />
    </label>
  )
}

const Row = ({ label, value, max, unit = '', onChange }) => (
  <LabeledControl variant="kolbox" horizontal label={label}><Slider variant="kolbox" className="min-w-0 flex-1" aria-label={label} min={0} max={max} value={Math.round(value)} formatValue={(v) => `${v}${unit}`} onChange={onChange} /></LabeledControl>
)

export default function WindowColor({ onClose }) {
  const target = useColorTarget({ history: 'coalesce' })
  /* W7: Add style keeps the color in front as a color style of the file */
  const { saveStyle } = useComposeState()
  const [mode, setMode] = useState('hue')
  const hex = target.hex
  const set = (next) => target.onChange(next.toUpperCase())
  const hsv = hexToHsv(hex)
  return (
    <WindowPane title="Color" name="color" onClose={onClose}>
      <div className="flex items-center gap-1">
        <SwatchStack target={target} />
        <Button variant="kolbox" iconOnly="eyedropper" aria-label="Eyedropper" onClick={eyedrop}/>
        <OpacityField />
      </div>
      <Dropdown variant="kolbox" ariaLabel="Color view" options={MODES} value={mode} onChange={setMode} className="w-full" />
      {mode === 'hue' && (
        <div className="flex flex-col gap-3" data-color-view="hue">
          <HueStrip variant="kolbox" hue={hsv.h} onChange={(h) => set(hsvToHex({ ...hsv, h }))} />
          <SBSquare variant="kolbox" hue={hsv.h} sat={hsv.s * 100} val={hsv.v * 100} onChange={(sat, val) => set(hsvToHex({ ...hsv, s: sat / 100, v: val / 100 }))} className="rounded-control" />
        </div>
      )}
      {mode === 'wheel' && (
        <div className="flex flex-col" data-color-view="wheel">
          <WheelTriangle variant="kolbox" hue={hsv.h} sat={hsv.s * 100} val={hsv.v * 100}
            onChangeHue={(h) => set(hsvToHex({ ...hsv, h }))}
            onChangeSV={(s, v) => set(hsvToHex({ h: hsv.h, s: s / 100, v: v / 100 }))} />
        </div>
      )}
      {mode === 'rgb' && (() => {
        const c = rgbOf(hex)
        return (
          <div className="flex flex-col gap-2" data-color-view="rgb">
            {['r', 'g', 'b'].map((k) => <Row key={k} label={k.toUpperCase()} value={c[k]} max={255} onChange={(v) => set(hexOfRgb({ ...c, [k]: v }))} />)}
          </div>
        )
      })()}
      {mode === 'hsl' && (() => {
        const c = hslOf(hex)
        return (
          <div className="flex flex-col gap-2" data-color-view="hsl">
            <Row label="H" value={c.h} max={360} unit="°" onChange={(v) => set(hexOfHsl({ ...c, h: v }))} />
            <Row label="S" value={c.s} max={100} unit="%" onChange={(v) => set(hexOfHsl({ ...c, s: v }))} />
            <Row label="L" value={c.l} max={100} unit="%" onChange={(v) => set(hexOfHsl({ ...c, l: v }))} />
          </div>
        )
      })()}
      {hex && <Button variant="kolbox" className="w-full" onClick={() => saveStyle('color', { color: hex, opacity: 1 })}>Add style</Button>}
    </WindowPane>
  )
}
