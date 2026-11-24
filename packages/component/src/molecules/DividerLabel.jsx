/**
 * DividerLabel — A label, then a rule to the row's end. a group's name over a list, ruled off: the label in 11 / 15 at
 * oq-64, 8 apart a 1px oq-24 rule that takes the rest of the row (kolbox's GroupLabel over the effect rows,
 * plan-2026-11-18-kolbox-system W31.2, 2026-11-18, carried class for class). A label and a Divider, so a molecule;
 * `Divider` itself takes no label. The family and weight are the row's. Chrome in kol-theme `.kol-divider-label`.
 *
 *   <DividerLabel>Vector effects</DividerLabel>
 *
 * @param {ReactNode} children - The label
 * @param {string} [className] - Extra classes on the row
 */
export default function DividerLabel({ children, className = '' }) {
  return (
    <div className={`kol-divider-label flex items-center gap-2 ${className}`.trim()}>
      <span className="kol-divider-label-text">{children}</span>
      <span className="kol-divider-label-rule h-px flex-1" />
    </div>
  )
}
