/**
 * SwatchCaption — The name, value and meta lines under a swatch. the text block of the SWATCH family
 * (SwatchTile renders it for every size, 2026-11-08), as ContentText / SectionText are for theirs: slots
 * opt-in, type by ROLE, every default class a SEAM. It renders siblings (a fragment), so the parent owns the
 * gap and the alignment — SwatchTile wraps it where a form needs a box.
 *
 *   layout 'inline'  — name and value share one baseline row, space-between, wrapping; meta under it (the tile)
 *   layout 'stacked' — name, value, meta one under the other
 *   tone   'muted'   — name quiet (text-meta), value strong semibold (the tile, the fixed chip)
 *   tone   'strong'  — name emphasised, value quiet, both truncating and always drawn so a grid cell keeps its
 *                      lines (the grid cell)
 *
 * @param {ReactNode} name - The label
 * @param {ReactNode} value - The printed value
 * @param {ReactNode} meta - Optional third line, e.g. the token name
 * @param {'inline'|'stacked'} layout - default 'stacked'
 * @param {'muted'|'strong'} tone - default 'muted'
 * @param {string} rowClass - Replaces the inline row's classes whole (inline only)
 * @param {string} nameClass - Replaces the name's classes whole
 * @param {string} valueClass - Replaces the value's classes whole
 * @param {string} metaClass - Replaces the meta line's classes whole
 */
export default function SwatchCaption({
  name,
  value,
  meta,
  layout = 'stacked',
  tone = 'muted',
  rowClass,
  nameClass,
  valueClass,
  metaClass = 'kol-helper-10 text-meta',
}) {
  const strong = tone === 'strong'
  const inline = layout === 'inline'
  const nc = nameClass ?? (inline ? 'text-meta' : strong ? 'kol-helper-10 text-emphasis max-w-full truncate' : 'kol-helper-10 text-meta')
  const vc = valueClass ?? (inline ? 'text-strong font-semibold' : strong ? 'kol-helper-10 text-meta max-w-full truncate' : 'kol-helper-10 text-strong font-semibold')
  const metaLine = meta && <span className={metaClass}>{meta}</span>

  if (inline) return (
    <>
      {/* .kol-swatch-meta: row, space-between, baseline, wrapping */}
      <div
        className={rowClass ?? 'kol-helper-10 flex flex-row flex-wrap items-baseline justify-between'}
        style={{ gap: '4px 12px' }}
      >
        {name && <span className={nc}>{name}</span>}
        {value && <span className={vc}>{value}</span>}
      </div>
      {metaLine}
    </>
  )

  return (
    <>
      {strong || name ? <span className={nc}>{name}</span> : null}
      {strong || value ? <span className={vc}>{value}</span> : null}
      {metaLine}
    </>
  )
}
