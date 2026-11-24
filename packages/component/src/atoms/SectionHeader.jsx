/**
 * SectionHeader — A section's head: a leading slot, the label, a trailing slot and the rule beneath.
 *
 * The library master `SectionHeader` (Atoms page, 2169:1239; type-ramp plan 6.8), copied from kol-foundry's
 * `SpecimenSectionHeader` at size md: the label in the text-button shell at helper-16, the two ends apart, the rule an
 * fg-08 line 13 below the row. The component draws the rule itself (no nested `Divider`), which keeps it an atom.
 * `SectionFooter` is its partner with the rule above. Not kol-dashboards' `SectionHead` (the float card's section head).
 *
 * @param {React.ReactNode} [leading]   the start slot (an `IconFrame`); omitted, nothing is drawn
 * @param {string} label
 * @param {React.ReactNode} [trailing]  the end slot (page number, section name, controls)
 * @param {string} [className]
 */
export default function SectionHeader({ leading, label, trailing, className = '', ...rest }) {
  return (
    <div className={`flex w-full flex-row flex-wrap items-end justify-between gap-4 border-b border-fg-08 pb-[13px] ${className}`.trim()} {...rest}>
      <div className="flex items-center gap-3 md:gap-4">
        {leading}
        <span className="kol-btn kol-btn-md kol-helper-16">{label}</span>
      </div>
      {trailing != null && <div className="flex flex-wrap items-center gap-4">{trailing}</div>}
    </div>
  )
}
