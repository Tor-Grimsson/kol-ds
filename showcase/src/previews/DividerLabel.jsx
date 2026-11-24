import { DividerLabel } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* kolbox's group heading over the effect rows (plan-2026-11-18-kolbox-system W31.2) */
export default function DividerLabelPreview() {
  return (
    <div className="flex w-52 flex-col gap-3">
      <DividerLabel>Shader effects</DividerLabel>
      <DividerLabel>Vector effects</DividerLabel>
    </div>
  )
}
