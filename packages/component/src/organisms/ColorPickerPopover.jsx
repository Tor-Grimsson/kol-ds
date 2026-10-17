import { useState } from 'react'
import ColorSwatch from '../molecules/ColorSwatch.jsx'
import Input from '../atoms/Input'
import { usePopover, PopoverPanel } from '../utilities/Popover.jsx'
import { HueStrip, SBSquare, AlphaStrip } from './SpectrumControls.jsx'
import { hexToHsva, hsvaToHex } from '../hooks/colorMath.js'
import { resolveCssColor } from '../hooks/cssVar.js'

/* taxonomy-ok: organism — composes the SpectrumControls family (an organism) with a swatch and the hex Input */

const SWATCH = { xs: 16, sm: 24 }
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
 */
export default function ColorPickerPopover({ color, onChange, defaultValue, size = 'xs', label = 'Color', className = '' }) {
  const isNone = !color || color === 'transparent'
  const [open, setOpen] = useState(false)
  const [hsva, setHsva] = useState(null)
  const [draft, setDraft] = useState('')

  const popover = usePopover({
    open,
    placement: 'bottom-end',
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
        <ColorSwatch
          hex={isNone ? null : color}
          size={SWATCH[size] ?? SWATCH.xs}
          showTransparent={isNone}
          transparentTone="error"
          hoverable={false}
          className="border border-[var(--kol-border-default)]"
        />
      </button>
      {open && hsva && (
        <PopoverPanel
          popover={popover}
          panel={false}
          className="bg-surface-secondary border border-fg-08 rounded p-2 flex flex-col gap-2 shadow-lg"
          style={{ width: PANEL_W + 16 }}
        >
          <div className="rounded-[var(--kol-radius-xs)] overflow-hidden" style={{ width: PANEL_W, height: 140 }}>
            <SBSquare hue={hsva.hue} sat={hsva.sat} val={hsva.val} onChange={(sat, val) => commit({ ...hsva, sat, val })} />
          </div>
          <HueStrip hue={hsva.hue} onChange={(hue) => commit({ ...hsva, hue })} />
          <AlphaStrip alpha={hsva.alpha} color={opaque} onChange={(alpha) => commit({ ...hsva, alpha })} />
          <Input
            variant="filled"
            size="sm"
            prefix="#"
            maxLength={8}
            value={draft}
            onChange={onHex}
            aria-label={`${label} hex`}
          />
        </PopoverPanel>
      )}
    </>
  )
}
