import { AlignmentGrid } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* onAlign is the seam a consumer wires to "align these" — a no-op here. */
export default function AlignmentGridDemo() {
  return (
    <div className="rounded border border-fg-16 bg-surface-primary p-3">
      <AlignmentGrid onAlign={() => {}} />
    </div>
  )
}
