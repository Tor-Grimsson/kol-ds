/**
 * Swatch — the better brand swatch, ported from apps/brand /styleguide (E2):
 * color chip + token name bottom-left (meta) + value bottom-right (strong,
 * uppercased hex), optional canonical-anchor dot (difference-blend).
 *
 * Adapted to the showcase's live-token data model — `token` + `resolved`
 * (read from the installed theme) instead of the brand app's literal hex,
 * so Foundations stays "always the truth". Promotion candidate once it has
 * consumers beyond the showcase.
 */
export default function Swatch({ token, label, resolved, anchor = false, style }) {
  /* Long values (color-mix strings) don't fit the meta row — the label
   * carries the meaning there. Hex values render uppercased, brand-style. */
  const value = resolved && resolved.length <= 9
    ? (resolved.startsWith('#') ? resolved.toUpperCase() : resolved)
    : ''
  return (
    <div className="kol-swatch">
      <div className="kol-swatch-chip relative border border-fg-08" style={{ background: `var(${token})`, ...style }}>
        {anchor && (
          <span aria-label="Canonical anchor" className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="block rounded-full" style={{ width: 10, height: 10, background: 'white', mixBlendMode: 'difference' }} />
          </span>
        )}
      </div>
      <div className="kol-swatch-meta kol-helper-10">
        {label && <span className="text-meta">{label}</span>}
        {value && <span className="text-strong font-semibold">{value}</span>}
      </div>
    </div>
  )
}
