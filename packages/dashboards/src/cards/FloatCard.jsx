/** FloatCard — the glass sheet that floats over a canvas: a title, a support line, a rule, then mono lines (float-everything
 * W7 row 95, 2026-11-04; the exploration's "01 / Chrome · Pills · rail · transport · #151619 / 54% …" — the float
 * style's own recipe card).
 *
 * Glass through `.kol-float-glass-dark` (kol-theme's approved glass: fill, blur, rim, shadow), a 20 sheet, 16 inset.
 * `title` in Inter panel, `support` in label, `lines` in mono ruler one under the other; `children` for anything
 * else under the rule. */
export default function FloatCard({ title, support, lines = [], children, className = '' }) {
  return (
    <section className={`kol-float-glass-dark rounded-[var(--kol-float-menu-r)] flex flex-col p-4 min-w-0 ${className}`.trim()}>
      <span className="kol-float-panel text-fg-96">{title}</span>
      {support && <span className="kol-float-label text-fg-72 mt-2">{support}</span>}
      {(lines.length > 0 || children) && <span className="block h-px w-full bg-fg-12 my-2.5" aria-hidden="true" />}
      {lines.map((l, i) => <span key={i} className={`kol-float-ruler text-fg-96 ${i ? 'mt-[9px]' : ''}`}>{l}</span>)}
      {children}
    </section>
  )
}
