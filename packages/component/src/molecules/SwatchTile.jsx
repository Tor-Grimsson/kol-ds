import ColorSwatch from './ColorSwatch.jsx'
import SwatchCaption from './SwatchCaption.jsx'
import { isLight } from '../hooks/cssVar.js'

/**
 * SwatchTile — A color swatch with its name and value under it. the ColorSwatch chip plus its caption, so a
 * swatch grid stops being drawn by hand at every call site (2026-11-07). Each `size` is the form an existing
 * caller drew, carried through class for class:
 *
 *   'tile' (default) — the documented specimen: a full-width bar `height` tall (96, the `.kol-swatch-chip`
 *                      depth) over a baseline row, name meta-left and value strong-right (BlockSwatch, the
 *                      Foundations token grids). `anchor` = a difference-blended dot centred on the bar.
 *   'grid'           — a square chip filling its grid column, name over value, both truncating (ColorRamp).
 *                      `anchor` = a black/white dot through isLight, and a ★ after the name.
 *   number           — a fixed chip of that many px, the caption left-aligned under it (the styleguide chips).
 *
 *   <SwatchTile hex="#131316" name="Ink" anchor />
 *
 * @param {string} hex - The paint — any CSS color, `var(--token)` included
 * @param {ReactNode} name - The label (the caption is SwatchCaption)
 * @param {ReactNode} meta - Optional third line, e.g. the token name
 * @param {ReactNode} value - The printed value (default: `hex` uppercased); null hides it
 * @param {'tile'|'grid'|number} size - The form (default 'tile')
 * @param {number|string} height - 'tile' only: the bar's depth (default 96)
 * @param {boolean} anchor - Mark the palette's canonical stop
 * @param {boolean} selected - Passed to ColorSwatch
 * @param {Function} onClick - Passed to ColorSwatch (makes the chip a button)
 * @param {string} title - Passed to ColorSwatch (its tooltip)
 * @param {string} chipClassName - Extra classes on the chip (e.g. a border on near-ground tokens)
 * @param {string} className - Extra classes on the wrapper
 */
export default function SwatchTile({
  hex,
  name,
  meta,
  value = hex?.toUpperCase(),
  size = 'tile',
  height = 96,
  anchor = false,
  selected,
  onClick,
  title,
  chipClassName = '',
  className = '',
}) {
  const chip = { hex, selected, onClick, title, radius: 'sm', className: chipClassName }

  if (size === 'grid') return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`.trim()}>
      <div className="relative">
        <ColorSwatch {...chip} size="fill" />
        {anchor && value && (
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: isLight(value) ? '#000' : '#fff' }} />
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col items-start gap-0.5 leading-tight">
        <SwatchCaption name={<>{name}{anchor && ' ★'}</>} value={value} meta={meta} tone="strong" />
      </div>
    </div>
  )

  if (typeof size === 'number') return (
    <div className={`flex flex-col items-start gap-1.5 ${className}`.trim()}>
      <ColorSwatch {...chip} size={size} />
      <SwatchCaption name={name} value={value} meta={meta} />
    </div>
  )

  return (
    /* gap 6 — .kol-swatch */
    <div className={`flex flex-col ${className}`.trim()} style={{ gap: 6 }}>
      {/* .kol-swatch-chip: full column width, `height` tall, radius 4 — ColorSwatch 'stretch' fills the box */}
      <div className="relative w-full" style={{ height }}>
        <ColorSwatch {...chip} size="stretch" />
        {anchor && (
          <span
            aria-label="Canonical anchor"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* difference blend so the dot reads on any stop, light or dark */}
            <span
              className="block rounded-full"
              style={{ width: 10, height: 10, background: 'white', mixBlendMode: 'difference' }}
            />
          </span>
        )}
      </div>
      <SwatchCaption name={name} value={value} meta={meta} layout="inline" />
    </div>
  )
}
