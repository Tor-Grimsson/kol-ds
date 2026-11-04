import ColorSwatch from './ColorSwatch.jsx'

/**
 * ColorField — A color as a row: swatch, name, hex. `■ Background #0B0B0B` (float-everything W3 row 44, 2026-11-04 —
 * the exploration's inline color field; KOL had only the picker popover). A 24 `ColorSwatch`, the name in Inter 13
 * taking the room, the hex in mono 11 at fg-64 at the end. With `onClick` the row is a button — the caller opens its
 * `ColorPickerPopover` from it; without one it reads. The hex is uppercased for the readout only; `value` is passed
 * through untouched.
 *
 * @param {string}   label      the color's name (`Background`)
 * @param {string}   value      the color, a hex string
 * @param {Function} [onClick]  makes the row a button (`(event) => void`)
 * @param {boolean}  [swatchFrame]  the swatch's hairline (default true — a near-ground swatch needs its edge)
 * @param {string}   [className]
 */
export default function ColorField({ label, value, onClick, swatchFrame = true, className = '', ...rest }) {
  const El = onClick ? 'button' : 'div'
  return (
    <El
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex w-full items-center gap-3 text-left ${onClick ? 'cursor-pointer rounded-full outline-none focus-visible:[box-shadow:var(--kol-float-focus)]' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      {...rest}
    >
      <ColorSwatch hex={value} size={24} radius="sm" frame={swatchFrame} />
      <span className="flex-1 min-w-0 truncate font-[family-name:var(--kol-font-family-float)] text-[13px] leading-none text-fg-emphasis">{label}</span>
      <span className="shrink-0 font-mono text-[11px] leading-none uppercase text-fg-64">{value}</span>
    </El>
  )
}
