/**
 * TocRow — One entry of a numbered contents list: `01 · First interlude` (float-everything W8 row 121, 2026-11-04 —
 * kol-float--style 48:3582). 32 tall on the list radius, 12 in: the number in mono (`kol-float-ruler`, fg-64, two
 * digits), 16 off it the title in `kol-float-hint`. `current` is where the reader is: the row lifts to fg-16 and the
 * title takes the emphasis ink (`aria-current="location"`); the rest sit at fg-64 and brighten under the pointer.
 * `DocsToc variant="float"` draws its list from these.
 *
 * @param {number|string} [number]  padded to two digits when a number
 * @param {ReactNode}     label
 * @param {boolean}       [current]
 * @param {string}        [href]
 * @param {Function}      [onClick]
 * @param {string}        [className]
 */
export default function TocRow({ number, label, current = false, href, onClick, className = '' }) {
  const Tag = href ? 'a' : 'button'
  const n = typeof number === 'number' ? String(number).padStart(2, '0') : number
  return (
    <Tag
      {...(href ? { href } : { type: 'button' })}
      onClick={onClick}
      aria-current={current ? 'location' : undefined}
      className={`group flex h-8 w-full items-center gap-4 rounded-[var(--kol-float-list-r)] px-3 text-left no-underline cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] ${current ? 'bg-fg-16' : 'hover:bg-fg-08'} ${className}`.trim()}
    >
      {n != null && <span className="kol-float-ruler w-4 shrink-0 tabular-nums text-fg-64">{n}</span>}
      <span className={`kol-float-hint min-w-0 flex-1 truncate ${current ? 'text-fg-emphasis' : 'text-fg-64 group-hover:text-fg-emphasis'}`}>{label}</span>
    </Tag>
  )
}
