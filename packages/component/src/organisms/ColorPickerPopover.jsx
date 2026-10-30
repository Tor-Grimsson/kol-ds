import { useEffect, useRef, useState } from 'react'
import ColorSwatch from '../molecules/ColorSwatch.jsx'
import Input from '../atoms/Input.jsx'
import Slider from '../molecules/Slider.jsx'
import Dropdown from '../molecules/Dropdown.jsx'
import { Icon } from '@kolkrabbi/kol-icons'
import { usePopover, PopoverPanel } from '../utilities/Popover.jsx'
import { HueStrip, SBSquare, AlphaStrip } from './SpectrumControls.jsx'
import { hexToHsva, hsvaToHex } from '../hooks/colorMath.js'
import { resolveCssColor } from '../hooks/cssVar.js'

/* taxonomy-ok: organism — composes the SpectrumControls family (an organism) with a swatch and the hex Input */

const SWATCH = { xs: 16, sm: 24 }

/* ── THE MODES (review 3, 2026-10-29, Adobe's — the user: *"which mode? HEX HSL HSB GREYSCALE? like everything is
 * missing?"*): HEX · RGB · HSB · Lab, each channel a gradient strip with its thumb and its number ── */
export const PICKER_MODES = [{ value: 'hex', label: 'HEX' }, { value: 'rgb', label: 'RGB' }, { value: 'hsb', label: 'HSB' }, { value: 'lab', label: 'Lab' }]
const rgbOf = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const hexOf = (rgb) => '#' + rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('').toUpperCase()
/* CIE Lab (D65) ↔ sRGB */
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const gam = (c) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
const W = [0.95047, 1, 1.08883]
const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116)
const fi = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27))
function hexToLab(hex) {
  const [r, g, b] = rgbOf(hex).map(lin)
  const xyz = [0.4124 * r + 0.3576 * g + 0.1805 * b, 0.2126 * r + 0.7152 * g + 0.0722 * b, 0.0193 * r + 0.1192 * g + 0.9505 * b].map((v, i) => f(v / W[i]))
  return [116 * xyz[1] - 16, 500 * (xyz[0] - xyz[1]), 200 * (xyz[1] - xyz[2])]
}
function labToHex([L, a, bb]) {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - bb / 200
  const [x, y, z] = [fi(fx) * W[0], fi(fy) * W[1], fi(fz) * W[2]]
  return hexOf([3.2406 * x - 1.5372 * y - 0.4986 * z, -0.9689 * x + 1.8758 * y + 0.0415 * z, 0.0557 * x - 0.2040 * y + 1.0570 * z].map(gam))
}
/* a mode's three channels: name, range, read from the hsva, write back as a hex */
const CHANNELS = {
  rgb: [0, 1, 2].map((i) => ({ key: 'RGB'[i], min: 0, max: 255, read: (hex) => rgbOf(hex)[i], write: (hex, v) => { const c = rgbOf(hex); c[i] = v; return hexOf(c) } })),
  hsb: [
    { key: 'H', min: 0, max: 360, read: (_, h) => h.hue, write: null, hsva: (h, v) => ({ ...h, hue: v }) },
    { key: 'S', min: 0, max: 100, read: (_, h) => h.sat, write: null, hsva: (h, v) => ({ ...h, sat: v }) },
    { key: 'B', min: 0, max: 100, read: (_, h) => h.val, write: null, hsva: (h, v) => ({ ...h, val: v }) },
  ],
  lab: [
    { key: 'L', min: 0, max: 100, read: (hex) => hexToLab(hex)[0], write: (hex, v) => { const l = hexToLab(hex); l[0] = v; return labToHex(l) } },
    { key: 'a', min: -128, max: 127, read: (hex) => hexToLab(hex)[1], write: (hex, v) => { const l = hexToLab(hex); l[1] = v; return labToHex(l) } },
    { key: 'b', min: -128, max: 127, read: (hex) => hexToLab(hex)[2], write: (hex, v) => { const l = hexToLab(hex); l[2] = v; return labToHex(l) } },
  ],
}

/* one channel: its letter, a strip painted with the channel's own range at the current colour, a thumb, its number */
/* brightness — Adobe's ☀ ramp under the hue strip in HEX and RGB: HSV value, black to the colour at full brightness */
const BRIGHTNESS = { key: 'B', label: 'Brightness', icon: 'brightness', min: 0, max: 100, read: (_, h) => h.val, write: null, hsva: (h, v) => ({ ...h, val: v }) }

