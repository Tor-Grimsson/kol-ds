/**
 * ThemeTile — A reading theme as a tile. `Aa Night · Paper · Sepia` (float-everything W2 row 34, 2026-11-04 — the
 * exploration's reading-theme pick). An 88 × 64 tile painted in the theme's own ground and ink, the sample (`Aa`) at 22
 * in the reading face and the name under it in Inter 10; `selected` draws the float focus ring (the float's selection
 * on a tile whose fill is the theme itself); with `onClick` it is a button, so a row of them is a pick.
 *
 * @param {string}   label       the theme's name (`Night`)
 * @param {string}   [sample]    the type sample (default `Aa`)
 * @param {string}   bg          the theme's ground, any CSS color
 * @param {string}   ink         the theme's ink
 * @param {string}   [font]      the sample's family (default the serif reading face: Literata, Georgia)
 * @param {boolean}  [selected]
 * @param {Function} [onClick]
 * @param {string}   [className]
 */
export default function ThemeTile({ label, sample = 'Aa', bg, ink, font = "'Literata', Georgia, serif", selected = false, onClick, className = '', ...rest }) {
  const El = onClick ? 'button' : 'span'
  return (
    <El
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      className={`inline-flex h-16 w-22 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl transition-shadow ${onClick ? 'cursor-pointer outline-none focus-visible:[box-shadow:var(--kol-float-focus)]' : ''} ${selected ? '[box-shadow:var(--kol-float-focus)]' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      style={{ background: bg, color: ink }}
      {...rest}
    >
      <span className="text-[22px] leading-none" style={{ fontFamily: font }}>{sample}</span>
      <span className="font-[family-name:var(--kol-font-family-float)] text-[10px] leading-none">{label}</span>
    </El>
  )
}
