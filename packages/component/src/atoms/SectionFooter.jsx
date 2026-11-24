/**
 * SectionFooter — A section's foot: the rule above, then a leading slot, the label and a trailing slot.
 *
 * The library master `SectionFooter` (Atoms page, 2169:1251; type-ramp plan 6.8): `SectionHeader`'s partner, the same
 * row with the fg-08 rule drawn on top, 13 above the row.
 *
 * @param {React.ReactNode} [leading]   the start slot (an `IconFrame`); omitted, nothing is drawn
 * @param {string} label
 * @param {React.ReactNode} [trailing]  the end slot
 * @param {string} [className]
 */
export default function SectionFooter({ leading, label, trailing, className = '', ...rest }) {
  return (
    <div className={`flex w-full flex-row flex-wrap items-end justify-between gap-4 border-t border-fg-08 pt-[13px] ${className}`.trim()} {...rest}>
      <div className="flex items-center gap-3 md:gap-4">
        {leading}
        <span className="kol-btn kol-btn-md kol-helper-16">{label}</span>
      </div>
      {trailing != null && <div className="flex flex-wrap items-center gap-4">{trailing}</div>}
    </div>
  )
}
