import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { findLayerDeep, pickFromCanvas, resolveColor, resolveCssVar, useColorTarget, useComposeState, useLayerEdit } from './engine.js'
import Button from '../ui/Button.jsx'
import ColorSwatch from '../ui/ColorSwatch.jsx'
import FieldRow from '../ui/FieldRow.jsx'
import Input from '../ui/Input.jsx'
import InputNumber from '../ui/InputNumber.jsx'
import Segmented from '../ui/Segmented.jsx'
import Select from '../ui/Select.jsx'
import Slider from '../ui/Slider.jsx'
import Stepper from '../ui/Stepper.jsx'
import SwatchStack from '../ui/SwatchStack.jsx'
import { HueRing, HueStrip, SBSquare, hexToHsl, hexToHsv, hexToRgb, hslToHex, hsvToHex, rgbToHex } from '../ui/ColorSpectrum.jsx'

/* The left rail's first pane, as the real one is: Stroke, Color, Swatches (the package's StrokeBody, ColourBody and
   SwatchesBody), every write the package's own (the paint pair through useColorTarget, the stroke through useLayerEdit). */

/* ── Stroke ── */
const STROKEABLE = new Set(['shape', 'text', 'pattern'])
const DASH = { solid: '', dashed: '8 6', dotted: '2 6' }
const styleOf = (dash, cap) => (!dash ? 'solid' : cap === 'round' && /^[0-2]\s+[3-9]/.test(dash) ? 'dotted' : 'dashed')
const line = (dash) => <svg width="32" height="2" viewBox="0 0 32 2" className="block"><line x1="0" y1="1" x2="32" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray={dash} /></svg>
const dots = <svg width="32" height="3" viewBox="0 0 32 3" className="block">{[3, 11, 19, 27].map((cx) => <circle key={cx} cx={cx} cy="1.5" r="1.25" fill="currentColor" />)}</svg>
const STYLES = [{ value: 'solid', ariaLabel: 'Solid', label: <span className="flex justify-center">{line()}</span> }, { value: 'dashed', ariaLabel: 'Dashed', label: <span className="flex justify-center">{line('4 3')}</span> }, { value: 'dotted', ariaLabel: 'Dotted', label: <span className="flex justify-center">{dots}</span> }]
const CAPS = [{ value: 'butt', label: 'Butt' }, { value: 'round', label: 'Round' }, { value: 'square', label: 'Square' }]
const JOINS = [{ value: 'miter', label: 'Miter' }, { value: 'round', label: 'Round' }, { value: 'bevel', label: 'Bevel' }]

export function StrokeTab() {
  const { selectedId, layers } = useComposeState()
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  const ok = !!layer && STROKEABLE.has(layer.type) && !layer.locked
  const edit = useLayerEdit(ok ? layer.id : null, { history: 'coalesce' })
  const set = ok ? edit.setProp : () => {}
  const cap = layer?.strokeLinecap ?? 'butt'
  const onWeight = (v) => {
    const n = Math.max(0, Math.min(64, Number(v) || 0))
    if (n > 0 && ok && !layer.stroke) edit.patch({ strokeWidth: n, stroke: '#000000' })
    else set('strokeWidth', n)
  }
  const onStyle = (s) => { if (ok) edit.patch({ strokeDasharray: DASH[s] ?? '', strokeLinecap: s === 'dotted' ? 'round' : (cap === 'round' ? 'butt' : cap) }) }
  return (
    <div className="flex flex-col gap-2 p-4">
      <FieldRow label="Weight"><InputNumber unit="pt" chars={4} value={layer?.strokeWidth ?? 0} onCommit={onWeight} aria-label="Weight" /></FieldRow>
      <FieldRow label="Style"><Segmented className="flex-1" options={STYLES} value={styleOf(layer?.strokeDasharray ?? '', cap)} onChange={onStyle} /></FieldRow>
      <FieldRow label="Cap"><Segmented className="flex-1" options={CAPS} value={cap} onChange={(v) => set('strokeLinecap', v)} /></FieldRow>
      <FieldRow label="Join"><Segmented className="flex-1" options={JOINS} value={layer?.strokeLinejoin ?? 'miter'} onChange={(v) => set('strokeLinejoin', v)} /></FieldRow>
    </div>
  )
}

/* ── Color ── */
const MODES = [{ value: 'hue', label: 'Hue' }, { value: 'wheel', label: 'Wheel' }, { value: 'hsl', label: 'HSL' }, { value: 'rgb', label: 'RGB' }]

