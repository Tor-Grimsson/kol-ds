/**
 * Chip — A tile with a leading slot, a title and a meta line.
 *
 * The library master `Chip` (Molecules page, 2167:11003; type-ramp plan 6.3): a 192 × 64 tile on surface-tertiary,
 * the leading slot a 48 square on oq-04 (an `IconFrame` or "Aa" in the Specimen font chips), then the title in sans 14
 * at full ink and the meta in sans 12 at fg-64. A molecule because its slot holds an `IconFrame`, as `CloseButton` does.
 * Not the `chip` icon, not `Tag` (interactive), `Pill` (a static word) or `SizeChip` (one letter).
 *
 * @param {React.ReactNode} [leading]  the slot's content; omitted, nothing is drawn in the slot
 * @param {string} title
 * @param {string} [meta]
 * @param {string} [className]
 */
export default function Chip({ leading, title, meta, className = '', ...rest }) {
  return (
    <div className={`flex h-16 w-48 items-center gap-3 rounded-lg bg-surface-tertiary p-2 ${className}`.trim()} {...rest}>
      {leading != null && (
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-oq-04">{leading}</div>
      )}
      <div className="flex min-w-0 flex-col items-start gap-1 overflow-hidden whitespace-nowrap font-[family-name:var(--kol-font-family-sans)] font-normal leading-[14px]">
        <p className="text-[14px] text-auto">{title}</p>
        {meta != null && <p className="text-[12px] text-fg-64">{meta}</p>}
      </div>
    </div>
  )
}
