/**
 * SizeChip — A task's size as one letter. `S · M · B` (float-everything W2 row 32, 2026-11-04 — the exploration's
 * task size). A 32 × 28 tile on the float well at the list radius, the letter in mono 11 at fg-64; `active` lifts it
 * on fg-16 at the emphasis ink; with `onClick` it is a button, so a row of three is a pick.
 *
 * @param {string} children      the letter (`S`)
 * @param {boolean} [active]
 * @param {Function} [onClick]   makes it a <button>
 * @param {string} [className]
 */
export default function SizeChip({ children, active = false, onClick, className = '', ...rest }) {
  const El = onClick ? 'button' : 'span'
  return (
    <El
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={`inline-flex h-7 w-8 shrink-0 items-center justify-center rounded-[var(--kol-float-list-r)] font-mono text-[11px] leading-none transition-colors ${active ? 'bg-fg-16 text-fg-emphasis' : 'bg-[var(--kol-float-well)] text-fg-64'} ${onClick ? 'cursor-pointer hover:text-fg-emphasis outline-none focus-visible:[box-shadow:var(--kol-float-focus)]' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      {...rest}
    >
      {children}
    </El>
  )
}