function Opacity() {
  const { selectedId, layers, canvasFillOpacity, setCanvasFillOpacity } = useComposeState()
  const isCanvas = selectedId === 'canvas'
  const layer = !isCanvas && selectedId ? findLayerDeep(layers, selectedId) : null
  const edit = useLayerEdit(layer && !layer.locked ? layer.id : null, { history: 'coalesce' })
  const [local, setLocal] = useState(100)
  const value = isCanvas ? Math.round((canvasFillOpacity ?? 1) * 100) : layer ? Math.round((layer.opacity ?? 1) * 100) : local
  const onChange = isCanvas ? (v) => setCanvasFillOpacity(v / 100) : layer ? (v) => edit.setProp('opacity', v / 100) : setLocal
  return (
    <label className="ml-auto flex items-center gap-2">
      <span className="text-label text-muted">Opacity</span>
      <Stepper value={value} onChange={onChange} aria-label="Opacity" />
    </label>
  )
}

function ChannelRow({ label, value, max, onChange, unit = '' }) {
  return <FieldRow label={label}><Slider value={value} min={0} max={max} step={1} format={(v) => `${Math.round(v)}${unit}`} onChange={onChange} /></FieldRow>
}

export function ColorTab() {
  const target = useColorTarget({ history: 'coalesce' })
  const { layers, palette, aspect, customRatio, canvasFill } = useComposeState()
  const [mode, setMode] = useState('hue')
  const set = (hex) => target.onChange(hex.toUpperCase())
  const hsv = hexToHsv(target.hex)
  /* the hue a grey has no way to hold: kept while the square sits on the grey edge */
  const hueRef = useRef(hsv.h)
  if (hsv.s > 0 && hsv.v > 0) hueRef.current = hsv.h
  const hue = hueRef.current

  const onPick = async () => {
    try {
      const fillHex = typeof canvasFill === 'string' && canvasFill.startsWith('var(') ? null : (resolveColor(canvasFill, palette) ?? null)
      const hex = await pickFromCanvas({ layers, palette, aspect, customRatio, canvasFillHex: fillHex })
      if (hex) target.onChange(hex)
    } catch { /* nothing sampled */ }
  }
  const pick = useRef(onPick); pick.current = onPick
  useEffect(() => {
    const on = () => pick.current()
    window.addEventListener('kol:eyedrop', on)
    return () => window.removeEventListener('kol:eyedrop', on)
  }, [])

  const rgb = hexToRgb(target.hex)
  const hsl = hexToHsl(target.hex)
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <SwatchStack fillColor={target.fillHex ?? '#FFFFFF'} strokeColor={target.strokeHex ?? '#000000'} activePaint={target.activePaint}
          onPick={target.setActivePaint} onSwap={target.swap} onClear={() => target.onChange(null)} />
        <Button icon="eyedrop" aria-label="Eyedropper" title="Eyedropper (I)" onClick={onPick} />
        <Opacity />
      </div>
      <Select value={mode} options={MODES} onChange={setMode} />
      {mode === 'hue' && (
        <>
          <HueStrip hue={hue} onChange={(h) => { hueRef.current = h; set(hsvToHex({ h, s: hsv.s, v: hsv.v })) }} />
          <SBSquare hue={hue} sat={hsv.s} val={hsv.v} onChange={(s, v) => set(hsvToHex({ h: hue, s, v }))} className="h-[84px] shrink-0" />
        </>
      )}
      {mode === 'wheel' && (
        <HueRing hue={hue} sat={hsv.s} val={hsv.v}
          onChangeHue={(h) => { hueRef.current = h; set(hsvToHex({ h, s: hsv.s, v: hsv.v })) }}
          onChangeSV={(s, v) => set(hsvToHex({ h: hue, s, v }))} />
      )}
      {mode === 'rgb' && (
        <div className="flex flex-col gap-2">
          <ChannelRow label="R" value={rgb.r} max={255} onChange={(r) => set(rgbToHex({ ...rgb, r }))} />
          <ChannelRow label="G" value={rgb.g} max={255} onChange={(g) => set(rgbToHex({ ...rgb, g }))} />
          <ChannelRow label="B" value={rgb.b} max={255} onChange={(b) => set(rgbToHex({ ...rgb, b }))} />
        </div>
      )}
      {mode === 'hsl' && (
        <div className="flex flex-col gap-2">
          <ChannelRow label="H" unit="°" value={hsl.h} max={360} onChange={(h) => set(hslToHex({ ...hsl, h }))} />
          <ChannelRow label="S" unit="%" value={hsl.s} max={100} onChange={(s) => set(hslToHex({ ...hsl, s }))} />
          <ChannelRow label="L" unit="%" value={hsl.l} max={100} onChange={(l) => set(hslToHex({ ...hsl, l }))} />
        </div>
      )}
    </div>
  )
}