function ChannelStrip({ ch, hex, hsva, onHsva }) {
  const ref = useRef(null)
  const value = ch.read(hex, hsva)
  const at = (v) => (ch.hsva ? hsvaToHex({ ...ch.hsva(hsva, v), alpha: 1 }) : ch.write(hex, v))
  const stops = Array.from({ length: 9 }, (_, i) => at(ch.min + ((ch.max - ch.min) * i) / 8).slice(0, 7))
  const set = (v) => {
    const n = Math.min(ch.max, Math.max(ch.min, v))
    onHsva(ch.hsva ? ch.hsva(hsva, n) : { ...hexToHsva(ch.write(hex, n)), alpha: hsva.alpha })
  }
  const fromPointer = (e) => { const r = ref.current.getBoundingClientRect(); set(ch.min + ((e.clientX - r.left) / r.width) * (ch.max - ch.min)) }
  const pct = ((value - ch.min) / (ch.max - ch.min)) * 100
  return (
    <div className="flex items-center gap-2">
      <span className="flex w-4 shrink-0 items-center kol-mono-12 text-meta">{ch.icon ? <Icon name={ch.icon} size={16} className="text-oq-64" /> : ch.key}</span>
      <div ref={ref} role="slider" aria-label={ch.label ?? ch.key} aria-valuemin={ch.min} aria-valuemax={ch.max} aria-valuenow={Math.round(value)} tabIndex={0}
        className="relative h-4 flex-1 cursor-pointer rounded-full touch-none" style={{ background: `linear-gradient(to right, ${stops.join(', ')})` }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); fromPointer(e) }}
        onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e) }}
        onKeyDown={(e) => { const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]; if (d) { e.preventDefault(); set(value + d * (e.shiftKey ? 10 : 1)) } }}>
        <span className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${pct}%`, boxShadow: '0 0 0 2px #fff, 0 0 0 3px rgba(0,0,0,0.35)', background: hex.slice(0, 7) }} />
      </div>
      {/* the box is 56 wide by the Input's own `width` — a utility width was not honoured in a consumer (ref 81), and `chars`
        * alone did not hold against the row's flex (0.317.2, seen in the review-8 pass) */}
      <Input size="sm" type="number" chars={3} width="56px" value={Math.round(value)} aria-label={`${ch.label ?? ch.key} value`} onChange={(e) => { const v = Number(e.target.value); if (!Number.isNaN(v)) set(v) }} />
    </div>
  )
}
const PANEL_W = 180

/* the browser's computed `rgb()` / `rgba()` → '#RRGGBB(AA)' — for `currentColor` and tokens */
function cssToHex(css) {
  const n = css.match(/[\d.]+/g)
  if (!n || n.length < 3) return '#000000'
  return hsvaToHex({ ...hexToHsva('#' + n.slice(0, 3).map((v) => Math.round(+v).toString(16).padStart(2, '0')).join('')), alpha: n[3] != null ? +n[3] : 1 })
}

/**
 * ColorPickerPopover — A swatch that opens a colour picker. Click the swatch: a popover with the
 * saturation square, hue and opacity strips, and the hex under them (ColorPickerPopover, kol-monitor
 * 2026-10-17 — the estate's only click-a-colour-in picker was monitor's local react-colorful atom).
 * Built on the KOL's own `SpectrumControls` family plus `AlphaStrip`, so no picker dependency.
 *
 * The swatch paints `color` live — a `var(--kol-*)` or `currentColor` follows the theme by CSS, no
 * observer. Opening resolves it once against the swatch for the picker. Placement is `usePopover`'s:
 * right-aligned under the swatch, flipping up where there is no room. Esc and an outside press close
 * it; ⌥-click on the swatch resets to `defaultValue` instead of opening.
 *
 * @param {string}   color         '#RRGGBB' · '#RRGGBBAA' · 'transparent' / empty (none) · any CSS colour
 * @param {Function} onChange      (hex) => void — every drag, and every complete 6- or 8-digit hex typed.
 *                                 Uppercase; 8 digits only when opacity < 100%
 * @param {string}   [defaultValue] ⌥-click on the swatch resets to it
 * @param {'xs'|'sm'} [size='xs']  swatch 16 · 24
 * @param {string}   [label='Color'] the swatch's accessible name
 * @param {ReactNode} [trigger]    what opens the panel instead of the swatch — any node, drawn inside the button (the lab's
 *                                 hex, Adobe's "Edit color": BrandLabToolWindow 2026-10-29). The panel is the same
 * @param {string}   [placement='bottom-end']  where the panel opens
 * @param {boolean}  [alpha=true]  the opacity strip
 * @param {boolean}  [brightness=false]  a brightness row under the hue (HSV value, 0–100, with its number) — Adobe's
 * @param {boolean}  [inline=false] the panel IN the page, no swatch and no popover — the same square, strips and hex,
 *                                 filling its column (the lab's Base color tab, 2026-10-29)
 * @param {ReactNode} [hexEnd]     inline only: a control at the end of the hex row (the lab's base lock)
 * @param {boolean}  [modes=false]  a head row — `title` and a mode Dropdown, HEX · RGB · HSB · Lab — and, under the square and
 *                                 the hue, that mode's fields: the hex, or three channel strips with their numbers (Adobe's)
 * @param {string}   [title]       the head row's name ("Base", "Edit color")
 */
export default function ColorPickerPopover({ color, onChange, defaultValue, size = 'xs', label = 'Color', trigger, placement = 'bottom-end', alpha = true, brightness = false, inline = false, hexEnd, modes = false, title, className = '' }) {
  const [mode, setMode] = useState('hex')
  const isNone = !color || color === 'transparent'
  const [open, setOpen] = useState(false)
  const [hsva, setHsva] = useState(null)
  const [draft, setDraft] = useState('')

  const popover = usePopover({
    open,
    placement,
    offset: 4,
    onOpenChange: (next, event) => {
      if (next && event?.altKey) {
        if (defaultValue !== undefined) onChange?.(defaultValue)
        return
      }
      if (next) {
        /* the working copy is HSVA, kept while open — so the hue survives a drag to grey */
        const literal = isNone ? '#000000'
          : hexToHsva(color) ? color
          : cssToHex(resolveCssColor(color, popover.refs.reference.current))
        const h = hexToHsva(literal) ?? { hue: 0, sat: 0, val: 0, alpha: 1 }
        setHsva(h)
        setDraft(hsvaToHex(h).slice(1))
      }
      setOpen(next)
    },
  })

  const commit = (next) => {
    setHsva(next)
    const hex = hsvaToHex(next)
    setDraft(hex.slice(1))
    onChange?.(hex)
  }

  const onHex = (e) => {
    const digits = e.target.value.replace(/[^0-9a-f]/gi, '').slice(0, 8).toUpperCase()
    setDraft(digits)
    const next = (digits.length === 6 || digits.length === 8) && hexToHsva(digits)
    if (next) { setHsva(next); onChange?.('#' + digits) }
  }

  const opaque = hsva && hsvaToHex({ ...hsva, alpha: 1 })

  /* INLINE: the working copy follows `color` whenever it changes from outside (a roll, an undo) */
  useEffect(() => {
    if (!inline) return
    const literal = isNone ? '#000000' : hexToHsva(color) ? color : '#000000'
    if (hsva && hsvaToHex(hsva).slice(0, 7).toUpperCase() === literal.slice(0, 7).toUpperCase()) return
    const h = hexToHsva(literal) ?? { hue: 0, sat: 0, val: 0, alpha: 1 }
    setHsva(h)
    setDraft(hsvaToHex(h).slice(1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inline, color])

  const hexField = (
    /* no variant: the field takes the nearest `kol-tone-*` wrapper (a toned rail), filled where there is none (review 3 —
     * *"input is invisible, just set tone to sunken … so you dont have to set it individually"*) */
    <Input size="sm" prefix="#" maxLength={8} value={draft} onChange={onHex} aria-label={`${label} hex`} />
  )
  const strips = hsva && (
    <>
      <div className="rounded-[var(--kol-radius-xs)] overflow-hidden" style={{ width: inline || modes ? '100%' : PANEL_W, height: inline || modes ? 160 : 140 }}>
        <SBSquare hue={hsva.hue} sat={hsva.sat} val={hsva.val} onChange={(sat, val) => commit({ ...hsva, sat, val })} />
      </div>
      <HueStrip hue={hsva.hue} onChange={(hue) => commit({ ...hsva, hue })} />
      {modes && mode !== 'hex' && CHANNELS[mode].map((ch) => <ChannelStrip key={ch.key} ch={ch} hex={hsvaToHex({ ...hsva, alpha: 1 })} hsva={hsva} onHsva={commit} />)}
      {!modes && brightness && (
        <Slider min={0} max={100} value={Math.round(hsva.val)} onChange={(v) => commit({ ...hsva, val: v })} formatValue={(v) => `${v}`} displayWidth={3} aria-label="Brightness" />
      )}
      {alpha && <AlphaStrip alpha={hsva.alpha} color={opaque} onChange={(a) => commit({ ...hsva, alpha: a })} />}
    </>
  )
  /* the head row: the picker's name and its mode */
  const head = modes && (
    <div className="flex items-center justify-between gap-2">
      <span className="truncate kol-helper-12 text-emphasis">{title ?? label}</span>
      <Dropdown size="sm" value={mode} onChange={setMode} options={PICKER_MODES} />
    </div>
  )

  if (inline) {
    /* ADOBE'S BASE COLOR PANEL (review 7, refs 68–72): the label row — the name, the mode as plain text at the right;
     * in HEX, ONE field: the swatch, the hex, the lock (Input's slotLeft · slotRight); the square, THEN the hue strip;
     * the mode's channels under them (RGB · HSB · Lab), and brightness — the ☀ ramp — in HEX and RGB */
    const hexField = (!modes || mode === 'hex') && (
      <Input size="md" prefix="#" maxLength={8} value={draft} onChange={onHex} aria-label={`${label} hex`} width="100%"
        slotLeft={<ColorSwatch hex={isNone ? null : color} size={SWATCH.xs} radius="full" hoverable={false} />}
        slotRight={hexEnd} />
    )
    return hsva && (
      <div className={`flex w-full flex-col gap-3 ${className}`.trim()}>
        <div className="flex items-center justify-between gap-3">
          <span className="kol-eyebrow text-fg-80">{title ?? label}</span>
          {modes && <Dropdown size="sm" value={mode} onChange={setMode} options={PICKER_MODES} ariaLabel={`${label} mode`} />}
        </div>
        {hexField}
        <div className="w-full overflow-hidden rounded-[var(--kol-radius-xs)]" style={{ height: 200 }}>
          <SBSquare hue={hsva.hue} sat={hsva.sat} val={hsva.val} onChange={(sat, val) => commit({ ...hsva, sat, val })} />
        </div>
        <HueStrip hue={hsva.hue} onChange={(hue) => commit({ ...hsva, hue })} />
        {modes && mode !== 'hex' && CHANNELS[mode].map((ch) => <ChannelStrip key={ch.key} ch={ch} hex={hsvaToHex({ ...hsva, alpha: 1 })} hsva={hsva} onHsva={commit} />)}
        {(!modes || mode === 'hex' || mode === 'rgb') && <ChannelStrip ch={BRIGHTNESS} hex={hsvaToHex({ ...hsva, alpha: 1 })} hsva={hsva} onHsva={commit} />}
        {alpha && <AlphaStrip alpha={hsva.alpha} color={opaque} onChange={(a) => commit({ ...hsva, alpha: a })} />}
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        ref={popover.refs.setReference}
        {...popover.getReferenceProps()}
        aria-label={`${label}: ${isNone ? 'none' : color}`}
        aria-expanded={open}
        className={`inline-flex shrink-0 rounded focus-visible:outline-1 focus-visible:outline-offset-2 ${className}`}
      >
        {trigger ?? (
          <ColorSwatch
            hex={isNone ? null : color}
            size={SWATCH[size] ?? SWATCH.xs}
            showTransparent={isNone}
            transparentTone="error"
            hoverable={false}
            className="border border-[var(--kol-border-default)]"
          />
        )}
      </button>
      {open && hsva && (
        <PopoverPanel
          popover={popover}
          panel={false}
          className="bg-surface-secondary border border-fg-08 rounded p-2 flex flex-col gap-2 shadow-lg"
          style={{ width: modes ? 296 : PANEL_W + 16 }}
        >
          {head}
          {strips}
          {(!modes || mode === 'hex') && hexField}
        </PopoverPanel>
      )}
    </>
  )
}
