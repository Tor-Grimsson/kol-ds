import { FoldedHead } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — three folded groups in a stack.
export default function FoldedHeadPreview() {
  return (
    <div className="flex flex-col gap-2 w-[220px]">
      <FoldedHead title="Briefs" count={1} onClick={() => {}} />
      <FoldedHead title="Todos" count={4} onClick={() => {}} />
      <FoldedHead title="Other" onClick={() => {}} />
    </div>
  )
}