/* ── Swatches ── the package keeps its recent and custom lists in its own module; they are kept here the same way,
   custom in the same storage key */
const FG = ['01', '02', '04', '08', '12', '16', '24', '32', '40', '48', '64', '80', '88', '96']
const GREY = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
const FIVE = ['100', '200', '300', '400', '500']
const STANDARD = [
  '#000000', '#262626', '#525252', '#737373', '#A3A3A3', '#D4D4D4', '#E5E5E5', '#FFFFFF',
  '#7F1D1D', '#B91C1C', '#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2',
  '#78350F', '#B45309', '#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7',
  '#14532D', '#15803D', '#16A34A', '#22C55E', '#4ADE80', '#86EFAC', '#BBF7D0', '#DCFCE7',
  '#1E3A8A', '#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE',
  '#581C87', '#7E22CE', '#9333EA', '#A855F7', '#C084FC', '#D8B4FE', '#E9D5FF', '#F3E8FF',
]
const PALETTES = [{ value: 'ac', label: 'AC' }, { value: 'standard', label: 'Standard' }, { value: 'custom', label: 'Custom' }]
const FIXED = [{ hex: null, name: 'None' }, { hex: '#000000', name: 'Black' }, { hex: '#808080', name: 'Grey' }, { hex: '#FFFFFF', name: 'White' }]
const CUSTOM_KEY = 'kol.editor.swatches'
let recent = []
let custom = (() => { try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) ?? [] } catch { return [] } })()
const subs = new Set()
const emit = () => subs.forEach((f) => f())
const useSwatches = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => recent.join() + '|' + custom.join())

export function SwatchesTab() {
  const target = useColorTarget()
  const currentHex = target.hex
  const [palette, setPalette] = useState('ac')
  const [query, setQuery] = useState('')
  useSwatches()
  const swatches = useMemo(() => {
    if (palette === 'custom') return custom.map((hex) => ({ hex, name: hex }))
    if (palette === 'standard') return STANDARD.map((hex) => ({ hex, name: hex }))
    const bank = (stops, v, label) => stops.map((st) => ({ hex: resolveCssVar(v(st)), name: `${label} ${st}` }))
    return [...bank(FG, (s) => `--kol-fg-${s}`, 'fg'), ...bank(FIVE, (s) => `--kol-color-red-${s}`, 'red'), ...bank(FIVE, (s) => `--kol-color-cream-${s}`, 'cream'), ...bank(GREY, (s) => `--grey-${s}`, 'grey'), { hex: '#FFFFFF', name: 'white' }, { hex: '#000000', name: 'black' }].filter((x) => x.hex)
  }, [palette, custom]) // eslint-disable-line react-hooks/exhaustive-deps
  const q = query.trim().toLowerCase()
  const shown = q ? swatches.filter((x) => x.name.toLowerCase().includes(q) || x.hex.toLowerCase().includes(q)) : swatches
  const pick = (hex) => {
    if (hex) { recent = [hex, ...recent.filter((h) => h !== hex)].slice(0, 8); emit() }
    target.onChange(hex ? hex.toUpperCase() : null)
  }
  const add = () => {
    if (!currentHex || custom.includes(currentHex)) return
    custom = [...custom, currentHex]
    try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom)) } catch { /* private mode */ }
    emit(); setPalette('custom')
  }
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-label text-muted">Recent</span>
        <div className="flex h-5 min-w-0 flex-1 items-center gap-1 rounded-inner bg-field px-0.5">
          {recent.map((hex) => <ColorSwatch key={hex} hex={hex} title={hex} onClick={() => pick(hex)} />)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Select value={palette} options={PALETTES} onChange={setPalette} />
        <span className={currentHex ? 'contents' : 'invisible pointer-events-none'}><Button icon="plus" aria-label="Add swatch" onClick={add} /></span>
        {FIXED.map((f) => <ColorSwatch key={f.name} hex={f.hex} title={f.name} onClick={() => pick(f.hex)} />)}
      </div>
      <div className="grid grid-cols-8 gap-1">
        {shown.map(({ hex, name }, i) => <ColorSwatch key={`${hex}-${i}`} hex={hex} size="fill" title={name} onClick={() => pick(hex)} />)}
      </div>
      {palette === 'custom' && custom.length === 0 && <span className="text-label text-faint">Add the current colour with +</span>}
      <Input placeholder="Search" aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
    </div>
  )
}
